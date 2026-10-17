import { useLang } from '../../i18n/LanguageContext';
import { ArrowDefs, C, FS, fnPath } from './figB-util';

const HARMONICS = [
  { n: 1, color: C.blue, label: 'sin t', amp: '1' },
  { n: 2, color: C.green, label: '½ sin 2t', amp: '½' },
  { n: 3, color: C.pink, label: '⅓ sin 3t', amp: '⅓' },
];
const PERIODS = 2; // gezeigter Bereich: t ∈ [0, 4π]

/** Drei Sinuswellen, ihre Summe (Annäherung an den Sägezahn) und das Amplitudenspektrum. */
export function FourierSum() {
  const { tr } = useLang();
  const tOf = (u: number) => u * PERIODS * 2 * Math.PI;
  const partial = (u: number) => HARMONICS.reduce((s, h) => s + Math.sin(h.n * tOf(u)) / h.n, 0);
  // Idealer Sägezahn (π − t)/2 auf (0, 2π), periodisch fortgesetzt
  const saw = (u: number) => {
    const t = tOf(u) % (2 * Math.PI);
    return (Math.PI - t) / 2;
  };
  const unit = 30; // Amplitude 1 ↔ 30 Einheiten
  const wx = 24;
  const ww = 200;
  const barBase = 330;
  const barH = 170; // Amplitude 1 ↔ 170 Einheiten
  return (
    <svg viewBox="0 0 560 440" role="img" aria-label={tr('Fourier-Summe und Spektrum', 'Сумма Фурье и спектр')}>
      <ArrowDefs id="fs-arrow" />
      {/* Einzelwellen */}
      {HARMONICS.map((h, i) => {
        const yc = 44 + i * 68;
        return (
          <g key={h.n}>
            <line x1={wx} y1={yc} x2={wx + ww} y2={yc} stroke="var(--muted)" strokeWidth="1" opacity="0.6" />
            <path d={fnPath(wx, ww, yc, unit, (u) => Math.sin(h.n * tOf(u)) / h.n, 200)} fill="none" stroke={h.color} strokeWidth="2.5" />
            <text x={wx + ww + 10} y={yc + 7} className="fig-label-strong" style={{ fontSize: FS.strong, fill: h.color }}>
              {h.label}
            </text>
          </g>
        );
      })}
      {/* Σ-Pfeil */}
      <line x1={wx + ww / 2} y1="208" x2={wx + ww / 2} y2="250" stroke="var(--muted)" strokeWidth="2.5" markerEnd="url(#fs-arrow)" />
      <text x={wx + ww / 2 + 16} y="240" className="fig-label-strong" style={{ fontSize: 30 }}>
        Σ
      </text>
      {/* Summe */}
      <line x1={wx} y1="330" x2={wx + ww} y2="330" stroke="var(--muted)" strokeWidth="1" opacity="0.6" />
      <path d={fnPath(wx, ww, 330, unit, saw, 400)} fill="none" stroke="var(--text-dim)" strokeWidth="1.5" strokeDasharray="5 5" />
      <path d={fnPath(wx, ww, 330, unit, partial, 400)} fill="none" stroke={C.yellow} strokeWidth="3" />
      <text x={wx} y="405" className="fig-label-strong" style={{ fontSize: FS.strong, fill: C.yellow }}>
        {tr('Summe', 'Сумма')}
      </text>
      <text x={wx} y="430" className="fig-label" style={{ fontSize: FS.small }}>
        {tr('gestrichelt: Sägezahn', 'пунктир: пила')}
      </text>

      {/* Spektrum */}
      <text x="460" y="40" textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        {tr('Spektrum', 'Спектр')}
      </text>
      <line x1="372" y1={barBase} x2="552" y2={barBase} className="fig-axis" />
      <line x1="372" y1={barBase} x2="372" y2="70" className="fig-axis" markerEnd="url(#fs-arrow)" />
      {[1, 2, 3, 4, 5].map((n) => {
        const h = HARMONICS[n - 1];
        const x = 372 + n * 32 - 12;
        const height = barH / n;
        return (
          <g key={n}>
            <rect
              x={x - 11}
              y={barBase - height}
              width="22"
              height={height}
              fill={h ? h.color : 'none'}
              stroke={h ? h.color : 'var(--muted)'}
              strokeDasharray={h ? undefined : '4 3'}
              fillOpacity={h ? 0.85 : 0}
            />
            {h && (
              <text x={x} y={barBase - height - 8} textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong, fill: h.color }}>
                {h.amp}
              </text>
            )}
            <text x={x} y={barBase + 26} textAnchor="middle" className="fig-label" style={{ fontSize: FS.label }}>
              {n}
            </text>
          </g>
        );
      })}
      <text x="462" y={barBase + 54} textAnchor="middle" className="fig-label" style={{ fontSize: FS.small }}>
        {tr('Frequenz n', 'частота n')}
      </text>
      <text x="386" y="86" className="fig-label" style={{ fontSize: FS.small }}>
        {tr('Amplitude', 'амплитуда')}
      </text>
    </svg>
  );
}
