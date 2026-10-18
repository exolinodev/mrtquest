import type { Chapter } from './types';

/**
 * Vertiefungsabschnitte für „Vom Signal zum Bild“; eingeordnet in chapters/index.ts.
 * 0 Demodulation, 1 FOV, Pixel und Bandbreite nachgerechnet, 2 Kehrwert-Prinzip,
 * 3 Füllen des k-Raums (TR, TSE), 4 Signalgleichung nachgerechnet, 5 Schichtprofil und sinc-Puls.
 * Gewebewerte (1,5 T, ungefähr): GM ρ 0,8 T1 950 T2 100; WM ρ 0,7 T1 700 T2 80; Liquor ρ 1 T1 4000 T2 2000 ms.
 */
export const bildPlus: Chapter = {
  de: [
    {
      title: 'Vom Hochfrequenzsignal zum Basisband: Demodulation',
      blocks: [
        {
          type: 'analogy',
          title: 'Die Schwebung beim Gitarrenstimmen',
          text: 'Wenn du zwei Gitarrensaiten fast gleich stimmst und gleichzeitig anschlägst, hörst du ein langsames An- und Abschwellen: wa-wa-wa. Das ist die **Schwebung**. Ihr Takt ist genau der Unterschied der beiden Töne. Die hohen Töne selbst interessieren dich beim Stimmen gar nicht, nur dieser langsame Unterschied. Der MRT-Empfänger macht dasselbe: Er vergleicht das Spulensignal mit einem eigenen Ton bei der Larmor-Frequenz und behält nur den langsamen Unterschied.',
        },
        {
          type: 'p',
          text: 'Bei 1,5 T schwingt das Signal in der Spule mit rund **64 MHz**, also 64 Millionen Mal pro Sekunde. Die eigentliche Bildinformation steckt aber nicht in diesen 64 MHz. Sie steckt in den **kleinen Abweichungen**, die der Gradient den einzelnen Orten aufprägt. Mit 10 mT/m und einem Kopf von 25 cm Breite sind das nur etwa ±53 kHz. Das ist weniger als ein Promille der Trägerfrequenz.',
        },
        {
          type: 'p',
          text: 'Darum mischt der Empfänger das Signal mit einer eigenen, sehr stabilen Schwingung bei $f_0$ herunter. Mischen heißt technisch: **multiplizieren**. Und beim Multiplizieren zweier Schwingungen entstehen die Differenz- und die Summenfrequenz:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} &\\cos\\big((\\omega_0+\\Delta\\omega)t\\big)\\cdot\\cos(\\omega_0 t) \\\\ &= \\tfrac12\\cos(\\Delta\\omega\\, t) \\\\ &\\quad + \\tfrac12\\cos\\big((2\\omega_0+\\Delta\\omega)t\\big) \\end{aligned}',
          caption: 'Mischen = Multiplizieren: Differenz (langsam) plus Summe (sehr schnell)',
        },
        {
          type: 'p',
          text: 'Hier ist $\\omega_0$ die Larmor-Kreisfrequenz und $\\Delta\\omega$ die kleine Abweichung durch den Gradienten. Der Anteil mit $2\\omega_0$ liegt bei rund 128 MHz. Ein **Tiefpassfilter** wirft ihn weg. Übrig bleibt nur $\\cos(\\Delta\\omega t)$, eine langsame Schwingung im kHz-Bereich. Dieses langsame Signal heißt **Basisband**.',
        },
        {
          type: 'p',
          text: 'Erkennst du das wieder? Das ist das **rotierende Bezugssystem** aus dem physikalischen Prinzip, nur in der Elektronik gebaut. Im Rechenmodell setzt du dich auf das Karussell, das mit $\\omega_0$ dreht. Im Empfänger zieht der Mischer genau diese Drehung ab. Deshalb darf das Skript einfach $\\omega(x) = \\gamma G_x x$ schreiben, ohne den großen Anteil $\\gamma B_0$.',
        },
        {
          type: 'p',
          text: 'Ein Kosinus allein reicht aber nicht. Er kann nicht unterscheiden, ob ein Ort **etwas schneller** oder **etwas langsamer** als $f_0$ kreist, denn $\\cos(\\Delta\\omega t) = \\cos(-\\Delta\\omega t)$. Links und rechts vom Zentrum sähen also gleich aus. Darum mischt der Empfänger zweimal: einmal mit $\\cos(\\omega_0 t)$ und einmal mit $\\sin(\\omega_0 t)$. So entstehen die Kanäle **I** (In-Phase) und **Q** (Quadratur):',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} I(t) &= A\\cos(\\Delta\\omega\\, t) \\\\ Q(t) &= A\\sin(\\Delta\\omega\\, t) \\\\ s(t) &= I + iQ = A\\,e^{i\\Delta\\omega\\, t} \\end{aligned}',
          caption: 'I ist der Realteil, Q der Imaginärteil des Basisbandsignals',
        },
        {
          type: 'p',
          text: 'Damit schließt sich der Kreis zur komplexen Darstellung aus dem Skript. Dort steht $s(t) = \\hat E e^{i\\omega t}$. Nach der Demodulation ist es dasselbe, nur mit der kleinen Frequenz $\\Delta\\omega$ statt $\\omega_0$. Das Vorzeichen von $\\Delta\\omega$ ist jetzt eindeutig: Bei positivem $\\Delta\\omega$ dreht der Zeiger $I + iQ$ links herum, bei negativem rechts herum.',
        },
        {
          type: 'figure',
          id: 'demodulation',
          caption: 'Oben das schnelle HF-Signal mit seiner Hüllkurve. Der Mischer multipliziert mit $\\cos(\\omega_0 t)$ und $\\sin(\\omega_0 t)$, übrig bleiben die langsamen Kurven I und Q. Die Punkte zeigen, wo der ADC abtastet: alle $\\Delta t$ ein Zahlenwert.',
        },
        {
          type: 'p',
          text: 'Zum Schluss kommt der **Analog-Digital-Wandler (ADC)**. Er misst I und Q in festen Zeitabständen $\\Delta t$ und macht daraus Zahlen. Wie oft muss er messen? Das sagt das **Abtasttheorem**, auch Nyquist-Theorem genannt: Eine Schwingung musst du mindestens zweimal pro Periode abtasten, sonst verwechselst du sie mit einer langsameren.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} f_{\\text{Abtast}} &\\ge 2\\, f_{\\max} \\\\ \\text{mit I und Q:}\\quad f_{\\text{Abtast}} &= \\frac{1}{\\Delta t} = BW \\end{aligned}',
          caption: 'Abtasttheorem; mit I und Q deckt die Abtastrate das ganze Band von −BW/2 bis +BW/2 ab',
        },
        {
          type: 'p',
          text: 'Jetzt siehst du, warum sich die Demodulation lohnt. Die 64 MHz direkt abzutasten, hieße über 128 Millionen Messwerte pro Sekunde, und zwar für nichts, denn der Träger trägt keine Ortsinformation. Im Basisband reichen rund 100 000 Messwerte pro Sekunde für ein Band von ±50 kHz. Weil I und Q zusammen das Vorzeichen kennen, genügt dafür eine Abtastrate gleich der ganzen Bandbreite $BW$.',
        },
        {
          type: 'mnemonic',
          text: '**Mischen zieht $f_0$ ab, I und Q retten das Vorzeichen, der ADC macht Zahlen.** Der Empfänger ist das rotierende Bezugssystem aus Kupfer und Silizium.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Die Bildinformation steckt in den 64 MHz.“ Richtig: Sie steckt in den kleinen Abweichungen $\\Delta f$ im kHz-Bereich. Der Träger sagt nur „hier ist Wasserstoff im Feld $B_0$“.',
            'Falsch: „Ein Kanal genügt, Q ist nur eine Kopie von I.“ Richtig: Ohne Q kann man $+\\Delta f$ und $-\\Delta f$ nicht unterscheiden, die beiden Bildhälften würden aufeinanderfallen.',
            'Falsch: „Der ADC muss schneller als 64 MHz abtasten.“ Richtig: Nach der Demodulation reicht eine Abtastrate in der Größe der Empfangsbandbreite, also etwa 100 kHz.',
          ],
        },
        {
          type: 'exam',
          question: 'Warum wird das MR-Signal vor der Digitalisierung demoduliert, und wozu braucht man die beiden Kanäle I und Q?',
          answer: 'Das Spulensignal schwingt mit der Larmor-Frequenz (etwa 64 MHz bei 1,5 T), die Ortsinformation steckt aber nur in den kleinen Frequenzabweichungen $\\Delta f$ durch die Gradienten (kHz). Der Empfänger multipliziert das Signal mit $\\cos(\\omega_0 t)$; es entstehen Differenz- und Summenfrequenz, ein Tiefpass entfernt die Summe. Übrig bleibt das Basisbandsignal mit $\\Delta\\omega$, technisch das rotierende Bezugssystem. Ein zweiter Mischer mit $\\sin(\\omega_0 t)$ liefert Q. $s = I + iQ = Ae^{i\\Delta\\omega t}$ enthält Amplitude, Phase und das Vorzeichen von $\\Delta\\omega$. Danach tastet der ADC mit $1/\\Delta t = BW$ ab, was laut Abtasttheorem für das Band ±BW/2 genügt.',
          full: 'Nenne das Mischprodukt (Differenz und Summe, Tiefpass), die Verbindung zum rotierenden Bezugssystem und zur komplexen Darstellung $s(t)$ sowie das Abtasttheorem.',
          sim: 'signal/spectrum',
        },
      ],
    },
    {
      title: 'Nachgerechnet: FOV, Pixelgröße und Bandbreite',
      blocks: [
        {
          type: 'analogy',
          title: 'Das Senderraster im Radio',
          text: 'Auf der Radioskala liegen die Sender in einem festen Raster, zum Beispiel alle 100 kHz ein Platz. Der ganze Empfangsbereich ist die Zahl der Plätze mal dieser Abstand. In der MRT ist jedes Pixel entlang der Ausleserichtung ein eigener „Sender“. Der Abstand zweier Sender ist $\\Delta f$ pro Pixel, der ganze Bereich ist die Bandbreite $BW$. Und der Gradient legt fest, wie viele Millimeter zu einem Senderplatz gehören.',
        },
        {
          type: 'p',
          text: 'Du kennst schon $\\omega(x) = \\gamma G_x x$. In Hertz heißt das $f(x) = \\bar\\gamma\\, G\\, x$ mit $\\bar\\gamma = \\gamma/2\\pi = 42{,}58$ MHz/T. Zwei Orte im Abstand $\\Delta x$ unterscheiden sich also um die Frequenz $\\bar\\gamma G \\Delta x$. Das ist der Frequenzabstand zweier Nachbarpixel. Und das ganze Bildfeld, das **FOV** (field of view), entspricht der ganzen Empfangsbandbreite:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\Delta f_{\\text{Pixel}} &= \\bar\\gamma\\, G\\, \\Delta x \\\\ BW &= N\\,\\Delta f_{\\text{Pixel}} = \\bar\\gamma\\, G\\, \\text{FOV} \\\\ \\text{FOV} &= \\frac{BW}{\\bar\\gamma\\, G} \\end{aligned}',
          caption: 'N: Pixelzahl in Ausleserichtung, G: Auslesegradient, BW: Empfangsbandbreite',
        },
        {
          type: 'p',
          text: 'Dasselbe kannst du im k-Raum sagen. Wir zählen k hier in **Schwingungen pro Meter**, also $k = \\bar\\gamma\\int G\\,dt$. Das Skript zählt in rad/m, das ist nur der Faktor $2\\pi$. Zwei Regeln reichen:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\Delta k &= \\frac{1}{\\text{FOV}} \\\\ \\Delta x &= \\frac{1}{2k_{\\max}} = \\frac{\\text{FOV}}{N} \\end{aligned}',
          caption: 'Abstand der k-Raum-Punkte legt das FOV fest, die Reichweite ±k_max die Pixelgröße',
        },
        {
          type: 'list',
          items: [
            '$\\Delta k$ ist der Abstand zweier benachbarter Messpunkte im k-Raum. **Je feiner du im k-Raum abtastest, desto größer ist das Bildfeld.**',
            '$k_{\\max}$ ist, wie weit du vom Zentrum aus nach außen misst. **Je weiter du nach außen gehst, desto kleiner werden die Pixel**, desto schärfer das Bild.',
            '$N$ ist die Zahl der Messpunkte pro Zeile. Sie ist zugleich die Zahl der Pixel.',
          ],
        },
        {
          type: 'p',
          text: 'Jetzt rechnen wir ein realistisches Beispiel durch: **G = 10 mT/m, N = 256 Pixel, FOV = 25 cm.** Zuerst die „Steilheit der Tastatur“:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\bar\\gamma\\, G &= 42{,}58\\,\\tfrac{\\text{MHz}}{\\text{T}}\\cdot 0{,}01\\,\\tfrac{\\text{T}}{\\text{m}} \\\\ &\\approx 426\\ \\text{kHz/m} = 426\\ \\text{Hz/mm} \\end{aligned}',
          caption: 'jeder Millimeter verschiebt die Frequenz um rund 426 Hz',
        },
        {
          type: 'table',
          head: ['Größe', 'Rechnung', 'Ergebnis'],
          rows: [
            ['Pixelgröße Δx', '250 mm / 256', '≈ 0,98 mm'],
            ['Δf pro Pixel', '426 Hz/mm · 0,98 mm', '≈ 416 Hz'],
            ['Bandbreite BW', '426 kHz/m · 0,25 m', '≈ 106 kHz'],
            ['Abtastabstand Δt', '1 / BW', '≈ 9,4 µs'],
            ['Auslesedauer', '256 · 9,4 µs', '≈ 2,4 ms'],
            ['Δk', '1 / 0,25 m', '4 m⁻¹'],
            ['k_max', '256 / (2 · 0,25 m)', '512 m⁻¹'],
          ],
        },
        {
          type: 'p',
          text: 'Mach die Probe: Während der Auslese von 2,4 ms sammelt der Gradient $k = \\bar\\gamma G t \\approx 426\\,000 \\cdot 0{,}0024 \\approx 1024$ m⁻¹ an. Das ist genau die Strecke von $-k_{\\max}$ bis $+k_{\\max}$. Alles passt zusammen. Und siehst du die Stellschrauben? **Stärkerer Gradient bei gleicher Bandbreite** macht das FOV kleiner. **Mehr Bandbreite bei gleichem Gradienten** macht es größer.',
        },
        {
          type: 'figure',
          id: 'fov-pixel',
          caption: 'Oben das Lineal über dem Objekt: Das FOV ist in N Pixel der Breite Δx geteilt. Darunter dieselbe Strecke als Frequenz: Der Gradient übersetzt jedes Pixel in ein eigenes Frequenzfach der Breite $\\Delta f = \\bar\\gamma G \\Delta x$, zusammen ergibt das die Bandbreite BW.',
        },
        {
          type: 'p',
          text: 'Was passiert, wenn das Objekt **größer als das FOV** ist? Teile außerhalb senden Frequenzen über $+BW/2$ hinaus. Das Abtasttheorem ist dann verletzt, und der ADC verwechselt sie mit Frequenzen am anderen Ende des Bandes. Im Bild erscheint der überstehende Teil auf der **gegenüberliegenden Seite**. Das nennt man **Einfaltung** oder Aliasing. Beispiel: Die Nase schaut in den Hinterkopf hinein. Abhilfe: FOV größer wählen oder in Ausleserichtung einfach dichter abtasten (Oversampling).',
        },
        {
          type: 'mnemonic',
          text: '**Δf = γ̄·G·Δx, FOV = BW/(γ̄·G).** Feines Δk gibt ein großes Bild, weites k_max gibt kleine Pixel. 10 mT/m heißt rund 426 Hz pro Millimeter.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Mehr Pixel machen das FOV größer.“ Richtig: Bei gleichem Δk bleibt das FOV gleich, mehr Punkte reichen weiter nach außen in k und machen die Pixel kleiner.',
            'Falsch: „Ein stärkerer Auslesegradient vergrößert das FOV.“ Richtig: Bei gleicher Bandbreite wird das FOV kleiner, weil jeder Millimeter mehr Frequenz bekommt.',
            'Falsch: „Teile außerhalb des FOV sind einfach unsichtbar.“ Richtig: Sie falten sich auf die andere Bildseite ein.',
          ],
        },
        {
          type: 'exam',
          question: 'Ein Auslesegradient von 10 mT/m, 256 Pixel und FOV 25 cm. Berechne Pixelgröße, Frequenzabstand pro Pixel und Bandbreite. Was passiert, wenn das Objekt größer als das FOV ist?',
          answer: '$\\Delta x = 250\\text{ mm}/256 \\approx 0{,}98$ mm. Mit $\\bar\\gamma G = 42{,}58\\text{ MHz/T}\\cdot 0{,}01\\text{ T/m} \\approx 426$ Hz/mm ist $\\Delta f = \\bar\\gamma G\\Delta x \\approx 416$ Hz pro Pixel. Die Bandbreite ist $BW = \\bar\\gamma G\\cdot\\text{FOV} \\approx 106$ kHz, abgetastet mit $\\Delta t = 1/BW \\approx 9{,}4\\ \\mu$s. Im k-Raum gilt $\\Delta k = 1/\\text{FOV} = 4$ m⁻¹ und $\\Delta x = 1/(2k_{\\max})$. Ist das Objekt größer, liegen seine Frequenzen außerhalb von ±BW/2 und falten sich auf die gegenüberliegende Bildseite ein (Aliasing).',
          full: 'Mit γ̄ = γ/2π rechnen (nicht ω mit 42,58 MHz/T) und die k-Raum-Beziehungen Δk = 1/FOV und Δx = 1/(2k_max) nennen.',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Groß im Bild heißt klein im k-Raum: das Kehrwert-Prinzip',
      blocks: [
        {
          type: 'analogy',
          title: 'Das Metronom',
          text: 'Ein Metronom, das langsam tickt, hat lange Abstände zwischen den Schlägen und eine niedrige Frequenz. Tickt es schnell, sind die Abstände kurz und die Frequenz hoch. Abstand und Frequenz sind Kehrwerte voneinander: doppelter Abstand, halbe Frequenz. Genau diese Regel gilt zwischen Bild und k-Raum, nur mit Abständen im Raum statt in der Zeit.',
        },
        {
          type: 'p',
          text: 'Im Skript siehst du Bilder von **Punkt- und Liniengittern** neben ihrem k-Raum. Ein Gitter ist ein sich wiederholendes Muster. Wiederholt sich etwas im Bild mit dem Abstand $a$, dann hat es die Ortsfrequenz $1/a$. Im k-Raum erscheinen deshalb helle Punkte bei $k = 0, \\pm 1/a, \\pm 2/a, \\dots$. Daraus folgt das **Kehrwert-Prinzip**:',
        },
        {
          type: 'list',
          items: [
            '**Grobes Gitter im Bild** (großer Abstand a) ergibt **eng stehende Punkte** im k-Raum (Abstand 1/a klein).',
            '**Feines Gitter im Bild** (kleiner Abstand a) ergibt **weit stehende Punkte** im k-Raum (Abstand 1/a groß).',
          ],
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\text{Abstand im Bild } a \\;&\\leftrightarrow\\; \\text{im k-Raum } \\tfrac{1}{a} \\\\ \\text{Wellenlänge } \\lambda \\;&\\leftrightarrow\\; |k| = \\tfrac{1}{\\lambda} \\end{aligned}',
          caption: 'groß und klein tauschen beim Übergang zwischen Bild und k-Raum die Rollen',
        },
        {
          type: 'figure',
          id: 'reciprocity',
          caption: 'Echt per FFT berechnet: Das grobe Punktgitter oben (Abstand 16 Pixel) liefert im k-Raum ein enges Raster, das feine Gitter unten (Abstand 4 Pixel) ein weites. Vervierfachter Abstand im Bild heißt geviertelter Abstand im k-Raum.',
        },
        {
          type: 'p',
          text: 'Dieselbe Regel gilt für das ganze Bild. Das Bildfeld FOV ist der größte Abstand, den das Bild kennt. Darum legt es den **kleinsten** Abstand im k-Raum fest: $\\Delta k = 1/\\text{FOV}$. Umgekehrt ist das Pixel der kleinste Abstand im Bild. Er gehört zur **größten** Ortsfrequenz, also zu $k_{\\max}$.',
        },
        {
          type: 'table',
          head: ['Im Bild', 'Im k-Raum'],
          rows: [
            ['großes FOV', 'kleiner Abstand Δk = 1/FOV'],
            ['kleine Pixel Δx', 'große Reichweite k_max = 1/(2Δx)'],
            ['grobe Form, Flächen', 'Zentrum, kleines |k|'],
            ['feine Struktur, Kante', 'Rand, großes |k|'],
          ],
        },
        {
          type: 'p',
          text: 'Warum braucht eine kleine Struktur hohe Ortsfrequenzen? Um ein Detail der Breite $b$ zu zeichnen, brauchst du Streifen, die mindestens so fein sind: ein heller und ein dunkler Streifen auf der Strecke $2b$. Das ist die Wellenlänge $\\lambda = 2b$, also $|k| = 1/(2b)$. Ein 1-mm-Detail verlangt $k \\approx 500$ m⁻¹. Misst du nur bis $k_{\\max} = 100$ m⁻¹, siehst du nichts kleiner als etwa 5 mm. Das Detail verschwimmt.',
        },
        {
          type: 'p',
          text: 'Das zeigt auch das Experiment im Skript, in dem ein Teil des k-Raums weggeschnitten wird: Fehlen die äußeren Zeilen, fehlen die hohen Ortsfrequenzen in dieser Richtung. Das feine Gitter lässt sich dann in dieser Richtung nicht mehr sauber auflösen, obwohl der Rest des Bildes noch da ist.',
        },
        {
          type: 'mnemonic',
          text: '**Groß im Bild, klein im k-Raum. Klein im Bild, groß im k-Raum.** Das FOV bestimmt den Punktabstand Δk, die Pixelgröße bestimmt, wie weit du nach außen musst.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Ein grobes Muster liegt am Rand des k-Raums.“ Richtig: Grobe Muster haben niedrige Ortsfrequenzen und liegen nahe am Zentrum.',
            'Falsch: „Ein feineres k-Raum-Raster macht das Bild schärfer.“ Richtig: Feineres Δk vergrößert das FOV. Schärfer wird es nur, wenn du weiter nach außen misst (größeres k_max).',
          ],
        },
        {
          type: 'exam',
          question: 'Ein Punktgitter im Bild wird durch ein doppelt so feines Gitter ersetzt. Was ändert sich im k-Raum? Welche Rolle spielen FOV und Pixelgröße?',
          answer: 'Ein Muster mit Abstand $a$ hat die Ortsfrequenz $1/a$, die Punkte im k-Raum liegen im Abstand $1/a$. Ist das Gitter doppelt so fein, halbiert sich $a$, und die Punkte im k-Raum liegen doppelt so weit auseinander (Kehrwert-Prinzip). Für das ganze Bild gilt entsprechend: Das FOV bestimmt den Abtastabstand $\\Delta k = 1/\\text{FOV}$, die Pixelgröße bestimmt die nötige Reichweite $k_{\\max} = 1/(2\\Delta x)$. Feine Strukturen brauchen hohe Ortsfrequenzen am Rand des k-Raums.',
          full: 'Mit der Wellenlänge argumentieren ($|k| = 1/\\lambda$, ein Detail der Breite b braucht $k \\approx 1/(2b)$) und Zentrum und Rand zuordnen.',
          sim: 'kspace',
        },
      ],
    },
    {
      title: 'Zeile für Zeile: Wie eine Sequenz den k-Raum füllt',
      blocks: [
        {
          type: 'analogy',
          title: 'Der Tintenstrahldrucker',
          text: 'Ein Tintenstrahldrucker fährt mit dem Druckkopf über das Blatt und druckt dabei eine Zeile. Dann schiebt er das Papier ein Stück weiter, und die nächste Zeile kommt. Die Druckzeit ist Zeilenzahl mal Zeit pro Zeile. Ein Druckkopf mit drei Düsenreihen schafft drei Zeilen pro Durchgang und ist dreimal so schnell. Genau so füllt die MRT ihren k-Raum, und genau so funktioniert das Turbo-Spin-Echo.',
        },
        {
          type: 'p',
          text: 'Erinnere dich an das Pulsdiagramm: Nach jeder Anregung kommt ein Phasenkodiergradient mit einer bestimmten Stufe, dann wird unter dem Auslesegradienten ein Echo aufgenommen. Die Phasenstufe legt fest, auf welcher **Höhe $k_y$** du im k-Raum stehst. Der Auslesegradient fährt dich dann **von links nach rechts** durch $k_x$. Eine Wiederholung ergibt also genau **eine k-Raum-Zeile**.',
        },
        {
          type: 'p',
          text: 'Für die nächste Zeile brauchst du die nächste Phasenstufe, und die gibt es erst nach der Wartezeit TR. Daraus folgt direkt die Messzeit:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} T_{\\text{Mess}} &= TR \\cdot N_y \\\\ \\text{T2w: } 5{,}5\\ \\text{s}\\cdot 256 &\\approx 1408\\ \\text{s} \\approx 23{,}5\\ \\text{min} \\\\ \\text{T1w: } 0{,}5\\ \\text{s}\\cdot 256 &= 128\\ \\text{s} \\approx 2\\ \\text{min} \\end{aligned}',
          caption: '$N_y$: Zahl der Phasenkodierschritte, also der k-Raum-Zeilen',
        },
        {
          type: 'p',
          text: 'Ein T2-gewichtetes Bild mit den Werten aus dem Skript würde mit klassischem Spin-Echo also fast eine halbe Stunde dauern. Für eine einzige Schicht! In der Praxis misst man in der langen Wartezeit TR zwar schon andere Schichten mit, aber für ein ganzes Protokoll wäre das immer noch viel zu lang.',
        },
        {
          type: 'p',
          text: 'Die Lösung zeigt das Beispiel einer **Fast-Spin-Echo-Sequenz** im Skript. Nach dem 90°-Puls folgen **mehrere 180°-Pulse** hintereinander. Jeder erzeugt ein neues Echo. Vor jedem Echo wird eine **andere Phasenstufe** geschaltet und danach wieder zurückgedreht. So landet jedes Echo in einer anderen k-Raum-Zeile. Die Zahl der Echos pro Anregung heißt Echozuglänge (ETL) oder Turbofaktor:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} T_{\\text{Mess}} &= \\frac{TR \\cdot N_y}{ETL} \\\\ \\text{ETL } 16\\text{: } \\frac{1408\\ \\text{s}}{16} &\\approx 88\\ \\text{s} \\end{aligned}',
          caption: 'mehrere Echos pro TR füllen mehrere Zeilen, die Messzeit sinkt um den Turbofaktor',
        },
        {
          type: 'figure',
          id: 'kspace-filling',
          caption: 'Links das klassische Spin-Echo: pro TR eine Zeile, nach 9 TR ist der k-Raum voll. Rechts das Turbo-Spin-Echo mit drei Echos pro TR: drei Zeilen auf einmal, nach 3 TR fertig. Die Farbe zeigt, welches Echo welche Zeile füllt.',
        },
        {
          type: 'p',
          text: 'In welcher **Reihenfolge** man die Zeilen füllt, ist frei wählbar. **Linear** heißt: von oben nach unten, die Mitte kommt in der Mitte der Messzeit dran. **Zentrisch** heißt: erst die Mitte, dann abwechselnd nach außen. Warum ist das wichtig? Du weißt schon: Das k-Raum-Zentrum trägt den **Kontrast**, der Rand nur Kanten. Also bestimmt die Zeile, die in der Mitte liegt, wie das Bild aussieht.',
        },
        {
          type: 'p',
          text: 'Beim Turbo-Spin-Echo haben die Echos verschiedene Echozeiten. Das Echo, das in die k-Raum-Mitte sortiert wird, legt den Kontrast fest. Seine Zeit heißt **effektives TE**. Legst du ein spätes Echo in die Mitte, wird das Bild stärker T2-gewichtet. In der Abbildung füllt Echo 2 die mittleren Zeilen.',
        },
        {
          type: 'mnemonic',
          text: '**Ein TR, eine Zeile. Ein TR mit drei Echos, drei Zeilen.** Messzeit = TR · Zeilen / Turbofaktor. Das Echo in der Mitte bestimmt den Kontrast.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Eine Wiederholung liefert das ganze Bild.“ Richtig: Eine Wiederholung liefert eine k-Raum-Zeile, beim Turbo-Spin-Echo einige wenige.',
            'Falsch: „Beim TSE hat jede Zeile ihren eigenen Kontrast, also wird das Bild ein Mischmasch.“ Richtig: Den Kontrast bestimmt im Wesentlichen das Echo in der k-Raum-Mitte, die Randzeilen tragen vor allem Kanten.',
          ],
        },
        {
          type: 'exam',
          question: 'Wie lange dauert eine Spin-Echo-Messung mit TR = 5500 ms und 256 Phasenkodierschritten? Warum ist eine Fast-Spin-Echo-Sequenz schneller, und was bestimmt dort den Kontrast?',
          answer: 'Pro TR wird eine Phasenkodierstufe und damit eine k-Raum-Zeile gemessen: $T = TR\\cdot N_y = 5{,}5\\text{ s}\\cdot 256 \\approx 23{,}5$ min. Beim Fast-Spin-Echo folgen nach dem 90°-Puls mehrere 180°-Pulse; jedes Echo bekommt eine eigene Phasenkodierung und füllt eine eigene Zeile. Die Messzeit sinkt um die Echozahl (ETL), $T = TR\\cdot N_y/ETL$. Den Kontrast bestimmt das Echo, das im k-Raum-Zentrum liegt (effektives TE), weil das Zentrum den Kontrast und der Rand die Kanten trägt.',
          full: 'Lineare und zentrische Reihenfolge unterscheiden und ein Zahlenbeispiel für den Turbofaktor geben.',
          sim: 'imaging',
        },
      ],
    },
    {
      title: 'Kontrast nachgerechnet: die Signalgleichung im Einsatz',
      blocks: [
        {
          type: 'analogy',
          title: 'Ein Eimer mit Zulauf und Leck',
          text: 'Stell dir für jedes Gewebe einen Eimer vor. Während der Wartezeit TR läuft Wasser hinein, bei manchen Eimern schnell (kurzes T1), bei anderen langsam. Dann kippst du den Eimer, und ab da tropft es durch ein Leck heraus, bei manchen schnell (kurzes T2), bei anderen langsam. Nach der Zeit TE schaust du nach, wie viel noch drin ist. Wie voll der Eimer ganz am Anfang höchstens sein kann, ist die Protonendichte ρ. Genau diese drei Schritte stehen in der Signalgleichung.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} S \\;\\propto\\;\\; &\\rho \\\\ \\cdot\\; &\\big(1 - e^{-TR/T_1}\\big) \\\\ \\cdot\\; &e^{-TE/T_2} \\end{aligned}',
          caption: 'Protonendichte · Erholung während TR · Zerfall bis TE',
        },
        {
          type: 'p',
          text: 'Die Gleichung kennst du schon. Jetzt setzen wir echte Zahlen ein, für drei Gewebe im Gehirn: **graue Substanz (GM)**, **weiße Substanz (WM)** und **Liquor**. Die Werte sind **ungefähre Lehrbuchwerte bei 1,5 T**. Sie schwanken je nach Quelle und Gerät, aber die Größenordnung stimmt.',
        },
        {
          type: 'table',
          head: ['Gewebe (≈, 1,5 T)', 'ρ (relativ)', 'T1', 'T2'],
          rows: [
            ['Graue Substanz', '≈ 0,8', '≈ 950 ms', '≈ 100 ms'],
            ['Weiße Substanz', '≈ 0,7', '≈ 700 ms', '≈ 80 ms'],
            ['Liquor', '≈ 1,0', '≈ 4000 ms', '≈ 2000 ms'],
          ],
        },
        {
          type: 'p',
          text: 'Rechne einmal ein Beispiel ganz aus: **Liquor im T1w-Bild** mit TR/TE = 500/10 ms. Der Erholungsfaktor ist $1 - e^{-500/4000} = 1 - e^{-0{,}125} \\approx 0{,}12$. Der Zerfallsfaktor ist $e^{-10/2000} \\approx 0{,}99$. Mal $\\rho = 1$ ergibt das rund **0,12**. Der Liquor hat sich in 500 ms kaum erholt. Er bleibt dunkel, obwohl er die meisten Protonen hat.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} S_{\\text{Liquor}}^{\\text{T1w}} &= 1\\cdot\\big(1 - e^{-500/4000}\\big)\\cdot e^{-10/2000} \\\\ &\\approx 1\\cdot 0{,}12\\cdot 0{,}99 \\approx 0{,}12 \\end{aligned}',
          caption: 'langes T1 und kurzes TR: wenig Erholung, wenig Signal',
        },
        {
          type: 'p',
          text: 'So rechnest du alle neun Kombinationen durch. Heraus kommt diese Tabelle (relatives Signal, reines Wasser voll erholt = 1, alle Werte ungefähr):',
        },
        {
          type: 'table',
          head: ['TR/TE (ms)', 'GM', 'WM', 'Liquor'],
          rows: [
            ['PDw 5500/14', '≈ 0,69', '≈ 0,59', '≈ 0,74'],
            ['T1w 500/10', '≈ 0,30', '≈ 0,32', '≈ 0,12'],
            ['T2w 5500/101', '≈ 0,29', '≈ 0,20', '≈ 0,71'],
          ],
        },
        {
          type: 'figure',
          id: 'contrast-bars',
          caption: 'Die Balken sind mit der Signalgleichung und den Werten aus der Tabelle berechnet. Die Kästchen darunter zeigen die Grauwerte, normiert auf das hellste Gewebe der jeweiligen Gewichtung: Liquor ist im T1w dunkel und im T2w hell.',
        },
        {
          type: 'list',
          items: [
            '**PDw (5500/14):** Langes TR, kurzes TE. Beide Exponentialfaktoren sind nahe 1, außer beim Liquor, dessen T1 so lang ist, dass er sich selbst in 5,5 s nur zu etwa 75 % erholt. Die Unterschiede sind klein und folgen grob ρ.',
            '**T1w (500/10):** Das kurze TR trennt nach T1. Weiße Substanz (kürzestes T1) ist am hellsten, knapp vor der grauen, **Liquor ist dunkel**.',
            '**T2w (5500/101):** Das lange TE trennt nach T2. Bei WM sind nach 101 ms nur noch rund 28 % übrig, bei Liquor rund 95 %. **Liquor ist hell**, WM am dunkelsten.',
          ],
        },
        {
          type: 'p',
          text: 'Achte auf die Größenordnung: Im T1w-Bild unterscheiden sich GM und WM nur um wenige Prozent. Das klingt wenig, reicht aber für einen gut sichtbaren Grau-Weiß-Kontrast, weil das Bild auf den kleinen Wertebereich gefenstert wird. Und das T2w-Bild hat insgesamt weniger Signal als das PDw-Bild. Kontrast gewinnst du immer auf Kosten von Signal.',
        },
        {
          type: 'mnemonic',
          text: '**Liquor: T1w dunkel, T2w hell.** Langes T1 erholt sich in kurzem TR nicht, langes T2 zerfällt bis zum langen TE nicht. Erst einsetzen, dann urteilen.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Liquor hat die meisten Protonen, also ist er immer am hellsten.“ Richtig: Im T1w-Bild bremst das lange T1 die Erholung so stark, dass vom hohen ρ nur rund 12 % übrig bleiben.',
            'Falsch: „Die Tabellenwerte sind feste Naturkonstanten.“ Richtig: T1 und T2 hängen von Feldstärke, Gewebe und Messmethode ab. Die Zahlen sind ungefähre Werte für 1,5 T.',
            'Falsch: „Im PDw-Bild sind T1 und T2 völlig ohne Einfluss.“ Richtig: Sie sind stark unterdrückt, aber nicht null, wie der nur zu 75 % erholte Liquor zeigt.',
          ],
        },
        {
          type: 'exam',
          question: 'Berechne mit $S \\propto \\rho(1 - e^{-TR/T_1})e^{-TE/T_2}$ das relative Signal von Liquor (ρ = 1, T1 ≈ 4000 ms, T2 ≈ 2000 ms) und weißer Substanz (ρ ≈ 0,7, T1 ≈ 700 ms, T2 ≈ 80 ms) für TR/TE = 500/10 ms und 5500/101 ms. Erkläre das Ergebnis.',
          answer: 'T1w (500/10): Liquor $1\\cdot(1 - e^{-0{,}125})\\cdot e^{-0{,}005} \\approx 0{,}12$, WM $0{,}7\\cdot(1 - e^{-0{,}71})\\cdot e^{-0{,}125} \\approx 0{,}32$. Liquor ist dunkel, weil sich sein langes T1 im kurzen TR kaum erholt. T2w (5500/101): Liquor $1\\cdot(1 - e^{-1{,}375})\\cdot e^{-0{,}05} \\approx 0{,}71$, WM $0{,}7\\cdot 1\\cdot e^{-1{,}26} \\approx 0{,}20$. Liquor ist hell, weil sein langes T2 bis TE kaum zerfällt, während WM schon rund 70 % verloren hat.',
          full: 'Jeden Faktor einzeln ausrechnen, die Werte als ungefähr kennzeichnen und die Gewichtung (TR steuert T1, TE steuert T2) begründen.',
          sim: 'relaxation',
        },
      ],
    },
    {
      title: 'Das Schichtprofil: Warum der HF-Puls eine sinc-Form hat',
      blocks: [
        {
          type: 'analogy',
          title: 'Eine Reihe Weingläser',
          text: 'Stell dir eine lange Reihe Weingläser vor, von links nach rechts jedes ein kleines bisschen höher gestimmt. Spielst du einen Klang, der genau die Töne zwischen zwei bestimmten Tonhöhen enthält, alle gleich laut und keine anderen, dann singen nur die Gläser in diesem Abschnitt mit. Die Gläser sind die Spins entlang z, die ansteigende Stimmung ist der Gradient. Die Frage ist nur: Wie muss ein Klang aussehen, der genau ein solches Tonband enthält?',
        },
        {
          type: 'p',
          text: 'Aus der Schichtselektion weißt du: Der Puls regt ein **Frequenzband** der Breite $\\Delta f$ an, und der Gradient $G_{SS}$ übersetzt dieses Band in eine Schicht der Dicke $\\Delta z$. Ideal wäre ein **Rechteckprofil**: Innerhalb der Schicht werden alle Spins gleich stark gekippt, außerhalb gar keine. Dafür muss das Frequenzspektrum des Pulses selbst ein Rechteck sein.',
        },
        {
          type: 'p',
          text: 'Und jetzt hilft dir Fourier. Zeit und Frequenz sind Fourier-Partner. Der Fourier-Partner eines Rechtecks ist die **sinc-Funktion**, $\\mathrm{sinc}(u) = \\sin(\\pi u)/(\\pi u)$. Sie hat einen großen Hauptbuckel in der Mitte und links und rechts immer kleiner werdende Nebenwellen. Ein Puls mit dieser Hüllkurve hat ein rechteckiges Spektrum:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} B_1(t) &= \\hat B_1\\,\\mathrm{sinc}(t/t_0) \\\\ &\\xrightarrow{\\ \\mathcal F\\ }\\ \\text{Rechteck, Breite } \\Delta f = \\frac{1}{t_0} \\end{aligned}',
          caption: '$t_0$: Abstand vom Pulsmittelpunkt zum ersten Nulldurchgang',
        },
        {
          type: 'p',
          text: 'Hier siehst du wieder das Kehrwert-Prinzip: Ein **breiter** sinc-Puls (großes $t_0$) gibt ein **schmales** Frequenzband und damit eine dünne Schicht. Ein kurzer Puls gibt ein breites Band. Echte Pulse werden nach wenigen Nebenwellen abgeschnitten, damit sie nicht ewig dauern. Darum sind die Schichtkanten in der Praxis nicht perfekt scharf, sondern leicht abgerundet.',
        },
        {
          type: 'p',
          text: 'Dann übersetzt der Gradient Frequenz in Ort. Rechne ein Beispiel: $t_0 = 0{,}5$ ms, also $\\Delta f = 2$ kHz, und $G_{SS} = 10$ mT/m, also $\\bar\\gamma G_{SS} \\approx 426$ Hz/mm:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\Delta z &= \\frac{\\Delta f}{\\bar\\gamma\\, G_{SS}} \\\\ &= \\frac{2000\\ \\text{Hz}}{426\\ \\text{Hz/mm}} \\approx 4{,}7\\ \\text{mm} \\end{aligned}',
          caption: 'Schichtdicke = Bandbreite des Pulses durch (γ̄ · Schichtgradient)',
        },
        {
          type: 'figure',
          id: 'slice-profile',
          caption: 'Oben links der sinc-förmige Puls in der Zeit, oben rechts sein Spektrum als Rechteck der Breite Δf. Unten übersetzt der Gradient $G_{SS}$ Frequenz in Ort: Das Band Δf trifft die Gerade genau auf der Schicht Δz. Unter dem Puls siehst du den Schichtgradienten mit seinem negativen Refokussierlappen.',
        },
        {
          type: 'p',
          text: 'Ein Detail fehlt noch: der **Refokussierlappen**. Während des Pulses liegt $G_{SS}$ an. Spins am oberen Rand der Schicht präzedieren also etwas schneller als die am unteren Rand. Wenn sie gekippt sind, sammeln sie dadurch unterschiedliche Phasen an. Am Ende des Pulses ist die Phase quer durch die Schicht wie eine Wendeltreppe verdreht, und die Beiträge heben sich teilweise auf.',
        },
        {
          type: 'p',
          text: 'Die Lösung: Direkt nach dem Puls schaltet man den Schichtgradienten **kurz umgekehrt** ein. Man kann zeigen, dass die verdrehte Phase so wirkt, als hätte nur die zweite Hälfte des Pulses gewirkt. Ein negativer Lappen mit etwa **der halben Fläche** dreht die Phase deshalb wieder zurück. Jetzt stehen alle Spins der Schicht wieder in Phase, und das Signal ist maximal.',
        },
        {
          type: 'formula',
          tex: 'A_{\\text{Refokus}} \\approx -\\tfrac12\\, A_{\\text{Schicht}}',
          caption: 'A: Fläche unter dem Gradienten (Stärke mal Dauer)',
        },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Nur ungefähr Fourier',
          text: 'Dass das Schichtprofil genau die Fourier-Transformierte der Pulsform ist, gilt streng nur für kleine Flipwinkel. Bei 90° oder 180° stimmt es noch gut als Faustregel, für ganz exakte Profile rechnet man mit der Bloch-Gleichung.',
        },
        {
          type: 'mnemonic',
          text: '**sinc in der Zeit, Rechteck in der Frequenz, Scheibe im Körper.** Δz = Δf/(γ̄·G_SS), und danach den Schichtgradienten mit halber Fläche umgekehrt schalten.',
        },
        {
          type: 'pitfall',
          items: [
            'Falsch: „Ein rechteckiger Puls in der Zeit regt eine rechteckige Schicht an.“ Richtig: Ein Rechteck in der Zeit hat ein sinc-förmiges Spektrum. Für ein Rechteck im Spektrum braucht man einen sinc-Puls.',
            'Falsch: „Ein längerer Puls regt eine dickere Schicht an.“ Richtig: Längerer Puls, schmaleres Band, dünnere Schicht.',
            'Falsch: „Der negative Lappen nach dem Puls ist eine Phasenkodierung.“ Richtig: Er liegt in Schichtrichtung und dreht nur die Phase zurück, die der Schichtgradient während des Pulses erzeugt hat.',
          ],
        },
        {
          type: 'exam',
          question: 'Warum verwendet man für die Schichtselektion einen sinc-förmigen HF-Puls? Berechne die Schichtdicke für Δf = 2 kHz und G_SS = 10 mT/m. Wozu dient der negative Gradientenlappen danach?',
          answer: 'Ideal ist ein rechteckiges Schichtprofil, also ein rechteckiges Frequenzband. Zeitverlauf und Spektrum sind Fourier-Paare, und der Fourier-Partner eines Rechtecks ist die sinc-Funktion; ein sinc-Puls mit erstem Nulldurchgang bei $t_0$ hat die Bandbreite $\\Delta f = 1/t_0$. Der Gradient übersetzt Frequenz in Ort: $\\Delta z = \\Delta f/(\\bar\\gamma G_{SS}) = 2000\\text{ Hz}/(426\\text{ Hz/mm}) \\approx 4{,}7$ mm. Während des Pulses dephasieren die Spins quer zur Schicht; ein umgekehrter Schichtgradient mit etwa halber Fläche bringt sie wieder in Phase (Refokussierung), sonst würde das Signal geschwächt.',
          full: 'Erwähne, dass reale Pulse abgeschnitten sind (leicht unscharfe Schichtkanten) und dass die Fourier-Beziehung streng nur bei kleinen Flipwinkeln gilt.',
          sim: 'gradient',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'От высокочастотного сигнала к базовой полосе: демодуляция',
      blocks: [
        {
          type: 'analogy',
          title: 'Биения при настройке гитары',
          text: 'Если две гитарные струны настроены почти одинаково и звучат вместе, слышно медленное нарастание и затухание: уа-уа-уа. Это **биения**. Их темп равен как раз разнице двух тонов. Сами высокие тона при настройке не важны, важна только эта медленная разница. Приёмник МРТ делает то же самое: он сравнивает сигнал катушки со своим собственным тоном на ларморовой частоте и оставляет только медленную разницу.',
        },
        {
          type: 'p',
          text: 'При 1,5 Тл сигнал в катушке колеблется примерно с частотой **64 МГц**, то есть 64 миллиона раз в секунду. Но информация об изображении сидит не в этих 64 МГц. Она сидит в **маленьких отклонениях**, которые градиент придаёт каждому месту. При 10 мТл/м и голове шириной 25 см это всего около ±53 кГц. Это меньше одной тысячной от несущей частоты.',
        },
        {
          type: 'p',
          text: 'Поэтому приёмник смешивает сигнал с собственным, очень стабильным колебанием на частоте $f_0$ и переносит его вниз. Смешивать технически значит **умножать**. А при умножении двух колебаний возникают разностная и суммарная частоты:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} &\\cos\\big((\\omega_0+\\Delta\\omega)t\\big)\\cdot\\cos(\\omega_0 t) \\\\ &= \\tfrac12\\cos(\\Delta\\omega\\, t) \\\\ &\\quad + \\tfrac12\\cos\\big((2\\omega_0+\\Delta\\omega)t\\big) \\end{aligned}',
          caption: 'смешивание = умножение: разность (медленно) плюс сумма (очень быстро)',
        },
        {
          type: 'p',
          text: 'Здесь $\\omega_0$ это ларморова круговая частота, а $\\Delta\\omega$ маленькое отклонение из-за градиента. Составляющая с $2\\omega_0$ лежит около 128 МГц. **Фильтр нижних частот** её отбрасывает. Остаётся только $\\cos(\\Delta\\omega t)$, медленное колебание в диапазоне кГц. Этот медленный сигнал называется **базовой полосой**.',
        },
        {
          type: 'p',
          text: 'Узнаёшь? Это **вращающаяся система отсчёта** из физического принципа, только построенная в электронике. В расчётах ты садишься на карусель, которая вращается с $\\omega_0$. В приёмнике смеситель вычитает ровно это вращение. Поэтому в конспекте можно просто писать $\\omega(x) = \\gamma G_x x$, без большой части $\\gamma B_0$.',
        },
        {
          type: 'p',
          text: 'Но одного косинуса мало. Он не различает, вращается ли место **чуть быстрее** или **чуть медленнее** $f_0$, ведь $\\cos(\\Delta\\omega t) = \\cos(-\\Delta\\omega t)$. Левая и правая стороны от центра выглядели бы одинаково. Поэтому приёмник смешивает дважды: один раз с $\\cos(\\omega_0 t)$ и один раз с $\\sin(\\omega_0 t)$. Так возникают каналы **I** (синфазный) и **Q** (квадратурный):',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} I(t) &= A\\cos(\\Delta\\omega\\, t) \\\\ Q(t) &= A\\sin(\\Delta\\omega\\, t) \\\\ s(t) &= I + iQ = A\\,e^{i\\Delta\\omega\\, t} \\end{aligned}',
          caption: 'I это действительная часть, Q мнимая часть сигнала базовой полосы',
        },
        {
          type: 'p',
          text: 'Так замыкается круг с комплексным представлением из конспекта. Там записано $s(t) = \\hat E e^{i\\omega t}$. После демодуляции это то же самое, только с маленькой частотой $\\Delta\\omega$ вместо $\\omega_0$. Знак $\\Delta\\omega$ теперь однозначен: при положительном $\\Delta\\omega$ указатель $I + iQ$ вращается против часовой стрелки, при отрицательном по часовой.',
        },
        {
          type: 'figure',
          id: 'demodulation',
          caption: 'Вверху быстрый РЧ-сигнал с огибающей. Смеситель умножает на $\\cos(\\omega_0 t)$ и $\\sin(\\omega_0 t)$, остаются медленные кривые I и Q. Точки показывают, где АЦП берёт отсчёты: каждые $\\Delta t$ одно число.',
        },
        {
          type: 'p',
          text: 'В конце работает **аналого-цифровой преобразователь (АЦП)**. Он измеряет I и Q через равные промежутки $\\Delta t$ и превращает их в числа. Как часто нужно измерять? Это говорит **теорема отсчётов**, или теорема Найквиста: колебание нужно измерить минимум два раза за период, иначе его можно спутать с более медленным.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} f_{\\text{отсч}} &\\ge 2\\, f_{\\max} \\\\ \\text{с I и Q:}\\quad f_{\\text{отсч}} &= \\frac{1}{\\Delta t} = BW \\end{aligned}',
          caption: 'теорема отсчётов; с I и Q частота отсчётов покрывает всю полосу от −BW/2 до +BW/2',
        },
        {
          type: 'p',
          text: 'Теперь видно, зачем нужна демодуляция. Оцифровывать 64 МГц напрямую значило бы больше 128 миллионов отсчётов в секунду, и всё ради несущей, которая не несёт информации о месте. В базовой полосе для полосы ±50 кГц хватает около 100 000 отсчётов в секунду. Поскольку I и Q вместе знают знак, достаточно частоты отсчётов, равной всей ширине полосы $BW$.',
        },
        {
          type: 'mnemonic',
          text: '**Смешивание вычитает $f_0$, I и Q спасают знак, АЦП делает числа.** Приёмник это вращающаяся система отсчёта из меди и кремния.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Информация об изображении в 64 МГц». Верно: она в маленьких отклонениях $\\Delta f$ в диапазоне кГц. Несущая говорит только «здесь водород в поле $B_0$».',
            'Неверно: «Хватит одного канала, Q просто копия I». Верно: без Q нельзя различить $+\\Delta f$ и $-\\Delta f$, две половины изображения наложились бы друг на друга.',
            'Неверно: «АЦП должен работать быстрее 64 МГц». Верно: после демодуляции достаточно частоты отсчётов порядка ширины полосы приёма, то есть около 100 кГц.',
          ],
        },
        {
          type: 'exam',
          question: 'Почему МР-сигнал демодулируют перед оцифровкой и зачем нужны два канала I и Q?',
          answer: 'Сигнал катушки колеблется с ларморовой частотой (около 64 МГц при 1,5 Тл), но информация о месте содержится только в малых отклонениях частоты $\\Delta f$ из-за градиентов (кГц). Приёмник умножает сигнал на $\\cos(\\omega_0 t)$; возникают разностная и суммарная частоты, фильтр нижних частот убирает сумму. Остаётся сигнал базовой полосы с $\\Delta\\omega$, технически это вращающаяся система отсчёта. Второй смеситель с $\\sin(\\omega_0 t)$ даёт Q. $s = I + iQ = Ae^{i\\Delta\\omega t}$ содержит амплитуду, фазу и знак $\\Delta\\omega$. Затем АЦП берёт отсчёты с частотой $1/\\Delta t = BW$, чего по теореме отсчётов хватает для полосы ±BW/2.',
          full: 'Назови продукт смешивания (разность и сумма, фильтр нижних частот), связь с вращающейся системой отсчёта и с комплексным представлением $s(t)$, а также теорему отсчётов.',
          sim: 'signal/spectrum',
        },
      ],
    },
    {
      title: 'Считаем сами: FOV, размер пикселя и полоса',
      blocks: [
        {
          type: 'analogy',
          title: 'Сетка станций на радиошкале',
          text: 'На радиошкале станции стоят в фиксированной сетке, например одно место каждые 100 кГц. Весь диапазон приёма равен числу мест, умноженному на этот шаг. В МРТ каждый пиксель вдоль направления считывания это своя «станция». Расстояние между двумя станциями это $\\Delta f$ на пиксель, весь диапазон это полоса $BW$. А градиент определяет, сколько миллиметров приходится на одно место.',
        },
        {
          type: 'p',
          text: 'Ты уже знаешь $\\omega(x) = \\gamma G_x x$. В герцах это $f(x) = \\bar\\gamma\\, G\\, x$ с $\\bar\\gamma = \\gamma/2\\pi = 42{,}58$ МГц/Тл. Два места на расстоянии $\\Delta x$ отличаются по частоте на $\\bar\\gamma G \\Delta x$. Это шаг частоты между соседними пикселями. А всё поле изображения, **FOV** (field of view), соответствует всей полосе приёма:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\Delta f_{\\text{пикс}} &= \\bar\\gamma\\, G\\, \\Delta x \\\\ BW &= N\\,\\Delta f_{\\text{пикс}} = \\bar\\gamma\\, G\\, \\text{FOV} \\\\ \\text{FOV} &= \\frac{BW}{\\bar\\gamma\\, G} \\end{aligned}',
          caption: 'N: число пикселей по направлению считывания, G: градиент считывания, BW: полоса приёма',
        },
        {
          type: 'p',
          text: 'То же можно сказать в k-пространстве. Здесь мы считаем k в **колебаниях на метр**, то есть $k = \\bar\\gamma\\int G\\,dt$. В конспекте k в рад/м, разница только в множителе $2\\pi$. Хватает двух правил:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\Delta k &= \\frac{1}{\\text{FOV}} \\\\ \\Delta x &= \\frac{1}{2k_{\\max}} = \\frac{\\text{FOV}}{N} \\end{aligned}',
          caption: 'шаг точек в k-пространстве задаёт FOV, охват ±k_max задаёт размер пикселя',
        },
        {
          type: 'list',
          items: [
            '$\\Delta k$ это расстояние между соседними точками измерения в k-пространстве. **Чем мельче шаг в k-пространстве, тем больше поле изображения.**',
            '$k_{\\max}$ показывает, как далеко от центра наружу ты измеряешь. **Чем дальше наружу, тем меньше пиксели** и тем резче изображение.',
            '$N$ это число точек в строке. Оно же число пикселей.',
          ],
        },
        {
          type: 'p',
          text: 'Посчитаем реалистичный пример: **G = 10 мТл/м, N = 256 пикселей, FOV = 25 см.** Сначала «крутизна клавиатуры»:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\bar\\gamma\\, G &= 42{,}58\\,\\tfrac{\\text{МГц}}{\\text{Тл}}\\cdot 0{,}01\\,\\tfrac{\\text{Тл}}{\\text{м}} \\\\ &\\approx 426\\ \\text{кГц/м} = 426\\ \\text{Гц/мм} \\end{aligned}',
          caption: 'каждый миллиметр сдвигает частоту примерно на 426 Гц',
        },
        {
          type: 'table',
          head: ['Величина', 'Расчёт', 'Результат'],
          rows: [
            ['Размер пикселя Δx', '250 мм / 256', '≈ 0,98 мм'],
            ['Δf на пиксель', '426 Гц/мм · 0,98 мм', '≈ 416 Гц'],
            ['Полоса BW', '426 кГц/м · 0,25 м', '≈ 106 кГц'],
            ['Шаг отсчётов Δt', '1 / BW', '≈ 9,4 мкс'],
            ['Длительность считывания', '256 · 9,4 мкс', '≈ 2,4 мс'],
            ['Δk', '1 / 0,25 м', '4 м⁻¹'],
            ['k_max', '256 / (2 · 0,25 м)', '512 м⁻¹'],
          ],
        },
        {
          type: 'p',
          text: 'Сделай проверку: за 2,4 мс считывания градиент набирает $k = \\bar\\gamma G t \\approx 426\\,000 \\cdot 0{,}0024 \\approx 1024$ м⁻¹. Это ровно путь от $-k_{\\max}$ до $+k_{\\max}$. Всё сходится. И видишь рычаги? **Более сильный градиент при той же полосе** уменьшает FOV. **Большая полоса при том же градиенте** увеличивает его.',
        },
        {
          type: 'figure',
          id: 'fov-pixel',
          caption: 'Вверху линейка над объектом: FOV разделено на N пикселей ширины Δx. Ниже тот же отрезок в частотах: градиент переводит каждый пиксель в собственную частотную ячейку ширины $\\Delta f = \\bar\\gamma G \\Delta x$, вместе это полоса BW.',
        },
        {
          type: 'p',
          text: 'Что будет, если объект **больше FOV**? Части снаружи посылают частоты выше $+BW/2$. Теорема отсчётов нарушается, и АЦП путает их с частотами на другом конце полосы. На изображении выступающая часть появляется на **противоположной стороне**. Это называется **заворотом** или алиасингом. Пример: нос заходит в затылок. Что помогает: выбрать FOV больше или в направлении считывания просто брать отсчёты чаще (oversampling).',
        },
        {
          type: 'mnemonic',
          text: '**Δf = γ̄·G·Δx, FOV = BW/(γ̄·G).** Мелкий Δk даёт большое изображение, далёкий k_max даёт маленькие пиксели. 10 мТл/м это около 426 Гц на миллиметр.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Больше пикселей делает FOV больше». Верно: при том же Δk FOV не меняется, больше точек заходят дальше наружу в k и делают пиксели меньше.',
            'Неверно: «Более сильный градиент считывания увеличивает FOV». Верно: при той же полосе FOV уменьшается, потому что каждый миллиметр получает больше частоты.',
            'Неверно: «Части вне FOV просто не видны». Верно: они заворачиваются на другую сторону изображения.',
          ],
        },
        {
          type: 'exam',
          question: 'Градиент считывания 10 мТл/м, 256 пикселей, FOV 25 см. Рассчитай размер пикселя, шаг частоты на пиксель и полосу. Что будет, если объект больше FOV?',
          answer: '$\\Delta x = 250\\text{ мм}/256 \\approx 0{,}98$ мм. С $\\bar\\gamma G = 42{,}58\\text{ МГц/Тл}\\cdot 0{,}01\\text{ Тл/м} \\approx 426$ Гц/мм получаем $\\Delta f = \\bar\\gamma G\\Delta x \\approx 416$ Гц на пиксель. Полоса $BW = \\bar\\gamma G\\cdot\\text{FOV} \\approx 106$ кГц, шаг отсчётов $\\Delta t = 1/BW \\approx 9{,}4$ мкс. В k-пространстве $\\Delta k = 1/\\text{FOV} = 4$ м⁻¹ и $\\Delta x = 1/(2k_{\\max})$. Если объект больше, его частоты лежат вне ±BW/2 и заворачиваются на противоположную сторону изображения (алиасинг).',
          full: 'Считать с γ̄ = γ/2π (а не ω с 42,58 МГц/Тл) и назвать соотношения в k-пространстве Δk = 1/FOV и Δx = 1/(2k_max).',
          sim: 'gradient',
        },
      ],
    },
    {
      title: 'Большое на изображении значит малое в k-пространстве: принцип обратной величины',
      blocks: [
        {
          type: 'analogy',
          title: 'Метроном',
          text: 'Метроном, который тикает медленно, даёт длинные паузы между ударами и низкую частоту. Если он тикает быстро, паузы короткие, а частота высокая. Интервал и частота обратны друг другу: интервал вдвое больше, частота вдвое меньше. Именно это правило действует между изображением и k-пространством, только с расстояниями в пространстве вместо времени.',
        },
        {
          type: 'p',
          text: 'В конспекте есть изображения **точечных и линейных решёток** рядом с их k-пространством. Решётка это повторяющийся узор. Если что-то на изображении повторяется с шагом $a$, у него пространственная частота $1/a$. Поэтому в k-пространстве появляются яркие точки при $k = 0, \\pm 1/a, \\pm 2/a, \\dots$. Отсюда **принцип обратной величины**:',
        },
        {
          type: 'list',
          items: [
            '**Крупная решётка на изображении** (большой шаг a) даёт **тесно стоящие точки** в k-пространстве (шаг 1/a мал).',
            '**Мелкая решётка на изображении** (малый шаг a) даёт **далеко стоящие точки** в k-пространстве (шаг 1/a велик).',
          ],
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\text{шаг } a \\;&\\leftrightarrow\\; \\text{шаг в k: } \\tfrac{1}{a} \\\\ \\text{волна } \\lambda \\;&\\leftrightarrow\\; |k| = \\tfrac{1}{\\lambda} \\end{aligned}',
          caption: 'большое и малое меняются ролями при переходе между изображением и k-пространством',
        },
        {
          type: 'figure',
          id: 'reciprocity',
          caption: 'Честно посчитано через БПФ: крупная точечная решётка вверху (шаг 16 пикселей) даёт в k-пространстве тесную сетку, мелкая решётка внизу (шаг 4 пикселя) даёт широкую. Шаг на изображении в четыре раза больше значит шаг в k-пространстве в четыре раза меньше.',
        },
        {
          type: 'p',
          text: 'То же правило действует для всего изображения. Поле FOV это самое большое расстояние, которое знает изображение. Поэтому оно задаёт **наименьший** шаг в k-пространстве: $\\Delta k = 1/\\text{FOV}$. Наоборот, пиксель это самое малое расстояние на изображении. Ему соответствует **наибольшая** пространственная частота, то есть $k_{\\max}$.',
        },
        {
          type: 'table',
          head: ['На изображении', 'В k-пространстве'],
          rows: [
            ['большое FOV', 'малый шаг Δk = 1/FOV'],
            ['маленькие пиксели Δx', 'большой охват k_max = 1/(2Δx)'],
            ['грубая форма, площади', 'центр, малое |k|'],
            ['тонкая структура, край', 'периферия, большое |k|'],
          ],
        },
        {
          type: 'p',
          text: 'Почему маленькой структуре нужны высокие пространственные частоты? Чтобы нарисовать деталь ширины $b$, нужны полосы не грубее её: одна светлая и одна тёмная полоса на отрезке $2b$. Это длина волны $\\lambda = 2b$, то есть $|k| = 1/(2b)$. Деталь в 1 мм требует $k \\approx 500$ м⁻¹. Если измерять только до $k_{\\max} = 100$ м⁻¹, ничего мельче примерно 5 мм не видно. Деталь размывается.',
        },
        {
          type: 'p',
          text: 'Это показывает и эксперимент в конспекте, где часть k-пространства вырезают: если не хватает внешних строк, не хватает высоких пространственных частот в этом направлении. Мелкую решётку тогда уже нельзя чисто разрешить в этом направлении, хотя остальное изображение ещё на месте.',
        },
        {
          type: 'mnemonic',
          text: '**Большое на изображении, малое в k-пространстве. Малое на изображении, большое в k-пространстве.** FOV задаёт шаг точек Δk, размер пикселя задаёт, как далеко наружу нужно идти.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Грубый узор лежит на краю k-пространства». Верно: у грубых узоров низкие пространственные частоты, они лежат близко к центру.',
            'Неверно: «Более мелкая сетка k-пространства делает изображение резче». Верно: более мелкий Δk увеличивает FOV. Резче станет, только если измерять дальше наружу (больший k_max).',
          ],
        },
        {
          type: 'exam',
          question: 'Точечную решётку на изображении заменяют решёткой вдвое мельче. Что меняется в k-пространстве? Какую роль играют FOV и размер пикселя?',
          answer: 'Узор с шагом $a$ имеет пространственную частоту $1/a$, точки в k-пространстве стоят с шагом $1/a$. Если решётка вдвое мельче, $a$ уменьшается вдвое, и точки в k-пространстве расходятся вдвое дальше (принцип обратной величины). Для всего изображения аналогично: FOV задаёт шаг отсчётов $\\Delta k = 1/\\text{FOV}$, размер пикселя задаёт нужный охват $k_{\\max} = 1/(2\\Delta x)$. Тонким структурам нужны высокие пространственные частоты на краю k-пространства.',
          full: 'Рассуждать через длину волны ($|k| = 1/\\lambda$, детали ширины b нужно $k \\approx 1/(2b)$) и сопоставить центр и край.',
          sim: 'kspace',
        },
      ],
    },
    {
      title: 'Строка за строкой: как последовательность заполняет k-пространство',
      blocks: [
        {
          type: 'analogy',
          title: 'Струйный принтер',
          text: 'Струйный принтер проводит печатающую головку над листом и печатает одну строку. Потом сдвигает бумагу чуть дальше, и идёт следующая строка. Время печати равно числу строк, умноженному на время одной строки. Головка с тремя рядами сопел успевает три строки за проход и работает втрое быстрее. Именно так МРТ заполняет k-пространство, и именно так работает турбо-спин-эхо.',
        },
        {
          type: 'p',
          text: 'Вспомни импульсную диаграмму: после каждого возбуждения идёт градиент фазового кодирования с определённой ступенью, затем под градиентом считывания записывается эхо. Ступень фазы определяет, на какой **высоте $k_y$** ты стоишь в k-пространстве. Градиент считывания ведёт тебя **слева направо** по $k_x$. Одно повторение даёт ровно **одну строку k-пространства**.',
        },
        {
          type: 'p',
          text: 'Для следующей строки нужна следующая ступень фазы, а она будет только после ожидания TR. Отсюда сразу время измерения:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} T_{\\text{изм}} &= TR \\cdot N_y \\\\ \\text{T2w: } 5{,}5\\ \\text{с}\\cdot 256 &\\approx 1408\\ \\text{с} \\approx 23{,}5\\ \\text{мин} \\\\ \\text{T1w: } 0{,}5\\ \\text{с}\\cdot 256 &= 128\\ \\text{с} \\approx 2\\ \\text{мин} \\end{aligned}',
          caption: '$N_y$: число шагов фазового кодирования, то есть строк k-пространства',
        },
        {
          type: 'p',
          text: 'T2-взвешенное изображение с параметрами из конспекта при классическом спин-эхо заняло бы почти полчаса. Для одного среза! На практике за долгое ожидание TR успевают измерить и другие срезы, но для целого протокола это всё равно слишком долго.',
        },
        {
          type: 'p',
          text: 'Решение показывает пример **последовательности fast spin echo** в конспекте. После 90°-импульса следуют **несколько 180°-импульсов** подряд. Каждый создаёт новое эхо. Перед каждым эхом включается **другая ступень фазы**, а после него фаза снова откручивается назад. Так каждое эхо попадает в свою строку k-пространства. Число эхо на одно возбуждение называется длиной эхо-цепочки (ETL) или турбо-фактором:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} T_{\\text{изм}} &= \\frac{TR \\cdot N_y}{ETL} \\\\ \\text{ETL } 16\\text{: } \\frac{1408\\ \\text{с}}{16} &\\approx 88\\ \\text{с} \\end{aligned}',
          caption: 'несколько эхо за TR заполняют несколько строк, время падает в турбо-фактор раз',
        },
        {
          type: 'figure',
          id: 'kspace-filling',
          caption: 'Слева классическое спин-эхо: одна строка за TR, через 9 TR k-пространство заполнено. Справа турбо-спин-эхо с тремя эхо за TR: три строки сразу, готово через 3 TR. Цвет показывает, какое эхо заполняет какую строку.',
        },
        {
          type: 'p',
          text: '**Порядок** заполнения строк можно выбирать. **Линейный** значит сверху вниз, середина приходится на середину времени измерения. **Центрический** значит сначала середина, потом поочерёдно наружу. Почему это важно? Ты уже знаешь: центр k-пространства несёт **контраст**, край только края. Значит, строка в середине определяет, как выглядит изображение.',
        },
        {
          type: 'p',
          text: 'У турбо-спин-эхо эхо имеют разные времена. Эхо, которое ставят в центр k-пространства, задаёт контраст. Его время называется **эффективным TE**. Если поставить в центр позднее эхо, изображение станет сильнее T2-взвешенным. На рисунке средние строки заполняет эхо 2.',
        },
        {
          type: 'mnemonic',
          text: '**Один TR, одна строка. Один TR с тремя эхо, три строки.** Время = TR · строки / турбо-фактор. Эхо в центре определяет контраст.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Одно повторение даёт всё изображение». Верно: одно повторение даёт одну строку k-пространства, у турбо-спин-эхо несколько.',
            'Неверно: «У TSE каждая строка со своим контрастом, поэтому изображение получается мешаниной». Верно: контраст в основном определяет эхо в центре k-пространства, краевые строки несут в основном края.',
          ],
        },
        {
          type: 'exam',
          question: 'Сколько длится спин-эхо измерение с TR = 5500 мс и 256 шагами фазового кодирования? Почему последовательность fast spin echo быстрее и что там определяет контраст?',
          answer: 'За один TR измеряется одна ступень фазового кодирования, то есть одна строка k-пространства: $T = TR\\cdot N_y = 5{,}5\\text{ с}\\cdot 256 \\approx 23{,}5$ мин. При fast spin echo после 90°-импульса идут несколько 180°-импульсов; каждое эхо получает своё фазовое кодирование и заполняет свою строку. Время падает в число эхо (ETL) раз, $T = TR\\cdot N_y/ETL$. Контраст определяет эхо в центре k-пространства (эффективное TE), потому что центр несёт контраст, а край несёт края.',
          full: 'Различить линейный и центрический порядок и привести числовой пример для турбо-фактора.',
          sim: 'imaging',
        },
      ],
    },
    {
      title: 'Контраст в цифрах: уравнение сигнала в деле',
      blocks: [
        {
          type: 'analogy',
          title: 'Ведро с притоком и течью',
          text: 'Представь для каждой ткани ведро. За время ожидания TR в него натекает вода, в одни вёдра быстро (короткое T1), в другие медленно. Потом ведро наклоняют, и с этого момента вода вытекает через течь, у одних быстро (короткое T2), у других медленно. Через время TE смотрят, сколько ещё осталось. Насколько полным ведро может быть в самом начале, это протонная плотность ρ. Эти три шага и записаны в уравнении сигнала.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} S \\;\\propto\\;\\; &\\rho \\\\ \\cdot\\; &\\big(1 - e^{-TR/T_1}\\big) \\\\ \\cdot\\; &e^{-TE/T_2} \\end{aligned}',
          caption: 'протонная плотность · восстановление за TR · спад до TE',
        },
        {
          type: 'p',
          text: 'Это уравнение ты уже знаешь. Теперь подставим настоящие числа для трёх тканей мозга: **серого вещества (GM)**, **белого вещества (WM)** и **ликвора**. Значения это **приблизительные учебные значения при 1,5 Тл**. Они различаются в зависимости от источника и аппарата, но порядок величины верный.',
        },
        {
          type: 'table',
          head: ['Ткань (≈, 1,5 Тл)', 'ρ (отн.)', 'T1', 'T2'],
          rows: [
            ['Серое вещество', '≈ 0,8', '≈ 950 мс', '≈ 100 мс'],
            ['Белое вещество', '≈ 0,7', '≈ 700 мс', '≈ 80 мс'],
            ['Ликвор', '≈ 1,0', '≈ 4000 мс', '≈ 2000 мс'],
          ],
        },
        {
          type: 'p',
          text: 'Посчитай один пример целиком: **ликвор на T1w** при TR/TE = 500/10 мс. Множитель восстановления $1 - e^{-500/4000} = 1 - e^{-0{,}125} \\approx 0{,}12$. Множитель спада $e^{-10/2000} \\approx 0{,}99$. Умножаем на $\\rho = 1$ и получаем около **0,12**. Ликвор за 500 мс почти не восстановился. Он остаётся тёмным, хотя протонов у него больше всего.',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} S_{\\text{ликвор}}^{\\text{T1w}} &= 1\\cdot\\big(1 - e^{-500/4000}\\big)\\cdot e^{-10/2000} \\\\ &\\approx 1\\cdot 0{,}12\\cdot 0{,}99 \\approx 0{,}12 \\end{aligned}',
          caption: 'длинное T1 и короткое TR: мало восстановления, мало сигнала',
        },
        {
          type: 'p',
          text: 'Так можно пройти все девять комбинаций. Получается такая таблица (относительный сигнал, чистая вода при полном восстановлении = 1, все значения приблизительные):',
        },
        {
          type: 'table',
          head: ['TR/TE (мс)', 'GM', 'WM', 'Ликвор'],
          rows: [
            ['PDw 5500/14', '≈ 0,69', '≈ 0,59', '≈ 0,74'],
            ['T1w 500/10', '≈ 0,30', '≈ 0,32', '≈ 0,12'],
            ['T2w 5500/101', '≈ 0,29', '≈ 0,20', '≈ 0,71'],
          ],
        },
        {
          type: 'figure',
          id: 'contrast-bars',
          caption: 'Столбцы рассчитаны по уравнению сигнала со значениями из таблицы. Квадратики под ними показывают оттенки серого, нормированные на самую яркую ткань в данном взвешивании: ликвор на T1w тёмный, на T2w светлый.',
        },
        {
          type: 'list',
          items: [
            '**PDw (5500/14):** длинное TR, короткое TE. Оба экспоненциальных множителя близки к 1, кроме ликвора: его T1 так длинно, что даже за 5,5 с он восстанавливается лишь примерно на 75 %. Различия небольшие и примерно следуют ρ.',
            '**T1w (500/10):** короткое TR разделяет по T1. Белое вещество (самое короткое T1) самое светлое, чуть впереди серого, **ликвор тёмный**.',
            '**T2w (5500/101):** длинное TE разделяет по T2. У WM через 101 мс остаётся около 28 %, у ликвора около 95 %. **Ликвор светлый**, WM самое тёмное.',
          ],
        },
        {
          type: 'p',
          text: 'Обрати внимание на порядок величин: на T1w GM и WM различаются всего на несколько процентов. Звучит мало, но для хорошо заметного серо-белого контраста хватает, потому что изображение «окошком» растягивают на узкий диапазон значений. А T2w-изображение в целом имеет меньше сигнала, чем PDw. Контраст всегда выигрывают за счёт сигнала.',
        },
        {
          type: 'mnemonic',
          text: '**Ликвор: на T1w тёмный, на T2w светлый.** Длинное T1 не успевает восстановиться за короткое TR, длинное T2 не успевает спасть до длинного TE. Сначала подставь, потом суди.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «У ликвора больше всего протонов, значит он всегда самый светлый». Верно: на T1w длинное T1 так сильно тормозит восстановление, что от высокого ρ остаётся около 12 %.',
            'Неверно: «Значения из таблицы это постоянные природы». Верно: T1 и T2 зависят от поля, ткани и метода измерения. Числа это приблизительные значения для 1,5 Тл.',
            'Неверно: «На PDw T1 и T2 совсем не влияют». Верно: их влияние сильно подавлено, но не равно нулю, как показывает ликвор, восстановленный только на 75 %.',
          ],
        },
        {
          type: 'exam',
          question: 'По формуле $S \\propto \\rho(1 - e^{-TR/T_1})e^{-TE/T_2}$ рассчитай относительный сигнал ликвора (ρ = 1, T1 ≈ 4000 мс, T2 ≈ 2000 мс) и белого вещества (ρ ≈ 0,7, T1 ≈ 700 мс, T2 ≈ 80 мс) для TR/TE = 500/10 мс и 5500/101 мс. Объясни результат.',
          answer: 'T1w (500/10): ликвор $1\\cdot(1 - e^{-0{,}125})\\cdot e^{-0{,}005} \\approx 0{,}12$, WM $0{,}7\\cdot(1 - e^{-0{,}71})\\cdot e^{-0{,}125} \\approx 0{,}32$. Ликвор тёмный, потому что его длинное T1 почти не восстанавливается за короткое TR. T2w (5500/101): ликвор $1\\cdot(1 - e^{-1{,}375})\\cdot e^{-0{,}05} \\approx 0{,}71$, WM $0{,}7\\cdot 1\\cdot e^{-1{,}26} \\approx 0{,}20$. Ликвор светлый, потому что его длинное T2 почти не спадает до TE, а WM уже потеряло около 70 %.',
          full: 'Посчитать каждый множитель отдельно, обозначить значения как приблизительные и обосновать взвешивание (TR управляет T1, TE управляет T2).',
          sim: 'relaxation',
        },
      ],
    },
    {
      title: 'Профиль среза: почему РЧ-импульс имеет форму sinc',
      blocks: [
        {
          type: 'analogy',
          title: 'Ряд бокалов',
          text: 'Представь длинный ряд бокалов, слева направо каждый настроен чуть выше. Если сыграть звук, который содержит ровно тона между двумя заданными высотами, все одинаково громко и никаких других, то зазвучат только бокалы на этом участке. Бокалы это спины вдоль z, нарастающая настройка это градиент. Вопрос только в том, как должен выглядеть звук, содержащий ровно такую полосу тонов.',
        },
        {
          type: 'p',
          text: 'Из выбора среза ты знаешь: импульс возбуждает **полосу частот** ширины $\\Delta f$, а градиент $G_{SS}$ переводит эту полосу в срез толщины $\\Delta z$. Идеальным был бы **прямоугольный профиль**: внутри среза все спины отклоняются одинаково, снаружи никакие. Для этого спектр самого импульса должен быть прямоугольником.',
        },
        {
          type: 'p',
          text: 'Здесь помогает Фурье. Время и частота это фурье-пары. Фурье-партнёр прямоугольника это **функция sinc**, $\\mathrm{sinc}(u) = \\sin(\\pi u)/(\\pi u)$. У неё большой главный горб в середине и всё меньшие боковые волны слева и справа. Импульс с такой огибающей имеет прямоугольный спектр:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} B_1(t) &= \\hat B_1\\,\\mathrm{sinc}(t/t_0) \\\\ &\\xrightarrow{\\ \\mathcal F\\ }\\ \\text{прямоугольник ширины } \\Delta f = \\frac{1}{t_0} \\end{aligned}',
          caption: '$t_0$: расстояние от середины импульса до первого нуля',
        },
        {
          type: 'p',
          text: 'Здесь снова принцип обратной величины: **широкий** sinc-импульс (большое $t_0$) даёт **узкую** полосу частот и тем самым тонкий срез. Короткий импульс даёт широкую полосу. Настоящие импульсы обрезают после нескольких боковых волн, чтобы они не длились вечно. Поэтому на практике края среза не идеально резкие, а слегка скруглённые.',
        },
        {
          type: 'p',
          text: 'Затем градиент переводит частоту в место. Посчитаем пример: $t_0 = 0{,}5$ мс, то есть $\\Delta f = 2$ кГц, и $G_{SS} = 10$ мТл/м, то есть $\\bar\\gamma G_{SS} \\approx 426$ Гц/мм:',
        },
        {
          type: 'formula',
          tex: '\\begin{aligned} \\Delta z &= \\frac{\\Delta f}{\\bar\\gamma\\, G_{SS}} \\\\ &= \\frac{2000\\ \\text{Гц}}{426\\ \\text{Гц/мм}} \\approx 4{,}7\\ \\text{мм} \\end{aligned}',
          caption: 'толщина среза = полоса импульса / (γ̄ · градиент среза)',
        },
        {
          type: 'figure',
          id: 'slice-profile',
          caption: 'Вверху слева импульс формы sinc во времени, вверху справа его спектр как прямоугольник ширины Δf. Внизу градиент $G_{SS}$ переводит частоту в место: полоса Δf пересекает прямую ровно на срезе Δz. Под импульсом виден градиент среза с отрицательной рефокусирующей долей.',
        },
        {
          type: 'p',
          text: 'Не хватает ещё одной детали: **рефокусирующей доли**. Во время импульса включён $G_{SS}$. Спины у верхнего края среза прецессируют чуть быстрее, чем у нижнего. Когда они уже отклонены, они набирают из-за этого разные фазы. К концу импульса фаза поперёк среза закручена, как винтовая лестница, и вклады частично гасят друг друга.',
        },
        {
          type: 'p',
          text: 'Решение: сразу после импульса градиент среза **ненадолго включают в обратную сторону**. Можно показать, что закрученная фаза действует так, будто работала только вторая половина импульса. Поэтому отрицательная доля примерно **с половиной площади** откручивает фазу обратно. Теперь все спины среза снова в фазе, и сигнал максимален.',
        },
        {
          type: 'formula',
          tex: 'A_{\\text{рефок}} \\approx -\\tfrac12\\, A_{\\text{срез}}',
          caption: 'A: площадь под градиентом (сила на длительность)',
        },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Фурье лишь приблизительно',
          text: 'То, что профиль среза ровно равен фурье-образу формы импульса, строго верно только для малых углов отклонения. При 90° или 180° это всё ещё хорошее правило, а для точных профилей считают по уравнению Блоха.',
        },
        {
          type: 'mnemonic',
          text: '**sinc во времени, прямоугольник по частоте, ломтик в теле.** Δz = Δf/(γ̄·G_SS), а затем градиент среза с половиной площади в обратную сторону.',
        },
        {
          type: 'pitfall',
          items: [
            'Неверно: «Прямоугольный импульс во времени возбуждает прямоугольный срез». Верно: у прямоугольника во времени спектр формы sinc. Для прямоугольника в спектре нужен sinc-импульс.',
            'Неверно: «Более длинный импульс возбуждает более толстый срез». Верно: длиннее импульс, уже полоса, тоньше срез.',
            'Неверно: «Отрицательная доля после импульса это фазовое кодирование». Верно: она лежит в направлении среза и только откручивает фазу, созданную градиентом среза во время импульса.',
          ],
        },
        {
          type: 'exam',
          question: 'Почему для выбора среза используют РЧ-импульс формы sinc? Рассчитай толщину среза при Δf = 2 кГц и G_SS = 10 мТл/м. Зачем нужна отрицательная доля градиента после импульса?',
          answer: 'Идеален прямоугольный профиль среза, то есть прямоугольная полоса частот. Временная форма и спектр это фурье-пары, а фурье-партнёр прямоугольника это функция sinc; sinc-импульс с первым нулём при $t_0$ имеет полосу $\\Delta f = 1/t_0$. Градиент переводит частоту в место: $\\Delta z = \\Delta f/(\\bar\\gamma G_{SS}) = 2000\\text{ Гц}/(426\\text{ Гц/мм}) \\approx 4{,}7$ мм. Во время импульса спины дефазируются поперёк среза; обратный градиент среза примерно с половиной площади снова сводит их в фазу (рефокусировка), иначе сигнал был бы ослаблен.',
          full: 'Упомяни, что реальные импульсы обрезаны (слегка нерезкие края среза) и что фурье-соотношение строго верно только при малых углах отклонения.',
          sim: 'gradient',
        },
      ],
    },
  ],
};
