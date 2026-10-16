import { gradientForSlice, hzPerMeter, readoutFovMm, sliceThicknessMm, slicePositionMm } from '../../physics/mri';
import { n, pick, type QuestionSource } from './types';

export const ortskodierungQuestions: QuestionSource[] = [
  {
    id: 'ok-slice',
    generate: (rng) => {
      const bw = pick(rng, [800, 1000, 1500, 2000, 3000]);
      const g = pick(rng, [5, 8, 10, 15, 20]);
      const dz = sliceThicknessMm(bw, g);
      return {
        kind: 'numeric',
        id: 'ok-slice',
        difficulty: 2,
        prompt: `Ein schichtselektiver Puls hat eine Bandbreite von ${n(bw)} Hz, der Schichtgradient beträgt ${g} mT/m. Wie dick ist die angeregte Schicht?`,
        answer: dz,
        tolerance: 0.02,
        unit: 'mm',
        hint: '$\\Delta z = \\Delta f_{\\text{RF}} / (\\bar\\gamma \\, G_s)$ – auf Einheiten achten: mT/m → T/m.',
        explanation: `$\\bar\\gamma G_s = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} = ${n(hzPerMeter(g), 0)}$ Hz/m → $\\Delta z = ${bw}/${n(hzPerMeter(g), 0)}\\,\\text{m} = ${n(dz)}$ mm.`,
      };
    },
  },
  {
    id: 'ok-gradient',
    generate: (rng) => {
      const bw = pick(rng, [1000, 1200, 2000]);
      const dz = pick(rng, [1, 2, 3, 5]);
      const g = gradientForSlice(bw, dz);
      return {
        kind: 'numeric',
        id: 'ok-gradient',
        difficulty: 2,
        prompt: `Du möchtest mit einem Puls der Bandbreite ${n(bw)} Hz eine ${dz} mm dicke Schicht anregen. Welche Schichtgradienten-Amplitude ist nötig?`,
        answer: g,
        tolerance: 0.02,
        unit: 'mT/m',
        explanation: `$G_s = \\Delta f/(\\bar\\gamma\\,\\Delta z) = ${bw} / (42{,}577\\cdot10^6 \\cdot ${dz}\\cdot10^{-3})\\,\\text{T/m} = ${n(g)}$ mT/m. Dünne Schichten stoßen an die Gradientengrenze (≈ 40–80 mT/m) – alternativ verlängert man den Puls (geringere Bandbreite).`,
      };
    },
  },
  {
    id: 'ok-delta-f',
    generate: (rng) => {
      const g = pick(rng, [2, 5, 10, 20]);
      const dx = pick(rng, [1, 5, 10, 50]);
      const df = hzPerMeter(g) * dx * 1e-3;
      return {
        kind: 'numeric',
        id: 'ok-delta-f',
        difficulty: 1,
        prompt: `Während der Auslese liegt ein Frequenzkodiergradient von ${g} mT/m an. Um wie viel Hz unterscheiden sich die Präzessionsfrequenzen zweier Protonen im Abstand von ${dx} mm?`,
        answer: df,
        tolerance: 0.02,
        unit: 'Hz',
        explanation: `$\\Delta f = \\bar\\gamma\\,G\\,\\Delta x = 42{,}577\\,\\text{MHz/T} \\cdot ${g}\\,\\text{mT/m} \\cdot ${dx}\\,\\text{mm} = ${n(df, 1)}$ Hz. Genau diese Frequenzunterschiede trennt die Fourier-Transformation in Ortspositionen auf.`,
      };
    },
  },
  {
    id: 'ok-fov',
    generate: (rng) => {
      const bw = pick(rng, [32000, 50000, 64000, 100000]);
      const g = pick(rng, [5, 8, 10, 12]);
      const fov = readoutFovMm(bw, g);
      return {
        kind: 'numeric',
        id: 'ok-fov',
        difficulty: 3,
        prompt: `Die Empfangsbandbreite beträgt insgesamt ${n(bw / 1000)} kHz (±${n(bw / 2000)} kHz), der Auslesegradient ${g} mT/m. Wie groß ist das FOV in Ausleserichtung?`,
        answer: fov,
        tolerance: 0.02,
        unit: 'mm',
        hint: 'Die gesamte Bandbreite muss genau das FOV abdecken: $BW = \\bar\\gamma\\,G_x\\,FOV$.',
        explanation: `$FOV = BW/(\\bar\\gamma G_x) = ${bw}/${n(hzPerMeter(g), 0)}\\,\\text{m} = ${n(fov, 1)}$ mm. Bei gleicher Bandbreite verkleinert ein stärkerer Gradient das FOV.`,
      };
    },
  },
  {
    id: 'ok-offset',
    generate: (rng) => {
      const g = pick(rng, [10, 15, 20]);
      const off = pick(rng, [4258, 8515, 21289, 12773]);
      const z = slicePositionMm(off, g);
      return {
        kind: 'numeric',
        id: 'ok-offset',
        difficulty: 2,
        prompt: `Bei einem Schichtgradienten von ${g} mT/m wird die Sendefrequenz um +${n(off)} Hz gegenüber der Mittenfrequenz verschoben. Wie weit vom Isozentrum liegt die angeregte Schicht?`,
        answer: z,
        tolerance: 0.02,
        unit: 'mm',
        explanation: `$z = \\Delta f_{\\text{offset}}/(\\bar\\gamma G_s) = ${off}/${n(hzPerMeter(g), 0)}\\,\\text{m} = ${n(z, 1)}$ mm. Multi-Slice-Messungen verschieben nur die Sendefrequenz – der Gradient bleibt gleich.`,
      };
    },
  },
  {
    id: 'ok-pixel',
    generate: (rng) => {
      const fov = pick(rng, [180, 220, 240, 256, 400]);
      const nmat = pick(rng, [192, 256, 320, 384, 512]);
      return {
        kind: 'numeric',
        id: 'ok-pixel',
        difficulty: 1,
        prompt: `FOV = ${fov} mm, Matrix ${nmat} in Ausleserichtung. Wie groß ist ein Pixel?`,
        answer: fov / nmat,
        tolerance: 0.01,
        unit: 'mm',
        explanation: `$\\Delta x = FOV/N = ${fov}/${nmat} = ${n(fov / nmat, 3)}$ mm. Kleinere Pixel verbessern die Auflösung, verringern aber das Voxelvolumen und damit das SNR proportional.`,
      };
    },
  },
  {
    id: 'ok-phase-repeat',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum muss die Sequenz für jede Phasenkodierzeile neu angeregt (bzw. ein neues Echo erzeugt) werden, während die Frequenzkodierung in einem Auslesevorgang gelingt?',
    options: [
      'Pro Echo wird genau ein Phasenkodierschritt (eine k-Raum-Zeile) eingeprägt; die Ortsinformation in Phasenrichtung entsteht erst aus der Serie unterschiedlicher Phasenmomente.',
      'Weil der Phasengradient nur einmal pro Sekunde geschaltet werden kann.',
      'Weil die Phasenkodierung mit Hochfrequenz statt mit Gradienten arbeitet.',
      'Weil der ADC während des Phasengradienten ausgeschaltet sein muss, um die Spule zu schützen.',
    ],
    answer: 0,
    explanation:
      'Während der Auslese durchläuft das Signal eine ganze k-Raum-Zeile (k_x variiert kontinuierlich). Die Phasenkodierung legt dagegen nur eine k_y-Position fest. N_PE verschiedene Gradientenmomente → N_PE Zeilen. Deshalb gilt TA ∝ TR·N_PE.',
  },
  {
    id: 'ok-shift-slice',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Wie verschiebt der Scanner die Position einer Schicht, ohne den Patienten zu bewegen?',
    options: [
      'Durch Änderung der Mittenfrequenz (Offset) des HF-Pulses bei gleichem Schichtgradienten.',
      'Durch Änderung der Polarität des Auslesegradienten.',
      'Durch Erhöhung der Feldstärke B₀.',
      'Durch Umschalten auf eine andere Empfangsspule.',
    ],
    answer: 0,
    explanation: 'Unter dem Gradienten hat jede z-Position ihre eigene Resonanzfrequenz. Eine Frequenzverschiebung Δf verschiebt die Schicht um Δz = Δf/(γ̄ G).',
  },
  {
    id: 'ok-thin',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Welche Maßnahmen führen zu einer dünneren Schicht? (Mehrfachauswahl)',
    options: ['Stärkerer Schichtgradient', 'Längerer HF-Puls (geringere Bandbreite)', 'Höhere Sendeleistung bei gleicher Pulsdauer', 'Größeres FOV'],
    answers: [0, 1],
    explanation:
      'Δz = Δf/(γ̄G). Die Bandbreite eines Pulses ist umgekehrt proportional zu seiner Dauer. Die Sendeleistung beeinflusst den Flipwinkel, nicht die Schichtdicke.',
  },
  {
    id: 'ok-sinc',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum verwendet man für die Schichtanregung sinc-förmige HF-Pulse?',
    options: [
      'In Kleinwinkelnäherung ist das Schichtprofil die Fourier-Transformierte der Pulshüllkurve – ein sinc erzeugt ein annähernd rechteckiges Profil.',
      'Weil sinc-Pulse die geringste SAR-Belastung aller denkbaren Pulse haben.',
      'Weil sinc-Pulse die Larmor-Frequenz erhöhen.',
      'Weil sie keine Rephasierung der Schicht benötigen.',
    ],
    answer: 0,
    explanation:
      'Ein unendlich langer sinc ergäbe ein perfektes Rechteckprofil; reale, abgeschnittene (gefensterte) sincs liefern leicht verrundete Flanken. Deshalb lässt man zwischen Schichten oft einen Abstand (Gap) bzw. misst verschachtelt, um Cross-Talk zu vermeiden.',
  },
  {
    id: 'ok-rephase',
    kind: 'mc',
    difficulty: 3,
    prompt: 'Wozu dient der kurze, umgepolte Gradientenlobus direkt nach dem Schichtselektionsgradienten?',
    options: [
      'Er rephasiert die Spins über die Schichtdicke, die während der Anregung unter dem Gradienten unterschiedlich viel Phase akkumuliert haben (ca. halbe Gradientenfläche).',
      'Er invertiert die Magnetisierung für eine Inversion Recovery.',
      'Er erzeugt die Phasenkodierung.',
      'Er kompensiert die Wirbelströme in der Kryostatwand.',
    ],
    answer: 0,
    explanation:
      'Ohne Rephasierung würde sich das Signal über die Schichtdicke weitgehend auslöschen. Die Fläche des Rephasierers entspricht etwa der Hälfte der Fläche des Schichtgradienten (ab Pulsmitte).',
  },
  {
    id: 'ok-readout-dephase',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum wird vor dem Auslesegradienten ein Dephasiergradient mit umgekehrter Polarität geschaltet?',
    options: [
      'Damit das Echo (k_x = 0) in der Mitte des Auslesefensters entsteht und der k-Raum symmetrisch von −k_max bis +k_max abgetastet wird.',
      'Um T2*-Effekte vollständig zu eliminieren.',
      'Um die Gradientenspulen zu entmagnetisieren.',
      'Um die Schichtdicke festzulegen.',
    ],
    answer: 0,
    explanation: 'Der Prephaser bewegt die k-Raum-Position nach −k_max. Unter dem Auslesegradienten läuft k_x dann durch null (Gradientenecho) bis +k_max.',
  },
];
