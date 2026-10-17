/** Gemeinsame Bausteine für die Abbildungen aus Teil B. */

export const C = {
  blue: '#38bdf8',
  violet: '#a78bfa',
  green: '#34d399',
  pink: '#f472b6',
  yellow: '#fbbf24',
  red: '#f87171',
};

/** Schriftgrößen in viewBox-Einheiten. Bei viewBox-Breite um 560 ergibt das ≥ 12 px auf dem Handy. */
export const FS = { label: 21, strong: 22, small: 19 };

/** Polyline-Pfad einer Funktion y = f(u) für u ∈ [0, 1] im Rechteck (x0, yc) mit Breite w. */
export function fnPath(x0: number, w: number, yc: number, amp: number, f: (u: number) => number, steps = 160): string {
  let d = '';
  for (let i = 0; i <= steps; i++) {
    const u = i / steps;
    const x = x0 + u * w;
    const y = yc - amp * f(u);
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
  }
  return d;
}

/** Sinuswelle mit `cycles` Perioden über die Breite w. */
export function sinePath(x0: number, w: number, yc: number, amp: number, cycles: number, phase = 0): string {
  return fnPath(x0, w, yc, amp, (u) => Math.sin(2 * Math.PI * cycles * u + phase), Math.max(80, Math.round(cycles * 24)));
}

/** Pfeilspitzen-Definition; id muss pro Abbildung eindeutig sein. */
export function ArrowDefs({ id, color = 'var(--muted)' }: { id: string; color?: string }) {
  return (
    <defs>
      <marker id={id} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
        <path d="M0,0 L10,5 L0,10 z" fill={color} />
      </marker>
    </defs>
  );
}

/** Text mit tiefgestelltem Index, z. B. Sub('G', 'SS'). */
export function Sub({ base, sub }: { base: string; sub: string }) {
  return (
    <>
      {base}
      <tspan fontSize="0.72em" dy="0.3em">
        {sub}
      </tspan>
    </>
  );
}
