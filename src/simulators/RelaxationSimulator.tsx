import { useMemo, useState } from 'react';
import { LineChart, sampleCurve } from '../components/LineChart';
import { TeX } from '../components/RichText';
import { Panel, Segmented, Slider } from '../components/ui';
import { TISSUES, type FieldStrength, type TissueId } from '../physics/constants';
import { fmt, mxyDecay, mzAfter90, mzAfterInversion, spinEchoSignal } from '../physics/mri';
import { describeWeighting, DEFAULT_PROTOCOL } from '../physics/protocol';

const SELECTABLE: TissueId[] = ['wm', 'gm', 'csf', 'fat', 'muscle', 'liver', 'lesion'];

/** Phasenfächer von Spins mit unterschiedlicher Off-Resonanz vor und nach einem 180°-Puls. */
function SpinEchoFan({ te }: { te: number }) {
  const [t, setT] = useState(te / 4);
  const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => k * 9); // Grad pro 10 ms
  const phaseAt = (dw: number) => (t <= te / 2 ? dw * (t / 10) : dw * ((t - te) / 10));
  const coherence = Math.abs(offsets.reduce((s, dw) => s + Math.cos((phaseAt(dw) * Math.PI) / 180), 0)) / offsets.length;
  return (
    <div className="spin-fan">
      <svg viewBox="-110 -110 220 220" role="img" aria-label="Phasenfächer der Spins">
        <circle r="95" className="fan-circle" />
        {offsets.map((dw, i) => {
          const ph = ((phaseAt(dw) - 90) * Math.PI) / 180;
          const hue = 200 + i * 15;
          return (
            <line key={dw} x1={0} y1={0} x2={Math.cos(ph) * 88} y2={Math.sin(ph) * 88} stroke={`hsl(${hue} 90% 65%)`} strokeWidth={3} strokeLinecap="round" />
          );
        })}
        <circle r="5" fill="#f8fafc" />
      </svg>
      <div>
        <Slider label="Zeit nach 90°-Puls" value={t} min={0} max={te * 1.5} step={1} unit="ms" onChange={setT} />
        <p className="small">
          {t < te / 2 ? 'Dephasierung durch statische Off-Resonanzen (T2′).' : t < te - 1 ? '180°-Puls bei TE/2 hat die Phasen gespiegelt – die Spins laufen wieder zusammen.' : t <= te + 1 ? '✔ Spin-Echo: Phasenkohärenz wiederhergestellt!' : 'Nach dem Echo fächern die Spins erneut auf.'}
        </p>
        <p className="small muted">Kohärenz (Betrag des Summenvektors): {fmt(coherence * 100, 0)} %</p>
      </div>
    </div>
  );
}

export function RelaxationSimulator() {
  const [field, setField] = useState<FieldStrength>(1.5);
  const [selected, setSelected] = useState<TissueId[]>(['wm', 'gm', 'csf', 'fat']);
  const [mode, setMode] = useState<'90' | '180'>('90');
  const [tr, setTr] = useState(600);
  const [te, setTe] = useState(15);
  const [showStar, setShowStar] = useState(true);

  const tMax = mode === '90' ? Math.max(5000, tr * 1.2) : 5000;
  const mzSeries = useMemo(
    () =>
      selected.map((id) => {
        const p = TISSUES[id].params[field];
        return {
          id,
          label: `${TISSUES[id].label} (T1 ${p.t1} ms)`,
          color: TISSUES[id].color,
          points: sampleCurve((t) => (mode === '90' ? mzAfter90(t, p.t1) : mzAfterInversion(t, p.t1)), [0, tMax]),
        };
      }),
    [selected, field, mode, tMax],
  );

  const mxySeries = useMemo(
    () =>
      selected.flatMap((id) => {
        const p = TISSUES[id].params[field];
        const base = { id, label: `${TISSUES[id].label} (T2 ${p.t2} ms)`, color: TISSUES[id].color, points: sampleCurve((t) => mxyDecay(t, p.t2), [0, 300]) };
        return showStar
          ? [base, { id: `${id}-star`, label: '', color: TISSUES[id].color, dashed: true, width: 1.4, points: sampleCurve((t) => mxyDecay(t, p.t2star), [0, 300]) }]
          : [base];
      }),
    [selected, field, showStar],
  );

  const signals = selected.map((id) => ({ id, s: spinEchoSignal(TISSUES[id].params[field], tr, te) }));
  const maxS = Math.max(...signals.map((x) => x.s), 1e-6);
  const weighting = describeWeighting({ ...DEFAULT_PROTOCOL, sequence: 'SE', tr, te, field });

  const toggle = (id: TissueId) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const presets: Array<{ label: string; tr: number; te: number }> = [
    { label: 'T1w', tr: 550, te: 12 },
    { label: 'PDw', tr: 3000, te: 20 },
    { label: 'T2w', tr: 4000, te: 100 },
  ];

  return (
    <div className="sim-grid">
      <Panel title="Gewebe & Feld" className="span-3">
        <div className="row wrap gap">
          <Segmented<FieldStrength>
            label="Feldstärke"
            value={field}
            options={[
              { value: 1.5, label: '1,5 T' },
              { value: 3, label: '3 T' },
            ]}
            onChange={setField}
          />
          <Segmented<'90' | '180'>
            label="Anregung"
            value={mode}
            options={[
              { value: '90', label: '90°-Puls (Sättigung)' },
              { value: '180', label: '180°-Puls (Inversion)' },
            ]}
            onChange={setMode}
          />
        </div>
        <div className="chips" role="group" aria-label="Gewebe auswählen">
          {SELECTABLE.map((id) => (
            <button key={id} type="button" className={`chip${selected.includes(id) ? ' on' : ''}`} style={{ ['--chip' as string]: TISSUES[id].color }} onClick={() => toggle(id)} aria-pressed={selected.includes(id)}>
              {TISSUES[id].label}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Längsmagnetisierung Mz(t) – T1-Erholung" className="span-2">
        <LineChart
          ariaLabel="T1-Relaxationskurven"
          series={mzSeries}
          xDomain={[0, tMax]}
          yDomain={mode === '90' ? [0, 1.05] : [-1.05, 1.05]}
          xLabel="Zeit [ms]"
          yLabel="Mz / M₀"
          zeroLine
          markers={mode === '90' ? [{ x: tr, label: `TR = ${tr} ms` }] : [{ x: tr, label: `t = ${tr} ms` }]}
        />
        <TeX block tex={mode === '90' ? 'M_z(t) = M_0\\left(1 - e^{-t/T_1}\\right)' : 'M_z(t) = M_0\\left(1 - 2e^{-t/T_1}\\right),\\quad M_z = 0 \\;\\text{bei}\\; t = T_1\\ln 2'} />
        {mode === '180' && (
          <p className="small">
            Nulldurchgänge (TI): {selected.map((id) => `${TISSUES[id].label} ${fmt(TISSUES[id].params[field].t1 * Math.LN2, 0)} ms`).join(' · ')}
          </p>
        )}
      </Panel>

      <Panel title="Sequenzparameter (Spin-Echo)">
        <Slider label="Repetitionszeit TR" value={tr} min={100} max={6000} step={50} unit="ms" onChange={setTr} />
        <Slider label="Echozeit TE" value={te} min={5} max={250} step={1} unit="ms" onChange={setTe} />
        <div className="row wrap gap">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className="btn small"
              onClick={() => {
                setTr(p.tr);
                setTe(p.te);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="weighting-tag">{weighting}</p>
      </Panel>

      <Panel
        title="Quermagnetisierung Mxy(t) – T2 / T2*"
        className="span-2"
        actions={
          <label className="small">
            <input type="checkbox" checked={showStar} onChange={(e) => setShowStar(e.target.checked)} /> T2* (gestrichelt)
          </label>
        }
      >
        <LineChart ariaLabel="T2-Relaxationskurven" series={mxySeries} xDomain={[0, 300]} yDomain={[0, 1.05]} xLabel="Zeit [ms]" yLabel="Mxy / M₀" markers={[{ x: te, label: `TE = ${te} ms` }]} />
      </Panel>

      <Panel title="Spin-Echo-Signal">
        <TeX block tex="S = \rho\,(1 - e^{-TR/T_1})\,e^{-TE/T_2}" />
        <div className="bars">
          {signals
            .slice()
            .sort((a, b) => b.s - a.s)
            .map(({ id, s }) => (
              <div key={id} className="bar-row">
                <span className="bar-label">{TISSUES[id].label}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${(s / maxS) * 100}%`, background: TISSUES[id].color }} />
                </span>
                <span className="bar-value">{fmt(s, 3)}</span>
              </div>
            ))}
        </div>
        <p className="small muted">Die Balkenlänge entspricht der Helligkeit im Bild (relativ zum hellsten Gewebe).</p>
      </Panel>

      <Panel title="Spin-Echo verstehen: Dephasierung & Refokussierung" className="span-3">
        <SpinEchoFan te={Math.max(20, te)} />
      </Panel>
    </div>
  );
}
