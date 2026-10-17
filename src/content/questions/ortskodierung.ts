import { gradientForSlice, hzPerMeter, readoutFovMm, sliceThicknessMm, slicePositionMm } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

export const ortskodierungQuestions: QuestionSource[] = [
  {
    id: 'ok-slice',
    generate: (rng, lang) => {
      const t = tl(lang);
      const bw = pick(rng, [800, 1000, 1500, 2000, 3000]);
      const g = pick(rng, [5, 8, 10, 15, 20]);
      const dz = sliceThicknessMm(bw, g);
      const hzm = n(hzPerMeter(g), 0, lang);
      return {
        kind: 'numeric',
        id: 'ok-slice',
        difficulty: 2,
        prompt: t(
          `Ein schichtselektiver Puls hat eine Bandbreite von ${n(bw, 2, lang)} Hz, der Schichtgradient beträgt ${g} mT/m. Wie dick ist die angeregte Schicht?`,
          `Срез-селективный импульс имеет полосу пропускания ${n(bw, 2, lang)} Гц, градиент выбора среза составляет ${g} мТл/м. Какова толщина возбуждённого среза?`,
        ),
        answer: dz,
        tolerance: 0.02,
        unit: t('mm', 'мм'),
        hint: t(
          'Der Gradient sagt dir, wie viele Hz pro Meter dazukommen. Wie viele Meter passen dann in die Bandbreite des Pulses? Achte auf die Einheiten: mT/m → T/m.',
          'Градиент говорит, сколько Гц добавляется на метр. Сколько метров тогда умещается в полосу импульса? Следи за единицами: мТл/м → Тл/м.',
        ),
        explanation: t(
          `**Die Schicht ist ${n(dz, 2, lang)} mm dick.** Der Gradient macht aus dem Ort eine Frequenz, wie eine Klaviertastatur: Jede Position hat ihren eigenen Ton. Der Puls spielt ein Frequenzband, und nur die Positionen in diesem Band werden angeregt. Rechnung: Erst die Hz pro Meter, $\\bar\\gamma G_s = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} = ${hzm}$ Hz/m. Dann $\\Delta z = ${bw}/${hzm}\\,\\text{m} = ${n(dz, 2, lang)}$ mm. Check: Doppelte Bandbreite gibt eine doppelt so dicke Schicht, doppelter Gradient eine halb so dicke.`,
          `**Толщина среза ${n(dz, 2, lang)} мм.** Градиент превращает положение в частоту, как клавиатура пианино: у каждой позиции своя нота. Импульс «играет» полосу частот, и возбуждаются только позиции в этой полосе. Расчёт: сначала Гц на метр, $\\bar\\gamma G_s = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} = ${hzm}$ Гц/м. Затем $\\Delta z = ${bw}/${hzm}\\,\\text{м} = ${n(dz, 2, lang)}$ мм. Проверка: двойная полоса даёт вдвое более толстый срез, двойной градиент вдвое более тонкий.`,
        ),
      };
    },
  },
  {
    id: 'ok-gradient',
    generate: (rng, lang) => {
      const t = tl(lang);
      const bw = pick(rng, [1000, 1200, 2000]);
      const dz = pick(rng, [1, 2, 3, 5]);
      const g = gradientForSlice(bw, dz);
      return {
        kind: 'numeric',
        id: 'ok-gradient',
        difficulty: 2,
        prompt: t(
          `Du möchtest mit einem Puls der Bandbreite ${n(bw, 2, lang)} Hz eine ${dz} mm dicke Schicht anregen. Welche Schichtgradienten-Amplitude ist nötig?`,
          `Ты хочешь возбудить срез толщиной ${dz} мм импульсом с полосой пропускания ${n(bw, 2, lang)} Гц. Какая амплитуда градиента выбора среза нужна?`,
        ),
        answer: g,
        tolerance: 0.02,
        unit: t('mT/m', 'мТл/м'),
        hint: t(
          'Die ganze Bandbreite soll genau auf die Schichtdicke passen. Wie steil muss die Frequenz dafür mit dem Ort ansteigen?',
          'Вся полоса должна точно уложиться в толщину среза. Насколько круто должна для этого расти частота с положением?',
        ),
        explanation: t(
          `**Du brauchst einen Gradienten von ${n(g, 2, lang)} mT/m.** Die Bandbreite des Pulses muss genau auf die Schicht passen. Je dünner die Schicht, desto steiler muss die Frequenz mit dem Ort ansteigen. Rechnung: $G_s = \\Delta f/(\\bar\\gamma\\,\\Delta z) = ${bw} / (42{,}577\\cdot10^6 \\cdot ${dz}\\cdot10^{-3})\\,\\text{T/m} = ${n(g, 2, lang)}$ mT/m. Check: Halbe Schichtdicke braucht den doppelten Gradienten. Sehr dünne Schichten stoßen an die Grenze der Gradientenspulen (etwa 40 bis 80 mT/m). Dann verlängert man lieber den Puls, denn ein längerer Puls hat eine kleinere Bandbreite.`,
          `**Нужен градиент ${n(g, 2, lang)} мТл/м.** Полоса импульса должна точно уложиться в срез. Чем тоньше срез, тем круче должна расти частота с положением. Расчёт: $G_s = \\Delta f/(\\bar\\gamma\\,\\Delta z) = ${bw} / (42{,}577\\cdot10^6 \\cdot ${dz}\\cdot10^{-3})\\,\\text{Тл/м} = ${n(g, 2, lang)}$ мТл/м. Проверка: вдвое более тонкий срез требует двойного градиента. Очень тонкие срезы упираются в предел градиентных катушек (около 40–80 мТл/м). Тогда лучше удлинить импульс, ведь у более длинного импульса полоса уже.`,
        ),
      };
    },
  },
  {
    id: 'ok-delta-f',
    generate: (rng, lang) => {
      const t = tl(lang);
      const g = pick(rng, [2, 5, 10, 20]);
      const dx = pick(rng, [1, 5, 10, 50]);
      const df = hzPerMeter(g) * dx * 1e-3;
      return {
        kind: 'numeric',
        id: 'ok-delta-f',
        difficulty: 1,
        prompt: t(
          `Während der Auslese liegt ein Frequenzkodiergradient von ${g} mT/m an. Um wie viel Hz unterscheiden sich die Präzessionsfrequenzen zweier Protonen im Abstand von ${dx} mm?`,
          `Во время считывания включён градиент частотного кодирования ${g} мТл/м. На сколько Гц различаются частоты прецессии двух протонов, расположенных на расстоянии ${dx} мм друг от друга?`,
        ),
        answer: df,
        tolerance: 0.02,
        unit: t('Hz', 'Гц'),
        hint: t(
          'Der Gradient ändert das Feld pro Meter. Wie viel Feldunterschied liegt dann zwischen den beiden Protonen, und welche Frequenz gehört dazu?',
          'Градиент меняет поле на каждый метр. Какая разница поля тогда между двумя протонами и какая частота ей соответствует?',
        ),
        explanation: t(
          `**Die beiden Protonen unterscheiden sich um ${n(df, 1, lang)} Hz.** Der Gradient macht das Feld an einer Stelle etwas stärker als an der anderen. Stärkeres Feld heißt höhere Frequenz, wie ein Chor, in dem jede Reihe einen anderen Ton singt. Rechnung: $\\Delta f = \\bar\\gamma\\,G\\,\\Delta x = 42{,}577\\,\\text{MHz/T} \\cdot ${g}\\,\\text{mT/m} \\cdot ${dx}\\,\\text{mm} = ${n(df, 1, lang)}$ Hz. Check: Doppelter Abstand oder doppelter Gradient gibt den doppelten Frequenzunterschied. Die Fourier-Transformation zerlegt das Signal später in diese Töne und ordnet jedem Ton einen Ort zu.`,
          `**Частоты двух протонов различаются на ${n(df, 1, lang)} Гц.** Градиент делает поле в одном месте немного сильнее, чем в другом. Более сильное поле значит более высокую частоту, как в хоре, где каждый ряд поёт свою ноту. Расчёт: $\\Delta f = \\bar\\gamma\\,G\\,\\Delta x = 42{,}577\\,\\text{МГц/Тл} \\cdot ${g}\\,\\text{мТл/м} \\cdot ${dx}\\,\\text{мм} = ${n(df, 1, lang)}$ Гц. Проверка: двойное расстояние или двойной градиент дают двойную разницу частот. Преобразование Фурье потом раскладывает сигнал на эти ноты и сопоставляет каждой ноте место.`,
        ),
      };
    },
  },
  {
    id: 'ok-fov',
    generate: (rng, lang) => {
      const t = tl(lang);
      const bw = pick(rng, [32000, 50000, 64000, 100000]);
      const g = pick(rng, [5, 8, 10, 12]);
      const fov = readoutFovMm(bw, g);
      const hzm = n(hzPerMeter(g), 0, lang);
      return {
        kind: 'numeric',
        id: 'ok-fov',
        difficulty: 3,
        prompt: t(
          `Die Empfangsbandbreite beträgt insgesamt ${n(bw / 1000, 2, lang)} kHz (±${n(bw / 2000, 2, lang)} kHz), der Auslesegradient ${g} mT/m. Wie groß ist das FOV in Ausleserichtung?`,
          `Общая полоса пропускания приёмника составляет ${n(bw / 1000, 2, lang)} кГц (±${n(bw / 2000, 2, lang)} кГц), градиент считывания ${g} мТл/м. Каково поле обзора (FOV) в направлении считывания?`,
        ),
        answer: fov,
        tolerance: 0.02,
        unit: t('mm', 'мм'),
        hint: t(
          'Der Empfänger hört nur ein bestimmtes Frequenzband. Über welche Strecke verteilt der Gradient genau dieses Band?',
          'Приёмник слышит только определённую полосу частот. На какое расстояние градиент распределяет именно эту полосу?',
        ),
        explanation: t(
          `**Das FOV ist ${n(fov, 1, lang)} mm groß.** FOV heißt Field of View, also der Bildausschnitt. Der Empfänger hört nur ein Frequenzband, wie ein Radio, das nur einen Bereich von Sendern empfängt. Der Gradient legt fest, über wie viele Millimeter sich dieses Band verteilt. Rechnung: $FOV = BW/(\\bar\\gamma G_x) = ${bw}/${hzm}\\,\\text{m} = ${n(fov, 1, lang)}$ mm. Check: Bei gleicher Bandbreite macht ein doppelt so starker Gradient das FOV halb so groß. Die Frequenzen liegen dann dichter, und das Band ist schneller „aufgebraucht“.`,
          `**FOV составляет ${n(fov, 1, lang)} мм.** FOV (Field of View) это поле обзора, то есть область изображения. Приёмник слышит только полосу частот, как радио, которое ловит лишь определённый диапазон станций. Градиент определяет, на сколько миллиметров распределяется эта полоса. Расчёт: $FOV = BW/(\\bar\\gamma G_x) = ${bw}/${hzm}\\,\\text{м} = ${n(fov, 1, lang)}$ мм. Проверка: при той же полосе вдвое более сильный градиент уменьшает FOV вдвое. Частоты тогда лежат плотнее, и полоса «расходуется» быстрее.`,
        ),
      };
    },
  },
  {
    id: 'ok-offset',
    generate: (rng, lang) => {
      const t = tl(lang);
      const g = pick(rng, [10, 15, 20]);
      const off = pick(rng, [4258, 8515, 21289, 12773]);
      const z = slicePositionMm(off, g);
      const hzm = n(hzPerMeter(g), 0, lang);
      return {
        kind: 'numeric',
        id: 'ok-offset',
        difficulty: 2,
        prompt: t(
          `Bei einem Schichtgradienten von ${g} mT/m wird die Sendefrequenz um +${n(off, 2, lang)} Hz gegenüber der Mittenfrequenz verschoben. Wie weit vom Isozentrum liegt die angeregte Schicht?`,
          `При градиенте выбора среза ${g} мТл/м частота передатчика смещена на +${n(off, 2, lang)} Гц относительно центральной частоты. На каком расстоянии от изоцентра находится возбуждённый срез?`,
        ),
        answer: z,
        tolerance: 0.02,
        unit: t('mm', 'мм'),
        hint: t(
          'Im Isozentrum gilt genau die Mittenfrequenz. An welcher Stelle hat der Gradient die Frequenz um den Offset erhöht?',
          'В изоцентре действует ровно центральная частота. В каком месте градиент повысил частоту на величину сдвига?',
        ),
        explanation: t(
          `**Die Schicht liegt ${n(z, 1, lang)} mm vom Isozentrum entfernt.** Das Isozentrum ist die Mitte des Magneten, dort ändert der Gradient nichts. Je weiter weg, desto stärker weicht die Frequenz ab. Du suchst also die Stelle, an der der Unterschied genau dem Offset entspricht. Rechnung: $z = \\Delta f_{\\text{offset}}/(\\bar\\gamma G_s) = ${off}/${hzm}\\,\\text{m} = ${n(z, 1, lang)}$ mm. Check: Doppelter Offset heißt doppelter Abstand. So arbeiten Multi-Slice-Messungen: Sie ändern nur die Sendefrequenz, der Gradient bleibt gleich. Wie beim Radio, wo du nur den Sender wechselst.`,
          `**Срез находится в ${n(z, 1, lang)} мм от изоцентра.** Изоцентр это середина магнита, там градиент ничего не меняет. Чем дальше от него, тем сильнее отклоняется частота. Значит, ты ищешь место, где разница точно равна сдвигу. Расчёт: $z = \\Delta f_{\\text{сдвиг}}/(\\bar\\gamma G_s) = ${off}/${hzm}\\,\\text{м} = ${n(z, 1, lang)}$ мм. Проверка: двойной сдвиг значит двойное расстояние. Так работают многосрезовые измерения: меняется только частота передатчика, градиент остаётся прежним. Как в радио, где ты просто переключаешь станцию.`,
        ),
      };
    },
  },
  {
    id: 'ok-pixel',
    generate: (rng, lang) => {
      const t = tl(lang);
      const fov = pick(rng, [180, 220, 240, 256, 400]);
      const nmat = pick(rng, [192, 256, 320, 384, 512]);
      return {
        kind: 'numeric',
        id: 'ok-pixel',
        difficulty: 1,
        prompt: t(
          `FOV = ${fov} mm, Matrix ${nmat} in Ausleserichtung. Wie groß ist ein Pixel?`,
          `FOV = ${fov} мм, матрица ${nmat} в направлении считывания. Каков размер пикселя?`,
        ),
        answer: fov / nmat,
        tolerance: 0.01,
        unit: t('mm', 'мм'),
        hint: t(
          'Das Bildfeld wird in gleich große Kästchen aufgeteilt. Wie viele Kästchen gibt es, und wie breit ist das Feld?',
          'Поле изображения делится на одинаковые клетки. Сколько клеток и какова ширина поля?',
        ),
        explanation: t(
          `**Ein Pixel ist ${n(fov / nmat, 3, lang)} mm breit.** Die Matrix teilt das FOV in gleich große Kästchen, wie ein Schachbrett. Rechnung: $\\Delta x = FOV/N = ${fov}/${nmat} = ${n(fov / nmat, 3, lang)}$ mm. Check: Mehr Kästchen auf gleicher Breite heißt kleinere Kästchen. Kleinere Pixel zeigen feinere Details. Aber jedes Pixel enthält dann weniger Gewebe und damit weniger Protonen. Das Signal pro Pixel sinkt im gleichen Verhältnis wie das Voxelvolumen, und mit ihm das SNR.`,
          `**Ширина пикселя ${n(fov / nmat, 3, lang)} мм.** Матрица делит FOV на одинаковые клетки, как шахматная доска. Расчёт: $\\Delta x = FOV/N = ${fov}/${nmat} = ${n(fov / nmat, 3, lang)}$ мм. Проверка: больше клеток на той же ширине значит более мелкие клетки. Мелкие пиксели показывают более тонкие детали. Но в каждом пикселе тогда меньше ткани и, значит, меньше протонов. Сигнал на пиксель падает пропорционально объёму вокселя, а вместе с ним и SNR.`,
        ),
      };
    },
  },
  {
    id: 'ok-phase-repeat',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum muss die Sequenz für jede Phasenkodierzeile neu angeregt (bzw. ein neues Echo erzeugt) werden, während die Frequenzkodierung in einem Auslesevorgang gelingt?',
      ru: 'Почему для каждой строки фазового кодирования последовательность нужно возбуждать заново (или формировать новое эхо), тогда как частотное кодирование удаётся за одно считывание?',
    },
    options: [
      {
        de: 'Pro Echo wird genau ein Phasenkodierschritt (eine k-Raum-Zeile) eingeprägt; die Ortsinformation in Phasenrichtung entsteht erst aus der Serie unterschiedlicher Phasenmomente.',
        ru: 'За одно эхо задаётся ровно один шаг фазового кодирования (одна строка k-пространства); пространственная информация в фазовом направлении возникает только из серии разных фазовых моментов.',
      },
      {
        de: 'Weil der Phasengradient nur einmal pro Sekunde geschaltet werden kann.',
        ru: 'Потому что фазовый градиент можно включать лишь раз в секунду.',
      },
      {
        de: 'Weil die Phasenkodierung mit Hochfrequenz statt mit Gradienten arbeitet.',
        ru: 'Потому что фазовое кодирование работает с радиочастотой, а не с градиентами.',
      },
      {
        de: 'Weil der ADC während des Phasengradienten ausgeschaltet sein muss, um die Spule zu schützen.',
        ru: 'Потому что АЦП во время фазового градиента должен быть выключен, чтобы защитить катушку.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Während der Auslese läuft der Frequenzgradient die ganze Zeit. Läuft der Phasengradient auch während der Auslese?',
      ru: 'Во время считывания частотный градиент работает всё время. А фазовый градиент тоже работает во время считывания?',
    },
    explanation: {
      de: '**Ein Echo liefert genau eine k-Raum-Zeile, und die Phasenrichtung braucht viele davon.** Der k-Raum ist die Rohdatentabelle, aus der die Fourier-Transformation das Bild macht. Während der Auslese läuft der Frequenzgradient, und k_x wandert kontinuierlich durch eine ganze Zeile. Der Phasengradient wird dagegen nur kurz vorher geschaltet und legt eine einzige k_y-Position fest. Für N_PE Zeilen brauchst du N_PE verschiedene Phasenschritte, also N_PE Echos. Wie bei einem Barcode-Scanner, der pro Durchgang nur eine Zeile liest. Deshalb gilt für die Messzeit TA ∝ TR·N_PE.',
      ru: '**Одно эхо даёт ровно одну строку k-пространства, а для фазового направления их нужно много.** k-пространство это таблица сырых данных, из которой преобразование Фурье делает изображение. Во время считывания работает частотный градиент, и k_x непрерывно проходит целую строку. Фазовый градиент, напротив, включается лишь ненадолго до этого и задаёт одну-единственную позицию k_y. Для N_PE строк нужно N_PE разных фазовых шагов, то есть N_PE эхо. Как сканер штрихкода, который за один проход читает только одну строку. Поэтому для времени измерения TA ∝ TR·N_PE.',
    },
  },
  {
    id: 'ok-shift-slice',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Wie verschiebt der Scanner die Position einer Schicht, ohne den Patienten zu bewegen?',
      ru: 'Как сканер смещает положение среза, не перемещая пациента?',
    },
    options: [
      {
        de: 'Durch Änderung der Mittenfrequenz (Offset) des HF-Pulses bei gleichem Schichtgradienten.',
        ru: 'Изменением центральной частоты (сдвига) РЧ-импульса при неизменном градиенте выбора среза.',
      },
      { de: 'Durch Änderung der Polarität des Auslesegradienten.', ru: 'Изменением полярности градиента считывания.' },
      { de: 'Durch Erhöhung der Feldstärke B₀.', ru: 'Увеличением индукции поля B₀.' },
      { de: 'Durch Umschalten auf eine andere Empfangsspule.', ru: 'Переключением на другую приёмную катушку.' },
    ],
    answer: 0,
    hint: {
      de: 'Unter dem Gradienten hat jede Position ihren eigenen Ton. Was musst du ändern, um eine andere Position zu treffen?',
      ru: 'Под градиентом у каждой позиции своя нота. Что нужно изменить, чтобы попасть в другую позицию?',
    },
    explanation: {
      de: '**Der Scanner ändert einfach die Frequenz des HF-Pulses.** Unter dem Schichtgradienten hat jede z-Position ihre eigene Resonanzfrequenz, wie die Tasten auf einem Klavier. Spielst du einen anderen Ton, antwortet eine andere Stelle. Eine Frequenzverschiebung Δf verschiebt die Schicht um Δz = Δf/(γ̄ G). Der Patient bleibt liegen, und auch der Gradient bleibt gleich.',
      ru: '**Сканер просто меняет частоту РЧ-импульса.** Под градиентом выбора среза у каждой позиции z своя резонансная частота, как клавиши пианино. Сыграешь другую ноту, и ответит другое место. Сдвиг частоты Δf перемещает срез на Δz = Δf/(γ̄ G). Пациент остаётся на месте, и градиент тоже не меняется.',
    },
  },
  {
    id: 'ok-thin',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Maßnahmen führen zu einer dünneren Schicht? (Mehrfachauswahl)',
      ru: 'Какие меры дают более тонкий срез? (несколько вариантов)',
    },
    options: [
      { de: 'Stärkerer Schichtgradient', ru: 'Более сильный градиент выбора среза' },
      { de: 'Längerer HF-Puls (geringere Bandbreite)', ru: 'Более длинный РЧ-импульс (более узкая полоса пропускания)' },
      { de: 'Höhere Sendeleistung bei gleicher Pulsdauer', ru: 'Более высокая мощность передатчика при той же длительности импульса' },
      { de: 'Größeres FOV', ru: 'Большее FOV' },
    ],
    answers: [0, 1],
    hint: {
      de: 'Die Schichtdicke hängt nur von zwei Größen ab: dem Frequenzband des Pulses und dem Gradienten. Was beeinflusst welche?',
      ru: 'Толщина среза зависит только от двух величин: полосы частот импульса и градиента. Что влияет на какую?',
    },
    explanation: {
      de: '**Dünner wird die Schicht mit stärkerem Gradienten oder schmalerer Bandbreite.** Es gilt Δz = Δf/(γ̄G). Ein stärkerer Gradient spreizt die Frequenzen weiter auseinander, wie eine Klaviatur mit schmaleren Tasten. Dasselbe Frequenzband trifft dann eine dünnere Schicht. Ein längerer Puls hat eine schmalere Bandbreite, denn Dauer und Bandbreite sind umgekehrt proportional. Die Sendeleistung bestimmt nur, wie weit die Spins kippen, also den Flipwinkel. Das FOV betrifft die Auslese in der Bildebene, nicht die Schichtdicke.',
      ru: '**Срез становится тоньше при более сильном градиенте или более узкой полосе.** Действует Δz = Δf/(γ̄G). Более сильный градиент сильнее разводит частоты, как клавиатура с более узкими клавишами. Та же полоса частот попадает тогда в более тонкий срез. У более длинного импульса полоса уже, ведь длительность и полоса обратно пропорциональны. Мощность передатчика определяет только, насколько сильно отклоняются спины, то есть угол отклонения. FOV относится к считыванию в плоскости изображения, а не к толщине среза.',
    },
  },
  {
    id: 'ok-sinc',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum verwendet man für die Schichtanregung sinc-förmige HF-Pulse?',
      ru: 'Почему для возбуждения среза используют РЧ-импульсы в форме sinc?',
    },
    options: [
      {
        de: 'In Kleinwinkelnäherung ist das Schichtprofil die Fourier-Transformierte der Pulshüllkurve: Ein sinc erzeugt ein annähernd rechteckiges Profil.',
        ru: 'В приближении малых углов профиль среза является фурье-образом огибающей импульса: sinc даёт почти прямоугольный профиль.',
      },
      {
        de: 'Weil sinc-Pulse die geringste SAR-Belastung aller denkbaren Pulse haben.',
        ru: 'Потому что sinc-импульсы дают наименьшую нагрузку SAR среди всех возможных импульсов.',
      },
      { de: 'Weil sinc-Pulse die Larmor-Frequenz erhöhen.', ru: 'Потому что sinc-импульсы повышают ларморову частоту.' },
      { de: 'Weil sie keine Rephasierung der Schicht benötigen.', ru: 'Потому что они не требуют рефазирования среза.' },
    ],
    answer: 0,
    hint: {
      de: 'Zeitverlauf des Pulses und Frequenzinhalt hängen über die Fourier-Transformation zusammen. Welche Zeitform hat ein rechteckiges Spektrum?',
      ru: 'Форма импульса во времени и его частотный состав связаны преобразованием Фурье. Какая форма во времени даёт прямоугольный спектр?',
    },
    explanation: {
      de: '**Ein sinc-Puls enthält genau ein rechteckiges Frequenzband, und das ergibt eine Schicht mit scharfen Rändern.** Zeitform und Frequenzinhalt eines Pulses hängen über die Fourier-Transformation zusammen. Ein sinc in der Zeit ist ein Rechteck in der Frequenz. Unter dem Gradienten wird aus dem Frequenzrechteck ein Ortsrechteck, also eine saubere Schicht. Das gilt genau genommen für kleine Flipwinkel. Ein unendlich langer sinc gäbe ein perfektes Rechteck. Echte Pulse sind abgeschnitten, deshalb sind die Ränder leicht verrundet. Darum lässt man zwischen Schichten oft eine Lücke (Gap) oder misst sie verschachtelt, damit sie sich nicht gegenseitig stören (Cross-Talk).',
      ru: '**Sinc-импульс содержит ровно прямоугольную полосу частот, и это даёт срез с чёткими краями.** Форма импульса во времени и его частотный состав связаны преобразованием Фурье. Sinc во времени это прямоугольник по частоте. Под градиентом частотный прямоугольник превращается в прямоугольник в пространстве, то есть в аккуратный срез. Строго говоря, это верно для малых углов отклонения. Бесконечно длинный sinc дал бы идеальный прямоугольник. Реальные импульсы обрезаны, поэтому края слегка скруглены. Поэтому между срезами часто оставляют промежуток (gap) или измеряют их поочерёдно, чтобы они не мешали друг другу (cross-talk).',
    },
  },
  {
    id: 'ok-rephase',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Wozu dient der kurze, umgepolte Gradientenlobus direkt nach dem Schichtselektionsgradienten?',
      ru: 'Для чего нужен короткий лепесток градиента обратной полярности сразу после градиента выбора среза?',
    },
    options: [
      {
        de: 'Er rephasiert die Spins über die Schichtdicke, die während der Anregung unter dem Gradienten unterschiedlich viel Phase akkumuliert haben (ca. halbe Gradientenfläche).',
        ru: 'Он рефазирует спины по толщине среза, которые во время возбуждения под действием градиента набрали разную фазу (примерно половина площади градиента).',
      },
      {
        de: 'Er invertiert die Magnetisierung für eine Inversion Recovery.',
        ru: 'Он инвертирует намагниченность для инверсии-восстановления.',
      },
      { de: 'Er erzeugt die Phasenkodierung.', ru: 'Он создаёт фазовое кодирование.' },
      { de: 'Er kompensiert die Wirbelströme in der Kryostatwand.', ru: 'Он компенсирует вихревые токи в стенке криостата.' },
    ],
    answer: 0,
    hint: {
      de: 'Innerhalb der Schicht spüren die Spins während der Anregung leicht unterschiedliche Felder. Was passiert dadurch mit ihren Phasen?',
      ru: 'Внутри среза спины во время возбуждения чувствуют немного разные поля. Что из-за этого происходит с их фазами?',
    },
    explanation: {
      de: '**Der umgepolte Lobus bringt die Spins innerhalb der Schicht wieder in Gleichtakt.** Während der Anregung liegt der Schichtgradient an. Spins oben in der Schicht kreiseln etwas schneller als Spins unten und laufen in der Phase auseinander. Ohne Gegenmaßnahme würden sich ihre Signale über die Schichtdicke weitgehend auslöschen, wie ein Chor, der nicht im Takt singt. Der umgepolte Gradient lässt die Schnellen langsamer und die Langsamen schneller laufen, bis alle wieder gleich stehen. Seine Fläche entspricht etwa der Hälfte der Fläche des Schichtgradienten, gerechnet ab der Pulsmitte.',
      ru: '**Лепесток обратной полярности снова приводит спины внутри среза в такт.** Во время возбуждения включён градиент выбора среза. Спины в верхней части среза вращаются немного быстрее, чем в нижней, и расходятся по фазе. Без противодействия их сигналы по толщине среза в значительной мере погасили бы друг друга, как хор, который поёт не в такт. Градиент обратной полярности заставляет быстрых идти медленнее, а медленных быстрее, пока все снова не выровняются. Его площадь примерно равна половине площади градиента выбора среза, считая от середины импульса.',
    },
  },
  {
    id: 'ok-readout-dephase',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum wird vor dem Auslesegradienten ein Dephasiergradient mit umgekehrter Polarität geschaltet?',
      ru: 'Почему перед градиентом считывания включают дефазирующий градиент обратной полярности?',
    },
    options: [
      {
        de: 'Damit das Echo (k_x = 0) in der Mitte des Auslesefensters entsteht und der k-Raum symmetrisch von −k_max bis +k_max abgetastet wird.',
        ru: 'Чтобы эхо (k_x = 0) возникало в середине окна считывания, а k-пространство дискретизировалось симметрично от −k_max до +k_max.',
      },
      { de: 'Um T2*-Effekte vollständig zu eliminieren.', ru: 'Чтобы полностью устранить T2*-эффекты.' },
      { de: 'Um die Gradientenspulen zu entmagnetisieren.', ru: 'Чтобы размагнитить градиентные катушки.' },
      { de: 'Um die Schichtdicke festzulegen.', ru: 'Чтобы задать толщину среза.' },
    ],
    answer: 0,
    hint: {
      de: 'Ohne Vorbereitung würde die Auslese bei k_x = 0 starten. Wo im Auslesefenster soll die k-Raum-Mitte aber liegen?',
      ru: 'Без подготовки считывание начиналось бы с k_x = 0. А где в окне считывания должен находиться центр k-пространства?',
    },
    explanation: {
      de: '**Der Vorgradient sorgt dafür, dass das Echo genau in der Mitte der Auslese liegt.** Ohne ihn würde die Auslese bei k_x = 0 beginnen und nur eine Hälfte der Zeile erfassen. Der umgepolte Vorgradient, auch Prephaser genannt, schiebt die Startposition zuerst nach −k_max. Das ist wie ein Anlauf beim Weitsprung: Du gehst erst ein Stück zurück. Unter dem Auslesegradienten läuft k_x dann durch null bis +k_max. Beim Durchgang durch null stehen alle Spins wieder in Phase, das ist das Gradientenecho. So wird die Zeile symmetrisch von −k_max bis +k_max abgetastet.',
      ru: '**Предварительный градиент обеспечивает, чтобы эхо приходилось точно на середину считывания.** Без него считывание начиналось бы с k_x = 0 и охватывало бы только половину строки. Предварительный градиент обратной полярности (префазирующий) сначала сдвигает стартовую позицию к −k_max. Это как разбег в прыжках в длину: сначала отходишь немного назад. Под действием градиента считывания k_x затем проходит через ноль до +k_max. При прохождении через ноль все спины снова в фазе, это и есть градиентное эхо. Так строка дискретизируется симметрично от −k_max до +k_max.',
    },
  },
];
