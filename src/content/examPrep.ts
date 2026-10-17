import type { Loc } from '../i18n/format';
import type { ModuleId } from './modules';

/** Die vier Lernziele des MBR-Skripts zum MRI-Kapitel. */
export type ObjectiveId = 'prinzip' | 'bild' | 'technik' | 'anwendung';

export interface Objective {
  id: ObjectiveId;
  title: Loc;
  /** Module, deren Fortschritt dieses Lernziel abdeckt */
  modules: ModuleId[];
}

/** Eine der Recap-Fragen am Ende des Skripts, mit ausführlicher Musterantwort. */
export interface RecapQuestion {
  id: string;
  question: Loc;
  /** Lösungsweg in kurzen Schritten (Markdown-light: **fett**, $TeX$) */
  steps: Loc[];
  /** Antwort, wie man sie in der Prüfung aufschreibt */
  answer: Loc;
  mnemonic: Loc;
  /** Pfad unter /labor, z. B. 'kspace' oder 'signal/spectrum' */
  sim?: string;
}

/** Antizipierte Prüfungsfrage, gruppiert nach Lernziel. */
export interface ExamQuestion {
  id: string;
  objective: ObjectiveId;
  module: ModuleId;
  question: Loc;
  /** Kurzantwort: das Minimum für die Punkte */
  short: Loc;
  /** Was für volle Punkte zusätzlich dazugehört */
  full: Loc;
}

export interface CheatSheetSection {
  title: Loc;
  items: Array<{ label: Loc; tex?: string; text?: Loc }>;
}

export interface LabStep {
  title: Loc;
  text: Loc;
  /** Pfad unter /labor */
  sim: string;
}

export const OBJECTIVES: Objective[] = [
  {
    id: 'prinzip',
    title: {
      de: 'Ich kann das physikalische Prinzip der MRT erklären',
      ru: 'Я могу объяснить физический принцип МРТ',
    },
    modules: ['kernspin', 'relaxation'],
  },
  {
    id: 'bild',
    title: {
      de: 'Ich kann erklären, wie aus dem Signal ein Bild wird',
      ru: 'Я могу объяснить, как из сигнала получается изображение',
    },
    modules: ['ortskodierung', 'kraum', 'relaxation'],
  },
  {
    id: 'technik',
    title: {
      de: 'Ich kann die Bauteile des Geräts und ihre Funktion beschreiben',
      ru: 'Я могу описать узлы томографа и их функцию',
    },
    modules: ['hardware'],
  },
  {
    id: 'anwendung',
    title: {
      de: 'Ich kann typische Anwendungen und Indikationen nennen',
      ru: 'Я могу назвать типичные применения и показания',
    },
    modules: ['anwendungen'],
  },
];

export const RECAP_QUESTIONS: RecapQuestion[] = [
  {
    id: 'recap-protonen',
    question: {
      de: 'Warum sind Protonen für die MRT besonders gut geeignet?',
      ru: 'Почему протоны особенно хорошо подходят для МРТ?',
    },
    steps: [
      {
        de: 'Frag dich zuerst, was die MRT braucht: ein **Signal aus dem Körper, das man einem Ort zuordnen kann**.',
        ru: 'Сначала спроси себя, что нужно МРТ: **сигнал из тела, который можно привязать к месту**.',
      },
      {
        de: '**Häufigkeit:** Wasser ist im ganzen Körper verteilt, jedes Molekül trägt zwei Wasserstoffkerne. Dazu kommt Fett. Wie viel Wasser drin ist, hängt vom Gewebe ab. Das ist die Grundlage für den Kontrast.',
        ru: '**Распространённость:** вода есть во всём теле, в каждой молекуле два ядра водорода. К этому добавляется жир. Сколько в ткани воды, зависит от ткани. На этом основан контраст.',
      },
      {
        de: '**Magnet:** Das Proton hat einen Kernspin (Spin ½). Daraus folgt ein magnetisches Moment $\\vec\\mu = \\gamma\\vec L$, also ein kleiner Stabmagnet.',
        ru: '**Магнит:** у протона есть ядерный спин (спин ½). Отсюда магнитный момент $\\vec\\mu = \\gamma\\vec L$, то есть маленький стержневой магнит.',
      },
      {
        de: '**Lautstärke:** Das Proton hat das größte gyromagnetische Verhältnis aller stabilen Kerne, $\\bar\\gamma = 42{,}57$ MHz/T. Großes γ heißt großer Energieabstand, mehr Überschuss nach Boltzmann und ein stärkeres Signal.',
        ru: '**Громкость:** у протона самое большое гиромагнитное отношение среди стабильных ядер, $\\bar\\gamma = 42{,}57$ МГц/Тл. Большое γ означает большой энергетический зазор, больший избыток по Больцману и более сильный сигнал.',
      },
      {
        de: 'Folge für die Klinik: Weichteile leuchten gut, kompakter Knochen bleibt dunkel, weil er kaum bewegliche Protonen enthält.',
        ru: 'Следствие для клиники: мягкие ткани дают хороший сигнал, плотная кость остаётся тёмной, потому что в ней почти нет подвижных протонов.',
      },
    ],
    answer: {
      de: 'Protonen (¹H) kommen in Wasser und Fett in sehr hoher Konzentration im ganzen Körper vor, und die Konzentration ist gewebeabhängig. Sie besitzen einen Kernspin ½ und damit ein magnetisches Moment. Ihr gyromagnetisches Verhältnis ist das größte aller stabilen Kerne ($\\bar\\gamma = 42{,}57$ MHz/T), deshalb ist die Nettomagnetisierung und damit das Signal am größten. Darum eignet sich die MRT besonders für Weichteile, während Knochen kaum Signal gibt.',
      ru: 'Протоны (¹H) в очень высокой концентрации содержатся в воде и жире по всему телу, и эта концентрация зависит от ткани. У них есть ядерный спин ½ и, значит, магнитный момент. Их гиромагнитное отношение самое большое среди стабильных ядер ($\\bar\\gamma = 42{,}57$ МГц/Тл), поэтому намагниченность, а с ней и сигнал, максимальны. Поэтому МРТ особенно хороша для мягких тканей, а кость почти не даёт сигнала.',
    },
    mnemonic: {
      de: '**Viel, magnetisch, laut.** Überall im Wasser, Spin ½ macht einen Mini-Magneten, größtes γ macht das lauteste Signal.',
      ru: '**Много, магнитно, громко.** Есть во всей воде, спин ½ делает мини-магнит, самое большое γ даёт самый громкий сигнал.',
    },
    sim: 'larmor',
  },
  {
    id: 'recap-gradient-steigung',
    question: {
      de: 'Gegeben ist ein Gradientenfeld $B(z) = B_0 z$. Welche Steigung $d\\omega/dz$ hat dann die Frequenz entlang z?',
      ru: 'Дано градиентное поле $B(z) = B_0 z$. Какой наклон $d\\omega/dz$ имеет тогда частота вдоль z?',
    },
    steps: [
      {
        de: 'Lies die Angabe genau. Weil $B(z) = B_0 z$ mit z (in m) multipliziert wird, ist $B_0$ hier **nicht das Hauptfeld in T**, sondern die **Gradientenstärke in T/m**. Man schreibt sonst meist $G_z$.',
        ru: 'Внимательно прочитай условие. Поскольку в $B(z) = B_0 z$ стоит умножение на z (в м), здесь $B_0$ означает **не основное поле в Тл**, а **силу градиента в Тл/м**. Обычно её обозначают $G_z$.',
      },
      {
        de: 'Setze in die Larmor-Gleichung ein: $\\omega(z) = \\gamma B(z) = \\gamma B_0 z$. Die Frequenz hängt jetzt linear vom Ort ab.',
        ru: 'Подставь в уравнение Лармора: $\\omega(z) = \\gamma B(z) = \\gamma B_0 z$. Теперь частота линейно зависит от координаты.',
      },
      {
        de: 'Leite nach z ab: $\\dfrac{d\\omega}{dz} = \\gamma B_0$. Für die Frequenz in Hz gilt entsprechend $\\dfrac{df}{dz} = \\bar\\gamma B_0$ mit $\\bar\\gamma = \\gamma/2\\pi$.',
        ru: 'Продифференцируй по z: $\\dfrac{d\\omega}{dz} = \\gamma B_0$. Для частоты в Гц соответственно $\\dfrac{df}{dz} = \\bar\\gamma B_0$, где $\\bar\\gamma = \\gamma/2\\pi$.',
      },
      {
        de: 'Ein echtes Gerät hat zusätzlich das Hauptfeld: $B(z) = B_{\\text{haupt}} + G_z z$. Die Konstante fällt beim Ableiten weg, die Steigung bleibt $\\gamma G_z$.',
        ru: 'В реальном томографе добавляется основное поле: $B(z) = B_{\\text{осн}} + G_z z$. Константа при дифференцировании исчезает, наклон остаётся $\\gamma G_z$.',
      },
      {
        de: 'Zahlenbeispiel: $B_0 = 10$ mT/m. Dann $df/dz = 42{,}57\\ \\text{MHz/T} \\cdot 0{,}01\\ \\text{T/m} = 425{,}7$ kHz/m, also rund 4,3 kHz pro cm. In Kreisfrequenz: $d\\omega/dz = 2{,}675\\cdot10^8\\ \\tfrac{\\text{rad}}{\\text{s T}} \\cdot 0{,}01\\ \\tfrac{\\text{T}}{\\text{m}} \\approx 2{,}7\\cdot10^6$ rad/(s·m).',
        ru: 'Числовой пример: $B_0 = 10$ мТл/м. Тогда $df/dz = 42{,}57\\ \\text{МГц/Тл} \\cdot 0{,}01\\ \\text{Тл/м} = 425{,}7$ кГц/м, то есть около 4,3 кГц на сантиметр. В круговой частоте: $d\\omega/dz = 2{,}675\\cdot10^8\\ \\tfrac{\\text{рад}}{\\text{с Тл}} \\cdot 0{,}01\\ \\tfrac{\\text{Тл}}{\\text{м}} \\approx 2{,}7\\cdot10^6$ рад/(с·м).',
      },
    ],
    answer: {
      de: 'Mit $\\omega = \\gamma B$ folgt $\\omega(z) = \\gamma B_0 z$ und damit $d\\omega/dz = \\gamma B_0$ (bzw. $df/dz = \\bar\\gamma B_0$). Dabei ist $B_0$ die Gradientenstärke in T/m. Beispiel: 10 mT/m ergibt 425,7 kHz/m. Die Frequenz ändert sich also linear mit dem Ort, so kann man das Signal über die Frequenz einem Ort zuordnen.',
      ru: 'Из $\\omega = \\gamma B$ следует $\\omega(z) = \\gamma B_0 z$ и, значит, $d\\omega/dz = \\gamma B_0$ (или $df/dz = \\bar\\gamma B_0$). Здесь $B_0$ это сила градиента в Тл/м. Пример: 10 мТл/м дают 425,7 кГц/м. Частота меняется линейно с координатой, поэтому по частоте сигнал можно привязать к месту.',
    },
    mnemonic: {
      de: '**Steigung rein, Steigung raus, mal γ.** Ein linearer Feldgradient macht einen linearen Frequenzgradienten.',
      ru: '**Наклон поля на входе, наклон частоты на выходе, умножить на γ.** Линейный градиент поля даёт линейный градиент частоты.',
    },
    sim: 'gradient',
  },
  {
    id: 'recap-t2-merkmal',
    question: {
      de: 'Welches Merkmal des Signals muss man auswerten, um ein T2-gewichtetes Bild zu bekommen?',
      ru: 'Какой признак сигнала нужно анализировать, чтобы получить T2-взвешенное изображение?',
    },
    steps: [
      {
        de: 'Erinnere dich: T2 ist der **Zerfall der Quermagnetisierung** $M_{xy}$. Nur $M_{xy}$ induziert ein Signal in der Spule.',
        ru: 'Вспомни: T2 это **затухание поперечной намагниченности** $M_{xy}$. Сигнал в катушке наводит только $M_{xy}$.',
      },
      {
        de: 'Der Zerfall folgt $M_{xy}(t) = M_{xy}(0)\\,e^{-t/T_2}$. Gewebe mit langem T2 (zum Beispiel Flüssigkeit) hat nach einiger Zeit noch viel Signal, Gewebe mit kurzem T2 kaum noch.',
        ru: 'Затухание идёт по закону $M_{xy}(t) = M_{xy}(0)\\,e^{-t/T_2}$. Ткань с длинным T2 (например, жидкость) спустя время ещё даёт много сигнала, ткань с коротким T2 почти ничего.',
      },
      {
        de: 'Also misst man die **Signalamplitude zu einem späten Zeitpunkt**, bei **langer Echozeit TE**. Dann sind die T2-Unterschiede groß geworden.',
        ru: 'Значит, измеряют **амплитуду сигнала в поздний момент**, при **длинном времени эха TE**. К этому моменту различия по T2 становятся большими.',
      },
      {
        de: 'Damit T1 nicht mitmischt, wählt man gleichzeitig eine **lange Repetitionszeit TR**. So ist $M_z$ vor jeder Anregung fast komplett erholt. Beispiel aus dem Skript: TR/TE = 5500/101 ms.',
        ru: 'Чтобы T1 не мешал, одновременно выбирают **длинное время повторения TR**. Тогда $M_z$ перед каждым возбуждением почти полностью восстановлен. Пример из лекции: TR/TE = 5500/101 мс.',
      },
      {
        de: 'Im Spektrum steckt T2 in der **Linienbreite**: Je schneller das Signal zerfällt, desto breiter die Linie. Für eine Lorentz-Linie gilt $\\text{FWHM} = 1/(\\pi T_2)$ in Hz.',
        ru: 'В спектре T2 видно по **ширине линии**: чем быстрее затухает сигнал, тем шире линия. Для лоренцевой линии $\\text{FWHM} = 1/(\\pi T_2)$ в Гц.',
      },
    ],
    answer: {
      de: 'Man wertet den Zerfall der Quermagnetisierung aus, also die Signalamplitude $\\propto e^{-TE/T_2}$ bei langer Echozeit TE und langer Repetitionszeit TR (zum Beispiel 5500/101 ms). Dann bestimmen T2-Unterschiede den Grauwert: langes T2, etwa Liquor, erscheint hell. Im Frequenzbereich entspricht das der Linienbreite: FWHM $= 1/(\\pi T_2)$, eine breite Linie bedeutet kurzes T2.',
      ru: 'Анализируют затухание поперечной намагниченности, то есть амплитуду сигнала $\\propto e^{-TE/T_2}$ при длинном TE и длинном TR (например, 5500/101 мс). Тогда оттенок серого определяется различиями по T2: ткани с длинным T2, например ликвор, выглядят светлыми. В частотной области этому соответствует ширина линии: FWHM $= 1/(\\pi T_2)$, широкая линия означает короткий T2.',
    },
    mnemonic: {
      de: '**T2 heißt: lange warten, dann zuhören.** Langes TE, langes TR, und im Spektrum gilt: breite Linie, kurzes T2.',
      ru: '**T2 значит: долго ждать, потом слушать.** Длинное TE, длинное TR, а в спектре: широкая линия, короткий T2.',
    },
    sim: 'signal/spectrum',
  },
  {
    id: 'recap-kanten-kraum',
    question: {
      de: 'Wie kann man über den k-Raum die Kanten in einer MRT-Schicht verstärken?',
      ru: 'Как через k-пространство усилить края на срезе МРТ?',
    },
    steps: [
      {
        de: 'Der k-Raum ist die Fourier-Darstellung des Bildes. Jeder Punkt gehört zu einer **Ortsfrequenz**, also einem Streifenmuster einer bestimmten Feinheit.',
        ru: 'k-пространство это фурье-представление изображения. Каждая точка соответствует **пространственной частоте**, то есть полосатому узору определённой мелкости.',
      },
      {
        de: '**Zentrum** (kleines k): grobe Strukturen, Helligkeit und Kontrast. **Rand** (großes k): feine Details und scharfe Kanten.',
        ru: '**Центр** (малые k): грубые структуры, яркость и контраст. **Периферия** (большие k): мелкие детали и резкие края.',
      },
      {
        de: 'Also verstärkt man den **Außenbereich**: Man multipliziert die k-Raum-Daten mit einer Gewichtsfunktion, die nach außen größer wird. Das ist ein **Hochpassfilter**.',
        ru: 'Значит, усиливают **периферию**: данные k-пространства умножают на весовую функцию, которая растёт к краям. Это **фильтр высоких частот**.',
      },
      {
        de: 'Danach wieder **inverse Fourier-Transformation**. Das Bild zeigt jetzt betonte Kanten. Nebenwirkung: Rauschen sitzt auch bei hohen k und wird mitverstärkt.',
        ru: 'Затем снова **обратное преобразование Фурье**. На изображении края выделены. Побочный эффект: шум тоже находится на больших k и усиливается вместе с ними.',
      },
      {
        de: 'Warum das erlaubt ist: Multiplikation im k-Raum entspricht nach dem Faltungssatz einer **Faltung im Bildraum**, also einem Filterkern.',
        ru: 'Почему так можно: умножение в k-пространстве по теореме о свёртке соответствует **свёртке в пространстве изображения**, то есть фильтрующему ядру.',
      },
    ],
    answer: {
      de: 'Kanten sind hohe Ortsfrequenzen und liegen im äußeren k-Raum. Man gewichtet den Rand stärker als das Zentrum (Hochpass, zum Beispiel Gewicht wächst mit $|k|$) oder schwächt das Zentrum ab und rekonstruiert dann mit der inversen FT. Das Zentrum trägt Kontrast und grobe Struktur, der Rand die Details. Nachteil: Das Rauschen wird mitverstärkt.',
      ru: 'Края это высокие пространственные частоты, они лежат на периферии k-пространства. Периферию взвешивают сильнее центра (фильтр высоких частот, например вес растёт с $|k|$) или ослабляют центр, а затем восстанавливают изображение обратным ПФ. Центр отвечает за контраст и грубую структуру, периферия за детали. Недостаток: шум тоже усиливается.',
    },
    mnemonic: {
      de: '**Mitte macht Kontrast, Rand macht Kanten.** Wer Kanten will, dreht am Rand auf.',
      ru: '**Центр даёт контраст, край даёт контуры.** Хочешь резкие края, усиливай периферию.',
    },
    sim: 'kspace',
  },
  {
    id: 'recap-komponenten',
    question: {
      de: 'Was sind die essentiellen Komponenten eines MRT-Geräts?',
      ru: 'Каковы основные компоненты МР-томографа?',
    },
    steps: [
      {
        de: 'Denk in der Reihenfolge der Physik: erst ausrichten, dann ortskodieren, dann anregen, dann empfangen, dann rechnen.',
        ru: 'Думай в порядке физики: сначала выстроить спины, потом закодировать место, потом возбудить, потом принять, потом посчитать.',
      },
      {
        de: '**Hauptmagnet** erzeugt das statische, homogene Feld $B_0$ (meist supraleitend, 1,5 T oder 3 T). Er sorgt für Nettomagnetisierung und Larmor-Frequenz.',
        ru: '**Основной магнит** создаёт статическое однородное поле $B_0$ (обычно сверхпроводящий, 1,5 Тл или 3 Тл). Он даёт намагниченность и задаёт частоту Лармора.',
      },
      {
        de: '**Gradientenspulen** für x, y und z verändern $B_0$ linear mit dem Ort. Damit hängt die Frequenz vom Ort ab: Schichtwahl, Frequenz- und Phasenkodierung.',
        ru: '**Градиентные катушки** по x, y и z линейно меняют $B_0$ вдоль координаты. Так частота зависит от места: выбор среза, частотное и фазовое кодирование.',
      },
      {
        de: '**HF-System:** Sender und Sendespule strahlen den HF-Puls $B_1$ bei der Larmor-Frequenz ein. **Empfangsspulen** (Körper-, Kopf-, Oberflächenspulen) arbeiten als Antennen und empfangen das FID- oder Echosignal.',
        ru: '**ВЧ-система:** передатчик и передающая катушка излучают ВЧ-импульс $B_1$ на частоте Лармора. **Приёмные катушки** (для тела, головы, поверхностные) работают как антенны и принимают сигнал ССИ или эха.',
      },
      {
        de: '**Signalkette und Rechner:** Vorverstärker, Demodulation in Real- und Imaginärteil, Digitalisierung (ADC), Füllen des k-Raums, inverse FFT zum Bild. Dazu die HF-Abschirmung des Raums.',
        ru: '**Тракт сигнала и компьютер:** предусилитель, демодуляция на действительную и мнимую части, оцифровка (АЦП), заполнение k-пространства, обратное БПФ до изображения. Плюс ВЧ-экранирование помещения.',
      },
    ],
    answer: {
      de: '1. Hauptmagnet: statisches homogenes $B_0$, erzeugt Nettomagnetisierung und Larmor-Präzession. 2. Gradientenspulen x, y, z: ortsabhängiges Feld, damit Schichtwahl, Frequenz- und Phasenkodierung. 3. HF-Sender mit Sendespule: HF-Puls $B_1$ bei der Larmor-Frequenz kippt M. 4. Empfangsspulen als Antennen: messen das induzierte Signal. 5. Signalverarbeitung und Rechner: Verstärkung, Demodulation, ADC, k-Raum, inverse FT. Ergänzend: HF-Abschirmung und Patientenliege.',
      ru: '1. Основной магнит: статическое однородное $B_0$, создаёт намагниченность и ларморову прецессию. 2. Градиентные катушки x, y, z: поле, зависящее от места, для выбора среза, частотного и фазового кодирования. 3. ВЧ-передатчик с передающей катушкой: импульс $B_1$ на частоте Лармора отклоняет M. 4. Приёмные катушки как антенны: регистрируют наведённый сигнал. 5. Обработка сигнала и компьютер: усиление, демодуляция, АЦП, k-пространство, обратное ПФ. Дополнительно: ВЧ-экранирование и стол пациента.',
    },
    mnemonic: {
      de: '**Magnet richtet, Gradient verortet, HF kippt, Spule hört, Rechner rechnet.** Fünf Bauteile, fünf Verben.',
      ru: '**Магнит выстраивает, градиент локализует, ВЧ отклоняет, катушка слушает, компьютер считает.** Пять узлов, пять глаголов.',
    },
    sim: 'scanner',
  },
];

export const EXAM_QUESTIONS: ExamQuestion[] = [
  // ---------- Lernziel 1: Physikalisches Prinzip ----------
  {
    id: 'boltzmann-nettomagnetisierung',
    objective: 'prinzip',
    module: 'kernspin',
    question: {
      de: 'Wie entsteht im Magnetfeld eine Nettomagnetisierung, und wovon hängt ihre Größe ab?',
      ru: 'Как в магнитном поле возникает результирующая намагниченность и от чего зависит её величина?',
    },
    short: {
      de: 'Ohne Feld sind die Spins zufällig orientiert, die Momente heben sich auf. Im Feld $B_0$ gibt es zwei Energieniveaus, und nach Boltzmann ist das energieärmere (parallele) Niveau minimal stärker besetzt. Die Summe dieses Überschusses ist die Nettomagnetisierung $M_0$ entlang $B_0$.',
      ru: 'Без поля спины ориентированы хаотично, моменты компенсируют друг друга. В поле $B_0$ есть два энергетических уровня, и по Больцману нижний (параллельный) уровень заселён чуть сильнее. Сумма этого избытка и есть результирующая намагниченность $M_0$ вдоль $B_0$.',
    },
    full: {
      de: 'Nenne das Besetzungsverhältnis $N_\\uparrow/N_\\downarrow = e^{\\Delta E/k_BT}$ mit $\\Delta E = \\gamma\\hbar B_0$. Bei 1,5 T und Körpertemperatur ist der Überschuss nur etwa 5 pro Million. $M_0$ wächst also mit $B_0$ und sinkt mit der Temperatur. Weil der Körper extrem viele Protonen hat, reicht das trotzdem für ein messbares Signal.',
      ru: 'Приведи отношение заселённостей $N_\\uparrow/N_\\downarrow = e^{\\Delta E/k_BT}$ при $\\Delta E = \\gamma\\hbar B_0$. При 1,5 Тл и температуре тела избыток всего около 5 на миллион. Значит, $M_0$ растёт с $B_0$ и падает с температурой. Поскольку протонов в теле огромное количество, этого всё равно хватает для измеримого сигнала.',
    },
  },
  {
    id: 'spin-energieniveaus',
    objective: 'prinzip',
    module: 'kernspin',
    question: {
      de: 'Was bedeutet „Spin-½-System“, und welche Energieniveaus hat ein Proton im Feld $B_0$?',
      ru: 'Что значит «система со спином ½» и какие энергетические уровни есть у протона в поле $B_0$?',
    },
    short: {
      de: 'Der Drehimpuls des Protons ist gequantelt: $L_z = m\\hbar$ mit nur zwei Werten $m = \\pm\\tfrac12$. Im Feld gilt $E_m = -\\mu_z B_0 = -\\gamma\\hbar m B_0$, es gibt also zwei Niveaus (parallel tiefer, antiparallel höher).',
      ru: 'Момент импульса протона квантуется: $L_z = m\\hbar$, всего два значения $m = \\pm\\tfrac12$. В поле $E_m = -\\mu_z B_0 = -\\gamma\\hbar m B_0$, то есть уровней два (параллельный ниже, антипараллельный выше).',
    },
    full: {
      de: 'Der Abstand ist $\\Delta E = \\gamma\\hbar B_0 = \\hbar\\omega_0$. Ein HF-Photon mit genau der Larmor-Frequenz kann den Übergang anregen, das ist die Resonanzbedingung. Erwähne $\\vec\\mu = \\gamma\\vec L$ und $\\hbar = 1{,}0546\\cdot10^{-34}$ Js.',
      ru: 'Зазор равен $\\Delta E = \\gamma\\hbar B_0 = \\hbar\\omega_0$. ВЧ-фотон точно с частотой Лармора может вызвать переход, это и есть условие резонанса. Упомяни $\\vec\\mu = \\gamma\\vec L$ и $\\hbar = 1{,}0546\\cdot10^{-34}$ Дж·с.',
    },
  },
  {
    id: 'larmor-rechnung',
    objective: 'prinzip',
    module: 'kernspin',
    question: {
      de: 'Berechne die Larmor-Frequenz von ¹H bei 1,5 T und bei 3 T. Warum muss der HF-Puls genau diese Frequenz haben?',
      ru: 'Рассчитай частоту Лармора для ¹H при 1,5 Тл и при 3 Тл. Почему ВЧ-импульс должен иметь именно эту частоту?',
    },
    short: {
      de: '$f_0 = \\bar\\gamma B_0$ mit $\\bar\\gamma = 42{,}57$ MHz/T. Bei 1,5 T sind das 63,9 MHz, bei 3 T 127,7 MHz. Nur ein Puls bei der Larmor-Frequenz ist in Resonanz und kann die Magnetisierung kippen.',
      ru: '$f_0 = \\bar\\gamma B_0$, где $\\bar\\gamma = 42{,}57$ МГц/Тл. При 1,5 Тл это 63,9 МГц, при 3 Тл 127,7 МГц. Только импульс на частоте Лармора находится в резонансе и может отклонить намагниченность.',
    },
    full: {
      de: 'Unterscheide f und ω: $\\omega_0 = \\gamma B_0 = 2\\pi f_0$, bei 3 T also etwa $8{,}0\\cdot10^8$ rad/s. Achtung, im Skript steht ω zusammen mit 42,57 MHz/T, dieser Wert gehört aber zu $\\bar\\gamma = \\gamma/2\\pi$. Begründung der Resonanz: Im mitrotierenden System wirkt $B_1$ nur dann wie ein stehendes Feld, wenn es mit $\\omega_0$ mitläuft, so wie eine Schaukel nur im richtigen Takt höher schwingt.',
      ru: 'Различай f и ω: $\\omega_0 = \\gamma B_0 = 2\\pi f_0$, при 3 Тл это около $8{,}0\\cdot10^8$ рад/с. Внимание: в лекции ω стоит вместе с 42,57 МГц/Тл, но это значение относится к $\\bar\\gamma = \\gamma/2\\pi$. Обоснование резонанса: во вращающейся системе $B_1$ действует как неподвижное поле, только если вращается с $\\omega_0$, как качели раскачиваются лишь в правильном такте.',
    },
  },
  {
    id: 'bloch-terme',
    objective: 'prinzip',
    module: 'kernspin',
    question: {
      de: 'Schreibe die Bloch-Gleichung auf und erkläre die Bedeutung ihrer Terme.',
      ru: 'Запиши уравнение Блоха и объясни смысл его членов.',
    },
    short: {
      de: '$\\frac{d\\vec M}{dt} = \\gamma\\vec M\\times\\vec B - \\frac{M_x\\vec e_x + M_y\\vec e_y}{T_2} - \\frac{(M_z - M_0)\\vec e_z}{T_1}$. Das Kreuzprodukt beschreibt die Präzession um B. Der T2-Term lässt die Quermagnetisierung zerfallen, der T1-Term bringt $M_z$ zurück zu $M_0$.',
      ru: '$\\frac{d\\vec M}{dt} = \\gamma\\vec M\\times\\vec B - \\frac{M_x\\vec e_x + M_y\\vec e_y}{T_2} - \\frac{(M_z - M_0)\\vec e_z}{T_1}$. Векторное произведение описывает прецессию вокруг B. Член с T2 гасит поперечную намагниченность, член с T1 возвращает $M_z$ к $M_0$.',
    },
    full: {
      de: 'Schreibe die Komponenten aus, etwa $\\frac{dM_x}{dt} = \\gamma(M_yB_z - M_zB_y) - \\frac{M_x}{T_2}$ (im Skript ohne γ in normierter Form). Erkläre: $\\vec M = \\sum_i\\vec\\mu_i$ ist die makroskopische Summe der Dipole. $B_z$ enthält $B_0$ und Gradienten, $B_x, B_y$ sind der HF-Puls $B_1\\cos\\omega t$ bzw. $B_1\\sin\\omega t$. T2 heißt Spin-Spin-, T1 Spin-Gitter-Relaxation.',
      ru: 'Распиши компоненты, например $\\frac{dM_x}{dt} = \\gamma(M_yB_z - M_zB_y) - \\frac{M_x}{T_2}$ (в лекции в нормированном виде без γ). Объясни: $\\vec M = \\sum_i\\vec\\mu_i$ это макроскопическая сумма диполей. $B_z$ содержит $B_0$ и градиенты, $B_x, B_y$ это ВЧ-импульс $B_1\\cos\\omega t$ и $B_1\\sin\\omega t$. T2 называют спин-спиновой, T1 спин-решёточной релаксацией.',
    },
  },
  {
    id: 'hf-puls-fid',
    objective: 'prinzip',
    module: 'kernspin',
    question: {
      de: 'Was bewirken ein 90°- und ein 180°-Puls, und was ist der FID?',
      ru: 'Что делают импульсы 90° и 180° и что такое ССИ (FID)?',
    },
    short: {
      de: 'Der 90°-Puls kippt $M$ aus der z-Richtung in die xy-Ebene. Der 180°-Puls dreht $M$ um, bzw. spiegelt die Phasen in der xy-Ebene (Spin-Echo). Nach dem Puls präzediert $M_{xy}$ und induziert in der Spule ein abklingendes Signal, den freien Induktionszerfall (FID).',
      ru: 'Импульс 90° отклоняет $M$ из направления z в плоскость xy. Импульс 180° переворачивает $M$ или зеркально отражает фазы в плоскости xy (спиновое эхо). После импульса $M_{xy}$ прецессирует и наводит в катушке затухающий сигнал, спад свободной индукции (ССИ).',
    },
    full: {
      de: 'Der Kippwinkel hängt von Stärke und Dauer des Pulses ab: $\\alpha = \\gamma B_1 \\tau$. Die Protonen nehmen HF-Energie auf und geben sie beim Zurückkehren als Signal wieder ab. Der FID zerfällt mit $T_2^*$, weil zu T2 noch Feldinhomogenitäten kommen. Der 180°-Puls hebt die Inhomogenitäts-Dephasierung wieder auf, deshalb misst man im Spin-Echo das echte T2.',
      ru: 'Угол отклонения зависит от силы и длительности импульса: $\\alpha = \\gamma B_1 \\tau$. Протоны поглощают ВЧ-энергию и при возврате излучают её в виде сигнала. ССИ затухает с $T_2^*$, потому что к T2 добавляются неоднородности поля. Импульс 180° отменяет дефазировку из-за неоднородностей, поэтому в спиновом эхе измеряют настоящий T2.',
    },
  },
  {
    id: 't1-t2-t2stern',
    objective: 'prinzip',
    module: 'relaxation',
    question: {
      de: 'Vergleiche T1, T2 und T2*.',
      ru: 'Сравни T1, T2 и T2*.',
    },
    short: {
      de: 'T1: Wiederaufbau der Längsmagnetisierung $M_z$ durch Energieabgabe an die Umgebung (Spin-Gitter). T2: Zerfall der Quermagnetisierung $M_{xy}$ durch Verlust der Phasenkohärenz (Spin-Spin). T2*: Gesamtzerfall des FID, T2 plus Feldinhomogenitäten, deshalb $T_2^* \\le T_2 \\le T_1$.',
      ru: 'T1: восстановление продольной намагниченности $M_z$ за счёт отдачи энергии окружению (спин-решётка). T2: затухание поперечной намагниченности $M_{xy}$ из-за потери фазовой когерентности (спин-спин). T2*: полное затухание ССИ, T2 плюс неоднородности поля, поэтому $T_2^* \\le T_2 \\le T_1$.',
    },
    full: {
      de: 'Formeln: $M_z(t) = M_0(1 - e^{-t/T_1})$ nach 90°, $M_{xy}(t) = M_{xy}(0)e^{-t/T_2}$, $\\frac{1}{T_2^*} = \\frac{1}{T_2} + \\frac{1}{T_2\'}$. Bei T2 wird Energie zwischen Spins ausgetauscht, es ist empfindlich für die Wasserbeweglichkeit. Typische Größen: T1 einige hundert bis über tausend ms, T2 einige zehn bis hundert ms, freies Wasser hat beide lang.',
      ru: 'Формулы: $M_z(t) = M_0(1 - e^{-t/T_1})$ после 90°, $M_{xy}(t) = M_{xy}(0)e^{-t/T_2}$, $\\frac{1}{T_2^*} = \\frac{1}{T_2} + \\frac{1}{T_2\'}$. При T2 энергия обменивается между спинами, процесс чувствителен к подвижности воды. Типичные величины: T1 от нескольких сотен до более тысячи мс, T2 от десятков до сотни мс, у свободной воды оба времени длинные.',
    },
  },
  {
    id: 'fwhm-t2',
    objective: 'prinzip',
    module: 'relaxation',
    question: {
      de: 'Wie kann man T2 aus einem Spektrum bestimmen? Rechne ein Beispiel.',
      ru: 'Как определить T2 по спектру? Приведи числовой пример.',
    },
    short: {
      de: 'Das exponentiell abklingende Signal ergibt nach der Fourier-Transformation eine Lorentz-Linie. Ihre Breite auf halber Höhe (FWHM) ist umgekehrt proportional zu T2: $\\text{FWHM} = \\frac{1}{\\pi T_2}$ in Hz. Breite Linie heißt schneller Zerfall, also kurzes T2.',
      ru: 'Экспоненциально затухающий сигнал после преобразования Фурье даёт лоренцеву линию. Её ширина на половине высоты (FWHM) обратно пропорциональна T2: $\\text{FWHM} = \\frac{1}{\\pi T_2}$ в Гц. Широкая линия означает быстрое затухание, то есть короткий T2.',
    },
    full: {
      de: 'Beispiel: $T_2 = 100$ ms ergibt FWHM $= 1/(\\pi\\cdot0{,}1\\ \\text{s}) \\approx 3{,}2$ Hz. In Kreisfrequenz ist die Breite $2/T_2$. Erkläre das Prinzip Zeit gegen Frequenz: kurzes Signal, breites Spektrum. Achtung: Misst man einen FID im inhomogenen Feld, gibt die Linienbreite eigentlich $T_2^*$.',
      ru: 'Пример: $T_2 = 100$ мс даёт FWHM $= 1/(\\pi\\cdot0{,}1\\ \\text{с}) \\approx 3{,}2$ Гц. В круговой частоте ширина равна $2/T_2$. Объясни принцип «время против частоты»: короткий сигнал, широкий спектр. Внимание: если измерять ССИ в неоднородном поле, ширина линии на самом деле даёт $T_2^*$.',
    },
  },
  // ---------- Lernziel 2: Bilderzeugung ----------
  {
    id: 'gewichtung-tr-te',
    objective: 'bild',
    module: 'relaxation',
    question: {
      de: 'Wie stellt man mit TR und TE ein PD-, T1- oder T2-gewichtetes Bild ein?',
      ru: 'Как с помощью TR и TE получить PD-, T1- или T2-взвешенное изображение?',
    },
    short: {
      de: 'PD: langes TR, kurzes TE (T1 und T2 wirken kaum). T1: kurzes TR, kurzes TE (T1-Unterschiede in der Erholung bleiben sichtbar). T2: langes TR, langes TE (T2-Zerfall wird sichtbar).',
      ru: 'PD: длинное TR, короткое TE (T1 и T2 почти не влияют). T1: короткое TR, короткое TE (видны различия в восстановлении по T1). T2: длинное TR, длинное TE (виден спад по T2).',
    },
    full: {
      de: 'Beispiele aus dem Skript: PDw 5500/14 ms, T1w 500/10 ms, T2w 5500/101 ms. Signalmodell (Spin-Echo): $S \\propto \\rho\\,(1 - e^{-TR/T_1})\\,e^{-TE/T_2}$. TR ist die Zeit zwischen zwei Anregungen und steuert den T1-Einfluss, TE ist die Zeit bis zum Echo und steuert den T2-Einfluss. In T2w ist Liquor hell, in T1w dunkel.',
      ru: 'Примеры из лекции: PDw 5500/14 мс, T1w 500/10 мс, T2w 5500/101 мс. Модель сигнала (спиновое эхо): $S \\propto \\rho\\,(1 - e^{-TR/T_1})\\,e^{-TE/T_2}$. TR это время между двумя возбуждениями, оно управляет влиянием T1, TE это время до эха, оно управляет влиянием T2. На T2w ликвор светлый, на T1w тёмный.',
    },
  },
  {
    id: 'frequenzkodierung',
    objective: 'bild',
    module: 'ortskodierung',
    question: {
      de: 'Erkläre das Prinzip der Frequenzkodierung.',
      ru: 'Объясни принцип частотного кодирования.',
    },
    short: {
      de: 'Die Larmor-Frequenz hängt vom Magnetfeld ab. Ein Gradientenfeld macht das Feld ortsabhängig, $B(x) = B_0 + G_x x$. Damit funkt jeder Ort auf seiner eigenen Frequenz $\\omega(x) = \\gamma(B_0 + G_x x)$, und man kann das empfangene Signal über die Frequenz einem Ort zuordnen.',
      ru: 'Частота Лармора зависит от магнитного поля. Градиентное поле делает поле зависящим от координаты, $B(x) = B_0 + G_x x$. Тогда каждая точка «вещает» на своей частоте $\\omega(x) = \\gamma(B_0 + G_x x)$, и принятый сигнал можно по частоте привязать к месту.',
    },
    full: {
      de: 'Im mitrotierenden System bleibt nur der Gradientenanteil $\\omega(x) = \\gamma G_x x$. Das Signal ist dann $s(t) = \\int\\rho(x)e^{i\\gamma G_x x t}dx$, eine Fourier-Transformation von $\\rho(x)$. Bild: Klavier, auf dem jede Position eine eigene Taste hat, man hört einen Akkord und zerlegt ihn in Töne. Der Gradient wird während der Auslese geschaltet (Read-out-Gradient).',
      ru: 'Во вращающейся системе остаётся только градиентная часть $\\omega(x) = \\gamma G_x x$. Сигнал тогда равен $s(t) = \\int\\rho(x)e^{i\\gamma G_x x t}dx$, то есть преобразованию Фурье от $\\rho(x)$. Образ: пианино, где каждой позиции соответствует своя клавиша, слышен аккорд, и его раскладывают на ноты. Градиент включают во время считывания (градиент считывания).',
    },
  },
  {
    id: 'drei-gradientenrollen',
    objective: 'bild',
    module: 'ortskodierung',
    question: {
      de: 'Welche drei Aufgaben übernehmen die Gradienten bei der Bildgebung?',
      ru: 'Какие три задачи выполняют градиенты при получении изображения?',
    },
    short: {
      de: 'Schichtwahl $G_{SS}$: während des HF-Pulses, nur eine Schicht ist in Resonanz. Phasenkodierung $G_{PE}$: kurz zwischen Anregung und Auslese, prägt jeder Zeile eine ortsabhängige Phase auf. Frequenzkodierung $G_{RO}$: während der Auslese, jede Spalte hat ihre Frequenz.',
      ru: 'Выбор среза $G_{SS}$: во время ВЧ-импульса, в резонансе находится только один срез. Фазовое кодирование $G_{PE}$: кратко между возбуждением и считыванием, задаёт каждой строке фазу, зависящую от места. Частотное кодирование $G_{RO}$: во время считывания, у каждого столбца своя частота.',
    },
    full: {
      de: 'Es gibt drei physikalische Gradientenspulen (x, y, z) im Magneten, die logischen Rollen SS, PE, RO können beliebig auf sie verteilt werden. Die Schichtdicke hängt von der Pulsbandbreite und der Gradientenstärke ab: $\\Delta z = \\Delta f/(\\bar\\gamma G_{SS})$. Die Phasenkodierung wird für jede k-Raum-Zeile mit anderer Stärke wiederholt.',
      ru: 'В магните три физические градиентные катушки (x, y, z), логические роли SS, PE, RO можно распределять между ними произвольно. Толщина среза зависит от полосы импульса и силы градиента: $\\Delta z = \\Delta f/(\\bar\\gamma G_{SS})$. Фазовое кодирование повторяют для каждой строки k-пространства с другой силой градиента.',
    },
  },
  {
    id: 'signal-als-integral',
    objective: 'bild',
    module: 'ortskodierung',
    question: {
      de: 'Warum kann man das gemessene MR-Signal als Integral über die Protonendichte schreiben?',
      ru: 'Почему измеренный МР-сигнал можно записать как интеграл по плотности протонов?',
    },
    short: {
      de: 'Die Spule misst die Summe aller Einzelbeiträge: $s(t) = \\hat s\\sum_i e^{i\\omega_i t}$. Bei sehr vielen Protonen ersetzt man die Summe durch die Protonendichte $\\rho(x) = dn/dV$ und erhält $s(t) = \\int\\rho(x)e^{i\\omega(x)t}dx$.',
      ru: 'Катушка регистрирует сумму всех отдельных вкладов: $s(t) = \\hat s\\sum_i e^{i\\omega_i t}$. При очень большом числе протонов сумму заменяют плотностью протонов $\\rho(x) = dn/dV$ и получают $s(t) = \\int\\rho(x)e^{i\\omega(x)t}dx$.',
    },
    full: {
      de: 'Mit Gradient wird $\\omega(x) = \\gamma G_x x$, bei zeitabhängigem Gradienten steht im Exponent die Phase $\\gamma\\int G_x(t)dt\\,x = k_x x$. Damit $s(k_x) = \\int\\rho(x)e^{ik_x x}dx$, in 2D $s(k_x,k_y) = \\iint\\rho(x,y)e^{i(k_x x + k_y y)}dx\\,dy$. Achtung, im Skript steht im 2D-Exponenten zweimal x, richtig ist $k_x x + k_y y$. Bild: ein Chor, man hört nur die Summe aller Stimmen.',
      ru: 'С градиентом $\\omega(x) = \\gamma G_x x$, при градиенте, зависящем от времени, в показателе стоит фаза $\\gamma\\int G_x(t)dt\\,x = k_x x$. Отсюда $s(k_x) = \\int\\rho(x)e^{ik_x x}dx$, в 2D $s(k_x,k_y) = \\iint\\rho(x,y)e^{i(k_x x + k_y y)}dx\\,dy$. Внимание: в лекции в двумерном показателе дважды стоит x, правильно $k_x x + k_y y$. Образ: хор, слышна только сумма всех голосов.',
    },
  },
  {
    id: 'kraum-inverse-ft',
    objective: 'bild',
    module: 'kraum',
    question: {
      de: 'Was ist der k-Raum, und wie kommt man von ihm zum Bild?',
      ru: 'Что такое k-пространство и как от него перейти к изображению?',
    },
    short: {
      de: 'Der k-Raum ist der Speicher der gemessenen Signalwerte $s(k_x,k_y)$, geordnet nach Ortsfrequenzen (Frequenz- und Phasenkodierrichtung). Er ist die Fourier-Transformierte der Protonendichte. Das Bild erhält man mit der inversen Fourier-Transformation: $\\rho(x,y) = \\mathcal F^{-1}[s(k_x,k_y)]$.',
      ru: 'k-пространство это массив измеренных значений сигнала $s(k_x,k_y)$, упорядоченных по пространственным частотам (направления частотного и фазового кодирования). Это преобразование Фурье плотности протонов. Изображение получают обратным преобразованием Фурье: $\\rho(x,y) = \\mathcal F^{-1}[s(k_x,k_y)]$.',
    },
    full: {
      de: 'Erkläre $k_x = \\gamma\\int G_x(t)dt$: Der Gradient bewegt die Messung durch den k-Raum. Jede Zeile kommt aus einem Echo mit einer anderen Phasenkodierstufe. Die Rekonstruktion nutzt die schnelle FFT. Jeder Bildpunkt ist mit der Spinmenge und der magnetischen Umgebung am Ort verbunden. Ein k-Raum-Punkt ist kein Bildpunkt, sondern ein Streifenmuster über das ganze Bild.',
      ru: 'Объясни $k_x = \\gamma\\int G_x(t)dt$: градиент перемещает измерение по k-пространству. Каждая строка берётся из эха с другим шагом фазового кодирования. Реконструкция использует быстрое БПФ. Каждый пиксель связан с количеством спинов и магнитным окружением в этом месте. Точка k-пространства не пиксель, а полосатый узор по всему изображению.',
    },
  },
  {
    id: 'kraum-zentrum-rand',
    objective: 'bild',
    module: 'kraum',
    question: {
      de: 'Was passiert mit dem Bild, wenn man nur das Zentrum bzw. nur den Rand des k-Raums verwendet?',
      ru: 'Что происходит с изображением, если использовать только центр или только периферию k-пространства?',
    },
    short: {
      de: 'Nur Zentrum (Tiefpass): Kontrast und grobe Formen bleiben, das Bild wird unscharf. Nur Rand (Hochpass): nur Kanten und feine Details bleiben, flächige Helligkeit fehlt.',
      ru: 'Только центр (фильтр низких частот): контраст и грубые формы сохраняются, изображение становится размытым. Только периферия (фильтр высоких частот): остаются только края и мелкие детали, пропадает общая яркость.',
    },
    full: {
      de: 'Begründung: Kleine k sind langsame Ortsfrequenzen (große Strukturen), große k schnelle (feine Strukturen). Das Zentrum enthält den größten Teil der Signalenergie. Ein harter Schnitt im k-Raum erzeugt Überschwinger an Kanten (Gibbs-Ringing). Das ist die Grundlage der Recap-Frage zur Kantenverstärkung.',
      ru: 'Обоснование: малые k это медленные пространственные частоты (крупные структуры), большие k быстрые (мелкие структуры). В центре сосредоточена большая часть энергии сигнала. Резкая обрезка k-пространства даёт осцилляции у краёв (эффект Гиббса). На этом основан итоговый вопрос об усилении краёв.',
    },
  },
  {
    id: 'fourier-reihe-an-bn',
    objective: 'bild',
    module: 'kraum',
    question: {
      de: 'Wie bestimmt man die Fourier-Koeffizienten $a_n$ und $b_n$ eines gemessenen Signals? Erkläre die Idee der Testfunktion.',
      ru: 'Как определить коэффициенты Фурье $a_n$ и $b_n$ измеренного сигнала? Объясни идею пробной функции.',
    },
    short: {
      de: 'Man multipliziert das Signal mit einer Testfunktion (cos oder sin mit Frequenz $n\\omega$) und integriert über eine Periode: $a_n = \\frac{2}{T}\\int_0^T f(t)\\cos(n\\omega t)dt$, $b_n = \\frac{2}{T}\\int_0^T f(t)\\sin(n\\omega t)dt$. Nur der passende Anteil liefert einen Wert ungleich null.',
      ru: 'Сигнал умножают на пробную функцию (cos или sin с частотой $n\\omega$) и интегрируют по периоду: $a_n = \\frac{2}{T}\\int_0^T f(t)\\cos(n\\omega t)dt$, $b_n = \\frac{2}{T}\\int_0^T f(t)\\sin(n\\omega t)dt$. Ненулевое значение даёт только совпадающая составляющая.',
    },
    full: {
      de: 'Grund ist die Orthogonalität: $\\int_0^{2\\pi}\\sin t\\,\\sin 2t\\,dt = 0$, aber $\\int_0^{2\\pi}\\sin^2 t\\,dt = \\pi$. Das sind genau die zwei Beispiele aus dem Skript. Ausgangspunkt ist die Reihe $f(t) = \\frac{a_0}{2} + \\sum_{n\\ge1}(a_n\\cos n\\omega t + b_n\\sin n\\omega t)$ mit $\\omega = 2\\pi/T$, Beispiel Sägezahn $\\sum\\frac1n\\sin nt$. Bild: Die Testfunktion ist wie eine Stimmgabel, sie schwingt nur mit, wenn der Ton im Signal steckt.',
      ru: 'Причина в ортогональности: $\\int_0^{2\\pi}\\sin t\\,\\sin 2t\\,dt = 0$, но $\\int_0^{2\\pi}\\sin^2 t\\,dt = \\pi$. Это ровно два примера из лекции. Исходная точка: ряд $f(t) = \\frac{a_0}{2} + \\sum_{n\\ge1}(a_n\\cos n\\omega t + b_n\\sin n\\omega t)$ при $\\omega = 2\\pi/T$, пример пила $\\sum\\frac1n\\sin nt$. Образ: пробная функция как камертон, она откликается, только если такой тон есть в сигнале.',
    },
  },
  {
    id: 'fourier-linearitaet-faltung',
    objective: 'bild',
    module: 'kraum',
    question: {
      de: 'Nenne zwei Eigenschaften der Fourier-Transformation und zeige, wofür man sie in der MRT braucht.',
      ru: 'Назови два свойства преобразования Фурье и покажи, зачем они нужны в МРТ.',
    },
    short: {
      de: 'Linearität: $\\mathcal F[af + bg] = a\\mathcal F[f] + b\\mathcal F[g]$, folgt direkt aus der Linearität des Integrals. Faltungssatz: $\\mathcal F[f * g] = \\mathcal F[f]\\cdot\\mathcal F[g]$, eine Faltung wird zur Multiplikation.',
      ru: 'Линейность: $\\mathcal F[af + bg] = a\\mathcal F[f] + b\\mathcal F[g]$, прямо следует из линейности интеграла. Теорема о свёртке: $\\mathcal F[f * g] = \\mathcal F[f]\\cdot\\mathcal F[g]$, свёртка превращается в умножение.',
    },
    full: {
      de: 'Linearität erklärt, warum das Signal vieler Spins einfach die Summe der Einzelsignale ist und jedes Gewebe seinen Anteil beiträgt. Der Faltungssatz erklärt Filter: Multipliziert man den k-Raum mit einer Fensterfunktion, ist das Bild mit dem zugehörigen Kern gefaltet (Tiefpass glättet, Hochpass schärft). Ebenso wird ein exponentieller Zerfall im Spektrum zu einer verbreiterten Linie.',
      ru: 'Линейность объясняет, почему сигнал многих спинов просто сумма отдельных сигналов и каждая ткань вносит свою долю. Теорема о свёртке объясняет фильтры: если умножить k-пространство на оконную функцию, изображение свернётся с соответствующим ядром (низкочастотный фильтр сглаживает, высокочастотный делает резче). Точно так же экспоненциальное затухание даёт в спектре уширенную линию.',
    },
  },
  {
    id: 'dft-signalmodifikation',
    objective: 'bild',
    module: 'kraum',
    question: {
      de: 'Lab 3: Wie ändert sich das Spektrum, wenn du Frequenz, Amplitude oder Dämpfung des Signals veränderst?',
      ru: 'Лабораторная 3: как меняется спектр, если изменить частоту, амплитуду или затухание сигнала?',
    },
    short: {
      de: 'Höhere Frequenz verschiebt den Peak nach rechts. Größere Amplitude macht den Peak höher. Stärkere Dämpfung (kürzeres T2) macht den Peak breiter und niedriger. Zwei überlagerte Frequenzen ergeben zwei Peaks (Linearität).',
      ru: 'Более высокая частота сдвигает пик вправо. Бо́льшая амплитуда делает пик выше. Более сильное затухание (короче T2) делает пик шире и ниже. Две наложенные частоты дают два пика (линейность).',
    },
    full: {
      de: 'Die DFT im Tabellenblatt ist die numerische Version der $a_n, b_n$-Integrale: Summe statt Integral über N Abtastwerte, $X_n = \\sum_k f_k e^{-2\\pi i nk/N}$. Die Frequenzauflösung ist $1/T$ (Messdauer), die höchste darstellbare Frequenz ist die halbe Abtastrate. Ein abgeschnittenes Signal erzeugt Nebenzipfel. Phasenverschiebung ändert die Aufteilung auf Real- und Imaginärteil, nicht den Betrag.',
      ru: 'ДПФ в таблице это численный вариант интегралов для $a_n, b_n$: сумма вместо интеграла по N отсчётам, $X_n = \\sum_k f_k e^{-2\\pi i nk/N}$. Разрешение по частоте $1/T$ (длительность измерения), максимальная представимая частота равна половине частоты дискретизации. Обрезанный сигнал даёт боковые лепестки. Фазовый сдвиг меняет распределение между действительной и мнимой частью, но не модуль.',
    },
  },
  // ---------- Lernziel 3: Technische Komponenten ----------
  {
    id: 'em-welle-komplexes-signal',
    objective: 'technik',
    module: 'hardware',
    question: {
      de: 'Beschreibe die elektromagnetische Welle des MR-Signals und warum man das Signal komplex schreibt.',
      ru: 'Опиши электромагнитную волну МР-сигнала и объясни, почему сигнал записывают в комплексной форме.',
    },
    short: {
      de: 'Das Signal ist eine transversale EM-Welle, E und B stehen senkrecht zueinander und zur Ausbreitung: $\\vec E(\\vec r,t) = \\hat E\\cos(\\vec k\\cdot\\vec r - \\omega t + \\varphi)$. An der festen Antenne bleibt $E(t) = \\hat E\\cos(\\omega t + \\varphi)$. Man schreibt es als $s(t) = \\hat E e^{i\\omega t}$, weil so Amplitude und Phase gemeinsam erfasst werden.',
      ru: 'Сигнал это поперечная ЭМ-волна, E и B перпендикулярны друг другу и направлению распространения: $\\vec E(\\vec r,t) = \\hat E\\cos(\\vec k\\cdot\\vec r - \\omega t + \\varphi)$. На неподвижной антенне остаётся $E(t) = \\hat E\\cos(\\omega t + \\varphi)$. Его записывают как $s(t) = \\hat E e^{i\\omega t}$, потому что так амплитуда и фаза учитываются вместе.',
    },
    full: {
      de: 'Euler: $e^{i\\omega t} = \\cos\\omega t + i\\sin\\omega t$. Technisch misst man zwei Kanäle (Quadraturdetektion), einen mit cos und einen mit sin, das sind Real- und Imaginärteil. Ohne Phase ginge keine Phasenkodierung und keine Flussmessung, und man könnte positive und negative Frequenzen nicht unterscheiden. Achtung: Im Skript steht $\\hat E(\\cos\\omega t + i\\sin\\omega t)$ direkt als E(t). Gemeint ist die komplexe Darstellung, physikalisch messbar ist der Realteil.',
      ru: 'Эйлер: $e^{i\\omega t} = \\cos\\omega t + i\\sin\\omega t$. Технически измеряют два канала (квадратурное детектирование), один с cos и один с sin, это действительная и мнимая часть. Без фазы не было бы фазового кодирования и измерения потока, а положительные и отрицательные частоты нельзя было бы различить. Внимание: в лекции $\\hat E(\\cos\\omega t + i\\sin\\omega t)$ записано прямо как E(t). Имеется в виду комплексное представление, физически измеряется действительная часть.',
    },
  },
  {
    id: 'magnetbauformen',
    objective: 'technik',
    module: 'hardware',
    question: {
      de: 'Welche Magnetbauformen gibt es, und welche Vor- und Nachteile haben sie?',
      ru: 'Какие бывают конструкции магнитов и каковы их преимущества и недостатки?',
    },
    short: {
      de: 'Geschlossener Tunnelmagnet (supraleitende Spule, 1,5 T bis 3 T, Helium-gekühlt): hohes, sehr homogenes Feld, gutes Signal, aber eng. Offene Bauform (C-Bogen oder zwei Pole, meist Permanent- oder Widerstandsmagnet): mehr Platz für Patienten und Eingriffe, aber niedrigeres Feld und weniger Signal.',
      ru: 'Закрытый туннельный магнит (сверхпроводящая катушка, от 1,5 до 3 Тл, охлаждение гелием): высокое, очень однородное поле, хороший сигнал, но тесно. Открытая конструкция (С-образная или с двумя полюсами, обычно постоянный или резистивный магнит): больше места для пациента и вмешательств, но поле ниже и сигнал слабее.',
    },
    full: {
      de: 'Begründe mit der Physik: Höheres $B_0$ gibt größeren Boltzmann-Überschuss und damit mehr Signal pro Zeit, also bessere Auflösung oder schnellere Messung. Offene Systeme helfen bei Platzangst, Kindern, adipösen Patienten und bei interventioneller MRT. Supraleitung braucht Kühlung, das Feld ist immer an, deshalb Sicherheitsregeln für ferromagnetische Gegenstände.',
      ru: 'Обоснуй физикой: более высокое $B_0$ даёт больший избыток по Больцману и, значит, больше сигнала за единицу времени, то есть лучшее разрешение или более быстрое измерение. Открытые системы помогают при клаустрофобии, у детей, у пациентов с ожирением и при интервенционной МРТ. Сверхпроводимость требует охлаждения, поле включено всегда, поэтому действуют правила безопасности для ферромагнитных предметов.',
    },
  },
  {
    id: 'spulen-als-antennen',
    objective: 'technik',
    module: 'hardware',
    question: {
      de: 'Welche Rolle spielen Körper- und Kopfspulen? Warum nennt man sie Antennen?',
      ru: 'Какую роль играют катушки для тела и для головы? Почему их называют антеннами?',
    },
    short: {
      de: 'HF-Spulen senden den HF-Puls $B_1$ und empfangen das Signal. Die präzedierende Magnetisierung erzeugt ein wechselndes Magnetfeld, das in der Spule eine Spannung induziert, genau wie bei einer Radioantenne bzw. einem Fahrraddynamo. Körperspulen decken ein großes Volumen ab, Kopf- und Oberflächenspulen sitzen nah am Gewebe.',
      ru: 'ВЧ-катушки излучают ВЧ-импульс $B_1$ и принимают сигнал. Прецессирующая намагниченность создаёт переменное магнитное поле, которое наводит в катушке напряжение, как в радиоантенне или велосипедной динамо-машине. Катушка для тела охватывает большой объём, катушки для головы и поверхностные располагаются близко к ткани.',
    },
    full: {
      de: 'Faradaysches Induktionsgesetz: $U = -d\\Phi/dt$, nur die rotierende Quermagnetisierung $M_{xy}$ ändert den Fluss. Nahe Spulen empfangen weniger Rauschen aus dem restlichen Körper, also besseres Signal-Rausch-Verhältnis. Spulen sind auf die Larmor-Frequenz abgestimmt (Resonanzkreis). Häufig sendet die eingebaute Körperspule, und eine lokale Spule empfängt.',
      ru: 'Закон индукции Фарадея: $U = -d\\Phi/dt$, поток меняет только вращающаяся поперечная намагниченность $M_{xy}$. Близкие катушки принимают меньше шума от остального тела, значит, отношение сигнал/шум лучше. Катушки настроены на частоту Лармора (резонансный контур). Часто передаёт встроенная катушка для тела, а принимает локальная.',
    },
  },
  {
    id: 'signalkette',
    objective: 'technik',
    module: 'hardware',
    question: {
      de: 'Beschreibe die Signalkette vom Spin bis zum Bild.',
      ru: 'Опиши цепочку прохождения сигнала от спина до изображения.',
    },
    short: {
      de: 'Präzedierendes $M_{xy}$ induziert Spannung in der Empfangsspule. Vorverstärker, dann Demodulation mit der Larmor-Frequenz in Real- und Imaginärteil, dann Analog-Digital-Wandler. Die Daten füllen den k-Raum, der Rechner macht die inverse FFT, und der Betrag wird als Grauwert angezeigt.',
      ru: 'Прецессирующая $M_{xy}$ наводит напряжение в приёмной катушке. Предусилитель, затем демодуляция на частоте Лармора в действительную и мнимую части, затем аналого-цифровой преобразователь. Данные заполняют k-пространство, компьютер выполняет обратное БПФ, а модуль показывается в оттенках серого.',
    },
    full: {
      de: 'Das Signal ist winzig, deshalb sitzt der Vorverstärker nah an der Spule und der Raum ist HF-abgeschirmt (Faradayscher Käfig), damit keine Radiosender stören. Auf der Sendeseite: Pulsgenerator, HF-Verstärker, Sendespule. Die Sequenzsteuerung koordiniert HF und Gradienten. Neben dem Betragsbild gibt es ein Phasenbild, das zum Beispiel für die Flussmessung genutzt wird.',
      ru: 'Сигнал крошечный, поэтому предусилитель стоит рядом с катушкой, а помещение экранировано от ВЧ (клетка Фарадея), чтобы не мешали радиостанции. На стороне передачи: генератор импульсов, ВЧ-усилитель, передающая катушка. Управление последовательностью согласует ВЧ и градиенты. Помимо изображения модуля есть фазовое изображение, которое используют, например, для измерения потока.',
    },
  },
  {
    id: 'gradientenspulen-funktion',
    objective: 'technik',
    module: 'hardware',
    question: {
      de: 'Wie sind die Gradientenspulen aufgebaut, und was verlangt man technisch von ihnen?',
      ru: 'Как устроены градиентные катушки и какие технические требования к ним предъявляют?',
    },
    short: {
      de: 'Drei Spulensätze für x, y und z sitzen im Magneten. Sie überlagern $B_0$ ein Zusatzfeld, das linear mit dem Ort wächst, typisch einige zehn mT/m. Sie müssen schnell ein- und ausschalten und dabei sehr linear sein.',
      ru: 'Три набора катушек для x, y и z расположены внутри магнита. Они добавляют к $B_0$ поле, линейно растущее с координатой, обычно несколько десятков мТл/м. Они должны быстро включаться и выключаться и при этом быть очень линейными.',
    },
    full: {
      de: 'Kenngrößen: Gradientenstärke (mT/m) bestimmt die Auflösung bzw. Schichtdicke, Anstiegsrate (Slew-Rate, T/m/s) bestimmt die Geschwindigkeit. Schnelles Schalten im starken Feld erzeugt Lorentzkräfte, daher das typische Klopfen. Sehr schnelle Feldänderungen können Nerven stimulieren. Nichtlinearität verzerrt das Bild geometrisch.',
      ru: 'Характеристики: сила градиента (мТл/м) определяет разрешение или толщину среза, скорость нарастания (slew rate, Тл/м/с) определяет быстроту. Быстрое переключение в сильном поле создаёт силы Лоренца, отсюда характерный стук. Очень быстрые изменения поля могут стимулировать нервы. Нелинейность геометрически искажает изображение.',
    },
  },
  {
    id: 'feldstaerke-signal',
    objective: 'technik',
    module: 'hardware',
    question: {
      de: 'Was ändert sich, wenn man von 1,5 T auf 3 T wechselt?',
      ru: 'Что меняется при переходе с 1,5 Тл на 3 Тл?',
    },
    short: {
      de: 'Die Larmor-Frequenz verdoppelt sich von 63,9 auf 127,7 MHz. Der Boltzmann-Überschuss und damit $M_0$ verdoppelt sich ungefähr, man bekommt mehr Signal. Das erlaubt feinere Auflösung oder kürzere Messzeit.',
      ru: 'Частота Лармора удваивается с 63,9 до 127,7 МГц. Избыток по Больцману и, значит, $M_0$ примерно удваиваются, сигнал растёт. Это позволяет получить более тонкое разрешение или сократить время измерения.',
    },
    full: {
      de: 'Ergänze die Kehrseiten: Die HF muss an die höhere Frequenz angepasst werden, die Energieabgabe ins Gewebe (Erwärmung) steigt, Suszeptibilitätsartefakte werden stärker, und die Relaxationszeiten ändern sich (T1 wird meist länger). Formeln: $f_0 = \\bar\\gamma B_0$, $M_0 \\propto B_0/T$.',
      ru: 'Добавь обратную сторону: ВЧ нужно подстроить к более высокой частоте, поглощение энергии тканью (нагрев) растёт, артефакты восприимчивости усиливаются, а времена релаксации меняются (T1 обычно становится длиннее). Формулы: $f_0 = \\bar\\gamma B_0$, $M_0 \\propto B_0/T$.',
    },
  },
  // ---------- Lernziel 4: Anwendungen ----------
  {
    id: 'indikationen-weichteil-knochen',
    objective: 'anwendung',
    module: 'anwendungen',
    question: {
      de: 'Nenne typische Indikationen der MRT und erkläre, warum Knochen kaum sichtbar ist.',
      ru: 'Назови типичные показания к МРТ и объясни, почему кость почти не видна.',
    },
    short: {
      de: 'Weichteile: Gehirn und Rückenmark (zerebrale Diagnostik), Herz (Kardiologie), Gelenke wie das Knie, Becken, Bauchorgane, Schwangerschaft (Fetus, Plazenta). Knochen gibt kaum Signal, weil er wenige bewegliche Protonen hat und deren T2 extrem kurz ist.',
      ru: 'Мягкие ткани: головной и спинной мозг (церебральная диагностика), сердце (кардиология), суставы, например колено, малый таз, органы брюшной полости, беременность (плод, плацента). Кость почти не даёт сигнала, потому что в ней мало подвижных протонов и их T2 крайне короткий.',
    },
    full: {
      de: 'Die MRT liefert anatomische und funktionelle bzw. physiologische Informationen: fMRI, Blutfluss, Spektroskopie, Diffusion. Vorteil: keine ionisierende Strahlung, deshalb auch in der Schwangerschaft und bei Kindern einsetzbar. Beispiel aus dem Skript: Im Kopfbild ist der Schädelknochen dunkel, das Kleinhirn aber kontrastreich. Knochenmark mit Fett ist dagegen sichtbar.',
      ru: 'МРТ даёт анатомическую и функциональную или физиологическую информацию: фМРТ, кровоток, спектроскопия, диффузия. Преимущество: нет ионизирующего излучения, поэтому её можно применять при беременности и у детей. Пример из лекции: на снимке головы кость черепа тёмная, а мозжечок контрастный. Костный мозг с жиром, напротив, виден.',
    },
  },
  {
    id: 'gadolinium',
    objective: 'anwendung',
    module: 'anwendungen',
    question: {
      de: 'Wie wirkt ein Gadolinium-Kontrastmittel, und wofür setzt man es ein?',
      ru: 'Как действует контрастное вещество на основе гадолиния и для чего его применяют?',
    },
    short: {
      de: 'Gadolinium ist paramagnetisch. Es verkürzt die T1-Zeit der Protonen in seiner Nähe, deshalb wird das Gewebe, in das es gelangt, im T1-gewichteten Bild hell. Typisch: Tumoren mit gestörter Blut-Hirn-Schranke, Entzündungen, Gefäße.',
      ru: 'Гадолиний парамагнитен. Он укорачивает T1 протонов поблизости, поэтому ткань, куда он попадает, светлеет на T1-взвешенном изображении. Типично: опухоли с нарушенным гематоэнцефалическим барьером, воспаления, сосуды.',
    },
    full: {
      de: 'Man sieht nicht das Gadolinium selbst, sondern seine Wirkung auf die Relaxation des Wassers. Es verkürzt auch T2. Beispiel aus dem Skript: Glioblastom mit Viertel- und voller Dosis, die Anreicherung ist bei voller Dosis deutlicher. Weil Gadolinium sich im Körper ablagern kann, versucht man die Dosis zu senken, etwa durch KI-Nachbearbeitung des Niedrigdosis-Bildes.',
      ru: 'Виден не сам гадолиний, а его влияние на релаксацию воды. Он укорачивает и T2. Пример из лекции: глиобластома при четверти и полной дозе, накопление при полной дозе заметнее. Поскольку гадолиний может откладываться в организме, дозу стараются снизить, например с помощью обработки изображения низкой дозы искусственным интеллектом.',
    },
  },
  {
    id: 'pet-mri',
    objective: 'anwendung',
    module: 'anwendungen',
    question: {
      de: 'Was ist der Vorteil eines kombinierten PET/MRI gegenüber PET/CT?',
      ru: 'В чём преимущество совмещённого ПЭТ/МРТ по сравнению с ПЭТ/КТ?',
    },
    short: {
      de: 'PET zeigt den Stoffwechsel (zum Beispiel Zuckerverbrauch eines Tumors), aber kaum Anatomie. Die MRT liefert dazu den besten Weichteilkontrast, besonders im Gehirn. Gegenüber CT entfällt die Röntgendosis des CT-Anteils.',
      ru: 'ПЭТ показывает обмен веществ (например, потребление глюкозы опухолью), но почти не показывает анатомию. МРТ добавляет лучший контраст мягких тканей, особенно в мозге. По сравнению с КТ отпадает рентгеновская доза КТ-части.',
    },
    full: {
      de: 'Beispiel aus dem Skript: Glioblastom im Stirnlappen nahe dem Interhemisphärenspalt, PET/MRI zeigt Tumorstoffwechsel und genaue Lage im Hirngewebe. Funktion plus Anatomie in einer Sitzung, gut für Kinder und Verlaufskontrollen. Technisch anspruchsvoll, weil der PET-Detektor im starken Magnetfeld arbeiten muss.',
      ru: 'Пример из лекции: глиобластома в лобной доле рядом с межполушарной щелью, ПЭТ/МРТ показывает метаболизм опухоли и её точное положение в ткани мозга. Функция и анатомия за один сеанс, это удобно для детей и контрольных исследований. Технически сложно, потому что детектор ПЭТ должен работать в сильном магнитном поле.',
    },
  },
  {
    id: 'fluss-phase',
    objective: 'anwendung',
    module: 'anwendungen',
    question: {
      de: 'Wie kann man mit der MRT die Blutgeschwindigkeit messen?',
      ru: 'Как с помощью МРТ измерить скорость кровотока?',
    },
    short: {
      de: 'Über die Phase. Ruhende Spins sammeln bei einem bipolaren Gradienten netto keine Phase. Bewegte Spins ändern während des Gradienten ihren Ort und behalten eine Phasenverschiebung, die proportional zur Geschwindigkeit ist.',
      ru: 'Через фазу. Неподвижные спины при биполярном градиенте в итоге не набирают фазы. Движущиеся спины во время градиента меняют положение и сохраняют фазовый сдвиг, пропорциональный скорости.',
    },
    full: {
      de: 'Phase $\\varphi = \\gamma\\int G(t)\\,x(t)\\,dt$, mit $x(t) = x_0 + vt$ fällt der $x_0$-Anteil beim bipolaren Gradienten weg, übrig bleibt $\\varphi \\propto \\gamma v$. Das ist das Prinzip „vom Phasenshift zur Geschwindigkeit“ im Skript (Phasenkontrast). Man braucht dafür das komplexe Signal, denn das Betragsbild hat keine Phase. Anwendung: Herz, Gefäße, Liquorfluss.',
      ru: 'Фаза $\\varphi = \\gamma\\int G(t)\\,x(t)\\,dt$, при $x(t) = x_0 + vt$ вклад $x_0$ при биполярном градиенте исчезает, остаётся $\\varphi \\propto \\gamma v$. Это принцип «от фазового сдвига к скорости» из лекции (фазовый контраст). Для этого нужен комплексный сигнал, потому что у изображения модуля нет фазы. Применение: сердце, сосуды, ток ликвора.',
    },
  },
  {
    id: 'dti',
    objective: 'anwendung',
    module: 'anwendungen',
    question: {
      de: 'Was misst die Diffusions-Tensor-Bildgebung (DTI), und was ist Traktographie?',
      ru: 'Что измеряет диффузионно-тензорная томография (DTI) и что такое трактография?',
    },
    short: {
      de: 'DTI misst, wie stark und in welche Richtung Wassermoleküle diffundieren. In Nervenfasern bewegt sich Wasser bevorzugt entlang der Faser. Aus der Vorzugsrichtung in jedem Voxel rekonstruiert die Traktographie den Verlauf der Nervenbahnen.',
      ru: 'DTI измеряет, насколько сильно и в каком направлении диффундируют молекулы воды. В нервных волокнах вода движется преимущественно вдоль волокна. По преимущественному направлению в каждом вокселе трактография восстанавливает ход нервных путей.',
    },
    full: {
      de: 'Diffusionsgradienten in mindestens sechs Richtungen schwächen das Signal je nach Bewegung in dieser Richtung ab. Daraus ergibt sich pro Voxel ein Tensor (3×3-Matrix), dessen Hauptachse die Faserrichtung ist, die Anisotropie zeigt, wie gerichtet die Diffusion ist. Im Skript: Traktographie im Gehirn und von Herzmuskelfasern. Klinisch für OP-Planung und Erkrankungen der weißen Substanz.',
      ru: 'Диффузионные градиенты как минимум в шести направлениях ослабляют сигнал в зависимости от движения вдоль этого направления. Отсюда для каждого вокселя получается тензор (матрица 3×3), главная ось которого указывает направление волокон, а анизотропия показывает, насколько направлена диффузия. В лекции: трактография в мозге и волокон сердечной мышцы. Клинически для планирования операций и при заболеваниях белого вещества.',
    },
  },
  {
    id: 'spektroskopie',
    objective: 'anwendung',
    module: 'anwendungen',
    question: {
      de: 'Was ist MR-Spektroskopie, und welchen Nutzen hat sie?',
      ru: 'Что такое МР-спектроскопия и какую пользу она даёт?',
    },
    short: {
      de: 'Protonen in verschiedenen Molekülen sind von unterschiedlich vielen Elektronen abgeschirmt und haben deshalb leicht verschiedene Resonanzfrequenzen (chemische Verschiebung, Bereich ppm). Die Fourier-Transformation des Signals ergibt ein Spektrum, dessen Peaks die Stoffwechselprodukte zeigen.',
      ru: 'Протоны в разных молекулах по-разному экранированы электронами, поэтому их резонансные частоты слегка различаются (химический сдвиг, порядка ppm). Преобразование Фурье сигнала даёт спектр, пики которого показывают метаболиты.',
    },
    full: {
      de: 'Peakposition zeigt, welcher Stoff, Peakfläche, wie viel davon, Linienbreite hängt mit T2 zusammen. Beispiel: Bei 3 T entspricht 1 ppm etwa 128 Hz. Anwendung zum Beispiel in der Tumordiagnostik im Gehirn. Man braucht ein sehr homogenes Feld, sonst verschmieren die Linien. Bild: ein Klavierakkord, das Spektrum zeigt, welche Tasten gedrückt sind.',
      ru: 'Положение пика показывает, какое это вещество, площадь пика, сколько его, ширина линии связана с T2. Пример: при 3 Тл 1 ppm соответствует примерно 128 Гц. Применение, например, в диагностике опухолей мозга. Нужно очень однородное поле, иначе линии размываются. Образ: аккорд на пианино, спектр показывает, какие клавиши нажаты.',
    },
  },
];

export const CHEAT_SHEET: CheatSheetSection[] = [
  {
    title: { de: 'Spin & Larmor', ru: 'Спин и Лармор' },
    items: [
      { label: { de: 'Magnetisches Moment', ru: 'Магнитный момент' }, tex: '\\vec\\mu = \\gamma\\vec L' },
      { label: { de: 'Spin ½', ru: 'Спин ½' }, tex: 'L_z = m\\hbar,\\ m = \\pm\\tfrac12,\\ \\hbar = 1{,}0546\\cdot10^{-34}\\,\\text{Js}' },
      { label: { de: 'Energieniveaus', ru: 'Энергетические уровни' }, tex: 'E_m = -\\gamma\\hbar m B_0,\\quad \\Delta E = \\gamma\\hbar B_0' },
      { label: { de: 'Boltzmann', ru: 'Больцман' }, tex: '\\frac{N_\\uparrow}{N_\\downarrow} = e^{\\Delta E/k_BT},\\quad M_0 \\propto \\frac{B_0}{T}' },
      { label: { de: 'Larmor (¹H)', ru: 'Лармор (¹H)' }, tex: '\\omega_0 = \\gamma B_0,\\quad f_0 = \\bar\\gamma B_0,\\quad \\bar\\gamma = 42{,}57\\,\\text{MHz/T}' },
      { label: { de: 'Merksatz', ru: 'Запомни' }, text: { de: '1,5 T → 63,9 MHz, 3 T → 127,7 MHz. 42,57 gehört zu f, nicht zu ω.', ru: '1,5 Тл → 63,9 МГц, 3 Тл → 127,7 МГц. 42,57 относится к f, а не к ω.' } },
    ],
  },
  {
    title: { de: 'Bloch & Relaxation', ru: 'Блох и релаксация' },
    items: [
      { label: { de: 'Magnetisierung', ru: 'Намагниченность' }, tex: '\\vec M = \\sum_i\\vec\\mu_i' },
      { label: { de: 'Bloch-Gleichung', ru: 'Уравнение Блоха' }, tex: '\\begin{aligned} \\dot M_{x,y} &= \\gamma(\\vec M\\times\\vec B)_{x,y} - \\tfrac{M_{x,y}}{T_2} \\\\ \\dot M_z &= \\gamma(\\vec M\\times\\vec B)_z - \\tfrac{M_z - M_0}{T_1} \\end{aligned}' },
      { label: { de: 'T1 (längs)', ru: 'T1 (продольная)' }, tex: 'M_z(t) = M_0\\,(1 - e^{-t/T_1})' },
      { label: { de: 'T2 (quer)', ru: 'T2 (поперечная)' }, tex: 'M_{xy}(t) = M_{xy}(0)\\,e^{-t/T_2}' },
      { label: { de: 'T2*', ru: 'T2*' }, tex: '\\frac{1}{T_2^*} = \\frac{1}{T_2} + \\frac{1}{T_2\'},\\quad T_2^* \\le T_2 \\le T_1' },
      { label: { de: 'Pulse', ru: 'Импульсы' }, text: { de: '90° kippt M in die xy-Ebene, 180° spiegelt (Spin-Echo). Nach dem Puls: FID, zerfällt mit T2*.', ru: '90° отклоняет M в плоскость xy, 180° отражает (спиновое эхо). После импульса: ССИ, затухает с T2*.' } },
    ],
  },
  {
    title: { de: 'Gewichtung & Spektrum', ru: 'Взвешенность и спектр' },
    items: [
      { label: { de: 'Signalmodell', ru: 'Модель сигнала' }, tex: 'S \\propto \\rho\\,(1 - e^{-TR/T_1})\\,e^{-TE/T_2}' },
      { label: { de: 'PDw', ru: 'PDw' }, text: { de: 'TR lang, TE kurz (z. B. 5500/14 ms)', ru: 'TR длинное, TE короткое (например, 5500/14 мс)' } },
      { label: { de: 'T1w', ru: 'T1w' }, text: { de: 'TR kurz, TE kurz (z. B. 500/10 ms), Liquor dunkel', ru: 'TR короткое, TE короткое (например, 500/10 мс), ликвор тёмный' } },
      { label: { de: 'T2w', ru: 'T2w' }, text: { de: 'TR lang, TE lang (z. B. 5500/101 ms), Liquor hell', ru: 'TR длинное, TE длинное (например, 5500/101 мс), ликвор светлый' } },
      { label: { de: 'Linienbreite', ru: 'Ширина линии' }, tex: '\\text{FWHM} = \\frac{1}{\\pi T_2}\\ \\text{(Hz)}' },
    ],
  },
  {
    title: { de: 'Ortskodierung & k-Raum', ru: 'Пространственное кодирование и k-пространство' },
    items: [
      { label: { de: 'Frequenzkodierung', ru: 'Частотное кодирование' }, tex: '\\omega(x) = \\gamma G_x x,\\quad \\frac{d\\omega}{dz} = \\gamma G_z' },
      { label: { de: 'Signal als Summe', ru: 'Сигнал как сумма' }, tex: 's(t) = \\hat s\\sum_i e^{i\\omega_i t} \\to \\int\\rho(x)\\,e^{i\\omega(x)t}\\,dx' },
      { label: { de: 'k-Wert', ru: 'Значение k' }, tex: 'k_x(t) = \\gamma\\int_0^t G_x(t\')\\,dt\'' },
      { label: { de: 'k-Raum 2D', ru: 'k-пространство 2D' }, tex: 's(k_x,k_y) = \\iint\\rho(x,y)\\,e^{i(k_x x + k_y y)}\\,dx\\,dy' },
      { label: { de: 'Bild', ru: 'Изображение' }, tex: '\\rho(x,y) = \\mathcal F^{-1}[s(k_x,k_y)]' },
      { label: { de: 'Merksatz', ru: 'Запомни' }, text: { de: 'SS beim Puls, PE dazwischen, RO beim Auslesen. Mitte = Kontrast, Rand = Kanten.', ru: 'SS во время импульса, PE между ними, RO при считывании. Центр = контраст, край = контуры.' } },
    ],
  },
  {
    title: { de: 'Fourier', ru: 'Фурье' },
    items: [
      { label: { de: 'Fourier-Reihe', ru: 'Ряд Фурье' }, tex: 'f(t) = \\tfrac{a_0}{2} + \\sum_{n\\ge1}\\big(a_n\\cos n\\omega t + b_n\\sin n\\omega t\\big)' },
      { label: { de: 'Koeffizienten', ru: 'Коэффициенты' }, tex: '\\begin{aligned} a_n &= \\tfrac{2}{T}\\int_0^T f(t)\\cos(n\\omega t)\\,dt \\\\ b_n &= \\tfrac{2}{T}\\int_0^T f(t)\\sin(n\\omega t)\\,dt \\end{aligned}' },
      { label: { de: 'Orthogonalität', ru: 'Ортогональность' }, tex: '\\int_0^{2\\pi}\\sin t\\,\\sin 2t\\,dt = 0,\\quad \\int_0^{2\\pi}\\sin^2 t\\,dt = \\pi' },
      { label: { de: '2D-FT', ru: '2D-ПФ' }, tex: 'F(u_x,u_y) = \\iint f(x,y)\\,e^{-2\\pi i(u_x x + u_y y)}\\,dx\\,dy' },
      { label: { de: 'Eigenschaften', ru: 'Свойства' }, tex: '\\mathcal F[af + bg] = a\\mathcal F[f] + b\\mathcal F[g],\\quad \\mathcal F[f*g] = \\mathcal F[f]\\,\\mathcal F[g]' },
    ],
  },
  {
    title: { de: 'Gerät & Signal', ru: 'Томограф и сигнал' },
    items: [
      { label: { de: 'Komponenten', ru: 'Компоненты' }, text: { de: 'Magnet (B₀), Gradientenspulen x/y/z (Ort), HF-Sender + Spule (B₁), Empfangsspulen (Antenne), Verstärker/ADC/Rechner (FFT), Abschirmung.', ru: 'Магнит (B₀), градиентные катушки x/y/z (место), ВЧ-передатчик + катушка (B₁), приёмные катушки (антенна), усилитель/АЦП/компьютер (БПФ), экранирование.' } },
      { label: { de: 'EM-Welle', ru: 'ЭМ-волна' }, tex: '\\vec E(\\vec r,t) = \\hat E\\cos(\\vec k\\cdot\\vec r - \\omega t + \\varphi)' },
      { label: { de: 'Komplexes Signal', ru: 'Комплексный сигнал' }, tex: 's(t) = \\hat E\\,e^{i\\omega t} = \\hat E(\\cos\\omega t + i\\sin\\omega t)' },
      { label: { de: 'Magnete', ru: 'Магниты' }, text: { de: 'Tunnel: supraleitend, 1,5 bis 3 T, homogen. Offen: niedriges Feld, mehr Platz.', ru: 'Туннель: сверхпроводящий, от 1,5 до 3 Тл, однородный. Открытый: низкое поле, больше места.' } },
    ],
  },
  {
    title: { de: 'Anwendungen', ru: 'Применения' },
    items: [
      { label: { de: 'Indikationen', ru: 'Показания' }, text: { de: 'Weichteile, Gehirn, Herz, Gelenke, Becken, Schwangerschaft. Knochen dunkel.', ru: 'Мягкие ткани, мозг, сердце, суставы, малый таз, беременность. Кость тёмная.' } },
      { label: { de: 'Gadolinium', ru: 'Гадолиний' }, text: { de: 'Paramagnetisch, verkürzt T1, im T1w hell.', ru: 'Парамагнетик, укорачивает T1, на T1w светлый.' } },
      { label: { de: 'Fluss', ru: 'Поток' }, tex: '\\varphi \\propto \\gamma\\,v' },
      { label: { de: 'DTI, MRS, PET/MRI', ru: 'DTI, МРС, ПЭТ/МРТ' }, text: { de: 'DTI: Diffusionsrichtung, Faserbahnen. MRS: chemische Verschiebung, Metabolite. PET/MRI: Stoffwechsel plus Weichteilanatomie.', ru: 'DTI: направление диффузии, нервные пути. МРС: химический сдвиг, метаболиты. ПЭТ/МРТ: метаболизм плюс анатомия мягких тканей.' } },
    ],
  },
];

export const LAB3_STEPS: LabStep[] = [
  {
    title: {
      de: 'DFT im Tabellenblatt verstehen',
      ru: 'Разобраться с ДПФ в таблице',
    },
    text: {
      de: '**Was du tust:** Öffne das DFT-Tabellenblatt und gib verschiedene Signale ein: einen reinen Sinus, zwei überlagerte Sinusschwingungen, einen Sägezahn, ein Rechteck. **Was du sehen solltest:** Ein reiner Sinus gibt genau einen Peak bei seiner Frequenz. Zwei Schwingungen geben zwei Peaks. Sägezahn und Rechteck haben viele Oberwellen, beim Sägezahn mit Amplituden $1/n$. **Was die Theorie sagt:** Das Blatt rechnet die Integrale $a_n = \\frac{2}{T}\\int f\\cos(n\\omega t)dt$ und $b_n = \\frac{2}{T}\\int f\\sin(n\\omega t)dt$ als Summen über die Abtastwerte. Jede Testfrequenz „schwingt nur mit“, wenn sie im Signal steckt, das ist die Orthogonalität.',
      ru: '**Что делать:** открой таблицу ДПФ и введи разные сигналы: чистый синус, наложение двух синусоид, пилу, меандр. **Что ты увидишь:** чистый синус даёт ровно один пик на своей частоте. Два колебания дают два пика. У пилы и меандра много гармоник, у пилы с амплитудами $1/n$. **Что говорит теория:** таблица вычисляет интегралы $a_n = \\frac{2}{T}\\int f\\cos(n\\omega t)dt$ и $b_n = \\frac{2}{T}\\int f\\sin(n\\omega t)dt$ в виде сумм по отсчётам. Каждая пробная частота «откликается», только если она есть в сигнале, это и есть ортогональность.',
    },
    sim: 'fourier',
  },
  {
    title: {
      de: 'Signal verändern und das Spektrum beobachten',
      ru: 'Изменять сигнал и наблюдать за спектром',
    },
    text: {
      de: '**Was du tust:** Öffne das Berkeley-Madonna-Flussdiagramm (BM signal FFT) und verändere die Parameter a, b, c, d nacheinander, immer nur einen. Schau dir jeweils Signal und Spektrum an. Was genau a bis d steuern, steht in deinen Lab-Unterlagen. Finde für jeden Parameter heraus, zu welchem Typ er gehört. **Was du sehen solltest:** Ein Amplitudenparameter macht den Peak höher. Ein Frequenzparameter verschiebt den Peak. Ein Dämpfungsparameter lässt das Signal schneller abklingen, der Peak wird breiter und flacher. Ein Phasen- oder Verschiebungsparameter ändert den Betrag des Spektrums nicht. **Was die Theorie sagt:** Linearität der FT (Summe von Signalen gibt Summe der Spektren) und Zeit gegen Frequenz: kurzes Signal, breite Linie, $\\text{FWHM} = 1/(\\pi T_2)$.',
      ru: '**Что делать:** открой блок-схему Berkeley Madonna (BM signal FFT) и по очереди меняй параметры a, b, c, d, каждый раз только один. Каждый раз смотри на сигнал и спектр. Что именно задают a, b, c и d, указано в материалах лабораторной. Определи для каждого параметра его тип. **Что ты увидишь:** параметр амплитуды делает пик выше. Параметр частоты сдвигает пик. Параметр затухания заставляет сигнал быстрее спадать, пик становится шире и ниже. Параметр фазы или сдвига не меняет модуль спектра. **Что говорит теория:** линейность ПФ (сумма сигналов даёт сумму спектров) и «время против частоты»: короткий сигнал, широкая линия, $\\text{FWHM} = 1/(\\pi T_2)$.',
    },
    sim: 'fourier',
  },
  {
    title: {
      de: 'Bloch-Modelle laufen lassen und mit der Theorie vergleichen',
      ru: 'Запустить модели Блоха и сравнить с теорией',
    },
    text: {
      de: '**Was du tust:** Starte die beiden MR-Modelle (Python und Berkeley Madonna). Sie lösen die Bloch-Gleichung für eine Sequenz. Verändere $B_0$, T1, T2 und den Puls, und betrachte Signal und Spektrum. **Was du sehen solltest:** Doppeltes $B_0$ verdoppelt die Präzessionsfrequenz, der Peak im Spektrum wandert entsprechend. Kürzeres T2 lässt das Signal schneller abklingen und verbreitert die Linie. T1 bestimmt, wie schnell $M_z$ zurückkommt. **Was die Theorie sagt:** $\\omega_0 = \\gamma B_0$ bzw. $f_0 = \\bar\\gamma B_0$, $M_{xy} \\propto e^{-t/T_2}$, $M_z = M_0(1 - e^{-t/T_1})$. Prüfe: Stimmen Peakposition und Linienbreite mit diesen Formeln überein? Beachte, dass die Modelle oft mit normierter Zeit und normiertem γ rechnen.',
      ru: '**Что делать:** запусти обе МР-модели (Python и Berkeley Madonna). Они решают уравнение Блоха для последовательности. Меняй $B_0$, T1, T2 и импульс и смотри на сигнал и спектр. **Что ты увидишь:** удвоение $B_0$ удваивает частоту прецессии, пик в спектре смещается соответственно. Более короткий T2 ускоряет затухание сигнала и уширяет линию. T1 определяет, как быстро возвращается $M_z$. **Что говорит теория:** $\\omega_0 = \\gamma B_0$ или $f_0 = \\bar\\gamma B_0$, $M_{xy} \\propto e^{-t/T_2}$, $M_z = M_0(1 - e^{-t/T_1})$. Проверь: совпадают ли положение пика и ширина линии с этими формулами? Учти, что модели часто считают в нормированном времени и с нормированным γ.',
    },
    sim: 'signal/spectrum',
  },
];
