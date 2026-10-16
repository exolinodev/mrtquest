/**
 * Klinische Trade-off-Szenarien für die Protokoll-Konsole.
 * Jedes Szenario definiert Startprotokoll, frei einstellbare Parameter und
 * harte (müssen) sowie weiche (Sterne) Anforderungen.
 */
import { numberLocale, type Lang, type Loc } from '../i18n/format';
import { TISSUES } from '../physics/constants';
import { nullPointTI } from '../physics/mri';
import type { Protocol, ProtocolMetrics, SequenceType } from '../physics/protocol';
import { DEFAULT_PROTOCOL } from '../physics/protocol';
import type { PhantomId } from '../physics/phantom';

export type ParamKey = keyof Omit<Protocol, 'sequence' | 'field' | 'fatSat'> | 'sequence' | 'field' | 'fatSat';

export interface Requirement {
  id: string;
  label: Loc;
  /** hard = Bedingung für das Bestehen, sonst Bonusstern */
  hard: boolean;
  check: (p: Protocol, m: ProtocolMetrics) => boolean;
  /** kurze Live-Anzeige des aktuellen Werts (Einheiten in der gewählten Sprache) */
  value?: (p: Protocol, m: ProtocolMetrics, lang: Lang) => string;
}

export interface Scenario {
  id: string;
  title: Loc;
  icon: string;
  difficulty: 1 | 2 | 3;
  anatomy: PhantomId;
  story: Loc;
  task: Loc;
  start: Protocol;
  editable: ParamKey[];
  allowedSequences: SequenceType[];
  requirements: Requirement[];
  debrief: Loc;
  xp: number;
}

/** Zahl mit fester Nachkommazahl in der Sprache formatieren. */
const num = (v: number, digits: number, lang: Lang) =>
  v.toLocaleString(numberLocale(lang), { minimumFractionDigits: digits, maximumFractionDigits: digits });

const U = {
  s: { de: 's', uk: 'с' },
  min: { de: 'min', uk: 'хв' },
  mm: { de: 'mm', uk: 'мм' },
  px: { de: 'px', uk: 'пікс.' },
  wkg: { de: 'W/kg', uk: 'Вт/кг' },
} satisfies Record<string, Loc>;

const pct = (ratio: number) => `${Math.round(ratio * 100)} %`;

const errorsFree: Requirement = {
  id: 'valid',
  label: {
    de: 'Protokoll technisch durchführbar (keine Timing- oder SAR-Fehler)',
    uk: 'Протокол технічно виконуваний (без помилок таймінгу чи SAR)',
  },
  hard: true,
  check: (_p, m) => !m.issues.some((i) => i.severity === 'error'),
};

const noAliasing: Requirement = {
  id: 'alias',
  label: { de: 'Keine Einfaltung in Phasenrichtung', uk: 'Без загортання у фазовому напрямку' },
  hard: true,
  check: (_p, m) => !m.aliasing,
  value: (_p, m, lang) =>
    m.aliasing ? `${Math.round(m.aliasingMm)} ${U.mm[lang]} ${lang === 'uk' ? 'замало' : 'zu klein'}` : 'ok',
};

const sarNormal: Requirement = {
  id: 'sar-normal',
  label: { de: 'SAR im Normal Mode (≤ 2,0 W/kg)', uk: 'SAR у режимі Normal Mode (≤ 2,0 Вт/кг)' },
  hard: true,
  check: (_p, m) => m.sar <= 2,
  value: (_p, m, lang) => `${num(m.sar, 2, lang)} ${U.wkg[lang]}`,
};

const snrAtLeast = (min: number, hard: boolean): Requirement => ({
  id: `snr-${min}-${hard ? 'h' : 's'}`,
  label: { de: `SNR (Referenzgewebe) ≥ ${min}`, uk: `SNR (референтна тканина) ≥ ${min}` },
  hard,
  check: (_p, m) => m.snr >= min,
  value: (_p, m, lang) => num(m.snr, 1, lang),
});

const timeAtMost = (sec: number, hard: boolean): Requirement => {
  const limit = (lang: Lang) =>
    sec >= 60 ? `${(sec / 60).toLocaleString(numberLocale(lang))} ${U.min[lang]}` : `${sec} ${U.s[lang]}`;
  return {
    id: `ta-${sec}-${hard ? 'h' : 's'}`,
    label: { de: `Messzeit ≤ ${limit('de')}`, uk: `Час сканування ≤ ${limit('uk')}` },
    hard,
    check: (_p, m) => m.scanTimeS <= sec,
    value: (_p, m, lang) => `${Math.round(m.scanTimeS)} ${U.s[lang]}`,
  };
};

const pixelAtMost = (mm: number, hard: boolean): Requirement => ({
  id: `px-${mm}-${hard ? 'h' : 's'}`,
  label: {
    de: `In-plane-Auflösung ≤ ${mm.toLocaleString('de-DE')} mm`,
    uk: `Роздільна здатність у площині ≤ ${mm.toLocaleString('uk-UA')} мм`,
  },
  hard,
  check: (_p, m) => Math.max(m.pixelRead, m.pixelPhase) <= mm + 1e-6,
  value: (_p, m, lang) => `${num(Math.max(m.pixelRead, m.pixelPhase), 2, lang)} ${U.mm[lang]}`,
});

export const SCENARIOS: Scenario[] = [
  {
    id: 'ms-flair',
    title: { de: 'Verdacht auf Multiple Sklerose', uk: 'Підозра на розсіяний склероз' },
    icon: '🧠',
    difficulty: 1,
    anatomy: 'brain',
    story: {
      de: 'Eine 29-jährige Patientin mit Sehstörungen und Kribbelparästhesien. Die Neurologie fragt nach periventrikulären Entmarkungsherden. Auf T2w liegen diese direkt neben dem ebenfalls hellen Liquor – schwer abzugrenzen.',
      uk: 'Пацієнтка 29 років із порушеннями зору та парестезіями (поколюванням). Невролог запитує про перивентрикулярні вогнища демієлінізації. На T2w вони лежать безпосередньо поруч із так само яскравим ліквором – їх важко розмежувати.',
    },
    task: {
      de: 'Erstelle eine FLAIR: Der Liquor muss genullt sein, die Läsionen sollen heller als die weiße Substanz erscheinen.',
      uk: 'Створи FLAIR: сигнал ліквору має бути занулений, а вогнища мають виглядати яскравішими за білу речовину.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'IR', tr: 9000, te: 100, ti: 800, etl: 16, slices: 24 },
    editable: ['tr', 'te', 'ti', 'etl', 'nex', 'bandwidthPerPixel', 'matrixPhase', 'sliceThickness'],
    allowedSequences: ['IR'],
    requirements: [
      errorsFree,
      {
        id: 'csf-null',
        label: { de: 'Liquorsignal < 15 % der weißen Substanz', uk: 'Сигнал ліквору < 15 % від білої речовини' },
        hard: true,
        check: (_p, m) => m.signals.csf < 0.15 * m.signals.wm,
        value: (_p, m) => pct(m.signals.csf / Math.max(m.signals.wm, 1e-6)),
      },
      {
        id: 'lesion-bright',
        label: {
          de: 'Läsion mindestens 30 % heller als weiße Substanz',
          uk: 'Вогнище щонайменше на 30 % яскравіше за білу речовину',
        },
        hard: true,
        check: (_p, m) => m.signals.lesion >= 1.3 * m.signals.wm,
        value: (_p, m) => pct(m.signals.lesion / Math.max(m.signals.wm, 1e-6) - 1),
      },
      timeAtMost(300, true),
      snrAtLeast(12, false),
      timeAtMost(200, false),
    ],
    debrief: {
      de: 'Für die Liquorunterdrückung gilt TI ≈ T1·ln 2 ≈ 0,69·T1(CSF), korrigiert für endliches TR: TI = T1·ln(2/(1+e^(−TR/T1))). Ein langes TR (≥ 8 s) lässt die Längsmagnetisierung vollständig erholen, ein TE um 90–120 ms erzeugt die T2-Gewichtung, in der Läsionen hell erscheinen.',
      uk: 'Для пригнічення ліквору TI ≈ T1·ln 2 ≈ 0,69·T1(СМР), з поправкою на скінченний TR: TI = T1·ln(2/(1+e^(−TR/T1))). Довгий TR (≥ 8 с) дає повністю відновитися поздовжній намагніченості, а TE близько 90–120 мс створює T2-зважування, у якому вогнища яскраві.',
    },
    xp: 120,
  },
  {
    id: 'claustro-brain',
    title: { de: 'Klaustrophobie – schnelle T2w', uk: 'Клаустрофобія – швидке T2w' },
    icon: '😰',
    difficulty: 1,
    anatomy: 'brain',
    story: {
      de: 'Ein 71-jähriger Patient hält es höchstens zwei Minuten im Tunnel aus. Gefragt ist eine diagnostisch verwertbare axiale T2w des Kopfes zum Ausschluss einer Raumforderung.',
      uk: 'Пацієнт 71 року витримує в тунелі щонайбільше дві хвилини. Потрібне діагностично придатне аксіальне T2w голови для виключення об’ємного утворення.',
    },
    task: {
      de: 'Verkürze die T2-TSE auf unter 2 min, ohne dass das SNR unter 15 fällt.',
      uk: 'Скороти T2-TSE до менш ніж 2 хв так, щоб SNR не впало нижче 15.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'TSE', tr: 5000, te: 100, etl: 8, nex: 2, matrixPhase: 320, matrixRead: 320 },
    editable: ['tr', 'te', 'etl', 'nex', 'matrixPhase', 'matrixRead', 'bandwidthPerPixel', 'acceleration', 'sliceThickness', 'slices'],
    allowedSequences: ['TSE'],
    requirements: [
      errorsFree,
      timeAtMost(120, true),
      snrAtLeast(15, true),
      {
        id: 't2w',
        label: { de: 'T2-Gewichtung (TR ≥ 2000 ms, TE ≥ 70 ms)', uk: 'T2-зважування (TR ≥ 2000 мс, TE ≥ 70 мс)' },
        hard: true,
        check: (p) => p.tr >= 2000 && p.te >= 70,
      },
      {
        id: 'coverage',
        label: { de: 'Ganzhirnabdeckung: ≥ 22 Schichten à ≤ 5 mm', uk: 'Охоплення всього мозку: ≥ 22 зрізи по ≤ 5 мм' },
        hard: true,
        check: (p) => p.slices >= 22 && p.sliceThickness <= 5,
      },
      timeAtMost(75, false),
      pixelAtMost(0.9, false),
    ],
    debrief: {
      de: 'Die Messzeit TA = TR·N_PE·NEX/(ETL·R) lässt sich über ETL, NEX, Phasenmatrix und parallele Bildgebung senken. Jede Halbierung von NEX kostet √2 an SNR, ein größerer ETL kostet kaum SNR, erhöht aber Blurring und SAR. Parallelbildgebung (R) reduziert das SNR um g·√R.',
      uk: 'Час сканування TA = TR·N_PE·NEX/(ETL·R) можна зменшити через ETL, NEX, фазову матрицю та паралельну візуалізацію. Кожне зменшення NEX удвічі коштує √2 у SNR, більший ETL майже не знижує SNR, але посилює розмиття та SAR. Паралельна візуалізація (R) знижує SNR у g·√R разів.',
    },
    xp: 120,
  },
  {
    id: 'knee-stir-3t',
    title: { de: 'Knochenmarködem nach Sportunfall (3 T)', uk: 'Набряк кісткового мозку після спортивної травми (3 Тл)' },
    icon: '🦵',
    difficulty: 2,
    anatomy: 'knee',
    story: {
      de: 'Ein Fußballspieler mit Distorsionstrauma des Knies. Gesucht wird ein Knochenmarködem („bone bruise“) im Femurkondylus. Am 3-T-Gerät ist das SAR-Budget knapp – die Patientin vor ihm hatte eine erhöhte Körpertemperatur, daher wird nur der Normal Mode freigegeben.',
      uk: 'Футболіст із дисторсійною травмою коліна. Шукаємо набряк кісткового мозку («bone bruise») у виростку стегнової кістки. На апараті 3 Тл бюджет SAR обмежений – у пацієнтки перед ним була підвищена температура тіла, тож дозволено лише режим Normal Mode.',
    },
    task: {
      de: 'Erstelle eine STIR mit vollständig unterdrücktem Fettsignal im Normal Mode, Auflösung ≤ 0,6 mm.',
      uk: 'Створи STIR із повністю пригніченим сигналом жиру в режимі Normal Mode, роздільна здатність ≤ 0,6 мм.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'IR', field: 3, tr: 3000, te: 40, ti: 500, etl: 12, fovRead: 160, fovPhase: 180, matrixRead: 256, matrixPhase: 256, slices: 30, sliceThickness: 3, bandwidthPerPixel: 250 },
    editable: ['tr', 'te', 'ti', 'etl', 'refocusFlip', 'slices', 'matrixRead', 'matrixPhase', 'nex', 'bandwidthPerPixel', 'fovPhase', 'phaseOversampling'],
    allowedSequences: ['IR'],
    requirements: [
      errorsFree,
      sarNormal,
      {
        id: 'fat-null',
        label: { de: 'Fettsignal < 15 % des Muskelsignals', uk: 'Сигнал жиру < 15 % від сигналу м’яза' },
        hard: true,
        check: (_p, m) => m.signals.fat < 0.15 * m.signals.muscle,
        value: (_p, m) => pct(m.signals.fat / Math.max(m.signals.muscle, 1e-6)),
      },
      noAliasing,
      pixelAtMost(0.6, true),
      { id: 'slices', label: { de: 'Mindestens 24 Schichten', uk: 'Щонайменше 24 зрізи' }, hard: true, check: (p) => p.slices >= 24 },
      timeAtMost(300, false),
      snrAtLeast(8, false),
    ],
    debrief: {
      de: 'Fett hat bei 3 T ein T1 von ≈ 370 ms → TI ≈ 0,69·370 ≈ 250 ms (bei endlichem TR etwas weniger). SAR skaliert mit B₀² und dem Quadrat des Flipwinkels: Ein Refokussierungswinkel von 120–150° statt 180°, längeres TR oder weniger Schichten pro TR halten den Normal Mode ein. Das Phasen-FOV muss das gesamte Knie (180 mm) abdecken – sonst faltet Gewebe ein.',
      uk: 'Жир при 3 Тл має T1 ≈ 370 мс → TI ≈ 0,69·370 ≈ 250 мс (при скінченному TR трохи менше). SAR масштабується з B₀² та квадратом кута відхилення: рефокусувальний кут 120–150° замість 180°, довший TR або менше зрізів на TR дозволяють залишитися в режимі Normal Mode. Фазове FOV має охоплювати все коліно (180 мм) – інакше тканина загортається.',
    },
    xp: 150,
  },
  {
    id: 'liver-breathhold',
    title: { de: 'Leberläsion in Atemanhalt', uk: 'Вогнище в печінці на затримці дихання' },
    icon: '🫁',
    difficulty: 2,
    anatomy: 'abdomen',
    story: {
      de: 'Im Ultraschall zeigt sich ein unklarer Leberherd. Die 58-jährige Patientin kann maximal 18 Sekunden die Luft anhalten. Atembewegung erzeugt sonst Geisterbilder in Phasenrichtung.',
      uk: 'На УЗД виявлено неясне вогнище в печінці. Пацієнтка 58 років може затримати дихання щонайбільше на 18 секунд. Інакше дихальні рухи створюють фантомні зображення у фазовому напрямку.',
    },
    task: {
      de: 'Wähle eine Sequenz und Parameter für eine T1-gewichtete Aufnahme in einem Atemanhalt ohne Einfaltung.',
      uk: 'Обери послідовність і параметри для T1-зваженого знімка за одну затримку дихання без загортання.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'SE', tr: 550, te: 15, etl: 1, fovRead: 400, fovPhase: 300, matrixRead: 256, matrixPhase: 192, slices: 20, sliceThickness: 6, flip: 70, bandwidthPerPixel: 200 },
    editable: ['sequence', 'tr', 'te', 'flip', 'fovPhase', 'phaseOversampling', 'matrixPhase', 'matrixRead', 'nex', 'acceleration', 'bandwidthPerPixel', 'slices'],
    allowedSequences: ['SE', 'GRE'],
    requirements: [
      errorsFree,
      timeAtMost(18, true),
      noAliasing,
      {
        id: 't1w',
        label: { de: 'T1-Kontrast: Leber heller als Läsion um ≥ 25 %', uk: 'T1-контраст: печінка яскравіша за вогнище на ≥ 25 %' },
        hard: true,
        check: (_p, m) => m.signals.liver >= 1.25 * m.signals.lesion,
        value: (_p, m) => pct(m.signals.liver / Math.max(m.signals.lesion, 1e-6) - 1),
      },
      { id: 'slices', label: { de: 'Leberabdeckung: ≥ 20 Schichten', uk: 'Охоплення печінки: ≥ 20 зрізів' }, hard: true, check: (p) => p.slices >= 20 },
      snrAtLeast(10, false),
      {
        id: 'cs',
        label: { de: 'Chemische Verschiebung ≤ 1,5 px', uk: 'Хімічний зсув ≤ 1,5 пікс.' },
        hard: false,
        check: (_p, m) => m.chemicalShiftPx <= 1.5,
        value: (_p, m, lang) => `${num(m.chemicalShiftPx, 2, lang)} ${U.px[lang]}`,
      },
    ],
    debrief: {
      de: 'Ein konventionelles SE benötigt für jede Phasenkodierzeile ein TR – Atemanhalt ist damit unmöglich. Ein gespoiltes GRE mit kurzem TR (≈ 150–200 ms, Multi-Slice) und mittlerem Flipwinkel liefert T1-Kontrast in Sekunden. Die Bauchbreite (380 mm) erfordert ein ausreichendes Phasen-FOV bzw. Oversampling, parallele Bildgebung verkürzt zusätzlich.',
      uk: 'Класичне SE потребує одного TR на кожен рядок фазового кодування – затримка дихання тоді неможлива. Спойлерне GRE з коротким TR (≈ 150–200 мс, багатозрізове) та середнім кутом відхилення дає T1-контраст за секунди. Ширина живота (380 мм) вимагає достатнього фазового FOV або оверсемплінгу, паралельна візуалізація додатково скорочує час.',
    },
    xp: 150,
  },
  {
    id: 'stroke-dwi',
    title: { de: 'Akuter Schlaganfall – Time is Brain', uk: 'Гострий інсульт – Time is Brain' },
    icon: '⚡',
    difficulty: 3,
    anatomy: 'brain',
    story: {
      de: 'Stroke-Alarm: 64-jähriger Patient, Symptombeginn vor 90 Minuten. Für die Lysetherapie-Entscheidung braucht es in kürzester Zeit eine diffusionsgewichtete Basis-EPI. Problem: EPI ist extrem anfällig für Verzerrungen an der Schädelbasis.',
      uk: 'Інсультна тривога: пацієнт 64 років, симптоми почалися 90 хвилин тому. Для рішення про тромболізис потрібна якнайшвидше базова EPI для дифузійно-зваженого зображення. Проблема: EPI надзвичайно чутлива до спотворень біля основи черепа.',
    },
    task: {
      de: 'Erstelle eine EPI unter 30 s mit Verzerrung ≤ 3 px und ohne Fett-Geister.',
      uk: 'Створи EPI тривалістю менше 30 с зі спотворенням ≤ 3 пікс. і без жирових фантомів.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 90, etl: 1, matrixRead: 128, matrixPhase: 128, fovRead: 230, fovPhase: 230, bandwidthPerPixel: 1000, nex: 4, slices: 24, acceleration: 1 },
    editable: ['tr', 'te', 'matrixPhase', 'matrixRead', 'bandwidthPerPixel', 'acceleration', 'nex', 'fatSat', 'slices', 'field'],
    allowedSequences: ['EPI'],
    requirements: [
      errorsFree,
      timeAtMost(30, true),
      {
        id: 'distortion',
        label: { de: 'Suszeptibilitätsverzerrung ≤ 3 px', uk: 'Спотворення через магнітну сприйнятливість ≤ 3 пікс.' },
        hard: true,
        check: (_p, m) => m.epiDistortionPx <= 3,
        value: (_p, m, lang) => `${num(m.epiDistortionPx, 1, lang)} ${U.px[lang]}`,
      },
      {
        id: 'fatsat',
        label: { de: 'Fettverschiebung (Phasenrichtung) ≤ 1 px', uk: 'Зсув жиру (фазовий напрямок) ≤ 1 пікс.' },
        hard: true,
        check: (_p, m) => m.chemicalShiftPx <= 1,
        value: (_p, m, lang) => `${num(m.chemicalShiftPx, 1, lang)} ${U.px[lang]}`,
      },
      { id: 'coverage', label: { de: '≥ 20 Schichten', uk: '≥ 20 зрізів' }, hard: true, check: (p) => p.slices >= 20 },
      snrAtLeast(6, false),
      pixelAtMost(1.8, false),
    ],
    debrief: {
      de: 'Bei EPI ist die Bandbreite pro Pixel in Phasenrichtung winzig (≈ 1/(ESP·N_PE)). Verzerrungen ∝ Δf/BW_PE lassen sich durch parallele Bildgebung (kürzerer Echozug), höhere Auslesebandbreite (kürzeres ESP) oder kleinere Phasenmatrix reduzieren. Fett verschiebt sich um viele Pixel – Fettsättigung ist bei EPI Pflicht. 1,5 T halbiert die Off-Resonanz gegenüber 3 T.',
      uk: 'В EPI смуга пропускання на піксель у фазовому напрямку мізерна (≈ 1/(ESP·N_PE)). Спотворення ∝ Δf/BW_PE можна зменшити паралельною візуалізацією (коротша ехо-послідовність), ширшою смугою зчитування (коротший ESP) або меншою фазовою матрицею. Жир зсувається на багато пікселів – жиропригнічення для EPI обов’язкове. 1,5 Тл удвічі зменшує позарезонансне зміщення порівняно з 3 Тл.',
    },
    xp: 180,
  },
  {
    id: 'implant-spine',
    title: { de: 'Patient mit Neurostimulator', uk: 'Пацієнт із нейростимулятором' },
    icon: '🔌',
    difficulty: 3,
    anatomy: 'brain',
    story: {
      de: 'Ein Patient mit MR-bedingt sicherem Rückenmark-Stimulator benötigt eine Kopf-MRT. Laut Herstellerangaben gilt: nur 1,5 T, Ganzkörper-SAR ≤ 1,0 W/kg, Kopf-Bildgebung erlaubt. Die Radiologie wünscht eine T2w-TSE mit guter Auflösung.',
      uk: 'Пацієнтові з умовно МР-безпечним стимулятором спинного мозку потрібна МРТ голови. За даними виробника: лише 1,5 Тл, SAR для всього тіла ≤ 1,0 Вт/кг, візуалізація голови дозволена. Радіологія хоче T2w-TSE з добрим розрізненням.',
    },
    task: {
      de: 'Optimiere die T2-TSE unter der strengen SAR-Grenze von 1,0 W/kg.',
      uk: 'Оптимізуй T2-TSE за суворої межі SAR 1,0 Вт/кг.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'TSE', field: 3, tr: 3000, te: 100, etl: 20, slices: 30, matrixRead: 384, matrixPhase: 320 },
    editable: ['field', 'tr', 'te', 'etl', 'refocusFlip', 'slices', 'nex', 'matrixRead', 'matrixPhase', 'bandwidthPerPixel', 'acceleration', 'sliceThickness'],
    allowedSequences: ['TSE'],
    requirements: [
      errorsFree,
      {
        id: 'field',
        label: { de: 'Feldstärke 1,5 T (Herstellervorgabe)', uk: 'Індукція поля 1,5 Тл (вимога виробника)' },
        hard: true,
        check: (p) => p.field === 1.5,
      },
      {
        id: 'sar-1',
        label: { de: 'Ganzkörper-SAR ≤ 1,0 W/kg', uk: 'SAR для всього тіла ≤ 1,0 Вт/кг' },
        hard: true,
        check: (_p, m) => m.sar <= 1.0,
        value: (_p, m, lang) => `${num(m.sar, 2, lang)} ${U.wkg[lang]}`,
      },
      {
        id: 't2w',
        label: { de: 'T2-Gewichtung (TR ≥ 2500 ms, TE 80–120 ms)', uk: 'T2-зважування (TR ≥ 2500 мс, TE 80–120 мс)' },
        hard: true,
        check: (p) => p.tr >= 2500 && p.te >= 80 && p.te <= 120,
      },
      { id: 'coverage', label: { de: '≥ 24 Schichten', uk: '≥ 24 зрізи' }, hard: true, check: (p) => p.slices >= 24 },
      timeAtMost(300, true),
      snrAtLeast(20, false),
      pixelAtMost(0.75, false),
    ],
    debrief: {
      de: 'Der Wechsel auf 1,5 T reduziert das SAR um den Faktor 4 (B₀²). Weitere Stellschrauben: Refokussierungswinkel senken (SAR ∝ α²), TR verlängern (weniger Pulse pro Sekunde) oder ETL verkürzen. Das SNR-Defizit von 1,5 T kompensierst du über Voxelgröße, NEX oder eine niedrigere Bandbreite.',
      uk: 'Перехід на 1,5 Тл зменшує SAR у 4 рази (B₀²). Інші важелі: зменшити рефокусувальний кут (SAR ∝ α²), подовжити TR (менше імпульсів за секунду) або скоротити ETL. Дефіцит SNR при 1,5 Тл компенсуй розміром вокселя, NEX або вужчою смугою пропускання.',
    },
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
