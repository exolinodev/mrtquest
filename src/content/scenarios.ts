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
  /** Einfache Erklärung des Falls: welche Physik aus den Grundlagenmodulen dahintersteckt und warum der Trade-off schwierig ist. */
  physicsStory?: Loc;
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
  s: { de: 's', ru: 'с' },
  min: { de: 'min', ru: 'мин' },
  mm: { de: 'mm', ru: 'мм' },
  px: { de: 'px', ru: 'пикс.' },
  wkg: { de: 'W/kg', ru: 'Вт/кг' },
} satisfies Record<string, Loc>;

const pct = (ratio: number) => `${Math.round(ratio * 100)} %`;

const errorsFree: Requirement = {
  id: 'valid',
  label: {
    de: 'Protokoll technisch durchführbar (keine Timing- oder SAR-Fehler)',
    ru: 'Протокол технически выполним (без ошибок тайминга или SAR)',
  },
  hard: true,
  check: (_p, m) => !m.issues.some((i) => i.severity === 'error'),
};

const noAliasing: Requirement = {
  id: 'alias',
  label: { de: 'Keine Einfaltung in Phasenrichtung', ru: 'Без артефакта наложения в фазовом направлении' },
  hard: true,
  check: (_p, m) => !m.aliasing,
  value: (_p, m, lang) =>
    m.aliasing ? `${Math.round(m.aliasingMm)} ${U.mm[lang]} ${lang === 'ru' ? 'недостаточно' : 'zu klein'}` : 'ok',
};

const sarNormal: Requirement = {
  id: 'sar-normal',
  label: { de: 'SAR im Normal Mode (≤ 2,0 W/kg)', ru: 'SAR в режиме Normal Mode (≤ 2,0 Вт/кг)' },
  hard: true,
  check: (_p, m) => m.sar <= 2,
  value: (_p, m, lang) => `${num(m.sar, 2, lang)} ${U.wkg[lang]}`,
};

const snrAtLeast = (min: number, hard: boolean): Requirement => ({
  id: `snr-${min}-${hard ? 'h' : 's'}`,
  label: { de: `SNR (Referenzgewebe) ≥ ${min}`, ru: `SNR (референсная ткань) ≥ ${min}` },
  hard,
  check: (_p, m) => m.snr >= min,
  value: (_p, m, lang) => num(m.snr, 1, lang),
});

const timeAtMost = (sec: number, hard: boolean): Requirement => {
  const limit = (lang: Lang) =>
    // Nur ganze bzw. halbe Minuten als Minuten anzeigen, sonst Sekunden (z. B. 200 s statt 3,333 min)
    sec >= 60 && sec % 30 === 0 ? `${(sec / 60).toLocaleString(numberLocale(lang))} ${U.min[lang]}` : `${sec} ${U.s[lang]}`;
  return {
    id: `ta-${sec}-${hard ? 'h' : 's'}`,
    label: { de: `Messzeit ≤ ${limit('de')}`, ru: `Время сканирования ≤ ${limit('ru')}` },
    hard,
    check: (_p, m) => m.scanTimeS <= sec,
    value: (_p, m, lang) => `${Math.round(m.scanTimeS)} ${U.s[lang]}`,
  };
};

const pixelAtMost = (mm: number, hard: boolean): Requirement => ({
  id: `px-${mm}-${hard ? 'h' : 's'}`,
  label: {
    de: `In-plane-Auflösung ≤ ${mm.toLocaleString('de-DE')} mm`,
    ru: `Разрешение в плоскости ≤ ${mm.toLocaleString('ru-RU')} мм`,
  },
  hard,
  check: (_p, m) => Math.max(m.pixelRead, m.pixelPhase) <= mm + 1e-6,
  value: (_p, m, lang) => `${num(Math.max(m.pixelRead, m.pixelPhase), 2, lang)} ${U.mm[lang]}`,
});

export const SCENARIOS: Scenario[] = [
  {
    id: 'ms-flair',
    title: { de: 'Verdacht auf Multiple Sklerose', ru: 'Подозрение на рассеянный склероз' },
    icon: '🧠',
    difficulty: 1,
    anatomy: 'brain',
    story: {
      de: 'Eine 29-jährige Patientin mit Sehstörungen und Kribbelparästhesien. Die Neurologie fragt nach periventrikulären Entmarkungsherden. Auf T2w liegen diese direkt neben dem ebenfalls hellen Liquor – schwer abzugrenzen.',
      ru: 'Пациентка 29 лет с нарушениями зрения и парестезиями (покалыванием). Невролог спрашивает о перивентрикулярных очагах демиелинизации. На T2w они лежат непосредственно рядом с таким же ярким ликвором – их трудно разграничить.',
    },
    physicsStory: {
      de: 'Bei Multipler Sklerose sitzen kleine Entzündungsherde direkt neben den Hirnkammern. Auf T2w sind Herde und Liquor beide hell, deshalb verschwimmen sie. FLAIR löscht das Liquorsignal, weil man nach dem 180°-Inversionspuls die T1-Erholung des Wassers genau bis zum Nulldurchgang abwartet und erst dann anregt (siehe Relaxation). Schwierig ist: Das passende TI hängt am T1 des Liquors, und ein langes TR für volle Erholung macht die Messung langsam.',
      ru: 'При рассеянном склерозе маленькие очаги воспаления лежат прямо рядом с желудочками мозга. На T2w и очаги, и ликвор светлые, поэтому они сливаются. FLAIR гасит сигнал ликвора: после инвертирующего импульса 180° ждут, пока T1-восстановление воды дойдёт ровно до нуля, и только тогда возбуждают (см. релаксацию). Сложность в том, что нужное TI зависит от T1 ликвора, а длинное TR для полного восстановления делает исследование медленным.',
    },
    task: {
      de: 'Erstelle eine FLAIR: Der Liquor muss genullt sein, die Läsionen sollen heller als die weiße Substanz erscheinen.',
      ru: 'Создай FLAIR: сигнал ликвора должен быть обнулён, а очаги должны выглядеть ярче белого вещества.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'IR', tr: 9000, te: 100, ti: 800, etl: 16, slices: 24 },
    editable: ['tr', 'te', 'ti', 'etl', 'nex', 'bandwidthPerPixel', 'matrixPhase', 'sliceThickness'],
    allowedSequences: ['IR'],
    requirements: [
      errorsFree,
      {
        id: 'csf-null',
        label: { de: 'Liquorsignal < 15 % der weißen Substanz', ru: 'Сигнал ликвора < 15 % от белого вещества' },
        hard: true,
        check: (_p, m) => m.signals.csf < 0.15 * m.signals.wm,
        value: (_p, m) => pct(m.signals.csf / Math.max(m.signals.wm, 1e-6)),
      },
      {
        id: 'lesion-bright',
        label: {
          de: 'Läsion mindestens 30 % heller als weiße Substanz',
          ru: 'Очаг как минимум на 30 % ярче белого вещества',
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
      ru: 'Для подавления ликвора TI ≈ T1·ln 2 ≈ 0,69·T1(ЦСЖ), с поправкой на конечное TR: TI = T1·ln(2/(1+e^(−TR/T1))). Длинное TR (≥ 8 с) позволяет продольной намагниченности полностью восстановиться, а TE около 90–120 мс создаёт T2-взвешенность, в которой очаги выглядят яркими.',
    },
    xp: 120,
  },
  {
    id: 'claustro-brain',
    title: { de: 'Klaustrophobie – schnelle T2w', ru: 'Клаустрофобия – быстрое T2w' },
    icon: '😰',
    difficulty: 1,
    anatomy: 'brain',
    story: {
      de: 'Ein 71-jähriger Patient hält es höchstens zwei Minuten im Tunnel aus. Gefragt ist eine diagnostisch verwertbare axiale T2w des Kopfes zum Ausschluss einer Raumforderung.',
      ru: 'Пациент 71 года выдерживает в тоннеле не более двух минут. Нужно диагностически пригодное аксиальное T2w головы для исключения объёмного образования.',
    },
    physicsStory: {
      de: 'Hier zählt jede Sekunde, denn der Patient hält den engen Tunnel kaum aus. Die Messzeit entsteht im k-Raum: Jede Phasenkodierzeile kostet ein TR, und Mittelungen wiederholen alles noch einmal. Für den T2-Kontrast brauchst du aber ein langes TR und ein langes TE, dort kannst du also nicht sparen (siehe Relaxation). Weniger Mittelungen, längere Echozüge oder parallele Bildgebung machen schneller, kosten aber SNR oder Schärfe.',
      ru: 'Здесь важна каждая секунда: пациент с трудом выдерживает тесный тоннель. Время складывается в k-пространстве: каждая строка фазового кодирования стоит одно TR, а усреднения повторяют всё ещё раз. Но для T2-контраста нужны длинные TR и TE, на них сэкономить нельзя (см. релаксацию). Меньше усреднений, более длинный эхо-поезд или параллельная визуализация ускоряют, но стоят SNR или чёткости.',
    },
    task: {
      de: 'Verkürze die T2-TSE auf unter 2 min, ohne dass das SNR unter 15 fällt.',
      ru: 'Сократи T2-TSE до менее чем 2 мин так, чтобы SNR не упало ниже 15.',
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
        label: { de: 'T2-Gewichtung (TR ≥ 2000 ms, TE ≥ 70 ms)', ru: 'T2-взвешенность (TR ≥ 2000 мс, TE ≥ 70 мс)' },
        hard: true,
        check: (p) => p.tr >= 2000 && p.te >= 70,
      },
      {
        id: 'coverage',
        label: { de: 'Ganzhirnabdeckung: ≥ 22 Schichten à ≤ 5 mm', ru: 'Охват всего мозга: ≥ 22 среза по ≤ 5 мм' },
        hard: true,
        check: (p) => p.slices >= 22 && p.sliceThickness <= 5,
      },
      timeAtMost(75, false),
      pixelAtMost(0.9, false),
    ],
    debrief: {
      de: 'Die Messzeit TA = TR·N_PE·NEX/(ETL·R) lässt sich über ETL, NEX, Phasenmatrix und parallele Bildgebung senken. Jede Halbierung von NEX kostet √2 an SNR, ein größerer ETL kostet kaum SNR, erhöht aber Blurring und SAR. Parallelbildgebung (R) reduziert das SNR um g·√R.',
      ru: 'Время сканирования TA = TR·N_PE·NEX/(ETL·R) можно уменьшить за счёт ETL, NEX, фазовой матрицы и параллельной визуализации. Каждое уменьшение NEX вдвое стоит √2 в SNR, больший ETL почти не снижает SNR, но усиливает размытие и SAR. Параллельная визуализация (R) снижает SNR в g·√R раз.',
    },
    xp: 120,
  },
  {
    id: 'knee-stir-3t',
    title: { de: 'Knochenmarködem nach Sportunfall (3 T)', ru: 'Отёк костного мозга после спортивной травмы (3 Тл)' },
    icon: '🦵',
    difficulty: 2,
    anatomy: 'knee',
    story: {
      de: 'Ein Fußballspieler mit Distorsionstrauma des Knies. Gesucht wird ein Knochenmarködem („bone bruise“) im Femurkondylus. Am 3-T-Gerät ist das SAR-Budget knapp – die Patientin vor ihm hatte eine erhöhte Körpertemperatur, daher wird nur der Normal Mode freigegeben.',
      ru: 'Футболист с дисторсионной травмой колена. Ищем отёк костного мозга («bone bruise») в мыщелке бедренной кости. На аппарате 3 Тл бюджет SAR ограничен – у пациентки перед ним была повышенная температура тела, поэтому разрешён только режим Normal Mode.',
    },
    physicsStory: {
      de: 'Ein Knochenmarködem ist Wasser im Knochenmark, das sonst voller Fett ist. STIR macht das Fett dunkel: Fett hat ein kurzes T1, und man regt genau dann an, wenn seine Längsmagnetisierung nach der Inversion durch null geht (siehe Relaxation). Das Ödem bleibt hell. Schwierig ist das 3-T-Gerät: Die SAR wächst mit B₀² und mit dem Quadrat des Flipwinkels, und die vielen 180°-Pulse heizen schnell auf. Gleichzeitig willst du feine Auflösung und ein Sichtfeld, das das ganze Knie abdeckt.',
      ru: 'Отёк костного мозга это вода в костном мозге, который обычно полон жира. STIR делает жир тёмным: у жира короткое T1, и возбуждают ровно в тот момент, когда его продольная намагниченность после инверсии проходит через ноль (см. релаксацию). Отёк при этом остаётся светлым. Сложность в аппарате 3 Тл: SAR растёт с B₀² и с квадратом угла отклонения, а множество импульсов 180° быстро нагревают ткань. При этом нужно высокое разрешение и поле обзора, охватывающее всё колено.',
    },
    task: {
      de: 'Erstelle eine STIR mit vollständig unterdrücktem Fettsignal im Normal Mode, Auflösung ≤ 0,6 mm.',
      ru: 'Создай STIR с полностью подавленным сигналом жира в режиме Normal Mode, разрешение ≤ 0,6 мм.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'IR', field: 3, tr: 3000, te: 40, ti: 500, etl: 12, fovRead: 160, fovPhase: 180, matrixRead: 256, matrixPhase: 256, slices: 30, sliceThickness: 3, bandwidthPerPixel: 250 },
    editable: ['tr', 'te', 'ti', 'etl', 'refocusFlip', 'slices', 'matrixRead', 'matrixPhase', 'nex', 'bandwidthPerPixel', 'fovPhase', 'phaseOversampling'],
    allowedSequences: ['IR'],
    requirements: [
      errorsFree,
      sarNormal,
      {
        id: 'fat-null',
        label: { de: 'Fettsignal < 15 % des Muskelsignals', ru: 'Сигнал жира < 15 % от сигнала мышцы' },
        hard: true,
        check: (_p, m) => m.signals.fat < 0.15 * m.signals.muscle,
        value: (_p, m) => pct(m.signals.fat / Math.max(m.signals.muscle, 1e-6)),
      },
      noAliasing,
      pixelAtMost(0.6, true),
      { id: 'slices', label: { de: 'Mindestens 24 Schichten', ru: 'Не менее 24 срезов' }, hard: true, check: (p) => p.slices >= 24 },
      timeAtMost(300, false),
      snrAtLeast(8, false),
    ],
    debrief: {
      de: 'Fett hat bei 3 T ein T1 von ≈ 370 ms → TI ≈ 0,69·370 ≈ 250 ms (bei endlichem TR etwas weniger). SAR skaliert mit B₀² und dem Quadrat des Flipwinkels: Ein Refokussierungswinkel von 120–150° statt 180°, längeres TR oder weniger Schichten pro TR halten den Normal Mode ein. Das Phasen-FOV muss das gesamte Knie (180 mm) abdecken – sonst faltet Gewebe ein.',
      ru: 'Жир при 3 Тл имеет T1 ≈ 370 мс → TI ≈ 0,69·370 ≈ 250 мс (при конечном TR немного меньше). SAR масштабируется с B₀² и квадратом угла отклонения: рефокусирующий угол 120–150° вместо 180°, более длинное TR или меньше срезов на TR позволяют остаться в режиме Normal Mode. Фазовое FOV должно охватывать всё колено (180 мм) – иначе возникает артефакт наложения.',
    },
    xp: 150,
  },
  {
    id: 'liver-breathhold',
    title: { de: 'Leberläsion in Atemanhalt', ru: 'Очаг в печени на задержке дыхания' },
    icon: '🫁',
    difficulty: 2,
    anatomy: 'abdomen',
    story: {
      de: 'Im Ultraschall zeigt sich ein unklarer Leberherd. Die 58-jährige Patientin kann maximal 18 Sekunden die Luft anhalten. Atembewegung erzeugt sonst Geisterbilder in Phasenrichtung.',
      ru: 'На УЗИ выявлен неясный очаг в печени. Пациентка 58 лет может задержать дыхание не более чем на 18 секунд. Иначе дыхательные движения создают фантомные изображения в фазовом направлении.',
    },
    physicsStory: {
      de: 'Die Leber bewegt sich mit jedem Atemzug. Weil die Phasenrichtung Zeile für Zeile über viele Sekunden gemessen wird, entstehen aus Atembewegung Geisterbilder (siehe k-Raum). Darum muss die ganze Messung in einen Atemanhalt passen. Ein klassisches Spin-Echo braucht pro k-Raum-Zeile ein ganzes TR und ist dafür viel zu langsam. Ein Gradientenecho mit kurzem TR schafft es, aber das Sichtfeld muss den breiten Bauch abdecken, sonst faltet Gewebe ein, und jede zusätzliche Zeile kostet wieder Zeit.',
      ru: 'Печень двигается с каждым вдохом. Фазовое направление измеряется строка за строкой много секунд, поэтому дыхание создаёт фантомы (см. k-пространство). Значит, всё исследование должно уложиться в одну задержку дыхания. Классическое спин-эхо тратит на каждую строку k-пространства целое TR и для этого слишком медленное. Градиентное эхо с коротким TR успевает, но поле обзора должно охватить широкий живот, иначе возникнет наложение, а каждая лишняя строка снова стоит времени.',
    },
    task: {
      de: 'Wähle eine Sequenz und Parameter für eine T1-gewichtete Aufnahme in einem Atemanhalt ohne Einfaltung.',
      ru: 'Выбери последовательность и параметры для T1-взвешенного снимка за одну задержку дыхания без артефакта наложения.',
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
        label: { de: 'T1-Kontrast: Leber heller als Läsion um ≥ 25 %', ru: 'T1-контраст: печень ярче очага на ≥ 25 %' },
        hard: true,
        check: (_p, m) => m.signals.liver >= 1.25 * m.signals.lesion,
        value: (_p, m) => pct(m.signals.liver / Math.max(m.signals.lesion, 1e-6) - 1),
      },
      { id: 'slices', label: { de: 'Leberabdeckung: ≥ 20 Schichten', ru: 'Охват печени: ≥ 20 срезов' }, hard: true, check: (p) => p.slices >= 20 },
      snrAtLeast(10, false),
      {
        id: 'cs',
        label: { de: 'Chemische Verschiebung ≤ 1,5 px', ru: 'Химический сдвиг ≤ 1,5 пикс.' },
        hard: false,
        check: (_p, m) => m.chemicalShiftPx <= 1.5,
        value: (_p, m, lang) => `${num(m.chemicalShiftPx, 2, lang)} ${U.px[lang]}`,
      },
    ],
    debrief: {
      de: 'Ein konventionelles SE benötigt für jede Phasenkodierzeile ein TR – Atemanhalt ist damit unmöglich. Ein gespoiltes GRE mit kurzem TR (≈ 150–200 ms, Multi-Slice) und mittlerem Flipwinkel liefert T1-Kontrast in Sekunden. Die Bauchbreite (380 mm) erfordert ein ausreichendes Phasen-FOV bzw. Oversampling, parallele Bildgebung verkürzt zusätzlich.',
      ru: 'Классическое SE требует одного TR на каждую строку фазового кодирования – задержка дыхания при этом невозможна. Спойлерное GRE с коротким TR (≈ 150–200 мс, многосрезовое) и средним углом отклонения даёт T1-контраст за секунды. Ширина живота (380 мм) требует достаточного фазового FOV или передискретизации (oversampling), параллельная визуализация дополнительно сокращает время.',
    },
    xp: 150,
  },
  {
    id: 'stroke-dwi',
    title: { de: 'Akuter Schlaganfall – Time is Brain', ru: 'Острый инсульт – Time is Brain' },
    icon: '⚡',
    difficulty: 3,
    anatomy: 'brain',
    story: {
      de: 'Stroke-Alarm: 64-jähriger Patient, Symptombeginn vor 90 Minuten. Für die Lysetherapie-Entscheidung braucht es in kürzester Zeit eine diffusionsgewichtete Basis-EPI. Problem: EPI ist extrem anfällig für Verzerrungen an der Schädelbasis.',
      ru: 'Инсультная тревога: пациент 64 лет, симптомы начались 90 минут назад. Для решения о тромболизисе как можно быстрее нужна базовая EPI для диффузионно-взвешенного изображения. Проблема: EPI крайне чувствительна к искажениям у основания черепа.',
    },
    physicsStory: {
      de: 'Beim Schlaganfall schwellen Nervenzellen an, und das Wasser darin kann sich kaum noch bewegen. Die Diffusionsbildgebung zeigt diese eingeschränkte Bewegung als hellen Fleck, oft schon Minuten nach dem Ereignis. Damit das schnell geht, liest EPI den ganzen k-Raum nach einer einzigen Anregung aus. Dabei wird die Bandbreite in Phasenrichtung winzig: Kleine Feldstörungen an der Schädelbasis verzerren das Bild stark, und Fett rutscht um viele Pixel (siehe Ortskodierung). Kürzere Echozüge helfen, aber Zeit, Schärfe und SNR ziehen alle in andere Richtungen.',
      ru: 'При инсульте нервные клетки набухают, и вода в них почти перестаёт двигаться. Диффузионная визуализация показывает это ограниченное движение как светлое пятно, часто уже через несколько минут после события. Чтобы это было быстро, EPI считывает всё k-пространство после одного-единственного возбуждения. При этом полоса в фазовом направлении становится крошечной: малейшие искажения поля у основания черепа сильно деформируют изображение, а жир уезжает на много пикселей (см. пространственное кодирование). Помогают более короткие эхо-поезда, но время, чёткость и SNR тянут в разные стороны.',
    },
    task: {
      de: 'Erstelle eine EPI unter 30 s mit Verzerrung ≤ 3 px und ohne Fett-Geister.',
      ru: 'Создай EPI длительностью менее 30 с с искажением ≤ 3 пикс. и без жировых фантомов.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'EPI', tr: 3000, te: 90, etl: 1, matrixRead: 128, matrixPhase: 128, fovRead: 230, fovPhase: 230, bandwidthPerPixel: 1000, nex: 4, slices: 24, acceleration: 1 },
    editable: ['tr', 'te', 'matrixPhase', 'matrixRead', 'bandwidthPerPixel', 'acceleration', 'nex', 'fatSat', 'slices', 'field'],
    allowedSequences: ['EPI'],
    requirements: [
      errorsFree,
      timeAtMost(30, true),
      {
        id: 'distortion',
        label: { de: 'Suszeptibilitätsverzerrung ≤ 3 px', ru: 'Искажения из-за магнитной восприимчивости ≤ 3 пикс.' },
        hard: true,
        check: (_p, m) => m.epiDistortionPx <= 3,
        value: (_p, m, lang) => `${num(m.epiDistortionPx, 1, lang)} ${U.px[lang]}`,
      },
      {
        id: 'fatsat',
        label: { de: 'Fettverschiebung (Phasenrichtung) ≤ 1 px', ru: 'Сдвиг жира (фазовое направление) ≤ 1 пикс.' },
        hard: true,
        check: (_p, m) => m.chemicalShiftPx <= 1,
        value: (_p, m, lang) => `${num(m.chemicalShiftPx, 1, lang)} ${U.px[lang]}`,
      },
      { id: 'coverage', label: { de: '≥ 20 Schichten', ru: '≥ 20 срезов' }, hard: true, check: (p) => p.slices >= 20 },
      snrAtLeast(6, false),
      pixelAtMost(1.8, false),
    ],
    debrief: {
      de: 'Bei EPI ist die Bandbreite pro Pixel in Phasenrichtung winzig (≈ 1/(ESP·N_PE)). Verzerrungen ∝ Δf/BW_PE lassen sich durch parallele Bildgebung (kürzerer Echozug), höhere Auslesebandbreite (kürzeres ESP) oder kleinere Phasenmatrix reduzieren. Fett verschiebt sich um viele Pixel – Fettsättigung ist bei EPI Pflicht. 1,5 T halbiert die Off-Resonanz gegenüber 3 T.',
      ru: 'В EPI полоса пропускания на пиксель в фазовом направлении ничтожно мала (≈ 1/(ESP·N_PE)). Искажения ∝ Δf/BW_PE можно уменьшить параллельной визуализацией (более короткий эхо-поезд), более широкой полосой считывания (более короткий ESP) или меньшей фазовой матрицей. Жир смещается на много пикселей – жироподавление для EPI обязательно. 1,5 Тл вдвое уменьшает внерезонансное смещение по сравнению с 3 Тл.',
    },
    xp: 180,
  },
  {
    id: 'implant-spine',
    title: { de: 'Patient mit Neurostimulator', ru: 'Пациент с нейростимулятором' },
    icon: '🔌',
    difficulty: 3,
    anatomy: 'brain',
    story: {
      de: 'Ein Patient mit MR-bedingt sicherem Rückenmark-Stimulator benötigt eine Kopf-MRT. Laut Herstellerangaben gilt: nur 1,5 T, Ganzkörper-SAR ≤ 1,0 W/kg, Kopf-Bildgebung erlaubt. Die Radiologie wünscht eine T2w-TSE mit guter Auflösung.',
      ru: 'Пациенту с условно MR-совместимым стимулятором спинного мозга нужна МРТ головы. По данным производителя: только 1,5 Тл, SAR для всего тела ≤ 1,0 Вт/кг, визуализация головы разрешена. Радиология хочет T2w-TSE с хорошим разрешением.',
    },
    physicsStory: {
      de: 'Ein Implantat mit Metallteilen und Kabeln kann sich durch die HF-Pulse erwärmen, wie eine Antenne. Deshalb gibt der Hersteller eine strenge SAR-Grenze vor. Die SAR wächst mit dem Quadrat der Feldstärke und mit dem Quadrat des Flipwinkels (siehe Kernspin, Flipwinkel), darum bringt der Wechsel von 3 T auf 1,5 T schon ein Viertel. Der Haken: Bei 1,5 T hast du nur etwa halb so viel Signal, und jede Maßnahme, die das SNR zurückholt, kostet Auflösung oder Messzeit.',
      ru: 'Имплантат с металлическими деталями и проводами может нагреваться от РЧ-импульсов, как антенна. Поэтому производитель задаёт строгий предел SAR. SAR растёт с квадратом индукции поля и с квадратом угла отклонения (см. ядерный спин, угол отклонения), поэтому переход с 3 Тл на 1,5 Тл сразу уменьшает его в четыре раза. Загвоздка: при 1,5 Тл сигнала примерно вдвое меньше, а любая мера, возвращающая SNR, стоит разрешения или времени.',
    },
    task: {
      de: 'Optimiere die T2-TSE unter der strengen SAR-Grenze von 1,0 W/kg.',
      ru: 'Оптимизируй T2-TSE при строгом пределе SAR 1,0 Вт/кг.',
    },
    start: { ...DEFAULT_PROTOCOL, sequence: 'TSE', field: 3, tr: 3000, te: 100, etl: 20, slices: 30, matrixRead: 384, matrixPhase: 320 },
    editable: ['field', 'tr', 'te', 'etl', 'refocusFlip', 'slices', 'nex', 'matrixRead', 'matrixPhase', 'bandwidthPerPixel', 'acceleration', 'sliceThickness'],
    allowedSequences: ['TSE'],
    requirements: [
      errorsFree,
      {
        id: 'field',
        label: { de: 'Feldstärke 1,5 T (Herstellervorgabe)', ru: 'Индукция поля 1,5 Тл (требование производителя)' },
        hard: true,
        check: (p) => p.field === 1.5,
      },
      {
        id: 'sar-1',
        label: { de: 'Ganzkörper-SAR ≤ 1,0 W/kg', ru: 'SAR для всего тела ≤ 1,0 Вт/кг' },
        hard: true,
        check: (_p, m) => m.sar <= 1.0,
        value: (_p, m, lang) => `${num(m.sar, 2, lang)} ${U.wkg[lang]}`,
      },
      {
        id: 't2w',
        label: { de: 'T2-Gewichtung (TR ≥ 2500 ms, TE 80–120 ms)', ru: 'T2-взвешенность (TR ≥ 2500 мс, TE 80–120 мс)' },
        hard: true,
        check: (p) => p.tr >= 2500 && p.te >= 80 && p.te <= 120,
      },
      { id: 'coverage', label: { de: '≥ 24 Schichten', ru: '≥ 24 среза' }, hard: true, check: (p) => p.slices >= 24 },
      timeAtMost(300, true),
      snrAtLeast(20, false),
      pixelAtMost(0.75, false),
    ],
    debrief: {
      de: 'Der Wechsel auf 1,5 T reduziert das SAR um den Faktor 4 (B₀²). Weitere Stellschrauben: Refokussierungswinkel senken (SAR ∝ α²), TR verlängern (weniger Pulse pro Sekunde) oder ETL verkürzen. Das SNR-Defizit von 1,5 T kompensierst du über Voxelgröße, NEX oder eine niedrigere Bandbreite.',
      ru: 'Переход на 1,5 Тл уменьшает SAR в 4 раза (B₀²). Другие рычаги: уменьшить рефокусирующий угол (SAR ∝ α²), удлинить TR (меньше импульсов в секунду) или сократить ETL. Дефицит SNR при 1,5 Тл компенсируй размером вокселя, NEX или более узкой полосой пропускания.',
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
