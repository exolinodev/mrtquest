import type { Loc } from '../i18n/format';
import type { SimulatorId } from './modules';

export interface SimGuideData {
  /** So liest du das Bild: was die Darstellung zeigt */
  intro: Loc;
  /** Drei geführte Mini-Experimente: Stell X ein, beobachte Y, weil Z */
  steps: Loc[];
  /** Kernaussage für die Prüfung */
  takeaway: Loc;
}

export const SIM_GUIDES: Partial<Record<SimulatorId, SimGuideData>> = {
  larmor: {
    intro: {
      de: 'Du schaust von schräg oben auf ein Koordinatensystem, die z-Achse zeigt entlang von $B_0$. Der **rosa Pfeil** ist die Magnetisierung M, die **grüne Linie** ihr Schatten in der Querebene, also die messbare Quermagnetisierung M⊥. Das kleine Oszilloskop zeigt die **Spulenspannung**, die diese kreisende Quermagnetisierung in der Empfangsspule induziert. Dahinter steckt die Grundidee aus dem Skript: Jeder Kern kreist wie ein Kreisel mit der Larmor-Frequenz $f_0 = \\bar\\gamma B_0$ um das Feld.',
      ru: 'Ты смотришь сверху наискосок на систему координат, ось z направлена вдоль $B_0$. **Розовая стрелка** это намагниченность M, **зелёная линия** её тень в поперечной плоскости, то есть измеряемая поперечная намагниченность M⊥. Маленький осциллограф показывает **напряжение катушки**, которое эта вращающаяся поперечная намагниченность наводит в приёмной катушке. За этим стоит главная идея из конспекта: каждое ядро вращается вокруг поля, как волчок, с ларморовой частотой $f_0 = \\bar\\gamma B_0$.',
    },
    steps: [
      {
        de: 'Lass **Atomkern** auf ¹H und schiebe die **Feldstärke B₀** von 1,5 T auf 3 T. Bei **Larmor-Frequenz f₀** springt der Wert von etwa 63,9 MHz auf etwa 127,7 MHz, und der **Spinüberschuss (310 K)** verdoppelt sich ebenfalls. Der Grund: Die Larmor-Frequenz ist streng proportional zum Feld, $f_0 = 42{,}57\\ \\text{MHz/T} \\cdot B_0$, und ein stärkeres Feld vergrößert den Energieabstand ΔE und damit den Überschuss.',
        ru: 'Оставь **Атомное ядро** на ¹H и передвинь **Индукция поля B₀** с 1,5 Тл на 3 Тл. У **Ларморова частота f₀** значение прыгает примерно с 63,9 МГц примерно до 127,7 МГц, и **Избыток спинов (310 K)** тоже удваивается. Причина: ларморова частота строго пропорциональна полю, $f_0 = 42{,}57\\ \\text{МГц/Тл} \\cdot B_0$, а более сильное поле увеличивает разность энергий ΔE и вместе с ней избыток.',
      },
      {
        de: 'Bleib bei 3 T und wechsle den **Atomkern** von ¹H auf ³¹P oder ²³Na. Die Frequenz fällt deutlich, und der Spinüberschuss wird viel kleiner. Der Grund: ¹H hat das größte gyromagnetische Verhältnis aller stabilen Kerne. Genau das beantwortet die Recap-Frage „Warum Protonen?“: Sie sind überall im Wasser, sie sind kleine Magnete, und sie reagieren am stärksten.',
        ru: 'Оставайся на 3 Тл и переключи **Атомное ядро** с ¹H на ³¹P или ²³Na. Частота заметно падает, а избыток спинов становится гораздо меньше. Причина: у ¹H самое большое гиромагнитное отношение среди всех стабильных ядер. Именно это отвечает на вопрос для повторения «Почему протоны?»: они есть повсюду в воде, это маленькие магниты, и они реагируют сильнее всех.',
      },
      {
        de: 'Stell den **Flipwinkel α** auf 90° und drück **⚡ HF-Puls senden**. Der rosa Pfeil kippt in die Querebene, und die Spulenspannung wird maximal. Schiebe nun die **Frequenzabweichung Δf des Pulses** auf 1000 Hz und sende nochmal: Der **Effektive Flipwinkel** sinkt, der Pfeil kippt nicht mehr ganz um. Der Grund: Nur ein Puls genau auf der Larmor-Frequenz ist resonant. Prüfe dein Wissen danach in der **📡 Resonanz-Challenge**.',
        ru: 'Поставь **Угол отклонения α** на 90° и нажми **⚡ Подать РЧ-импульс**. Розовая стрелка опрокидывается в поперечную плоскость, и напряжение катушки становится максимальным. Теперь передвинь **Отклонение частоты импульса Δf** на 1000 Гц и подай импульс ещё раз: **Эффективный угол отклонения** падает, стрелка опрокидывается не полностью. Причина: резонансен только импульс точно на ларморовой частоте. Затем проверь себя в **📡 Резонансное задание**.',
      },
    ],
    takeaway: {
      de: 'Für Protonen gilt $f_0 = \\bar\\gamma B_0$ mit $\\bar\\gamma = \\gamma/2\\pi = 42{,}57$ MHz/T, also 63,9 MHz bei 1,5 T. Achtung: Im Skript steht ω mit diesem Zahlenwert, gemeint ist aber die Frequenz f, die Kreisfrequenz ω ist um den Faktor 2π größer.',
      ru: 'Для протонов $f_0 = \\bar\\gamma B_0$, где $\\bar\\gamma = \\gamma/2\\pi = 42{,}57$ МГц/Тл, то есть 63,9 МГц при 1,5 Тл. Внимание: в конспекте с этим числом стоит ω, но имеется в виду частота f, а угловая частота ω больше в 2π раз.',
    },
  },

  relaxation: {
    intro: {
      de: 'Jede Farbe ist ein Gewebe, das du oben per Chip an- und abwählst. Das erste Diagramm zeigt die **Längsmagnetisierung Mz(t)**, die sich mit T1 wieder aufbaut, das zweite die **Quermagnetisierung Mxy(t)**, die mit T2 zerfällt (gestrichelt: der schnellere T2*-Zerfall). Die Balken im Feld **Spin-Echo-Signal** zeigen, wie hell jedes Gewebe im Bild wäre. Grundidee aus dem Skript: Der Kontrast entsteht, weil Gewebe unterschiedlich schnell relaxieren, und mit TR und TE wählst du, welcher Unterschied sichtbar wird.',
      ru: 'Каждый цвет это ткань, которую ты включаешь и выключаешь вверху кнопками. Первый график показывает **Продольная намагниченность Mz(t)**, которая восстанавливается с T1, второй **Поперечная намагниченность Mxy(t)**, которая затухает с T2 (пунктир: более быстрый спад T2*). Столбцы в поле **Сигнал спин-эха** показывают, насколько яркой была бы каждая ткань на изображении. Главная идея из конспекта: контраст возникает, потому что ткани релаксируют с разной скоростью, а через TR и TE ты выбираешь, какая разница станет видна.',
    },
    steps: [
      {
        de: 'Lass die **Anregung** auf „90°-Puls (Sättigung)“ und drück den Knopf **T1w** (TR 550 ms, TE 12 ms). Fettgewebe steigt in der Mz-Kurve am schnellsten an, Liquor am langsamsten. In den Balken ist Fett deshalb hell und Liquor dunkel. Der Grund: Bei kurzer **Repetitionszeit TR** hat nur Gewebe mit kurzem T1 seine Längsmagnetisierung schon wieder aufgebaut.',
        ru: 'Оставь **Возбуждение** на «90°-импульс (насыщение)» и нажми кнопку **T1w** (TR 550 мс, TE 12 мс). На кривой Mz жировая ткань растёт быстрее всего, ликвор медленнее всего. Поэтому в столбцах жир яркий, а ликвор тёмный. Причина: при коротком **Время повторения TR** только ткань с коротким T1 успевает восстановить продольную намагниченность.',
      },
      {
        de: 'Drück jetzt **T2w** (TR 4000 ms, TE 100 ms). Schau auf die Mxy-Kurven an der Markierung TE: Liquor hat dort noch viel Quermagnetisierung, die anderen Gewebe kaum. In den Balken ist Liquor jetzt am hellsten. Der Grund: Mit langer **Echozeit TE** misst du das Signal spät im T2-Zerfall, und nur Gewebe mit langem T2 hat dann noch Signal. Das ist die Antwort auf die Recap-Frage zum T2-gewichteten Bild.',
        ru: 'Теперь нажми **T2w** (TR 4000 мс, TE 100 мс). Посмотри на кривые Mxy у отметки TE: у ликвора там ещё много поперечной намагниченности, у остальных тканей почти нет. В столбцах ликвор теперь самый яркий. Причина: при длинном **Время эха TE** ты измеряешь сигнал поздно в спаде T2, и сигнал остаётся только у тканей с длинным T2. Это ответ на вопрос для повторения о T2-взвешенном изображении.',
      },
      {
        de: 'Scroll nach unten zu **Spin-Echo verstehen** und bewege den Regler **Zeit nach 90°-Puls** langsam bis zu TE. Erst fächern die farbigen Spins auf, nach dem 180°-Puls laufen sie wieder zusammen, und bei TE steht die **Kohärenz** bei 100 %. Der Grund: Der 180°-Puls spiegelt die Phasen und hebt so die statischen Feldinhomogenitäten (T2′) auf. Deshalb folgt das Echo der durchgezogenen T2-Kurve und nicht der gestrichelten T2*-Kurve.',
        ru: 'Прокрути вниз до **Понять спин-эхо** и медленно двигай ползунок **Время после 90°-импульса** до TE. Сначала цветные спины расходятся веером, после 180°-импульса снова сходятся, и в момент TE **Когерентность** равна 100 %. Причина: 180°-импульс зеркально отражает фазы и тем самым убирает статические неоднородности поля (T2′). Поэтому эхо следует сплошной кривой T2, а не пунктирной кривой T2*.',
      },
    ],
    takeaway: {
      de: 'Für ein T2-gewichtetes Bild wertest du den Zerfall der Quermagnetisierung aus: langes TR, damit T1 kaum noch zählt, und langes TE, damit sich die T2-Unterschiede zeigen. Flüssigkeit wie Liquor oder Ödem ist dann hell.',
      ru: 'Для T2-взвешенного изображения ты анализируешь спад поперечной намагниченности: длинное TR, чтобы T1 почти не влиял, и длинное TE, чтобы проявились различия T2. Жидкость, например ликвор или отёк, тогда яркая.',
    },
  },

  gradient: {
    intro: {
      de: 'Oben wählst du einen der drei Gradienten aus dem Skript: **1 · Schichtselektion**, **2 · Frequenzkodierung** und **3 · Phasenkodierung**. Im ersten Reiter zeigt die **grüne Gerade** die Resonanzfrequenz über dem Ort z, das **rosa Band** die Frequenzen, die der HF-Puls enthält, und **gelb** die angeregte Schicht. Grundidee: Ein Gradient macht das Feld ortsabhängig und damit auch die Larmor-Frequenz. So wird aus einer Frequenz ein Ort.',
      ru: 'Вверху ты выбираешь один из трёх градиентов из конспекта: **1 · Выбор среза**, **2 · Частотное кодирование** и **3 · Фазовое кодирование**. На первой вкладке **зелёная прямая** показывает резонансную частоту в зависимости от положения z, **розовая полоса** частоты, которые содержит РЧ-импульс, а **жёлтым** отмечен возбуждённый срез. Главная идея: градиент делает поле зависящим от места, а значит, и ларморову частоту. Так частота превращается в положение.',
    },
    steps: [
      {
        de: 'Im Reiter **1 · Schichtselektion** verdopple den **Schichtgradient Gs** von 10 auf 20 mT/m. Die grüne Gerade wird doppelt so steil, und die **Schichtdicke** halbiert sich von etwa 3,5 mm auf etwa 1,8 mm. Mit größerer **HF-Bandbreite Δf** wird die Schicht dicker, mit dem **Frequenz-Offset** wandert sie. Der Grund: Die Steigung der Geraden ist $df/dz = \\bar\\gamma G$, in Kreisfrequenz $d\\omega/dz = \\gamma G$. Das ist genau die Recap-Frage nach dω/dz.',
        ru: 'На вкладке **1 · Выбор среза** удвой **Градиент выбора среза Gs** с 10 до 20 мТл/м. Зелёная прямая становится вдвое круче, а **Толщина среза** уменьшается вдвое, примерно с 3,5 мм до 1,8 мм. С большей **Полоса РЧ-импульса Δf** срез становится толще, а **Сдвиг частоты** перемещает его. Причина: наклон прямой равен $df/dz = \\bar\\gamma G$, в угловой частоте $d\\omega/dz = \\gamma G$. Это и есть вопрос для повторения о dω/dz.',
      },
      {
        de: 'Wechsle zu **2 · Frequenzkodierung** und erhöhe den **Auslesegradient Gx** von 6 auf 12 mT/m. Die Frequenzen unter den Röhrchen A, B und C verdoppeln sich, die Schwebung im Echo wird schneller, und das FOV schrumpft von 200 mm auf 100 mm. Röhrchen A fällt dabei aus dem FOV. Der Grund: Jeder Ort sendet während der Auslese seine eigene Frequenz, und die Fourier-Transformation trennt die Frequenzen wieder in Orte.',
        ru: 'Перейди на **2 · Частотное кодирование** и увеличь **Градиент считывания Gx** с 6 до 12 мТл/м. Частоты под пробирками A, B и C удваиваются, биения в эхе ускоряются, а FOV сжимается с 200 мм до 100 мм. Пробирка A при этом выпадает из FOV. Причина: во время считывания каждое место излучает свою частоту, а преобразование Фурье снова разделяет частоты на положения.',
      },
      {
        de: 'Geh zu **3 · Phasenkodierung** und stell den **Aktueller Schritt k_y-Index** auf 0: Alle violetten Zeiger stehen gleich, das **Summensignal |S|** ist 100 %. Stell ihn auf 1: Die Phase windet sich einmal über das FOV, und |S| fällt auf 0 %. Erhöhe nun **Anzahl Phasenschritte N_y** und schau auf den **Messzeit-Anteil**. Der Grund: Jeder Phasenschritt braucht ein eigenes Echo, deshalb wächst die Messzeit mit N_y.',
        ru: 'Перейди на **3 · Фазовое кодирование** и поставь **Текущий шаг: индекс k_y** на 0: все фиолетовые стрелки смотрят одинаково, **Суммарный сигнал |S|** равен 100 %. Поставь 1: фаза закручивается один раз через весь FOV, и |S| падает до 0 %. Теперь увеличь **Число фазовых шагов N_y** и посмотри на **Доля времени сканирования**. Причина: каждому фазовому шагу нужно своё эхо, поэтому время сканирования растёт с N_y.',
      },
    ],
    takeaway: {
      de: 'Ein Gradient macht die Larmor-Frequenz linear ortsabhängig: $\\omega(z) = \\gamma (B_0 + G z)$, also $d\\omega/dz = \\gamma G$. Mit drei Gradienten kodierst du Schicht, Frequenz und Phase, und so wird aus dem Signal ein Bild.',
      ru: 'Градиент делает ларморову частоту линейно зависящей от места: $\\omega(z) = \\gamma (B_0 + G z)$, то есть $d\\omega/dz = \\gamma G$. Тремя градиентами ты кодируешь срез, частоту и фазу, и так из сигнала получается изображение.',
    },
  },

  kspace: {
    intro: {
      de: 'Im Feld **k-Raum (log. Betrag)** siehst du die gemessenen Rohdaten: Die Mitte ist hell, weil dort die meiste Signalenergie steckt. Dunkelblau sind Daten, die nicht gemessen oder verworfen wurden. Daneben steht das **Rekonstruierte Bild (inverse 2D-FFT)**. Grundidee aus dem Skript: Jeder k-Punkt ist ein Streifenmuster über das ganze Bild, und das Bild ist die Summe all dieser Muster.',
      ru: 'В поле **k-пространство (лог. модуль)** ты видишь измеренные сырые данные: центр яркий, потому что там больше всего энергии сигнала. Тёмно-синим отмечены неизмеренные или отброшенные данные. Рядом **Реконструированное изображение (обратное 2D-FFT)**. Главная идея из конспекта: каждая точка k-пространства это полосатый узор на всё изображение, а изображение это сумма всех таких узоров.',
    },
    steps: [
      {
        de: 'Klick einmal nahe der Mitte des k-Raums und einmal weit außen. Im Feld **Basiswelle eines k-Punkts** siehst du grobe, breite Streifen für die Mitte und feine, dichte Streifen für den Rand. Der Grund: Der Abstand vom Zentrum ist die Ortsfrequenz. Innen stecken grobe Helligkeitsverläufe, außen feine Details.',
        ru: 'Кликни один раз около центра k-пространства и один раз далеко на краю. В поле **Базисная волна точки k-пространства** ты видишь грубые широкие полосы для центра и тонкие частые полосы для края. Причина: расстояние от центра это пространственная частота. Внутри находятся грубые перепады яркости, снаружи мелкие детали.',
      },
      {
        de: 'Drück **Nur Zentrum**: Das Bild wird unscharf, aber der Kontrast zwischen den Geweben bleibt. Drück dann **Nur Peripherie** und verändere den **Filterradius**: Jetzt bleiben nur noch die Kanten übrig. Der Grund: Der **Hochpass** im **k-Raum-Filter** entfernt das Zentrum mit dem Kontrast und behält die hohen Ortsfrequenzen. Das ist die Antwort auf die Recap-Frage, wie man über den k-Raum Kanten verstärkt.',
        ru: 'Нажми **Только центр**: изображение становится размытым, но контраст между тканями сохраняется. Затем нажми **Только периферия** и меняй **Радиус фильтра**: теперь остаются только края. Причина: режим **Верхних частот** в **Фильтр k-пространства** убирает центр с контрастом и оставляет высокие пространственные частоты. Это ответ на вопрос для повторения, как через k-пространство усилить края.',
      },
      {
        de: 'Drück **Zurücksetzen** und schalte dann **Spike (fehlerhafter Datenpunkt)** ein. Ein einziger falscher Punkt im k-Raum legt ein Streifenmuster über das gesamte Bild. Der Grund: Wie du in Schritt 1 gesehen hast, gehört zu jedem k-Punkt eine Welle über das ganze Bild. Ein Fehler an einer Stelle im k-Raum ist also nie lokal im Bild.',
        ru: 'Нажми **Сбросить**, а затем включи **Спайк (ошибочная точка данных)**. Одна-единственная ошибочная точка в k-пространстве накладывает полосатый узор на всё изображение. Причина: как в шаге 1, каждой точке k-пространства соответствует волна на всё изображение. Поэтому ошибка в одном месте k-пространства никогда не бывает локальной на изображении.',
      },
    ],
    takeaway: {
      de: 'Das k-Raum-Zentrum bestimmt den Kontrast, die Peripherie die Details und Kanten. Kanten verstärkst du, indem du die äußeren k-Raum-Bereiche betonst, also mit einem Hochpassfilter.',
      ru: 'Центр k-пространства определяет контраст, периферия детали и края. Края ты усиливаешь, подчёркивая внешние области k-пространства, то есть фильтром верхних частот.',
    },
  },

  sequence: {
    intro: {
      de: 'Oben wählst du die Sequenz, darunter **Feld** und **Anatomie**. Das **Pulssequenzdiagramm (schematisch)** zeigt Zeile für Zeile, wann HF-Pulse, die drei Gradienten und das Signal kommen. Daneben siehst du das **Synthetische Bild**, die **Gewebesignale** als Balken und unter **Timing & Belastung** Messzeit und SAR. Das ist ein Bonus: Die Sequenzen gehen über das Skript hinaus, sie bauen aber direkt auf T1, T2, TR und TE auf.',
      ru: 'Вверху ты выбираешь последовательность, под ней **Поле** и **Анатомия**. **Диаграмма импульсной последовательности (схематично)** строка за строкой показывает, когда приходят РЧ-импульсы, три градиента и сигнал. Рядом видно **Синтетическое изображение**, **Сигналы тканей** в виде столбцов и в **Время и нагрузка** время сканирования и SAR. Это бонус: последовательности выходят за рамки конспекта, но напрямую опираются на T1, T2, TR и TE.',
    },
    steps: [
      {
        de: 'Wähle **Spin-Echo (SE)** und stell **TR** kurz und **TE** kurz ein, danach TR lang und TE lang. Das Etikett unter den Reglern wechselt zwischen T1- und T2-Gewichtung, und das Bild kehrt seinen Kontrast um. Der Grund: TR steuert, wie viel T1-Erholung zählt, TE steuert, wie viel T2-Zerfall zählt. Das ist dieselbe Regel wie im Relaxations-Simulator.',
        ru: 'Выбери **Спин-эхо (SE)** и поставь **TR** коротким и **TE** коротким, а потом TR длинным и TE длинным. Метка под ползунками переключается между T1- и T2-взвешиванием, и контраст изображения меняется на противоположный. Причина: TR определяет, насколько важно восстановление T1, TE определяет, насколько важен спад T2. Это то же правило, что и в симуляторе релаксации.',
      },
      {
        de: 'Wähle **Inversion Recovery (IR-TSE)** und stell die **Inversionszeit TI** auf den Wert für Liquor, der im Hinweis unter dem Regler steht. Liquor wird schwarz, das ist FLAIR. Mit dem Wert für Fett wird das Fett schwarz, das ist STIR. Der Grund: Nach dem 180°-Puls läuft Mz von −1 nach +1 und geht bei jedem Gewebe zu einem eigenen Zeitpunkt durch null.',
        ru: 'Выбери **Инверсия-восстановление (IR-TSE)** и поставь **Время инверсии TI** на значение для ликвора, которое указано в подсказке под ползунком. Ликвор становится чёрным, это FLAIR. Со значением для жира чёрным становится жир, это STIR. Причина: после 180°-импульса Mz идёт от −1 к +1 и у каждой ткани проходит через ноль в свой момент.',
      },
      {
        de: 'Wähle **Gradientenecho (FLASH)** und stell den **Flipwinkel α** auf den Ernst-Winkel aus dem Hinweis. Schau dann auf die **Messzeit** und vergleiche sie mit dem Spin-Echo. Der Grund: Mit kleinem Flipwinkel bleibt viel Längsmagnetisierung übrig, deshalb funktioniert ein sehr kurzes TR. Das Gradientenecho ist schnell, misst aber T2* statt T2, weil der 180°-Puls fehlt.',
        ru: 'Выбери **Градиентное эхо (FLASH)** и поставь **Угол отклонения α** на угол Эрнста из подсказки. Затем посмотри на **Время сканирования** и сравни со спин-эхом. Причина: при малом угле отклонения остаётся много продольной намагниченности, поэтому работает очень короткое TR. Градиентное эхо быстрое, но измеряет T2* вместо T2, потому что нет 180°-импульса.',
      },
    ],
    takeaway: {
      de: 'Für das Verständnis: Jede Sequenz ist nur eine andere Art, TR, TE und Pulse zu kombinieren. Für die Prüfung zählt die Brücke dahinter: kurzes TR und TE ergibt T1-Gewichtung, langes TR und TE ergibt T2-Gewichtung, und das Spin-Echo hebt statische Inhomogenitäten auf.',
      ru: 'Для понимания: каждая последовательность это лишь иной способ сочетать TR, TE и импульсы. Для экзамена важен мост: короткие TR и TE дают T1-взвешивание, длинные TR и TE дают T2-взвешивание, а спин-эхо убирает статические неоднородности.',
    },
  },

  artifact: {
    intro: {
      de: 'Jede Runde ist ein Fall: Links siehst du das **Bild mit Artefakt**, rechts erscheint nach deinem Befund das **Korrigierte Bild**. Die Phasenrichtung ist vertikal, die Ausleserichtung horizontal. Unter **Protokolldaten** stehen die Messparameter, in denen oft schon der Hinweis auf die Ursache steckt. Das ist ein Bonus: Artefakte stehen kaum im Skript, aber fast alle lassen sich mit k-Raum, Gradienten und Bandbreite erklären.',
      ru: 'Каждый раунд это случай: слева ты видишь **Изображение с артефактом**, справа после твоего заключения появляется **Исправленное изображение**. Фазовое направление вертикальное, направление считывания горизонтальное. В **Данные протокола** указаны параметры измерения, в которых часто уже скрыта подсказка о причине. Это бонус: артефактов почти нет в конспекте, но почти все объясняются через k-пространство, градиенты и полосу пропускания.',
    },
    steps: [
      {
        de: 'Schau dir das Bild an und vergleiche es mit den **Protokolldaten**. Achte besonders auf **FOV R×P**, **Matrix** und **BW**. Ist zum Beispiel das FOV in Phasenrichtung kleiner als der Kopf, oder ist die Bandbreite sehr niedrig? Der Grund: Viele Artefakte entstehen direkt aus einem Parameter, und die Richtung (vertikal oder horizontal) verrät dir, ob die Phase oder die Auslese betroffen ist.',
        ru: 'Посмотри на изображение и сравни его с **Данные протокола**. Обрати особое внимание на **FOV С×Ф**, **Матрица** и **BW**. Например, FOV в фазовом направлении меньше головы или полоса пропускания очень низкая? Причина: многие артефакты возникают прямо из одного параметра, а направление (вертикальное или горизонтальное) подсказывает, затронута фаза или считывание.',
      },
      {
        de: 'Wähle unter **1. Diagnose** den Namen des Artefakts und unter **2. Gegenmaßnahme** eine Lösung. Drück **Befund abgeben** und vergleiche das korrigierte Bild mit dem Original. Der Grund: Erst wenn du Ursache und Gegenmittel zusammen nennst, hast du das Artefakt wirklich verstanden. Die Erklärung im Feedback zeigt dir die Physik dahinter.',
        ru: 'Выбери в **1. Диагноз** название артефакта, а в **2. Мера устранения** решение. Нажми **Отправить заключение** и сравни исправленное изображение с исходным. Причина: только когда ты называешь причину и средство вместе, ты действительно понимаешь артефакт. Объяснение в обратной связи показывает физику, которая за этим стоит.',
      },
      {
        de: 'Spiel mit **Nächster Fall →** weiter, bis du Einfaltung, Gibbs-Artefakt und Spike gesehen hast. Probiere dieselben Effekte danach im K-Raum-Studio nach: Unterabtastung, Tiefpass und Spike. Der Grund: Einfaltung entsteht, wenn die k-Raum-Zeilen zu weit auseinanderliegen, Gibbs-Ringing, wenn die äußeren k-Raum-Daten fehlen, und ein Spike ist ein einzelner falscher k-Punkt.',
        ru: 'Продолжай с **Следующий случай →**, пока не увидишь артефакт наложения, артефакт Гиббса и спайк. Потом воспроизведи те же эффекты в студии k-пространства: неполная выборка, фильтр нижних частот и спайк. Причина: наложение возникает, когда строки k-пространства лежат слишком далеко друг от друга, звон Гиббса, когда не хватает внешних данных k-пространства, а спайк это одна ошибочная точка k-пространства.',
      },
    ],
    takeaway: {
      de: 'Für das Verständnis: Ein Artefakt ist fast immer eine sichtbare Folge davon, wie der k-Raum gefüllt wurde. Diese Brücke hilft dir in der Prüfung, wenn du erklären sollst, wie aus dem Signal das Bild entsteht.',
      ru: 'Для понимания: артефакт почти всегда видимое следствие того, как было заполнено k-пространство. Этот мост поможет тебе на экзамене, когда нужно объяснить, как из сигнала получается изображение.',
    },
  },

  scanner: {
    intro: {
      de: 'Du siehst einen Querschnitt durch einen MRT-Scanner. Jedes Bauteil kannst du antippen oder mit den Pfeilen durchblättern, dann wird es hervorgehoben, und daneben stehen seine Aufgabe und wichtige Fakten. Mit **+** und **−** zoomst du an kleine Teile heran. Grundidee aus dem Skript: Ein MRT braucht ein starkes, homogenes Hauptfeld, schaltbare Gradientenfelder und ein HF-System zum Senden und Empfangen.',
      ru: 'Ты видишь поперечный разрез МР-сканера. Каждый компонент можно нажать или пролистать стрелками, тогда он выделяется, а рядом описаны его задача и важные факты. Кнопками **+** и **−** ты приближаешь мелкие детали. Главная идея из конспекта: МРТ нужны сильное однородное основное поле, переключаемые градиентные поля и РЧ-система для передачи и приёма.',
    },
    steps: [
      {
        de: 'Blättere mit **Nächstes Bauteil →** einmal durch alle Komponenten und sortiere sie im Kopf in drei Gruppen: Hauptfeld (**Supraleitende Hauptfeldspulen**, **Kryostat (Vakuumbehälter)**, **Kaltkopf (Cryocooler)**), Ortskodierung (**Gradientenspulen (x, y, z)**) und HF-System (**HF-Körperspule (Birdcage)**, **Lokale Empfangsspule (Phased Array)**, **HF-Kabine (Faradaykäfig)**). Der Grund: Genau diese Gruppen fragt die Recap-Frage nach den essentiellen Komponenten ab.',
        ru: 'Пролистай кнопкой **Следующий →** все компоненты и мысленно раздели их на три группы: основное поле (**Сверхпроводящие катушки основного поля**, **Криостат (вакуумный сосуд)**, **Холодная головка (криокулер)**), пространственное кодирование (**Градиентные катушки (x, y, z)**) и РЧ-система (**РЧ-катушка тела (Birdcage)**, **Локальная приёмная катушка (фазированная решётка)**, **РЧ-кабина (клетка Фарадея)**). Причина: именно эти группы проверяет вопрос для повторения о главных компонентах.',
      },
      {
        de: 'Vergleiche **Shimsystem** und **Gradientenspulen (x, y, z)**. Beide verändern das Magnetfeld, aber mit entgegengesetztem Ziel. Der Grund: Der Shim macht $B_0$ so gleichmäßig wie möglich, die Gradienten machen das Feld absichtlich und schnell geschaltet ortsabhängig, damit jeder Ort eine eigene Frequenz bekommt.',
        ru: 'Сравни **Система шиммирования** и **Градиентные катушки (x, y, z)**. Обе меняют магнитное поле, но с противоположной целью. Причина: шим делает $B_0$ как можно более однородным, а градиенты намеренно и с быстрым переключением делают поле зависящим от места, чтобы каждое место получило свою частоту.',
      },
      {
        de: 'Drück **🎯 Quiz starten** und beantworte die Fragen, indem du das passende Bauteil antippst. Der Grund: Wenn du Funktion und Ort eines Bauteils sofort verbinden kannst, sitzt das Lernziel „technische Komponenten inklusive Funktion beschreiben“.',
        ru: 'Нажми **🎯 Викторина** и отвечай на вопросы, нажимая на подходящий компонент. Причина: если ты сразу связываешь функцию и место компонента, цель обучения «описать технические компоненты вместе с их функцией» достигнута.',
      },
    ],
    takeaway: {
      de: 'Die essentiellen Komponenten sind: Hauptmagnet für $B_0$ (mit Shim), Gradientenspulen für x, y und z, HF-Spulen zum Senden und Empfangen, die HF-Abschirmung und der Rechner für Steuerung und Bildrekonstruktion. Nenne zu jeder Komponente immer auch ihre Funktion.',
      ru: 'Главные компоненты: основной магнит для $B_0$ (с шимом), градиентные катушки для x, y и z, РЧ-катушки для передачи и приёма, РЧ-экранирование и компьютер для управления и реконструкции изображения. К каждому компоненту всегда называй и его функцию.',
    },
  },

  protocol: {
    intro: {
      de: 'Das ist eine freie Konsole wie am echten Gerät. Unter **Protokoll** stellst du Sequenz, **Feldstärke**, **Anatomie** und alle Messparameter ein. Unter **Vorschau** siehst du die simulierte Aufnahme, unter **Kennzahlen** Messzeit, **SNR (rel.)**, SAR, Voxelgröße und Artefaktwerte. Das ist ein Bonus: Hier erlebst du, dass jeder Parameter einen Preis hat, und das verbindet Bildqualität mit dem Stoff zu k-Raum und Gradienten.',
      ru: 'Это свободная консоль, как на настоящем аппарате. В **Протокол** ты задаёшь последовательность, **Индукция поля**, **Анатомия** и все параметры измерения. В **Предпросмотр** видно смоделированное изображение, в **Показатели** время сканирования, **SNR (отн.)**, SAR, размер вокселя и значения артефактов. Это бонус: здесь ты увидишь, что у каждого параметра есть цена, и это связывает качество изображения с темой k-пространства и градиентов.',
    },
    steps: [
      {
        de: 'Stell **Mittelungen NEX** von 1 auf 4. Das **SNR (rel.)** verdoppelt sich ungefähr, die **Messzeit** wird aber viermal so lang. Der Grund: Beim Mitteln addiert sich das Signal, das Rauschen dagegen nur mit der Wurzel. Deshalb wächst das SNR nur mit $\\sqrt{\\text{NEX}}$.',
        ru: 'Поставь **Усреднения NEX** с 1 на 4. **SNR (отн.)** примерно удваивается, но **Время сканирования** становится в четыре раза дольше. Причина: при усреднении сигнал складывается, а шум растёт только как корень. Поэтому SNR растёт лишь как $\\sqrt{\\text{NEX}}$.',
      },
      {
        de: 'Setz NEX zurück auf 1 und verdopple **Matrix Phase**. Die Voxel werden kleiner und das Bild schärfer, aber das SNR sinkt, und die Messzeit verdoppelt sich. Der Grund: Jede Zeile in Phasenrichtung ist ein eigener Phasenkodierschritt mit eigenem Echo, genau wie in der Gradienten-Werkbank. Und ein kleineres Voxel enthält weniger Protonen.',
        ru: 'Верни NEX на 1 и удвой **Матрица фазовая**. Воксели становятся меньше, изображение резче, но SNR падает, а время сканирования удваивается. Причина: каждая строка в фазовом направлении это отдельный шаг фазового кодирования со своим эхом, точно как в градиентной мастерской. А в меньшем вокселе меньше протонов.',
      },
      {
        de: 'Senke die **Bandbreite** auf einen niedrigen Wert und schau auf **Chem. Verschiebung** und SNR. Die Verschiebung zwischen Fett und Wasser wächst in Pixeln, das SNR steigt. Bei hoher Bandbreite ist es umgekehrt. Der Grund: Fett präzediert etwas langsamer als Wasser. Bei schmaler Bandbreite pro Pixel entspricht dieser Frequenzunterschied mehr Pixeln, dafür fängst du weniger Rauschen ein.',
        ru: 'Уменьши **Полоса пропускания** до низкого значения и посмотри на **Хим. сдвиг** и SNR. Сдвиг между жиром и водой в пикселях растёт, SNR увеличивается. При высокой полосе всё наоборот. Причина: жир прецессирует немного медленнее воды. При узкой полосе на пиксель эта разница частот соответствует большему числу пикселей, зато ты захватываешь меньше шума.',
      },
    ],
    takeaway: {
      de: 'Für das Verständnis: Messzeit, SNR und Auflösung hängen zusammen, und du kannst nie alles gleichzeitig verbessern. Die Brücke zur Prüfung: Die Messzeit wächst mit der Zahl der Phasenkodierschritte, und die Ortsauflösung kommt aus den Gradienten und dem k-Raum.',
      ru: 'Для понимания: время сканирования, SNR и разрешение связаны, и улучшить всё сразу нельзя. Мост к экзамену: время сканирования растёт с числом шагов фазового кодирования, а пространственное разрешение создают градиенты и k-пространство.',
    },
  },

  signal: {
    intro: {
      de: 'Oben wählst du zwischen **Bloch-Dynamik** und **FID → Spektrum**. Bei der Bloch-Dynamik zeigt der **rosa Pfeil** die Magnetisierung im rotierenden Bezugssystem und die violette Spur ihren bisherigen Weg. Im **Zeitverlauf Mx, My, Mz** ist Mx blau, My violett und Mz grün. Das entspricht dem Bloch-Modell aus Lab 3: Die Kurven werden wirklich numerisch aus den Bloch-Gleichungen berechnet.',
      ru: 'Вверху ты выбираешь между **Динамика Блоха** и **FID → спектр**. В динамике Блоха **розовая стрелка** показывает намагниченность во вращающейся системе, а фиолетовый след её пройденный путь. На графике **Mx, My, Mz во времени** Mx синий, My фиолетовый и Mz зелёный. Это соответствует модели Блоха из лабораторной 3: кривые действительно численно рассчитываются из уравнений Блоха.',
    },
    steps: [
      {
        de: 'Wähle **Bloch-Dynamik**, stell den **HF-Puls (2 ms)** auf 90° und die **Off-Resonanz** auf 0 Hz. Zieh den Regler **Zeit nach Pulsbeginn** langsam nach rechts. Mz fällt auf null, die Quermagnetisierung wird groß, danach zerfällt sie mit **T₂**, und Mz baut sich mit **T₁** wieder auf. Der Grund: Der Puls kippt M in die Querebene, dann holt die Relaxation die Magnetisierung zurück ins Gleichgewicht M₀.',
        ru: 'Выбери **Динамика Блоха**, поставь **РЧ-импульс (2 мс)** на 90° и **Отстройка от резонанса** на 0 Гц. Медленно тяни ползунок **Время от начала импульса** вправо. Mz падает до нуля, поперечная намагниченность становится большой, затем она затухает с **T₂**, а Mz восстанавливается с **T₁**. Причина: импульс опрокидывает M в поперечную плоскость, а затем релаксация возвращает намагниченность в равновесие M₀.',
      },
      {
        de: 'Stell jetzt die **Off-Resonanz** auf etwa 100 Hz. Der Pfeil beschreibt eine Spirale, und Mx und My schwingen im Zeitverlauf hin und her. Der Grund: Off-Resonanz bedeutet, dass das Feld am Kern ein bisschen von dem Feld abweicht, zu dem das rotierende System passt, es gilt $\\Delta f = \\bar\\gamma\\,\\Delta B_0$. Das ist der Versuch aus Lab 3, B₀ zu ändern: Mehr Feld heißt schnellere Präzession, so wie es die Larmor-Gleichung vorhersagt.',
        ru: 'Теперь поставь **Отстройка от резонанса** примерно на 100 Гц. Стрелка описывает спираль, а Mx и My на графике колеблются туда и обратно. Причина: отстройка означает, что поле у ядра немного отличается от поля, которому соответствует вращающаяся система, и $\\Delta f = \\bar\\gamma\\,\\Delta B_0$. Это опыт из лабораторной 3 с изменением B₀: больше поля значит более быстрая прецессия, как и предсказывает уравнение Лармора.',
      },
      {
        de: 'Wechsle zu **FID → Spektrum** und senke die **FID-Zerfallszeit T₂*** von 80 ms auf 20 ms. Der FID ist schneller weg, und die Linie im Spektrum wird breiter: Die **FWHM** steigt von etwa 4 Hz auf etwa 16 Hz. Mit dem **Frequenzoffset** wandert die Linie, die **Anfangsphase** verändert nur I und Q. Der Grund: Die Fourier-Transformation verknüpft Zeit und Frequenz, es gilt $\\Delta f = 1/(\\pi T_2^*)$. Das ist die Signalmodifikation mit Spektrum aus Lab 3.',
        ru: 'Перейди на **FID → спектр** и уменьши **Время затухания FID T₂*** с 80 мс до 20 мс. FID исчезает быстрее, а линия в спектре становится шире: **FWHM** растёт примерно с 4 Гц до 16 Гц. С **Частотная отстройка** линия смещается, а **Начальная фаза** меняет только I и Q. Причина: преобразование Фурье связывает время и частоту, $\\Delta f = 1/(\\pi T_2^*)$. Это модификация сигнала и спектр из лабораторной 3.',
      },
    ],
    takeaway: {
      de: 'Nach dem Puls kehrt die Magnetisierung ins Gleichgewicht zurück: längs mit T1, quer mit T2, und die Präzessionsfrequenz folgt direkt aus B₀. Ein kurzer FID ergibt eine breite Spektrallinie, ein langer FID eine schmale.',
      ru: 'После импульса намагниченность возвращается в равновесие: продольная с T1, поперечная с T2, а частота прецессии прямо следует из B₀. Короткий FID даёт широкую спектральную линию, длинный FID узкую.',
    },
  },

  fourier: {
    intro: {
      de: 'Im Feld **Signal und Rekonstruktion** siehst du das Eingangssignal (violett) und gestrichelt grün die Rekonstruktion aus der inversen DFT. Das **Amplitudenspektrum (DFT)** zeigt jeden Frequenz-Bin k als Balken, grün markiert ist der Bin, den du gerade testest. Im Feld **Signal × Testfunktion** siehst du Signal, Test-Kosinus und ihr **Produkt** (rosa). Grundidee aus dem Skript: Du multiplizierst das Signal mit einer Testfunktion und summierst. Kommt etwas heraus, steckt diese Frequenz im Signal.',
      ru: 'В поле **Сигнал и реконструкция** ты видишь входной сигнал (фиолетовый) и зелёным пунктиром восстановление обратным ДПФ. **Амплитудный спектр (ДПФ)** показывает каждый частотный бин k столбцом, зелёным отмечен бин, который ты сейчас проверяешь. В поле **Сигнал × тестовая функция** видны сигнал, тестовый косинус и их **Произведение** (розовое). Главная идея из конспекта: ты умножаешь сигнал на тестовую функцию и суммируешь. Если что-то получается, эта частота есть в сигнале.',
    },
    steps: [
      {
        de: 'Lass die **Signalform** auf „Zwei Komponenten“ und **Sinus: Perioden im Messfenster** auf 3. Stell die **Testfrequenz / DFT-Bin k** auf 3: **Im(Xₖ) / N** ist etwa −0,5. Auf 7 ist **Re(Xₖ) / N** etwa 0,25, auf 5 sind beide null. Öffne dann **Alle 64 Rechenschritte anzeigen**. Der Grund: Das ist genau die DFT aus dem Tabellenblatt in Lab 3. Passt die Testfunktion zum Signal, addieren sich die Produkte, sonst heben sie sich auf. Das nennt man Orthogonalität.',
        ru: 'Оставь **Форма сигнала** на «Две компоненты», а **Синус: периоды в окне** на 3. Поставь **Тестовая частота / бин ДПФ k** на 3: **Im(Xₖ) / N** примерно −0,5. На 7 **Re(Xₖ) / N** примерно 0,25, на 5 оба равны нулю. Затем открой **Показать все 64 шага вычисления**. Причина: это в точности ДПФ из таблицы в лабораторной 3. Если тестовая функция совпадает с сигналом, произведения складываются, иначе гасятся. Это называется ортогональностью.',
      },
      {
        de: 'Stell die **Sinus-Phase** auf 90° und bleib bei Bin 3. Jetzt ist Re(Xₖ)/N etwa 0,5 und Im(Xₖ)/N null, der Balken im Spektrum bleibt aber gleich hoch. Stell danach **Sinus: Perioden im Messfenster** auf 3,5. Die Energie verteilt sich auf mehrere Bins. Der Grund: Die Phase verschiebt den Anteil zwischen Kosinus und Sinus, also zwischen Real- und Imaginärteil. Eine nicht ganzzahlige Periodenzahl passt zu keiner Testfunktion genau, das nennt man Leakage.',
        ru: 'Поставь **Фаза синуса** на 90° и оставайся на бине 3. Теперь Re(Xₖ)/N примерно 0,5, а Im(Xₖ)/N равен нулю, но столбец в спектре остаётся той же высоты. Затем поставь **Синус: периоды в окне** на 3,5. Энергия распределяется по нескольким бинам. Причина: фаза перераспределяет долю между косинусом и синусом, то есть между вещественной и мнимой частью. Нецелое число периодов не совпадает точно ни с одной тестовой функцией, это называется утечкой.',
      },
      {
        de: 'Setz die Perioden zurück auf 3 und erhöhe die **Gauß-Faltung σ (0 = aus)** auf 2. Das Signal wird glatter, und im Spektrum schrumpft Bin 7 viel stärker als Bin 3. Teste Bin 7 und lies die **Dämpfung im Bin** ab. Der Grund: Eine Faltung im Zeitbereich ist eine Multiplikation im Frequenzbereich, so steht es im Skript beim Faltungssatz. Glätten wirkt also wie ein Tiefpass, genau wie der Filter im K-Raum-Studio.',
        ru: 'Верни число периодов на 3 и увеличь **Свёртка Гаусса σ (0 = выкл.)** до 2. Сигнал становится глаже, а в спектре бин 7 уменьшается гораздо сильнее, чем бин 3. Проверь бин 7 и прочитай **Подавление бина**. Причина: свёртка во временной области это умножение в частотной области, так написано в конспекте у теоремы о свёртке. Значит, сглаживание действует как фильтр нижних частот, точно как фильтр в студии k-пространства.',
      },
    ],
    takeaway: {
      de: 'Die Fourier-Koeffizienten bekommst du, indem du das Signal mit einer Testfunktion multiplizierst und aufsummierst. Wegen der Orthogonalität bleibt nur die passende Frequenz übrig, und genau so zerlegt die MRT das Echo in Frequenzen und damit in Orte.',
      ru: 'Коэффициенты Фурье ты получаешь, умножая сигнал на тестовую функцию и суммируя. Благодаря ортогональности остаётся только подходящая частота, и именно так МРТ раскладывает эхо на частоты, а значит, на положения.',
    },
  },

  applications: {
    intro: {
      de: 'Oben wählst du eine Anwendung: **Fluss**, **DTI**, **Spektroskopie**, **BOLD**, **Kontrastmittel** oder **Fallkarten**. Jede Ansicht ist ein vereinfachtes Lehrmodell mit Reglern, die die Kernidee zeigen, die Modellgrenzen stehen jeweils im Kasten daneben. Grundidee aus dem Skript: Dieselbe Physik aus Präzession, Phase und Relaxation macht sehr verschiedene klinische Fragen messbar.',
      ru: 'Вверху ты выбираешь применение: **Поток**, **DTI**, **Спектроскопия**, **BOLD**, **Контраст** или **Случаи**. Каждый вид это упрощённая учебная модель с ползунками, которые показывают главную идею, а границы модели описаны в рамке рядом. Главная идея из конспекта: одна и та же физика прецессии, фазы и релаксации делает измеримыми очень разные клинические вопросы.',
    },
    steps: [
      {
        de: 'Wähle **Fluss**. Bei **Wahre Geschwindigkeit** 120 cm/s und **VENC** 80 cm/s ist der Wert **Aus Phase abgeleitet** falsch, der Fluss scheint sogar rückwärts zu laufen. Erhöhe VENC über 120 cm/s, und die Messung stimmt. Der Grund: Die Geschwindigkeit wird als Phase kodiert, und eine Phase ist nur bis ±π eindeutig. Ist der Fluss schneller als VENC, faltet die Phase um.',
        ru: 'Выбери **Поток**. При **Истинная скорость** 120 см/с и **VENC** 80 см/с значение **Вычислено из фазы** неверно, поток даже кажется обратным. Подними VENC выше 120 см/с, и измерение становится верным. Причина: скорость кодируется как фаза, а фаза однозначна только до ±π. Если поток быстрее VENC, фаза сворачивается.',
      },
      {
        de: 'Wähle **DTI**, lass das **Gewebemodell** auf „Anisotrop“ und dreh die **Messrichtung zur Faser** von 0° auf 90°. Bei 0° ist der ADC groß und S/S₀ klein, bei 90° ist es umgekehrt. Bei „Isotrop“ ändert der Winkel nichts. Der Grund: Wasser diffundiert in Nervenfasern leichter entlang der Faser als quer dazu. Aus dieser Richtungsabhängigkeit schätzt die Traktografie den Faserverlauf.',
        ru: 'Выбери **DTI**, оставь **Модель ткани** на «Анизотропно» и поверни **Направление относительно волокна** с 0° на 90°. При 0° ADC большой, а S/S₀ маленький, при 90° наоборот. При «Изотропно» угол ничего не меняет. Причина: в нервных волокнах вода диффундирует вдоль волокна легче, чем поперёк. По этой зависимости от направления трактография оценивает ход волокон.',
      },
      {
        de: 'Wähle **Kontrastmittel** und erhöhe die **Lokale Modell-Konzentration c**. T₁ wird kürzer, die Kurve steigt schneller an, und das Signal S/(ρ·M₀) bei TR 500 ms wird größer. Der Grund: Gadolinium verkürzt T1, deshalb wird kontrastmittelaufnehmendes Gewebe im T1-gewichteten Bild hell. Hier triffst du den Stoff aus dem Relaxations-Simulator wieder.',
        ru: 'Выбери **Контраст** и увеличь **Локальная модельная концентрация c**. T₁ становится короче, кривая растёт быстрее, а сигнал S/(ρ·M₀) при TR 500 мс увеличивается. Причина: гадолиний укорачивает T1, поэтому ткань, накапливающая контраст, становится яркой на T1-взвешенном изображении. Здесь ты снова встречаешь материал из симулятора релаксации.',
      },
    ],
    takeaway: {
      de: 'Zu jeder Anwendung solltest du das Messprinzip und eine Indikation nennen können: Fluss über die Phase, DTI über die richtungsabhängige Diffusion, Spektroskopie über die chemische Verschiebung, BOLD über Deoxyhämoglobin und Kontrastmittel über die T1-Verkürzung.',
      ru: 'Для каждого применения нужно уметь назвать принцип измерения и показание: поток через фазу, DTI через направленную диффузию, спектроскопия через химический сдвиг, BOLD через дезоксигемоглобин, контраст через укорочение T1.',
    },
  },
};
