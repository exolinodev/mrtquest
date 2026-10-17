import type { Chapter } from './types';

/**
 * Modul 8: SNR, SAR & Artefakte. Bonus-Praxiswissen, nicht im Vorlesungsskript.
 * Baut auf Modul 3 (Ortskodierung) und Modul 4 (k-Raum) auf.
 */
export const qualitaet: Chapter = {
  de: [
    {
      title: 'Bonus: Wie gut ist ein MRT-Bild?',
      blocks: [
        {
          type: 'hook',
          text: 'Dieses Modul ist ein **Bonus**. Es steht nicht im Vorlesungsskript und ist nicht prüfungsrelevant. Es zeigt dir aber, womit Radiologie-Teams jeden Tag kämpfen: verrauschte Bilder, zu lange Messzeiten, warme Patienten und seltsame Streifen im Bild. Das Schöne: Fast alles davon verstehst du mit dem, was du schon kennst. Vor allem mit dem **k-Raum** aus Modul 3 und 4.',
        },
        {
          type: 'p',
          text: 'Ein gutes MRT-Bild muss drei Dinge gleichzeitig schaffen. Es soll **scharf** sein, also feine Details zeigen. Es soll **rauscharm** sein, damit man Gewebe sicher unterscheiden kann. Und es soll **schnell** fertig sein, denn Patienten bewegen sich, frieren oder haben Angst im Tunnel.',
        },
        {
          type: 'analogy',
          title: 'Fotografieren in der Dämmerung',
          text: 'Stell dir vor, du fotografierst abends ohne Blitz. Willst du ein rauscharmes Foto, musst du lange belichten. Dann verwackelt es. Willst du es scharf, brauchst du viele kleine Pixel. Jedes kleine Pixel fängt aber weniger Licht und rauscht mehr. In der MRT ist es genau so: Schärfe, Rauschen und Zeit hängen aneinander.',
        },
        {
          type: 'list',
          items: [
            '**Auflösung:** kleine Voxel zeigen feine Strukturen.',
            '**SNR (Signal-zu-Rausch-Verhältnis):** wie deutlich das Signal über dem Rauschen liegt.',
            '**Messzeit:** wie lange der Patient stillliegen muss.',
          ],
        },
        {
          type: 'p',
          text: 'Dazu kommen zwei Grenzen von außen. Die **SAR** begrenzt, wie viel Radiowellen-Energie du in den Körper schicken darfst. Und **Artefakte** sind Bildfehler, die gar nichts mit dem echten Gewebe zu tun haben. Beides lernst du in diesem Modul.',
        },
        {
          type: 'mnemonic',
          text: '**Scharf, rauscharm, schnell: Wähle zwei.** Jede Protokolländerung kauft das eine mit dem anderen.',
        },
      ],
    },
    {
      title: 'SNR: Wie laut ist das Signal gegen das Rauschen?',
      blocks: [
        {
          type: 'analogy',
          title: 'Regen in Eimern auffangen',
          text: 'Stell dir vor, du misst Regen mit Eimern. Ein großer Eimer fängt viel Wasser, ein paar zufällige Spritzer fallen kaum auf. Ein winziger Becher fängt wenig, und schon ein einzelner Spritzer verfälscht die Messung. Ein Voxel ist so ein Eimer: Je größer er ist, desto mehr Protonen tragen zum Signal bei, und das Rauschen fällt weniger ins Gewicht.',
        },
        {
          type: 'p',
          text: 'Das **Rauschen** kommt vor allem vom Patienten selbst. Im leitfähigen Gewebe bewegen sich Ladungen zufällig durch die Wärme. Das erzeugt in der Spule eine winzige, zufällige Spannung. Sie liegt über allen Frequenzen gleich verteilt, man nennt das **weißes Rauschen**.',
        },
        {
          type: 'p',
          text: 'Das **SNR** sagt, wie oft das Signal größer ist als dieses Rauschen. Es hängt von fünf Stellschrauben ab:',
        },
        {
          type: 'list',
          items: [
            '**Voxelgröße:** Das Signal wächst direkt mit dem Volumen. Halbierst du die Schichtdicke, halbiert sich auch das SNR.',
            '**Mittelungen (NEX):** Du misst dieselben Daten mehrfach und addierst sie. Das Signal addiert sich immer gleich, das Rauschen nur zufällig. Darum wächst das SNR nur mit der Wurzel: doppelte Mittelungen bringen den Faktor √2 ≈ 1,41.',
            '**Bandbreite:** Eine große Empfangsbandbreite lässt mehr Rauschfrequenzen herein. Halbierte Bandbreite pro Pixel bringt den Faktor √2 an SNR, dauert aber länger beim Auslesen.',
            '**Feldstärke:** Mehr B₀ bedeutet einen größeren Spin-Überschuss (siehe Modul 1) und damit mehr Signal. Grob gilt: 3 T hat etwa doppelt so viel SNR wie 1,5 T.',
            '**Spulen:** Eine Empfangsspule nah am Organ hört viel Signal und wenig Rauschen aus dem restlichen Körper. Darum gibt es eigene Kopf-, Knie- und Wirbelsäulenspulen.',
          ],
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} SNR \\;\\propto\\;& B_0 \\cdot \\Delta x\\,\\Delta y\\,\\Delta z \\\\ &\\cdot \\sqrt{\\frac{N_{\\text{PE}} \\cdot NEX}{BW_{\\text{Pixel}}}} \\cdot f_{\\text{Spule}} \\end{aligned}',
          caption: 'Feld × Voxelvolumen × Wurzel aus Messdauer pro Bandbreite × Spulenfaktor',
        },
        {
          type: 'p',
          text: 'Lies die Formel so: $\\Delta x\\,\\Delta y\\,\\Delta z$ ist das Voxelvolumen. $N_{\\text{PE}}$ ist die Zahl der Phasenkodierschritte, also der k-Raum-Zeilen. $NEX$ ist die Zahl der Mittelungen. $BW_{\\text{Pixel}}$ ist die Bandbreite pro Pixel. Alles unter der Wurzel hat dieselbe Bedeutung: **Wie lange hast du insgesamt Signal gesammelt?** Längeres Sammeln mittelt das Rauschen besser weg.',
        },
        {
          type: 'table',
          head: ['Du änderst', 'SNR', 'Preis'],
          rows: [
            ['NEX ×2', '×1,41', 'Messzeit ×2'],
            ['Schichtdicke ×2', '×2', 'weniger Schärfe in z'],
            ['Bandbreite ×½', '×1,41', 'mehr Chemical Shift, längeres TE'],
            ['1,5 T → 3 T', 'etwa ×2', 'SAR ×4, mehr Suszeptibilität'],
          ],
        },
        {
          type: 'mnemonic',
          text: '**Großer Eimer, lange Sammelzeit, nahe Spule.** Das Volumen zählt voll, die Zeit nur unter der Wurzel.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Doppelt so viele Mittelungen verdoppeln das SNR.“ Richtig: Das SNR steigt nur um √2, weil sich das Rauschen zufällig addiert.',
            'Falsch: „Eine höhere Bandbreite verbessert das Bild in jeder Hinsicht.“ Richtig: Sie senkt das SNR, verkleinert aber Chemical-Shift-Verschiebungen und erlaubt kürzere Echozeiten.',
          ],
        },
        {
          type: 'exam',
          question: 'Ein Bild ist zu verrauscht. Nenne drei Maßnahmen, die das SNR erhöhen, und jeweils ihren Preis.',
          answer: 'Größere Voxel (z. B. dickere Schicht oder größeres FOV): SNR steigt proportional zum Volumen, dafür sinkt die Auflösung. Mehr Mittelungen: SNR steigt mit √NEX, die Messzeit steigt linear. Kleinere Bandbreite pro Pixel: SNR steigt mit 1/√BW, dafür nehmen Chemical Shift und minimales TE zu. Alternativ eine passende Oberflächenspule oder ein höheres Feld.',
          full: 'Begründe die Wurzelabhängigkeit damit, dass Signal kohärent, Rauschen aber zufällig addiert wird.',
          sim: 'protocol',
        },
      ],
    },
    {
      title: 'Messzeit: Wofür bezahlst du mit Minuten?',
      blocks: [
        {
          type: 'p',
          text: 'Aus Modul 4 weißt du: Ein Bild entsteht erst, wenn der k-Raum gefüllt ist. Bei einer klassischen Sequenz liefert jede Wiederholung (jedes TR) **eine** k-Raum-Zeile in Phasenrichtung. Die Messzeit ergibt sich deshalb fast wie ein Einkaufszettel:',
        },
        {
          type: 'formula',
          tex: 'TA = \\frac{TR \\cdot N_{\\text{PE}} \\cdot NEX}{ETL \\cdot R}',
          caption: 'Messzeit = Repetitionszeit × Zeilen × Mittelungen, geteilt durch Echos pro TR und Beschleunigung',
        },
        {
          type: 'p',
          text: '$TR$ ist die Zeit zwischen zwei Anregungen. $N_{\\text{PE}}$ ist die Zahl der Phasenkodierzeilen. $NEX$ zählt die Mittelungen. $ETL$ (Echozuglänge) sagt, wie viele Zeilen eine Turbo-Spin-Echo-Sequenz pro TR einsammelt. $R$ ist der Beschleunigungsfaktor der **parallelen Bildgebung**: Mehrere Spulen messen gleichzeitig, deshalb darf man k-Raum-Zeilen auslassen.',
        },
        {
          type: 'list',
          items: [
            '**NEX halbieren:** Zeit ×½, SNR ÷√2.',
            '**Weniger Phasenzeilen:** Zeit sinkt, aber das Pixel wird in Phasenrichtung gröber.',
            '**Längerer Echozug (ETL):** Zeit sinkt fast ohne SNR-Verlust, dafür wird das Bild unschärfer und die SAR steigt, weil mehr 180°-Pulse pro Sekunde laufen.',
            '**Parallele Bildgebung (R):** Zeit ÷R, SNR sinkt um den Faktor $g\\sqrt{R}$. Der g-Faktor beschreibt, wie gut die Spulengeometrie die fehlenden Zeilen ersetzen kann.',
            '**Kürzeres TR:** Zeit sinkt, aber der Kontrast ändert sich (mehr T1-Gewichtung, siehe Modul 2).',
          ],
        },
        {
          type: 'callout',
          variant: 'klinik',
          title: 'Zeit ist auch Bildqualität',
          text: 'Eine perfekte 8-Minuten-Sequenz ist wertlos, wenn sich der Patient nach drei Minuten bewegt. Im Alltag gewinnt oft das etwas rauschigere, aber ruhige Bild.',
        },
        {
          type: 'mnemonic',
          text: '**Jede Zeile kostet ein TR.** Wer schneller sein will, braucht weniger Zeilen, mehr Echos pro TR oder mehrere Spulen gleichzeitig.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Parallele Bildgebung ist gratis.“ Richtig: Sie spart Zeit, kostet aber SNR um $g\\sqrt{R}$.',
          ],
        },
        {
          type: 'exam',
          question: 'Eine T2-TSE mit TR = 4000 ms, 256 Phasenzeilen, NEX = 2 und ETL = 16 dauert wie lange? Wie halbierst du die Zeit mit dem geringsten SNR-Verlust?',
          answer: '$TA = 4\\ \\text{s} \\cdot 256 \\cdot 2 / 16 = 128\\ \\text{s}$, also gut 2 Minuten. Am wenigsten SNR kostet ein doppelt so langer Echozug (ETL = 32): Die Zeit halbiert sich, das SNR bleibt fast gleich, das Bild wird aber etwas unschärfer und die SAR steigt. NEX = 1 halbiert die Zeit ebenfalls, kostet aber den Faktor √2 an SNR.',
          full: 'Nenne zusätzlich parallele Bildgebung mit R = 2 und ihren SNR-Preis $g\\sqrt2$.',
          sim: 'protocol',
        },
      ],
    },
    {
      title: 'SAR: Warum der Patient warm wird',
      blocks: [
        {
          type: 'analogy',
          title: 'Eine sehr schwache Mikrowelle',
          text: 'Eine Mikrowelle erwärmt Essen, weil elektromagnetische Wellen Ladungen im Wasser hin und her schieben. Die HF-Pulse der MRT tun etwas Ähnliches, nur viel schwächer und bei anderen Frequenzen. Im leitfähigen Gewebe entstehen kleine Wirbelströme, und die werden zu Wärme. Das ist ungefährlich, solange man die Menge begrenzt.',
        },
        {
          type: 'p',
          text: 'Die **spezifische Absorptionsrate (SAR)** misst genau diese Menge. Sie gibt an, wie viel HF-Leistung ein Kilogramm Gewebe aufnimmt. Die Einheit ist Watt pro Kilogramm (W/kg).',
        },
        {
          type: 'p',
          text: 'Wovon hängt sie ab? Die Leistung einer Welle wächst mit dem **Quadrat ihrer Feldstärke**, also mit $B_1^2$. Aus Modul 1 kennst du den Flipwinkel $\\alpha = \\gamma B_1 \\tau$. Bei gleicher Pulsdauer τ braucht ein doppelter Flipwinkel ein doppeltes $B_1$ und damit **vierfache** Energie. Außerdem steigt die Larmor-Frequenz mit $B_0$, und schnellere Felder induzieren stärkere Ströme.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} SAR \\;&\\propto\\; B_1^2 \\cdot \\frac{N_{\\text{Pulse}}}{\\Delta t} \\\\ &\\propto\\; B_0^2 \\cdot \\alpha^2 \\cdot \\frac{N_{\\text{Pulse}}}{\\Delta t} \\end{aligned}',
          caption: 'Feldstärke im Quadrat, Flipwinkel im Quadrat, Pulse pro Zeit',
        },
        {
          type: 'p',
          text: '$N_{\\text{Pulse}}/\\Delta t$ ist die Zahl der HF-Pulse pro Zeit. Darum sind Turbo-Spin-Echo-Sequenzen mit vielen 180°-Pulsen die typischen SAR-Fresser. Gradientenecho-Sequenzen mit kleinen Flipwinkeln sind dagegen sehr sparsam.',
        },
        {
          type: 'p',
          text: 'Die **Grenzwerte** folgen einer einfachen Idee: Die Körpertemperatur darf nur um einen Bruchteil eines Grades steigen. Der Scanner rechnet die SAR aus Gewicht und Protokoll vorher aus. Im normalen Betriebsmodus liegt die Grenze für den ganzen Körper bei 2 W/kg, gemittelt über einige Minuten. Darum ist es so wichtig, das Gewicht des Patienten korrekt einzugeben.',
        },
        {
          type: 'list',
          items: [
            '**Kleinere Refokussierungswinkel:** 150° statt 180° spart schon fast ein Drittel.',
            '**Längeres TR oder weniger Schichten pro TR:** weniger Pulse pro Sekunde.',
            '**Kürzerer Echozug** oder ein Gradientenecho statt Spin-Echo.',
            '**Niedrigeres Feld:** von 3 T auf 1,5 T sinkt die SAR auf ein Viertel.',
          ],
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'SAR ist nicht Nervenkribbeln',
          text: 'Die SAR beschreibt Erwärmung durch das HF-Feld. Ein Kribbeln in Armen oder Rücken kommt dagegen von schnell geschalteten **Gradienten** (Nervenstimulation). Das ist eine ganz andere Sicherheitsgrenze.',
        },
        {
          type: 'mnemonic',
          text: '**Alles im Quadrat.** Doppeltes Feld oder doppelter Flipwinkel heißt vierfache Wärme.',
        },
        {
          type: 'exam',
          question: 'Eine TSE überschreitet am 3-T-Gerät die SAR-Grenze. Warum, und was kannst du tun?',
          answer: 'Die SAR ist proportional zu $B_0^2 \\alpha^2$ und zur Zahl der Pulse pro Zeit. Bei 3 T ist sie viermal so hoch wie bei 1,5 T, und eine TSE hat viele 180°-Pulse. Abhilfe: Refokussierungswinkel senken (z. B. 140°), TR verlängern, weniger Schichten pro TR, kürzerer Echozug oder Wechsel auf 1,5 T.',
          full: 'Erkläre den Zusammenhang über $\\alpha = \\gamma B_1 \\tau$: Bei gleicher Pulsdauer ist $B_1 \\propto \\alpha$, und die Leistung wächst mit $B_1^2$.',
          sim: 'protocol',
        },
      ],
    },
    {
      title: 'Artefakte im k-Raum: Bewegung und Einfaltung',
      blocks: [
        {
          type: 'p',
          text: 'Ein **Artefakt** ist etwas im Bild, das im Körper nicht existiert. Zwei der häufigsten verstehst du direkt mit dem k-Raum. Erinnere dich: Jeder Punkt im k-Raum enthält Information über das **ganze** Bild, und die Fourier-Transformation setzt alles zusammen.',
        },
        {
          type: 'analogy',
          title: 'Ein Gruppenfoto Zeile für Zeile',
          text: 'Stell dir vor, ein Gruppenfoto wird nicht auf einmal aufgenommen, sondern Streifen für Streifen über mehrere Minuten. Bewegt sich jemand zwischendurch, passen die Streifen nicht mehr zusammen. In der MRT ist es noch tückischer: Die k-Raum-Zeilen sind keine Bildstreifen, sondern Frequenzanteile. Ein Fehler in ihnen verteilt sich deshalb als **Geisterbild** über das ganze Bild.',
        },
        {
          type: 'p',
          text: '**Bewegung.** *Ursache:* Die Ausleserichtung wird in wenigen Millisekunden gemessen, die Phasenrichtung Zeile für Zeile über Sekunden bis Minuten. Atmung, Herzschlag oder Schlucken verändern die Phase von Zeile zu Zeile. *Aussehen:* Verwaschene Kopien des Organs, **Geister**, die sich immer **in Phasenrichtung** wiederholen. *Abhilfe:* Atemanhalt, EKG- oder Atemtriggerung, Navigatoren, schnellere Sequenzen, Sättigungsbalken über bewegtem Gewebe oder radiale Verfahren wie PROPELLER.',
        },
        {
          type: 'p',
          text: '**Einfaltung (Aliasing).** *Ursache:* Der Abstand der k-Raum-Zeilen legt das Sichtfeld fest, es gilt $\\Delta k = 1/FOV$. Ragt der Körper über das FOV hinaus, ist die Abtastung im k-Raum zu grob. Die Phase wiederholt sich alle 360°, und Gewebe außerhalb bekommt dieselbe Phase wie Gewebe innen. *Aussehen:* Körperteile von der einen Seite tauchen am **gegenüberliegenden Rand** wieder auf, etwa die Arme im Bauchbild. *Abhilfe:* FOV in Phasenrichtung vergrößern, **Phasen-Oversampling**, Phasen- und Leserichtung tauschen oder das Gewebe außen mit Sättigung stummschalten.',
        },
        {
          type: 'formula',
          tex: '\\Delta k_y = \\frac{1}{FOV_y}',
          caption: 'Zeilenabstand im k-Raum bestimmt das Sichtfeld',
        },
        {
          type: 'p',
          text: 'Warum faltet es in Leserichtung kaum ein? Dort tastet der Scanner einfach schneller ab und filtert hohe Frequenzen heraus. Das kostet keine Zeit. In Phasenrichtung kostet jede zusätzliche Zeile dagegen ein TR.',
        },
        {
          type: 'mnemonic',
          text: '**Phasenrichtung ist die Problemzone.** Bewegung macht dort Geister, ein zu kleines FOV faltet dort ein.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Bewegungsartefakte verschmieren nur das bewegte Organ.“ Richtig: Die Geister wiederholen sich über das ganze Bild in Phasenrichtung, auch über ruhiges Gewebe.',
            'Falsch: „Einfaltung sieht man am selben Rand.“ Richtig: Das Gewebe taucht am gegenüberliegenden Rand wieder auf.',
          ],
        },
        {
          type: 'exam',
          question: 'Im axialen Bauchbild sieht man die Arme des Patienten mitten in der Leber. Was ist passiert, und wie behebst du es?',
          answer: 'Einfaltung (Aliasing) in Phasenrichtung. Das FOV ist kleiner als der Körper, der Zeilenabstand im k-Raum ($\\Delta k = 1/FOV$) also zu groß. Die Phase der Arme wiederholt sich und wird einem Ort im FOV zugeordnet. Abhilfe: FOV in Phasenrichtung vergrößern, Phasen-Oversampling, Phasen- und Leserichtung tauschen oder Sättigungsbalken über die Arme legen.',
          full: 'Erkläre, warum das Problem fast nur in Phasenrichtung auftritt: In Leserichtung ist Oversampling zeitlich kostenlos.',
          sim: 'artifact',
        },
      ],
    },
    {
      title: 'Artefakte durch Frequenzen: Fett, Metall und Kanten',
      blocks: [
        {
          type: 'p',
          text: 'Die Ortskodierung aus Modul 3 beruht auf einer Annahme: **Frequenz bedeutet Ort.** Alles, was die Frequenz verändert, ohne dass sich der Ort ändert, schiebt Signal an die falsche Stelle. Drei Artefakte folgen genau daraus, ein viertes aus dem abgeschnittenen k-Raum.',
        },
        {
          type: 'p',
          text: '**Chemical Shift.** *Ursache:* Die Protonen im Fett sind von mehr Elektronen abgeschirmt und präzedieren etwa 3,5 ppm langsamer als im Wasser. Das sind bei 1,5 T rund 220 Hz, bei 3 T rund 440 Hz. Der Scanner hält diese Frequenzdifferenz für eine Ortsdifferenz. *Aussehen:* Fett ist **in Leserichtung verschoben**. An einer Seite eines Organs entsteht ein heller Saum, an der anderen ein dunkler, etwa an der Niere. *Abhilfe:* höhere Bandbreite pro Pixel, Fettsättigung oder Dixon-Technik.',
        },
        {
          type: 'formula',
          tex: '\\text{Verschiebung in Pixeln} = \\frac{\\Delta f_{\\text{Fett}}}{BW_{\\text{Pixel}}}',
          caption: 'Frequenzunterschied geteilt durch Bandbreite pro Pixel',
        },
        {
          type: 'p',
          text: 'Beispiel: 440 Hz bei 3 T und 220 Hz Bandbreite pro Pixel ergeben 2 Pixel Verschiebung. Mit doppelter Bandbreite ist es nur noch 1 Pixel, aber das SNR sinkt um √2. Bei EPI ist die Bandbreite in Phasenrichtung winzig. Dort wandert Fett um viele Pixel, darum ist Fettsättigung bei EPI Pflicht.',
        },
        {
          type: 'p',
          text: '**Suszeptibilität.** *Ursache:* Metall oder Grenzen zwischen Luft und Gewebe verbiegen das Magnetfeld lokal. Die Protonen dort präzedieren mit falscher Frequenz und dephasieren schnell (kurzes T2*). *Aussehen:* **schwarze Löcher** und verzerrte, ausgefranste Ränder, zum Beispiel an Zahnspangen, Hüftprothesen oder an der Schädelbasis in EPI. *Abhilfe:* Spin-Echo statt Gradientenecho (der 180°-Puls holt statische Dephasierung zurück), kurzes TE, hohe Bandbreite, 1,5 T statt 3 T oder spezielle Metallsequenzen.',
        },
        {
          type: 'p',
          text: '**Gibbs-Artefakt (Truncation).** *Ursache:* Der k-Raum wird an einer endlichen Grenze abgeschnitten. Eine scharfe Kante braucht aber unendlich viele hohe Frequenzen. Fehlen sie, schwingt das Bild an der Kante über. *Aussehen:* feine **parallele Ringe** neben harten Kontrastsprüngen, etwa im Rückenmark, wo sie eine Höhle vortäuschen können. *Abhilfe:* größere Matrix (mehr hohe k-Werte) oder ein glättender Filter, der allerdings etwas Schärfe kostet.',
        },
        {
          type: 'analogy',
          title: 'Ein Klavierakkord ohne hohe Töne',
          text: 'Eine scharfe Kante im Bild ist wie ein Klang mit vielen Obertönen. Spielst du nur die tiefen Töne, klingt er weich und hat ein leises Nachschwingen. Genau so fehlen beim abgeschnittenen k-Raum die höchsten „Töne“, und die Kante bekommt kleine Wellen.',
        },
        {
          type: 'table',
          head: ['Artefakt', 'Ursache', 'Richtung', 'Abhilfe'],
          rows: [
            ['Chemical Shift', 'Fett 3,5 ppm langsamer', 'Lesen (EPI: Phase)', 'mehr Bandbreite, Fettsättigung'],
            ['Suszeptibilität', 'Metall, Luft', 'v. a. Lesen, in EPI Phase', 'Spin-Echo, kurzes TE, 1,5 T'],
            ['Gibbs', 'k-Raum abgeschnitten', 'an Kanten', 'größere Matrix, Filter'],
          ],
        },
        {
          type: 'mnemonic',
          text: '**Falsche Frequenz heißt falscher Ort.** Fett rutscht, Metall verbiegt, und ein abgeschnittener k-Raum lässt Kanten klingeln.',
        },
        {
          type: 'exam',
          question: 'Bei einer Knie-Aufnahme mit Metallschraube sieht man ein großes schwarzes Loch. Erkläre die Ursache und zwei Gegenmaßnahmen.',
          answer: 'Suszeptibilitätsartefakt. Das Metall verzerrt das lokale Magnetfeld stark. Die Protonen in der Umgebung präzedieren mit falscher Frequenz, dephasieren schnell und werden zusätzlich falsch kodiert. Gegenmaßnahmen: Spin-Echo oder TSE statt Gradientenecho, da der 180°-Puls statische Feldfehler refokussiert. Außerdem hohe Bandbreite, kurzes TE und eher 1,5 T statt 3 T.',
          full: 'Nenne den Zusammenhang zur Ortskodierung, Frequenz wird als Ort gelesen, darum entstehen neben dem Signalverlust auch Verzerrungen.',
          sim: 'artifact',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'Бонус: насколько хорош снимок МРТ?',
      blocks: [
        {
          type: 'hook',
          text: 'Этот модуль **бонусный**. Его нет в конспекте лекций, и на экзамене его не спрашивают. Зато он показывает, с чем каждый день борется команда радиологии: шумные изображения, слишком долгие исследования, нагрев пациента и странные полосы на снимке. И приятная новость: почти всё это ты поймёшь с тем, что уже знаешь. Прежде всего с **k-пространством** из модулей 3 и 4.',
        },
        {
          type: 'p',
          text: 'Хорошее МР-изображение должно одновременно справиться с тремя задачами. Оно должно быть **чётким**, то есть показывать мелкие детали. Оно должно быть **малошумным**, чтобы ткани можно было уверенно различать. И оно должно быть готово **быстро**: пациенты двигаются, мёрзнут или боятся тоннеля.',
        },
        {
          type: 'analogy',
          title: 'Фотографировать в сумерках',
          text: 'Представь, что ты фотографируешь вечером без вспышки. Хочешь снимок без шума, нужно долго держать выдержку. Тогда кадр смажется. Хочешь чёткость, нужны мелкие пиксели. Но каждый маленький пиксель ловит меньше света и шумит сильнее. В МРТ всё точно так же: чёткость, шум и время связаны друг с другом.',
        },
        {
          type: 'list',
          items: [
            '**Разрешение:** маленькие воксели показывают тонкие структуры.',
            '**SNR (отношение сигнал/шум):** насколько отчётливо сигнал выделяется над шумом.',
            '**Время сканирования:** сколько пациенту нужно лежать неподвижно.',
          ],
        },
        {
          type: 'p',
          text: 'К этому добавляются два внешних ограничения. **SAR** ограничивает, сколько энергии радиоволн можно отправить в тело. А **артефакты** это ошибки изображения, которые не имеют ничего общего с настоящей тканью. Обе темы ты разберёшь в этом модуле.',
        },
        {
          type: 'mnemonic',
          text: '**Чётко, без шума, быстро: выбери два.** Любое изменение протокола покупает одно за счёт другого.',
        },
      ],
    },
    {
      title: 'SNR: насколько сигнал громче шума?',
      blocks: [
        {
          type: 'analogy',
          title: 'Ловить дождь вёдрами',
          text: 'Представь, что ты измеряешь дождь вёдрами. Большое ведро собирает много воды, и случайные брызги почти не заметны. Крошечный стаканчик собирает мало, и одна-единственная капля уже искажает результат. Воксель и есть такое ведро: чем он больше, тем больше протонов вносят вклад в сигнал и тем меньше значит шум.',
        },
        {
          type: 'p',
          text: '**Шум** создаёт в основном сам пациент. В электропроводящей ткани заряды хаотично двигаются из-за тепла. Это наводит в катушке крошечное случайное напряжение. Оно равномерно распределено по всем частотам, такой шум называют **белым**.',
        },
        {
          type: 'p',
          text: '**SNR** показывает, во сколько раз сигнал больше этого шума. Оно зависит от пяти рычагов:',
        },
        {
          type: 'list',
          items: [
            '**Размер вокселя:** сигнал растёт прямо пропорционально объёму. Уменьшишь толщину среза вдвое, и SNR тоже упадёт вдвое.',
            '**Усреднения (NEX):** одни и те же данные измеряют несколько раз и складывают. Сигнал всегда складывается одинаково, а шум случайно. Поэтому SNR растёт только как корень: вдвое больше усреднений дают множитель √2 ≈ 1,41.',
            '**Полоса пропускания:** широкая полоса приёма впускает больше шумовых частот. Полоса на пиксель вдвое уже даёт множитель √2 в SNR, но считывание длится дольше.',
            '**Индукция поля:** больше B₀ значит больший избыток спинов (см. модуль 1) и больше сигнала. Грубо: при 3 Тл SNR примерно вдвое выше, чем при 1,5 Тл.',
            '**Катушки:** приёмная катушка рядом с органом слышит много сигнала и мало шума от остального тела. Поэтому существуют отдельные катушки для головы, колена и позвоночника.',
          ],
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} SNR \\;\\propto\\;& B_0 \\cdot \\Delta x\\,\\Delta y\\,\\Delta z \\\\ &\\cdot \\sqrt{\\frac{N_{\\text{PE}} \\cdot NEX}{BW_{\\text{пиксель}}}} \\cdot f_{\\text{катушка}} \\end{aligned}',
          caption: 'поле × объём вокселя × корень из времени сбора на полосу × фактор катушки',
        },
        {
          type: 'p',
          text: 'Читай формулу так: $\\Delta x\\,\\Delta y\\,\\Delta z$ это объём вокселя. $N_{\\text{PE}}$ число шагов фазового кодирования, то есть строк k-пространства. $NEX$ число усреднений. $BW_{\\text{пиксель}}$ полоса пропускания на пиксель. Всё под корнем означает одно и то же: **как долго ты в сумме собирал сигнал?** Чем дольше сбор, тем лучше усредняется шум.',
        },
        {
          type: 'table',
          head: ['Что меняешь', 'SNR', 'Цена'],
          rows: [
            ['NEX ×2', '×1,41', 'время ×2'],
            ['Толщина среза ×2', '×2', 'хуже чёткость по z'],
            ['Полоса ×½', '×1,41', 'больше химический сдвиг, длиннее TE'],
            ['1,5 Тл → 3 Тл', 'примерно ×2', 'SAR ×4, больше восприимчивость'],
          ],
        },
        {
          type: 'mnemonic',
          text: '**Большое ведро, долгий сбор, близкая катушка.** Объём считается полностью, время только под корнем.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Вдвое больше усреднений вдвое увеличивают SNR». Верно: SNR растёт только в √2 раз, потому что шум складывается случайно.',
            'Неверно: «Более широкая полоса во всём улучшает снимок». Верно: она снижает SNR, но уменьшает химический сдвиг и позволяет укоротить время эха.',
          ],
        },
        {
          type: 'exam',
          question: 'Изображение слишком шумное. Назови три меры, повышающие SNR, и цену каждой из них.',
          answer: 'Более крупные воксели (например, толще срез или больше FOV): SNR растёт пропорционально объёму, но падает разрешение. Больше усреднений: SNR растёт как √NEX, время растёт линейно. Более узкая полоса на пиксель: SNR растёт как 1/√BW, но увеличиваются химический сдвиг и минимальное TE. Другие варианты: подходящая поверхностная катушка или более сильное поле.',
          full: 'Объясни зависимость от корня тем, что сигнал складывается когерентно, а шум случайно.',
          sim: 'protocol',
        },
      ],
    },
    {
      title: 'Время сканирования: за что ты платишь минутами?',
      blocks: [
        {
          type: 'p',
          text: 'Из модуля 4 ты знаешь: изображение появляется только тогда, когда k-пространство заполнено. В классической последовательности каждое повторение (каждое TR) даёт **одну** строку k-пространства в фазовом направлении. Поэтому время сканирования складывается почти как список покупок:',
        },
        {
          type: 'formula',
          tex: 'TA = \\frac{TR \\cdot N_{\\text{PE}} \\cdot NEX}{ETL \\cdot R}',
          caption: 'время = время повторения × строки × усреднения, делённое на число эхо за TR и ускорение',
        },
        {
          type: 'p',
          text: '$TR$ это время между двумя возбуждениями. $N_{\\text{PE}}$ число строк фазового кодирования. $NEX$ считает усреднения. $ETL$ (длина эхо-поезда) говорит, сколько строк турбо-спин-эхо собирает за одно TR. $R$ это коэффициент ускорения **параллельной визуализации**: несколько катушек измеряют одновременно, поэтому часть строк k-пространства можно пропустить.',
        },
        {
          type: 'list',
          items: [
            '**NEX вдвое меньше:** время ×½, SNR ÷√2.',
            '**Меньше фазовых строк:** время сокращается, но пиксель в фазовом направлении становится крупнее.',
            '**Длиннее эхо-поезд (ETL):** время сокращается почти без потери SNR, зато изображение размывается, а SAR растёт, потому что в секунду идёт больше импульсов 180°.',
            '**Параллельная визуализация (R):** время ÷R, SNR падает в $g\\sqrt{R}$ раз. g-фактор описывает, насколько хорошо геометрия катушек заменяет пропущенные строки.',
            '**Короче TR:** время сокращается, но меняется контраст (больше T1-взвешенности, см. модуль 2).',
          ],
        },
        {
          type: 'callout',
          variant: 'klinik',
          title: 'Время тоже качество',
          text: 'Идеальная последовательность на 8 минут бесполезна, если пациент шевельнётся через три. На практике часто побеждает чуть более шумное, но спокойное изображение.',
        },
        {
          type: 'mnemonic',
          text: '**Каждая строка стоит одно TR.** Хочешь быстрее: меньше строк, больше эхо за TR или несколько катушек сразу.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Параллельная визуализация бесплатна». Верно: она экономит время, но стоит SNR в $g\\sqrt{R}$ раз.',
          ],
        },
        {
          type: 'exam',
          question: 'Сколько длится T2-TSE с TR = 4000 мс, 256 фазовыми строками, NEX = 2 и ETL = 16? Как сократить время вдвое с наименьшей потерей SNR?',
          answer: '$TA = 4\\ \\text{с} \\cdot 256 \\cdot 2 / 16 = 128\\ \\text{с}$, то есть чуть больше 2 минут. Меньше всего SNR стоит вдвое более длинный эхо-поезд (ETL = 32): время сокращается вдвое, SNR почти не меняется, но изображение немного размывается и растёт SAR. NEX = 1 тоже вдвое сокращает время, но стоит множителя √2 в SNR.',
          full: 'Дополнительно назови параллельную визуализацию с R = 2 и её цену в SNR: $g\\sqrt2$.',
          sim: 'protocol',
        },
      ],
    },
    {
      title: 'SAR: почему пациенту становится тепло',
      blocks: [
        {
          type: 'analogy',
          title: 'Очень слабая микроволновка',
          text: 'Микроволновка греет еду, потому что электромагнитные волны раскачивают заряды в воде. РЧ-импульсы МРТ делают нечто похожее, только гораздо слабее и на других частотах. В электропроводящей ткани возникают маленькие вихревые токи, и они превращаются в тепло. Это безопасно, пока количество энергии ограничено.',
        },
        {
          type: 'p',
          text: '**Удельный коэффициент поглощения (SAR)** измеряет именно это количество. Он показывает, какую мощность РЧ поглощает один килограмм ткани. Единица: ватт на килограмм (Вт/кг).',
        },
        {
          type: 'p',
          text: 'От чего он зависит? Мощность волны растёт с **квадратом её напряжённости**, то есть с $B_1^2$. Из модуля 1 ты знаешь угол отклонения $\\alpha = \\gamma B_1 \\tau$. При той же длительности импульса τ для вдвое большего угла нужно вдвое большее $B_1$, а значит, **вчетверо** больше энергии. Кроме того, ларморова частота растёт с $B_0$, а более быстрые поля наводят более сильные токи.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} SAR \\;&\\propto\\; B_1^2 \\cdot \\frac{N_{\\text{имп}}}{\\Delta t} \\\\ &\\propto\\; B_0^2 \\cdot \\alpha^2 \\cdot \\frac{N_{\\text{имп}}}{\\Delta t} \\end{aligned}',
          caption: 'поле в квадрате, угол отклонения в квадрате, импульсы за единицу времени',
        },
        {
          type: 'p',
          text: '$N_{\\text{имп}}/\\Delta t$ это число РЧ-импульсов за единицу времени. Поэтому турбо-спин-эхо со множеством импульсов 180° типичные «пожиратели» SAR. Градиентное эхо с малыми углами отклонения, наоборот, очень экономно.',
        },
        {
          type: 'p',
          text: '**Предельные значения** следуют простой идее: температура тела может подняться лишь на доли градуса. Томограф заранее рассчитывает SAR по весу пациента и протоколу. В обычном режиме работы предел для всего тела составляет 2 Вт/кг, усреднённо за несколько минут. Поэтому так важно правильно ввести вес пациента.',
        },
        {
          type: 'list',
          items: [
            '**Меньшие рефокусирующие углы:** 150° вместо 180° экономят почти треть.',
            '**Длиннее TR или меньше срезов за TR:** меньше импульсов в секунду.',
            '**Короче эхо-поезд** или градиентное эхо вместо спин-эхо.',
            '**Слабее поле:** при переходе с 3 Тл на 1,5 Тл SAR падает в четыре раза.',
          ],
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'SAR это не покалывание нервов',
          text: 'SAR описывает нагрев РЧ-полем. Покалывание в руках или спине вызывают быстро переключаемые **градиенты** (стимуляция нервов). Это совсем другой предел безопасности.',
        },
        {
          type: 'mnemonic',
          text: '**Всё в квадрате.** Вдвое сильнее поле или вдвое больше угол означает вчетверо больше тепла.',
        },
        {
          type: 'exam',
          question: 'TSE на аппарате 3 Тл превышает предел SAR. Почему и что можно сделать?',
          answer: 'SAR пропорционален $B_0^2 \\alpha^2$ и числу импульсов за единицу времени. При 3 Тл он вчетверо выше, чем при 1,5 Тл, а в TSE много импульсов 180°. Решения: уменьшить рефокусирующий угол (например, до 140°), удлинить TR, взять меньше срезов за TR, укоротить эхо-поезд или перейти на 1,5 Тл.',
          full: 'Объясни связь через $\\alpha = \\gamma B_1 \\tau$: при той же длительности импульса $B_1 \\propto \\alpha$, а мощность растёт как $B_1^2$.',
          sim: 'protocol',
        },
      ],
    },
    {
      title: 'Артефакты в k-пространстве: движение и наложение',
      blocks: [
        {
          type: 'p',
          text: '**Артефакт** это то, что есть на снимке, но чего нет в теле. Два самых частых ты поймёшь прямо через k-пространство. Вспомни: каждая точка k-пространства несёт информацию обо **всём** изображении, а преобразование Фурье собирает всё вместе.',
        },
        {
          type: 'analogy',
          title: 'Групповое фото по строчкам',
          text: 'Представь, что групповое фото снимают не сразу, а полоску за полоской в течение нескольких минут. Если кто-то в это время шевельнётся, полоски перестанут совпадать. В МРТ всё ещё коварнее: строки k-пространства это не полоски картинки, а частотные составляющие. Поэтому ошибка в них расходится по всему изображению в виде **фантома**.',
        },
        {
          type: 'p',
          text: '**Движение.** *Причина:* направление считывания измеряется за несколько миллисекунд, а фазовое направление строка за строкой за секунды или минуты. Дыхание, сердцебиение или глотание меняют фазу от строки к строке. *Как выглядит:* размытые копии органа, **фантомы**, которые всегда повторяются **в фазовом направлении**. *Что делать:* задержка дыхания, синхронизация по ЭКГ или дыханию, навигаторы, более быстрые последовательности, полосы насыщения на движущейся ткани или радиальные методы вроде PROPELLER.',
        },
        {
          type: 'p',
          text: '**Наложение (aliasing).** *Причина:* шаг между строками k-пространства задаёт поле обзора, $\\Delta k = 1/FOV$. Если тело выходит за FOV, выборка в k-пространстве слишком грубая. Фаза повторяется каждые 360°, и ткань снаружи получает ту же фазу, что и ткань внутри. *Как выглядит:* части тела с одной стороны появляются у **противоположного края**, например руки на снимке живота. *Что делать:* увеличить FOV в фазовом направлении, **фазовая передискретизация** (oversampling), поменять местами фазовое и частотное направление или «заглушить» ткань снаружи насыщением.',
        },
        {
          type: 'formula',
          tex: '\\Delta k_y = \\frac{1}{FOV_y}',
          caption: 'шаг строк в k-пространстве задаёт поле обзора',
        },
        {
          type: 'p',
          text: 'Почему в направлении считывания наложения почти нет? Там томограф просто чаще берёт отсчёты и отфильтровывает высокие частоты. Это не стоит времени. В фазовом направлении каждая лишняя строка, наоборот, стоит одно TR.',
        },
        {
          type: 'mnemonic',
          text: '**Фазовое направление главная зона риска.** Движение рождает там фантомы, слишком маленькое FOV даёт там наложение.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Артефакты движения размывают только движущийся орган». Верно: фантомы повторяются по всему изображению в фазовом направлении, в том числе поверх неподвижной ткани.',
            'Неверно: «Наложение видно у того же края». Верно: ткань появляется у противоположного края.',
          ],
        },
        {
          type: 'exam',
          question: 'На аксиальном снимке живота руки пациента видны прямо посреди печени. Что произошло и как это исправить?',
          answer: 'Наложение (aliasing) в фазовом направлении. FOV меньше тела, значит шаг строк в k-пространстве ($\\Delta k = 1/FOV$) слишком велик. Фаза рук повторяется, и их сигнал приписывается месту внутри FOV. Решение: увеличить FOV в фазовом направлении, фазовая передискретизация, поменять фазовое и частотное направление или положить полосы насыщения на руки.',
          full: 'Объясни, почему проблема почти всегда возникает в фазовом направлении: в направлении считывания передискретизация по времени бесплатна.',
          sim: 'artifact',
        },
      ],
    },
    {
      title: 'Артефакты из-за частот: жир, металл и края',
      blocks: [
        {
          type: 'p',
          text: 'Пространственное кодирование из модуля 3 опирается на одно допущение: **частота означает место.** Всё, что меняет частоту без изменения места, переносит сигнал не туда. Из этого прямо следуют три артефакта, а четвёртый из обрезанного k-пространства.',
        },
        {
          type: 'p',
          text: '**Химический сдвиг.** *Причина:* протоны жира сильнее экранированы электронами и прецессируют примерно на 3,5 ppm медленнее, чем в воде. Это около 220 Гц при 1,5 Тл и около 440 Гц при 3 Тл. Томограф принимает эту разницу частот за разницу в положении. *Как выглядит:* жир **смещён в направлении считывания**. С одной стороны органа появляется светлая кайма, с другой тёмная, например у почки. *Что делать:* более широкая полоса на пиксель, жироподавление или метод Диксона.',
        },
        {
          type: 'formula',
          tex: '\\text{сдвиг в пикселях} = \\frac{\\Delta f_{\\text{жир}}}{BW_{\\text{пиксель}}}',
          caption: 'разница частот, делённая на полосу на пиксель',
        },
        {
          type: 'p',
          text: 'Пример: 440 Гц при 3 Тл и полоса 220 Гц на пиксель дают сдвиг на 2 пикселя. С вдвое более широкой полосой остаётся 1 пиксель, но SNR падает в √2 раз. В EPI полоса в фазовом направлении крошечная. Там жир уезжает на много пикселей, поэтому в EPI жироподавление обязательно.',
        },
        {
          type: 'p',
          text: '**Магнитная восприимчивость.** *Причина:* металл или границы между воздухом и тканью локально искривляют магнитное поле. Протоны там прецессируют с неверной частотой и быстро дефазируются (короткое T2*). *Как выглядит:* **чёрные дыры** и искажённые, рваные края, например у брекетов, эндопротезов тазобедренного сустава или у основания черепа в EPI. *Что делать:* спин-эхо вместо градиентного эха (импульс 180° возвращает статическую дефазировку), короткое TE, широкая полоса, 1,5 Тл вместо 3 Тл или специальные последовательности для металла.',
        },
        {
          type: 'p',
          text: '**Артефакт Гиббса (усечение).** *Причина:* k-пространство обрезано на конечной границе. А резкому краю нужно бесконечно много высоких частот. Если их нет, изображение у края «перехлёстывает». *Как выглядит:* тонкие **параллельные кольца** рядом с резкими перепадами контраста, например в спинном мозге, где они могут имитировать полость. *Что делать:* больше матрица (больше высоких значений k) или сглаживающий фильтр, который, правда, немного снижает чёткость.',
        },
        {
          type: 'analogy',
          title: 'Аккорд на пианино без высоких нот',
          text: 'Резкий край на изображении похож на звук с множеством обертонов. Если сыграть только низкие ноты, звук становится мягким и слегка «звенит» после удара. Точно так же в обрезанном k-пространстве не хватает самых высоких «нот», и на краю появляются маленькие волны.',
        },
        {
          type: 'table',
          head: ['Артефакт', 'Причина', 'Направление', 'Что делать'],
          rows: [
            ['Химический сдвиг', 'жир на 3,5 ppm медленнее', 'считывание (EPI: фаза)', 'шире полоса, жироподавление'],
            ['Восприимчивость', 'металл, воздух', 'в основном считывание, в EPI фаза', 'спин-эхо, короткое TE, 1,5 Тл'],
            ['Гиббс', 'обрезанное k-пространство', 'у краёв', 'больше матрица, фильтр'],
          ],
        },
        {
          type: 'mnemonic',
          text: '**Неверная частота значит неверное место.** Жир съезжает, металл искривляет, а обрезанное k-пространство заставляет края звенеть.',
        },
        {
          type: 'exam',
          question: 'На снимке колена с металлическим винтом видна большая чёрная дыра. Объясни причину и назови две контрмеры.',
          answer: 'Артефакт магнитной восприимчивости. Металл сильно искажает локальное магнитное поле. Протоны вокруг прецессируют с неверной частотой, быстро дефазируются и к тому же неправильно кодируются по месту. Контрмеры: спин-эхо или TSE вместо градиентного эха, поскольку импульс 180° рефокусирует статические ошибки поля. Кроме того, широкая полоса, короткое TE и скорее 1,5 Тл, чем 3 Тл.',
          full: 'Свяжи с пространственным кодированием. Частота читается как место, поэтому кроме потери сигнала возникают и искажения.',
          sim: 'artifact',
        },
      ],
    },
  ],
};
