import type { Chapter } from './types';

/**
 * Modul 6: Anwendungen & Klinik. Prüfungsstoff zu Lernziel 4 („typische Anwendungen und Indikationen nennen“).
 * Inhaltliche Grundlage: MBR-Skript „Magnetic Resonance Imaging“, Abschnitte MRI in Clinical Use und Selected clinical applications.
 */
export const anwendungen: Chapter = {
  de: [
    {
      title: 'Wofür braucht man die MRT überhaupt?',
      blocks: [
        {
          type: 'hook',
          text: 'Bis hierhin hast du gelernt, wie aus Protonen ein Signal und aus dem Signal ein Bild wird. Jetzt kommt die Frage, die in der Prüfung fast sicher auftaucht: **Wofür setzt man das alles ein, und warum gerade MRT?** In diesem Modul gehst du die Anwendungen aus dem Skript durch. Zu jeder lernst du zwei Dinge: **was man sieht** und **welche Physik aus Modul 1 bis 5 dahintersteckt**. Genau diese Verbindung bringt in der Prüfung die vollen Punkte.',
        },
        {
          type: 'p',
          text: 'Im Skript steht eine kurze Liste mit Anwendungen und Indikationen. Lies sie nicht als Aufzählung zum Auswendiglernen, sondern als Antwort auf die Frage „Was kann die MRT, was andere Verfahren nicht so gut können?“.',
        },
        {
          type: 'list',
          items: [
            '**Weichteile:** Gehirn, Rückenmark, Muskeln, Knorpel, Bänder und Organe. Knochen dagegen kaum, weil er zu wenig Signal liefert.',
            '**Anatomische und funktionelle Information:** Die MRT zeigt nicht nur, wie etwas aussieht, sondern auch, wie es arbeitet. Dazu gehören die funktionelle MRT (fMRI) und die Messung des Blutflusses.',
            '**Spektroskopie:** Man misst, welche Moleküle in einem Gewebestück stecken.',
            '**Zerebrale Diagnostik:** Untersuchungen des Gehirns sind eine der wichtigsten Domänen der MRT.',
            '**Kardiologie:** Herz und große Gefäße, ihre Bewegung, ihr Blutfluss und sogar die Ausrichtung der Herzmuskelfasern.',
          ],
        },
        {
          type: 'p',
          text: 'Warum sind Weichteile die Stärke der MRT? Erinnere dich an Modul 1 und 2. Das Signal kommt von beweglichen Wasserstoffkernen in Wasser und Fett. Verschiedene Weichteile unterscheiden sich in drei Größen: in der **Protonendichte** (wie viel Wasser), in **T1** (wie schnell sich die Längsmagnetisierung erholt) und in **T2** (wie schnell das Quersignal zerfällt). Mit TR und TE kann man wählen, welche dieser Größen das Bild bestimmt. Das ergibt viele verschiedene Kontraste aus derselben Anatomie. Ein Röntgenbild dagegen kennt im Grunde nur eine Größe: wie stark das Gewebe Röntgenstrahlung abschwächt. Und Weichteile schwächen fast alle ähnlich ab.',
        },
        {
          type: 'analogy',
          title: 'Ein Mischpult statt eines einzigen Lautstärkereglers',
          text: 'Das Röntgenbild ist wie ein Radio mit nur einem Lautstärkeknopf: Du kannst das Ganze lauter oder leiser machen, aber nicht einzelne Instrumente hervorheben. Die MRT ist ein Mischpult mit drei Reglern: Protonendichte, T1 und T2. Über TR und TE schiebst du die Regler so, dass genau das „Instrument“ laut wird, das dich interessiert, zum Beispiel Flüssigkeit im T2-Bild.',
        },
        {
          type: 'p',
          text: 'Im ersten Bild des Skripts siehst du ein Gehirn. Der Schädelknochen ist dort praktisch unsichtbar, die feinen Strukturen des Kleinhirns sind dagegen mit hohem Kontrast zu erkennen. Der Grund für den dunklen Knochen: Kompakter Knochen enthält wenig bewegliche Protonen, und das wenige Signal zerfällt extrem schnell (sehr kurzes T2). Bis zur üblichen Echozeit ist davon nichts mehr übrig.',
        },
        {
          type: 'p',
          text: 'Ein weiterer Vorteil, der in fast jeder Begründung vorkommt: Die MRT arbeitet mit einem Magnetfeld und Radiowellen. Sie benutzt **keine ionisierende Strahlung**. Das ist besonders wichtig bei Kindern, bei wiederholten Kontrollen und in der Schwangerschaft.',
        },
        {
          type: 'mnemonic',
          text: '**Weich, funktionell, strahlungsfrei.** Die MRT glänzt bei Weichteilen, sie zeigt neben der Anatomie auch Funktion (Fluss, fMRI, Spektroskopie), und sie kommt ohne Röntgenstrahlung aus. Knochen ist ihre Schwäche.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Knochen ist dunkel, weil er gar keine Protonen hat.“ Richtig: Er hat wenige bewegliche Protonen, und deren Signal ist wegen des sehr kurzen T2 schon vor dem Auslesen zerfallen.',
            'Falsch: „MRT liefert nur Bilder der Anatomie.“ Richtig: Fluss, Diffusion, Spektroskopie und fMRI liefern physiologische und funktionelle Information.',
          ],
        },
        {
          type: 'exam',
          question: 'Nenne typische Anwendungen und Indikationen der MRT und begründe, warum die MRT dafür geeignet ist.',
          answer: 'Typisch sind die Darstellung von Weichteilen (Gehirn und zerebrale Diagnostik, Gelenke wie das Knie, Becken, Herz in der Kardiologie, Schwangerschaft) sowie funktionelle und physiologische Messungen: fMRI, Blutfluss, Diffusion bzw. DTI und Spektroskopie. Geeignet ist die MRT, weil das Signal von Wasser- und Fettprotonen stammt und sich Weichteile in Protonendichte, T1 und T2 unterscheiden. Über TR und TE lassen sich daraus verschiedene Kontraste erzeugen. Zudem arbeitet sie ohne ionisierende Strahlung.',
          full: 'Erwähne die Grenze: Kompakter Knochen liefert wegen weniger mobiler Protonen und sehr kurzem T2 kaum Signal. Nenne außerdem die Unterscheidung „anatomisch“ gegenüber „funktionell/physiologisch“.',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'Anatomie in Graustufen: Gehirn, Knie, Becken und Schwangerschaft',
      blocks: [
        {
          type: 'p',
          text: 'Die meisten Bildbeispiele im Skript sind anatomische Aufnahmen. Für die Prüfung musst du keine Befunde stellen. Du sollst aber erklären können, **welche Gewichtung gewählt wurde und warum diese Gewichtung zur Frage passt**. Dafür brauchst du nur die Regeln aus Modul 2. Zur Erinnerung die drei Beispiele aus dem Skript:',
        },
        {
          type: 'table',
          head: ['Gewichtung', 'TR', 'TE', 'Was hell wird'],
          rows: [
            ['PD', 'lang (5500 ms)', 'kurz (14 ms)', 'viele bewegliche Protonen'],
            ['T1', 'kurz (500 ms)', 'kurz (10 ms)', 'kurzes T1, z. B. Fett'],
            ['T2', 'lang (5500 ms)', 'lang (101 ms)', 'langes T2, z. B. Wasser, Liquor'],
          ],
        },
        {
          type: 'p',
          text: '**Gehirn, axiales T2-Bild.** „Axial“ heißt: ein Querschnitt, als würdest du von unten oder oben auf eine Scheibe des Kopfes schauen. Im T2-Bild ist das Hirnwasser (Liquor) in den Hirnkammern und um das Gehirn hell, denn freies Wasser hat ein langes T2. Seine Quermagnetisierung ist bei der langen Echozeit noch nicht zerfallen. Graue und weiße Substanz unterscheiden sich im Wassergehalt und in ihren Relaxationszeiten, deshalb sind auch sie gut zu trennen. Kein anderes Verfahren zeigt das Hirngewebe so detailliert, darum ist die zerebrale Diagnostik eine Kernanwendung.',
        },
        {
          type: 'p',
          text: '**Knie, sagittales PD-Bild.** „Sagittal“ heißt: ein Längsschnitt von der Seite, er teilt den Körper in links und rechts. Das PD-Bild nutzt langes TR und kurzes TE. Langes TR lässt allen Geweben Zeit, sich zu erholen, so verschwinden T1-Unterschiede. Kurzes TE misst, bevor T2-Unterschiede groß werden. Übrig bleibt die Dichte der beweglichen Protonen. So sieht man Knorpel, Menisken, Bänder und Gelenkflüssigkeit nebeneinander. Menisken und Bänder erscheinen dunkel, weil ihr straffes Gewebe ein sehr kurzes T2 hat. Das Skriptbeispiel zeigt ein unauffälliges Knie ohne Verletzungszeichen.',
        },
        {
          type: 'p',
          text: '**Becken.** Das Beispiel zeigt einen retrovertierten Uterus, also eine Gebärmutter, die nach hinten geneigt liegt. Das ist eine Lagevariante und für sich allein keine Krankheit. Das Bild stammt aus einer Untersuchung der Lendenwirbelsäule: Es ist ein **Zufallsbefund**. Man wollte die Bandscheiben sehen und hat nebenbei die Organe im Becken mit abgebildet. Die Lehre daraus: Weil die MRT alle Weichteile im Bildausschnitt zeigt, sieht man oft mehr als das, wonach man gesucht hat.',
        },
        {
          type: 'p',
          text: '**Schwangerschaft.** Zwei Beispiele im Skript zeigen den Fetus und die Plazenta. Im ersten liegt die Plazenta vor dem Muttermund (Placenta praevia), und es gibt Stellen, an denen sie möglicherweise in die Blasenwand einwächst. Das zweite ist eine neuere Methode, die die Plazenta in Kompartimente einteilt: den Raum zwischen den Zotten, in dem mütterliches Blut fließt, die Gefäße und das eigentliche Plazentagewebe. Die Farben sind dabei nachträglich kodierte Information, keine echten Gewebefarben. Warum MRT? Weil sie **keine ionisierende Strahlung** benutzt und Weichteile wie Plazenta, Gebärmutterwand und Blase gut unterscheidet. Kontrastmittel vermeidet man in der Schwangerschaft nach Möglichkeit.',
        },
        {
          type: 'p',
          text: 'Noch ein praktischer Vorteil steckt in allen diesen Beispielen: Dank der Ortskodierung mit drei Gradienten (Modul 3) kann die MRT **jede Schnittebene** direkt aufnehmen, axial, sagittal, koronal oder schräg. Der Patient muss dafür nicht umgelagert werden.',
        },
        {
          type: 'mnemonic',
          text: '**Frage bestimmt Gewichtung.** Wasser zeigen: T2. Anatomie mit Fett hell: T1. Dichte feiner Strukturen wie im Knie: PD. Und die Schnittebene wählt man frei: axial quer, sagittal von der Seite, koronal von vorne.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Hell im T2-Bild bedeutet krank.“ Richtig: Hell bedeutet langes T2, zum Beispiel normaler Liquor. Eine Diagnose braucht mehrere Sequenzen und den klinischen Zusammenhang.',
            'Falsch: „Keine ionisierende Strahlung heißt, jede MRT in der Schwangerschaft ist automatisch angezeigt.“ Richtig: Sie ist strahlungsfrei, aber jede Untersuchung braucht trotzdem einen Grund.',
          ],
        },
        {
          type: 'exam',
          question: 'Warum ist der Liquor im T2-gewichteten Bild hell, und warum wählt man für das Knie oft eine PD-Gewichtung?',
          answer: 'Liquor ist fast freies Wasser mit langem T2. Bei langem TE ist seine Quermagnetisierung noch groß, während Gewebe mit kürzerem T2 bereits dunkler ist. Für das Knie nutzt man PD (langes TR, kurzes TE): T1- und T2-Einflüsse werden klein, das Bild zeigt die Dichte beweglicher Protonen. So lassen sich Knorpel, Flüssigkeit, Menisken und Bänder mit hoher Detailschärfe nebeneinander darstellen.',
          full: 'Nenne die Werte aus dem Skript (PD 5500/14 ms, T2 5500/101 ms) und erkläre, warum Menisken und Bänder dunkel sind (sehr kurzes T2).',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'Kontrastmittel: Gadolinium macht T1 kürzer',
      blocks: [
        {
          type: 'p',
          text: 'Manchmal reichen die natürlichen Unterschiede zwischen Geweben nicht. Dann gibt man ein **Kontrastmittel** in die Vene, meistens eines mit **Gadolinium** (Gd). Wichtig zu verstehen: Man sieht im MRT-Bild nicht das Gadolinium selbst. Man sieht die Wasserprotonen in seiner Nähe, die sich durch das Gadolinium anders verhalten.',
        },
        {
          type: 'analogy',
          title: 'Ein Helfer, der beim Aufräumen anpackt',
          text: 'Stell dir vor, nach dem HF-Puls müssen die Protonen „aufräumen“ und ihre Energie loswerden, um zurück in die Ruhelage zu kommen. Alleine dauert das eine Weile, das ist T1. Gadolinium ist ein starker Magnet mit vielen ungepaarten Elektronen. Kommt ein Wassermolekül in seine Nähe, hilft es kräftig beim Energieabgeben. Mit Helfer ist das Aufräumen schneller fertig: T1 wird kürzer.',
        },
        {
          type: 'p',
          text: 'Das lässt sich in einer einfachen Formel ausdrücken. Die Relaxations**rate** $1/T_1$ ist so etwas wie „Aufräumtempo“. Jedes Kontrastmittelmolekül erhöht dieses Tempo ein Stück. Wie stark, sagt die **Relaxivität** $r_1$, eine Eigenschaft des Kontrastmittels. $c$ ist die örtliche Konzentration:',
        },
        {
          type: 'formula',
          tex: '\\frac{1}{T_{1,\\text{mit}}} = \\frac{1}{T_{1,\\text{ohne}}} + r_1\\,c',
          caption: 'mehr Kontrastmittel → höhere Rate → kürzeres T1',
        },
        {
          type: 'p',
          text: 'Und jetzt die Brücke zu Modul 2: Ein T1-gewichtetes Bild hat kurzes TR. Gewebe mit **kurzem T1** hat sich bis zur nächsten Anregung schon gut erholt und liefert deshalb viel Signal. Also gilt: **Wo Gadolinium ankommt, wird das T1-Bild heller.** Kontrastmittel reichert sich zum Beispiel dort an, wo die Blut-Hirn-Schranke gestört ist oder wo ein Tumor viele undichte Gefäße hat. Darum vergleicht man T1-Bilder vor und nach der Gabe.',
        },
        {
          type: 'p',
          text: 'Im Skript ist ein Glioblastom, ein bösartiger Hirntumor, dreimal abgebildet. Links nach einer **Viertel-Dosis** (4 ml), in der Mitte nach der **vollen Dosis** (insgesamt 16 ml), rechts das Viertel-Dosis-Bild nach einer **KI-Aufbereitung**, die versucht, so auszusehen wie das Bild mit voller Dosis. Hintergrund ist die **Gadolinium-Retention**: Man hat gefunden, dass kleine Mengen Gadolinium nach wiederholten Gaben im Körper zurückbleiben können, auch im Gehirn. Was das klinisch bedeutet, ist noch nicht vollständig geklärt. Deshalb gilt der Grundsatz, so wenig Kontrastmittel wie nötig zu geben.',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Ein schönes KI-Bild ist noch kein Beweis',
          text: 'Eine KI kann nur aus dem rechnen, was gemessen wurde. Sie kann Strukturen glätten, übersehen oder im schlimmsten Fall erfinden. Ein einzelnes Beispiel zeigt eine Möglichkeit, aber keine allgemein sichere Dosisreduktion. Dafür braucht es sorgfältige Studien.',
        },
        {
          type: 'mnemonic',
          text: '**Gado macht T1 kurz, T1 kurz macht T1w hell.** Man sieht nicht das Gadolinium, sondern das schneller erholte Wasser drum herum. Wegen der Retention gilt: so wenig wie nötig.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Gadolinium leuchtet selbst im Bild.“ Richtig: Es verkürzt T1 der benachbarten Wasserprotonen, und diese liefern im T1w-Bild mehr Signal.',
            'Falsch: „Kontrastmittel macht jedes Bild heller.“ Richtig: Der helle Effekt gilt für T1-gewichtete Bilder. Bei hoher Konzentration verkürzt Gd auch T2 und T2*, was das Signal sogar senken kann.',
          ],
        },
        {
          type: 'exam',
          question: 'Wie wirkt ein gadoliniumhaltiges Kontrastmittel, und warum versucht man, die Dosis zu reduzieren?',
          answer: 'Gadolinium ist stark paramagnetisch und verkürzt die T1-Zeit benachbarter Wasserprotonen ($1/T_1 = 1/T_{1,0} + r_1 c$). Im T1-gewichteten Bild (kurzes TR) erholen sich diese Protonen schneller und liefern mehr Signal, die Region erscheint heller. Die Dosis wird möglichst klein gehalten, weil Gadolinium nach wiederholten Gaben im Körper, auch im Gehirn, zurückbleiben kann (Gadolinium-Retention). KI-Verfahren sollen aus einer reduzierten Dosis ein Bild wie bei voller Dosis berechnen.',
          full: 'Erwähne, dass man die Wirkung auf Wasser und nicht das Gd selbst sieht, dass die Bilder vor und nach der Gabe verglichen werden und dass KI-Bilder validiert werden müssen.',
          sim: 'applications/contrast',
        },
      ],
    },
    {
      title: 'Hybridbildgebung: PET zeigt Funktion, MRT zeigt Anatomie',
      blocks: [
        {
          type: 'p',
          text: 'Im Skript siehst du einen Patienten mit Glioblastom einmal mit **PET/CT** und einmal mit **PET/MRT** untersucht. Solche Geräte nennt man **Hybridbildgebung**: Zwei Verfahren schauen gleichzeitig oder direkt nacheinander auf dieselbe Stelle, und die Bilder werden exakt übereinandergelegt.',
        },
        {
          type: 'analogy',
          title: 'Eine Wetterkarte auf dem Stadtplan',
          text: 'Eine Regenradar-Karte allein zeigt bunte Flecken, aber du weißt nicht genau, über welcher Straße es regnet. Ein Stadtplan allein zeigt jede Straße, aber kein Wetter. Legst du beide übereinander, weißt du sofort: Es regnet genau über dem Bahnhof. PET ist das Regenradar (wo passiert etwas), die MRT ist der detaillierte Stadtplan (wo genau ist das).',
        },
        {
          type: 'list',
          items: [
            '**PET** (Positronen-Emissions-Tomografie) misst, wo sich eine schwach radioaktive Markersubstanz, ein **Tracer**, anreichert. Je nach Tracer zeigt das zum Beispiel Stoffwechsel oder die Aufnahme bestimmter Moleküle in Tumorzellen. Das ist **funktionelle** oder molekulare Information. Die räumliche Auflösung ist aber eher grob.',
            '**CT** liefert schnell die Anatomie über die Röntgenabschwächung. Gut für Knochen, aber mit schwachem Weichteilkontrast und zusätzlicher Röntgenstrahlung.',
            '**MRT** liefert die Anatomie mit dem besten Weichteilkontrast, im Gehirn also feine Unterschiede zwischen Tumor, Ödem und gesundem Gewebe.',
          ],
        },
        {
          type: 'p',
          text: 'Beim Hirntumor ist PET/MRT deshalb besonders reizvoll: Die PET zeigt, wo das Tumorgewebe besonders aktiv ist, und die MRT zeigt mit hoher Detailschärfe, in welcher Hirnstruktur das liegt. Die beiden Informationen ergänzen sich.',
        },
        {
          type: 'p',
          text: 'Ein wichtiger Punkt zur Strahlung: Die MRT-Komponente ist strahlungsfrei. Die PET-Komponente aber nicht, denn der Tracer ist radioaktiv. **PET/MRT ist also nicht strahlungsfrei**, spart aber gegenüber PET/CT die zusätzliche Röntgendosis der CT.',
        },
        {
          type: 'mnemonic',
          text: '**PET sagt „hier ist was los“, MRT sagt „genau hier“.** Funktion plus Anatomie. Strahlung kommt nur vom Tracer, nicht vom Magneten.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „PET/MRT ist komplett frei von ionisierender Strahlung.“ Richtig: Der PET-Tracer ist radioaktiv, nur die MRT-Komponente ist strahlungsfrei.',
            'Falsch: „Die MRT misst bei PET/MRT die PET-Strahlung mit.“ Richtig: Beide Verfahren messen getrennt, die Bilder werden erst danach übereinandergelegt.',
          ],
        },
        {
          type: 'exam',
          question: 'Welchen Vorteil bietet PET/MRT gegenüber einer MRT allein und gegenüber PET/CT?',
          answer: 'Gegenüber der MRT allein ergänzt die PET funktionelle bzw. molekulare Information: Sie zeigt die Verteilung eines Tracers, etwa Stoffwechselaktivität im Tumor. Gegenüber PET/CT liefert die MRT den deutlich besseren Weichteilkontrast, im Gehirn eine viel genauere anatomische Zuordnung, und es entfällt die Röntgendosis der CT. Ionisierende Strahlung bleibt durch den PET-Tracer bestehen.',
          full: 'Nenne den Grundgedanken der Hybridbildgebung: Funktion (PET) und Anatomie (MRT oder CT) werden registriert und überlagert. Das Glioblastom aus dem Skript ist dafür ein Beispiel.',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'Physiologie messen: Blutfluss und Spektroskopie',
      blocks: [
        {
          type: 'p',
          text: 'Am Ende des Skripts steht: Neben der Anatomie gibt es viele weitere Anwendungen, nämlich **Spektroskopie**, **Flussmessung** und **Diffusions-Tensor-Bildgebung** (DTI). Die ersten beiden schauen wir hier an. Beide nutzen eine Eigenschaft des Signals, die du schon kennst, nur auf eine neue Art: die **Phase** und die **Frequenz**.',
        },
        {
          type: 'p',
          text: '**Flussmessung: Geschwindigkeit aus der Phase.** In Modul 3 hast du gelernt, dass ein Gradient die Präzessionsfrequenz ortsabhängig macht und die Spins dadurch Phase sammeln. Diesen Trick nutzt die Flussmessung (Phasenkontrast). Man schaltet einen Gradienten erst in die eine, dann gleich lang in die andere Richtung, einen sogenannten **bipolaren Gradienten**. Für ein ruhendes Proton heben sich beide Hälften genau auf: Es sammelt erst Phase und gibt sie dann wieder ab, am Ende bleibt null. Ein Proton im fließenden Blut ist aber in der zweiten Hälfte schon an einem anderen Ort und spürt ein anderes Feld. Bei ihm bleibt eine Restphase übrig, und die ist **proportional zur Geschwindigkeit**.',
        },
        {
          type: 'analogy',
          title: 'Hin und zurück auf einem schiefen Laufband',
          text: 'Stell dir vor, du stehst still auf einem Laufband. Das Band läuft erst eine Minute vorwärts, dann eine Minute gleich schnell rückwärts. Du landest genau wieder am Start. Läufst du aber selbst die ganze Zeit langsam weiter, landest du am Ende nicht am Start, sondern ein Stück weiter, und zwar umso weiter, je schneller du gehst. Genau so verrät die übrig gebliebene Phase, wie schnell das Blut fließt.',
        },
        {
          type: 'formula',
          tex: '\\Delta\\varphi = \\gamma\\,\\Delta M_1\\,v = \\pi\\,\\frac{v}{\\text{VENC}}',
          caption: 'Phasendifferenz ∝ Geschwindigkeit v',
        },
        {
          type: 'p',
          text: 'Hier ist $\\Delta\\varphi$ die gemessene Phasendifferenz, $\\gamma$ das gyromagnetische Verhältnis, $v$ die Geschwindigkeit und $\\Delta M_1$ eine Größe, die beschreibt, wie stark und wie lang der bipolare Gradient ist. Praktischer ist die Einstellung **VENC** (velocity encoding): Das ist die Geschwindigkeit, die genau einer Phase von 180° ($\\pi$) entspricht. Ist das Blut schneller als VENC, „überschlägt“ sich die Phase, denn eine Phase kennt man nur zwischen −180° und +180°. Dann wird schneller Fluss fälschlich als Fluss in die Gegenrichtung angezeigt. Das nennt man **Aliasing**. VENC wählt man also etwas größer als die schnellste erwartete Geschwindigkeit, aber nicht viel größer, sonst wird langsamer Fluss ungenau.',
        },
        {
          type: 'p',
          text: 'Wofür? Zum Beispiel in der **Kardiologie**: Wie schnell fließt das Blut durch die Aorta oder eine verengte Herzklappe? Wie viel Blut pumpt das Herz pro Schlag? Alles ohne Katheter und ohne Strahlung.',
        },
        {
          type: 'p',
          text: '**Spektroskopie: Chemie statt Bild.** Aus Modul 1 weißt du: Die Larmor-Frequenz hängt vom Magnetfeld ab, das das Proton tatsächlich spürt. Und das ist nicht ganz $B_0$. Die Elektronen um das Molekül schirmen das Feld ein winziges bisschen ab, und zwar je nach Molekül unterschiedlich stark. Ein Proton in Fett präzediert deshalb etwas langsamer als ein Proton in Wasser. Diese **chemische Verschiebung** ist winzig, man gibt sie in **ppm** an, also Millionstel der Larmor-Frequenz:',
        },
        {
          type: 'formula',
          tex: '\\Delta f\\,[\\text{Hz}] = \\delta\\,[\\text{ppm}]\\cdot f_0\\,[\\text{MHz}]',
          caption: 'feste ppm-Werte, der Abstand in Hz wächst mit dem Feld',
        },
        {
          type: 'p',
          text: 'Beispiel: Fett und Wasser liegen rund 3,5 ppm auseinander. Bei 1,5 T ist $f_0 \\approx 64$ MHz, das ergibt etwa 3,5 · 64 ≈ 220 Hz. Bei 3 T verdoppelt sich der Abstand in Hz, die ppm bleiben gleich. Statt aus dem Signal ein Bild zu machen, macht man mit der Fourier-Transformation aus Modul 4 ein **Spektrum** aus einem kleinen Gewebewürfel. Jede Spitze im Spektrum gehört zu einer Molekülsorte. Im Gehirn sind typische Spitzen **NAA** (ein Marker für Nervenzellen, bei 2,0 ppm), **Kreatin** (Energiestoffwechsel, bei 3,0 ppm) und **Cholin** (Zellmembranen, bei 3,2 ppm). Wie breit eine Spitze ist, hängt übrigens mit T2 zusammen: Das zeigt dir das Skript am Zusammenhang zwischen exponentiellem Zerfall und Halbwertsbreite der Spektrallinie.',
        },
        {
          type: 'mnemonic',
          text: '**Fluss steckt in der Phase, Chemie steckt in der Frequenz.** Bewegte Spins behalten nach dem bipolaren Gradienten eine Restphase. Verschiedene Moleküle präzedieren um ein paar ppm verschieden schnell.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Ein großer VENC ist immer sicherer.“ Richtig: Er verhindert Aliasing, macht aber langsamen Fluss ungenau.',
            'Falsch: „Bei höherem Feld wird der ppm-Abstand größer.“ Richtig: ppm bleiben gleich, nur der Abstand in Hz wächst, deshalb trennen sich die Spitzen bei hohem Feld besser.',
          ],
        },
        {
          type: 'exam',
          question: 'Wie kann man mit der MRT die Geschwindigkeit von Blut messen?',
          answer: 'Mit der Phasenkontrast-Flussmessung. Ein bipolarer Gradient (gleich lang positiv und negativ) hebt die Phase ruhender Spins auf. Bewegte Spins ändern während des Gradienten ihren Ort und behalten eine Restphase, die proportional zu ihrer Geschwindigkeit ist: $\\Delta\\varphi = \\gamma\\Delta M_1 v$. Aus der gemessenen Phasenverschiebung berechnet man die Geschwindigkeit. Der Parameter VENC legt fest, welche Geschwindigkeit einer Phase von π entspricht.',
          full: 'Erkläre Aliasing: Ist v größer als VENC, überschlägt sich die Phase und die Richtung wird falsch angezeigt. Nenne eine Anwendung, z. B. Blutfluss in Aorta oder Herzklappen.',
          sim: 'applications/flow',
        },
        {
          type: 'exam',
          question: 'Was misst die MR-Spektroskopie, und auf welchem physikalischen Effekt beruht sie?',
          answer: 'Sie misst, welche Moleküle in einem Gewebevolumen vorkommen und in welchem Verhältnis. Grundlage ist die chemische Verschiebung: Die Elektronenhülle schirmt das Feld je nach Molekül etwas unterschiedlich ab, deshalb haben Protonen in verschiedenen Molekülen leicht verschiedene Larmor-Frequenzen (wenige ppm). Die Fourier-Transformation des Signals ergibt ein Spektrum mit einer Spitze pro Molekülsorte, im Gehirn z. B. NAA, Kreatin und Cholin.',
          full: 'Zeige, dass der Abstand in Hz mit B₀ wächst ($\\Delta f = \\delta \\cdot f_0$), der ppm-Wert aber gleich bleibt. Erwähne, dass die Linienbreite mit T2 zusammenhängt.',
          sim: 'applications/mrs',
        },
      ],
    },
    {
      title: 'Diffusion, Traktografie und ein Blick auf die fMRI',
      blocks: [
        {
          type: 'p',
          text: 'Wassermoleküle stehen nie still. Sie zittern und stoßen sich ständig, dadurch wandern sie zufällig ein kleines Stück. Das ist **Diffusion**. In einem Glas Wasser ist sie in alle Richtungen gleich, man sagt **isotrop**. In einer Nervenbahn ist das anders: Die langen Nervenfasern mit ihren Hüllen wirken wie Leitplanken. Entlang der Faser kommt das Wasser leicht voran, quer dazu kaum. Das heißt **anisotrop**.',
        },
        {
          type: 'analogy',
          title: 'Ein Tropfen Tinte im Wasser und in einem Bündel Spaghetti',
          text: 'Ein Tintentropfen in einem Glas Wasser breitet sich zu einer runden Wolke aus. Gibst du den Tropfen aber in ein dichtes Bündel ungekochter Spaghetti, kann sich die Tinte nur entlang der Nudeln ausbreiten. Die Wolke wird lang und schmal wie eine Zigarre. Aus ihrer Form kannst du ablesen, in welche Richtung die Spaghetti liegen. Genau das macht die DTI mit den Nervenfasern.',
        },
        {
          type: 'p',
          text: 'Wie macht die MRT Diffusion sichtbar? Wieder mit Gradienten und Phase, wie bei der Flussmessung. Man schaltet starke **Diffusionsgradienten** in eine bestimmte Richtung. Protonen, die sich in dieser Richtung zufällig bewegt haben, sammeln eine zufällige Restphase. Viele verschiedene zufällige Phasen löschen sich gegenseitig aus, das Signal wird schwächer. Also: **Je mehr Diffusion in Messrichtung, desto weniger Signal.**',
        },
        {
          type: 'formula',
          tex: '\\frac{S}{S_0} = e^{-b\\,D}',
          caption: 'S: Signal mit, S₀: Signal ohne Diffusionsgradient',
        },
        {
          type: 'p',
          text: '$b$ beschreibt, wie stark die Diffusionsgewichtung ist (Stärke und Dauer der Gradienten), $D$ ist der Diffusionskoeffizient, also wie leicht sich das Wasser in dieser Richtung bewegt. Misst man in mindestens **sechs verschiedenen Richtungen**, kann man für jeden Bildpunkt einen **Diffusionstensor** berechnen. Das ist eine kleine mathematische Beschreibung der „Zigarre“ aus der Analogie: Wie lang ist sie, und wohin zeigt sie?',
        },
        {
          type: 'p',
          text: '**Traktografie.** Ein Computer verbindet nun die Hauptrichtungen benachbarter Bildpunkte zu durchgehenden Linien. So entstehen die bunten Bilder der **Nervenbahnen** im Gehirn, die im Skript zu sehen sind. Das zweite Beispiel im Skript zeigt dasselbe Prinzip am **Herzmuskel**: Auch die Muskelfasern des Herzens sind geordnet, und die DTI macht ihren spiralförmigen Verlauf sichtbar. Wichtig: Die Linien sind **modellbasierte Schätzungen** aus Diffusionsdaten, keine Fotos einzelner Nervenfasern. Wo sich Fasern kreuzen, wird das Modell unsicher.',
        },
        {
          type: 'p',
          text: '**fMRI, kurz eingeordnet.** Die funktionelle MRT steht im Skript in der Liste der Anwendungen. Sie zeigt, welche Hirnregion bei einer Aufgabe aktiver ist. Die Physik dahinter heißt **BOLD-Effekt**: Sauerstoffarmes Hämoglobin ist leicht magnetisch (paramagnetisch) und stört das Feld in seiner Umgebung, sauerstoffreiches nicht. Arbeitet eine Hirnregion, schickt der Körper mehr sauerstoffreiches Blut hin, als verbraucht wird. Dadurch sinkt dort der Anteil des störenden sauerstoffarmen Hämoglobins, das Feld wird gleichmäßiger, T2* wird etwas länger, und das Signal in einem T2*-gewichteten Bild steigt leicht an. Das passiert mit einigen Sekunden Verzögerung. Die fMRI misst also **indirekt** über die Durchblutung, nicht direkt die elektrische Aktivität der Nervenzellen.',
        },
        {
          type: 'mnemonic',
          text: '**Wasser verrät die Wege.** Diffusion entlang der Faser leicht, quer schwer. Viel Diffusion in Messrichtung heißt wenig Signal. Aus sechs oder mehr Richtungen entsteht der Tensor, aus den Tensoren die Traktografie.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Traktografie fotografiert einzelne Nervenfasern.“ Richtig: Sie berechnet aus der Diffusionsrichtung modellbasierte Pfade. Einzelne Axonen sind viel zu klein.',
            'Falsch: „Die fMRI misst die Nervenimpulse direkt.“ Richtig: Sie misst über den BOLD-Effekt die verzögerte Änderung der Durchblutung und Sauerstoffversorgung.',
          ],
        },
        {
          type: 'exam',
          question: 'Was zeigt die Diffusions-Tensor-Bildgebung (DTI), und wie entsteht eine Traktografie?',
          answer: 'DTI misst die gerichtete Diffusion von Wassermolekülen. In geordneten Faserstrukturen wie Nervenbahnen oder Herzmuskel diffundiert Wasser bevorzugt entlang der Fasern (anisotrop). Diffusionsgradienten schwächen das Signal umso stärker, je mehr Diffusion in Messrichtung stattfindet ($S/S_0 = e^{-bD}$). Aus Messungen in mindestens sechs Richtungen wird pro Bildpunkt ein Diffusionstensor berechnet. Die Traktografie verbindet die Hauptrichtungen benachbarter Bildpunkte zu Faserbahnen.',
          full: 'Nenne beide Anwendungen aus dem Skript (Nervenbahnen im Gehirn, Fasern des Herzmuskels) und betone, dass die Bahnen modellbasierte Schätzungen sind.',
          sim: 'applications/dti',
        },
        {
          type: 'exam',
          question: 'Worauf beruht das Signal der fMRI, und warum ist es ein indirektes Maß?',
          answer: 'Auf dem BOLD-Effekt. Sauerstoffarmes Hämoglobin ist paramagnetisch und verkürzt T2*. Bei Aktivität steigt die Durchblutung stärker als der Sauerstoffverbrauch, der Anteil sauerstoffarmen Hämoglobins sinkt, und das T2*-gewichtete Signal nimmt leicht und mit einigen Sekunden Verzögerung zu. Gemessen wird also eine Antwort der Durchblutung, nicht die elektrische Aktivität der Neuronen.',
          sim: 'applications/bold',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'Зачем вообще нужна МРТ?',
      blocks: [
        {
          type: 'hook',
          text: 'До этого момента ты узнал, как из протонов получается сигнал, а из сигнала изображение. Теперь вопрос, который почти наверняка будет на экзамене: **для чего всё это применяют и почему именно МРТ?** В этом модуле ты пройдёшь применения из конспекта. Для каждого ты узнаешь две вещи: **что мы видим** и **какая физика из модулей с 1 по 5 за этим стоит**. Именно эта связь приносит на экзамене полные баллы.',
        },
        {
          type: 'p',
          text: 'В конспекте есть короткий список применений и показаний. Читай его не как перечень для зубрёжки, а как ответ на вопрос: «Что МРТ умеет такого, чего другие методы не умеют так хорошо?».',
        },
        {
          type: 'list',
          items: [
            '**Мягкие ткани:** мозг, спинной мозг, мышцы, хрящи, связки и органы. А вот кость почти нет, потому что она даёт слишком мало сигнала.',
            '**Анатомическая и функциональная информация:** МРТ показывает не только, как что-то выглядит, но и как оно работает. Сюда относятся функциональная МРТ (фМРТ) и измерение кровотока.',
            '**Спектроскопия:** измеряют, какие молекулы находятся в участке ткани.',
            '**Церебральная диагностика:** исследования мозга относятся к самым важным областям МРТ.',
            '**Кардиология:** сердце и крупные сосуды, их движение, кровоток и даже направление волокон сердечной мышцы.',
          ],
        },
        {
          type: 'p',
          text: 'Почему мягкие ткани это сильная сторона МРТ? Вспомни модули 1 и 2. Сигнал идёт от подвижных ядер водорода в воде и жире. Мягкие ткани различаются тремя величинами: **протонной плотностью** (сколько воды), **T1** (как быстро восстанавливается продольная намагниченность) и **T2** (как быстро затухает поперечный сигнал). С помощью TR и TE можно выбрать, какая из этих величин определяет изображение. Так из одной и той же анатомии получается много разных контрастов. Рентген же по сути знает только одну величину: насколько ткань ослабляет излучение. А мягкие ткани ослабляют его почти одинаково.',
        },
        {
          type: 'analogy',
          title: 'Микшерный пульт вместо одной ручки громкости',
          text: 'Рентгеновский снимок похож на радио с одной ручкой громкости: можно сделать всё громче или тише, но нельзя выделить отдельные инструменты. МРТ это микшерный пульт с тремя ползунками: протонная плотность, T1 и T2. Через TR и TE ты двигаешь ползунки так, чтобы громко звучал именно тот «инструмент», который тебе нужен, например жидкость на T2-изображении.',
        },
        {
          type: 'p',
          text: 'На первом изображении в конспекте показан мозг. Кость черепа там практически невидима, а тонкие структуры мозжечка видны с высоким контрастом. Причина тёмной кости: в плотной кости мало подвижных протонов, и их слабый сигнал затухает очень быстро (очень короткое T2). К обычному времени эха от него ничего не остаётся.',
        },
        {
          type: 'p',
          text: 'Ещё одно преимущество, которое встречается почти в каждом обосновании: МРТ работает с магнитным полем и радиоволнами. Она **не использует ионизирующее излучение**. Это особенно важно для детей, при повторных контролях и во время беременности.',
        },
        {
          type: 'mnemonic',
          text: '**Мягко, функционально, без излучения.** МРТ сильна в мягких тканях, кроме анатомии показывает функцию (поток, фМРТ, спектроскопия) и обходится без рентгеновских лучей. Кость её слабое место.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Кость тёмная, потому что в ней вообще нет протонов». Верно: в ней мало подвижных протонов, и их сигнал из-за очень короткого T2 затухает ещё до считывания.',
            'Неверно: «МРТ даёт только изображения анатомии». Верно: поток, диффузия, спектроскопия и фМРТ дают физиологическую и функциональную информацию.',
          ],
        },
        {
          type: 'exam',
          question: 'Назови типичные применения и показания МРТ и объясни, почему МРТ для них подходит.',
          answer: 'Типичны изображения мягких тканей (мозг и церебральная диагностика, суставы, например колено, таз, сердце в кардиологии, беременность), а также функциональные и физиологические измерения: фМРТ, кровоток, диффузия или DTI и спектроскопия. МРТ подходит, потому что сигнал идёт от протонов воды и жира, а мягкие ткани различаются протонной плотностью, T1 и T2. С помощью TR и TE из этого создаются разные контрасты. Кроме того, она работает без ионизирующего излучения.',
          full: 'Упомяни ограничение: плотная кость почти не даёт сигнала из-за малого числа подвижных протонов и очень короткого T2. Назови также различие «анатомическая» и «функциональная/физиологическая» информация.',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'Анатомия в оттенках серого: мозг, колено, таз и беременность',
      blocks: [
        {
          type: 'p',
          text: 'Большинство примеров в конспекте это анатомические снимки. На экзамене не нужно ставить диагнозы. Но ты должен уметь объяснить, **какое взвешивание выбрано и почему оно подходит к вопросу**. Для этого достаточно правил из модуля 2. Напомним три примера из конспекта:',
        },
        {
          type: 'table',
          head: ['Взвешивание', 'TR', 'TE', 'Что яркое'],
          rows: [
            ['PD', 'длинное (5500 мс)', 'короткое (14 мс)', 'много подвижных протонов'],
            ['T1', 'короткое (500 мс)', 'короткое (10 мс)', 'короткое T1, например жир'],
            ['T2', 'длинное (5500 мс)', 'длинное (101 мс)', 'длинное T2, например вода, ликвор'],
          ],
        },
        {
          type: 'p',
          text: '**Мозг, аксиальное T2-изображение.** «Аксиальный» значит поперечный срез, как будто смотришь снизу или сверху на ломтик головы. На T2 ликвор в желудочках и вокруг мозга яркий, потому что у свободной воды длинное T2. Её поперечная намагниченность при длинном времени эха ещё не затухла. Серое и белое вещество различаются содержанием воды и временами релаксации, поэтому их тоже хорошо видно по отдельности. Никакой другой метод не показывает ткань мозга так детально, поэтому церебральная диагностика это одно из главных применений.',
        },
        {
          type: 'p',
          text: '**Колено, сагиттальное PD-изображение.** «Сагиттальный» значит продольный срез сбоку, он делит тело на левую и правую части. PD использует длинное TR и короткое TE. Длинное TR даёт всем тканям время восстановиться, и различия T1 исчезают. Короткое TE измеряет до того, как различия T2 станут большими. Остаётся плотность подвижных протонов. Так рядом видны хрящ, мениски, связки и суставная жидкость. Мениски и связки выглядят тёмными, потому что у их плотной ткани очень короткое T2. Пример в конспекте показывает колено без признаков травмы.',
        },
        {
          type: 'p',
          text: '**Таз.** Пример показывает ретровертированную матку, то есть матку, наклонённую назад. Это вариант положения и сам по себе не болезнь. Снимок сделан при исследовании поясничного отдела позвоночника: это **случайная находка**. Хотели посмотреть межпозвонковые диски, а попутно отобразились органы таза. Вывод: поскольку МРТ показывает все мягкие ткани в поле зрения, часто видно больше, чем искали.',
        },
        {
          type: 'p',
          text: '**Беременность.** Два примера в конспекте показывают плод и плаценту. В первом плацента расположена перед внутренним зевом (предлежание плаценты), и есть участки, где она, возможно, врастает в стенку мочевого пузыря. Второй пример это новый метод, который делит плаценту на компартменты: пространство между ворсинами, где течёт материнская кровь, сосуды и собственно ткань плаценты. Цвета здесь добавлены как закодированная информация, это не настоящие цвета ткани. Почему МРТ? Потому что она **не использует ионизирующее излучение** и хорошо различает мягкие ткани: плаценту, стенку матки и мочевой пузырь. Контрастное вещество при беременности по возможности не вводят.',
        },
        {
          type: 'p',
          text: 'Во всех этих примерах есть ещё одно практическое преимущество: благодаря пространственному кодированию тремя градиентами (модуль 3) МРТ может напрямую снять **любую плоскость среза**: аксиальную, сагиттальную, корональную или косую. Пациента для этого не нужно перекладывать.',
        },
        {
          type: 'mnemonic',
          text: '**Вопрос определяет взвешивание.** Показать воду: T2. Анатомия с ярким жиром: T1. Плотность тонких структур, как в колене: PD. А плоскость выбирают свободно: аксиальная поперёк, сагиттальная сбоку, корональная спереди.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Яркое на T2 значит больное». Верно: яркое значит длинное T2, например нормальный ликвор. Для диагноза нужны несколько последовательностей и клинический контекст.',
            'Неверно: «Нет ионизирующего излучения, значит любая МРТ при беременности автоматически показана». Верно: она без излучения, но каждому исследованию всё равно нужна причина.',
          ],
        },
        {
          type: 'exam',
          question: 'Почему ликвор яркий на T2-взвешенном изображении и почему для колена часто выбирают PD-взвешивание?',
          answer: 'Ликвор это почти свободная вода с длинным T2. При длинном TE его поперечная намагниченность ещё велика, а ткани с более коротким T2 уже темнее. Для колена используют PD (длинное TR, короткое TE): влияние T1 и T2 становится малым, изображение показывает плотность подвижных протонов. Так можно с высокой детализацией показать рядом хрящ, жидкость, мениски и связки.',
          full: 'Назови значения из конспекта (PD 5500/14 мс, T2 5500/101 мс) и объясни, почему мениски и связки тёмные (очень короткое T2).',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'Контрастное вещество: гадолиний укорачивает T1',
      blocks: [
        {
          type: 'p',
          text: 'Иногда естественных различий между тканями недостаточно. Тогда в вену вводят **контрастное вещество**, чаще всего на основе **гадолиния** (Gd). Важно понять: на МР-изображении видно не сам гадолиний. Видны протоны воды рядом с ним, которые из-за гадолиния ведут себя иначе.',
        },
        {
          type: 'analogy',
          title: 'Помощник при уборке',
          text: 'Представь, что после РЧ-импульса протоны должны «прибраться» и избавиться от энергии, чтобы вернуться в состояние покоя. В одиночку это занимает время, это и есть T1. Гадолиний это сильный магнит со многими неспаренными электронами. Когда молекула воды оказывается рядом, он активно помогает отдать энергию. С помощником уборка заканчивается быстрее: T1 становится короче.',
        },
        {
          type: 'p',
          text: 'Это можно записать простой формулой. Скорость релаксации $1/T_1$ это что-то вроде «темпа уборки». Каждая молекула контрастного вещества немного повышает этот темп. Насколько сильно, говорит **релаксивность** $r_1$, свойство контрастного вещества. $c$ это локальная концентрация:',
        },
        {
          type: 'formula',
          tex: '\\frac{1}{T_{1,\\text{с}}} = \\frac{1}{T_{1,\\text{без}}} + r_1\\,c',
          caption: 'больше контраста → выше скорость → короче T1',
        },
        {
          type: 'p',
          text: 'А теперь мост к модулю 2: у T1-взвешенного изображения короткое TR. Ткань с **коротким T1** к следующему возбуждению уже хорошо восстановилась и поэтому даёт много сигнала. Значит: **где появляется гадолиний, T1-изображение становится ярче.** Контраст накапливается, например, там, где нарушен гематоэнцефалический барьер или где у опухоли много проницаемых сосудов. Поэтому сравнивают T1-изображения до и после введения.',
        },
        {
          type: 'p',
          text: 'В конспекте глиобластома, злокачественная опухоль мозга, показана трижды. Слева после **четверти дозы** (4 мл), в середине после **полной дозы** (всего 16 мл), справа изображение с четвертью дозы после **ИИ-обработки**, которая пытается выглядеть как снимок с полной дозой. Причина такого подхода **ретенция гадолиния**: обнаружено, что после повторных введений небольшие количества гадолиния могут оставаться в организме, в том числе в мозге. Клиническое значение этого ещё не до конца ясно. Поэтому действует принцип: вводить столько контраста, сколько нужно, и не больше.',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Красивое ИИ-изображение ещё не доказательство',
          text: 'ИИ может считать только по тому, что было измерено. Он может сгладить структуры, пропустить их или в худшем случае придумать. Один пример показывает возможность, но не общее безопасное снижение дозы. Для этого нужны тщательные исследования.',
        },
        {
          type: 'mnemonic',
          text: '**Гадолиний укорачивает T1, короткое T1 делает T1w ярким.** Видно не сам гадолиний, а быстрее восстановившуюся воду вокруг. Из-за ретенции: столько, сколько нужно.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Гадолиний сам светится на изображении». Верно: он укорачивает T1 соседних протонов воды, и они дают больше сигнала на T1w-изображении.',
            'Неверно: «Контраст делает любое изображение ярче». Верно: эффект усиления касается T1-взвешенных изображений. При высокой концентрации Gd укорачивает также T2 и T2*, что может даже снизить сигнал.',
          ],
        },
        {
          type: 'exam',
          question: 'Как действует гадолиниевое контрастное вещество и почему стараются уменьшить дозу?',
          answer: 'Гадолиний сильно парамагнитен и укорачивает время T1 соседних протонов воды ($1/T_1 = 1/T_{1,0} + r_1 c$). На T1-взвешенном изображении (короткое TR) эти протоны восстанавливаются быстрее и дают больше сигнала, область выглядит ярче. Дозу стараются держать минимальной, потому что после повторных введений гадолиний может оставаться в организме, в том числе в мозге (ретенция гадолиния). ИИ-методы должны по сниженной дозе рассчитать изображение, как при полной дозе.',
          full: 'Упомяни, что видно действие на воду, а не сам Gd, что сравнивают снимки до и после введения и что ИИ-изображения нужно валидировать.',
          sim: 'applications/contrast',
        },
      ],
    },
    {
      title: 'Гибридная визуализация: ПЭТ показывает функцию, МРТ анатомию',
      blocks: [
        {
          type: 'p',
          text: 'В конспекте пациент с глиобластомой исследован один раз на **ПЭТ/КТ** и один раз на **ПЭТ/МРТ**. Такие устройства называют **гибридной визуализацией**: два метода одновременно или сразу друг за другом смотрят на одно и то же место, а изображения точно совмещают.',
        },
        {
          type: 'analogy',
          title: 'Карта погоды на плане города',
          text: 'Карта дождевого радара сама по себе показывает цветные пятна, но непонятно, над какой именно улицей идёт дождь. План города показывает каждую улицу, но не погоду. Наложи одно на другое, и сразу ясно: дождь идёт точно над вокзалом. ПЭТ это дождевой радар (где что-то происходит), МРТ это подробный план города (где именно).',
        },
        {
          type: 'list',
          items: [
            '**ПЭТ** (позитронно-эмиссионная томография) измеряет, где накапливается слабо радиоактивное меченое вещество, **трейсер**. В зависимости от трейсера это показывает, например, обмен веществ или захват определённых молекул опухолевыми клетками. Это **функциональная** или молекулярная информация. Но пространственное разрешение довольно грубое.',
            '**КТ** быстро даёт анатомию через ослабление рентгеновского излучения. Хороша для кости, но со слабым контрастом мягких тканей и дополнительным рентгеновским излучением.',
            '**МРТ** даёт анатомию с лучшим контрастом мягких тканей, в мозге это тонкие различия между опухолью, отёком и здоровой тканью.',
          ],
        },
        {
          type: 'p',
          text: 'При опухоли мозга ПЭТ/МРТ поэтому особенно интересна: ПЭТ показывает, где опухолевая ткань особенно активна, а МРТ с высокой детализацией показывает, в какой структуре мозга это находится. Обе информации дополняют друг друга.',
        },
        {
          type: 'p',
          text: 'Важный момент про излучение: МРТ-компонента без излучения. А ПЭТ-компонента нет, ведь трейсер радиоактивен. **ПЭТ/МРТ, значит, не свободна от излучения**, но по сравнению с ПЭТ/КТ экономит дополнительную рентгеновскую дозу КТ.',
        },
        {
          type: 'mnemonic',
          text: '**ПЭТ говорит «здесь что-то происходит», МРТ говорит «вот точно здесь».** Функция плюс анатомия. Излучение идёт только от трейсера, не от магнита.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «ПЭТ/МРТ полностью свободна от ионизирующего излучения». Верно: трейсер ПЭТ радиоактивен, без излучения только МРТ-компонента.',
            'Неверно: «В ПЭТ/МРТ томограф МРТ заодно измеряет излучение ПЭТ». Верно: оба метода измеряют отдельно, изображения совмещают уже потом.',
          ],
        },
        {
          type: 'exam',
          question: 'Какое преимущество даёт ПЭТ/МРТ по сравнению с одной МРТ и по сравнению с ПЭТ/КТ?',
          answer: 'По сравнению с одной МРТ ПЭТ добавляет функциональную или молекулярную информацию: показывает распределение трейсера, например метаболическую активность опухоли. По сравнению с ПЭТ/КТ МРТ даёт заметно лучший контраст мягких тканей, в мозге гораздо более точную анатомическую привязку, и отпадает рентгеновская доза КТ. Ионизирующее излучение от трейсера ПЭТ остаётся.',
          full: 'Назови основную идею гибридной визуализации: функцию (ПЭТ) и анатомию (МРТ или КТ) совмещают и накладывают. Глиобластома из конспекта это пример.',
          sim: 'applications/cases',
        },
      ],
    },
    {
      title: 'Измерять физиологию: кровоток и спектроскопия',
      blocks: [
        {
          type: 'p',
          text: 'В конце конспекта написано: кроме анатомии есть много других применений, а именно **спектроскопия**, **измерение потока** и **диффузионно-тензорная визуализация** (DTI). Первые два рассмотрим здесь. Оба используют уже знакомое свойство сигнала, только по-новому: **фазу** и **частоту**.',
        },
        {
          type: 'p',
          text: '**Измерение потока: скорость из фазы.** В модуле 3 ты узнал, что градиент делает частоту прецессии зависящей от места, и спины из-за этого набирают фазу. Этим приёмом пользуется измерение потока (фазовый контраст). Включают градиент сначала в одну сторону, а потом столько же времени в другую, так называемый **биполярный градиент**. Для неподвижного протона обе половины точно компенсируются: он сначала набирает фазу, потом отдаёт её обратно, в итоге остаётся ноль. Протон в текущей крови во второй половине уже в другом месте и чувствует другое поле. У него остаётся остаточная фаза, и она **пропорциональна скорости**.',
        },
        {
          type: 'analogy',
          title: 'Туда и обратно на беговой дорожке',
          text: 'Представь, что ты стоишь неподвижно на беговой дорожке. Лента минуту едет вперёд, потом минуту так же быстро назад. Ты оказываешься точно на старте. Но если ты всё время сам медленно идёшь, то в конце окажешься не на старте, а чуть дальше, и тем дальше, чем быстрее идёшь. Точно так же оставшаяся фаза выдаёт, как быстро течёт кровь.',
        },
        {
          type: 'formula',
          tex: '\\Delta\\varphi = \\gamma\\,\\Delta M_1\\,v = \\pi\\,\\frac{v}{\\text{VENC}}',
          caption: 'разность фаз ∝ скорости v',
        },
        {
          type: 'p',
          text: 'Здесь $\\Delta\\varphi$ это измеренная разность фаз, $\\gamma$ гиромагнитное отношение, $v$ скорость, а $\\Delta M_1$ величина, описывающая, насколько сильный и длинный биполярный градиент. На практике удобнее параметр **VENC** (velocity encoding): это скорость, которая соответствует фазе ровно 180° ($\\pi$). Если кровь быстрее VENC, фаза «перескакивает», ведь фаза известна только между −180° и +180°. Тогда быстрый поток ошибочно показывается как поток в обратную сторону. Это называется **алиасингом**. Поэтому VENC выбирают немного больше самой высокой ожидаемой скорости, но не намного, иначе медленный поток измеряется неточно.',
        },
        {
          type: 'p',
          text: 'Для чего? Например, в **кардиологии**: как быстро течёт кровь через аорту или суженный клапан? Сколько крови сердце выбрасывает за одно сокращение? Всё без катетера и без излучения.',
        },
        {
          type: 'p',
          text: '**Спектроскопия: химия вместо изображения.** Из модуля 1 ты знаешь: ларморова частота зависит от поля, которое протон реально чувствует. А это не совсем $B_0$. Электроны вокруг молекулы чуть-чуть экранируют поле, и в разных молекулах по-разному. Поэтому протон в жире прецессирует немного медленнее, чем протон в воде. Этот **химический сдвиг** крошечный, его указывают в **ppm**, то есть в миллионных долях ларморовой частоты:',
        },
        {
          type: 'formula',
          tex: '\\Delta f\\,[\\text{Гц}] = \\delta\\,[\\text{ppm}]\\cdot f_0\\,[\\text{МГц}]',
          caption: 'значения в ppm постоянны, расстояние в Гц растёт с полем',
        },
        {
          type: 'p',
          text: 'Пример: жир и вода отстоят примерно на 3,5 ppm. При 1,5 Тл $f_0 \\approx 64$ МГц, это даёт около 3,5 · 64 ≈ 220 Гц. При 3 Тл расстояние в Гц удваивается, а ppm остаются прежними. Вместо изображения из сигнала с помощью преобразования Фурье из модуля 4 получают **спектр** маленького кубика ткани. Каждый пик в спектре принадлежит одному виду молекул. В мозге типичные пики это **NAA** (маркер нервных клеток, 2,0 ppm), **креатин** (энергетический обмен, 3,0 ppm) и **холин** (клеточные мембраны, 3,2 ppm). Ширина пика, кстати, связана с T2: в конспекте это показано на связи экспоненциального затухания и полуширины спектральной линии.',
        },
        {
          type: 'mnemonic',
          text: '**Поток спрятан в фазе, химия спрятана в частоте.** Движущиеся спины после биполярного градиента сохраняют остаточную фазу. Разные молекулы прецессируют на несколько ppm по-разному быстро.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Большой VENC всегда надёжнее». Верно: он предотвращает алиасинг, но делает медленный поток неточным.',
            'Неверно: «При более сильном поле расстояние в ppm растёт». Верно: ppm остаются прежними, растёт только расстояние в Гц, поэтому при сильном поле пики разделяются лучше.',
          ],
        },
        {
          type: 'exam',
          question: 'Как с помощью МРТ можно измерить скорость крови?',
          answer: 'С помощью фазоконтрастного измерения потока. Биполярный градиент (одинаково долго положительный и отрицательный) компенсирует фазу неподвижных спинов. Движущиеся спины во время градиента меняют положение и сохраняют остаточную фазу, пропорциональную их скорости: $\\Delta\\varphi = \\gamma\\Delta M_1 v$. По измеренному фазовому сдвигу рассчитывают скорость. Параметр VENC задаёт, какая скорость соответствует фазе π.',
          full: 'Объясни алиасинг: если v больше VENC, фаза перескакивает и направление показывается неверно. Назови применение, например кровоток в аорте или через клапаны сердца.',
          sim: 'applications/flow',
        },
        {
          type: 'exam',
          question: 'Что измеряет МР-спектроскопия и на каком физическом эффекте она основана?',
          answer: 'Она измеряет, какие молекулы есть в объёме ткани и в каком соотношении. Основа это химический сдвиг: электронная оболочка в разных молекулах немного по-разному экранирует поле, поэтому у протонов в разных молекулах слегка разные ларморовы частоты (несколько ppm). Преобразование Фурье сигнала даёт спектр с одним пиком на каждый вид молекул, в мозге например NAA, креатин и холин.',
          full: 'Покажи, что расстояние в Гц растёт с B₀ ($\\Delta f = \\delta \\cdot f_0$), а значение в ppm остаётся прежним. Упомяни, что ширина линии связана с T2.',
          sim: 'applications/mrs',
        },
      ],
    },
    {
      title: 'Диффузия, трактография и взгляд на фМРТ',
      blocks: [
        {
          type: 'p',
          text: 'Молекулы воды никогда не стоят на месте. Они дрожат и постоянно сталкиваются, поэтому случайно смещаются на небольшое расстояние. Это **диффузия**. В стакане воды она одинакова во всех направлениях, говорят **изотропна**. В нервном пути иначе: длинные нервные волокна с их оболочками работают как ограждения. Вдоль волокна вода продвигается легко, поперёк почти нет. Это называется **анизотропией**.',
        },
        {
          type: 'analogy',
          title: 'Капля чернил в воде и в пучке спагетти',
          text: 'Капля чернил в стакане воды расплывается круглым облаком. А если капнуть её в плотный пучок сырых спагетти, чернила смогут распространяться только вдоль макаронин. Облако станет длинным и узким, как сигара. По его форме можно понять, в каком направлении лежат спагетти. Именно это DTI делает с нервными волокнами.',
        },
        {
          type: 'p',
          text: 'Как МРТ делает диффузию видимой? Опять с помощью градиентов и фазы, как при измерении потока. Включают сильные **диффузионные градиенты** в определённом направлении. Протоны, которые случайно сместились в этом направлении, набирают случайную остаточную фазу. Множество разных случайных фаз взаимно гасятся, сигнал слабеет. Итак: **чем больше диффузии в направлении измерения, тем меньше сигнала.**',
        },
        {
          type: 'formula',
          tex: '\\frac{S}{S_0} = e^{-b\\,D}',
          caption: 'S: сигнал с диффузионным градиентом, S₀: без него',
        },
        {
          type: 'p',
          text: '$b$ описывает силу диффузионного взвешивания (силу и длительность градиентов), $D$ это коэффициент диффузии, то есть насколько легко вода движется в этом направлении. Если измерить как минимум в **шести разных направлениях**, для каждого пикселя можно рассчитать **тензор диффузии**. Это небольшое математическое описание «сигары» из аналогии: насколько она длинная и куда направлена?',
        },
        {
          type: 'p',
          text: '**Трактография.** Компьютер соединяет главные направления соседних пикселей в непрерывные линии. Так получаются цветные изображения **нервных путей** в мозге, которые есть в конспекте. Второй пример в конспекте показывает тот же принцип на **сердечной мышце**: мышечные волокна сердца тоже упорядочены, и DTI делает видимым их спиральный ход. Важно: линии это **модельные оценки** по диффузионным данным, а не фотографии отдельных нервных волокон. Где волокна пересекаются, модель становится ненадёжной.',
        },
        {
          type: 'p',
          text: '**фМРТ, коротко.** Функциональная МРТ есть в конспекте в списке применений. Она показывает, какая область мозга активнее при выполнении задачи. Физика здесь называется **BOLD-эффектом**: бедный кислородом гемоглобин слегка магнитен (парамагнитен) и искажает поле вокруг себя, а насыщенный кислородом нет. Когда область мозга работает, организм направляет туда больше насыщенной кислородом крови, чем расходуется. Поэтому доля мешающего дезоксигемоглобина там падает, поле становится однороднее, T2* немного удлиняется, и сигнал на T2*-взвешенном изображении слегка растёт. Это происходит с задержкой в несколько секунд. Значит, фМРТ измеряет **косвенно** через кровоснабжение, а не напрямую электрическую активность нейронов.',
        },
        {
          type: 'mnemonic',
          text: '**Вода выдаёт пути.** Вдоль волокна диффузия лёгкая, поперёк трудная. Много диффузии в направлении измерения значит мало сигнала. Из шести и более направлений получается тензор, из тензоров трактография.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Трактография фотографирует отдельные нервные волокна». Верно: она рассчитывает модельные пути по направлению диффузии. Отдельные аксоны слишком малы.',
            'Неверно: «фМРТ напрямую измеряет нервные импульсы». Верно: через BOLD-эффект она измеряет запаздывающее изменение кровотока и снабжения кислородом.',
          ],
        },
        {
          type: 'exam',
          question: 'Что показывает диффузионно-тензорная визуализация (DTI) и как получается трактография?',
          answer: 'DTI измеряет направленную диффузию молекул воды. В упорядоченных волокнистых структурах, таких как нервные пути или сердечная мышца, вода диффундирует преимущественно вдоль волокон (анизотропно). Диффузионные градиенты ослабляют сигнал тем сильнее, чем больше диффузия в направлении измерения ($S/S_0 = e^{-bD}$). По измерениям как минимум в шести направлениях для каждого пикселя рассчитывают тензор диффузии. Трактография соединяет главные направления соседних пикселей в волоконные пути.',
          full: 'Назови оба применения из конспекта (нервные пути мозга, волокна сердечной мышцы) и подчеркни, что пути это модельные оценки.',
          sim: 'applications/dti',
        },
        {
          type: 'exam',
          question: 'На чём основан сигнал фМРТ и почему это косвенная мера?',
          answer: 'На BOLD-эффекте. Бедный кислородом гемоглобин парамагнитен и укорачивает T2*. При активности кровоток растёт сильнее, чем потребление кислорода, доля дезоксигемоглобина падает, и T2*-взвешенный сигнал слегка увеличивается с задержкой в несколько секунд. Значит, измеряется реакция кровотока, а не электрическая активность нейронов.',
          sim: 'applications/bold',
        },
      ],
    },
  ],
};
