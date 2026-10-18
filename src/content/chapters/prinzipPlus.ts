import type { Chapter } from './types';

/**
 * Vertiefungsabschnitte für „Physikalisches Prinzip“; eingeordnet in chapters/index.ts.
 * 0 Boltzmann-Überschuss nachgerechnet, 1 rotierendes Bezugssystem, 2 Bloch-Simulation aus dem Skript lesen,
 * 3 Energie und Photon (ΔE = h·f₀), 4 molekulare Bewegung und T1/T2.
 */
export const prinzipPlus: Chapter = {
  de: [
    {
      title: 'Nachgerechnet: Wie groß ist der Boltzmann-Überschuss?',
      blocks: [
        {
          type: 'analogy',
          title: 'Eine Waage, die fast im Gleichgewicht ist',
          text: 'Stell dir eine Balkenwaage vor. Auf jeder Seite liegt eine halbe Million Reiskörner. Auf der linken Seite liegen nur fünf Körner mehr. Du siehst den Unterschied nicht, aber die Waage neigt sich ganz leicht. Genau so ist es mit den Spins: Fast alle heben sich gegenseitig auf. Nur der winzige Rest zählt, und den rechnen wir jetzt einmal wirklich aus.',
        },
        {
          type: 'p',
          text: 'Du weißt schon: Im Feld $B_0$ gibt es zwei Energiestufen, und die untere ist etwas stärker besetzt. Aber wie viel ist „etwas“? Dafür vergleichen wir zwei Energien. Die eine ist der **Abstand der Stufen** $\\Delta E = \\gamma\\hbar B_0$. Die andere ist die **Wärmeenergie** $kT$, also das typische „Durchschütteln“ durch die Temperatur.',
        },
        {
          type: 'list',
          items: [
            '$\\gamma = 2{,}675\\cdot10^8$ rad/(s·T) ist das gyromagnetische Verhältnis des Protons.',
            '$\\hbar = 1{,}055\\cdot10^{-34}$ J·s ist das reduzierte Plancksche Wirkungsquantum.',
            '$k = 1{,}381\\cdot10^{-23}$ J/K ist die Boltzmann-Konstante, $T = 310$ K ist die Körpertemperatur (37 °C).',
          ],
        },
        {
          type: 'p',
          text: 'Bei 1,5 T ergibt das $\\Delta E \\approx 4{,}2\\cdot10^{-26}$ J. Die Wärmeenergie ist $kT \\approx 4{,}3\\cdot10^{-21}$ J. Die Stufe ist also rund **hunderttausendmal kleiner** als das thermische Durcheinander. Kein Wunder, dass sich die Spins kaum sortieren lassen.',
        },
        {
          type: 'p',
          text: 'Die Boltzmann-Verteilung sagt, wie das Verhältnis der beiden Besetzungen aussieht. Weil $\\Delta E$ so klein gegen $kT$ ist, darf man die Exponentialfunktion durch ihre erste Näherung ersetzen. Heraus kommt eine sehr einfache Formel für den **relativen Überschuss**:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\frac{N_\\uparrow}{N_\\downarrow} &= e^{\\Delta E/kT} \\approx 1 + \\frac{\\Delta E}{kT} \\\\ \\frac{N_\\uparrow - N_\\downarrow}{N} &\\approx \\frac{\\Delta E}{2kT} = \\frac{\\gamma\\hbar B_0}{2kT} \\end{aligned}',
          caption: '$N_\\uparrow$: parallel (unten), $N_\\downarrow$: antiparallel (oben), $N$: alle Spins',
        },
        {
          type: 'table',
          head: ['Feldstärke B₀', '1,5 T', '3 T', '7 T'],
          rows: [
            ['Überschuss', '≈ 4,9 ppm', '≈ 9,9 ppm', '≈ 23 ppm'],
            ['von 1 Million Spins', '≈ 5 mehr parallel', '≈ 10 mehr parallel', '≈ 23 mehr parallel'],
          ],
        },
        {
          type: 'p',
          text: '„ppm“ heißt parts per million, also Teile pro Million. Bei 1,5 T stehen von einer Million Spins also etwa 500 002 parallel und 499 998 antiparallel. Das passt zu der Faustregel aus dem Grundlagenteil: rund 3 ppm pro Tesla.',
        },
        { type: 'figure', id: 'boltzmann-excess', caption: 'Links sind die beiden Balken für 1,5 T praktisch gleich lang, erst die Lupe zeigt die 4 Spins Unterschied. Rechts siehst du, dass der Überschuss genau linear mit $B_0$ wächst: rund 5 ppm bei 1,5 T und 10 ppm bei 3 T, berechnet mit $\\gamma\\hbar B_0/(2kT)$.' },
        {
          type: 'p',
          text: 'Klingt hoffnungslos wenig? Jetzt kommt der Trick: Wir haben **unvorstellbar viele** Protonen. Ein Milliliter Wasser wiegt 1 g. Das sind $1/18$ mol Wassermoleküle, also etwa $3{,}3\\cdot10^{22}$ Moleküle. Jedes trägt zwei Wasserstoffkerne. Macht rund $6{,}7\\cdot10^{22}$ Protonen.',
        },
        {
          type: 'formula',
          tex: '6{,}7\\cdot10^{22} \\cdot 4{,}9\\cdot10^{-6} \\approx 3\\cdot10^{17}',
          caption: 'Überschuss-Protonen in 1 ml Wasser bei 1,5 T',
        },
        {
          type: 'p',
          text: 'In einem einzigen Milliliter stehen also rund $3\\cdot10^{17}$ Protonen mehr parallel als antiparallel, das sind 300 Billiarden. Ein Bildpunkt (Voxel) von 1 mm³ ist tausendmal kleiner und enthält immer noch rund $3\\cdot10^{14}$ Überschuss-Protonen. Ihre Summe ist die messbare Magnetisierung $M_0$.',
        },
        {
          type: 'formula',
          tex: 'M_0 \\approx \\frac{N\\,\\gamma^2\\hbar^2 B_0}{4kT}',
          caption: 'Magnetisierung im Gleichgewicht: proportional zu B₀, umgekehrt proportional zu T',
        },
        {
          type: 'p',
          text: 'Warum heißt **mehr Feld mehr Signal**? Doppeltes $B_0$ verdoppelt den Überschuss und damit $M_0$. Zusätzlich kreist die Magnetisierung doppelt so schnell, und ein schneller kreisender Magnet induziert in der Spule mehr Spannung. Weil auch das Rauschen mit dem Feld etwas wächst, bleibt in der Praxis ungefähr eine Faustregel übrig: **3 T liefert etwa das doppelte Signal-Rausch-Verhältnis von 1,5 T.** Kühlen kann man den Patienten dagegen nicht, die Temperatur ist mit 37 °C fest.',
        },
        {
          type: 'mnemonic',
          text: '**Fünf von einer Million bei 1,5 T, zehn bei 3 T.** Winzig pro Spin, riesig in der Summe: $\\gamma\\hbar B_0/(2kT)$ mal $10^{22}$ Protonen pro Milliliter.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Nur die 5 Überschuss-Spins pro Million präzedieren, die anderen ruhen.“ Richtig: Alle Spins präzedieren. Nur in der Summe heben sich fast alle auf, der Überschuss bleibt als $M_0$ übrig.',
            'Falsch: „Der Überschuss steigt mit dem Quadrat von $B_0$.“ Richtig: Er steigt linear mit $B_0$. Das Signal in der Spule wächst zusätzlich, weil die Präzession schneller wird.',
            'Falsch: „Bei Fieber wird das Bild deutlich schlechter.“ Richtig: Formal sinkt der Überschuss mit $T$, aber 1 K mehr bei 310 K ändert ihn nur um rund 0,3 %.',
          ],
        },
        {
          type: 'exam',
          question: 'Schätze den relativen Besetzungsüberschuss der Protonen bei 3 T und 37 °C ab. Warum entsteht trotz dieser kleinen Zahl ein messbares Signal?',
          answer: 'Der Abstand der Energieniveaus ist $\\Delta E = \\gamma\\hbar B_0 \\approx 8{,}5\\cdot10^{-26}$ J, die Wärmeenergie $kT \\approx 4{,}3\\cdot10^{-21}$ J. Da $\\Delta E \\ll kT$, gilt näherungsweise $(N_\\uparrow - N_\\downarrow)/N \\approx \\gamma\\hbar B_0/(2kT) \\approx 10^{-5}$, also rund 10 ppm. Weil schon 1 ml Wasser etwa $6{,}7\\cdot10^{22}$ Protonen enthält, bleiben rund $7\\cdot10^{17}$ Überschuss-Protonen. Ihre Summe ergibt eine messbare Nettomagnetisierung $M_0$.',
          full: 'Nenne die Boltzmann-Näherung, die lineare Abhängigkeit von $B_0$ und die umgekehrte von $T$, und vergleiche mit 1,5 T (etwa 5 ppm, halbes Signal).',
          sim: 'ensemble',
        },
      ],
    },
    {
      title: 'Das rotierende Bezugssystem: der Karussell-Trick',
      blocks: [
        {
          type: 'analogy',
          title: 'Auf dem Karussell steht alles still',
          text: 'Stell dir vor, du sitzt auf einem Karussell. Dein Freund sitzt auf dem Pferd neben dir. Für die Leute am Rand saust ihr beide im Kreis herum. Für dich sitzt dein Freund einfach still neben dir. Hebt er langsam den Arm, siehst du nur, wie der Arm nach oben geht. Die Leute am Rand sehen dagegen eine komplizierte Schraubenbewegung. Beides ist dieselbe Bewegung, nur von zwei verschiedenen Standpunkten aus.',
        },
        {
          type: 'p',
          text: 'Genau diesen Standpunktwechsel macht man in der MRT. Schauen wir zuerst aus dem **Laborsystem**, also so, wie das Gerät im Raum steht. Hier wirken zwei Felder gleichzeitig auf die Magnetisierung M:',
        },
        {
          type: 'list',
          items: [
            '**Das Hauptfeld $B_0$** entlang z. Es ist riesig (zum Beispiel 1,5 T) und lässt M mit der Larmor-Frequenz $f_0$ kreisen, bei 1,5 T rund 64 Millionen Mal pro Sekunde.',
            '**Das HF-Feld $B_1$** in der xy-Ebene. Es ist winzig, typischerweise nur einige Mikrotesla. Es dreht sich selbst mit $f_0$ im Kreis, im gleichen Drehsinn wie die Spins.',
          ],
        },
        {
          type: 'p',
          text: 'Was macht M unter beiden Feldern? Sie kreist schnell um z und wird dabei von $B_1$ ganz langsam nach unten gezogen. Die Spitze von M zeichnet eine **Spirale** vom Nordpol bis in die Äquatorebene. Diese Kombination aus Kippen und Kreisen nennt man **Nutation plus Präzession**. Ein Zahlenbeispiel zeigt, wie extrem das ist: Mit $B_1 = 10\\ \\mu$T dauert ein 90°-Puls etwa 0,6 ms. In dieser Zeit kreist M bei 1,5 T rund 37 500 Mal. Die Spirale hat also zehntausende Windungen.',
        },
        {
          type: 'p',
          text: 'Jetzt der Trick. Wir setzen uns gedanklich auf ein Karussell, das sich mit genau $f_0$ um die z-Achse dreht. Dieses **rotierende Bezugssystem** hat die Achsen $x\', y\', z$. Zwei Dinge passieren:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Die schnelle Präzession um $B_0$ verschwindet. Wir drehen ja mit, also sieht M bei Resonanz so aus, als gäbe es gar kein $B_0$.',
            '$B_1$ steht still, weil es genauso schnell kreist wie wir. Wir legen die Achse so, dass $B_1$ auf $x\'$ liegt.',
          ],
        },
        {
          type: 'p',
          text: 'Übrig bleibt ein einziges ruhendes Feld $B_1$ entlang $x\'$. Und um ein ruhendes Feld präzediert M ganz normal, nur viel langsamer. M **kippt auf einem Großkreis um $x\'$**, von z in Richtung $y\'$. Die Winkelgeschwindigkeit dieses Kippens ist $\\omega_1 = \\gamma B_1$. Daher kommt auch die Flipwinkel-Formel $\\alpha = \\gamma B_1 \\tau$ für einen Rechteckpuls der Dauer $\\tau$.',
        },
        {
          type: 'formula',
          tex: '\\omega_1 = \\gamma B_1, \\qquad f_1 = \\bar\\gamma B_1 \\approx 426\\ \\text{Hz bei } B_1 = 10\\ \\mu\\text{T}',
          caption: 'Kipp-Frequenz im rotierenden System: winzig im Vergleich zu f₀ = 64 MHz',
        },
        { type: 'figure', id: 'rotating-frame', caption: 'Links im Laborsystem schraubt sich die Spitze von M auf einer Spirale vom Nordpol zum Äquator (in echt mit zehntausenden Windungen), während $B_1$ in der xy-Ebene mitkreist. Rechts im mitrotierenden System steht $B_1$ still auf $x\'$, und M kippt einfach auf einem Großkreis um diese Achse.' },
        {
          type: 'p',
          text: 'Jetzt verstehst du auch die Formeln im Skript. Dort steht der HF-Puls als $B_1\\cos(\\omega_0 t)$ und $B_1\\sin(\\omega_0 t)$. Das sind die x- und die y-Komponente **eines** Pfeils der Länge $B_1$, der mit $\\omega_0$ in der xy-Ebene kreist. Setzt man $B_x = B_1\\cos\\omega_0 t$, $B_y = -B_1\\sin\\omega_0 t$ und $B_z = B_0$ in die Bloch-Gleichung ein, bekommt man die Form aus dem Skript. Das Minuszeichen sorgt dafür, dass $B_1$ im gleichen Drehsinn kreist wie die Protonen.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\frac{dM_x}{dt} &= \\gamma\\,(M_y B_0 + M_z B_1 \\sin\\omega_0 t) \\\\ \\frac{dM_y}{dt} &= \\gamma\\,(M_z B_1 \\cos\\omega_0 t - M_x B_0) \\\\ \\frac{dM_z}{dt} &= -\\gamma\\,(M_x B_1 \\sin\\omega_0 t + M_y B_1 \\cos\\omega_0 t) \\end{aligned}',
          caption: 'Bloch-Gleichung im Laborsystem mit kreisendem HF-Feld, ohne Relaxation',
        },
        {
          type: 'p',
          text: 'Im Laborsystem stecken die schnellen Sinus- und Kosinusterme drin, darum ist die Bewegung so kompliziert. Im rotierenden System fallen sie weg, und es bleibt nur die einfache Drehung um $B_1$.',
        },
        {
          type: 'p',
          text: '**Kurz zur Off-Resonanz:** Liegt die HF-Frequenz um $\\Delta f$ neben $f_0$, dreht das Karussell etwas zu schnell oder zu langsam. Dann bleibt im rotierenden System ein kleiner Rest von $B_0$ entlang z übrig. M kippt jetzt um eine schräge Achse und erreicht den Äquator nicht mehr. Ist $\\Delta f$ groß, wackelt M nur noch ein bisschen. Das ist die Resonanzbedingung, diesmal als Bild.',
        },
        {
          type: 'mnemonic',
          text: '**Wer mitdreht, sieht nur das Kippen.** Im Labor eine Spirale, auf dem Karussell mit $f_0$ ein einfacher Großkreis um $B_1$.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Im rotierenden System gibt es keine Präzession mehr, also auch kein Signal.“ Richtig: Das rotierende System ist nur ein Rechentrick. Die Spule steht im Labor und misst weiterhin eine Wechselspannung mit $f_0$.',
            'Falsch: „$B_1$ ist ein zweites starkes Magnetfeld.“ Richtig: $B_1$ ist rund hunderttausendmal schwächer als $B_0$. Es wirkt nur, weil es im Takt mitläuft.',
          ],
        },
        {
          type: 'exam',
          question: 'Wozu benutzt man das rotierende Bezugssystem? Beschreibe die Bewegung von M während eines 90°-Pulses im Laborsystem und im rotierenden System.',
          answer: 'Im Laborsystem präzediert M mit $f_0$ um $B_0$ und wird gleichzeitig vom schwachen, mit $f_0$ kreisenden Feld $B_1$ langsam gekippt. Die Spitze von M läuft auf einer Spirale vom Nordpol in die xy-Ebene. Im System, das mit $f_0$ um z rotiert, verschwindet bei Resonanz die Wirkung von $B_0$, und $B_1$ steht still auf $x\'$. M kippt dann einfach mit $\\omega_1 = \\gamma B_1$ auf einem Großkreis um $x\'$, nach einem 90°-Puls liegt M auf $y\'$.',
          full: 'Erkläre, dass $B_1\\cos(\\omega_0 t)$ und $B_1\\sin(\\omega_0 t)$ im Skript die Komponenten des kreisenden HF-Feldes sind, und dass bei Off-Resonanz ein Restfeld entlang z bleibt.',
          sim: 'larmor',
        },
      ],
    },
    {
      title: 'Die Bloch-Simulation aus dem Skript lesen',
      blocks: [
        {
          type: 'analogy',
          title: 'Ein Kreispendel von oben',
          text: 'Hänge eine Kugel an ein langes Seil und schau von oben darauf. Gibst du ihr bei jedem Umlauf im richtigen Moment einen kleinen Schubs, werden die Kreise immer größer. Hörst du auf, bremst die Luft sie langsam ab, die Kreise werden kleiner, bis die Kugel wieder in der Mitte hängt. Von oben siehst du eine Spirale nach außen und dann eine nach innen. Genau so liest du das Phasendiagramm im Skript.',
        },
        {
          type: 'p',
          text: 'Im Skript stehen zwei Abbildungen zu einer **Simulation der Bloch-Gleichungen**: ein Zeitverlauf und ein Phasendiagramm. Beide zeigen dasselbe Experiment, nur auf zwei Arten. Gerechnet wird im **Laborsystem** mit einem HF-Puls aus $B_x$ und $B_y$.',
        },
        {
          type: 'p',
          text: '**Darstellung 1, der Zeitverlauf.** Auf der waagrechten Achse steht die Zeit, senkrecht die Quermagnetisierung $M_x$ und $M_y$. Vorher ist alles null, denn M zeigt entlang z. Während des HF-Pulses beginnen $M_x$ und $M_y$ zu schwingen, und die Schwingung wird immer größer. Nach dem Puls schwingen sie weiter mit $f_0$, aber die Hülle klingt ab. Das ist die T2-Relaxation. $M_x$ und $M_y$ sind um eine Viertelperiode gegeneinander verschoben, wie Kosinus und Sinus: Das ist die Spur eines Pfeils, der im Kreis läuft.',
        },
        {
          type: 'p',
          text: '**Darstellung 2, das Phasendiagramm.** Jetzt trägt man $M_y$ gegen $M_x$ auf. Die Zeit verschwindet aus dem Bild, du schaust gewissermaßen von oben auf die xy-Ebene. Jede Windung ist ein Larmor-Umlauf. Der Abstand vom Mittelpunkt ist der Betrag der Quermagnetisierung $M_{xy}$, also genau das, was die Spule als Signal sieht.',
        },
        {
          type: 'list',
          items: [
            '**Spirale nach außen = Anregung:** Der HF-Puls kippt M von der z-Achse weg, die Querkomponente wächst Umlauf für Umlauf.',
            '**Spirale nach innen = Relaxation:** Nach dem Puls verlieren die Spins ihre Phasenkohärenz, $M_{xy}$ schrumpft mit T2, die Spirale zieht sich zur Mitte zusammen.',
            '**Mittelpunkt:** keine Quermagnetisierung, M zeigt (wieder) entlang $B_0$.',
          ],
        },
        { type: 'figure', id: 'bloch-phase', caption: 'Echt gerechnet mit der Bloch-Gleichung in normierter Zeit: Während des HF-Pulses wachsen $M_x$ und $M_y$ (oben), und die Spirale läuft nach außen (pink). Danach klingt das Signal mit T2 ab, und die Spirale läuft nach innen (blau). Der Radius ist das Signal.' },
        {
          type: 'p',
          text: '**Warum ist die Zeitachse normiert?** Mit echten Zahlen wäre die Simulation unbrauchbar. Bei 64 MHz dauert ein Umlauf 16 ns, T2 von Gewebe liegt bei rund 100 ms. Bis das Signal abgeklungen ist, gäbe es also Millionen Umläufe. Die würde man weder sehen noch vernünftig rechnen können. Darum misst man die Zeit in Einheiten einer Bezugszeit (hier läuft sie von 0 bis 1) und wählt die Larmor-Frequenz so, dass nur einige Dutzend Umläufe hineinpassen. Die Verhältnisse sind dann unrealistisch, aber das Verhalten bleibt genau gleich: kreisen, anwachsen, abklingen.',
        },
        {
          type: 'formula',
          tex: 't\' = \\frac{t}{t_\\text{ref}}, \\qquad \\omega_0\' = \\omega_0\\, t_\\text{ref}',
          caption: 'normierte Zeit t′ und normierte Larmor-Frequenz ω₀′ ohne Einheit',
        },
        {
          type: 'p',
          text: 'Auch die Zahlen an den Achsen im Skript sind Einheiten der Simulation. Achte auf die **Form**, nicht auf die Zahlenwerte.',
        },
        {
          type: 'p',
          text: '**Brücke zu Lab 3:** Dort lässt du solche Bloch-Modelle selbst laufen, veränderst $B_0$ und vergleichst mit der Theorie. Darauf kannst du achten:',
        },
        {
          type: 'list',
          items: [
            '**Mehr Umläufe:** Doppeltes $B_0$ heißt doppelte Larmor-Frequenz. Im gleichen Zeitfenster zählst du doppelt so viele Schwingungen von $M_x$. Das prüfst du direkt mit $f_0 = \\bar\\gamma B_0$.',
            '**Gleiche Hülle:** In der einfachen Bloch-Gleichung sind T1 und T2 feste Eingaben. Das Abklingen bleibt also gleich, egal wie groß $B_0$ ist.',
            '**Resonanz verloren:** Wird die Frequenz des HF-Pulses nicht mit angepasst, ist der Puls plötzlich neben der Resonanz. Dann wächst die Spirale kaum noch, M wird nur wenig gekippt.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Raus beim Puls, rein beim Relaxieren, der Radius ist das Signal.** Und die Zeit ist normiert, damit man die Umläufe überhaupt sehen kann.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Wenn die Spirale nach innen läuft, hören die Spins auf zu kreisen.“ Richtig: Sie kreisen weiter mit $f_0$. Nur ihre Summe in der xy-Ebene schrumpft, weil sie außer Takt geraten.',
            'Falsch: „Die Spirale ist der Weg eines einzelnen Protons.“ Richtig: Sie ist die Spitze der Gesamtmagnetisierung M, von oben auf die xy-Ebene projiziert.',
          ],
        },
        {
          type: 'exam',
          question: 'Im Skript ist eine Bloch-Simulation als Phasendiagramm $M_y$ gegen $M_x$ gezeigt. Erkläre die beiden Teile der Spirale und warum die Zeitachse normiert ist.',
          answer: 'Während des HF-Pulses wird M aus der z-Richtung gekippt, die präzedierende Querkomponente wächst, die Spirale läuft nach außen (Anregung). Nach dem Puls präzediert M weiter mit der Larmor-Frequenz, aber die Quermagnetisierung zerfällt durch T2-Relaxation, die Spirale läuft nach innen (Relaxation). Der Radius entspricht $M_{xy}$, also dem Signal. Die Zeit ist normiert, weil bei echten Werten (Periode 16 ns, T2 rund 100 ms) Millionen Umläufe nicht darstellbar wären. Das qualitative Verhalten bleibt dabei erhalten.',
          full: 'Ergänze, dass $M_x$ und $M_y$ im Zeitverlauf um 90° phasenverschoben schwingen und dass bei höherem $B_0$ mehr Umläufe pro Zeit auftreten (Lab 3).',
          sim: 'signal',
        },
      ],
    },
    {
      title: 'Energie, Photon, Resonanz: ΔE = h·f₀',
      blocks: [
        {
          type: 'analogy',
          title: 'Eine Treppenstufe für Lichtteilchen',
          text: 'Stell dir eine Treppe mit genau einer Stufe vor. Ein Ball kommt nur nach oben, wenn er exakt die Energie für diese Stufe mitbringt. Ist er zu schwach, fällt er zurück. Ist er zu stark, passt er auch nicht, denn eine halbe Stufe extra gibt es nicht. In der Quantenwelt ist der Ball ein **Photon**, ein Lichtteilchen der Radiowelle, und die Stufe ist der Abstand der beiden Spin-Energien.',
        },
        {
          type: 'p',
          text: 'Du kennst schon die Aufspaltung der Energie im Feld, die **Zeeman-Aufspaltung**: $\\Delta E = \\gamma\\hbar B_0$. Und du kennst die Larmor-Frequenz $\\omega_0 = \\gamma B_0$. Setzt man beides zusammen, passiert etwas Schönes:',
        },
        {
          type: 'formula',
          tex: '\\Delta E = \\gamma\\hbar B_0 = \\hbar\\,\\omega_0 = h\\, f_0',
          caption: 'denn ħ = h/2π und ω₀ = 2π f₀',
        },
        {
          type: 'p',
          text: 'Hier ist $h = 6{,}63\\cdot10^{-34}$ J·s das Plancksche Wirkungsquantum und $f_0$ die Larmor-Frequenz. Die Formel sagt: Ein Photon hat genau dann die passende Energie für den Sprung, wenn seine Frequenz **gleich der Larmor-Frequenz** ist. Das ist kein Zufall. Das Quantenbild (Stufe) und das klassische Bild (kreisender Kreisel) beschreiben dieselbe Physik und liefern darum dieselbe Zahl.',
        },
        {
          type: 'table',
          head: ['', 'Klassisches Bild', 'Quantenbild'],
          rows: [
            ['Bild', 'Schaukel, im Takt anschubsen', 'Treppenstufe, Ball mit passender Energie'],
            ['Was passiert?', 'B₁ kreist mit f₀ und kippt M', 'Photon mit h·f₀ hebt Spins auf die obere Stufe'],
            ['Falsche Frequenz', 'Schubse verpuffen, M kippt kaum', 'Photon passt nicht, kein Übergang'],
            ['Bedingung', 'f_HF = f₀', 'h·f_HF = ΔE'],
          ],
        },
        {
          type: 'p',
          text: 'Im Quantenbild gibt es noch eine feine Pointe. Ein Photon kann einen Spin nach oben heben (Absorption), aber auch einen Spin von oben nach unten schubsen (stimulierte Emission). Beides ist gleich wahrscheinlich. Netto wird nur deshalb Energie aufgenommen, weil unten ein paar Spins mehr sitzen. Der Boltzmann-Überschuss von einigen ppm ist also auch hier das ganze Kapital.',
        },
        {
          type: 'p',
          text: 'Wie viel Energie trägt so ein Photon? Bei 1,5 T ist $f_0 \\approx 64$ MHz:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} E = h f_0 &= 6{,}63\\cdot10^{-34}\\ \\text{J\\,s}\\cdot 6{,}4\\cdot10^{7}\\ \\text{Hz} \\\\ &\\approx 4{,}2\\cdot10^{-26}\\ \\text{J} \\approx 2{,}6\\cdot10^{-7}\\ \\text{eV} \\end{aligned}',
        },
        {
          type: 'table',
          head: ['Strahlung', 'Photonenenergie', 'ionisierend?'],
          rows: [
            ['HF bei 64 MHz (MRT)', '≈ 3·10⁻⁷ eV', 'nein'],
            ['sichtbares Licht', '≈ 2 eV', 'nein'],
            ['Schwelle zur Ionisation', '≈ 10 eV', 'ab hier'],
            ['Röntgen, CT', '10⁴ bis 10⁵ eV', 'ja'],
          ],
        },
        { type: 'figure', id: 'zeeman-photon', caption: 'Links wächst der Abstand der beiden Energiestufen linear mit $B_0$, und ein Photon mit $h\\cdot f_0$ passt genau hinein. Rechts siehst du auf logarithmischer Skala: Das HF-Photon liegt rund elf Zehnerpotenzen unter Röntgen und weit unter der Ionisationsschwelle.' },
        {
          type: 'p',
          text: 'Ein HF-Photon ist also rund **hundert Milliarden Mal schwächer** als ein Röntgenphoton. Um ein Elektron aus einem Molekül zu schlagen, braucht man etwa 10 eV. Davon ist die MRT unvorstellbar weit entfernt. Darum ist sie **nicht ionisierend** und schädigt die DNA nicht direkt. Was HF-Energie in großer Menge kann, ist Gewebe leicht erwärmen. Dafür gibt es Grenzwerte, die das Gerät überwacht.',
        },
        {
          type: 'p',
          text: 'Übrigens: Die Wärmeenergie $kT$ liegt bei 37 °C bei rund 0,027 eV. Das ist hunderttausendmal mehr als die Stufe $h f_0$. Genau deshalb ist der Boltzmann-Überschuss so klein.',
        },
        {
          type: 'mnemonic',
          text: '**Stufe gleich Photon gleich Larmor: ΔE = h·f₀.** Und dieses Photon ist so schwach, dass es nichts ionisieren kann.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „MRT arbeitet mit Strahlung, also ist sie ionisierend wie Röntgen.“ Richtig: Radiowellen sind elektromagnetische Strahlung, aber ihre Photonen haben rund $10^{-7}$ eV, weit unter den etwa 10 eV für Ionisation.',
            'Falsch: „Bei 3 T ist die Frequenz doppelt so hoch, also wird es gefährlich ionisierend.“ Richtig: Auch bei 128 MHz liegt das Photon bei rund $5\\cdot10^{-7}$ eV, also immer noch elf Zehnerpotenzen unter Röntgen.',
            'Falsch: „Jede Radiowelle kippt die Spins, man muss nur genug Leistung nehmen.“ Richtig: Nur die Resonanzfrequenz passt zur Stufe. Neben der Resonanz verpufft die Energie.',
          ],
        },
        {
          type: 'exam',
          question: 'Zeige, dass die Energie des absorbierten HF-Photons genau zur Larmor-Frequenz passt, und begründe, warum die MRT keine ionisierende Strahlung verwendet.',
          answer: 'Im Feld $B_0$ spalten die Spinzustände um $\\Delta E = \\gamma\\hbar B_0$ auf. Mit $\\omega_0 = \\gamma B_0$ und $\\hbar = h/2\\pi$ folgt $\\Delta E = \\hbar\\omega_0 = h f_0$. Ein Übergang wird also genau von Photonen mit der Larmor-Frequenz angeregt (Resonanz). Bei 1,5 T ist $f_0 \\approx 64$ MHz, die Photonenenergie $h f_0 \\approx 2{,}6\\cdot10^{-7}$ eV. Zur Ionisation braucht man etwa 10 eV, Röntgenphotonen haben $10^4$ bis $10^5$ eV. Die HF-Photonen liegen viele Zehnerpotenzen darunter und können nicht ionisieren.',
          full: 'Nenne das klassische Gegenstück (B₁ muss im Takt der Präzession kreisen) und erwähne, dass HF-Energie Gewebe erwärmen kann.',
          sim: 'larmor',
        },
      ],
    },
    {
      title: 'Molekulare Bewegung: Warum T1 und T2 vom Gewebe abhängen',
      blocks: [
        {
          type: 'analogy',
          title: 'Zufällige Schubser an der Schaukel',
          text: 'Ein Kind sitzt auf einer Schaukel, um sie herum toben andere Kinder und stoßen zufällig dagegen. Kommen die Stöße wahnsinnig schnell hintereinander, hin und her, heben sie sich auf, die Schaukel merkt kaum etwas. Kommt nur einmal pro Stunde ein Stoß, passiert auch wenig. Am meisten bewegt sich die Schaukel, wenn die zufälligen Stöße ungefähr **im Takt der Schaukel** kommen. Genau so geben die Spins ihre Energie ab: am besten, wenn die Umgebung im Takt der Larmor-Frequenz wackelt.',
        },
        {
          type: 'p',
          text: 'Jedes Proton spürt nicht nur $B_0$. Seine Nachbarn sind selbst kleine Magnete, Protonen im gleichen oder im nächsten Molekül. Sie erzeugen am Ort des Protons ein winziges **lokales Magnetfeld**. Weil sich die Moleküle ständig drehen und verschieben, ändert sich dieses lokale Feld dauernd. Es **schwankt zufällig**.',
        },
        {
          type: 'p',
          text: 'Wie schnell es schwankt, beschreibt die **Korrelationszeit** $\\tau_c$: grob die Zeit, in der sich ein Molekül einmal merklich gedreht hat. Kleine, freie Moleküle wie Wasser drehen sich extrem schnell, in Pikosekunden. Große oder gebundene Moleküle sind viel träger.',
        },
        {
          type: 'p',
          text: '**T1 braucht den richtigen Takt.** Damit ein Spin seine Energie an das Gitter abgeben kann, muss das schwankende Feld eine Komponente bei der Larmor-Frequenz haben. Das ist am besten erfüllt, wenn die Schwankungen etwa im Takt von $f_0$ liegen:',
        },
        {
          type: 'formula',
          tex: '\\omega_0\\,\\tau_c \\approx 1 \\quad\\Rightarrow\\quad \\tau_c \\approx \\frac{1}{2\\pi\\cdot 64\\ \\text{MHz}} \\approx 2{,}5\\ \\text{ns}',
          caption: 'Bedingung für das kürzeste T1, Zahlenwert bei 1,5 T',
        },
        {
          type: 'list',
          items: [
            '**Freies Wasser, Liquor:** Die Moleküle sind viel zu schnell. Die Schwankungen verteilen sich auf riesige Frequenzen, bei $f_0$ ist kaum etwas übrig. Die Energieabgabe ist schlecht, **T1 lang**. Gleichzeitig mitteln sich die schnellen Schwankungen für die Phase heraus: **T2 auch lang**, fast so lang wie T1.',
            '**Fett:** Mittelgroße Moleküle, deren Bewegung gut zum Takt von $f_0$ passt. Die Energie fließt effizient ab, **T1 kurz**.',
            '**Gewebe mit gebundenem Wasser:** Wasser haftet zum Teil an Proteinen und Membranen und wird träger. T1 liegt im mittleren Bereich, **T2 wird deutlich kürzer**.',
            '**Knochen, Sehnen, Festkörper:** Fast keine Bewegung. Für T1 viel zu langsam, **T1 lang**. Für T2 aber fatal: **T2 extrem kurz**, das Signal ist verschwunden, bevor man misst. Darum ist Knochen dunkel.',
          ],
        },
        {
          type: 'p',
          text: '**Warum fällt T2 einfach immer weiter?** Für T2 zählen nicht nur Schwankungen bei $f_0$, sondern auch **langsame und fast ruhende** lokale Felder. Ein Spin, der länger ein etwas stärkeres Feld spürt, kreist etwas schneller als sein Nachbar und gerät außer Takt. Je träger die Moleküle, desto länger halten diese Unterschiede an, desto schneller dephasiert alles. Darum hat T1 ein Minimum, T2 aber fällt mit langsamer werdender Bewegung immer weiter. Dieses Bild heißt nach seinen Entdeckern **BPP-Modell** (Bloembergen, Purcell, Pound).',
        },
        { type: 'figure', id: 'molecular-motion', caption: 'Schematisch nach dem BPP-Bild: Links bei schneller Bewegung sind T1 und T2 lang und fast gleich. T1 (grün) hat sein Minimum dort, wo die Bewegung im Takt von $f_0$ liegt, T2 (violett) fällt nach rechts immer weiter. Die gestrichelte Kurve zeigt T1 bei höherem $B_0$.' },
        {
          type: 'p',
          text: '**Warum wächst T1 meist mit $B_0$?** Mehr Feld heißt höhere Larmor-Frequenz. Der „richtige Takt“ verschiebt sich zu schnelleren Bewegungen. Die meisten Gewebe liegen auf der langsamen Seite des Minimums. Für sie gibt es bei der höheren Frequenz noch weniger passende Schwankungen, die Energieabgabe wird schlechter, **T1 wird länger**. T2 ändert sich dagegen nur wenig.',
        },
        {
          type: 'p',
          text: 'Im Skript steht bei der T2-Relaxation der kurze Satz „**sensitive to water mobility**“, also empfindlich für die Beweglichkeit des Wassers. Genau das steckt dahinter: Bewegliches Wasser hat ein langes T2 und leuchtet im T2-gewichteten Bild hell, zum Beispiel Liquor oder ein Ödem. Gebundenes Wasser und festes Gewebe haben ein kurzes T2 und bleiben dunkel.',
        },
        {
          type: 'mnemonic',
          text: '**T1 mag den Takt, T2 hasst das Stillstehen.** T1 ist am kürzesten, wenn die Moleküle im Larmor-Takt wackeln (Fett). T2 wird umso kürzer, je träger die Moleküle sind (Knochen).',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Je beweglicher die Moleküle, desto kürzer T1.“ Richtig: T1 hat ein Minimum. Sehr schnelles freies Wasser hat ein langes T1, genauso wie fast starres Gewebe.',
            'Falsch: „Knochen ist dunkel, weil er keine Protonen enthält.“ Richtig: Er enthält Protonen, aber kaum bewegliche. Ihr T2 ist so kurz, dass das Signal vor der Messung verschwunden ist.',
          ],
        },
        {
          type: 'exam',
          question: 'Erkläre qualitativ, warum freies Wasser lange T1- und T2-Zeiten hat, Fett ein kurzes T1 und festes Gewebe ein sehr kurzes T2.',
          answer: 'Die Relaxation wird von zufällig schwankenden lokalen Magnetfeldern benachbarter Kerne ausgelöst, die durch die Molekülbewegung entstehen (Korrelationszeit $\\tau_c$). T1 erfordert Schwankungen nahe der Larmor-Frequenz und ist am kürzesten bei $\\omega_0\\tau_c \\approx 1$. Fett liegt nahe an diesem Optimum, darum kurzes T1. Freies Wasser bewegt sich viel zu schnell, die Felder mitteln sich heraus, T1 und T2 sind lang. Bei festem Gewebe sind die Schwankungen sehr langsam: Für T1 ineffizient (T1 lang), aber die fast statischen Felder dephasieren die Spins sehr schnell, darum ist T2 extrem kurz.',
          full: 'Erwähne, dass T1 mit $B_0$ meist zunimmt, weil sich das Optimum zu schnelleren Bewegungen verschiebt, und dass das Skript T2 als „sensitive to water mobility“ beschreibt.',
          sim: 'relaxation',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'Посчитаем: насколько велик больцмановский избыток?',
      blocks: [
        {
          type: 'analogy',
          title: 'Весы почти в равновесии',
          text: 'Представь рычажные весы. На каждой чаше лежит по полмиллиона рисовых зёрен. Слева всего на пять зёрен больше. Глазом разницы не видно, но весы чуть-чуть наклоняются. Со спинами то же самое: почти все компенсируют друг друга. Важен только крошечный остаток, и сейчас мы его честно посчитаем.',
        },
        {
          type: 'p',
          text: 'Ты уже знаешь: в поле $B_0$ есть два энергетических уровня, и нижний заселён чуть сильнее. Но насколько «чуть»? Для этого сравним две энергии. Первая: **расстояние между уровнями** $\\Delta E = \\gamma\\hbar B_0$. Вторая: **тепловая энергия** $kT$, то есть типичная «тряска» из-за температуры.',
        },
        {
          type: 'list',
          items: [
            '$\\gamma = 2{,}675\\cdot10^8$ рад/(с·Тл): гиромагнитное отношение протона.',
            '$\\hbar = 1{,}055\\cdot10^{-34}$ Дж·с: приведённая постоянная Планка.',
            '$k = 1{,}381\\cdot10^{-23}$ Дж/К: постоянная Больцмана, $T = 310$ К: температура тела (37 °C).',
          ],
        },
        {
          type: 'p',
          text: 'При 1,5 Тл получаем $\\Delta E \\approx 4{,}2\\cdot10^{-26}$ Дж. Тепловая энергия $kT \\approx 4{,}3\\cdot10^{-21}$ Дж. Ступенька примерно **в сто тысяч раз меньше**, чем тепловой беспорядок. Неудивительно, что спины почти не удаётся упорядочить.',
        },
        {
          type: 'p',
          text: 'Распределение Больцмана говорит, каково отношение двух заселённостей. Поскольку $\\Delta E$ очень мало по сравнению с $kT$, экспоненту можно заменить первым приближением. Получается очень простая формула для **относительного избытка**:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\frac{N_\\uparrow}{N_\\downarrow} &= e^{\\Delta E/kT} \\approx 1 + \\frac{\\Delta E}{kT} \\\\ \\frac{N_\\uparrow - N_\\downarrow}{N} &\\approx \\frac{\\Delta E}{2kT} = \\frac{\\gamma\\hbar B_0}{2kT} \\end{aligned}',
          caption: '$N_\\uparrow$: параллельно (внизу), $N_\\downarrow$: антипараллельно (вверху), $N$: все спины',
        },
        {
          type: 'table',
          head: ['Поле B₀', '1,5 Тл', '3 Тл', '7 Тл'],
          rows: [
            ['Избыток', '≈ 4,9 ppm', '≈ 9,9 ppm', '≈ 23 ppm'],
            ['из 1 миллиона спинов', '≈ на 5 больше параллельно', '≈ на 10 больше параллельно', '≈ на 23 больше параллельно'],
          ],
        },
        {
          type: 'p',
          text: '«ppm» означает parts per million, то есть миллионные доли. При 1,5 Тл из миллиона спинов примерно 500 002 стоят параллельно и 499 998 антипараллельно. Это совпадает с правилом из основной части: около 3 ppm на тесла.',
        },
        { type: 'figure', id: 'boltzmann-excess', caption: 'Слева два столбца для 1,5 Тл практически одинаковы, и только лупа показывает разницу в 4 спина. Справа видно, что избыток растёт строго линейно с $B_0$: около 5 ppm при 1,5 Тл и 10 ppm при 3 Тл, рассчитано по $\\gamma\\hbar B_0/(2kT)$.' },
        {
          type: 'p',
          text: 'Звучит безнадёжно мало? Вот в чём хитрость: протонов **невообразимо много**. Миллилитр воды весит 1 г. Это $1/18$ моля молекул воды, то есть около $3{,}3\\cdot10^{22}$ молекул. В каждой два ядра водорода. Итого около $6{,}7\\cdot10^{22}$ протонов.',
        },
        {
          type: 'formula',
          tex: '6{,}7\\cdot10^{22} \\cdot 4{,}9\\cdot10^{-6} \\approx 3\\cdot10^{17}',
          caption: 'избыточные протоны в 1 мл воды при 1,5 Тл',
        },
        {
          type: 'p',
          text: 'В одном миллилитре параллельно стоит примерно на $3\\cdot10^{17}$ протонов больше, чем антипараллельно, это 300 квадриллионов. Элемент изображения (воксель) объёмом 1 мм³ в тысячу раз меньше и всё ещё содержит около $3\\cdot10^{14}$ избыточных протонов. Их сумма и есть измеримая намагниченность $M_0$.',
        },
        {
          type: 'formula',
          tex: 'M_0 \\approx \\frac{N\\,\\gamma^2\\hbar^2 B_0}{4kT}',
          caption: 'равновесная намагниченность: пропорциональна B₀ и обратно пропорциональна T',
        },
        {
          type: 'p',
          text: 'Почему **больше поле, больше сигнал**? Удвоенное $B_0$ удваивает избыток, а значит, и $M_0$. Кроме того, намагниченность вращается вдвое быстрее, а быстрее вращающийся магнит наводит в катушке большее напряжение. Поскольку шум с полем тоже немного растёт, на практике остаётся простое правило: **3 Тл дают примерно вдвое большее отношение сигнал/шум, чем 1,5 Тл.** Охладить пациента, наоборот, нельзя: температура фиксирована, 37 °C.',
        },
        {
          type: 'mnemonic',
          text: '**Пять на миллион при 1,5 Тл, десять при 3 Тл.** Крошечно на спин, огромно в сумме: $\\gamma\\hbar B_0/(2kT)$ умножить на $10^{22}$ протонов в миллилитре.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Прецессируют только 5 избыточных спинов на миллион, остальные покоятся». Верно: прецессируют все спины. Просто в сумме почти все компенсируются, а избыток остаётся в виде $M_0$.',
            'Неверно: «Избыток растёт пропорционально квадрату $B_0$». Верно: он растёт линейно с $B_0$. Сигнал в катушке растёт дополнительно, потому что прецессия становится быстрее.',
            'Неверно: «При высокой температуре тела изображение заметно ухудшается». Верно: формально избыток падает с ростом $T$, но лишний 1 К при 310 К меняет его всего примерно на 0,3 %.',
          ],
        },
        {
          type: 'exam',
          question: 'Оцени относительный избыток заселённости протонов при 3 Тл и 37 °C. Почему, несмотря на такое маленькое число, возникает измеримый сигнал?',
          answer: 'Расстояние между уровнями $\\Delta E = \\gamma\\hbar B_0 \\approx 8{,}5\\cdot10^{-26}$ Дж, тепловая энергия $kT \\approx 4{,}3\\cdot10^{-21}$ Дж. Так как $\\Delta E \\ll kT$, приближённо $(N_\\uparrow - N_\\downarrow)/N \\approx \\gamma\\hbar B_0/(2kT) \\approx 10^{-5}$, то есть около 10 ppm. Поскольку уже 1 мл воды содержит около $6{,}7\\cdot10^{22}$ протонов, остаётся примерно $7\\cdot10^{17}$ избыточных протонов. Их сумма даёт измеримую результирующую намагниченность $M_0$.',
          full: 'Назови больцмановское приближение, линейную зависимость от $B_0$ и обратную от $T$, сравни с 1,5 Тл (около 5 ppm, вдвое меньший сигнал).',
          sim: 'ensemble',
        },
      ],
    },
    {
      title: 'Вращающаяся система отсчёта: трюк с каруселью',
      blocks: [
        {
          type: 'analogy',
          title: 'На карусели всё стоит на месте',
          text: 'Представь, что ты сидишь на карусели. Рядом на лошадке сидит друг. Для людей вокруг вы оба мчитесь по кругу. А для тебя друг просто спокойно сидит рядом. Если он медленно поднимает руку, ты видишь только, как рука идёт вверх. Люди снаружи видят сложное винтовое движение. Это одно и то же движение, просто с двух разных точек зрения.',
        },
        {
          type: 'p',
          text: 'Именно такую смену точки зрения делают в МРТ. Сначала посмотрим из **лабораторной системы**, то есть так, как аппарат стоит в комнате. Здесь на намагниченность M одновременно действуют два поля:',
        },
        {
          type: 'list',
          items: [
            '**Основное поле $B_0$** вдоль z. Оно огромное (например, 1,5 Тл) и заставляет M вращаться с ларморовой частотой $f_0$, при 1,5 Тл около 64 миллионов раз в секунду.',
            '**РЧ-поле $B_1$** в плоскости xy. Оно крошечное, обычно всего несколько микротесла. Оно само вращается по кругу с частотой $f_0$, в ту же сторону, что и спины.',
          ],
        },
        {
          type: 'p',
          text: 'Что делает M под действием обоих полей? Она быстро вращается вокруг z и при этом очень медленно отклоняется полем $B_1$ вниз. Кончик M рисует **спираль** от северного полюса до экваториальной плоскости. Такое сочетание наклона и вращения называют **нутацией плюс прецессией**. Пример показывает, насколько это экстремально: при $B_1 = 10$ мкТл импульс 90° длится около 0,6 мс. За это время при 1,5 Тл M успевает обернуться около 37 500 раз. У спирали десятки тысяч витков.',
        },
        {
          type: 'p',
          text: 'Теперь трюк. Мысленно сядем на карусель, которая вращается вокруг оси z ровно с частотой $f_0$. У этой **вращающейся системы отсчёта** оси $x\', y\', z$. Происходят две вещи:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            'Быстрая прецессия вокруг $B_0$ исчезает. Мы же вращаемся вместе с ней, поэтому при резонансе M выглядит так, будто $B_0$ вообще нет.',
            '$B_1$ стоит на месте, потому что вращается так же быстро, как мы. Оси выбираем так, чтобы $B_1$ лежало на $x\'$.',
          ],
        },
        {
          type: 'p',
          text: 'Остаётся одно неподвижное поле $B_1$ вдоль $x\'$. А вокруг неподвижного поля M прецессирует совершенно обычно, только намного медленнее. M **опрокидывается по большому кругу вокруг $x\'$**, от z в сторону $y\'$. Угловая скорость этого наклона $\\omega_1 = \\gamma B_1$. Отсюда и формула угла отклонения $\\alpha = \\gamma B_1 \\tau$ для прямоугольного импульса длительностью $\\tau$.',
        },
        {
          type: 'formula',
          tex: '\\omega_1 = \\gamma B_1, \\qquad f_1 = \\bar\\gamma B_1 \\approx 426\\ \\text{Гц при } B_1 = 10\\ \\text{мкТл}',
          caption: 'частота наклона во вращающейся системе: крошечная по сравнению с f₀ = 64 МГц',
        },
        { type: 'figure', id: 'rotating-frame', caption: 'Слева, в лабораторной системе, кончик M по спирали ввинчивается от северного полюса к экватору (на самом деле с десятками тысяч витков), а $B_1$ вращается в плоскости xy. Справа, во вращающейся системе, $B_1$ неподвижно лежит на $x\'$, и M просто опрокидывается по большому кругу вокруг этой оси.' },
        {
          type: 'p',
          text: 'Теперь понятны и формулы в лекции. Там РЧ-импульс записан как $B_1\\cos(\\omega_0 t)$ и $B_1\\sin(\\omega_0 t)$. Это x- и y-компоненты **одного** вектора длины $B_1$, который вращается с $\\omega_0$ в плоскости xy. Если подставить $B_x = B_1\\cos\\omega_0 t$, $B_y = -B_1\\sin\\omega_0 t$ и $B_z = B_0$ в уравнение Блоха, получится форма из лекции. Знак минус обеспечивает, что $B_1$ вращается в ту же сторону, что и протоны.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\frac{dM_x}{dt} &= \\gamma\\,(M_y B_0 + M_z B_1 \\sin\\omega_0 t) \\\\ \\frac{dM_y}{dt} &= \\gamma\\,(M_z B_1 \\cos\\omega_0 t - M_x B_0) \\\\ \\frac{dM_z}{dt} &= -\\gamma\\,(M_x B_1 \\sin\\omega_0 t + M_y B_1 \\cos\\omega_0 t) \\end{aligned}',
          caption: 'уравнение Блоха в лабораторной системе с вращающимся РЧ-полем, без релаксации',
        },
        {
          type: 'p',
          text: 'В лабораторной системе в уравнениях сидят быстрые синусы и косинусы, поэтому движение такое сложное. Во вращающейся системе они исчезают, и остаётся только простой поворот вокруг $B_1$.',
        },
        {
          type: 'p',
          text: '**Коротко о нерезонансе:** если частота РЧ отличается от $f_0$ на $\\Delta f$, карусель вращается чуть быстрее или медленнее. Тогда во вращающейся системе вдоль z остаётся небольшой остаток $B_0$. M теперь наклоняется вокруг косой оси и уже не достигает экватора. Если $\\Delta f$ велико, M лишь слегка покачивается. Это условие резонанса, на этот раз в виде картинки.',
        },
        {
          type: 'mnemonic',
          text: '**Кто вращается вместе, видит только наклон.** В лаборатории спираль, на карусели с частотой $f_0$ простой большой круг вокруг $B_1$.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Во вращающейся системе прецессии больше нет, значит, нет и сигнала». Верно: вращающаяся система лишь вычислительный приём. Катушка стоит в лаборатории и по-прежнему измеряет переменное напряжение с частотой $f_0$.',
            'Неверно: «$B_1$ является вторым сильным магнитным полем». Верно: $B_1$ примерно в сто тысяч раз слабее $B_0$. Оно действует только потому, что идёт в такт.',
          ],
        },
        {
          type: 'exam',
          question: 'Зачем используют вращающуюся систему отсчёта? Опиши движение M во время импульса 90° в лабораторной и во вращающейся системе.',
          answer: 'В лабораторной системе M прецессирует с $f_0$ вокруг $B_0$ и одновременно медленно наклоняется слабым полем $B_1$, вращающимся с $f_0$. Кончик M движется по спирали от северного полюса в плоскость xy. В системе, вращающейся с $f_0$ вокруг z, при резонансе действие $B_0$ исчезает, а $B_1$ неподвижно лежит на $x\'$. Тогда M просто опрокидывается с $\\omega_1 = \\gamma B_1$ по большому кругу вокруг $x\'$, после импульса 90° M лежит на $y\'$.',
          full: 'Объясни, что $B_1\\cos(\\omega_0 t)$ и $B_1\\sin(\\omega_0 t)$ в лекции являются компонентами вращающегося РЧ-поля и что при нерезонансе вдоль z остаётся остаточное поле.',
          sim: 'larmor',
        },
      ],
    },
    {
      title: 'Как читать моделирование Блоха из лекции',
      blocks: [
        {
          type: 'analogy',
          title: 'Круговой маятник сверху',
          text: 'Подвесь шарик на длинную верёвку и посмотри на него сверху. Если на каждом обороте в нужный момент слегка подталкивать его, круги становятся всё больше. Перестанешь толкать, и воздух постепенно его тормозит, круги уменьшаются, пока шарик снова не повиснет в центре. Сверху видна спираль наружу, а затем внутрь. Именно так читается фазовая диаграмма в лекции.',
        },
        {
          type: 'p',
          text: 'В лекции есть два рисунка к **моделированию уравнений Блоха**: временной ход и фазовая диаграмма. Оба показывают один и тот же эксперимент, просто двумя способами. Расчёт ведётся в **лабораторной системе** с РЧ-импульсом из $B_x$ и $B_y$.',
        },
        {
          type: 'p',
          text: '**Вид 1, временной ход.** По горизонтали время, по вертикали поперечная намагниченность $M_x$ и $M_y$. Сначала всё равно нулю, потому что M направлена вдоль z. Во время РЧ-импульса $M_x$ и $M_y$ начинают колебаться, и колебания становятся всё больше. После импульса они продолжают колебаться с $f_0$, но огибающая затухает. Это T2-релаксация. $M_x$ и $M_y$ сдвинуты друг относительно друга на четверть периода, как косинус и синус: это след вектора, который бежит по кругу.',
        },
        {
          type: 'p',
          text: '**Вид 2, фазовая диаграмма.** Теперь откладывают $M_y$ против $M_x$. Время исчезает из картинки, ты как бы смотришь сверху на плоскость xy. Каждый виток соответствует одному ларморову обороту. Расстояние от центра равно модулю поперечной намагниченности $M_{xy}$, то есть именно тому, что катушка видит как сигнал.',
        },
        {
          type: 'list',
          items: [
            '**Спираль наружу = возбуждение:** РЧ-импульс отклоняет M от оси z, поперечная компонента растёт с каждым оборотом.',
            '**Спираль внутрь = релаксация:** после импульса спины теряют фазовую когерентность, $M_{xy}$ уменьшается с T2, спираль стягивается к центру.',
            '**Центр:** поперечной намагниченности нет, M (снова) направлена вдоль $B_0$.',
          ],
        },
        { type: 'figure', id: 'bloch-phase', caption: 'Честный расчёт по уравнению Блоха в нормированном времени: во время РЧ-импульса $M_x$ и $M_y$ растут (вверху), и спираль идёт наружу (розовая). Затем сигнал затухает с T2, и спираль идёт внутрь (синяя). Радиус и есть сигнал.' },
        {
          type: 'p',
          text: '**Почему ось времени нормирована?** С реальными числами моделирование было бы бесполезным. При 64 МГц один оборот длится 16 нс, T2 тканей около 100 мс. Пока сигнал затухнет, прошли бы миллионы оборотов. Их нельзя ни увидеть, ни разумно рассчитать. Поэтому время измеряют в единицах опорного времени (здесь оно идёт от 0 до 1) и выбирают ларморову частоту так, чтобы поместилось лишь несколько десятков оборотов. Соотношения тогда нереалистичны, но поведение остаётся точно таким же: вращение, рост, затухание.',
        },
        {
          type: 'formula',
          tex: 't\' = \\frac{t}{t_\\text{ref}}, \\qquad \\omega_0\' = \\omega_0\\, t_\\text{ref}',
          caption: 'нормированное время t′ и нормированная ларморова частота ω₀′ без размерности',
        },
        {
          type: 'p',
          text: 'Числа на осях в лекции тоже в единицах моделирования. Смотри на **форму**, а не на числовые значения.',
        },
        {
          type: 'p',
          text: '**Мостик к лабораторной работе 3:** там ты самостоятельно запускаешь такие модели Блоха, меняешь $B_0$ и сравниваешь с теорией. На что обратить внимание:',
        },
        {
          type: 'list',
          items: [
            '**Больше оборотов:** удвоенное $B_0$ означает удвоенную ларморову частоту. В том же окне времени насчитаешь вдвое больше колебаний $M_x$. Это проверяется прямо по $f_0 = \\bar\\gamma B_0$.',
            '**Та же огибающая:** в простом уравнении Блоха T1 и T2 заданы как постоянные. Затухание остаётся тем же, каким бы ни было $B_0$.',
            '**Резонанс потерян:** если частоту РЧ-импульса не подстроить, импульс вдруг оказывается вне резонанса. Тогда спираль почти не растёт, M отклоняется лишь слегка.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Наружу при импульсе, внутрь при релаксации, радиус и есть сигнал.** А время нормировано, чтобы обороты вообще можно было увидеть.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Когда спираль идёт внутрь, спины перестают вращаться». Верно: они продолжают вращаться с $f_0$. Уменьшается только их сумма в плоскости xy, потому что они сбиваются с такта.',
            'Неверно: «Спираль показывает путь отдельного протона». Верно: это кончик суммарной намагниченности M, спроецированный сверху на плоскость xy.',
          ],
        },
        {
          type: 'exam',
          question: 'В лекции показано моделирование Блоха в виде фазовой диаграммы $M_y$ против $M_x$. Объясни две части спирали и почему ось времени нормирована.',
          answer: 'Во время РЧ-импульса M отклоняется от направления z, прецессирующая поперечная компонента растёт, спираль идёт наружу (возбуждение). После импульса M продолжает прецессировать с ларморовой частотой, но поперечная намагниченность затухает из-за T2-релаксации, спираль идёт внутрь (релаксация). Радиус соответствует $M_{xy}$, то есть сигналу. Время нормировано, потому что при реальных значениях (период 16 нс, T2 около 100 мс) миллионы оборотов невозможно изобразить. Качественное поведение при этом сохраняется.',
          full: 'Добавь, что $M_x$ и $M_y$ во временном ходе колеблются со сдвигом фазы 90° и что при большем $B_0$ за то же время больше оборотов (лабораторная работа 3).',
          sim: 'signal',
        },
      ],
    },
    {
      title: 'Энергия, фотон, резонанс: ΔE = h·f₀',
      blocks: [
        {
          type: 'analogy',
          title: 'Ступенька для частиц света',
          text: 'Представь лестницу ровно из одной ступеньки. Мяч попадает наверх, только если у него ровно столько энергии, сколько нужно на эту ступеньку. Слишком слабый мяч скатывается обратно. Слишком сильный тоже не подходит, ведь половины лишней ступеньки не бывает. В квантовом мире роль мяча играет **фотон**, частица радиоволны, а ступенька означает расстояние между двумя энергиями спина.',
        },
        {
          type: 'p',
          text: 'Ты уже знаешь расщепление энергии в поле, **зеемановское расщепление**: $\\Delta E = \\gamma\\hbar B_0$. И знаешь ларморову частоту $\\omega_0 = \\gamma B_0$. Если сложить одно с другим, получается красивая вещь:',
        },
        {
          type: 'formula',
          tex: '\\Delta E = \\gamma\\hbar B_0 = \\hbar\\,\\omega_0 = h\\, f_0',
          caption: 'так как ħ = h/2π и ω₀ = 2π f₀',
        },
        {
          type: 'p',
          text: 'Здесь $h = 6{,}63\\cdot10^{-34}$ Дж·с означает постоянную Планка, а $f_0$ ларморову частоту. Формула говорит: у фотона подходящая энергия для перехода именно тогда, когда его частота **равна ларморовой**. Это не совпадение. Квантовая картина (ступенька) и классическая (вращающийся волчок) описывают одну и ту же физику и поэтому дают одно и то же число.',
        },
        {
          type: 'table',
          head: ['', 'Классическая картина', 'Квантовая картина'],
          rows: [
            ['Образ', 'качели, толкать в такт', 'ступенька, мяч с нужной энергией'],
            ['Что происходит?', 'B₁ вращается с f₀ и наклоняет M', 'фотон с h·f₀ поднимает спины на верхний уровень'],
            ['Не та частота', 'толчки пропадают, M почти не наклоняется', 'фотон не подходит, перехода нет'],
            ['Условие', 'f_РЧ = f₀', 'h·f_РЧ = ΔE'],
          ],
        },
        {
          type: 'p',
          text: 'В квантовой картине есть ещё тонкий момент. Фотон может поднять спин наверх (поглощение), но может и столкнуть спин сверху вниз (вынужденное излучение). Оба процесса одинаково вероятны. Энергия в итоге поглощается только потому, что внизу сидит на несколько спинов больше. Больцмановский избыток в несколько ppm и здесь весь капитал.',
        },
        {
          type: 'p',
          text: 'Сколько энергии несёт такой фотон? При 1,5 Тл $f_0 \\approx 64$ МГц:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} E = h f_0 &= 6{,}63\\cdot10^{-34}\\ \\text{Дж\\,с}\\cdot 6{,}4\\cdot10^{7}\\ \\text{Гц} \\\\ &\\approx 4{,}2\\cdot10^{-26}\\ \\text{Дж} \\approx 2{,}6\\cdot10^{-7}\\ \\text{эВ} \\end{aligned}',
        },
        {
          type: 'table',
          head: ['Излучение', 'Энергия фотона', 'ионизирующее?'],
          rows: [
            ['РЧ 64 МГц (МРТ)', '≈ 3·10⁻⁷ эВ', 'нет'],
            ['видимый свет', '≈ 2 эВ', 'нет'],
            ['порог ионизации', '≈ 10 эВ', 'начиная отсюда'],
            ['рентген, КТ', 'от 10⁴ до 10⁵ эВ', 'да'],
          ],
        },
        { type: 'figure', id: 'zeeman-photon', caption: 'Слева расстояние между двумя уровнями растёт линейно с $B_0$, и фотон с энергией $h\\cdot f_0$ точно в него помещается. Справа в логарифмическом масштабе видно: РЧ-фотон лежит примерно на одиннадцать порядков ниже рентгена и далеко ниже порога ионизации.' },
        {
          type: 'p',
          text: 'РЧ-фотон примерно **в сто миллиардов раз слабее** рентгеновского. Чтобы выбить электрон из молекулы, нужно около 10 эВ. МРТ невообразимо далека от этого. Поэтому она **не ионизирует** и не повреждает ДНК напрямую. Что РЧ-энергия в большом количестве может, так это слегка нагреть ткань. Для этого есть предельные значения, которые аппарат контролирует.',
        },
        {
          type: 'p',
          text: 'Кстати: тепловая энергия $kT$ при 37 °C около 0,027 эВ. Это в сто тысяч раз больше ступеньки $h f_0$. Именно поэтому больцмановский избыток так мал.',
        },
        {
          type: 'mnemonic',
          text: '**Ступенька равна фотону равна Лармору: ΔE = h·f₀.** А этот фотон настолько слаб, что ничего не может ионизировать.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «МРТ работает с излучением, значит, она ионизирует, как рентген». Верно: радиоволны относятся к электромагнитному излучению, но их фотоны имеют около $10^{-7}$ эВ, намного меньше примерно 10 эВ для ионизации.',
            'Неверно: «При 3 Тл частота вдвое выше, значит, ионизация опаснее». Верно: и при 128 МГц фотон имеет около $5\\cdot10^{-7}$ эВ, всё ещё на одиннадцать порядков ниже рентгена.',
            'Неверно: «Любая радиоволна наклоняет спины, нужно только взять достаточно мощности». Верно: к ступеньке подходит только резонансная частота. Вне резонанса энергия пропадает зря.',
          ],
        },
        {
          type: 'exam',
          question: 'Покажи, что энергия поглощённого РЧ-фотона точно соответствует ларморовой частоте, и обоснуй, почему МРТ не использует ионизирующее излучение.',
          answer: 'В поле $B_0$ спиновые состояния расщепляются на $\\Delta E = \\gamma\\hbar B_0$. С $\\omega_0 = \\gamma B_0$ и $\\hbar = h/2\\pi$ следует $\\Delta E = \\hbar\\omega_0 = h f_0$. Значит, переход возбуждают именно фотоны с ларморовой частотой (резонанс). При 1,5 Тл $f_0 \\approx 64$ МГц, энергия фотона $h f_0 \\approx 2{,}6\\cdot10^{-7}$ эВ. Для ионизации нужно около 10 эВ, у рентгеновских фотонов от $10^4$ до $10^5$ эВ. РЧ-фотоны лежат на много порядков ниже и ионизировать не могут.',
          full: 'Назови классический аналог (B₁ должно вращаться в такт прецессии) и упомяни, что РЧ-энергия может нагревать ткань.',
          sim: 'larmor',
        },
      ],
    },
    {
      title: 'Движение молекул: почему T1 и T2 зависят от ткани',
      blocks: [
        {
          type: 'analogy',
          title: 'Случайные толчки качелей',
          text: 'Ребёнок сидит на качелях, вокруг носятся другие дети и случайно их задевают. Если толчки идут безумно быстро, туда-сюда, они гасят друг друга, и качели почти ничего не замечают. Если толчок бывает раз в час, тоже мало что происходит. Сильнее всего качели раскачиваются, когда случайные толчки приходят примерно **в такт качелям**. Так же спины отдают энергию: лучше всего, когда окружение колышется в такт ларморовой частоте.',
        },
        {
          type: 'p',
          text: 'Каждый протон чувствует не только $B_0$. Его соседи сами маленькие магниты, протоны той же или соседней молекулы. Они создают в месте протона крошечное **локальное магнитное поле**. Поскольку молекулы постоянно вращаются и смещаются, это поле всё время меняется. Оно **случайно флуктуирует**.',
        },
        {
          type: 'p',
          text: 'Насколько быстро оно флуктуирует, описывает **время корреляции** $\\tau_c$: грубо, время, за которое молекула заметно повернулась. Маленькие свободные молекулы, как вода, вращаются чрезвычайно быстро, за пикосекунды. Большие или связанные молекулы гораздо инертнее.',
        },
        {
          type: 'p',
          text: '**T1 нужен правильный такт.** Чтобы спин мог отдать энергию решётке, флуктуирующее поле должно иметь компоненту на ларморовой частоте. Лучше всего это выполняется, когда флуктуации идут примерно в такт $f_0$:',
        },
        {
          type: 'formula',
          tex: '\\omega_0\\,\\tau_c \\approx 1 \\quad\\Rightarrow\\quad \\tau_c \\approx \\frac{1}{2\\pi\\cdot 64\\ \\text{МГц}} \\approx 2{,}5\\ \\text{нс}',
          caption: 'условие самого короткого T1, значение при 1,5 Тл',
        },
        {
          type: 'list',
          items: [
            '**Свободная вода, ликвор:** молекулы слишком быстрые. Флуктуации распределяются по огромному диапазону частот, на $f_0$ почти ничего не остаётся. Отдача энергии плохая, **T1 длинное**. Одновременно быстрые флуктуации для фазы усредняются: **T2 тоже длинное**, почти как T1.',
            '**Жир:** молекулы среднего размера, их движение хорошо подходит к такту $f_0$. Энергия уходит эффективно, **T1 короткое**.',
            '**Ткань со связанной водой:** вода частично прилипает к белкам и мембранам и становится инертнее. T1 в среднем диапазоне, **T2 заметно короче**.',
            '**Кость, сухожилия, твёрдые тела:** почти никакого движения. Для T1 слишком медленно, **T1 длинное**. А для T2 это губительно: **T2 чрезвычайно короткое**, сигнал исчезает ещё до измерения. Поэтому кость тёмная.',
          ],
        },
        {
          type: 'p',
          text: '**Почему T2 просто всё время падает?** Для T2 важны не только флуктуации на $f_0$, но и **медленные и почти неподвижные** локальные поля. Спин, который дольше чувствует чуть более сильное поле, вращается чуть быстрее соседа и сбивается с такта. Чем инертнее молекулы, тем дольше держатся такие различия и тем быстрее всё расфазируется. Поэтому у T1 есть минимум, а T2 при замедлении движения падает всё дальше. Эта картина по фамилиям авторов называется **моделью BPP** (Бломберген, Пёрселл, Паунд).',
        },
        { type: 'figure', id: 'molecular-motion', caption: 'Схематично по модели BPP: слева, при быстром движении, T1 и T2 длинные и почти равны. У T1 (зелёный) минимум там, где движение идёт в такт $f_0$, а T2 (фиолетовый) вправо падает всё дальше. Пунктирная кривая показывает T1 при большем $B_0$.' },
        {
          type: 'p',
          text: '**Почему T1 обычно растёт с $B_0$?** Больше поле означает выше ларморову частоту. «Правильный такт» смещается к более быстрым движениям. Большинство тканей лежит на медленной стороне от минимума. Для них на более высокой частоте подходящих флуктуаций ещё меньше, отдача энергии хуже, **T1 становится длиннее**. T2 при этом меняется мало.',
        },
        {
          type: 'p',
          text: 'В лекции при T2-релаксации стоит короткая фраза «**sensitive to water mobility**», то есть чувствительна к подвижности воды. Вот что за ней стоит: подвижная вода имеет длинное T2 и ярко светится на T2-взвешенном изображении, например ликвор или отёк. Связанная вода и твёрдые ткани имеют короткое T2 и остаются тёмными.',
        },
        {
          type: 'mnemonic',
          text: '**T1 любит такт, T2 не терпит неподвижности.** T1 короче всего, когда молекулы колышутся в ларморовом такте (жир). T2 тем короче, чем инертнее молекулы (кость).',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Чем подвижнее молекулы, тем короче T1». Верно: у T1 есть минимум. У очень быстрой свободной воды T1 длинное, так же как у почти жёсткой ткани.',
            'Неверно: «Кость тёмная, потому что в ней нет протонов». Верно: протоны есть, но почти неподвижные. Их T2 так коротко, что сигнал исчезает до измерения.',
          ],
        },
        {
          type: 'exam',
          question: 'Объясни качественно, почему у свободной воды длинные T1 и T2, у жира короткое T1, а у твёрдой ткани очень короткое T2.',
          answer: 'Релаксацию вызывают случайно флуктуирующие локальные магнитные поля соседних ядер, возникающие из-за движения молекул (время корреляции $\\tau_c$). Для T1 нужны флуктуации вблизи ларморовой частоты, оно короче всего при $\\omega_0\\tau_c \\approx 1$. Жир близок к этому оптимуму, отсюда короткое T1. Свободная вода движется слишком быстро, поля усредняются, T1 и T2 длинные. В твёрдой ткани флуктуации очень медленные: для T1 это неэффективно (T1 длинное), но почти статические поля очень быстро расфазируют спины, поэтому T2 чрезвычайно короткое.',
          full: 'Упомяни, что T1 с ростом $B_0$ обычно увеличивается, потому что оптимум смещается к более быстрым движениям, и что в лекции T2 описано как «sensitive to water mobility».',
          sim: 'relaxation',
        },
      ],
    },
  ],
};
