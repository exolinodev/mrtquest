import { useMemo, useState } from 'react';
import { MRImage } from '../components/MRImage';
import { Panel, Segmented, Slider, Stars, Stat, Toggle } from '../components/ui';
import { evaluateScenario, type ParamKey, type Scenario } from '../content/scenarios';
import { useGame } from '../game/GameContext';
import type { FieldStrength } from '../physics/constants';
import { fmt, fmtDuration } from '../physics/mri';
import type { PhantomId } from '../physics/phantom';
import { ANATOMY, computeMetrics, DEFAULT_PROTOCOL, SEQUENCE_LABELS, synthesizeImage, type Protocol, type SequenceType } from '../physics/protocol';

type NumericKey = Exclude<ParamKey, 'sequence' | 'field' | 'fatSat'>;

interface ParamSpec {
  label: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
  appliesTo?: SequenceType[];
}

function specFor(key: NumericKey, seq: SequenceType): ParamSpec {
  switch (key) {
    case 'tr':
      return seq === 'GRE' ? { label: 'TR', min: 5, max: 1000, step: 5, unit: 'ms' } : { label: 'TR', min: 200, max: 12000, step: 50, unit: 'ms' };
    case 'te':
      return seq === 'GRE' ? { label: 'TE', min: 1, max: 40, step: 0.1, unit: 'ms' } : { label: seq === 'TSE' || seq === 'IR' ? 'TE (effektiv)' : 'TE', min: 5, max: 250, step: 1, unit: 'ms' };
    case 'ti':
      return { label: 'Inversionszeit TI', min: 50, max: 3500, step: 5, unit: 'ms', appliesTo: ['IR'] };
    case 'flip':
      return { label: 'Flipwinkel α', min: 5, max: 90, step: 1, unit: '°', appliesTo: ['GRE'] };
    case 'refocusFlip':
      return { label: 'Refokussierungswinkel', min: 90, max: 180, step: 5, unit: '°', appliesTo: ['SE', 'TSE', 'IR', 'EPI'] };
    case 'etl':
      return { label: 'Echozuglänge ETL', min: 2, max: 64, step: 1, appliesTo: ['TSE', 'IR'] };
    case 'fovRead':
      return { label: 'FOV Auslese', min: 100, max: 450, step: 10, unit: 'mm' };
    case 'fovPhase':
      return { label: 'FOV Phase', min: 100, max: 450, step: 10, unit: 'mm' };
    case 'matrixRead':
      return { label: 'Matrix Auslese', min: 64, max: 512, step: 32 };
    case 'matrixPhase':
      return { label: 'Matrix Phase', min: 64, max: 512, step: 16 };
    case 'sliceThickness':
      return { label: 'Schichtdicke', min: 1, max: 10, step: 0.5, unit: 'mm' };
    case 'slices':
      return { label: 'Schichtanzahl', min: 1, max: 60, step: 1 };
    case 'nex':
      return { label: 'Mittelungen NEX', min: 1, max: 8, step: 1 };
    case 'bandwidthPerPixel':
      return { label: 'Bandbreite', min: 50, max: 2500, step: 10, unit: 'Hz/px' };
    case 'acceleration':
      return { label: 'Parallele Bildgebung R', min: 1, max: 4, step: 1 };
    case 'phaseOversampling':
      return { label: 'Phasen-Oversampling', min: 0, max: 100, step: 10, unit: '%' };
  }
}

const ALL_KEYS: ParamKey[] = ['sequence', 'field', 'tr', 'te', 'ti', 'flip', 'refocusFlip', 'etl', 'fovRead', 'fovPhase', 'matrixRead', 'matrixPhase', 'sliceThickness', 'slices', 'nex', 'bandwidthPerPixel', 'acceleration', 'phaseOversampling', 'fatSat'];

/** Vernünftige Startwerte beim Sequenzwechsel innerhalb der Konsole. */
const SEQ_DEFAULTS: Record<SequenceType, Partial<Protocol>> = {
  SE: { tr: 550, te: 15, etl: 1 },
  TSE: { tr: 4000, te: 100, etl: 16 },
  IR: { tr: 9000, te: 100, ti: 2200, etl: 16 },
  GRE: { tr: 200, te: 4.6, flip: 70, etl: 1 },
  EPI: { tr: 3000, te: 90, matrixRead: 128, matrixPhase: 128, bandwidthPerPixel: 1500 },
};

interface Props {
  scenario?: Scenario;
}

export function ProtocolConsole({ scenario }: Props) {
  const { state, dispatch } = useGame();
  const [protocol, setProtocol] = useState<Protocol>(scenario?.start ?? DEFAULT_PROTOCOL);
  const [freeAnatomy, setFreeAnatomy] = useState<PhantomId>('brain');
  const [result, setResult] = useState<{ stars: number; xp: number } | null>(null);
  const anatomy = ANATOMY[scenario?.anatomy ?? freeAnatomy];
  const editable = scenario?.editable ?? ALL_KEYS;
  const allowedSeq = scenario?.allowedSequences ?? (Object.keys(SEQUENCE_LABELS) as SequenceType[]);

  const metrics = useMemo(() => computeMetrics(protocol, anatomy), [protocol, anatomy]);
  const image = useMemo(() => synthesizeImage(protocol, anatomy, metrics, { seed: 11 }), [protocol, anatomy, metrics]);
  const evaluation = scenario ? evaluateScenario(scenario, protocol, metrics) : null;

  const set = <K extends keyof Protocol>(key: K, value: Protocol[K]) => {
    setResult(null);
    setProtocol((p) => ({ ...p, [key]: value }));
  };

  const numericKeys = editable.filter((k): k is NumericKey => k !== 'sequence' && k !== 'field' && k !== 'fatSat');

  const submit = () => {
    if (!scenario || !evaluation) return;
    const prevStars = state.scenarios[scenario.id]?.stars ?? 0;
    const stars = evaluation.stars;
    const xp = stars > prevStars ? Math.round((scenario.xp * (stars - prevStars)) / 3) : 0;
    dispatch({ type: 'SCENARIO_RESULT', scenarioId: scenario.id, stars, xp });
    if (stars > 0 && protocol.field === 3 && metrics.sar <= 2) dispatch({ type: 'FLAG', flag: 'sar-safe-3t' });
    setResult({ stars, xp });
  };

  const tone = (ok: boolean) => (ok ? 'good' : 'bad');

  return (
    <div className="console">
      <Panel title="Protokoll" className="console-controls">
        {editable.includes('sequence') && (
          <Segmented<SequenceType>
            label="Sequenz"
            value={protocol.sequence}
            options={allowedSeq.map((s) => ({ value: s, label: s }))}
            onChange={(seq) => {
              setResult(null);
              setProtocol((p) => ({ ...p, sequence: seq, ...SEQ_DEFAULTS[seq] }));
            }}
          />
        )}
        {!editable.includes('sequence') && <p className="small">Sequenz: <strong>{SEQUENCE_LABELS[protocol.sequence]}</strong></p>}
        {editable.includes('field') ? (
          <Segmented<FieldStrength>
            label="Feldstärke"
            value={protocol.field}
            options={[
              { value: 1.5, label: '1,5 T' },
              { value: 3, label: '3 T' },
            ]}
            onChange={(v) => set('field', v)}
          />
        ) : (
          <p className="small">Feldstärke: <strong>{fmt(protocol.field)} T</strong></p>
        )}
        {!scenario && (
          <Segmented<PhantomId>
            label="Anatomie"
            value={freeAnatomy}
            options={[
              { value: 'brain', label: 'Kopf' },
              { value: 'knee', label: 'Knie' },
              { value: 'abdomen', label: 'Abdomen' },
            ]}
            onChange={setFreeAnatomy}
          />
        )}
        {numericKeys.map((key) => {
          const spec = specFor(key, protocol.sequence);
          if (spec.appliesTo && !spec.appliesTo.includes(protocol.sequence)) return null;
          return <Slider key={key} label={spec.label} value={protocol[key]} min={spec.min} max={spec.max} step={spec.step} unit={spec.unit} onChange={(v) => set(key, v)} format={(v) => fmt(v, 1)} />;
        })}
        {editable.includes('fatSat') && <Toggle label="Spektrale Fettsättigung" checked={protocol.fatSat} onChange={(v) => set('fatSat', v)} />}
        {scenario && (
          <button className="btn ghost small" type="button" onClick={() => { setProtocol(scenario.start); setResult(null); }}>
            Protokoll zurücksetzen
          </button>
        )}
      </Panel>

      <div className="console-center">
        <Panel title="Vorschau">
          <MRImage data={image} label="Simulierte Aufnahme" overlay={metrics.weighting} />
        </Panel>
        <Panel title="Kennzahlen">
          <div className="stat-grid">
            <Stat label="Messzeit" value={fmtDuration(metrics.scanTimeS)} sub={metrics.timing.concatenations > 1 ? `${metrics.timing.concatenations} Konkatenationen` : undefined} />
            <Stat label="SNR (rel.)" value={fmt(metrics.snr, 1)} tone={metrics.snr >= 15 ? 'good' : metrics.snr >= 8 ? 'warn' : 'bad'} />
            <Stat label="SAR" value={fmt(metrics.sar, 2)} unit="W/kg" tone={metrics.sar <= 2 ? 'good' : metrics.sar <= 4 ? 'warn' : 'bad'} sub={metrics.sarMode === 'normal' ? 'Normal Mode' : metrics.sarMode === 'first-level' ? 'First Level' : 'unzulässig'} />
            <Stat label="Voxel" value={`${fmt(metrics.pixelRead, 2)}×${fmt(metrics.pixelPhase, 2)}×${fmt(protocol.sliceThickness, 1)}`} unit="mm" />
            <Stat label="Chem. Verschiebung" value={fmt(metrics.chemicalShiftPx, 2)} unit="px" tone={metrics.chemicalShiftPx <= 1.5 ? 'good' : metrics.chemicalShiftPx <= 3 ? 'warn' : 'bad'} />
            {protocol.sequence === 'EPI' && <Stat label="EPI-Verzerrung" value={fmt(metrics.epiDistortionPx, 1)} unit="px" tone={metrics.epiDistortionPx <= 3 ? 'good' : 'bad'} />}
            <Stat label="min. TE / TR" value={`${fmt(metrics.timing.minTE, 1)} / ${fmt(metrics.timing.minTR, 0)}`} unit="ms" />
            <Stat label="Schichten pro TR" value={metrics.timing.maxSlicesPerTR} />
          </div>
          {metrics.issues.length > 0 && (
            <ul className="issues">
              {metrics.issues.map((i, idx) => (
                <li key={idx} className={`issue-${i.severity}`}>
                  {i.text}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      {scenario && evaluation && (
        <Panel title="Anforderungen" className="console-reqs">
          <ul className="req-list">
            {evaluation.results.map(({ req, ok }) => (
              <li key={req.id} className={ok ? 'ok' : 'nok'}>
                <span className="req-icon" aria-hidden="true">
                  {ok ? '✔' : req.hard ? '✘' : '☆'}
                </span>
                <span>
                  {req.label}
                  {!req.hard && <em className="soft-tag"> Bonus</em>}
                  {req.value && <span className={`req-value tone-${tone(ok)}`}> · {req.value(protocol, metrics)}</span>}
                </span>
              </li>
            ))}
          </ul>
          <div className="req-summary">
            {evaluation.passed ? (
              <>
                <span>Aktuelle Bewertung:</span> <Stars count={evaluation.stars} />
              </>
            ) : (
              <span className="bad-text">Pflichtkriterien noch nicht erfüllt.</span>
            )}
          </div>
          <button className="btn primary block" type="button" disabled={!evaluation.passed} onClick={submit}>
            Protokoll an MTR übergeben
          </button>
          {result && (
            <div className="feedback is-correct">
              <strong>
                Messung durchgeführt: <Stars count={result.stars} /> {result.xp > 0 ? `+${result.xp} XP` : '(keine Verbesserung – keine neuen XP)'}
              </strong>
              <p>{scenario.debrief}</p>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
