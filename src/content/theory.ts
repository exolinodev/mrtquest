/**
 * Theorie-Kapitel der Module. Texte unterstützen **fett** und Inline-Formeln in $…$.
 */
import type { Lang } from '../i18n/format';
import type { ModuleId } from './modules';
import { THEORY_UK_A } from './theory.uk-a';
import { THEORY_UK_B } from './theory.uk-b';

export type TheoryBlock =
  | { type: 'p'; text: string }
  | { type: 'formula'; tex: string; caption?: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'callout'; variant: 'merke' | 'klinik' | 'vertiefung' | 'achtung'; title: string; text: string }
  | { type: 'table'; head: string[]; rows: string[][] };

export interface TheorySection {
  title: string;
  blocks: TheoryBlock[];
}

const THEORY_DE: Record<ModuleId, TheorySection[]> = {
  kernspin: [
    {
      title: 'Spin und magnetisches Moment',
      blocks: [
        {
          type: 'p',
          text: 'Atomkerne mit ungerader Protonen- oder Neutronenzahl besitzen einen **Eigendrehimpuls (Spin)** $\\vec S$. Mit ihm ist ein magnetisches Dipolmoment verknüpft, dessen Proportionalitätsfaktor das **gyromagnetische Verhältnis** γ ist:',
        },
        { type: 'formula', tex: '\\vec\\mu = \\gamma\\,\\vec S, \\qquad \\bar\\gamma = \\frac{\\gamma}{2\\pi} = 42{,}577\\ \\text{MHz/T}\\ \\ (^1\\text{H})' },
        {
          type: 'p',
          text: 'Der Wasserstoffkern (ein einzelnes Proton, Spin ½) dominiert die klinische MRT: Er hat das höchste γ aller stabilen Kerne und kommt im Gewebe in einer Konzentration von rund 110 mol/L vor (Wasser und Fett).',
        },
        {
          type: 'table',
          head: ['Kern', 'Spin', 'γ̄ [MHz/T]', 'Anwendung'],
          rows: [
            ['¹H', '½', '42,577', 'Standard-Bildgebung'],
            ['¹⁹F', '½', '40,052', 'Tracer, Perfluorcarbone'],
            ['³¹P', '½', '17,235', 'Energiestoffwechsel (ATP, PCr)'],
            ['²³Na', '³⁄₂', '11,262', 'Zellviabilität, Knorpel'],
            ['¹³C', '½', '10,708', 'Hyperpolarisierte Metabolik'],
          ],
        },
      ],
    },
    {
      title: 'Zeeman-Aufspaltung und Boltzmann-Verteilung',
      blocks: [
        {
          type: 'p',
          text: 'Im äußeren Feld $B_0$ spaltet sich der Spin-½-Zustand in zwei Energieniveaus auf (parallel: energieärmer, antiparallel: energiereicher). Die Energiedifferenz entspricht genau der Larmor-Frequenz:',
        },
        { type: 'formula', tex: '\\Delta E = \\gamma\\hbar B_0 = h f_0' },
        {
          type: 'p',
          text: 'Nach Boltzmann ist der energieärmere Zustand bei Körpertemperatur nur minimal stärker besetzt. In der Hochtemperaturnäherung gilt:',
        },
        { type: 'formula', tex: '\\frac{N_\\uparrow - N_\\downarrow}{N} \\approx \\frac{\\gamma \\hbar B_0}{2kT} \\approx 3{,}3\\ \\text{ppm pro Tesla}', caption: 'bei T = 310 K' },
        {
          type: 'p',
          text: 'Aus diesem winzigen Überschuss entsteht die makroskopische **Gleichgewichtsmagnetisierung** $M_0$ parallel zu $B_0$ (Curie-Gesetz):',
        },
        { type: 'formula', tex: 'M_0 = \\frac{N \\gamma^2 \\hbar^2 B_0}{4 k T}' },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Merke',
          text: 'Spinüberschuss und $M_0$ steigen linear mit $B_0$. Zusammen mit der höheren Induktionsspannung (∝ ω₀) und dem frequenzabhängigen Rauschen ergibt sich in der Praxis ein SNR ungefähr ∝ $B_0$.',
        },
      ],
    },
    {
      title: 'Präzession und Larmor-Gleichung',
      blocks: [
        {
          type: 'p',
          text: 'Ein magnetisches Moment im Feld erfährt das Drehmoment $\\vec\\tau = \\vec\\mu \\times \\vec B_0$. Da es gleichzeitig einen Drehimpuls besitzt, kippt es nicht in Feldrichtung, sondern **präzediert** wie ein Kreisel um $B_0$:',
        },
        { type: 'formula', tex: '\\frac{d\\vec M}{dt} = \\gamma\\, \\vec M \\times \\vec B \\quad\\Rightarrow\\quad \\omega_0 = \\gamma B_0, \\qquad f_0 = \\bar\\gamma B_0', caption: 'Larmor-Gleichung' },
        {
          type: 'table',
          head: ['B₀', '0,55 T', '1,5 T', '3 T', '7 T'],
          rows: [['f₀ (¹H)', '23,4 MHz', '63,9 MHz', '127,7 MHz', '298,0 MHz']],
        },
        {
          type: 'p',
          text: 'Im Gleichgewicht sind die Präzessionsphasen der einzelnen Spins zufällig verteilt. Die Quermagnetisierung mittelt sich zu null – messbar ist zunächst nichts, denn eine statische Längsmagnetisierung induziert keine Spannung.',
        },
      ],
    },
    {
      title: 'Resonanz, HF-Anregung und rotierendes Bezugssystem',
      blocks: [
        {
          type: 'p',
          text: 'Ein zirkular polarisiertes HF-Feld $B_1$ senkrecht zu $B_0$, das mit $f_0$ rotiert, steht im **mitrotierenden Bezugssystem** still. Dort ist $B_0$ „wegtransformiert“, und $\\vec M$ präzediert um $B_1$. Der Flipwinkel ist:',
        },
        { type: 'formula', tex: '\\alpha = \\gamma \\int_0^{\\tau} B_1(t)\\,dt \\;=\\; \\gamma B_1 \\tau \\ \\ (\\text{Rechteckpuls})' },
        {
          type: 'list',
          items: [
            '**90°-Puls**: $M_z \\to 0$, $M_{\\text{xy}} = M_0$ – maximales Signal, alle Spins phasenkohärent.',
            '**180°-Puls**: Inversion $M_z \\to -M_0$ bzw. Refokussierung der Quermagnetisierung (Spin-Echo).',
            '**Kleinwinkelanregung** (z. B. 10–30°): nur ein Teil von $M_z$ wird verbraucht → schnelle Wiederholung (GRE).',
          ],
        },
        {
          type: 'p',
          text: 'Die rotierende Quermagnetisierung induziert in der Empfangsspule eine Wechselspannung (Faraday) – den **Free Induction Decay (FID)**, der durch Relaxation abklingt.',
        },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Off-Resonanz',
          text: 'Weicht die Sendefrequenz um Δω ab, bleibt im rotierenden System das effektive Feld $B_{\\text{eff}} = (\\Delta\\omega/\\gamma)\\hat z + B_1 \\hat x$. Die Magnetisierung wird nicht vollständig ausgelenkt – genau das erlaubt die **schichtselektive Anregung**: Nur Spins mit passender Frequenz werden gekippt.',
        },
      ],
    },
  ],

  relaxation: [
    {
      title: 'Die Bloch-Gleichungen',
      blocks: [
        {
          type: 'p',
          text: 'Felix Bloch beschrieb 1946 die Dynamik der Magnetisierung als Präzession plus zwei phänomenologische Relaxationsterme:',
        },
        {
          type: 'formula',
          tex: '\\frac{d\\vec M}{dt} = \\gamma\\,\\vec M \\times \\vec B \\;-\\; \\frac{M_x \\hat x + M_y \\hat y}{T_2} \\;-\\; \\frac{(M_z - M_0)\\hat z}{T_1}',
        },
        {
          type: 'p',
          text: 'Nach einem 90°-Puls lauten die Lösungen im rotierenden System:',
        },
        { type: 'formula', tex: 'M_z(t) = M_0\\left(1 - e^{-t/T_1}\\right), \\qquad M_{\\text{xy}}(t) = M_0\\, e^{-t/T_2}' },
      ],
    },
    {
      title: 'T1: Spin-Gitter-Relaxation',
      blocks: [
        {
          type: 'p',
          text: 'T1 beschreibt die Rückkehr der Längsmagnetisierung durch **Energieabgabe an die Umgebung**. Effizient ist sie, wenn molekulare Bewegungen (Rotation, Translation) spektrale Anteile nahe der Larmor-Frequenz besitzen (BPP-Theorie). Mittelgroße Moleküle wie Fettsäuren relaxieren schnell, freies Wasser (zu schnelle Bewegung) langsam.',
        },
        {
          type: 'list',
          items: [
            'Nach $t = T_1$: 63 % von $M_0$ erholt; nach $3T_1$: 95 %; nach $5T_1$: > 99 %.',
            'T1 steigt mit $B_0$ (bei 3 T ca. 20–40 % länger als bei 1,5 T).',
            'Paramagnetische Substanzen (Gd³⁺, Methämoglobin) verkürzen T1 drastisch → hell in T1w.',
          ],
        },
        {
          type: 'table',
          head: ['Gewebe (1,5 T)', 'T1 [ms]', 'T2 [ms]'],
          rows: [
            ['Fett', '≈ 260', '≈ 85'],
            ['Leber', '≈ 580', '≈ 46'],
            ['Weiße Substanz', '≈ 780', '≈ 80'],
            ['Muskel', '≈ 1000', '≈ 44'],
            ['Graue Substanz', '≈ 1100', '≈ 95'],
            ['Ödem/Läsion', '≈ 1350', '≈ 180'],
            ['Liquor', '≈ 4000', '≈ 2000'],
          ],
        },
      ],
    },
    {
      title: 'T2 und T2*: Spin-Spin-Relaxation',
      blocks: [
        {
          type: 'p',
          text: 'T2 beschreibt den **Verlust der Phasenkohärenz** durch fluktuierende lokale Felder benachbarter Spins – ohne Energieabgabe. Zusätzlich dephasieren Spins durch **statische** Inhomogenitäten von $B_0$ (Magnet, Suszeptibilitätssprünge). Beides zusammen ergibt T2*:',
        },
        { type: 'formula', tex: '\\frac{1}{T_2^*} = \\frac{1}{T_2} + \\frac{1}{T_2\'} \\;\\approx\\; \\frac{1}{T_2} + \\gamma\\,\\Delta B_0' },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Hierarchie',
          text: 'Für jedes Gewebe gilt $T_2^* \\le T_2 \\le T_1$. Der reversible Anteil $T_2\'$ kann durch einen 180°-Puls refokussiert werden (Spin-Echo), der irreversible T2-Anteil nicht.',
        },
      ],
    },
    {
      title: 'Spin-Echo: Refokussierung',
      blocks: [
        {
          type: 'p',
          text: 'Nach dem 90°-Puls fächern die Spins durch Off-Resonanzen auf: „schnelle“ eilen voraus, „langsame“ hinken hinterher. Ein 180°-Puls zur Zeit TE/2 spiegelt alle Phasen. Die Schnellen liegen nun hinten und holen bis TE exakt auf – es entsteht ein **Echo**, dessen Amplitude nur noch mit T2 abfällt (Erwin Hahn, 1950).',
        },
        { type: 'formula', tex: 'S(TE) \\propto e^{-TE/T_2} \\quad (\\text{SE}) \\qquad \\text{vs.} \\qquad S(TE) \\propto e^{-TE/T_2^*} \\quad (\\text{GRE})' },
      ],
    },
    {
      title: 'Von der Relaxation zum Bildkontrast',
      blocks: [
        { type: 'p', text: 'Für ein Spin-Echo mit $TR \\gg TE$ gilt näherungsweise die Signalgleichung:' },
        { type: 'formula', tex: 'S \\propto \\rho \\left(1 - e^{-TR/T_1}\\right) e^{-TE/T_2}' },
        {
          type: 'table',
          head: ['Wichtung', 'TR', 'TE', 'hell', 'dunkel'],
          rows: [
            ['T1w', 'kurz (400–700 ms)', 'kurz (10–20 ms)', 'Fett, KM-Anreicherung', 'Liquor, Ödem'],
            ['T2w', 'lang (≥ 2500 ms)', 'lang (80–120 ms)', 'Liquor, Ödem', 'Muskel, Leber'],
            ['PDw', 'lang (≥ 2000 ms)', 'kurz (≤ 30 ms)', 'protonenreiches Gewebe', 'Knochen, Luft'],
          ],
        },
        {
          type: 'callout',
          variant: 'klinik',
          title: 'Klinischer Bezug',
          text: 'Die meisten Pathologien (Entzündung, Tumor, Ischämie) erhöhen den freien Wassergehalt → T1 und T2 werden länger. Daher sind sie in T2w hell und in T1w dunkel – erst Kontrastmittel macht Schrankenstörungen in T1w hell.',
        },
      ],
    },
  ],

  ortskodierung: [
    {
      title: 'Prinzip: Ortsabhängige Frequenz',
      blocks: [
        {
          type: 'p',
          text: 'Gradientenspulen überlagern $B_0$ mit einem linear ortsabhängigen Zusatzfeld (Paul Lauterbur, 1973). Damit wird die Resonanzfrequenz zur Ortskoordinate:',
        },
        { type: 'formula', tex: 'f(\\vec r) = \\bar\\gamma\\,\\big(B_0 + \\vec G \\cdot \\vec r\\big)' },
        {
          type: 'p',
          text: 'Typische Gradienten: 40–80 mT/m bei Slew-Rates von 150–200 T/m/s. Bei 10 mT/m unterscheiden sich Protonen im Abstand von 1 mm um 426 Hz.',
        },
      ],
    },
    {
      title: '1. Schichtselektion',
      blocks: [
        {
          type: 'p',
          text: 'Während des HF-Pulses liegt der Schichtgradient $G_s$ an. Nur Spins, deren Resonanzfrequenz innerhalb der Pulsbandbreite $\\Delta f$ liegt, werden angeregt:',
        },
        { type: 'formula', tex: '\\Delta z = \\frac{\\Delta f_{\\text{RF}}}{\\bar\\gamma\\, G_s}, \\qquad z_0 = \\frac{f_{\\text{RF}} - f_0}{\\bar\\gamma\\, G_s}', caption: 'Schichtdicke und Schichtposition' },
        {
          type: 'list',
          items: [
            'Dünnere Schicht: stärkerer Gradient **oder** längerer Puls (kleinere Bandbreite).',
            'Schichtposition: allein über den Frequenz-Offset des Pulses.',
            'Das Schichtprofil ist (Kleinwinkelnäherung) die Fourier-Transformierte der Pulsform → sinc-Puls ergibt Rechteckprofil.',
            'Nach dem Puls rephasiert ein umgepolter Gradient (≈ halbe Fläche) die Spins über die Schichtdicke.',
          ],
        },
      ],
    },
    {
      title: '2. Frequenzkodierung (Auslese)',
      blocks: [
        {
          type: 'p',
          text: 'Während der Signalaufnahme liegt der Auslesegradient $G_x$ an. Jede Spalte des Bildes sendet mit einer anderen Frequenz; die Fourier-Transformation des Signals liefert direkt die Projektion entlang x.',
        },
        { type: 'formula', tex: 'BW_{\\text{gesamt}} = \\bar\\gamma\\, G_x\\, FOV_x, \\qquad BW_{\\text{Pixel}} = \\frac{BW_{\\text{gesamt}}}{N_x} = \\frac{1}{T_{\\text{Auslese}}}' },
        {
          type: 'p',
          text: 'Ein vorgeschalteter Dephasiergradient mit umgekehrter Polarität sorgt dafür, dass das Echo in der Mitte des Auslesefensters liegt (Gradientenecho).',
        },
      ],
    },
    {
      title: '3. Phasenkodierung',
      blocks: [
        {
          type: 'p',
          text: 'Zwischen Anregung und Auslese wird kurz ein Gradient $G_y$ geschaltet. Danach präzedieren alle Spins wieder gleich schnell, haben aber eine ortsabhängige **Phase** akkumuliert:',
        },
        { type: 'formula', tex: '\\varphi(y) = 2\\pi\\,\\bar\\gamma\\, G_y\\, t_y\\, y = 2\\pi\\, k_y\\, y' },
        {
          type: 'p',
          text: 'Eine einzelne Messung kann die Phasen nicht eindeutig einem Ort zuordnen. Erst die Wiederholung mit $N_y$ unterschiedlichen Gradientenmomenten (Phasenschritten) erlaubt die Rekonstruktion – deshalb gilt für die Messzeit:',
        },
        { type: 'formula', tex: 'TA = TR \\cdot N_{y} \\cdot NEX' },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Phasenrichtung = Problemrichtung',
          text: 'Weil zwischen zwei Phasenschritten ein ganzes TR vergeht, erscheinen Bewegungs- und Flussartefakte sowie Einfaltungen in Phasenrichtung. Die Wahl der Phasenrichtung ist daher eine bewusste Protokollentscheidung.',
        },
      ],
    },
  ],

  kraum: [
    {
      title: 'Das MR-Signal als Fourier-Koeffizient',
      blocks: [
        {
          type: 'p',
          text: 'Integriert man die ortsabhängige Phase über das Objekt, ergibt sich das empfangene Signal (ohne Relaxation) als 2D-Fourier-Transformierte der Magnetisierungsdichte:',
        },
        { type: 'formula', tex: 'S(k_x, k_y) = \\iint \\rho(x,y)\\, e^{-i 2\\pi (k_x x + k_y y)}\\, dx\\,dy' },
        { type: 'formula', tex: 'k_x(t) = \\bar\\gamma \\int_0^t G_x(\\tau)\\,d\\tau, \\qquad k_y = \\bar\\gamma \\int G_y\\,dt', caption: 'k ist das Zeitintegral (die Fläche) des Gradienten' },
        {
          type: 'p',
          text: 'Der **k-Raum** (Rohdatenraum) ist damit der Ortsfrequenzraum des Bildes. Das Bild erhält man durch die inverse 2D-Fourier-Transformation, numerisch per FFT (O(N log N)).',
        },
      ],
    },
    {
      title: 'Abtastung: FOV und Auflösung',
      blocks: [
        { type: 'formula', tex: 'FOV = \\frac{1}{\\Delta k}, \\qquad \\Delta x = \\frac{FOV}{N} = \\frac{1}{2 k_{\\text{max}}}' },
        {
          type: 'list',
          items: [
            '**Abstand** der k-Punkte bestimmt das FOV – zu grobe Abtastung (Nyquist verletzt) → Einfaltung.',
            '**Ausdehnung** des k-Raums bestimmt die Auflösung – abgeschnittene Peripherie → Unschärfe und Gibbs-Ringing.',
            'Das **Zentrum** trägt die meiste Energie: Kontrast und grobe Formen. Die **Peripherie** trägt Kanten und Details.',
          ],
        },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Kein Punkt-zu-Pixel',
          text: 'Jeder k-Raum-Punkt ist eine ebene Welle über das **gesamte** Bild. Ein einzelner fehlerhafter Datenpunkt (Spike) erzeugt daher ein Streifenmuster über das ganze Bild – nicht einen fehlerhaften Pixel.',
        },
      ],
    },
    {
      title: 'Trajektorien und Beschleunigung',
      blocks: [
        {
          type: 'list',
          items: [
            '**Kartesisch**: eine Zeile pro Echo (SE, GRE) oder mehrere pro TR (TSE).',
            '**EPI**: Mäander durch den gesamten k-Raum nach einer Anregung (oszillierender Auslesegradient + Phasen-Blips).',
            '**Radial / PROPELLER**: Zentrum wird mehrfach gemessen → Bewegungsrobustheit.',
            '**Spiral**: effiziente Abdeckung, empfindlich auf Off-Resonanz.',
          ],
        },
        {
          type: 'p',
          text: '**Partial Fourier** nutzt die hermitesche Symmetrie $S(-\\vec k) = S^*(\\vec k)$ reeller Bilder und misst nur ≈ 5/8 des k-Raums. **Parallele Bildgebung** (SENSE, GRAPPA) lässt Zeilen gezielt aus (Faktor R) und entfaltet mit Spulensensitivitäten – mit SNR-Verlust:',
        },
        { type: 'formula', tex: 'SNR_R = \\frac{SNR_{\\text{voll}}}{g\\,\\sqrt{R}}' },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Compressed Sensing',
          text: 'Ist das Bild in einer Transformationsdomäne (z. B. Wavelets) dünn besetzt, kann es aus pseudozufällig unterabgetasteten Daten iterativ rekonstruiert werden – Beschleunigungen von Faktor 5–10 sind möglich.',
        },
      ],
    },
  ],

  sequenzen: [
    {
      title: 'Spin-Echo (SE)',
      blocks: [
        {
          type: 'p',
          text: 'Grundsequenz: 90° – TE/2 – 180° – TE/2 – Echo. Pro TR wird eine k-Raum-Zeile gemessen (Multi-Slice: andere Schichten werden in der Wartezeit angeregt). Robust gegen Inhomogenitäten, Goldstandard für T1w, aber langsam.',
        },
        { type: 'formula', tex: 'S_{\\text{SE}} = \\rho\\,\\big(1 - 2e^{-(TR - TE/2)/T_1} + e^{-TR/T_1}\\big)\\,e^{-TE/T_2} \\approx \\rho\\,(1 - e^{-TR/T_1})\\,e^{-TE/T_2}' },
      ],
    },
    {
      title: 'Turbo-Spin-Echo (TSE / FSE / RARE)',
      blocks: [
        {
          type: 'p',
          text: 'Nach einem 90°-Puls folgt ein **Echozug** aus ETL Refokussierungspulsen; jedes Echo wird anders phasenkodiert. Die Messzeit sinkt um den Faktor ETL. Der Kontrast wird vom Echo bestimmt, das ins k-Raum-Zentrum sortiert wird (**effektives TE**).',
        },
        { type: 'formula', tex: 'TA = \\frac{TR\\cdot N_y\\cdot NEX}{ETL}, \\qquad TE_{\\text{eff}} = n_{\\text{zentral}}\\cdot ESP' },
        {
          type: 'list',
          items: [
            'Vorteil: T2w in 1–3 min statt 10–15 min, robust gegen Suszeptibilität.',
            'Nachteile: Blurring bei kurzem T2 (T2-Filterung über die k-Raum-Zeilen), hohes SAR (viele 180°-Pulse), weniger Schichten pro TR.',
            'Fett erscheint hell (Aufhebung der J-Kopplung bei kurzen Echoabständen).',
            'Extremform: **HASTE** – Single-Shot mit Half-Fourier (< 1 s pro Schicht).',
          ],
        },
      ],
    },
    {
      title: 'Inversion Recovery (IR, STIR, FLAIR)',
      blocks: [
        {
          type: 'p',
          text: 'Ein vorangestellter 180°-Puls invertiert $M_z$. Nach der Inversionszeit TI wird ausgelesen. Gewebe mit $M_z(TI) = 0$ liefern kein Signal:',
        },
        {
          type: 'formula',
          tex: 'M_z(TI) = M_0\\big(1 - 2e^{-TI/T_1} + e^{-TR/T_1}\\big) \\;\\Rightarrow\\; TI_{\\text{null}} = T_1 \\ln\\frac{2}{1 + e^{-TR/T_1}} \\approx T_1 \\ln 2',
        },
        {
          type: 'table',
          head: ['Variante', 'Ziel', 'TI (1,5 T)', 'TI (3 T)'],
          rows: [
            ['STIR', 'Fett nullen', '≈ 150–180 ms', '≈ 220–250 ms'],
            ['FLAIR', 'Liquor nullen', '≈ 2000–2500 ms', '≈ 2400–2800 ms'],
            ['MP-RAGE / IR-T1', 'max. GM/WM-T1-Kontrast', '≈ 800–1000 ms', '≈ 900–1100 ms'],
          ],
        },
        {
          type: 'callout',
          variant: 'klinik',
          title: 'STIR vs. spektrale Fettsättigung',
          text: 'STIR ist B₀-unabhängig und daher robust nahe Metall oder bei großem FOV, nullt aber alle Gewebe mit T1 ≈ T1(Fett) – auch Gd-anreichernde Läsionen. Deshalb nie STIR nach Kontrastmittel!',
        },
      ],
    },
    {
      title: 'Gradientenecho (GRE)',
      blocks: [
        {
          type: 'p',
          text: 'Kein 180°-Puls: Das Echo entsteht durch Umpolung des Auslesegradienten. Kleine Flipwinkel und sehr kurze TR sind möglich. Im gespoilten GRE (FLASH, SPGR) wird Restquermagnetisierung vor jeder Anregung zerstört:',
        },
        { type: 'formula', tex: 'S = \\rho\\,\\sin\\alpha\\,\\frac{1 - E_1}{1 - \\cos\\alpha\\,E_1}\\,e^{-TE/T_2^*}, \\quad E_1 = e^{-TR/T_1}, \\quad \\cos\\alpha_E = E_1' },
        {
          type: 'list',
          items: [
            'Großer α + kurzes TR → T1w; kleiner α + längeres TE → T2*w (Blutungen, Verkalkungen, SWI).',
            'Fett/Wasser in-phase bzw. opposed-phase: 1,5 T: 4,4 / 2,2 ms; 3 T: 2,3 / 1,15 ms (Dixon-Technik).',
            'Sehr empfindlich für Suszeptibilität und Inhomogenität.',
          ],
        },
      ],
    },
    {
      title: 'Echo-Planar-Imaging (EPI)',
      blocks: [
        {
          type: 'p',
          text: 'Peter Mansfield (1977): Der gesamte k-Raum wird nach **einer** Anregung durch einen bipolar oszillierenden Auslesegradienten und kurze Phasen-Blips abgetastet (Messdauer ≈ 50–100 ms pro Schicht). Grundlage für DWI, fMRT (BOLD) und Perfusion.',
        },
        { type: 'formula', tex: 'BW_{\\text{PE,Pixel}} = \\frac{1}{ESP \\cdot N_y / R}' },
        {
          type: 'list',
          items: [
            'Die Bandbreite in Phasenrichtung ist extrem klein (≈ 10–30 Hz/Pixel) → Suszeptibilitätsverzerrungen und Fettverschiebung um viele Pixel **in Phasenrichtung**.',
            'Fettsättigung ist Pflicht; parallele Bildgebung verkürzt den Echozug und reduziert Verzerrung und T2*-Blurring.',
            '**N/2-Ghost**: Fehlanpassungen zwischen geraden und ungeraden Echos (Wirbelströme) erzeugen einen um FOV/2 versetzten Geist.',
          ],
        },
      ],
    },
  ],

  qualitaet: [
    {
      title: 'Signal-zu-Rausch-Verhältnis (SNR)',
      blocks: [
        {
          type: 'p',
          text: 'Das Rauschen entsteht vor allem durch thermische Ströme im leitfähigen Patientengewebe und ist weiß (bandbreitenproportionale Leistung). Für 2D-Bildgebung gilt:',
        },
        {
          type: 'formula',
          tex: 'SNR \\propto B_0 \\cdot \\Delta x\\,\\Delta y\\,\\Delta z \\cdot \\sqrt{\\frac{N_y \\cdot NEX}{BW_{\\text{Pixel}}}} \\cdot \\frac{1}{g\\sqrt{R}} \\cdot f_{\\text{Spule}} \\cdot f_{\\text{Sequenz}}',
        },
        {
          type: 'table',
          head: ['Maßnahme', 'SNR', 'Preis'],
          rows: [
            ['NEX ×2', '×√2 = 1,41', 'Messzeit ×2'],
            ['Schichtdicke ×2', '×2', 'Partialvolumen, z-Auflösung'],
            ['Matrix 256→512 (FOV gleich)', '×0,71 (×½ Voxel, ×√2 Zeit)', 'Messzeit ×2'],
            ['BW/Pixel ×2', '×0,71', '– (aber weniger Chemical Shift, kürzeres TE)'],
            ['1,5 T → 3 T', '≈ ×2', 'SAR ×4, Suszeptibilität ×2'],
            ['Parallele Bildgebung R = 2', '×1/(g√2)', '–'],
          ],
        },
        {
          type: 'callout',
          variant: 'merke',
          title: 'Das Trade-off-Dreieck',
          text: 'SNR, Auflösung und Messzeit lassen sich nie gleichzeitig optimieren. Jede Protokolländerung verschiebt das Gleichgewicht – die Kunst ist, die klinische Fragestellung mit minimalem Aufwand zu beantworten.',
        },
      ],
    },
    {
      title: 'Spezifische Absorptionsrate (SAR)',
      blocks: [
        {
          type: 'p',
          text: 'HF-Pulse deponieren Energie im Gewebe (Wirbelströme im leitfähigen Gewebe). Die SAR ist die absorbierte Leistung pro Masse:',
        },
        { type: 'formula', tex: 'SAR = \\frac{\\sigma\\,|E|^2}{2\\rho} \\;\\propto\\; B_0^2 \\cdot \\alpha^2 \\cdot \\frac{N_{\\text{Pulse}}}{\\Delta t}' },
        {
          type: 'table',
          head: ['Grenzwert (IEC 60601-2-33)', 'Normal Mode', 'First Level'],
          rows: [
            ['Ganzkörper (6-min-Mittel)', '2 W/kg', '4 W/kg'],
            ['Kopf', '3,2 W/kg', '3,2 W/kg'],
            ['Lokal Kopf/Rumpf (10 g)', '10 W/kg', '20 W/kg'],
            ['Lokal Extremitäten', '20 W/kg', '40 W/kg'],
          ],
        },
        {
          type: 'list',
          items: [
            'SAR-Reduktion: Refokussierungswinkel senken, TR verlängern, weniger Schichten pro TR, kürzere ETL, GRE statt TSE, niedrigere Feldstärke.',
            'Spezielle Pulse: VERSE, Hyperecho, variable Flipwinkel (SPACE/CUBE).',
            'Patientengewicht korrekt eingeben – das SAR-Modell des Scanners nutzt es zur Leistungsbegrenzung!',
          ],
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'SAR ≠ PNS',
          text: 'Die SAR beschreibt die Gewebeerwärmung durch das HF-Feld. Periphere Nervenstimulation entsteht dagegen durch schnell geschaltete Gradienten (dB/dt) – ein ganz anderes Sicherheitslimit.',
        },
      ],
    },
    {
      title: 'Artefakt-Management',
      blocks: [
        {
          type: 'table',
          head: ['Artefakt', 'Ursache', 'Richtung', 'Gegenmaßnahme'],
          rows: [
            ['Einfaltung (Aliasing)', 'Objekt > FOV, Phase 2π-periodisch', 'Phase', 'Phasen-Oversampling, FOV vergrößern, Sättigung, Richtung tauschen'],
            ['Bewegung/Fluss', 'Inkonsistente Phase zwischen Zeilen', 'Phase', 'Atemanhalt, Triggerung, Navigator, Sat-Bänder, PROPELLER'],
            ['Chemical Shift 1. Art', 'Fett 3,5 ppm langsamer', 'Frequenz (EPI: Phase)', 'BW erhöhen, Fettsättigung, Dixon'],
            ['Chemical Shift 2. Art', 'Fett/Wasser gegenphasig im Voxel (GRE)', '–', 'In-phase-TE wählen'],
            ['Gibbs / Trunkation', 'k-Raum abgeschnitten', 'beide', 'Matrix erhöhen, Filter'],
            ['Suszeptibilität', 'Metall, Luft-Gewebe-Grenzen', 'v. a. Frequenz/Phase (EPI)', 'TSE statt GRE, hohe BW, kurzes TE, 1,5 T, MARS-Sequenzen'],
            ['Zipper', 'HF-Einstreuung', 'Linie in Phasenrichtung', 'Kabinentür schließen, Störquelle entfernen'],
            ['Spike / Fischgrät', 'Einzelner fehlerhafter k-Raum-Punkt', 'ganzes Bild', 'Service: Entladungen, Kontakte prüfen'],
            ['Magic Angle', 'Kollagenfasern bei 55° zu B₀', '–', 'langes TE (T2w) verwenden'],
          ],
        },
      ],
    },
  ],

  hardware: [
    {
      title: 'Systemüberblick',
      blocks: [
        {
          type: 'p',
          text: 'Ein klinischer MR-Tomograph besteht aus fünf Hauptsystemen: **Magnet** (B₀), **Shimsystem**, **Gradientensystem**, **HF-System** (Sender, Spulen, Empfänger) und **Rechnersystem** (Sequenzsteuerung, Rekonstruktion). Der Untersuchungsraum ist als **Faradaykäfig** ausgeführt.',
        },
      ],
    },
    {
      title: 'Der supraleitende Magnet',
      blocks: [
        {
          type: 'list',
          items: [
            'Spulen aus **Niob-Titan** (NbTi) in Kupfermatrix, supraleitend unter ≈ 9 K, betrieben bei 4,2 K in flüssigem Helium.',
            '**Persistent Mode**: Strom (einige 100 A) fließt im kurzgeschlossenen Supraleiter ohne Stromquelle – das Feld ist immer an, auch nachts.',
            'Ein **Kaltkopf** (Gifford-McMahon/Pulsrohr) rekondensiert Helium (Zero-Boil-Off). Moderne Systeme benötigen nur noch wenige Liter Helium.',
            '**Aktive Abschirmung**: gegensinnig gewickelte Außenspulen reduzieren das Streufeld drastisch.',
            'Homogenität: wenige ppm über eine Kugel (DSV) von 40–50 cm.',
          ],
        },
        {
          type: 'callout',
          variant: 'achtung',
          title: 'Quench',
          text: 'Verliert der Supraleiter lokal seine Eigenschaft, wird die gespeicherte Feldenergie (MJ-Bereich) als Wärme frei; Helium verdampft schlagartig (1 L flüssig ≈ 700 L Gas) und muss über das Quenchrohr ins Freie. Notfall-Quench nur bei Gefahr für Leib und Leben durch ferromagnetische Objekte.',
        },
      ],
    },
    {
      title: 'Shim- und Gradientensystem',
      blocks: [
        {
          type: 'p',
          text: '**Passives Shimming** mit Eisenplättchen bei der Installation, **aktives Shimming** mit Korrekturspulen (1. Ordnung über die Gradienten-Offsets, 2./3. Ordnung über eigene Spulen) patientenspezifisch vor jeder Messung.',
        },
        {
          type: 'p',
          text: 'Drei orthogonale **Gradientenspulen** (z: Maxwell-Paar, x/y: Golay-Sattelspulen) werden von Hochleistungsverstärkern (bis ≈ 900 A, 2000 V) gespeist und wassergekühlt.',
        },
        { type: 'formula', tex: 't_{\\text{Rampe}} = \\frac{G_{\\text{max}}}{SR}, \\qquad \\text{z. B. } \\frac{40\\,\\text{mT/m}}{200\\,\\text{T/m/s}} = 200\\,\\mu\\text{s}' },
        {
          type: 'list',
          items: [
            'Lorentzkräfte im B₀ → Lärm bis > 110 dB(A) → Gehörschutz obligatorisch.',
            'Wirbelströme in leitenden Strukturen → abgeschirmte Gradientenspulen und Pre-Emphasis.',
            'dB/dt-Grenze zur Vermeidung peripherer Nervenstimulation.',
          ],
        },
      ],
    },
    {
      title: 'HF-System und Spulen',
      blocks: [
        {
          type: 'list',
          items: [
            '**Sender**: Frequenzsynthesizer, Modulator, Leistungsverstärker (15–35 kW). Ganzkörperspule (Birdcage) erzeugt ein homogenes, zirkular polarisiertes B₁.',
            '**Empfangsspulen**: Phased-Array-Oberflächenspulen (bis 64+ Kanäle) → hohes SNR, Basis für parallele Bildgebung.',
            '**Verstimmung (Detuning)**: Empfangsspulen werden während des Sendens verstimmt, sonst drohen lokale Erwärmung und Verbrennungen.',
            '**Empfänger**: rauscharme Vorverstärker, Digitalisierung heute oft direkt in der Spule.',
          ],
        },
        { type: 'formula', tex: '\\lambda_{\\text{Gewebe}} = \\frac{c}{f_0\\sqrt{\\varepsilon_r}} \\approx 26\\text{–}30\\ \\text{cm bei 3 T}' },
        {
          type: 'callout',
          variant: 'vertiefung',
          title: 'Dielektrische Effekte',
          text: 'Erreicht die HF-Wellenlänge die Körperdimensionen (ab 3 T), bilden sich stehende Wellen. Das B₁-Feld wird inhomogen – Signalabschattungen im Abdomen sind die Folge. Lösungen: dielektrische Pads, B₁-Shimming mit mehreren Sendekanälen (pTx).',
        },
      ],
    },
    {
      title: 'MR-Sicherheit',
      blocks: [
        {
          type: 'list',
          items: [
            '**Statisches Feld**: Projektil-Effekt ferromagnetischer Objekte, Drehmomente auf Implantate. Zonenkonzept (I–IV) und Screening jeder Person.',
            '**Gradientenfelder**: Nervenstimulation, Lärm, Induktion in Elektroden.',
            '**HF-Feld**: Erwärmung (SAR), Antenneneffekte langer Leiter, Verbrennungen an Hautkontakt-Schleifen.',
            'Implantate: „MR safe“, „MR conditional“ (Bedingungen des Herstellers: Feldstärke, SAR, räumlicher Feldgradient, dB/dt) oder „MR unsafe“.',
          ],
        },
      ],
    },
  ],
};

export const THEORY: Record<Lang, Record<ModuleId, TheorySection[]>> = {
  de: THEORY_DE,
  uk: { ...THEORY_UK_A, ...THEORY_UK_B },
};
