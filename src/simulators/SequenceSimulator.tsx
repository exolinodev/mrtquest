import { useEffect, useMemo, useState } from 'react';
import { MRImage } from '../components/MRImage';
import { RichText, TeX } from '../components/RichText';
import { Panel, Segmented, Slider, Stat } from '../components/ui';
import { useGame } from '../game/GameContext';
import { TISSUES, type FieldStrength, type TissueId } from '../physics/constants';
import { ernstAngleDeg, fmt, fmtDuration, nullPointTI } from '../physics/mri';
import type { PhantomId } from '../physics/phantom';
import { ANATOMY, computeMetrics, DEFAULT_PROTOCOL, SEQUENCE_LABELS, synthesizeImage, type Protocol, type SequenceType } from '../physics/protocol';
import { PulseDiagram } from './PulseDiagram';

const PRESETS: Record<SequenceType, Partial<Protocol>> = {
  SE: { tr: 550, te: 12, etl: 1 },
  TSE: { tr: 4000, te: 100, etl: 16 },
  IR: { tr: 9000, te: 100, ti: 2200, etl: 16 },
  GRE: { tr: 200, te: 4.6, flip: 70, etl: 1 },
  EPI: { tr: 3000, te: 90, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 1500, acceleration: 2, fatSat: true },
};

const SEQ_INFO: Record<SequenceType, { tex: string; text: string }> = {
  SE: { tex: 'S \\propto \\rho(1-e^{-TR/T_1})\\,e^{-TE/T_2}', text: '90°–180°: refokussiert statische Inhomogenitäten. Robust, Goldstandard für T1w – aber eine k-Raum-Zeile pro TR.' },
  TSE: { tex: 'TA = \\frac{TR\\cdot N_y\\cdot NEX}{ETL}', text: 'Echozug aus ETL Refokussierungspulsen, jedes Echo anders phasenkodiert. Das ins k-Raum-Zentrum sortierte Echo bestimmt $TE_{\\text{eff}}$. Fett erscheint hell.' },
  IR: { tex: 'S \\propto \\rho\\,|1-2e^{-TI/T_1}+e^{-TR/T_1}|\\,e^{-TE/T_2}', text: 'Inversion vor der Anregung. Gewebe im Nulldurchgang ($M_z = 0$) verschwinden: STIR (Fett) oder FLAIR (Liquor).' },
  GRE: { tex: 'S \\propto \\rho\\sin\\alpha\\frac{1-E_1}{1-\\cos\\alpha E_1}e^{-TE/T_2^*}', text: 'Gradientenumkehr statt 180°-Puls: T2*-Empfindlichkeit, sehr kurze TR mit kleinem Flipwinkel → schnell, wenig SAR.' },
  EPI: { tex: 'BW_{\\text{PE}} = \\frac{1}{ESP\\cdot N_y/R}', text: 'Kompletter k-Raum nach einer Anregung. Basis für DWI/fMRT. Geringe Phasenbandbreite → Verzerrung und Fettverschiebung in Phasenrichtung.' },
};

export function SequenceSimulator() {
  const { dispatch } = useGame();
  const [protocol, setProtocol] = useState<Protocol>({ ...DEFAULT_PROTOCOL, ...PRESETS.TSE });
  const [phantom, setPhantom] = useState<PhantomId>('brain');
  const anatomy = ANATOMY[phantom];
  const set = <K extends keyof Protocol>(key: K, value: Protocol[K]) => setProtocol((p) => ({ ...p, [key]: value }));

  const metrics = useMemo(() => computeMetrics(protocol, anatomy), [protocol, anatomy]);
  const image = useMemo(() => synthesizeImage(protocol, anatomy, metrics, { artifacts: protocol.sequence === 'EPI', seed: 3 }), [protocol, anatomy, metrics]);

  const csfNull = nullPointTI(TISSUES.csf.params[protocol.field].t1, protocol.tr);
  const fatNull = nullPointTI(TISSUES.fat.params[protocol.field].t1, protocol.tr);
  const ernst = ernstAngleDeg(protocol.tr, TISSUES.wm.params[protocol.field].t1);

  useEffect(() => {
    if (protocol.sequence === 'IR' && Math.abs(protocol.ti - csfNull) <= 0.05 * csfNull) dispatch({ type: 'FLAG', flag: 'flair-null', xp: 20 });
    if (protocol.sequence === 'IR' && Math.abs(protocol.ti - fatNull) <= 0.05 * fatNull) dispatch({ type: 'FLAG', flag: 'stir-null', xp: 20 });
    if (protocol.sequence === 'GRE' && Math.abs(protocol.flip - ernst) <= 2) dispatch({ type: 'FLAG', flag: 'ernst-angle', xp: 15 });
  }, [protocol, csfNull, fatNull, ernst, dispatch]);

  const chooseSequence = (seq: SequenceType) => setProtocol((p) => ({ ...DEFAULT_PROTOCOL, field: p.field, sequence: seq, ...PRESETS[seq] }));

  const shownTissues: TissueId[] = phantom === 'brain' ? ['wm', 'gm', 'csf', 'fat', 'lesion'] : phantom === 'knee' ? ['muscle', 'fat', 'lesion', 'csf', 'blood'] : ['liver', 'lesion', 'fat', 'muscle', 'blood'];
  const maxS = Math.max(...shownTissues.map((t) => metrics.signals[t]), 1e-6);
  const s = protocol.sequence;
  const hasEtl = s === 'TSE' || s === 'IR';

  return (
    <div className="sim-grid">
      <Panel title="Sequenz wählen" className="span-3">
        <div className="row wrap gap">
          <Segmented<SequenceType> value={s} options={(Object.keys(SEQUENCE_LABELS) as SequenceType[]).map((k) => ({ value: k, label: SEQUENCE_LABELS[k] }))} onChange={chooseSequence} />
        </div>
        <div className="row wrap gap">
          <Segmented<FieldStrength>
            label="Feld"
            value={protocol.field}
            options={[
              { value: 1.5, label: '1,5 T' },
              { value: 3, label: '3 T' },
            ]}
            onChange={(v) => set('field', v)}
          />
          <Segmented<PhantomId>
            label="Anatomie"
            value={phantom}
            options={[
              { value: 'brain', label: 'Kopf' },
              { value: 'knee', label: 'Knie' },
              { value: 'abdomen', label: 'Abdomen' },
            ]}
            onChange={setPhantom}
          />
        </div>
        <p className="small">
          <RichText text={SEQ_INFO[s].text} />
        </p>
        <TeX block tex={SEQ_INFO[s].tex} />
      </Panel>

      <Panel title="Pulssequenzdiagramm (schematisch)" className="span-2">
        <PulseDiagram sequence={s} te={protocol.te} ti={protocol.ti} etl={protocol.etl} flip={protocol.flip} />
      </Panel>

      <Panel title="Parameter">
        <Slider label="TR" value={protocol.tr} min={s === 'GRE' ? 5 : 200} max={s === 'GRE' ? 1000 : 12000} step={s === 'GRE' ? 5 : 50} unit="ms" onChange={(v) => set('tr', v)} />
        <Slider label={hasEtl ? 'TE (effektiv)' : 'TE'} value={protocol.te} min={s === 'GRE' ? 2 : 8} max={s === 'GRE' ? 40 : 200} step={s === 'GRE' ? 0.1 : 1} unit="ms" onChange={(v) => set('te', v)} format={(v) => fmt(v, 1)} />
        {s === 'IR' && <Slider label="Inversionszeit TI" value={protocol.ti} min={50} max={3500} step={5} unit="ms" onChange={(v) => set('ti', v)} hint={`Nullpunkte: Fett ≈ ${fmt(fatNull, 0)} ms · Liquor ≈ ${fmt(csfNull, 0)} ms`} />}
        {s === 'GRE' && <Slider label="Flipwinkel α" value={protocol.flip} min={2} max={90} step={1} unit="°" onChange={(v) => set('flip', v)} hint={`Ernst-Winkel (WM): ${fmt(ernst, 1)}°`} />}
        {hasEtl && <Slider label="Echozuglänge ETL" value={protocol.etl} min={2} max={32} step={1} onChange={(v) => set('etl', v)} />}
        <p className="weighting-tag">{metrics.weighting}</p>
      </Panel>

      <Panel title="Synthetisches Bild">
        <MRImage data={image} label={`Synthetisches ${metrics.weighting} Bild`} overlay={`${SEQUENCE_LABELS[s]} · ${fmt(protocol.field)} T`} />
      </Panel>

      <Panel title="Gewebesignale">
        <div className="bars">
          {shownTissues.map((t) => (
            <div key={t} className="bar-row">
              <span className="bar-label">{TISSUES[t].label}</span>
              <span className="bar-track">
                <span className="bar-fill" style={{ width: `${(metrics.signals[t] / maxS) * 100}%`, background: TISSUES[t].color }} />
              </span>
              <span className="bar-value">{fmt(metrics.signals[t], 3)}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Timing & Belastung">
        <div className="stat-grid two">
          <Stat label="Messzeit" value={fmtDuration(metrics.scanTimeS)} />
          <Stat label="SAR" value={fmt(metrics.sar, 2)} unit="W/kg" tone={metrics.sar > 4 ? 'bad' : metrics.sar > 2 ? 'warn' : 'good'} />
          <Stat label="min. TE" value={fmt(metrics.timing.minTE, 1)} unit="ms" />
          <Stat label="Schichten/TR" value={metrics.timing.maxSlicesPerTR} />
        </div>
        <ul className="issues">
          {metrics.issues
            .filter((i) => i.severity !== 'info')
            .map((i, idx) => (
              <li key={idx} className={`issue-${i.severity}`}>
                {i.text}
              </li>
            ))}
        </ul>
      </Panel>
    </div>
  );
}
