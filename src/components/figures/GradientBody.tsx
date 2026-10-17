import { useLang } from '../../i18n/LanguageContext';
import { ArrowDefs, C, FS, sinePath } from './figB-util';

/** Gradient entlang x: Körper, steigendes Feld B(x) und drei Orte mit drei Frequenzen. */
export function GradientBody() {
  const { tr } = useLang();
  const xs = [150, 290, 430];
  const colors = [C.blue, C.green, C.pink];
  const cycles = [2, 3.5, 5];
  // Feldgerade: links (x=60) unten, rechts (x=520) oben, in der Mitte genau B0
  const yB = (x: number) => 235 - ((x - 290) / 230) * 50;
  return (
    <svg viewBox="0 0 560 500" role="img" aria-label={tr('Gradient macht Feld und Frequenz ortsabhängig', 'Градиент делает поле и частоту зависящими от места')}>
      <ArrowDefs id="gb-arrow" />
      {/* Körper, liegend */}
      <g fill="var(--surface-2)" stroke="var(--muted)" strokeWidth="2">
        <circle cx="88" cy="82" r="25" />
        <rect x="116" y="56" width="220" height="52" rx="22" />
        <rect x="326" y="60" width="180" height="20" rx="10" />
        <rect x="326" y="84" width="180" height="20" rx="10" />
      </g>
      <line x1="40" y1="140" x2="535" y2="140" className="fig-axis" markerEnd="url(#gb-arrow)" />
      <text x="538" y="132" className="fig-label-strong" textAnchor="end" style={{ fontSize: FS.strong }}>
        x
      </text>
      {xs.map((x, i) => (
        <g key={x}>
          <line x1={x} y1="40" x2={x} y2="395" stroke={colors[i]} strokeWidth="1.5" strokeDasharray="4 5" opacity="0.7" />
          <circle cx={x} cy="82" r="7" fill={colors[i]} />
          <text x={x} y="30" textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong, fill: colors[i] }}>
            x{['₁', '₂', '₃'][i]}
          </text>
        </g>
      ))}

      {/* Feld B(x) */}
      <line x1="50" y1="300" x2="50" y2="165" className="fig-axis" markerEnd="url(#gb-arrow)" />
      <text x="62" y="182" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        B(x) = B₀ + G·x
      </text>
      <line x1="50" y1="235" x2="525" y2="235" stroke="var(--muted)" strokeDasharray="6 6" />
      <text x="525" y="262" textAnchor="end" className="fig-label" style={{ fontSize: FS.label }}>
        B₀
      </text>
      <line x1="60" y1={yB(60)} x2="520" y2={yB(520)} stroke={C.yellow} strokeWidth="3.5" />
      {xs.map((x, i) => (
        <circle key={x} cx={x} cy={yB(x)} r="7" fill={colors[i]} stroke="var(--bg-2)" strokeWidth="2" />
      ))}

      {/* Frequenzen */}
      {xs.map((x, i) => (
        <g key={x}>
          <rect x={x - 62} y="318" width="124" height="70" rx="8" fill="var(--surface-2)" />
          <path d={sinePath(x - 56, 112, 353, 26, cycles[i])} fill="none" stroke={colors[i]} strokeWidth="2.5" />
          <text x={x} y="420" textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong, fill: colors[i] }}>
            f{['₁', '₂', '₃'][i]}
          </text>
        </g>
      ))}
      <text x="280" y="470" textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        f₁ &lt; f₂ &lt; f₃
      </text>
      <text x="280" y="494" textAnchor="middle" className="fig-label" style={{ fontSize: FS.small }}>
        {tr('mehr Feld, schnellere Präzession', 'сильнее поле, быстрее прецессия')}
      </text>
    </svg>
  );
}
