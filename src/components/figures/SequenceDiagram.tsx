import type { ReactNode } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { ArrowDefs, C, FS, Sub, fnPath } from './figB-util';

const T90 = 120;
const T180 = 270;
const TECHO = 420; // TE = 2 · (T180 − T90)
const TNEXT = 530;
const ROWS = { hf: 62, ss: 140, pe: 218, ro: 296, sig: 372 };

function sinc(u: number) {
  const x = (u - 0.5) * 6 * Math.PI;
  return Math.abs(x) < 1e-6 ? 1 : Math.sin(x) / x;
}

/** Trapez mit Mitte t, Plateaubreite w, Rampe r und Höhe h über der Grundlinie y0 (h < 0 = negativ). */
function trap(t: number, w: number, h: number, y0: number, r = 6) {
  const a = t - w / 2 - r;
  const b = t + w / 2 + r;
  return `M${a},${y0} L${a + r},${y0 - h} L${b - r},${y0 - h} L${b},${y0} Z`;
}

/** Vereinfachtes Pulsdiagramm einer Spin-Echo-Sequenz. */
export function SequenceDiagram() {
  const { tr } = useLang();
  const x0 = 96;
  const x1 = 548;
  const rowLabel = (y: number, node: ReactNode) => (
    <text x="4" y={y + 7} className="fig-label-strong" style={{ fontSize: FS.strong }}>
      {node}
    </text>
  );
  const peLevels = [-26, -17, -9, 0, 9, 17, 26];
  return (
    <svg viewBox="0 0 560 500" role="img" aria-label={tr('Pulsdiagramm einer Spin-Echo-Sequenz', 'Диаграмма импульсов последовательности спин-эхо')}>
      <ArrowDefs id="sd-arrow" color="var(--text-dim)" />
      {/* Zeitmarken */}
      {[T90, TECHO, TNEXT].map((t) => (
        <line key={t} x1={t} y1="22" x2={t} y2="470" stroke="var(--muted)" strokeDasharray="3 5" opacity="0.6" />
      ))}
      {Object.values(ROWS).map((y) => (
        <line key={y} x1={x0} y1={y} x2={x1} y2={y} stroke="var(--muted)" strokeWidth="1.2" />
      ))}
      {rowLabel(ROWS.hf, tr('HF', 'РЧ'))}
      {rowLabel(ROWS.ss, <Sub base="G" sub="SS" />)}
      {rowLabel(ROWS.pe, <Sub base="G" sub="PE" />)}
      {rowLabel(ROWS.ro, <Sub base="G" sub="RO" />)}
      {rowLabel(ROWS.sig, tr('Signal', 'Сигнал'))}

      {/* HF-Pulse */}
      <path d={fnPath(T90 - 22, 44, ROWS.hf, 28, sinc)} fill="none" stroke={C.yellow} strokeWidth="2.5" />
      <path d={fnPath(T180 - 22, 44, ROWS.hf, 44, sinc)} fill="none" stroke={C.yellow} strokeWidth="2.5" />
      <path d={fnPath(TNEXT - 16, 32, ROWS.hf, 28, sinc)} fill="none" stroke={C.yellow} strokeWidth="2.5" />
      <text x={T90 + 26} y={ROWS.hf - 18} className="fig-label-strong" style={{ fontSize: FS.strong, fill: C.yellow }}>
        90°
      </text>
      <text x={T180 + 26} y={ROWS.hf - 22} className="fig-label-strong" style={{ fontSize: FS.strong, fill: C.yellow }}>
        180°
      </text>

      {/* Schichtgradient */}
      <g fill={C.blue} fillOpacity="0.35" stroke={C.blue} strokeWidth="2">
        <path d={trap(T90, 44, 26, ROWS.ss)} />
        <path d={trap(T90 + 42, 14, -16, ROWS.ss, 5)} />
        <path d={trap(T180, 44, 26, ROWS.ss)} />
        <path d={trap(TNEXT, 28, 26, ROWS.ss)} />
      </g>

      {/* Phasengradient als Leiter */}
      <g stroke={C.violet} strokeWidth="2">
        <rect x="168" y={ROWS.pe - 26} width="40" height="52" fill={C.violet} fillOpacity="0.15" />
        {peLevels.map((h) => (
          <line key={h} x1="168" y1={ROWS.pe - h} x2="208" y2={ROWS.pe - h} />
        ))}
      </g>

      {/* Auslesegradient: Vorphasierer und Auslese */}
      <g fill={C.green} fillOpacity="0.35" stroke={C.green} strokeWidth="2">
        <path d={trap(214, 40, 20, ROWS.ro)} />
        <path d={trap(TECHO, 108, 20, ROWS.ro)} />
      </g>

      {/* Signal: FID und Echo */}
      <path
        d={fnPath(T90 + 20, 70, ROWS.sig, 26, (u) => Math.exp(-u * 3.2) * Math.cos(u * 9 * Math.PI))}
        fill="none"
        stroke={C.pink}
        strokeWidth="2"
        opacity="0.7"
      />
      <path
        d={fnPath(TECHO - 60, 120, ROWS.sig, 30, (u) => {
          const z = (u - 0.5) * 120;
          return Math.exp(-((z / 24) ** 2)) * Math.cos(z * 0.32);
        }, 240)}
        fill="none"
        stroke={C.pink}
        strokeWidth="2.5"
      />
      <text x={TECHO + 40} y={ROWS.sig - 18} className="fig-label" style={{ fontSize: FS.label, fill: C.pink }}>
        {tr('Echo', 'Эхо')}
      </text>

      {/* TE und TR */}
      <line x1={T90} y1="420" x2={TECHO} y2="420" stroke="var(--text-dim)" strokeWidth="1.8" markerStart="url(#sd-arrow)" markerEnd="url(#sd-arrow)" />
      <text x={(T90 + TECHO) / 2} y="412" textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        TE
      </text>
      <line x1={T90} y1="466" x2={TNEXT} y2="466" stroke="var(--text-dim)" strokeWidth="1.8" markerStart="url(#sd-arrow)" markerEnd="url(#sd-arrow)" />
      <text x={(T90 + TNEXT) / 2} y="458" textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        TR
      </text>
      <text x={x1} y="494" textAnchor="end" className="fig-label" style={{ fontSize: FS.small }}>
        {tr('Zeit →', 'время →')}
      </text>
    </svg>
  );
}
