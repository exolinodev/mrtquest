import type { Chapter } from './types';

/**
 * Modul 3: Ortskodierung.
 * Inhaltliche Grundlage: MBR-Skript „Magnetic Resonance Imaging“, Abschnitt Signals and Image Generation.
 */
export const ortskodierung: Chapter = {
  de: [
    {
      title: 'Die Grundidee: Der Ort verrät sich über die Frequenz',
      blocks: [
        {
          type: 'hook',
          text: 'Bis jetzt kennst du ein Signal, das aus dem ganzen Körper gleichzeitig kommt. Die Spule hört es, aber sie weiß nicht, **woher** es stammt. Ein Bild braucht aber genau das: Für jeden Punkt im Körper die Information, wie viel Signal von dort kommt. In diesem Modul lernst du den Trick, mit dem die MRT jedem Ort seine eigene Stimme gibt.',
        },
        {
          type: 'p',
          text: 'Der Trick steht im Skript in drei kurzen Sätzen, und alles in diesem Modul folgt daraus:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Die Larmor-Frequenz hängt vom äußeren Magnetfeld ab.',
            'Ein **Gradientenfeld** macht das Feld ortsabhängig, also auch die Larmor-Frequenz.',
            'Das ausgesendete HF-Signal lässt sich deshalb **über seine Frequenz** einem Ort zuordnen.',
          ],
        },
        {
          type: 'analogy',
          title: 'Eine Klaviertastatur',
          text: 'Auf einem Klavier hat jede Taste ihren festen Platz, und jeder Platz hat seinen eigenen Ton. Links tief, rechts hoch. Wenn du mit geschlossenen Augen einen Ton hörst, weißt du sofort, wo auf der Tastatur gespielt wurde. Der Gradient macht aus dem Körper genau so eine Tastatur: Jeder Ort entlang der Gradientenrichtung bekommt seine eigene Tonhöhe.',
        },
        {
          type: 'p',
          text: 'Ein **Gradient** ist ein Zusatzfeld, das sich gleichmäßig mit dem Ort ändert. Es zeigt in dieselbe Richtung wie $B_0$, aber seine Stärke wächst linear entlang einer Achse. Auf der einen Seite des Körpers wird das Feld etwas schwächer, auf der anderen etwas stärker, in der Mitte bleibt es genau $B_0$. Die **Gradientenstärke** $G_x$ sagt, um wie viel sich das Feld pro Meter ändert. Ihre Einheit ist Tesla pro Meter, in der Praxis Millitesla pro Meter.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} B(x) &= B_0 + G_x\\, x \\\\ \\omega(x) &= \\gamma\\,\\big(B_0 + G_x\\, x\\big) \\end{aligned}',
          caption: 'Feld und Larmor-Frequenz werden ortsabhängig',
        },
        {
          type: 'p',
          text: 'Lies die zweite Zeile so: Die Kreisfrequenz am Ort $x$ ist γ mal das Feld an diesem Ort. Das Feld besteht aus dem großen, überall gleichen $B_0$ und dem kleinen ortsabhängigen Teil $G_x x$. Das Zusatzfeld ist winzig im Vergleich zu $B_0$, oft nur einige Millitesla am Rand des Körpers. Aber es reicht, damit jeder Ort messbar anders „klingt“.',
        },
        {
          type: 'mnemonic',
          text: '**Anderes Feld, andere Frequenz, anderer Ort.** Der Gradient verwandelt den Körper in eine Klaviertastatur, und die Frequenz verrät, wo der Ton herkommt.',
        },
        {
          type: 'exam',
          question: 'Wie entsteht aus dem MR-Signal ein Bild? Erkläre das Grundprinzip der Ortskodierung.',
          answer: 'Die Larmor-Frequenz ist proportional zum lokalen Magnetfeld, $\\omega = \\gamma B$. Gradientenspulen überlagern $B_0$ mit einem linear ortsabhängigen Zusatzfeld, $B(x) = B_0 + G_x x$. Dadurch wird auch die Larmor-Frequenz ortsabhängig, $\\omega(x) = \\gamma(B_0 + G_x x)$. Das empfangene Signal ist eine Mischung vieler Frequenzen, und jede Frequenz gehört zu einem bestimmten Ort. Über die Frequenzanalyse (Fourier-Transformation) lässt sich das Signal den Orten zuordnen.',
          full: 'Nenne die drei Gradientenrollen (Schichtselektion, Frequenzkodierung, Phasenkodierung) und dass am Ende eine inverse Fourier-Transformation das Bild liefert.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Drei Gradientenspulen und die Steigung dω/dz',
      blocks: [
        {
          type: 'p',
          text: 'Im Magneten sind **drei physikalische Gradientenspulen** eingebaut, eine für jede Raumrichtung: x, y und z. Jede von ihnen kann das statische Feld entlang ihrer Achse ansteigen lassen. Man kann sie einzeln oder kombiniert einschalten. So lässt sich ein Gradient in jede beliebige Richtung erzeugen, zum Beispiel für schräge Schichten.',
        },
        {
          type: 'p',
          text: 'In der Bildgebung bekommen die Gradienten **drei Rollen**. Wichtig: Das sind Aufgaben, keine festen Spulen. Welche Spule welche Rolle übernimmt, hängt davon ab, wie die Schicht liegt.',
        },
        {
          type: 'list',
          items: [
            '**Schichtselektionsgradient** $G_{SS}$: wählt beim Anregen eine Schicht aus.',
            '**Auslese- oder Frequenzkodiergradient** $G_{RO}$: gibt während der Messung jeder Spalte ihre Frequenz.',
            '**Phasenkodiergradient** $G_{PE}$: gibt jeder Zeile vor der Messung eine eigene Phase.',
          ],
        },
        {
          type: 'p',
          text: 'Jetzt zu einer Recap-Frage aus dem Skript: „Gegeben ist ein Gradient $B(z) = B_0 z$. Welche Steigung $d\\omega/dz$ erwartet man?“ Achtung, hier ist die Schreibweise ungewöhnlich. Das Symbol $B_0$ steht in dieser Frage **nicht** für das Hauptfeld in Tesla. Es steht für die **Gradientenstärke** in Tesla pro Meter, also für das, was sonst $G_z$ heißt. Nur so ergibt $B_0 z$ ein Feld in Tesla.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\omega(z) &= \\gamma\\, B(z) = \\gamma\\, B_0\\, z \\\\ \\frac{d\\omega}{dz} &= \\gamma\\, B_0 \\\\ \\frac{df}{dz} &= \\bar\\gamma\\, B_0 \\end{aligned}',
          caption: 'Die Frequenz steigt linear, die Steigung ist γ mal Gradientenstärke',
        },
        {
          type: 'p',
          text: 'Das Ergebnis ist eine **Konstante**: Die Frequenz ändert sich überall gleich schnell mit dem Ort. Für ω ist die Einheit rad/s pro Meter, für f ist sie Hz pro Meter. Wenn zusätzlich noch das Hauptfeld da ist, also $B(z) = B_{\\text{Haupt}} + G_z z$, ändert sich nichts an der Steigung. Das konstante Hauptfeld fällt beim Ableiten weg.',
        },
        {
          type: 'p',
          text: 'Ein Zahlenbeispiel macht es greifbar. Ein Gradient von 10 mT/m ergibt $df/dz = 42{,}57\\ \\text{MHz/T} \\cdot 0{,}01\\ \\text{T/m} \\approx 426\\ \\text{kHz/m}$. Das sind rund **426 Hz pro Millimeter**. Zwei Protonen im Abstand von einem Millimeter funken also auf Frequenzen, die sich um 426 Hz unterscheiden. Das kann der Empfänger gut auseinanderhalten.',
        },
        {
          type: 'mnemonic',
          text: '**Steigung der Frequenz = γ mal Steigung des Feldes.** Bei der Recap-Frage ist „B₀“ die Gradientenstärke in T/m, also gilt dω/dz = γB₀ und df/dz = γ̄B₀.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „dω/dz hängt vom Ort z ab.“ Richtig: Bei einem linearen Gradienten ist die Steigung überall gleich, nämlich γ mal Gradientenstärke.',
            'Falsch: „Mit 42,57 MHz/T bekommt man ω.“ Richtig: 42,57 MHz/T ist γ̄ und liefert f. Für ω muss man noch mit 2π multiplizieren, γ ≈ 2,675 · 10⁸ rad/(s·T).',
          ],
        },
        {
          type: 'exam',
          question: 'Gegeben ist ein magnetischer Gradient $B(z) = B_0 z$. Welche Steigung $d\\omega/dz$ des Frequenzgradienten erwartet man?',
          answer: 'Mit der Larmor-Gleichung gilt $\\omega(z) = \\gamma B(z) = \\gamma B_0 z$. Ableiten nach z ergibt $d\\omega/dz = \\gamma B_0$, eine Konstante. Hier ist $B_0$ die Gradientenstärke in T/m. Für die Frequenz in Hz gilt entsprechend $df/dz = \\bar\\gamma B_0$ mit $\\bar\\gamma = 42{,}57$ MHz/T. Beispiel: 10 mT/m ergeben etwa 426 kHz/m bzw. 426 Hz/mm.',
          full: 'Die Einheiten nennen (rad/(s·m) bzw. Hz/m), sauber zwischen γ und γ̄ unterscheiden und erwähnen, dass ein zusätzliches homogenes Hauptfeld die Steigung nicht verändert.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Schichtselektion: Nur eine Scheibe wird angeregt',
      blocks: [
        {
          type: 'p',
          text: 'Der erste Schritt zum Bild ist, eine **Schicht** auszuwählen. Dafür wird während des HF-Pulses der Schichtselektionsgradient $G_{SS}$ eingeschaltet. Jetzt hat jede Schicht senkrecht zum Gradienten ihre eigene Larmor-Frequenz.',
        },
        {
          type: 'p',
          text: 'Der HF-Puls ist kein einzelner, unendlich reiner Ton. Er enthält ein kleines **Frequenzband** mit der Breite $\\Delta f$, man nennt das die **Bandbreite** des Pulses. Resonanz gibt es nur dort, wo die Larmor-Frequenz in dieses Band fällt. Also werden nur die Spins in einer dünnen Scheibe gekippt. Alle anderen Spins bleiben in Ruhe und senden später nichts.',
        },
        {
          type: 'formula',
          tex: '\\Delta z = \\frac{\\Delta f}{\\bar\\gamma\\, G_{SS}}',
          caption: 'Schichtdicke = Bandbreite des Pulses durch (γ̄ · Gradient)',
        },
        {
          type: 'p',
          text: 'Lies die Formel so: $\\Delta f$ ist die Bandbreite des Pulses in Hz. $\\bar\\gamma G_{SS}$ ist die Frequenzänderung pro Meter, also wie steil die „Tastatur“ ist. Teilt man das eine durch das andere, erhält man die Breite in Metern, die zu diesem Frequenzband passt. Das ist die **Schichtdicke** $\\Delta z$.',
        },
        {
          type: 'list',
          items: [
            '**Doppelter Gradient bei gleicher Bandbreite:** Die Frequenz ändert sich doppelt so schnell mit dem Ort. Dasselbe Frequenzband passt jetzt auf die halbe Strecke. Die Schicht wird **halb so dick**.',
            '**Kleinere Bandbreite bei gleichem Gradienten:** ebenfalls dünnere Schicht.',
            '**Andere Schichtposition:** Man verschiebt einfach die Mittenfrequenz des HF-Pulses. Der Gradient bleibt gleich.',
          ],
        },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Warum das so wichtig ist',
          text: 'Nach der Schichtselektion stammt das ganze Signal nur noch aus einer Scheibe. Aus einem 3D-Problem ist ein 2D-Problem geworden. Die anderen beiden Gradienten müssen jetzt nur noch die Orte innerhalb dieser Scheibe auseinanderhalten.',
        },
        {
          type: 'mnemonic',
          text: '**Steiler Gradient, dünne Schicht.** Die Schichtdicke ist Bandbreite geteilt durch γ̄G. Doppelter Gradient bei gleicher Bandbreite halbiert die Schicht.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Ein stärkerer Schichtgradient macht die Schicht dicker.“ Richtig: Er macht sie dünner, weil das gleiche Frequenzband auf eine kürzere Strecke fällt.',
            'Falsch: „Für eine andere Schichtposition muss man den Gradienten verschieben.“ Richtig: Man ändert die Mittenfrequenz des HF-Pulses.',
          ],
        },
        {
          type: 'exam',
          question: 'Wie funktioniert die Schichtselektion? Was passiert mit der Schichtdicke, wenn man den Gradienten verdoppelt und die Bandbreite des HF-Pulses gleich lässt?',
          answer: 'Während des HF-Pulses liegt der Schichtselektionsgradient an, die Larmor-Frequenz ändert sich linear entlang der Schichtrichtung. Der HF-Puls ist frequenzbegrenzt (Bandbreite $\\Delta f$) und regt nur Spins an, deren Larmor-Frequenz in diesem Band liegt. Das ist eine Schicht der Dicke $\\Delta z = \\Delta f/(\\bar\\gamma G_{SS})$. Bei doppeltem Gradienten und gleicher Bandbreite halbiert sich die Schichtdicke.',
          full: 'Erwähne, dass die Schichtposition über die Mittenfrequenz des Pulses gewählt wird und dass danach nur noch die Orte innerhalb der Schicht kodiert werden müssen.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Frequenzkodierung: Die Spule hört die Summe aller Spins',
      blocks: [
        {
          type: 'p',
          text: 'Jetzt wird es spannend, denn hier entsteht die Verbindung zwischen Signal und Bild. Die Empfangsspule hört nicht einen Spin, sondern **alle angeregten Spins gleichzeitig**. Was sie misst, ist die Summe ihrer Beiträge. Im Skript steht genau das als Formel:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s(t) &= \\hat s\\,\\big(e^{i\\omega_1 t} + e^{i\\omega_2 t} + \\dots\\big) \\\\ &= \\hat s \\sum_i e^{i\\omega_i t} \\end{aligned}',
          caption: 'Das Signal ist die Summe aller Spin-Schwingungen',
        },
        {
          type: 'p',
          text: 'Hier ist $\\hat s$ die Amplitude eines einzelnen Spinbeitrags, $\\omega_i$ die Frequenz von Spin Nummer $i$ und $e^{i\\omega t}$ die komplexe Schreibweise für eine Schwingung. Man nimmt sie, weil sie Cosinus und Sinus in einem Ausdruck zusammenfasst, so wie die Spule die Drehung in zwei Kanälen misst.',
        },
        {
          type: 'analogy',
          title: 'Ein Chor, in dem jeder Platz seinen Ton singt',
          text: 'Stell dir einen Chor vor, der in einer Reihe steht. Jeder Platz singt einen eigenen Ton, links tief, rechts hoch. Wo mehr Sänger stehen, ist dieser Ton lauter. Du hörst einen einzigen Klang, einen großen Akkord. Ein gutes Ohr, oder eben eine Fourier-Analyse, kann diesen Akkord in seine Töne zerlegen. Die Lautstärke jedes Tons sagt dir, wie viele Sänger an diesem Platz stehen. Genau so verrät die Stärke jeder Frequenz im MR-Signal, wie viele Protonen an diesem Ort sitzen.',
        },
        {
          type: 'p',
          text: 'Im Körper gibt es so unvorstellbar viele Spins, dass man nicht mehr einzeln zählt. Statt dessen beschreibt man, wie viele Spins pro Volumen an jedem Ort sitzen. Das ist die **Spindichte** oder Protonendichte $\\rho(x)$. Aus der Summe wird dann ein Integral:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\rho(x) &= \\frac{dn(x)}{dV} \\\\ s(t) &= \\int \\rho(x)\\, e^{i\\omega(x)\\, t}\\, dx \\end{aligned}',
          caption: 'Spindichte und Signal als Integral über den Ort',
        },
        {
          type: 'p',
          text: 'Während der Messung liegt der **Auslesegradient** $G_{RO}$ an, hier $G_x$. Damit gilt $\\omega(x) = \\gamma(B_0 + G_x x)$. Den großen Anteil $\\gamma B_0$ zieht der Empfänger ab, das entspricht dem **mitrotierenden Bezugssystem** aus Modul 1. Übrig bleibt nur der ortsabhängige Teil. Im Skript steht dafür kurz $\\omega(x) = \\gamma G_x x$.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\omega(x) &= \\gamma\\, G_x\\, x \\quad (\\text{rotierend}) \\\\ s(t) &= \\int \\rho(x)\\, e^{i\\gamma G_x x\\, t}\\, dx \\end{aligned}',
          caption: 'Frequenzkodiertes Signal entlang x',
        },
        {
          type: 'p',
          text: 'Schau dir diese Formel genau an, denn sie ist der Kern der ganzen MRT. Das gemessene Signal $s(t)$ ist eine **Fourier-Transformation** der Spindichte $\\rho(x)$. Um $\\rho(x)$ zurückzubekommen, also das Bild entlang x, muss man das Signal nur wieder zurücktransformieren.',
        },
        {
          type: 'mnemonic',
          text: '**Die Spule hört den ganzen Chor, die Fourier-Transformation trennt die Stimmen.** Frequenz = Ort, Lautstärke = Spindichte.',
        },
        {
          type: 'exam',
          question: 'Leite her, wie das gemessene Signal bei einem Auslesegradienten $G_x$ mit der Spindichte $\\rho(x)$ zusammenhängt.',
          answer: 'Die Spule misst die Summe aller Spinbeiträge, $s(t) = \\hat s \\sum_i e^{i\\omega_i t}$. Bei sehr vielen Spins ersetzt man die Summe durch ein Integral über die Spindichte $\\rho(x) = dn/dV$: $s(t) = \\int \\rho(x) e^{i\\omega(x)t} dx$. Mit Auslesegradient gilt $\\omega(x) = \\gamma(B_0 + G_x x)$, im rotierenden System $\\omega(x) = \\gamma G_x x$. Also $s(t) = \\int \\rho(x) e^{i\\gamma G_x x t} dx$. Das Signal ist die Fourier-Transformierte der Spindichte, die inverse Fourier-Transformation liefert $\\rho(x)$.',
          full: 'Erklären, warum im rotierenden System der Anteil γB₀ wegfällt, und dass jede Frequenz einem Ort und jede Amplitude einer Spindichte entspricht.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'Phasenkodierung: Ein kurzer Schubs, der in Erinnerung bleibt',
      blocks: [
        {
          type: 'p',
          text: 'Mit der Frequenz haben wir eine Richtung in der Schicht kodiert. Für die zweite Richtung in der Schicht kann man nicht einfach noch einmal die Frequenz nehmen. Würden während der Messung zwei Gradienten gleichzeitig anliegen, gäbe es nur einen schrägen Gradienten, und viele Orte hätten wieder dieselbe Frequenz. Darum gibt es einen anderen Trick: die **Phasenkodierung**.',
        },
        {
          type: 'analogy',
          title: 'Läufer mit kurzem Tempounterschied',
          text: 'Stell dir Läufer auf verschiedenen Bahnen vor, alle laufen gleich schnell. Für zehn Sekunden ruft der Trainer: „Bahn 1 ein bisschen langsamer, Bahn 8 ein bisschen schneller, alle anderen dazwischen.“ Danach laufen alle wieder im gleichen Tempo. Trotzdem sind sie jetzt versetzt: Bahn 8 liegt etwas vorne, Bahn 1 etwas hinten. Dieser Vorsprung bleibt bestehen. An der Position eines Läufers kannst du jetzt ablesen, auf welcher Bahn er läuft. Genau das ist die Phase.',
        },
        {
          type: 'p',
          text: 'In der MRT läuft das so: Zwischen Anregung und Auslese wird für kurze Zeit $t_{PE}$ der **Phasenkodiergradient** $G_{PE}$ eingeschaltet, hier in y-Richtung. Solange er anliegt, präzedieren Spins an verschiedenen y-Orten unterschiedlich schnell. Danach wird er abgeschaltet, und alle präzedieren wieder gleich schnell. Aber jeder Spin hat eine **ortsabhängige Phase** behalten:',
        },
        {
          type: 'formula',
          tex: '\\varphi(y) = \\gamma\\, G_{PE}\\, t_{PE}\\, y',
          caption: 'aufgesammelte Phase = γ · Gradient · Dauer · Ort',
        },
        {
          type: 'p',
          text: 'In Worten: Die Phase φ ist der Winkel, um den ein Spin am Ort y gegenüber einem Spin in der Mitte vor- oder nachläuft. Sie wächst mit der Gradientenstärke $G_{PE}$, mit der Einschaltdauer $t_{PE}$ und mit dem Abstand $y$ von der Mitte.',
        },
        {
          type: 'p',
          text: 'Eine einzige Messung reicht aber nicht, um aus der Phase alle Orte abzulesen. Die Spule sieht nur die Summe aller Phasen. Darum wird die ganze Sequenz **viele Male wiederholt**, jedes Mal mit einem etwas anderen Phasenkodiergradienten. Jede Wiederholung liefert eine Zeile an Messdaten. Erst alle Zeilen zusammen erlauben es, die y-Richtung aufzulösen. Das ist der Hauptgrund, warum MRT-Messungen Zeit brauchen.',
        },
        {
          type: 'mnemonic',
          text: '**Frequenz kodiert während der Messung, Phase kodiert davor.** Ein kurzer Gradient hinterlässt eine ortsabhängige Phase, die bleibt, auch wenn er wieder aus ist.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Während der Phasenkodierung wird das Signal gemessen.“ Richtig: Der Phasengradient liegt vor der Auslese an. Gemessen wird erst danach, unter dem Auslesegradienten.',
            'Falsch: „Eine Messung reicht für das ganze 2D-Bild.“ Richtig: In der klassischen Bildgebung braucht man so viele Phasenschritte, wie das Bild Zeilen hat.',
          ],
        },
        {
          type: 'exam',
          question: 'Erkläre den Unterschied zwischen Frequenzkodierung und Phasenkodierung.',
          answer: 'Bei der Frequenzkodierung liegt der Auslesegradient während der Signalaufnahme an. Jeder Ort entlang der Ausleserichtung sendet mit einer anderen Frequenz, $\\omega(x) = \\gamma G_x x$. Bei der Phasenkodierung wird vor der Auslese kurz ein Gradient $G_{PE}$ geschaltet. Danach präzedieren alle Spins wieder gleich schnell, haben aber eine ortsabhängige Phase $\\varphi(y) = \\gamma G_{PE} t_{PE} y$ akkumuliert. Um die Phasenrichtung aufzulösen, muss man die Messung mit verschiedenen Phasengradienten wiederholen.',
          full: 'Die Reihenfolge in der Sequenz nennen (Anregung mit G_SS, dann G_PE, dann Auslese mit G_RO) und erklären, warum die Zahl der Phasenschritte die Messzeit bestimmt.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Das Pulsdiagramm und der Weg in den k-Raum',
      blocks: [
        {
          type: 'p',
          text: 'Im Skript siehst du ein Beispiel für eine MR-Sequenz als **Pulsdiagramm**. Es sieht zuerst verwirrend aus, ist aber nur ein Fahrplan. Jede Zeile ist ein „Instrument“, und von links nach rechts läuft die Zeit. Für eine einfache Spin-Echo-Sequenz liest du es so:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**HF-Zeile:** Ein 90°-Puls regt an. Bei einer Spin-Echo-Sequenz folgt nach TE/2 ein 180°-Puls.',
            '**G_SS-Zeile:** Während jedes HF-Pulses liegt der Schichtgradient an, damit nur die gewünschte Schicht reagiert.',
            '**G_PE-Zeile:** Zwischen Anregung und Auslese kommt ein kurzer Phasengradient. Im Diagramm ist er als „Leiter“ mit vielen Stufen gezeichnet. Jede Stufe steht für eine Wiederholung mit anderer Stärke.',
            '**G_RO-Zeile:** Während das Echo entsteht, liegt der Auslesegradient an.',
            '**Signal-Zeile:** Hier erscheint das Echo zur Zeit TE und wird aufgezeichnet.',
          ],
        },
        {
          type: 'p',
          text: 'Das Ganze wiederholt sich nach der Zeit TR, jetzt mit der nächsten Stufe des Phasengradienten. So füllt die Sequenz Zeile für Zeile eine Tabelle mit Messdaten.',
        },
        {
          type: 'analogy',
          title: 'Ein Barcode-Scanner, der Streifenmuster vergleicht',
          text: 'Ein Gradient legt über die Schicht ein Muster aus Phasen, ähnlich wie Streifen auf einem Barcode. Jede Messung fragt: „Wie gut passt das Objekt zu genau diesem Streifenmuster?“ Grobe Streifen beschreiben die groben Formen, feine Streifen die Kanten und Details. Hat man genug verschiedene Streifenmuster abgefragt, kann man das Bild daraus zusammensetzen.',
        },
        {
          type: 'p',
          text: 'Mathematisch fasst man das zusammen, indem man die Gradientenwirkung über die Zeit aufsummiert. Diese Fläche unter der Gradientenkurve heißt **k**, die **Ortsfrequenz**. Im Skript steht für einen allgemeinen, zeitabhängigen Gradienten:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} k_x(t) &= \\gamma \\int_0^t G_x(\\tau)\\, d\\tau \\\\ s(k_x) &= \\int \\rho(x)\\, e^{i k_x x}\\, dx \\end{aligned}',
          caption: 'k ist die Fläche unter dem Gradienten',
        },
        {
          type: 'p',
          text: 'Bei konstantem Gradienten ist einfach $k_x = \\gamma G_x t$. Dann ist die Formel genau die aus dem Abschnitt Frequenzkodierung. In zwei Dimensionen kommt die Phasenrichtung als $k_y$ dazu:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s(k_x, k_y) = \\iint &\\rho(x, y) \\\\ \\cdot\\, &e^{i(k_x x + k_y y)}\\, dx\\, dy \\end{aligned}',
          caption: '2D-Signal als Fourier-Transformierte der Spindichte',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Tippfehler im Skript',
          text: 'Im Skript steht im 2D-Exponenten zweimal x, also $k_x x + k_y x$. Gemeint ist $k_x x + k_y y$. Die y-Ortsfrequenz gehört natürlich zur y-Koordinate.',
        },
        {
          type: 'p',
          text: 'Die Tabelle der Messwerte $s(k_x, k_y)$ heißt **k-Raum**. Das Bild $\\rho(x, y)$ bekommt man daraus mit der **inversen Fourier-Transformation**. Wie der k-Raum aufgebaut ist und warum seine Mitte den Kontrast und sein Rand die Kanten trägt, lernst du in Modul 4.',
        },
        {
          type: 'mnemonic',
          text: '**Gradientenfläche ist k, Messdaten sind der k-Raum, Rücktransformation ist das Bild.** Schicht wählen, Phase setzen, Frequenz auslesen, wiederholen.',
        },
        {
          type: 'exam',
          question: 'Beschreibe den Ablauf einer einfachen 2D-Sequenz anhand des Pulsdiagramms. Wie hängt das Messsignal mit dem Bild zusammen?',
          answer: 'Ein HF-Puls wird zusammen mit dem Schichtselektionsgradienten geschaltet, so wird eine Schicht angeregt. Danach folgt kurz der Phasenkodiergradient, der eine ortsabhängige Phase in y erzeugt. Während das Echo aufgenommen wird, liegt der Auslesegradient an (Frequenzkodierung in x). Das wird nach TR mit anderen Phasengradienten wiederholt. Die Messdaten sind $s(k_x, k_y) = \\iint \\rho(x,y) e^{i(k_x x + k_y y)} dx\\,dy$ mit $k = \\gamma\\int G\\,dt$, also die 2D-Fourier-Transformierte der Spindichte. Das Bild erhält man durch inverse Fourier-Transformation.',
          full: 'Alle fünf Zeilen des Pulsdiagramms nennen und erwähnen, dass k die Fläche unter dem Gradienten ist.',
          sim: 'fourier',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'Основная идея: место выдаёт себя через частоту',
      blocks: [
        {
          type: 'hook',
          text: 'До сих пор ты знаешь сигнал, который приходит сразу от всего тела. Катушка его слышит, но не знает, **откуда** он. А изображению нужно именно это: для каждой точки тела информация о том, сколько сигнала идёт оттуда. В этом модуле ты узнаешь трюк, с помощью которого МРТ даёт каждому месту свой собственный голос.',
        },
        {
          type: 'p',
          text: 'Трюк в конспекте описан тремя короткими фразами, и всё в этом модуле следует из них:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Ларморова частота зависит от внешнего магнитного поля.',
            '**Градиентное поле** делает поле зависящим от места, а значит, и ларморову частоту.',
            'Поэтому излучённый РЧ-сигнал можно привязать к месту **по его частоте**.',
          ],
        },
        {
          type: 'analogy',
          title: 'Клавиатура пианино',
          text: 'На пианино у каждой клавиши своё место, и у каждого места свой тон. Слева низко, справа высоко. Если ты с закрытыми глазами слышишь тон, ты сразу знаешь, где на клавиатуре сыграли. Градиент делает из тела именно такую клавиатуру: каждое место вдоль направления градиента получает свою высоту тона.',
        },
        {
          type: 'p',
          text: '**Градиент** это дополнительное поле, которое равномерно меняется с местом. Оно направлено так же, как $B_0$, но его величина линейно растёт вдоль одной оси. С одной стороны тела поле становится чуть слабее, с другой чуть сильнее, в середине остаётся ровно $B_0$. **Сила градиента** $G_x$ говорит, на сколько меняется поле на метр. Её единица тесла на метр, на практике миллитесла на метр.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} B(x) &= B_0 + G_x\\, x \\\\ \\omega(x) &= \\gamma\\,\\big(B_0 + G_x\\, x\\big) \\end{aligned}',
          caption: 'поле и ларморова частота зависят от места',
        },
        {
          type: 'p',
          text: 'Читай вторую строку так: угловая частота в точке $x$ равна γ, умноженному на поле в этой точке. Поле состоит из большого, везде одинакового $B_0$ и маленькой зависящей от места части $G_x x$. Дополнительное поле крошечное по сравнению с $B_0$, часто лишь несколько миллитесла на краю тела. Но этого хватает, чтобы каждое место «звучало» измеримо по-другому.',
        },
        {
          type: 'mnemonic',
          text: '**Другое поле, другая частота, другое место.** Градиент превращает тело в клавиатуру пианино, а частота выдаёт, откуда пришёл тон.',
        },
        {
          type: 'exam',
          question: 'Как из МР-сигнала получается изображение? Объясни основной принцип пространственного кодирования.',
          answer: 'Ларморова частота пропорциональна локальному магнитному полю, $\\omega = \\gamma B$. Градиентные катушки накладывают на $B_0$ дополнительное поле, линейно зависящее от места, $B(x) = B_0 + G_x x$. Поэтому ларморова частота тоже зависит от места, $\\omega(x) = \\gamma(B_0 + G_x x)$. Принятый сигнал это смесь многих частот, и каждая частота принадлежит определённому месту. С помощью частотного анализа (преобразования Фурье) сигнал можно распределить по местам.',
          full: 'Назови три роли градиентов (выбор среза, частотное кодирование, фазовое кодирование) и то, что в конце изображение даёт обратное преобразование Фурье.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Три градиентные катушки и наклон dω/dz',
      blocks: [
        {
          type: 'p',
          text: 'В магнит встроены **три физические градиентные катушки**, по одной на каждое направление: x, y и z. Каждая из них может заставить статическое поле расти вдоль своей оси. Их можно включать по отдельности или вместе. Так можно создать градиент в любом направлении, например для косых срезов.',
        },
        {
          type: 'p',
          text: 'В визуализации градиенты получают **три роли**. Важно: это задачи, а не закреплённые катушки. Какая катушка берёт на себя какую роль, зависит от того, как лежит срез.',
        },
        {
          type: 'list',
          items: [
            '**Градиент выбора среза** $G_{SS}$: при возбуждении выбирает срез.',
            '**Градиент считывания, или частотного кодирования,** $G_{RO}$: во время измерения даёт каждому столбцу его частоту.',
            '**Градиент фазового кодирования** $G_{PE}$: перед измерением даёт каждой строке свою фазу.',
          ],
        },
        {
          type: 'p',
          text: 'Теперь вопрос для повторения из конспекта: «Дан градиент $B(z) = B_0 z$. Какой наклон $d\\omega/dz$ ожидается?» Внимание, здесь необычная запись. Символ $B_0$ в этом вопросе **не** означает основное поле в тесла. Он означает **силу градиента** в тесла на метр, то есть то, что обычно называют $G_z$. Только тогда $B_0 z$ даёт поле в тесла.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\omega(z) &= \\gamma\\, B(z) = \\gamma\\, B_0\\, z \\\\ \\frac{d\\omega}{dz} &= \\gamma\\, B_0 \\\\ \\frac{df}{dz} &= \\bar\\gamma\\, B_0 \\end{aligned}',
          caption: 'частота растёт линейно, наклон равен γ, умноженному на силу градиента',
        },
        {
          type: 'p',
          text: 'Результат **постоянный**: частота везде одинаково быстро меняется с местом. Для ω единица рад/с на метр, для f Гц на метр. Если дополнительно есть основное поле, то есть $B(z) = B_{\\text{осн}} + G_z z$, наклон не меняется. Постоянное основное поле при дифференцировании пропадает.',
        },
        {
          type: 'p',
          text: 'Числовой пример делает это наглядным. Градиент 10 мТл/м даёт $df/dz = 42{,}57\\ \\text{МГц/Тл} \\cdot 0{,}01\\ \\text{Тл/м} \\approx 426\\ \\text{кГц/м}$. Это около **426 Гц на миллиметр**. Два протона на расстоянии одного миллиметра вещают на частотах, которые отличаются на 426 Гц. Приёмник легко их различает.',
        },
        {
          type: 'mnemonic',
          text: '**Наклон частоты = γ, умноженное на наклон поля.** В вопросе для повторения «B₀» это сила градиента в Тл/м, значит, dω/dz = γB₀ и df/dz = γ̄B₀.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «dω/dz зависит от места z». Верно: при линейном градиенте наклон везде одинаков, а именно γ, умноженное на силу градиента.',
            'Неверно: «С 42,57 МГц/Тл получается ω». Верно: 42,57 МГц/Тл это γ̄, оно даёт f. Для ω нужно ещё умножить на 2π, γ ≈ 2,675 · 10⁸ рад/(с·Тл).',
          ],
        },
        {
          type: 'exam',
          question: 'Дан магнитный градиент $B(z) = B_0 z$. Какой наклон $d\\omega/dz$ частотного градиента ожидается?',
          answer: 'По уравнению Лармора $\\omega(z) = \\gamma B(z) = \\gamma B_0 z$. Производная по z даёт $d\\omega/dz = \\gamma B_0$, это константа. Здесь $B_0$ сила градиента в Тл/м. Для частоты в Гц соответственно $df/dz = \\bar\\gamma B_0$ с $\\bar\\gamma = 42{,}57$ МГц/Тл. Пример: 10 мТл/м дают около 426 кГц/м, или 426 Гц/мм.',
          full: 'Назови единицы (рад/(с·м) или Гц/м), чётко различай γ и γ̄ и упомяни, что дополнительное однородное основное поле наклон не меняет.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Выбор среза: возбуждается только один ломтик',
      blocks: [
        {
          type: 'p',
          text: 'Первый шаг к изображению это выбрать **срез**. Для этого во время РЧ-импульса включают градиент выбора среза $G_{SS}$. Теперь у каждого слоя, перпендикулярного градиенту, своя ларморова частота.',
        },
        {
          type: 'p',
          text: 'РЧ-импульс это не один бесконечно чистый тон. Он содержит небольшую **полосу частот** шириной $\\Delta f$, это называют **шириной полосы** импульса. Резонанс есть только там, где ларморова частота попадает в эту полосу. Поэтому отклоняются только спины в тонком ломтике. Все остальные спины остаются в покое и потом ничего не излучают.',
        },
        {
          type: 'formula',
          tex: '\\Delta z = \\frac{\\Delta f}{\\bar\\gamma\\, G_{SS}}',
          caption: 'толщина среза = ширина полосы импульса, делённая на (γ̄ · градиент)',
        },
        {
          type: 'p',
          text: 'Читай формулу так: $\\Delta f$ это ширина полосы импульса в Гц. $\\bar\\gamma G_{SS}$ это изменение частоты на метр, то есть насколько крутая «клавиатура». Разделив одно на другое, получаешь ширину в метрах, которая соответствует этой полосе частот. Это **толщина среза** $\\Delta z$.',
        },
        {
          type: 'list',
          items: [
            '**Вдвое больший градиент при той же ширине полосы:** частота меняется с местом вдвое быстрее. Та же полоса частот теперь укладывается в половину расстояния. Срез становится **вдвое тоньше**.',
            '**Меньшая ширина полосы при том же градиенте:** тоже более тонкий срез.',
            '**Другое положение среза:** просто сдвигают центральную частоту РЧ-импульса. Градиент остаётся прежним.',
          ],
        },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Почему это так важно',
          text: 'После выбора среза весь сигнал идёт только из одного ломтика. Из трёхмерной задачи получилась двумерная. Двум другим градиентам остаётся только различить места внутри этого ломтика.',
        },
        {
          type: 'mnemonic',
          text: '**Крутой градиент, тонкий срез.** Толщина среза равна ширине полосы, делённой на γ̄G. Вдвое больший градиент при той же полосе делит срез пополам.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Более сильный градиент среза делает срез толще». Верно: он делает его тоньше, потому что та же полоса частот попадает на более короткий отрезок.',
            'Неверно: «Для другого положения среза нужно сдвинуть градиент». Верно: меняют центральную частоту РЧ-импульса.',
          ],
        },
        {
          type: 'exam',
          question: 'Как работает выбор среза? Что произойдёт с толщиной среза, если удвоить градиент, а ширину полосы РЧ-импульса оставить прежней?',
          answer: 'Во время РЧ-импульса включён градиент выбора среза, ларморова частота линейно меняется вдоль направления среза. РЧ-импульс ограничен по частоте (ширина полосы $\\Delta f$) и возбуждает только спины, ларморова частота которых лежит в этой полосе. Это срез толщиной $\\Delta z = \\Delta f/(\\bar\\gamma G_{SS})$. При удвоенном градиенте и той же ширине полосы толщина среза уменьшается вдвое.',
          full: 'Упомяни, что положение среза выбирают через центральную частоту импульса и что после этого нужно кодировать только места внутри среза.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Частотное кодирование: катушка слышит сумму всех спинов',
      blocks: [
        {
          type: 'p',
          text: 'Теперь становится интересно, потому что здесь возникает связь между сигналом и изображением. Приёмная катушка слышит не один спин, а **все возбуждённые спины одновременно**. Она измеряет сумму их вкладов. В конспекте это записано именно такой формулой:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s(t) &= \\hat s\\,\\big(e^{i\\omega_1 t} + e^{i\\omega_2 t} + \\dots\\big) \\\\ &= \\hat s \\sum_i e^{i\\omega_i t} \\end{aligned}',
          caption: 'сигнал это сумма колебаний всех спинов',
        },
        {
          type: 'p',
          text: 'Здесь $\\hat s$ амплитуда вклада одного спина, $\\omega_i$ частота спина номер $i$, а $e^{i\\omega t}$ комплексная запись колебания. Её используют потому, что она объединяет косинус и синус в одном выражении, так же как катушка измеряет вращение в двух каналах.',
        },
        {
          type: 'analogy',
          title: 'Хор, где каждое место поёт свой тон',
          text: 'Представь хор, стоящий в один ряд. Каждое место поёт свой тон, слева низкий, справа высокий. Где стоит больше певцов, этот тон громче. Ты слышишь один звук, большой аккорд. Хорошее ухо, или анализ Фурье, может разложить этот аккорд на тоны. Громкость каждого тона говорит, сколько певцов стоит на этом месте. Точно так же сила каждой частоты в МР-сигнале выдаёт, сколько протонов находится в этом месте.',
        },
        {
          type: 'p',
          text: 'В теле так невообразимо много спинов, что их уже не считают по одному. Вместо этого описывают, сколько спинов на единицу объёма находится в каждом месте. Это **спиновая плотность**, или протонная плотность, $\\rho(x)$. Сумма тогда превращается в интеграл:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\rho(x) &= \\frac{dn(x)}{dV} \\\\ s(t) &= \\int \\rho(x)\\, e^{i\\omega(x)\\, t}\\, dx \\end{aligned}',
          caption: 'спиновая плотность и сигнал как интеграл по месту',
        },
        {
          type: 'p',
          text: 'Во время измерения включён **градиент считывания** $G_{RO}$, здесь $G_x$. Тогда $\\omega(x) = \\gamma(B_0 + G_x x)$. Большую часть $\\gamma B_0$ приёмник вычитает, это соответствует **вращающейся системе отсчёта** из модуля 1. Остаётся только зависящая от места часть. В конспекте кратко написано $\\omega(x) = \\gamma G_x x$.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\omega(x) &= \\gamma\\, G_x\\, x \\quad (\\text{вращ. система}) \\\\ s(t) &= \\int \\rho(x)\\, e^{i\\gamma G_x x\\, t}\\, dx \\end{aligned}',
          caption: 'частотно закодированный сигнал вдоль x',
        },
        {
          type: 'p',
          text: 'Посмотри на эту формулу внимательно, это ядро всей МРТ. Измеренный сигнал $s(t)$ это **преобразование Фурье** спиновой плотности $\\rho(x)$. Чтобы получить обратно $\\rho(x)$, то есть изображение вдоль x, сигнал нужно просто преобразовать обратно.',
        },
        {
          type: 'mnemonic',
          text: '**Катушка слышит весь хор, преобразование Фурье разделяет голоса.** Частота = место, громкость = спиновая плотность.',
        },
        {
          type: 'exam',
          question: 'Выведи, как измеренный сигнал при градиенте считывания $G_x$ связан со спиновой плотностью $\\rho(x)$.',
          answer: 'Катушка измеряет сумму вкладов всех спинов, $s(t) = \\hat s \\sum_i e^{i\\omega_i t}$. При очень большом числе спинов сумму заменяют интегралом по спиновой плотности $\\rho(x) = dn/dV$: $s(t) = \\int \\rho(x) e^{i\\omega(x)t} dx$. С градиентом считывания $\\omega(x) = \\gamma(B_0 + G_x x)$, во вращающейся системе $\\omega(x) = \\gamma G_x x$. Значит, $s(t) = \\int \\rho(x) e^{i\\gamma G_x x t} dx$. Сигнал это преобразование Фурье спиновой плотности, обратное преобразование Фурье даёт $\\rho(x)$.',
          full: 'Объясни, почему во вращающейся системе часть γB₀ пропадает, и что каждая частота соответствует месту, а каждая амплитуда спиновой плотности.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'Фазовое кодирование: короткий толчок, который запоминается',
      blocks: [
        {
          type: 'p',
          text: 'Частотой мы закодировали одно направление в срезе. Для второго направления в срезе нельзя просто ещё раз взять частоту. Если бы во время измерения одновременно были включены два градиента, получился бы просто один косой градиент, и многие места снова имели бы одинаковую частоту. Поэтому есть другой трюк: **фазовое кодирование**.',
        },
        {
          type: 'analogy',
          title: 'Бегуны с коротким различием в темпе',
          text: 'Представь бегунов на разных дорожках, все бегут одинаково быстро. На десять секунд тренер кричит: «Дорожка 1 чуть медленнее, дорожка 8 чуть быстрее, остальные посередине». Потом все снова бегут в одном темпе. Но теперь они сдвинуты: дорожка 8 немного впереди, дорожка 1 немного сзади. Это опережение сохраняется. По положению бегуна теперь можно понять, на какой дорожке он бежит. Это и есть фаза.',
        },
        {
          type: 'p',
          text: 'В МРТ это происходит так: между возбуждением и считыванием на короткое время $t_{PE}$ включают **градиент фазового кодирования** $G_{PE}$, здесь в направлении y. Пока он включён, спины в разных точках y прецессируют с разной скоростью. Потом его выключают, и все снова прецессируют одинаково быстро. Но каждый спин сохранил **зависящую от места фазу**:',
        },
        {
          type: 'formula',
          tex: '\\varphi(y) = \\gamma\\, G_{PE}\\, t_{PE}\\, y',
          caption: 'набранная фаза = γ · градиент · длительность · место',
        },
        {
          type: 'p',
          text: 'Словами: фаза φ это угол, на который спин в точке y опережает или отстаёт от спина в центре. Она растёт с силой градиента $G_{PE}$, с длительностью включения $t_{PE}$ и с расстоянием $y$ от центра.',
        },
        {
          type: 'p',
          text: 'Но одного измерения недостаточно, чтобы по фазе прочитать все места. Катушка видит только сумму всех фаз. Поэтому всю последовательность **повторяют много раз**, каждый раз с немного другим градиентом фазового кодирования. Каждое повторение даёт одну строку данных. Только все строки вместе позволяют разрешить направление y. Это главная причина, почему МРТ-измерения занимают время.',
        },
        {
          type: 'mnemonic',
          text: '**Частота кодирует во время измерения, фаза до него.** Короткий градиент оставляет зависящую от места фазу, которая сохраняется, даже когда он снова выключен.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Во время фазового кодирования измеряют сигнал». Верно: фазовый градиент включён до считывания. Измеряют только потом, при градиенте считывания.',
            'Неверно: «Одного измерения хватает на всё 2D-изображение». Верно: в классической визуализации нужно столько фазовых шагов, сколько строк в изображении.',
          ],
        },
        {
          type: 'exam',
          question: 'Объясни разницу между частотным и фазовым кодированием.',
          answer: 'При частотном кодировании градиент считывания включён во время регистрации сигнала. Каждое место вдоль направления считывания излучает на своей частоте, $\\omega(x) = \\gamma G_x x$. При фазовом кодировании до считывания коротко включают градиент $G_{PE}$. После этого все спины снова прецессируют одинаково быстро, но накопили зависящую от места фазу $\\varphi(y) = \\gamma G_{PE} t_{PE} y$. Чтобы разрешить фазовое направление, измерение нужно повторять с разными фазовыми градиентами.',
          full: 'Назови порядок в последовательности (возбуждение с G_SS, затем G_PE, затем считывание с G_RO) и объясни, почему число фазовых шагов определяет время измерения.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Импульсная диаграмма и путь в k-пространство',
      blocks: [
        {
          type: 'p',
          text: 'В конспекте есть пример МР-последовательности в виде **импульсной диаграммы**. Сначала она выглядит запутанно, но это просто расписание. Каждая строка это «инструмент», а слева направо идёт время. Для простой последовательности спин-эхо читай её так:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Строка РЧ:** импульс 90° возбуждает. В последовательности спин-эхо через TE/2 следует импульс 180°.',
            '**Строка G_SS:** во время каждого РЧ-импульса включён градиент среза, чтобы реагировал только нужный срез.',
            '**Строка G_PE:** между возбуждением и считыванием идёт короткий фазовый градиент. На диаграмме он нарисован как «лесенка» с множеством ступенек. Каждая ступенька означает повторение с другой силой.',
            '**Строка G_RO:** пока возникает эхо, включён градиент считывания.',
            '**Строка сигнала:** здесь в момент TE появляется эхо и записывается.',
          ],
        },
        {
          type: 'p',
          text: 'Всё повторяется через время TR, теперь со следующей ступенькой фазового градиента. Так последовательность строка за строкой заполняет таблицу измеренных данных.',
        },
        {
          type: 'analogy',
          title: 'Сканер штрихкодов, сравнивающий полосатые узоры',
          text: 'Градиент накладывает на срез узор из фаз, похожий на полосы штрихкода. Каждое измерение спрашивает: «Насколько хорошо объект совпадает именно с этим полосатым узором?» Грубые полосы описывают общие формы, тонкие полосы края и детали. Если опросить достаточно разных узоров, из них можно собрать изображение.',
        },
        {
          type: 'p',
          text: 'Математически это обобщают, суммируя действие градиента по времени. Эта площадь под кривой градиента называется **k**, **пространственная частота**. В конспекте для общего, зависящего от времени градиента написано:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} k_x(t) &= \\gamma \\int_0^t G_x(\\tau)\\, d\\tau \\\\ s(k_x) &= \\int \\rho(x)\\, e^{i k_x x}\\, dx \\end{aligned}',
          caption: 'k это площадь под градиентом',
        },
        {
          type: 'p',
          text: 'При постоянном градиенте просто $k_x = \\gamma G_x t$. Тогда формула совпадает с формулой из раздела о частотном кодировании. В двух измерениях добавляется фазовое направление как $k_y$:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s(k_x, k_y) = \\iint &\\rho(x, y) \\\\ \\cdot\\, &e^{i(k_x x + k_y y)}\\, dx\\, dy \\end{aligned}',
          caption: '2D-сигнал как преобразование Фурье спиновой плотности',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Опечатка в конспекте',
          text: 'В конспекте в двумерном показателе экспоненты дважды стоит x, то есть $k_x x + k_y x$. Имеется в виду $k_x x + k_y y$. Пространственная частота по y, конечно, относится к координате y.',
        },
        {
          type: 'p',
          text: 'Таблица измеренных значений $s(k_x, k_y)$ называется **k-пространством**. Изображение $\\rho(x, y)$ получают из неё **обратным преобразованием Фурье**. Как устроено k-пространство и почему его центр несёт контраст, а край несёт края, ты узнаешь в модуле 4.',
        },
        {
          type: 'mnemonic',
          text: '**Площадь градиента это k, данные это k-пространство, обратное преобразование это изображение.** Выбрать срез, задать фазу, считать частоту, повторить.',
        },
        {
          type: 'exam',
          question: 'Опиши ход простой 2D-последовательности по импульсной диаграмме. Как измеренный сигнал связан с изображением?',
          answer: 'РЧ-импульс включают вместе с градиентом выбора среза, так возбуждается один срез. Затем коротко включается градиент фазового кодирования, который создаёт зависящую от места фазу по y. Пока регистрируется эхо, включён градиент считывания (частотное кодирование по x). Через TR всё повторяется с другими фазовыми градиентами. Измеренные данные $s(k_x, k_y) = \\iint \\rho(x,y) e^{i(k_x x + k_y y)} dx\\,dy$ с $k = \\gamma\\int G\\,dt$, то есть двумерное преобразование Фурье спиновой плотности. Изображение получают обратным преобразованием Фурье.',
          full: 'Назови все пять строк импульсной диаграммы и упомяни, что k это площадь под градиентом.',
          sim: 'fourier',
        },
      ],
    },
  ],
};
