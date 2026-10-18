import { useMemo } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { imageToKSpace, magnitude } from '../../physics/fft';
import { Arrow, C, Txt, polyPoints, useAnimTime } from './shared';

/* ------------------------------------------------------------------ Hilfen */

/** Zahl mit Dezimalkomma */
const fmt = (v: number, digits: number) => v.toFixed(digits).replace('.', ',');

/** Bemaßungslinie mit Endstrichen */
function Dim({ x1, x2, y, color = 'var(--text-dim)' }: { x1: number; x2: number; y: number; color?: string }) {
  return (
    <g stroke={color} strokeWidth={2}>
      <line x1={x1} y1={y} x2={x2} y2={y} />
      <line x1={x1} y1={y - 7} x2={x1} y2={y + 7} />
      <line x1={x2} y1={y - 7} x2={x2} y2={y + 7} />
    </g>
  );
}

/* ------------------------------------------------------------------ demodulation */

/** HF-Signal mit Hüllkurve → Mischer (cos/sin ω₀t) → langsame Basisbandkurven I und Q mit ADC-Abtastpunkten. */
export function DemodulationFigure() {
  const { tr } = useLang();
  const x0 = 60;
  const x1 = 570;
  const W = x1 - x0;
  const env = (u: number) => Math.exp(-(((u - 0.5) / 0.3) ** 2));
  const carrier = 38; // Schwingungen über die Breite (schematisch, real wären es Zehntausende)
  const slow = 3;
  const n = 700;

  const hfY = 82;
  const hfA = 40;
  const hf = polyPoints(n, (i) => {
    const u = i / n;
    return [x0 + u * W, hfY - hfA * env(u) * Math.cos(2 * Math.PI * carrier * u)];
  });
  const envTop = polyPoints(120, (i) => [x0 + (i / 120) * W, hfY - hfA * env(i / 120)]);
  const envBot = polyPoints(120, (i) => [x0 + (i / 120) * W, hfY + hfA * env(i / 120)]);

  const lanes = [
    { y: 262, label: 'I', color: C.blue, fn: Math.cos },
    { y: 352, label: 'Q', color: C.violet, fn: Math.sin },
  ];
  const A = 34;
  const samples = 26;

  return (
    <svg viewBox="0 0 600 450" role="img" aria-label={tr('Demodulation: HF-Signal, Mischer, I und Q, ADC', 'Демодуляция: РЧ-сигнал, смеситель, I и Q, АЦП')}>
      <Txt x={x0} y={26} strong>{tr('HF-Signal, ≈ 64 MHz', 'РЧ-сигнал, ≈ 64 МГц')}</Txt>
      <polyline points={envTop} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="5 5" />
      <polyline points={envBot} fill="none" stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="5 5" />
      <polyline points={hf} fill="none" stroke={C.pink} strokeWidth={1.6} />
      <Txt x={x1} y={26} size={18} anchor="end">{tr('Hüllkurve gestrichelt', 'огибающая пунктиром')}</Txt>

      {/* Mischer */}
      <Arrow x1={300} y1={128} x2={300} y2={148} color="var(--muted)" width={2} head={10} />
      <circle cx={300} cy={170} r={21} fill="var(--surface-2)" stroke={C.yellow} strokeWidth={2.5} />
      <Txt x={300} y={179} anchor="middle" strong size={26} fill={C.yellow}>×</Txt>
      <Txt x={334} y={162} size={19} fill={C.blue}>× cos(ω₀t) → I</Txt>
      <Txt x={334} y={188} size={19} fill={C.violet}>× sin(ω₀t) → Q</Txt>
      <Txt x={266} y={166} size={19} anchor="end">{tr('Mischer', 'Смеситель')}</Txt>
      <Txt x={266} y={189} size={17} anchor="end">{tr('+ Tiefpass', '+ ФНЧ')}</Txt>
      <Arrow x1={300} y1={192} x2={300} y2={216} color="var(--muted)" width={2} head={10} />

      {lanes.map(({ y, label, color, fn }) => {
        const curve = polyPoints(300, (i) => {
          const u = i / 300;
          return [x0 + u * W, y - A * env(u) * fn(2 * Math.PI * slow * u)];
        });
        return (
          <g key={label}>
            <line x1={x0} y1={y} x2={x1} y2={y} stroke="var(--muted)" strokeWidth={1} opacity={0.6} />
            <Txt x={x0 - 14} y={y + 8} anchor="end" strong size={24} fill={color}>{label}</Txt>
            <polyline points={curve} fill="none" stroke={color} strokeWidth={3} />
            {[...Array(samples)].map((_, j) => {
              const u = (j + 0.5) / samples;
              const sx = x0 + u * W;
              const sy = y - A * env(u) * fn(2 * Math.PI * slow * u);
              return (
                <g key={j}>
                  <line x1={sx} y1={y} x2={sx} y2={sy} stroke={C.yellow} strokeWidth={1} opacity={0.5} />
                  <circle cx={sx} cy={sy} r={4.5} fill={C.yellow} />
                </g>
              );
            })}
          </g>
        );
      })}
      <Txt x={x1} y={232} size={18} anchor="end">{tr('Basisband, wenige kHz', 'базовая полоса, несколько кГц')}</Txt>

      {/* ADC */}
      <circle cx={x0 + 6} cy={414} r={6} fill={C.yellow} />
      <Txt x={x0 + 22} y={421} size={20}>{tr('ADC: ein Messwert alle Δt = 1/BW', 'АЦП: один отсчёт каждые Δt = 1/BW')}</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ fov-pixel */

/** Lineal (FOV, Δx) über einem Objekt und darunter dieselbe Strecke als Frequenzband (BW, Δf). */
export function FovPixelFigure() {
  const { tr } = useLang();
  const N = 12;
  const L = 90;
  const R = 510;
  const w = (R - L) / N;
  const hi = 8;
  const mix = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(',')})`;
  const blue = [56, 189, 248];
  const pink = [244, 114, 182];

  return (
    <svg viewBox="0 0 600 430" role="img" aria-label={tr('FOV, Pixelgröße und Bandbreite', 'FOV, размер пикселя и полоса')}>
      {/* Objekt */}
      <ellipse cx={300} cy={88} rx={150} ry={50} fill="var(--surface-2)" stroke={C.violet} strokeWidth={2.5} />
      <ellipse cx={250} cy={84} rx={34} ry={20} fill="none" stroke={C.violet} strokeWidth={1.5} opacity={0.7} />
      <ellipse cx={352} cy={92} rx={26} ry={16} fill="none" stroke={C.violet} strokeWidth={1.5} opacity={0.7} />
      <Txt x={300} y={26} anchor="middle" size={19}>{tr('Objekt', 'Объект')}</Txt>

      {/* Lineal im Ort */}
      <Txt x={L - 8} y={184} anchor="end" size={18}>{tr('Ort', 'Место')}</Txt>
      {[...Array(N)].map((_, i) => (
        <rect key={i} x={L + i * w} y={165} width={w} height={26} fill={i === hi ? C.yellow : 'none'} fillOpacity={i === hi ? 0.45 : 0} stroke="var(--muted)" strokeWidth={1.5} />
      ))}
      <Txt x={L + (hi + 0.5) * w} y={158} anchor="middle" strong size={20} fill={C.yellow}>Δx</Txt>
      <Dim x1={L} x2={R} y={208} />
      <Txt x={300} y={233} anchor="middle" strong size={20}>FOV = N · Δx</Txt>

      {/* Übersetzung durch den Gradienten */}
      <line x1={L} y1={191} x2={L} y2={292} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 5" />
      <line x1={R} y1={191} x2={R} y2={292} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="4 5" />
      <Arrow x1={140} y1={246} x2={140} y2={286} color={C.green} width={2.5} head={11} />
      <Txt x={154} y={274} size={19} fill={C.green}>{tr('Gradient: f = γ̄·G·x', 'градиент: f = γ̄·G·x')}</Txt>

      {/* Frequenzband */}
      <Txt x={L - 8} y={314} anchor="end" size={18}>{tr('Frequenz', 'Частота')}</Txt>
      {[...Array(N)].map((_, i) => (
        <rect key={i} x={L + i * w} y={295} width={w} height={26} fill={mix(blue, pink, i / (N - 1))} fillOpacity={i === hi ? 0.95 : 0.4} stroke={i === hi ? C.yellow : 'var(--muted)'} strokeWidth={i === hi ? 3 : 1.5} />
      ))}
      <Txt x={L} y={344} anchor="middle" size={17}>−BW/2</Txt>
      <Txt x={300} y={344} anchor="middle" size={17}>0</Txt>
      <Txt x={R} y={344} anchor="middle" size={17}>+BW/2</Txt>
      <Txt x={L + (hi + 0.5) * w} y={344} anchor="middle" strong size={19} fill={C.yellow}>Δf</Txt>
      <Dim x1={L} x2={R} y={360} />
      <Txt x={300} y={386} anchor="middle" strong size={20}>BW = N · Δf = γ̄ · G · FOV</Txt>
      <Txt x={300} y={418} anchor="middle" strong size={21} fill={C.yellow}>Δf = γ̄ · G · Δx</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ reciprocity */

const RN = 64;

/** Punktgitter mit Abstand p (zentriert) und die per FFT berechneten k-Raum-Spitzen. */
function gridAndKSpace(p: number) {
  const img = new Float64Array(RN * RN);
  const dots: [number, number][] = [];
  for (let y = 0; y < RN; y++)
    for (let x = 0; x < RN; x++)
      if (x % p === p / 2 && y % p === p / 2) {
        img[y * RN + x] = 1;
        dots.push([x, y]);
      }
  const mag = magnitude(imageToKSpace(img, RN));
  let max = 0;
  for (const v of mag) max = Math.max(max, v);
  const peaks: [number, number][] = [];
  for (let i = 0; i < mag.length; i++) if (mag[i] > 0.5 * max) peaks.push([i % RN, Math.floor(i / RN)]);
  return { dots, peaks, kStep: RN / p };
}

/** Grobes Gitter → enge k-Raum-Punkte, feines Gitter → weite k-Raum-Punkte (echt per FFT). */
export function ReciprocityFigure() {
  const { tr } = useLang();
  const rows = useMemo(() => [16, 4].map((p) => ({ p, ...gridAndKSpace(p) })), []);
  const S = 190;
  const pad = 8;
  const s = (S - 2 * pad) / RN;
  const ix = 40;
  const kx = 370;

  return (
    <svg viewBox="0 0 600 575" role="img" aria-label={tr('Kehrwert-Prinzip zwischen Bild und k-Raum', 'Принцип обратной величины между изображением и k-пространством')}>
      <Txt x={ix + S / 2} y={34} anchor="middle" strong>{tr('Bild', 'Изображение')}</Txt>
      <Txt x={kx + S / 2} y={34} anchor="middle" strong>{tr('k-Raum (FFT)', 'k-пространство (БПФ)')}</Txt>
      {rows.map(({ p, dots, peaks, kStep }, r) => {
        const y0 = 52 + r * 250;
        return (
          <g key={p}>
            <rect x={ix} y={y0} width={S} height={S} rx={6} fill="var(--surface-2)" stroke="var(--muted)" strokeWidth={1.5} />
            {dots.map(([x, y]) => (
              <circle key={`${x}-${y}`} cx={ix + pad + (x + 0.5) * s} cy={y0 + pad + (y + 0.5) * s} r={p > 8 ? 4 : 2.6} fill="var(--text)" />
            ))}
            <rect x={kx} y={y0} width={S} height={S} rx={6} fill="var(--surface-2)" stroke="var(--muted)" strokeWidth={1.5} />
            {peaks.map(([x, y]) => {
              const center = x === RN / 2 && y === RN / 2;
              return <circle key={`${x}-${y}`} cx={kx + pad + (x + 0.5) * s} cy={y0 + pad + (y + 0.5) * s} r={center ? 4.5 : 3} fill={center ? C.yellow : C.blue} />;
            })}
            <Arrow x1={ix + S + 18} y1={y0 + S / 2} x2={kx - 14} y2={y0 + S / 2} color={C.green} width={3} head={12} />
            <Txt x={(ix + S + kx) / 2} y={y0 + S / 2 - 12} anchor="middle" size={18} fill={C.green}>{tr('FFT', 'БПФ')}</Txt>
            <Txt x={ix + S / 2} y={y0 + S + 28} anchor="middle" size={19}>
              {p > 8 ? tr(`grob: Abstand ${p} px`, `крупно: шаг ${p} пикс`) : tr(`fein: Abstand ${p} px`, `мелко: шаг ${p} пикс`)}
            </Txt>
            <Txt x={kx + S / 2} y={y0 + S + 28} anchor="middle" size={19} fill={C.blue}>
              {p > 8 ? tr(`eng: Abstand ${kStep}`, `тесно: шаг ${kStep}`) : tr(`weit: Abstand ${kStep}`, `широко: шаг ${kStep}`)}
            </Txt>
          </g>
        );
      })}
      <Txt x={300} y={564} anchor="middle" strong size={20} fill={C.yellow}>{tr('Abstand im k-Raum = 64 / Abstand im Bild', 'шаг в k = 64 / шаг на изображении')}</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ kspace-filling */

/** Spin-Echo füllt pro TR eine Zeile, Turbo-Spin-Echo mit 3 Echos drei Zeilen; sanfte Animation. */
export function KSpaceFillingFigure() {
  const { tr } = useLang();
  const { t, animated } = useAnimTime();
  const ROWS = 9;
  const ETL = 3;
  const step = animated ? Math.floor(t / 0.8) % 12 : ROWS;
  const echoColor = [C.blue, C.green, C.violet];
  const rowH = 24;
  const top = 58;
  const gw = 230;
  const panels = [
    { x: 40, title: tr('Spin-Echo: 1 Echo pro TR', 'Спин-эхо: 1 эхо за TR'), tse: false },
    { x: 330, title: tr('Turbo-SE: 3 Echos pro TR', 'Турбо-СЭ: 3 эхо за TR'), tse: true },
  ];

  return (
    <svg viewBox="0 0 600 415" role="img" aria-label={tr('Füllen des k-Raums Zeile für Zeile', 'Заполнение k-пространства строка за строкой')}>
      {panels.map(({ x, title, tse }) => {
        const nTR = tse ? ROWS / ETL : ROWS;
        const done = Math.min(step, nTR);
        // Zeile → [TR-Index, Echo-Index]
        const owner = (row: number): [number, number] => (tse ? [row % ETL, Math.floor(row / ETL)] : [row, 0]);
        const boxW = gw / nTR;
        const tlY = top + ROWS * rowH + 34;
        return (
          <g key={x}>
            <Txt x={x + gw / 2} y={30} anchor="middle" strong size={19}>{title}</Txt>
            {[...Array(ROWS)].map((_, row) => {
              const [tri, echo] = owner(row);
              const filled = tri < done;
              const y = top + row * rowH;
              return (
                <g key={row}>
                  <rect x={x} y={y + 2} width={gw} height={rowH - 4} rx={3} fill={filled ? (tse ? echoColor[echo] : C.blue) : 'var(--surface-2)'} opacity={filled ? 0.85 : 1} />
                  {[...Array(12)].map((__, j) => (
                    <circle key={j} cx={x + 10 + j * ((gw - 20) / 11)} cy={y + rowH / 2} r={2.2} fill={filled ? 'rgba(0,0,0,0.45)' : 'var(--muted)'} opacity={0.8} />
                  ))}
                </g>
              );
            })}
            <rect x={x - 3} y={top + 4 * rowH} width={gw + 6} height={rowH} fill="none" stroke={C.yellow} strokeWidth={2} strokeDasharray="5 4" rx={3} />
            {/* Zeitstrahl */}
            {[...Array(nTR)].map((_, i) => {
              const bx = x + i * boxW;
              const active = animated && i === step && step < nTR;
              return (
                <g key={i}>
                  <rect x={bx + 1} y={tlY} width={boxW - 2} height={34} rx={4} fill={i < done ? 'var(--surface-2)' : 'none'} stroke={active ? C.yellow : 'var(--muted)'} strokeWidth={active ? 3 : 1.5} />
                  {tse ? (
                    echoColor.map((c, k) => <line key={k} x1={bx + boxW * (0.3 + 0.2 * k)} y1={tlY + 7} x2={bx + boxW * (0.3 + 0.2 * k)} y2={tlY + 27} stroke={c} strokeWidth={4} strokeLinecap="round" />)
                  ) : (
                    <line x1={bx + boxW / 2} y1={tlY + 7} x2={bx + boxW / 2} y2={tlY + 27} stroke={C.blue} strokeWidth={4} strokeLinecap="round" />
                  )}
                </g>
              );
            })}
            <Txt x={x} y={tlY + 58} size={18}>{tr('Zeit →', 'время →')}</Txt>
            <Txt x={x + gw} y={tlY + 58} anchor="end" strong size={20} fill={C.yellow}>{`${nTR} × TR`}</Txt>
          </g>
        );
      })}
      <Txt x={300} y={404} anchor="middle" size={19}>{tr('gelb gestrichelt: k-Raum-Mitte, bestimmt den Kontrast', 'жёлтый пунктир: центр k, задаёт контраст')}</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ contrast-bars */

type Tissue = { de: string; ru: string; rho: number; t1: number; t2: number; color: string };
const TISSUES: Tissue[] = [
  { de: 'GM', ru: 'GM', rho: 0.8, t1: 950, t2: 100, color: C.violet },
  { de: 'WM', ru: 'WM', rho: 0.7, t1: 700, t2: 80, color: C.blue },
  { de: 'Liquor', ru: 'Ликвор', rho: 1, t1: 4000, t2: 2000, color: C.green },
];
const WEIGHTINGS = [
  { name: 'PDw', tr: 5500, te: 14 },
  { name: 'T1w', tr: 500, te: 10 },
  { name: 'T2w', tr: 5500, te: 101 },
];
const spinEcho = (ti: Tissue, TR: number, TE: number) => ti.rho * (1 - Math.exp(-TR / ti.t1)) * Math.exp(-TE / ti.t2);

/** Relatives Spin-Echo-Signal von GM, WM und Liquor für PDw, T1w und T2w, darunter Grauwerte. */
export function ContrastBarsFigure() {
  const { tr } = useLang();
  const P = { x0: 70, x1: 585, y0: 70, y1: 290 };
  const vMax = 0.8;
  const Y = (v: number) => P.y1 - (v / vMax) * (P.y1 - P.y0);
  const gW = (P.x1 - P.x0) / 3;
  const barW = 38;
  const gap = 10;

  return (
    <svg viewBox="0 0 600 470" role="img" aria-label={tr('Relatives Signal von GM, WM und Liquor', 'Относительный сигнал GM, WM и ликвора')}>
      {/* Legende */}
      {TISSUES.map((ti, i) => (
        <g key={ti.de}>
          <rect x={90 + i * 150} y={18} width={20} height={20} rx={3} fill={ti.color} />
          <Txt x={118 + i * 150} y={35} size={19}>{tr(ti.de, ti.ru)}</Txt>
        </g>
      ))}
      {/* Achsen */}
      <line x1={P.x0} y1={P.y1} x2={P.x1} y2={P.y1} stroke="var(--muted)" strokeWidth={1.5} />
      <line x1={P.x0} y1={P.y1} x2={P.x0} y2={P.y0 - 6} stroke="var(--muted)" strokeWidth={1.5} />
      {[0, 0.2, 0.4, 0.6, 0.8].map((v) => (
        <g key={v}>
          <line x1={P.x0 - 5} y1={Y(v)} x2={P.x1} y2={Y(v)} stroke="var(--muted)" strokeWidth={v ? 0.6 : 0} opacity={0.5} />
          <Txt x={P.x0 - 9} y={Y(v) + 6} size={17} anchor="end">{fmt(v, 1)}</Txt>
        </g>
      ))}
      <Txt x={P.x0 - 9} y={P.y0 - 14} size={17} anchor="middle">S</Txt>

      {WEIGHTINGS.map((w, g) => {
        const vals = TISSUES.map((ti) => spinEcho(ti, w.tr, w.te));
        const gmax = Math.max(...vals);
        const cx = P.x0 + gW * (g + 0.5);
        const left = cx - (3 * barW + 2 * gap) / 2;
        return (
          <g key={w.name}>
            {vals.map((v, i) => {
              const bx = left + i * (barW + gap);
              const gray = Math.round(25 + 230 * (v / gmax));
              return (
                <g key={i}>
                  <rect x={bx} y={Y(v)} width={barW} height={P.y1 - Y(v)} rx={3} fill={TISSUES[i].color} opacity={0.9} />
                  <Txt x={bx + barW / 2} y={Y(v) - 7} size={17} anchor="middle">{fmt(v, 2)}</Txt>
                  <rect x={bx} y={378} width={barW} height={barW} rx={4} fill={`rgb(${gray},${gray},${gray})`} stroke={TISSUES[i].color} strokeWidth={2.5} />
                </g>
              );
            })}
            <Txt x={cx} y={318} anchor="middle" strong size={21}>{w.name}</Txt>
            <Txt x={cx} y={342} anchor="middle" size={17}>{`TR/TE ${w.tr}/${w.te}`}</Txt>
          </g>
        );
      })}
      <Txt x={300} y={448} anchor="middle" size={18}>{tr('Grauwert: relativ zum hellsten Gewebe je Bild', 'Серый: относительно самой яркой ткани')}</Txt>
      <Txt x={300} y={468} anchor="middle" size={16}>{tr('Werte ungefähr, 1,5 T', 'значения приблизительные, 1,5 Тл')}</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ slice-profile */

/** sinc-Puls in der Zeit, Rechteck im Spektrum, Gradient übersetzt Frequenzband in Schicht Δz. */
export function SliceProfileFigure() {
  const { tr } = useLang();
  const sinc = (u: number) => (Math.abs(u) < 1e-9 ? 1 : Math.sin(Math.PI * u) / (Math.PI * u));
  // oben links: Puls
  const pL = 40;
  const pR = 230;
  const pC = (pL + pR) / 2;
  const perT0 = (pR - pL) / 6;
  const base = 120;
  const amp = 70;
  const pulse = polyPoints(240, (i) => {
    const u = -3 + (6 * i) / 240;
    return [pC + u * perT0, base - amp * sinc(u)];
  });
  // Gradient G_SS mit Refokussierlappen (halbe Fläche)
  const gBase = 228;
  const gH = 24;
  const lobeW = 60;
  const lobeH = ((pR - pL) * gH) / 2 / lobeW;

  // unten: f(z)
  const ax = 90;
  const ay = 490;
  const lx0 = 120;
  const ly0 = 480;
  const lx1 = 570;
  const ly1 = 320;
  const slope = (ly0 - ly1) / (lx1 - lx0);
  const fc = 400;
  const half = 18;
  const zAt = (y: number) => lx0 + (ly0 - y) / slope;
  const z1 = zAt(fc + half);
  const z2 = zAt(fc - half);

  return (
    <svg viewBox="0 0 600 545" role="img" aria-label={tr('Schichtprofil: sinc-Puls, Frequenzband und Schicht', 'Профиль среза: sinc-импульс, полоса частот и срез')}>
      {/* Puls */}
      <Txt x={pL} y={30} strong size={20} fill={C.pink}>B₁(t): sinc</Txt>
      <line x1={pL - 6} y1={base} x2={pR + 10} y2={base} stroke="var(--muted)" strokeWidth={1.5} />
      <polyline points={pulse} fill="none" stroke={C.pink} strokeWidth={3} />
      <line x1={pC} y1={base + 4} x2={pC} y2={base + 26} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="3 3" />
      <line x1={pC + perT0} y1={base + 4} x2={pC + perT0} y2={base + 26} stroke="var(--muted)" strokeWidth={1.2} strokeDasharray="3 3" />
      <Dim x1={pC} x2={pC + perT0} y={base + 26} />
      <Txt x={pC + perT0 / 2} y={base + 50} anchor="middle" size={18}>t₀</Txt>
      <Txt x={pR + 8} y={base + 22} size={18}>t</Txt>

      {/* Gradient */}
      <Txt x={pL} y={gBase - gH - 10} size={18} fill={C.green}>Gₛₛ</Txt>
      <line x1={pL - 6} y1={gBase} x2={pR + lobeW + 12} y2={gBase} stroke="var(--muted)" strokeWidth={1.2} />
      <polygon points={`${pL},${gBase} ${pL},${gBase - gH} ${pR},${gBase - gH} ${pR},${gBase}`} fill={C.green} opacity={0.5} stroke={C.green} strokeWidth={2} />
      <polygon points={`${pR + 4},${gBase} ${pR + 4},${gBase + lobeH} ${pR + 4 + lobeW},${gBase + lobeH} ${pR + 4 + lobeW},${gBase}`} fill={C.pink} opacity={0.45} stroke={C.pink} strokeWidth={2} />
      <Txt x={pR + 4 + lobeW / 2} y={gBase + lobeH + 22} anchor="middle" size={17} fill={C.pink}>−½ A</Txt>

      {/* Fourier-Pfeil */}
      <Arrow x1={286} y1={96} x2={330} y2={96} color={C.yellow} width={2.5} head={11} />
      <Txt x={308} y={84} anchor="middle" size={18} fill={C.yellow}>ℱ</Txt>

      {/* Spektrum */}
      <line x1={345} y1={150} x2={585} y2={150} stroke="var(--muted)" strokeWidth={1.5} />
      <rect x={415} y={74} width={80} height={76} fill={C.blue} fillOpacity={0.3} stroke={C.blue} strokeWidth={2.5} />
      <Dim x1={415} x2={495} y={60} color={C.blue} />
      <Txt x={455} y={44} anchor="middle" strong size={19} fill={C.blue}>Δf = 1/t₀</Txt>
      <Txt x={455} y={174} anchor="middle" size={18}>f₀</Txt>
      <Txt x={585} y={174} anchor="end" size={18}>f</Txt>
      <Txt x={585} y={134} anchor="end" size={17}>{tr('Spektrum', 'Спектр')}</Txt>

      {/* unten: Gradient übersetzt Frequenz in Ort */}
      <line x1={ax} y1={ay} x2={ax} y2={300} stroke="var(--muted)" strokeWidth={1.5} />
      <line x1={ax} y1={ay} x2={585} y2={ay} stroke="var(--muted)" strokeWidth={1.5} />
      <Txt x={ax + 8} y={306} size={18}>f</Txt>
      <Txt x={585} y={ay - 8} anchor="end" size={18}>z</Txt>
      <rect x={ax} y={fc - half} width={z2 - ax} height={2 * half} fill={C.blue} fillOpacity={0.22} />
      <rect x={z1} y={300} width={z2 - z1} height={ay - 300} fill={C.yellow} fillOpacity={0.2} />
      <line x1={z1} y1={fc + half} x2={z1} y2={ay} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={z2} y1={fc - half} x2={z2} y2={ay} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={lx0} y1={ly0} x2={lx1} y2={ly1} stroke={C.green} strokeWidth={3} />
      <Txt x={lx1} y={ly1 - 12} anchor="end" size={18} fill={C.green}>f = f₀ + γ̄·Gₛₛ·z</Txt>
      <Txt x={ax + 6} y={fc + 7} size={18} fill={C.blue}>Δf</Txt>
      <Dim x1={z1} x2={z2} y={ay + 14} color={C.yellow} />
      <Txt x={(z1 + z2) / 2} y={ay + 44} anchor="middle" strong size={20} fill={C.yellow}>Δz = Δf / (γ̄·Gₛₛ)</Txt>
    </svg>
  );
}
