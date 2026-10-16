import { larmorMHz } from '../../physics/mri';
import { n, pick, type QuestionSource } from './types';

export const hardwareQuestions: QuestionSource[] = [
  {
    id: 'hw-rise',
    generate: (rng) => {
      const g = pick(rng, [30, 40, 45, 80]);
      const sr = pick(rng, [100, 150, 200]);
      const t = (g / 1000 / sr) * 1e6; // µs
      return {
        kind: 'numeric',
        id: 'hw-rise',
        difficulty: 1,
        prompt: `Ein Gradientensystem hat eine Slew-Rate von ${sr} T/m/s. Wie lange dauert der Anstieg von 0 auf ${g} mT/m?`,
        answer: t,
        tolerance: 0.02,
        unit: 'µs',
        hint: 'Slew-Rate = Gradientenänderung pro Zeit.',
        explanation: `$t = G/SR = ${g}\\cdot10^{-3}/${sr}$ s $= ${n(t, 0)}$ µs. Kurze Rampen ermöglichen kurze Echoabstände (EPI, TSE), sind aber durch PNS (dB/dt) begrenzt.`,
      };
    },
  },
  {
    id: 'hw-lambda',
    generate: (rng) => {
      const field = pick(rng, [1.5, 3, 7]);
      const f = larmorMHz(field) * 1e6;
      const lambda = (3e8 / (f * Math.sqrt(64))) * 100;
      return {
        kind: 'numeric',
        id: 'hw-lambda',
        difficulty: 3,
        prompt: `Wie groß ist die HF-Wellenlänge im Gewebe bei ${n(field)} T, wenn man eine relative Permittivität $\\varepsilon_r \\approx 64$ annimmt? (Angabe in cm)`,
        answer: lambda,
        tolerance: 0.03,
        unit: 'cm',
        hint: '$\\lambda = c / (f\\sqrt{\\varepsilon_r})$',
        explanation: `$\\lambda = 3\\cdot10^8 / (${n(f / 1e6, 1)}\\cdot10^6 \\cdot 8)$ m $= ${n(lambda, 1)}$ cm. Liegt λ in der Größenordnung des Körperquerschnitts (ab 3 T), entstehen stehende Wellen → inhomogenes B₁ („dielektrische Effekte“, Signalabschattungen im Abdomen). Abhilfe: dielektrische Pads, parallele Sendetechnik (pTx).`,
      };
    },
  },
  {
    id: 'hw-gauss',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Welche Bedeutung hat die 0,5-mT-Linie (5-Gauss-Linie) im MR-Bereich?',
    options: [
      'Grenze des kontrollierten Bereichs: Darüber können Herzschrittmacher und andere aktive Implantate gestört werden.',
      'Ab dort ist das Feld so stark, dass jede Person quencht.',
      'Grenze, ab der die HF-Abschirmung beginnt.',
      'Ort, an dem die Shimspulen montiert sind.',
    ],
    answer: 0,
    explanation:
      'Das Streufeld außerhalb des Magneten fällt steil ab, insbesondere bei aktiv abgeschirmten Magneten. Innerhalb der 0,5-mT-Linie gelten Zugangsbeschränkungen. Ferromagnetische Gegenstände werden in Richtung Isozentrum beschleunigt (Projektil-Effekt), am stärksten im Bereich höchster Feldgradienten am Tunneleingang.',
  },
  {
    id: 'hw-superconductor',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Woraus bestehen die Spulen eines supraleitenden klinischen MR-Magneten und wie werden sie gekühlt?',
    options: [
      'Niob-Titan-Drähte (in Kupfermatrix), gekühlt mit flüssigem Helium auf ≈ 4,2 K.',
      'Kupferdraht, gekühlt mit Wasser auf 10 °C.',
      'Permanentmagnetisches Neodym, ungekühlt.',
      'Aluminiumspulen, gekühlt mit flüssigem Stickstoff (77 K).',
    ],
    answer: 0,
    explanation:
      'NbTi wird unterhalb von ≈ 9 K supraleitend. Im „Persistent Mode“ fließt der Strom (einige hundert A) ohne Spannungsquelle verlustfrei weiter. Ein Kaltkopf rekondensiert verdampfendes Helium (Zero-Boil-Off). Neuere Systeme kommen mit wenigen Litern Helium in geschlossenen Kreisläufen aus.',
  },
  {
    id: 'hw-quench',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Welche Aussagen zum Quench sind korrekt? (Mehrfachauswahl)',
    options: [
      'Die Supraleitung bricht zusammen; die gespeicherte Feldenergie wird als Wärme frei und Helium verdampft schlagartig.',
      'Das gasförmige Helium muss über ein Quenchrohr ins Freie geleitet werden; andernfalls droht Sauerstoffverdrängung.',
      'Ein Notfall-Quench (Magnet-Stopp-Taster) ist z. B. bei einer eingeklemmten Person durch ferromagnetische Gegenstände angezeigt.',
      'Nach einem Quench ist das Magnetfeld innerhalb von Millisekunden wieder vollständig aufgebaut.',
    ],
    answers: [0, 1, 2],
    explanation:
      'Nach einem Quench muss der Magnet neu mit Helium befüllt und wieder hochgefahren (geramped) und geshimmt werden – das dauert Tage und ist teuer. Bei einem Herzstillstand wird der Patient dagegen aus dem Raum gebracht; ein Quench wäre zu langsam und unnötig.',
  },
  {
    id: 'hw-shim',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Was ist die Aufgabe des Shimsystems?',
    options: [
      'Homogenisierung von B₀ über das Messvolumen – passiv (Eisenplättchen bei Installation) und aktiv (Shimspulen höherer Ordnung, patientenspezifisch).',
      'Erzeugung des HF-Anregungsfeldes.',
      'Kühlung der Gradientenspulen.',
      'Abschirmung gegen externe Radiowellen.',
    ],
    answer: 0,
    explanation:
      'Ziel sind wenige ppm Homogenität über ein kugelförmiges Volumen (DSV) von 40–50 cm. Gute Homogenität ist entscheidend für Fettsättigung (CHESS), EPI und Spektroskopie. Der Patient selbst stört das Feld (Suszeptibilität), daher wird vor jeder Untersuchung neu geshimmt.',
  },
  {
    id: 'hw-gradient-coils',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Welche Feldkomponente verändern die Gradientenspulen?',
    options: [
      'Sie überlagern B₀ mit einer zusätzlichen z-Komponente, deren Stärke linear vom Ort (x, y oder z) abhängt.',
      'Sie erzeugen ein rotierendes Feld senkrecht zu B₀.',
      'Sie drehen die Richtung von B₀ um 90°.',
      'Sie erzeugen das statische Grundfeld.',
    ],
    answer: 0,
    explanation:
      'B_z(x,y,z) = B₀ + G_x·x + G_y·y + G_z·z. Drei orthogonale Spulensätze (Maxwell-Paar für z, Golay-Sattelspulen für x/y). Die Lorentzkraft auf die Leiter im starken B₀ verursacht den typischen Lärm (bis > 110 dB(A)) – Gehörschutz ist Pflicht.',
  },
  {
    id: 'hw-faraday',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Wozu dient der Faradaykäfig (HF-Kabine) um den Scanner?',
    options: [
      'Er schirmt externe Radiofrequenzen (UKW, Funk) ab, die genau im Larmor-Frequenzbereich liegen und das schwache MR-Signal überlagern würden.',
      'Er schirmt das statische Magnetfeld vollständig ab.',
      'Er verhindert den Austritt von Heliumgas.',
      'Er dient als Erdung für die Gradientenspulen.',
    ],
    answer: 0,
    explanation: 'Das MR-Signal liegt im µV-Bereich. Kupfer- oder Aluminiumverkleidung inkl. HF-dichter Tür und Filterplatte (Durchführungen) verhindern Einstreuungen. Das statische Feld wird davon nicht abgeschirmt.',
  },
  {
    id: 'hw-coils',
    kind: 'mc',
    difficulty: 2,
    prompt: 'Warum werden für die Bildgebung meist lokale Mehrkanal-Empfangsspulen (Phased Arrays) statt der Körperspule verwendet?',
    options: [
      'Kleine Spulenelemente nah an der Anatomie sehen weniger Rauschen aus dem Körpervolumen → höheres SNR; die unterschiedlichen Sensitivitäten ermöglichen parallele Bildgebung.',
      'Weil die Körperspule nur senden, aber niemals empfangen kann.',
      'Weil lokale Spulen das SAR auf null senken.',
      'Weil Phased-Array-Spulen das Magnetfeld verstärken.',
    ],
    answer: 0,
    explanation:
      'Das Rauschen stammt überwiegend vom Patienten (Gewebeleitfähigkeit). Eine kleine Spule „sieht“ nur ein kleines Volumen. Die integrierte Körperspule dient meist als homogener Sender. Bei Empfang werden die Sendespulen verstimmt (Decoupling) – defekte Verstimmung kann Verbrennungen verursachen.',
  },
  {
    id: 'hw-burns',
    kind: 'multi',
    difficulty: 2,
    prompt: 'Welche Maßnahmen beugen HF-Verbrennungen vor? (Mehrfachauswahl)',
    options: [
      'Keine Hautkontakt-Schleifen (Hände/Oberschenkel nicht berühren lassen, Polster verwenden).',
      'Kabel nicht in Schlaufen legen und nicht direkt auf die Haut legen.',
      'Metallhaltige Kleidung, Pflaster (z. B. Nikotinpflaster mit Aluminium) entfernen.',
      'Den Patienten mit nassen Tüchern abdecken, um die Leitfähigkeit zu erhöhen.',
    ],
    answers: [0, 1, 2],
    explanation: 'Leitende Schleifen bilden Antennen bzw. Stromkreise, in denen das HF-Feld Ströme induziert. Feuchtigkeit erhöht die Leitfähigkeit eher und wäre kontraproduktiv.',
  },
  {
    id: 'hw-active-shield',
    kind: 'mc',
    difficulty: 3,
    prompt: 'Wozu dienen die äußeren, gegensinnig gewickelten Spulen eines aktiv abgeschirmten Magneten bzw. einer abgeschirmten Gradientenspule?',
    options: [
      'Magnet: Reduktion des Streufelds (kleinere 0,5-mT-Zone). Gradienten: Minimierung von Wirbelströmen in der Kryostatwand.',
      'Sie verdoppeln die Feldstärke im Isozentrum.',
      'Sie erzeugen das B₁-Feld.',
      'Sie kühlen das Helium zusätzlich.',
    ],
    answer: 0,
    explanation:
      'Wirbelströme verzerren die Gradientenpulse zeitlich (Bildverzerrungen, Ghosting bei EPI/DWI); die Abschirmung plus Pre-Emphasis kompensieren sie. Das reduzierte Streufeld erleichtert die Raumplanung erheblich.',
  },
  {
    id: 'hw-noise',
    kind: 'mc',
    difficulty: 1,
    prompt: 'Was ist die physikalische Ursache des lauten Klopfens im MRT?',
    options: [
      'Lorentzkräfte auf die stromdurchflossenen Gradientenspulen im starken Magnetfeld lassen diese mechanisch vibrieren.',
      'Das siedende Helium.',
      'Die HF-Pulse, die hörbar sind.',
      'Die Lüftung des Patiententunnels.',
    ],
    answer: 0,
    explanation: 'F = I·L × B. Das Geräusch folgt dem Gradienten-Schaltmuster (EPI: hoher Dauerton). Die Kräfte steigen mit B₀ → 3 T ist lauter. „Silent“-Sequenzen nutzen sanfte Gradientenformen.',
  },
];
