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
          `${label} при ${n(field, 2, lang)} Тл має T1 = ${p.t1} мс. Скільки відсотків $M_0$ відновилося вздовж осі z через ${time} мс після 90°-імпульсу?`,
        ),
        answer: 100 * mzAfter90(time, p.t1),
        tolerance: 0.02,
        unit: '%',
        hint: t('$M_z(t) = M_0\\,(1 - e^{-t/T_1})$', '$M_z(t) = M_0\\,(1 - e^{-t/T_1})$'),
        explanation: t(
          `$M_z = 1 - e^{-${time}/${p.t1}} = ${pct}\\,\\%$. Nach t = T1 sind es immer 63 %, nach 3·T1 95 %, nach 5·T1 > 99 %.`,
          `$M_z = 1 - e^{-${time}/${p.t1}} = ${pct}\\,\\%$. Через t = T1 завжди відновлюється 63 %, через 3·T1 – 95 %, через 5·T1 – > 99 %.`,
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
          `${label}: T2 = ${p.t2} мс (1,5 Тл). Скільки відсотків поперечної намагніченості залишається у спін-ехо з TE = ${te} мс?`,
        ),
        answer: 100 * mxyDecay(te, p.t2),
        tolerance: 0.02,
        unit: '%',
        hint: t(
          '$M_{\\text{xy}}(t) = M_{\\text{xy}}(0)\\,e^{-t/T_2}$ – im Spin-Echo zählt T2, nicht T2*.',
          '$M_{\\text{xy}}(t) = M_{\\text{xy}}(0)\\,e^{-t/T_2}$ – у спін-ехо важить T2, а не T2*.',
        ),
        explanation: t(
          `$e^{-${te}/${p.t2}} = ${pct}\\,\\%$. Nach t = T2 sind nur noch 37 % übrig.`,
          `$e^{-${te}/${p.t2}} = ${pct}\\,\\%$. Через t = T2 залишається лише 37 %.`,
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
          `Через який час поперечна намагніченість тканини з T2 = ${t2} мс спадає до ${pct} %?`,
        ),
        answer: time,
        tolerance: 0.02,
        unit: t('ms', 'мс'),
        hint: t('Löse $p = e^{-t/T_2}$ nach t auf.', 'Розв’яжіть $p = e^{-t/T_2}$ відносно t.'),
        explanation: t(
          `$t = T_2 \\ln(1/p) = ${t2} \\cdot \\ln(${n(100 / pct, 2, lang)}) = ${n(time, 1, lang)}$ ms. Für 50 % ergibt sich die „Halbwertszeit“ T2·ln 2.`,
          `$t = T_2 \\ln(1/p) = ${t2} \\cdot \\ln(${n(100 / pct, 2, lang)}) = ${n(time, 1, lang)}$ мс. Для 50 % отримуємо «період напіврозпаду» T2·ln 2.`,
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
          `Тканина має T2 = ${t2} мс. Локальні неоднорідності поля додають оборотну дефазацію з $T_2' = ${t2p}$ мс. Чому дорівнює T2*?`,
        ),
        answer: t2s,
        tolerance: 0.02,
        unit: t('ms', 'мс'),
        hint: t(
          'Relaxationsraten addieren sich: $1/T_2^* = 1/T_2 + 1/T_2\'$.',
          'Швидкості релаксації додаються: $1/T_2^* = 1/T_2 + 1/T_2\'$.',
        ),
        explanation: t(
          `$T_2^* = (1/${t2} + 1/${t2p})^{-1} = ${n(t2s, 1, lang)}$ ms. Der T2'-Anteil ist statisch und wird durch einen 180°-Refokussierungspuls zurückgedreht – der T2-Anteil nicht.`,
          `$T_2^* = (1/${t2} + 1/${t2p})^{-1} = ${n(t2s, 1, lang)}$ мс. Складова T2' статична і повертається 180°-рефокусувальним імпульсом – складова T2 ні.`,
        ),
      };
    },
  },
  {
    id: 'rx-t1-def',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Welcher Prozess bestimmt die T1-Relaxation?', uk: 'Який процес визначає T1-релаксацію?' },
    options: [
      {
        de: 'Energieabgabe der Spins an die molekulare Umgebung („Gitter“) – Rückkehr in den thermischen Gleichgewichtszustand.',
        uk: 'Передача енергії спінів молекулярному оточенню («ґратці») – повернення до стану теплової рівноваги.',
      },
      {
        de: 'Dephasierung durch Wechselwirkung benachbarter Spins ohne Energieaustausch mit der Umgebung.',
        uk: 'Дефазація через взаємодію сусідніх спінів без обміну енергією з оточенням.',
      },
      { de: 'Inhomogenitäten des statischen Magnetfeldes.', uk: 'Неоднорідності статичного магнітного поля.' },
      { de: 'Die Ausschaltung der Gradienten nach der Anregung.', uk: 'Вимкнення градієнтів після збудження.' },
    ],
    answer: 0,
    explanation: {
      de: 'T1 = Spin-Gitter-Relaxation: Die Spins geben die bei der Anregung aufgenommene Energie ab. Besonders effizient ist das, wenn Molekülbewegungen Frequenzanteile nahe der Larmor-Frequenz haben (z. B. mittelgroße Moleküle wie Fett) – reines Wasser (zu schnell) und Festkörper (zu langsam) relaxieren langsam.',
      uk: 'T1 = спін-ґраткова релаксація: спіни віддають енергію, отриману під час збудження. Найефективніше це відбувається, коли рухи молекул мають частотні складові поблизу ларморової частоти (напр. молекули середнього розміру, як у жирі) – чиста вода (надто швидкі рухи) і тверді тіла (надто повільні) релаксують повільно.',
    },
  },
  {
    id: 'rx-order',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Welche Reihenfolge der Zeitkonstanten gilt für jedes Gewebe?', uk: 'Яке співвідношення часових констант справджується для будь-якої тканини?' },
    options: [
      { de: '$T_2^* \\le T_2 \\le T_1$', uk: '$T_2^* \\le T_2 \\le T_1$' },
      { de: '$T_1 \\le T_2 \\le T_2^*$', uk: '$T_1 \\le T_2 \\le T_2^*$' },
      { de: '$T_2 \\le T_2^* \\le T_1$', uk: '$T_2 \\le T_2^* \\le T_1$' },
      { de: 'Keine feste Reihenfolge', uk: 'Немає сталого порядку' },
    ],
    answer: 0,
    explanation: {
      de: 'Jeder T1-Prozess zerstört auch Phasenkohärenz (T2 ≤ T1, im Grenzfall reinen Wassers gleich). Feldinhomogenitäten fügen weitere Dephasierung hinzu, daher T2* ≤ T2.',
      uk: 'Кожен T1-процес також руйнує фазову когерентність (T2 ≤ T1, у граничному випадку чистої води – рівні). Неоднорідності поля додають ще дефазацію, тому T2* ≤ T2.',
    },
  },
  {
    id: 'rx-field',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Wie verändern sich typische Gewebe-T1-Zeiten beim Wechsel von 1,5 T auf 3 T?',
      uk: 'Як змінюються типові часи T1 тканин при переході з 1,5 Тл на 3 Тл?',
    },
    options: [
      {
        de: 'T1 wird länger (ca. 20–40 %), T2 bleibt ähnlich bzw. sinkt leicht.',
        uk: 'T1 подовжується (приблизно на 20–40 %), T2 залишається подібним або дещо зменшується.',
      },
      { de: 'T1 halbiert sich, da die Larmor-Frequenz doppelt so hoch ist.', uk: 'T1 зменшується вдвічі, оскільки ларморова частота вдвічі вища.' },
      { de: 'T1 und T2 bleiben exakt gleich, Relaxation ist feldunabhängig.', uk: 'T1 і T2 залишаються точно такими ж, релаксація не залежить від поля.' },
      { de: 'T2 verdoppelt sich, T1 bleibt gleich.', uk: 'T2 подвоюється, T1 залишається незмінним.' },
    ],
    answer: 0,
    explanation: {
      de: 'Bei höherer Larmor-Frequenz gibt es weniger Molekülbewegungen mit passender Frequenz → ineffizientere Energieabgabe → längeres T1. Für T1w-Sequenzen bei 3 T muss TR daher angepasst werden; T1-verkürzende Kontrastmittel wirken relativ stärker.',
      uk: 'За вищої ларморової частоти менше молекулярних рухів із відповідною частотою → менш ефективна передача енергії → довший T1. Тому для T1-зважених послідовностей при 3 Тл треба коригувати TR; контрастні речовини, що вкорочують T1, діють відносно сильніше.',
    },
  },
  {
    id: 'rx-t2w',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Welche Parameterkombination eines Spin-Echos erzeugt eine T2-Wichtung?',
      uk: 'Яке поєднання параметрів спін-ехо дає T2-зважене зображення?',
    },
    options: [
      { de: 'Langes TR, langes TE', uk: 'Довгий TR, довгий TE' },
      { de: 'Kurzes TR, kurzes TE', uk: 'Короткий TR, короткий TE' },
      { de: 'Langes TR, kurzes TE', uk: 'Довгий TR, короткий TE' },
      { de: 'Kurzes TR, langes TE', uk: 'Короткий TR, довгий TE' },
    ],
    answer: 0,
    explanation: {
      de: 'Langes TR (≥ 2000 ms) lässt alle Gewebe vollständig T1-relaxieren → T1-Unterschiede verschwinden. Langes TE (≈ 80–120 ms) lässt T2-Unterschiede wirken. Kurz/kurz = T1w, lang/kurz = PDw, kurz/lang = kaum Signal und gemischter Kontrast.',
      uk: 'Довгий TR (≥ 2000 мс) дає всім тканинам повністю T1-релаксувати → відмінності T1 зникають. Довгий TE (≈ 80–120 мс) виявляє відмінності T2. Короткий/короткий = T1w, довгий/короткий = PDw, короткий/довгий = майже немає сигналу і змішаний контраст.',
    },
  },
  {
    id: 'rx-t1w-appearance',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Wie erscheinen Fett und Liquor in einem T1-gewichteten Spin-Echo?',
      uk: 'Як виглядають жир і ліквор на T1-зваженому спін-ехо?',
    },
    options: [
      { de: 'Fett hell, Liquor dunkel', uk: 'Жир світлий, ліквор темний' },
      { de: 'Fett dunkel, Liquor hell', uk: 'Жир темний, ліквор світлий' },
      { de: 'Beide hell', uk: 'Обидва світлі' },
      { de: 'Beide dunkel', uk: 'Обидва темні' },
    ],
    answer: 0,
    explanation: {
      de: 'Fett hat das kürzeste T1 (≈ 260 ms bei 1,5 T) und ist bei kurzem TR schon weitgehend relaxiert → hell. Liquor (T1 ≈ 4 s) hat kaum Längsmagnetisierung zurückgewonnen → dunkel.',
      uk: 'Жир має найкоротший T1 (≈ 260 мс при 1,5 Тл) і за короткого TR уже значною мірою релаксував → світлий. Ліквор (T1 ≈ 4 с) майже не відновив поздовжню намагніченість → темний.',
    },
  },
  {
    id: 'rx-spin-echo',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum entsteht nach einem 180°-Puls zur Zeit TE/2 ein Spin-Echo zur Zeit TE?',
      uk: 'Чому після 180°-імпульсу в момент TE/2 у момент TE виникає спінове відлуння (спін-ехо)?',
    },
    options: [
      {
        de: 'Der Puls spiegelt die Phasen: Spins, die durch statische Feldunterschiede vorausgeeilt sind, liegen danach zurück und holen bis TE exakt auf.',
        uk: 'Імпульс дзеркально відображає фази: спіни, що випередили інших через статичні відмінності поля, опиняються позаду і точно наздоганяють до моменту TE.',
      },
      { de: 'Der 180°-Puls kehrt die T2-Relaxation um.', uk: '180°-імпульс обертає T2-релаксацію назад.' },
      {
        de: 'Der 180°-Puls erhöht die Längsmagnetisierung, die dann in die Querebene kippt.',
        uk: '180°-імпульс збільшує поздовжню намагніченість, яка потім відхиляється в поперечну площину.',
      },
      { de: 'Das Echo entsteht, weil der Gradient seine Polarität umkehrt.', uk: 'Ехо виникає тому, що градієнт змінює полярність.' },
    ],
    answer: 0,
    explanation: {
      de: 'Statische Off-Resonanzen (Inhomogenität, Suszeptibilität, chemische Verschiebung) werden refokussiert – die Echoamplitude folgt daher e^(−TE/T2), nicht e^(−TE/T2*). Irreversible Spin-Spin-Fluktuationen werden nicht refokussiert. Das Gradientenecho (Gradientenumkehr) refokussiert dagegen nur die Gradientendephasierung.',
      uk: 'Статичні відхилення від резонансу (неоднорідність, магнітна сприйнятливість, хімічний зсув) рефокусуються – тому амплітуда відлуння спадає як e^(−TE/T2), а не e^(−TE/T2*). Необоротні спін-спінові флуктуації не рефокусуються. Градієнтне ехо (зміна полярності градієнта) натомість рефокусує лише дефазацію від градієнта.',
    },
  },
  {
    id: 'rx-bloch',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Welche Gleichung beschreibt die Längskomponente der Bloch-Gleichungen (ohne HF, im Laborsystem)?',
      uk: 'Яке рівняння описує поздовжню компоненту рівнянь Блоха (без РЧ, у лабораторній системі)?',
    },
    options: [
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z - M_0}{T_1}$', uk: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z - M_0}{T_1}$' },
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z}{T_2}$', uk: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z}{T_2}$' },
      { de: '$\\dfrac{dM_z}{dt} = \\gamma B_0 M_z$', uk: '$\\dfrac{dM_z}{dt} = \\gamma B_0 M_z$' },
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_0}{T_1}$', uk: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_0}{T_1}$' },
    ],
    answer: 0,
    explanation: {
      de: 'Die Bloch-Gleichung dM/dt = γ M × B − (M_x x̂ + M_y ŷ)/T2 − (M_z − M₀) ẑ/T1 liefert für die z-Komponente eine Relaxation zum Gleichgewicht M₀, Lösung M_z(t) = M₀ + (M_z(0) − M₀)·e^(−t/T1).',
      uk: 'Рівняння Блоха dM/dt = γ M × B − (M_x x̂ + M_y ŷ)/T2 − (M_z − M₀) ẑ/T1 дає для z-компоненти релаксацію до рівноважного M₀, розв’язок M_z(t) = M₀ + (M_z(0) − M₀)·e^(−t/T1).',
    },
  },
  {
    id: 'rx-multi-contrast',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Aussagen zu Gewebekontrasten bei 1,5 T sind korrekt? (Mehrfachauswahl)',
      uk: 'Які твердження про тканинний контраст при 1,5 Тл правильні? (кілька варіантів)',
    },
    options: [
      { de: 'Freies Wasser (Liquor, Ödem) hat lange T1- und T2-Zeiten.', uk: 'Вільна вода (ліквор, набряк) має довгі часи T1 і T2.' },
      { de: 'Weiße Substanz hat ein kürzeres T1 als graue Substanz (Myelin).', uk: 'Біла речовина має коротший T1, ніж сіра (мієлін).' },
      { de: 'Muskel hat ein besonders langes T2 und ist daher in T2w hell.', uk: 'М’яз має особливо довгий T2 і тому світлий на T2w.' },
      {
        de: 'Gadolinium-Kontrastmittel verkürzen vor allem T1 und machen anreicherndes Gewebe in T1w hell.',
        uk: 'Контрастні речовини на основі гадолінію передусім вкорочують T1 і роблять тканину, що накопичує контраст, світлою на T1w.',
      },
    ],
    answers: [0, 1, 3],
    explanation: {
      de: 'Muskel hat ein kurzes T2 (≈ 40–50 ms) und ist in T2w dunkel. Myelin verkürzt das T1 der weißen Substanz → WM erscheint in T1w heller als GM. Gd³⁺ (7 ungepaarte Elektronen) beschleunigt die Relaxation benachbarter Wasserprotonen.',
      uk: 'М’яз має короткий T2 (≈ 40–50 мс) і темний на T2w. Мієлін вкорочує T1 білої речовини → БР на T1w світліша за СР. Gd³⁺ (7 неспарених електронів) прискорює релаксацію сусідніх протонів води.',
    },
  },
];
