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
        hint: t(
          'Feine Schritte im k-Raum bedeuten ein großes Bildfeld. Welcher einfache Zusammenhang passt dazu? Rechne das FOV zuerst in Meter um.',
          'Мелкие шаги в k-пространстве означают большое поле обзора. Какая простая связь этому соответствует? Сначала переведи FOV в метры.',
        ),
        explanation: t(
          `Der k-Raum-Abstand ist der Kehrwert des Bildfelds. Rechenweg: $\\Delta k = 1/FOV = 1/${n(fov / 1000, 3, lang)}\\,\\text{m} = ${n(deltaK(fov), 2, lang)}$ m⁻¹. Check: FOV mal Δk muss genau 1 ergeben. Das Bild dahinter: Je feiner du im k-Raum abtastest, desto größer ist das Bildfeld, das eindeutig hineinpasst. Tastest du gröber ab (Δk größer), schrumpft das FOV, und alles außerhalb faltet ins Bild ein.`,
          `Шаг в k-пространстве обратен полю обзора. Расчёт: $\\Delta k = 1/FOV = 1/${n(fov / 1000, 3, lang)}\\,\\text{м} = ${n(deltaK(fov), 2, lang)}$ м⁻¹. Проверка: FOV, умноженное на Δk, должно дать ровно 1. Смысл: чем мельче шаг дискретизации в k-пространстве, тем больше поле, которое однозначно в него помещается. Если шаг грубее (Δk больше), FOV уменьшается, и всё, что снаружи, заворачивается в изображение.`,
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
          'Du machst N Schritte der Größe $\\Delta k = 1/FOV$, symmetrisch um das Zentrum verteilt. Wie weit reicht dann eine Seite?',
          'Ты делаешь N шагов размером $\\Delta k = 1/FOV$, симметрично вокруг центра. Как далеко тогда простирается одна сторона?',
        ),
        explanation: t(
          `$k_{\\text{max}}$ ist der halbe Weg durch den k-Raum. Du hast N Schritte der Größe 1/FOV, und die Hälfte davon liegt auf jeder Seite des Zentrums: $k_{\\text{max}} = N/(2\\,FOV) = ${N}/(2 \\cdot ${n(fov / 1000, 3, lang)}) = ${n(kMax(fov, N), 1, lang)}$ m⁻¹. Daraus folgt die Pixelgröße $\\Delta x = 1/(2k_{\\text{max}}) = ${n(fov / N, 3, lang)}$ mm. Check: FOV geteilt durch Matrix ergibt dieselbe Pixelgröße. Je weiter du nach außen misst, desto feiner werden die Details.`,
          `$k_{\\text{max}}$: это половина пути через k-пространство. У тебя N шагов размером 1/FOV, и половина из них лежит по каждую сторону от центра: $k_{\\text{max}} = N/(2\\,FOV) = ${N}/(2 \\cdot ${n(fov / 1000, 3, lang)}) = ${n(kMax(fov, N), 1, lang)}$ м⁻¹. Отсюда размер пикселя $\\Delta x = 1/(2k_{\\text{max}}) = ${n(fov / N, 3, lang)}$ мм. Проверка: FOV, делённое на матрицу, даёт тот же размер пикселя. Чем дальше наружу ты измеряешь, тем мельче детали.`,
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
          'Im k-Raum zählt die Fläche unter dem Gradienten, wie die Strecke beim Autofahren. Rechne alles in T/m und s um.',
          'В k-пространстве важна площадь под градиентом, как пройденный путь при езде на машине. Переведи всё в Тл/м и с.',
        ),
        explanation: t(
          `Die k-Raum-Position ist γ̄ mal Gradientenfläche. Bei konstantem Gradienten ist die Fläche einfach G mal t: $k = \\bar\\gamma\\,G\\,t = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} \\cdot ${n(dt, 2, lang)}\\cdot10^{-3} = ${n(k, 1, lang)}$ m⁻¹. Check: Halber Gradient und doppelte Zeit ergeben dieselbe Fläche und führen zum selben Punkt. Wie beim Autofahren zählt nur die Strecke, nicht wie du sie zurückgelegt hast.`,
          `Позиция в k-пространстве равна γ̄, умноженному на площадь градиента. При постоянном градиенте площадь равна просто G на t: $k = \\bar\\gamma\\,G\\,t = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} \\cdot ${n(dt, 2, lang)}\\cdot10^{-3} = ${n(k, 1, lang)}$ м⁻¹. Проверка: вдвое меньший градиент и вдвое большее время дают ту же площадь и ведут в ту же точку. Как при езде на машине, важен только путь, а не то, как ты его проехал.`,
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
        hint: t(
          'Jede gemessene Zeile kostet ein TR. Wie viele Zeilen misst du bei Partial Fourier wirklich?',
          'Каждая измеренная строка стоит одного TR. Сколько строк ты на самом деле измеряешь при частичном Фурье?',
        ),
        explanation: t(
          `Die Messzeit ist die Zahl der gemessenen Zeilen mal TR. Gemessen werden nur ${lines} von ${ny} Zeilen: TA = ${tr} ms · ${lines} = ${n(ta, 1, lang)} s. Check: Das ist ${n(frac * 8, 0, lang)}/8 der vollen Messzeit. Die fehlenden Zeilen ergänzt die hermitesche Symmetrie $S(-k) = S^*(k)$, wie ein Spiegelbild. Der Preis ist SNR, denn das SNR wächst mit der Wurzel aus der Zahl der gemessenen Zeilen.`,
          `Время измерения равно числу измеренных строк, умноженному на TR. Измеряется лишь ${lines} из ${ny} строк: TA = ${tr} мс · ${lines} = ${n(ta, 1, lang)} с. Проверка: это ${n(frac * 8, 0, lang)}/8 полного времени. Недостающие строки дополняет эрмитова симметрия $S(-k) = S^*(k)$, как зеркальное отражение. Цена: SNR, потому что SNR растёт как корень из числа измеренных строк.`,
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
      de: 'Im Zentrum stecken Kontrast und grobe Formen. Jeder k-Raum-Punkt ist eine Welle über das ganze Bild, kein Pixel. Die niedrigen Frequenzen im Zentrum sind breite, langsame Wellen, und sie legen Helligkeit und Kontrast fest. Die hohen Frequenzen außen sind feine Wellen für Kanten und Details. Wie bei einem Bild aus der Ferne: Die groben Flächen erkennst du sofort, die Feinheiten erst aus der Nähe. Deshalb legt man bei der TSE das Echo mit dem gewünschten TE ins k-Raum-Zentrum.',
      ru: 'В центре находятся контраст и грубые формы. Каждая точка k-пространства: это волна по всему изображению, а не пиксель. Низкие частоты в центре: широкие, медленные волны, они задают яркость и контраст. Высокие частоты на периферии: мелкие волны для краёв и деталей. Как картина издалека: крупные пятна видны сразу, а тонкости только вблизи. Поэтому в TSE эхо с нужным TE помещают в центр k-пространства.',
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
        de: 'Ein Streifenmuster (ebene Welle), das das gesamte Bild überzieht. Richtung und Frequenz bestimmt die k-Position.',
        ru: 'Полосатый узор (плоская волна), покрывающий всё изображение. Направление и частоту определяет позиция в k-пространстве.',
      },
      { de: 'Ein einzelner heller Pixel.', ru: 'Один яркий пиксель.' },
      { de: 'Ein heller Kreis in der Bildmitte.', ru: 'Яркий круг в центре изображения.' },
      { de: 'Ein vollständig schwarzes Bild.', ru: 'Полностью чёрное изображение.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ein einzelner k-Raum-Punkt wird zu einem Streifenmuster über das ganze Bild. Die inverse Fourier-Transformation eines einzelnen Peaks ist eine ebene Welle $e^{i2\\pi(k_x x + k_y y)}$. Ihre Richtung zeigt, in welcher Richtung der Punkt vom Zentrum liegt, und ihre Streifendichte, wie weit er entfernt ist. Wie ein einzelner Ton, der den ganzen Raum füllt und nicht nur eine Ecke. Deshalb erzeugt schon ein einzelner Datenfehler (Spike) Streifen oder ein Fischgrätmuster im ganzen Bild.',
      ru: 'Одна точка k-пространства превращается в полосатый узор по всему изображению. Обратное преобразование Фурье одного пика: это плоская волна $e^{i2\\pi(k_x x + k_y y)}$. Её направление показывает, в какую сторону от центра лежит точка, а густота полос показывает, насколько далеко. Как один звук, который заполняет всю комнату, а не один угол. Поэтому уже одна ошибка в данных (спайк) создаёт полосы или «ёлочку» по всему изображению.',
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
      de: 'Jede zweite Zeile wegzulassen verdoppelt Δk und halbiert das FOV, denn FOV = 1/Δk. Alles, was außerhalb des kleineren Bildfelds liegt, faltet von der Gegenseite ins Bild ein (Aliasing). Die Auflösung bleibt gleich, weil k_max gleich bleibt. Parallele Bildgebung wie SENSE oder GRAPPA nutzt genau das: Sie lässt gezielt Zeilen weg (Faktor R) und entfaltet das Bild mit den Empfindlichkeiten mehrerer Spulen.',
      ru: 'Если пропускать каждую вторую строку, Δk удваивается, а FOV уменьшается вдвое, ведь FOV = 1/Δk. Всё, что лежит за пределами меньшего поля, заворачивается в изображение с противоположной стороны (алиасинг). Разрешение остаётся прежним, потому что k_max не меняется. Параллельная визуализация, например SENSE или GRAPPA, использует именно это: она целенаправленно пропускает строки (фактор R) и разворачивает изображение с помощью чувствительности нескольких катушек.',
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
      de: 'Es entsteht das Gibbs- oder Trunkationsartefakt. Wird der k-Raum hart abgeschnitten, fehlen die hohen Frequenzen, die eine scharfe Kante bräuchte. Mathematisch wird das Bild dann mit einer sinc-Funktion gefaltet, und die schwingt nach. An scharfen Kanten, zum Beispiel zwischen Liquor und Rückenmark, entstehen so Überschwinger von etwa 9 %. Sie können eine Syrinx vortäuschen. Abhilfe: eine größere Matrix oder ein sanftes Fenster (Hanning, Hamming) statt der harten Kante.',
      ru: 'Возникает артефакт Гиббса, или артефакт усечения. Если k-пространство резко обрезано, не хватает высоких частот, нужных для резкого края. Математически изображение тогда сворачивается с функцией sinc, а она колеблется. На резких границах, например между ликвором и спинным мозгом, так возникают выбросы около 9 %. Они могут имитировать сирингомиелию. Что помогает: большая матрица или плавное окно (Ханна, Хэмминга) вместо резкого края.',
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
      de: 'Ein Spike wird zu Streifen im ganzen Bild. Ein k-Raum-Punkt gehört nicht zu einem Pixel, sondern zu einer Welle, die das ganze Bild überzieht. Ist dieser Punkt falsch, liegt eine falsche Welle über allem, oft als Fischgrätmuster. Richtung und Dichte der Streifen verraten dir sogar, wo im k-Raum der Spike sitzt.',
      ru: 'Спайк превращается в полосы по всему изображению. Точка k-пространства относится не к пикселю, а к волне, которая покрывает всё изображение. Если эта точка ошибочна, поверх всего ложится неверная волна, часто в виде «ёлочки». Направление и густота полос даже подскажут, где в k-пространстве сидит спайк.',
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
      de: 'Alle sind im Einsatz, nur „zufällig ohne Gradienten“ nicht. Ohne Gradienten bewegst du dich gar nicht im k-Raum, du bleibst im Zentrum stehen. Radiale und spirale Bahnen laufen mehrfach durchs Zentrum, das macht sie robust gegen Bewegung. Vor der FFT müssen ihre Punkte aber auf ein Raster umgerechnet werden (Regridding). Compressed Sensing lässt pseudozufällig Punkte weg, braucht dafür aber natürlich trotzdem Gradienten.',
      ru: 'Используются все, кроме «случайной без градиентов». Без градиентов ты вообще не движешься в k-пространстве и остаёшься в центре. Радиальные и спиральные траектории много раз проходят через центр, поэтому они устойчивы к движению. Но перед FFT их точки нужно пересчитать на сетку (regridding). Compressed Sensing псевдослучайно пропускает точки, но, конечно, тоже с помощью градиентов.',
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
        de: 'Das 8. Echo (≈ 100 ms). Die äußeren Zeilen werden mit früheren bzw. späteren Echos gefüllt.',
        ru: '8-е эхо (≈ 100 мс). Внешние строки заполняются более ранними или более поздними эхо.',
      },
      { de: 'Das 1. Echo, da es das meiste Signal hat.', ru: '1-е эхо, так как у него наибольший сигнал.' },
      { de: 'Das 16. Echo, da es die stärkste T2-Gewichtung trägt.', ru: '16-е эхо, так как у него наиболее сильное T2-взвешивание.' },
      { de: 'Alle Echos werden gemittelt ins Zentrum geschrieben.', ru: 'Все эхо усредняются и записываются в центр.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ins Zentrum kommt das 8. Echo, denn dort entsteht der Kontrast. Das effektive TE ist Echonummer mal Echoabstand: 8 · 12,5 ms = 100 ms. Check: Das 16. Echo läge bei 200 ms, das 1. bei 12,5 ms. Beide passen nicht zum gewünschten Kontrast. Die äußeren Zeilen tragen eine andere T2-Gewichtung. Das wirkt wie ein Filter im k-Raum und macht Kanten bei kurzem T2 unscharf (Blurring).',
      ru: 'В центр попадает 8-е эхо, потому что именно там формируется контраст. Эффективное TE равно номеру эха, умноженному на межэховый интервал: 8 · 12,5 мс = 100 мс. Проверка: 16-е эхо было бы при 200 мс, 1-е при 12,5 мс. Ни то ни другое не даёт нужного контраста. Внешние строки несут другое T2-взвешивание. Это действует как фильтр в k-пространстве и размывает края при коротком T2 (blurring).',
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
        de: 'Für reellwertige Bilder gilt Hermitesche Symmetrie: $S(-k) = S^*(k)$. Eine Hälfte lässt sich (mit Phasenkorrektur) aus der anderen berechnen.',
        ru: 'Для вещественных изображений выполняется эрмитова симметрия: $S(-k) = S^*(k)$. Одну половину можно вычислить из другой (с фазовой коррекцией).',
      },
      { de: 'Der k-Raum ist punktsymmetrisch zu $k_{\\text{max}}$.', ru: 'k-пространство центрально-симметрично относительно $k_{\\text{max}}$.' },
      { de: 'Die Peripherie des k-Raums ist immer null.', ru: 'Периферия k-пространства всегда нулевая.' },
      { de: 'Die FFT ist linear und daher umkehrbar.', ru: 'FFT линейно и поэтому обратимо.' },
    ],
    answer: 0,
    explanation: {
      de: 'Partial Fourier nutzt die hermitesche Symmetrie. Ist ein Bild rein reell, ist der k-Raum punktsymmetrisch zum Zentrum: Der Wert bei −k ist das komplex konjugierte Spiegelbild des Werts bei +k. Echte MR-Bilder haben wegen B₀-Inhomogenitäten aber eine kleine Phase. Deshalb misst man etwas mehr als die Hälfte, zum Beispiel 5/8, schätzt aus dem symmetrisch gemessenen Zentrum die Phase und rekonstruiert mit POCS oder Homodyne. HASTE nutzt das für eine Single-Shot-TSE.',
      ru: 'Частичный Фурье использует эрмитову симметрию. Если изображение чисто вещественное, k-пространство центрально-симметрично: значение в −k равно комплексно сопряжённому значению в +k. Но реальные МР-изображения из-за неоднородности B₀ имеют небольшую фазу. Поэтому измеряют чуть больше половины, например 5/8, оценивают фазу по симметрично измеренному центру и реконструируют методом POCS или гомодинным методом. HASTE использует это для однократной (single-shot) TSE.',
    },
  },
];
