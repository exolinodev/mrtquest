import { useId, type KeyboardEvent, type SVGProps } from 'react';
import type { Loc } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';

export type ComponentId = 'cage' | 'cryostat' | 'coils' | 'coldhead' | 'quench' | 'shim' | 'gradient' | 'body' | 'surface' | 'table' | 'patient';

export const SCANNER_VISUALS: Record<ComponentId, { color: string; symbol: string; action: Loc; caption: Loc; anchor: [number, number] }> = {
  cage: { color: '#fbbf24', symbol: 'HF', action: { de: 'Störungen bleiben draußen.', ru: 'Помехи остаются снаружи.' }, caption: { de: 'Die Kabine schirmt äußere Funksignale ab.', ru: 'Кабина экранирует внешние радиосигналы.' }, anchor: [36, 210] },
  cryostat: { color: '#7dd3fc', symbol: '4,2 K', action: { de: 'Innen eiskalt. Außen Raumtemperatur.', ru: 'Внутри холод. Снаружи комнатная температура.' }, caption: { de: 'Vakuum und Isolationsschichten schützen das Heliumbad.', ru: 'Вакуум и слои изоляции защищают гелиевую ванну.' }, anchor: [424, 132] },
  coils: { color: '#38bdf8', symbol: 'B₀', action: { de: 'Das Hauptmagnetfeld ist immer an.', ru: 'Основное магнитное поле включено постоянно.' }, caption: { de: 'Die supraleitenden Spulen erzeugen das statische B₀-Feld.', ru: 'Сверхпроводящие катушки создают статическое поле B₀.' }, anchor: [445, 176] },
  coldhead: { color: '#67e8f9', symbol: '↓ K', action: { de: 'Helium wird wieder flüssig.', ru: 'Гелий снова становится жидким.' }, caption: { de: 'Der Kaltkopf kühlt das verdampfte Helium zurück.', ru: 'Криокулер вновь охлаждает испарившийся гелий.' }, anchor: [270, 61] },
  quench: { color: '#fb923c', symbol: 'He ↑', action: { de: 'Im Notfall: Helium sicher nach draußen.', ru: 'При квенче: гелий безопасно выходит наружу.' }, caption: { de: 'Das Rohr führt das verdampfende Helium ins Freie.', ru: 'Труба отводит испаряющийся гелий наружу.' }, anchor: [308, 38] },
  shim: { color: '#c4b5fd', symbol: 'ΔB₀', action: { de: 'Ein gleichmäßigeres Magnetfeld.', ru: 'Более однородное магнитное поле.' }, caption: { de: 'Shims korrigieren kleine Abweichungen im B₀-Feld.', ru: 'Шиммирование исправляет небольшие отклонения поля B₀.' }, anchor: [195, 156] },
  gradient: { color: '#34d399', symbol: 'x · y · z', action: { de: 'Das Signal bekommt einen Ort.', ru: 'Сигнал получает координаты.' }, caption: { de: 'Gradienten verändern das Magnetfeld gezielt mit dem Ort.', ru: 'Градиенты изменяют магнитное поле в зависимости от координат.' }, anchor: [433, 223] },
  body: { color: '#f472b6', symbol: 'B₁', action: { de: 'Der HF-Puls regt die Spins an.', ru: 'РЧ-импульс возбуждает спины.' }, caption: { de: 'Die Körperspule sendet das B₁-Feld in die Untersuchungsregion.', ru: 'Катушка тела передаёт поле B₁ в область исследования.' }, anchor: [208, 198] },
  surface: { color: '#a78bfa', symbol: 'SNR ↑', action: { de: 'Nah am Körper. Starkes Empfangssignal.', ru: 'Ближе к телу. Сильнее принимаемый сигнал.' }, caption: { de: 'Lokale Spulenelemente empfangen das schwache MR-Signal.', ru: 'Локальные элементы катушки принимают слабый МР-сигнал.' }, anchor: [300, 239] },
  table: { color: '#94a3b8', symbol: '→ ◎', action: { de: 'Die Anatomie fährt ins Isozentrum.', ru: 'Анатомическая область перемещается в изоцентр.' }, caption: { de: 'Der Tisch positioniert die Untersuchungsregion in der Feldmitte.', ru: 'Стол размещает область исследования в центре поля.' }, anchor: [372, 327] },
  patient: { color: '#fcd34d', symbol: '◎', action: { de: 'Hier entsteht das MR-Signal.', ru: 'Здесь возникает МР-сигнал.' }, caption: { de: 'Die untersuchte Anatomie liegt im Zentrum des Scanners.', ru: 'Исследуемая анатомия находится в центре сканера.' }, anchor: [300, 283] },
};

// The same geometry is used for the interactive anatomy and the topmost highlight.
// This keeps even narrow, nested rings visible when a component is selected.
function Shape({ id, props }: { id: ComponentId; props?: SVGProps<SVGElement> }) {
  switch (id) {
    case 'cage': return <rect x="22" y="18" width="556" height="438" rx="18" {...props as SVGProps<SVGRectElement>} />;
    case 'cryostat': return <circle cx="300" cy="260" r="180" {...props as SVGProps<SVGCircleElement>} />;
    case 'coils': return <g>{Array.from({ length: 6 }, (_, i) => {
      const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
      return <rect key={i} x={300 + Math.cos(a) * 168 - 10} y={260 + Math.sin(a) * 168 - 12} width="20" height="24" rx="5" transform={`rotate(${i * 60 - 60} ${300 + Math.cos(a) * 168} ${260 + Math.sin(a) * 168})`} {...props as SVGProps<SVGRectElement>} />;
    })}</g>;
    case 'coldhead': return <rect x="246" y="42" width="46" height="43" rx="8" {...props as SVGProps<SVGRectElement>} />;
    case 'quench': return <path d="M298 78 V23 H340" fill="none" strokeWidth="18" {...props as SVGProps<SVGPathElement>} />;
    case 'shim': return <circle cx="300" cy="260" r="148" {...props as SVGProps<SVGCircleElement>} />;
    case 'gradient': return <circle cx="300" cy="260" r="132" {...props as SVGProps<SVGCircleElement>} />;
    case 'body': return <circle cx="300" cy="260" r="110" {...props as SVGProps<SVGCircleElement>} />;
    case 'surface': return <path d="M235 258 Q300 220 365 258" fill="none" strokeWidth="10" strokeLinecap="round" {...props as SVGProps<SVGPathElement>} />;
    case 'table': return <rect x="211" y="318" width="178" height="18" rx="6" {...props as SVGProps<SVGRectElement>} />;
    case 'patient': return <ellipse cx="300" cy="282" rx="67" ry="32" {...props as SVGProps<SVGEllipseElement>} />;
  }
}

function FunctionOverlay({ id }: { id: ComponentId }) {
  if (id === 'coils' || id === 'shim') return <g className="sx-flow">
    {[-1, 0, 1].flatMap((row) => [-1, 0, 1].map((col) => <g key={`${row}-${col}`}>
      <circle cx={300 + col * 42} cy={260 + row * 42} r="10" />
      <circle cx={300 + col * 42} cy={260 + row * 42} r="2" fill="currentColor" />
    </g>))}
    {id === 'shim' && <rect x="231" y="191" width="138" height="138" rx="20" strokeDasharray="4 6" />}
    <text x="367" y="215">B₀</text>
  </g>;
  if (id === 'gradient') return <g className="sx-flow">
    {[-2, -1, 0, 1, 2].map((n) => <g key={n} opacity={0.5 + (n + 2) * 0.12}>
      <circle cx={300 + n * 31} cy="260" r={7 + (n + 2) * 2} />
      <circle cx={300 + n * 31} cy="260" r="2" fill="currentColor" />
    </g>)}
    <path d="M230 366 H370 m-8 -5 8 5 -8 5" /><text x="382" y="372">x</text>
    <text x="260" y="214">ΔB₀(x)</text>
  </g>;
  if (id === 'body') return <g className="sx-waves">
    {[42, 62, 82].map((r) => <circle key={r} cx="300" cy="260" r={r} className="sx-wave" style={{ animationDelay: `${r / -30}s` }} />)}
    <text x="291" y="211">B₁</text>
  </g>;
  if (id === 'surface') return <g className="sx-flow">
    {[0, 1, 2].map((i) => <path key={i} d={`M${265 + i * 35} 285 v-32 m-5 8 5 -8 5 8`} />)}
    <path d="M365 246 l20 -26 12 16 12 -31 12 19 12 -35" /><text x="389" y="178">MR</text>
  </g>;
  if (id === 'coldhead' || id === 'cryostat') return <g className="sx-flow">
    <path d="M270 88 v40 m-6 -10 6 10 6 -10" />
    {[0, 1, 2, 3, 4].map((i) => <circle className="sx-coolant" key={i} cx={230 + i * 35} cy={107 + Math.abs(i - 2) * 10} r="4" style={{ animationDelay: `${i * -0.4}s` }} />)}
    <text x="319" y="117">4,2 K</text>
  </g>;
  if (id === 'quench') return <g className="sx-flow sx-flow-out">
    <path d="M300 120 V26 H402 m-12 -7 12 7 -12 7" /><text x="360" y="58">He ↑</text>
  </g>;
  if (id === 'cage') return <g className="sx-flow">
    {[155, 235, 315].map((y) => <g key={y}><path d={`M60 ${y} l12 -10 12 20 12 -20 12 10`} /><path d={`M114 ${y - 15} v30`} /></g>)}
    <text x="61" y="358">HF</text>
  </g>;
  if (id === 'table') return <g className="sx-flow">
    <path d="M233 362 H367 m-12 -7 12 7 -12 7" /><path d="M300 190 v30 m-15 -15 h30" />
  </g>;
  return <g className="sx-flow">
    <path d="M300 206 v27 M287 220 h26" />
    {[263, 290, 317, 344].map((x) => <path key={x} d={`M${x} 295 v-23 m-4 6 4 -6 4 6`} />)}
  </g>;
}

export function ScannerDiagram({ selected, expected, incorrect, disabled, titles, detailsId, onChoose }: {
  selected: ComponentId | null; expected?: ComponentId; incorrect?: ComponentId; disabled: boolean;
  titles: Record<ComponentId, { title: Loc }>; detailsId: string; onChoose: (id: ComponentId) => void;
}) {
  const { tr, loc } = useLang();
  const gradientId = useId();
  const focus = expected ?? selected;
  const part = (id: ComponentId): SVGProps<SVGElement> => ({
    className: `sx-part${focus === id ? ' active' : ''}${expected === id ? ' expected' : ''}${incorrect === id ? ' incorrect' : ''}`,
    'data-part': id,
    onClick: () => onChoose(id), role: 'button', tabIndex: disabled ? -1 : 0,
    'aria-label': loc(titles[id].title), 'aria-pressed': selected === id, 'aria-controls': detailsId,
    'aria-disabled': disabled || undefined,
    onKeyDown: (event: KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onChoose(id); }
    },
  } as SVGProps<SVGElement>);
  return <svg viewBox="0 0 600 470" className="scanner-svg" data-focus={focus ?? undefined} aria-label={tr('Interaktiver Scanner-Querschnitt', 'Интерактивное сечение сканера')}>
    <defs>
      <radialGradient id={gradientId}><stop stopColor="#243758" /><stop offset="1" stopColor="#0a1122" /></radialGradient>
    </defs>
    <rect width="600" height="470" fill={`url(#${gradientId})`} rx="18" />
    <g className="sx-grid" aria-hidden="true">{[100, 200, 300, 400, 500].map((x) => <path key={x} d={`M${x} 20 V450 M24 ${x - 50} H576`} />)}</g>
    <g className="sx-anatomy">
      {(['cage', 'quench', 'coldhead', 'cryostat'] as ComponentId[]).map((id) => <Shape key={id} id={id} props={part(id)} />)}
      <circle cx="300" cy="260" r="160" className="sx-gap" />
      {(['coils', 'shim', 'gradient', 'body'] as ComponentId[]).map((id) => <Shape key={id} id={id} props={part(id)} />)}
      <circle cx="300" cy="260" r="98" className="sx-bore" />
      {(['table', 'patient', 'surface'] as ComponentId[]).map((id) => <Shape key={id} id={id} props={part(id)} />)}
    </g>
    <g className="sx-technical" aria-hidden="true">
      <path d="M145 390 l-21 24 M455 390 l21 24 M300 72 v-13" />
      <text x="38" y="434">{tr('QUERSCHNITT', 'ПОПЕРЕЧНОЕ СЕЧЕНИЕ')}</text>
      <text x="476" y="434">{tr('SCHEMA', 'СХЕМА')}</text>
    </g>
    {focus && <g className="sx-focus-layer" aria-hidden="true" key={focus}>
      <Shape id={focus} props={{ className: 'sx-focus-shape' }} />
      {incorrect && incorrect !== focus && <Shape id={incorrect} props={{ className: 'sx-wrong-shape' }} />}
      <FunctionOverlay id={focus} />
      <circle className="sx-location-halo" cx={SCANNER_VISUALS[focus].anchor[0]} cy={SCANNER_VISUALS[focus].anchor[1]} r="16" />
      <circle className="sx-location-dot" cx={SCANNER_VISUALS[focus].anchor[0]} cy={SCANNER_VISUALS[focus].anchor[1]} r="5" />
    </g>}
  </svg>;
}
