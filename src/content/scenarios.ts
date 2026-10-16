/**
 * Klinische Trade-off-Szenarien für die Protokoll-Konsole.
 * Jedes Szenario definiert Startprotokoll, frei einstellbare Parameter und
 * harte (müssen) sowie weiche (Sterne) Anforderungen.
 */
import { TISSUES } from '../physics/constants';
import { nullPointTI } from '../physics/mri';
import type { Protocol, ProtocolMetrics, SequenceType } from '../physics/protocol';
import { DEFAULT_PROTOCOL } from '../physics/protocol';
import type { PhantomId } from '../physics/phantom';

export type ParamKey = keyof Omit<Protocol, 'sequence' | 'field' | 'fatSat'> | 'sequence' | 'field' | 'fatSat';

export interface Requirement {
  id: string;
  label: string;
  /** hard = Bedingung für das Bestehen, sonst Bonusstern */
  hard: boolean;
  check: (p: Protocol, m: ProtocolMetrics) => boolean;
  /** kurze Live-Anzeige des aktuellen Werts */
  value?: (p: Protocol, m: ProtocolMetrics) => string;
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  difficulty: 1 | 2 | 3;
  anatomy: PhantomId;
  story: string;
  task: string;
  start: Protocol;
  editable: ParamKey[];
  allowedSequences: SequenceType[];
  requirements: Requirement[];
  debrief: string;
  xp: number;
}

const s = (v: number) => `${Math.round(v)} s`;

const errorsFree: Requirement = {
  id: 'valid',
  label: 'Protokoll technisch durchführbar (keine Timing- oder SAR-Fehler)',
  hard: true,
  check: (_p, m) => !m.issues.some((i) => i.severity === 'error'),
};

const noAliasing: Requirement = {
  id: 'alias',
  label: 'Keine Einfaltung in Phasenrichtung',
  hard: true,
  check: (_p, m) => !m.aliasing,
  value: (_p, m) => (m.aliasing ? `${Math.round(m.aliasingMm)} mm zu klein` : 'ok'),
};

const sarNormal: Requirement = {
  id: 'sar-normal',
  label: 'SAR im Normal Mode (≤ 2,0 W/kg)',
  hard: true,
  check: (_p, m) => m.sar <= 2,
  value: (_p, m) => `${m.sar.toFixed(2)} W/kg`,
};

const snrAtLeast = (min: number, hard: boolean): Requirement => ({
  id: `snr-${min}-${hard ? 'h' : 's'}`,
  label: `SNR (Referenzgewebe) ≥ ${min}`,
  hard,
  check: (_p, m) => m.snr >= min,
  value: (_p, m) => m.snr.toFixed(1),
});

const timeAtMost = (sec: number, hard: boolean): Requirement => ({
  id: `ta-${sec}-${hard ? 'h' : 's'}`,
  label: `Messzeit ≤ ${sec >= 60 ? `${(sec / 60).toLocaleString('de-DE')} min` : `${sec} s`}`,
  hard,
  check: (_p, m) => m.scanTimeS <= sec,
  value: (_p, m) => s(m.scanTimeS),
});

const pixelAtMost = (mm: number, hard: boolean): Requirement => ({
  id: `px-${mm}-${hard ? 'h' : 's'}`,
  label: `In-plane-Auflösung ≤ ${mm.toLocaleString('de-DE')} mm`,
  hard,
  check: (_p, m) => Math.max(m.pixelRead, m.pixelPhase) <= mm + 1e-6,
  value: (_p, m) => `${Math.max(m.pixelRead, m.pixelPhase).toFixed(2)} mm`,
});

export const SCENARIOS: Scenario[] = [
  {
    id: 'ms-flair',
    title: 'Verdacht auf Multiple Sklerose',
    icon: '🧠',
    difficulty: 1,
    anatomy: 'brain',
    story:
      'Eine 29-jährige Patientin mit Sehstörungen und Kribbelparästhesien. Die Neurologie fragt nach periventrikulären Entmarkungsherden. Auf T2w liegen diese direkt neben dem ebenfalls hellen Liquor – schwer abzugrenzen.',
    task: 'Erstelle eine FLAIR: Der Liquor muss genullt sein, die Läsionen sollen heller als die weiße Substanz erscheinen.',
    start: { ...DEFAULT_PROTOCOL, sequence: 'IR', tr: 9000, te: 100, ti: 800, etl: 16, slices: 24 },
    editable: ['tr', 'te', 'ti', 'etl', 'nex', 'bandwidthPerPixel', 'matrixPhase', 'sliceThickness'],
    allowedSequences: ['IR'],
    requirements: [
      errorsFree,
      {
        id: 'csf-null',
        label: 'Liquorsignal < 15 % der weißen Substanz',
        hard: true,
        check: (_p, m) => m.signals.csf < 0.15 * m.signals.wm,
        value: (_p, m) => `${Math.round((m.signals.csf / Math.max(m.signals.wm, 1e-6)) * 100)} %`,
      },
      {
        id: 'lesion-bright',
        label: 'Läsion mindestens 30 % heller als weiße Substanz',
        hard: true,
        check: (_p, m) => m.signals.lesion >= 1.3 * m.signals.wm,
        value: (_p, m) => `${Math.round((m.signals.lesion / Math.max(m.signals.wm, 1e-6) - 1) * 100)} %`,
      },
      timeAtMost(300, true),
      snrAtLeast(12, false),
      timeAtMost(200, false),
    ],
    debrief:
      'Für die Liquorunterdrückung gilt TI ≈ T1·ln 2 ≈ 0,69·T1(CSF), korrigiert für endliches TR: TI = T1·ln(2/(1+e^(−TR/T1))). Ein langes TR (≥ 8 s) lässt die Längsmagnetisierung vollständig erholen, ein TE um 90–120 ms erzeugt die T2-Gewichtung, in der Läsionen hell erscheinen.',
    xp: 120,
  },
  {
    id: 'claustro-brain',
    title: 'Klaustrophobie – schnelle T2w',
    icon: '😰',
    difficulty: 1,
    anatomy: 'brain',
    story:
      'Ein 71-jähriger Patient hält es höchstens zwei Minuten im Tunnel aus. Gefragt ist eine diagnostisch verwertbare axiale T2w des Kopfes zum Ausschluss einer Raumforderung.',
    task: 'Verkürze die T2-TSE auf unter 2 min, ohne dass das SNR unter 15 fällt.',
    start: { ...DEFAULT_PROTOCOL, sequence: 'TSE', tr: 5000, te: 100, etl: 8, nex: 2, matrixPhase: 320, matrixRead: 320 },
    editable: ['tr', 'te', 'etl', 'nex', 'matrixPhase', 'matrixRead', 'bandwidthPerPixel', 'acceleration', 'sliceThickness', 'slices'],
    allowedSequences: ['TSE'],
    requirements: [
      errorsFree,
      timeAtMost(120, true),
      snrAtLeast(15, true),
      {
        id: 't2w',
        label: 'T2-Gewichtung (TR ≥ 2000 ms, TE ≥ 70 ms)',
        hard: true,
        check: (p) => p.tr >= 2000 && p.te >= 70,
      },
      { id: 'coverage', label: 'Ganzhirnabdeckung: ≥ 22 Schichten à ≤ 5 mm', hard: true, check: (p) => p.slices >= 22 && p.sliceThickness <= 5 },
      timeAtMost(75, false),
      pixelAtMost(0.9, false),
    ],
    debrief:
      'Die Messzeit TA = TR·N_PE·NEX/(ETL·R) lässt sich über ETL, NEX, Phasenmatrix und parallele Bildgebung senken. Jede Halbierung von NEX kostet √2 an SNR, ein größerer ETL kostet kaum SNR, erhöht aber Blurring und SAR. Parallelbildgebung (R) reduziert das SNR um g·√R.',
    xp: 120,
  },
  {
    id: 'knee-stir-3t',
    title: 'Knochenmarködem nach Sportunfall (3 T)',
    icon: '🦵',
    difficulty: 2,
    anatomy: 'knee',
    story:
      'Ein Fußballspieler mit Distorsionstrauma des Knies. Gesucht wird ein Knochenmarködem („bone bruise“) im Femurkondylus. Am 3-T-Gerät ist das SAR-Budget knapp – die Patientin vor ihm hatte eine erhöhte Körpertemperatur, daher wird nur der Normal Mode freigegeben.',
    task: 'Erstelle eine STIR mit vollständig unterdrücktem Fettsignal im Normal Mode, Auflösung ≤ 0,6 mm.',
    start: { ...DEFAULT_PROTOCOL, sequence: 'IR', field: 3, tr: 3000, te: 40, ti: 500, etl: 12, fovRead: 160, fovPhase: 180, matrixRead: 256, matrixPhase: 256, slices: 30, sliceThickness: 3, bandwidthPerPixel: 250 },
    editable: ['tr', 'te', 'ti', 'etl', 'refocusFlip', 'slices', 'matrixRead', 'matrixPhase', 'nex', 'bandwidthPerPixel', 'fovPhase', 'phaseOversampling'],
    allowedSequences: ['IR'],
    requirements: [
      errorsFree,
      sarNormal,
      {
        id: 'fat-null',
        label: 'Fettsignal < 15 % des Muskelsignals',
        hard: true,
        check: (_p, m) => m.signals.fat < 0.15 * m.signals.muscle,
        value: (_p, m) => `${Math.round((m.signals.fat / Math.max(m.signals.muscle, 1e-6)) * 100)} %`,
      },
      noAliasing,
      pixelAtMost(0.6, true),
      { id: 'slices', label: 'Mindestens 24 Schichten', hard: true, check: (p) => p.slices >= 24 },
      timeAtMost(300, false),
      snrAtLeast(8, false),
    ],
    debrief:
      'Fett hat bei 3 T ein T1 von ≈ 370 ms → TI ≈ 0,69·370 ≈ 250 ms (bei endlichem TR etwas weniger). SAR skaliert mit B₀² und dem Quadrat des Flipwinkels: Ein Refokussierungswinkel von 120–150° statt 180°, längeres TR oder weniger Schichten pro TR halten den Normal Mode ein. Das Phasen-FOV muss das gesamte Knie (180 mm) abdecken – sonst faltet Gewebe ein.',
    xp: 150,
  },
  {
    id: 'liver-breathhold',
    title: 'Leberläsion in Atemanhalt',
    icon: '🫁',
    difficulty: 2,
    anatomy: 'abdomen',
    story:
      'Im Ultraschall zeigt sich ein unklarer Leberherd. Die 58-jährige Patientin kann maximal 18 Sekunden die Luft anhalten. Atembewegung erzeugt sonst Geisterbilder in Phasenrichtung.',
    task: 'Wähle eine Sequenz und Parameter für eine T1-gewichtete Aufnahme in einem Atemanhalt ohne Einfaltung.',
    start: { ...DEFAULT_PROTOCOL, sequence: 'SE', tr: 550, te: 15, etl: 1, fovRead: 400, fovPhase: 300, matrixRead: 256, matrixPhase: 192, slices: 20, sliceThickness: 6, flip: 70, bandwidthPerPixel: 200 },
    editable: ['sequence', 'tr', 'te', 'flip', 'fovPhase', 'phaseOversampling', 'matrixPhase', 'matrixRead', 'nex', 'acceleration', 'bandwidthPerPixel', 'slices'],
    allowedSequences: ['SE', 'GRE'],
    requirements: [
      errorsFree,
      timeAtMost(18, true),
      noAliasing,
      {
        id: 't1w',
        label: 'T1-Kontrast: Leber heller als Läsion um ≥ 25 %',
        hard: true,
        check: (_p, m) => m.signals.liver >= 1.25 * m.signals.lesion,
        value: (_p, m) => `${Math.round((m.signals.liver / Math.max(m.signals.lesion, 1e-6) - 1) * 100)} %`,
      },
      { id: 'slices', label: 'Leberabdeckung: ≥ 20 Schichten', hard: true, check: (p) => p.slices >= 20 },
      snrAtLeast(10, false),
      {
        id: 'cs',
        label: 'Chemische Verschiebung ≤ 1,5 px',
        hard: false,
        check: (_p, m) => m.chemicalShiftPx <= 1.5,
        value: (_p, m) => `${m.chemicalShiftPx.toFixed(2)} px`,
      },
    ],
    debrief:
      'Ein konventionelles SE benötigt für jede Phasenkodierzeile ein TR – Atemanhalt ist damit unmöglich. Ein gespoiltes GRE mit kurzem TR (≈ 150–200 ms, Multi-Slice) und mittlerem Flipwinkel liefert T1-Kontrast in Sekunden. Die Bauchbreite (380 mm) erfordert ein ausreichendes Phasen-FOV bzw. Oversampling, parallele Bildgebung verkürzt zusätzlich.',
    xp: 150,
  },
  {
    id: 'stroke-dwi',
    title: 'Akuter Schlaganfall – Time is Brain',
    icon: '⚡',
    difficulty: 3,
    anatomy: 'brain',
    story:
      'Stroke-Alarm: 64-jähriger Patient, Symptombeginn vor 90 Minuten. Für die Lysetherapie-Entscheidung braucht es in kürzester Zeit eine diffusionsgewichtete Basis-EPI. Problem: EPI ist extrem anfällig für Verzerrungen an der Schädelbasis.',
    task: 'Erstelle eine EPI unter 30 s mit Verzerrung ≤ 3 px und ohne Fett-Geister.',
    start: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 90, etl: 1, matrixRead: 128, matrixPhase: 128, fovRead: 230, fovPhase: 230, bandwidthPerPixel: 1000, nex: 4, slices: 24, acceleration: 1 },
    editable: ['tr', 'te', 'matrixPhase', 'matrixRead', 'bandwidthPerPixel', 'acceleration', 'nex', 'fatSat', 'slices', 'field'],
    allowedSequences: ['EPI'],
    requirements: [
      errorsFree,
      timeAtMost(30, true),
      {
        id: 'distortion',
        label: 'Suszeptibilitätsverzerrung ≤ 3 px',
        hard: true,
        check: (_p, m) => m.epiDistortionPx <= 3,
        value: (_p, m) => `${m.epiDistortionPx.toFixed(1)} px`,
      },
      {
        id: 'fatsat',
        label: 'Fettverschiebung (Phasenrichtung) ≤ 1 px',
        hard: true,
        check: (_p, m) => m.chemicalShiftPx <= 1,
        value: (_p, m) => `${m.chemicalShiftPx.toFixed(1)} px`,
      },
      { id: 'coverage', label: '≥ 20 Schichten', hard: true, check: (p) => p.slices >= 20 },
      snrAtLeast(6, false),
      pixelAtMost(1.8, false),
    ],
    debrief:
      'Bei EPI ist die Bandbreite pro Pixel in Phasenrichtung winzig (≈ 1/(ESP·N_PE)). Verzerrungen ∝ Δf/BW_PE lassen sich durch parallele Bildgebung (kürzerer Echozug), höhere Ausleseband­breite (kürzeres ESP) oder kleinere Phasenmatrix reduzieren. Fett verschiebt sich um viele Pixel – Fettsättigung ist bei EPI Pflicht. 1,5 T halbiert die Off-Resonanz gegenüber 3 T.',
    xp: 180,
  },
  {
    id: 'implant-spine',
    title: 'Patient mit Neurostimulator',
    icon: '🔌',
    difficulty: 3,
    anatomy: 'brain',
    story:
      'Ein Patient mit MR-bedingt sicherem Rückenmark-Stimulator benötigt eine Kopf-MRT. Laut Herstellerangaben gilt: nur 1,5 T, Ganzkörper-SAR ≤ 1,0 W/kg, Kopf-Bildgebung erlaubt. Die Radiologie wünscht eine T2w-TSE mit guter Auflösung.',
    task: 'Optimiere die T2-TSE unter der strengen SAR-Grenze von 1,0 W/kg.',
    start: { ...DEFAULT_PROTOCOL, sequence: 'TSE', field: 3, tr: 3000, te: 100, etl: 20, slices: 30, matrixRead: 384, matrixPhase: 320 },
    editable: ['field', 'tr', 'te', 'etl', 'refocusFlip', 'slices', 'nex', 'matrixRead', 'matrixPhase', 'bandwidthPerPixel', 'acceleration', 'sliceThickness'],
    allowedSequences: ['TSE'],
    requirements: [
      errorsFree,
      { id: 'field', label: 'Feldstärke 1,5 T (Herstellervorgabe)', hard: true, check: (p) => p.field === 1.5 },
      {
        id: 'sar-1',
        label: 'Ganzkörper-SAR ≤ 1,0 W/kg',
        hard: true,
        check: (_p, m) => m.sar <= 1.0,
        value: (_p, m) => `${m.sar.toFixed(2)} W/kg`,
      },
      { id: 't2w', label: 'T2-Gewichtung (TR ≥ 2500 ms, TE 80–120 ms)', hard: true, check: (p) => p.tr >= 2500 && p.te >= 80 && p.te <= 120 },
      { id: 'coverage', label: '≥ 24 Schichten', hard: true, check: (p) => p.slices >= 24 },
      timeAtMost(300, true),
      snrAtLeast(20, false),
      pixelAtMost(0.75, false),
    ],
    debrief:
      'Der Wechsel auf 1,5 T reduziert das SAR um den Faktor 4 (B₀²). Weitere Stellschrauben: Refokussierungswinkel senken (SAR ∝ α²), TR verlängern (weniger Pulse pro Sekunde) oder ETL verkürzen. Das SNR-Defizit von 1,5 T kompensierst du über Voxelgröße, NEX oder eine niedrigere Bandbreite.',
    xp: 180,
  },
];

export const SCENARIO_BY_ID = Object.fromEntries(SCENARIOS.map((sc) => [sc.id, sc])) as Record<string, Scenario>;

/** Hilfswert für die Debriefing-Anzeige: ideale FLAIR-Inversionszeit bei 1,5 T. */
export const IDEAL_FLAIR_TI = Math.round(nullPointTI(TISSUES.csf.params[1.5].t1, 9000));

/** Bewertung: 0 Sterne = nicht bestanden; 1 = alle Pflichtkriterien; +1 je weiche Gruppe (max. 3). */
export function evaluateScenario(sc: Scenario, p: Protocol, m: ProtocolMetrics): { passed: boolean; stars: number; results: Array<{ req: Requirement; ok: boolean }> } {
  const results = sc.requirements.map((req) => ({ req, ok: req.check(p, m) }));
  const passed = results.filter((r) => r.req.hard).every((r) => r.ok);
  if (!passed) return { passed, stars: 0, results };
  const soft = results.filter((r) => !r.req.hard);
  const softOk = soft.filter((r) => r.ok).length;
  const stars = soft.length === 0 ? 3 : 1 + Math.round((softOk / soft.length) * 2);
  return { passed, stars, results };
}
