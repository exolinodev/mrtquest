import { useEffect, useMemo, useRef, useState } from 'react';
import { TeX } from '../components/RichText';
import { Panel, Segmented, Slider, Stat } from '../components/ui';
import { NUCLEI } from '../physics/constants';
import { fmt, larmorAngular, larmorMHz, spinExcess, zeemanEnergy } from '../physics/mri';
import { useGame } from '../game/GameContext';
import { useLang } from '../i18n/LanguageContext';

/** Zahl mit Dezimalkomma für KaTeX ({,} verhindert zusätzlichen Abstand). */
const texNum = (v: number, digits: number) => v.toFixed(digits).replace('.', '{,}');

interface Challenge {
  b0: number;
  nucleusId: string;
}

type ResonanceResult = { ok: true; nucleusId: string; b0: number; f0: number } | { ok: false; errPct: number; tooHigh: boolean };

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
  const { tr, loc, lang } = useLang();
  const [b0, setB0] = useState(1.5);
  const [nucleusId, setNucleusId] = useState('H1');
  const [flip, setFlip] = useState(90);
  const [offsetHz, setOffsetHz] = useState(0);
  const [challenge, setChallenge] = useState<Challenge>(() => newChallenge());
  const [guess, setGuess] = useState(50);
  const [resonance, setResonance] = useState<ResonanceResult | null>(null);
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
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();
    window.addEventListener('resize', resize);
    // Visualisierte Präzession: Logarithmisch skaliert, damit Feldänderungen sichtbar bleiben
    const visualHz = 0.25 + Math.log10(1 + f0) * 0.35;
    const coilLabel = lang === 'ru' ? 'Напряжение катушки (M⊥)' : 'Spulenspannung (M⊥)';

    const draw = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      phase += dt * visualHz * 2 * Math.PI;
      const W = canvas.width;
      const H = canvas.height;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      // Schmale Canvas (Handy, quadratisch): Oszilloskop als Streifen unten statt oben rechts
      const narrow = W / dpr < 480;
      const cx = W / 2;
      const cy = narrow ? H * 0.5 : H * 0.62;
      const R = Math.min(W, H) * (narrow ? 0.3 : 0.36);
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
      // Fenster mindestens so breit wie die Beschriftung (schmale Handy-Canvas)
      const labelW = ctx.measureText(coilLabel).width + 12 * dpr;
      const sw = narrow ? W - 24 * dpr : Math.min(W * 0.6, Math.max(W * 0.28, labelW));
      const sh = narrow ? H * 0.12 : H * 0.18;
      const sx0 = narrow ? 12 * dpr : W - sw - 12 * dpr;
      const sy0 = narrow ? H - sh - 26 * dpr : 12 * dpr;
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
      ctx.fillText(coilLabel, sx0 + 6 * dpr, sy0 + sh + 14 * dpr);

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [f0, lang]);

  const challengeNucleus = NUCLEI.find((n) => n.id === challenge.nucleusId) ?? NUCLEI[0];
  const challengeF0 = larmorMHz(challenge.b0, challengeNucleus.gammaBar);

  const checkResonance = () => {
    const err = Math.abs(guess - challengeF0) / challengeF0;
    if (err <= 0.005) {
      setResonance({ ok: true, nucleusId: challengeNucleus.id, b0: challenge.b0, f0: challengeF0 });
      dispatch({ type: 'FLAG', flag: 'resonance-hit', xp: 15 });
      setChallenge(newChallenge());
    } else {
      setResonance({ ok: false, errPct: err * 100, tooHigh: guess > challengeF0 });
    }
  };

  const T = tr('T', 'Тл');
  const MHz = tr('MHz', 'МГц');
  const resNucleus = resonance?.ok ? (NUCLEI.find((n) => n.id === resonance.nucleusId) ?? NUCLEI[0]) : null;

  return (
    <div className="sim-grid">
      <Panel title={tr('Präzession im rotierenden Feld', 'Прецессия во вращающемся поле')} className="span-2">
        <canvas ref={canvasRef} className="sim-canvas" aria-label={tr('3D-Darstellung der präzedierenden Magnetisierung', '3D-изображение прецессирующей намагниченности')} />
        <p className="muted small">
          {tr(
            `Die Darstellung ist zeitlich stark verlangsamt (reale Präzession: ${fmt(f0, 2)} Millionen Umläufe pro Sekunde). Rosa: Magnetisierung M, grün: messbare Quermagnetisierung M⊥.`,
            `Изображение сильно замедлено во времени (реальная прецессия: ${fmt(f0, 2)} миллионов оборотов в секунду). Розовый: намагниченность M, зелёный: измеряемая поперечная намагниченность M⊥.`,
          )}
        </p>
      </Panel>

      <Panel title={tr('Parameter', 'Параметры')}>
        <Segmented label={tr('Atomkern', 'Атомное ядро')} value={nucleusId} options={NUCLEI.map((n) => ({ value: n.id, label: n.symbol }))} onChange={setNucleusId} />
        <Slider label={tr('Feldstärke B₀', 'Индукция поля B₀')} value={b0} min={0.2} max={7} step={0.05} unit={T} onChange={setB0} format={(v) => fmt(v, 2)} />
        <Slider label={tr('Flipwinkel α', 'Угол отклонения α')} value={flip} min={10} max={180} step={5} unit="°" onChange={setFlip} />
        <Slider
          label={tr('Frequenzabweichung Δf des Pulses', 'Отклонение частоты импульса Δf')}
          value={offsetHz}
          min={-1000}
          max={1000}
          step={25}
          unit={tr('Hz', 'Гц')}
          onChange={setOffsetHz}
          hint={tr(
            'Bei Fehlabstimmung bleibt im rotierenden System eine z-Komponente des effektiven Feldes (Δω/γ) → der Vektor kippt nicht vollständig (Rechteckpuls, 1 ms).',
            'При отстройке от резонанса во вращающейся системе остаётся z-компонента эффективного поля (Δω/γ) → вектор отклоняется не полностью (прямоугольный импульс, 1 мс).',
          )}
        />
        <button className="btn primary block" type="button" onClick={pulse}>
          {tr('⚡ HF-Puls senden', '⚡ Подать РЧ-импульс')}
        </button>
        <p className="small muted">
          {tr('Effektiver Flipwinkel', 'Эффективный угол отклонения')}: <strong>{fmt(effectiveFlip, 1)}°</strong>
        </p>
      </Panel>

      <Panel title={tr('Messgrößen', 'Измеряемые величины')}>
        <div className="stat-grid">
          <Stat label={tr('Larmor-Frequenz f₀', 'Ларморова частота f₀')} value={fmt(f0, 3)} unit={MHz} />
          <Stat label={tr('Kreisfrequenz ω₀', 'Угловая частота ω₀')} value={fmt(larmorAngular(b0, nucleus.gammaBar) / 1e6, 1)} unit={tr('·10⁶ rad/s', '·10⁶ рад/с')} />
          <Stat label={tr('Energiedifferenz ΔE', 'Разность энергий ΔE')} value={fmt(zeemanEnergy(b0, nucleus.gammaBar) * 1e26, 2)} unit={tr('·10⁻²⁶ J', '·10⁻²⁶ Дж')} />
          <Stat
            label={tr('Spinüberschuss (310 K)', 'Избыток спинов (310 K)')}
            value={fmt(spinExcess(b0, nucleus.gammaBar) * 1e6, 2)}
            unit="ppm"
            sub={tr(`≈ ${fmt(spinExcess(b0, nucleus.gammaBar) * 1e6, 1)} von 1 Mio. Spins`, `≈ ${fmt(spinExcess(b0, nucleus.gammaBar) * 1e6, 1)} из 1 млн спинов`)}
          />
        </div>
        <TeX
          block
          tex={`f_0 = \\bar\\gamma B_0 = ${texNum(nucleus.gammaBar, 3)}\\,\\tfrac{\\text{${MHz}}}{\\text{${T}}} \\cdot ${texNum(b0, 2)}\\,\\text{${T}} = ${texNum(f0, 2)}\\,\\text{${MHz}}`}
        />
        <p className="small muted">{loc(nucleus.note)}</p>
      </Panel>

      <Panel title={tr('📡 Resonanz-Challenge', '📡 Резонансное задание')} className="span-2">
        <p>
          {tr('Stimme den Sender ab: Welche Frequenz bringt', 'Настрой передатчик: какая частота приведёт')} <strong>{loc(challengeNucleus.label)}</strong> {tr('bei', 'при')}{' '}
          <strong>
            {fmt(challenge.b0)} {T}
          </strong>{' '}
          {tr('in Resonanz? (Toleranz ±0,5 %)', 'в резонанс? (допуск ±0,5 %)')}
        </p>
        <Slider label={tr('Sendefrequenz', 'Частота передатчика')} value={guess} min={1} max={310} step={0.05} unit={MHz} onChange={setGuess} format={(v) => fmt(v, 2)} />
        <div className="row gap">
          <input
            className="num-field"
            type="number"
            step="0.01"
            value={guess}
            aria-label={tr('Sendefrequenz in MHz', 'Частота передатчика в МГц')}
            onChange={(e) => setGuess(Number(e.target.value) || 0)}
          />
          <button className="btn primary" type="button" onClick={checkResonance}>
            {tr('Puls senden', 'Подать импульс')}
          </button>
          <button className="btn ghost" type="button" onClick={() => setChallenge(newChallenge())}>
            {tr('Neue Aufgabe', 'Новое задание')}
          </button>
        </div>
        {resonance && (
          <p className={resonance.ok ? 'ok-text' : 'bad-text'}>
            {resonance.ok && resNucleus
              ? tr(
                  `✔ Resonanz! ${loc(resNucleus.label)} bei ${fmt(resonance.b0)} T präzediert mit ${fmt(resonance.f0, 3)} MHz.`,
                  `✔ Резонанс! ${loc(resNucleus.label)} при ${fmt(resonance.b0)} Тл прецессирует с частотой ${fmt(resonance.f0, 3)} МГц.`,
                )
              : !resonance.ok &&
                tr(
                  `✘ Keine Resonanz – Abweichung ${fmt(resonance.errPct, 1)} %. ${resonance.tooHigh ? 'Frequenz zu hoch.' : 'Frequenz zu niedrig.'}`,
                  `✘ Нет резонанса – отклонение ${fmt(resonance.errPct, 1)} %. ${resonance.tooHigh ? 'Частота слишком высокая.' : 'Частота слишком низкая.'}`,
                )}
          </p>
        )}
      </Panel>
    </div>
  );
}
