import { TISSUES } from '../../physics/constants';
import { GAMMA_BAR_H1, spinEchoSignal } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

/** Zusätzliche Fragen zu „Vom Signal zum Bild“ (Vertiefung). */
export const bildQuestions: QuestionSource[] = [
  // ---------------------------------------------------------------- Signaldetektion
  {
    id: 'bi-demod',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Bei 1,5 T kommt das MR-Signal mit rund 63,9 MHz in der Spule an. Was macht die Demodulation im Empfänger?',
      ru: 'При 1,5 Тл МР-сигнал приходит в катушку с частотой около 63,9 МГц. Что делает демодуляция в приёмнике?',
    },
    options: [
      {
        de: 'Sie zieht die Mittenfrequenz f₀ ab. Übrig bleiben nur die kleinen Abweichungen von einigen kHz im Basisband, und genau die tragen die Ortsinformation.',
        ru: 'Она вычитает центральную частоту f₀. Остаются только небольшие отклонения в несколько кГц в базовой полосе, и именно они несут информацию о положении.',
      },
      { de: 'Sie verstärkt das Signal, damit es lauter als das Rauschen wird.', ru: 'Она усиливает сигнал, чтобы он стал громче шума.' },
      { de: 'Sie rechnet das Signal direkt in ein Bild um.', ru: 'Она сразу превращает сигнал в изображение.' },
      { de: 'Sie entfernt den T2*-Zerfall aus dem Signal.', ru: 'Она убирает из сигнала спад T2*.' },
    ],
    answer: 0,
    hint: {
      de: 'Denk an ein Radio: Der Sender funkt auf einer hohen Trägerfrequenz, hören willst du aber nur die Musik, die darauf liegt.',
      ru: 'Вспомни радио: станция передаёт на высокой несущей частоте, а услышать ты хочешь только музыку, которая на неё наложена.',
    },
    explanation: {
      de: '**Demodulation heißt: den Träger abziehen.** Alle Protonen präzedieren fast mit f₀ = 63,9 MHz. Die Gradienten verschieben die Frequenz nur um wenige kHz, je nach Ort. Der Empfänger mischt das Signal mit einer Referenz bei f₀. Danach liegt das Signal im **Basisband**: Ein Proton genau in der Mitte hat 0 Hz, eines am Rand zum Beispiel +16 kHz. So ein langsames Signal lässt sich bequem digitalisieren. Wie beim Radiosender: Der Träger transportiert nur, die Information steckt in der Abweichung. Verstärkt wird vorher im Vorverstärker, das Bild entsteht erst später durch die inverse Fourier-Transformation.',
      ru: '**Демодуляция означает: убрать несущую.** Все протоны прецессируют почти с f₀ = 63,9 МГц. Градиенты сдвигают частоту лишь на несколько кГц, в зависимости от места. Приёмник смешивает сигнал с опорной частотой f₀. После этого сигнал находится в **базовой полосе**: протон точно в центре имеет 0 Гц, протон на краю, например, +16 кГц. Такой медленный сигнал удобно оцифровать. Как у радиостанции: несущая только переносит, информация заключена в отклонении. Усиление происходит раньше, в предусилителе, а изображение появляется только позже, через обратное преобразование Фурье.',
    },
  },
  {
    id: 'bi-iq',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Der Empfänger misst zwei Kanäle, I und Q, die um 90° gegeneinander versetzt sind. Warum reicht ein einziger Kanal nicht? (Mehrfachauswahl)',
      ru: 'Приёмник измеряет два канала, I и Q, сдвинутые друг относительно друга на 90°. Почему одного канала недостаточно? (Множественный выбор)',
    },
    options: [
      {
        de: 'Mit nur einem Kanal sehen +Δf und −Δf gleich aus. Links und rechts der Bildmitte wären nicht zu unterscheiden.',
        ru: 'С одним каналом +Δf и −Δf выглядят одинаково. Левую и правую стороны от центра изображения нельзя было бы различить.',
      },
      {
        de: 'I und Q zusammen ergeben das komplexe Signal s = I + iQ, also genau die Form $\\hat{s}\\,e^{i\\omega t}$ aus dem Skript.',
        ru: 'I и Q вместе дают комплексный сигнал s = I + iQ, то есть именно форму $\\hat{s}\\,e^{i\\omega t}$ из конспекта.',
      },
      { de: 'Der zweite Kanal verdoppelt die Auflösung des Bildes.', ru: 'Второй канал удваивает разрешение изображения.' },
      { de: 'Der zweite Kanal misst die Längsmagnetisierung Mz.', ru: 'Второй канал измеряет продольную намагниченность Mz.' },
    ],
    answers: [0, 1],
    hint: {
      de: 'Ein Zeiger kann im Uhrzeigersinn oder dagegen kreisen. Wenn du nur seinen Schatten auf einer Achse siehst, erkennst du dann die Richtung?',
      ru: 'Стрелка может вращаться по часовой стрелке или против. Если видна только её тень на одной оси, можно ли понять направление?',
    },
    explanation: {
      de: '**Ein Kanal sieht nur cos(Δωt), und der Kosinus ist gerade: cos(+Δωt) = cos(−Δωt).** Ein Proton, das nach der Demodulation mit +2 kHz kreist, sähe also genauso aus wie eines mit −2 kHz. Das wären zwei Orte rechts und links der Mitte. Der zweite Kanal ist um 90° versetzt und misst sin(Δωt). Der Sinus ändert sein Vorzeichen mit der Drehrichtung. Zusammen bilden I und Q das komplexe Signal $s = I + iQ = \\hat{s}\\,e^{i\\Delta\\omega t}$, genau wie im Skript mit $\\cos + i\\sin$ geschrieben. Die Auflösung legen FOV und Matrix fest, nicht die Zahl der Kanäle. Mz kann keine Spule direkt messen, sie spürt nur die kreisende Quermagnetisierung.',
      ru: '**Один канал видит только cos(Δωt), а косинус чётный: cos(+Δωt) = cos(−Δωt).** Протон, который после демодуляции вращается с +2 кГц, выглядел бы так же, как протон с −2 кГц. Это два места справа и слева от центра. Второй канал сдвинут на 90° и измеряет sin(Δωt). Синус меняет знак вместе с направлением вращения. Вместе I и Q образуют комплексный сигнал $s = I + iQ = \\hat{s}\\,e^{i\\Delta\\omega t}$, точно как в конспекте записано через $\\cos + i\\sin$. Разрешение задают FOV и матрица, а не число каналов. Mz ни одна катушка напрямую не измеряет, она чувствует только вращающуюся поперечную намагниченность.',
    },
  },
  {
    id: 'bi-nyquist',
    generate: (rng, lang) => {
      const t = tl(lang);
      const fmax = pick(rng, [16, 32, 50, 62.5]);
      const bw = 2 * fmax;
      const dt = 1000 / bw;
      return {
        kind: 'numeric',
        id: 'bi-nyquist',
        difficulty: 2,
        prompt: t(
          `Nach der Demodulation liegen die Signalfrequenzen zwischen −${n(fmax, 1, lang)} kHz und +${n(fmax, 1, lang)} kHz. Wie groß darf der Abstand zwischen zwei Abtastpunkten höchstens sein, damit nichts verloren geht?`,
          `После демодуляции частоты сигнала лежат между −${n(fmax, 1, lang)} кГц и +${n(fmax, 1, lang)} кГц. Каким может быть самое большое расстояние между двумя точками дискретизации, чтобы ничего не потерять?`,
        ),
        answer: dt,
        tolerance: 0.02,
        unit: t('µs', 'мкс'),
        hint: t(
          'Abtasttheorem: Du musst mindestens doppelt so oft abtasten wie die höchste Frequenz. Rechne die Abtastrate aus und nimm den Kehrwert.',
          'Теорема отсчётов: дискретизировать нужно как минимум вдвое чаще самой высокой частоты. Найди частоту дискретизации и возьми обратную величину.',
        ),
        explanation: t(
          `**Höchstens ${n(dt, 2, lang)} µs.** Nach dem Abtasttheorem (Nyquist) brauchst du mindestens zwei Messpunkte pro Schwingung der höchsten Frequenz. Rechenweg: $f_s \\ge 2 f_{\\max} = 2 \\cdot ${n(fmax, 1, lang)}\\,\\text{kHz} = ${n(bw, 1, lang)}\\,\\text{kHz}$, also $\\Delta t \\le 1/f_s = ${n(dt, 2, lang)}\\,\\mu\\text{s}$. Check: Die Abtastrate entspricht genau der Gesamtbandbreite von −${n(fmax, 1, lang)} bis +${n(fmax, 1, lang)} kHz. Tastest du langsamer ab, geben sich hohe Frequenzen als tiefe aus, und Protonen vom Bildrand landen an der falschen Stelle.`,
          `**Не больше ${n(dt, 2, lang)} мкс.** По теореме отсчётов (Найквиста) нужно как минимум две точки на одно колебание самой высокой частоты. Расчёт: $f_s \\ge 2 f_{\\max} = 2 \\cdot ${n(fmax, 1, lang)}\\,\\text{кГц} = ${n(bw, 1, lang)}\\,\\text{кГц}$, значит $\\Delta t \\le 1/f_s = ${n(dt, 2, lang)}\\,\\text{мкс}$. Проверка: частота дискретизации точно равна полной полосе от −${n(fmax, 1, lang)} до +${n(fmax, 1, lang)} кГц. Если дискретизировать медленнее, высокие частоты выдают себя за низкие, и протоны с края изображения попадают не на своё место.`,
        ),
      };
    },
  },

  // ---------------------------------------------------------------- FOV, Pixel, k-Raum
  {
    id: 'bi-bw-for-fov',
    generate: (rng, lang) => {
      const t = tl(lang);
      const g = pick(rng, [5, 8, 10, 15, 20]);
      const fov = pick(rng, [200, 240, 300]);
      const hzPerMm = GAMMA_BAR_H1 * 1e3 * g * 1e-3;
      const bwKHz = (hzPerMm * fov) / 1000;
      return {
        kind: 'numeric',
        id: 'bi-bw-for-fov',
        difficulty: 2,
        prompt: t(
          `Du willst in Ausleserichtung ein FOV von ${fov} mm, der Auslesegradient beträgt ${g} mT/m. Welche Gesamtbandbreite muss der Empfänger abdecken?`,
          `Тебе нужно поле обзора ${fov} мм в направлении считывания, градиент считывания равен ${g} мТл/м. Какую полную полосу должен охватывать приёмник?`,
        ),
        answer: bwKHz,
        tolerance: 0.02,
        unit: t('kHz', 'кГц'),
        hint: t(
          'Aus $FOV = BW/(\\bar\\gamma G)$ folgt $BW = \\bar\\gamma\\,G\\,FOV$. Rechne G in T/m und das FOV in Meter um.',
          'Из $FOV = BW/(\\bar\\gamma G)$ следует $BW = \\bar\\gamma\\,G\\,FOV$. Переведи G в Тл/м, а FOV в метры.',
        ),
        explanation: t(
          `**Rund ${n(bwKHz, 1, lang)} kHz.** Der Gradient macht aus jedem Millimeter eine eigene Frequenz. Rechenweg: $\\bar\\gamma G = 42{,}58\\,\\text{MHz/T} \\cdot ${n(g / 1000, 3, lang)}\\,\\text{T/m} = ${n(hzPerMm, 1, lang)}\\,\\text{Hz/mm}$. Mal ${fov} mm ergibt $BW = ${n(bwKHz, 1, lang)}$ kHz, also ±${n(bwKHz / 2, 1, lang)} kHz um die Mitte. Check: Doppelter Gradient oder doppeltes FOV verdoppelt die Bandbreite. Ist die Bandbreite kleiner, passt nur ein kleineres FOV hinein, der Rest wird vom Filter abgeschnitten.`,
          `**Около ${n(bwKHz, 1, lang)} кГц.** Градиент превращает каждый миллиметр в свою частоту. Расчёт: $\\bar\\gamma G = 42{,}58\\,\\text{МГц/Тл} \\cdot ${n(g / 1000, 3, lang)}\\,\\text{Тл/м} = ${n(hzPerMm, 1, lang)}\\,\\text{Гц/мм}$. Умножаем на ${fov} мм и получаем $BW = ${n(bwKHz, 1, lang)}$ кГц, то есть ±${n(bwKHz / 2, 1, lang)} кГц вокруг центра. Проверка: двойной градиент или двойное FOV удваивают полосу. Если полоса меньше, помещается только меньшее FOV, а остальное отрезает фильтр.`,
        ),
      };
    },
  },
  {
    id: 'bi-matrix-for-pixel',
    generate: (rng, lang) => {
      const t = tl(lang);
      const [fov, px] = pick(rng, [
        [240, 1.25],
        [256, 1],
        [320, 1.25],
        [192, 0.75],
        [256, 0.5],
        [240, 1.875],
      ] as const);
      const nmat = fov / px;
      return {
        kind: 'numeric',
        id: 'bi-matrix-for-pixel',
        difficulty: 1,
        prompt: t(
          `Das FOV ist ${fov} mm groß. Du möchtest Pixel von ${n(px, 3, lang)} mm. Wie viele Phasenkodierzeilen (Matrix N) brauchst du?`,
          `Поле обзора ${fov} мм. Тебе нужны пиксели размером ${n(px, 3, lang)} мм. Сколько строк фазового кодирования (матрица N) потребуется?`,
        ),
        answer: nmat,
        tolerance: 0.001,
        unit: t('Zeilen', 'строк'),
        hint: t('Die Pixelgröße ist FOV geteilt durch N. Stell die Formel nach N um.', 'Размер пикселя равен FOV, делённому на N. Вырази из формулы N.'),
        explanation: t(
          `**${nmat} Zeilen.** Aus $\\Delta x = FOV/N$ folgt $N = FOV/\\Delta x = ${fov}/${n(px, 3, lang)} = ${nmat}$. Check rückwärts: ${fov} mm / ${nmat} = ${n(px, 3, lang)} mm. Jede Zeile kostet bei der Spin-Echo-Sequenz ein TR. Feinere Pixel brauchen also mehr Zeilen und damit mehr Messzeit, und jedes Pixel bekommt weniger Signal.`,
          `**${nmat} строк.** Из $\\Delta x = FOV/N$ следует $N = FOV/\\Delta x = ${fov}/${n(px, 3, lang)} = ${nmat}$. Обратная проверка: ${fov} мм / ${nmat} = ${n(px, 3, lang)} мм. В спин-эхо каждая строка стоит одного TR. Поэтому более мелкие пиксели требуют больше строк и больше времени, а каждый пиксель получает меньше сигнала.`,
        ),
      };
    },
  },
  {
    id: 'bi-fov-from-dk',
    generate: (rng, lang) => {
      const t = tl(lang);
      const dk = pick(rng, [2.5, 4, 5, 6.25]);
      const fov = 1000 / dk;
      return {
        kind: 'numeric',
        id: 'bi-fov-from-dk',
        difficulty: 1,
        prompt: t(
          `Zwei benachbarte k-Raum-Zeilen liegen $\\Delta k = ${n(dk, 2, lang)}$ m⁻¹ auseinander. Wie groß ist das FOV in dieser Richtung?`,
          `Две соседние строки k-пространства отстоят друг от друга на $\\Delta k = ${n(dk, 2, lang)}$ м⁻¹. Каково поле обзора в этом направлении?`,
        ),
        answer: fov,
        tolerance: 0.01,
        unit: t('mm', 'мм'),
        hint: t('Das FOV ist der Kehrwert des k-Raum-Abstands. Achte auf die Umrechnung von Meter in Millimeter.', 'Поле обзора обратно шагу в k-пространстве. Не забудь перевести метры в миллиметры.'),
        explanation: t(
          `**FOV = ${n(fov, 0, lang)} mm.** Rechenweg: $FOV = 1/\\Delta k = 1/${n(dk, 2, lang)}\\,\\text{m}^{-1} = ${n(fov / 1000, 3, lang)}\\,\\text{m} = ${n(fov, 0, lang)}\\,\\text{mm}$. Check: FOV mal Δk ergibt 1. Größere Schritte im k-Raum heißen kleineres Bildfeld. Ist das Objekt größer als dieses FOV, faltet es sich in dieser Richtung ins Bild ein.`,
          `**FOV = ${n(fov, 0, lang)} мм.** Расчёт: $FOV = 1/\\Delta k = 1/${n(dk, 2, lang)}\\,\\text{м}^{-1} = ${n(fov / 1000, 3, lang)}\\,\\text{м} = ${n(fov, 0, lang)}\\,\\text{мм}$. Проверка: FOV, умноженное на Δk, даёт 1. Более крупные шаги в k-пространстве означают меньшее поле обзора. Если объект больше этого FOV, он заворачивается в изображение в этом направлении.`,
        ),
      };
    },
  },
  {
    id: 'bi-reciprocal',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Bild und k-Raum verhalten sich wie Kehrwerte. Welche Aussagen stimmen? (Mehrfachauswahl)',
      ru: 'Изображение и k-пространство ведут себя как обратные величины. Какие утверждения верны? (Множественный выбор)',
    },
    options: [
      { de: 'Der Abstand Δk der Messpunkte bestimmt das FOV: FOV = 1/Δk.', ru: 'Шаг Δk между точками измерения задаёт поле обзора: FOV = 1/Δk.' },
      { de: 'Die Reichweite k_max bestimmt die Pixelgröße: Δx = 1/(2·k_max).', ru: 'Размах k_max задаёт размер пикселя: Δx = 1/(2·k_max).' },
      { de: 'Misst du weiter außen im k-Raum, wird das FOV größer.', ru: 'Если измерять дальше от центра k-пространства, поле обзора становится больше.' },
      { de: 'Größere Abstände Δk machen die Pixel kleiner.', ru: 'Больший шаг Δk делает пиксели меньше.' },
    ],
    answers: [0, 1],
    hint: {
      de: 'Grob und fein tauschen die Rollen: Was im k-Raum klein ist (Δk), wird im Bild groß (FOV), und umgekehrt.',
      ru: 'Крупное и мелкое меняются ролями: что мало в k-пространстве (Δk), становится большим на изображении (FOV), и наоборот.',
    },
    explanation: {
      de: '**Kleines im k-Raum wird Großes im Bild.** Der feinste Schritt Δk legt fest, wie groß das eindeutige Bildfeld ist: FOV = 1/Δk. Die größte gemessene Ortsfrequenz k_max legt fest, wie fein die Details werden: Δx = 1/(2 k_max) = FOV/N. Misst du weiter außen, bleibt das FOV gleich, aber die Pixel werden kleiner. Machst du die Schritte Δk größer, schrumpft das FOV, die Pixel bleiben bei gleichem k_max gleich groß, und es droht Einfaltung. Das kannst du im Bildaufbau-Labor unter „FOV & Auflösung“ direkt ausprobieren.',
      ru: '**Малое в k-пространстве становится большим на изображении.** Самый мелкий шаг Δk задаёт, насколько велико однозначное поле обзора: FOV = 1/Δk. Самая большая измеренная пространственная частота k_max задаёт, насколько мелкими будут детали: Δx = 1/(2 k_max) = FOV/N. Если измерять дальше наружу, FOV остаётся тем же, а пиксели становятся меньше. Если увеличить шаг Δk, поле обзора уменьшается, пиксели при том же k_max остаются прежними, и возникает угроза заворота. Это можно сразу попробовать в лаборатории построения изображения в режиме «FOV и разрешение».',
    },
  },

  // ---------------------------------------------------------------- Messzeit und Reihenfolge
  {
    id: 'bi-ta-se',
    generate: (rng, lang) => {
      const t = tl(lang);
      const tr = pick(rng, [400, 500, 600, 2000, 3000]);
      const lines = pick(rng, [128, 192, 256]);
      const ta = (tr * lines) / 1000;
      return {
        kind: 'numeric',
        id: 'bi-ta-se',
        difficulty: 1,
        prompt: t(
          `Eine Spin-Echo-Sequenz misst ${lines} Phasenkodierzeilen mit TR = ${tr} ms, eine Mittelung. Wie lange dauert die Messung?`,
          `Последовательность спин-эхо измеряет ${lines} строк фазового кодирования с TR = ${tr} мс, одно усреднение. Сколько длится измерение?`,
        ),
        answer: ta,
        tolerance: 0.01,
        unit: t('s', 'с'),
        hint: t('Beim Spin-Echo liefert jedes TR genau eine Zeile des k-Raums.', 'В спин-эхо каждый TR даёт ровно одну строку k-пространства.'),
        explanation: t(
          `**${n(ta, 1, lang)} s, also etwa ${n(ta / 60, 1, lang)} min.** Für jede Phasenkodierzeile braucht die Sequenz eine neue Anregung, und zwischen zwei Anregungen liegt TR. Rechenweg: $T_A = TR \\cdot N_{\\text{Zeilen}} = ${n(tr / 1000, 1, lang)}\\,\\text{s} \\cdot ${lines} = ${n(ta, 1, lang)}\\,\\text{s}$. Plausibel? Ein T1w mit kurzem TR dauert so ein bis zwei Minuten, ein T2w-Spin-Echo mit langem TR deutlich länger. Genau deshalb nutzt man für T2w meist die TSE.`,
          `**${n(ta, 1, lang)} с, то есть примерно ${n(ta / 60, 1, lang)} мин.** Для каждой строки фазового кодирования последовательности нужно новое возбуждение, а между двумя возбуждениями проходит TR. Расчёт: $T_A = TR \\cdot N_{\\text{строк}} = ${n(tr / 1000, 1, lang)}\\,\\text{с} \\cdot ${lines} = ${n(ta, 1, lang)}\\,\\text{с}$. Правдоподобно? T1w с коротким TR длится так одну-две минуты, T2w спин-эхо с длинным TR заметно дольше. Именно поэтому для T2w обычно используют TSE.`,
        ),
      };
    },
  },
  {
    id: 'bi-tse-saving',
    generate: (rng, lang) => {
      const t = tl(lang);
      const tr = pick(rng, [3000, 4000, 5000]);
      const lines = pick(rng, [192, 256]);
      const etl = pick(rng, [4, 8, 16]);
      const se = (tr * lines) / 1000 / 60;
      const tse = se / etl;
      const saving = se - tse;
      return {
        kind: 'numeric',
        id: 'bi-tse-saving',
        difficulty: 2,
        prompt: t(
          `Ein T2w-Spin-Echo mit TR = ${tr} ms und ${lines} Zeilen soll durch eine TSE mit Echozuglänge ${etl} ersetzt werden (TR und Zeilen gleich). Wie viele Minuten sparst du?`,
          `T2w спин-эхо с TR = ${tr} мс и ${lines} строками заменяют на TSE с длиной эхо-цепочки ${etl} (TR и число строк те же). Сколько минут ты экономишь?`,
        ),
        answer: saving,
        tolerance: 0.02,
        unit: t('min', 'мин'),
        hint: t(
          'Rechne zuerst die Spin-Echo-Zeit aus. Eine TSE füllt pro TR so viele Zeilen, wie der Echozug lang ist.',
          'Сначала посчитай время спин-эхо. TSE заполняет за один TR столько строк, какова длина эхо-цепочки.',
        ),
        explanation: t(
          `**Du sparst rund ${n(saving, 1, lang)} min.** Spin-Echo: $T_A = ${n(tr / 1000, 1, lang)}\\,\\text{s} \\cdot ${lines} = ${n(se * 60, 0, lang)}\\,\\text{s} = ${n(se, 1, lang)}$ min. Die TSE erzeugt nach einer Anregung ${etl} Echos, und jedes bekommt eine eigene Phasenkodierung. So entstehen ${etl} Zeilen pro TR: $T_A = ${n(se, 1, lang)}/${etl} = ${n(tse, 2, lang)}$ min. Ersparnis: ${n(se, 1, lang)} − ${n(tse, 2, lang)} = ${n(saving, 1, lang)} min. Check: Die TSE dauert genau 1/${etl} der Zeit, gespart wird also der Anteil ${etl - 1}/${etl}.`,
          `**Ты экономишь около ${n(saving, 1, lang)} мин.** Спин-эхо: $T_A = ${n(tr / 1000, 1, lang)}\\,\\text{с} \\cdot ${lines} = ${n(se * 60, 0, lang)}\\,\\text{с} = ${n(se, 1, lang)}$ мин. TSE после одного возбуждения создаёт ${etl} эхо, и каждое получает своё фазовое кодирование. Так за один TR появляется ${etl} строк: $T_A = ${n(se, 1, lang)}/${etl} = ${n(tse, 2, lang)}$ мин. Экономия: ${n(se, 1, lang)} − ${n(tse, 2, lang)} = ${n(saving, 1, lang)} мин. Проверка: TSE длится ровно 1/${etl} времени, значит экономится доля ${etl - 1}/${etl}.`,
        ),
      };
    },
  },
  {
    id: 'bi-centric',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Eine Messung muss nach einem Viertel der k-Raum-Zeilen abgebrochen werden, die übrigen Zeilen bleiben null. Bei welcher Reihenfolge stimmt der Bildkontrast trotzdem schon weitgehend?',
      ru: 'Измерение приходится прервать после четверти строк k-пространства, остальные строки остаются нулями. При каком порядке контраст изображения всё равно уже в основном правильный?',
    },
    options: [
      { de: 'Zentrisch: erst die Mitte des k-Raums, dann abwechselnd nach außen.', ru: 'Центрический: сначала середина k-пространства, потом поочерёдно наружу.' },
      { de: 'Linear: von der obersten Zeile nach unten.', ru: 'Линейный: от самой верхней строки вниз.' },
      { de: 'Die Reihenfolge spielt keine Rolle, jede Zeile trägt gleich viel zum Kontrast bei.', ru: 'Порядок не важен, каждая строка вносит в контраст одинаковый вклад.' },
      { de: 'Nur die äußersten Zeilen, denn dort steckt die meiste Signalenergie.', ru: 'Только самые внешние строки, потому что там больше всего энергии сигнала.' },
    ],
    answer: 0,
    hint: {
      de: 'Welcher Teil des k-Raums enthält die groben Helligkeitsverteilungen, welcher die feinen Kanten?',
      ru: 'Какая часть k-пространства содержит грубое распределение яркости, а какая мелкие края?',
    },
    explanation: {
      de: '**Zentrisch, weil die Mitte des k-Raums den Kontrast trägt.** In der Mitte liegen die kleinen Ortsfrequenzen, also die großen, gleichmäßigen Flächen und ihre Helligkeit. Dort steckt auch fast die ganze Signalenergie. Der Rand enthält die feinen Details und Kanten. Mit dem mittleren Viertel bekommst du ein unscharfes Bild, in dem Liquor, graue und weiße Substanz aber schon richtig hell oder dunkel sind. Linear hättest du nur das obere Viertel des k-Raums, das sind feine Streifen ohne Kontrast. Im Bildaufbau-Labor kannst du beide Reihenfolgen bei wenigen Zeilen direkt vergleichen.',
      ru: '**Центрический, потому что центр k-пространства несёт контраст.** В центре лежат малые пространственные частоты, то есть большие однородные области и их яркость. Там же сосредоточена почти вся энергия сигнала. Край содержит мелкие детали и контуры. С центральной четвертью ты получаешь размытое изображение, в котором ликвор, серое и белое вещество уже правильно светлые или тёмные. При линейном порядке у тебя была бы только верхняя четверть k-пространства, это мелкие полосы без контраста. В лаборатории построения изображения можно сразу сравнить оба порядка при небольшом числе строк.',
    },
  },

  // ---------------------------------------------------------------- Gewichtung
  {
    id: 'bi-csf-t1w',
    generate: (rng, lang) => {
      const t = tl(lang);
      const variant = pick(rng, ['abs', 'ratio'] as const);
      const tr = 500;
      const te = 10;
      const csf = TISSUES.csf.params[1.5];
      const wm = TISSUES.wm.params[1.5];
      const sCsf = spinEchoSignal(csf, tr, te);
      const sWm = spinEchoSignal(wm, tr, te);
      const t1fac = 1 - Math.exp(-tr / csf.t1);
      const t2fac = Math.exp(-te / csf.t2);
      const wmT1 = 1 - Math.exp(-tr / wm.t1);
      const wmT2 = Math.exp(-te / wm.t2);
      const values = t(
        `Liquor: T1 = ${csf.t1} ms, T2 = ${csf.t2} ms, PD = ${n(csf.pd, 2, lang)}. Weiße Substanz: T1 = ${wm.t1} ms, T2 = ${wm.t2} ms, PD = ${n(wm.pd, 2, lang)}.`,
        `Ликвор: T1 = ${csf.t1} мс, T2 = ${csf.t2} мс, PD = ${n(csf.pd, 2, lang)}. Белое вещество: T1 = ${wm.t1} мс, T2 = ${wm.t2} мс, PD = ${n(wm.pd, 2, lang)}.`,
      );
      const formula = 'S = PD \\cdot (1 - e^{-TR/T_1}) \\cdot e^{-TE/T_2}';
      const csfWay = (label: string) =>
        `$S_{\\text{${label}}} = ${n(csf.pd, 2, lang)} \\cdot (1 - e^{-${tr}/${csf.t1}}) \\cdot e^{-${te}/${csf.t2}} = ${n(csf.pd, 2, lang)} \\cdot ${n(t1fac, 3, lang)} \\cdot ${n(t2fac, 3, lang)} = ${n(sCsf, 3, lang)}$`;
      const wmWay = `$S_{\\text{WM}} = ${n(wm.pd, 2, lang)} \\cdot ${n(wmT1, 3, lang)} \\cdot ${n(wmT2, 3, lang)} = ${n(sWm, 3, lang)}$`;
      if (variant === 'abs') {
        return {
          kind: 'numeric',
          id: 'bi-csf-t1w',
          difficulty: 3,
          prompt: t(
            `T1w-Spin-Echo wie im Skript: TR/TE = ${tr}/${te} ms. ${values} Wie groß ist das Liquorsignal in Prozent des maximal möglichen Signals (PD = 1, voll relaxiert, kein T2-Zerfall)?`,
            `T1w спин-эхо, как в конспекте: TR/TE = ${tr}/${te} мс. ${values} Каков сигнал ликвора в процентах от максимально возможного (PD = 1, полная релаксация, без спада T2)?`,
          ),
          answer: sCsf * 100,
          tolerance: 0.03,
          unit: '%',
          hint: t(`Setze in die Signalgleichung $${formula}$ ein. Welcher Faktor ist hier klein?`, `Подставь в уравнение сигнала $${formula}$. Какой множитель здесь мал?`),
          explanation: t(
            `**Nur etwa ${n(sCsf * 100, 1, lang)} %.** Rechenweg: ${csfWay('Liq')}. Der T2-Faktor ist fast 1, weil TE winzig gegen T2 ist. Klein ist der T1-Faktor: In 500 ms baut Liquor mit T1 = 4 s erst gut ein Zehntel seiner Längsmagnetisierung wieder auf. Check: TR/T1 = 0,125, und für kleine Werte gilt $1 - e^{-x} \\approx x$, also rund 12 %. Deshalb ist Liquor im T1w dunkel.`,
            `**Всего около ${n(sCsf * 100, 1, lang)} %.** Расчёт: ${csfWay('ликв')}. Множитель T2 почти равен 1, потому что TE ничтожно мало по сравнению с T2. Мал множитель T1: за 500 мс ликвор с T1 = 4 с восстанавливает лишь немногим больше десятой части продольной намагниченности. Проверка: TR/T1 = 0,125, а для малых значений $1 - e^{-x} \\approx x$, то есть примерно 12 %. Поэтому ликвор на T1w тёмный.`,
          ),
        };
      }
      return {
        kind: 'numeric',
        id: 'bi-csf-t1w',
        difficulty: 3,
        prompt: t(
          `T1w-Spin-Echo wie im Skript: TR/TE = ${tr}/${te} ms. ${values} Wie groß ist das Verhältnis Signal Liquor zu Signal weiße Substanz?`,
          `T1w спин-эхо, как в конспекте: TR/TE = ${tr}/${te} мс. ${values} Каково отношение сигнала ликвора к сигналу белого вещества?`,
        ),
        answer: sCsf / sWm,
        tolerance: 0.03,
        unit: '',
        hint: t(`Rechne beide Signale mit $${formula}$ aus und teile sie.`, `Посчитай оба сигнала по $${formula}$ и раздели их.`),
        explanation: t(
          `**Etwa ${n(sCsf / sWm, 2, lang)}, Liquor hat also weniger als halb so viel Signal.** Rechenweg: ${csfWay('Liq')} und ${wmWay}. Verhältnis: ${n(sCsf, 3, lang)}/${n(sWm, 3, lang)} = ${n(sCsf / sWm, 2, lang)}. Der Grund ist der T1-Faktor: Weiße Substanz (T1 = 780 ms) hat nach 500 ms schon fast die Hälfte von M₀ zurück, Liquor (T1 = 4000 ms) nur gut ein Zehntel. Check: Das Verhältnis ist kleiner als 1, Liquor ist im T1w dunkler als Hirngewebe, genau wie im Skriptbild.`,
          `**Около ${n(sCsf / sWm, 2, lang)}, то есть у ликвора меньше половины сигнала.** Расчёт: ${csfWay('ликв')} и ${wmWay}. Отношение: ${n(sCsf, 3, lang)}/${n(sWm, 3, lang)} = ${n(sCsf / sWm, 2, lang)}. Причина в множителе T1: белое вещество (T1 = 780 мс) за 500 мс уже восстанавливает почти половину M₀, ликвор (T1 = 4000 мс) лишь немногим больше десятой части. Проверка: отношение меньше 1, ликвор на T1w темнее ткани мозга, точно как на снимке в конспекте.`,
        ),
      };
    },
  },
  {
    id: 'bi-csf-t2w',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Im Skript ist Liquor im T1w (TR/TE = 500/10 ms) dunkel und im T2w (TR/TE = 5500/101 ms) hell. Was ist der Grund für das helle Liquorsignal im T2w?',
      ru: 'В конспекте ликвор на T1w (TR/TE = 500/10 мс) тёмный, а на T2w (TR/TE = 5500/101 мс) светлый. Почему ликвор на T2w светлый?',
    },
    options: [
      {
        de: 'Das lange TR gleicht den T1-Nachteil weitgehend aus, und beim langen TE hat nur Liquor mit seinem sehr langen T2 noch viel Quermagnetisierung.',
        ru: 'Длинное TR в основном снимает недостаток по T1, а при длинном TE только ликвор с его очень длинным T2 ещё сохраняет много поперечной намагниченности.',
      },
      { de: 'Liquor hat ein sehr kurzes T2 und zerfällt deshalb schnell zu hellem Signal.', ru: 'У ликвора очень короткое T2, поэтому он быстро распадается в яркий сигнал.' },
      { de: 'Im T2w wird immer Kontrastmittel gegeben, das sich im Liquor sammelt.', ru: 'При T2w всегда вводят контрастное вещество, которое собирается в ликворе.' },
      { de: 'Liquor hat das kürzeste T1 im Kopf und erholt sich deshalb am schnellsten.', ru: 'У ликвора самое короткое T1 в голове, поэтому он восстанавливается быстрее всех.' },
    ],
    answer: 0,
    hint: {
      de: 'Schau dir beide Faktoren der Signalgleichung getrennt an: Was macht TR = 5500 ms mit dem T1-Teil, was macht TE = 101 ms mit dem T2-Teil?',
      ru: 'Рассмотри оба множителя уравнения сигнала по отдельности: что делает TR = 5500 мс с частью T1, а что делает TE = 101 мс с частью T2?',
    },
    explanation: {
      de: '**Langes T2 plus langes TR.** Bei TR = 5500 ms hat Liquor (T1 ≈ 4000 ms) rund 75 % seiner Längsmagnetisierung zurück, weiße Substanz fast 100 %. Der T1-Unterschied ist also klein geworden. Bei TE = 101 ms entscheidet der T2-Faktor: Für Liquor ist $e^{-101/2000} \\approx 0{,}95$, für weiße Substanz $e^{-101/80} \\approx 0{,}28$. Liquor behält fast alles, Hirngewebe hat schon viel verloren. Freies Wasser bewegt sich schnell, die Spins stören sich kaum gegenseitig, deshalb ist T2 so lang. Kontrastmittel braucht es dafür nicht, und ein kurzes T2 würde Liquor dunkel machen.',
      ru: '**Длинное T2 плюс длинное TR.** При TR = 5500 мс ликвор (T1 ≈ 4000 мс) восстанавливает около 75 % продольной намагниченности, белое вещество почти 100 %. Разница по T1 стала маленькой. При TE = 101 мс решает множитель T2: для ликвора $e^{-101/2000} \\approx 0{,}95$, для белого вещества $e^{-101/80} \\approx 0{,}28$. Ликвор сохраняет почти всё, ткань мозга уже многое потеряла. Свободная вода движется быстро, спины почти не мешают друг другу, поэтому T2 такое длинное. Контрастное вещество для этого не нужно, а короткое T2 сделало бы ликвор тёмным.',
    },
  },

  // ---------------------------------------------------------------- Schichtselektion
  {
    id: 'bi-sinc-truncate',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Ein ideales Rechteck-Schichtprofil bräuchte einen unendlich langen sinc-Puls. Was passiert, wenn du den sinc-Puls stark abschneidest, also nur Hauptkeule und eine Seitenkeule sendest?',
      ru: 'Для идеального прямоугольного профиля среза нужен бесконечно длинный sinc-импульс. Что произойдёт, если сильно обрезать sinc-импульс, то есть передать только главный лепесток и один боковой?',
    },
    options: [
      {
        de: 'Das Profil wird unsauber: Die Kanten werden flacher, und es entstehen kleine Überschwinger. Benachbarte Schichten werden teilweise mit angeregt.',
        ru: 'Профиль становится неточным: края становятся пологими, появляются небольшие выбросы. Соседние срезы частично тоже возбуждаются.',
      },
      { de: 'Das Profil bleibt ein perfektes Rechteck, nur die Schicht verschiebt sich.', ru: 'Профиль остаётся идеальным прямоугольником, только срез смещается.' },
      { de: 'Die Schicht wird automatisch dünner und schärfer.', ru: 'Срез автоматически становится тоньше и резче.' },
      { de: 'Es wird gar keine Schicht mehr angeregt.', ru: 'Срез вообще перестаёт возбуждаться.' },
    ],
    answer: 0,
    hint: {
      de: 'Das Schichtprofil ist die Fourier-Transformierte der Pulsform. Was passiert mit einem Spektrum, wenn man das Zeitsignal abrupt abschneidet?',
      ru: 'Профиль среза это преобразование Фурье формы импульса. Что происходит со спектром, если резко оборвать сигнал во времени?',
    },
    explanation: {
      de: '**Rechteck und sinc sind ein Fourier-Paar.** Während der Schichtwahl liegt ein Gradient an, also gehört zu jedem Ort eine Frequenz. Das Schichtprofil entspricht deshalb dem Frequenzspektrum des Pulses. Ein Rechteck im Frequenzraum gehört zu einem sinc in der Zeit, der nach beiden Seiten unendlich weiterschwingt. Schneidest du ihn ab, ist das wie eine Multiplikation mit einem Fenster. Im Spektrum wird das Rechteck dadurch verschmiert: flachere Flanken und Überschwinger, ähnlich wie das Gibbs-Ringing im Bild. Die Schicht wird dadurch weder dünner noch verschoben, verschoben wird sie über die Sendefrequenz.',
      ru: '**Прямоугольник и sinc это пара Фурье.** Во время выбора среза включён градиент, поэтому каждому месту соответствует своя частота. Поэтому профиль среза соответствует частотному спектру импульса. Прямоугольнику в частотной области соответствует sinc во времени, который бесконечно колеблется в обе стороны. Если его обрезать, это как умножение на окно. В спектре прямоугольник при этом размывается: края становятся пологими, появляются выбросы, похоже на звон Гиббса на изображении. Срез от этого не становится тоньше и не смещается, смещают его через частоту передачи.',
    },
  },
  {
    id: 'bi-slice-bw',
    generate: (rng, lang) => {
      const t = tl(lang);
      const dz = pick(rng, [2, 3, 5]);
      const g = pick(rng, [10, 15, 20]);
      const hzPerMm = GAMMA_BAR_H1 * 1e3 * g * 1e-3;
      const bw = hzPerMm * dz;
      return {
        kind: 'numeric',
        id: 'bi-slice-bw',
        difficulty: 2,
        prompt: t(
          `Der Schichtselektionsgradient $G_{SS}$ beträgt ${g} mT/m. Welche Bandbreite muss der HF-Puls haben, damit die Schicht ${dz} mm dick wird?`,
          `Градиент выбора среза $G_{SS}$ равен ${g} мТл/м. Какой должна быть полоса РЧ-импульса, чтобы толщина среза была ${dz} мм?`,
        ),
        answer: bw,
        tolerance: 0.02,
        unit: t('Hz', 'Гц'),
        hint: t(
          'Aus $\\Delta z = \\Delta f/(\\bar\\gamma\\,G_{SS})$ folgt $\\Delta f = \\bar\\gamma\\,G_{SS}\\,\\Delta z$. Wie viele Hz pro Millimeter erzeugt der Gradient?',
          'Из $\\Delta z = \\Delta f/(\\bar\\gamma\\,G_{SS})$ следует $\\Delta f = \\bar\\gamma\\,G_{SS}\\,\\Delta z$. Сколько Гц на миллиметр создаёт градиент?',
        ),
        explanation: t(
          `**Etwa ${n(bw, 0, lang)} Hz.** Der Gradient verteilt die Frequenzen über den Körper: $\\bar\\gamma G_{SS} = 42{,}58\\,\\text{MHz/T} \\cdot ${n(g / 1000, 3, lang)}\\,\\text{T/m} = ${n(hzPerMm, 1, lang)}\\,\\text{Hz/mm}$. Für ${dz} mm brauchst du $\\Delta f = ${n(hzPerMm, 1, lang)} \\cdot ${dz} = ${n(bw, 0, lang)}$ Hz. Check rückwärts: $\\Delta z = ${n(bw, 0, lang)}/${n(hzPerMm, 1, lang)} = ${dz}$ mm. Willst du die Schicht dünner, nimmst du eine kleinere Bandbreite (längeren Puls) oder einen steileren Gradienten.`,
          `**Около ${n(bw, 0, lang)} Гц.** Градиент распределяет частоты по телу: $\\bar\\gamma G_{SS} = 42{,}58\\,\\text{МГц/Тл} \\cdot ${n(g / 1000, 3, lang)}\\,\\text{Тл/м} = ${n(hzPerMm, 1, lang)}\\,\\text{Гц/мм}$. Для ${dz} мм нужно $\\Delta f = ${n(hzPerMm, 1, lang)} \\cdot ${dz} = ${n(bw, 0, lang)}$ Гц. Обратная проверка: $\\Delta z = ${n(bw, 0, lang)}/${n(hzPerMm, 1, lang)} = ${dz}$ мм. Чтобы срез стал тоньше, берут меньшую полосу (более длинный импульс) или более крутой градиент.`,
        ),
      };
    },
  },
  {
    id: 'bi-rephase-area',
    generate: (rng, lang) => {
      const t = tl(lang);
      const g = pick(rng, [5, 8, 10]);
      const tau = pick(rng, [2, 3, 4]);
      const area = (g * tau) / 2;
      return {
        kind: 'numeric',
        id: 'bi-rephase-area',
        difficulty: 3,
        prompt: t(
          `Während eines symmetrischen sinc-Pulses von ${tau} ms liegt ein Schichtgradient von ${g} mT/m an. Welche Fläche (Gradientenmoment) muss der umgepolte Refokussierlappen danach haben?`,
          `Во время симметричного sinc-импульса длительностью ${tau} мс включён градиент среза ${g} мТл/м. Какую площадь (момент градиента) должен иметь следующий за ним лепесток обратной полярности для рефокусировки?`,
        ),
        answer: area,
        tolerance: 0.02,
        unit: t('mT·ms/m', 'мТл·мс/м'),
        hint: t(
          'Die Spins kippen im Mittel in der Mitte des Pulses. Nur die Gradientenfläche danach dephasiert sie und muss zurückgedreht werden.',
          'В среднем спины опрокидываются в середине импульса. Расфазирует их только площадь градиента после этого момента, и её нужно вернуть обратно.',
        ),
        explanation: t(
          `**${n(area, 1, lang)} mT·ms/m, also die halbe Fläche.** Der Schichtgradient hat insgesamt die Fläche ${g} mT/m · ${tau} ms = ${n(g * tau, 1, lang)} mT·ms/m. Die Quermagnetisierung entsteht im Mittel in der Pulsmitte. In der zweiten Pulshälfte präzedieren die Spins an verschiedenen Orten der Schicht schon unterschiedlich schnell und laufen in der Phase auseinander. Der umgepolte Lappen mit ${n(g * tau, 1, lang)}/2 = ${n(area, 1, lang)} mT·ms/m dreht diese Phase genau zurück. Check: Ohne ihn würde sich das Signal über die Schichtdicke fast auslöschen, mit zu viel Fläche würde es in die andere Richtung dephasieren.`,
          `**${n(area, 1, lang)} мТл·мс/м, то есть половина площади.** Полная площадь градиента среза ${g} мТл/м · ${tau} мс = ${n(g * tau, 1, lang)} мТл·мс/м. Поперечная намагниченность в среднем возникает в середине импульса. Во второй половине импульса спины в разных местах среза уже прецессируют с разной скоростью и расходятся по фазе. Лепесток обратной полярности с ${n(g * tau, 1, lang)}/2 = ${n(area, 1, lang)} мТл·мс/м точно возвращает эту фазу. Проверка: без него сигнал по толщине среза почти бы погас, а при слишком большой площади расфазировка пошла бы в другую сторону.`,
        ),
      };
    },
  },
];
