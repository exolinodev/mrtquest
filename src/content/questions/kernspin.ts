import { NUCLEI } from '../../physics/constants';
import { larmorMHz, spinExcess, zeemanEnergy } from '../../physics/mri';
import { n, pick, type QuestionSource } from './types';

export const kernspinQuestions: QuestionSource[] = [
  {
    id: 'ks-larmor-h',
    generate: (rng) => {
      const b0 = pick(rng, [0.55, 1, 1.5, 3, 7]);
      return {
        kind: 'numeric',
        id: 'ks-larmor-h',
        difficulty: 1,
        prompt: `Berechne die Larmor-Frequenz von Protonen (¹H, $\\bar\\gamma = 42{,}577$ MHz/T) bei $B_0 = ${n(b0)}$ T.`,
        answer: larmorMHz(b0),
        tolerance: 0.01,
        unit: 'MHz',
        hint: 'Larmor-Gleichung: $f_0 = \\bar\\gamma \\cdot B_0$.',
        explanation: `$f_0 = 42{,}577\\,\\text{MHz/T} \\cdot ${n(b0)}\\,\\text{T} = ${n(larmorMHz(b0))}$ MHz – das liegt im UKW-Rundfunkbereich, deshalb braucht der Scanner einen Faradaykäfig.`,
      };
    },
  },
  {
    id: 'ks-larmor-x',
    generate: (rng) => {
      const nuc = pick(
        rng,
        NUCLEI.filter((x) => x.id !== 'H1'),
      );
      const b0 = pick(rng, [1.5, 3, 7]);
      return {
        kind: 'numeric',
        id: 'ks-larmor-x',
        difficulty: 2,
        prompt: `Für eine Spektroskopie-Messung soll ${nuc.label} bei ${n(b0)} T angeregt werden ($\\bar\\gamma = ${n(nuc.gammaBar, 3)}$ MHz/T). Auf welche Frequenz muss die HF-Spule abgestimmt sein?`,
        answer: larmorMHz(b0, nuc.gammaBar),
        tolerance: 0.01,
        unit: 'MHz',
        hint: 'Jeder Kern hat sein eigenes gyromagnetisches Verhältnis – Spulen sind deshalb kernspezifisch abgestimmt.',
        explanation: `$f_0 = ${n(nuc.gammaBar, 3)} \\cdot ${n(b0)} = ${n(larmorMHz(b0, nuc.gammaBar))}$ MHz. Für X-Kern-Bildgebung sind eigene (doppelt abgestimmte) Spulen und Breitband-Sender nötig.`,
      };
    },
  },
  {
    id: 'ks-field-from-f',
    generate: (rng) => {
      const b0 = pick(rng, [0.35, 0.5, 1, 1.2, 2, 4.7, 9.4]);
      const f = larmorMHz(b0);
      return {
        kind: 'numeric',
        id: 'ks-field-from-f',
        difficulty: 1,
        prompt: `Ein Scanner zeigt im Justageprotokoll eine Protonen-Mittenfrequenz von ${n(f, 3)} MHz. Welche Feldstärke hat der Magnet?`,
        answer: b0,
        tolerance: 0.01,
        unit: 'T',
        explanation: `$B_0 = f_0/\\bar\\gamma = ${n(f, 3)} / 42{,}577 \\approx ${n(b0)}$ T. Der Scanner bestimmt die exakte Mittenfrequenz vor jeder Untersuchung neu, da B₀ minimal driftet und der Patient das Feld verändert.`,
      };
    },
  },
  {
    id: 'ks-flip',
    generate: (rng) => {
      const b1 = pick(rng, [2.94, 5.87, 11.74, 4.4, 7.34]);
      const tau = pick(rng, [0.5, 1, 2]);
      const flip = 360 * 42.577e6 * b1 * 1e-6 * tau * 1e-3;
      return {
        kind: 'numeric',
        id: 'ks-flip',
        difficulty: 3,
        prompt: `Ein rechteckiger HF-Puls mit $B_1 = ${n(b1)}$ µT wird für ${n(tau)} ms eingestrahlt. Welcher Flipwinkel ergibt sich für Protonen?`,
        answer: flip,
        tolerance: 0.02,
        unit: '°',
        hint: 'Im rotierenden Bezugssystem präzediert M um B₁: $\\alpha = \\gamma B_1 \\tau = 360° \\cdot \\bar\\gamma B_1 \\tau$.',
        explanation: `$\\alpha = 360° \\cdot 42{,}577\\cdot10^6\\,\\text{Hz/T} \\cdot ${n(b1)}\\cdot10^{-6}\\,\\text{T} \\cdot ${n(tau)}\\cdot10^{-3}\\,\\text{s} \\approx ${n(flip, 1)}°$. B₁ ist rund fünf Größenordnungen schwächer als B₀ – nur durch Resonanz wirkt es dennoch.`,
      };
    },
  },
  {
    id: 'ks-excess',
    generate: (rng) => {
      const b0 = pick(rng, [1.5, 3, 7]);
      const ppm = spinExcess(b0) * 1e6;
      return {
        kind: 'numeric',
        id: 'ks-excess',
        difficulty: 3,
        prompt: `Schätze den relativen Spinüberschuss $\\Delta N/N \\approx h f_0 /(2kT)$ für Protonen bei ${n(b0)} T und Körpertemperatur (310 K). Angabe in ppm (Teile pro Million).`,
        answer: ppm,
        tolerance: 0.05,
        unit: 'ppm',
        hint: '$h = 6{,}626\\cdot10^{-34}$ J·s, $k = 1{,}381\\cdot10^{-23}$ J/K.',
        explanation: `$\\Delta E = h f_0 = ${n(zeemanEnergy(b0) * 1e26, 2)}\\cdot10^{-26}$ J; $\\Delta E/(2kT) \\approx ${n(ppm, 2)}$ ppm. Nur wenige Protonen pro Million tragen netto zur Magnetisierung bei – dass MRT trotzdem funktioniert, liegt an der enormen Anzahl (~10²² Protonen pro cm³ Wasser). Der Überschuss wächst linear mit B₀ → höheres SNR bei 3 T.`,
      };
    },
  },
  {
    id: 'ks-energy',
    kind: 'numeric',
    difficulty: 2,
    prompt: 'Wie groß ist die Energiedifferenz $\\Delta E$ zwischen den beiden Spinzuständen eines Protons bei 3 T? Gib das Ergebnis in Einheiten von $10^{-26}$ J an.',
    answer: zeemanEnergy(3) * 1e26,
    tolerance: 0.02,
    unit: '×10⁻²⁶ J',
    hint: '$\\Delta E = h\\,f_0 = h\\,\\bar\\gamma\\,B_0$',
    explanation: `$\\Delta E = 6{,}626\\cdot10^{-34} \\cdot 127{,}7\\cdot10^{6} \\approx ${n(zeemanEnergy(3) * 1e26, 2)}\\cdot10^{-26}$ J – rund 10⁶-mal kleiner als die thermische Energie kT ≈ 4,3·10⁻²¹ J. Daher der winzige Spinüberschuss.`,
  },
  {
    id: 'ks-why-h',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Warum basiert die klinische MRT fast ausschließlich auf dem Wasserstoffkern ¹H?',
    options: [
      'Er hat das größte gyromagnetische Verhältnis der stabilen Kerne und kommt in Wasser und Fett in sehr hoher Konzentration vor.',
      'Er ist der einzige Kern mit Spin ≠ 0.',
      'Er besitzt eine gerade Anzahl an Nukleonen und daher ein großes magnetisches Moment.',
      'Seine Larmor-Frequenz liegt im Mikrowellenbereich und ist deshalb leicht messbar.',
    ],
    answer: 0,
    explanation:
      'Signal ∝ Spindichte · γ³ (Moment, Polarisation und Induktion skalieren jeweils mit γ). ¹H hat γ̄ = 42,58 MHz/T und ~110 mol/L Konzentration im Gewebe. Kerne mit gerader Protonen- und Neutronenzahl (z. B. ¹²C, ¹⁶O) haben Spin 0 und sind MR-unsichtbar.',
  },
  {
    id: 'ks-double',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Was passiert, wenn man $B_0$ von 1,5 T auf 3 T verdoppelt (alles andere gleich)?',
    options: [
      'Larmor-Frequenz und Spinüberschuss verdoppeln sich; das SNR steigt grob um den Faktor 2.',
      'Die Larmor-Frequenz verdoppelt sich, der Spinüberschuss bleibt gleich.',
      'Die Larmor-Frequenz vervierfacht sich, da ω ∝ B₀².',
      'Nur T2 verdoppelt sich, alle anderen Größen bleiben konstant.',
    ],
    answer: 0,
    explanation:
      'f₀ = γ̄B₀ und ΔN/N ≈ γħB₀/(2kT) sind beide linear in B₀. Das SNR steigt in der Praxis etwa linear (nicht ganz 2×, da T1 länger wird und SAR-Limits greifen). Gleichzeitig vervierfacht sich das SAR (∝ B₀²) und die chemische Verschiebung in Hz verdoppelt sich.',
  },
  {
    id: 'ks-90pulse',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Was bewirkt ein resonanter 90°-HF-Puls auf die Nettomagnetisierung $\\vec M$?',
    options: [
      'Er kippt $\\vec M$ vollständig in die Transversalebene: $M_z = 0$, $M_{\\text{xy}} = M_0$, und die Spins präzedieren phasenkohärent.',
      'Er verdoppelt die Längsmagnetisierung $M_z$.',
      'Er invertiert $\\vec M$ auf $-M_0$ entlang z.',
      'Er stoppt die Präzession der Spins für die Dauer der Messung.',
    ],
    answer: 0,
    explanation:
      'Im rotierenden Bezugssystem steht B₁ still, M rotiert um B₁ um α = γB₁τ. Nach 90° liegt die gesamte Magnetisierung in der xy-Ebene und induziert als rotierender Magnet eine Spannung in der Empfangsspule (FID). Ein 180°-Puls invertiert dagegen M.',
  },
  {
    id: 'ks-resonance',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum muss das HF-Feld $B_1$ exakt mit der Larmor-Frequenz rotieren?',
    options: [
      'Nur dann ruht B₁ im mitrotierenden Bezugssystem der Spins und kann M kumulativ auskippen; bei Fehlabstimmung bleibt ein effektives Feld entlang z übrig.',
      'Weil sonst die Gradientenspulen überhitzen.',
      'Weil die Larmor-Frequenz die Abtastrate des Analog-Digital-Wandlers festlegt.',
      'Weil B₁ andernfalls B₀ verstärkt und den Magneten quenchen würde.',
    ],
    answer: 0,
    explanation:
      'Im rotierenden System mit Frequenz ω_RF wirkt das effektive Feld B_eff = (B₀ − ω_RF/γ)·ẑ + B₁·x̂. Nur bei ω_RF = ω₀ verschwindet die z-Komponente und M kippt vollständig. Das ist auch die Grundlage der schichtselektiven Anregung.',
  },
  {
    id: 'ks-gamma-def',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Was beschreibt das gyromagnetische Verhältnis γ?',
    options: [
      'Das Verhältnis von magnetischem Moment zu Drehimpuls (Spin) eines Teilchens.',
      'Das Verhältnis von Längs- zu Querrelaxationszeit.',
      'Das Verhältnis von HF-Leistung zu Körpermasse.',
      'Das Verhältnis von Gradientenstärke zu Schichtdicke.',
    ],
    answer: 0,
    explanation: 'μ = γ·S. Daraus folgt direkt die Präzessionsfrequenz ω₀ = γB₀. Für Protonen ist γ = 2,675·10⁸ rad/(s·T), also γ̄ = γ/2π = 42,58 MHz/T.',
  },
  {
    id: 'ks-multi-precession',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Welche Aussagen über Spins im statischen Magnetfeld sind korrekt? (Mehrfachauswahl)',
    options: [
      'Die Präzessionsfrequenz ist proportional zu B₀.',
      'Ohne Anregung sind die Präzessionsphasen der Spins zufällig verteilt – es gibt keine messbare Quermagnetisierung.',
      'Alle Spins richten sich exakt parallel zu B₀ aus.',
      'Die makroskopische Längsmagnetisierung M₀ entsteht durch den kleinen thermischen Besetzungsüberschuss des energieärmeren Zustands.',
      'Die Längsmagnetisierung M₀ erzeugt in einer Empfangsspule ein messbares Wechselspannungssignal.',
    ],
    answers: [0, 1, 3],
    explanation:
      'Spins nehmen keine „exakte“ Ausrichtung ein; nur der Mittelwert ergibt M₀ ∥ B₀. Ein statisches M_z ändert den Fluss durch die Spule nicht und induziert daher keine Spannung – messbar ist nur rotierende Quermagnetisierung.',
  },
  {
    id: 'ks-boltzmann-temp',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Wie ändert sich die Gleichgewichtsmagnetisierung $M_0$ mit der Temperatur (Curie-Gesetz)?',
    options: ['$M_0 \\propto B_0 / T$', '$M_0 \\propto B_0 \\cdot T$', '$M_0 \\propto T / B_0$', '$M_0$ ist temperaturunabhängig'],
    answer: 0,
    explanation: 'Curie-Gesetz: M₀ = Nγ²ħ²B₀/(4kT). Kühlere Proben polarisieren stärker – deshalb funktioniert auch Hyperpolarisation (z. B. ¹²⁹Xe, ¹³C), die den Überschuss künstlich um Faktor 10⁴–10⁵ erhöht.',
  },
];
