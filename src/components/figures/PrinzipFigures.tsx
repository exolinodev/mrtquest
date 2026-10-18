import { useMemo } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { Arrow, C, FS, Txt, polyPoints, useAnimTime } from './shared';

/* ------------------------------------------------------------------ Hilfen */

/** Zahl mit Dezimalkomma */
const fmt = (v: number, digits: number) => v.toFixed(digits).replace('.', ',');

/** Ganze Zahl mit geschütztem Leerzeichen als Tausendertrenner */
const group = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

/** Text, der bei Bedarf auf eine Maximalbreite gestaucht wird (grobe Breitenschätzung). */
function Fit({ x, y, text, max, size = FS, strong, anchor = 'start', fill }: { x: number; y: number; text: string; max: number; size?: number; strong?: boolean; anchor?: 'start' | 'middle' | 'end'; fill?: string }) {
  const estimate = text.length * size * (strong ? 0.6 : 0.54);
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={strong ? 'fig-label-strong' : 'fig-label'}
      style={{ fontSize: size, ...(fill ? { fill } : {}) }}
      {...(estimate > max ? { textLength: max, lengthAdjust: 'spacingAndGlyphs' } : {})}
    >
      {text}
    </text>
  );
}

/** M mit tiefgestelltem Index, z. B. M_y */
function MSub({ x, y, sub, size = 19, fill, anchor = 'start' }: { x: number; y: number; sub: string; size?: number; fill?: string; anchor?: 'start' | 'middle' | 'end' }) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="fig-label-strong" style={{ fontSize: size, ...(fill ? { fill } : {}) }}>
      M<tspan dy={5} style={{ fontSize: size * 0.72 }}>{sub}</tspan>
    </text>
  );
}

/* Naturkonstanten (SI) */
const GAMMA = 2.6752e8; // rad/(s·T), Proton
const HBAR = 1.054572e-34; // J·s
const KB = 1.380649e-23; // J/K
const BODY_T = 310; // K

/** relativer Besetzungsüberschuss (N↑ − N↓)/N ≈ γħB₀/(2kT) */
const excess = (b0: number) => (GAMMA * HBAR * b0) / (2 * KB * BODY_T);

/* ------------------------------------------------------------------ boltzmann-excess */

/** Links: 1 000 000 Spins bei 1,5 T als zwei fast gleiche Balken mit Lupe; rechts: Überschuss in ppm gegen B₀. */
export function BoltzmannExcessFigure() {
  const { tr } = useLang();
  const N = 1_000_000;
  const p15 = excess(1.5);
  const p3 = excess(3);
  const nUp = Math.round((N / 2) * (1 + p15));
  const nDown = N - nUp;

  // Hauptbalken: gleicher Maßstab für beide
  const bx = 24;
  const scale = 240 / nUp;
  // Lupe: 1 Spin = 22 Einheiten
  const z0 = nDown - 5;
  const ZX = (n: number) => 30 + (n - z0) * 22;

  // rechtes Diagramm
  const P = { x0: 345, x1: 575, y0: 70, y1: 320 };
  const bMax = 7;
  const ppmMax = 25;
  const X = (b: number) => P.x0 + (b / bMax) * (P.x1 - P.x0);
  const Y = (ppm: number) => P.y1 - (ppm / ppmMax) * (P.y1 - P.y0);

  return (
    <svg viewBox="0 0 600 400" role="img" aria-label={tr('Boltzmann-Überschuss der Protonen', 'Больцмановский избыток протонов')}>
      <line x1={300} y1={16} x2={300} y2={390} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 6" />

      {/* links: Balken */}
      <Fit x={150} y={34} text={tr('1 000 000 Spins bei 1,5 T', '1 000 000 спинов при 1,5 Тл')} max={280} size={21} strong anchor="middle" />
      <Txt x={bx} y={72} strong fill={C.blue}>↑ {group(nUp)}</Txt>
      <rect x={bx} y={80} width={nUp * scale} height={28} rx={4} fill={C.blue} opacity={0.85} />
      <Txt x={bx} y={140} strong fill={C.violet}>↓ {group(nDown)}</Txt>
      <rect x={bx} y={148} width={nDown * scale} height={28} rx={4} fill={C.violet} opacity={0.85} />
      {/* Lupenrahmen an den Balkenenden */}
      <rect x={248} y={74} width={24} height={108} fill="none" stroke={C.yellow} strokeWidth={2} strokeDasharray="5 4" />
      <line x1={248} y1={182} x2={24} y2={222} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={272} y1={182} x2={282} y2={222} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
      <rect x={18} y={222} width={264} height={144} rx={8} fill="var(--surface-2)" stroke={C.yellow} strokeWidth={2} />
      <Txt x={274} y={244} size={18} anchor="end">{tr('vergrößert', 'увеличено')}</Txt>
      <rect x={18} y={252} width={ZX(nUp) - 18} height={26} fill={C.blue} opacity={0.85} />
      <rect x={18} y={292} width={ZX(nDown) - 18} height={26} fill={C.violet} opacity={0.85} />
      {[...Array(12)].map((_, i) => (
        <line key={i} x1={30 + i * 22} y1={248} x2={30 + i * 22} y2={322} stroke="var(--muted)" strokeWidth={0.8} opacity={0.6} />
      ))}
      <line x1={ZX(nDown)} y1={330} x2={ZX(nUp)} y2={330} stroke={C.green} strokeWidth={3} />
      <line x1={ZX(nDown)} y1={322} x2={ZX(nDown)} y2={338} stroke={C.green} strokeWidth={3} />
      <line x1={ZX(nUp)} y1={322} x2={ZX(nUp)} y2={338} stroke={C.green} strokeWidth={3} />
      <Fit x={150} y={358} text={tr(`Überschuss: ${nUp - nDown} Spins`, `Избыток: ${nUp - nDown} спина`)} max={250} size={19} strong anchor="middle" fill={C.green} />
      <Txt x={150} y={390} anchor="middle" size={18}>
        ≈ {fmt(p15 * 1e6, 1)} ppm
      </Txt>

      {/* rechts: ppm gegen B₀ */}
      <Fit x={460} y={34} text={tr('Überschuss gegen B₀', 'Избыток и поле B₀')} max={280} size={21} strong anchor="middle" />
      <Arrow x1={P.x0} y1={P.y1} x2={P.x1 + 12} y2={P.y1} color="var(--muted)" width={1.5} head={10} />
      <Arrow x1={P.x0} y1={P.y1} x2={P.x0} y2={P.y0 - 10} color="var(--muted)" width={1.5} head={10} />
      <Txt x={P.x0 + 8} y={P.y0 + 2} size={18}>ppm</Txt>
      {[0, 10, 20].map((v) => (
        <g key={v}>
          <line x1={P.x0 - 5} y1={Y(v)} x2={P.x0} y2={Y(v)} stroke="var(--muted)" strokeWidth={1.5} />
          <Txt x={P.x0 - 9} y={Y(v) + 6} size={18} anchor="end">{v}</Txt>
        </g>
      ))}
      {[0, 1.5, 3, 7].map((b) => (
        <g key={b}>
          <line x1={X(b)} y1={P.y1} x2={X(b)} y2={P.y1 + 5} stroke="var(--muted)" strokeWidth={1.5} />
          <Txt x={X(b)} y={P.y1 + 24} size={18} anchor="middle">{fmt(b, b % 1 ? 1 : 0)}</Txt>
        </g>
      ))}
      <Txt x={P.x1 + 10} y={P.y1 + 50} size={18} anchor="end">{tr('B₀ in T', 'B₀ в Тл')}</Txt>
      <line x1={X(0)} y1={Y(0)} x2={X(bMax)} y2={Y(excess(bMax) * 1e6)} stroke={C.green} strokeWidth={3} />
      {[
        { b: 1.5, p: p15 },
        { b: 3, p: p3 },
      ].map(({ b, p }) => (
        <g key={b}>
          <line x1={X(b)} y1={P.y1} x2={X(b)} y2={Y(p * 1e6)} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
          <circle cx={X(b)} cy={Y(p * 1e6)} r={7} fill={C.yellow} />
          <Txt x={X(b) - 10} y={Y(p * 1e6) - 12} size={18} strong anchor="end" fill={C.yellow}>
            {fmt(p * 1e6, 1)}
          </Txt>
        </g>
      ))}
      <Txt x={X(5.4)} y={Y(excess(bMax) * 1e6)} size={18} anchor="end">
        {fmt(excess(bMax) * 1e6, 0)} ppm
      </Txt>
      <Txt x={P.x1} y={P.y1 - 14} size={18} anchor="end">T = 310 K</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ rotating-frame */

type V3 = [number, number, number];

/** Schräge Projektion: x nach vorn links, y nach rechts, z nach oben. */
function makeProj(cx: number, cy: number, R: number) {
  return ([x, y, z]: V3): [number, number] => [cx + R * (0.95 * y - 0.5 * x), cy + R * (-z + 0.34 * x)];
}

function Axes3({ cx, cy, R, prime }: { cx: number; cy: number; R: number; prime: boolean }) {
  const P = makeProj(cx, cy, R);
  const o = P([0, 0, 0]);
  const ends: { v: V3; label: string; dx: number; dy: number }[] = [
    { v: [1.3, 0, 0], label: prime ? 'x′' : 'x', dx: -10, dy: 18 },
    { v: [0, 1.25, 0], label: prime ? 'y′' : 'y', dx: 2, dy: 24 },
    { v: [0, 0, 1.3], label: prime ? 'z′' : 'z', dx: 12, dy: 10 },
  ];
  const eq = polyPoints(72, (i) => P([Math.cos((i / 72) * 2 * Math.PI), Math.sin((i / 72) * 2 * Math.PI), 0]));
  return (
    <g>
      <polyline points={eq} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="5 5" />
      {ends.map(({ v, label, dx, dy }) => {
        const e = P(v);
        return (
          <g key={label}>
            <Arrow x1={o[0]} y1={o[1]} x2={e[0]} y2={e[1]} color="var(--muted)" width={1.8} head={10} />
            <Txt x={e[0] + dx} y={e[1] + dy} size={19} anchor="middle">{label}</Txt>
          </g>
        );
      })}
    </g>
  );
}

/** Laborsystem: Spitze von M läuft auf einer Spirale zum Äquator. Rotierendes System: M kippt auf einem Großkreis um B₁ (x′). */
export function RotatingFrameFigure() {
  const { tr } = useLang();
  const { t, animated } = useAnimTime();
  const s = animated ? Math.min(1, (t % 7) / 5) : 1;
  const turns = 5;
  const R = 108;
  const cy = 250;
  const L = makeProj(150, cy, R);
  const Rt = makeProj(450, cy, R);

  const labTip = (u: number): V3 => {
    const th = (u * Math.PI) / 2;
    const ph = Math.PI / 2 - 2 * Math.PI * turns * u;
    return [Math.sin(th) * Math.cos(ph), Math.sin(th) * Math.sin(ph), Math.cos(th)];
  };
  const n = 400;
  const spiral = polyPoints(n, (i) => L(labTip(i / n)));
  const labM = L(labTip(s));
  const phB = -2 * Math.PI * turns * s;
  const labB = L([0.6 * Math.cos(phB), 0.6 * Math.sin(phB), 0]);
  const lo = L([0, 0, 0]);

  const rotTip = (u: number): V3 => [0, Math.sin((u * Math.PI) / 2), Math.cos((u * Math.PI) / 2)];
  const arc = polyPoints(60, (i) => Rt(rotTip(i / 60)));
  const rotM = Rt(rotTip(s));
  const ro = Rt([0, 0, 0]);
  const rotB = Rt([0.85, 0, 0]);
  const arcEnd = Rt(rotTip(1));
  const arcPre = Rt(rotTip(0.9));

  return (
    <svg viewBox="0 0 600 420" role="img" aria-label={tr('Laborsystem und rotierendes Bezugssystem', 'Лабораторная и вращающаяся системы отсчёта')}>
      <line x1={300} y1={16} x2={300} y2={410} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 6" />
      <Fit x={150} y={34} text={tr('Laborsystem', 'Лабораторная система')} max={280} size={22} strong anchor="middle" />
      <Fit x={150} y={60} text={tr('Achsen stehen fest', 'оси неподвижны')} max={280} size={18} anchor="middle" />
      <Fit x={450} y={34} text={tr('Rotierendes System', 'Вращающаяся система')} max={280} size={22} strong anchor="middle" />
      <Fit x={450} y={60} text={tr('dreht mit f₀ um z', 'вращается с f₀ вокруг z')} max={280} size={18} anchor="middle" />

      {/* Laborsystem */}
      <Axes3 cx={150} cy={cy} R={R} prime={false} />
      <polyline points={spiral} fill="none" stroke={C.yellow} strokeWidth={2.2} opacity={0.9} />
      <Arrow x1={lo[0]} y1={lo[1]} x2={labB[0]} y2={labB[1]} color={C.pink} width={3.5} head={14} />
      <Txt x={labB[0] + (labB[0] >= lo[0] ? 8 : -8)} y={labB[1] + 22} size={18} strong anchor={labB[0] >= lo[0] ? 'start' : 'end'} fill={C.pink}>B₁</Txt>
      <Arrow x1={lo[0]} y1={lo[1]} x2={labM[0]} y2={labM[1]} color={C.green} width={5} head={18} />
      <Txt x={labM[0] - 24} y={labM[1] + 32} strong anchor="end" fill={C.green}>M</Txt>
      <Fit x={150} y={384} text={tr('Spirale: Kippen + Präzession', 'спираль: наклон + прецессия')} max={280} size={19} strong anchor="middle" fill={C.yellow} />
      <Fit x={150} y={410} text={tr('B₁ kreist mit f₀ in der xy-Ebene', 'B₁ вращается с f₀ в плоскости xy')} max={280} size={18} anchor="middle" />

      {/* Rotierendes System */}
      <Axes3 cx={450} cy={cy} R={R} prime />
      <polyline points={arc} fill="none" stroke={C.yellow} strokeWidth={3} />
      <Arrow x1={arcPre[0]} y1={arcPre[1]} x2={arcEnd[0] + 2} y2={arcEnd[1]} color={C.yellow} width={3} head={14} />
      <Arrow x1={ro[0]} y1={ro[1]} x2={rotB[0]} y2={rotB[1]} color={C.pink} width={4.5} head={16} />
      <Txt x={rotB[0] - 14} y={rotB[1] - 2} size={19} strong anchor="end" fill={C.pink}>B₁</Txt>
      <Arrow x1={ro[0]} y1={ro[1]} x2={rotM[0]} y2={rotM[1]} color={C.green} width={5} head={18} />
      <Txt x={rotM[0] - 24} y={rotM[1] + 32} strong anchor="end" fill={C.green}>M</Txt>
      <Fit x={450} y={384} text={tr('Großkreis: Kippen um B₁', 'большой круг: наклон вокруг B₁')} max={280} size={19} strong anchor="middle" fill={C.yellow} />
      <Fit x={450} y={410} text={tr('B₁ steht still auf x′', 'B₁ неподвижно на оси x′')} max={280} size={18} anchor="middle" />
    </svg>
  );
}

/* ------------------------------------------------------------------ bloch-phase */

type BlochPoint = { t: number; mx: number; my: number; pulse: boolean };

/**
 * Bloch-Gleichung im Laborsystem in normierter Zeit (0 bis 1), RK4.
 * Larmor-Frequenz 20 Umläufe pro Zeiteinheit, 90°-Puls von 0,1 bis 0,25, T2 = 0,12, T1 = 0,6.
 */
function simulateBloch(): BlochPoint[] {
  const w0 = 2 * Math.PI * 20;
  const tp0 = 0.1;
  const tp1 = 0.25;
  const w1 = Math.PI / 2 / (tp1 - tp0);
  const T2 = 0.12;
  const T1 = 0.6;
  const M0 = 1;
  const dt = 2e-4;
  const steps = Math.round(1 / dt);
  const f = (t: number, m: V3): V3 => {
    const on = t >= tp0 && t < tp1;
    // Ω = γB; B₁ kreist mit derselben Drehrichtung wie die Präzession (By = −B₁ sin ω₀t)
    const ox = on ? w1 * Math.cos(w0 * t) : 0;
    const oy = on ? -w1 * Math.sin(w0 * t) : 0;
    const oz = w0;
    return [
      m[1] * oz - m[2] * oy - m[0] / T2,
      m[2] * ox - m[0] * oz - m[1] / T2,
      m[0] * oy - m[1] * ox - (m[2] - M0) / T1,
    ];
  };
  const add = (a: V3, b: V3, k: number): V3 => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
  let m: V3 = [0, 0, M0];
  const out: BlochPoint[] = [{ t: 0, mx: 0, my: 0, pulse: false }];
  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    const k1 = f(t, m);
    const k2 = f(t + dt / 2, add(m, k1, dt / 2));
    const k3 = f(t + dt / 2, add(m, k2, dt / 2));
    const k4 = f(t + dt, add(m, k3, dt));
    m = [
      m[0] + (dt / 6) * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]),
      m[1] + (dt / 6) * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]),
      m[2] + (dt / 6) * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]),
    ];
    const tn = t + dt;
    out.push({ t: tn, mx: m[0], my: m[1], pulse: tn <= tp1 });
  }
  return out;
}

/** (a) Mx und My über der normierten Zeit, (b) Phasendiagramm My gegen Mx: Spirale nach außen (Anregung) und nach innen (Relaxation). */
export function BlochPhaseFigure() {
  const { tr } = useLang();
  const data = useMemo(simulateBloch, []);

  // (a) Zeitverlauf
  const A = { x0: 56, x1: 574, yc: 150, amp: 74 };
  const XA = (t: number) => A.x0 + t * (A.x1 - A.x0);
  const YA = (v: number) => A.yc - v * A.amp;
  const line = (key: 'mx' | 'my') => data.map((d) => `${XA(d.t).toFixed(1)},${YA(d[key]).toFixed(1)}`).join(' ');

  // (b) Phasendiagramm
  const B = { cx: 300, cy: 470, r: 140 };
  const pts = (sel: (d: BlochPoint) => boolean) =>
    data
      .filter(sel)
      .map((d) => `${(B.cx + d.mx * B.r).toFixed(1)},${(B.cy - d.my * B.r).toFixed(1)}`)
      .join(' ');
  const exc = pts((d) => d.pulse);
  const lastPulse = data.filter((d) => d.pulse).pop();
  const rel = pts((d) => !d.pulse || d === lastPulse);

  return (
    <svg viewBox="0 0 600 650" role="img" aria-label={tr('Bloch-Simulation: Zeitverlauf und Phasendiagramm', 'Моделирование Блоха: временной ход и фазовая диаграмма')}>
      {/* (a) */}
      <Fit x={20} y={30} text={tr('(a) Zeitverlauf', '(a) Ход во времени')} max={300} size={22} strong />
      <rect x={XA(0.1)} y={A.yc - A.amp - 10} width={XA(0.25) - XA(0.1)} height={2 * A.amp + 20} fill="var(--surface-2)" stroke={C.pink} strokeWidth={1.5} strokeDasharray="4 4" />
      <Fit x={(XA(0.1) + XA(0.25)) / 2} y={A.yc - A.amp - 18} text={tr('HF-Puls', 'РЧ-импульс')} max={110} size={18} strong anchor="middle" fill={C.pink} />
      <line x1={A.x0} y1={A.yc} x2={A.x1} y2={A.yc} stroke="var(--muted)" strokeWidth={1.2} />
      <polyline points={line('mx')} fill="none" stroke={C.blue} strokeWidth={1.6} />
      <polyline points={line('my')} fill="none" stroke={C.violet} strokeWidth={1.6} opacity={0.9} />
      <MSub x={A.x1 - 50} y={30} sub="x" anchor="end" fill={C.blue} />
      <MSub x={A.x1} y={30} sub="y" anchor="end" fill={C.violet} />
      <Arrow x1={A.x0} y1={A.yc + A.amp + 22} x2={A.x1 + 14} y2={A.yc + A.amp + 22} color="var(--muted)" width={1.5} head={10} />
      {[0, 0.5, 1].map((v) => (
        <Txt key={v} x={XA(v)} y={A.yc + A.amp + 46} size={18} anchor="middle">
          {fmt(v, v % 1 ? 1 : 0)}
        </Txt>
      ))}
      <Fit x={XA(0.76)} y={A.yc + A.amp + 46} text={tr('Zeit (normiert)', 'время (нормировано)')} max={200} size={18} anchor="middle" />

      {/* (b) */}
      <Fit x={20} y={308} text={tr('(b) Phasendiagramm', '(b) Фазовая диаграмма')} max={560} size={22} strong />
      <line x1={B.cx - B.r - 14} y1={B.cy} x2={B.cx + B.r + 14} y2={B.cy} stroke="var(--muted)" strokeWidth={1.2} />
      <line x1={B.cx} y1={B.cy - B.r - 14} x2={B.cx} y2={B.cy + B.r + 14} stroke="var(--muted)" strokeWidth={1.2} />
      <MSub x={B.cx + B.r + 18} y={B.cy + 6} sub="x" />
      <MSub x={B.cx + 8} y={B.cy - B.r - 16} sub="y" />
      <polyline points={exc} fill="none" stroke={C.pink} strokeWidth={3} />
      <polyline points={rel} fill="none" stroke={C.blue} strokeWidth={1.5} />

      <Fit x={18} y={B.cy - 30} text={tr('Anregung', 'Возбуждение')} max={124} size={22} strong fill={C.pink} />
      <Fit x={18} y={B.cy - 4} text={tr('nach außen', 'наружу')} max={124} size={18} fill={C.pink} />
      <Arrow x1={64} y1={B.cy + 12} x2={190} y2={B.cy + 50} color={C.pink} width={2.5} head={12} />
      <Fit x={582} y={B.cy - 100} text={tr('Relaxation', 'Релаксация')} max={124} size={22} strong anchor="end" fill={C.blue} />
      <Fit x={582} y={B.cy - 74} text={tr('nach innen', 'внутрь')} max={124} size={18} anchor="end" fill={C.blue} />
      <Arrow x1={540} y1={B.cy - 60} x2={B.cx + 40} y2={B.cy - 18} color={C.blue} width={2.5} head={12} />
      <Fit x={B.cx} y={636} text={tr('Radius = Quermagnetisierung = Signal', 'радиус = поперечная намагниченность = сигнал')} max={560} size={18} anchor="middle" />
    </svg>
  );
}

/* ------------------------------------------------------------------ zeeman-photon */

/** Energieniveaus spalten mit B₀ auf; ΔE = h·f₀; logarithmischer Vergleich der Photonenenergien. */
export function ZeemanPhotonFigure() {
  const { tr } = useLang();
  // Fächer
  const ox = 40;
  const oy = 212;
  const pxPerT = 64;
  const k = 40; // halbe Aufspaltung in Einheiten pro Tesla
  const bEnd = 3.6;
  const XB = (b: number) => ox + b * pxPerT;
  const up = (b: number) => oy - k * b;
  const dn = (b: number) => oy + k * b;
  const wave = polyPoints(60, (i) => {
    const u = i / 60;
    return [66 + u * 62, oy - 5 * Math.sin(2 * Math.PI * 4 * u)];
  });

  // logarithmische Leiste
  const lx = 322;
  const top = 44;
  const bot = 384;
  const LY = (eV: number) => bot - ((Math.log10(eV) + 8) / 14) * (bot - top);
  const hfEv = (6.62607e-34 * 63.87e6) / 1.602177e-19;
  const ktEv = (KB * BODY_T) / 1.602177e-19;

  return (
    <svg viewBox="0 0 600 430" role="img" aria-label={tr('Zeeman-Aufspaltung und Photonenenergien', 'Зеемановское расщепление и энергии фотонов')}>
      {/* Fächer */}
      <Txt x={ox} y={30} strong fill={C.yellow}>ΔE = h·f₀ = γħB₀</Txt>
      <Arrow x1={ox} y1={396} x2={ox} y2={50} color="var(--muted)" width={1.5} head={10} />
      <Txt x={ox - 10} y={64} size={19} anchor="end">E</Txt>
      <Arrow x1={ox} y1={396} x2={286} y2={396} color="var(--muted)" width={1.5} head={10} />
      <Txt x={286} y={420} size={18} anchor="end">B₀</Txt>
      <line x1={ox} y1={oy} x2={XB(bEnd)} y2={oy} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 5" />
      <line x1={ox} y1={oy} x2={XB(bEnd)} y2={up(bEnd)} stroke={C.violet} strokeWidth={3} />
      <line x1={ox} y1={oy} x2={XB(bEnd)} y2={dn(bEnd)} stroke={C.blue} strokeWidth={3} />
      <Fit x={XB(bEnd)} y={up(bEnd) - 12} text={tr('↓ antiparallel', '↓ антипараллельно')} max={200} size={18} strong anchor="end" fill={C.violet} />
      <Fit x={XB(bEnd)} y={dn(bEnd) + 26} text={tr('↑ parallel', '↑ параллельно')} max={200} size={18} strong anchor="end" fill={C.blue} />
      {[
        { b: 1.5, f: tr('64 MHz', '64 МГц'), tick: tr('1,5 T', '1,5 Тл') },
        { b: 3, f: tr('128 MHz', '128 МГц'), tick: tr('3 T', '3 Тл') },
      ].map(({ b, f, tick }) => (
        <g key={b}>
          <Arrow x1={XB(b)} y1={oy} x2={XB(b)} y2={up(b)} color={C.yellow} width={3} head={12} />
          <Arrow x1={XB(b)} y1={oy} x2={XB(b)} y2={dn(b)} color={C.yellow} width={3} head={12} />
          <Txt x={XB(b) + 8} y={oy + 30} size={18} fill={C.yellow}>{f}</Txt>
          <line x1={XB(b)} y1={396} x2={XB(b)} y2={402} stroke="var(--muted)" strokeWidth={1.5} />
          <Txt x={XB(b)} y={420} size={18} anchor="middle">{tick}</Txt>
        </g>
      ))}
      <polyline points={wave} fill="none" stroke={C.pink} strokeWidth={2.5} />
      <Arrow x1={126} y1={oy} x2={XB(1.5) - 4} y2={oy} color={C.pink} width={2.5} head={11} />
      <Txt x={96} y={oy - 14} size={18} strong anchor="middle" fill={C.pink}>hf₀</Txt>

      {/* Photonenenergie, logarithmisch */}
      <Fit x={lx - 10} y={26} text={tr('Photonenenergie (log)', 'Энергия фотона (лог.)')} max={270} size={19} strong />
      <rect x={lx} y={top} width={22} height={bot - top} rx={4} fill="var(--surface-2)" stroke="var(--muted)" strokeWidth={1.5} />
      {[-8, -4, 0, 4].map((d) => (
        <Txt key={d} x={lx - 6} y={LY(10 ** d) + 6} size={18} anchor="end">
          {`10${d < 0 ? '⁻' : ''}${String(Math.abs(d)).replace(/\d/g, (c) => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c])}`}
        </Txt>
      ))}
      {/* Röntgen */}
      <rect x={lx} y={LY(1e5)} width={22} height={LY(1e4) - LY(1e5)} fill={C.red} opacity={0.85} />
      <Fit x={lx + 34} y={LY(10 ** 4.5) - 4} text={tr('Röntgen', 'Рентген')} max={230} size={19} strong fill={C.red} />
      <Fit x={lx + 34} y={LY(10 ** 4.5) + 20} text={tr('10⁴ bis 10⁵ eV', 'от 10⁴ до 10⁵ эВ')} max={230} size={18} fill={C.red} />
      {/* Ionisation */}
      <line x1={lx - 8} y1={LY(10)} x2={lx + 30} y2={LY(10)} stroke={C.red} strokeWidth={2.5} strokeDasharray="5 3" />
      <Fit x={lx + 34} y={LY(10) - 6} text={tr('Ionisation ≈ 10 eV', 'ионизация ≈ 10 эВ')} max={230} size={18} strong fill={C.red} />
      {/* Licht */}
      <circle cx={lx + 11} cy={LY(2)} r={7} fill={C.yellow} />
      <line x1={lx + 22} y1={LY(2)} x2={lx + 32} y2={LY(2) + 20} stroke={C.yellow} strokeWidth={1.5} />
      <Fit x={lx + 34} y={LY(2) + 26} text={tr('sichtbares Licht ≈ 2 eV', 'видимый свет ≈ 2 эВ')} max={240} size={18} fill={C.yellow} />
      {/* kT */}
      <circle cx={lx + 11} cy={LY(ktEv)} r={5} fill="var(--text-dim)" />
      <Fit x={lx + 34} y={LY(ktEv) + 12} text={tr(`kT (37 °C) ≈ ${fmt(ktEv, 3)} eV`, `kT (37 °C) ≈ ${fmt(ktEv, 3)} эВ`)} max={240} size={18} />
      {/* HF */}
      <circle cx={lx + 11} cy={LY(hfEv)} r={8} fill={C.green} />
      <Fit x={lx + 34} y={LY(hfEv) - 6} text={tr('HF, 64 MHz', 'РЧ, 64 МГц')} max={230} size={19} strong fill={C.green} />
      <Fit x={lx + 34} y={LY(hfEv) + 18} text={tr(`≈ ${fmt(hfEv * 1e7, 1)}·10⁻⁷ eV`, `≈ ${fmt(hfEv * 1e7, 1)}·10⁻⁷ эВ`)} max={230} size={18} fill={C.green} />
      <Fit x={lx + 34} y={414} text={tr('nicht ionisierend', 'не ионизирует')} max={230} size={18} strong fill={C.green} />
    </svg>
  );
}

/* ------------------------------------------------------------------ molecular-motion */

/** BPP-Raten (willkürliche Einheiten), Larmor-Kreisfrequenz w */
function bpp(tau: number, w: number) {
  const j = (wt: number) => tau / (1 + wt * wt);
  const r1 = j(w * tau) + 4 * j(2 * w * tau);
  const r2 = 0.5 * (3 * tau + 5 * j(w * tau) + 2 * j(2 * w * tau));
  return { t1: 1 / r1, t2: 1 / r2 };
}

/** Schematisch: T1 hat ein Minimum bei ω₀τc ≈ 1, T2 fällt mit langsamer Bewegung monoton. */
export function MolecularMotionFigure() {
  const { tr } = useLang();
  const P = { x0: 86, x1: 570, y0: 64, y1: 290 };
  const uMin = -3;
  const uMax = 3;
  const lMin = -3.4;
  const lMax = 3.6;
  const X = (u: number) => P.x0 + ((u - uMin) / (uMax - uMin)) * (P.x1 - P.x0);
  const Y = (logT: number) => P.y1 - ((Math.min(lMax, Math.max(lMin, logT)) - lMin) / (lMax - lMin)) * (P.y1 - P.y0);
  const n = 200;
  const curve = (key: 't1' | 't2', w: number) =>
    polyPoints(n, (i) => {
      const u = uMin + (i / n) * (uMax - uMin);
      return [X(u), Y(Math.log10(bpp(10 ** u, w)[key]))];
    });
  const uMinT1 = Math.log10(0.616);
  const examples = [
    { u: -2.3, l1: tr('freies Wasser', 'свободная вода'), l2: tr('Liquor', 'ликвор') },
    { u: uMinT1, l1: tr('Fett', 'жир'), l2: '' },
    { u: 1.0, l1: tr('Gewebe', 'ткань'), l2: '' },
    { u: 2.55, l1: tr('Knochen,', 'кость,'), l2: tr('Festkörper', 'твёрдое тело') },
  ];
  const at = (u: number) => bpp(10 ** u, 1);

  return (
    <svg viewBox="0 0 600 410" role="img" aria-label={tr('T1 und T2 gegen Korrelationszeit, schematisch', 'T1 и T2 в зависимости от времени корреляции, схематично')}>
      <Fit x={20} y={28} text={tr('Relaxationszeit (log), schematisch', 'Время релаксации (лог.), схематично')} max={560} size={20} strong />
      <Arrow x1={P.x0} y1={P.y1} x2={P.x1 + 14} y2={P.y1} color="var(--muted)" width={1.5} head={10} />
      <Arrow x1={P.x0} y1={P.y1} x2={P.x0} y2={P.y0 - 14} color="var(--muted)" width={1.5} head={10} />
      <Txt x={P.x0 - 8} y={P.y0 + 10} size={18} anchor="end">{tr('lang', 'долго')}</Txt>
      <Txt x={P.x0 - 8} y={P.y1 - 4} size={18} anchor="end">{tr('kurz', 'коротко')}</Txt>

      {/* ω₀τc ≈ 1 */}
      <line x1={X(uMinT1)} y1={P.y0} x2={X(uMinT1)} y2={P.y1} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="5 5" />
      <Fit x={X(uMinT1)} y={P.y0 - 6} text={tr('Takt ≈ f₀', 'такт ≈ f₀')} max={120} size={18} strong anchor="middle" fill={C.yellow} />

      {examples.map((e) => (
        <line key={e.l1} x1={X(e.u)} y1={Math.min(Y(Math.log10(at(e.u).t1)), Y(Math.log10(at(e.u).t2)))} x2={X(e.u)} y2={P.y1} stroke="var(--muted)" strokeWidth={1} strokeDasharray="2 4" />
      ))}

      <polyline points={curve('t1', 2.5)} fill="none" stroke={C.green} strokeWidth={2} strokeDasharray="6 5" opacity={0.6} />
      <polyline points={curve('t1', 1)} fill="none" stroke={C.green} strokeWidth={3.5} />
      <polyline points={curve('t2', 1)} fill="none" stroke={C.violet} strokeWidth={3.5} />

      {examples.map((e) => (
        <g key={`d${e.l1}`}>
          <circle cx={X(e.u)} cy={Y(Math.log10(at(e.u).t1))} r={5.5} fill={C.green} />
          <circle cx={X(e.u)} cy={Y(Math.log10(at(e.u).t2))} r={5.5} fill={C.violet} />
        </g>
      ))}

      <Txt x={X(-2.9)} y={Y(Math.log10(at(-2.9).t1)) - 14} size={20} strong fill={C.green}>T₁ ≈ T₂</Txt>
      <Txt x={X(1.9)} y={Y(Math.log10(at(1.9).t1)) + 30} size={20} strong fill={C.green}>T₁</Txt>
      <Txt x={X(1.9) + 6} y={Y(Math.log10(at(1.9).t2)) - 12} size={20} strong fill={C.violet}>T₂</Txt>
      <Fit x={X(1.0) - 6} y={Y(Math.log10(bpp(10 ** 1.0, 2.5).t1)) - 12} text={tr('T₁ bei höherem B₀', 'T₁ при большем B₀')} max={170} size={18} anchor="end" fill={C.green} />

      <Txt x={P.x0} y={P.y1 + 24} size={18}>{tr('schnell', 'быстро')}</Txt>
      <Fit x={(P.x0 + P.x1) / 2} y={P.y1 + 24} text={tr('Korrelationszeit τc (log)', 'время корреляции τc (лог.)')} max={260} size={18} anchor="middle" />
      <Txt x={P.x1} y={P.y1 + 24} size={18} anchor="end">{tr('langsam', 'медленно')}</Txt>

      {examples.map((e) => (
        <g key={`l${e.l1}`}>
          <Fit x={X(e.u)} y={P.y1 + 62} text={e.l1} max={140} size={18} strong anchor="middle" />
          {e.l2 && <Fit x={X(e.u)} y={P.y1 + 86} text={e.l2} max={140} size={18} strong anchor="middle" />}
        </g>
      ))}
      <Fit x={300} y={402} text={tr('Bewegung der Moleküle: schnell links, langsam rechts', 'движение молекул: слева быстрое, справа медленное')} max={560} size={18} anchor="middle" />
    </svg>
  );
}
