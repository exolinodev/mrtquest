import { TISSUES } from '../../physics/constants';
import { ernstAngleDeg, fatWaterPhaseTimes, nullPointTI, scanTimeSeconds } from '../../physics/mri';
import { n, pick, type QuestionSource } from './types';

export const sequenzenQuestions: QuestionSource[] = [
  {
    id: 'sq-ta',
    generate: (rng) => {
      const tr = pick(rng, [3000, 4000, 5000]);
      const ny = pick(rng, [256, 320, 384]);
      const nex = pick(rng, [1, 2]);
      const etl = pick(rng, [8, 12, 16, 24]);
      const ta = scanTimeSeconds(tr, ny, nex, etl);
      return {
        kind: 'numeric',
        id: 'sq-ta',
        difficulty: 1,
        prompt: `Berechne die Messzeit einer 2D-TSE: TR = ${tr} ms, ${ny} Phasenkodierschritte, NEX = ${nex}, Echozuglänge (ETL) = ${etl}.`,
        answer: ta,
        tolerance: 0.02,
        unit: 's',
        hint: '$TA = TR \\cdot N_{\\text{PE}} \\cdot NEX / ETL$',
        explanation: `TA = ${tr / 1000} s · ${ny} · ${nex} / ${etl} = ${n(ta, 1)} s. Gegenüber einem SE (ETL = 1) ist die TSE ${etl}-mal schneller.`,
      };
    },
  },
  {
    id: 'sq-stir',
    generate: (rng) => {
      const field = pick(rng, [1.5, 3] as const);
      const t1 = TISSUES.fat.params[field].t1;
      const ti = t1 * Math.LN2;
      return {
        kind: 'numeric',
        id: 'sq-stir',
        difficulty: 2,
        prompt: `Fett hat bei ${n(field)} T ein T1 von ${t1} ms. Welche Inversionszeit nullt das Fettsignal in einer STIR (Näherung TR ≫ T1)?`,
        answer: ti,
        tolerance: 0.03,
        unit: 'ms',
        hint: 'Am Nulldurchgang gilt $M_z = M_0(1 - 2e^{-TI/T_1}) = 0$.',
        explanation: `$TI = T_1 \\ln 2 = ${t1} \\cdot 0{,}693 = ${n(ti, 0)}$ ms. Weil die Feldstärke T1 verlängert, ist die STIR-TI bei 3 T länger als bei 1,5 T.`,
      };
    },
  },
  {
    id: 'sq-flair',
    generate: (rng) => {
      const tr = pick(rng, [6000, 8000, 9000, 10000]);
      const t1 = TISSUES.csf.params[1.5].t1;
      const ti = nullPointTI(t1, tr);
      return {
        kind: 'numeric',
        id: 'sq-flair',
        difficulty: 3,
        prompt: `FLAIR bei 1,5 T: Liquor-T1 = ${t1} ms, TR = ${tr} ms. Bei welcher TI wird Liquor genullt? (Berücksichtige das endliche TR.)`,
        answer: ti,
        tolerance: 0.03,
        unit: 'ms',
        hint: 'Mit endlichem TR: $M_z(TI) = 1 - 2e^{-TI/T_1} + e^{-TR/T_1} = 0$.',
        explanation: `$TI = T_1 \\ln\\big(2/(1 + e^{-TR/T_1})\\big) = ${t1}\\cdot\\ln(2/${n(1 + Math.exp(-tr / t1), 3)}) = ${n(ti, 0)}$ ms. Bei TR → ∞ wären es ${n(t1 * Math.LN2, 0)} ms.`,
      };
    },
  },
  {
    id: 'sq-ernst',
    generate: (rng) => {
      const tr = pick(rng, [10, 30, 100, 200, 500]);
      const tid = pick(rng, ['wm', 'gm', 'liver', 'fat'] as const);
      const t1 = TISSUES[tid].params[1.5].t1;
      const a = ernstAngleDeg(tr, t1);
      return {
        kind: 'numeric',
        id: 'sq-ernst',
        difficulty: 2,
        prompt: `Gespoiltes GRE mit TR = ${tr} ms. Bei welchem Flipwinkel wird das Signal von ${TISSUES[tid].label} (T1 = ${t1} ms) maximal?`,
        answer: a,
        tolerance: 0.03,
        unit: '°',
        hint: 'Ernst-Winkel: $\\cos\\alpha_E = e^{-TR/T_1}$',
        explanation: `$\\alpha_E = \\arccos(e^{-${tr}/${t1}}) = ${n(a, 1)}°$. Je kürzer TR relativ zu T1, desto kleiner der optimale Flipwinkel.`,
      };
    },
  },
  {
    id: 'sq-opposed',
    generate: (rng) => {
      const field = pick(rng, [1.5, 3] as const);
      const t = fatWaterPhaseTimes(field);
      const which = pick(rng, ['opposed', 'inPhase'] as const);
      return {
        kind: 'numeric',
        id: 'sq-opposed',
        difficulty: 3,
        prompt: `Für eine Chemical-Shift-Bildgebung (Dixon) bei ${n(field)} T: Nach welcher kürzesten Echozeit stehen Fett- und Wassersignal ${which === 'opposed' ? 'gegenphasig (opposed phase)' : 'wieder in Phase (in phase, nach der ersten Gegenphase)'}? (Δ = 3,5 ppm)`,
        answer: t[which],
        tolerance: 0.04,
        unit: 'ms',
        hint: 'Frequenzdifferenz $\\Delta f = 3{,}5\\,\\text{ppm} \\cdot f_0$; eine volle Periode ist $1/\\Delta f$.',
        explanation: `$\\Delta f = 3{,}5\\cdot10^{-6}\\cdot ${n(42.577 * field, 2)}$ MHz $= ${n(1000 / t.inPhase, 0)}$ Hz → Periode ${n(t.inPhase, 2)} ms. Gegenphase nach der halben Periode (${n(t.opposed, 2)} ms). Im Opposed-Phase-Bild verlieren Voxel mit Fett-Wasser-Gemisch Signal (z. B. Leberverfettung, Nebennierenadenom).`,
      };
    },
  },
  {
    id: 'sq-180',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Was unterscheidet ein Gradientenecho (GRE) grundsätzlich von einem Spin-Echo (SE)?',
    options: [
      'GRE verzichtet auf den 180°-Refokussierungspuls; das Echo entsteht nur durch Gradientenumkehr, daher T2*- statt T2-Abklingen.',
      'GRE verwendet zwei 180°-Pulse und ist deshalb T1-unempfindlich.',
      'GRE arbeitet ohne Auslesegradienten.',
      'Im GRE ist TR grundsätzlich länger als im SE.',
    ],
    answer: 0,
    explanation:
      'Ohne 180°-Puls werden statische Inhomogenitäten nicht refokussiert → empfindlich für Suszeptibilität (Blutungen, Verkalkungen, Metall), aber sehr kurze TR und kleine Flipwinkel möglich → schnell, geringes SAR.',
  },
  {
    id: 'sq-tse-cons',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Welche Eigenschaften hat eine TSE (Fast Spin Echo) im Vergleich zum konventionellen SE? (Mehrfachauswahl)',
    options: [
      'Deutlich kürzere Messzeit (Faktor ETL).',
      'Höheres SAR durch viele 180°-Pulse pro TR.',
      'Fett erscheint heller (Aufhebung der J-Kopplung).',
      'Geringere Anzahl an Schichten pro TR bei langem Echozug.',
      'Stärkere Empfindlichkeit für Suszeptibilitätsartefakte als GRE.',
    ],
    answers: [0, 1, 2, 3],
    explanation:
      'Die schnelle Folge von 180°-Pulsen refokussiert Suszeptibilitätseffekte sogar besonders gut → TSE ist robuster als GRE. Der lange Echozug belegt Zeit im TR → weniger Schichten. J-Kopplungs-Effekte werden durch kurze Echoabstände unterdrückt → Fett hell.',
  },
  {
    id: 'sq-epi',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Was charakterisiert Single-Shot-EPI?',
    options: [
      'Nach einer Anregung wird der komplette k-Raum durch einen schnell oszillierenden Auslesegradienten mit kurzen Phasen-„Blips“ abgetastet (< 100 ms).',
      'Pro TR wird genau eine k-Raum-Zeile gemessen.',
      'EPI benötigt keine Gradienten.',
      'EPI ist besonders unempfindlich gegenüber Suszeptibilität.',
    ],
    answer: 0,
    explanation:
      'EPI ist die schnellste Methode (fMRT, DWI, Perfusion). Wegen der langen Auslesedauer ist die Bandbreite in Phasenrichtung sehr klein → starke Verzerrungen und Fett-Verschiebung in Phasenrichtung, N/2-Ghosting durch Gradientenasymmetrien.',
  },
  {
    id: 'sq-flair-use',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Wofür wird die FLAIR-Sequenz klinisch vor allem eingesetzt?',
    options: [
      'Erkennung T2-heller Läsionen nahe des Liquors (z. B. MS-Herde periventrikulär, kortikal) durch Unterdrückung des Liquorsignals.',
      'Darstellung von Fettgewebe ohne Wassersignal.',
      'Messung der Diffusion.',
      'Darstellung des arteriellen Blutflusses.',
    ],
    answer: 0,
    explanation: 'FLAIR = Fluid Attenuated Inversion Recovery: lange TI (≈ 2000–2500 ms bei 1,5 T) nullt freies Wasser; ein langes TE erzeugt T2-Gewichtung.',
  },
  {
    id: 'sq-tieff',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum kann eine Inversion-Recovery mit Betragsrekonstruktion bei ungünstiger TI zu Kontrastumkehr bzw. dunklen Grenzlinien führen?',
    options: [
      'Weil negative Längsmagnetisierung (Gewebe noch nicht durch null) im Betragsbild ebenfalls hell erscheint; Voxel mit Geweben auf beiden Seiten des Nulldurchgangs löschen sich aus.',
      'Weil die Inversion das T2 umkehrt.',
      'Weil die Gradienten bei IR invertiert werden müssen.',
      'Weil der 180°-Puls die chemische Verschiebung verdoppelt.',
    ],
    answer: 0,
    explanation:
      'Betragsbild: S ∝ |M_z|. Gewebe mit langem T1 ist bei kurzer TI noch negativ, erscheint aber hell. Phasensensitive IR (PSIR) erhält das Vorzeichen und vermeidet dies.',
  },
  {
    id: 'sq-dwi',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum basiert die Diffusionsbildgebung (DWI) in der Regel auf Single-Shot-SE-EPI?',
    options: [
      'Die starken Diffusionsgradienten machen das Signal extrem bewegungsempfindlich – nur eine Auslese nach einer einzigen Anregung „friert“ makroskopische Bewegung ein.',
      'Weil EPI kein Rauschen erzeugt.',
      'Weil die Diffusion nur in GRE-Sequenzen messbar ist.',
      'Weil EPI das niedrigste SAR aller Sequenzen hat.',
    ],
    answer: 0,
    explanation:
      'Bei Multi-Shot-Verfahren erzeugen kleinste Bewegungen zwischen den Shots unterschiedliche Phasenfehler pro Zeile → Geister. Single-Shot-EPI vermeidet das. Der 180°-Puls (SE-EPI) verringert T2*-Signalverlust.',
  },
  {
    id: 'sq-psd',
    kind: 'mc',
    difficulty: 3,
    prompt: 'In einem Pulsdiagramm eines SE: Wo wird der Phasenkodiergradient typischerweise geschaltet?',
    options: [
      'Zwischen 90°-Puls und Auslese (meist vor dem 180°-Puls), mit pro TR wechselnder Amplitude – im Diagramm als „Leiter“ dargestellt.',
      'Gleichzeitig mit dem Auslesegradienten.',
      'Während des 90°-Pulses.',
      'Erst nach dem Echo.',
    ],
    answer: 0,
    explanation: 'Die Phasenkodierung muss vor der Auslese abgeschlossen sein. Ihre Amplitude ändert sich pro Wiederholung (−k_y,max … +k_y,max) – daher die Leiterdarstellung.',
  },
];
