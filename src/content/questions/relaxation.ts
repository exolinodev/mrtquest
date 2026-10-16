import { TISSUES, type TissueId } from '../../physics/constants';
import { mxyDecay, mzAfter90 } from '../../physics/mri';
import { n, pick, type QuestionSource } from './types';

const tissuePool: TissueId[] = ['wm', 'gm', 'fat', 'muscle', 'liver', 'csf'];

export const relaxationQuestions: QuestionSource[] = [
  {
    id: 'rx-mz',
    generate: (rng) => {
      const tid = pick(rng, tissuePool.filter((t) => t !== 'csf'));
      const field = pick(rng, [1.5, 3] as const);
      const p = TISSUES[tid].params[field];
      const t = pick(rng, [200, 300, 500, 800, 1000]);
      return {
        kind: 'numeric',
        id: 'rx-mz',
        difficulty: 1,
        prompt: `${TISSUES[tid].label} hat bei ${n(field)} T ein T1 von ${p.t1} ms. Wie viel Prozent von $M_0$ hat sich ${t} ms nach einem 90°-Puls in z-Richtung erholt?`,
        answer: 100 * mzAfter90(t, p.t1),
        tolerance: 0.02,
        unit: '%',
        hint: '$M_z(t) = M_0\\,(1 - e^{-t/T_1})$',
        explanation: `$M_z = 1 - e^{-${t}/${p.t1}} = ${n(100 * mzAfter90(t, p.t1), 1)}\\,\\%$. Nach t = T1 sind es immer 63 %, nach 3·T1 95 %, nach 5·T1 > 99 %.`,
      };
    },
  },
  {
    id: 'rx-mxy',
    generate: (rng) => {
      const tid = pick(rng, tissuePool);
      const p = TISSUES[tid].params[1.5];
      const te = pick(rng, [15, 30, 50, 80, 100, 120]);
      return {
        kind: 'numeric',
        id: 'rx-mxy',
        difficulty: 1,
        prompt: `${TISSUES[tid].label}: T2 = ${p.t2} ms (1,5 T). Wie viel Prozent der Quermagnetisierung sind bei einem Spin-Echo mit TE = ${te} ms noch vorhanden?`,
        answer: 100 * mxyDecay(te, p.t2),
        tolerance: 0.02,
        unit: '%',
        hint: '$M_{\\text{xy}}(t) = M_{\\text{xy}}(0)\\,e^{-t/T_2}$ – im Spin-Echo zählt T2, nicht T2*.',
        explanation: `$e^{-${te}/${p.t2}} = ${n(100 * mxyDecay(te, p.t2), 1)}\\,\\%$. Nach t = T2 sind nur noch 37 % übrig.`,
      };
    },
  },
  {
    id: 'rx-time-to',
    generate: (rng) => {
      const t2 = pick(rng, [40, 50, 80, 100, 180]);
      const pct = pick(rng, [50, 25, 10]);
      const t = t2 * Math.log(100 / pct);
      return {
        kind: 'numeric',
        id: 'rx-time-to',
        difficulty: 2,
        prompt: `Nach welcher Zeit ist die Quermagnetisierung eines Gewebes mit T2 = ${t2} ms auf ${pct} % abgefallen?`,
        answer: t,
        tolerance: 0.02,
        unit: 'ms',
        hint: 'Löse $p = e^{-t/T_2}$ nach t auf.',
        explanation: `$t = T_2 \\ln(1/p) = ${t2} \\cdot \\ln(${n(100 / pct)}) = ${n(t, 1)}$ ms. Für 50 % ergibt sich die „Halbwertszeit“ T2·ln 2.`,
      };
    },
  },
  {
    id: 'rx-t2star',
    generate: (rng) => {
      const t2 = pick(rng, [50, 80, 100]);
      const t2p = pick(rng, [20, 40, 60]);
      const t2s = 1 / (1 / t2 + 1 / t2p);
      return {
        kind: 'numeric',
        id: 'rx-t2star',
        difficulty: 2,
        prompt: `Ein Gewebe hat T2 = ${t2} ms. Lokale Feldinhomogenitäten tragen eine reversible Dephasierung mit $T_2' = ${t2p}$ ms bei. Wie groß ist T2*?`,
        answer: t2s,
        tolerance: 0.02,
        unit: 'ms',
        hint: 'Relaxationsraten addieren sich: $1/T_2^* = 1/T_2 + 1/T_2\'$.',
        explanation: `$T_2^* = (1/${t2} + 1/${t2p})^{-1} = ${n(t2s, 1)}$ ms. Der T2'-Anteil ist statisch und wird durch einen 180°-Refokussierungspuls zurückgedreht – der T2-Anteil nicht.`,
      };
    },
  },
  {
    id: 'rx-t1-def',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Welcher Prozess bestimmt die T1-Relaxation?',
    options: [
      'Energieabgabe der Spins an die molekulare Umgebung („Gitter“) – Rückkehr in den thermischen Gleichgewichtszustand.',
      'Dephasierung durch Wechselwirkung benachbarter Spins ohne Energieaustausch mit der Umgebung.',
      'Inhomogenitäten des statischen Magnetfeldes.',
      'Die Ausschaltung der Gradienten nach der Anregung.',
    ],
    answer: 0,
    explanation:
      'T1 = Spin-Gitter-Relaxation: Die Spins geben die bei der Anregung aufgenommene Energie ab. Besonders effizient ist das, wenn Molekülbewegungen Frequenzanteile nahe der Larmor-Frequenz haben (z. B. mittelgroße Moleküle wie Fett) – reines Wasser (zu schnell) und Festkörper (zu langsam) relaxieren langsam.',
  },
  {
    id: 'rx-order',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Welche Reihenfolge der Zeitkonstanten gilt für jedes Gewebe?',
    options: ['$T_2^* \\le T_2 \\le T_1$', '$T_1 \\le T_2 \\le T_2^*$', '$T_2 \\le T_2^* \\le T_1$', 'Keine feste Reihenfolge'],
    answer: 0,
    explanation:
      'Jeder T1-Prozess zerstört auch Phasenkohärenz (T2 ≤ T1, im Grenzfall reinen Wassers gleich). Feldinhomogenitäten fügen weitere Dephasierung hinzu, daher T2* ≤ T2.',
  },
  {
    id: 'rx-field',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Wie verändern sich typische Gewebe-T1-Zeiten beim Wechsel von 1,5 T auf 3 T?',
    options: [
      'T1 wird länger (ca. 20–40 %), T2 bleibt ähnlich bzw. sinkt leicht.',
      'T1 halbiert sich, da die Larmor-Frequenz doppelt so hoch ist.',
      'T1 und T2 bleiben exakt gleich, Relaxation ist feldunabhängig.',
      'T2 verdoppelt sich, T1 bleibt gleich.',
    ],
    answer: 0,
    explanation:
      'Bei höherer Larmor-Frequenz gibt es weniger Molekülbewegungen mit passender Frequenz → ineffizientere Energieabgabe → längeres T1. Für T1w-Sequenzen bei 3 T muss TR daher angepasst werden; T1-verkürzende Kontrastmittel wirken relativ stärker.',
  },
  {
    id: 'rx-t2w',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Welche Parameterkombination eines Spin-Echos erzeugt eine T2-Wichtung?',
    options: ['Langes TR, langes TE', 'Kurzes TR, kurzes TE', 'Langes TR, kurzes TE', 'Kurzes TR, langes TE'],
    answer: 0,
    explanation:
      'Langes TR (≥ 2000 ms) lässt alle Gewebe vollständig T1-relaxieren → T1-Unterschiede verschwinden. Langes TE (≈ 80–120 ms) lässt T2-Unterschiede wirken. Kurz/kurz = T1w, lang/kurz = PDw, kurz/lang = kaum Signal und gemischter Kontrast.',
  },
  {
    id: 'rx-t1w-appearance',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Wie erscheinen Fett und Liquor in einem T1-gewichteten Spin-Echo?',
    options: ['Fett hell, Liquor dunkel', 'Fett dunkel, Liquor hell', 'Beide hell', 'Beide dunkel'],
    answer: 0,
    explanation:
      'Fett hat das kürzeste T1 (≈ 260 ms bei 1,5 T) und ist bei kurzem TR schon weitgehend relaxiert → hell. Liquor (T1 ≈ 4 s) hat kaum Längsmagnetisierung zurückgewonnen → dunkel.',
  },
  {
    id: 'rx-spin-echo',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum entsteht nach einem 180°-Puls zur Zeit TE/2 ein Spin-Echo zur Zeit TE?',
    options: [
      'Der Puls spiegelt die Phasen: Spins, die durch statische Feldunterschiede vorausgeeilt sind, liegen danach zurück und holen bis TE exakt auf.',
      'Der 180°-Puls kehrt die T2-Relaxation um.',
      'Der 180°-Puls erhöht die Längsmagnetisierung, die dann in die Querebene kippt.',
      'Das Echo entsteht, weil der Gradient seine Polarität umkehrt.',
    ],
    answer: 0,
    explanation:
      'Statische Off-Resonanzen (Inhomogenität, Suszeptibilität, chemische Verschiebung) werden refokussiert – die Echoamplitude folgt daher e^(−TE/T2), nicht e^(−TE/T2*). Irreversible Spin-Spin-Fluktuationen werden nicht refokussiert. Das Gradientenecho (Gradientenumkehr) refokussiert dagegen nur die Gradientendephasierung.',
  },
  {
    id: 'rx-bloch',
    kind: 'mc',
    difficulty: 3,
    prompt: 'Welche Gleichung beschreibt die Längskomponente der Bloch-Gleichungen (ohne HF, im Laborsystem)?',
    options: [
      '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z - M_0}{T_1}$',
      '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z}{T_2}$',
      '$\\dfrac{dM_z}{dt} = \\gamma B_0 M_z$',
      '$\\dfrac{dM_z}{dt} = -\\dfrac{M_0}{T_1}$',
    ],
    answer: 0,
    explanation:
      'Die Bloch-Gleichung dM/dt = γ M × B − (M_x x̂ + M_y ŷ)/T2 − (M_z − M₀) ẑ/T1 liefert für die z-Komponente eine Relaxation zum Gleichgewicht M₀, Lösung M_z(t) = M₀ + (M_z(0) − M₀)·e^(−t/T1).',
  },
  {
    id: 'rx-multi-contrast',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Welche Aussagen zu Gewebekontrasten bei 1,5 T sind korrekt? (Mehrfachauswahl)',
    options: [
      'Freies Wasser (Liquor, Ödem) hat lange T1- und T2-Zeiten.',
      'Weiße Substanz hat ein kürzeres T1 als graue Substanz (Myelin).',
      'Muskel hat ein besonders langes T2 und ist daher in T2w hell.',
      'Gadolinium-Kontrastmittel verkürzen vor allem T1 und machen anreicherndes Gewebe in T1w hell.',
    ],
    answers: [0, 1, 3],
    explanation:
      'Muskel hat ein kurzes T2 (≈ 40–50 ms) und ist in T2w dunkel. Myelin verkürzt das T1 der weißen Substanz → WM erscheint in T1w heller als GM. Gd³⁺ (7 ungepaarte Elektronen) beschleunigt die Relaxation benachbarter Wasserprotonen.',
  },
];
