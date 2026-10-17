import { useLang } from '../../i18n/LanguageContext';
import { Arrow, C, Txt, polyPoints } from './shared';

/* ------------------------------------------------------------------ t1-t2-curves */

type PlotBox = { x0: number; x1: number; y0: number; y1: number };

function Frame({ b, xLabel, yTop }: { b: PlotBox; xLabel: string; yTop: string }) {
  return (
    <g>
      <Arrow x1={b.x0} y1={b.y1} x2={b.x1 + 14} y2={b.y1} color="var(--muted)" width={1.5} head={10} />
      <Arrow x1={b.x0} y1={b.y1} x2={b.x0} y2={b.y0 - 14} color="var(--muted)" width={1.5} head={10} />
      <Txt x={b.x1 + 12} y={b.y1 + 26} size={19} anchor="end">{xLabel}</Txt>
      <Txt x={b.x0 - 8} y={b.y0 + 7} size={19} anchor="end">{yTop}</Txt>
      <Txt x={b.x0 - 8} y={b.y1 + 6} size={19} anchor="end">0</Txt>
      <line x1={b.x0} y1={b.y0} x2={b.x1} y2={b.y0} stroke="var(--muted)" strokeWidth={1} strokeDasharray="2 5" />
    </g>
  );
}

/** Mz wächst mit T1 (63 % bei T1), Mxy fällt mit T2 (37 % bei T2), T2* schneller. */
export function T1T2CurvesFigure() {
  const { tr } = useLang();
  const uMax = 4;
  const L: PlotBox = { x0: 62, x1: 270, y0: 80, y1: 270 };
  const R: PlotBox = { x0: 362, x1: 570, y0: 80, y1: 270 };
  const X = (b: PlotBox, u: number) => b.x0 + (u / uMax) * (b.x1 - b.x0);
  const Y = (b: PlotBox, v: number) => b.y1 - v * (b.y1 - b.y0);
  const n = 160;
  const t2starRatio = 0.4; // Beispiel: T2* = 0,4 · T2
  const p63 = 1 - Math.exp(-1);
  const p37 = Math.exp(-1);
  return (
    <svg viewBox="0 0 600 320" role="img" aria-label={tr('T1-Erholung und T2-Zerfall', 'Восстановление T1 и спад T2')}>
      <text x={166} y={36} textAnchor="middle" className="fig-label-strong" style={{ fontSize: 23 }}>
        {tr('längs: M', 'продольно: M')}
        <tspan dy={6} style={{ fontSize: 16 }}>z</tspan>
      </text>
      <text x={466} y={36} textAnchor="middle" className="fig-label-strong" style={{ fontSize: 23 }}>
        {tr('quer: M', 'поперечно: M')}
        <tspan dy={6} style={{ fontSize: 16 }}>xy</tspan>
      </text>

      {/* links: T1 */}
      <Frame b={L} xLabel="t" yTop="M₀" />
      <line x1={X(L, 1)} y1={L.y1} x2={X(L, 1)} y2={Y(L, p63)} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={L.x0} y1={Y(L, p63)} x2={X(L, 1)} y2={Y(L, p63)} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
      <polyline fill="none" stroke={C.green} strokeWidth={3.5} points={polyPoints(n, (i) => {
        const u = (i / n) * uMax;
        return [X(L, u), Y(L, 1 - Math.exp(-u))];
      })} />
      <circle cx={X(L, 1)} cy={Y(L, p63)} r={6} fill={C.yellow} />
      <Txt x={X(L, 1) + 12} y={Y(L, p63) + 26} strong fill={C.yellow}>63 %</Txt>
      <Txt x={X(L, 1)} y={L.y1 + 26} anchor="middle" size={20}>T₁</Txt>

      {/* rechts: T2 und T2* */}
      <Frame b={R} xLabel="t" yTop="M₀" />
      <polyline fill="none" stroke={C.violet} strokeWidth={3} strokeDasharray="8 6" points={polyPoints(n, (i) => {
        const u = (i / n) * uMax;
        return [X(R, u), Y(R, Math.exp(-u / t2starRatio))];
      })} />
      <line x1={X(R, 1)} y1={R.y1} x2={X(R, 1)} y2={Y(R, p37)} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
      <line x1={R.x0} y1={Y(R, p37)} x2={X(R, 1)} y2={Y(R, p37)} stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 4" />
      <polyline fill="none" stroke={C.blue} strokeWidth={3.5} points={polyPoints(n, (i) => {
        const u = (i / n) * uMax;
        return [X(R, u), Y(R, Math.exp(-u))];
      })} />
      <circle cx={X(R, 1)} cy={Y(R, p37)} r={6} fill={C.yellow} />
      <Txt x={X(R, 1) + 12} y={Y(R, p37) - 10} strong fill={C.yellow}>37 %</Txt>
      <Txt x={X(R, 1)} y={R.y1 + 26} anchor="middle" size={20}>T₂</Txt>
      {/* Legende */}
      <line x1={460} y1={110} x2={492} y2={110} stroke={C.blue} strokeWidth={3.5} />
      <Txt x={500} y={117} size={20} fill={C.blue}>T₂</Txt>
      <line x1={460} y1={142} x2={492} y2={142} stroke={C.violet} strokeWidth={3} strokeDasharray="8 6" />
      <Txt x={500} y={149} size={20} fill={C.violet}>T₂*</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ fid-spectrum */

/** Langer FID ↔ schmale Linie, kurzer FID ↔ breite Linie. Echt berechnet: exp-Zerfall und Lorentz-Linie. */
export function FidSpectrumFigure() {
  const { tr } = useLang();
  const rows = [
    { T2: 0.06, top: 70, label: tr('T₂ = 60 ms', 'T₂ = 60 мс') },
    { T2: 0.012, top: 280, label: tr('T₂ = 12 ms', 'T₂ = 12 мс') },
  ];
  const H = 150; // Zeilenhöhe
  const tMax = 0.15; // s
  const fCarrier = 50; // Hz, Frequenz relativ zur Demodulation, nur zur Anschauung
  const dfMax = 50; // Hz
  const tx0 = 24;
  const tx1 = 270;
  const fx0 = 322;
  const fx1 = 578;
  const lor = (df: number, T2: number) => T2 / (1 + (2 * Math.PI * df * T2) ** 2);
  const peakMax = lor(0, rows[0].T2);
  const hz = tr('Hz', 'Гц');
  return (
    <svg viewBox="0 0 600 470" role="img" aria-label={tr('FID und Spektrum', 'FID и спектр')}>
      <Txt x={(tx0 + tx1) / 2} y={30} strong anchor="middle">{tr('Zeit: FID', 'Время: FID')}</Txt>
      <Txt x={(fx0 + fx1) / 2} y={30} strong anchor="middle">{tr('Frequenz: Spektrum', 'Частота: спектр')}</Txt>
      {rows.map((r) => {
        const mid = r.top + H * 0.42;
        const amp = H * 0.4;
        const base = r.top + H;
        const fwhm = 1 / (Math.PI * r.T2);
        const Fx = (df: number) => fx0 + ((df + dfMax) / (2 * dfMax)) * (fx1 - fx0);
        const Fy = (v: number) => base - (v / peakMax) * (H - 10);
        const half = Fy(lor(0, r.T2) / 2);
        const n = 500;
        return (
          <g key={r.T2}>
            {/* FID */}
            <line x1={tx0} y1={mid} x2={tx1} y2={mid} stroke="var(--muted)" strokeWidth={1} />
            <polyline fill="none" stroke="var(--text-dim)" strokeWidth={1.5} strokeDasharray="5 5" points={polyPoints(100, (i) => {
              const t = (i / 100) * tMax;
              return [tx0 + (t / tMax) * (tx1 - tx0), mid - amp * Math.exp(-t / r.T2)];
            })} />
            <polyline fill="none" stroke={C.blue} strokeWidth={2.5} points={polyPoints(n, (i) => {
              const t = (i / n) * tMax;
              const s = Math.exp(-t / r.T2) * Math.cos(2 * Math.PI * fCarrier * t);
              return [tx0 + (t / tMax) * (tx1 - tx0), mid - amp * s];
            })} />
            <Txt x={tx1} y={r.top + 4} anchor="end" strong size={21}>{r.label}</Txt>
            <Txt x={tx1} y={mid + amp + 14} anchor="end" size={19}>{tr('t →', 't →')}</Txt>

            {/* FT-Pfeil */}
            <Arrow x1={282} y1={mid} x2={312} y2={mid} color={C.yellow} width={3} head={12} />
            <Txt x={297} y={mid - 14} anchor="middle" size={18} fill={C.yellow}>FT</Txt>

            {/* Spektrum */}
            <line x1={fx0} y1={base} x2={fx1} y2={base} stroke="var(--muted)" strokeWidth={1.5} />
            <polyline fill="none" stroke={C.pink} strokeWidth={3} points={polyPoints(n, (i) => {
              const df = -dfMax + (i / n) * 2 * dfMax;
              return [Fx(df), Fy(lor(df, r.T2))];
            })} />
            <line x1={Fx(-fwhm / 2)} y1={half} x2={Fx(fwhm / 2)} y2={half} stroke={C.yellow} strokeWidth={2.5} />
            <line x1={Fx(-fwhm / 2)} y1={half - 8} x2={Fx(-fwhm / 2)} y2={half + 8} stroke={C.yellow} strokeWidth={2.5} />
            <line x1={Fx(fwhm / 2)} y1={half - 8} x2={Fx(fwhm / 2)} y2={half + 8} stroke={C.yellow} strokeWidth={2.5} />
            {Fx(fwhm / 2) + 190 < 600 ? (
              <Txt x={Fx(fwhm / 2) + 12} y={half + 7} size={20} fill={C.yellow}>
                {`FWHM ≈ ${Math.round(fwhm).toString()} ${hz}`}
              </Txt>
            ) : (
              <Txt x={Fx(0)} y={Fy(lor(0, r.T2)) - 14} size={20} anchor="middle" fill={C.yellow}>
                {`FWHM ≈ ${Math.round(fwhm).toString()} ${hz}`}
              </Txt>
            )}
            <Txt x={Fx(0)} y={base + 26} anchor="middle" size={19}>f₀</Txt>
            <Txt x={fx1} y={base + 26} anchor="end" size={19}>{tr('f →', 'f →')}</Txt>
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ weighting-map */

/** TR/TE-Ebene mit PDw, T1w, T2w und der unbrauchbaren Ecke. */
export function WeightingMapFigure() {
  const { tr } = useLang();
  const X0 = 92;
  const X1 = 575;
  const Y0 = 48;
  const Y1 = 340;
  const X = (TR: number) => X0 + (TR / 6000) * (X1 - X0);
  const Y = (TE: number) => Y1 - (TE / 120) * (Y1 - Y0);
  const rect = (tr0: number, tr1: number, te0: number, te1: number) => ({
    x: X(tr0),
    y: Y(te1),
    width: X(tr1) - X(tr0),
    height: Y(te0) - Y(te1),
  });
  const T1w = rect(0, 1000, 0, 30);
  const PDw = rect(3000, 6000, 0, 30);
  const T2w = rect(3000, 6000, 70, 120);
  const bad = rect(0, 1000, 70, 120);
  const pts = [
    { TR: 500, TE: 10, label: '500/10', color: C.blue, anchor: 'start' as const, dx: 56, dy: 7 },
    { TR: 5500, TE: 14, label: '5500/14', color: C.green, anchor: 'end' as const, dx: -14, dy: 7 },
    { TR: 5500, TE: 101, label: '5500/101', color: C.pink, anchor: 'end' as const, dx: -14, dy: 7 },
  ];
  return (
    <svg viewBox="0 0 600 410" role="img" aria-label={tr('Gewichtung in der TR-TE-Ebene', 'Взвешенность на плоскости TR-TE')}>
      <rect {...T1w} fill={C.blue} fillOpacity={0.18} stroke={C.blue} strokeWidth={2} rx={6} />
      <rect {...PDw} fill={C.green} fillOpacity={0.18} stroke={C.green} strokeWidth={2} rx={6} />
      <rect {...T2w} fill={C.pink} fillOpacity={0.18} stroke={C.pink} strokeWidth={2} rx={6} />
      <rect {...bad} fill={C.red} fillOpacity={0.1} stroke={C.red} strokeWidth={2} strokeDasharray="6 5" rx={6} />

      <Txt x={T1w.x + T1w.width / 2} y={T1w.y + 28} strong anchor="middle" fill={C.blue}>T1w</Txt>
      <Txt x={PDw.x + 14} y={PDw.y + 30} strong fill={C.green}>PDw</Txt>
      <Txt x={T2w.x + 14} y={T2w.y + 30} strong fill={C.pink}>T2w</Txt>
      <Txt x={bad.x + bad.width + 10} y={bad.y + 30} strong fill={C.red}>{tr('kaum Signal,', 'мало сигнала,')}</Txt>
      <Txt x={bad.x + bad.width + 10} y={bad.y + 58} fill={C.red}>{tr('unbrauchbar', 'непригодно')}</Txt>
      <Txt x={(X(1000) + X(3000)) / 2 + 20} y={Y(50)} anchor="middle" size={19}>{tr('Mischkontrast', 'смешанный')}</Txt>

      {pts.map((p) => (
        <g key={p.label}>
          <circle cx={X(p.TR)} cy={Y(p.TE)} r={7} fill={p.color} stroke="var(--bg-2)" strokeWidth={2} />
          <Txt x={X(p.TR) + p.dx} y={Y(p.TE) + p.dy} anchor={p.anchor} size={20}>{p.label}</Txt>
        </g>
      ))}

      {/* Achsen */}
      <Arrow x1={X0} y1={Y1} x2={X1 + 18} y2={Y1} color="var(--muted)" width={2} head={11} />
      <Arrow x1={X0} y1={Y1} x2={X0} y2={Y0 - 18} color="var(--muted)" width={2} head={11} />
      {[0, 2000, 4000, 6000].map((v) => (
        <g key={`tr${v}`}>
          <line x1={X(v)} y1={Y1} x2={X(v)} y2={Y1 + 6} stroke="var(--muted)" strokeWidth={1.5} />
          <Txt x={X(v)} y={Y1 + 28} anchor="middle" size={19}>{String(v)}</Txt>
        </g>
      ))}
      {[0, 50, 100].map((v) => (
        <g key={`te${v}`}>
          <line x1={X0 - 6} y1={Y(v)} x2={X0} y2={Y(v)} stroke="var(--muted)" strokeWidth={1.5} />
          <Txt x={X0 - 10} y={Y(v) + 6} anchor="end" size={19}>{String(v)}</Txt>
        </g>
      ))}
      <Txt x={X1 + 10} y={Y1 + 58} anchor="end" strong size={21}>{tr('TR in ms →', 'TR, мс →')}</Txt>
      <Txt x={X0 - 10} y={Y0 - 26} strong size={21}>{tr('TE in ms ↑', 'TE, мс ↑')}</Txt>
    </svg>
  );
}
