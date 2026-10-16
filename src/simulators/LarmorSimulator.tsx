import { useEffect, useMemo, useRef, useState } from 'react';
import { TeX } from '../components/RichText';
import { Panel, Segmented, Slider, Stat } from '../components/ui';
import { NUCLEI } from '../physics/constants';
import { fmt, larmorAngular, larmorMHz, spinExcess, zeemanEnergy } from '../physics/mri';
import { useGame } from '../game/GameContext';

interface Challenge {
  b0: number;
  nucleusId: string;
}

function newChallenge(): Challenge {
  const fields = [0.55, 1, 1.5, 3, 4.7, 7];
  const nuc = NUCLEI[Math.floor(Math.random() * NUCLEI.length)];
  return { b0: fields[Math.floor(Math.random() * fields.length)], nucleusId: nuc.id };
}

/**
 * Präzessions-Labor: 3D-Projektion der Magnetisierung, die um B₀ präzediert.
 * Ein resonanter HF-Puls kippt den Vektor um den Flipwinkel; danach relaxiert er.
 */
export function LarmorSimulator() {
  const { dispatch } = useGame();
  const [b0, setB0] = useState(1.5);
  const [nucleusId, setNucleusId] = useState('H1');
  const [flip, setFlip] = useState(90);
  const [offsetHz, setOffsetHz] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(() => newChallenge());
  const [guess, setGuess] = useState(50);
  const [resonanceMsg, setResonanceMsg] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const tipRef = useRef<{ start: number; target: number; effective: number } | null>(null);
  const nucleus = NUCLEI.find((n) => n.id === nucleusId) ?? NUCLEI[0];
  const f0 = larmorMHz(b0, nucleus.gammaBar);

  // effektiver Flipwinkel bei Fehlabstimmung: Rotation um B_eff (Rabi-Formel)
  const effectiveFlip = useMemo(() => {
    // B1 so skaliert, dass on-resonance genau der gewünschte Winkel entsteht (Rechteckpuls, 1 ms)
    const w1 = ((flip / 360) * 2 * Math.PI) / 1e-3; // rad/s
    const dw = 2 * Math.PI * offsetHz; // rad/s
    const weff = Math.hypot(w1, dw);
    const theta = weff * 1e-3;
    const sinBeta = w1 / weff;
    // Maximale Auslenkung aus z bei Rotation um geneigte Achse
    const mz = 1 - 2 * sinBeta * sinBeta * Math.sin(theta / 2) ** 2;
    return (Math.acos(Math.max(-1, Math.min(1, mz))) * 180) / Math.PI;
  }, [flip, offsetHz]);

  const pulse = () => {
    tipRef.current = { start: performance.now(), target: flip, effective: effectiveFlip };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let raf = 0;
    let phase = 0;
    let last = performance.now();
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const w = canvas.clientWidth;
      canvas.width = w * dpr;
      canvas.height = w * 0.75 * dpr;
    };
    resize();
    window.addEventListener('resize', resize);
    // Visualisierte Präzession: Logarithmisch skaliert, damit Feldänderungen sichtbar bleiben
    const visualHz = 0.25 + Math.log10(1 + f0) * 0.35;

    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      phase += dt * visualHz * 2 * Math.PI;
      const W = canvas.width;
      const H = canvas.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2;
      const cy = H * 0.62;
      const R = Math.min(W, H) * 0.36;
      const tilt = 0.32; // Projektionsneigung
      const proj = (x: number, y: number, z: number) => [cx + x * R, cy - z * R + y * R * tilt] as const;

      // Tip-Winkel aus Anregung und anschließender Relaxation (stilisiert)
      let alpha = 0;
      const tip = tipRef.current;
      if (tip) {
        const t = (now - tip.start) / 1000;
        if (t < 0.6) alpha = tip.effective * (t / 0.6);
        else alpha = tip.effective * Math.exp(-(t - 0.6) / 2.2);
        if (t > 12) tipRef.current = null;
      }
      const a = (alpha * Math.PI) / 180;

      // Achsen
      ctx.lineWidth = 1.5 * dpr;
      ctx.strokeStyle = 'rgba(148,163,184,0.5)';
      ctx.fillStyle = 'rgba(148,163,184,0.9)';
      ctx.font = `${12 * dpr}px Inter, system-ui, sans-serif`;
      const axes: Array<[number, number, number, string]> = [
        [1.15, 0, 0, 'x′'],
        [0, 1.6, 0, 'y′'],
        [0, 0, 1.25, 'z ∥ B₀'],
      ];
      for (const [x, y, z, label] of axes) {
        const [x0, y0] = proj(0, 0, 0);
        const [x1, y1] = proj(x, y, z);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
        ctx.fillText(label, x1 + 4 * dpr, y1 - 4 * dpr);
      }
      // Transversalebene
      ctx.strokeStyle = 'rgba(56,189,248,0.25)';
      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const th = (i / 64) * 2 * Math.PI;
        const [px, py] = proj(Math.cos(th), Math.sin(th), 0);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      // Präzessionskegel
      if (a > 0.02) {
        ctx.strokeStyle = 'rgba(167,139,250,0.35)';
        ctx.setLineDash([4 * dpr, 4 * dpr]);
        ctx.beginPath();
        for (let i = 0; i <= 64; i++) {
          const th = (i / 64) * 2 * Math.PI;
          const [px, py] = proj(Math.sin(a) * Math.cos(th), Math.sin(a) * Math.sin(th), Math.cos(a));
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }
      // Magnetisierungsvektor
      const mx = Math.sin(a) * Math.cos(phase);
      const my = Math.sin(a) * Math.sin(phase);
      const mz = Math.cos(a);
      const [ox, oy] = proj(0, 0, 0);
      const [vx, vy] = proj(mx, my, mz);
      // Projektion auf Transversalebene (Signal)
      const [tx, ty] = proj(mx, my, 0);
      ctx.strokeStyle = 'rgba(52,211,153,0.9)';
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(tx, ty);
      ctx.stroke();
      ctx.strokeStyle = '#f472b6';
      ctx.lineWidth = 4 * dpr;
      ctx.beginPath();
      ctx.moveTo(ox, oy);
      ctx.lineTo(vx, vy);
      ctx.stroke();
      ctx.fillStyle = '#f472b6';
      ctx.beginPath();
      ctx.arc(vx, vy, 6 * dpr, 0, 2 * Math.PI);
      ctx.fill();

      // Signal-Oszilloskop (Quermagnetisierung → induzierte Spannung)
      const sw = W * 0.28;
      const sh = H * 0.18;
      const sx0 = W - sw - 12 * dpr;
      const sy0 = 12 * dpr;
      ctx.fillStyle = 'rgba(15,23,42,0.8)';
      ctx.fillRect(sx0, sy0, sw, sh);
      ctx.strokeStyle = 'rgba(52,211,153,0.9)';
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      for (let i = 0; i <= 80; i++) {
        const tt = phase - (80 - i) * 0.12;
        const v = Math.sin(a) * Math.cos(tt);
        const px = sx0 + (i / 80) * sw;
        const py = sy0 + sh / 2 - v * sh * 0.42;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.fillStyle = 'rgba(148,163,184,0.9)';
      ctx.fillText('Spulenspannung (M⊥)', sx0 + 6 * dpr, sy0 + sh + 14 * dpr);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [f0]);

  const challengeNucleus = NUCLEI.find((n) => n.id === challenge.nucleusId) ?? NUCLEI[0];
  const challengeF0 = larmorMHz(challenge.b0, challengeNucleus.gammaBar);

  const checkResonance = () => {
    const err = Math.abs(guess - challengeF0) / challengeF0;
    if (err <= 0.005) {
      setResonanceMsg(`✔ Resonanz! ${challengeNucleus.label} bei ${fmt(challenge.b0)} T präzediert mit ${fmt(challengeF0, 3)} MHz.`);
      dispatch({ type: 'FLAG', flag: 'resonance-hit', xp: 15 });
      setChallenge(newChallenge());
    } else {
      setResonanceMsg(`✘ Keine Resonanz – Abweichung ${fmt(err * 100, 1)} %. ${guess > challengeF0 ? 'Frequenz zu hoch.' : 'Frequenz zu niedrig.'}`);
    }
  };

  return (
    <div className="sim-grid">
      <Panel title="Präzession im rotierenden Feld" className="span-2">
        <canvas ref={canvasRef} className="sim-canvas" aria-label="3D-Darstellung der präzedierenden Magnetisierung" />
        <p className="muted small">
          Die Darstellung ist zeitlich stark verlangsamt (reale Präzession: {fmt(f0, 2)} Millionen Umläufe pro Sekunde). Rosa: Magnetisierung M, grün: messbare
          Quermagnetisierung M⊥.
        </p>
      </Panel>

      <Panel title="Parameter">
        <Segmented
          label="Atomkern"
          value={nucleusId}
          options={NUCLEI.map((n) => ({ value: n.id, label: n.label.split(' ')[0] }))}
          onChange={setNucleusId}
        />
        <Slider label="Feldstärke B₀" value={b0} min={0.2} max={7} step={0.05} unit="T" onChange={setB0} format={(v) => fmt(v, 2)} />
        <Slider label="Flipwinkel α" value={flip} min={10} max={180} step={5} unit="°" onChange={setFlip} />
        <Slider
          label="Frequenzabweichung Δf des Pulses"
          value={offsetHz}
          min={-1000}
          max={1000}
          step={25}
          unit="Hz"
          onChange={setOffsetHz}
          hint="Bei Fehlabstimmung bleibt im rotierenden System eine z-Komponente des effektiven Feldes (Δω/γ) → der Vektor kippt nicht vollständig (Rechteckpuls, 1 ms)."
        />
        <button className="btn primary block" type="button" onClick={pulse}>
          ⚡ HF-Puls senden
        </button>
        <p className="small muted">
          Effektiver Flipwinkel: <strong>{fmt(effectiveFlip, 1)}°</strong>
        </p>
      </Panel>

      <Panel title="Messgrößen">
        <div className="stat-grid">
          <Stat label="Larmor-Frequenz f₀" value={fmt(f0, 3)} unit="MHz" />
          <Stat label="Kreisfrequenz ω₀" value={fmt(larmorAngular(b0, nucleus.gammaBar) / 1e6, 1)} unit="·10⁶ rad/s" />
          <Stat label="Energiedifferenz ΔE" value={fmt(zeemanEnergy(b0, nucleus.gammaBar) * 1e26, 2)} unit="·10⁻²⁶ J" />
          <Stat label="Spinüberschuss (310 K)" value={fmt(spinExcess(b0, nucleus.gammaBar) * 1e6, 2)} unit="ppm" sub={`≈ ${fmt(spinExcess(b0, nucleus.gammaBar) * 1e6, 1)} von 1 Mio. Spins`} />
        </div>
        <TeX block tex={`f_0 = \\bar\\gamma B_0 = ${nucleus.gammaBar.toFixed(3)}\\,\\tfrac{\\text{MHz}}{\\text{T}} \\cdot ${b0.toFixed(2)}\\,\\text{T} = ${f0.toFixed(2)}\\,\\text{MHz}`} />
        <p className="small muted">{nucleus.note}</p>
      </Panel>

      <Panel title="📡 Resonanz-Challenge" className="span-2">
        <p>
          Stimme den Sender ab: Welche Frequenz bringt <strong>{challengeNucleus.label}</strong> bei <strong>{fmt(challenge.b0)} T</strong> in Resonanz? (Toleranz ±0,5 %)
        </p>
        <Slider label="Sendefrequenz" value={guess} min={1} max={310} step={0.05} unit="MHz" onChange={setGuess} format={(v) => fmt(v, 2)} />
        <div className="row gap">
          <input
            className="num-field"
            type="number"
            step="0.01"
            value={guess}
            aria-label="Sendefrequenz in MHz"
            onChange={(e) => setGuess(Number(e.target.value) || 0)}
          />
          <button className="btn primary" type="button" onClick={checkResonance}>
            Puls senden
          </button>
          <button className="btn ghost" type="button" onClick={() => setChallenge(newChallenge())}>
            Neue Aufgabe
          </button>
        </div>
        {resonanceMsg && <p className={resonanceMsg.startsWith('✔') ? 'ok-text' : 'bad-text'}>{resonanceMsg}</p>}
      </Panel>
    </div>
  );
}
