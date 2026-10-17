import { n, pick, tl, type QuestionSource } from './types';

/** Anhang „Fourier-Transformation kompakt“: Reihe, Koeffizienten, Orthogonalität, DFT, Eigenschaften. */
export const fourierQuestions: QuestionSource[] = [
  {
    id: 'fo-saw-amp',
    generate: (rng, lang) => {
      const a1 = pick(rng, [6, 8, 10, 12, 15, 24]);
      const order = pick(rng, [2, 3, 4, 5, 6, 8]);
      const an = a1 / order;
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'fo-saw-amp',
        difficulty: 1,
        prompt: t(
          `Ein Sägezahnsignal hat die Fourier-Reihe $f(t) = A \\sum_{n=1}^{\\infty} \\frac{1}{n}\\sin(n\\omega t)$. Die Grundschwingung ($n = 1$) hat eine Amplitude von ${a1} mV. Wie groß ist die Amplitude der ${order}. Harmonischen?`,
          `Пилообразный сигнал имеет ряд Фурье $f(t) = A \\sum_{n=1}^{\\infty} \\frac{1}{n}\\sin(n\\omega t)$. Основная гармоника ($n = 1$) имеет амплитуду ${a1} мВ. Какова амплитуда ${order}-й гармоники?`,
        ),
        answer: an,
        tolerance: 0.02,
        unit: t('mV', 'мВ'),
        hint: t(
          'Lies den Koeffizienten vor $\\sin(n\\omega t)$ direkt ab. Er hängt nur von n ab.',
          'Прочитай коэффициент перед $\\sin(n\\omega t)$ прямо из формулы. Он зависит только от n.',
        ),
        explanation: t(
          `**Die ${order}. Harmonische hat ${n(an, 2, lang)} mV.** Beim Sägezahn ist der Koeffizient $b_n = A/n$. Jede höhere Harmonische ist also um den Faktor n leiser als die Grundschwingung. Wie bei einem Klavierton: Der Grundton ist am lautesten, die Obertöne werden nach oben hin immer leiser, geben dem Klang aber seinen Charakter. Rechnung: $b_{${order}} = ${a1}/${order} = ${n(an, 2, lang)}$ mV. Check: Das Ergebnis muss kleiner sein als ${a1} mV, und die ${order * 2}. Harmonische hätte nur noch die Hälfte davon. Gerade diese langsam abfallenden Obertöne braucht es, um die scharfe Kante des Sägezahns nachzubauen.`,
          `**${order}-я гармоника имеет ${n(an, 2, lang)} мВ.** У пилы коэффициент $b_n = A/n$. Значит, каждая высшая гармоника в n раз тише основной. Как у звука фортепиано: основной тон самый громкий, обертоны вверх становятся всё тише, но придают звуку характер. Расчёт: $b_{${order}} = ${a1}/${order} = ${n(an, 2, lang)}$ мВ. Проверка: результат должен быть меньше ${a1} мВ, а у ${order * 2}-й гармоники осталась бы лишь половина от него. Именно такие медленно убывающие обертоны нужны, чтобы воспроизвести острый край пилы.`,
        ),
      };
    },
  },
  {
    id: 'fo-ortho-int',
    generate: (rng, lang) => {
      const amp = pick(rng, [1, 2, 3, 4]);
      const m = pick(rng, [1, 2, 3]);
      const k = pick(rng, [1, 2, 3]);
      const value = m === k ? amp * Math.PI : 0;
      const t = tl(lang);
      const fn = `${amp === 1 ? '' : amp}\\sin(${m === 1 ? '' : m}t)`;
      const g = `\\sin(${k === 1 ? '' : k}t)`;
      return {
        kind: 'numeric',
        id: 'fo-ortho-int',
        difficulty: 2,
        prompt: t(
          `Ein Signal $f(t) = ${fn}$ (in mV, t in s) wird mit der Testfunktion $g(t) = ${g}$ multipliziert und über eine volle Periode integriert: $c = \\int_0^{2\\pi} f(t)\\,g(t)\\,dt$. Wie groß ist c?`,
          `Сигнал $f(t) = ${fn}$ (в мВ, t в с) умножают на пробную функцию $g(t) = ${g}$ и интегрируют по полному периоду: $c = \\int_0^{2\\pi} f(t)\\,g(t)\\,dt$. Чему равно c?`,
        ),
        answer: value,
        tolerance: 0.02,
        unit: t('mV·s', 'мВ·с'),
        hint: t(
          'Haben Signal und Testfunktion dieselbe Frequenz, ist das Produkt fast immer positiv. Bei verschiedenen Frequenzen heben sich positive und negative Flächen auf. Merke: $\\int_0^{2\\pi}\\sin^2(nt)\\,dt = \\pi$.',
          'Если у сигнала и пробной функции одна частота, произведение почти всегда положительно. При разных частотах положительные и отрицательные площади взаимно гасятся. Запомни: $\\int_0^{2\\pi}\\sin^2(nt)\\,dt = \\pi$.',
        ),
        explanation:
          m === k
            ? t(
                `**c = ${n(value, 2, lang)} mV·s.** Signal und Testfunktion schwingen im selben Takt. Ihr Produkt ist $${amp === 1 ? '' : amp}\\sin^2(${m === 1 ? '' : m}t)$ und damit nie negativ, die Fläche addiert sich auf. Das ist wie ein Radio, das genau auf den Sender abgestimmt ist: Nur dann kommt etwas an. Rechnung: $\\sin^2$ hat über eine volle Periode den Mittelwert ½, also $\\int_0^{2\\pi}\\sin^2 = \\tfrac12 \\cdot 2\\pi = \\pi$ und $c = ${amp}\\pi \\approx ${n(value, 2, lang)}$. Check: Teilst du c durch π, bekommst du mit ${amp} genau die Amplitude zurück. Genau das macht die Formel $b_n = \\frac{2}{T}\\int f \\sin(n\\omega t)\\,dt$ mit $T = 2\\pi$.`,
                `**c = ${n(value, 2, lang)} мВ·с.** Сигнал и пробная функция колеблются в одном такте. Их произведение $${amp === 1 ? '' : amp}\\sin^2(${m === 1 ? '' : m}t)$ никогда не бывает отрицательным, площадь накапливается. Это как радио, точно настроенное на станцию: только тогда что-то принимается. Расчёт: среднее значение $\\sin^2$ за полный период равно ½, значит, $\\int_0^{2\\pi}\\sin^2 = \\tfrac12 \\cdot 2\\pi = \\pi$ и $c = ${amp}\\pi \\approx ${n(value, 2, lang)}$. Проверка: если разделить c на π, получится ровно амплитуда ${amp}. Именно это делает формула $b_n = \\frac{2}{T}\\int f \\sin(n\\omega t)\\,dt$ при $T = 2\\pi$.`,
              )
            : t(
                `**c = 0.** Signal (Frequenz ${m}) und Testfunktion (Frequenz ${k}) schwingen in verschiedenem Takt. Mal haben sie dasselbe Vorzeichen, mal entgegengesetzte, und über eine volle Periode heben sich die positiven und negativen Flächen exakt auf. Man sagt: Die beiden Sinusfunktionen sind orthogonal. Das ist wie ein Radio, das auf einen anderen Sender eingestellt ist: Es hört von diesem Signal nichts. Rechnung: $\\sin a \\sin b = \\tfrac12[\\cos(a-b) - \\cos(a+b)]$, und jeder Kosinus mit ganzzahliger Frequenz ungleich null integriert sich über $0$ bis $2\\pi$ zu null. Check: Dasselbe Beispiel steht im Skript mit $\\int \\sin t \\cdot \\sin 2t\\,dt = 0$. Darum fischt die Testfunktion nur „ihre“ Frequenz aus einem Signalgemisch.`,
                `**c = 0.** Сигнал (частота ${m}) и пробная функция (частота ${k}) колеблются в разном такте. То у них одинаковый знак, то противоположный, и за полный период положительные и отрицательные площади точно гасят друг друга. Говорят: эти синусы ортогональны. Это как радио, настроенное на другую станцию: этот сигнал оно не слышит. Расчёт: $\\sin a \\sin b = \\tfrac12[\\cos(a-b) - \\cos(a+b)]$, а любой косинус с целой ненулевой частотой даёт при интегрировании от $0$ до $2\\pi$ ноль. Проверка: этот же пример есть в конспекте: $\\int \\sin t \\cdot \\sin 2t\\,dt = 0$. Поэтому пробная функция вылавливает из смеси сигналов только «свою» частоту.`,
              ),
      };
    },
  },
  {
    id: 'fo-dft-bin',
    generate: (rng, lang) => {
      const fs = pick(rng, [512, 1024, 2048]);
      const samples = pick(rng, [64, 128, 256]);
      const k = pick(rng, [3, 5, 8, 10, 12, 20]);
      const df = fs / samples;
      const f = k * df;
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'fo-dft-bin',
        difficulty: 2,
        prompt: t(
          `Ein Signal mit einer reinen Schwingung von ${n(f, 2, lang)} Hz wird mit $f_s = ${fs}$ Hz abgetastet. Die DFT läuft über $N = ${samples}$ Samples. In welchem Frequenz-Bin k erscheint die Spitze?`,
          `Сигнал с чистым колебанием ${n(f, 2, lang)} Гц дискретизуют с частотой $f_s = ${fs}$ Гц. ДПФ выполняется по $N = ${samples}$ отсчётам. В каком частотном бине k появится пик?`,
        ),
        answer: k,
        tolerance: 0.001,
        unit: t('Bin', 'бин'),
        hint: t(
          'Die Bins sind gleichmäßig verteilt. Der Abstand zwischen zwei Bins ist $\\Delta f = f_s/N$. Wie viele solcher Schritte passen in die Signalfrequenz?',
          'Бины распределены равномерно. Расстояние между соседними бинами $\\Delta f = f_s/N$. Сколько таких шагов укладывается в частоту сигнала?',
        ),
        explanation: t(
          `**Die Spitze liegt in Bin k = ${k}.** Die DFT prüft N ganzzahlige Frequenzen nacheinander, so wie ein Radio, das die Senderskala in festen Schritten absucht. Bin k entspricht der Frequenz, bei der genau k volle Schwingungen in das Messfenster passen. Das Fenster ist $N/f_s = ${samples}/${fs} = ${n(samples / fs, 4, lang)}$ s lang. Rechnung: $\\Delta f = ${fs}/${samples} = ${n(df, 2, lang)}$ Hz, also $k = ${n(f, 2, lang)}/${n(df, 2, lang)} = ${k}$. Check: Im Fenster von ${n(samples / fs, 4, lang)} s schafft eine Schwingung mit ${n(f, 2, lang)} Hz genau ${k} Perioden. Außerdem liegt k unter N/2 = ${samples / 2}, die Frequenz ist also unterhalb der Nyquist-Grenze und wird korrekt erkannt.`,
          `**Пик находится в бине k = ${k}.** ДПФ по очереди проверяет N целых частот, как радио, которое перебирает шкалу станций фиксированными шагами. Бин k соответствует частоте, при которой в окно измерения укладывается ровно k полных колебаний. Окно длится $N/f_s = ${samples}/${fs} = ${n(samples / fs, 4, lang)}$ с. Расчёт: $\\Delta f = ${fs}/${samples} = ${n(df, 2, lang)}$ Гц, значит, $k = ${n(f, 2, lang)}/${n(df, 2, lang)} = ${k}$. Проверка: за окно ${n(samples / fs, 4, lang)} с колебание ${n(f, 2, lang)} Гц совершает ровно ${k} периодов. Кроме того, k меньше N/2 = ${samples / 2}, то есть частота ниже предела Найквиста и определяется правильно.`,
        ),
      };
    },
  },
  {
    id: 'fo-series',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Was besagt die Fourier-Reihe $f(t) = \\tfrac12 a_0 + \\sum_{n=1}^{\\infty}\\big(a_n\\cos(n\\omega t) + b_n\\sin(n\\omega t)\\big)$?',
      ru: 'Что утверждает ряд Фурье $f(t) = \\tfrac12 a_0 + \\sum_{n=1}^{\\infty}\\big(a_n\\cos(n\\omega t) + b_n\\sin(n\\omega t)\\big)$?',
    },
    options: [
      {
        de: 'Ein periodisches Signal lässt sich als Summe von Sinus- und Kosinusschwingungen mit ganzzahligen Vielfachen der Grundfrequenz schreiben.',
        ru: 'Периодический сигнал можно записать как сумму синусов и косинусов с частотами, кратными основной частоте.',
      },
      {
        de: 'Jedes Signal ist eine einzelne Sinusschwingung mit veränderlicher Amplitude.',
        ru: 'Любой сигнал это одна синусоида с меняющейся амплитудой.',
      },
      {
        de: 'Die Frequenzen in der Summe dürfen beliebige, auch krumme Vielfache der Grundfrequenz sein.',
        ru: 'Частоты в сумме могут быть любыми, в том числе нецелыми кратными основной частоты.',
      },
      {
        de: 'Die Koeffizienten $a_n$ und $b_n$ wachsen für jedes Signal mit n an.',
        ru: 'Коэффициенты $a_n$ и $b_n$ для любого сигнала растут с ростом n.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Schau auf das Argument im Sinus: $n\\omega t$ mit $n = 1, 2, 3, \\dots$ Was für Frequenzen kommen also vor?',
      ru: 'Посмотри на аргумент синуса: $n\\omega t$ при $n = 1, 2, 3, \\dots$ Какие частоты тогда встречаются?',
    },
    explanation: {
      de: '**Ein periodisches Signal ist eine Summe aus Grundton und ganzzahligen Obertönen.** Wie ein Klavierakkord, der aus einzelnen Tönen besteht, lässt sich jede periodische Kurve in reine Schwingungen zerlegen. $\\omega$ ist die Kreisfrequenz der Grundschwingung, n zählt die Obertöne durch. $a_n$ sagt, wie viel Kosinus, $b_n$, wie viel Sinus mit der Frequenz $n\\omega$ im Signal steckt. $\\tfrac12 a_0$ ist der Mittelwert, also der Gleichanteil. Achtung: Im Skript steht „jede Funktion“. Gemeint ist eine periodische Funktion, oder ein Ausschnitt, den man sich periodisch fortgesetzt denkt. Die Koeffizienten werden für glatte Signale übrigens kleiner, beim Sägezahn zum Beispiel wie 1/n.',
      ru: '**Периодический сигнал это сумма основного тона и целых обертонов.** Как аккорд на фортепиано состоит из отдельных нот, так любую периодическую кривую можно разложить на чистые колебания. $\\omega$ это круговая частота основной гармоники, n нумерует обертоны. $a_n$ показывает, сколько косинуса, а $b_n$, сколько синуса с частотой $n\\omega$ содержится в сигнале. $\\tfrac12 a_0$ это среднее значение, то есть постоянная составляющая. Внимание: в конспекте написано «любая функция». Имеется в виду периодическая функция или отрезок, который мысленно продолжают периодически. Коэффициенты при этом убывают, у пилы, например, как 1/n.',
    },
  },
  {
    id: 'fo-test-function',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Das Skript stellt das „umgekehrte Problem“: Du hast ein gemessenes Signal f(t) und suchst die Amplituden $b_n$. Was ist die Schlüsselidee?',
      ru: 'В конспекте ставится «обратная задача»: есть измеренный сигнал f(t), а нужно найти амплитуды $b_n$. В чём ключевая идея?',
    },
    options: [
      {
        de: 'f(t) mit einer Testfunktion $\\sin(n\\omega t)$ multiplizieren und über eine Periode integrieren. Alle anderen Frequenzen liefern null, übrig bleibt $b_n$.',
        ru: 'Умножить f(t) на пробную функцию $\\sin(n\\omega t)$ и проинтегрировать по периоду. Все остальные частоты дают ноль, остаётся $b_n$.',
      },
      {
        de: 'Den größten Wert von f(t) ablesen, er ist gleich $b_1$.',
        ru: 'Найти наибольшее значение f(t), оно равно $b_1$.',
      },
      {
        de: 'f(t) zweimal ableiten und die Nullstellen zählen.',
        ru: 'Дважды продифференцировать f(t) и посчитать нули.',
      },
      {
        de: 'Die Werte von f(t) einfach aufsummieren, ohne Testfunktion.',
        ru: 'Просто сложить значения f(t) без пробной функции.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Erinnere dich an das Beispiel $\\int \\sin t \\cdot \\sin 2t\\,dt$. Welchen Wert hatte es, und was folgt daraus für Mischsignale?',
      ru: 'Вспомни пример $\\int \\sin t \\cdot \\sin 2t\\,dt$. Чему он был равен и что из этого следует для смеси сигналов?',
    },
    explanation: {
      de: '**Die Testfunktion fischt genau eine Frequenz heraus.** Multiplizierst du f(t) mit $g(t) = \\sin(n\\omega t)$ und integrierst über eine Periode, passiert Folgendes: Alle Anteile mit anderer Frequenz heben sich auf, weil Sinusfunktionen verschiedener ganzzahliger Frequenz orthogonal sind. Das Skript zeigt das mit $\\int \\sin t \\cdot \\sin 2t\\,dt = 0$. Nur der Anteil mit genau der Frequenz der Testfunktion bleibt stehen, weil $\\sin^2$ nie negativ wird. Das ist wie ein Radio, das immer nur einen Sender hört, egal wie viele gleichzeitig senden. Der Maximalwert hilft nicht, weil sich im Signal mehrere Schwingungen überlagern.',
      ru: '**Пробная функция вылавливает ровно одну частоту.** Если умножить f(t) на $g(t) = \\sin(n\\omega t)$ и проинтегрировать по периоду, происходит следующее: все составляющие с другой частотой гасятся, потому что синусы с разными целыми частотами ортогональны. В конспекте это показано на примере $\\int \\sin t \\cdot \\sin 2t\\,dt = 0$. Остаётся только составляющая с той же частотой, что у пробной функции, потому что $\\sin^2$ никогда не бывает отрицательным. Это как радио, которое слышит только одну станцию, сколько бы их ни вещало одновременно. Максимум сигнала не помогает, потому что в сигнале накладываются несколько колебаний.',
    },
  },
  {
    id: 'fo-bn-formula',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Welche Formel liefert den Sinus-Koeffizienten $b_n$ eines Signals mit Periode T und $\\omega = 2\\pi/T$?',
      ru: 'Какая формула даёт синусный коэффициент $b_n$ сигнала с периодом T и $\\omega = 2\\pi/T$?',
    },
    options: [
      { de: '$b_n = \\frac{2}{T}\\int_0^T f(t)\\sin(n\\omega t)\\,dt$', ru: '$b_n = \\frac{2}{T}\\int_0^T f(t)\\sin(n\\omega t)\\,dt$' },
      { de: '$b_n = \\frac{1}{T}\\int_0^T f(t)\\,dt$', ru: '$b_n = \\frac{1}{T}\\int_0^T f(t)\\,dt$' },
      { de: '$b_n = \\frac{2}{T}\\int_0^T f(t)\\cos(n\\omega t)\\,dt$', ru: '$b_n = \\frac{2}{T}\\int_0^T f(t)\\cos(n\\omega t)\\,dt$' },
      { de: '$b_n = T\\int_0^T f(t)\\sin(n\\omega t)\\,dt$', ru: '$b_n = T\\int_0^T f(t)\\sin(n\\omega t)\\,dt$' },
    ],
    answer: 0,
    hint: {
      de: 'Für $b_n$ brauchst du die Testfunktion Sinus. Und der Vorfaktor muss das Integral $\\int_0^T \\sin^2 = T/2$ wieder ausgleichen.',
      ru: 'Для $b_n$ нужна пробная функция синус. А множитель перед интегралом должен компенсировать $\\int_0^T \\sin^2 = T/2$.',
    },
    explanation: {
      de: '**$b_n = \\frac{2}{T}\\int_0^T f(t)\\sin(n\\omega t)\\,dt$.** Der Sinus ist die Testfunktion, die genau den Sinusanteil mit Frequenz $n\\omega$ herausfiltert. Warum der Faktor 2/T? Steckt im Signal $b_n\\sin(n\\omega t)$, liefert das Integral $b_n \\cdot T/2$, weil $\\sin^2$ im Mittel ½ ist. Multiplizierst du mit 2/T, bekommst du genau $b_n$ zurück. Plausibilitätscheck mit $f = 3\\sin(\\omega t)$: $\\frac{2}{T}\\cdot 3 \\cdot \\frac{T}{2} = 3$. Mit dem Kosinus als Testfunktion erhältst du $a_n$. Das Integral ohne Testfunktion, geteilt durch T, ist der Mittelwert, also $\\tfrac12 a_0$.',
      ru: '**$b_n = \\frac{2}{T}\\int_0^T f(t)\\sin(n\\omega t)\\,dt$.** Синус это пробная функция, которая выделяет именно синусную составляющую с частотой $n\\omega$. Почему множитель 2/T? Если в сигнале есть $b_n\\sin(n\\omega t)$, интеграл даёт $b_n \\cdot T/2$, потому что среднее $\\sin^2$ равно ½. Умножив на 2/T, получаешь ровно $b_n$. Проверка на $f = 3\\sin(\\omega t)$: $\\frac{2}{T}\\cdot 3 \\cdot \\frac{T}{2} = 3$. С косинусом в роли пробной функции получается $a_n$. Интеграл без пробной функции, делённый на T, это среднее значение, то есть $\\tfrac12 a_0$.',
    },
  },
  {
    id: 'fo-dft-sum',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Im Lab 3 rechnest du eine DFT im Tabellenblatt. Was ändert sich gegenüber der kontinuierlichen Formel?',
      ru: 'В Lab 3 ты считаешь ДПФ в электронной таблице. Что меняется по сравнению с непрерывной формулой?',
    },
    options: [
      {
        de: 'Das Integral wird zur Summe über N Abtastwerte: $X_k = \\sum_{j=0}^{N-1} x_j\\,e^{-2\\pi i\\,jk/N}$.',
        ru: 'Интеграл превращается в сумму по N отсчётам: $X_k = \\sum_{j=0}^{N-1} x_j\\,e^{-2\\pi i\\,jk/N}$.',
      },
      {
        de: 'Die Testfunktion fällt weg, man summiert nur die Abtastwerte.',
        ru: 'Пробная функция исчезает, суммируют только отсчёты.',
      },
      {
        de: 'Man kann unendlich viele Frequenzen aus endlich vielen Samples bestimmen.',
        ru: 'Из конечного числа отсчётов можно определить бесконечно много частот.',
      },
      {
        de: 'Man ersetzt Sinus und Kosinus durch Rechteckfunktionen.',
        ru: 'Синус и косинус заменяют прямоугольными функциями.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Ein Computer kennt keine kontinuierliche Kurve, nur eine Liste von Messwerten. Wie wird aus einer Fläche unter einer Kurve eine Rechnung mit einer Liste?',
      ru: 'Компьютер не знает непрерывной кривой, только список измерений. Как площадь под кривой превращается в вычисление по списку?',
    },
    explanation: {
      de: '**Bei der DFT wird das Integral zur Summe.** Statt einer kontinuierlichen Kurve hast du N Messwerte $x_j$, aufgenommen in gleichen Zeitabständen. Jeder Wert wird mit der Testschwingung für Frequenz k multipliziert, dann wird aufsummiert, genau wie beim Integral, nur in Schritten. Der komplexe Exponent $e^{-2\\pi i\\,jk/N}$ packt Kosinus und Sinus in einen Ausdruck: Realteil gibt den Kosinusanteil, Imaginärteil den Sinusanteil. Im Tabellenblatt sind das einfach zwei Spalten mit cos- und sin-Produkten. Aus N Samples bekommst du N Frequenzwerte, wovon bei reellen Signalen nur die Hälfte neue Information trägt. Mehr geht nicht, das ist die Nyquist-Grenze.',
      ru: '**В ДПФ интеграл превращается в сумму.** Вместо непрерывной кривой у тебя N измерений $x_j$, снятых через равные промежутки времени. Каждое значение умножают на пробное колебание для частоты k, а затем всё суммируют, точно как в интеграле, только шагами. Комплексная экспонента $e^{-2\\pi i\\,jk/N}$ объединяет косинус и синус в одно выражение: действительная часть даёт косинусную составляющую, мнимая синусную. В таблице это просто два столбца с произведениями на cos и sin. Из N отсчётов получается N значений частот, из которых у действительного сигнала новую информацию несёт только половина. Больше нельзя, это предел Найквиста.',
    },
  },
  {
    id: 'fo-properties',
    kind: 'multi',
    difficulty: 3,
    prompt: {
      de: 'Welche Eigenschaften der Fourier-Transformation $\\mathcal{F}$ sind korrekt? (Mehrfachauswahl)',
      ru: 'Какие свойства преобразования Фурье $\\mathcal{F}$ верны? (несколько вариантов)',
    },
    options: [
      {
        de: 'Linearität: $\\mathcal{F}[af + bg] = a\\,\\mathcal{F}[f] + b\\,\\mathcal{F}[g]$',
        ru: 'Линейность: $\\mathcal{F}[af + bg] = a\\,\\mathcal{F}[f] + b\\,\\mathcal{F}[g]$',
      },
      {
        de: 'Faltungssatz: $\\mathcal{F}[f * g] = \\mathcal{F}[f]\\cdot\\mathcal{F}[g]$',
        ru: 'Теорема о свёртке: $\\mathcal{F}[f * g] = \\mathcal{F}[f]\\cdot\\mathcal{F}[g]$',
      },
      {
        de: 'Die 2D-Transformation hat den Exponenten $-2\\pi i(u_x x + u_y y)$. Das MR-Bild entsteht per inverser 2D-FT aus dem k-Raum.',
        ru: '2D-преобразование имеет показатель $-2\\pi i(u_x x + u_y y)$. МР-изображение получают обратным 2D-ПФ из k-пространства.',
      },
      {
        de: '$\\mathcal{F}[f + g] = \\mathcal{F}[f]\\cdot\\mathcal{F}[g]$',
        ru: '$\\mathcal{F}[f + g] = \\mathcal{F}[f]\\cdot\\mathcal{F}[g]$',
      },
      {
        de: 'Eine Faltung im Ortsraum wird im Frequenzraum zu einer Addition.',
        ru: 'Свёртка в пространстве координат превращается в частотной области в сложение.',
      },
    ],
    answers: [0, 1, 2],
    hint: {
      de: 'Die Linearität folgt direkt daraus, dass ein Integral linear ist. Und der Faltungssatz tauscht eine aufwendige Operation gegen eine einfache. Welche?',
      ru: 'Линейность прямо следует из того, что интеграл линеен. А теорема о свёртке заменяет сложную операцию простой. Какой?',
    },
    explanation: {
      de: '**Richtig sind Linearität, Faltungssatz und die 2D-FT als Brücke zwischen k-Raum und Bild.** Linearität heißt: Das Spektrum einer Summe ist die Summe der Spektren, und ein doppelt so lautes Signal hat ein doppelt so großes Spektrum. Das folgt direkt aus den Eigenschaften des Integrals. Der Faltungssatz macht aus einer Faltung, also einem gleitenden Verschmieren, im Frequenzraum eine einfache Multiplikation. Deshalb filtert man Bilder gern im k-Raum: Wer dort die äußeren Werte stärker gewichtet, betont die Kanten. In 2D bekommt der Exponent beide Richtungen, $u_x x + u_y y$. Achtung: Im Skript steht an einer Stelle zweimal x im Exponenten, gemeint ist immer eine x- und eine y-Komponente. Eine Summe wird nicht zum Produkt, und eine Faltung nicht zur Summe.',
      ru: '**Верны: линейность, теорема о свёртке и 2D-ПФ как мост между k-пространством и изображением.** Линейность означает: спектр суммы равен сумме спектров, а у вдвое более громкого сигнала вдвое больший спектр. Это прямо следует из свойств интеграла. Теорема о свёртке превращает свёртку, то есть скользящее размытие, в частотной области в простое умножение. Поэтому изображения охотно фильтруют в k-пространстве: если там сильнее взвесить внешние значения, края становятся отчётливее. В 2D показатель содержит оба направления: $u_x x + u_y y$. Внимание: в конспекте в одном месте в показателе дважды стоит x, но всегда имеется в виду одна x- и одна y-составляющая. Сумма не превращается в произведение, а свёртка не превращается в сумму.',
    },
  },
];
