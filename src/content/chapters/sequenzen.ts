import type { Chapter } from './types';

/**
 * Modul 7: Pulssequenzen. BONUS-Modul, im Skript nur über das Sequenzschema und die Gewichtungen (PD, T1, T2) vertreten.
 * Baut auf Modul 2 (Relaxation & Kontrast) auf.
 */
export const sequenzen: Chapter = {
  de: [
    {
      title: 'Der Bauplan: anregen, warten, zuhören, wiederholen',
      blocks: [
        {
          type: 'hook',
          text: 'Dieses Modul ist **Bonus-Praxiswissen**. Im Skript tauchen Sequenzen nur als Schema und über die drei Gewichtungen PD, T1 und T2 auf. Wenn du aber einmal an einem echten Gerät stehst, liest du Namen wie „TSE“, „FLAIR“ oder „EPI“ auf dem Bildschirm. Hier lernst du, was dahintersteckt. Alles baut auf **Relaxation und Gewichtung** auf: Wer T1, T2, TR und TE verstanden hat, versteht auch die Sequenzen.',
        },
        {
          type: 'p',
          text: 'Eine **Pulssequenz** ist das Kochrezept einer MRT-Messung. Sie legt fest, wann welcher HF-Puls kommt, wann welcher Gradient eingeschaltet wird und wann die Spule zuhört. Im Sequenzschema des Skripts stehen dafür mehrere Zeilen übereinander, wie Notenzeilen in einer Partitur:',
        },
        {
          type: 'list',
          items: [
            '**HF:** die Radiowellen-Pulse, die die Magnetisierung kippen (90°, 180° oder kleinere Winkel).',
            '**Schichtwahl-Gradient:** sorgt dafür, dass nur eine Schicht angeregt wird.',
            '**Phasenkodier-Gradient:** gibt jeder Zeile im Bild eine eigene Phase. Er ändert sich von Wiederholung zu Wiederholung.',
            '**Frequenzkodier- oder Auslesegradient:** gibt jeder Spalte eine eigene Frequenz, während das Signal gemessen wird.',
            '**Signal:** das Echo, das die Spule empfängt. Es füllt eine Zeile im k-Raum.',
          ],
        },
        {
          type: 'p',
          text: 'Zwei Zeiten bestimmen den Kontrast, und beide kennst du aus „Vom Signal zum Bild“. **TE** (Echozeit) ist die Zeit von der Anregung bis zur Mitte des Echos. Während TE zerfällt das Quersignal mit T2. **TR** (Repetitionszeit) ist die Zeit bis zur nächsten Anregung. Während TR erholt sich die Längsmagnetisierung mit T1. Weil ein Bild viele k-Raum-Zeilen braucht, wird dieser Ablauf sehr oft wiederholt, einmal pro Zeile.',
        },
        {
          type: 'analogy',
          title: 'Fragen im Chor stellen',
          text: 'Stell dir einen Chor vor, den du immer wieder dasselbe fragst. TR ist die Pause, die du dem Chor zum Luftholen lässt, bevor du wieder fragst. Wer schnell Luft holt (kurzes T1), ist bei kurzen Pausen trotzdem wieder laut. TE ist, wie lange du nach der Frage wartest, bis du hinhörst. Wer lange nachklingt (langes T2), ist auch bei spätem Hinhören noch zu hören.',
        },
        {
          type: 'table',
          head: ['Gewichtung', 'TR', 'TE', 'Beispiel im Skript'],
          rows: [
            ['PD', 'lang', 'kurz', '5500 / 14 ms'],
            ['T1', 'kurz', 'kurz', '500 / 10 ms'],
            ['T2', 'lang', 'lang', '5500 / 101 ms'],
          ],
        },
        {
          type: 'mnemonic',
          text: '**TR steuert T1, TE steuert T2.** Kurzes TR macht T1-Unterschiede sichtbar, langes TE macht T2-Unterschiede sichtbar. Beides kurz halten heißt: genau diesen Effekt ausschalten.',
        },
        {
          type: 'exam',
          question: 'Verständnisfrage: Welche Kombination aus TR und TE liefert ein T1-, ein T2- und ein PD-gewichtetes Bild, und warum?',
          answer: 'T1w: kurzes TR und kurzes TE. Bei kurzem TR haben sich Gewebe mit kurzem T1 schon stärker erholt und sind heller, das kurze TE hält T2-Einflüsse klein. T2w: langes TR und langes TE. Das lange TR gleicht T1-Unterschiede aus, bei langem TE ist das Signal von Geweben mit langem T2 noch groß. PD: langes TR und kurzes TE. Beide Relaxationseinflüsse sind klein, übrig bleibt die Protonendichte.',
          full: 'Nenne die Werte aus dem Skript (500/10, 5500/101, 5500/14 ms) und die Definitionen von TR und TE.',
          sim: 'sequence',
        },
      ],
    },
    {
      title: 'Spin-Echo: Der 180°-Puls holt die Läufer zurück',
      blocks: [
        {
          type: 'p',
          text: 'Nach einem 90°-Puls zerfällt das Signal schneller, als T2 allein es erklären würde. Der Grund: Das Magnetfeld ist nie perfekt gleichmäßig. Protonen an Stellen mit etwas stärkerem Feld präzedieren etwas schneller, andere etwas langsamer. Sie laufen auseinander, und das Signal verschwindet mit der kürzeren Zeitkonstante **T2***. Ein Teil dieses Auseinanderlaufens ist aber kein echter Verlust, sondern nur Unordnung, die man rückgängig machen kann.',
        },
        {
          type: 'analogy',
          title: 'Läufer im Stadion drehen auf Pfiff um',
          text: 'Alle Läufer starten gleichzeitig an der Startlinie, aber jeder läuft unterschiedlich schnell. Nach einer Weile sind sie über die ganze Bahn verteilt. Jetzt ertönt ein Pfiff, und alle drehen um und laufen gleich schnell zurück. Die Schnellen, die am weitesten weg waren, haben den längsten Rückweg, aber sie sind ja auch schneller. Ergebnis: Alle kommen **gleichzeitig** an der Startlinie an. Der Pfiff ist der 180°-Puls, das gemeinsame Ankommen ist das **Echo**.',
        },
        {
          type: 'p',
          text: 'Der Ablauf heißt deshalb **90° → Wartezeit TE/2 → 180° → Wartezeit TE/2 → Echo**. Der 180°-Puls dreht die auseinandergelaufenen Spins so um, dass die schnelleren hinten liegen und die langsamen einholen. Genau nach der Zeit TE sind sie wieder beisammen. Was das Spin-Echo **nicht** zurückholen kann, ist der echte T2-Zerfall durch zufällige Wechselwirkungen zwischen den Spins. Deshalb misst ein Spin-Echo echtes T2, nicht T2*.',
        },
        {
          type: 'formula',
          tex: 'S_{\\text{SE}} \\approx \\rho\\,\\big(1 - e^{-TR/T_1}\\big)\\,e^{-TE/T_2}',
          caption: 'ρ: Protonendichte, erster Faktor: T1-Erholung in TR, zweiter Faktor: T2-Zerfall bis TE',
        },
        {
          type: 'p',
          text: 'An dieser Formel siehst du die Gewichtungen direkt. Ist TR sehr lang, wird der erste Faktor fast 1, T1 spielt keine Rolle mehr. Ist TE sehr kurz, wird der zweite Faktor fast 1, T2 spielt keine Rolle mehr. Der Haken am klassischen Spin-Echo: Pro TR wird nur **eine** k-Raum-Zeile gemessen. Die Messzeit ist deshalb:',
        },
        {
          type: 'formula',
          tex: 'TA = TR \\cdot N_y \\cdot NEX',
          caption: 'N_y: Anzahl Phasenkodier-Zeilen, NEX: Anzahl Mittelungen',
        },
        {
          type: 'p',
          text: 'Rechne ein T2-Bild mit TR = 5500 ms und 256 Zeilen: 5,5 s · 256 ≈ 1400 s, also über 23 Minuten für ein einziges Bild. Viel zu lang für Patienten. Das ist der Grund, warum man schnellere Varianten erfunden hat.',
        },
        {
          type: 'mnemonic',
          text: '**Umdrehen und gemeinsam ankommen.** Der 180°-Puls hebt das Auseinanderlaufen durch Feldinhomogenität auf. Übrig bleibt der echte T2-Zerfall. Präzise, aber langsam: eine Zeile pro TR.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Das Spin-Echo macht den ganzen Signalzerfall rückgängig.“ Richtig: Es hebt nur den Anteil durch feste Feldunterschiede auf. Der echte T2-Zerfall bleibt.',
            'Falsch: „TE ist die Zeit bis zum 180°-Puls.“ Richtig: Der 180°-Puls kommt bei TE/2, das Echo bei TE.',
          ],
        },
        {
          type: 'exam',
          question: 'Verständnisfrage: Warum misst ein Spin-Echo T2 und nicht T2*?',
          answer: 'Nach der Anregung laufen die Spins durch zeitlich konstante Feldinhomogenitäten auseinander, das Signal zerfällt mit T2*. Der 180°-Puls bei TE/2 kehrt die Phasenlage um, sodass schnellere Spins die langsameren einholen. Bei TE sind alle wieder in Phase, der Anteil durch feste Inhomogenitäten ist aufgehoben. Nicht umkehrbar ist der zufällige Spin-Spin-Zerfall, deshalb nimmt die Echohöhe mit T2 ab.',
          full: 'Erwähne den Ablauf 90° → TE/2 → 180° → TE/2 → Echo und die Signalformel $S \\approx \\rho(1-e^{-TR/T_1})e^{-TE/T_2}$.',
          sim: 'sequence',
        },
      ],
    },
    {
      title: 'Turbo-Spin-Echo: viele Echos aus einer Anregung',
      blocks: [
        {
          type: 'p',
          text: 'Die Idee ist einfach: Wenn ein 180°-Puls ein Echo erzeugt, dann erzeugt ein zweiter 180°-Puls ein zweites Echo, ein dritter ein drittes, und so weiter. Statt nach dem ersten Echo zu warten, sammelt man eine ganze Kette von Echos, den **Echozug**. Jedes Echo bekommt eine andere Phasenkodierung und füllt deshalb eine **andere k-Raum-Zeile**.',
        },
        {
          type: 'p',
          text: 'Die Zahl der Echos pro Anregung heißt **ETL** (echo train length) oder Turbofaktor. Die Messzeit sinkt um genau diesen Faktor:',
        },
        {
          type: 'formula',
          tex: 'TA_{\\text{TSE}} = \\frac{TR \\cdot N_y \\cdot NEX}{ETL}',
          caption: 'mit ETL = 16 wird aus 23 Minuten etwa anderthalb Minuten',
        },
        {
          type: 'p',
          text: 'Aber welches TE hat das Bild jetzt, wenn jedes Echo eine andere Echozeit hat? Hier kommt der k-Raum ins Spiel: Die Mitte des k-Raums bestimmt den Kontrast, die Ränder bestimmen die feinen Details. Deshalb zählt das Echo, das in die k-Raum-Mitte einsortiert wird. Seine Echozeit nennt man **effektives TE**. Legt man ein spätes Echo in die Mitte, wird das Bild T2-gewichtet.',
        },
        {
          type: 'list',
          items: [
            '**Vorteil:** T2-Bilder in wenigen Minuten. TSE ist heute die Standardsequenz für T2- und PD-Bilder.',
            '**Nachteil 1:** Viele 180°-Pulse bedeuten viel HF-Energie im Körper, also eine höhere spezifische Absorptionsrate (SAR).',
            '**Nachteil 2:** Die späten Echos sind schwächer. Liegen sie am Rand des k-Raums, gehen feine Details etwas verloren, das Bild wird leicht unscharf.',
            '**Auffällig:** Fett ist im TSE-Bild heller als im klassischen Spin-Echo.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Ein Schuss, viele Echos, viele Zeilen.** Der Turbofaktor teilt die Messzeit. Das Echo in der k-Raum-Mitte bestimmt den Kontrast.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Im TSE hat jedes Bild viele verschiedene Kontraste.“ Richtig: Den Kontrast bestimmt das effektive TE, also das Echo in der k-Raum-Mitte.',
          ],
        },
      ],
    },
    {
      title: 'Inversion Recovery: ein Gewebe gezielt stummschalten',
      blocks: [
        {
          type: 'p',
          text: 'Manchmal stört ein Gewebe, weil es zu hell ist. Fett überstrahlt Entzündungen, Hirnwasser überstrahlt kleine Veränderungen am Rand der Hirnkammern. Die **Inversion Recovery** (IR) schaltet so ein Gewebe gezielt aus.',
        },
        {
          type: 'p',
          text: 'Der Trick: Vor der eigentlichen Messung kommt ein **180°-Puls**. Er dreht die Längsmagnetisierung um, sie zeigt jetzt nach unten ($M_z = -M_0$). Danach erholt sie sich mit T1 wieder nach oben, und auf dem Weg von $-M_0$ nach $+M_0$ geht sie irgendwann **durch null**. Wer genau in diesem Moment misst, bekommt von diesem Gewebe kein Signal. Die Wartezeit nach dem Inversionspuls heißt **Inversionszeit TI**.',
        },
        {
          type: 'analogy',
          title: 'Das Pendel im tiefsten Punkt fotografieren',
          text: 'Stell dir vor, du lässt ein Pendel von ganz links los und machst genau dann ein Foto, wenn es durch die Mitte schwingt. Jedes Pendel hat seine eigene Geschwindigkeit, deshalb erwischst du mit einem bestimmten Zeitpunkt immer nur ein bestimmtes Pendel in der Mitte. Bei der IR ist jedes Gewebe ein Pendel mit eigenem T1, und TI ist der Moment des Fotos.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} M_z(TI) &= M_0\\big(1 - 2\\,e^{-TI/T_1}\\big) \\\\ M_z = 0 \\;&\\Rightarrow\\; TI_{\\text{null}} = T_1 \\ln 2 \\approx 0{,}69\\,T_1 \\end{aligned}',
          caption: 'gilt näherungsweise für sehr langes TR',
        },
        {
          type: 'p',
          text: 'Weil Fett ein kurzes und Liquor ein sehr langes T1 hat, liegen ihre Nullpunkte weit auseinander. Daraus entstehen zwei bekannte Varianten:',
        },
        {
          type: 'table',
          head: ['Variante', 'Was wird stumm?', 'TI bei 1,5 T', 'Typischer Einsatz'],
          rows: [
            ['STIR', 'Fett (kurzes T1)', 'etwa 150 bis 180 ms', 'Ödeme in Knochen und Weichteilen'],
            ['FLAIR', 'Liquor (langes T1)', 'etwa 2000 bis 2500 ms', 'Veränderungen nahe den Hirnkammern'],
          ],
        },
        {
          type: 'p',
          text: 'Eine FLAIR-Aufnahme sieht deshalb aus wie ein T2-Bild, nur dass das Hirnwasser dunkel ist. So fallen helle Veränderungen im Gewebe direkt daneben viel besser auf. Das ist eine schöne Brücke zu den Gehirnbildern im Modul Anwendungen.',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'STIR nicht nach Kontrastmittel',
          text: 'STIR löscht alles, was ungefähr das T1 von Fett hat. Gadolinium verkürzt aber T1. Ein Gewebe, das Kontrastmittel aufgenommen hat, kann dadurch zufällig genau im Nullpunkt landen und verschwinden, statt hell zu werden.',
        },
        {
          type: 'mnemonic',
          text: '**Umdrehen, warten, im Nulldurchgang messen.** TI ≈ 0,69 · T1 des Gewebes, das stumm sein soll. Kurzes TI löscht Fett (STIR), langes TI löscht Liquor (FLAIR).',
        },
        {
          type: 'exam',
          question: 'Verständnisfrage: Wie unterdrückt eine FLAIR-Sequenz das Signal des Liquors?',
          answer: 'Ein 180°-Inversionspuls dreht die Längsmagnetisierung um. Sie erholt sich danach mit T1 und geht dabei durch null. Die Inversionszeit TI wird so gewählt, dass der Liquor mit seinem sehr langen T1 genau zum Zeitpunkt der Anregung bei $M_z = 0$ steht ($TI \\approx T_1 \\ln 2$, in der Praxis etwa 2000 bis 2500 ms bei 1,5 T). Der Liquor liefert dann kein Signal, das übrige Bild ist T2-gewichtet.',
          full: 'Stelle den Unterschied zu STIR dar (kurzes TI, Fett wird stumm) und nenne die Formel $M_z(TI) = M_0(1-2e^{-TI/T_1})$.',
          sim: 'sequence',
        },
      ],
    },
    {
      title: 'Gradientenecho und EPI: schnell, schneller, ein Schuss',
      blocks: [
        {
          type: 'p',
          text: 'Das **Gradientenecho** (GRE) verzichtet ganz auf den 180°-Puls. Das Echo entsteht stattdessen mit dem Auslesegradienten: Er wird erst in die eine Richtung geschaltet, damit die Spins auseinanderlaufen, und dann umgepolt, damit sie wieder zusammenlaufen. Das geht sehr schnell. Außerdem kippt man oft nicht um 90°, sondern nur um einen **kleinen Flipwinkel** α, zum Beispiel 10° bis 30°. Dann bleibt viel Längsmagnetisierung übrig, und man kann sofort wieder anregen. TR kann dadurch sehr kurz werden, wenige Millisekunden.',
        },
        {
          type: 'analogy',
          title: 'Ein Radiergummi, der nur Bleistift entfernt',
          text: 'Der Gradient kann nur die Unordnung rückgängig machen, die er selbst gemacht hat, so wie ein Radiergummi nur deinen eigenen Bleistiftstrich entfernt. Die Unordnung durch Feldinhomogenitäten im Gewebe ist wie Kugelschreiber: Die bleibt. Deshalb ist das GRE-Signal **T2*-gewichtet**, nicht T2-gewichtet.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} S_{\\text{GRE}} &= \\rho\\,\\sin\\alpha\\,\\frac{1 - E_1}{1 - \\cos\\alpha\\,E_1}\\,e^{-TE/T_2^*} \\\\ E_1 &= e^{-TR/T_1} \\end{aligned}',
          caption: 'gespoiltes GRE: α ist der Flipwinkel',
        },
        {
          type: 'p',
          text: 'Du musst diese Formel nicht auswendig können. Lies sie so: Der Bruch mit $E_1$ beschreibt, wie viel Längsmagnetisierung sich bei kurzem TR und Flipwinkel α erholt. Er erzeugt die T1-Gewichtung. Der Faktor $e^{-TE/T_2^*}$ beschreibt den Zerfall bis zum Echo, mit T2* statt T2. Großer Flipwinkel und kurzes TR ergeben ein T1-Bild, kleiner Flipwinkel und längeres TE ein T2*-Bild.',
        },
        {
          type: 'list',
          items: [
            '**Vorteil:** sehr schnell, ideal für 3D-Aufnahmen, Bilder mit angehaltenem Atem und Herzbilder in Bewegung.',
            '**Nachteil:** empfindlich für alles, was das Feld stört: Luft-Gewebe-Grenzen, Metall, Blutabbauprodukte. Diese Empfindlichkeit kann man aber auch gezielt nutzen, etwa um kleine Blutungen zu finden.',
          ],
        },
        {
          type: 'p',
          text: '**EPI (Echo Planar Imaging)** ist die Extremform. Nach **einer einzigen** Anregung wird der Auslesegradient schnell hin und her geschaltet, sodass ein Echo nach dem anderen entsteht. Zwischen den Echos rückt ein kurzer Phasen-Puls („Blip“) eine Zeile im k-Raum weiter. So wird der ganze k-Raum im Zickzack in etwa 50 bis 100 ms gefüllt, ein ganzes Bild aus einem Schuss. Genau diese Geschwindigkeit braucht man für die **Diffusionsbildgebung** und die **fMRI** aus dem Modul Anwendungen. Der Preis: Weil das Auslesen so lange dauert, wirken sich Feldstörungen stark aus. EPI-Bilder sind an Luft-Gewebe-Grenzen oft verzerrt.',
        },
        {
          type: 'mnemonic',
          text: '**Gradient statt 180°, deshalb T2* statt T2.** GRE ist schnell und feldempfindlich. EPI füllt den ganzen k-Raum nach einer Anregung und ist die Basis für DWI und fMRI.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Ein Gradientenecho hebt Feldinhomogenitäten auf wie das Spin-Echo.“ Richtig: Es kehrt nur die Dephasierung durch den eigenen Gradienten um, deshalb bleibt T2*.',
            'Falsch: „EPI ist eine eigene Kontrastart.“ Richtig: EPI ist eine Ausleseart. Der Kontrast kommt von dem, was davor geschaltet ist, zum Beispiel Diffusionsgradienten.',
          ],
        },
        {
          type: 'exam',
          question: 'Verständnisfrage: Worin unterscheiden sich Spin-Echo und Gradientenecho, und welche Folge hat das für den Kontrast?',
          answer: 'Beim Spin-Echo erzeugt ein 180°-Puls das Echo und hebt die Dephasierung durch konstante Feldinhomogenitäten auf, der Kontrast hängt von T2 ab. Beim Gradientenecho entsteht das Echo durch Umpolen des Auslesegradienten. Es kehrt nur die Dephasierung durch diesen Gradienten um, Inhomogenitäten bleiben wirksam, der Kontrast hängt von T2* ab. GRE erlaubt kleine Flipwinkel und sehr kurze TR und ist daher viel schneller, aber empfindlicher für Suszeptibilitätsartefakte.',
          full: 'Nenne EPI als schnellste Variante (ganzer k-Raum nach einer Anregung) und ihre Anwendungen DWI und fMRI.',
          sim: 'sequence',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'Схема: возбудить, подождать, послушать, повторить',
      blocks: [
        {
          type: 'hook',
          text: 'Этот модуль это **бонусные практические знания**. В конспекте последовательности встречаются только в виде схемы и через три взвешивания: PD, T1 и T2. Но если ты окажешься у настоящего томографа, на экране будут названия вроде «TSE», «FLAIR» или «EPI». Здесь ты узнаешь, что за ними стоит. Всё строится на **релаксации и взвешивании**: кто понял T1, T2, TR и TE, тот поймёт и последовательности.',
        },
        {
          type: 'p',
          text: '**Импульсная последовательность** это рецепт МРТ-измерения. Она определяет, когда идёт какой РЧ-импульс, когда включается какой градиент и когда катушка слушает. На схеме последовательности в конспекте для этого друг под другом идут несколько строк, как нотные строки в партитуре:',
        },
        {
          type: 'list',
          items: [
            '**РЧ:** радиоимпульсы, которые отклоняют намагниченность (90°, 180° или меньшие углы).',
            '**Градиент выбора среза:** обеспечивает возбуждение только одного среза.',
            '**Градиент фазового кодирования:** даёт каждой строке изображения свою фазу. Он меняется от повторения к повторению.',
            '**Градиент частотного кодирования или считывания:** даёт каждому столбцу свою частоту, пока измеряется сигнал.',
            '**Сигнал:** эхо, которое принимает катушка. Оно заполняет одну строку k-пространства.',
          ],
        },
        {
          type: 'p',
          text: 'Два времени определяют контраст, и оба ты знаешь из главы «От сигнала к изображению». **TE** (время эха) это время от возбуждения до середины эха. За TE поперечный сигнал затухает с T2. **TR** (время повторения) это время до следующего возбуждения. За TR продольная намагниченность восстанавливается с T1. Поскольку изображению нужно много строк k-пространства, этот цикл повторяется очень часто, один раз на строку.',
        },
        {
          type: 'analogy',
          title: 'Задавать вопросы хору',
          text: 'Представь хор, которому ты снова и снова задаёшь один и тот же вопрос. TR это пауза, которую ты даёшь хору набрать воздуха, прежде чем спросить снова. Кто быстро набирает воздух (короткое T1), при коротких паузах всё равно снова звучит громко. TE это сколько ты ждёшь после вопроса, прежде чем прислушаться. Кто долго звучит (длинное T2), слышен и при позднем прислушивании.',
        },
        {
          type: 'table',
          head: ['Взвешивание', 'TR', 'TE', 'Пример из конспекта'],
          rows: [
            ['PD', 'длинное', 'короткое', '5500 / 14 мс'],
            ['T1', 'короткое', 'короткое', '500 / 10 мс'],
            ['T2', 'длинное', 'длинное', '5500 / 101 мс'],
          ],
        },
        {
          type: 'mnemonic',
          text: '**TR управляет T1, TE управляет T2.** Короткое TR делает видимыми различия T1, длинное TE делает видимыми различия T2. Держать время коротким значит выключить именно этот эффект.',
        },
        {
          type: 'exam',
          question: 'Вопрос на понимание: какая комбинация TR и TE даёт T1-, T2- и PD-взвешенное изображение и почему?',
          answer: 'T1w: короткое TR и короткое TE. При коротком TR ткани с коротким T1 восстановились сильнее и ярче, короткое TE держит влияние T2 малым. T2w: длинное TR и длинное TE. Длинное TR выравнивает различия T1, при длинном TE сигнал тканей с длинным T2 ещё велик. PD: длинное TR и короткое TE. Оба релаксационных влияния малы, остаётся протонная плотность.',
          full: 'Назови значения из конспекта (500/10, 5500/101, 5500/14 мс) и определения TR и TE.',
          sim: 'sequence',
        },
      ],
    },
    {
      title: 'Спин-эхо: импульс 180° возвращает бегунов',
      blocks: [
        {
          type: 'p',
          text: 'После импульса 90° сигнал затухает быстрее, чем объясняет одно T2. Причина: магнитное поле никогда не бывает идеально однородным. Протоны там, где поле чуть сильнее, прецессируют чуть быстрее, другие чуть медленнее. Они разбегаются, и сигнал исчезает с более короткой постоянной времени **T2***. Но часть этого разбегания не настоящая потеря, а лишь беспорядок, который можно отменить.',
        },
        {
          type: 'analogy',
          title: 'Бегуны на стадионе разворачиваются по свистку',
          text: 'Все бегуны стартуют одновременно со стартовой линии, но каждый бежит со своей скоростью. Через некоторое время они распределены по всей дорожке. Звучит свисток, и все разворачиваются и бегут обратно с той же скоростью. Быстрые, убежавшие дальше всех, имеют самый длинный обратный путь, но они ведь и быстрее. Итог: все приходят на стартовую линию **одновременно**. Свисток это импульс 180°, общий финиш это **эхо**.',
        },
        {
          type: 'p',
          text: 'Поэтому схема такая: **90° → ожидание TE/2 → 180° → ожидание TE/2 → эхо**. Импульс 180° переворачивает разбежавшиеся спины так, что быстрые оказываются сзади и догоняют медленных. Ровно через время TE они снова вместе. Чего спин-эхо **не** может вернуть, так это настоящее затухание T2 из-за случайных взаимодействий между спинами. Поэтому спин-эхо измеряет настоящее T2, а не T2*.',
        },
        {
          type: 'formula',
          tex: 'S_{\\text{SE}} \\approx \\rho\\,\\big(1 - e^{-TR/T_1}\\big)\\,e^{-TE/T_2}',
          caption: 'ρ: протонная плотность, первый множитель: восстановление T1 за TR, второй: затухание T2 до TE',
        },
        {
          type: 'p',
          text: 'В этой формуле прямо видны взвешивания. Если TR очень длинное, первый множитель почти 1, и T1 уже не играет роли. Если TE очень короткое, второй множитель почти 1, и T2 не играет роли. Недостаток классического спин-эхо: за один TR измеряется только **одна** строка k-пространства. Поэтому время измерения:',
        },
        {
          type: 'formula',
          tex: 'TA = TR \\cdot N_y \\cdot NEX',
          caption: 'N_y: число строк фазового кодирования, NEX: число усреднений',
        },
        {
          type: 'p',
          text: 'Посчитай T2-изображение с TR = 5500 мс и 256 строками: 5,5 с · 256 ≈ 1400 с, то есть больше 23 минут на одно изображение. Для пациента слишком долго. Именно поэтому придумали более быстрые варианты.',
        },
        {
          type: 'mnemonic',
          text: '**Развернуться и прийти вместе.** Импульс 180° отменяет разбегание из-за неоднородности поля. Остаётся настоящее затухание T2. Точно, но медленно: одна строка за TR.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Спин-эхо отменяет всё затухание сигнала». Верно: оно отменяет только долю из-за постоянных различий поля. Настоящее затухание T2 остаётся.',
            'Неверно: «TE это время до импульса 180°». Верно: импульс 180° идёт в момент TE/2, эхо в момент TE.',
          ],
        },
        {
          type: 'exam',
          question: 'Вопрос на понимание: почему спин-эхо измеряет T2, а не T2*?',
          answer: 'После возбуждения спины разбегаются из-за постоянных во времени неоднородностей поля, сигнал затухает с T2*. Импульс 180° в момент TE/2 переворачивает фазы так, что быстрые спины догоняют медленные. В момент TE все снова в фазе, доля от постоянных неоднородностей отменена. Необратимо случайное спин-спиновое затухание, поэтому высота эха уменьшается с T2.',
          full: 'Упомяни схему 90° → TE/2 → 180° → TE/2 → эхо и формулу сигнала $S \\approx \\rho(1-e^{-TR/T_1})e^{-TE/T_2}$.',
          sim: 'sequence',
        },
      ],
    },
    {
      title: 'Турбо-спин-эхо: много эхо от одного возбуждения',
      blocks: [
        {
          type: 'p',
          text: 'Идея простая: если один импульс 180° создаёт эхо, то второй импульс 180° создаёт второе эхо, третий третье и так далее. Вместо того чтобы ждать после первого эха, собирают целую цепочку эхо, **эхо-цепочку**. Каждое эхо получает другое фазовое кодирование и поэтому заполняет **другую строку k-пространства**.',
        },
        {
          type: 'p',
          text: 'Число эхо на одно возбуждение называют **ETL** (echo train length) или турбо-фактором. Время измерения уменьшается ровно в это число раз:',
        },
        {
          type: 'formula',
          tex: 'TA_{\\text{TSE}} = \\frac{TR \\cdot N_y \\cdot NEX}{ETL}',
          caption: 'при ETL = 16 из 23 минут получается примерно полторы минуты',
        },
        {
          type: 'p',
          text: 'Но какое TE у изображения, если у каждого эха своё время? Здесь вступает k-пространство: центр k-пространства определяет контраст, края определяют мелкие детали. Поэтому важно эхо, которое помещено в центр k-пространства. Его время эха называют **эффективным TE**. Если в центр положить позднее эхо, изображение будет T2-взвешенным.',
        },
        {
          type: 'list',
          items: [
            '**Преимущество:** T2-изображения за несколько минут. TSE сегодня стандартная последовательность для T2 и PD.',
            '**Недостаток 1:** много импульсов 180° означает много РЧ-энергии в теле, то есть более высокий удельный коэффициент поглощения (SAR).',
            '**Недостаток 2:** поздние эхо слабее. Если они лежат на краю k-пространства, мелкие детали немного теряются, изображение слегка размыто.',
            '**Заметно:** жир на TSE ярче, чем на классическом спин-эхо.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Один выстрел, много эхо, много строк.** Турбо-фактор делит время измерения. Эхо в центре k-пространства определяет контраст.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «На TSE в одном изображении много разных контрастов». Верно: контраст определяет эффективное TE, то есть эхо в центре k-пространства.',
          ],
        },
      ],
    },
    {
      title: 'Инверсия-восстановление: целенаправленно заглушить ткань',
      blocks: [
        {
          type: 'p',
          text: 'Иногда ткань мешает, потому что слишком яркая. Жир перекрывает воспаление, ликвор перекрывает мелкие изменения у края желудочков мозга. **Инверсия-восстановление** (IR) целенаправленно выключает такую ткань.',
        },
        {
          type: 'p',
          text: 'Приём такой: перед собственно измерением идёт **импульс 180°**. Он переворачивает продольную намагниченность, теперь она смотрит вниз ($M_z = -M_0$). Затем она с T1 восстанавливается вверх и на пути от $-M_0$ к $+M_0$ в какой-то момент **проходит через ноль**. Кто измеряет точно в этот момент, не получает от этой ткани сигнала. Время ожидания после инвертирующего импульса называется **временем инверсии TI**.',
        },
        {
          type: 'analogy',
          title: 'Сфотографировать маятник в нижней точке',
          text: 'Представь, что ты отпускаешь маятник из крайнего левого положения и делаешь снимок ровно тогда, когда он проходит середину. У каждого маятника своя скорость, поэтому в выбранный момент в середине окажется только определённый маятник. В IR каждая ткань это маятник со своим T1, а TI это момент снимка.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} M_z(TI) &= M_0\\big(1 - 2\\,e^{-TI/T_1}\\big) \\\\ M_z = 0 \\;&\\Rightarrow\\; TI_{\\text{нуль}} = T_1 \\ln 2 \\approx 0{,}69\\,T_1 \\end{aligned}',
          caption: 'приближённо верно при очень длинном TR',
        },
        {
          type: 'p',
          text: 'У жира короткое T1, у ликвора очень длинное, поэтому их нулевые точки далеко друг от друга. Отсюда два известных варианта:',
        },
        {
          type: 'table',
          head: ['Вариант', 'Что заглушается?', 'TI при 1,5 Тл', 'Типичное применение'],
          rows: [
            ['STIR', 'жир (короткое T1)', 'примерно от 150 до 180 мс', 'отёки в кости и мягких тканях'],
            ['FLAIR', 'ликвор (длинное T1)', 'примерно от 2000 до 2500 мс', 'изменения рядом с желудочками мозга'],
          ],
        },
        {
          type: 'p',
          text: 'Поэтому FLAIR выглядит как T2-изображение, только ликвор тёмный. Так яркие изменения в ткани прямо рядом заметны гораздо лучше. Это хороший мост к изображениям мозга в модуле «Применение».',
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'STIR не после контраста',
          text: 'STIR гасит всё, у чего T1 примерно как у жира. А гадолиний укорачивает T1. Ткань, накопившая контраст, может случайно попасть точно в нулевую точку и исчезнуть вместо того, чтобы стать яркой.',
        },
        {
          type: 'mnemonic',
          text: '**Перевернуть, подождать, измерить в нуле.** TI ≈ 0,69 · T1 той ткани, которую нужно заглушить. Короткое TI гасит жир (STIR), длинное TI гасит ликвор (FLAIR).',
        },
        {
          type: 'exam',
          question: 'Вопрос на понимание: как последовательность FLAIR подавляет сигнал ликвора?',
          answer: 'Инвертирующий импульс 180° переворачивает продольную намагниченность. Затем она восстанавливается с T1 и при этом проходит через ноль. Время инверсии TI выбирают так, чтобы ликвор с его очень длинным T1 в момент возбуждения был ровно при $M_z = 0$ ($TI \\approx T_1 \\ln 2$, на практике примерно от 2000 до 2500 мс при 1,5 Тл). Тогда ликвор не даёт сигнала, остальное изображение T2-взвешенное.',
          full: 'Покажи отличие от STIR (короткое TI, заглушается жир) и назови формулу $M_z(TI) = M_0(1-2e^{-TI/T_1})$.',
          sim: 'sequence',
        },
      ],
    },
    {
      title: 'Градиентное эхо и EPI: быстро, быстрее, один выстрел',
      blocks: [
        {
          type: 'p',
          text: '**Градиентное эхо** (GRE) совсем обходится без импульса 180°. Эхо создаётся градиентом считывания: сначала его включают в одну сторону, чтобы спины разбежались, а потом меняют полярность, чтобы они снова сошлись. Это очень быстро. Кроме того, часто отклоняют не на 90°, а лишь на **малый угол** α, например от 10° до 30°. Тогда остаётся много продольной намагниченности, и можно сразу снова возбуждать. Поэтому TR может быть очень коротким, несколько миллисекунд.',
        },
        {
          type: 'analogy',
          title: 'Ластик, который стирает только карандаш',
          text: 'Градиент может отменить только тот беспорядок, который сам создал, как ластик стирает только твою собственную карандашную линию. Беспорядок от неоднородностей поля в ткани похож на шариковую ручку: он остаётся. Поэтому сигнал GRE **T2*-взвешенный**, а не T2-взвешенный.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} S_{\\text{GRE}} &= \\rho\\,\\sin\\alpha\\,\\frac{1 - E_1}{1 - \\cos\\alpha\\,E_1}\\,e^{-TE/T_2^*} \\\\ E_1 &= e^{-TR/T_1} \\end{aligned}',
          caption: 'GRE со спойлером: α это угол отклонения',
        },
        {
          type: 'p',
          text: 'Эту формулу не нужно знать наизусть. Читай её так: дробь с $E_1$ описывает, сколько продольной намагниченности восстанавливается при коротком TR и угле α. Она создаёт T1-взвешивание. Множитель $e^{-TE/T_2^*}$ описывает затухание до эха, с T2* вместо T2. Большой угол и короткое TR дают T1-изображение, малый угол и более длинное TE дают T2*-изображение.',
        },
        {
          type: 'list',
          items: [
            '**Преимущество:** очень быстро, идеально для 3D-съёмки, изображений на задержке дыхания и изображений движущегося сердца.',
            '**Недостаток:** чувствительно ко всему, что искажает поле: границы воздух/ткань, металл, продукты распада крови. Но эту чувствительность можно использовать и намеренно, например чтобы найти мелкие кровоизлияния.',
          ],
        },
        {
          type: 'p',
          text: '**EPI (Echo Planar Imaging)** это предельный вариант. После **одного-единственного** возбуждения градиент считывания быстро переключают туда и обратно, так что возникает эхо за эхом. Между эхо короткий фазовый импульс («блип») сдвигает на одну строку в k-пространстве. Так всё k-пространство зигзагом заполняется за время примерно от 50 до 100 мс, целое изображение за один выстрел. Именно такая скорость нужна для **диффузионной визуализации** и **фМРТ** из модуля «Применение». Цена: поскольку считывание длится долго, искажения поля сильно сказываются. Изображения EPI у границ воздух/ткань часто искажены.',
        },
        {
          type: 'mnemonic',
          text: '**Градиент вместо 180°, поэтому T2* вместо T2.** GRE быстрое и чувствительное к полю. EPI заполняет всё k-пространство после одного возбуждения и лежит в основе DWI и фМРТ.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Градиентное эхо отменяет неоднородности поля, как спин-эхо». Верно: оно обращает только дефазировку собственным градиентом, поэтому остаётся T2*.',
            'Неверно: «EPI это отдельный вид контраста». Верно: EPI это способ считывания. Контраст даёт то, что включено перед ним, например диффузионные градиенты.',
          ],
        },
        {
          type: 'exam',
          question: 'Вопрос на понимание: чем различаются спин-эхо и градиентное эхо и какое это имеет следствие для контраста?',
          answer: 'В спин-эхо эхо создаёт импульс 180° и отменяет дефазировку от постоянных неоднородностей поля, контраст зависит от T2. В градиентном эхо эхо возникает при смене полярности градиента считывания. Он обращает только дефазировку этим градиентом, неоднородности продолжают действовать, контраст зависит от T2*. GRE позволяет малые углы отклонения и очень короткие TR и поэтому намного быстрее, но чувствительнее к артефактам магнитной восприимчивости.',
          full: 'Назови EPI как самый быстрый вариант (всё k-пространство после одного возбуждения) и его применения: DWI и фМРТ.',
          sim: 'sequence',
        },
      ],
    },
  ],
};
