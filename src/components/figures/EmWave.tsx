import { useLang } from '../../i18n/LanguageContext';
import { ArrowDefs, C, FS, fnPath } from './figB-util';

const Y0 = 160; // Ausbreitungsachse
const Z0 = 24;
const Z1 = 420; // Ort der Antenne
const LAMBDA = 176;
const AE = 70;
const AB = 62;
// Schräge Projektion der dritten Achse: B steht senkrecht auf E und auf der Ausbreitungsrichtung.
const DEPTH = { x: -0.4, y: 0.5 };

/** Transversale elektromagnetische Welle und eine Antenne, die an einem festen Ort E(t) misst. */
export function EmWave() {
  const { tr } = useLang();
  const phase = (z: number) => (2 * Math.PI * (z - Z0)) / LAMBDA;
  const sticks: number[] = [];
  for (let z = Z0; z <= Z1; z += 11) sticks.push(z);
  let ePath = '';
  let bPath = '';
  for (let z = Z0; z <= Z1; z += 2) {
    const s = Math.sin(phase(z));
    ePath += `${z === Z0 ? 'M' : 'L'}${z},${(Y0 - AE * s).toFixed(1)}`;
    bPath += `${z === Z0 ? 'M' : 'L'}${(z + AB * s * DEPTH.x).toFixed(1)},${(Y0 + AB * s * DEPTH.y).toFixed(1)}`;
  }
  const crest1 = Z0 + LAMBDA / 4;
  const crest2 = crest1 + LAMBDA;
  const phi = 0.7;
  return (
    <svg viewBox="0 0 540 500" role="img" aria-label={tr('Elektromagnetische Welle und Antenne', 'Электромагнитная волна и антенна')}>
      <ArrowDefs id="em-arrow" color="var(--text-dim)" />
      {/* B-Feld (schräg, „in die Tiefe“) */}
      <g stroke={C.violet} strokeWidth="1.2" opacity="0.55">
        {sticks.map((z) => {
          const s = Math.sin(phase(z));
          return <line key={z} x1={z} y1={Y0} x2={z + AB * s * DEPTH.x} y2={Y0 + AB * s * DEPTH.y} />;
        })}
      </g>
      <path d={bPath} fill="none" stroke={C.violet} strokeWidth="2.5" />
      {/* E-Feld (senkrecht) */}
      <g stroke={C.blue} strokeWidth="1.2" opacity="0.55">
        {sticks.map((z) => (
          <line key={z} x1={z} y1={Y0} x2={z} y2={Y0 - AE * Math.sin(phase(z))} />
        ))}
      </g>
      <path d={ePath} fill="none" stroke={C.blue} strokeWidth="3" />
      {/* Achse */}
      <line x1={Z0 - 10} y1={Y0} x2={Z1 + 10} y2={Y0} stroke="var(--text-dim)" strokeWidth="2" markerEnd="url(#em-arrow)" />
      <text x={Z0} y={Y0 + 96} className="fig-label" style={{ fontSize: FS.small }}>
        {tr('Ausbreitung →', 'распространение →')}
      </text>
      <text x={crest1 - 6} y={Y0 - AE - 10} textAnchor="end" className="fig-label-strong" style={{ fontSize: FS.strong, fill: C.blue }}>
        E
      </text>
      <text x={crest1 - 52} y={Y0 + 58} className="fig-label-strong" style={{ fontSize: FS.strong, fill: C.violet }}>
        B
      </text>
      {/* Wellenlänge */}
      <line x1={crest1} y1="44" x2={crest2} y2="44" stroke="var(--text-dim)" strokeWidth="1.8" markerStart="url(#em-arrow)" markerEnd="url(#em-arrow)" />
      <line x1={crest1} y1="36" x2={crest1} y2={Y0 - AE} stroke="var(--muted)" strokeDasharray="3 4" />
      <line x1={crest2} y1="36" x2={crest2} y2={Y0 - AE} stroke="var(--muted)" strokeDasharray="3 4" />
      <text x={(crest1 + crest2) / 2} y="34" textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        λ
      </text>

      {/* Antenne */}
      <rect x={Z1 + 22} y={Y0 - 92} width="14" height="184" rx="4" fill={C.red} fillOpacity="0.25" stroke={C.red} strokeWidth="2" />
      <text x={Z1 + 29} y={Y0 + 120} textAnchor="middle" className="fig-label-strong" style={{ fontSize: FS.strong, fill: C.red }}>
        {tr('Antenne', 'Антенна')}
      </text>
      <line x1={Z1 + 29} y1={Y0 + 128} x2={Z1 + 29} y2="318" stroke={C.red} strokeWidth="1.5" strokeDasharray="4 4" />

      {/* Messung am festen Ort */}
      <rect x="10" y="318" width="520" height="172" rx="10" fill="var(--surface-2)" />
      <text x="24" y="350" className="fig-label-strong" style={{ fontSize: FS.strong }}>
        E(t) = Ê · cos(ωt + φ)
      </text>
      <text x="516" y="350" textAnchor="end" className="fig-label" style={{ fontSize: FS.small }}>
        {tr('am festen Ort', 'в одной точке')}
      </text>
      <line x1="30" y1="420" x2="515" y2="420" className="fig-axis" markerEnd="url(#em-arrow)" />
      <text x="512" y="448" textAnchor="end" className="fig-label" style={{ fontSize: FS.label }}>
        t
      </text>
      <path d={fnPath(30, 470, 420, 50, (u) => Math.cos(2 * Math.PI * 3.2 * u + phi), 300)} fill="none" stroke={C.blue} strokeWidth="3" />
      {/* Amplitude Ê am ersten Maximum nach t = 0 */}
      {(() => {
        const u = (2 * Math.PI - phi) / (2 * Math.PI * 3.2);
        const x = 30 + 470 * u;
        return (
          <g>
            <line x1={x} y1="420" x2={x} y2="372" stroke={C.yellow} strokeWidth="2" markerEnd="url(#em-arrow)" />
            <text x={x + 8} y="402" className="fig-label-strong" style={{ fontSize: FS.strong, fill: C.yellow }}>
              Ê
            </text>
          </g>
        );
      })()}
    </svg>
  );
}
