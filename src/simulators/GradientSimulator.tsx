import { useMemo, useState } from 'react';
import { LineChart, sampleCurve } from '../components/LineChart';
import { TeX } from '../components/RichText';
import { Panel, Segmented, Slider, Stat } from '../components/ui';
import { useGame } from '../game/GameContext';
import { HARDWARE } from '../physics/constants';
import { fmt, hzPerMeter, readoutFovMm, sliceThicknessMm, slicePositionMm } from '../physics/mri';

type Tab = 'slice' | 'readout' | 'phase';

function randomTarget() {
  const thick = [1, 2, 3, 4, 5, 8][Math.floor(Math.random() * 6)];
  const pos = Math.round((Math.random() * 160 - 80) / 5) * 5;
  return { thick, pos };
}

function SliceSelection() {
  const { dispatch } = useGame();
  const [g, setG] = useState(10);
  const [bw, setBw] = useState(1500);
  const [offset, setOffset] = useState(0);
  const [target, setTarget] = useState(randomTarget);
  const [msg, setMsg] = useState<string | null>(null);
  const thick = sliceThicknessMm(bw, g);
  const pos = slicePositionMm(offset, g);
  const hzmm = hzPerMeter(g) / 1000;

  // Diagramm: Frequenzoffset über Ort
  const zRange: [number, number] = [-200, 200];
  const fMax = (hzPerMeter(HARDWARE.maxGradient_mT_per_m) * 0.2) / 1000;

  const check = () => {
    const ok = Math.abs(thick - target.thick) <= Math.max(0.15, target.thick * 0.05) && Math.abs(pos - target.pos) <= 1;
    if (ok) {
      setMsg('✔ Zielschicht exakt getroffen! Neue Zielschicht generiert.');
      dispatch({ type: 'FLAG', flag: 'slice-target', xp: 20 });
      setTarget(randomTarget());
    } else {
      const hints: string[] = [];
      if (Math.abs(thick - target.thick) > Math.max(0.15, target.thick * 0.05)) hints.push(thick > target.thick ? 'Schicht zu dick (Gradient ↑ oder Bandbreite ↓)' : 'Schicht zu dünn (Gradient ↓ oder Bandbreite ↑)');
      if (Math.abs(pos - target.pos) > 1) hints.push(`Position um ${fmt(pos - target.pos, 1)} mm versetzt (Offset anpassen)`);
      setMsg(`✘ ${hints.join('; ')}.`);
    }
  };

  return (
    <div className="sim-grid">
      <Panel title="Resonanzfrequenz unter dem Schichtgradienten" className="span-2">
        <LineChart
          ariaLabel="Frequenzoffset in Abhängigkeit vom Ort"
          xDomain={zRange}
          yDomain={[-fMax, fMax]}
          xLabel="Position z [mm]"
          yLabel="Frequenzoffset [kHz]"
          zeroLine
          series={[
            { id: 'f', label: `f(z) − f₀ = γ̄·Gs·z  (${fmt(hzmm, 0)} Hz/mm)`, color: '#34d399', points: sampleCurve((z) => (hzmm * z) / 1000, zRange, 4) },
            { id: 'lo', label: 'Pulsbandbreite', color: '#f472b6', dashed: true, points: [[zRange[0], (offset - bw / 2) / 1000], [zRange[1], (offset - bw / 2) / 1000]] },
            { id: 'hi', label: '', color: '#f472b6', dashed: true, points: [[zRange[0], (offset + bw / 2) / 1000], [zRange[1], (offset + bw / 2) / 1000]] },
          ]}
          markers={[
            { x: pos - thick / 2, label: '', color: '#fbbf24' },
            { x: pos + thick / 2, label: `Schicht ${fmt(thick, 2)} mm`, color: '#fbbf24' },
            { x: target.pos, label: 'Ziel', color: '#94a3b8' },
          ]}
        />
        <div className="body-strip" aria-hidden="true">
          <div className="body-silhouette" />
          <div className="slice-band" style={{ left: `${((pos - thick / 2 - zRange[0]) / 400) * 100}%`, width: `${Math.max(0.4, (thick / 400) * 100)}%` }} />
          <div className="slice-target" style={{ left: `${((target.pos - target.thick / 2 - zRange[0]) / 400) * 100}%`, width: `${Math.max(0.4, (target.thick / 400) * 100)}%` }} />
        </div>
        <p className="small muted">Gelb: angeregte Schicht · grau umrandet: Zielschicht. Nur Spins, deren Frequenz im rosa Band liegt, werden angeregt.</p>
      </Panel>
      <Panel title="Stellgrößen">
        <Slider label="Schichtgradient Gs" value={g} min={1} max={HARDWARE.maxGradient_mT_per_m} step={0.5} unit="mT/m" onChange={setG} />
        <Slider label="HF-Bandbreite Δf" value={bw} min={250} max={6000} step={50} unit="Hz" onChange={setBw} hint="Bandbreite ≈ 1/Pulsdauer: kürzere Pulse haben eine größere Bandbreite." />
        <Slider label="Frequenz-Offset" value={offset} min={-40000} max={40000} step={100} unit="Hz" onChange={setOffset} format={(v) => fmt(v, 0)} />
        <div className="stat-grid two">
          <Stat label="Schichtdicke" value={fmt(thick, 2)} unit="mm" />
          <Stat label="Position" value={fmt(pos, 1)} unit="mm" />
        </div>
        <TeX block tex={`\\Delta z = \\frac{${bw}\\,\\text{Hz}}{${fmt(hzmm, 0)}\\,\\text{Hz/mm}} = ${thick.toFixed(2)}\\,\\text{mm}`} />
      </Panel>
      <Panel title="🎯 Schicht-Challenge" className="span-3">
        <p>
          Regt eine <strong>{target.thick} mm</strong> dicke Schicht bei <strong>z = {target.pos} mm</strong> an (Toleranz: ±5 % Dicke, ±1 mm Position).
        </p>
        <div className="row gap">
          <button className="btn primary" type="button" onClick={check}>
            Anregen & prüfen
          </button>
          <button className="btn ghost" type="button" onClick={() => setTarget(randomTarget())}>
            Andere Zielschicht
          </button>
        </div>
        {msg && <p className={msg.startsWith('✔') ? 'ok-text' : 'bad-text'}>{msg}</p>}
      </Panel>
    </div>
  );
}

const SAMPLES = [
  { x: -70, a: 1, label: 'A' },
  { x: 10, a: 0.6, label: 'B' },
  { x: 55, a: 0.35, label: 'C' },
];

function Readout() {
  const [g, setG] = useState(6);
  const [bwPx, setBwPx] = useState(200);
  const [nx, setNx] = useState(256);
  const totalBw = bwPx * nx;
  const fov = readoutFovMm(totalBw, g);
  const tRead = (1 / bwPx) * 1000; // ms
  const hzmm = hzPerMeter(g) / 1000;

  const signal = useMemo(
    () =>
      sampleCurve(
        (t) =>
          SAMPLES.reduce((s, smp) => {
            const inFov = Math.abs(smp.x) <= fov / 2;
            return s + (inFov ? smp.a * Math.cos(2 * Math.PI * hzmm * smp.x * ((t - tRead / 2) / 1000)) : 0);
          }, 0) * Math.exp(-(((t - tRead / 2) / tRead) ** 2) * 2),
        [0, tRead],
        400,
      ),
    [fov, hzmm, tRead],
  );

  return (
    <div className="sim-grid">
      <Panel title="Objekt: drei Wasserröhrchen entlang x" className="span-3">
        <div className="readout-ruler">
          <div className="fov-window" style={{ left: `${50 - (fov / 2 / 200) * 50}%`, width: `${(fov / 400) * 100}%` }}>
            FOV {fmt(fov, 0)} mm
          </div>
          {SAMPLES.map((s) => (
            <div key={s.label} className={`tube${Math.abs(s.x) > fov / 2 ? ' outside' : ''}`} style={{ left: `${50 + (s.x / 200) * 50}%`, opacity: 0.4 + s.a * 0.6 }}>
              <span>{s.label}</span>
              <small>{fmt((hzmm * s.x) / 1000, 2)} kHz</small>
            </div>
          ))}
        </div>
        <p className="small muted">Jedes Röhrchen präzediert unter dem Auslesegradienten mit eigener Frequenz. Röhrchen außerhalb des FOV werden vom Anti-Aliasing-Filter entfernt.</p>
      </Panel>
      <Panel title="Empfangenes Echo (Summe der Frequenzen)" className="span-2">
        <LineChart ariaLabel="Echosignal während der Auslese" series={[{ id: 's', label: 'Echo-Realteil', color: '#38bdf8', points: signal }]} xDomain={[0, tRead]} yDomain={[-2.1, 2.1]} xLabel="Auslesezeit [ms]" yLabel="Signal" zeroLine markers={[{ x: tRead / 2, label: 'Echo (k = 0)' }]} />
        <p className="small muted">Die Fourier-Transformation zerlegt dieses Schwebungssignal wieder in die drei Frequenzen = drei Orte. Die Schwebung wird schneller, wenn der Gradient steigt.</p>
      </Panel>
      <Panel title="Auslese-Parameter">
        <Slider label="Auslesegradient Gx" value={g} min={1} max={30} step={0.5} unit="mT/m" onChange={setG} />
        <Slider label="Bandbreite pro Pixel" value={bwPx} min={50} max={1000} step={10} unit="Hz/px" onChange={setBwPx} />
        <Slider label="Matrix Nx" value={nx} min={64} max={512} step={64} onChange={setNx} />
        <div className="stat-grid two">
          <Stat label="FOV" value={fmt(fov, 0)} unit="mm" />
          <Stat label="Pixel" value={fmt(fov / nx, 2)} unit="mm" />
          <Stat label="Gesamtbandbreite" value={fmt(totalBw / 1000, 1)} unit="kHz" />
          <Stat label="Auslesedauer" value={fmt(tRead, 2)} unit="ms" />
        </div>
        <TeX block tex="FOV = \frac{BW_{\text{px}} \cdot N_x}{\bar\gamma\, G_x}" />
      </Panel>
    </div>
  );
}

function PhaseEncoding() {
  const [step, setStep] = useState(1);
  const [n, setN] = useState(16);
  const spins = 12;
  const fovMm = 240;
  // Phase eines Spins an Ort y: φ = 2π · k_y · y, k_y = step / FOV
  const phases = Array.from({ length: spins }, (_, i) => {
    const y = ((i + 0.5) / spins - 0.5) * fovMm;
    return 2 * Math.PI * (step / fovMm) * y;
  });
  const sumRe = phases.reduce((s, p) => s + Math.cos(p), 0) / spins;
  const sumIm = phases.reduce((s, p) => s + Math.sin(p), 0) / spins;
  const area = (step / (fovMm / 1000) / 42.577e6) * 1e6; // Gradientenmoment G·t = k/γ̄ in mT/m·ms
  return (
    <div className="sim-grid">
      <Panel title="Phasenkodierung entlang y" className="span-2">
        <div className="phase-column">
          {phases.map((p, i) => (
            <div key={i} className="phase-spin">
              <span className="phase-y">{fmt(((i + 0.5) / spins - 0.5) * fovMm, 0)} mm</span>
              <svg viewBox="-20 -20 40 40" width="38" height="38" aria-hidden="true">
                <circle r="17" className="fan-circle" />
                <line x1="0" y1="0" x2={Math.cos(p - Math.PI / 2) * 15} y2={Math.sin(p - Math.PI / 2) * 15} stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="phase-deg">{fmt((((p * 180) / Math.PI) % 360 + 360) % 360, 0)}°</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Phasenschritt">
        <Slider label="Anzahl Phasenschritte N_y" value={n} min={8} max={64} step={8} onChange={(v) => { setN(v); setStep((s) => Math.max(-v / 2, Math.min(v / 2 - 1, s))); }} />
        <Slider label="Aktueller Schritt k_y-Index" value={step} min={-n / 2} max={n / 2 - 1} step={1} onChange={setStep} />
        <div className="stat-grid two">
          <Stat label="k_y" value={fmt(step / (fovMm / 1000), 1)} unit="1/m" />
          <Stat label="Gradientenmoment" value={fmt(area, 3)} unit="mT/m·ms" />
          <Stat label="Summensignal |S|" value={fmt(Math.hypot(sumRe, sumIm) * 100, 0)} unit="%" sub="homogenes Objekt" />
          <Stat label="Messzeit-Anteil" value={`${n}×TR`} />
        </div>
        <p className="small">
          Bei k_y = 0 sind alle Spins in Phase (maximales Signal). Mit jedem Schritt windet sich die Phase einmal mehr über das FOV – das Signal eines homogenen Objekts
          löscht sich aus, Strukturen mit passender Ortsfrequenz liefern dagegen Signal. Jeder Schritt benötigt ein eigenes Echo → TA ∝ N_y.
        </p>
      </Panel>
    </div>
  );
}

export function GradientSimulator() {
  const [tab, setTab] = useState<Tab>('slice');
  return (
    <div>
      <Segmented<Tab>
        value={tab}
        options={[
          { value: 'slice', label: '1 · Schichtselektion' },
          { value: 'readout', label: '2 · Frequenzkodierung' },
          { value: 'phase', label: '3 · Phasenkodierung' },
        ]}
        onChange={setTab}
      />
      <div className="tab-body">
        {tab === 'slice' && <SliceSelection />}
        {tab === 'readout' && <Readout />}
        {tab === 'phase' && <PhaseEncoding />}
      </div>
    </div>
  );
}
