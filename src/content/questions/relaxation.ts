import { TISSUES, type TissueId } from '../../physics/constants';
import { mxyDecay, mzAfter90 } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

const tissuePool: TissueId[] = ['wm', 'gm', 'fat', 'muscle', 'liver', 'csf'];

export const relaxationQuestions: QuestionSource[] = [
  {
    id: 'rx-mz',
    generate: (rng, lang) => {
      const tid = pick(
        rng,
        tissuePool.filter((x) => x !== 'csf'),
      );
      const field = pick(rng, [1.5, 3] as const);
      const p = TISSUES[tid].params[field];
      const time = pick(rng, [200, 300, 500, 800, 1000]);
      const t = tl(lang);
      const label = TISSUES[tid].label[lang];
      const pct = n(100 * mzAfter90(time, p.t1), 1, lang);
      return {
        kind: 'numeric',
        id: 'rx-mz',
        difficulty: 1,
        prompt: t(
          `${label} hat bei ${n(field, 2, lang)} T ein T1 von ${p.t1} ms. Wie viel Prozent von $M_0$ hat sich ${time} ms nach einem 90°-Puls in z-Richtung erholt?`,
          `${label} при ${n(field, 2, lang)} Тл имеет T1 = ${p.t1} мс. Сколько процентов $M_0$ восстановилось вдоль оси z через ${time} мс после 90°-импульса?`,
        ),
        answer: 100 * mzAfter90(time, p.t1),
        tolerance: 0.02,
        unit: '%',
        hint: t('$M_z(t) = M_0\\,(1 - e^{-t/T_1})$', '$M_z(t) = M_0\\,(1 - e^{-t/T_1})$'),
        explanation: t(
          `$M_z = 1 - e^{-${time}/${p.t1}} = ${pct}\\,\\%$. Nach t = T1 sind es immer 63 %, nach 3·T1 95 %, nach 5·T1 > 99 %.`,
          `$M_z = 1 - e^{-${time}/${p.t1}} = ${pct}\\,\\%$. Через t = T1 всегда восстанавливается 63 %, через 3·T1 – 95 %, через 5·T1 – > 99 %.`,
        ),
      };
    },
  },
  {
    id: 'rx-mxy',
    generate: (rng, lang) => {
      const tid = pick(rng, tissuePool);
      const p = TISSUES[tid].params[1.5];
      const te = pick(rng, [15, 30, 50, 80, 100, 120]);
      const t = tl(lang);
      const label = TISSUES[tid].label[lang];
      const pct = n(100 * mxyDecay(te, p.t2), 1, lang);
      return {
        kind: 'numeric',
        id: 'rx-mxy',
        difficulty: 1,
        prompt: t(
          `${label}: T2 = ${p.t2} ms (1,5 T). Wie viel Prozent der Quermagnetisierung sind bei einem Spin-Echo mit TE = ${te} ms noch vorhanden?`,
          `${label}: T2 = ${p.t2} мс (1,5 Тл). Сколько процентов поперечной намагниченности остаётся в спин-эхо с TE = ${te} мс?`,
        ),
        answer: 100 * mxyDecay(te, p.t2),
        tolerance: 0.02,
        unit: '%',
        hint: t(
          '$M_{\\text{xy}}(t) = M_{\\text{xy}}(0)\\,e^{-t/T_2}$ – im Spin-Echo zählt T2, nicht T2*.',
          '$M_{\\text{xy}}(t) = M_{\\text{xy}}(0)\\,e^{-t/T_2}$ – в спин-эхо важно T2, а не T2*.',
        ),
        explanation: t(
          `$e^{-${te}/${p.t2}} = ${pct}\\,\\%$. Nach t = T2 sind nur noch 37 % übrig.`,
          `$e^{-${te}/${p.t2}} = ${pct}\\,\\%$. Через t = T2 остаётся лишь 37 %.`,
        ),
      };
    },
  },
  {
    id: 'rx-time-to',
    generate: (rng, lang) => {
      const t2 = pick(rng, [40, 50, 80, 100, 180]);
      const pct = pick(rng, [50, 25, 10]);
      const time = t2 * Math.log(100 / pct);
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'rx-time-to',
        difficulty: 2,
        prompt: t(
          `Nach welcher Zeit ist die Quermagnetisierung eines Gewebes mit T2 = ${t2} ms auf ${pct} % abgefallen?`,
          `Через какое время поперечная намагниченность ткани с T2 = ${t2} мс спадает до ${pct} %?`,
        ),
        answer: time,
        tolerance: 0.02,
        unit: t('ms', 'мс'),
        hint: t('Löse $p = e^{-t/T_2}$ nach t auf.', 'Реши $p = e^{-t/T_2}$ относительно t.'),
        explanation: t(
          `$t = T_2 \\ln(1/p) = ${t2} \\cdot \\ln(${n(100 / pct, 2, lang)}) = ${n(time, 1, lang)}$ ms. Für 50 % ergibt sich die „Halbwertszeit“ T2·ln 2.`,
          `$t = T_2 \\ln(1/p) = ${t2} \\cdot \\ln(${n(100 / pct, 2, lang)}) = ${n(time, 1, lang)}$ мс. Для 50 % получается «период полураспада» T2·ln 2.`,
        ),
      };
    },
  },
  {
    id: 'rx-t2star',
    generate: (rng, lang) => {
      const t2 = pick(rng, [50, 80, 100]);
      const t2p = pick(rng, [20, 40, 60]);
      const t2s = 1 / (1 / t2 + 1 / t2p);
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'rx-t2star',
        difficulty: 2,
        prompt: t(
          `Ein Gewebe hat T2 = ${t2} ms. Lokale Feldinhomogenitäten tragen eine reversible Dephasierung mit $T_2' = ${t2p}$ ms bei. Wie groß ist T2*?`,
          `Ткань имеет T2 = ${t2} мс. Локальные неоднородности поля добавляют обратимую дефазировку с $T_2' = ${t2p}$ мс. Чему равно T2*?`,
        ),
        answer: t2s,
        tolerance: 0.02,
        unit: t('ms', 'мс'),
        hint: t(
          'Relaxationsraten addieren sich: $1/T_2^* = 1/T_2 + 1/T_2\'$.',
          'Скорости релаксации складываются: $1/T_2^* = 1/T_2 + 1/T_2\'$.',
        ),
        explanation: t(
          `$T_2^* = (1/${t2} + 1/${t2p})^{-1} = ${n(t2s, 1, lang)}$ ms. Der T2'-Anteil ist statisch und wird durch einen 180°-Refokussierungspuls zurückgedreht – der T2-Anteil nicht.`,
          `$T_2^* = (1/${t2} + 1/${t2p})^{-1} = ${n(t2s, 1, lang)}$ мс. Составляющая T2' статична и обращается 180°-рефокусирующим импульсом – составляющая T2 нет.`,
        ),
      };
    },
  },
  {
    id: 'rx-t1-def',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Welcher Prozess bestimmt die T1-Relaxation?', ru: 'Какой процесс определяет T1-релаксацию?' },
    options: [
      {
        de: 'Energieabgabe der Spins an die molekulare Umgebung („Gitter“) – Rückkehr in den thermischen Gleichgewichtszustand.',
        ru: 'Передача энергии спинов молекулярному окружению («решётке») – возврат в состояние теплового равновесия.',
      },
      {
        de: 'Dephasierung durch Wechselwirkung benachbarter Spins ohne Energieaustausch mit der Umgebung.',
        ru: 'Дефазировка из-за взаимодействия соседних спинов без обмена энергией с окружением.',
      },
      { de: 'Inhomogenitäten des statischen Magnetfeldes.', ru: 'Неоднородности статического магнитного поля.' },
      { de: 'Die Ausschaltung der Gradienten nach der Anregung.', ru: 'Выключение градиентов после возбуждения.' },
    ],
    answer: 0,
    explanation: {
      de: 'T1 = Spin-Gitter-Relaxation: Die Spins geben die bei der Anregung aufgenommene Energie ab. Besonders effizient ist das, wenn Molekülbewegungen Frequenzanteile nahe der Larmor-Frequenz haben (z. B. mittelgroße Moleküle wie Fett) – reines Wasser (zu schnell) und Festkörper (zu langsam) relaxieren langsam.',
      ru: 'T1 = спин-решёточная релаксация: спины отдают энергию, полученную при возбуждении. Особенно эффективно это происходит, когда движения молекул имеют частотные составляющие вблизи ларморовой частоты (напр. молекулы среднего размера, как в жире) – чистая вода (слишком быстрые движения) и твёрдые тела (слишком медленные) релаксируют медленно.',
    },
  },
  {
    id: 'rx-order',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Welche Reihenfolge der Zeitkonstanten gilt für jedes Gewebe?', ru: 'Какое соотношение временных констант выполняется для любой ткани?' },
    options: [
      { de: '$T_2^* \\le T_2 \\le T_1$', ru: '$T_2^* \\le T_2 \\le T_1$' },
      { de: '$T_1 \\le T_2 \\le T_2^*$', ru: '$T_1 \\le T_2 \\le T_2^*$' },
      { de: '$T_2 \\le T_2^* \\le T_1$', ru: '$T_2 \\le T_2^* \\le T_1$' },
      { de: 'Keine feste Reihenfolge', ru: 'Постоянного порядка нет' },
    ],
    answer: 0,
    explanation: {
      de: 'Jeder T1-Prozess zerstört auch Phasenkohärenz (T2 ≤ T1, im Grenzfall reinen Wassers gleich). Feldinhomogenitäten fügen weitere Dephasierung hinzu, daher T2* ≤ T2.',
      ru: 'Каждый T1-процесс также разрушает фазовую когерентность (T2 ≤ T1, в предельном случае чистой воды – равны). Неоднородности поля добавляют дополнительную дефазировку, поэтому T2* ≤ T2.',
    },
  },
  {
    id: 'rx-field',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Wie verändern sich typische Gewebe-T1-Zeiten beim Wechsel von 1,5 T auf 3 T?',
      ru: 'Как изменяются типичные времена T1 тканей при переходе с 1,5 Тл на 3 Тл?',
    },
    options: [
      {
        de: 'T1 wird länger (ca. 20–40 %), T2 bleibt ähnlich bzw. sinkt leicht.',
        ru: 'T1 удлиняется (примерно на 20–40 %), T2 остаётся близким или слегка уменьшается.',
      },
      { de: 'T1 halbiert sich, da die Larmor-Frequenz doppelt so hoch ist.', ru: 'T1 уменьшается вдвое, так как ларморова частота вдвое выше.' },
      { de: 'T1 und T2 bleiben exakt gleich, Relaxation ist feldunabhängig.', ru: 'T1 и T2 остаются точно такими же, релаксация не зависит от поля.' },
      { de: 'T2 verdoppelt sich, T1 bleibt gleich.', ru: 'T2 удваивается, T1 остаётся прежним.' },
    ],
    answer: 0,
    explanation: {
      de: 'Bei höherer Larmor-Frequenz gibt es weniger Molekülbewegungen mit passender Frequenz → ineffizientere Energieabgabe → längeres T1. Für T1w-Sequenzen bei 3 T muss TR daher angepasst werden; T1-verkürzende Kontrastmittel wirken relativ stärker.',
      ru: 'При более высокой ларморовой частоте меньше молекулярных движений с подходящей частотой → менее эффективная передача энергии → более длинное T1. Поэтому для T1-взвешенных последовательностей при 3 Тл нужно корректировать TR; контрастные вещества, укорачивающие T1, действуют относительно сильнее.',
    },
  },
  {
    id: 'rx-t2w',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Welche Parameterkombination eines Spin-Echos erzeugt eine T2-Wichtung?',
      ru: 'Какое сочетание параметров спин-эхо даёт T2-взвешенное изображение?',
    },
    options: [
      { de: 'Langes TR, langes TE', ru: 'Длинное TR, длинное TE' },
      { de: 'Kurzes TR, kurzes TE', ru: 'Короткое TR, короткое TE' },
      { de: 'Langes TR, kurzes TE', ru: 'Длинное TR, короткое TE' },
      { de: 'Kurzes TR, langes TE', ru: 'Короткое TR, длинное TE' },
    ],
    answer: 0,
    explanation: {
      de: 'Langes TR (≥ 2000 ms) lässt alle Gewebe vollständig T1-relaxieren → T1-Unterschiede verschwinden. Langes TE (≈ 80–120 ms) lässt T2-Unterschiede wirken. Kurz/kurz = T1w, lang/kurz = PDw, kurz/lang = kaum Signal und gemischter Kontrast.',
      ru: 'Длинное TR (≥ 2000 мс) позволяет всем тканям полностью T1-релаксировать → различия T1 исчезают. Длинное TE (≈ 80–120 мс) проявляет различия T2. Короткое/короткое = T1w, длинное/короткое = PDw, короткое/длинное = почти нет сигнала и смешанный контраст.',
    },
  },
  {
    id: 'rx-t1w-appearance',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Wie erscheinen Fett und Liquor in einem T1-gewichteten Spin-Echo?',
      ru: 'Как выглядят жир и ликвор на T1-взвешенном спин-эхо?',
    },
    options: [
      { de: 'Fett hell, Liquor dunkel', ru: 'Жир светлый, ликвор тёмный' },
      { de: 'Fett dunkel, Liquor hell', ru: 'Жир тёмный, ликвор светлый' },
      { de: 'Beide hell', ru: 'Оба светлые' },
      { de: 'Beide dunkel', ru: 'Оба тёмные' },
    ],
    answer: 0,
    explanation: {
      de: 'Fett hat das kürzeste T1 (≈ 260 ms bei 1,5 T) und ist bei kurzem TR schon weitgehend relaxiert → hell. Liquor (T1 ≈ 4 s) hat kaum Längsmagnetisierung zurückgewonnen → dunkel.',
      ru: 'У жира самое короткое T1 (≈ 260 мс при 1,5 Тл), и при коротком TR он уже в значительной мере релаксировал → светлый. Ликвор (T1 ≈ 4 с) почти не восстановил продольную намагниченность → тёмный.',
    },
  },
  {
    id: 'rx-spin-echo',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum entsteht nach einem 180°-Puls zur Zeit TE/2 ein Spin-Echo zur Zeit TE?',
      ru: 'Почему после 180°-импульса в момент TE/2 в момент TE возникает спиновое эхо?',
    },
    options: [
      {
        de: 'Der Puls spiegelt die Phasen: Spins, die durch statische Feldunterschiede vorausgeeilt sind, liegen danach zurück und holen bis TE exakt auf.',
        ru: 'Импульс зеркально отражает фазы: спины, опередившие другие из-за статических различий поля, оказываются позади и точно догоняют к моменту TE.',
      },
      { de: 'Der 180°-Puls kehrt die T2-Relaxation um.', ru: '180°-импульс обращает T2-релаксацию вспять.' },
      {
        de: 'Der 180°-Puls erhöht die Längsmagnetisierung, die dann in die Querebene kippt.',
        ru: '180°-импульс увеличивает продольную намагниченность, которая затем отклоняется в поперечную плоскость.',
      },
      { de: 'Das Echo entsteht, weil der Gradient seine Polarität umkehrt.', ru: 'Эхо возникает потому, что градиент меняет полярность.' },
    ],
    answer: 0,
    explanation: {
      de: 'Statische Off-Resonanzen (Inhomogenität, Suszeptibilität, chemische Verschiebung) werden refokussiert – die Echoamplitude folgt daher e^(−TE/T2), nicht e^(−TE/T2*). Irreversible Spin-Spin-Fluktuationen werden nicht refokussiert. Das Gradientenecho (Gradientenumkehr) refokussiert dagegen nur die Gradientendephasierung.',
      ru: 'Статические отклонения от резонанса (неоднородность, магнитная восприимчивость, химический сдвиг) рефокусируются – поэтому амплитуда эха спадает как e^(−TE/T2), а не e^(−TE/T2*). Необратимые спин-спиновые флуктуации не рефокусируются. Градиентное эхо (смена полярности градиента), напротив, рефокусирует лишь дефазировку от градиента.',
    },
  },
  {
    id: 'rx-bloch',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Welche Gleichung beschreibt die Längskomponente der Bloch-Gleichungen (ohne HF, im Laborsystem)?',
      ru: 'Какое уравнение описывает продольную компоненту уравнений Блоха (без РЧ, в лабораторной системе)?',
    },
    options: [
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z - M_0}{T_1}$', ru: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z - M_0}{T_1}$' },
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z}{T_2}$', ru: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z}{T_2}$' },
      { de: '$\\dfrac{dM_z}{dt} = \\gamma B_0 M_z$', ru: '$\\dfrac{dM_z}{dt} = \\gamma B_0 M_z$' },
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_0}{T_1}$', ru: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_0}{T_1}$' },
    ],
    answer: 0,
    explanation: {
      de: 'Die Bloch-Gleichung dM/dt = γ M × B − (M_x x̂ + M_y ŷ)/T2 − (M_z − M₀) ẑ/T1 liefert für die z-Komponente eine Relaxation zum Gleichgewicht M₀, Lösung M_z(t) = M₀ + (M_z(0) − M₀)·e^(−t/T1).',
      ru: 'Уравнение Блоха dM/dt = γ M × B − (M_x x̂ + M_y ŷ)/T2 − (M_z − M₀) ẑ/T1 даёт для z-компоненты релаксацию к равновесному M₀, решение M_z(t) = M₀ + (M_z(0) − M₀)·e^(−t/T1).',
    },
  },
  {
    id: 'rx-multi-contrast',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Aussagen zu Gewebekontrasten bei 1,5 T sind korrekt? (Mehrfachauswahl)',
      ru: 'Какие утверждения о тканевом контрасте при 1,5 Тл верны? (несколько вариантов)',
    },
    options: [
      { de: 'Freies Wasser (Liquor, Ödem) hat lange T1- und T2-Zeiten.', ru: 'Свободная вода (ликвор, отёк) имеет длинные времена T1 и T2.' },
      { de: 'Weiße Substanz hat ein kürzeres T1 als graue Substanz (Myelin).', ru: 'У белого вещества T1 короче, чем у серого (миелин).' },
      { de: 'Muskel hat ein besonders langes T2 und ist daher in T2w hell.', ru: 'У мышцы особенно длинное T2, поэтому она светлая на T2w.' },
      {
        de: 'Gadolinium-Kontrastmittel verkürzen vor allem T1 und machen anreicherndes Gewebe in T1w hell.',
        ru: 'Контрастные вещества на основе гадолиния прежде всего укорачивают T1 и делают накапливающую контраст ткань светлой на T1w.',
      },
    ],
    answers: [0, 1, 3],
    explanation: {
      de: 'Muskel hat ein kurzes T2 (≈ 40–50 ms) und ist in T2w dunkel. Myelin verkürzt das T1 der weißen Substanz → WM erscheint in T1w heller als GM. Gd³⁺ (7 ungepaarte Elektronen) beschleunigt die Relaxation benachbarter Wasserprotonen.',
      ru: 'У мышцы короткое T2 (≈ 40–50 мс), и на T2w она тёмная. Миелин укорачивает T1 белого вещества → БВ на T1w светлее СВ. Gd³⁺ (7 неспаренных электронов) ускоряет релаксацию соседних протонов воды.',
    },
  },
];
