import { deltaK, kMax } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

export const kraumQuestions: QuestionSource[] = [
  {
    id: 'kr-deltak',
    generate: (rng, lang) => {
      const t = tl(lang);
      const fov = pick(rng, [160, 200, 250, 320, 400]);
      return {
        kind: 'numeric',
        id: 'kr-deltak',
        difficulty: 1,
        prompt: t(
          `Wie groß ist der Abstand $\\Delta k$ zweier benachbarter k-Raum-Punkte bei einem FOV von ${fov} mm?`,
          `Яка відстань $\\Delta k$ між двома сусідніми точками k-простору при полі огляду (FOV) ${fov} мм?`,
        ),
        answer: deltaK(fov),
        tolerance: 0.01,
        unit: t('1/m', 'м⁻¹'),
        hint: t('Das FOV ist der Kehrwert der k-Raum-Schrittweite.', 'FOV є оберненою величиною до кроку дискретизації k-простору.'),
        explanation: t(
          `$\\Delta k = 1/FOV = 1/${n(fov / 1000, 3, lang)}\\,\\text{m} = ${n(deltaK(fov), 2, lang)}$ m⁻¹. Wird Δk größer (gröbere Abtastung), wird das FOV kleiner → Einfaltung.`,
          `$\\Delta k = 1/FOV = 1/${n(fov / 1000, 3, lang)}\\,\\text{м} = ${n(deltaK(fov), 2, lang)}$ м⁻¹. Якщо Δk зростає (грубіша дискретизація), FOV зменшується → загортання (аліасинг).`,
        ),
      };
    },
  },
  {
    id: 'kr-kmax',
    generate: (rng, lang) => {
      const t = tl(lang);
      const fov = pick(rng, [200, 240, 256]);
      const N = pick(rng, [128, 256, 512]);
      return {
        kind: 'numeric',
        id: 'kr-kmax',
        difficulty: 2,
        prompt: t(
          `FOV ${fov} mm, Matrix ${N}. Welche maximale Ortsfrequenz $k_{\\text{max}}$ wird abgetastet?`,
          `FOV ${fov} мм, матриця ${N}. Яка максимальна просторова частота $k_{\\text{max}}$ дискретизується?`,
        ),
        answer: kMax(fov, N),
        tolerance: 0.01,
        unit: t('1/m', 'м⁻¹'),
        hint: t(
          '$k_{\\text{max}} = N\\,\\Delta k / 2$ und $\\Delta x = 1/(2k_{\\text{max}})$.',
          '$k_{\\text{max}} = N\\,\\Delta k / 2$ і $\\Delta x = 1/(2k_{\\text{max}})$.',
        ),
        explanation: t(
          `$k_{\\text{max}} = N/(2\\,FOV) = ${N}/(2 \\cdot ${n(fov / 1000, 3, lang)}) = ${n(kMax(fov, N), 1, lang)}$ m⁻¹. Daraus folgt die Pixelgröße $\\Delta x = 1/(2k_{\\text{max}}) = ${n(fov / N, 3, lang)}$ mm.`,
          `$k_{\\text{max}} = N/(2\\,FOV) = ${N}/(2 \\cdot ${n(fov / 1000, 3, lang)}) = ${n(kMax(fov, N), 1, lang)}$ м⁻¹. Звідси розмір пікселя $\\Delta x = 1/(2k_{\\text{max}}) = ${n(fov / N, 3, lang)}$ мм.`,
        ),
      };
    },
  },
  {
    id: 'kr-kpos',
    generate: (rng, lang) => {
      const t = tl(lang);
      const g = pick(rng, [5, 10, 20, 25]);
      const dt = pick(rng, [0.5, 1, 2]);
      const k = 42.577e6 * g * 1e-3 * dt * 1e-3;
      return {
        kind: 'numeric',
        id: 'kr-kpos',
        difficulty: 2,
        prompt: t(
          `Ein Gradient von ${g} mT/m wird für ${n(dt, 2, lang)} ms geschaltet. Welche k-Raum-Position (ausgehend von k = 0) wird erreicht?`,
          `Градієнт ${g} мТл/м увімкнено на ${n(dt, 2, lang)} мс. Якої позиції в k-просторі (починаючи з k = 0) буде досягнуто?`,
        ),
        answer: k,
        tolerance: 0.02,
        unit: t('1/m', 'м⁻¹'),
        hint: t(
          '$k(t) = \\bar\\gamma \\int_0^t G(\\tau)\\,d\\tau$ – die Gradientenfläche zählt.',
          '$k(t) = \\bar\\gamma \\int_0^t G(\\tau)\\,d\\tau$ – важить площа під градієнтом.',
        ),
        explanation: t(
          `$k = \\bar\\gamma\\,G\\,t = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} \\cdot ${n(dt, 2, lang)}\\cdot10^{-3} = ${n(k, 1, lang)}$ m⁻¹. Gradientenfläche ⇔ Position im k-Raum: Dieselbe Fläche mit halbem Gradienten und doppelter Zeit führt zum selben Punkt.`,
          `$k = \\bar\\gamma\\,G\\,t = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} \\cdot ${n(dt, 2, lang)}\\cdot10^{-3} = ${n(k, 1, lang)}$ м⁻¹. Площа градієнта ⇔ позиція в k-просторі: та сама площа з удвічі меншим градієнтом і вдвічі довшим часом веде до тієї ж точки.`,
        ),
      };
    },
  },
  {
    id: 'kr-partial',
    generate: (rng, lang) => {
      const t = tl(lang);
      const ny = pick(rng, [256, 320, 384]);
      const frac = pick(rng, [5 / 8, 6 / 8, 7 / 8]);
      const tr = pick(rng, [500, 600, 800]);
      const ta = (tr * ny * frac) / 1000;
      const lines = n(frac * ny, 0, lang);
      return {
        kind: 'numeric',
        id: 'kr-partial',
        difficulty: 2,
        prompt: t(
          `Ein SE mit TR = ${tr} ms und ${ny} Phasenkodierschritten wird mit Partial Fourier ${n(frac * 8, 0, lang)}/8 in Phasenrichtung gemessen. Wie lange dauert die Messung (NEX = 1)?`,
          `SE з TR = ${tr} мс і ${ny} кроками фазового кодування вимірюють із неповним Фур’є (Partial Fourier) ${n(frac * 8, 0, lang)}/8 у фазовому напрямку. Скільки триває вимірювання (NEX = 1)?`,
        ),
        answer: ta,
        tolerance: 0.02,
        unit: t('s', 'с'),
        explanation: t(
          `Nur ${lines} von ${ny} Zeilen werden gemessen: TA = ${tr} ms · ${lines} = ${n(ta, 1, lang)} s. Die fehlenden Zeilen werden über die hermitesche Symmetrie $S(-k) = S^*(k)$ ergänzt – auf Kosten von SNR (∝ √Anzahl Zeilen).`,
          `Вимірюється лише ${lines} із ${ny} рядків: TA = ${tr} мс · ${lines} = ${n(ta, 1, lang)} с. Відсутні рядки доповнюються завдяки ермітовій симетрії $S(-k) = S^*(k)$ – ціною SNR (∝ √кількості рядків).`,
        ),
      };
    },
  },
  {
    id: 'kr-center',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Welche Bildinformation steckt im Zentrum des k-Raums?',
      uk: 'Яка інформація про зображення міститься в центрі k-простору?',
    },
    options: [
      {
        de: 'Der Großteil der Signalenergie: Bildkontrast und grobe Strukturen (niedrige Ortsfrequenzen).',
        uk: 'Більша частина енергії сигналу: контраст зображення та грубі структури (низькі просторові частоти).',
      },
      { de: 'Ausschließlich die Kanten und feinen Details.', uk: 'Виключно краї та дрібні деталі.' },
      { de: 'Die Pixel in der Bildmitte.', uk: 'Пікселі в центрі зображення.' },
      { de: 'Nur das Rauschen.', uk: 'Лише шум.' },
    ],
    answer: 0,
    explanation: {
      de: 'Jeder k-Raum-Punkt ist eine Ortsfrequenz, die über das gesamte Bild verteilt ist. Niedrige Frequenzen (Zentrum) bestimmen Kontrast und Helligkeit, die Peripherie liefert Kanten und Auflösung. Deshalb wird in TSE das Echo mit dem gewünschten TE ins k-Raum-Zentrum gelegt.',
      uk: 'Кожна точка k-простору – це просторова частота, розподілена по всьому зображенню. Низькі частоти (центр) визначають контраст і яскравість, периферія дає краї та роздільну здатність. Тому в TSE ехо з бажаним TE розміщують у центрі k-простору.',
    },
  },
  {
    id: 'kr-point',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Was entspricht im Bildraum einem einzelnen von null verschiedenen k-Raum-Punkt (abseits des Zentrums)?',
      uk: 'Чому в просторі зображення відповідає одна ненульова точка k-простору (поза центром)?',
    },
    options: [
      {
        de: 'Ein Streifenmuster (ebene Welle), das das gesamte Bild überzieht – Richtung und Frequenz durch die k-Position bestimmt.',
        uk: 'Смугастий візерунок (плоска хвиля), що вкриває все зображення, – напрямок і частота визначаються позицією в k-просторі.',
      },
      { de: 'Ein einzelner heller Pixel.', uk: 'Один яскравий піксель.' },
      { de: 'Ein heller Kreis in der Bildmitte.', uk: 'Яскраве коло в центрі зображення.' },
      { de: 'Ein vollständig schwarzes Bild.', uk: 'Повністю чорне зображення.' },
    ],
    answer: 0,
    explanation: {
      de: 'Die inverse Fourier-Transformation eines Delta-Peaks ist eine komplexe Exponentialwelle e^(i2π(k_x x + k_y y)). Deshalb erzeugt ein einzelner Datenfehler (Spike) ein Streifen-/Fischgrätmuster über das ganze Bild.',
      uk: 'Обернене перетворення Фур’є дельта-піка – комплексна експоненційна хвиля e^(i2π(k_x x + k_y y)). Тому одна помилка в даних (спайк) створює смугастий візерунок / «ялинку» по всьому зображенню.',
    },
  },
  {
    id: 'kr-skip',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Was passiert, wenn man in Phasenrichtung nur jede zweite k-Raum-Zeile misst (bei gleichem k_max)?',
      uk: 'Що станеться, якщо у фазовому напрямку вимірювати лише кожен другий рядок k-простору (за незмінного k_max)?',
    },
    options: [
      {
        de: 'Δk verdoppelt sich → das FOV halbiert sich und Bildanteile außerhalb falten ein (Aliasing). Parallele Bildgebung entfaltet dies mit Spulensensitivitäten.',
        uk: 'Δk подвоюється → FOV зменшується вдвічі, а частини зображення поза ним загортаються (аліасинг). Паралельна візуалізація розгортає це за допомогою чутливостей котушок.',
      },
      { de: 'Die Auflösung halbiert sich, das FOV bleibt gleich.', uk: 'Роздільна здатність зменшується вдвічі, FOV залишається незмінним.' },
      { de: 'Das Bild wird doppelt so hell.', uk: 'Зображення стає вдвічі яскравішим.' },
      { de: 'Es passiert nichts, da der k-Raum symmetrisch ist.', uk: 'Нічого не станеться, бо k-простір симетричний.' },
    ],
    answer: 0,
    explanation: {
      de: 'FOV = 1/Δk. Genau dieses Prinzip nutzen SENSE/GRAPPA: gezielte Unterabtastung (Faktor R) und Rekonstruktion mit Mehrkanal-Spuleninformationen.',
      uk: 'FOV = 1/Δk. Саме цей принцип використовують SENSE/GRAPPA: цілеспрямована недодискретизація (коефіцієнт R) і реконструкція з використанням інформації багатоканальних котушок.',
    },
  },
  {
    id: 'kr-gibbs',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Welches Artefakt entsteht durch das abrupte Abschneiden des k-Raums bei kleiner Matrix?',
      uk: 'Який артефакт виникає через різке обрізання k-простору при малій матриці?',
    },
    options: [
      {
        de: 'Gibbs-/Trunkationsartefakt: parallele Überschwinger („Ringing“) an kontrastreichen Kanten.',
        uk: 'Артефакт Гіббса / обрізання: паралельні осциляції («ringing») на контрастних межах.',
      },
      { de: 'Chemical-Shift-Artefakt.', uk: 'Артефакт хімічного зсуву.' },
      { de: 'Zipper-Artefakt.', uk: 'Артефакт «застібки-блискавки» (zipper).' },
      { de: 'Suszeptibilitätsartefakt.', uk: 'Артефакт магнітної сприйнятливості.' },
    ],
    answer: 0,
    explanation: {
      de: 'Die Rekonstruktion entspricht einer Faltung mit einem sinc. An scharfen Kanten (z. B. Liquor–Rückenmark) entstehen Überschwinger von ≈ 9 %, die eine Syrinx vortäuschen können. Abhilfe: größere Matrix oder Filterung (Hanning/Hamming-Fenster).',
      uk: 'Реконструкція відповідає згортці з функцією sinc. На різких межах (напр. ліквор – спинний мозок) виникають викиди ≈ 9 %, які можуть імітувати сирінкс. Усунення: більша матриця або фільтрація (вікно Ганнінга/Геммінга).',
    },
  },
  {
    id: 'kr-spike',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Ein einzelner fehlerhafter Datenpunkt („Spike“, z. B. durch elektrostatische Entladung) im k-Raum führt im Bild zu …',
      uk: 'Одна хибна точка даних («спайк», напр. через електростатичний розряд) у k-просторі призводить на зображенні до …',
    },
    options: [
      { de: 'einem über das ganze Bild verteilten Streifen-/Fischgrätmuster.', uk: 'смугастого візерунка / «ялинки», розподіленого по всьому зображенню.' },
      { de: 'einem schwarzen Punkt an einer Stelle.', uk: 'чорної точки в одному місці.' },
      { de: 'einer Einfaltung.', uk: 'загортання (аліасингу).' },
      { de: 'einer Verdopplung des SNR.', uk: 'подвоєння SNR.' },
    ],
    answer: 0,
    explanation: {
      de: 'Siehe Basiswelle eines k-Raum-Punktes. Die Ausrichtung der Streifen verrät die k-Position des Spikes.',
      uk: 'Див. базисну хвилю точки k-простору. Орієнтація смуг вказує на позицію спайку в k-просторі.',
    },
  },
  {
    id: 'kr-trajectories',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche k-Raum-Trajektorien werden in der klinischen MRT verwendet? (Mehrfachauswahl)',
      uk: 'Які траєкторії k-простору використовують у клінічній МРТ? (кілька варіантів)',
    },
    options: [
      { de: 'Kartesisch, zeilenweise', uk: 'Декартова, порядкова' },
      { de: 'Radial (Speichen)', uk: 'Радіальна («спиці»)' },
      { de: 'Spiral', uk: 'Спіральна' },
      { de: 'EPI-Mäander (Zick-Zack)', uk: 'EPI-меандр (зигзаг)' },
      { de: 'Zufällig ohne Gradienten', uk: 'Випадкова без градієнтів' },
    ],
    answers: [0, 1, 2, 3],
    explanation: {
      de: 'Ohne Gradienten bewegt man sich nicht im k-Raum. Radiale und spirale Trajektorien tasten das Zentrum mehrfach ab (bewegungsrobust), erfordern aber Regridding vor der FFT. Kompressed Sensing nutzt pseudozufällige Unterabtastung – aber natürlich trotzdem mit Gradienten.',
      uk: 'Без градієнтів переміщення в k-просторі неможливе. Радіальні та спіральні траєкторії багаторазово дискретизують центр (стійкість до руху), але потребують перерахунку на сітку (regridding) перед FFT. Compressed Sensing використовує псевдовипадкову недодискретизацію – але, звісно, теж за допомогою градієнтів.',
    },
  },
  {
    id: 'kr-tse-order',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'In einer TSE mit ETL 16 und effektivem TE = 100 ms (ESP 12,5 ms): Welche Echos werden ins k-Raum-Zentrum sortiert?',
      uk: 'У TSE з ETL 16 та ефективним TE = 100 мс (ESP 12,5 мс): які ехо розміщуються в центрі k-простору?',
    },
    options: [
      {
        de: 'Das 8. Echo (≈ 100 ms) – die äußeren Zeilen werden mit früheren bzw. späteren Echos gefüllt.',
        uk: '8-ме ехо (≈ 100 мс) – зовнішні рядки заповнюються ранішими або пізнішими ехо.',
      },
      { de: 'Das 1. Echo, da es das meiste Signal hat.', uk: '1-ше ехо, бо воно має найбільший сигнал.' },
      { de: 'Das 16. Echo, da es die stärkste T2-Gewichtung trägt.', uk: '16-те ехо, бо воно має найсильніше T2-зважування.' },
      { de: 'Alle Echos werden gemittelt ins Zentrum geschrieben.', uk: 'Усі ехо усереднюються й записуються в центр.' },
    ],
    answer: 0,
    explanation: {
      de: 'Kontrast entsteht im k-Raum-Zentrum → TE_eff = Echo-Nummer · ESP = 8 · 12,5 ms. Unterschiedliche T2-Gewichtung der äußeren Zeilen wirkt wie ein k-Raum-Filter → Kantenunschärfe (Blurring) bei kurzem T2.',
      uk: 'Контраст формується в центрі k-простору → TE_eff = номер ехо · ESP = 8 · 12,5 мс. Різне T2-зважування зовнішніх рядків діє як фільтр k-простору → розмиття меж (blurring) при короткому T2.',
    },
  },
  {
    id: 'kr-hermitian',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Welche Eigenschaft des k-Raums nutzt Partial-Fourier-Bildgebung (Half-Fourier) aus?',
      uk: 'Яку властивість k-простору використовує візуалізація з неповним Фур’є (Partial Fourier, Half-Fourier)?',
    },
    options: [
      {
        de: 'Für reellwertige Bilder gilt Hermitesche Symmetrie: $S(-k) = S^*(k)$ – eine Hälfte lässt sich (mit Phasenkorrektur) aus der anderen berechnen.',
        uk: 'Для дійснозначних зображень справджується ермітова симетрія: $S(-k) = S^*(k)$ – одну половину можна обчислити з іншої (з фазовою корекцією).',
      },
      { de: 'Der k-Raum ist punktsymmetrisch zu $k_{\\text{max}}$.', uk: 'k-простір центрально-симетричний відносно $k_{\\text{max}}$.' },
      { de: 'Die Peripherie des k-Raums ist immer null.', uk: 'Периферія k-простору завжди нульова.' },
      { de: 'Die FFT ist linear und daher umkehrbar.', uk: 'FFT лінійне, а тому оборотне.' },
    ],
    answer: 0,
    explanation: {
      de: 'Reale Bilder sind durch B₀-Inhomogenitäten nicht exakt reell; daher misst man etwas mehr als die Hälfte (z. B. 5/8), schätzt aus dem symmetrischen Zentrum die Phase und rekonstruiert mit POCS oder Homodyne-Verfahren. HASTE nutzt dies für Single-Shot-TSE.',
      uk: 'Реальні зображення через неоднорідності B₀ не є строго дійснозначними; тому вимірюють трохи більше половини (напр. 5/8), оцінюють фазу із симетричного центру й реконструюють методами POCS або гомодинним. HASTE використовує це для односеансової (single-shot) TSE.',
    },
  },
];
