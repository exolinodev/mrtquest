import type { Chapter } from './types';

/**
 * Modul 4: Fourier & k-Raum.
 * Inhaltliche Grundlage: MBR-Skript „Magnetic Resonance Imaging“, Abschnitte Signals and Image Generation
 * sowie „Fourier Transformation in a Nutshell“ und Lab 3.
 */
export const kraum: Chapter = {
  de: [
    {
      title: 'Jedes Signal ist ein Akkord: die Fourier-Reihe',
      blocks: [
        {
          type: 'hook',
          text: 'Im Kapitel „Vom Signal zum Bild“ bist du auf eine unbequeme Wahrheit gestoßen: Die Spule misst **kein Bild**. Sie misst ein einziges Summensignal, in dem alle Orte gleichzeitig mitsingen. Um daraus ein Bild zu machen, brauchst du ein Werkzeug, das ein Gemisch wieder in seine Bestandteile zerlegt. Dieses Werkzeug heißt **Fourier-Transformation**. In diesem Modul lernst du es von Grund auf kennen und verstehst dann den **k-Raum**, also die Rohdaten jeder MRT.',
        },
        {
          type: 'analogy',
          title: 'Ein Klavierakkord und der Equalizer',
          text: 'Schlägst du auf dem Klavier einen Akkord an, hörst du einen einzigen Klang. Trotzdem steckt darin eine Handvoll reiner Töne, jeder mit seiner eigenen Tonhöhe und Lautstärke. Ein geübtes Ohr hört die Töne heraus. Der Equalizer deiner Musik-App macht genau das sichtbar: Jeder Balken zeigt, wie laut eine bestimmte Frequenz gerade ist. Die Fourier-Zerlegung ist dieser Equalizer, nur mathematisch exakt.',
        },
        {
          type: 'p',
          text: 'Die Grundidee aus dem Skript ist erstaunlich einfach: **Jede periodische Funktion lässt sich als Summe von Sinus- und Kosinusschwingungen schreiben.** Dabei kommen nur ganzzahlige Frequenzen vor: die Grundschwingung, die doppelte, die dreifache und so weiter. Man nennt sie **Harmonische**, wie die Obertöne eines Instruments.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} f(t) &= \\frac{a_0}{2} \\\\ &\\quad + \\sum_{n=1}^{\\infty} \\big( a_n \\cos(nt) + b_n \\sin(nt) \\big) \\end{aligned}',
          caption: 'Fourier-Reihe einer periodischen Funktion',
        },
        {
          type: 'list',
          items: [
            '$a_0/2$ ist der **Mittelwert** der Funktion, also der konstante Sockel, auf dem alles schwingt.',
            '$n$ ist die **Nummer der Harmonischen**. $n = 1$ ist die Grundschwingung, $n = 2$ schwingt doppelt so schnell.',
            '$a_n$ sagt, wie viel **Kosinus** der Frequenz n im Signal steckt.',
            '$b_n$ sagt, wie viel **Sinus** der Frequenz n im Signal steckt.',
          ],
        },
        {
          type: 'p',
          text: 'Im Skript ist die Periode $T = 2\\pi$ gewählt, deshalb steht im Argument einfach $nt$. Bei einer beliebigen Periode T schreibt man $n\\omega_0 t$ mit $\\omega_0 = 2\\pi/T$. Das Prinzip bleibt gleich.',
        },
        {
          type: 'p',
          text: 'Das Beispiel aus der Vorlesung ist der **Sägezahn**. Er hat scharfe Ecken, und trotzdem kann man ihn aus glatten Sinuswellen bauen. Man nimmt alle Harmonischen, aber jede nächsthöhere nur noch mit dem Gewicht 1/n:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} f(t) &= \\sum_{n=1}^{\\infty} \\frac{1}{n}\\sin(nt) \\\\ &= \\sin t + \\tfrac12\\sin 2t + \\tfrac13 \\sin 3t + \\dots \\end{aligned}',
          caption: 'Sägezahn als Summe von Sinuswellen',
        },
        {
          type: 'p',
          text: 'Mit nur einem Summanden siehst du eine Sinuswelle. Mit drei Summanden ahnst du schon den Sägezahn. Je mehr hohe Harmonische du dazunimmst, desto **schärfer werden die Kanten**. Merk dir diesen Satz gut, denn er wird am Ende des Moduls die Recap-Frage zu den Kanten beantworten.',
        },
        {
          type: 'figure',
          id: 'fourier-sum',
          caption: 'Links siehst du drei Sinuswellen mit den Amplituden 1, ½ und ⅓, darunter ihre Summe, die schon fast wie der gestrichelte Sägezahn aussieht. Rechts stehen dieselben Amplituden als Balken: Das ist das Spektrum des Signals.',
        },
        {
          type: 'mnemonic',
          text: '**Langsame Wellen machen die Form, schnelle Wellen machen die Kanten.** Jedes periodische Signal ist ein Akkord aus Sinus und Kosinus mit ganzzahligen Frequenzen.',
        },
        {
          type: 'exam',
          question: 'Was besagt die Fourier-Reihe, und was bedeuten die Koeffizienten $a_n$ und $b_n$?',
          answer: 'Jede periodische Funktion lässt sich als Summe aus einem konstanten Anteil $a_0/2$ und Kosinus- und Sinusschwingungen mit ganzzahligen Vielfachen der Grundfrequenz darstellen. $a_n$ und $b_n$ sind die Amplituden des Kosinus- bzw. Sinusanteils der n-ten Harmonischen. Zusammen bilden sie das Spektrum des Signals.',
          full: 'Nenne das Beispiel Sägezahn $f(t) = \\sum \\frac{1}{n}\\sin(nt)$ und erkläre, dass scharfe Kanten viele hohe Harmonische brauchen.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'Das inverse Problem: Eine Testfunktion findet die Zutaten',
      blocks: [
        {
          type: 'p',
          text: 'Die Fourier-Reihe sagt nur, **dass** man jedes Signal zerlegen kann. In der MRT haben wir aber das umgekehrte Problem. Wir haben ein gemessenes Signal f(t) und wollen wissen: **Welche Amplituden $a_n$ und $b_n$ stecken darin?** Das nennt man das **inverse Problem**.',
        },
        {
          type: 'analogy',
          title: 'Den Geschmackstest machen',
          text: 'Stell dir vor, du bekommst eine fertige Suppe und sollst das Rezept herausfinden. Du kannst nicht einfach hineinschauen. Aber du kannst gezielt testen: Schmeckt man Zimt? Du hältst den Zimt-Geschmack im Kopf gegen die Suppe. Ist Zimt drin, schlägt dein Gaumen aus. Ist er nicht drin, passiert nichts. Für jede Zutat machst du einen eigenen Test. Genau so arbeitet die Testfunktion.',
        },
        {
          type: 'p',
          text: 'Die **Schlüsselidee** aus dem Skript: Nimm eine **Testfunktion** g(t), multipliziere sie mit dem Signal und integriere über die Zeit. Heraus kommt eine einzige Zahl c.',
        },
        { type: 'formula', tex: 'c = \\int_{t_1}^{t_2} f(t)\\cdot g(t)\\,dt', caption: 'Testfunktion gegen das Signal halten' },
        {
          type: 'p',
          text: 'Warum funktioniert das? Das Skript rechnet zwei Beispiele, beide mit dem Signal $f(t) = \\sin t$ und integriert über eine ganze Periode von 0 bis 2π.',
        },
        {
          type: 'list',
          items: [
            '**Beispiel 1:** Testfunktion $g(t) = \\sin 2t$. Die beiden Wellen laufen nicht im Gleichtakt. Mal haben sie das gleiche Vorzeichen, mal das entgegengesetzte. Positive und negative Flächen heben sich genau auf. Ergebnis: **c = 0**.',
            '**Beispiel 2:** Testfunktion $g(t) = \\sin t$. Jetzt passt die Testfunktion perfekt. Das Produkt $\\sin^2 t$ ist nie negativ. Ergebnis: **c = π**, also deutlich ungleich null.',
          ],
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\int_0^{2\\pi} \\sin t \\cdot \\sin 2t\\,dt &= 0 \\\\ \\int_0^{2\\pi} \\sin t \\cdot \\sin t\\,dt &= \\pi \\end{aligned}',
          caption: 'falsche Frequenz liefert null, richtige Frequenz liefert einen Ausschlag',
        },
        {
          type: 'p',
          text: 'Dass Beispiel 1 exakt null ergibt, kann man auch ausrechnen. Mit $\\sin a\\,\\sin b = \\tfrac12[\\cos(a-b) - \\cos(a+b)]$ wird das Produkt zu $\\tfrac12(\\cos t - \\cos 3t)$. Beide Kosinusse integrieren über eine volle Periode zu null. Diese Eigenschaft heißt **Orthogonalität**: Verschiedene ganzzahlige Frequenzen „sehen“ einander nicht. Auch Sinus und Kosinus sind zueinander orthogonal.',
        },
        {
          type: 'p',
          text: 'Damit ist das inverse Problem gelöst. Willst du $b_n$ wissen, testest du mit $\\sin(nt)$. Willst du $a_n$ wissen, testest du mit $\\cos(nt)$. Alle anderen Anteile des Signals fallen dabei automatisch heraus. Der Faktor 2/T sorgt nur dafür, dass die richtige Größe herauskommt.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} a_n &= \\frac{2}{T}\\int_0^T f(t)\\cos(nt)\\,dt \\\\ b_n &= \\frac{2}{T}\\int_0^T f(t)\\sin(nt)\\,dt \\end{aligned}',
          caption: 'Fourier-Koeffizienten, T ist die Periodendauer',
        },
        {
          type: 'p',
          text: 'Kontrolle mit Beispiel 2: Für $f = \\sin t$ und $T = 2\\pi$ ergibt sich $b_1 = \\frac{2}{2\\pi}\\cdot\\pi = 1$. Richtig, im Signal steckt genau einmal $\\sin t$.',
        },
        {
          type: 'mnemonic',
          text: '**Multiplizieren, integrieren, ablesen.** Die Testfunktion schlägt nur aus, wenn ihre Frequenz im Signal vorkommt. Alle anderen Frequenzen ergeben null, weil sie orthogonal sind.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Das Integral von $\\sin t\\cdot\\sin 2t$ ist null, weil sin 2t doppelt so klein ist.“ Richtig: Es ist null, weil positive und negative Flächen sich über eine volle Periode aufheben (Orthogonalität).',
            'Falsch: „Die Orthogonalität gilt über jedes beliebige Zeitintervall.“ Richtig: Sie gilt über ganze Perioden. Über ein abgeschnittenes Stück bleibt ein Rest.',
          ],
        },
        {
          type: 'exam',
          question: 'Wie bestimmt man aus einem gemessenen periodischen Signal f(t) die Fourier-Koeffizienten? Erkläre das Prinzip an $f(t) = \\sin t$.',
          answer: 'Man multipliziert das Signal mit einer Testfunktion und integriert über eine Periode: $a_n = \\frac{2}{T}\\int_0^T f\\cos(nt)\\,dt$, $b_n = \\frac{2}{T}\\int_0^T f\\sin(nt)\\,dt$. Wegen der Orthogonalität liefern nur passende Frequenzen einen Beitrag. Für $f = \\sin t$ ergibt die Testfunktion $\\sin 2t$ den Wert 0, die Testfunktion $\\sin t$ den Wert π, also $b_1 = 1$ und alle anderen Koeffizienten null.',
          full: 'Begründe die Null mit $\\sin t\\sin 2t = \\tfrac12(\\cos t - \\cos 3t)$ und nenne den Begriff Orthogonalität.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'Vom Integral zum Tabellenblatt: DFT, 2D und zwei Rechenregeln',
      blocks: [
        {
          type: 'p',
          text: 'Ein Computer kann nicht unendlich fein integrieren. Er kennt das Signal nur an einzelnen Messpunkten, den **Samples**. Also ersetzt man das Integral durch eine Summe. Das ist die **diskrete Fourier-Transformation**, kurz **DFT**. Genau das baust du in **Lab 3** im Tabellenblatt nach.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} a_n &\\approx \\frac{2}{N}\\sum_{j=0}^{N-1} f(t_j)\\cos(n t_j) \\\\ b_n &\\approx \\frac{2}{N}\\sum_{j=0}^{N-1} f(t_j)\\sin(n t_j) \\end{aligned}',
          caption: 'N Samples im Abstand T/N, hier mit T = 2π',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Eine Spalte mit den Zeitpunkten $t_j$.',
            'Eine Spalte mit den Signalwerten $f(t_j)$.',
            'Eine Spalte mit der Testfunktion, zum Beispiel $\\sin(n t_j)$.',
            'Eine Spalte mit dem Produkt aus beiden.',
            'Die Summe dieser Spalte, mal 2/N, ist der Koeffizient. Für jedes n wiederholst du das.',
          ],
        },
        {
          type: 'p',
          text: 'Im zweiten Teil von Lab 3 veränderst du das Signal über Parameter (a, b, c, d) und beobachtest das Spektrum. Verschiebst du das Signal zeitlich, bleiben die Beträge gleich, nur die Phasen ändern sich. Machst du es schneller, wandert der Peak zu höheren Frequenzen. Klingt es ab, wird der Peak breiter.',
        },
        {
          type: 'p',
          text: 'Ein Bild ist kein Zeitsignal, sondern hat **zwei Ortsrichtungen**. Also braucht man die **2D-Fourier-Transformation**. Statt einer Frequenz gibt es jetzt zwei **Ortsfrequenzen** $u_x$ und $u_y$. Sie sagen, wie viele Streifen pro Meter in x- und in y-Richtung verlaufen.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} F(u_x,u_y) &= \\iint f(x,y)\\, e^{-2\\pi i (u_x x + u_y y)}\\,dx\\,dy \\\\ f(x,y) &= \\iint F(u_x,u_y)\\, e^{2\\pi i (u_x x + u_y y)}\\,du_x\\,du_y \\end{aligned}',
          caption: 'Hin- und Rücktransformation in 2D',
        },
        {
          type: 'p',
          text: 'Die komplexe Exponentialfunktion ist nur eine kompakte Schreibweise. Nach Euler gilt $e^{i\\varphi} = \\cos\\varphi + i\\sin\\varphi$. Ein Exponentialterm erledigt also den Kosinus-Test und den Sinus-Test gleichzeitig. $\\mathcal F$ steht für die Hintransformation, $\\mathcal F^{-1}$ für die Rücktransformation.',
        },
        {
          type: 'p',
          text: 'Zwei Eigenschaften nennt das Skript ausdrücklich. Die **Linearität** folgt direkt daraus, dass Integrale linear sind: Die Transformierte einer Summe ist die Summe der Transformierten. Die **Faltung** ist die wichtigere: Eine Faltung im Ortsraum wird im Frequenzraum zu einer einfachen Multiplikation.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\mathcal F[af+bg] &= a\\,\\mathcal F[f] + b\\,\\mathcal F[g] \\\\ \\mathcal F[f*g] &= \\mathcal F[f]\\cdot\\mathcal F[g] \\end{aligned}',
          caption: 'Linearität und Faltungssatz',
        },
        {
          type: 'analogy',
          title: 'Der Weichzeichner im Fotoprogramm',
          text: 'Ein Weichzeichner ersetzt jedes Pixel durch einen Mittelwert seiner Nachbarn. Mathematisch ist das eine **Faltung** des Bildes mit einem kleinen Fleck. Der Faltungssatz sagt: Im Frequenzraum ist das nur eine Multiplikation. Der Fleck hat ein Spektrum, das bei hohen Frequenzen klein ist. Er dämpft also die schnellen Wellen, und genau deshalb verschwinden die Kanten.',
        },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Vorfaktoren sind Konvention',
          text: 'Im Skript steht vor beiden 2D-Integralen zusätzlich der Faktor 1/(2π). Vorfaktoren und Vorzeichen im Exponenten unterscheiden sich von Lehrbuch zu Lehrbuch. Wenn die 2π schon im Exponenten steht, braucht ein zueinander passendes Paar keinen Vorfaktor. Wichtig ist nur, dass Hin- und Rücktransformation zusammenpassen.',
        },
        {
          type: 'mnemonic',
          text: '**Summe statt Integral, Spalte für Spalte.** Die DFT ist der Geschmackstest im Tabellenblatt. Und merke: Faltung im Bild ist Multiplikation im Spektrum.',
        },
        {
          type: 'exam',
          question: 'Nenne zwei Eigenschaften der Fourier-Transformation und erkläre an einem Beispiel, warum der Faltungssatz nützlich ist.',
          answer: 'Linearität: $\\mathcal F[af+bg] = a\\mathcal F[f] + b\\mathcal F[g]$, sie folgt aus der Linearität des Integrals. Faltungssatz: $\\mathcal F[f*g] = \\mathcal F[f]\\cdot\\mathcal F[g]$. Beispiel: Eine Unschärfe (Faltung mit einem Fleck) ist im Frequenzraum eine Multiplikation mit einem Tiefpass, der hohe Ortsfrequenzen dämpft. Umgekehrt kann man Filter bequem im Frequenzraum als Multiplikation anwenden.',
          full: 'Erwähne, dass die DFT das Integral durch eine Summe über N Samples ersetzt und in der Praxis per FFT schnell berechnet wird.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'Der k-Raum: Der Gradient schreibt eine Ortsfrequenz',
      blocks: [
        {
          type: 'p',
          text: 'Jetzt verbinden wir Fourier mit der MRT. Von der Frequenzkodierung weißt du: Ein Gradient $G_x$ macht die Larmor-Frequenz vom Ort abhängig. Nach der Demodulation bleibt nur der ortsabhängige Teil $\\omega(x) = \\gamma G_x x$ übrig. Das gemessene Signal ist die Summe aller Spins entlang x, gewichtet mit der **Spindichte** $\\rho(x)$:',
        },
        { type: 'formula', tex: 's(t) = \\int \\rho(x)\\, e^{i\\gamma G_x x t}\\,dx', caption: 'konstanter Gradient: jeder Ort dreht mit seiner eigenen Frequenz' },
        {
          type: 'p',
          text: 'In echten Sequenzen ist der Gradient nicht immer konstant. Er wird ein- und ausgeschaltet, umgepolt, mal stark, mal schwach. Dann zählt nicht die momentane Frequenz, sondern die **aufgesammelte Phase**. Die Phase am Ort x ist γ mal x mal die **Fläche unter der Gradientenkurve**.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\varphi(x,t) &= \\gamma\\, x \\int_0^t G_x(t\')\\,dt\' = k_x(t)\\, x \\\\ k_x(t) &= \\gamma \\int_0^t G_x(t\')\\,dt\' \\end{aligned}',
          caption: 'k ist das Zeitintegral des Gradienten, mal γ',
        },
        {
          type: 'p',
          text: 'Setzt man das ein, wird das Signal zu einer Funktion von $k_x$. Und jetzt kommt der entscheidende Moment: Diese Formel hat **genau die Form einer Fourier-Transformation**. Das gemessene Signal ist die Fourier-Transformierte der Spindichte.',
        },
        { type: 'formula', tex: 's(k_x) = \\int \\rho(x)\\, e^{i k_x x}\\,dx', caption: 'das Signal ist ein Fourier-Koeffizient der Spindichte' },
        {
          type: 'p',
          text: 'Mit einem zweiten Gradienten in y-Richtung (Phasenkodierung) kommt eine zweite Koordinate $k_y$ dazu. So entsteht der zweidimensionale **k-Raum**:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s(k_x,k_y) &= \\iint \\rho(x,y) \\\\ &\\qquad \\cdot e^{i(k_x x + k_y y)}\\,dx\\,dy \\end{aligned}',
          caption: 'die MR-Rohdaten als 2D-Fourier-Transformierte',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Tippfehler im Skript',
          text: 'Im Skript steht im Exponenten $k_x x + k_y x$, also zweimal x. Gemeint ist $k_x x + k_y y$. Sonst würde $k_y$ gar keine Information über die y-Richtung liefern.',
        },
        {
          type: 'analogy',
          title: 'Jeder k-Raum-Punkt ist ein Streifenmuster',
          text: 'Denk an einen Barcode. Er besteht aus Streifen, und die Streifendichte trägt die Information. Jeder einzelne Punkt im k-Raum gehört zu genau so einem Streifenmuster über das **ganze** Bild. Der Ort des Punktes legt fest, wie eng die Streifen liegen ($|k|$ groß heißt eng) und in welche Richtung sie zeigen. Der gemessene Wert sagt, wie stark und wie verschoben dieses Muster im Bild vorkommt.',
        },
        {
          type: 'p',
          text: 'Deshalb ist der k-Raum kein verzerrtes Bild. Ein Punkt links oben im k-Raum hat nichts mit dem Pixel links oben im Bild zu tun. Der Gradient fährt dich durch den k-Raum, und an jeder Station misst du einen Fourier-Koeffizienten.',
        },
        {
          type: 'mnemonic',
          text: '**Gradientenfläche = k.** Wie weit du im k-Raum bist, hängt nur davon ab, wie viel Gradient sich bis jetzt aufsummiert hat. Das Signal an dieser Stelle ist ein Fourier-Koeffizient des Bildes.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Ein Punkt im k-Raum entspricht einem Pixel im Bild.“ Richtig: Jeder k-Raum-Punkt beschreibt ein Streifenmuster über das gesamte Bild.',
            'Falsch: „k ist proportional zur Gradientenstärke.“ Richtig: k ist proportional zur **Fläche** unter dem Gradienten, also Stärke mal Dauer.',
          ],
        },
        {
          type: 'exam',
          question: 'Was ist der k-Raum, und wie hängt die k-Raum-Koordinate $k_x$ mit dem Gradienten zusammen?',
          answer: 'Ein zeitabhängiger Gradient erzeugt am Ort x die Phase $\\varphi = \\gamma x\\int G_x\\,dt$. Mit $k_x = \\gamma\\int_0^t G_x\\,dt$ wird das Signal zu $s(k_x) = \\int\\rho(x)e^{ik_x x}dx$, also zur Fourier-Transformierten der Spindichte. In 2D gilt $s(k_x,k_y) = \\iint\\rho(x,y)e^{i(k_x x + k_y y)}dx\\,dy$. Der k-Raum ist der Raum dieser Rohdaten, also der Ortsfrequenzraum des Bildes.',
          full: 'Erwähne, dass k die Gradientenfläche ist (Stärke × Zeit) und dass im Skript im 2D-Exponenten fälschlich zweimal x steht.',
          sim: 'kspace',
        },
      ],
    },
    {
      title: 'Zurück zum Bild: inverse Transformation, Betrag und Phase',
      blocks: [
        {
          type: 'p',
          text: 'Das Skript stellt das Problem ganz direkt: Gegeben ist das gemessene Signal $s(k_x,k_y)$. Gesucht ist die Spindichte $\\rho(x,y)$, also das Bild. Die Antwort: **inverse Fourier-Transformation** $\\mathcal F^{-1}$. Im Rechner läuft sie als schnelle Variante, die **FFT** (Fast Fourier Transform).',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\rho(x,y) &= \\frac{1}{4\\pi^2}\\iint s(k_x,k_y) \\\\ &\\qquad \\cdot e^{-i(k_x x + k_y y)}\\,dk_x\\,dk_y \\end{aligned}',
          caption: 'Rücktransformation passend zur Konvention des Skripts (k in rad/m)',
        },
        {
          type: 'analogy',
          title: 'Den Smoothie zurück in Früchte verwandeln',
          text: 'Im Mixer ist aus Erdbeeren, Banane und Mango ein einheitlicher Smoothie geworden. In der Küche geht das nicht mehr rückwärts. Bei der Fourier-Transformation schon: Sie ist verlustfrei umkehrbar. Der k-Raum ist der Smoothie, in dem alle Orte vermischt sind. Die inverse Transformation trennt ihn wieder sauber in die einzelnen Früchte, also in die Helligkeit an jedem Ort.',
        },
        {
          type: 'p',
          text: 'Im Skript heißt es: Aus den gemessenen Signalen, also der **Frequenz- und Phasenkarte (k-Raum)**, kann man mit der Fourier-Transformation ein normales Bild berechnen. Und: **Jedes Pixel im Bild hängt von der Menge der Spins und von der magnetischen Umgebung am entsprechenden Ort ab.** Die Spinmenge bestimmt, wie viel Signal überhaupt da ist. Die magnetische Umgebung bestimmt über T1, T2 und lokale Feldunterschiede, wie viel davon zum Messzeitpunkt noch übrig ist.',
        },
        {
          type: 'p',
          text: 'Die k-Raum-Daten sind **komplexe Zahlen**. Jede hat einen **Betrag** (wie stark ist dieses Streifenmuster) und eine **Phase** (wo genau liegen seine Streifen, wie weit sind sie verschoben).',
        },
        { type: 'formula', tex: 's(k_x,k_y) = |s|\\,e^{i\\phi}', caption: 'Betrag und Phase eines k-Raum-Werts' },
        {
          type: 'p',
          text: 'Im Skript siehst du ein Experiment dazu: Man transformiert **nur den Betrag** zurück und **nur die Phase**. Beide Ergebnisse sehen anders aus als das Original. Nur mit Betrag fehlt die Information, wo die Strukturen liegen, das Bild wird unkenntlich. Nur mit Phase bleiben erstaunlich viele Umrisse und Kanten erkennbar, aber die richtigen Helligkeiten fehlen. Erst **zusammen** ergeben Betrag und Phase das richtige Bild.',
        },
        {
          type: 'mnemonic',
          text: '**Betrag sagt wie stark, Phase sagt wo.** Nur beide zusammen liefern über die inverse FFT das richtige Bild.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Die Phase ist nur Rauschen, es reicht der Betrag.“ Richtig: Die Phase trägt die Lage der Strukturen. Ohne sie ist die Rekonstruktion unbrauchbar.',
            'Falsch: „Das MR-Bild wird direkt gemessen, die FFT verschönert es nur.“ Richtig: Gemessen wird der k-Raum. Das Bild entsteht erst durch die inverse Fourier-Transformation.',
          ],
        },
        {
          type: 'exam',
          question: 'Wie erhält man aus den gemessenen k-Raum-Daten das MR-Bild, und warum braucht man dafür Betrag und Phase?',
          answer: 'Die Rohdaten sind $s(k_x,k_y) = \\iint\\rho(x,y)e^{i(k_x x + k_y y)}dx\\,dy$, also die Fourier-Transformierte der Spindichte. Das Bild $\\rho(x,y)$ erhält man durch die inverse Fourier-Transformation $\\mathcal F^{-1}$, praktisch per FFT. Die Daten sind komplex: Der Betrag gibt die Stärke einer Ortsfrequenz an, die Phase ihre Lage. Rekonstruiert man nur mit Betrag oder nur mit Phase, entsteht ein falsches Bild.',
          full: 'Ergänze, dass jedes Pixel die Spinmenge und die magnetische Umgebung (Relaxation, Feld) am Ort widerspiegelt.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'Zentrum und Rand: Kanten über den k-Raum verstärken',
      blocks: [
        {
          type: 'p',
          text: 'Jetzt kommt die praktische Belohnung für alles bisher. Wo im k-Raum steckt welche Bildinformation? Die Antwort folgt direkt aus dem Sägezahn vom Anfang: Langsame Wellen machen die Form, schnelle Wellen machen die Kanten.',
        },
        {
          type: 'list',
          items: [
            '**Zentrum des k-Raums** ($|k|$ klein): niedrige Ortsfrequenzen, breite Streifen. Sie tragen den meisten Signalanteil und bestimmen **Kontrast und grobe Helligkeitsverteilung**. Der Punkt genau in der Mitte ($k = 0$) ist die Summe über alle Spins, also die Gesamthelligkeit.',
            '**Rand des k-Raums** ($|k|$ groß): hohe Ortsfrequenzen, enge Streifen. Sie tragen wenig Energie, aber die **Kanten und feinen Details**.',
          ],
        },
        {
          type: 'table',
          head: ['Was du rekonstruierst', 'Was du siehst'],
          rows: [
            ['nur das Zentrum', 'richtiger Kontrast, aber verschwommen'],
            ['nur der Rand', 'nur Umrisse und Kanten, kaum Flächenhelligkeit'],
            ['alles', 'scharfes Bild mit richtigem Kontrast'],
          ],
        },
        {
          type: 'figure',
          id: 'kspace-masks',
          caption: 'Hier ist ein Hirn-Phantom wirklich per FFT berechnet: Oben siehst du, welcher Teil des k-Raums behalten wurde, unten das Bild daraus. Achte darauf, dass das Zentrum allein den Kontrast liefert, der Rand allein die Kanten und eine einzige Zeile nur Streifen.',
        },
        {
          type: 'analogy',
          title: 'Am Equalizer die Höhen aufdrehen',
          text: 'Willst du bei Musik das Zischen der Becken und die S-Laute deutlicher hören, drehst du am Equalizer die **Höhen** auf und die Bässe etwas herunter. Bei einem Bild ist es genau gleich, nur mit Ortsfrequenzen. Kanten sind die „Höhen“ des Bildes. Wer sie betonen will, verstärkt den Rand des k-Raums.',
        },
        {
          type: 'p',
          text: 'Damit beantwortest du die **Recap-Frage 4**. Man multipliziert den k-Raum mit einer **Gewichtungsfunktion** W, die in der Mitte klein und nach außen groß ist. Das ist ein **Hochpassfilter**. Danach rekonstruiert man mit der inversen FFT wie gewohnt.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s_{\\text{neu}}(k_x,k_y) &= W(k)\\cdot s(k_x,k_y) \\\\ W(k) &= 1 - e^{-k^2/k_0^2} \\end{aligned}',
          caption: 'Beispiel eines sanften Hochpasses, k = Abstand zum Zentrum',
        },
        {
          type: 'p',
          text: 'Wegen des Faltungssatzes ist diese Multiplikation im k-Raum gleichwertig zu einer Faltung im Bild mit einem Kantenfilter. Der Preis: Flächen verlieren ihre Grundhelligkeit, und das Rauschen, das vor allem am Rand sitzt, wird mitverstärkt. Schneidet man außerdem abrupt ab, entstehen Wellenringe neben Kanten (Ringing). Deshalb nimmt man weiche Übergänge.',
        },
        {
          type: 'mnemonic',
          text: '**Mitte = Kontrast, Rand = Kanten.** Kanten verstärken heißt: Rand des k-Raums hoch, Mitte runter, also ein Hochpass.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Kanten verstärkt man, indem man das k-Raum-Zentrum verstärkt.“ Richtig: Das Zentrum trägt Kontrast. Kanten sitzen in den äußeren Bereichen bei hohen Ortsfrequenzen.',
            'Falsch: „Ein Hochpass macht das Bild einfach besser.“ Richtig: Er betont auch das Rauschen und nimmt Flächen die Grundhelligkeit.',
          ],
        },
        {
          type: 'exam',
          question: 'Wie kann man über den k-Raum Kanten in einer MRI-Schicht verstärken?',
          answer: 'Kanten bestehen aus hohen Ortsfrequenzen, die in den äußeren Bereichen des k-Raums liegen. Man gewichtet den k-Raum vor der inversen Fourier-Transformation so, dass die äußeren Bereiche relativ verstärkt bzw. das Zentrum abgeschwächt wird (Hochpassfilter). Das Zentrum trägt Kontrast und grobe Helligkeit, deshalb wirkt das Bild danach kantenbetont.',
          full: 'Nenne den Faltungssatz (Multiplikation im k-Raum = Faltung im Bild) und die Nebenwirkungen: mehr Rauschen, Verlust der Flächenhelligkeit, Ringing bei abrupten Filterkanten.',
          sim: 'kspace',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'Каждый сигнал это аккорд: ряд Фурье',
      blocks: [
        {
          type: 'hook',
          text: 'В главе «От сигнала к изображению» ты столкнулся с неудобной правдой: катушка измеряет **не изображение**. Она измеряет один суммарный сигнал, в котором одновременно звучат все точки тела. Чтобы получить из него картинку, нужен инструмент, который раскладывает смесь обратно на составляющие. Этот инструмент называется **преобразованием Фурье**. В этом модуле ты разберёшь его с нуля, а затем поймёшь **k-пространство**, то есть сырые данные любой МРТ.',
        },
        {
          type: 'analogy',
          title: 'Аккорд на пианино и эквалайзер',
          text: 'Когда ты берёшь аккорд на пианино, слышен один звук. И всё же в нём несколько чистых тонов, у каждого своя высота и громкость. Тренированное ухо их различает. Эквалайзер в музыкальном приложении делает это видимым: каждый столбик показывает, насколько громко звучит определённая частота. Разложение Фурье и есть такой эквалайзер, только математически точный.',
        },
        {
          type: 'p',
          text: 'Основная идея из конспекта удивительно проста: **любую периодическую функцию можно записать как сумму синусов и косинусов.** При этом встречаются только целые частоты: основная, удвоенная, утроенная и так далее. Их называют **гармониками**, как обертоны музыкального инструмента.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} f(t) &= \\frac{a_0}{2} \\\\ &\\quad + \\sum_{n=1}^{\\infty} \\big( a_n \\cos(nt) + b_n \\sin(nt) \\big) \\end{aligned}',
          caption: 'ряд Фурье периодической функции',
        },
        {
          type: 'list',
          items: [
            '$a_0/2$ это **среднее значение** функции, постоянная подставка, на которой всё колеблется.',
            '$n$ это **номер гармоники**. $n = 1$ основное колебание, $n = 2$ колеблется вдвое быстрее.',
            '$a_n$ показывает, сколько **косинуса** частоты n есть в сигнале.',
            '$b_n$ показывает, сколько **синуса** частоты n есть в сигнале.',
          ],
        },
        {
          type: 'p',
          text: 'В конспекте выбран период $T = 2\\pi$, поэтому в аргументе стоит просто $nt$. При произвольном периоде T пишут $n\\omega_0 t$ с $\\omega_0 = 2\\pi/T$. Принцип тот же.',
        },
        {
          type: 'p',
          text: 'Пример из лекции это **пила**. У неё острые углы, и всё же её можно собрать из гладких синусоид. Берут все гармоники, но каждую следующую только с весом 1/n:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} f(t) &= \\sum_{n=1}^{\\infty} \\frac{1}{n}\\sin(nt) \\\\ &= \\sin t + \\tfrac12\\sin 2t + \\tfrac13 \\sin 3t + \\dots \\end{aligned}',
          caption: 'пила как сумма синусоид',
        },
        {
          type: 'p',
          text: 'С одним слагаемым видна синусоида. С тремя уже угадывается пила. Чем больше высоких гармоник ты добавляешь, тем **острее края**. Хорошо запомни эту мысль: в конце модуля она ответит на контрольный вопрос о краях.',
        },
        {
          type: 'figure',
          id: 'fourier-sum',
          caption: 'Слева три синусоиды с амплитудами 1, ½ и ⅓, а под ними их сумма, которая уже почти похожа на пунктирную пилу. Справа те же амплитуды в виде столбиков: это и есть спектр сигнала.',
        },
        {
          type: 'mnemonic',
          text: '**Медленные волны создают форму, быстрые волны создают края.** Каждый периодический сигнал это аккорд из синусов и косинусов с целыми частотами.',
        },
        {
          type: 'exam',
          question: 'Что утверждает ряд Фурье и что означают коэффициенты $a_n$ и $b_n$?',
          answer: 'Любую периодическую функцию можно представить суммой постоянной части $a_0/2$ и косинусов и синусов с целыми кратными основной частоты. $a_n$ и $b_n$ это амплитуды косинусной и синусной части n-й гармоники. Вместе они образуют спектр сигнала.',
          full: 'Назови пример пилы $f(t) = \\sum \\frac{1}{n}\\sin(nt)$ и объясни, что острым краям нужно много высоких гармоник.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'Обратная задача: тестовая функция находит ингредиенты',
      blocks: [
        {
          type: 'p',
          text: 'Ряд Фурье говорит только, **что** любой сигнал можно разложить. Но в МРТ задача обратная. У нас есть измеренный сигнал f(t), и мы хотим узнать: **какие амплитуды $a_n$ и $b_n$ в нём содержатся?** Это называется **обратной задачей**.',
        },
        {
          type: 'analogy',
          title: 'Дегустация',
          text: 'Представь, что тебе дали готовый суп и просят восстановить рецепт. Заглянуть внутрь нельзя. Но можно проверять по очереди: чувствуется корица? Ты держишь вкус корицы в голове и сравниваешь с супом. Если корица есть, вкус откликается. Если нет, ничего не происходит. Для каждого ингредиента своя проба. Именно так работает тестовая функция.',
        },
        {
          type: 'p',
          text: '**Ключевая идея** из конспекта: возьми **тестовую функцию** g(t), умножь её на сигнал и проинтегрируй по времени. Получится одно число c.',
        },
        { type: 'formula', tex: 'c = \\int_{t_1}^{t_2} f(t)\\cdot g(t)\\,dt', caption: 'приложить тестовую функцию к сигналу' },
        {
          type: 'p',
          text: 'Почему это работает? В конспекте разобраны два примера, оба с сигналом $f(t) = \\sin t$ и интегрированием по целому периоду от 0 до 2π.',
        },
        {
          type: 'list',
          items: [
            '**Пример 1:** тестовая функция $g(t) = \\sin 2t$. Волны идут не в такт. То у них одинаковый знак, то противоположный. Положительные и отрицательные площади точно гасятся. Итог: **c = 0**.',
            '**Пример 2:** тестовая функция $g(t) = \\sin t$. Теперь она подходит идеально. Произведение $\\sin^2 t$ никогда не отрицательно. Итог: **c = π**, то есть явно не ноль.',
          ],
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\int_0^{2\\pi} \\sin t \\cdot \\sin 2t\\,dt &= 0 \\\\ \\int_0^{2\\pi} \\sin t \\cdot \\sin t\\,dt &= \\pi \\end{aligned}',
          caption: 'чужая частота даёт ноль, своя частота даёт отклик',
        },
        {
          type: 'p',
          text: 'То, что пример 1 даёт ровно ноль, можно посчитать. По формуле $\\sin a\\,\\sin b = \\tfrac12[\\cos(a-b) - \\cos(a+b)]$ произведение превращается в $\\tfrac12(\\cos t - \\cos 3t)$. Оба косинуса за полный период интегрируются в ноль. Это свойство называется **ортогональностью**: разные целые частоты «не видят» друг друга. Синус и косинус тоже ортогональны.',
        },
        {
          type: 'p',
          text: 'Обратная задача решена. Хочешь узнать $b_n$, проверяй с $\\sin(nt)$. Хочешь узнать $a_n$, проверяй с $\\cos(nt)$. Все остальные части сигнала при этом выпадают сами. Множитель 2/T нужен лишь для правильной величины.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} a_n &= \\frac{2}{T}\\int_0^T f(t)\\cos(nt)\\,dt \\\\ b_n &= \\frac{2}{T}\\int_0^T f(t)\\sin(nt)\\,dt \\end{aligned}',
          caption: 'коэффициенты Фурье, T период',
        },
        {
          type: 'p',
          text: 'Проверка на примере 2: для $f = \\sin t$ и $T = 2\\pi$ получается $b_1 = \\frac{2}{2\\pi}\\cdot\\pi = 1$. Верно, в сигнале ровно один $\\sin t$.',
        },
        {
          type: 'mnemonic',
          text: '**Умножить, проинтегрировать, прочитать.** Тестовая функция откликается, только если её частота есть в сигнале. Все остальные частоты дают ноль, потому что они ортогональны.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Интеграл от $\\sin t\\cdot\\sin 2t$ равен нулю, потому что sin 2t вдвое меньше». Верно: он равен нулю, потому что положительные и отрицательные площади за полный период гасятся (ортогональность).',
            'Неверно: «Ортогональность выполняется на любом интервале». Верно: она выполняется на целых периодах. На обрезанном куске остаётся остаток.',
          ],
        },
        {
          type: 'exam',
          question: 'Как по измеренному периодическому сигналу f(t) найти коэффициенты Фурье? Объясни принцип на $f(t) = \\sin t$.',
          answer: 'Сигнал умножают на тестовую функцию и интегрируют по периоду: $a_n = \\frac{2}{T}\\int_0^T f\\cos(nt)\\,dt$, $b_n = \\frac{2}{T}\\int_0^T f\\sin(nt)\\,dt$. Из-за ортогональности вклад дают только совпадающие частоты. Для $f = \\sin t$ тестовая функция $\\sin 2t$ даёт 0, функция $\\sin t$ даёт π, то есть $b_1 = 1$, а все остальные коэффициенты равны нулю.',
          full: 'Обоснуй ноль через $\\sin t\\sin 2t = \\tfrac12(\\cos t - \\cos 3t)$ и назови понятие ортогональности.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'От интеграла к таблице: ДПФ, 2D и два правила',
      blocks: [
        {
          type: 'p',
          text: 'Компьютер не умеет интегрировать бесконечно точно. Он знает сигнал только в отдельных точках измерения, **отсчётах**. Поэтому интеграл заменяют суммой. Это **дискретное преобразование Фурье**, сокращённо **ДПФ**. Именно его ты строишь в **лабораторной 3** в электронной таблице.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} a_n &\\approx \\frac{2}{N}\\sum_{j=0}^{N-1} f(t_j)\\cos(n t_j) \\\\ b_n &\\approx \\frac{2}{N}\\sum_{j=0}^{N-1} f(t_j)\\sin(n t_j) \\end{aligned}',
          caption: 'N отсчётов с шагом T/N, здесь T = 2π',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Столбец с моментами времени $t_j$.',
            'Столбец со значениями сигнала $f(t_j)$.',
            'Столбец с тестовой функцией, например $\\sin(n t_j)$.',
            'Столбец с произведением обоих.',
            'Сумма этого столбца, умноженная на 2/N, и есть коэффициент. Повтори для каждого n.',
          ],
        },
        {
          type: 'p',
          text: 'Во второй части лабораторной 3 ты меняешь сигнал через параметры (a, b, c, d) и наблюдаешь спектр. Сдвинешь сигнал во времени, модули останутся прежними, изменятся только фазы. Сделаешь его быстрее, пик уйдёт к высоким частотам. Если сигнал затухает, пик станет шире.',
        },
        {
          type: 'p',
          text: 'Изображение не временной сигнал, у него **два пространственных направления**. Поэтому нужно **двумерное преобразование Фурье**. Вместо одной частоты теперь две **пространственные частоты** $u_x$ и $u_y$. Они показывают, сколько полос на метр идёт по x и по y.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} F(u_x,u_y) &= \\iint f(x,y)\\, e^{-2\\pi i (u_x x + u_y y)}\\,dx\\,dy \\\\ f(x,y) &= \\iint F(u_x,u_y)\\, e^{2\\pi i (u_x x + u_y y)}\\,du_x\\,du_y \\end{aligned}',
          caption: 'прямое и обратное преобразование в 2D',
        },
        {
          type: 'p',
          text: 'Комплексная экспонента всего лишь компактная запись. По Эйлеру $e^{i\\varphi} = \\cos\\varphi + i\\sin\\varphi$. Одна экспонента выполняет косинусную и синусную пробу сразу. $\\mathcal F$ обозначает прямое преобразование, $\\mathcal F^{-1}$ обратное.',
        },
        {
          type: 'p',
          text: 'Два свойства конспект называет явно. **Линейность** прямо следует из линейности интегралов: преобразование суммы равно сумме преобразований. **Свёртка** важнее: свёртка в пространстве превращается в частотной области в простое умножение.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\mathcal F[af+bg] &= a\\,\\mathcal F[f] + b\\,\\mathcal F[g] \\\\ \\mathcal F[f*g] &= \\mathcal F[f]\\cdot\\mathcal F[g] \\end{aligned}',
          caption: 'линейность и теорема о свёртке',
        },
        {
          type: 'analogy',
          title: 'Размытие в фоторедакторе',
          text: 'Фильтр размытия заменяет каждый пиксель средним по соседям. Математически это **свёртка** изображения с маленьким пятном. Теорема о свёртке говорит: в частотной области это просто умножение. У пятна спектр, который мал на высоких частотах. Значит, оно гасит быстрые волны, и именно поэтому исчезают края.',
        },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Множители это соглашение',
          text: 'В конспекте перед обоими 2D-интегралами стоит ещё множитель 1/(2π). Множители и знак в показателе отличаются от учебника к учебнику. Если 2π уже стоит в показателе, согласованной паре множитель не нужен. Важно лишь, чтобы прямое и обратное преобразования подходили друг к другу.',
        },
        {
          type: 'mnemonic',
          text: '**Сумма вместо интеграла, столбец за столбцом.** ДПФ это дегустация в таблице. И запомни: свёртка в изображении это умножение в спектре.',
        },
        {
          type: 'exam',
          question: 'Назови два свойства преобразования Фурье и объясни на примере, чем полезна теорема о свёртке.',
          answer: 'Линейность: $\\mathcal F[af+bg] = a\\mathcal F[f] + b\\mathcal F[g]$, она следует из линейности интеграла. Теорема о свёртке: $\\mathcal F[f*g] = \\mathcal F[f]\\cdot\\mathcal F[g]$. Пример: размытие (свёртка с пятном) в частотной области это умножение на фильтр нижних частот, который гасит высокие пространственные частоты. И наоборот, фильтры удобно применять в частотной области как умножение.',
          full: 'Упомяни, что ДПФ заменяет интеграл суммой по N отсчётам и на практике быстро считается через БПФ (FFT).',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'k-пространство: градиент записывает пространственную частоту',
      blocks: [
        {
          type: 'p',
          text: 'Теперь соединим Фурье с МРТ. Из частотного кодирования ты знаешь: градиент $G_x$ делает ларморову частоту зависящей от места. После демодуляции остаётся только пространственная часть $\\omega(x) = \\gamma G_x x$. Измеренный сигнал это сумма всех спинов вдоль x, взвешенная **спиновой плотностью** $\\rho(x)$:',
        },
        { type: 'formula', tex: 's(t) = \\int \\rho(x)\\, e^{i\\gamma G_x x t}\\,dx', caption: 'постоянный градиент: каждое место вращается со своей частотой' },
        {
          type: 'p',
          text: 'В реальных последовательностях градиент не всегда постоянен. Его включают и выключают, меняют полярность, делают то сильнее, то слабее. Тогда важна не мгновенная частота, а **накопленная фаза**. Фаза в точке x равна γ, умноженной на x и на **площадь под кривой градиента**.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\varphi(x,t) &= \\gamma\\, x \\int_0^t G_x(t\')\\,dt\' = k_x(t)\\, x \\\\ k_x(t) &= \\gamma \\int_0^t G_x(t\')\\,dt\' \\end{aligned}',
          caption: 'k это интеграл градиента по времени, умноженный на γ',
        },
        {
          type: 'p',
          text: 'Если подставить это, сигнал становится функцией $k_x$. И вот решающий момент: эта формула имеет **ровно вид преобразования Фурье**. Измеренный сигнал это преобразование Фурье спиновой плотности.',
        },
        { type: 'formula', tex: 's(k_x) = \\int \\rho(x)\\, e^{i k_x x}\\,dx', caption: 'сигнал это коэффициент Фурье спиновой плотности' },
        {
          type: 'p',
          text: 'Со вторым градиентом по y (фазовое кодирование) добавляется вторая координата $k_y$. Так возникает двумерное **k-пространство**:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s(k_x,k_y) &= \\iint \\rho(x,y) \\\\ &\\qquad \\cdot e^{i(k_x x + k_y y)}\\,dx\\,dy \\end{aligned}',
          caption: 'сырые МР-данные как двумерное преобразование Фурье',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Опечатка в конспекте',
          text: 'В конспекте в показателе стоит $k_x x + k_y x$, то есть дважды x. Имеется в виду $k_x x + k_y y$. Иначе $k_y$ вообще не давал бы информации о направлении y.',
        },
        {
          type: 'analogy',
          title: 'Каждая точка k-пространства это узор из полос',
          text: 'Вспомни штрихкод. Он состоит из полос, и информацию несёт их плотность. Каждая отдельная точка k-пространства соответствует именно такому узору из полос по **всему** изображению. Положение точки задаёт, насколько тесно лежат полосы (большое $|k|$ значит тесно) и куда они направлены. Измеренное значение говорит, насколько сильно и с каким сдвигом этот узор присутствует в изображении.',
        },
        {
          type: 'p',
          text: 'Поэтому k-пространство не искажённая картинка. Точка в левом верхнем углу k-пространства никак не связана с пикселем в левом верхнем углу изображения. Градиент ведёт тебя по k-пространству, и на каждой остановке ты измеряешь один коэффициент Фурье.',
        },
        {
          type: 'mnemonic',
          text: '**Площадь градиента = k.** Насколько далеко ты в k-пространстве, зависит только от того, сколько градиента уже накопилось. Сигнал в этой точке это коэффициент Фурье изображения.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Точка в k-пространстве соответствует пикселю изображения». Верно: каждая точка k-пространства описывает узор из полос по всему изображению.',
            'Неверно: «k пропорционально силе градиента». Верно: k пропорционально **площади** под градиентом, то есть силе, умноженной на длительность.',
          ],
        },
        {
          type: 'exam',
          question: 'Что такое k-пространство и как координата $k_x$ связана с градиентом?',
          answer: 'Зависящий от времени градиент создаёт в точке x фазу $\\varphi = \\gamma x\\int G_x\\,dt$. С $k_x = \\gamma\\int_0^t G_x\\,dt$ сигнал становится $s(k_x) = \\int\\rho(x)e^{ik_x x}dx$, то есть преобразованием Фурье спиновой плотности. В 2D $s(k_x,k_y) = \\iint\\rho(x,y)e^{i(k_x x + k_y y)}dx\\,dy$. k-пространство это пространство этих сырых данных, то есть пространство пространственных частот изображения.',
          full: 'Упомяни, что k это площадь градиента (сила × время) и что в конспекте в 2D-показателе ошибочно дважды стоит x.',
          sim: 'kspace',
        },
      ],
    },
    {
      title: 'Обратно к изображению: обратное преобразование, модуль и фаза',
      blocks: [
        {
          type: 'p',
          text: 'Конспект ставит задачу прямо: дан измеренный сигнал $s(k_x,k_y)$. Найти спиновую плотность $\\rho(x,y)$, то есть изображение. Ответ: **обратное преобразование Фурье** $\\mathcal F^{-1}$. В компьютере оно выполняется в быстрой версии, **БПФ** (FFT, Fast Fourier Transform).',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\rho(x,y) &= \\frac{1}{4\\pi^2}\\iint s(k_x,k_y) \\\\ &\\qquad \\cdot e^{-i(k_x x + k_y y)}\\,dk_x\\,dk_y \\end{aligned}',
          caption: 'обратное преобразование в соглашении конспекта (k в рад/м)',
        },
        {
          type: 'analogy',
          title: 'Превратить смузи обратно во фрукты',
          text: 'В блендере клубника, банан и манго превратились в однородный смузи. На кухне назад уже не вернёшь. А с преобразованием Фурье можно: оно обратимо без потерь. k-пространство это смузи, где все места перемешаны. Обратное преобразование снова аккуратно разделяет его на отдельные фрукты, то есть на яркость в каждой точке.',
        },
        {
          type: 'p',
          text: 'В конспекте сказано: из измеренных сигналов, то есть **карты частот и фаз (k-пространства)**, с помощью преобразования Фурье можно вычислить обычное изображение. И ещё: **каждый пиксель зависит от количества спинов и от магнитного окружения в соответствующем месте.** Количество спинов определяет, сколько сигнала есть вообще. Магнитное окружение через T1, T2 и локальные различия поля определяет, сколько от него осталось к моменту измерения.',
        },
        {
          type: 'p',
          text: 'Данные k-пространства это **комплексные числа**. У каждого есть **модуль** (насколько силён этот узор из полос) и **фаза** (где именно лежат его полосы, насколько они сдвинуты).',
        },
        { type: 'formula', tex: 's(k_x,k_y) = |s|\\,e^{i\\phi}', caption: 'модуль и фаза значения k-пространства' },
        {
          type: 'p',
          text: 'В конспекте показан эксперимент: обратно преобразуют **только модуль** и **только фазу**. Оба результата выглядят иначе, чем оригинал. С одним модулем пропадает информация о том, где лежат структуры, изображение становится неузнаваемым. С одной фазой удивительно много контуров и краёв остаётся различимым, но правильные яркости теряются. Только **вместе** модуль и фаза дают верное изображение.',
        },
        {
          type: 'mnemonic',
          text: '**Модуль говорит насколько сильно, фаза говорит где.** Только оба вместе через обратное БПФ дают правильное изображение.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Фаза это просто шум, хватит модуля». Верно: фаза несёт положение структур. Без неё реконструкция непригодна.',
            'Неверно: «МР-изображение измеряется напрямую, БПФ его лишь улучшает». Верно: измеряется k-пространство. Изображение возникает только после обратного преобразования Фурье.',
          ],
        },
        {
          type: 'exam',
          question: 'Как из измеренных данных k-пространства получают МР-изображение и почему для этого нужны модуль и фаза?',
          answer: 'Сырые данные $s(k_x,k_y) = \\iint\\rho(x,y)e^{i(k_x x + k_y y)}dx\\,dy$ это преобразование Фурье спиновой плотности. Изображение $\\rho(x,y)$ получают обратным преобразованием Фурье $\\mathcal F^{-1}$, на практике через БПФ. Данные комплексные: модуль задаёт силу пространственной частоты, фаза её положение. Реконструкция только по модулю или только по фазе даёт неверное изображение.',
          full: 'Добавь, что каждый пиксель отражает количество спинов и магнитное окружение (релаксация, поле) в этом месте.',
          sim: 'fourier',
        },
      ],
    },
    {
      title: 'Центр и край: усиление краёв через k-пространство',
      blocks: [
        {
          type: 'p',
          text: 'Теперь практическая награда за всё пройденное. Где в k-пространстве какая информация об изображении? Ответ прямо следует из пилы в начале: медленные волны создают форму, быстрые создают края.',
        },
        {
          type: 'list',
          items: [
            '**Центр k-пространства** (малое $|k|$): низкие пространственные частоты, широкие полосы. Они несут большую часть сигнала и определяют **контраст и грубое распределение яркости**. Точка ровно в центре ($k = 0$) это сумма по всем спинам, то есть общая яркость.',
            '**Край k-пространства** (большое $|k|$): высокие пространственные частоты, узкие полосы. Энергии в них мало, но они несут **края и мелкие детали**.',
          ],
        },
        {
          type: 'table',
          head: ['Что реконструируешь', 'Что видишь'],
          rows: [
            ['только центр', 'правильный контраст, но размыто'],
            ['только край', 'только контуры и края, почти нет яркости площадей'],
            ['всё', 'резкое изображение с правильным контрастом'],
          ],
        },
        {
          type: 'figure',
          id: 'kspace-masks',
          caption: 'Здесь фантом мозга действительно посчитан через БПФ: сверху видно, какая часть k-пространства сохранена, снизу полученное изображение. Обрати внимание: один центр даёт контраст, один край даёт только контуры, а одна-единственная строка даёт лишь полосы.',
        },
        {
          type: 'analogy',
          title: 'Поднять высокие на эквалайзере',
          text: 'Если в музыке хочется лучше слышать шипение тарелок и звуки «с», на эквалайзере поднимают **высокие** и немного убирают басы. С изображением точно так же, только с пространственными частотами. Края это «высокие» изображения. Кто хочет их подчеркнуть, усиливает край k-пространства.',
        },
        {
          type: 'p',
          text: 'Так ты отвечаешь на **контрольный вопрос 4**. k-пространство умножают на **весовую функцию** W, малую в центре и большую снаружи. Это **фильтр высоких частот**. Затем, как обычно, реконструируют обратным БПФ.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s_{\\text{нов}}(k_x,k_y) &= W(k)\\cdot s(k_x,k_y) \\\\ W(k) &= 1 - e^{-k^2/k_0^2} \\end{aligned}',
          caption: 'пример мягкого фильтра высоких частот, k = расстояние до центра',
        },
        {
          type: 'p',
          text: 'По теореме о свёртке это умножение в k-пространстве равносильно свёртке изображения с фильтром краёв. Цена: площади теряют базовую яркость, а шум, который сидит в основном на краю, тоже усиливается. Если к тому же обрезать резко, рядом с краями появляются кольца (звон, ringing). Поэтому используют мягкие переходы.',
        },
        {
          type: 'mnemonic',
          text: '**Центр = контраст, край = края.** Усилить края значит поднять край k-пространства и ослабить центр, то есть фильтр высоких частот.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Края усиливают, усиливая центр k-пространства». Верно: центр несёт контраст. Края находятся во внешних областях на высоких пространственных частотах.',
            'Неверно: «Фильтр высоких частот просто делает изображение лучше». Верно: он подчёркивает и шум и лишает площади базовой яркости.',
          ],
        },
        {
          type: 'exam',
          question: 'Как через k-пространство можно усилить края в МРТ-срезе?',
          answer: 'Края состоят из высоких пространственных частот, которые лежат во внешних областях k-пространства. Перед обратным преобразованием Фурье k-пространство взвешивают так, чтобы внешние области относительно усилить или центр ослабить (фильтр высоких частот). Центр несёт контраст и грубую яркость, поэтому после этого изображение выглядит с подчёркнутыми краями.',
          full: 'Назови теорему о свёртке (умножение в k-пространстве = свёртка в изображении) и побочные эффекты: больше шума, потеря яркости площадей, звон при резких границах фильтра.',
          sim: 'kspace',
        },
      ],
    },
  ],
};
