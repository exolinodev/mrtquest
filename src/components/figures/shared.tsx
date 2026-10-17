import { useEffect, useState, type CSSProperties, type ReactNode } from 'react';

/** Akzentfarben laut Styleguide */
export const C = {
  blue: '#38bdf8',
  violet: '#a78bfa',
  green: '#34d399',
  pink: '#f472b6',
  yellow: '#fbbf24',
  red: '#f87171',
} as const;

/** Schriftgröße in viewBox-Einheiten (bei 600 Breite ≈ 12 px auf 390-px-Handy) */
export const FS = 22;

type TxtProps = {
  x: number;
  y: number;
  children: ReactNode;
  strong?: boolean;
  size?: number;
  anchor?: 'start' | 'middle' | 'end';
  fill?: string;
  style?: CSSProperties;
};

export function Txt({ x, y, children, strong, size, anchor = 'start', fill, style }: TxtProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={strong ? 'fig-label-strong' : 'fig-label'}
      style={{ fontSize: size ?? (strong ? FS + 1 : FS), ...(fill ? { fill } : {}), ...style }}
    >
      {children}
    </text>
  );
}

type ArrowProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color: string;
  width?: number;
  head?: number;
  dash?: string;
  opacity?: number;
};

/** Pfeil als Linie plus Dreieckspitze (ohne SVG-Marker, damit keine ID-Konflikte entstehen). */
export function Arrow({ x1, y1, x2, y2, color, width = 3, head, dash, opacity }: ArrowProps) {
  const h = head ?? Math.max(10, width * 3.2);
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = x2 - ux * h;
  const by = y2 - uy * h;
  const w = h * 0.55;
  return (
    <g opacity={opacity}>
      <line
        x1={x1}
        y1={y1}
        x2={bx + ux * 1}
        y2={by + uy * 1}
        stroke={color}
        strokeWidth={width}
        strokeLinecap="round"
        strokeDasharray={dash}
      />
      <polygon
        points={`${x2},${y2} ${bx - uy * w},${by + ux * w} ${bx + uy * w},${by - ux * w}`}
        fill={color}
      />
    </g>
  );
}

/** true, wenn die Person reduzierte Bewegung eingestellt hat */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

/** Laufende Zeit in Sekunden für sanfte Animationen; bleibt bei reduzierter Bewegung auf 0. */
export function useAnimTime(): { t: number; animated: boolean } {
  const reduced = useReducedMotion();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reduced) {
      setT(0);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const loop = (now: number) => {
      setT((now - start) / 1000);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);
  return { t, animated: !reduced };
}

/** Punktliste für eine Polyline aus einer Funktion */
export function polyPoints(
  n: number,
  fn: (i: number) => [number, number],
): string {
  const out: string[] = [];
  for (let i = 0; i <= n; i++) {
    const [x, y] = fn(i);
    out.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return out.join(' ');
}
