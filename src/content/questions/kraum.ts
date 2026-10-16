import { deltaK, kMax } from '../../physics/mri';
import { n, pick, type QuestionSource } from './types';

export const kraumQuestions: QuestionSource[] = [
  {
    id: 'kr-deltak',
    generate: (rng) => {
      const fov = pick(rng, [160, 200, 250, 320, 400]);
      return {
        kind: 'numeric',
        id: 'kr-deltak',
        difficulty: 1,
        prompt: `Wie groß ist der Abstand $\\Delta k$ zweier benachbarter k-Raum-Punkte bei einem FOV von ${fov} mm?`,
        answer: deltaK(fov),
        tolerance: 0.01,
        unit: '1/m',
        hint: 'Das FOV ist der Kehrwert der k-Raum-Schrittweite.',
        explanation: `$\\Delta k = 1/FOV = 1/${n(fov / 1000, 3)}\\,\\text{m} = ${n(deltaK(fov), 2)}$ m⁻¹. Wird Δk größer (gröbere Abtastung), wird das FOV kleiner → Einfaltung.`,
      };
    },
  },
  {
    id: 'kr-kmax',
    generate: (rng) => {
      const fov = pick(rng, [200, 240, 256]);
      const N = pick(rng, [128, 256, 512]);
      return {
        kind: 'numeric',
        id: 'kr-kmax',
        difficulty: 2,
        prompt: `FOV ${fov} mm, Matrix ${N}. Welche maximale Ortsfrequenz $k_{\\text{max}}$ wird abgetastet?`,
        answer: kMax(fov, N),
        tolerance: 0.01,
        unit: '1/m',
        hint: '$k_{\\text{max}} = N\\,\\Delta k / 2$ und $\\Delta x = 1/(2k_{\\text{max}})$.',
        explanation: `$k_{\\text{max}} = N/(2\\,FOV) = ${N}/(2 \\cdot ${n(fov / 1000, 3)}) = ${n(kMax(fov, N), 1)}$ m⁻¹. Daraus folgt die Pixelgröße $\\Delta x = 1/(2k_{\\text{max}}) = ${n(fov / N, 3)}$ mm.`,
      };
    },
  },
  {
    id: 'kr-kpos',
    generate: (rng) => {
      const g = pick(rng, [5, 10, 20, 25]);
      const t = pick(rng, [0.5, 1, 2]);
      const k = 42.577e6 * g * 1e-3 * t * 1e-3;
      return {
        kind: 'numeric',
        id: 'kr-kpos',
        difficulty: 2,
        prompt: `Ein Gradient von ${g} mT/m wird für ${n(t)} ms geschaltet. Welche k-Raum-Position (ausgehend von k = 0) wird erreicht?`,
        answer: k,
        tolerance: 0.02,
        unit: '1/m',
        hint: '$k(t) = \\bar\\gamma \\int_0^t G(\\tau)\\,d\\tau$ – die Gradientenfläche zählt.',
        explanation: `$k = \\bar\\gamma\\,G\\,t = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} \\cdot ${n(t)}\\cdot10^{-3} = ${n(k, 1)}$ m⁻¹. Gradientenfläche ⇔ Position im k-Raum: Dieselbe Fläche mit halbem Gradienten und doppelter Zeit führt zum selben Punkt.`,
      };
    },
  },
  {
    id: 'kr-partial',
    generate: (rng) => {
      const ny = pick(rng, [256, 320, 384]);
      const frac = pick(rng, [5 / 8, 6 / 8, 7 / 8]);
      const tr = pick(rng, [500, 600, 800]);
      const t = (tr * ny * frac) / 1000;
      return {
        kind: 'numeric',
        id: 'kr-partial',
        difficulty: 2,
        prompt: `Ein SE mit TR = ${tr} ms und ${ny} Phasenkodierschritten wird mit Partial Fourier ${n(frac * 8, 0)}/8 in Phasenrichtung gemessen. Wie lange dauert die Messung (NEX = 1)?`,
        answer: t,
        tolerance: 0.02,
        unit: 's',
        explanation: `Nur ${n(frac * ny, 0)} von ${ny} Zeilen werden gemessen: TA = ${tr} ms · ${n(frac * ny, 0)} = ${n(t, 1)} s. Die fehlenden Zeilen werden über die hermitesche Symmetrie $S(-k) = S^*(k)$ ergänzt – auf Kosten von SNR (∝ √Anzahl Zeilen).`,
      };
    },
  },
  {
    id: 'kr-center',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Welche Bildinformation steckt im Zentrum des k-Raums?',
    options: [
      'Der Großteil der Signalenergie: Bildkontrast und grobe Strukturen (niedrige Ortsfrequenzen).',
      'Ausschließlich die Kanten und feinen Details.',
      'Die Pixel in der Bildmitte.',
      'Nur das Rauschen.',
    ],
    answer: 0,
    explanation:
      'Jeder k-Raum-Punkt ist eine Ortsfrequenz, die über das gesamte Bild verteilt ist. Niedrige Frequenzen (Zentrum) bestimmen Kontrast und Helligkeit, die Peripherie liefert Kanten und Auflösung. Deshalb wird in TSE das Echo mit dem gewünschten TE ins k-Raum-Zentrum gelegt.',
  },
  {
    id: 'kr-point',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Was entspricht im Bildraum einem einzelnen von null verschiedenen k-Raum-Punkt (abseits des Zentrums)?',
    options: [
      'Ein Streifenmuster (ebene Welle), das das gesamte Bild überzieht – Richtung und Frequenz durch die k-Position bestimmt.',
      'Ein einzelner heller Pixel.',
      'Ein heller Kreis in der Bildmitte.',
      'Ein vollständig schwarzes Bild.',
    ],
    answer: 0,
    explanation:
      'Die inverse Fourier-Transformation eines Delta-Peaks ist eine komplexe Exponentialwelle e^(i2π(k_x x + k_y y)). Deshalb erzeugt ein einzelner Datenfehler (Spike) ein Streifen-/Fischgrätmuster über das ganze Bild.',
  },
  {
    id: 'kr-skip',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Was passiert, wenn man in Phasenrichtung nur jede zweite k-Raum-Zeile misst (bei gleichem k_max)?',
    options: [
      'Δk verdoppelt sich → das FOV halbiert sich und Bildanteile außerhalb falten ein (Aliasing). Parallele Bildgebung entfaltet dies mit Spulensensitivitäten.',
      'Die Auflösung halbiert sich, das FOV bleibt gleich.',
      'Das Bild wird doppelt so hell.',
      'Es passiert nichts, da der k-Raum symmetrisch ist.',
    ],
    answer: 0,
    explanation: 'FOV = 1/Δk. Genau dieses Prinzip nutzen SENSE/GRAPPA: gezielte Unterabtastung (Faktor R) und Rekonstruktion mit Mehrkanal-Spuleninformationen.',
  },
  {
    id: 'kr-gibbs',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Welches Artefakt entsteht durch das abrupte Abschneiden des k-Raums bei kleiner Matrix?',
    options: [
      'Gibbs-/Trunkationsartefakt: parallele Überschwinger („Ringing“) an kontrastreichen Kanten.',
      'Chemical-Shift-Artefakt.',
      'Zipper-Artefakt.',
      'Suszeptibilitätsartefakt.',
    ],
    answer: 0,
    explanation:
      'Die Rekonstruktion entspricht einer Faltung mit einem sinc. An scharfen Kanten (z. B. Liquor–Rückenmark) entstehen Überschwinger von ≈ 9 %, die eine Syrinx vortäuschen können. Abhilfe: größere Matrix oder Filterung (Hanning/Hamming-Fenster).',
  },
  {
    id: 'kr-spike',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Ein einzelner fehlerhafter Datenpunkt („Spike“, z. B. durch elektrostatische Entladung) im k-Raum führt im Bild zu …',
    options: ['einem über das ganze Bild verteilten Streifen-/Fischgrätmuster.', 'einem schwarzen Punkt an einer Stelle.', 'einer Einfaltung.', 'einer Verdopplung des SNR.'],
    answer: 0,
    explanation: 'Siehe Basiswelle eines k-Raum-Punktes. Die Ausrichtung der Streifen verrät die k-Position des Spikes.',
  },
  {
    id: 'kr-trajectories',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Welche k-Raum-Trajektorien werden in der klinischen MRT verwendet? (Mehrfachauswahl)',
    options: ['Kartesisch, zeilenweise', 'Radial (Speichen)', 'Spiral', 'EPI-Mäander (Zick-Zack)', 'Zufällig ohne Gradienten'],
    answers: [0, 1, 2, 3],
    explanation:
      'Ohne Gradienten bewegt man sich nicht im k-Raum. Radiale und spirale Trajektorien tasten das Zentrum mehrfach ab (bewegungsrobust), erfordern aber Regridding vor der FFT. Kompressed Sensing nutzt pseudozufällige Unterabtastung – aber natürlich trotzdem mit Gradienten.',
  },
  {
    id: 'kr-tse-order',
    kind: 'mc',
    difficulty: 3,
    prompt: 'In einer TSE mit ETL 16 und effektivem TE = 100 ms (ESP 12,5 ms): Welche Echos werden ins k-Raum-Zentrum sortiert?',
    options: [
      'Das 8. Echo (≈ 100 ms) – die äußeren Zeilen werden mit früheren bzw. späteren Echos gefüllt.',
      'Das 1. Echo, da es das meiste Signal hat.',
      'Das 16. Echo, da es die stärkste T2-Gewichtung trägt.',
      'Alle Echos werden gemittelt ins Zentrum geschrieben.',
    ],
    answer: 0,
    explanation:
      'Kontrast entsteht im k-Raum-Zentrum → TE_eff = Echo-Nummer · ESP = 8 · 12,5 ms. Unterschiedliche T2-Gewichtung der äußeren Zeilen wirkt wie ein k-Raum-Filter → Kantenunschärfe (Blurring) bei kurzem T2.',
  },
  {
    id: 'kr-hermitian',
    kind: 'mc',
    difficulty: 3,
    prompt: 'Welche Eigenschaft des k-Raums nutzt Partial-Fourier-Bildgebung (Half-Fourier) aus?',
    options: [
      'Für reellwertige Bilder gilt Hermitesche Symmetrie: $S(-k) = S^*(k)$ – eine Hälfte lässt sich (mit Phasenkorrektur) aus der anderen berechnen.',
      'Der k-Raum ist punktsymmetrisch zu $k_{\\text{max}}$.',
      'Die Peripherie des k-Raums ist immer null.',
      'Die FFT ist linear und daher umkehrbar.',
    ],
    answer: 0,
    explanation:
      'Reale Bilder sind durch B₀-Inhomogenitäten nicht exakt reell; daher misst man etwas mehr als die Hälfte (z. B. 5/8), schätzt aus dem symmetrischen Zentrum die Phase und rekonstruiert mit POCS oder Homodyne-Verfahren. HASTE nutzt dies für Single-Shot-TSE.',
  },
];
