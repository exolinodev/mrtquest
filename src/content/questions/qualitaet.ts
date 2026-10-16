import { chemicalShiftHz, chemicalShiftPixels } from '../../physics/mri';
import { n, pick, type QuestionSource } from './types';

export const qualitaetQuestions: QuestionSource[] = [
  {
    id: 'q-nex',
    generate: (rng) => {
      const a = pick(rng, [1, 2]);
      const b = pick(rng, [4, 6, 8]);
      return {
        kind: 'numeric',
        id: 'q-nex',
        difficulty: 1,
        prompt: `Um welchen Faktor steigt das SNR, wenn die Anzahl der Mittelungen (NEX) von ${a} auf ${b} erhöht wird?`,
        answer: Math.sqrt(b / a),
        tolerance: 0.02,
        unit: '×',
        hint: 'Signal addiert sich kohärent (∝ N), Rauschen inkohärent (∝ √N).',
        explanation: `SNR ∝ √NEX → Faktor √(${b}/${a}) = ${n(Math.sqrt(b / a), 2)}. Die Messzeit steigt dabei um den Faktor ${n(b / a)} – Mittelung ist eine teure SNR-Quelle.`,
      };
    },
  },
  {
    id: 'q-voxel',
    generate: (rng) => {
      const d1 = pick(rng, [5, 4, 3]);
      const d2 = pick(rng, [2, 1.5, 1]);
      const m1 = pick(rng, [256, 320]);
      const m2 = pick(rng, [384, 512]);
      const factor = (d2 / d1) * (m1 / m2) * Math.sqrt(m2 / m1);
      return {
        kind: 'numeric',
        id: 'q-voxel',
        difficulty: 3,
        prompt: `Ein Protokoll wird von ${d1} mm auf ${d2} mm Schichtdicke und gleichzeitig in Phasenrichtung von ${m1} auf ${m2} Matrixpunkte geändert (FOV, NEX, Bandbreite, Auslesematrix unverändert). Um welchen Faktor ändert sich das SNR?`,
        answer: factor,
        tolerance: 0.03,
        unit: '×',
        hint: 'SNR ∝ Voxelvolumen · √(N_PE). Mehr Phasenzeilen verkleinern das Voxel, verlängern aber auch die Messzeit.',
        explanation: `Voxelvolumen: Faktor (${d2}/${d1})·(${m1}/${m2}) = ${n((d2 / d1) * (m1 / m2), 3)}; zusätzliche Messzeit: √(${m2}/${m1}) = ${n(Math.sqrt(m2 / m1), 3)}. Gesamt: ${n(factor, 3)}. Hohe Auflösung kostet überproportional SNR.`,
      };
    },
  },
  {
    id: 'q-bw',
    generate: (rng) => {
      const a = pick(rng, [100, 130, 200]);
      const f = pick(rng, [2, 3, 4]);
      return {
        kind: 'numeric',
        id: 'q-bw',
        difficulty: 2,
        prompt: `Die Empfangsbandbreite wird von ${a} Hz/Pixel auf ${a * f} Hz/Pixel erhöht. Um welchen Faktor ändert sich das SNR?`,
        answer: 1 / Math.sqrt(f),
        tolerance: 0.02,
        unit: '×',
        hint: 'Das Rauschen ist weiß – seine Leistung ist proportional zur erfassten Bandbreite.',
        explanation: `SNR ∝ 1/√BW → Faktor 1/√${f} = ${n(1 / Math.sqrt(f), 3)}. Dafür sinken chemische Verschiebung und Suszeptibilitätsverzerrung um den Faktor ${f}, und die Auslese wird kürzer (kürzeres TE/ESP möglich).`,
      };
    },
  },
  {
    id: 'q-cs',
    generate: (rng) => {
      const field = pick(rng, [1.5, 3]);
      const bw = pick(rng, [100, 130, 200, 260, 400]);
      return {
        kind: 'numeric',
        id: 'q-cs',
        difficulty: 2,
        prompt: `Wie viele Pixel beträgt der Fett-Wasser-Versatz (3,5 ppm) in Ausleserichtung bei ${n(field)} T und einer Bandbreite von ${bw} Hz/Pixel?`,
        answer: chemicalShiftPixels(field, bw),
        tolerance: 0.03,
        unit: 'px',
        explanation: `Δf = 3,5 ppm · ${n(42.577 * field, 2)} MHz = ${n(chemicalShiftHz(field), 0)} Hz → ${n(chemicalShiftHz(field), 0)}/${bw} = ${n(chemicalShiftPixels(field, bw), 2)} px. Bei 3 T verdoppelt sich der Versatz – man kompensiert mit doppelter Bandbreite.`,
      };
    },
  },
  {
    id: 'q-sar',
    generate: (rng) => {
      const flipOld = 180;
      const flipNew = pick(rng, [120, 135, 150]);
      const f = 4 * (flipNew / flipOld) ** 2;
      return {
        kind: 'numeric',
        id: 'q-sar',
        difficulty: 2,
        prompt: `Ein TSE-Protokoll wird von 1,5 T auf 3 T übertragen und der Refokussierungswinkel von 180° auf ${flipNew}° reduziert. Um welchen Faktor ändert sich das SAR näherungsweise (Refokussierungspulse dominieren)?`,
        answer: f,
        tolerance: 0.03,
        unit: '×',
        hint: 'SAR ∝ B₀² · α²',
        explanation: `(3/1,5)² · (${flipNew}/180)² = 4 · ${n((flipNew / 180) ** 2, 3)} = ${n(f, 2)}. Selbst mit reduzierten Winkeln liegt das SAR bei 3 T deutlich höher.`,
      };
    },
  },
  {
    id: 'q-sar-limit',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Welcher Ganzkörper-SAR-Grenzwert gilt nach IEC 60601-2-33 im Normal Operating Mode (gemittelt über 6 min)?',
    options: ['2 W/kg', '4 W/kg', '10 W/kg', '0,4 W/kg'],
    answer: 0,
    explanation:
      'Normal Mode: 2 W/kg, First Level Controlled Mode: 4 W/kg (mit medizinischer Überwachung). Für den Kopf gelten 3,2 W/kg; lokal 10 W/kg (Kopf/Rumpf) bzw. 20 W/kg (Extremitäten). Ziel: Kerntemperaturanstieg ≤ 0,5 °C (normal) bzw. ≤ 1 °C.',
  },
  {
    id: 'q-aliasing',
    kind: 'mc',
    difficulty: 1,
    prompt: 'In einer axialen Abdomen-Aufnahme falten die Arme von links nach rechts ins Bild. Was hilft am effektivsten?',
    options: [
      'Phasen-Oversampling bzw. FOV in Phasenrichtung vergrößern (oder Phasenrichtung auf anterior–posterior tauschen).',
      'Bandbreite erhöhen.',
      'TE verkürzen.',
      'Schichtdicke reduzieren.',
    ],
    answer: 0,
    explanation:
      'Einfaltung (Wrap-around) tritt in Phasenrichtung auf, wenn das Objekt größer als das FOV ist – die Phase ist 2π-periodisch. In Ausleserichtung verhindert das Oversampling mit Anti-Aliasing-Filter dies standardmäßig ohne Zeitverlust.',
  },
  {
    id: 'q-motion-direction',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum erscheinen Bewegungsartefakte (Atmung, Pulsation) fast ausschließlich in Phasenrichtung?',
    options: [
      'Zwischen zwei Phasenkodierschritten liegt ein ganzes TR (hunderte ms), während eine Auslesezeile nur wenige ms dauert – Bewegung erzeugt inkonsistente Phasen von Zeile zu Zeile.',
      'Weil der Phasengradient schwächer ist.',
      'Weil Bewegung immer senkrecht zur Ausleserichtung erfolgt.',
      'Weil die Frequenzkodierung Bewegung automatisch korrigiert.',
    ],
    answer: 0,
    explanation:
      'Periodische Bewegung → diskrete Geister im Abstand ∝ TR·N_PE/Periode. Gegenmaßnahmen: Atemanhalt, Triggerung/Navigator, Sättigungsbänder, radiale Trajektorien (PROPELLER/BLADE), schnellere Sequenzen.',
  },
  {
    id: 'q-suscept',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Welche Maßnahmen verringern Suszeptibilitätsartefakte (z. B. durch eine Hüftprothese)? (Mehrfachauswahl)',
    options: [
      'TSE statt GRE verwenden',
      'Empfangsbandbreite erhöhen',
      'Kurze Echozeit wählen',
      'Auf 1,5 T statt 3 T messen',
      'EPI-Auslese verwenden',
    ],
    answers: [0, 1, 2, 3],
    explanation:
      'Suszeptibilität ∝ B₀. SE/TSE refokussiert die Dephasierung; hohe Bandbreite reduziert geometrische Verzerrungen; kurzes TE begrenzt Signalverlust. EPI ist am empfindlichsten. Spezialsequenzen: SEMAC, MAVRIC, View-Angle-Tilting.',
  },
  {
    id: 'q-zipper',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Eine feine, punktierte Linie zieht sich in Phasenrichtung an fester Frequenzposition durch alle Bilder. Was ist die wahrscheinlichste Ursache?',
    options: [
      'HF-Einstreuung (Zipper-Artefakt), z. B. durch offene Kabinentür oder ein defektes elektronisches Gerät im Raum.',
      'Patientenbewegung.',
      'Zu niedrige Matrix.',
      'Falsche Inversionszeit.',
    ],
    answer: 0,
    explanation: 'Eine externe Störfrequenz erscheint im Bild an der zugehörigen Frequenzposition, über alle Phasenschritte hinweg → Linie in Phasenrichtung. Der Faradaykäfig muss geschlossen sein.',
  },
  {
    id: 'q-pns',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Wodurch wird die periphere Nervenstimulation (PNS) während einer MRT ausgelöst?',
    options: [
      'Durch schnell geschaltete Gradientenfelder (hohes dB/dt), die elektrische Felder im Gewebe induzieren.',
      'Durch die HF-Energie (SAR).',
      'Durch das statische Feld B₀ allein.',
      'Durch Kontrastmittel.',
    ],
    answer: 0,
    explanation:
      'Faraday: E ∝ dB/dt. Hohe Slew-Rates (EPI, DWI) können Muskelzucken/Kribbeln auslösen. Der Scanner begrenzt dB/dt über ein Stimulationsmodell. SAR beschreibt dagegen die Erwärmung durch HF.',
  },
  {
    id: 'q-snr-field',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Welche Aussage zum SNR ist korrekt?',
    options: [
      'SNR ∝ Voxelvolumen · √(Messzeit-Anteil N_PE·NEX) / √BW und wächst etwa linear mit B₀.',
      'SNR ist unabhängig von der Schichtdicke.',
      'Eine doppelte Bandbreite verdoppelt das SNR.',
      'Parallele Bildgebung erhöht das SNR um den Faktor R.',
    ],
    answer: 0,
    explanation: 'Parallele Bildgebung senkt das SNR: SNR_R = SNR/(g·√R). Eine Verdopplung der Bandbreite senkt das SNR um √2.',
  },
  {
    id: 'q-cs-direction',
    kind: 'mc',
    difficulty: 2,
    prompt: 'In welcher Richtung ist das Chemical-Shift-Artefakt (1. Art) in einer TSE bzw. in einer EPI sichtbar?',
    options: [
      'TSE: Ausleserichtung (Frequenz); EPI: Phasenrichtung (dort niedrigste Bandbreite pro Pixel).',
      'TSE: Phasenrichtung; EPI: Ausleserichtung.',
      'In beiden in Schichtrichtung.',
      'Es tritt nur in GRE auf.',
    ],
    answer: 0,
    explanation:
      'Die Verschiebung beträgt Δf/BW_px in der Richtung mit der geringsten Bandbreite pro Pixel. In EPI liegt diese in Phasenrichtung bei nur ≈ 10–30 Hz/px → mehrere Pixel Fettversatz ohne Fettsättigung.',
  },
];
