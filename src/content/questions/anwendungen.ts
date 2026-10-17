import { n, pick, tl, type QuestionSource } from './types';

/** γ̄ = γ/2π für Protonen in MHz/T. */
const GAMMA_BAR = 42.58;

const ppmPairs = [
  { de: 'Wasser und Fett', ru: 'вода и жир', delta: 3.5 },
  { de: 'NAA (2,0 ppm) und Cholin (3,2 ppm)', ru: 'NAA (2,0 ppm) и холин (3,2 ppm)', delta: 1.2 },
  { de: 'NAA (2,0 ppm) und Kreatin (3,0 ppm)', ru: 'NAA (2,0 ppm) и креатин (3,0 ppm)', delta: 1.0 },
  { de: 'Kreatin (3,0 ppm) und Cholin (3,2 ppm)', ru: 'креатин (3,0 ppm) и холин (3,2 ppm)', delta: 0.2 },
] as const;

/** Fragen zum Kapitel „Klinische Anwendungen“; die Vorlesungsfragen werden in index.ts ergänzt. */
export const anwendungenQuestions: QuestionSource[] = [
  {
    id: 'an-ppm-hz',
    generate: (rng, lang) => {
      const pair = pick(rng, ppmPairs);
      const field = pick(rng, [1.5, 3, 7] as const);
      const f0 = GAMMA_BAR * field;
      const df = pair.delta * f0;
      const t = tl(lang);
      const name = lang === 'ru' ? pair.ru : pair.de;
      return {
        kind: 'numeric',
        id: 'an-ppm-hz',
        difficulty: 2,
        prompt: t(
          `Im MR-Spektrum liegen die Spitzen von ${name} ${n(pair.delta, 1, lang)} ppm auseinander. Wie groß ist der Frequenzabstand in Hz bei $B_0 = ${n(field, 1, lang)}$ T? (Protonen: $\\bar\\gamma = 42{,}58$ MHz/T)`,
          `В МР-спектре пики, которые дают ${name}, разнесены на ${n(pair.delta, 1, lang)} ppm. Каково расстояние по частоте в Гц при $B_0 = ${n(field, 1, lang)}$ Тл? (протоны: $\\bar\\gamma = 42{,}58$ МГц/Тл)`,
        ),
        answer: df,
        tolerance: 0.03,
        unit: t('Hz', 'Гц'),
        hint: t(
          'ppm heißt „Millionstel“. Rechne zuerst die Larmor-Frequenz $f_0 = \\bar\\gamma B_0$ in MHz aus. Ein Millionstel von einigen MHz sind einige Hz.',
          'ppm означает «миллионные доли». Сначала вычисли ларморову частоту $f_0 = \\bar\\gamma B_0$ в МГц. Миллионная доля от нескольких МГц это несколько Гц.',
        ),
        explanation: t(
          `**Der Abstand beträgt rund ${n(df, 0, lang)} Hz.** Die Elektronen um ein Molekül schirmen das Feld minimal ab. Je nach chemischer Umgebung präzedieren die Protonen deshalb ein klein wenig langsamer oder schneller. Diese Verschiebung gibt man in ppm an, also als Anteil der Larmor-Frequenz. Der Vorteil: Der ppm-Wert ist bei jedem Feld gleich, nur die Hertz-Zahl wächst mit B₀. Rechnung: $f_0 = 42{,}58 \\cdot ${n(field, 1, lang)} = ${n(f0, 2, lang)}$ MHz, dann $\\Delta f = ${n(pair.delta, 1, lang)} \\cdot ${n(f0, 2, lang)} = ${n(df, 0, lang)}$ Hz. Der Trick: ppm mal MHz ergibt direkt Hz, weil sich die Millionen wegkürzen. Check: Wasser und Fett liegen bei 1,5 T rund 220 Hz auseinander. Bei doppeltem Feld verdoppelt sich jeder Abstand. Darum trennt ein starkes Feld die Spitzen im Spektrum besser.`,
          `**Расстояние составляет примерно ${n(df, 0, lang)} Гц.** Электроны вокруг молекулы чуть-чуть экранируют поле. Поэтому в зависимости от химического окружения протоны прецессируют немного медленнее или быстрее. Этот сдвиг указывают в ppm, то есть как долю ларморовой частоты. Преимущество: значение в ppm одинаково при любом поле, растёт с B₀ только число герц. Расчёт: $f_0 = 42{,}58 \\cdot ${n(field, 1, lang)} = ${n(f0, 2, lang)}$ МГц, затем $\\Delta f = ${n(pair.delta, 1, lang)} \\cdot ${n(f0, 2, lang)} = ${n(df, 0, lang)}$ Гц. Хитрость: ppm умножить на МГц сразу даёт Гц, потому что миллионы сокращаются. Проверка: вода и жир при 1,5 Тл разнесены примерно на 220 Гц. При удвоенном поле каждое расстояние удваивается. Поэтому сильное поле лучше разделяет пики в спектре.`,
        ),
      };
    },
  },
  {
    id: 'an-venc-phase',
    generate: (rng, lang) => {
      const venc = pick(rng, [50, 100, 150, 200]);
      const frac = pick(rng, [0.25, 0.4, 0.5, 0.6, 0.75, 0.9]);
      const v = frac * venc;
      const phase = 180 * frac;
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'an-venc-phase',
        difficulty: 2,
        prompt: t(
          `Eine Phasenkontrast-Flussmessung ist auf VENC = ${venc} cm/s eingestellt. Blut fließt mit ${n(v, 1, lang)} cm/s durch die Schicht. Welche Phasenverschiebung in Grad misst der Scanner?`,
          `Фазоконтрастное измерение кровотока настроено на VENC = ${venc} см/с. Кровь течёт через срез со скоростью ${n(v, 1, lang)} см/с. Какой фазовый сдвиг в градусах измерит томограф?`,
        ),
        answer: phase,
        tolerance: 0.02,
        unit: '°',
        hint: t(
          'VENC ist die Geschwindigkeit, die genau 180° Phase ergibt. Die Phase wächst linear mit der Geschwindigkeit: $\\Delta\\varphi = 180° \\cdot v/\\text{VENC}$.',
          'VENC это скорость, которая даёт ровно 180° фазы. Фаза растёт линейно со скоростью: $\\Delta\\varphi = 180° \\cdot v/\\text{VENC}$.',
        ),
        explanation: t(
          `**Der Scanner misst ${n(phase, 1, lang)}°.** Ein bipolarer Gradient verschiebt die Phase ruhender Spins erst in die eine, dann in die andere Richtung, und am Ende steht wieder null. Ein Spin, der sich bewegt, sitzt beim zweiten Teil aber an einem anderen Ort. Er behält eine Restphase, und die ist proportional zu seiner Geschwindigkeit. Wie ein Läufer im Stadion, der eine Runde vorwärts und eine rückwärts läuft: Steht er still, landet er am Start. Läuft er auf einem fahrenden Band, landet er versetzt. Rechnung: $\\Delta\\varphi = 180° \\cdot ${n(v, 1, lang)}/${venc} = ${n(phase, 1, lang)}°$. Check: v ist kleiner als VENC, also muss die Phase unter 180° liegen. Wäre das Blut schneller als VENC, würde sich die Phase überschlagen (Aliasing), und schneller Fluss sähe aus wie Fluss in Gegenrichtung.`,
          `**Томограф измерит ${n(phase, 1, lang)}°.** Биполярный градиент сдвигает фазу неподвижных спинов сначала в одну, потом в другую сторону, и в итоге снова получается ноль. Но движущийся спин во время второй части находится уже в другом месте. У него остаётся фаза, пропорциональная его скорости. Как бегун на стадионе, который пробегает круг вперёд и круг назад: если он стоит на месте, то окажется на старте. Если бежит по движущейся ленте, окажется смещённым. Расчёт: $\\Delta\\varphi = 180° \\cdot ${n(v, 1, lang)}/${venc} = ${n(phase, 1, lang)}°$. Проверка: v меньше VENC, значит, фаза должна быть меньше 180°. Если бы кровь была быстрее VENC, фаза «перескочила» бы (алиасинг), и быстрый поток выглядел бы как поток в обратную сторону.`,
        ),
      };
    },
  },
  {
    id: 'an-weighting-knee',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Das Skript zeigt drei Kopfbilder mit TR/TE = 500/10 ms, 5500/14 ms und 5500/101 ms sowie ein PD-gewichtetes Knie. Welche Parameterkombination gehört zur PD-Wichtung?',
      ru: 'В конспекте показаны три снимка головы с TR/TE = 500/10 мс, 5500/14 мс и 5500/101 мс, а также PD-взвешенное колено. Какое сочетание параметров соответствует PD-взвешиванию?',
    },
    options: [
      { de: 'TR/TE = 5500/14 ms', ru: 'TR/TE = 5500/14 мс' },
      { de: 'TR/TE = 500/10 ms', ru: 'TR/TE = 500/10 мс' },
      { de: 'TR/TE = 5500/101 ms', ru: 'TR/TE = 5500/101 мс' },
      { de: 'TR/TE = 500/101 ms', ru: 'TR/TE = 500/101 мс' },
    ],
    answer: 0,
    hint: {
      de: 'Bei der PD-Wichtung sollen T1 und T2 möglichst wenig mitreden. Welches TR blendet T1 aus, welches TE blendet T2 aus?',
      ru: 'При PD-взвешивании T1 и T2 должны влиять как можно меньше. Какое TR убирает влияние T1, а какое TE убирает влияние T2?',
    },
    explanation: {
      de: '**PD-Wichtung heißt langes TR und kurzes TE, also 5500/14 ms.** Mit langem TR haben sich alle Gewebe vollständig erholt, T1 spielt keine Rolle mehr. Mit kurzem TE hatte noch kein Gewebe Zeit, Signal durch T2 zu verlieren. Übrig bleibt, wie viele Protonen im Voxel stecken: die Protonendichte. Das liefert viel Signal und feine Anatomie, deshalb ist PD beim Knie beliebt, um Menisken, Bänder und Knorpel zu beurteilen. 500/10 ms ist die T1-Wichtung, 5500/101 ms die T2-Wichtung mit hellem Liquor. 500/101 ms ergibt wenig Signal und einen unklaren Mischkontrast.',
      ru: '**PD-взвешивание означает длинное TR и короткое TE, то есть 5500/14 мс.** При длинном TR все ткани полностью восстановились, T1 больше не играет роли. При коротком TE ни одна ткань ещё не успела потерять сигнал из-за T2. Остаётся то, сколько протонов в вокселе: протонная плотность. Это даёт много сигнала и тонкую анатомию, поэтому PD популярно для колена, чтобы оценивать мениски, связки и хрящ. 500/10 мс это T1-взвешивание, 5500/101 мс это T2-взвешивание со светлым ликвором. 500/101 мс даёт мало сигнала и неясный смешанный контраст.',
    },
  },
  {
    id: 'an-pet-mri',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Im Skript wird ein Glioblastom mit PET/CT und PET/MRT dargestellt. Was ist der Kern der Kombination PET/MRT?',
      ru: 'В конспекте глиобластома показана с помощью ПЭТ/КТ и ПЭТ/МРТ. В чём суть комбинации ПЭТ/МРТ?',
    },
    options: [
      {
        de: 'Das MRT liefert die Weichteilanatomie, die PET die Stoffwechselaktivität. Gegenüber PET/CT entfällt zudem die Röntgendosis des CT.',
        ru: 'МРТ даёт анатомию мягких тканей, ПЭТ активность обмена веществ. По сравнению с ПЭТ/КТ к тому же отпадает рентгеновская доза КТ.',
      },
      {
        de: 'Die PET verstärkt das MR-Signal, sodass man ohne Gradienten auskommt.',
        ru: 'ПЭТ усиливает МР-сигнал, так что можно обойтись без градиентов.',
      },
      {
        de: 'Das MRT ersetzt den radioaktiven Tracer, die PET bleibt strahlenfrei.',
        ru: 'МРТ заменяет радиоактивный трейсер, и ПЭТ остаётся без облучения.',
      },
      {
        de: 'Beide Verfahren messen dasselbe, die Kombination dient nur der Kontrolle.',
        ru: 'Оба метода измеряют одно и то же, комбинация служит лишь для проверки.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Die beiden Verfahren beantworten unterschiedliche Fragen: „Wo und wie sieht es aus?“ und „Wie aktiv ist es?“.',
      ru: 'Два метода отвечают на разные вопросы: «где это и как выглядит?» и «насколько это активно?».',
    },
    explanation: {
      de: '**PET/MRT kombiniert Stoffwechsel mit bestem Weichteilkontrast.** Bei der PET bekommt der Patient einen schwach radioaktiven Tracer, der sich dort anreichert, wo viel Stoffwechsel stattfindet, zum Beispiel im aktiven Tumorgewebe. Die PET zeigt also, wie aktiv etwas ist, aber nur unscharf, wo genau. Das MRT liefert dazu die scharfe Landkarte der Weichteile. Beim Hirntumor ist das ideal, weil das MRT dort viel mehr Kontrast hat als das CT. Bonus: Das CT trägt bei PET/CT eine eigene Röntgendosis bei, die beim MRT wegfällt. Die Dosis des PET-Tracers selbst bleibt aber bestehen.',
      ru: '**ПЭТ/МРТ сочетает обмен веществ с лучшим контрастом мягких тканей.** При ПЭТ пациенту вводят слабо радиоактивный трейсер, который накапливается там, где интенсивный обмен веществ, например в активной ткани опухоли. Значит, ПЭТ показывает, насколько что-то активно, но лишь размыто, где именно. МРТ добавляет к этому чёткую карту мягких тканей. При опухоли мозга это идеально, потому что у МРТ там гораздо больше контраста, чем у КТ. Бонус: при ПЭТ/КТ сама КТ даёт собственную рентгеновскую дозу, которой при МРТ нет. Доза самого ПЭТ-трейсера при этом остаётся.',
    },
  },
  {
    id: 'an-gadolinium',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Aussagen über gadoliniumhaltiges Kontrastmittel stimmen? (Mehrfachauswahl)',
      ru: 'Какие утверждения о гадолиниевом контрастном веществе верны? (несколько вариантов)',
    },
    options: [
      {
        de: 'Es verkürzt das T1 der Wasserprotonen in seiner Nähe.',
        ru: 'Оно укорачивает T1 протонов воды поблизости.',
      },
      {
        de: 'Gewebe, in dem es sich anreichert, erscheint im T1-gewichteten Bild hell.',
        ru: 'Ткань, в которой оно накапливается, на T1-взвешенном изображении выглядит светлой.',
      },
      {
        de: 'Man versucht die Dosis klein zu halten, weil sich Gadolinium im Körper ablagern kann. Das Skript zeigt dazu eine Viertel-Dosis mit KI-Nachbearbeitung.',
        ru: 'Дозу стараются держать маленькой, потому что гадолиний может откладываться в организме. В конспекте показана четверть дозы с обработкой ИИ.',
      },
      {
        de: 'Man sieht im Bild die Gadolinium-Atome selbst, weil sie stark leuchten.',
        ru: 'На изображении видны сами атомы гадолиния, потому что они сильно светятся.',
      },
      {
        de: 'Es verlängert T1, deshalb werden Tumoren im T1-Bild dunkler.',
        ru: 'Оно удлиняет T1, поэтому опухоли на T1-изображении становятся темнее.',
      },
    ],
    answers: [0, 1, 2],
    hint: {
      de: 'Gadolinium ist ein starker kleiner Magnet. Hilft er den Wasserprotonen beim Energieabgeben oder bremst er sie?',
      ru: 'Гадолиний это сильный маленький магнит. Он помогает протонам воды отдавать энергию или тормозит их?',
    },
    explanation: {
      de: '**Gadolinium verkürzt T1, macht Anreicherungen im T1-Bild hell, und die Dosis soll klein bleiben.** Gadolinium hat viele ungepaarte Elektronen und ist dadurch ein starker Magnet. Wassermoleküle, die vorbeikommen, geben ihre Energie mit seiner Hilfe viel schneller ab. Kürzeres T1 heißt: schnellere Erholung, also mehr Signal bei kurzem TR. Man sieht nicht das Gadolinium, sondern das Wasser in seiner Nähe. Formel: $1/T_{1,\\text{mit}} = 1/T_{1,\\text{ohne}} + r_1 c$, mit der Relaxivität $r_1$ und der Konzentration c. Mehr Kontrastmittel heißt also kürzeres T1. Weil sich kleine Mengen im Gewebe ablagern können, sucht man Wege, die Dosis zu senken. Im Skript sieht man eine Viertel-Dosis (4 ml statt insgesamt 16 ml), die per KI so aufbereitet wird, dass sie wie die volle Dosis aussieht.',
      ru: '**Гадолиний укорачивает T1, делает зоны накопления светлыми на T1-изображении, и дозу надо держать маленькой.** У гадолиния много неспаренных электронов, поэтому он сильный магнит. Молекулы воды, оказавшиеся рядом, с его помощью гораздо быстрее отдают энергию. Более короткое T1 означает более быстрое восстановление, то есть больше сигнала при коротком TR. Виден не гадолиний, а вода рядом с ним. Формула: $1/T_{1,\\text{с}} = 1/T_{1,\\text{без}} + r_1 c$, где $r_1$ релаксивность, а c концентрация. Значит, больше контраста даёт более короткое T1. Поскольку небольшие количества могут откладываться в тканях, ищут способы снизить дозу. В конспекте показана четверть дозы (4 мл вместо суммарных 16 мл), которую ИИ обрабатывает так, что она выглядит как полная доза.',
    },
  },
  {
    id: 'an-pelvis-pregnancy',
    kind: 'multi',
    difficulty: 1,
    prompt: {
      de: 'Das Skript zeigt MRT-Bilder des Beckens und aus der Schwangerschaft. Welche Aussagen passen dazu? (Mehrfachauswahl)',
      ru: 'В конспекте показаны МРТ-снимки малого таза и снимки при беременности. Какие утверждения к ним подходят? (несколько вариантов)',
    },
    options: [
      {
        de: 'Lage und Form der Gebärmutter lassen sich dank des Weichteilkontrasts gut beurteilen.',
        ru: 'Положение и форму матки благодаря контрасту мягких тканей можно хорошо оценить.',
      },
      {
        de: 'Fetus und Plazenta lassen sich ohne ionisierende Strahlung darstellen.',
        ru: 'Плод и плаценту можно отобразить без ионизирующего излучения.',
      },
      {
        de: 'Selbst Teilräume der Plazenta, etwa Gefäße und Gewebe, lassen sich unterscheiden.',
        ru: 'Можно различить даже отделы плаценты, например сосуды и ткань.',
      },
      {
        de: 'In der Schwangerschaft gibt man routinemäßig hoch dosiertes Gadolinium, um den Fetus besser zu sehen.',
        ru: 'При беременности рутинно вводят высокую дозу гадолиния, чтобы лучше видеть плод.',
      },
      {
        de: 'Den Fetus sieht man erst, wenn seine Knochen vollständig verkalkt sind.',
        ru: 'Плод становится виден только тогда, когда его кости полностью обызвествлены.',
      },
    ],
    answers: [0, 1, 2],
    hint: {
      de: 'Das MRT sieht Wasser und Weichteile, keine Knochen. Und was tut man in der Schwangerschaft mit Medikamenten, die nicht nötig sind?',
      ru: 'МРТ видит воду и мягкие ткани, а не кости. А что делают при беременности с лекарствами, без которых можно обойтись?',
    },
    explanation: {
      de: '**Richtig sind Weichteilbeurteilung im Becken, strahlenfreie Darstellung von Fetus und Plazenta und die Unterscheidung von Plazenta-Teilräumen.** Gebärmutter, Plazenta und Fetus bestehen größtenteils aus Wasser und unterscheiden sich in ihren Relaxationszeiten. Das gibt starken Kontrast. Im Skript sieht man zum Beispiel eine Plazenta, die tief vor dem Muttermund liegt (Placenta praevia), und eine Aufteilung der Plazenta in Gefäße und Gewebe. Weil keine ionisierende Strahlung im Spiel ist, eignet sich das MRT hier besonders. Gadolinium kann die Plazenta passieren, deshalb vermeidet man es in der Schwangerschaft so weit wie möglich. Und Knochen braucht das MRT nicht, es sieht die wasserreichen Weichteile.',
      ru: '**Верны: оценка мягких тканей таза, отображение плода и плаценты без излучения и различение отделов плаценты.** Матка, плацента и плод в основном состоят из воды и различаются временами релаксации. Это даёт сильный контраст. В конспекте, например, видно плаценту, лежащую низко перед шейкой матки (предлежание плаценты), и разделение плаценты на сосуды и ткань. Поскольку ионизирующего излучения нет, МРТ здесь особенно подходит. Гадолиний может проходить через плаценту, поэтому при беременности его по возможности избегают. А кости МРТ не нужны, она видит богатые водой мягкие ткани.',
    },
  },
  {
    id: 'an-dti',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Wie entsteht bei der Diffusions-Tensor-Bildgebung (DTI) eine Traktografie der Nervenbahnen?',
      ru: 'Как при диффузионно-тензорной визуализации (DTI) получается трактография нервных путей?',
    },
    options: [
      {
        de: 'Man misst die Wasserdiffusion in vielen Richtungen. Entlang der Fasern diffundiert Wasser leichter, und die Vorzugsrichtung wird von Voxel zu Voxel verbunden.',
        ru: 'Измеряют диффузию воды во многих направлениях. Вдоль волокон вода диффундирует легче, и преимущественное направление соединяют от вокселя к вокселю.',
      },
      {
        de: 'Man misst die elektrische Leitfähigkeit der Nerven über die Empfangsspule.',
        ru: 'Измеряют электропроводность нервов через приёмную катушку.',
      },
      {
        de: 'Man verfolgt ein Kontrastmittel, das in die Nervenfasern gespritzt wird.',
        ru: 'Отслеживают контрастное вещество, которое вводят в нервные волокна.',
      },
      {
        de: 'Man misst die Fließgeschwindigkeit des Blutes in den Nerven über die Phase.',
        ru: 'Измеряют скорость крови в нервах через фазу.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Wasser bewegt sich zufällig. In einem Bündel aus langen Röhren kommt es aber nicht in jede Richtung gleich gut voran.',
      ru: 'Вода движется хаотично. Но в пучке длинных трубок она продвигается не во все стороны одинаково хорошо.',
    },
    explanation: {
      de: '**DTI misst, in welche Richtung Wasser am leichtesten diffundiert, und verbindet diese Richtungen zu Bahnen.** Wassermoleküle zappeln ständig zufällig umher. In freiem Wasser geht das in alle Richtungen gleich gut. In einem Nervenfaserbündel ist es wie in einem Bündel Strohhalme: Längs kommt das Wasser weit, quer stößt es gleich an Wände. Diese Richtungsabhängigkeit heißt Anisotropie. Mit Diffusionsgradienten in mindestens sechs Richtungen bestimmt man pro Voxel einen Tensor, also eine Art Ellipsoid mit Vorzugsrichtung. Die Traktografie folgt dieser Richtung von Voxel zu Voxel. Das Skript zeigt so Nervenbahnen im Gehirn und die Faserstruktur des Herzmuskels.',
      ru: '**DTI измеряет, в каком направлении вода диффундирует легче всего, и соединяет эти направления в пути.** Молекулы воды постоянно хаотично двигаются. В свободной воде это одинаково легко во все стороны. В пучке нервных волокон это как в пучке соломинок: вдоль вода уходит далеко, а поперёк сразу упирается в стенки. Такая зависимость от направления называется анизотропией. С диффузионными градиентами минимум в шести направлениях для каждого вокселя определяют тензор, то есть своего рода эллипсоид с преимущественным направлением. Трактография следует этому направлению от вокселя к вокселю. Так в конспекте показаны нервные пути в мозге и волоконная структура сердечной мышцы.',
    },
  },
];
