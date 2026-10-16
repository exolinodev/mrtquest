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
          `Каково расстояние $\\Delta k$ между двумя соседними точками k-пространства при поле обзора (FOV) ${fov} мм?`,
        ),
        answer: deltaK(fov),
        tolerance: 0.01,
        unit: t('1/m', 'м⁻¹'),
        hint: t('Das FOV ist der Kehrwert der k-Raum-Schrittweite.', 'FOV – величина, обратная шагу дискретизации k-пространства.'),
        explanation: t(
          `$\\Delta k = 1/FOV = 1/${n(fov / 1000, 3, lang)}\\,\\text{m} = ${n(deltaK(fov), 2, lang)}$ m⁻¹. Wird Δk größer (gröbere Abtastung), wird das FOV kleiner → Einfaltung.`,
          `$\\Delta k = 1/FOV = 1/${n(fov / 1000, 3, lang)}\\,\\text{м} = ${n(deltaK(fov), 2, lang)}$ м⁻¹. Если Δk растёт (более грубая дискретизация), FOV уменьшается → заворот (алиасинг).`,
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
          `FOV ${fov} мм, матрица ${N}. Какая максимальная пространственная частота $k_{\\text{max}}$ дискретизируется?`,
        ),
        answer: kMax(fov, N),
        tolerance: 0.01,
        unit: t('1/m', 'м⁻¹'),
        hint: t(
          '$k_{\\text{max}} = N\\,\\Delta k / 2$ und $\\Delta x = 1/(2k_{\\text{max}})$.',
          '$k_{\\text{max}} = N\\,\\Delta k / 2$ и $\\Delta x = 1/(2k_{\\text{max}})$.',
        ),
        explanation: t(
          `$k_{\\text{max}} = N/(2\\,FOV) = ${N}/(2 \\cdot ${n(fov / 1000, 3, lang)}) = ${n(kMax(fov, N), 1, lang)}$ m⁻¹. Daraus folgt die Pixelgröße $\\Delta x = 1/(2k_{\\text{max}}) = ${n(fov / N, 3, lang)}$ mm.`,
          `$k_{\\text{max}} = N/(2\\,FOV) = ${N}/(2 \\cdot ${n(fov / 1000, 3, lang)}) = ${n(kMax(fov, N), 1, lang)}$ м⁻¹. Отсюда размер пикселя $\\Delta x = 1/(2k_{\\text{max}}) = ${n(fov / N, 3, lang)}$ мм.`,
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
          `Градиент ${g} мТл/м включён на ${n(dt, 2, lang)} мс. Какая позиция в k-пространстве (начиная с k = 0) будет достигнута?`,
        ),
        answer: k,
        tolerance: 0.02,
        unit: t('1/m', 'м⁻¹'),
        hint: t(
          '$k(t) = \\bar\\gamma \\int_0^t G(\\tau)\\,d\\tau$ – die Gradientenfläche zählt.',
          '$k(t) = \\bar\\gamma \\int_0^t G(\\tau)\\,d\\tau$ – важна площадь под градиентом.',
        ),
        explanation: t(
          `$k = \\bar\\gamma\\,G\\,t = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} \\cdot ${n(dt, 2, lang)}\\cdot10^{-3} = ${n(k, 1, lang)}$ m⁻¹. Gradientenfläche ⇔ Position im k-Raum: Dieselbe Fläche mit halbem Gradienten und doppelter Zeit führt zum selben Punkt.`,
          `$k = \\bar\\gamma\\,G\\,t = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} \\cdot ${n(dt, 2, lang)}\\cdot10^{-3} = ${n(k, 1, lang)}$ м⁻¹. Площадь градиента ⇔ позиция в k-пространстве: та же площадь при вдвое меньшем градиенте и вдвое большем времени ведёт к той же точке.`,
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
          `SE с TR = ${tr} мс и ${ny} шагами фазового кодирования измеряют с частичным Фурье (Partial Fourier) ${n(frac * 8, 0, lang)}/8 в фазовом направлении. Сколько длится измерение (NEX = 1)?`,
        ),
        answer: ta,
        tolerance: 0.02,
        unit: t('s', 'с'),
        explanation: t(
          `Nur ${lines} von ${ny} Zeilen werden gemessen: TA = ${tr} ms · ${lines} = ${n(ta, 1, lang)} s. Die fehlenden Zeilen werden über die hermitesche Symmetrie $S(-k) = S^*(k)$ ergänzt – auf Kosten von SNR (∝ √Anzahl Zeilen).`,
          `Измеряется лишь ${lines} из ${ny} строк: TA = ${tr} мс · ${lines} = ${n(ta, 1, lang)} с. Недостающие строки дополняются благодаря эрмитовой симметрии $S(-k) = S^*(k)$ – ценой SNR (∝ √числа строк).`,
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
      ru: 'Какая информация об изображении содержится в центре k-пространства?',
    },
    options: [
      {
        de: 'Der Großteil der Signalenergie: Bildkontrast und grobe Strukturen (niedrige Ortsfrequenzen).',
        ru: 'Большая часть энергии сигнала: контраст изображения и грубые структуры (низкие пространственные частоты).',
      },
      { de: 'Ausschließlich die Kanten und feinen Details.', ru: 'Исключительно края и мелкие детали.' },
      { de: 'Die Pixel in der Bildmitte.', ru: 'Пиксели в центре изображения.' },
      { de: 'Nur das Rauschen.', ru: 'Только шум.' },
    ],
    answer: 0,
    explanation: {
      de: 'Jeder k-Raum-Punkt ist eine Ortsfrequenz, die über das gesamte Bild verteilt ist. Niedrige Frequenzen (Zentrum) bestimmen Kontrast und Helligkeit, die Peripherie liefert Kanten und Auflösung. Deshalb wird in TSE das Echo mit dem gewünschten TE ins k-Raum-Zentrum gelegt.',
      ru: 'Каждая точка k-пространства – это пространственная частота, распределённая по всему изображению. Низкие частоты (центр) определяют контраст и яркость, периферия даёт края и разрешение. Поэтому в TSE эхо с нужным TE помещают в центр k-пространства.',
    },
  },
  {
    id: 'kr-point',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Was entspricht im Bildraum einem einzelnen von null verschiedenen k-Raum-Punkt (abseits des Zentrums)?',
      ru: 'Чему в пространстве изображения соответствует одна ненулевая точка k-пространства (вне центра)?',
    },
    options: [
      {
        de: 'Ein Streifenmuster (ebene Welle), das das gesamte Bild überzieht – Richtung und Frequenz durch die k-Position bestimmt.',
        ru: 'Полосатый узор (плоская волна), покрывающий всё изображение, – направление и частота определяются позицией в k-пространстве.',
      },
      { de: 'Ein einzelner heller Pixel.', ru: 'Один яркий пиксель.' },
      { de: 'Ein heller Kreis in der Bildmitte.', ru: 'Яркий круг в центре изображения.' },
      { de: 'Ein vollständig schwarzes Bild.', ru: 'Полностью чёрное изображение.' },
    ],
    answer: 0,
    explanation: {
      de: 'Die inverse Fourier-Transformation eines Delta-Peaks ist eine komplexe Exponentialwelle e^(i2π(k_x x + k_y y)). Deshalb erzeugt ein einzelner Datenfehler (Spike) ein Streifen-/Fischgrätmuster über das ganze Bild.',
      ru: 'Обратное преобразование Фурье дельта-пика – комплексная экспоненциальная волна e^(i2π(k_x x + k_y y)). Поэтому одна ошибка в данных (спайк) создаёт полосатый узор / «ёлочку» по всему изображению.',
    },
  },
  {
    id: 'kr-skip',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Was passiert, wenn man in Phasenrichtung nur jede zweite k-Raum-Zeile misst (bei gleichem k_max)?',
      ru: 'Что произойдёт, если в фазовом направлении измерять только каждую вторую строку k-пространства (при неизменном k_max)?',
    },
    options: [
      {
        de: 'Δk verdoppelt sich → das FOV halbiert sich und Bildanteile außerhalb falten ein (Aliasing). Parallele Bildgebung entfaltet dies mit Spulensensitivitäten.',
        ru: 'Δk удваивается → FOV уменьшается вдвое, а части изображения вне его заворачиваются (алиасинг). Параллельная визуализация разворачивает это с помощью профилей чувствительности катушек.',
      },
      { de: 'Die Auflösung halbiert sich, das FOV bleibt gleich.', ru: 'Разрешение уменьшается вдвое, FOV остаётся неизменным.' },
      { de: 'Das Bild wird doppelt so hell.', ru: 'Изображение становится вдвое ярче.' },
      { de: 'Es passiert nichts, da der k-Raum symmetrisch ist.', ru: 'Ничего не произойдёт, так как k-пространство симметрично.' },
    ],
    answer: 0,
    explanation: {
      de: 'FOV = 1/Δk. Genau dieses Prinzip nutzen SENSE/GRAPPA: gezielte Unterabtastung (Faktor R) und Rekonstruktion mit Mehrkanal-Spuleninformationen.',
      ru: 'FOV = 1/Δk. Именно этот принцип используют SENSE/GRAPPA: целенаправленная субдискретизация (фактор R) и реконструкция с использованием информации многоканальных катушек.',
    },
  },
  {
    id: 'kr-gibbs',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Welches Artefakt entsteht durch das abrupte Abschneiden des k-Raums bei kleiner Matrix?',
      ru: 'Какой артефакт возникает из-за резкого усечения k-пространства при малой матрице?',
    },
    options: [
      {
        de: 'Gibbs-/Trunkationsartefakt: parallele Überschwinger („Ringing“) an kontrastreichen Kanten.',
        ru: 'Артефакт Гиббса / усечения: параллельные осцилляции («ringing») на контрастных границах.',
      },
      { de: 'Chemical-Shift-Artefakt.', ru: 'Артефакт химического сдвига.' },
      { de: 'Zipper-Artefakt.', ru: 'Артефакт «застёжки-молнии» (zipper).' },
      { de: 'Suszeptibilitätsartefakt.', ru: 'Артефакт магнитной восприимчивости.' },
    ],
    answer: 0,
    explanation: {
      de: 'Die Rekonstruktion entspricht einer Faltung mit einem sinc. An scharfen Kanten (z. B. Liquor–Rückenmark) entstehen Überschwinger von ≈ 9 %, die eine Syrinx vortäuschen können. Abhilfe: größere Matrix oder Filterung (Hanning/Hamming-Fenster).',
      ru: 'Реконструкция соответствует свёртке с функцией sinc. На резких границах (напр., ликвор – спинной мозг) возникают выбросы ≈ 9 %, которые могут имитировать сирингомиелию. Устранение: большая матрица или фильтрация (окно Ханна/Хэмминга).',
    },
  },
  {
    id: 'kr-spike',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Ein einzelner fehlerhafter Datenpunkt („Spike“, z. B. durch elektrostatische Entladung) im k-Raum führt im Bild zu …',
      ru: 'Одна ошибочная точка данных («спайк», напр. из-за электростатического разряда) в k-пространстве приводит на изображении к …',
    },
    options: [
      { de: 'einem über das ganze Bild verteilten Streifen-/Fischgrätmuster.', ru: 'полосатому узору / «ёлочке», распределённым по всему изображению.' },
      { de: 'einem schwarzen Punkt an einer Stelle.', ru: 'чёрной точке в одном месте.' },
      { de: 'einer Einfaltung.', ru: 'завороту (алиасингу).' },
      { de: 'einer Verdopplung des SNR.', ru: 'удвоению SNR.' },
    ],
    answer: 0,
    explanation: {
      de: 'Siehe Basiswelle eines k-Raum-Punktes. Die Ausrichtung der Streifen verrät die k-Position des Spikes.',
      ru: 'См. базисную волну точки k-пространства. Ориентация полос указывает на позицию спайка в k-пространстве.',
    },
  },
  {
    id: 'kr-trajectories',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche k-Raum-Trajektorien werden in der klinischen MRT verwendet? (Mehrfachauswahl)',
      ru: 'Какие траектории k-пространства используют в клинической МРТ? (несколько вариантов)',
    },
    options: [
      { de: 'Kartesisch, zeilenweise', ru: 'Декартова, построчная' },
      { de: 'Radial (Speichen)', ru: 'Радиальная («спицы»)' },
      { de: 'Spiral', ru: 'Спиральная' },
      { de: 'EPI-Mäander (Zick-Zack)', ru: 'EPI-меандр (зигзаг)' },
      { de: 'Zufällig ohne Gradienten', ru: 'Случайная без градиентов' },
    ],
    answers: [0, 1, 2, 3],
    explanation: {
      de: 'Ohne Gradienten bewegt man sich nicht im k-Raum. Radiale und spirale Trajektorien tasten das Zentrum mehrfach ab (bewegungsrobust), erfordern aber Regridding vor der FFT. Kompressed Sensing nutzt pseudozufällige Unterabtastung – aber natürlich trotzdem mit Gradienten.',
      ru: 'Без градиентов перемещение в k-пространстве невозможно. Радиальные и спиральные траектории многократно дискретизируют центр (устойчивость к движению), но требуют пересчёта на сетку (regridding) перед FFT. Compressed Sensing использует псевдослучайную субдискретизацию – но, конечно, тоже с помощью градиентов.',
    },
  },
  {
    id: 'kr-tse-order',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'In einer TSE mit ETL 16 und effektivem TE = 100 ms (ESP 12,5 ms): Welche Echos werden ins k-Raum-Zentrum sortiert?',
      ru: 'В TSE с ETL 16 и эффективным TE = 100 мс (ESP 12,5 мс): какие эхо помещаются в центр k-пространства?',
    },
    options: [
      {
        de: 'Das 8. Echo (≈ 100 ms) – die äußeren Zeilen werden mit früheren bzw. späteren Echos gefüllt.',
        ru: '8-е эхо (≈ 100 мс) – внешние строки заполняются более ранними или более поздними эхо.',
      },
      { de: 'Das 1. Echo, da es das meiste Signal hat.', ru: '1-е эхо, так как у него наибольший сигнал.' },
      { de: 'Das 16. Echo, da es die stärkste T2-Gewichtung trägt.', ru: '16-е эхо, так как у него наиболее сильное T2-взвешивание.' },
      { de: 'Alle Echos werden gemittelt ins Zentrum geschrieben.', ru: 'Все эхо усредняются и записываются в центр.' },
    ],
    answer: 0,
    explanation: {
      de: 'Kontrast entsteht im k-Raum-Zentrum → TE_eff = Echo-Nummer · ESP = 8 · 12,5 ms. Unterschiedliche T2-Gewichtung der äußeren Zeilen wirkt wie ein k-Raum-Filter → Kantenunschärfe (Blurring) bei kurzem T2.',
      ru: 'Контраст формируется в центре k-пространства → TE_eff = номер эхо · ESP = 8 · 12,5 мс. Разное T2-взвешивание внешних строк действует как фильтр k-пространства → размытие границ (blurring) при коротком T2.',
    },
  },
  {
    id: 'kr-hermitian',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Welche Eigenschaft des k-Raums nutzt Partial-Fourier-Bildgebung (Half-Fourier) aus?',
      ru: 'Какое свойство k-пространства использует визуализация с частичным Фурье (Partial Fourier, Half-Fourier)?',
    },
    options: [
      {
        de: 'Für reellwertige Bilder gilt Hermitesche Symmetrie: $S(-k) = S^*(k)$ – eine Hälfte lässt sich (mit Phasenkorrektur) aus der anderen berechnen.',
        ru: 'Для вещественных изображений выполняется эрмитова симметрия: $S(-k) = S^*(k)$ – одну половину можно вычислить из другой (с фазовой коррекцией).',
      },
      { de: 'Der k-Raum ist punktsymmetrisch zu $k_{\\text{max}}$.', ru: 'k-пространство центрально-симметрично относительно $k_{\\text{max}}$.' },
      { de: 'Die Peripherie des k-Raums ist immer null.', ru: 'Периферия k-пространства всегда нулевая.' },
      { de: 'Die FFT ist linear und daher umkehrbar.', ru: 'FFT линейно и поэтому обратимо.' },
    ],
    answer: 0,
    explanation: {
      de: 'Reale Bilder sind durch B₀-Inhomogenitäten nicht exakt reell; daher misst man etwas mehr als die Hälfte (z. B. 5/8), schätzt aus dem symmetrischen Zentrum die Phase und rekonstruiert mit POCS oder Homodyne-Verfahren. HASTE nutzt dies für Single-Shot-TSE.',
      ru: 'Реальные изображения из-за неоднородностей B₀ не являются строго вещественными; поэтому измеряют чуть больше половины (напр., 5/8), оценивают фазу по симметричному центру и реконструируют методами POCS или гомодинным. HASTE использует это для однократной (single-shot) TSE.',
    },
  },
];
