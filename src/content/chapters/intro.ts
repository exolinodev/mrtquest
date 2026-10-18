import type { Loc } from '../../i18n/format';
import type { Chapter } from './types';

/** Eröffnung des Kapitels: Gliederung und Lernziele des Skripts, damit man weiß, wohin die Reise geht. */
export const einfuehrungIntro: Chapter = {
  de: [
    {
      title: 'Worum es in diesem Kapitel geht',
      blocks: [
        {
          type: 'hook',
          text: 'Die MRT ist eines der eindrucksvollsten Werkzeuge der Medizin: Sie zeigt Gehirn, Gelenke, Herz und sogar ein ungeborenes Kind, ohne einen einzigen Röntgenstrahl. Die Physik dahinter wirkt zuerst wie ein Berg. Dieser Lernpfad bringt dich Schritt für Schritt nach oben, genau in der Reihenfolge deines Vorlesungsskripts.',
        },
        {
          type: 'p',
          text: 'Das Skript ist in vier Teile gegliedert, und genau so ist auch diese App aufgebaut:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Einführung:** Wofür braucht man die MRT, und was kann sie besonders gut? (Dieses Modul)',
            '**Physikalisches Prinzip:** Warum Protonen im Magnetfeld ein Signal aussenden: Kernspin, Larmor-Frequenz, Bloch-Gleichung, HF-Puls und Relaxation.',
            '**Vom Signal zum Bild:** Wie man das Signal empfängt, jedem Ort eine eigene Frequenz gibt und mit der Fourier-Transformation ein Bild daraus rechnet. Dazu das Gerät mit seinen Komponenten.',
            '**Klinische Anwendungen:** Was man damit in der Klinik sieht und misst, von Kontrastmittel bis Traktografie.',
          ],
        },
        {
          type: 'p',
          text: 'Am Ende des Skripts steht noch ein Anhang zur **Fourier-Transformation** und die Aufgabe für **Lab 3**. Beides findest du hier als eigenes Modul und in der Prüfungsvorbereitung.',
        },
        {
          type: 'analogy',
          title: 'Eine Bergtour mit Karte',
          text: 'Im Skript steht neben den Kontrollfragen ein Berg mit einem roten Weg und zwei Fragezeichen. Genau so fühlt sich das Thema an: Von unten sieht der Gipfel weit weg aus. Mit einer Karte, festen Etappen und Pausen an den Aussichtspunkten kommst du aber sicher hoch. Die Module sind die Etappen, die Merksätze sind die Aussichtspunkte.',
        },
        {
          type: 'p',
          text: 'Laut Skript sollst du nach dem Kapitel vier Dinge können. Genau daran orientiert sich die Prüfung:',
        },
        {
          type: 'list',
          items: [
            'die **physikalischen Prinzipien** der MRT erklären,',
            'erklären, wie aus den gemessenen **Signalen ein Bild** entsteht,',
            'die wesentlichen **technischen Komponenten** samt Funktion beschreiben,',
            'typische **Anwendungen und Indikationen** nennen.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Prinzip, Bild, Technik, Anwendung.** Vier Lernziele, vier Teile des Skripts. Wenn du zu jedem Teil frei erzählen kannst, bist du bereit.',
        },
        {
          type: 'exam',
          question: 'Welche Vorteile hat die MRT gegenüber Röntgen und CT?',
          answer: 'Die MRT arbeitet ohne ionisierende Strahlung, nur mit Magnetfeld und Radiowellen. Sie hat einen sehr guten Weichteilkontrast, weil sie das Signal der Protonen in Wasser und Fett misst, und dieser Kontrast lässt sich über die Messparameter einstellen. Neben der Anatomie liefert sie auch funktionelle Informationen wie Blutfluss, Diffusion oder Stoffwechsel.',
          full: 'Nenne auch die Grenzen: Knochen erscheint dunkel, die Messung dauert länger, und Metallimplantate sowie Herzschrittmacher erfordern besondere Vorsicht.',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'MRT im Vergleich: Röntgen, CT, Ultraschall, PET',
      blocks: [
        {
          type: 'p',
          text: 'In der Klinik steht die MRT nie allein. Je nach Frage greift man zu Röntgen, CT, Ultraschall oder PET. Damit du verstehst, wann die MRT die beste Wahl ist, lohnt sich eine einfache Frage: **Was misst jedes Verfahren eigentlich physikalisch?** Wer das weiß, kann Stärken und Schwächen fast von selbst ableiten.',
        },
        {
          type: 'analogy',
          title: 'Fünf Arten, ein dunkles Haus zu erkunden',
          text: 'Stell dir ein dunkles Haus vor, in das du nicht hineingehen darfst. Du kannst mit einer starken Lampe hindurchleuchten und den Schatten an der Rückwand ansehen (Röntgen). Du kannst einmal um das Haus herumgehen und Schatten aus allen Richtungen sammeln (CT). Du kannst rufen und auf das Echo von den Wänden horchen (Ultraschall). Du kannst leuchtende Bonbons verteilen und schauen, in welchen Zimmern sie gegessen werden (PET). Oder du stellst einen Magneten auf und hörst den winzigen Radiosendern zu, die in jedem Wassertropfen im Haus stecken (MRT).',
        },
        {
          type: 'p',
          text: '**Röntgen und CT** schicken Röntgenstrahlen durch den Körper und messen, wie viel davon auf der anderen Seite ankommt. Das Gewebe schwächt den Strahl ab. Wie stark, hängt vor allem von der Dichte der Elektronen und von der Ordnungszahl der Atome ab. Knochen mit seinem Calcium schwächt stark, er erscheint hell. Luft schwächt kaum, sie bleibt dunkel. Die verschiedenen Weichteile liegen dagegen alle nah beieinander. Das CT dreht Röhre und Detektor um den Körper und rechnet aus den vielen Projektionen ein **Schnittbild**. Beide Verfahren benutzen **ionisierende Strahlung**.',
        },
        {
          type: 'p',
          text: '**Ultraschall** schickt Schallwellen in den Körper. An jeder Grenzfläche zwischen zwei Geweben wird ein Teil des Schalls zurückgeworfen. Aus der Laufzeit des Echos berechnet das Gerät, wie tief die Grenzfläche liegt. Ultraschall ist schnell, günstig, beweglich am Bett und arbeitet **ohne ionisierende Strahlung**. Durch Knochen und Luft kommt der Schall aber kaum hindurch, und das Bild hängt stark von der Erfahrung der untersuchenden Person ab.',
        },
        {
          type: 'p',
          text: '**PET** (Positronen-Emissions-Tomografie) misst keinen Schatten und kein Echo, sondern einen **Tracer**. Das ist ein Stoff, der mit einem radioaktiven Atom markiert ist, zum Beispiel Traubenzucker mit Fluor-18. Der Körper verteilt ihn dorthin, wo viel Stoffwechsel stattfindet, etwa in einen Tumor. Beim Zerfall entsteht ein Positron. Es zerstrahlt mit einem Elektron zu **zwei Gammaquanten**, die in entgegengesetzte Richtungen fliegen. Ein Ring aus Detektoren fängt beide gleichzeitig auf. So zeigt PET die **Funktion**, aber nur wenig Anatomie. Wegen des radioaktiven Tracers ist auch PET **ionisierend**.',
        },
        {
          type: 'p',
          text: '**MRT** misst etwas ganz anderes: die **Protonen** in Wasser und Fett und ihre **magnetische Umgebung**. Ein starkes Magnetfeld richtet sie aus, Radiowellen regen sie an, und die Protonen senden selbst ein schwaches Radiosignal zurück. Wie stark und wie lange sie senden, hängt davon ab, wie viele bewegliche Protonen ein Gewebe hat und wie sie mit ihrer Nachbarschaft wechselwirken. Genau darin unterscheiden sich die Weichteile deutlich. Dafür gibt es **keine ionisierende Strahlung**.',
        },
        {
          type: 'figure',
          id: 'modality-compare',
          caption: 'Fünf Verfahren, fünf Messprinzipien. Achte auf die Plaketten: Nur Ultraschall und MRT kommen ohne ionisierende Strahlung aus.',
        },
        {
          type: 'table',
          head: ['Verfahren', 'misst', 'ionisierend', 'typische Frage'],
          rows: [
            ['Röntgen', 'Schwächung des Strahls', 'ja', 'Ist der Knochen gebrochen? Lunge frei?'],
            ['CT', 'Schwächung, als Schnittbild', 'ja', 'Notfall: Blutung im Kopf, Verletzungen'],
            ['Ultraschall', 'Echos an Grenzflächen', 'nein', 'Bauchorgane, Herz, Kind im Bauch'],
            ['PET', 'Verteilung eines Tracers', 'ja', 'Wo im Körper ist ein aktiver Tumor?'],
            ['MRT', 'Protonen und ihre Umgebung', 'nein', 'Gehirn, Rückenmark, Gelenke, Bänder'],
          ],
        },
        {
          type: 'table',
          head: ['Verfahren', 'Stärken', 'Schwächen'],
          rows: [
            ['Röntgen', 'schnell, günstig, Knochen gut', 'Überlagerung, Weichteile schwach'],
            ['CT', 'sehr schnell, Knochen und Lunge', 'höhere Dosis, Weichteile mäßig'],
            ['Ultraschall', 'am Bett, in Echtzeit, günstig', 'nicht durch Knochen und Luft'],
            ['PET', 'zeigt Stoffwechsel', 'wenig Anatomie, radioaktiver Tracer'],
            ['MRT', 'bester Weichteilkontrast, frei wählbar', 'langsam, laut, eng, Metall heikel'],
          ],
        },
        {
          type: 'p',
          text: 'Du siehst: Kein Verfahren ist „das beste“. Im Notfall mit Verdacht auf eine Hirnblutung gewinnt oft das CT, weil es in wenigen Sekunden fertig ist. Für eine feine Frage am Rückenmark oder an einem Kreuzband gewinnt die MRT. Manchmal kombiniert man auch zwei Verfahren in einem Gerät, zum Beispiel PET mit MRT. Dazu mehr im Modul „Klinische Anwendungen“.',
        },
        {
          type: 'mnemonic',
          text: '**Schatten, Echo, Tracer, Spin.** Röntgen und CT messen Schatten, Ultraschall misst Echos, PET misst einen Tracer, und die MRT hört den Protonen zu. Strahlenfrei sind nur Echo und Spin.',
        },
        {
          type: 'exam',
          question: 'Vergleiche MRT mit CT und Ultraschall: Was misst jedes Verfahren, und wann setzt du welches ein?',
          answer: 'Das CT misst die Schwächung von Röntgenstrahlen, die vor allem von Elektronendichte und Ordnungszahl abhängt, und rechnet daraus Schnittbilder. Es ist sehr schnell und zeigt Knochen und Lunge gut, benutzt aber ionisierende Strahlung. Ultraschall misst Echos an Grenzflächen zwischen Geweben. Er ist günstig, strahlenfrei und am Bett einsetzbar, kommt aber nicht durch Knochen und Luft. Die MRT misst das Signal der Protonen in Wasser und Fett, das von Protonendichte und magnetischer Umgebung (T1, T2) abhängt. Sie hat den besten Weichteilkontrast und ist strahlenfrei, dauert aber länger. Daher: CT im Notfall und bei Knochen, Ultraschall als schnelle Basisuntersuchung, MRT für Gehirn, Rückenmark und Gelenke.',
          full: 'Für volle Punkte nennst du zu jedem Verfahren die Messgröße, ob es ionisierend ist, und mindestens eine Stärke und eine Schwäche. Ein Satz zu PET (Tracer, Funktion statt Anatomie) rundet die Antwort ab.',
          sim: 'modality',
        },
      ],
    },
    {
      title: 'Warum Weichteile leuchten und Knochen dunkel bleibt',
      blocks: [
        {
          type: 'p',
          text: 'Im Vergleich hast du gesehen: Die MRT hört den Protonen zu. Daraus folgt eine einfache Regel. **Wo viele bewegliche Protonen sind, kann Signal entstehen. Wo keine sind, bleibt es dunkel.** Die wichtigste Protonenquelle im Körper ist Wasser. Deshalb lohnt sich ein Blick darauf, wie viel Wasser in den verschiedenen Geweben steckt.',
        },
        {
          type: 'table',
          head: ['Gewebe', 'Wassergehalt (ungefähr)', 'Bemerkung'],
          rows: [
            ['Liquor (Hirnwasser)', 'ca. 99 %', 'fast reines, freies Wasser'],
            ['graue Substanz', 'ca. 80 %', 'Nervenzellkörper'],
            ['Muskel', 'ca. 75 %', 'viel Wasser in und zwischen Fasern'],
            ['weiße Substanz', 'ca. 70 %', 'Nervenfasern mit fettreichem Myelin'],
            ['Fett', 'ca. 10 bis 20 %', 'Signal kommt von den Fettprotonen'],
            ['kompakter Knochen', 'ca. 10 bis 20 %', 'Wasser fest gebunden'],
          ],
        },
        {
          type: 'p',
          text: 'Die Zahlen sind **ungefähre Richtwerte**. Sie schwanken mit Alter, Körperregion und Messmethode. Für das Verständnis reicht aber die Reihenfolge: Liquor ganz oben, dann die Weichteile dicht beieinander, Knochen ganz unten.',
        },
        {
          type: 'figure',
          id: 'tissue-water',
          caption: 'Schematisch und ungefähr: links der Wassergehalt, rechts die Helligkeit im protonendichtegewichteten Bild (PD). Fett ist hell, obwohl es wenig Wasser hat, Knochen ist schwarz.',
        },
        {
          type: 'p',
          text: 'Zwei Gewebe fallen aus der einfachen Regel heraus. **Fett** enthält wenig Wasser und erscheint trotzdem hell. Der Grund: Fettmoleküle bestehen aus langen Ketten mit sehr vielen Wasserstoffatomen. Auch diese Protonen sind beweglich genug, um ein kräftiges Signal zu senden. Die MRT sieht also nicht nur Wasser, sondern **alle beweglichen Protonen**, und das sind vor allem Wasser und Fett.',
        },
        {
          type: 'analogy',
          title: 'Eine frei hängende Glocke und eine festgehaltene',
          text: 'Schlägst du eine frei hängende Glocke an, klingt sie lange nach. Hältst du dieselbe Glocke fest in der Hand und schlägst sie an, hörst du nur ein kurzes „Tock“. Das Material ist dasselbe, nur ist die Glocke festgehalten. Genau so geht es den Protonen im Knochen: Sie sind da, aber festgehalten, und ihr Signal ist sofort wieder weg.',
        },
        {
          type: 'p',
          text: 'Damit sind wir bei **kompaktem Knochen**. Er enthält zwar auch etwas Wasser, doch dieses Wasser ist eng an Mineralien und Kollagen gebunden. Gebundene Protonen können sich kaum frei drehen und bewegen. Ihre kleinen Magnetfelder stören sich gegenseitig, und das Signal zerfällt extrem schnell. Fachlich sagt man: Die Querrelaxationszeit **T2** ist sehr kurz, im kompakten Knochen weit unter einer Millisekunde. Eine normale Messung horcht erst nach einigen Millisekunden. Bis dahin ist vom Knochensignal nichts mehr übrig.',
        },
        {
          type: 'p',
          text: 'Bei Wasser in Weichteilen ist es umgekehrt. Die Moleküle taumeln ständig und sehr schnell durcheinander. Dadurch mitteln sich die störenden kleinen Felder der Nachbarn weitgehend heraus, und das Signal hält länger. **Bewegliche Protonen klingen lange, gebundene Protonen verstummen sofort.** Dasselbe gilt für Luft in Lunge und Darm: Dort sind kaum Protonen, also bleibt es dunkel.',
        },
        {
          type: 'p',
          text: 'Wie hell ein Gewebe am Ende im Bild erscheint, hängt also an drei Dingen: wie viele bewegliche Protonen es hat (**Protonendichte**), wie schnell sie sich nach der Anregung wieder erholen (**T1**) und wie lange ihr Signal anhält (**T2**). Die Abbildung oben zeigt nur die erste Größe, die Protonendichte. Wie man gezielt T1 oder T2 in den Vordergrund holt, lernst du später bei der **Gewichtung** im Modul „Vom Signal zum Bild“.',
        },
        {
          type: 'mnemonic',
          text: '**Beweglicher Wasserstoff leuchtet.** Viel Wasser oder viel Fett: Signal. Festgebundenes Wasser im Knochen oder Luft: dunkel.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Fett ist hell, weil es viel Wasser enthält.“ Richtig: Fett hat wenig Wasser. Das Signal stammt von den vielen beweglichen Protonen der Fettmoleküle.',
            'Falsch: „Mehr Wasser heißt in jedem MRT-Bild heller.“ Richtig: Das gilt grob im PD-Bild. Im T1-Bild ist zum Beispiel Liquor dunkel, weil auch T1 und T2 mitbestimmen.',
            'Falsch: „Was im MRT dunkel ist, ist auch im CT dunkel.“ Richtig: Knochen ist im CT hell und im MRT dunkel, weil die Verfahren ganz verschiedene Dinge messen.',
          ],
        },
        {
          type: 'exam',
          question: 'Warum erscheint Fett im MRT hell, obwohl es kaum Wasser enthält, und warum bleibt kompakter Knochen dunkel?',
          answer: 'Die MRT misst das Signal beweglicher Wasserstoffkerne. Fett enthält zwar wenig Wasser, seine Moleküle tragen aber sehr viele Wasserstoffatome, die beweglich genug sind, um ein kräftiges Signal zu liefern. Im kompakten Knochen ist das wenige Wasser fest gebunden. Gebundene Protonen haben ein extrem kurzes T2, ihr Signal ist zerfallen, bevor die Messung ausliest. Deshalb ist Knochen dunkel.',
          full: 'Nenne die Unterscheidung bewegliche gegenüber gebundenen Protonen, das sehr kurze T2 im Knochen und dass die Helligkeit neben der Protonendichte auch von T1 und T2 abhängt.',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'Vom Proton zum Bild in fünf Schritten',
      blocks: [
        {
          type: 'p',
          text: 'Bevor du in die Physik einsteigst, lohnt sich ein Blick auf die ganze Strecke. Wenn du weißt, wohin die Reise geht, fällt jedes Teilstück leichter. Die gesamte MRT lässt sich in **fünf Schritten** erzählen. Jeder Schritt bekommt später ein eigenes Kapitel.',
        },
        {
          type: 'figure',
          id: 'proton-to-image',
          caption: 'Die ganze Kette auf einen Blick: Die violetten Schritte lernst du im „Physikalischen Prinzip“, die blauen in „Vom Signal zum Bild“.',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Das Magnetfeld richtet aus.** Im starken Feld B₀ stellen sich die Protonen bevorzugt in Feldrichtung ein und kreiseln mit der Larmor-Frequenz um das Feld. Es entsteht eine kleine Nettomagnetisierung. Ausführlich im Modul „Physikalisches Prinzip“.',
            '**Der HF-Puls kippt.** Ein kurzer Radiopuls genau mit der Larmor-Frequenz kippt die Magnetisierung aus der Feldrichtung heraus, zum Beispiel um 90°. Das ist Resonanz. Ebenfalls im „Physikalischen Prinzip“.',
            '**Die Spins senden ein Signal.** Die gekippte Magnetisierung kreist weiter und wirkt wie ein winziger Radiosender. In der Empfangsspule erzeugt sie eine Spannung, die langsam abklingt: das **FID-Signal** (Free Induction Decay, freier Induktionszerfall). Wie schnell es abklingt, beschreiben T1 und T2. Die Physik dazu kommt im „Physikalischen Prinzip“, der Empfang in „Vom Signal zum Bild“.',
            '**Gradienten kodieren den Ort.** Zusätzliche Spulen machen das Magnetfeld ortsabhängig. Dann kreiselt jeder Ort mit einer etwas anderen Frequenz, und das Signal trägt eine Ortsinformation. Ausführlich in „Vom Signal zum Bild“.',
            '**Die Fourier-Transformation rechnet das Bild.** Sie zerlegt das gemessene Signalgemisch in seine Frequenzen und ordnet so jedem Ort seine Helligkeit zu. Das Rechenwerkzeug findest du in „Fourier-Transformation kompakt“, die Anwendung auf den k-Raum in „Vom Signal zum Bild“.',
          ],
        },
        {
          type: 'p',
          text: 'Eine kleine Ehrlichkeit gehört dazu: In Wirklichkeit laufen die Schritte 2 bis 4 ineinander verschränkt ab. Ein Gradient ist zum Beispiel schon während des HF-Pulses eingeschaltet, damit nur eine Schicht angeregt wird. Und die ganze Kette wird viele Male wiederholt, bis genug Daten für ein Bild beisammen sind. Für den Überblick ist die einfache Reihenfolge aber genau richtig.',
        },
        {
          type: 'p',
          text: 'Im Skript steht dazu ein schönes, knappes Bild: der Tunnel des Geräts mit einem Patienten darin, ein Pfeil hinein, ein Pfeil heraus. **Input: Pulssequenz. Output: FID-Signal.** Die Pulssequenz ist der genaue Zeitplan, nach dem das Gerät HF-Pulse sendet und Gradienten schaltet. Das FID-Signal ist die Antwort der Protonen, die die Spule auffängt. Alles andere, also das Bild, entsteht danach im Computer.',
        },
        {
          type: 'figure',
          id: 'scanner-io',
          caption: 'Das Gerät als Kasten mit Eingang und Ausgang: Hinein geht die Pulssequenz aus HF-Pulsen und Gradienten, heraus kommt das abklingende FID-Signal der Protonen.',
        },
        {
          type: 'p',
          text: 'Dieses Input-Output-Denken hilft dir in der Prüfung enorm. Bei jeder Frage kannst du dich fragen: Geht es gerade um das, was hineingeht (Magnetfeld, HF-Puls, Gradienten), um das, was im Körper passiert (Präzession, Relaxation), oder um das, was herauskommt und verrechnet wird (Signal, k-Raum, Fourier-Transformation)?',
        },
        {
          type: 'mnemonic',
          text: '**Ausrichten, kippen, lauschen, kodieren, rechnen.** Fünf Verben für den ganzen Weg vom Proton zum Bild. Hinein geht die Pulssequenz, heraus kommt das FID-Signal.',
        },
        {
          type: 'exam',
          question: 'Beschreibe in wenigen Sätzen, wie aus den Protonen im Körper ein MR-Bild entsteht.',
          answer: 'Im statischen Magnetfeld B₀ richten sich die Protonen bevorzugt aus und präzedieren mit der Larmor-Frequenz, es entsteht eine Nettomagnetisierung. Ein HF-Puls mit der Larmor-Frequenz kippt diese Magnetisierung in die Querebene. Die präzedierende Quermagnetisierung induziert in der Empfangsspule ein abklingendes Signal, den FID. Magnetfeldgradienten machen die Frequenz und Phase ortsabhängig und kodieren so den Ort. Aus den gesammelten Signalen im k-Raum berechnet die inverse Fourier-Transformation das Bild.',
          full: 'Erwähne das Input-Output-Prinzip (Pulssequenz hinein, FID-Signal heraus) und dass die Messung viele Male wiederholt wird. Begriffe wie Resonanz, Relaxation (T1, T2) und k-Raum bringen Zusatzpunkte.',
          sim: 'scanner',
        },
      ],
    },
    {
      title: 'Sicherheit und Grenzen',
      blocks: [
        {
          type: 'p',
          text: 'Die MRT gilt als besonders schonend, und das stimmt auch. Trotzdem ist sie nicht risikofrei. Die Risiken sind nur ganz andere als beim Röntgen. Für die Prüfung und für die Praxis solltest du beides kennen: warum die MRT sicher ist und wo sie gefährlich oder an ihre Grenzen kommt.',
        },
        {
          type: 'p',
          text: '**Keine ionisierende Strahlung.** Die MRT benutzt Radiowellen. Ob Strahlung ionisieren kann, entscheidet die Energie eines einzelnen Photons. Sie ist proportional zur Frequenz. Dabei ist $h$ das Plancksche Wirkungsquantum und $f$ die Frequenz:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} E &= h\\,f \\\\ &\\approx 4{,}1\\cdot10^{-15}\\ \\text{eV s}\\cdot 64\\cdot10^{6}\\ \\text{Hz} \\approx 2{,}6\\cdot10^{-7}\\ \\text{eV} \\end{aligned}',
          caption: 'Energie eines Radiophotons bei 64 MHz (1,5 T)',
        },
        {
          type: 'p',
          text: 'Um ein Elektron aus einem Atom zu schlagen, braucht man einige Elektronenvolt. Ein Radiophoton hat nicht einmal ein Millionstel davon. Es kann deshalb weder ionisieren noch die DNA direkt schädigen. Röntgenphotonen dagegen tragen zehntausende Elektronenvolt.',
        },
        {
          type: 'analogy',
          title: 'Der Kranmagnet auf dem Schrottplatz',
          text: 'Auf dem Schrottplatz hebt ein großer Magnet ganze Autos hoch. Das Magnetfeld eines MRT-Geräts ist noch viel stärker, und es ist immer eingeschaltet. Eine Schere, ein Schlüsselbund oder eine Sauerstoffflasche aus Eisen wird in seiner Nähe zum Geschoss, das mit voller Wucht in die Röhre fliegt.',
        },
        {
          type: 'p',
          text: '**Das starke Magnetfeld.** Ein klinisches Gerät hat 1,5 oder 3 Tesla. Das ist etwa 30 000- bis 60 000-mal stärker als das Erdmagnetfeld. Der supraleitende Magnet bleibt dauerhaft an, auch nachts und wenn niemand untersucht wird. Daraus folgen drei Gefahren:',
        },
        {
          type: 'list',
          items: [
            '**Projektileffekt:** Gegenstände aus Eisen oder Stahl werden in Richtung Magnet gerissen. Darum darf nichts Ferromagnetisches in den Untersuchungsraum.',
            '**Implantate:** Herzschrittmacher, Defibrillatoren, Cochlea-Implantate oder Insulinpumpen können gestört werden oder ausfallen. Viele moderne Implantate sind „bedingt MR-sicher“, dann nur unter genau festgelegten Bedingungen.',
            '**Metall im Körper:** Metallsplitter, etwa im Auge, oder ältere Gefäßclips können sich bewegen oder erwärmen. Auch ohne Gefahr verursacht Metall oft Bildstörungen.',
          ],
        },
        {
          type: 'p',
          text: 'Deshalb steht vor jeder Untersuchung ein sorgfältiges **Screening**: ein Fragebogen und ein Gespräch zu Implantaten, Operationen, Metallsplittern und Schwangerschaft. Alle, die den Raum betreten, legen Metallgegenstände vorher ab.',
        },
        {
          type: 'p',
          text: '**Weitere Grenzen im Überblick:**',
        },
        {
          type: 'list',
          items: [
            '**Erwärmung durch HF:** Ein Teil der Radiowellen-Energie wird im Gewebe zu Wärme. Wie viel Leistung pro Kilogramm Körpergewicht aufgenommen wird, beschreibt die **SAR** (spezifische Absorptionsrate). Das Gerät hält Grenzwerte automatisch ein. Mehr dazu im Bonus-Modul „SNR, SAR & Artefakte“.',
            '**Lärm:** Die Gradientenspulen werden sehr schnell ein- und ausgeschaltet. Im starken Feld wirken dabei Kräfte auf die Spulen, sie vibrieren und klopfen laut. Darum bekommen alle Gehörschutz. Sehr schnelle Gradientenwechsel können außerdem ein leichtes Kribbeln in Nerven auslösen.',
            '**Enge:** Die Röhre ist eng und lang. Menschen mit Platzangst (Klaustrophobie) fällt das schwer. Hilfreich sind Gespräche, Musik, ein Spiegel oder offene und weitere Geräte.',
            '**Lange Messzeit:** Eine Untersuchung dauert oft 20 bis 45 Minuten. Das ist viel länger als ein CT und für Notfälle oder unruhige Personen ungünstig.',
            '**Bewegung:** Weil das Bild aus vielen Wiederholungen zusammengesetzt wird, verwischt jede Bewegung das Ergebnis. Atmung, Herzschlag und Schlucken erzeugen Artefakte. Kleine Kinder brauchen manchmal eine Sedierung.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Magnet immer an, Metall bleibt draußen.** Die MRT ist strahlenfrei, aber nicht gefahrlos: Projektile, Implantate, Wärme, Lärm, Enge und Bewegung muss man im Griff haben.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Keine Strahlung, also kein Risiko.“ Richtig: Es gibt keine ionisierende Strahlung, aber Magnetfeld, HF-Erwärmung und Lärm bringen eigene Risiken.',
            'Falsch: „Nach der Untersuchung wird der Magnet ausgeschaltet.“ Richtig: Der supraleitende Magnet ist dauerhaft an. Der Raum ist immer gefährlich für Metall.',
            'Falsch: „Der Lärm kommt vom großen Magnetfeld B₀.“ Richtig: Er kommt von den schnell geschalteten Gradientenspulen.',
          ],
        },
        {
          type: 'exam',
          question: 'Die MRT arbeitet ohne ionisierende Strahlung. Welche Risiken und Grenzen hat sie trotzdem?',
          answer: 'Das starke statische Magnetfeld zieht ferromagnetische Gegenstände an (Projektileffekt) und kann Implantate wie Herzschrittmacher stören oder bewegen, deshalb ist ein Screening vor jeder Untersuchung Pflicht. Die HF-Pulse erwärmen das Gewebe, begrenzt über die SAR. Die schnell geschalteten Gradienten verursachen starken Lärm. Dazu kommen die Enge der Röhre bei Klaustrophobie, lange Messzeiten und Bewegungsartefakte.',
          full: 'Begründe kurz, warum die MRT nicht ionisiert (Photonenenergie E = h·f der Radiowellen ist viel zu klein) und ordne jedes Risiko seiner Ursache zu: B₀, HF oder Gradienten.',
          sim: 'scanner',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'О чём эта глава',
      blocks: [
        {
          type: 'hook',
          text: 'МРТ один из самых впечатляющих инструментов медицины: она показывает мозг, суставы, сердце и даже ещё не рождённого ребёнка без единого рентгеновского луча. Физика за ней сначала кажется горой. Этот учебный путь шаг за шагом ведёт тебя наверх, точно в порядке твоего лекционного конспекта.',
        },
        {
          type: 'p',
          text: 'Конспект состоит из четырёх частей, и это приложение устроено точно так же:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Введение:** зачем нужна МРТ и что она умеет особенно хорошо? (Этот модуль)',
            '**Физический принцип:** почему протоны в магнитном поле излучают сигнал: ядерный спин, частота Лармора, уравнение Блоха, РЧ-импульс и релаксация.',
            '**От сигнала к изображению:** как принять сигнал, дать каждой точке свою частоту и рассчитать изображение преобразованием Фурье. И сам аппарат с его компонентами.',
            '**Клиническое применение:** что с этим видят и измеряют в клинике, от контрастного вещества до трактографии.',
          ],
        },
        {
          type: 'p',
          text: 'В конце конспекта есть приложение о **преобразовании Фурье** и задание для **лабораторной 3**. И то и другое ты найдёшь здесь в отдельном модуле и в подготовке к экзамену.',
        },
        {
          type: 'analogy',
          title: 'Поход в горы с картой',
          text: 'В конспекте рядом с контрольными вопросами нарисована гора с красной тропой и двумя вопросительными знаками. Именно так ощущается эта тема: снизу вершина кажется далёкой. Но с картой, понятными этапами и остановками на смотровых площадках ты уверенно поднимешься. Модули это этапы, а правила для запоминания это смотровые площадки.',
        },
        {
          type: 'p',
          text: 'По конспекту после этой главы тебе нужно уметь четыре вещи. Именно на них ориентируется экзамен:',
        },
        {
          type: 'list',
          items: [
            'объяснять **физические принципы** МРТ,',
            'объяснять, как из измеренных **сигналов получается изображение**,',
            'описывать основные **технические компоненты** и их функцию,',
            'называть типичные **применения и показания**.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Принцип, изображение, техника, применение.** Четыре цели, четыре части конспекта. Если можешь свободно рассказать о каждой части, можно идти на экзамен.',
        },
        {
          type: 'exam',
          question: 'Какие преимущества у МРТ по сравнению с рентгеном и КТ?',
          answer: 'МРТ работает без ионизирующего излучения, только с магнитным полем и радиоволнами. У неё очень хороший контраст мягких тканей, потому что она измеряет сигнал протонов в воде и жире, и этот контраст можно настраивать параметрами измерения. Кроме анатомии, она даёт и функциональную информацию: кровоток, диффузию или обмен веществ.',
          full: 'Назови и ограничения: кость выглядит тёмной, измерение длится дольше, а металлические импланты и кардиостимуляторы требуют особой осторожности.',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'МРТ в сравнении: рентген, КТ, УЗИ, ПЭТ',
      blocks: [
        {
          type: 'p',
          text: 'В клинике МРТ никогда не работает в одиночку. В зависимости от вопроса выбирают рентген, КТ, УЗИ или ПЭТ. Чтобы понять, когда МРТ лучший выбор, полезно задать простой вопрос: **что каждый метод на самом деле измеряет физически?** Если знаешь ответ, сильные и слабые стороны выводятся почти сами собой.',
        },
        {
          type: 'analogy',
          title: 'Пять способов исследовать тёмный дом',
          text: 'Представь тёмный дом, в который нельзя войти. Можно просветить его мощным фонарём и посмотреть на тень на задней стене (рентген). Можно обойти дом вокруг и собрать тени со всех сторон (КТ). Можно крикнуть и слушать эхо от стен (УЗИ). Можно разложить светящиеся конфеты и посмотреть, в каких комнатах их съедят (ПЭТ). А можно поставить магнит и слушать крошечные радиопередатчики, которые есть в каждой капле воды в доме (МРТ).',
        },
        {
          type: 'p',
          text: '**Рентген и КТ** пропускают рентгеновские лучи через тело и измеряют, сколько их доходит до другой стороны. Ткань ослабляет пучок. Насколько сильно, зависит прежде всего от плотности электронов и от порядкового номера атомов. Кость с её кальцием ослабляет сильно и выглядит светлой. Воздух почти не ослабляет и остаётся тёмным. А разные мягкие ткани ослабляют очень похоже. КТ вращает трубку и детектор вокруг тела и из множества проекций рассчитывает **срез**. Оба метода используют **ионизирующее излучение**.',
        },
        {
          type: 'p',
          text: '**УЗИ** посылает в тело звуковые волны. На каждой границе между двумя тканями часть звука отражается. По времени прихода эха аппарат вычисляет, на какой глубине лежит граница. УЗИ быстрое, недорогое, его можно провести прямо у кровати, и оно работает **без ионизирующего излучения**. Но через кость и воздух звук почти не проходит, а качество снимка сильно зависит от опыта того, кто проводит исследование.',
        },
        {
          type: 'p',
          text: '**ПЭТ** (позитронно-эмиссионная томография) измеряет не тень и не эхо, а **трейсер**. Это вещество, помеченное радиоактивным атомом, например глюкоза со фтором-18. Организм направляет его туда, где идёт активный обмен веществ, например в опухоль. При распаде возникает позитрон. Он аннигилирует с электроном, и появляются **два гамма-кванта**, летящие в противоположные стороны. Кольцо детекторов регистрирует оба одновременно. Так ПЭТ показывает **функцию**, но мало анатомии. Из-за радиоактивного трейсера ПЭТ тоже **ионизирующий** метод.',
        },
        {
          type: 'p',
          text: '**МРТ** измеряет совсем другое: **протоны** в воде и жире и их **магнитное окружение**. Сильное магнитное поле их выстраивает, радиоволны возбуждают, и протоны сами посылают обратно слабый радиосигнал. Насколько сильный и насколько долгий, зависит от того, сколько подвижных протонов в ткани и как они взаимодействуют с соседями. Именно этим мягкие ткани заметно отличаются друг от друга. При этом **ионизирующего излучения нет**.',
        },
        {
          type: 'figure',
          id: 'modality-compare',
          caption: 'Пять методов, пять принципов измерения. Обрати внимание на значки: без ионизирующего излучения обходятся только УЗИ и МРТ.',
        },
        {
          type: 'table',
          head: ['Метод', 'измеряет', 'ионизирующий', 'типичный вопрос'],
          rows: [
            ['Рентген', 'ослабление пучка', 'да', 'Сломана ли кость? Чисты ли лёгкие?'],
            ['КТ', 'ослабление, в виде среза', 'да', 'Неотложка: кровоизлияние в мозг, травмы'],
            ['УЗИ', 'эхо от границ тканей', 'нет', 'Органы живота, сердце, ребёнок в утробе'],
            ['ПЭТ', 'распределение трейсера', 'да', 'Где в теле активная опухоль?'],
            ['МРТ', 'протоны и их окружение', 'нет', 'Мозг, спинной мозг, суставы, связки'],
          ],
        },
        {
          type: 'table',
          head: ['Метод', 'Сильные стороны', 'Слабые стороны'],
          rows: [
            ['Рентген', 'быстро, дёшево, хорошо видна кость', 'наложение, мягкие ткани слабо'],
            ['КТ', 'очень быстро, кость и лёгкие', 'выше доза, мягкие ткани средне'],
            ['УЗИ', 'у кровати, в реальном времени, дёшево', 'не проходит через кость и воздух'],
            ['ПЭТ', 'показывает обмен веществ', 'мало анатомии, радиоактивный трейсер'],
            ['МРТ', 'лучший контраст мягких тканей, любой срез', 'долго, шумно, тесно, металл опасен'],
          ],
        },
        {
          type: 'p',
          text: 'Как видишь, «лучшего» метода нет. При подозрении на кровоизлияние в мозг в неотложной ситуации часто выигрывает КТ, потому что оно готово за несколько секунд. Для тонкого вопроса о спинном мозге или крестообразной связке выигрывает МРТ. Иногда два метода объединяют в одном аппарате, например ПЭТ и МРТ. Подробнее об этом в модуле «Клиническое применение».',
        },
        {
          type: 'mnemonic',
          text: '**Тень, эхо, трейсер, спин.** Рентген и КТ измеряют тень, УЗИ измеряет эхо, ПЭТ измеряет трейсер, а МРТ слушает протоны. Без излучения только эхо и спин.',
        },
        {
          type: 'exam',
          question: 'Сравни МРТ с КТ и УЗИ: что измеряет каждый метод и когда какой применять?',
          answer: 'КТ измеряет ослабление рентгеновских лучей, которое зависит прежде всего от плотности электронов и порядкового номера, и рассчитывает из него срезы. Оно очень быстрое, хорошо показывает кость и лёгкие, но использует ионизирующее излучение. УЗИ измеряет эхо на границах между тканями. Оно недорогое, без излучения и применимо у кровати, но не проходит через кость и воздух. МРТ измеряет сигнал протонов воды и жира, который зависит от протонной плотности и магнитного окружения (T1, T2). У неё лучший контраст мягких тканей и нет излучения, но измерение длится дольше. Поэтому: КТ в неотложных случаях и для кости, УЗИ как быстрое базовое исследование, МРТ для мозга, спинного мозга и суставов.',
          full: 'Для полного балла назови для каждого метода измеряемую величину, ионизирующий ли он, и хотя бы одну сильную и одну слабую сторону. Фраза о ПЭТ (трейсер, функция вместо анатомии) завершит ответ.',
          sim: 'modality',
        },
      ],
    },
    {
      title: 'Почему мягкие ткани светятся, а кость остаётся тёмной',
      blocks: [
        {
          type: 'p',
          text: 'Сравнение показало главное: МРТ слушает протоны. Отсюда простое правило. **Где много подвижных протонов, может возникнуть сигнал. Где их нет, остаётся темно.** Главный источник протонов в теле это вода. Поэтому стоит посмотреть, сколько воды в разных тканях.',
        },
        {
          type: 'table',
          head: ['Ткань', 'Содержание воды (примерно)', 'Примечание'],
          rows: [
            ['Ликвор (спинномозговая жидкость)', 'ок. 99 %', 'почти чистая свободная вода'],
            ['Серое вещество', 'ок. 80 %', 'тела нервных клеток'],
            ['Мышца', 'ок. 75 %', 'много воды в волокнах и между ними'],
            ['Белое вещество', 'ок. 70 %', 'нервные волокна с жирным миелином'],
            ['Жир', 'от 10 до 20 %', 'сигнал дают протоны жира'],
            ['Компактная кость', 'от 10 до 20 %', 'вода прочно связана'],
          ],
        },
        {
          type: 'p',
          text: 'Эти числа **примерные ориентиры**. Они меняются с возрастом, областью тела и методом измерения. Для понимания достаточно порядка: ликвор на самом верху, затем мягкие ткани близко друг к другу, кость в самом низу.',
        },
        {
          type: 'figure',
          id: 'tissue-water',
          caption: 'Схематично и примерно: слева содержание воды, справа яркость на снимке, взвешенном по протонной плотности (PD). Жир светлый, хотя воды в нём мало, кость чёрная.',
        },
        {
          type: 'p',
          text: 'Две ткани выпадают из простого правила. **Жир** содержит мало воды и всё равно выглядит светлым. Причина: молекулы жира состоят из длинных цепочек с очень большим числом атомов водорода. Эти протоны тоже достаточно подвижны, чтобы давать сильный сигнал. Значит, МРТ видит не только воду, а **все подвижные протоны**, и это прежде всего вода и жир.',
        },
        {
          type: 'analogy',
          title: 'Свободно висящий колокол и колокол в руке',
          text: 'Если ударить по свободно висящему колоколу, он долго звучит. Если крепко держать тот же колокол в руке и ударить, слышно лишь короткое «тук». Материал тот же, просто колокол зажат. Так же и с протонами в кости: они есть, но зажаты, и их сигнал сразу пропадает.',
        },
        {
          type: 'p',
          text: 'Теперь о **компактной кости**. В ней тоже есть немного воды, но она тесно связана с минералами и коллагеном. Связанные протоны почти не могут свободно вращаться и двигаться. Их маленькие магнитные поля мешают друг другу, и сигнал распадается чрезвычайно быстро. По-научному: время поперечной релаксации **T2** очень короткое, в компактной кости намного меньше миллисекунды. Обычное измерение «слушает» только через несколько миллисекунд. К этому моменту от сигнала кости ничего не остаётся.',
        },
        {
          type: 'p',
          text: 'С водой в мягких тканях всё наоборот. Молекулы постоянно и очень быстро кувыркаются. Из-за этого мешающие маленькие поля соседей в основном усредняются, и сигнал держится дольше. **Подвижные протоны звучат долго, связанные замолкают сразу.** То же относится к воздуху в лёгких и кишечнике: там почти нет протонов, поэтому темно.',
        },
        {
          type: 'p',
          text: 'Насколько светлой ткань получится на снимке, зависит от трёх вещей: сколько в ней подвижных протонов (**протонная плотность**), как быстро они восстанавливаются после возбуждения (**T1**) и как долго держится их сигнал (**T2**). Рисунок выше показывает только первую величину, протонную плотность. Как специально вывести на первый план T1 или T2, ты узнаешь позже, во **взвешивании** в модуле «От сигнала к изображению».',
        },
        {
          type: 'mnemonic',
          text: '**Подвижный водород светится.** Много воды или много жира: сигнал. Прочно связанная вода в кости или воздух: темно.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Жир светлый, потому что в нём много воды». Верно: воды в жире мало. Сигнал дают многочисленные подвижные протоны молекул жира.',
            'Неверно: «Больше воды значит светлее на любом снимке МРТ». Верно: это примерно так на PD-снимке. На T1-снимке, например, ликвор тёмный, потому что свой вклад вносят и T1, и T2.',
            'Неверно: «Что темно на МРТ, то темно и на КТ». Верно: кость на КТ светлая, а на МРТ тёмная, потому что методы измеряют совсем разные вещи.',
          ],
        },
        {
          type: 'exam',
          question: 'Почему жир на МРТ светлый, хотя в нём почти нет воды, и почему компактная кость остаётся тёмной?',
          answer: 'МРТ измеряет сигнал подвижных ядер водорода. В жире мало воды, но его молекулы несут очень много атомов водорода, достаточно подвижных для сильного сигнала. В компактной кости немногочисленная вода прочно связана. У связанных протонов чрезвычайно короткое T2, их сигнал распадается раньше, чем измерение его считывает. Поэтому кость тёмная.',
          full: 'Назови различие между подвижными и связанными протонами, очень короткое T2 в кости и то, что яркость кроме протонной плотности зависит ещё от T1 и T2.',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'От протона к изображению за пять шагов',
      blocks: [
        {
          type: 'p',
          text: 'Прежде чем погрузиться в физику, полезно увидеть весь путь целиком. Если знаешь, куда ведёт дорога, каждый участок даётся легче. Всю МРТ можно рассказать за **пять шагов**. Каждый шаг позже получит свою главу.',
        },
        {
          type: 'figure',
          id: 'proton-to-image',
          caption: 'Вся цепочка одним взглядом: фиолетовые шаги ты изучишь в «Физическом принципе», синие в модуле «От сигнала к изображению».',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Магнитное поле выстраивает.** В сильном поле B₀ протоны преимущественно ориентируются по полю и прецессируют вокруг него с частотой Лармора. Возникает небольшая суммарная намагниченность. Подробно в модуле «Физический принцип».',
            '**РЧ-импульс наклоняет.** Короткий радиоимпульс точно на частоте Лармора выводит намагниченность из направления поля, например на 90°. Это резонанс. Тоже в «Физическом принципе».',
            '**Спины излучают сигнал.** Наклонённая намагниченность продолжает вращаться и действует как крошечный радиопередатчик. В приёмной катушке она наводит напряжение, которое постепенно затухает: это **сигнал FID** (Free Induction Decay, спад свободной индукции). Как быстро он затухает, описывают T1 и T2. Физика этого в «Физическом принципе», приём в модуле «От сигнала к изображению».',
            '**Градиенты кодируют место.** Дополнительные катушки делают магнитное поле зависящим от места. Тогда каждая точка прецессирует с немного другой частотой, и сигнал несёт информацию о месте. Подробно в модуле «От сигнала к изображению».',
            '**Преобразование Фурье рассчитывает изображение.** Оно раскладывает измеренную смесь сигналов на частоты и так присваивает каждой точке её яркость. Инструмент ты найдёшь в модуле «Преобразование Фурье кратко», применение к k-пространству в «От сигнала к изображению».',
          ],
        },
        {
          type: 'p',
          text: 'Честно добавим: в реальности шаги со 2-го по 4-й переплетены. Например, градиент включён уже во время РЧ-импульса, чтобы возбудился только один срез. И вся цепочка повторяется много раз, пока не наберётся достаточно данных для изображения. Но для общего обзора простой порядок как раз то, что нужно.',
        },
        {
          type: 'p',
          text: 'В конспекте к этому есть красивая и краткая картинка: туннель аппарата с пациентом внутри, одна стрелка внутрь, одна наружу. **Вход: импульсная последовательность. Выход: сигнал FID.** Импульсная последовательность это точное расписание, по которому аппарат посылает РЧ-импульсы и включает градиенты. Сигнал FID это ответ протонов, который улавливает катушка. Всё остальное, то есть изображение, возникает потом в компьютере.',
        },
        {
          type: 'figure',
          id: 'scanner-io',
          caption: 'Аппарат как ящик со входом и выходом: внутрь идёт импульсная последовательность из РЧ-импульсов и градиентов, наружу выходит затухающий сигнал FID протонов.',
        },
        {
          type: 'p',
          text: 'Такое мышление «вход и выход» очень помогает на экзамене. На любой вопрос можно спросить себя: речь о том, что входит (магнитное поле, РЧ-импульс, градиенты), о том, что происходит в теле (прецессия, релаксация), или о том, что выходит и обрабатывается (сигнал, k-пространство, преобразование Фурье)?',
        },
        {
          type: 'mnemonic',
          text: '**Выстроить, наклонить, услышать, закодировать, рассчитать.** Пять глаголов на весь путь от протона к изображению. Внутрь идёт импульсная последовательность, наружу выходит сигнал FID.',
        },
        {
          type: 'exam',
          question: 'Опиши в нескольких предложениях, как из протонов в теле получается МР-изображение.',
          answer: 'В статическом магнитном поле B₀ протоны преимущественно выстраиваются и прецессируют с частотой Лармора, возникает суммарная намагниченность. РЧ-импульс на частоте Лармора наклоняет эту намагниченность в поперечную плоскость. Прецессирующая поперечная намагниченность наводит в приёмной катушке затухающий сигнал, FID. Градиенты магнитного поля делают частоту и фазу зависящими от места и тем самым кодируют место. Из собранных в k-пространстве сигналов обратное преобразование Фурье рассчитывает изображение.',
          full: 'Упомяни принцип «вход и выход» (внутрь импульсная последовательность, наружу сигнал FID) и то, что измерение повторяется много раз. Понятия резонанс, релаксация (T1, T2) и k-пространство дают дополнительные баллы.',
          sim: 'scanner',
        },
      ],
    },
    {
      title: 'Безопасность и ограничения',
      blocks: [
        {
          type: 'p',
          text: 'МРТ считается особенно щадящим методом, и это правда. Но без рисков она не обходится. Просто риски совсем другие, чем у рентгена. Для экзамена и для практики важно знать и то и другое: почему МРТ безопасна и где она опасна или упирается в свои границы.',
        },
        {
          type: 'p',
          text: '**Нет ионизирующего излучения.** МРТ использует радиоволны. Может ли излучение ионизировать, решает энергия одного фотона. Она пропорциональна частоте. Здесь $h$ это постоянная Планка, а $f$ частота:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} E &= h\\,f \\\\ &\\approx 4{,}1\\cdot10^{-15}\\ \\text{эВ с}\\cdot 64\\cdot10^{6}\\ \\text{Гц} \\approx 2{,}6\\cdot10^{-7}\\ \\text{эВ} \\end{aligned}',
          caption: 'энергия радиофотона на частоте 64 МГц (1,5 Тл)',
        },
        {
          type: 'p',
          text: 'Чтобы выбить электрон из атома, нужно несколько электронвольт. У радиофотона нет и миллионной доли этого. Поэтому он не может ни ионизировать, ни напрямую повредить ДНК. А рентгеновские фотоны несут десятки тысяч электронвольт.',
        },
        {
          type: 'analogy',
          title: 'Магнитный кран на свалке металлолома',
          text: 'На свалке большой магнит поднимает целые автомобили. Магнитное поле аппарата МРТ ещё намного сильнее, и оно включено всегда. Ножницы, связка ключей или кислородный баллон из железа рядом с ним становятся снарядом, который со всей силы влетает в туннель.',
        },
        {
          type: 'p',
          text: '**Сильное магнитное поле.** Клинический аппарат работает при 1,5 или 3 Тл. Это примерно в 30 000, а то и в 60 000 раз сильнее магнитного поля Земли. Сверхпроводящий магнит включён постоянно, даже ночью и когда никого не обследуют. Отсюда три опасности:',
        },
        {
          type: 'list',
          items: [
            '**Эффект снаряда:** предметы из железа или стали притягиваются к магниту. Поэтому в кабинет нельзя вносить ничего ферромагнитного.',
            '**Импланты:** кардиостимуляторы, дефибрилляторы, кохлеарные импланты или инсулиновые помпы могут дать сбой или отказать. Многие современные импланты «условно совместимы с МРТ», тогда исследование возможно только при строго заданных условиях.',
            '**Металл в теле:** металлические осколки, например в глазу, или старые сосудистые клипсы могут сместиться или нагреться. Даже без опасности металл часто вызывает помехи на снимке.',
          ],
        },
        {
          type: 'p',
          text: 'Поэтому перед каждым исследованием проводят тщательный **скрининг**: анкета и беседа об имплантах, операциях, металлических осколках и беременности. Все, кто входит в кабинет, заранее снимают металлические предметы.',
        },
        {
          type: 'p',
          text: '**Другие ограничения кратко:**',
        },
        {
          type: 'list',
          items: [
            '**Нагрев от РЧ:** часть энергии радиоволн превращается в ткани в тепло. Сколько мощности поглощается на килограмм массы тела, описывает **SAR** (удельный коэффициент поглощения). Аппарат автоматически соблюдает предельные значения. Подробнее в бонусном модуле «SNR, SAR и артефакты».',
            '**Шум:** градиентные катушки очень быстро включаются и выключаются. В сильном поле на них при этом действуют силы, они вибрируют и громко стучат. Поэтому всем дают средства защиты слуха. Очень быстрые переключения градиентов могут ещё вызвать лёгкое покалывание в нервах.',
            '**Теснота:** туннель узкий и длинный. Людям с боязнью замкнутого пространства (клаустрофобией) это тяжело. Помогают беседа, музыка, зеркало или открытые и более широкие аппараты.',
            '**Долгое измерение:** исследование часто длится от 20 до 45 минут. Это намного дольше КТ и неудобно в неотложных случаях или для беспокойных пациентов.',
            '**Движение:** поскольку изображение собирается из множества повторений, любое движение размывает результат. Дыхание, сердцебиение и глотание создают артефакты. Маленьким детям иногда нужна седация.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Магнит всегда включён, металл остаётся снаружи.** МРТ без излучения, но не без опасностей: снаряды, импланты, нагрев, шум, теснота и движение нужно держать под контролем.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Нет излучения, значит, нет риска». Верно: ионизирующего излучения нет, но магнитное поле, РЧ-нагрев и шум несут свои риски.',
            'Неверно: «После исследования магнит выключают». Верно: сверхпроводящий магнит включён постоянно. Кабинет всегда опасен для металла.',
            'Неверно: «Шум идёт от большого магнитного поля B₀». Верно: он идёт от быстро переключаемых градиентных катушек.',
          ],
        },
        {
          type: 'exam',
          question: 'МРТ работает без ионизирующего излучения. Какие у неё всё же есть риски и ограничения?',
          answer: 'Сильное статическое магнитное поле притягивает ферромагнитные предметы (эффект снаряда) и может нарушить работу или сместить импланты, например кардиостимуляторы, поэтому перед каждым исследованием обязателен скрининг. РЧ-импульсы нагревают ткань, это ограничивается через SAR. Быстро переключаемые градиенты создают сильный шум. К этому добавляются теснота туннеля при клаустрофобии, долгое время измерения и артефакты движения.',
          full: 'Кратко обоснуй, почему МРТ не ионизирует (энергия фотона E = h·f у радиоволн слишком мала), и отнеси каждый риск к его причине: B₀, РЧ или градиенты.',
          sim: 'scanner',
        },
      ],
    },
  ],
};

/** Einstiege für Kapitel, die aus Abschnitten früherer Module zusammengesetzt sind. */
export const BILD_HOOK: Loc = {
  de: 'Im physikalischen Prinzip hast du gelernt, dass die Protonen nach dem HF-Puls ein Signal aussenden. Aber dieses Signal ist zunächst nur ein einziges Summen aus dem ganzen Körper. Dieses Modul folgt dem Skript Schritt für Schritt: Wie empfängt man das Signal, wie bekommt jeder Ort seine eigene Frequenz, welches Gerät braucht man dafür, und wie rechnet man mit der Fourier-Transformation daraus ein Bild?',
  ru: 'Из физического принципа ты уже знаешь, что после РЧ-импульса протоны излучают сигнал. Но сначала это лишь один общий гул от всего тела. Этот модуль идёт по конспекту шаг за шагом: как принимают сигнал, как каждая точка получает свою частоту, какой аппарат для этого нужен и как с помощью преобразования Фурье из этого рассчитывают изображение?',
};

export const ANWENDUNGEN_HOOK: Loc = {
  de: 'Jetzt kommt der Teil, für den sich die ganze Physik lohnt. Das Skript zeigt eine Reihe klinischer Bilder und Messverfahren. Für die Prüfung musst du keine Diagnosen stellen. Du solltest aber zu jeder Anwendung sagen können, **was man sieht** und **welche Physik dahintersteckt**.',
  ru: 'Теперь та часть, ради которой стоит изучать всю физику. В конспекте показан ряд клинических изображений и методов измерения. Ставить диагнозы на экзамене не нужно. Но к каждому применению тебе нужно уметь сказать, **что видно** и **какая физика за этим стоит**.',
};
