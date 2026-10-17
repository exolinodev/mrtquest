import type { Chapter } from './types';

/**
 * Modul 1: Kernspin & Resonanz. Referenzkapitel für das Erklärformat.
 * Inhaltliche Grundlage: MBR-Skript „Magnetic Resonance Imaging“, Abschnitt Physical Principle.
 */
export const kernspin: Chapter = {
  de: [
    {
      title: 'Warum ausgerechnet Protonen?',
      blocks: [
        {
          type: 'hook',
          text: 'Die MRT macht etwas, das zuerst unmöglich klingt: Sie schaut in den Körper, ohne Röntgenstrahlen, nur mit einem Magneten und Radiowellen. Damit das klappt, braucht sie ein **Signal aus dem Körper, das man einem Ort zuordnen kann**. Dieses Signal liefern die Wasserstoffkerne, also einzelne Protonen. In diesem Modul verstehst du, warum gerade sie das können.',
        },
        {
          type: 'p',
          text: 'Stell dir die Frage so, wie der Professor sie stellt: Was muss ein Teilchen mitbringen, damit wir es im Körper „hören“ können? Drei Dinge. Es muss **überall** sein, es muss sich wie ein **kleiner Magnet** verhalten, und dieser Magnet muss **kräftig** auf ein Magnetfeld reagieren.',
        },
        {
          type: 'list',
          items: [
            '**Überall vorhanden:** Der Körper besteht zu rund zwei Dritteln aus Wasser. Jedes Wassermolekül trägt zwei Wasserstoffkerne. Dazu kommt Fett. Wie viel Wasser ein Gewebe enthält, ist von Gewebe zu Gewebe verschieden, und genau das macht später den Kontrast.',
            '**Ein kleiner Magnet:** Ein Proton hat einen Kernspin. Daraus entsteht ein magnetischer Dipol, also ein winziger Stabmagnet.',
            '**Kräftige Reaktion:** Das Proton hat das größte gyromagnetische Verhältnis aller stabilen Kerne. Es „antwortet“ also besonders laut.',
          ],
        },
        {
          type: 'p',
          text: 'Deshalb funktioniert die MRT so gut für **Weichteile** wie Gehirn, Muskeln, Knorpel oder Organe. Kompakter Knochen dagegen bleibt dunkel. Dort gibt es wenig bewegliche Protonen, und ihr Signal ist so schnell verschwunden, dass normale Messungen es verpassen.',
        },
        {
          type: 'mnemonic',
          text: '**Viel, magnetisch, laut.** Protonen sind überall im Wasser, sie sind kleine Magnete, und sie reagieren stärker als jeder andere stabile Kern.',
        },
        {
          type: 'exam',
          question: 'Warum verwendet man für die MRT bevorzugt Protonen?',
          answer: 'Protonen (¹H) kommen in Wasser und Fett in sehr hoher Konzentration im ganzen Körper vor. Sie besitzen einen Kernspin und damit ein magnetisches Moment. Ihr gyromagnetisches Verhältnis ist das größte aller stabilen Kerne, deshalb liefern sie das stärkste Signal.',
          full: 'Ergänze, dass der Wassergehalt gewebeabhängig ist (Grundlage des Weichteilkontrasts) und dass Knochen wegen weniger mobiler Protonen und sehr kurzem T2 dunkel erscheint.',
          sim: 'larmor',
        },
      ],
    },
    {
      title: 'Der Spin: Jedes Proton ist ein Mini-Kreisel mit Magnet',
      blocks: [
        {
          type: 'analogy',
          title: 'Ein Kreisel mit eingebautem Stabmagnet',
          text: 'Denk an einen Spielzeugkreisel, in dessen Achse ein winziger Stabmagnet steckt. Der Kreisel dreht sich, und weil er sich dreht, hat er einen Drehimpuls. Der Magnet zeigt immer entlang der Drehachse. Genau so kannst du dir ein Proton vorstellen.',
        },
        {
          type: 'p',
          text: 'In der Physik heißt dieser Eigendrehimpuls **Kernspin**. Mit ihm ist ein **magnetisches Moment** μ verbunden. Wie stark dieses Moment ist, hängt vom Drehimpuls ab und von einer Materialkonstante, dem **gyromagnetischen Verhältnis** γ. Man kann sich γ als „Übersetzungsfaktor“ vorstellen: Wie viel Magnet steckt in einem Stück Drehimpuls?',
        },
        { type: 'formula', tex: '\\vec\\mu = \\gamma\\,\\vec L', caption: 'magnetisches Moment = gyromagnetisches Verhältnis × Drehimpuls' },
        {
          type: 'p',
          text: 'Jetzt kommt die Quantenphysik ins Spiel, aber nur ein kleines Stück. Der Drehimpuls kann nicht jeden beliebigen Wert haben. Seine Komponente entlang einer Achse ist **gequantelt**. Beim Proton gibt es genau zwei erlaubte Einstellungen, man nennt das ein **Spin-½-System**:',
        },
        { type: 'formula', tex: '\\begin{aligned} L_z &= m\\,\\hbar, \\quad m = \\pm\\tfrac12 \\\\ \\hbar &= 1{,}0546\\cdot10^{-34}\\ \\text{Js} \\end{aligned}', caption: 'nur zwei Einstellungen: „mit dem Feld“ oder „gegen das Feld“' },
        {
          type: 'p',
          text: 'Daraus folgt direkt das magnetische Moment entlang der z-Achse: $\\mu_z = \\gamma\\hbar m$. Zwei mögliche Werte, ein positiver und ein negativer. Mehr Quantenmechanik brauchst du für die Prüfung nicht.',
        },
        {
          type: 'mnemonic',
          text: '**Drehung macht Magnet.** Der Spin ist der Drehimpuls, γ übersetzt ihn in ein magnetisches Moment, und beim Proton gibt es nur zwei Stellungen: m = +½ oder m = −½.',
        },
      ],
    },
    {
      title: 'Ohne Feld: Chaos. Mit Feld: ein winziger Überschuss',
      blocks: [
        {
          type: 'p',
          text: 'Wenn kein äußeres Magnetfeld da ist, zeigen die Mini-Magnete in alle Richtungen durcheinander. Im Mittel heben sie sich gegenseitig auf. Ergebnis: **keine Nettomagnetisierung**. Dein Körper ist im Alltag also nicht magnetisch, obwohl er Milliarden von Protonen-Magneten enthält.',
        },
        {
          type: 'p',
          text: 'Legt man das starke Hauptfeld $B_0$ an, ändert sich das. Jetzt gibt es zwei Energiestufen. Die Einstellung **mit dem Feld** ist etwas günstiger (niedrigere Energie), die Einstellung **gegen das Feld** etwas ungünstiger.',
        },
        { type: 'formula', tex: 'E_m = -\\mu_z B_0 = -\\gamma\\hbar\\,m\\,B_0 \\qquad\\Rightarrow\\qquad \\Delta E = \\gamma\\hbar B_0', caption: 'Abstand der beiden Energiestufen wächst mit dem Feld' },
        {
          type: 'analogy',
          title: 'Ein Stadion mit fast gleich vielen Fans beider Teams',
          text: 'Stell dir ein Stadion mit einer Million Zuschauern vor. Fast genau die Hälfte jubelt für Team „parallel“, die andere Hälfte für Team „antiparallel“. Nur ein paar Fans mehr sitzen auf der Seite von „parallel“. Einzelne Stimmen hörst du nicht. Aber dieser kleine Überschuss ist es, der am Ende als Gesamtgeräusch übrig bleibt.',
        },
        {
          type: 'p',
          text: 'Genau so ist es bei den Protonen. Die Wärmebewegung bei Körpertemperatur wirft ständig alles durcheinander. Die **Boltzmann-Verteilung** sagt, wie viele Protonen trotzdem im günstigeren Zustand sitzen: nur wenige pro Million mehr, ungefähr 3 von einer Million pro Tesla. Weil im Körper aber unvorstellbar viele Protonen sind, ergibt dieser kleine Überschuss eine messbare **Nettomagnetisierung** $M_0$, die entlang von $B_0$ zeigt.',
        },
        {
          type: 'list',
          items: [
            '**Stärkeres Feld** → größerer Energieabstand → größerer Überschuss → mehr Signal.',
            '**Höhere Temperatur** → mehr Durcheinander → kleinerer Überschuss. (Am Patienten ist die Temperatur fest, im Skript steht aber bewusst „temperaturabhängig“.)',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Kein Feld, kein Netto. Mit Feld: ein paar mehr auf der günstigen Seite.** Dieser winzige Überschuss ist das ganze Kapital der MRT.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Im Magnetfeld richten sich alle Protonen parallel aus.“ Richtig: Fast genauso viele stehen antiparallel, nur ein winziger Überschuss bleibt.',
            'Falsch: „Ohne Feld gibt es keine Spins.“ Richtig: Die Spins sind da, sie heben sich nur gegenseitig auf.',
          ],
        },
        {
          type: 'exam',
          question: 'Warum hat Gewebe ohne äußeres Magnetfeld keine Nettomagnetisierung, im Magnetfeld aber schon?',
          answer: 'Ohne Feld sind die magnetischen Momente der Protonen zufällig orientiert und heben sich im thermischen Gleichgewicht auf. Im Feld B₀ spalten die Spinzustände in zwei Energieniveaus auf. Nach Boltzmann ist das energieärmere Niveau (parallel) minimal stärker besetzt. Die Summe dieses Überschusses ergibt die Nettomagnetisierung M₀ entlang B₀.',
          full: 'Nenne die Formel $E_m = -\\gamma\\hbar m B_0$ und die Abhängigkeiten: Überschuss wächst mit B₀ und sinkt mit der Temperatur.',
        },
      ],
    },
    {
      title: 'Präzession: Das Proton tanzt mit der Larmor-Frequenz',
      blocks: [
        {
          type: 'analogy',
          title: 'Der Kreisel, der nicht umfällt',
          text: 'Ein schräg gestellter Kreisel kippt nicht einfach um. Die Schwerkraft zieht an ihm, aber weil er sich dreht, weicht er seitlich aus. Seine Achse wandert langsam im Kreis. Das nennt man **Präzession**. Ein Proton im Magnetfeld macht genau dasselbe: Das Feld zieht an seinem Magneten, und statt umzukippen, kreist seine Achse um die Feldrichtung.',
        },
        {
          type: 'p',
          text: 'Wie schnell kreist das Proton? Das ist die wichtigste Zahl der ganzen MRT, die **Larmor-Frequenz**. Sie ist einfach proportional zur Feldstärke. Doppeltes Feld, doppelt so schnelles Kreisen.',
        },
        { type: 'formula', tex: 'f_0 = \\bar\\gamma\\, B_0, \\qquad \\bar\\gamma = \\frac{\\gamma}{2\\pi} = 42{,}57\\ \\text{MHz/T}\\ \\ (^1\\text{H})', caption: 'Larmor-Gleichung für Wasserstoff' },
        {
          type: 'table',
          head: ['Feldstärke B₀', '0,5 T', '1,5 T', '3 T', '7 T'],
          rows: [['Larmor-Frequenz f₀', '21,3 MHz', '63,9 MHz', '127,7 MHz', '298 MHz']],
        },
        {
          type: 'p',
          text: 'Diese Frequenzen liegen im Bereich von UKW-Radio. Darum spricht man von **Radiofrequenz** oder HF. Und darum steht ein MRT-Gerät in einem abgeschirmten Raum: Draußen senden echte Radiosender auf ähnlichen Frequenzen.',
        },
        {
          type: 'analogy',
          title: 'Jedes Feld hat seinen eigenen Radiosender',
          text: 'Das Magnetfeld bestimmt, auf welchem „Sender“ die Protonen funken. Bei 1,5 T ist das 63,9 MHz, bei 3 T 127,7 MHz. Wer mit den Protonen reden will, muss genau diesen Sender einstellen. Diese Idee wird später entscheidend: Wenn das Feld von Ort zu Ort leicht anders ist, funkt jeder Ort auf seinem eigenen Sender.',
        },
        {
          type: 'pitfall',
          items: [
            '**f oder ω?** Die Frequenz f misst man in Hz (Umdrehungen pro Sekunde). Die Kreisfrequenz ω = 2πf misst man in rad/s. Es gilt $\\omega_0 = \\gamma B_0$ und $f_0 = \\bar\\gamma B_0$.',
            'Achtung, im Skript steht $\\omega = \\gamma B_0$ zusammen mit dem Zahlenwert 42,57 MHz/T. Dieser Zahlenwert gehört aber zu $\\bar\\gamma = \\gamma/2\\pi$, also zur Frequenz f. Wer ω ausrechnet, muss noch mit 2π multiplizieren.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**42 und ein halb Megahertz pro Tesla.** Mal Feldstärke, fertig ist die Larmor-Frequenz: 1,5 T → rund 64 MHz, 3 T → rund 128 MHz.',
        },
        {
          type: 'exam',
          question: 'Berechne die Larmor-Frequenz von Wasserstoff bei 3 T. Wie groß ist die Kreisfrequenz?',
          answer: '$f_0 = 42{,}57\\ \\text{MHz/T} \\cdot 3\\ \\text{T} \\approx 127{,}7\\ \\text{MHz}$. Die Kreisfrequenz ist $\\omega_0 = 2\\pi f_0 \\approx 8{,}02\\cdot10^8\\ \\text{rad/s}$.',
          full: 'Erwähne, dass die Frequenz linear mit B₀ steigt und im Radiofrequenzbereich liegt.',
          sim: 'larmor',
        },
      ],
    },
    {
      title: 'Von vielen kleinen zu einem großen Magneten: die Bloch-Gleichung',
      blocks: [
        {
          type: 'p',
          text: 'Einzelne Protonen kann niemand messen. Gemessen wird immer die Summe von Milliarden Protonen. Diese Summe aller magnetischen Momente heißt **Magnetisierung** M. Sie ist ein Pfeil mit drei Komponenten: $M_x$ und $M_y$ quer zum Feld, $M_z$ entlang des Feldes.',
        },
        { type: 'formula', tex: '\\vec M = \\sum_i \\vec\\mu_i', caption: 'makroskopische Magnetisierung = Summe aller Dipole' },
        {
          type: 'p',
          text: 'Das Schöne: Der große Pfeil M verhält sich genau wie ein einzelnes Proton. Er präzediert um das Magnetfeld. In Formeln sagt die **Bloch-Gleichung** genau das: Die Änderung von M zeigt immer senkrecht zu M und zu B, so wie beim Kreisel.',
        },
        { type: 'formula', tex: '\\frac{d\\vec M}{dt} = \\gamma\\, \\vec M \\times \\vec B', caption: 'ohne Relaxation: reine Präzession' },
        {
          type: 'p',
          text: 'Schreibt man das Kreuzprodukt für die drei Richtungen aus, bekommt man drei gekoppelte Gleichungen. Im Skript steht genau diese Form, und in der Prüfung solltest du sie zumindest lesen können:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\frac{dM_x}{dt} &= \\gamma(M_yB_z - M_zB_y) \\\\ \\frac{dM_y}{dt} &= \\gamma(M_zB_x - M_xB_z) \\\\ \\frac{dM_z}{dt} &= \\gamma(M_xB_y - M_yB_x) \\end{aligned}',
        },
        {
          type: 'p',
          text: 'In der echten Welt kommt noch etwas dazu: Die Magnetisierung kehrt mit der Zeit in ihren Ruhezustand zurück. Das nennt man **Relaxation**, und Felix Bloch hat dafür zwei Zusatzterme eingeführt. Der T2-Term lässt die Querkomponenten $M_x, M_y$ verschwinden, der T1-Term bringt $M_z$ zurück zu $M_0$. Wie das genau abläuft, ist das Thema von Modul 2.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\frac{dM_x}{dt} &= \\gamma(\\vec M\\times\\vec B)_x - \\frac{M_x}{T_2} \\\\ \\frac{dM_y}{dt} &= \\gamma(\\vec M\\times\\vec B)_y - \\frac{M_y}{T_2} \\\\ \\frac{dM_z}{dt} &= \\gamma(\\vec M\\times\\vec B)_z - \\frac{M_z - M_0}{T_1} \\end{aligned}',
          caption: 'vollständige Bloch-Gleichung',
        },
        {
          type: 'mnemonic',
          text: '**Kreuzprodukt dreht, T2 löscht quer, T1 baut längs wieder auf.** Drei Effekte, eine Gleichung.',
        },
        {
          type: 'exam',
          question: 'Erkläre die Terme der Bloch-Gleichung für $M_z$.',
          answer: '$\\gamma(M_xB_y - M_yB_x)$ beschreibt die Präzession, also die Drehung von M durch das Magnetfeld (z. B. durch das HF-Feld). $-(M_z - M_0)/T_1$ beschreibt die longitudinale Relaxation: $M_z$ strebt mit der Zeitkonstante T1 zurück zum Gleichgewichtswert $M_0$.',
          full: 'Zeige, dass der T1-Term genau dann null wird, wenn $M_z = M_0$ ist, also im Gleichgewicht.',
          sim: 'signal',
        },
      ],
    },
    {
      title: 'Resonanz: Mit dem richtigen Funkspruch kippt die Magnetisierung',
      blocks: [
        {
          type: 'p',
          text: 'Im Ruhezustand zeigt M entlang des Feldes. In dieser Lage sendet M nichts aus, denn ein ruhender Magnet erzeugt in einer Antenne keine Spannung. Wir müssen M also **aus der Ruhelage kippen**. Das geschieht mit einem kurzen Radiowellen-Puls, dem **HF-Puls** mit dem Feld $B_1$.',
        },
        {
          type: 'analogy',
          title: 'Eine Schaukel anschubsen',
          text: 'Ein Kind auf einer Schaukel bringst du nur hoch, wenn du **im richtigen Takt** schubst. Schubst du zu schnell oder zu langsam, passiert kaum etwas. Genau das ist **Resonanz**. Der HF-Puls muss mit der Larmor-Frequenz schwingen. Dann schaukelt er die Magnetisierung Stück für Stück aus ihrer Ruhelage.',
        },
        {
          type: 'p',
          text: 'Wie weit M gekippt wird, hängt davon ab, wie stark und wie lange der Puls wirkt. Das Ergebnis heißt **Flipwinkel** α. Zwei Flipwinkel musst du kennen:',
        },
        { type: 'formula', tex: '\\alpha = \\gamma \\int_0^{\\tau} B_1(t)\\,dt', caption: 'Flipwinkel = Stärke × Dauer des HF-Pulses' },
        {
          type: 'list',
          items: [
            '**90°-Puls:** M wird ganz in die Querebene gekippt. Jetzt kreist die gesamte Magnetisierung quer zum Feld und erzeugt das größte Signal.',
            '**180°-Puls:** M wird komplett umgedreht und zeigt nach unten ($M_z = -M_0$). Aus dem Ruhezustand heraus entsteht dabei **kein** Quersignal. Später im Spin-Echo dreht ein 180°-Puls dagegen auseinandergelaufene Spins wieder zusammen.',
          ],
        },
        {
          type: 'p',
          text: 'Nach dem Puls kreist die Quermagnetisierung mit der Larmor-Frequenz. Ein kreisender Magnet induziert in einer Spule eine Wechselspannung, das ist dasselbe Prinzip wie beim Fahrraddynamo. Dieses Signal wird schnell schwächer, weil die Protonen ihre Energie wieder abgeben und sich zurück ausrichten. Man nennt es **Free Induction Decay**, kurz **FID**: freier Induktionszerfall.',
        },
        {
          type: 'p',
          text: 'Damit ist die Kette komplett: **Eingang** ist die Pulssequenz, **Ausgang** ist das FID-Signal. Alles Weitere in der MRT ist die Frage, wie man aus diesem Signal ein Bild macht.',
        },
        {
          type: 'mnemonic',
          text: '**Im Takt schubsen, dann zuhören.** HF-Puls mit Larmor-Frequenz kippt M, die kreisende Quermagnetisierung sendet den FID zurück.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Ein 180°-Puls liefert das doppelte Signal eines 90°-Pulses.“ Richtig: Aus dem Gleichgewicht liefert er gar kein Quersignal, weil M nur umgedreht wird.',
            'Falsch: „Die Spule misst die Längsmagnetisierung.“ Richtig: Nur die kreisende **Quer**magnetisierung erzeugt eine Spannung in der Spule.',
          ],
        },
        {
          type: 'exam',
          question: 'Was passiert mit der Magnetisierung bei einem 90°- und bei einem 180°-Puls, und welches Signal misst man danach?',
          answer: 'Ein 90°-Puls kippt M₀ vollständig in die Transversalebene ($M_z = 0$, $M_{xy} = M_0$). Die präzedierende Quermagnetisierung induziert in der Spule den FID, der durch Relaxation abklingt. Ein 180°-Puls invertiert M ($M_z = -M_0$). Aus dem Gleichgewicht entsteht dabei kein Quersignal.',
          full: 'Nenne die Resonanzbedingung (HF-Frequenz = Larmor-Frequenz) und den Flipwinkel $\\alpha = \\gamma\\int B_1\\,dt$.',
          sim: 'signal',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'Почему именно протоны?',
      blocks: [
        {
          type: 'hook',
          text: 'МРТ делает то, что сначала кажется невозможным: заглядывает внутрь тела без рентгеновских лучей, только с помощью магнита и радиоволн. Для этого нужен **сигнал из тела, который можно привязать к месту**. Такой сигнал дают ядра водорода, то есть отдельные протоны. В этом модуле ты поймёшь, почему именно они.',
        },
        {
          type: 'p',
          text: 'Поставь вопрос так, как его ставит профессор: что должна уметь частица, чтобы мы могли «услышать» её в теле? Три вещи. Она должна быть **повсюду**, вести себя как **маленький магнит**, и этот магнит должен **сильно** реагировать на магнитное поле.',
        },
        {
          type: 'list',
          items: [
            '**Есть повсюду:** тело примерно на две трети состоит из воды. В каждой молекуле воды два ядра водорода. К этому добавляется жир. Содержание воды в разных тканях разное, и именно это потом создаёт контраст.',
            '**Маленький магнит:** у протона есть ядерный спин. Из него возникает магнитный диполь, то есть крошечный стержневой магнит.',
            '**Сильная реакция:** у протона самое большое гиромагнитное отношение среди стабильных ядер. Он «отвечает» особенно громко.',
          ],
        },
        {
          type: 'p',
          text: 'Поэтому МРТ так хорошо показывает **мягкие ткани**: мозг, мышцы, хрящ, органы. Плотная кость, наоборот, остаётся тёмной. В ней мало подвижных протонов, и их сигнал исчезает так быстро, что обычные измерения его пропускают.',
        },
        {
          type: 'mnemonic',
          text: '**Много, магнитно, громко.** Протоны есть во всей воде, они маленькие магниты и реагируют сильнее любого другого стабильного ядра.',
        },
        {
          type: 'exam',
          question: 'Почему для МРТ предпочтительно используют протоны?',
          answer: 'Протоны (¹H) в очень высокой концентрации есть в воде и жире по всему телу. У них есть ядерный спин и, значит, магнитный момент. Их гиромагнитное отношение самое большое среди стабильных ядер, поэтому они дают самый сильный сигнал.',
          full: 'Добавь, что содержание воды зависит от ткани (основа контраста мягких тканей), а кость тёмная из-за малого числа подвижных протонов и очень короткого T2.',
          sim: 'larmor',
        },
      ],
    },
    {
      title: 'Спин: каждый протон как мини-волчок с магнитом',
      blocks: [
        {
          type: 'analogy',
          title: 'Волчок со встроенным магнитом',
          text: 'Представь игрушечный волчок, в ось которого вставлен крошечный стержневой магнит. Волчок вращается, и поэтому у него есть момент импульса. Магнит всегда направлен вдоль оси вращения. Именно так можно представить себе протон.',
        },
        {
          type: 'p',
          text: 'В физике этот собственный момент импульса называется **ядерным спином**. С ним связан **магнитный момент** μ. Его величина зависит от момента импульса и от константы вещества, **гиромагнитного отношения** γ. Можно считать γ «переводным коэффициентом»: сколько магнита приходится на единицу момента импульса?',
        },
        { type: 'formula', tex: '\\vec\\mu = \\gamma\\,\\vec L', caption: 'магнитный момент = гиромагнитное отношение × момент импульса' },
        {
          type: 'p',
          text: 'Теперь немного квантовой физики, совсем чуть-чуть. Момент импульса не может принимать любые значения. Его проекция на ось **квантована**. У протона ровно два разрешённых положения, это называют **системой со спином ½**:',
        },
        { type: 'formula', tex: '\\begin{aligned} L_z &= m\\,\\hbar, \\quad m = \\pm\\tfrac12 \\\\ \\hbar &= 1{,}0546\\cdot10^{-34}\\ \\text{Дж·с} \\end{aligned}', caption: 'только два положения: «по полю» или «против поля»' },
        {
          type: 'p',
          text: 'Отсюда сразу следует магнитный момент вдоль оси z: $\\mu_z = \\gamma\\hbar m$. Два возможных значения, положительное и отрицательное. Больше квантовой механики для экзамена не нужно.',
        },
        {
          type: 'mnemonic',
          text: '**Вращение рождает магнит.** Спин это момент импульса, γ переводит его в магнитный момент, а у протона всего два положения: m = +½ или m = −½.',
        },
      ],
    },
    {
      title: 'Без поля хаос. В поле крошечный избыток',
      blocks: [
        {
          type: 'p',
          text: 'Без внешнего магнитного поля мини-магниты направлены как попало. В среднем они взаимно гасятся. Итог: **суммарной намагниченности нет**. Поэтому твоё тело в обычной жизни не магнитно, хотя в нём миллиарды протонных магнитиков.',
        },
        {
          type: 'p',
          text: 'Если включить сильное основное поле $B_0$, всё меняется. Появляются два энергетических уровня. Положение **по полю** немного выгоднее (энергия ниже), положение **против поля** немного менее выгодно.',
        },
        { type: 'formula', tex: 'E_m = -\\mu_z B_0 = -\\gamma\\hbar\\,m\\,B_0 \\qquad\\Rightarrow\\qquad \\Delta E = \\gamma\\hbar B_0', caption: 'расстояние между уровнями растёт с полем' },
        {
          type: 'analogy',
          title: 'Стадион, где болельщиков обеих команд почти поровну',
          text: 'Представь стадион с миллионом зрителей. Почти ровно половина болеет за команду «параллельные», другая половина за «антипараллельные». Лишь несколько человек больше сидят на стороне «параллельных». Отдельные голоса не слышны. Но именно этот маленький перевес остаётся в итоге как общий шум.',
        },
        {
          type: 'p',
          text: 'С протонами то же самое. Тепловое движение при температуре тела постоянно всё перемешивает. **Распределение Больцмана** говорит, сколько протонов всё же находится в выгодном состоянии: лишь несколько на миллион больше, примерно 3 на миллион на тесла. Но протонов в теле невообразимо много, и этот маленький избыток даёт измеримую **суммарную намагниченность** $M_0$, направленную вдоль $B_0$.',
        },
        {
          type: 'list',
          items: [
            '**Сильнее поле** → больше расстояние между уровнями → больше избыток → больше сигнала.',
            '**Выше температура** → больше беспорядка → меньше избыток. (У пациента температура постоянна, но в конспекте специально сказано «зависит от температуры».)',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Нет поля, нет суммы. В поле немного больше на выгодной стороне.** Этот крошечный избыток и есть весь капитал МРТ.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «В магнитном поле все протоны выстраиваются параллельно». Верно: почти столько же стоят антипараллельно, остаётся лишь крошечный избыток.',
            'Неверно: «Без поля спинов нет». Верно: спины есть, они просто взаимно гасятся.',
          ],
        },
        {
          type: 'exam',
          question: 'Почему у ткани без внешнего поля нет суммарной намагниченности, а в поле она есть?',
          answer: 'Без поля магнитные моменты протонов ориентированы случайно и в тепловом равновесии гасятся. В поле B₀ спиновые состояния расщепляются на два энергетических уровня. По Больцману нижний (параллельный) уровень заселён чуть больше. Сумма этого избытка даёт суммарную намагниченность M₀ вдоль B₀.',
          full: 'Назови формулу $E_m = -\\gamma\\hbar m B_0$ и зависимости: избыток растёт с B₀ и уменьшается с температурой.',
        },
      ],
    },
    {
      title: 'Прецессия: протон танцует с ларморовой частотой',
      blocks: [
        {
          type: 'analogy',
          title: 'Волчок, который не падает',
          text: 'Наклонённый волчок не падает сразу. Сила тяжести тянет его, но из-за вращения он уходит в сторону. Его ось медленно описывает круг. Это называется **прецессией**. Протон в магнитном поле делает то же самое: поле тянет его магнит, и вместо того чтобы опрокинуться, его ось кружит вокруг направления поля.',
        },
        {
          type: 'p',
          text: 'Как быстро кружит протон? Это самое важное число всей МРТ, **ларморова частота**. Она просто пропорциональна силе поля. Поле вдвое сильнее, кружение вдвое быстрее.',
        },
        { type: 'formula', tex: 'f_0 = \\bar\\gamma\\, B_0, \\qquad \\bar\\gamma = \\frac{\\gamma}{2\\pi} = 42{,}57\\ \\text{МГц/Тл}\\ \\ (^1\\text{H})', caption: 'уравнение Лармора для водорода' },
        {
          type: 'table',
          head: ['Поле B₀', '0,5 Тл', '1,5 Тл', '3 Тл', '7 Тл'],
          rows: [['Ларморова частота f₀', '21,3 МГц', '63,9 МГц', '127,7 МГц', '298 МГц']],
        },
        {
          type: 'p',
          text: 'Эти частоты лежат в диапазоне УКВ-радио. Поэтому говорят о **радиочастоте** (РЧ). И поэтому томограф стоит в экранированном помещении: снаружи настоящие радиостанции вещают на похожих частотах.',
        },
        {
          type: 'analogy',
          title: 'У каждого поля своя радиостанция',
          text: 'Магнитное поле определяет, на какой «станции» вещают протоны. При 1,5 Тл это 63,9 МГц, при 3 Тл 127,7 МГц. Кто хочет говорить с протонами, должен настроиться ровно на эту станцию. Эта идея станет решающей позже: если поле в разных местах чуть разное, каждое место вещает на своей станции.',
        },
        {
          type: 'pitfall',
          items: [
            '**f или ω?** Частоту f измеряют в Гц (обороты в секунду). Угловую частоту ω = 2πf измеряют в рад/с. Верно: $\\omega_0 = \\gamma B_0$ и $f_0 = \\bar\\gamma B_0$.',
            'Внимание, в конспекте написано $\\omega = \\gamma B_0$ вместе со значением 42,57 МГц/Тл. Но это значение относится к $\\bar\\gamma = \\gamma/2\\pi$, то есть к частоте f. Кто считает ω, должен ещё умножить на 2π.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Сорок два с половиной мегагерца на тесла.** Умножь на поле, и ларморова частота готова: 1,5 Тл → около 64 МГц, 3 Тл → около 128 МГц.',
        },
        {
          type: 'exam',
          question: 'Рассчитай ларморову частоту водорода при 3 Тл. Какова угловая частота?',
          answer: '$f_0 = 42{,}57\\ \\text{МГц/Тл} \\cdot 3\\ \\text{Тл} \\approx 127{,}7\\ \\text{МГц}$. Угловая частота $\\omega_0 = 2\\pi f_0 \\approx 8{,}02\\cdot10^8\\ \\text{рад/с}$.',
          full: 'Упомяни, что частота растёт линейно с B₀ и лежит в радиочастотном диапазоне.',
          sim: 'larmor',
        },
      ],
    },
    {
      title: 'От множества маленьких к одному большому магниту: уравнение Блоха',
      blocks: [
        {
          type: 'p',
          text: 'Отдельные протоны измерить никто не может. Измеряется всегда сумма миллиардов протонов. Эта сумма всех магнитных моментов называется **намагниченностью** M. Это стрелка с тремя компонентами: $M_x$ и $M_y$ поперёк поля, $M_z$ вдоль поля.',
        },
        { type: 'formula', tex: '\\vec M = \\sum_i \\vec\\mu_i', caption: 'макроскопическая намагниченность = сумма всех диполей' },
        {
          type: 'p',
          text: 'Самое приятное: большая стрелка M ведёт себя точно как отдельный протон. Она прецессирует вокруг магнитного поля. **Уравнение Блоха** говорит именно это: изменение M всегда перпендикулярно M и B, как у волчка.',
        },
        { type: 'formula', tex: '\\frac{d\\vec M}{dt} = \\gamma\\, \\vec M \\times \\vec B', caption: 'без релаксации: чистая прецессия' },
        {
          type: 'p',
          text: 'Если расписать векторное произведение по трём направлениям, получаются три связанных уравнения. В конспекте стоит именно такая форма, и на экзамене ты должен хотя бы уметь её читать:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\frac{dM_x}{dt} &= \\gamma(M_yB_z - M_zB_y) \\\\ \\frac{dM_y}{dt} &= \\gamma(M_zB_x - M_xB_z) \\\\ \\frac{dM_z}{dt} &= \\gamma(M_xB_y - M_yB_x) \\end{aligned}',
        },
        {
          type: 'p',
          text: 'В реальном мире добавляется ещё кое-что: со временем намагниченность возвращается в состояние покоя. Это называется **релаксацией**, и Феликс Блох ввёл для неё два дополнительных члена. Член с T2 гасит поперечные компоненты $M_x, M_y$, член с T1 возвращает $M_z$ к $M_0$. Как именно это происходит, тема модуля 2.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\frac{dM_x}{dt} &= \\gamma(\\vec M\\times\\vec B)_x - \\frac{M_x}{T_2} \\\\ \\frac{dM_y}{dt} &= \\gamma(\\vec M\\times\\vec B)_y - \\frac{M_y}{T_2} \\\\ \\frac{dM_z}{dt} &= \\gamma(\\vec M\\times\\vec B)_z - \\frac{M_z - M_0}{T_1} \\end{aligned}',
          caption: 'полное уравнение Блоха',
        },
        {
          type: 'mnemonic',
          text: '**Векторное произведение вращает, T2 стирает поперечное, T1 восстанавливает продольное.** Три эффекта, одно уравнение.',
        },
        {
          type: 'exam',
          question: 'Объясни члены уравнения Блоха для $M_z$.',
          answer: '$\\gamma(M_xB_y - M_yB_x)$ описывает прецессию, то есть поворот M магнитным полем (например, РЧ-полем). $-(M_z - M_0)/T_1$ описывает продольную релаксацию: $M_z$ с постоянной времени T1 стремится обратно к равновесному значению $M_0$.',
          full: 'Покажи, что член с T1 обращается в ноль ровно при $M_z = M_0$, то есть в равновесии.',
          sim: 'signal',
        },
      ],
    },
    {
      title: 'Резонанс: правильный радиосигнал опрокидывает намагниченность',
      blocks: [
        {
          type: 'p',
          text: 'В покое M направлена вдоль поля. В этом положении M ничего не излучает: неподвижный магнит не создаёт напряжения в антенне. Значит, M нужно **вывести из положения покоя**. Это делает короткий радиоимпульс, **РЧ-импульс** с полем $B_1$.',
        },
        {
          type: 'analogy',
          title: 'Раскачать качели',
          text: 'Ребёнка на качелях можно раскачать, только если толкать **в такт**. Толкаешь слишком быстро или слишком медленно, почти ничего не происходит. Это и есть **резонанс**. РЧ-импульс должен колебаться с ларморовой частотой. Тогда он шаг за шагом раскачивает намагниченность из положения покоя.',
        },
        {
          type: 'p',
          text: 'Насколько далеко отклонится M, зависит от силы и длительности импульса. Результат называется **углом отклонения** α. Два угла нужно знать обязательно:',
        },
        { type: 'formula', tex: '\\alpha = \\gamma \\int_0^{\\tau} B_1(t)\\,dt', caption: 'угол отклонения = сила × длительность РЧ-импульса' },
        {
          type: 'list',
          items: [
            '**Импульс 90°:** M полностью переводится в поперечную плоскость. Теперь вся намагниченность кружит поперёк поля и даёт максимальный сигнал.',
            '**Импульс 180°:** M полностью переворачивается и смотрит вниз ($M_z = -M_0$). Из состояния покоя при этом **не** возникает поперечного сигнала. Позже в спин-эхо импульс 180°, наоборот, собирает разбежавшиеся спины обратно.',
          ],
        },
        {
          type: 'p',
          text: 'После импульса поперечная намагниченность кружит с ларморовой частотой. Вращающийся магнит наводит в катушке переменное напряжение, это тот же принцип, что у велосипедной динамо-машины. Сигнал быстро слабеет, потому что протоны отдают энергию и снова выстраиваются. Его называют **Free Induction Decay**, сокращённо **FID**: спад свободной индукции.',
        },
        {
          type: 'p',
          text: 'Цепочка замкнулась: **вход** это импульсная последовательность, **выход** это сигнал FID. Всё остальное в МРТ отвечает на вопрос, как из этого сигнала получить изображение.',
        },
        {
          type: 'mnemonic',
          text: '**Толкни в такт, потом слушай.** РЧ-импульс с ларморовой частотой отклоняет M, кружащая поперечная намагниченность отправляет обратно FID.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Импульс 180° даёт вдвое больший сигнал, чем 90°». Верно: из равновесия он вообще не даёт поперечного сигнала, M просто переворачивается.',
            'Неверно: «Катушка измеряет продольную намагниченность». Верно: напряжение в катушке создаёт только кружащая **поперечная** намагниченность.',
          ],
        },
        {
          type: 'exam',
          question: 'Что происходит с намагниченностью при импульсах 90° и 180° и какой сигнал измеряют после них?',
          answer: 'Импульс 90° полностью переводит M₀ в поперечную плоскость ($M_z = 0$, $M_{xy} = M_0$). Прецессирующая поперечная намагниченность наводит в катушке FID, который затухает из-за релаксации. Импульс 180° инвертирует M ($M_z = -M_0$). Из равновесия поперечного сигнала при этом не возникает.',
          full: 'Назови условие резонанса (частота РЧ = ларморова частота) и угол отклонения $\\alpha = \\gamma\\int B_1\\,dt$.',
          sim: 'signal',
        },
      ],
    },
  ],
};
