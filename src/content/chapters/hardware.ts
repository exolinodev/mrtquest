import type { Chapter } from './types';

/**
 * Modul 5: Gerätetechnik.
 * Inhaltliche Grundlage: MBR-Skript „Magnetic Resonance Imaging“, Abschnitte Signal Detection,
 * Magnet designs, Body and head coils as antennas, Components of an MRI device, Recap-Frage 5.
 */
export const hardware: Chapter = {
  de: [
    {
      title: 'Der Magnet: das Herzstück, das nie schläft',
      blocks: [
        {
          type: 'hook',
          text: 'Bisher war die MRT vor allem Physik und Mathematik. Jetzt gehen wir in den Untersuchungsraum und schauen uns die Maschine an. Eines der Lernziele der Vorlesung lautet: **die essentiellen technischen Komponenten inklusive ihrer Funktion beschreiben.** Am Ende dieses Moduls kannst du jedes Bauteil benennen und sagen, wozu es da ist. Genau das will der Professor in der Recap-Frage 5 hören.',
        },
        {
          type: 'p',
          text: 'Alles beginnt mit dem **Hauptmagneten**. Er erzeugt das starke, statische Feld $B_0$. Ohne $B_0$ gibt es keine Nettomagnetisierung $M_0$ und keine Larmor-Frequenz, also kein Signal. Zwei Anforderungen sind entscheidend: Das Feld soll **stark** sein, weil mehr Feld mehr Signal bedeutet. Und es soll **homogen** sein, also überall im Messbereich gleich stark, denn sonst funken die Protonen auf leicht verschiedenen Frequenzen und das Bild wird verzerrt.',
        },
        {
          type: 'p',
          text: 'Im Skript siehst du verschiedene **Magnetbauformen**. Grob gibt es zwei Familien:',
        },
        {
          type: 'list',
          items: [
            '**Supraleitender Tunnelmagnet:** Spulen aus einem Supraleiter (meist Niob-Titan) werden mit **flüssigem Helium** auf etwa 4 Kelvin gekühlt, das sind rund −269 °C. Dann verschwindet der elektrische Widerstand. Der Strom fließt ohne Verluste im Kreis, und das Feld bleibt dauerhaft eingeschaltet. Klinisch üblich sind 1,5 T und 3 T.',
            '**Offenes Gerät mit Permanentmagnet:** zwei große Magnetblöcke oben und unten, wie bei einem riesigen Hufeisen. Er braucht keinen Strom und keine Kühlung, ist aber sehr schwer und erreicht nur niedrige Feldstärken, typischerweise deutlich unter 1 T.',
            '**Offenes Gerät mit Widerstandsmagnet:** ein normaler Elektromagnet aus Kupferspulen. Er braucht dauernd viel Strom und Kühlung, lässt sich dafür aber ausschalten. Auch er liefert nur niedrige Felder.',
          ],
        },
        {
          type: 'table',
          head: ['Eigenschaft', 'Supraleitender Tunnel', 'Offenes Gerät'],
          rows: [
            ['Feldstärke', 'hoch (1,5 bis 3 T)', 'niedrig (meist unter 1 T)'],
            ['Signal und Bildqualität', 'hoch', 'geringer, längere Messzeit'],
            ['Homogenität', 'sehr gut', 'schwieriger'],
            ['Zugang zum Patienten', 'eng, Röhre', 'offen, seitlich zugänglich'],
            ['Klaustrophobie, Kinder, Adipositas', 'problematisch', 'deutlich angenehmer'],
            ['Betrieb', 'Kryotechnik, Helium', 'kein Helium nötig'],
          ],
        },
        {
          type: 'callout',
          variant: 'klinik',
          title: 'Wann das offene Gerät gewinnt',
          text: 'Bei Patientinnen und Patienten mit Platzangst, bei sehr kräftigen Menschen oder für Untersuchungen, bei denen Ärztinnen am Patienten arbeiten müssen, ist der offene Zugang ein echter Vorteil. Für feine Diagnostik im Gehirn oder an Gelenken nimmt man das stärkere Tunnelgerät.',
        },
        {
          type: 'mnemonic',
          text: '**Tunnel = stark und eng, offen = schwach und bequem.** Der supraleitende Magnet braucht Helium und ist immer an.',
        },
        {
          type: 'exam',
          question: 'Vergleiche einen supraleitenden Tunnelmagneten mit einem offenen MRT-Gerät.',
          answer: 'Der supraleitende Tunnelmagnet erreicht hohe Feldstärken (klinisch 1,5 bis 3 T) mit sehr guter Homogenität und liefert daher viel Signal und gute Bildqualität. Er braucht Kryotechnik mit flüssigem Helium, sein Feld ist dauerhaft eingeschaltet, und die enge Röhre ist für klaustrophobe Patienten belastend. Offene Geräte mit Permanent- oder Widerstandsmagnet bieten freien Zugang und mehr Komfort, erreichen aber nur niedrige Feldstärken und damit weniger Signal.',
          full: 'Nenne die Funktion des Magneten (B₀ für Nettomagnetisierung und Larmor-Frequenz) und den Zusammenhang Feldstärke → Signal.',
          sim: 'scanner',
        },
      ],
    },
    {
      title: 'Shim und Gradienten: Feinschliff und das laute Klopfen',
      blocks: [
        {
          type: 'p',
          text: 'Kein Magnet ist perfekt. Schon kleine Fertigungstoleranzen, Stahlträger im Gebäude und vor allem der Patient selbst verbiegen das Feld ein wenig. Deshalb gibt es den **Shim**. Das englische Wort bedeutet so viel wie „Unterlegscheibe zum Ausgleichen“. Beim **passiven Shim** werden bei der Installation kleine Eisenplättchen eingesetzt. Beim **aktiven Shim** erzeugen zusätzliche Spulen schwache Korrekturfelder, die vor jeder Messung an den Patienten angepasst werden. Ziel: ein möglichst **homogenes** $B_0$.',
        },
        {
          type: 'p',
          text: 'Ganz anders die **Gradientenspulen**. Sie sollen das Feld absichtlich ungleich machen, aber kontrolliert. Im Magneten stecken **drei Gradientenspulen**, eine für jede Raumrichtung x, y und z. Jede legt eine lineare Rampe über das Feld. Aus Modul 3 kennst du ihre drei Aufgaben in der Bildgebung: Schichtauswahl, Phasenkodierung und Frequenzkodierung (Auslesen).',
        },
        { type: 'formula', tex: 'B(x) = B_0 + G_x\\, x \\quad\\Rightarrow\\quad \\omega(x) = \\gamma\\,(B_0 + G_x x)', caption: 'der Gradient macht die Larmor-Frequenz ortsabhängig' },
        {
          type: 'p',
          text: 'Gespeist werden die Spulen von **Gradientenverstärkern**. Das sind sehr leistungsstarke Stromquellen, die Hunderte Ampere in Sekundenbruchteilen ein-, aus- und umschalten. Denn in einer Sequenz wechseln die Gradienten ständig, und je schneller das geht, desto schneller ist die Messung.',
        },
        {
          type: 'analogy',
          title: 'Die Gradientenspule ist ein riesiger Lautsprecher',
          text: 'In einem Lautsprecher fließt ein wechselnder Strom durch eine Spule, die in einem Magnetfeld sitzt. Die Lorentzkraft rüttelt die Spule hin und her, und die Membran macht Schall. In der MRT ist es genauso, nur viel größer: Die Gradientenspule sitzt im starken Feld $B_0$, der Strom wird schnell geschaltet, die Spule ruckt mechanisch. Darum **klopft, brummt und hämmert** das Gerät, und zwar umso lauter, je stärker das Feld und je schneller die Schaltung.',
        },
        {
          type: 'p',
          text: 'Die Lautstärke kann über 100 Dezibel erreichen, so laut wie ein Presslufthammer. Deshalb bekommt jeder Patient **Gehörschutz**. Der Rhythmus des Klopfens verrät übrigens die Sequenz: Jede Sequenz hat ihr eigenes „Lied“.',
        },
        {
          type: 'mnemonic',
          text: '**Shim macht glatt, Gradienten machen schief.** Der Shim gleicht Fehler im B₀ aus, die drei Gradientenspulen legen gezielt Rampen für die Ortskodierung an, und ihr Schalten im starken Feld macht den Lärm.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Der Lärm kommt vom Hauptmagneten.“ Richtig: Der Hauptmagnet ist still. Es klopfen die schnell geschalteten Gradientenspulen durch die Lorentzkraft im Feld B₀.',
            'Falsch: „Shim und Gradienten sind dasselbe.“ Richtig: Der Shim soll das Feld möglichst gleichmäßig machen. Die Gradienten machen es absichtlich ortsabhängig.',
          ],
        },
        {
          type: 'exam',
          question: 'Welche Aufgabe haben Shim-System und Gradientensystem, und warum ist eine MRT-Untersuchung so laut?',
          answer: 'Das Shim-System (passiv mit Eisenplättchen, aktiv mit Korrekturspulen) verbessert die Homogenität von B₀. Das Gradientensystem besteht aus drei Gradientenspulen für x, y und z mit Gradientenverstärkern. Es überlagert B₀ mit linearen Feldänderungen und macht so die Larmor-Frequenz ortsabhängig (Schichtauswahl, Phasen- und Frequenzkodierung). Beim schnellen Schalten der Gradientenströme im starken B₀ wirken Lorentzkräfte auf die Spulen, die mechanisch vibrieren und den Lärm erzeugen.',
          full: 'Erwähne Gehörschutz und dass die Lautstärke mit B₀ und Schaltgeschwindigkeit steigt.',
          sim: 'scanner',
        },
      ],
    },
    {
      title: 'Das HF-System: senden, empfangen und abschirmen',
      blocks: [
        {
          type: 'p',
          text: 'Um die Magnetisierung zu kippen, braucht man einen Puls mit der Larmor-Frequenz. Dafür gibt es den **HF-Sender**. Er erzeugt die Radiofrequenz, formt den Puls und verstärkt ihn auf mehrere Kilowatt. Die **Sendespule** strahlt ihn als Feld $B_1$ ins Gewebe. Meist übernimmt das die große **Körperspule**, die fest in die Röhre eingebaut ist und ein gleichmäßiges $B_1$ über einen großen Bereich erzeugt.',
        },
        {
          type: 'p',
          text: 'Danach muss das schwache Echo der Protonen aufgefangen werden. Das machen die **Empfangsspulen**. Im Skript heißen sie ausdrücklich „Körper- und Kopfspulen als Antennen“. Es gibt drei typische Sorten:',
        },
        {
          type: 'list',
          items: [
            '**Körperspule:** groß, fest eingebaut, sieht viel vom Körper, aber aus größerer Entfernung. Gut für Übersichten.',
            '**Kopfspule:** ein Käfig, der eng um den Kopf liegt. Sie empfängt gleichmäßig aus dem ganzen Gehirn.',
            '**Oberflächenspulen:** flache Spulen, die direkt auf Knie, Schulter, Wirbelsäule oder Brust gelegt werden. Oft sind viele kleine Elemente zu einem Array zusammengeschaltet.',
          ],
        },
        {
          type: 'analogy',
          title: 'Das Mikrofon nah an den Mund halten',
          text: 'Wer im Saal ein Mikrofon weit weg vom Mund hält, nimmt die Stimme leise auf und dazu viel Geräusch aus dem ganzen Raum. Hält man es direkt vor den Mund, wird die Stimme laut und klar. Bei Empfangsspulen ist es genauso: **Je näher die Spule am Gewebe, desto mehr Signal.** Gleichzeitig „hört“ eine kleine Spule weniger Rauschen aus weiter entfernten Körperbereichen. Darum liefert eine Oberflächenspule am Knie ein viel schärferes Bild als die Körperspule.',
        },
        {
          type: 'p',
          text: 'Das Echo der Protonen ist winzig, und es liegt mit 64 MHz bei 1,5 T mitten im UKW-Radiobereich. Ein einziger Radiosender draußen würde das Signal überdecken. Deshalb steht das Gerät in einer **HF-Kabine**, einem **Faraday-Käfig** aus Kupfer- oder Stahlblech in Wänden, Decke, Boden und Tür. Er hält Radiowellen von außen fern und hält die starken Sendepulse drinnen. Ist die Kabinentür nicht richtig zu, sieht man Störstreifen im Bild.',
        },
        {
          type: 'mnemonic',
          text: '**Senden mit der großen Spule, hören mit der nahen Spule, abschirmen mit dem Käfig.** Nähe zur Antenne bedeutet mehr Signal.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Die HF-Kabine schützt die Umgebung vor Strahlung, weil MRT radioaktiv ist.“ Richtig: Die MRT nutzt keine ionisierende Strahlung. Die Kabine schirmt vor allem Radiowellen von außen ab, damit das schwache MR-Signal nicht gestört wird.',
            'Falsch: „Eine große Spule ist immer besser, weil sie mehr sieht.“ Richtig: Für feine Details ist eine kleine, nahe Spule besser. Sie fängt mehr Signal und weniger Rauschen ein.',
          ],
        },
        {
          type: 'exam',
          question: 'Welche Aufgaben haben Sendespule, Empfangsspulen und HF-Kabine? Warum verwendet man Oberflächenspulen?',
          answer: 'Der HF-Sender erzeugt Pulse mit der Larmor-Frequenz, die Sendespule (meist die Körperspule) strahlt sie als B₁-Feld ein und kippt die Magnetisierung. Empfangsspulen wirken als Antennen und nehmen das von der präzedierenden Quermagnetisierung induzierte Signal auf (Körper-, Kopf-, Oberflächenspulen). Oberflächenspulen liegen nah am Gewebe und liefern deshalb mehr Signal bei weniger Rauschen. Die HF-Kabine ist ein Faraday-Käfig, der äußere Radiostörungen abhält und die Sendeleistung im Raum hält.',
          full: 'Erwähne, dass die Larmor-Frequenz im UKW-Radiobereich liegt und deshalb die Abschirmung unverzichtbar ist.',
          sim: 'scanner',
        },
      ],
    },
    {
      title: 'Signaldetektion: Vom Fahrraddynamo zur komplexen Zahl',
      blocks: [
        {
          type: 'analogy',
          title: 'Der Fahrraddynamo',
          text: 'Im Dynamo dreht sich ein Magnet neben einer Drahtspule. Weil sich das Magnetfeld in der Spule ständig ändert, entsteht eine Wechselspannung, und die Lampe leuchtet. Das ist **Faradays Induktionsgesetz**. In der MRT ist der rotierende Magnet die kreisende Quermagnetisierung. Sie dreht mit der Larmor-Frequenz, und in der Empfangsspule entsteht eine winzige Wechselspannung mit genau dieser Frequenz.',
        },
        {
          type: 'p',
          text: 'Das Skript beschreibt das Signal als **elektromagnetische Welle**. In ihr schwingen ein elektrisches Feld E und ein magnetisches Feld B. Beide stehen **senkrecht aufeinander** und senkrecht zur Ausbreitungsrichtung. Man nennt das eine **transversale Welle**.',
        },
        {
          type: 'formula',
          tex: '\\vec E(\\vec r,t) = \\hat E(\\vec r)\\cdot\\cos(\\vec k\\cdot\\vec r - \\omega t + \\varphi)',
          caption: 'ebene elektromagnetische Welle',
        },
        {
          type: 'list',
          items: [
            '$\\hat E$ ist die **Amplitude**, also die größte Feldstärke.',
            '$\\vec k$ ist der **Wellenvektor**. Er zeigt in Ausbreitungsrichtung, sein Betrag ist $2\\pi/\\lambda$.',
            '$\\omega$ ist die **Kreisfrequenz**, bei uns die Larmor-Frequenz.',
            '$\\varphi$ ist die **Phase**, also die Verschiebung der Welle.',
          ],
        },
        {
          type: 'p',
          text: 'Die Antenne steht aber an einem **festen Ort**. Dort ist $\\vec k\\cdot\\vec r$ eine Konstante, die man in die Phase stecken kann. Übrig bleibt eine einfache Schwingung in der Zeit. Und jetzt kommt der Trick aus dem Skript: Man schreibt sie als komplexe Zahl.',
        },
        {
          type: 'figure',
          id: 'em-wave',
          caption: 'E (blau) und B (violett) stehen senkrecht aufeinander und senkrecht zur Ausbreitungsrichtung, λ ist der Abstand zweier Wellenberge. Die Antenne an einem festen Ort sieht davon nur eine Schwingung in der Zeit: $E(t) = \\hat E\\cos(\\omega t + \\varphi)$.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} E(t) &= \\hat E\\cos(\\omega t + \\varphi) \\\\ &\\to \\hat E\\big(\\cos\\omega t + i\\sin\\omega t\\big) \\\\ &= \\hat E\\, e^{i\\omega t} = s(t) \\end{aligned}',
          caption: 'Signal an der Antenne in komplexer Darstellung, die Phase steckt in $\\hat E$',
        },
        {
          type: 'p',
          text: 'Warum komplex? Eine einzelne Kosinuskurve verrät nicht eindeutig, in welche Richtung sich etwas dreht und wo genau es gerade steht. Die Quermagnetisierung ist aber ein Pfeil, der in der Ebene kreist. Mit Realteil und Imaginärteil beschreibt man ihn vollständig: **Betrag = Amplitude**, **Winkel = Phase**.',
        },
        {
          type: 'p',
          text: 'Technisch passiert das im Empfänger mit der **Quadraturdemodulation**. Das Signal wird zweimal mit der Larmor-Frequenz gemischt, einmal mit einem Kosinus und einmal mit einem um 90° verschobenen Sinus. So entstehen zwei Kanäle: **I** (In-Phase, Realteil) und **Q** (Quadratur, Imaginärteil). Zusammen ergeben sie $s(t) = I(t) + iQ(t)$. Ohne beide Kanäle ginge die Phase verloren, und die brauchst du für den k-Raum unbedingt.',
        },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Welle oder Induktion?',
          text: 'Die Spule sitzt so nah am Körper, dass sie das Signal eigentlich über das sich ändernde Magnetfeld aufnimmt, also durch Induktion wie beim Dynamo. Das Bild der ebenen Welle aus dem Skript ist eine Vereinfachung. Für die komplexe Darstellung und die I/Q-Kanäle macht das keinen Unterschied.',
        },
        {
          type: 'mnemonic',
          text: '**Kreisende Magnetisierung induziert eine Spannung, zwei Kanäle retten die Phase.** I ist der Realteil, Q der Imaginärteil, zusammen ergeben sie s(t).',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Das k in der Wellenformel ist das k aus dem k-Raum.“ Richtig: Hier ist $\\vec k$ der Wellenvektor der Radiowelle. Das k des k-Raums ist das Zeitintegral des Gradienten, mal γ. Gleicher Buchstabe, andere Bedeutung.',
            'Falsch: „Ein einziger Empfangskanal reicht, die Amplitude genügt.“ Richtig: Für die Bildrekonstruktion braucht man Amplitude und Phase, also I und Q.',
          ],
        },
        {
          type: 'exam',
          question: 'Wie wird das MR-Signal detektiert, und warum stellt man es als komplexe Zahl $s(t) = \\hat E e^{i\\omega t}$ dar?',
          answer: 'Die mit der Larmor-Frequenz präzedierende Quermagnetisierung induziert in der Empfangsspule (Antenne) eine Wechselspannung. Das Skript beschreibt das Feld als transversale Welle $E(\\vec r,t) = \\hat E\\cos(\\vec k\\cdot\\vec r - \\omega t + \\varphi)$ mit E ⊥ B. An einer Antenne an festem Ort bleibt $E(t) = \\hat E\\cos(\\omega t + \\varphi)$. In komplexer Form $s(t) = \\hat E e^{i\\omega t}$ enthält das Signal Amplitude (Betrag) und Phase (Winkel). Technisch liefert die Quadraturdemodulation dafür die Kanäle I (Realteil) und Q (Imaginärteil).',
          full: 'Nenne Faradays Induktionsgesetz und erkläre, dass die Phase für die k-Raum-Rekonstruktion unverzichtbar ist.',
          sim: 'signal/spectrum',
        },
      ],
    },
    {
      title: 'Die Signalkette: vom kreisenden Spin zum fertigen Bild',
      blocks: [
        {
          type: 'p',
          text: 'Jetzt setzen wir alle Teile zu einer Kette zusammen. Das Signal durchläuft auf dem Weg zum Bild mehrere Stationen. In der Prüfung lohnt es sich, diese Reihenfolge sicher zu können.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Empfangsspule:** Die kreisende Quermagnetisierung induziert eine winzige Wechselspannung im Mikrovoltbereich.',
            '**Vorverstärker:** Er sitzt möglichst nah an der Spule und verstärkt das Signal sehr rauscharm, bevor es auf dem Kabel weitere Störungen einsammelt.',
            '**Demodulation:** Das Signal wird mit der Larmor-Frequenz gemischt. Die hohe Trägerfrequenz fällt weg, übrig bleiben die kleinen, ortsabhängigen Frequenzunterschiede aus den Gradienten. Dabei entstehen die beiden Kanäle I und Q.',
            '**Analog-Digital-Wandler (ADC):** Er tastet I und Q in festen Zeitabständen ab und macht daraus Zahlen.',
            '**Rechner und Rekonstruktion:** Die Zahlen werden in den k-Raum einsortiert und per inverser FFT in ein Bild umgerechnet.',
            '**Bild:** Betrag oder Phase werden als Graustufen angezeigt.',
          ],
        },
        {
          type: 'analogy',
          title: 'Ein Radio, das einen Sender empfängt',
          text: 'Dein Autoradio macht fast dasselbe. Die Antenne fängt viele schwache Sender auf. Ein Verstärker hebt sie an. Dann wird der gewünschte Sender herausgemischt, die hohe Trägerfrequenz verschwindet, und übrig bleibt die Musik. Bei der MRT ist der Sender die Larmor-Frequenz, und die „Musik“ sind die kleinen Frequenz- und Phasenunterschiede, die der Gradient den einzelnen Orten aufgeprägt hat.',
        },
        {
          type: 'p',
          text: 'Parallel dazu gibt es die Sendeseite und die Steuerung. Der **Rechner** spielt die Pulssequenz ab: Er sagt dem HF-Sender, wann er welchen Puls senden soll, und den Gradientenverstärkern, wann welcher Gradient an ist. Und er sagt dem ADC, wann er messen soll. Senden, Gradienten und Empfang müssen auf Mikrosekunden genau zusammenspielen.',
        },
        {
          type: 'figure',
          id: 'signal-chain',
          caption: 'Folge den Pfeilen von oben nach unten: Die Steuerung spielt die Sequenz ab, Magnet, Gradienten und HF-Sender wirken auf den Patienten, und das Signal läuft über Spule, Vorverstärker und ADC in den Rechner. Die gestrichelten Linien sind Steuersignale, die alles auf Mikrosekunden genau takten.',
        },
        {
          type: 'mnemonic',
          text: '**Spule, Verstärker, Mischer, Wandler, Rechner, Bild.** Erst wird das Signal laut, dann langsam, dann digital, dann per FFT zum Bild.',
        },
        {
          type: 'exam',
          question: 'Beschreibe die Signalkette eines MRT-Geräts von der Empfangsspule bis zum Bild.',
          answer: 'Empfangsspule (Induktion durch die präzedierende Quermagnetisierung) → rauscharmer Vorverstärker nahe der Spule → Demodulation (Mischen mit der Larmor-Frequenz, Quadraturkanäle I und Q, nur ortsabhängige Frequenz- und Phasenunterschiede bleiben) → Analog-Digital-Wandlung → Rechner: Einsortieren in den k-Raum und Rekonstruktion per inverser FFT → Bild (Betrag als Graustufen).',
          full: 'Erwähne, dass der Rechner auch Sender und Gradienten zeitlich steuert (Pulssequenz).',
          sim: 'signal/spectrum',
        },
      ],
    },
    {
      title: 'Recap: die essentiellen Komponenten und kurz zur Sicherheit',
      blocks: [
        {
          type: 'p',
          text: 'Die **Recap-Frage 5** lautet: „Was sind die essentiellen Komponenten eines MRI-Geräts?“ Die beste Antwort ist eine strukturierte Liste, bei der zu jedem Bauteil gleich die **Funktion** steht. Denn das Lernziel heißt ausdrücklich „Komponenten inklusive Funktion“. Eine reine Aufzählung von Namen bringt nur halbe Punkte.',
        },
        {
          type: 'table',
          head: ['Komponente', 'Funktion'],
          rows: [
            ['Hauptmagnet (meist supraleitend, mit Kryotechnik)', 'erzeugt B₀: Nettomagnetisierung M₀ und Larmor-Frequenz'],
            ['Shim-System', 'macht B₀ homogen'],
            ['3 Gradientenspulen + Gradientenverstärker', 'ortsabhängiges Feld: Schichtauswahl, Phasen- und Frequenzkodierung'],
            ['HF-Sender + Sendespule', 'B₁-Puls mit Larmor-Frequenz, kippt die Magnetisierung'],
            ['Empfangsspulen (Körper, Kopf, Oberfläche)', 'Antennen, nehmen das induzierte Signal auf'],
            ['Empfänger: Vorverstärker, Demodulation (I/Q), ADC', 'verstärkt, demoduliert und digitalisiert das Signal'],
            ['Rechner', 'steuert die Pulssequenz, rekonstruiert das Bild per FFT'],
            ['HF-Kabine (Faraday-Käfig)', 'schirmt äußere Radiowellen ab'],
          ],
        },
        {
          type: 'p',
          text: 'Eine Merkhilfe für die Reihenfolge: Erst braucht man ein **Feld** (Magnet und Shim), dann einen **Ort** (Gradienten), dann einen **Anstoß** (HF-Sender), dann ein **Ohr** (Empfangsspulen und Empfänger), dann einen **Kopf** (Rechner). Und um alles herum eine **Hülle** (HF-Kabine).',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Sicherheit in zwei Sätzen',
          text: 'Das Feld des supraleitenden Magneten ist **immer an**. Eisenhaltige Gegenstände wie Scheren, Sauerstoffflaschen oder Rollstühle werden mit großer Kraft in den Magneten gezogen (**Projektileffekt**), deshalb wird jede Person vor dem Betreten genau befragt und auf Metall und Implantate geprüft. Die MRT arbeitet dagegen **ohne ionisierende Strahlung**. Die Radiowellen erwärmen das Gewebe nur leicht.',
        },
        {
          type: 'mnemonic',
          text: '**Feld, Ort, Anstoß, Ohr, Kopf, Hülle.** Magnet und Shim, Gradienten, HF-Sender, Empfangsspulen, Rechner, HF-Kabine. Zu jedem Teil immer die Funktion sagen.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Man schaltet den Magneten nach Feierabend aus.“ Richtig: Ein supraleitender Magnet bleibt dauerhaft an. Der Projektileffekt droht also rund um die Uhr.',
            'Falsch: „Komponenten aufzählen reicht.“ Richtig: Für volle Punkte gehört zu jeder Komponente ihre Funktion.',
          ],
        },
        {
          type: 'exam',
          question: 'Was sind die essentiellen Komponenten eines MRI-Geräts?',
          answer: '1. Hauptmagnet (meist supraleitend mit Heliumkühlung): erzeugt das statische Feld B₀, damit Nettomagnetisierung und Larmor-Frequenz. 2. Shim-System: verbessert die Homogenität von B₀. 3. Drei Gradientenspulen (x, y, z) mit Gradientenverstärkern: ortsabhängige Feldänderung für Schichtauswahl, Phasen- und Frequenzkodierung. 4. HF-Sender mit Sendespule: erzeugt den B₁-Puls mit Larmor-Frequenz und kippt die Magnetisierung. 5. Empfangsspulen (Körper-, Kopf-, Oberflächenspulen) als Antennen: nehmen das induzierte MR-Signal auf. 6. Empfänger mit Vorverstärker, Demodulation (I/Q) und ADC. 7. Rechner: Sequenzsteuerung und Bildrekonstruktion per inverser FFT. 8. HF-Kabine (Faraday-Käfig): Abschirmung gegen äußere Radiowellen.',
          full: 'Zu jeder Komponente die Funktion nennen. Bonus: Bauformen (Tunnel vs. offen) und die Signalkette Spule → Vorverstärker → Demodulation → ADC → Rekonstruktion.',
          sim: 'scanner',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'Магнит: сердце, которое никогда не спит',
      blocks: [
        {
          type: 'hook',
          text: 'До сих пор МРТ была в основном физикой и математикой. Теперь заходим в кабинет и смотрим на саму машину. Одна из целей лекции звучит так: **описать основные технические компоненты вместе с их функцией.** В конце этого модуля ты сможешь назвать каждую деталь и сказать, зачем она нужна. Именно это профессор хочет услышать в контрольном вопросе 5.',
        },
        {
          type: 'p',
          text: 'Всё начинается с **основного магнита**. Он создаёт сильное статическое поле $B_0$. Без $B_0$ нет суммарной намагниченности $M_0$ и ларморовой частоты, значит, нет и сигнала. Решают два требования: поле должно быть **сильным**, потому что больше поля значит больше сигнала. И оно должно быть **однородным**, то есть одинаковым во всей области измерения, иначе протоны вещают на немного разных частотах и изображение искажается.',
        },
        {
          type: 'p',
          text: 'В конспекте показаны разные **конструкции магнитов**. Грубо есть две семьи:',
        },
        {
          type: 'list',
          items: [
            '**Сверхпроводящий туннельный магнит:** катушки из сверхпроводника (обычно ниобий-титан) охлаждают **жидким гелием** примерно до 4 кельвинов, это около −269 °C. Тогда электрическое сопротивление исчезает. Ток течёт по кругу без потерь, и поле остаётся включённым постоянно. В клинике обычно 1,5 Тл и 3 Тл.',
            '**Открытый аппарат с постоянным магнитом:** два больших магнитных блока сверху и снизу, как огромная подкова. Ему не нужны ни ток, ни охлаждение, но он очень тяжёлый и даёт лишь слабое поле, как правило заметно ниже 1 Тл.',
            '**Открытый аппарат с резистивным магнитом:** обычный электромагнит из медных катушек. Ему постоянно нужен большой ток и охлаждение, зато его можно выключить. Поле тоже слабое.',
          ],
        },
        {
          type: 'table',
          head: ['Свойство', 'Сверхпроводящий туннель', 'Открытый аппарат'],
          rows: [
            ['Сила поля', 'высокая (1,5 до 3 Тл)', 'низкая (обычно ниже 1 Тл)'],
            ['Сигнал и качество', 'высокие', 'ниже, дольше измерение'],
            ['Однородность', 'очень хорошая', 'сложнее'],
            ['Доступ к пациенту', 'тесно, труба', 'открыто, доступ сбоку'],
            ['Клаустрофобия, дети, ожирение', 'проблематично', 'гораздо комфортнее'],
            ['Эксплуатация', 'криотехника, гелий', 'гелий не нужен'],
          ],
        },
        {
          type: 'callout',
          variant: 'klinik',
          title: 'Когда выигрывает открытый аппарат',
          text: 'Для пациентов с боязнью замкнутого пространства, для очень крупных людей или для исследований, где врач должен работать рядом с пациентом, открытый доступ это настоящее преимущество. Для тонкой диагностики мозга или суставов берут более сильный туннельный аппарат.',
        },
        {
          type: 'mnemonic',
          text: '**Туннель = сильно и тесно, открытый = слабо и удобно.** Сверхпроводящему магниту нужен гелий, и он всегда включён.',
        },
        {
          type: 'exam',
          question: 'Сравни сверхпроводящий туннельный магнит и открытый МРТ-аппарат.',
          answer: 'Сверхпроводящий туннельный магнит даёт высокое поле (в клинике 1,5 до 3 Тл) с очень хорошей однородностью, поэтому много сигнала и хорошее качество изображения. Ему нужна криотехника с жидким гелием, его поле включено постоянно, а узкая труба тяжела для пациентов с клаустрофобией. Открытые аппараты с постоянным или резистивным магнитом дают свободный доступ и больше комфорта, но только слабое поле и, значит, меньше сигнала.',
          full: 'Назови функцию магнита (B₀ для суммарной намагниченности и ларморовой частоты) и связь сила поля → сигнал.',
          sim: 'scanner',
        },
      ],
    },
    {
      title: 'Шимминг и градиенты: тонкая настройка и громкий стук',
      blocks: [
        {
          type: 'p',
          text: 'Идеальных магнитов не бывает. Небольшие допуски при изготовлении, стальные балки здания и прежде всего сам пациент чуть-чуть искривляют поле. Поэтому существует **шимминг**. Английское слово shim означает «подкладка для выравнивания». При **пассивном шимминге** при установке вставляют маленькие железные пластинки. При **активном шимминге** дополнительные катушки создают слабые корректирующие поля, которые перед каждым измерением подстраивают под пациента. Цель: как можно более **однородное** $B_0$.',
        },
        {
          type: 'p',
          text: 'С **градиентными катушками** всё наоборот. Они должны сделать поле неоднородным нарочно, но контролируемо. В магните стоят **три градиентные катушки**, по одной для каждого направления x, y и z. Каждая накладывает на поле линейный наклон. Из модуля 3 ты знаешь их три задачи: выбор среза, фазовое кодирование и частотное кодирование (считывание).',
        },
        { type: 'formula', tex: 'B(x) = B_0 + G_x\\, x \\quad\\Rightarrow\\quad \\omega(x) = \\gamma\\,(B_0 + G_x x)', caption: 'градиент делает ларморову частоту зависящей от места' },
        {
          type: 'p',
          text: 'Питают катушки **градиентные усилители**. Это очень мощные источники тока, которые за доли секунды включают, выключают и переключают сотни ампер. Ведь в последовательности градиенты всё время меняются, и чем быстрее это происходит, тем быстрее измерение.',
        },
        {
          type: 'analogy',
          title: 'Градиентная катушка это огромный динамик',
          text: 'В динамике переменный ток течёт через катушку, которая сидит в магнитном поле. Сила Лоренца трясёт катушку туда-сюда, и мембрана создаёт звук. В МРТ всё так же, только гораздо крупнее: градиентная катушка находится в сильном поле $B_0$, ток быстро переключается, катушка механически дёргается. Поэтому аппарат **стучит, гудит и грохочет**, и тем громче, чем сильнее поле и быстрее переключение.',
        },
        {
          type: 'p',
          text: 'Громкость может превышать 100 децибел, как у отбойного молотка. Поэтому каждый пациент получает **защиту слуха**. Кстати, ритм стука выдаёт последовательность: у каждой своя «песня».',
        },
        {
          type: 'mnemonic',
          text: '**Шимминг выравнивает, градиенты наклоняют.** Шимминг исправляет ошибки B₀, три градиентные катушки целенаправленно создают наклоны для кодирования места, а их переключение в сильном поле создаёт шум.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Шум идёт от основного магнита». Верно: основной магнит бесшумен. Стучат быстро переключаемые градиентные катушки из-за силы Лоренца в поле B₀.',
            'Неверно: «Шимминг и градиенты одно и то же». Верно: шимминг делает поле как можно более равномерным. Градиенты нарочно делают его зависящим от места.',
          ],
        },
        {
          type: 'exam',
          question: 'Какую задачу выполняют система шимминга и градиентная система и почему МРТ-исследование такое громкое?',
          answer: 'Система шимминга (пассивно железными пластинками, активно корректирующими катушками) улучшает однородность B₀. Градиентная система состоит из трёх градиентных катушек для x, y и z с градиентными усилителями. Она накладывает на B₀ линейные изменения поля и делает ларморову частоту зависящей от места (выбор среза, фазовое и частотное кодирование). При быстром переключении градиентных токов в сильном B₀ на катушки действуют силы Лоренца, они механически вибрируют и создают шум.',
          full: 'Упомяни защиту слуха и то, что громкость растёт с B₀ и скоростью переключения.',
          sim: 'scanner',
        },
      ],
    },
    {
      title: 'РЧ-система: передача, приём и экранирование',
      blocks: [
        {
          type: 'p',
          text: 'Чтобы отклонить намагниченность, нужен импульс с ларморовой частотой. Для этого есть **РЧ-передатчик**. Он создаёт радиочастоту, формирует импульс и усиливает его до нескольких киловатт. **Передающая катушка** излучает его в ткань как поле $B_1$. Обычно это делает большая **катушка тела**, встроенная в трубу и создающая равномерное $B_1$ в большой области.',
        },
        {
          type: 'p',
          text: 'Затем нужно поймать слабое эхо протонов. Это делают **приёмные катушки**. В конспекте они прямо названы «катушки тела и головы как антенны». Есть три типичных вида:',
        },
        {
          type: 'list',
          items: [
            '**Катушка тела:** большая, встроенная, видит большую часть тела, но с большего расстояния. Хороша для обзорных снимков.',
            '**Катушка головы:** клетка, плотно охватывающая голову. Принимает равномерно со всего мозга.',
            '**Поверхностные катушки:** плоские катушки, которые кладут прямо на колено, плечо, позвоночник или грудь. Часто много маленьких элементов объединены в массив.',
          ],
        },
        {
          type: 'analogy',
          title: 'Держать микрофон у самого рта',
          text: 'Если в зале держать микрофон далеко ото рта, голос записывается тихо и с кучей шума со всего помещения. Если поднести его прямо ко рту, голос станет громким и чистым. С приёмными катушками так же: **чем ближе катушка к ткани, тем больше сигнала.** К тому же маленькая катушка «слышит» меньше шума из далёких областей тела. Поэтому поверхностная катушка на колене даёт гораздо более чёткое изображение, чем катушка тела.',
        },
        {
          type: 'p',
          text: 'Эхо протонов крошечное, и при 1,5 Тл с частотой 64 МГц оно лежит прямо в диапазоне УКВ-радио. Одна-единственная радиостанция снаружи заглушила бы сигнал. Поэтому аппарат стоит в **РЧ-кабине**, **клетке Фарадея** из медных или стальных листов в стенах, потолке, полу и двери. Она не пускает внутрь радиоволны снаружи и удерживает внутри мощные передающие импульсы. Если дверь кабины закрыта неплотно, на изображении видны полосы помех.',
        },
        {
          type: 'mnemonic',
          text: '**Передавать большой катушкой, слушать близкой катушкой, экранировать клеткой.** Близость к антенне значит больше сигнала.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «РЧ-кабина защищает окружающих от излучения, потому что МРТ радиоактивна». Верно: МРТ не использует ионизирующее излучение. Кабина прежде всего экранирует радиоволны снаружи, чтобы слабый МР-сигнал не искажался.',
            'Неверно: «Большая катушка всегда лучше, она больше видит». Верно: для мелких деталей лучше маленькая близкая катушка. Она ловит больше сигнала и меньше шума.',
          ],
        },
        {
          type: 'exam',
          question: 'Какие задачи у передающей катушки, приёмных катушек и РЧ-кабины? Зачем используют поверхностные катушки?',
          answer: 'РЧ-передатчик создаёт импульсы с ларморовой частотой, передающая катушка (обычно катушка тела) излучает их как поле B₁ и отклоняет намагниченность. Приёмные катушки работают как антенны и принимают сигнал, наведённый прецессирующей поперечной намагниченностью (катушки тела, головы, поверхностные). Поверхностные катушки лежат близко к ткани и поэтому дают больше сигнала при меньшем шуме. РЧ-кабина это клетка Фарадея, которая не пускает внешние радиопомехи и удерживает мощность передачи внутри.',
          full: 'Упомяни, что ларморова частота лежит в диапазоне УКВ-радио, и поэтому экранирование необходимо.',
          sim: 'scanner',
        },
      ],
    },
    {
      title: 'Регистрация сигнала: от велосипедной динамо-машины к комплексному числу',
      blocks: [
        {
          type: 'analogy',
          title: 'Велосипедная динамо-машина',
          text: 'В динамо-машине магнит вращается рядом с проволочной катушкой. Магнитное поле в катушке постоянно меняется, возникает переменное напряжение, и фара светит. Это **закон индукции Фарадея**. В МРТ вращающийся магнит это кружащая поперечная намагниченность. Она вращается с ларморовой частотой, и в приёмной катушке возникает крошечное переменное напряжение ровно этой частоты.',
        },
        {
          type: 'p',
          text: 'Конспект описывает сигнал как **электромагнитную волну**. В ней колеблются электрическое поле E и магнитное поле B. Оба **перпендикулярны друг другу** и направлению распространения. Это называют **поперечной волной**.',
        },
        {
          type: 'formula',
          tex: '\\vec E(\\vec r,t) = \\hat E(\\vec r)\\cdot\\cos(\\vec k\\cdot\\vec r - \\omega t + \\varphi)',
          caption: 'плоская электромагнитная волна',
        },
        {
          type: 'list',
          items: [
            '$\\hat E$ это **амплитуда**, то есть наибольшая напряжённость поля.',
            '$\\vec k$ это **волновой вектор**. Он указывает направление распространения, его модуль равен $2\\pi/\\lambda$.',
            '$\\omega$ это **угловая частота**, у нас ларморова частота.',
            '$\\varphi$ это **фаза**, то есть сдвиг волны.',
          ],
        },
        {
          type: 'p',
          text: 'Но антенна стоит в **фиксированном месте**. Там $\\vec k\\cdot\\vec r$ постоянная величина, которую можно спрятать в фазу. Остаётся простое колебание во времени. И вот приём из конспекта: его записывают как комплексное число.',
        },
        {
          type: 'figure',
          id: 'em-wave',
          caption: 'E (синее) и B (фиолетовое) перпендикулярны друг другу и направлению распространения, а λ это расстояние между двумя гребнями. Антенна в фиксированном месте видит из этого только колебание во времени: $E(t) = \\hat E\\cos(\\omega t + \\varphi)$.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} E(t) &= \\hat E\\cos(\\omega t + \\varphi) \\\\ &\\to \\hat E\\big(\\cos\\omega t + i\\sin\\omega t\\big) \\\\ &= \\hat E\\, e^{i\\omega t} = s(t) \\end{aligned}',
          caption: 'сигнал на антенне в комплексной записи, фаза спрятана в $\\hat E$',
        },
        {
          type: 'p',
          text: 'Зачем комплексно? Одна косинусоида не говорит однозначно, в какую сторону что-то вращается и где именно оно сейчас. А поперечная намагниченность это стрелка, кружащая в плоскости. Действительная и мнимая части описывают её полностью: **модуль = амплитуда**, **угол = фаза**.',
        },
        {
          type: 'p',
          text: 'Технически это делается в приёмнике **квадратурной демодуляцией**. Сигнал дважды смешивают с ларморовой частотой: один раз с косинусом, один раз с синусом, сдвинутым на 90°. Так получаются два канала: **I** (синфазный, действительная часть) и **Q** (квадратурный, мнимая часть). Вместе они дают $s(t) = I(t) + iQ(t)$. Без обоих каналов фаза потерялась бы, а она обязательно нужна для k-пространства.',
        },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Волна или индукция?',
          text: 'Катушка находится так близко к телу, что на самом деле принимает сигнал через меняющееся магнитное поле, то есть индукцией, как динамо-машина. Картинка плоской волны из конспекта это упрощение. Для комплексной записи и каналов I/Q это не имеет значения.',
        },
        {
          type: 'mnemonic',
          text: '**Кружащая намагниченность наводит напряжение, два канала спасают фазу.** I это действительная часть, Q мнимая, вместе они дают s(t).',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «k в формуле волны это k из k-пространства». Верно: здесь $\\vec k$ это волновой вектор радиоволны. k в k-пространстве это интеграл градиента по времени, умноженный на γ. Буква одна, смысл разный.',
            'Неверно: «Хватит одного приёмного канала, амплитуды достаточно». Верно: для реконструкции изображения нужны амплитуда и фаза, то есть I и Q.',
          ],
        },
        {
          type: 'exam',
          question: 'Как регистрируется МР-сигнал и почему его записывают комплексным числом $s(t) = \\hat E e^{i\\omega t}$?',
          answer: 'Поперечная намагниченность, прецессирующая с ларморовой частотой, наводит в приёмной катушке (антенне) переменное напряжение. Конспект описывает поле как поперечную волну $E(\\vec r,t) = \\hat E\\cos(\\vec k\\cdot\\vec r - \\omega t + \\varphi)$ с E ⊥ B. Для антенны в фиксированном месте остаётся $E(t) = \\hat E\\cos(\\omega t + \\varphi)$. В комплексной форме $s(t) = \\hat E e^{i\\omega t}$ сигнал содержит амплитуду (модуль) и фазу (угол). Технически квадратурная демодуляция даёт для этого каналы I (действительная часть) и Q (мнимая часть).',
          full: 'Назови закон индукции Фарадея и объясни, что фаза необходима для реконструкции через k-пространство.',
          sim: 'signal/spectrum',
        },
      ],
    },
    {
      title: 'Сигнальная цепь: от кружащего спина к готовому изображению',
      blocks: [
        {
          type: 'p',
          text: 'Теперь соберём все части в цепочку. На пути к изображению сигнал проходит несколько станций. На экзамене стоит уверенно знать этот порядок.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Приёмная катушка:** кружащая поперечная намагниченность наводит крошечное переменное напряжение порядка микровольт.',
            '**Предусилитель:** стоит как можно ближе к катушке и усиливает сигнал с очень малым шумом, пока тот не набрал помех в кабеле.',
            '**Демодуляция:** сигнал смешивают с ларморовой частотой. Высокая несущая частота уходит, остаются маленькие зависящие от места различия частот от градиентов. При этом возникают два канала I и Q.',
            '**Аналого-цифровой преобразователь (АЦП):** он с постоянным шагом дискретизирует I и Q и превращает их в числа.',
            '**Компьютер и реконструкция:** числа раскладываются в k-пространство и через обратное БПФ пересчитываются в изображение.',
            '**Изображение:** модуль или фаза показываются как оттенки серого.',
          ],
        },
        {
          type: 'analogy',
          title: 'Радиоприёмник, ловящий станцию',
          text: 'Автомагнитола делает почти то же самое. Антенна ловит много слабых станций. Усилитель их поднимает. Затем нужная станция выделяется смешиванием, высокая несущая частота исчезает, и остаётся музыка. В МРТ станция это ларморова частота, а «музыка» это маленькие различия частот и фаз, которые градиент наложил на отдельные места.',
        },
        {
          type: 'p',
          text: 'Параллельно работают передающая сторона и управление. **Компьютер** проигрывает импульсную последовательность: говорит РЧ-передатчику, когда какой импульс послать, а градиентным усилителям, когда какой градиент включён. И говорит АЦП, когда измерять. Передача, градиенты и приём должны быть согласованы с точностью до микросекунд.',
        },
        {
          type: 'figure',
          id: 'signal-chain',
          caption: 'Следуй за стрелками сверху вниз: управление запускает последовательность, магнит, градиенты и РЧ-передатчик действуют на пациента, а сигнал идёт через катушку, предусилитель и АЦП в компьютер. Пунктирные линии это сигналы управления, которые синхронизируют всё с точностью до микросекунд.',
        },
        {
          type: 'mnemonic',
          text: '**Катушка, усилитель, смеситель, АЦП, компьютер, изображение.** Сначала сигнал становится громким, потом медленным, потом цифровым, потом через БПФ превращается в изображение.',
        },
        {
          type: 'exam',
          question: 'Опиши сигнальную цепь МРТ-аппарата от приёмной катушки до изображения.',
          answer: 'Приёмная катушка (индукция от прецессирующей поперечной намагниченности) → малошумящий предусилитель рядом с катушкой → демодуляция (смешивание с ларморовой частотой, квадратурные каналы I и Q, остаются только зависящие от места различия частоты и фазы) → аналого-цифровое преобразование → компьютер: раскладка в k-пространство и реконструкция обратным БПФ → изображение (модуль в оттенках серого).',
          full: 'Упомяни, что компьютер также управляет по времени передатчиком и градиентами (импульсная последовательность).',
          sim: 'signal/spectrum',
        },
      ],
    },
    {
      title: 'Повторение: основные компоненты и коротко о безопасности',
      blocks: [
        {
          type: 'p',
          text: '**Контрольный вопрос 5** звучит так: «Каковы основные компоненты МРТ-аппарата?» Лучший ответ это структурированный список, где к каждой детали сразу указана её **функция**. Ведь цель обучения прямо говорит «компоненты вместе с функцией». Простое перечисление названий даёт только половину баллов.',
        },
        {
          type: 'table',
          head: ['Компонент', 'Функция'],
          rows: [
            ['Основной магнит (обычно сверхпроводящий, с криотехникой)', 'создаёт B₀: суммарная намагниченность M₀ и ларморова частота'],
            ['Система шимминга', 'делает B₀ однородным'],
            ['3 градиентные катушки + градиентные усилители', 'поле, зависящее от места: выбор среза, фазовое и частотное кодирование'],
            ['РЧ-передатчик + передающая катушка', 'импульс B₁ с ларморовой частотой, отклоняет намагниченность'],
            ['Приёмные катушки (тела, головы, поверхностные)', 'антенны, принимают наведённый сигнал'],
            ['Приёмник: предусилитель, демодуляция (I/Q), АЦП', 'усиливает, демодулирует и оцифровывает сигнал'],
            ['Компьютер', 'управляет последовательностью, реконструирует изображение через БПФ'],
            ['РЧ-кабина (клетка Фарадея)', 'экранирует внешние радиоволны'],
          ],
        },
        {
          type: 'p',
          text: 'Подсказка для порядка: сначала нужно **поле** (магнит и шимминг), потом **место** (градиенты), потом **толчок** (РЧ-передатчик), потом **ухо** (приёмные катушки и приёмник), потом **голова** (компьютер). А вокруг всего **оболочка** (РЧ-кабина).',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Безопасность в двух предложениях',
          text: 'Поле сверхпроводящего магнита **всегда включено**. Железосодержащие предметы, например ножницы, кислородные баллоны или кресла-коляски, с огромной силой втягиваются в магнит (**эффект снаряда**), поэтому каждого человека перед входом подробно опрашивают и проверяют на металл и импланты. При этом МРТ работает **без ионизирующего излучения**. Радиоволны лишь слегка нагревают ткань.',
        },
        {
          type: 'mnemonic',
          text: '**Поле, место, толчок, ухо, голова, оболочка.** Магнит и шимминг, градиенты, РЧ-передатчик, приёмные катушки, компьютер, РЧ-кабина. К каждой детали всегда называй функцию.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «После работы магнит выключают». Верно: сверхпроводящий магнит включён постоянно. Эффект снаряда грозит круглые сутки.',
            'Неверно: «Достаточно перечислить компоненты». Верно: для полных баллов к каждому компоненту нужна его функция.',
          ],
        },
        {
          type: 'exam',
          question: 'Каковы основные компоненты МРТ-аппарата?',
          answer: '1. Основной магнит (обычно сверхпроводящий с гелиевым охлаждением): создаёт статическое поле B₀, а значит суммарную намагниченность и ларморову частоту. 2. Система шимминга: улучшает однородность B₀. 3. Три градиентные катушки (x, y, z) с градиентными усилителями: зависящее от места изменение поля для выбора среза, фазового и частотного кодирования. 4. РЧ-передатчик с передающей катушкой: создаёт импульс B₁ с ларморовой частотой и отклоняет намагниченность. 5. Приёмные катушки (тела, головы, поверхностные) как антенны: принимают наведённый МР-сигнал. 6. Приёмник с предусилителем, демодуляцией (I/Q) и АЦП. 7. Компьютер: управление последовательностью и реконструкция изображения обратным БПФ. 8. РЧ-кабина (клетка Фарадея): экранирование от внешних радиоволн.',
          full: 'Для полных баллов к каждому компоненту назови функцию. Бонус: конструкции (туннель или открытый) и сигнальная цепь катушка → предусилитель → демодуляция → АЦП → реконструкция.',
          sim: 'scanner',
        },
      ],
    },
  ],
};
