import { useId, useMemo } from 'react';
import { numberLocale } from '../i18n/format';

export interface Series {
  id: string;
  label: string;
  color: string;
  points: Array<[number, number]>;
  dashed?: boolean;
  width?: number;
}

export interface Marker {
  x: number;
  label: string;
  color?: string;
}

interface Props {
  series: Series[];
  xDomain: [number, number];
  yDomain: [number, number];
  xLabel?: string;
  yLabel?: string;
  markers?: Marker[];
  height?: number;
  xTicks?: number;
  yTicks?: number;
  zeroLine?: boolean;
  ariaLabel: string;
}

const W = 640;
const PAD = { l: 48, r: 16, t: 14, b: 40 };

function ticks([a, b]: [number, number], count: number): number[] {
  const span = b - a;
  const raw = span / count;
  const mag = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => span / s <= count) ?? mag * 10;
  const out: number[] = [];
  for (let v = Math.ceil(a / step) * step; v <= b + 1e-9; v += step) out.push(+v.toFixed(10));
  return out;
}

/** Schlankes SVG-Liniendiagramm für Relaxations- und Profilkurven. */
export function LineChart({ series, xDomain, yDomain, xLabel, yLabel, markers = [], height = 280, xTicks = 6, yTicks = 5, zeroLine = false, ariaLabel }: Props) {
  const clipId = useId();
  const H = height;
  const sx = (x: number) => PAD.l + ((x - xDomain[0]) / (xDomain[1] - xDomain[0])) * (W - PAD.l - PAD.r);
  const sy = (y: number) => H - PAD.b - ((y - yDomain[0]) / (yDomain[1] - yDomain[0])) * (H - PAD.t - PAD.b);
  const xt = useMemo(() => ticks(xDomain, xTicks), [xDomain, xTicks]);
  const yt = useMemo(() => ticks(yDomain, yTicks), [yDomain, yTicks]);

  return (
    <figure className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={ariaLabel}>
        <defs>
          <clipPath id={clipId}>
            <rect x={PAD.l} y={PAD.t} width={W - PAD.l - PAD.r} height={H - PAD.t - PAD.b} />
          </clipPath>
        </defs>
        {yt.map((v) => (
          <g key={`y${v}`}>
            <line x1={PAD.l} x2={W - PAD.r} y1={sy(v)} y2={sy(v)} className="chart-grid" />
            <text x={PAD.l - 6} y={sy(v)} className="chart-tick" textAnchor="end" dominantBaseline="middle">
              {v.toLocaleString(numberLocale())}
            </text>
          </g>
        ))}
        {xt.map((v) => (
          <g key={`x${v}`}>
            <line x1={sx(v)} x2={sx(v)} y1={PAD.t} y2={H - PAD.b} className="chart-grid" />
            <text x={sx(v)} y={H - PAD.b + 16} className="chart-tick" textAnchor="middle">
              {v.toLocaleString(numberLocale())}
            </text>
          </g>
        ))}
        {zeroLine && yDomain[0] < 0 && <line x1={PAD.l} x2={W - PAD.r} y1={sy(0)} y2={sy(0)} className="chart-zero" />}
        <g clipPath={`url(#${clipId})`}>
          {series.map((s) => (
            <polyline
              key={s.id}
              fill="none"
              stroke={s.color}
              strokeWidth={s.width ?? 2.2}
              strokeDasharray={s.dashed ? '6 5' : undefined}
              strokeLinejoin="round"
              points={s.points.map(([x, y]) => `${sx(x).toFixed(1)},${sy(y).toFixed(1)}`).join(' ')}
            />
          ))}
          {markers.map((m, i) => (
            <g key={`${m.label}-${i}`}>
              <line x1={sx(m.x)} x2={sx(m.x)} y1={PAD.t} y2={H - PAD.b} stroke={m.color ?? 'var(--accent)'} strokeWidth={1.5} strokeDasharray="3 3" />
              <text x={sx(m.x) + 4} y={PAD.t + 12} className="chart-marker" fill={m.color ?? 'var(--accent)'}>
                {m.label}
              </text>
            </g>
          ))}
        </g>
        <line x1={PAD.l} x2={W - PAD.r} y1={H - PAD.b} y2={H - PAD.b} className="chart-axis" />
        <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={H - PAD.b} className="chart-axis" />
        {xLabel && (
          <text x={(PAD.l + W - PAD.r) / 2} y={H - 6} className="chart-label" textAnchor="middle">
            {xLabel}
          </text>
        )}
        {yLabel && (
          <text x={12} y={(PAD.t + H - PAD.b) / 2} className="chart-label" textAnchor="middle" transform={`rotate(-90 12 ${(PAD.t + H - PAD.b) / 2})`}>
            {yLabel}
          </text>
        )}
      </svg>
      <figcaption className="chart-legend">
        {series
          .filter((s) => s.label)
          .map((s) => (
            <span key={s.id} className="legend-item">
              <span className="legend-swatch" style={{ background: s.color, opacity: s.dashed ? 0.6 : 1 }} />
              {s.label}
            </span>
          ))}
      </figcaption>
    </figure>
  );
}

export function sampleCurve(fn: (x: number) => number, [a, b]: [number, number], steps = 160): Array<[number, number]> {
  const out: Array<[number, number]> = [];
  for (let i = 0; i <= steps; i++) {
    const x = a + ((b - a) * i) / steps;
    out.push([x, fn(x)]);
  }
  return out;
}
