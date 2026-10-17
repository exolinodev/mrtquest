import type { Chapter } from './types';

/**
 * Modul 2: Relaxation & Kontrast.
 * Inhaltliche Grundlage: MBR-Skript „Magnetic Resonance Imaging“, Abschnitte Relaxation, Spektrum und Gewichtung.
 */
export const relaxation: Chapter = {
  de: [
    {
      title: 'Nach dem Puls: Die Magnetisierung will zurück',
      blocks: [
        {
          type: 'hook',
          text: 'Weiter oben hast du die Magnetisierung mit einem HF-Puls gekippt. Jetzt kommt die spannende Frage: **Was passiert danach?** Die Antwort darauf ist der Grund, warum ein MRT-Bild überhaupt Kontrast hat. Fett, Wasser, graue und weiße Substanz kehren unterschiedlich schnell in ihren Ruhezustand zurück. Genau diese Unterschiede macht die MRT sichtbar.',
        },
        {
          type: 'p',
          text: 'Direkt nach einem 90°-Puls liegt die gesamte Magnetisierung in der Querebene. Sie kreist mit der Larmor-Frequenz und erzeugt in der Spule das Signal. Dieser Zustand ist aber nicht stabil. Das starke Hauptfeld $B_0$ „zieht“ die Magnetisierung zurück in ihre Ruhelage entlang der z-Achse. Diese Rückkehr nennt man **Relaxation**.',
        },
        {
          type: 'p',
          text: 'Das Wichtigste vorweg: Die Relaxation besteht aus **zwei verschiedenen Vorgängen**, die gleichzeitig ablaufen, aber unterschiedlich schnell sind. Darum gibt es zwei Zeitkonstanten.',
        },
        {
          type: 'list',
          items: [
            '**T1 (longitudinale Relaxation):** Die Längsmagnetisierung $M_z$ wächst wieder an, bis sie den Ruhewert $M_0$ erreicht.',
            '**T2 (transversale Relaxation):** Die Quermagnetisierung $M_{xy}$ zerfällt, weil die Spins aus dem Takt geraten.',
          ],
        },
        {
          type: 'analogy',
          title: 'Ein Saal voller Tänzer nach dem Gong',
          text: 'Stell dir einen Tanzsaal vor. Auf einen Gong hin (der HF-Puls) springen alle Tänzer von ihren Stühlen auf und drehen sich im gleichen Takt. Danach passieren zwei Dinge. Erstens verlieren die Tänzer langsam den gemeinsamen Takt, jeder dreht sich ein bisschen anders. Das ist T2. Zweitens setzen sich die Tänzer nach und nach wieder auf ihre Stühle. Das ist T1. Den Takt verlieren geht viel schneller als sich wieder hinsetzen.',
        },
        {
          type: 'p',
          text: 'In den Bloch-Gleichungen von oben stecken genau diese zwei Effekte. Löst man sie nach einem 90°-Puls (im mitrotierenden Bezugssystem), bekommt man zwei einfache Kurven:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} M_z(t) &= M_0\\left(1 - e^{-t/T_1}\\right) \\\\ M_{xy}(t) &= M_0\\, e^{-t/T_2} \\end{aligned}',
          caption: 'Erholung längs und Zerfall quer nach einem 90°-Puls',
        },
        {
          type: 'p',
          text: 'Lies die Formeln in Worten. $M_0$ ist die Ruhemagnetisierung, also der Wert, zu dem alles zurück will. $t$ ist die Zeit seit dem Puls. $e^{-t/T}$ ist eine Exponentialfunktion, die bei 1 startet und gegen 0 geht. Bei $M_z$ wird sie von 1 abgezogen, darum **wächst** $M_z$ von 0 auf $M_0$. Bei $M_{xy}$ steht sie allein, darum **zerfällt** $M_{xy}$ von $M_0$ auf 0.',
        },
        { type: 'figure', id: 't1-t2-curves', caption: 'Links wächst $M_z$ nach der Zeit T1 auf 63 % von $M_0$, rechts fällt $M_{xy}$ nach T2 auf 37 % (Achtung: Die rechte Zeitachse ist viel kürzer, denn T2 ist kürzer als T1). Gestrichelt siehst du T2*: Mit den Feldinhomogenitäten zerfällt das Signal noch schneller.' },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Immer gilt: T2 ist kürzer als T1',
          text: 'In jedem Gewebe ist T2 kleiner (oder höchstens gleich) T1. Die Quermagnetisierung ist also längst verschwunden, wenn sich die Längsmagnetisierung noch erholt.',
        },
        {
          type: 'mnemonic',
          text: '**Längs wächst, quer zerfällt.** T1 baut $M_z$ wieder auf, T2 löscht $M_{xy}$. Beide laufen gleichzeitig, aber T2 ist immer schneller fertig.',
        },
      ],
    },
    {
      title: 'T1: Spin-Gitter-Relaxation, die Energie fließt ab',
      blocks: [
        {
          type: 'p',
          text: 'Beim Kippen hat der HF-Puls Energie in das Spinsystem gesteckt. Ein Teil der Spins sitzt jetzt im energiereicheren Zustand. Damit $M_z$ wieder auf $M_0$ wachsen kann, müssen die Spins diese Energie **an ihre Umgebung abgeben**. Die Umgebung nennt man in der Physik das **Gitter**, gemeint sind die umliegenden Moleküle. Darum heißt T1 auch **Spin-Gitter-Relaxation** oder **longitudinale Relaxation**.',
        },
        {
          type: 'analogy',
          title: 'Eine heiße Tasse Tee kühlt ab',
          text: 'Eine heiße Tasse gibt ihre Wärme an die Luft ab. Am Anfang geht das schnell, dann immer langsamer, bis sie Zimmertemperatur hat. Genau so erholt sich $M_z$: erst schnell, dann immer gemächlicher, bis $M_0$ erreicht ist. Wie schnell das geht, hängt davon ab, wie gut die Umgebung die Energie aufnehmen kann.',
        },
        {
          type: 'p',
          text: 'Die Zeitkonstante T1 sagt dir, wie schnell diese Erholung geht. Setzt du $t = T_1$ in die Formel ein, bekommst du $1 - e^{-1} \\approx 0{,}63$. Nach einer Zeit T1 hat sich $M_z$ also zu 63 % erholt.',
        },
        {
          type: 'table',
          head: ['Zeit nach dem 90°-Puls', 'erholter Anteil von M₀'],
          rows: [
            ['1 · T1', '≈ 63 %'],
            ['2 · T1', '≈ 86 %'],
            ['3 · T1', '≈ 95 %'],
            ['5 · T1', '> 99 %'],
          ],
        },
        {
          type: 'p',
          text: 'Warum ist T1 von Gewebe zu Gewebe verschieden? Die Spins können ihre Energie am besten abgeben, wenn sich die Moleküle in ihrer Umgebung ungefähr im Takt der Larmor-Frequenz bewegen. **Fett** hat mittelgroße, eher träge Moleküle, die gut passen. Darum hat Fett ein **kurzes T1**. **Freies Wasser**, zum Beispiel im Liquor, bewegt sich viel zu schnell. Es kann die Energie schlecht aufnehmen und hat ein **sehr langes T1**.',
        },
        {
          type: 'table',
          head: ['Gewebe (1,5 T, ungefähr)', 'T1', 'T2'],
          rows: [
            ['Fett', '≈ 260 ms', '≈ 80 ms'],
            ['Weiße Substanz', '≈ 600 bis 800 ms', '≈ 80 ms'],
            ['Graue Substanz', '≈ 900 bis 1000 ms', '≈ 100 ms'],
            ['Liquor (Hirnwasser)', '≈ 4000 ms', '≈ 2000 ms'],
          ],
        },
        {
          type: 'p',
          text: 'Diese Zahlen sind Richtwerte. Je nach Messmethode und Feldstärke findest du in Büchern etwas andere Werte. Für die Prüfung reicht die Reihenfolge: **Fett kurz, Liquor lang, Hirngewebe dazwischen.**',
        },
        {
          type: 'mnemonic',
          text: '**T1 ist das Abkühlen.** Die Spins geben Energie ans Gitter ab, $M_z$ wächst nach einer Zeit T1 auf 63 %. Fett kühlt schnell ab, Wasser langsam.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Nach der Zeit T1 ist $M_z$ wieder vollständig da.“ Richtig: Nach T1 sind es erst 63 %. Fast vollständig ist die Erholung nach etwa 5 · T1.',
            'Falsch: „T1 beschreibt den Signalzerfall in der Spule.“ Richtig: T1 betrifft die Längsmagnetisierung, die die Spule gar nicht direkt sieht.',
          ],
        },
        {
          type: 'exam',
          question: 'Was beschreibt die T1-Relaxation? Gib die Formel an und erkläre, warum Fett ein kürzeres T1 hat als Liquor.',
          answer: 'T1 beschreibt die longitudinale oder Spin-Gitter-Relaxation: Nach der Anregung geben die Spins Energie an ihre Umgebung (das Gitter) ab, und die Längsmagnetisierung wächst wieder auf $M_0$ an: $M_z(t) = M_0(1 - e^{-t/T_1})$. Nach $t = T_1$ sind 63 % erholt. Fett hat Moleküle, deren Bewegung gut zur Larmor-Frequenz passt, dadurch geben die Spins ihre Energie effizient ab (kurzes T1). Freies Wasser bewegt sich zu schnell, die Energieabgabe ist ineffizient (langes T1).',
          full: 'Nenne typische Werte bei 1,5 T (Fett ≈ 260 ms, Liquor ≈ 4000 ms) und erwähne, dass T1 immer länger ist als T2.',
          sim: 'relaxation',
        },
      ],
    },
    {
      title: 'T2 und T2*: Die Spins verlieren den gemeinsamen Takt',
      blocks: [
        {
          type: 'p',
          text: 'Direkt nach dem 90°-Puls kreisen alle Spins **im Gleichschritt**. Man sagt: Sie sind **phasenkohärent**. Nur deshalb addieren sich ihre kleinen Magnetfelder zu einem großen, messbaren Signal. Doch dieser Gleichschritt hält nicht lange.',
        },
        {
          type: 'analogy',
          title: 'Läufer im Stadion',
          text: 'Stell dir Läufer vor, die alle gleichzeitig an der Startlinie loslaufen. Am Anfang laufen sie als dichte Gruppe. Aber jeder Läufer ist ein kleines bisschen schneller oder langsamer. Nach ein paar Runden sind sie über die ganze Bahn verteilt. Von der Tribüne aus siehst du keinen Pulk mehr, sondern eine gleichmäßig verteilte Menge. Die Läufer laufen noch, aber nicht mehr zusammen. Genau so verschwindet die Quermagnetisierung: Die Spins kreisen weiter, aber in alle Richtungen verteilt, und ihre Beiträge heben sich auf.',
        },
        {
          type: 'p',
          text: 'Warum laufen die Spins auseinander? Dafür gibt es **zwei Ursachen**, und die musst du sauber trennen.',
        },
        {
          type: 'list',
          items: [
            '**Echte Spin-Spin-Wechselwirkung (T2):** Jeder Spin ist selbst ein kleiner Magnet. Er verändert das Feld an seinen Nachbarn ein wenig. Weil sich die Moleküle ständig bewegen, schwanken diese kleinen Felder zufällig. Dabei tauschen die Spins auch Energie untereinander aus. Dieser Vorgang ist zufällig und lässt sich **nicht rückgängig machen**. Er hängt stark davon ab, wie beweglich das Wasser ist. Darum ist T2 **empfindlich für die Wasserbeweglichkeit**.',
            '**Feldinhomogenitäten (T2′):** Kein Magnet ist perfekt. Außerdem verzerrt das Gewebe selbst das Feld ein wenig, besonders an Grenzen zwischen Luft und Gewebe. An verschiedenen Orten ist das Feld also minimal anders, und die Spins dort kreisen dauerhaft etwas schneller oder langsamer. Diese Abweichungen sind **statisch**, sie bleiben immer gleich.',
          ],
        },
        {
          type: 'p',
          text: 'Beide Effekte zusammen bestimmen, wie schnell das Signal nach dem Puls wirklich verschwindet. Diese Gesamtzeit heißt **T2*** (sprich „T2 Stern“). Das direkt gemessene, schnell abklingende Signal ist der **Free Induction Decay (FID)**. Er zerfällt mit T2*, nicht mit T2.',
        },
        {
          type: 'formula',
          tex: '\\frac{1}{T_2^*} = \\frac{1}{T_2} + \\frac{1}{T_2^{\\prime}}',
          caption: 'Zerfallsraten addieren sich',
        },
        {
          type: 'p',
          text: 'So liest du die Formel: $1/T$ ist eine **Rate**, also „wie viel Zerfall pro Sekunde“. Zwei Effekte, die gleichzeitig an der Quermagnetisierung nagen, addieren ihre Raten. $T_2$ ist der echte Spin-Spin-Anteil, $T_2^{\\prime}$ der Anteil durch die Feldinhomogenitäten, $T_2^*$ das Ergebnis. Weil sich Raten addieren, ist $T_2^*$ **immer kürzer** als $T_2$.',
        },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Die Reihenfolge',
          text: 'Für jedes Gewebe gilt $T_2^* \\le T_2 \\le T_1$. Im Skript steht dazu: T2* ist die totale Relaxationszeit, T2 die Spin-Spin-Relaxation und T2′ der Anteil, der durch Feldinhomogenitäten entsteht.',
        },
        {
          type: 'mnemonic',
          text: '**T2 ist Taktverlust, T2* ist Taktverlust plus schiefe Bahn.** Die Raten addieren sich, darum ist T2* immer am kürzesten, und der FID zerfällt mit T2*.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Bei der T2-Relaxation geben die Spins Energie an die Umgebung ab.“ Richtig: Das ist T1. Bei T2 tauschen die Spins Energie untereinander aus und verlieren die Phasenkohärenz.',
            'Falsch: „Der FID zerfällt mit T2.“ Richtig: Der FID zerfällt mit T2*, weil auch die Feldinhomogenitäten mitwirken.',
          ],
        },
        {
          type: 'exam',
          question: 'Erkläre den Unterschied zwischen T2 und T2*. Welche Formel verbindet sie?',
          answer: 'T2 ist die Spin-Spin- oder transversale Relaxation: Durch zufällig fluktuierende Felder benachbarter Spins und Energieaustausch zwischen den Spins geht die Phasenkohärenz irreversibel verloren, die Quermagnetisierung zerfällt mit $M_{xy}(t) = M_0 e^{-t/T_2}$. T2* ist die gesamte transversale Zerfallszeit, die zusätzlich die statischen Feldinhomogenitäten (Anteil T2′) enthält. Es gilt $1/T_2^* = 1/T_2 + 1/T_2^{\\prime}$, daher $T_2^* \\le T_2$. Der FID zerfällt mit T2*.',
          full: 'Erwähne, dass T2 empfindlich für die Wasserbeweglichkeit ist und dass der T2′-Anteil im Gegensatz zum T2-Anteil durch ein Spin-Echo rückgängig gemacht werden kann.',
          sim: 'relaxation',
        },
      ],
    },
    {
      title: 'Das Spin-Echo: Die Läufer drehen auf Pfiff um',
      blocks: [
        {
          type: 'p',
          text: 'Wenn der FID mit T2* zerfällt, wie misst man dann das echte T2? Die Idee ist genial einfach. Der Anteil durch Feldinhomogenitäten ist **statisch**: Ein Spin, der an einem Ort mit etwas stärkerem Feld sitzt, ist **immer** etwas zu schnell. Einen solchen festen Fehler kann man umkehren.',
        },
        {
          type: 'analogy',
          title: 'Der Pfiff des Trainers',
          text: 'Die Läufer starten gemeinsam und laufen auseinander, die schnellen vorne, die langsamen hinten. Nach einer Weile pfeift der Trainer, und alle drehen um und laufen mit **demselben Tempo** zurück zur Startlinie. Wer schnell ist, hat den weitesten Rückweg. Wer langsam ist, hat den kürzesten. Ergebnis: Alle kommen **gleichzeitig** an der Startlinie an. Nur die Läufer, die unterwegs zufällig müde geworden sind und ihr Tempo verändert haben, kommen nicht ganz mit. Diese müden Läufer sind der echte T2-Anteil.',
        },
        {
          type: 'p',
          text: 'In der MRT ist der Pfiff ein **180°-Puls**. Er wird nach der Zeit TE/2 eingestrahlt und spiegelt die Phasen aller Spins. Die Spins, die vorne lagen, liegen jetzt hinten, laufen aber weiter mit ihrer gewohnten Geschwindigkeit. Nach weiteren TE/2 sind sie wieder in Phase. Das Signal taucht noch einmal auf, das nennt man **Spin-Echo**. Die Zeit vom 90°-Puls bis zum Echo heißt **Echozeit TE**.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} &90^\\circ \\;\\xrightarrow{\\;TE/2\\;}\\; 180^\\circ \\;\\xrightarrow{\\;TE/2\\;}\\; \\text{Echo} \\\\ &S(TE) \\propto e^{-TE/T_2} \\end{aligned}',
          caption: 'Die Echoamplitude hängt nur noch von T2 ab',
        },
        {
          type: 'p',
          text: 'Das Echo ist kleiner als das Signal direkt nach dem Puls. Der Verlust kommt nur noch vom echten, zufälligen T2-Zerfall. Der statische T2′-Anteil ist herausgerechnet. Misst man Echos bei verschiedenen TE, kann man so die T2-Kurve abtasten.',
        },
        {
          type: 'mnemonic',
          text: '**Der 180°-Puls holt nur die zurück, die sich treu geblieben sind.** Statische Dephasierung (T2′) wird refokussiert, zufällige Dephasierung (T2) nicht.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Der 180°-Puls hebt die T2-Relaxation auf.“ Richtig: Er hebt nur die statische Dephasierung durch Feldinhomogenitäten auf. Der echte T2-Zerfall bleibt.',
            'Falsch: „Das Echo ist so groß wie das Anfangssignal.“ Richtig: Die Echoamplitude ist um den Faktor $e^{-TE/T_2}$ kleiner.',
          ],
        },
        {
          type: 'exam',
          question: 'Wozu dient der 180°-Puls in einer Spin-Echo-Sequenz?',
          answer: 'Nach dem 90°-Puls dephasieren die Spins durch T2 und durch statische Feldinhomogenitäten (zusammen T2*). Der 180°-Puls zur Zeit TE/2 spiegelt die Phasen. Weil die statischen Frequenzabweichungen gleich bleiben, laufen die Spins wieder zusammen und sind zur Zeit TE wieder in Phase: Es entsteht ein Echo. Die statische Dephasierung (T2′) wird so refokussiert, der irreversible T2-Zerfall nicht. Die Echoamplitude ist daher proportional zu $e^{-TE/T_2}$.',
          full: 'Benutze ein Bild wie die Läufer, die auf Pfiff umdrehen, und betone, dass das Echo T2 und nicht T2* widerspiegelt.',
          sim: 'relaxation',
        },
      ],
    },
    {
      title: 'Wie misst man T2 in einem Spektrum?',
      blocks: [
        {
          type: 'p',
          text: 'Im Skript steht eine kleine, aber wichtige Frage: **Wie misst man T2 in einem Spektrum?** Dafür musst du dasselbe Signal auf zwei Arten anschauen. Einmal als Kurve über der Zeit, einmal als Spektrum über der Frequenz. Beide Bilder enthalten genau dieselbe Information, sie hängen über die Fourier-Transformation zusammen.',
        },
        {
          type: 'analogy',
          title: 'Eine Glocke und ein Klatschen',
          text: 'Eine große Kirchenglocke klingt lange nach. Du hörst einen sehr klaren, reinen Ton, also eine scharfe Frequenz. Ein kurzes Klatschen dagegen ist sofort vorbei, und es hat keine klare Tonhöhe, es enthält viele Frequenzen auf einmal. Die Regel dahinter: **Je länger ein Signal anhält, desto schmaler ist seine Frequenzlinie.** Je schneller es stirbt, desto breiter wird sie.',
        },
        {
          type: 'p',
          text: 'Im Zeitbereich ist das MR-Signal eine Schwingung mit der Larmor-Frequenz, deren Amplitude exponentiell abnimmt. Macht man daraus mit der Fourier-Transformation ein Spektrum, bekommt man keinen unendlich dünnen Strich, sondern eine glockenförmige Linie mit einer bestimmten Breite. Diese Form heißt **Lorentz-Linie**.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s(t) &= e^{-t/T_2}\\, e^{i\\omega_0 t} \\quad (t \\ge 0) \\\\ &\\;\\big\\downarrow\\ \\text{Fourier} \\\\ \\operatorname{Re} S(f) &\\propto \\frac{T_2}{1 + \\big(2\\pi (f - f_0)\\, T_2\\big)^2} \\end{aligned}',
          caption: 'Zerfallendes Signal ↔ Lorentz-Linie bei f₀',
        },
        {
          type: 'p',
          text: 'Für die Prüfung brauchst du vor allem die Breite. Man misst sie als **Halbwertsbreite (FWHM)**, das ist die Breite der Linie auf halber Höhe. Für die Lorentz-Linie (im Realteil des Spektrums) gilt:',
        },
        {
          type: 'formula',
          tex: '\\text{FWHM} = \\Delta f_{1/2} = \\frac{1}{\\pi\\, T_2}',
          caption: 'Halbwertsbreite in Hz',
        },
        {
          type: 'p',
          text: 'Ein Beispiel: Bei $T_2 = 100$ ms ist die Linie etwa $1/(\\pi \\cdot 0{,}1\\ \\text{s}) \\approx 3{,}2$ Hz breit. Bei $T_2 = 10$ ms sind es schon rund 32 Hz. Kurzes T2 heißt also breite Linie, langes T2 heißt schmale Linie. Wie im Skript beschrieben: Das Verhältnis von Breite zu Höhe kodiert das T2.',
        },
        { type: 'figure', id: 'fid-spectrum', caption: 'Oben klingt der FID lange nach und ergibt eine schmale, hohe Linie, unten stirbt er schnell, und die Linie wird breit und flach. Achte auf die gelbe Halbwertsbreite: Sie ist $1/(\\pi T_2)$, also rund 5 Hz bei 60 ms und rund 27 Hz bei 12 ms.' },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Eigentlich ist es T2*',
          text: 'Im Skript steht T2. Misst du aber einfach den FID und transformierst ihn, zerfällt das Signal mit T2*. Die Linie ist dann $1/(\\pi T_2^*)$ breit und damit breiter, als es dem echten T2 entspricht. Die echte T2-Linienbreite bekommst du nur, wenn die Feldinhomogenitäten herausgerechnet sind, zum Beispiel über Spin-Echos.',
        },
        {
          type: 'mnemonic',
          text: '**Lange Glocke, schmale Linie.** Exponentieller Zerfall wird im Spektrum zur Lorentz-Linie mit FWHM = 1/(πT2). Kurzes T2 macht die Linie breit.',
        },
        {
          type: 'exam',
          question: 'Welches Signalmerkmal muss man analysieren, um ein T2-gewichtetes Bild zu erhalten?',
          answer: 'Man muss den **Zerfall der Quermagnetisierung** auswerten, also wie stark das Signal bis zur Echozeit TE abgenommen hat. Praktisch misst man die Signalamplitude zum Zeitpunkt TE, die proportional zu $e^{-TE/T_2}$ ist. Bei langem TE haben Gewebe mit kurzem T2 schon viel Signal verloren, Gewebe mit langem T2 noch wenig. Im Spektrum entspricht dieser Zerfall der Linienbreite: FWHM $= 1/(\\pi T_2)$.',
          full: 'Zeitbereich (Amplitude bei TE, Zerfallskonstante) und Frequenzbereich (Lorentz-Linie, Breite) verbinden, und erwähnen, dass beim reinen FID eigentlich T2* gemessen wird.',
          sim: 'signal/spectrum',
        },
      ],
    },
    {
      title: 'Gewichtung: Mit TR und TE den Kontrast wählen',
      blocks: [
        {
          type: 'p',
          text: 'Jetzt kommt alles zusammen. Ein Bild entsteht nicht aus einer einzigen Anregung. Die Messung wird viele Male wiederholt. Dafür gibt es zwei Zeiten, die du einstellst:',
        },
        {
          type: 'list',
          items: [
            '**TR (Repetitionszeit):** die Zeit zwischen zwei Anregungen. Sie bestimmt, wie viel sich $M_z$ erholen konnte, bevor wieder gekippt wird. TR steuert also den **T1-Einfluss**.',
            '**TE (Echozeit):** die Zeit von der Anregung bis zur Messung des Echos. Sie bestimmt, wie viel Quermagnetisierung bis dahin zerfallen ist. TE steuert also den **T2-Einfluss**.',
          ],
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} S \\;\\propto\\;\\; &\\rho \\\\ \\cdot\\; &\\big(1 - e^{-TR/T_1}\\big) \\\\ \\cdot\\; &e^{-TE/T_2} \\end{aligned}',
          caption: 'Spin-Echo-Signal (Näherung für TR ≫ TE)',
        },
        {
          type: 'p',
          text: 'Die Formel hat drei Faktoren. $\\rho$ ist die **Protonendichte**, also wie viele bewegliche Wasserstoffkerne im Voxel sitzen. Der mittlere Faktor sagt, wie weit sich $M_z$ in der Zeit TR erholt hat. Der letzte Faktor sagt, wie viel Quersignal bis TE übrig ist. Mit TR und TE entscheidest du, welcher Faktor die Unterschiede zwischen den Geweben bestimmt.',
        },
        {
          type: 'table',
          head: ['Gewichtung', 'TR/TE im Skript', 'TR', 'TE'],
          rows: [
            ['PDw', '5500/14 ms', 'lang', 'kurz'],
            ['T1w', '500/10 ms', 'kurz', 'kurz'],
            ['T2w', '5500/101 ms', 'lang', 'lang'],
          ],
        },
        {
          type: 'p',
          text: '**Langes TR lässt T1-Unterschiede verschwinden.** Bei 5500 ms hatten fast alle Gewebe genug Zeit, sich zu erholen. Der mittlere Faktor ist dann für alle ungefähr gleich. **Kurzes TE lässt T2-Unterschiede verschwinden.** Bei 10 oder 14 ms ist bei keinem Gewebe viel zerfallen, der letzte Faktor ist überall fast 1. Damit ergibt sich:',
        },
        {
          type: 'list',
          items: [
            '**PDw (lang/kurz):** T1 und T2 sind beide „ausgeschaltet“. Übrig bleibt die Protonendichte $\\rho$. Das Bild zeigt, wo viel Wasser und Fett ist.',
            '**T1w (kurz/kurz):** Kurzes TR bedeutet, dass sich nur Gewebe mit kurzem T1 erholt haben. Rechne nach: Fett hat $1 - e^{-500/260} \\approx 0{,}85$, Liquor nur $1 - e^{-500/4000} \\approx 0{,}12$. **Fett ist hell, Liquor ist dunkel.**',
            '**T2w (lang/lang):** Langes TE bedeutet, dass bei Geweben mit kurzem T2 schon viel Signal weg ist. Weiße Substanz hat $e^{-101/80} \\approx 0{,}28$, Liquor $e^{-101/2000} \\approx 0{,}95$. **Liquor und Wasser sind hell**, Hirngewebe ist grauer.',
          ],
        },
        { type: 'figure', id: 'weighting-map', caption: 'Lies die Karte so: Langes TR (rechts) schaltet den T1-Einfluss ab, langes TE (oben) schaltet den T2-Einfluss ein. Die drei Punkte sind die Bilder aus dem Skript, und die Ecke oben links mit kurzem TR und langem TE liefert kaum Signal.' },
        {
          type: 'callout',
          variant: 'klinik',
          title: 'Warum T2w so oft gebraucht wird',
          text: 'Viele Krankheiten wie Entzündungen, Ödeme oder Tumoren erhöhen den Anteil an freiem Wasser im Gewebe. Dadurch werden T1 und T2 länger. Im T2w-Bild leuchten solche Stellen hell auf, im T1w-Bild sind sie eher dunkel.',
        },
        {
          type: 'mnemonic',
          text: '**TR regelt T1, TE regelt T2. Lang macht den Unterschied weg, wo er nicht hingehört.** Im T2w-Bild ist Wasser weiß (**T2 = „Tümpel“ leuchtet**), im T1w-Bild ist Fett hell und Liquor dunkel.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Ein langes TE macht ein Bild T1-gewichtet.“ Richtig: TE steuert den T2-Einfluss, TR den T1-Einfluss.',
            'Falsch: „Im T2w-Bild ist alles mit langem T2 dunkel, weil es länger zerfällt.“ Richtig: Langes T2 heißt langsamer Zerfall, also bleibt mehr Signal übrig. Langes T2 ist hell.',
            'Falsch: „Im T1w-Bild ist ein Gewebe mit langem T1 hell.“ Richtig: Langes T1 heißt langsame Erholung, also wenig $M_z$ beim nächsten Puls. Langes T1 ist im T1w-Bild dunkel.',
          ],
        },
        {
          type: 'exam',
          question: 'Im Skript stehen drei Bilder mit TR/TE = 5500/14 ms, 500/10 ms und 5500/101 ms. Ordne die Gewichtungen zu und begründe. Wie erscheinen Liquor und Fett?',
          answer: '5500/14 ms ist protonendichtegewichtet (PDw): Das lange TR lässt die T1-Unterschiede verschwinden, das kurze TE die T2-Unterschiede, übrig bleibt die Protonendichte. 500/10 ms ist T1-gewichtet: Das kurze TR betont die unterschiedliche Erholung von $M_z$, das kurze TE unterdrückt T2. Fett (kurzes T1) ist hell, Liquor (langes T1) dunkel. 5500/101 ms ist T2-gewichtet: Das lange TR unterdrückt T1, das lange TE lässt die T2-Unterschiede wirken. Liquor (langes T2) ist hell.',
          full: 'Die Signalgleichung $S \\propto \\rho(1 - e^{-TR/T_1})e^{-TE/T_2}$ nennen und an einem Zahlenbeispiel zeigen, welcher Faktor jeweils dominiert.',
          sim: 'relaxation',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'После импульса: намагниченность хочет вернуться',
      blocks: [
        {
          type: 'hook',
          text: 'Выше ты отклонил намагниченность РЧ-импульсом. Теперь самый интересный вопрос: **что происходит потом?** Ответ на него и есть причина, по которой на МРТ-изображении вообще есть контраст. Жир, вода, серое и белое вещество возвращаются в состояние покоя с разной скоростью. Именно эти различия МРТ делает видимыми.',
        },
        {
          type: 'p',
          text: 'Сразу после импульса 90° вся намагниченность лежит в поперечной плоскости. Она кружит с ларморовой частотой и создаёт сигнал в катушке. Но это состояние неустойчиво. Сильное основное поле $B_0$ «тянет» намагниченность обратно в положение покоя вдоль оси z. Этот возврат называется **релаксацией**.',
        },
        {
          type: 'p',
          text: 'Самое важное сразу: релаксация состоит из **двух разных процессов**, которые идут одновременно, но с разной скоростью. Поэтому есть две постоянные времени.',
        },
        {
          type: 'list',
          items: [
            '**T1 (продольная релаксация):** продольная намагниченность $M_z$ снова растёт, пока не достигнет значения покоя $M_0$.',
            '**T2 (поперечная релаксация):** поперечная намагниченность $M_{xy}$ затухает, потому что спины сбиваются с такта.',
          ],
        },
        {
          type: 'analogy',
          title: 'Зал, полный танцоров, после гонга',
          text: 'Представь танцевальный зал. По удару гонга (это РЧ-импульс) все танцоры вскакивают со стульев и кружатся в одном такте. Дальше происходят две вещи. Во-первых, танцоры постепенно теряют общий такт, каждый кружится чуть по-своему. Это T2. Во-вторых, танцоры понемногу снова садятся на свои стулья. Это T1. Потерять такт гораздо быстрее, чем снова сесть.',
        },
        {
          type: 'p',
          text: 'В уравнениях Блоха, которые ты видел выше, заложены именно эти два эффекта. Если решить их после импульса 90° (во вращающейся системе отсчёта), получаются две простые кривые:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} M_z(t) &= M_0\\left(1 - e^{-t/T_1}\\right) \\\\ M_{xy}(t) &= M_0\\, e^{-t/T_2} \\end{aligned}',
          caption: 'восстановление вдоль и затухание поперёк после импульса 90°',
        },
        {
          type: 'p',
          text: 'Прочитай формулы словами. $M_0$ это намагниченность покоя, то есть значение, к которому всё стремится. $t$ это время после импульса. $e^{-t/T}$ это экспонента, которая начинается с 1 и стремится к 0. В $M_z$ она вычитается из 1, поэтому $M_z$ **растёт** от 0 до $M_0$. В $M_{xy}$ она стоит одна, поэтому $M_{xy}$ **затухает** от $M_0$ до 0.',
        },
        { type: 'figure', id: 't1-t2-curves', caption: 'Слева $M_z$ за время T1 вырастает до 63 % от $M_0$, справа $M_{xy}$ за время T2 падает до 37 % (внимание: правая ось времени гораздо короче, ведь T2 короче T1). Пунктиром показан T2*: с неоднородностями поля сигнал спадает ещё быстрее.' },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Всегда: T2 короче T1',
          text: 'В любой ткани T2 меньше (или максимум равно) T1. Поперечная намагниченность давно исчезла, когда продольная ещё восстанавливается.',
        },
        {
          type: 'mnemonic',
          text: '**Вдоль растёт, поперёк затухает.** T1 восстанавливает $M_z$, T2 стирает $M_{xy}$. Оба идут одновременно, но T2 всегда заканчивается раньше.',
        },
      ],
    },
    {
      title: 'T1: спин-решёточная релаксация, энергия уходит',
      blocks: [
        {
          type: 'p',
          text: 'При отклонении РЧ-импульс вложил энергию в систему спинов. Часть спинов теперь находится в состоянии с большей энергией. Чтобы $M_z$ снова выросла до $M_0$, спины должны **отдать эту энергию окружению**. Окружение в физике называют **решёткой**, имеются в виду соседние молекулы. Поэтому T1 называют также **спин-решёточной** или **продольной релаксацией**.',
        },
        {
          type: 'analogy',
          title: 'Горячая чашка чая остывает',
          text: 'Горячая чашка отдаёт тепло воздуху. Сначала быстро, потом всё медленнее, пока не достигнет комнатной температуры. Так же восстанавливается $M_z$: сначала быстро, потом всё неторопливее, пока не будет достигнуто $M_0$. Скорость зависит от того, насколько хорошо окружение может принять энергию.',
        },
        {
          type: 'p',
          text: 'Постоянная времени T1 говорит, как быстро идёт это восстановление. Если подставить $t = T_1$ в формулу, получится $1 - e^{-1} \\approx 0{,}63$. Значит, через время T1 величина $M_z$ восстановилась на 63 %.',
        },
        {
          type: 'table',
          head: ['Время после импульса 90°', 'восстановленная доля M₀'],
          rows: [
            ['1 · T1', '≈ 63 %'],
            ['2 · T1', '≈ 86 %'],
            ['3 · T1', '≈ 95 %'],
            ['5 · T1', '> 99 %'],
          ],
        },
        {
          type: 'p',
          text: 'Почему T1 у разных тканей разное? Спины лучше всего отдают энергию, когда молекулы вокруг движутся примерно в такт ларморовой частоте. У **жира** молекулы среднего размера, довольно медлительные, они хорошо подходят. Поэтому у жира **короткое T1**. **Свободная вода**, например в ликворе, движется слишком быстро. Она плохо принимает энергию, и у неё **очень длинное T1**.',
        },
        {
          type: 'table',
          head: ['Ткань (1,5 Тл, примерно)', 'T1', 'T2'],
          rows: [
            ['Жир', '≈ 260 мс', '≈ 80 мс'],
            ['Белое вещество', '≈ 600…800 мс', '≈ 80 мс'],
            ['Серое вещество', '≈ 900…1000 мс', '≈ 100 мс'],
            ['Ликвор (спинномозговая жидкость)', '≈ 4000 мс', '≈ 2000 мс'],
          ],
        },
        {
          type: 'p',
          text: 'Эти числа ориентировочные. В зависимости от метода измерения и силы поля в книгах встречаются немного другие значения. Для экзамена достаточно порядка: **жир короткий, ликвор длинный, ткань мозга посередине.**',
        },
        {
          type: 'mnemonic',
          text: '**T1 это остывание.** Спины отдают энергию решётке, $M_z$ за время T1 вырастает до 63 %. Жир остывает быстро, вода медленно.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Через время T1 величина $M_z$ полностью восстановлена». Верно: через T1 это только 63 %. Почти полное восстановление наступает примерно через 5 · T1.',
            'Неверно: «T1 описывает затухание сигнала в катушке». Верно: T1 относится к продольной намагниченности, которую катушка напрямую вообще не видит.',
          ],
        },
        {
          type: 'exam',
          question: 'Что описывает релаксация T1? Приведи формулу и объясни, почему у жира T1 короче, чем у ликвора.',
          answer: 'T1 описывает продольную, или спин-решёточную, релаксацию: после возбуждения спины отдают энергию окружению (решётке), и продольная намагниченность снова растёт до $M_0$: $M_z(t) = M_0(1 - e^{-t/T_1})$. Через $t = T_1$ восстановлено 63 %. У жира молекулы движутся в темпе, хорошо подходящем к ларморовой частоте, поэтому спины эффективно отдают энергию (короткое T1). Свободная вода движется слишком быстро, отдача энергии неэффективна (длинное T1).',
          full: 'Назови типичные значения при 1,5 Тл (жир ≈ 260 мс, ликвор ≈ 4000 мс) и упомяни, что T1 всегда длиннее T2.',
          sim: 'relaxation',
        },
      ],
    },
    {
      title: 'T2 и T2*: спины теряют общий такт',
      blocks: [
        {
          type: 'p',
          text: 'Сразу после импульса 90° все спины кружат **в ногу**. Говорят: они **когерентны по фазе**. Только поэтому их маленькие магнитные поля складываются в большой измеримый сигнал. Но этот общий шаг держится недолго.',
        },
        {
          type: 'analogy',
          title: 'Бегуны на стадионе',
          text: 'Представь бегунов, которые одновременно стартуют с линии. Сначала они бегут плотной группой. Но каждый бегун чуть быстрее или чуть медленнее. Через несколько кругов они распределены по всей дорожке. С трибуны ты видишь уже не группу, а равномерно рассыпанную толпу. Бегуны всё ещё бегут, но уже не вместе. Так же исчезает поперечная намагниченность: спины продолжают кружить, но во все стороны, и их вклады взаимно гасятся.',
        },
        {
          type: 'p',
          text: 'Почему спины разбегаются? У этого **две причины**, и их нужно чётко различать.',
        },
        {
          type: 'list',
          items: [
            '**Настоящее спин-спиновое взаимодействие (T2):** каждый спин сам маленький магнит. Он немного меняет поле у своих соседей. Поскольку молекулы всё время движутся, эти маленькие поля случайно колеблются. При этом спины ещё и обмениваются энергией между собой. Этот процесс случаен и **необратим**. Он сильно зависит от подвижности воды. Поэтому T2 **чувствительно к подвижности воды**.',
            '**Неоднородности поля (T2′):** идеальных магнитов не бывает. Кроме того, сама ткань немного искажает поле, особенно на границах воздуха и ткани. В разных местах поле чуть-чуть разное, и спины там постоянно кружат немного быстрее или медленнее. Эти отклонения **статические**, они всё время одинаковы.',
          ],
        },
        {
          type: 'p',
          text: 'Оба эффекта вместе определяют, как быстро сигнал после импульса на самом деле исчезает. Это общее время называется **T2*** («T2 со звёздочкой»). Непосредственно измеряемый, быстро затухающий сигнал это **спад свободной индукции (FID)**. Он затухает с T2*, а не с T2.',
        },
        {
          type: 'formula',
          tex: '\\frac{1}{T_2^*} = \\frac{1}{T_2} + \\frac{1}{T_2^{\\prime}}',
          caption: 'скорости затухания складываются',
        },
        {
          type: 'p',
          text: 'Как читать формулу: $1/T$ это **скорость**, то есть «сколько затухания в секунду». Два эффекта, которые одновременно разрушают поперечную намагниченность, складывают свои скорости. $T_2$ это настоящая спин-спиновая часть, $T_2^{\\prime}$ часть от неоднородностей поля, $T_2^*$ результат. Поскольку скорости складываются, $T_2^*$ **всегда короче** $T_2$.',
        },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Порядок',
          text: 'Для любой ткани $T_2^* \\le T_2 \\le T_1$. В конспекте об этом сказано: T2* это полное время релаксации, T2 спин-спиновая релаксация, а T2′ доля, возникающая из-за неоднородностей поля.',
        },
        {
          type: 'mnemonic',
          text: '**T2 это потеря такта, T2* это потеря такта плюс кривая дорожка.** Скорости складываются, поэтому T2* всегда самое короткое, и FID затухает с T2*.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «При релаксации T2 спины отдают энергию окружению». Верно: это T1. При T2 спины обмениваются энергией между собой и теряют фазовую когерентность.',
            'Неверно: «FID затухает с T2». Верно: FID затухает с T2*, потому что действуют ещё и неоднородности поля.',
          ],
        },
        {
          type: 'exam',
          question: 'Объясни разницу между T2 и T2*. Какая формула их связывает?',
          answer: 'T2 это спин-спиновая, или поперечная, релаксация: из-за случайно флуктуирующих полей соседних спинов и обмена энергией между спинами фазовая когерентность необратимо теряется, поперечная намагниченность затухает как $M_{xy}(t) = M_0 e^{-t/T_2}$. T2* это полное время поперечного затухания, включающее ещё и статические неоднородности поля (доля T2′). Справедливо $1/T_2^* = 1/T_2 + 1/T_2^{\\prime}$, поэтому $T_2^* \\le T_2$. FID затухает с T2*.',
          full: 'Упомяни, что T2 чувствительно к подвижности воды и что долю T2′, в отличие от доли T2, можно отменить спиновым эхом.',
          sim: 'relaxation',
        },
      ],
    },
    {
      title: 'Спиновое эхо: бегуны разворачиваются по свистку',
      blocks: [
        {
          type: 'p',
          text: 'Если FID затухает с T2*, как тогда измерить настоящее T2? Идея гениально проста. Доля от неоднородностей поля **статическая**: спин, который сидит в месте с чуть более сильным полем, **всегда** немного слишком быстрый. Такую постоянную ошибку можно развернуть.',
        },
        {
          type: 'analogy',
          title: 'Свисток тренера',
          text: 'Бегуны стартуют вместе и разбегаются, быстрые впереди, медленные сзади. Через некоторое время тренер свистит, и все разворачиваются и бегут с **тем же темпом** обратно к линии старта. У быстрого самый длинный обратный путь. У медленного самый короткий. Итог: все приходят на линию старта **одновременно**. Не успевают только те бегуны, которые по дороге случайно устали и изменили темп. Эти уставшие бегуны и есть настоящая доля T2.',
        },
        {
          type: 'p',
          text: 'В МРТ свисток это **импульс 180°**. Его подают через время TE/2, и он зеркально отражает фазы всех спинов. Спины, которые были впереди, теперь сзади, но бегут дальше со своей обычной скоростью. Ещё через TE/2 они снова в фазе. Сигнал появляется ещё раз, это называется **спиновым эхом**. Время от импульса 90° до эха называется **временем эха TE**.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} &90^\\circ \\;\\xrightarrow{\\;TE/2\\;}\\; 180^\\circ \\;\\xrightarrow{\\;TE/2\\;}\\; \\text{эхо} \\\\ &S(TE) \\propto e^{-TE/T_2} \\end{aligned}',
          caption: 'амплитуда эха зависит уже только от T2',
        },
        {
          type: 'p',
          text: 'Эхо меньше сигнала сразу после импульса. Потеря происходит только из-за настоящего, случайного затухания T2. Статическая доля T2′ исключена. Если измерять эхо при разных TE, можно так пройти по кривой T2.',
        },
        {
          type: 'mnemonic',
          text: '**Импульс 180° возвращает только тех, кто остался верен своему темпу.** Статическая дефазировка (T2′) рефокусируется, случайная (T2) нет.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Импульс 180° отменяет релаксацию T2». Верно: он отменяет только статическую дефазировку из-за неоднородностей поля. Настоящее затухание T2 остаётся.',
            'Неверно: «Эхо такое же большое, как начальный сигнал». Верно: амплитуда эха меньше в $e^{-TE/T_2}$ раз.',
          ],
        },
        {
          type: 'exam',
          question: 'Для чего служит импульс 180° в последовательности спин-эхо?',
          answer: 'После импульса 90° спины дефазируются из-за T2 и из-за статических неоднородностей поля (вместе T2*). Импульс 180° в момент TE/2 зеркально отражает фазы. Поскольку статические отклонения частоты остаются прежними, спины снова сходятся и в момент TE опять в фазе: возникает эхо. Так статическая дефазировка (T2′) рефокусируется, а необратимое затухание T2 нет. Поэтому амплитуда эха пропорциональна $e^{-TE/T_2}$.',
          full: 'Используй образ вроде бегунов, разворачивающихся по свистку, и подчеркни, что эхо отражает T2, а не T2*.',
          sim: 'relaxation',
        },
      ],
    },
    {
      title: 'Как измерить T2 в спектре?',
      blocks: [
        {
          type: 'p',
          text: 'В конспекте есть маленький, но важный вопрос: **как измерить T2 в спектре?** Для этого нужно посмотреть на один и тот же сигнал двумя способами. Один раз как на кривую во времени, другой раз как на спектр по частоте. Обе картины содержат одну и ту же информацию, они связаны преобразованием Фурье.',
        },
        {
          type: 'analogy',
          title: 'Колокол и хлопок',
          text: 'Большой церковный колокол долго звучит. Ты слышишь очень чистый, ясный тон, то есть резкую частоту. Короткий хлопок, наоборот, сразу заканчивается, и у него нет ясной высоты, в нём много частот сразу. Правило за этим: **чем дольше длится сигнал, тем уже его частотная линия.** Чем быстрее он умирает, тем она шире.',
        },
        {
          type: 'p',
          text: 'Во временной области МР-сигнал это колебание с ларморовой частотой, амплитуда которого убывает экспоненциально. Если с помощью преобразования Фурье получить из него спектр, выйдет не бесконечно тонкая черта, а колоколообразная линия определённой ширины. Такая форма называется **лоренцевой линией**.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} s(t) &= e^{-t/T_2}\\, e^{i\\omega_0 t} \\quad (t \\ge 0) \\\\ &\\;\\big\\downarrow\\ \\text{Фурье} \\\\ \\operatorname{Re} S(f) &\\propto \\frac{T_2}{1 + \\big(2\\pi (f - f_0)\\, T_2\\big)^2} \\end{aligned}',
          caption: 'затухающий сигнал ↔ лоренцева линия при f₀',
        },
        {
          type: 'p',
          text: 'Для экзамена прежде всего нужна ширина. Её измеряют как **полную ширину на половине высоты (FWHM)**, то есть ширину линии на половине её высоты. Для лоренцевой линии (в действительной части спектра) справедливо:',
        },
        {
          type: 'formula',
          tex: '\\text{FWHM} = \\Delta f_{1/2} = \\frac{1}{\\pi\\, T_2}',
          caption: 'ширина на половине высоты в Гц',
        },
        {
          type: 'p',
          text: 'Пример: при $T_2 = 100$ мс линия шириной примерно $1/(\\pi \\cdot 0{,}1\\ \\text{с}) \\approx 3{,}2$ Гц. При $T_2 = 10$ мс уже около 32 Гц. Короткое T2 значит широкая линия, длинное T2 значит узкая линия. Как сказано в конспекте: отношение ширины к высоте кодирует T2.',
        },
        { type: 'figure', id: 'fid-spectrum', caption: 'Сверху FID звучит долго и даёт узкую высокую линию, снизу он быстро затухает, и линия становится широкой и плоской. Обрати внимание на жёлтую ширину на полувысоте: она равна $1/(\\pi T_2)$, то есть около 5 Гц при 60 мс и около 27 Гц при 12 мс.' },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'На самом деле это T2*',
          text: 'В конспекте написано T2. Но если просто измерить FID и преобразовать его, сигнал затухает с T2*. Тогда ширина линии равна $1/(\\pi T_2^*)$, то есть она шире, чем соответствует настоящему T2. Настоящую ширину по T2 получают, только если неоднородности поля исключены, например с помощью спинового эха.',
        },
        {
          type: 'mnemonic',
          text: '**Долгий колокол, узкая линия.** Экспоненциальное затухание в спектре превращается в лоренцеву линию с FWHM = 1/(πT2). Короткое T2 делает линию широкой.',
        },
        {
          type: 'exam',
          question: 'Какой признак сигнала нужно анализировать, чтобы получить T2-взвешенное изображение?',
          answer: 'Нужно анализировать **затухание поперечной намагниченности**, то есть насколько сильно сигнал уменьшился к времени эха TE. На практике измеряют амплитуду сигнала в момент TE, которая пропорциональна $e^{-TE/T_2}$. При длинном TE ткани с коротким T2 уже потеряли много сигнала, ткани с длинным T2 ещё мало. В спектре этому затуханию соответствует ширина линии: FWHM $= 1/(\\pi T_2)$.',
          full: 'Связать временную область (амплитуда при TE, постоянная затухания) и частотную (лоренцева линия, ширина) и упомянуть, что для чистого FID на самом деле измеряется T2*.',
          sim: 'signal/spectrum',
        },
      ],
    },
    {
      title: 'Взвешенность: выбираем контраст через TR и TE',
      blocks: [
        {
          type: 'p',
          text: 'Теперь всё сходится вместе. Изображение получается не из одного возбуждения. Измерение повторяют много раз. Для этого есть два времени, которые ты задаёшь:',
        },
        {
          type: 'list',
          items: [
            '**TR (время повторения):** время между двумя возбуждениями. Оно определяет, насколько успела восстановиться $M_z$, прежде чем её снова отклонят. TR управляет **влиянием T1**.',
            '**TE (время эха):** время от возбуждения до измерения эха. Оно определяет, сколько поперечной намагниченности успело затухнуть. TE управляет **влиянием T2**.',
          ],
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} S \\;\\propto\\;\\; &\\rho \\\\ \\cdot\\; &\\big(1 - e^{-TR/T_1}\\big) \\\\ \\cdot\\; &e^{-TE/T_2} \\end{aligned}',
          caption: 'сигнал спин-эхо (приближение для TR ≫ TE)',
        },
        {
          type: 'p',
          text: 'В формуле три множителя. $\\rho$ это **протонная плотность**, то есть сколько подвижных ядер водорода находится в вокселе. Средний множитель говорит, насколько $M_z$ восстановилась за время TR. Последний множитель говорит, сколько поперечного сигнала осталось к TE. Через TR и TE ты решаешь, какой множитель определит различия между тканями.',
        },
        {
          type: 'table',
          head: ['Взвешенность', 'TR/TE в конспекте', 'TR', 'TE'],
          rows: [
            ['PDw', '5500/14 мс', 'длинное', 'короткое'],
            ['T1w', '500/10 мс', 'короткое', 'короткое'],
            ['T2w', '5500/101 мс', 'длинное', 'длинное'],
          ],
        },
        {
          type: 'p',
          text: '**Длинное TR убирает различия по T1.** За 5500 мс почти все ткани успели восстановиться. Средний множитель тогда у всех примерно одинаков. **Короткое TE убирает различия по T2.** За 10 или 14 мс ни у одной ткани почти ничего не затухло, последний множитель везде близок к 1. Отсюда:',
        },
        {
          type: 'list',
          items: [
            '**PDw (длинное/короткое):** T1 и T2 оба «выключены». Остаётся протонная плотность $\\rho$. Изображение показывает, где много воды и жира.',
            '**T1w (короткое/короткое):** короткое TR значит, что восстановились только ткани с коротким T1. Посчитай: у жира $1 - e^{-500/260} \\approx 0{,}85$, у ликвора всего $1 - e^{-500/4000} \\approx 0{,}12$. **Жир светлый, ликвор тёмный.**',
            '**T2w (длинное/длинное):** длинное TE значит, что у тканей с коротким T2 уже много сигнала пропало. У белого вещества $e^{-101/80} \\approx 0{,}28$, у ликвора $e^{-101/2000} \\approx 0{,}95$. **Ликвор и вода светлые**, ткань мозга серее.',
          ],
        },
        { type: 'figure', id: 'weighting-map', caption: 'Читай карту так: длинное TR (справа) выключает влияние T1, длинное TE (вверху) включает влияние T2. Три точки это изображения из конспекта, а угол слева вверху с коротким TR и длинным TE почти не даёт сигнала.' },
        {
          type: 'callout',
          variant: 'klinik',
          title: 'Почему T2w нужны так часто',
          text: 'Многие болезни, например воспаления, отёки или опухоли, повышают долю свободной воды в ткани. Из-за этого T1 и T2 удлиняются. На T2w такие места ярко светятся, на T1w они скорее тёмные.',
        },
        {
          type: 'mnemonic',
          text: '**TR управляет T1, TE управляет T2. Длинное время стирает различие там, где оно не нужно.** На T2w вода белая («T2: вода светится»), на T1w жир светлый, ликвор тёмный.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Длинное TE делает изображение T1-взвешенным». Верно: TE управляет влиянием T2, TR влиянием T1.',
            'Неверно: «На T2w всё с длинным T2 тёмное, потому что дольше затухает». Верно: длинное T2 значит медленное затухание, значит, сигнала остаётся больше. Длинное T2 светлое.',
            'Неверно: «На T1w ткань с длинным T1 светлая». Верно: длинное T1 значит медленное восстановление, значит, мало $M_z$ к следующему импульсу. Длинное T1 на T1w тёмное.',
          ],
        },
        {
          type: 'exam',
          question: 'В конспекте три изображения с TR/TE = 5500/14 мс, 500/10 мс и 5500/101 мс. Сопоставь взвешенности и обоснуй. Как выглядят ликвор и жир?',
          answer: '5500/14 мс это изображение, взвешенное по протонной плотности (PDw): длинное TR убирает различия по T1, короткое TE различия по T2, остаётся протонная плотность. 500/10 мс это T1-взвешенное: короткое TR подчёркивает разное восстановление $M_z$, короткое TE подавляет T2. Жир (короткое T1) светлый, ликвор (длинное T1) тёмный. 5500/101 мс это T2-взвешенное: длинное TR подавляет T1, длинное TE даёт проявиться различиям по T2. Ликвор (длинное T2) светлый.',
          full: 'Назови уравнение сигнала $S \\propto \\rho(1 - e^{-TR/T_1})e^{-TE/T_2}$ и на числовом примере покажи, какой множитель доминирует.',
          sim: 'relaxation',
        },
      ],
    },
  ],
};
