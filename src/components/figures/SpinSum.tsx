import { useLang } from '../../i18n/LanguageContext';
import { ArrowDefs, C, FS, fnPath } from './figB-util';

const SPINS = [
  { x: 100, cycles: 2, color: C.blue, sub: '₁' },
  { x: 280, cycles: 3, color: C.green, sub: '₂' },
  { x: 460, cycles: 4, color: C.pink, sub: '₃' },
];

/** Drei Spins senden drei Frequenzen, die Spule empfängt nur deren Summe s(t). */
export function SpinSum() {
  const { tr } = useLang();
  const sum = (u: number) => SPINS.reduce((acc, s) => acc + Math.cos(2 * Math.PI * s.cycles * u), 0) / 3;
  return (
    <svg viewBox="0 0 560 520" role="img" aria-label={tr('Die Spule empfängt die Summe aller Spins', 'Катушка принимает сумму всех спинов')}>
      <ArrowDefs id="ss-arrow" />
      {SPINS.map((s) => (
        <g key={s.x}>
          {/* Spin als Kugel mit Pfeil */}
          <circle cx={s.x - 30} cy="44" r="16" fill="var(--surface-2)" stroke={s.color} strokeWidth="2.5" />
          <line x1={s.x - 30} y1="56" x2={s.x - 22} y2="22" stroke={s.color} strokeWidth="3" markerEnd="url(#ss-arrow)" />
          <text x={s.x + 2} y="52" className="fig-label-strong" style={{ fontSize: FS.strong, fill: s.color }}>
            x{s.sub}
          </text>
          <rect x={s.x - 78} y="80" width="156" height="78" rx="8" fill="var(--surface-2)" />
          <path d={fnPath(s.x - 70, 140, 119, 28, (u) => Math.cos(2 * Math.PI * s.cycles * u))} fill="none" stroke={s.color} strokeWidth="2.5" />
          <text x={s.x} y="186" textAnchor="middle" className="fig-label" style={{ fontSize: FS.label, fill: s.color }}>
            f{s.sub}
          </text>
          <line x1={s.x} y1="196" x2={280 + (s.x - 280) * 0.25} y2="236" stroke="var(--muted)" strokeWidth="2" markerEnd="url(#ss-arrow)" />
        </g>
      ))}

      {/* Empfangsspule */}
      <g fill="none" stroke={C.yellow} strokeWidth="3">
        {[0, 1, 2, 3, 4].map((i) => (
          <ellipse key={i} cx={244 + i * 18} cy="258" rx="12" ry="20" />
        ))}
      </g>
      <text x="340" y="252" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        {tr('Spule', 'Катушка')}
      </text>
      <text x="340" y="276" className="fig-label" style={{ fontSize: FS.small }}>
        {tr('hört alle zugleich', 'слышит всех сразу')}
      </text>
      <line x1="280" y1="284" x2="280" y2="318" stroke="var(--muted)" strokeWidth="2" markerEnd="url(#ss-arrow)" />

      {/* Summe */}
      <text x="280" y="346" textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        {tr('Summe aller Spins: s(t)', 'Сумма всех спинов: s(t)')}
      </text>
      <rect x="30" y="360" width="500" height="140" rx="10" fill="var(--surface-2)" />
      <line x1="45" y1="430" x2="520" y2="430" className="fig-axis" markerEnd="url(#ss-arrow)" />
      <text x="514" y="458" textAnchor="end" className="fig-label" style={{ fontSize: FS.label }}>
        t
      </text>
      <path d={fnPath(45, 460, 430, 58, sum, 400)} fill="none" stroke={C.yellow} strokeWidth="3" />
    </svg>
  );
}
