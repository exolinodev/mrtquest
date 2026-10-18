import { n, pick, tl, type QuestionSource } from './types';

const GAMMA_BAR_INTRO = 42.58; // MHz/T, gerundet für den Einstieg
const AVOGADRO = 6.022e23; // 1/mol
const WATER_MOLAR_MASS = 18; // g/mol, gerundet wie im Fragetext

/** Kapitel „Einführung: MRT in der Klinik“: wofür MRT, Stärken, Grenzen, Indikationen, Lernziele. */
export const einfuehrungQuestions: QuestionSource[] = [
  {
    id: 'ei-bone-dark',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Im Skript zeigt ein MRT-Bild des Kopfes das Kleinhirn mit feinsten Strukturen, der Schädelknochen bleibt aber fast schwarz. Warum?',
      ru: 'В конспекте МРТ-снимок головы показывает мозжечок с тончайшими структурами, а кости черепа остаются почти чёрными. Почему?',
    },
    options: [
      {
        de: 'Kompakter Knochen enthält kaum frei bewegliches Wasser, und sein Restsignal zerfällt so schnell, dass bei der Messung praktisch nichts mehr da ist.',
        ru: 'В компактной кости почти нет свободно подвижной воды, а её остаточный сигнал спадает так быстро, что к моменту измерения почти ничего не остаётся.',
      },
      {
        de: 'Knochen schirmt das Magnetfeld vollständig ab, deshalb erreicht B₀ den Knochen nicht.',
        ru: 'Кость полностью экранирует магнитное поле, поэтому B₀ до неё не доходит.',
      },
      {
        de: 'Der Scanner blendet Knochen absichtlich aus, damit die Strahlendosis sinkt.',
        ru: 'Томограф намеренно скрывает кости, чтобы снизить дозу облучения.',
      },
      {
        de: 'Kalzium hat eine viel höhere Larmor-Frequenz als Wasserstoff und überstrahlt das Bild.',
        ru: 'У кальция ларморова частота намного выше, чем у водорода, и он засвечивает изображение.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Das MRT hört auf Wasserstoffkerne, vor allem im Wasser. Wie viel bewegliches Wasser steckt in hartem Knochen?',
      ru: 'МРТ «слушает» ядра водорода, прежде всего в воде. Сколько подвижной воды в твёрдой кости?',
    },
    explanation: {
      de: '**Knochen ist dunkel, weil von ihm kaum Signal kommt.** Das MRT ist wie ein Radio, das nur einen Sender empfängt: die Wasserstoffkerne. Weiche Gewebe wie das Gehirn sind voller Wasser und senden kräftig. Kompakter Knochen ist dagegen hart und trocken. Die wenigen Protonen darin sitzen fest und verlieren ihr Signal extrem schnell, ihr T2 ist sehr kurz. Bis der Scanner das Echo misst, ist dieses Signal längst weg. Im Skript heißt es deshalb: Weichteile ja, Knochen nein, weil das Signal fehlt. Ein Magnetfeld schirmt Knochen übrigens nicht ab, und Strahlendosis gibt es beim MRT gar keine.',
      ru: '**Кость тёмная, потому что от неё почти нет сигнала.** МРТ похожа на радиоприёмник, который ловит только одну станцию: ядра водорода. Мягкие ткани, например мозг, полны воды и «вещают» громко. Компактная кость, наоборот, твёрдая и сухая. Немногие протоны в ней жёстко закреплены и теряют сигнал очень быстро, их T2 очень короткое. Пока томограф измеряет эхо, этот сигнал давно исчез. Поэтому в конспекте сказано: мягкие ткани да, кости нет, потому что нет сигнала. Магнитное поле кость, кстати, не экранирует, а дозы облучения в МРТ нет вообще.',
    },
  },
  {
    id: 'ei-no-ionizing',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Warum wird das MRT gern bei Kindern und in der Schwangerschaft eingesetzt, wenn eine Schnittbildgebung nötig ist?',
      ru: 'Почему МРТ охотно применяют у детей и при беременности, когда нужна послойная визуализация?',
    },
    options: [
      {
        de: 'Es arbeitet mit Magnetfeld und Radiowellen, also ohne ionisierende Strahlung.',
        ru: 'Она работает с магнитным полем и радиоволнами, то есть без ионизирующего излучения.',
      },
      {
        de: 'Es nutzt eine besonders niedrige Röntgendosis.',
        ru: 'Она использует особенно низкую дозу рентгеновского излучения.',
      },
      {
        de: 'Die Untersuchung dauert nur Sekunden und ist völlig geräuschlos.',
        ru: 'Исследование длится лишь секунды и проходит совершенно бесшумно.',
      },
      {
        de: 'Es braucht immer ein Kontrastmittel, das für den Fetus besonders gut verträglich ist.',
        ru: 'Ей всегда нужно контрастное вещество, которое особенно хорошо переносится плодом.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Überlege, welche Energieform beim MRT ins Gewebe geht. Reicht deren Energie pro Photon, um Elektronen aus Atomen zu schlagen?',
      ru: 'Подумай, какая форма энергии попадает в ткань при МРТ. Хватает ли энергии одного фотона, чтобы выбить электрон из атома?',
    },
    explanation: {
      de: '**MRT kommt ohne ionisierende Strahlung aus.** Benutzt werden ein starkes statisches Magnetfeld, schaltbare Gradientenfelder und Radiowellen im MHz-Bereich. Ein Radiowellen-Photon hat millionenfach zu wenig Energie, um ein Elektron aus einem Atom zu schlagen. Erbgutschäden wie bei Röntgen oder CT gibt es deshalb nicht. Das macht das MRT attraktiv für Kinder, für Verlaufskontrollen und in der Schwangerschaft, wo das Skript zum Beispiel Bilder von Fetus und Plazenta zeigt. Schnell und leise ist das MRT aber nicht: Eine Untersuchung dauert eher Minuten, und die Gradienten klopfen laut. Kontrastmittel ist auch nicht immer nötig, in der Schwangerschaft vermeidet man Gadolinium sogar möglichst.',
      ru: '**МРТ обходится без ионизирующего излучения.** Используются сильное статическое магнитное поле, переключаемые градиентные поля и радиоволны в диапазоне МГц. У фотона радиоволны в миллионы раз меньше энергии, чем нужно, чтобы выбить электрон из атома. Поэтому повреждений ДНК, как при рентгене или КТ, нет. Это делает МРТ привлекательной для детей, для контрольных исследований и при беременности: в конспекте, например, показаны снимки плода и плаценты. Но быстрой и тихой МРТ не назовёшь: исследование длится скорее минуты, а градиенты громко стучат. Контрастное вещество тоже нужно не всегда, а при беременности гадолиния по возможности даже избегают.',
    },
  },
  {
    id: 'ei-strengths',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Aussagen zum MRT in der Klinik stimmen? (Mehrfachauswahl)',
      ru: 'Какие утверждения о МРТ в клинике верны? (несколько вариантов)',
    },
    options: [
      {
        de: 'Es liefert einen sehr hohen Kontrast zwischen verschiedenen Weichteilen.',
        ru: 'Она даёт очень высокий контраст между разными мягкими тканями.',
      },
      {
        de: 'Es kann neben der Anatomie auch funktionelle bzw. physiologische Information liefern.',
        ru: 'Помимо анатомии, она может давать функциональную или физиологическую информацию.',
      },
      {
        de: 'Der Kontrast lässt sich über die Messparameter verändern, ohne den Patienten neu zu lagern.',
        ru: 'Контраст можно менять через параметры измерения, не перекладывая пациента.',
      },
      {
        de: 'Für feine Knochenstrukturen ist das MRT dem CT grundsätzlich überlegen.',
        ru: 'Для тонких костных структур МРТ принципиально превосходит КТ.',
      },
      {
        de: 'Das Signal stammt hauptsächlich von Kohlenstoffkernen im Gewebe.',
        ru: 'Сигнал в основном исходит от ядер углерода в ткани.',
      },
    ],
    answers: [0, 1, 2],
    hint: {
      de: 'Denk an das Kopfbild aus dem Skript: Was ist dort gut zu sehen, was kaum? Und welcher Kern ist im Körper am häufigsten?',
      ru: 'Вспомни снимок головы из конспекта: что на нём хорошо видно, а что почти нет? И какое ядро встречается в теле чаще всего?',
    },
    explanation: {
      de: '**Richtig sind Weichteilkontrast, funktionelle Information und der einstellbare Kontrast.** Das MRT misst Wasserstoffkerne, die im Wasser überall im Körper stecken. Wie viel Wasser ein Gewebe hat und wie schnell seine Spins relaxieren, unterscheidet sich von Gewebe zu Gewebe. Daraus entsteht der starke Weichteilkontrast. Über TR und TE wählst du, ob Protonendichte, T1 oder T2 den Kontrast bestimmt, ganz ohne Umlagern. Zusätzlich gibt es funktionelle Verfahren wie fMRI, Flussmessung oder Spektroskopie. Knochen dagegen liefert kaum Signal, dort ist das CT besser. Kohlenstoff spielt für das normale Bild keine Rolle.',
      ru: '**Верны: контраст мягких тканей, функциональная информация и настраиваемый контраст.** МРТ измеряет ядра водорода, которые входят в состав воды по всему телу. Сколько воды в ткани и как быстро релаксируют её спины, отличается от ткани к ткани. Отсюда сильный контраст мягких тканей. Через TR и TE ты выбираешь, что определяет контраст: протонная плотность, T1 или T2, и всё это без перекладывания пациента. Кроме того, есть функциональные методы: фМРТ, измерение кровотока или спектроскопия. Кость же почти не даёт сигнала, там лучше КТ. Углерод для обычного изображения роли не играет.',
    },
  },
  {
    id: 'ei-functional',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Welche dieser MRT-Informationen ist funktionell bzw. physiologisch und nicht rein anatomisch?',
      ru: 'Какая из этих МРТ-данных функциональная или физиологическая, а не чисто анатомическая?',
    },
    options: [
      { de: 'Die Geschwindigkeit des Blutes in der Aorta', ru: 'Скорость крови в аорте' },
      { de: 'Die Form des Meniskus im Knie', ru: 'Форма мениска в колене' },
      { de: 'Die Lage der Gebärmutter im Becken', ru: 'Положение матки в малом тазу' },
      { de: 'Die Größe der Hirnventrikel', ru: 'Размер желудочков мозга' },
    ],
    answer: 0,
    hint: {
      de: 'Anatomie beschreibt, wie etwas aussieht und wo es liegt. Funktion beschreibt, was gerade passiert.',
      ru: 'Анатомия описывает, как что-то выглядит и где находится. Функция описывает, что сейчас происходит.',
    },
    explanation: {
      de: '**Die Blutgeschwindigkeit ist eine funktionelle Größe.** Form, Lage und Größe beschreiben die Anatomie, also das „Wie sieht es aus?“. Eine Geschwindigkeit beschreibt dagegen einen Vorgang im lebenden Körper. Das Skript nennt genau das als Stärke: MRT liefert anatomische und funktionelle Information, zum Beispiel Blutfluss, fMRI für aktive Hirnareale und Spektroskopie für Stoffwechselprodukte. Wie die Flussmessung technisch funktioniert, lernst du im Kapitel zu den klinischen Anwendungen: Bewegte Spins sammeln eine Phase, die proportional zur Geschwindigkeit ist.',
      ru: '**Скорость крови это функциональная величина.** Форма, положение и размер описывают анатомию, то есть «как это выглядит?». Скорость же описывает процесс в живом организме. В конспекте именно это названо сильной стороной: МРТ даёт анатомическую и функциональную информацию, например кровоток, фМРТ для активных зон мозга и спектроскопию для продуктов обмена веществ. Как технически устроено измерение кровотока, ты узнаешь в главе о клинических применениях: движущиеся спины набирают фазу, пропорциональную скорости.',
    },
  },
  {
    id: 'ei-indications',
    kind: 'multi',
    difficulty: 1,
    prompt: {
      de: 'Welche Einsatzgebiete des MRT werden in der Vorlesung als typisch genannt oder gezeigt? (Mehrfachauswahl)',
      ru: 'Какие области применения МРТ названы или показаны в лекции как типичные? (несколько вариантов)',
    },
    options: [
      { de: 'Zerebrale Diagnostik (Gehirn)', ru: 'Диагностика головного мозга' },
      { de: 'Kardiologie (Herz)', ru: 'Кардиология (сердце)' },
      { de: 'Gelenke, zum Beispiel das Knie', ru: 'Суставы, например колено' },
      { de: 'Becken und Schwangerschaft (Fetus, Plazenta)', ru: 'Малый таз и беременность (плод, плацента)' },
      {
        de: 'Erstabklärung eines einfachen Knochenbruchs, weil Knochen im MRT am hellsten ist',
        ru: 'Первичная диагностика простого перелома, потому что кость на МРТ самая яркая',
      },
    ],
    answers: [0, 1, 2, 3],
    hint: {
      de: 'Alle sinnvollen Antworten haben eins gemeinsam: Es geht um Weichteile. Welche Option widerspricht dem Skript?',
      ru: 'У всех разумных ответов есть общее: речь о мягких тканях. Какой вариант противоречит конспекту?',
    },
    explanation: {
      de: '**Gehirn, Herz, Gelenke sowie Becken und Schwangerschaft sind typische Indikationen.** Das Skript nennt zerebrale Diagnostik und Kardiologie ausdrücklich und zeigt Bilder vom Knie, vom Becken und von Fetus und Plazenta. Der rote Faden ist immer der Weichteilkontrast: Hirngewebe, Herzmuskel, Menisken, Bänder, Gebärmutter und Plazenta unterscheiden sich im Wassergehalt und in ihren Relaxationszeiten. Knochen ist im MRT dagegen dunkel, nicht hell. Für einen einfachen Bruch ist das Röntgenbild schneller und günstiger.',
      ru: '**Мозг, сердце, суставы, а также малый таз и беременность это типичные показания.** В конспекте прямо названы диагностика мозга и кардиология, а также показаны снимки колена, малого таза, плода и плаценты. Общая нить везде одна: контраст мягких тканей. Ткань мозга, сердечная мышца, мениски, связки, матка и плацента различаются содержанием воды и временами релаксации. Кость же на МРТ тёмная, а не светлая. Для простого перелома рентген быстрее и дешевле.',
    },
  },
  {
    id: 'ei-methods-overview',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Das Behandlungsteam möchte wissen, welche Stoffwechselprodukte in einem Hirnareal in welcher Menge vorliegen. Welche MR-Methode aus dem Überblick passt?',
      ru: 'Лечащей команде нужно узнать, какие продукты обмена веществ и в каком количестве есть в определённой зоне мозга. Какой МР-метод из обзора подходит?',
    },
    options: [
      { de: 'MR-Spektroskopie', ru: 'МР-спектроскопия' },
      { de: 'Funktionelle MRT (fMRI)', ru: 'Функциональная МРТ (фМРТ)' },
      { de: 'Phasenkontrast-Flussmessung', ru: 'Фазоконтрастное измерение кровотока' },
      { de: 'Diffusions-Tensor-Bildgebung (DTI)', ru: 'Диффузионно-тензорная визуализация (DTI)' },
    ],
    answer: 0,
    hint: {
      de: 'Gesucht ist die chemische Zusammensetzung. Welche Methode zerlegt das Signal in seine Frequenzanteile, wie ein Prisma das Licht?',
      ru: 'Нужен химический состав. Какой метод раскладывает сигнал на частотные составляющие, как призма раскладывает свет?',
    },
    explanation: {
      de: '**Die MR-Spektroskopie zeigt die chemische Zusammensetzung.** Protonen in verschiedenen Molekülen spüren ein minimal unterschiedliches Magnetfeld, weil die Elektronenhülle sie leicht abschirmt. Dadurch präzedieren sie mit leicht verschiedenen Frequenzen. Das Spektrum zeigt für jedes Molekül eine eigene Spitze, ähnlich wie ein Klavierakkord in einzelne Töne zerfällt. fMRI zeigt dagegen, welche Hirnareale gerade aktiv sind. Die Flussmessung liefert Geschwindigkeiten, DTI die Richtung der Wasserdiffusion und damit Faserbahnen. Alle vier nennt das Skript als Beispiele, dass das MRT mehr kann als Anatomie.',
      ru: '**МР-спектроскопия показывает химический состав.** Протоны в разных молекулах ощущают чуть-чуть разное магнитное поле, потому что электронная оболочка немного их экранирует. Из-за этого они прецессируют с немного разными частотами. В спектре у каждой молекулы свой пик, примерно как аккорд на фортепиано раскладывается на отдельные ноты. фМРТ, напротив, показывает, какие зоны мозга сейчас активны. Измерение кровотока даёт скорости, DTI направление диффузии воды и тем самым проводящие пути. Все четыре метода конспект приводит как примеры того, что МРТ умеет больше, чем анатомию.',
    },
  },
  {
    id: 'ei-learning-goals',
    kind: 'multi',
    difficulty: 1,
    prompt: {
      de: 'Welche Punkte gehören zu den Lernzielen der MRT-Vorlesung? (Mehrfachauswahl)',
      ru: 'Какие пункты входят в учебные цели лекции по МРТ? (несколько вариантов)',
    },
    options: [
      { de: 'Die physikalischen Prinzipien des MRT erklären', ru: 'Объяснять физические принципы МРТ' },
      { de: 'Erklären, wie aus den gemessenen Signalen ein Bild entsteht', ru: 'Объяснять, как из измеренных сигналов получается изображение' },
      { de: 'Die wesentlichen technischen Komponenten inklusive ihrer Funktion beschreiben', ru: 'Описывать основные технические компоненты вместе с их функцией' },
      { de: 'Typische Anwendungen und Indikationen nennen', ru: 'Называть типичные применения и показания' },
      { de: 'Selbständig radiologische Befunde stellen und unterschreiben', ru: 'Самостоятельно ставить и подписывать радиологические заключения' },
    ],
    answers: [0, 1, 2, 3],
    hint: {
      de: 'Es sind genau vier Lernziele. Sie folgen dem Weg vom Spin über das Signal und das Gerät bis zur Klinik.',
      ru: 'Учебных целей ровно четыре. Они идут по пути от спина через сигнал и аппарат до клиники.',
    },
    explanation: {
      de: '**Die vier Lernziele sind Physik, Bilderzeugung, Technik und Anwendungen.** Du sollst erklären können, warum Protonen im Magnetfeld ein Signal liefern, wie aus diesem Signal über Gradienten und Fourier-Transformation ein Bild wird, welche Komponenten ein Scanner braucht und was sie tun, und wofür man das MRT in der Klinik einsetzt. Genau diese vier Bausteine tauchen auch in den Recap-Fragen am Ende des Skripts auf. Befunde zu stellen ist Aufgabe der Radiologie und kein Lernziel dieser Vorlesung.',
      ru: '**Четыре учебные цели: физика, получение изображения, техника и применения.** Важно уметь объяснить, почему протоны в магнитном поле дают сигнал, как из этого сигнала с помощью градиентов и преобразования Фурье получается изображение, какие компоненты нужны томографу и что они делают, и для чего МРТ используют в клинике. Именно эти четыре блока встречаются и в вопросах для повторения в конце конспекта. Ставить заключения это задача радиологии, а не учебная цель этой лекции.',
    },
  },
  {
    id: 'ei-modality-principles',
    kind: 'multi',
    difficulty: 1,
    prompt: {
      de: 'Welche Zuordnungen von Verfahren und Messprinzip stimmen? (Mehrfachauswahl)',
      ru: 'Какие сопоставления метода и принципа измерения верны? (несколько вариантов)',
    },
    options: [
      { de: 'CT: Gewebe schwächt Röntgenstrahlen unterschiedlich stark, daraus entstehen Schnittbilder der Dichte.', ru: 'КТ: ткани по-разному ослабляют рентгеновские лучи, из этого получаются срезы плотности.' },
      { de: 'Ultraschall: Schallwellen werden an Grenzflächen reflektiert, die Echos ergeben das Bild.', ru: 'УЗИ: звуковые волны отражаются на границах тканей, эхо образует изображение.' },
      { de: 'PET: Ein schwach radioaktiver Tracer reichert sich an und zeigt den Stoffwechsel.', ru: 'ПЭТ: слабо радиоактивный индикатор накапливается и показывает обмен веществ.' },
      { de: 'MRT: Wasserstoffkerne im starken Magnetfeld werden mit Radiowellen angeregt und senden ein Signal zurück.', ru: 'МРТ: ядра водорода в сильном магнитном поле возбуждаются радиоволнами и посылают сигнал обратно.' },
      { de: 'MRT: Das Bild entsteht aus Röntgenstrahlen, die das Magnetfeld bündelt.', ru: 'МРТ: изображение получается из рентгеновских лучей, которые фокусирует магнитное поле.' },
    ],
    answers: [0, 1, 2, 3],
    hint: {
      de: 'Frag dich bei jedem Verfahren: Was geht in den Körper hinein, und was kommt heraus? Strahlung, Schall, Tracer oder Radiowellen?',
      ru: 'Для каждого метода спроси себя: что входит в тело и что выходит наружу? Излучение, звук, индикатор или радиоволны?',
    },
    explanation: {
      de: '**Jedes Verfahren misst eine andere Eigenschaft des Gewebes.** Röntgen und CT messen die Schwächung von Röntgenstrahlen, also im Kern die Dichte. Ultraschall misst Echos von Schallwellen an Grenzflächen. Die PET misst, wo sich ein radioaktiv markierter Stoff anreichert, also den Stoffwechsel. Das MRT arbeitet ganz ohne Röntgenstrahlen: Wasserstoffkerne im Magnetfeld werden mit Radiowellen angeregt und senden danach selbst ein Radiosignal aus. Deshalb sieht das MRT vor allem Wasser und Fett, also Weichteile.',
      ru: '**Каждый метод измеряет своё свойство ткани.** Рентген и КТ измеряют ослабление рентгеновских лучей, то есть по сути плотность. УЗИ измеряет эхо звуковых волн на границах тканей. ПЭТ измеряет, где накапливается радиоактивно меченое вещество, то есть обмен веществ. МРТ работает совсем без рентгеновских лучей: ядра водорода в магнитном поле возбуждаются радиоволнами и затем сами посылают радиосигнал. Поэтому МРТ видит прежде всего воду и жир, то есть мягкие ткани.',
    },
  },
  {
    id: 'ei-water-contrast',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Warum unterscheidet das MRT Weichteile wie graue und weiße Hirnsubstanz so viel besser als die CT?',
      ru: 'Почему МРТ различает мягкие ткани, например серое и белое вещество мозга, намного лучше, чем КТ?',
    },
    options: [
      {
        de: 'Die Gewebe haben fast dieselbe Dichte, unterscheiden sich aber im Wassergehalt und darin, wie schnell ihre Protonen relaxieren (T1, T2).',
        ru: 'Ткани почти одинаковы по плотности, но различаются содержанием воды и тем, как быстро релаксируют их протоны (T1, T2).',
      },
      { de: 'Das MRT hat immer eine viel feinere Pixelgröße als die CT.', ru: 'У МРТ всегда намного меньше размер пикселя, чем у КТ.' },
      { de: 'Weiße Substanz enthält Eisen und leuchtet deshalb im Magnetfeld.', ru: 'Белое вещество содержит железо и поэтому светится в магнитном поле.' },
      { de: 'Im MRT wird grundsätzlich Kontrastmittel gegeben, ohne das wären alle Weichteile gleich grau.', ru: 'При МРТ всегда вводят контрастное вещество, без него все мягкие ткани были бы одинаково серыми.' },
    ],
    answer: 0,
    hint: {
      de: 'Die CT sieht Dichte. Worauf hört das MRT, und wie unterschiedlich ist das in verschiedenen Weichteilen?',
      ru: 'КТ видит плотность. Что «слушает» МРТ, и насколько это различается в разных мягких тканях?',
    },
    explanation: {
      de: '**Der Weichteilkontrast kommt aus Wassergehalt und Relaxation.** Im Skript steht: Wasser ist im ganzen Körper verteilt, aber seine Konzentration hängt vom Gewebe ab. Dazu kommt, dass die Protonen je nach Umgebung unterschiedlich schnell in die Ruhe zurückkehren. Das beschreiben die Zeiten T1 und T2. Graue und weiße Substanz haben fast die gleiche Dichte, in der CT liegen sie nur etwa 10 HU auseinander. Im MRT unterscheiden sie sich in T1 und T2 deutlich, und mit TR und TE wählst du, welcher Unterschied sichtbar wird. Kontrastmittel ist oft hilfreich, aber für den Grundkontrast nicht nötig.',
      ru: '**Контраст мягких тканей возникает из содержания воды и релаксации.** В конспекте сказано: вода распределена по всему телу, но её концентрация зависит от ткани. К этому добавляется то, что протоны в зависимости от окружения с разной скоростью возвращаются в покой. Это описывают времена T1 и T2. Серое и белое вещество почти одинаковы по плотности, на КТ они различаются всего примерно на 10 HU. На МРТ они заметно различаются по T1 и T2, а через TR и TE ты выбираешь, какая разница станет видна. Контрастное вещество часто полезно, но для основного контраста оно не нужно.',
    },
  },
  {
    id: 'ei-projectile',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Warum darf niemand eine Schere oder eine Sauerstoffflasche aus Stahl in den MRT-Raum mitnehmen, auch wenn gerade gar nicht gemessen wird?',
      ru: 'Почему никто не должен вносить в кабинет МРТ ножницы или стальной кислородный баллон, даже если сейчас никакого измерения нет?',
    },
    options: [
      {
        de: 'Der supraleitende Magnet ist praktisch immer eingeschaltet. Er zieht Gegenstände aus Eisen und Stahl mit großer Kraft an, sie können zum gefährlichen Geschoss werden.',
        ru: 'Сверхпроводящий магнит практически всегда включён. Он с большой силой притягивает предметы из железа и стали, и они могут стать опасным снарядом.',
      },
      { de: 'Metall erzeugt im Raum ionisierende Strahlung.', ru: 'Металл создаёт в помещении ионизирующее излучение.' },
      { de: 'Metall stört nur das Bild, eine Gefahr besteht nicht.', ru: 'Металл только портит изображение, никакой опасности нет.' },
      { de: 'Der Magnet wird nur während der Messung eingeschaltet, dann aber besonders stark.', ru: 'Магнит включают только во время измерения, но тогда особенно сильно.' },
    ],
    answer: 0,
    hint: {
      de: 'Ein supraleitender Magnet ist wie eine Schleife, in der der Strom immer weiter fließt. Wann ist das Feld also da?',
      ru: 'Сверхпроводящий магнит похож на петлю, в которой ток течёт непрерывно. Когда же поле присутствует?',
    },
    explanation: {
      de: '**Das Feld ist immer da, und es zieht Eisen an.** Klinische Scanner haben 1,5 T oder 3 T, das ist zehntausendfach stärker als das Erdmagnetfeld. Der Strom in der supraleitenden Spule fließt ohne Widerstand weiter, der Magnet bleibt also auch nachts und am Wochenende an. Gegenstände aus ferromagnetischem Metall werden in Richtung Röhre gerissen und können Menschen schwer verletzen. Darum gibt es Zugangskontrollen, Fragebögen und MR-sichere Geräte. Metall im Bild verursacht außerdem Artefakte, aber das ist das kleinere Problem.',
      ru: '**Поле есть всегда, и оно притягивает железо.** Клинические томографы работают при 1,5 Тл или 3 Тл, это в десятки тысяч раз сильнее магнитного поля Земли. Ток в сверхпроводящей катушке течёт без сопротивления, поэтому магнит остаётся включённым и ночью, и в выходные. Предметы из ферромагнитного металла втягиваются в сторону трубы и могут тяжело ранить людей. Поэтому есть контроль доступа, анкеты и МР-безопасное оборудование. Кроме того, металл вызывает артефакты на изображении, но это меньшая проблема.',
    },
  },
  {
    id: 'ei-safety',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Aussagen zur Sicherheit im MRT stimmen? (Mehrfachauswahl)',
      ru: 'Какие утверждения о безопасности при МРТ верны? (несколько вариантов)',
    },
    options: [
      { de: 'Das MRT arbeitet ohne ionisierende Strahlung.', ru: 'МРТ работает без ионизирующего излучения.' },
      { de: 'Die schnell geschalteten Gradientenspulen sind sehr laut, deshalb bekommt man einen Gehörschutz.', ru: 'Быстро переключаемые градиентные катушки очень громкие, поэтому выдают защиту для ушей.' },
      { de: 'Implantate wie Herzschrittmacher müssen vorher geprüft werden, manche sind nur unter Bedingungen erlaubt.', ru: 'Импланты, например кардиостимуляторы, нужно заранее проверить, некоторые допустимы только при определённых условиях.' },
      { de: 'Die Radiowellen können Gewebe leicht erwärmen, dafür gibt es Grenzwerte (SAR).', ru: 'Радиоволны могут слегка нагревать ткань, для этого есть предельные значения (SAR).' },
      { de: 'Eine MRT-Untersuchung belastet den Körper mit einer ähnlichen Strahlendosis wie eine CT.', ru: 'Обследование МРТ даёт телу примерно такую же дозу облучения, как КТ.' },
    ],
    answers: [0, 1, 2, 3],
    hint: {
      de: 'Denk an die drei Felder im Scanner: das statische Feld B₀, die Gradienten und die Radiowellen. Welches Risiko gehört zu welchem?',
      ru: 'Вспомни три поля в томографе: статическое поле B₀, градиенты и радиоволны. Какой риск относится к какому?',
    },
    explanation: {
      de: '**Das MRT ist strahlungsfrei, hat aber eigene Risiken.** Die Radiowellen haben viel zu wenig Energie, um Atome zu ionisieren, deshalb gibt es keine Strahlendosis wie bei Röntgen oder CT. Die Gradientenspulen werden schnell umgeschaltet. Im starken Feld wirken dabei Kräfte auf die Spulen, die wie ein Lautsprecher klopfen und brummen, das kann über 100 dB laut werden. Das statische Feld zieht Eisen an und kann Implantate stören. Die Radiowellen geben Energie ab, die als Wärme im Gewebe ankommt. Diese spezifische Absorptionsrate (SAR) wird überwacht.',
      ru: '**МРТ не связана с облучением, но у неё есть свои риски.** У радиоволн слишком мало энергии, чтобы ионизировать атомы, поэтому дозы облучения, как при рентгене или КТ, нет. Градиентные катушки быстро переключаются. В сильном поле на катушки действуют силы, и они стучат и гудят, как громкоговоритель, громкость может превышать 100 дБ. Статическое поле притягивает железо и может нарушить работу имплантов. Радиоволны передают энергию, которая превращается в тепло в ткани. Эту удельную мощность поглощения (SAR) контролируют.',
    },
  },
  {
    id: 'ei-five-steps',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Welche Reihenfolge beschreibt den Weg vom Proton zum MRT-Bild richtig?',
      ru: 'Какая последовательность правильно описывает путь от протона к МРТ-изображению?',
    },
    options: [
      {
        de: '1. Protonen richten sich im Feld B₀ aus. 2. Ein HF-Puls kippt die Magnetisierung. 3. Gradienten geben jedem Ort eine eigene Frequenz und Phase. 4. Die Spule empfängt das Signal. 5. Die Fourier-Transformation macht daraus das Bild.',
        ru: '1. Протоны выстраиваются в поле B₀. 2. РЧ-импульс отклоняет намагниченность. 3. Градиенты дают каждому месту свою частоту и фазу. 4. Катушка принимает сигнал. 5. Преобразование Фурье превращает его в изображение.',
      },
      {
        de: '1. Ein HF-Puls erzeugt das Magnetfeld. 2. Protonen richten sich aus. 3. Die Spule empfängt das Signal. 4. Gradienten färben das Bild ein. 5. Röntgenstrahlen liefern den Kontrast.',
        ru: '1. РЧ-импульс создаёт магнитное поле. 2. Протоны выстраиваются. 3. Катушка принимает сигнал. 4. Градиенты раскрашивают изображение. 5. Рентгеновские лучи дают контраст.',
      },
      {
        de: '1. Die Fourier-Transformation berechnet die Magnetisierung. 2. Protonen richten sich aus. 3. Ein HF-Puls kippt sie. 4. Gradienten werden abgeschaltet. 5. Die Spule zeigt das Bild direkt an.',
        ru: '1. Преобразование Фурье вычисляет намагниченность. 2. Протоны выстраиваются. 3. РЧ-импульс отклоняет их. 4. Градиенты выключают. 5. Катушка сразу показывает изображение.',
      },
      {
        de: '1. Protonen richten sich aus. 2. Die Spule empfängt ohne Anregung ein Signal. 3. Ein HF-Puls löscht das Signal. 4. Gradienten kippen die Magnetisierung. 5. Das Bild wird aus Ultraschall berechnet.',
        ru: '1. Протоны выстраиваются. 2. Катушка принимает сигнал без возбуждения. 3. РЧ-импульс стирает сигнал. 4. Градиенты отклоняют намагниченность. 5. Изображение рассчитывают по ультразвуку.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Ohne Ausrichtung keine Magnetisierung, ohne Kippen kein messbares Signal, und erst ganz am Ende rechnet der Computer.',
      ru: 'Без выстраивания нет намагниченности, без отклонения нет измеряемого сигнала, а компьютер считает только в самом конце.',
    },
    explanation: {
      de: '**Ausrichten, kippen, kodieren, empfangen, rechnen.** Im Feld B₀ entsteht aus vielen Protonen eine kleine Netto-Magnetisierung entlang des Feldes. Ein HF-Puls auf der Larmor-Frequenz kippt sie in die Querebene. Dort kreist sie und induziert in der Empfangsspule eine Spannung, das Signal. Die Gradienten sorgen dafür, dass jeder Ort mit seiner eigenen Frequenz und Phase sendet, wie Läufer im Stadion auf verschiedenen Bahnen. Aus dem Signalgemisch rechnet die Fourier-Transformation zurück, welcher Ort wie viel beigetragen hat. Das ist das Bild.',
      ru: '**Выстроить, отклонить, закодировать, принять, рассчитать.** В поле B₀ из множества протонов возникает небольшая суммарная намагниченность вдоль поля. РЧ-импульс на ларморовой частоте отклоняет её в поперечную плоскость. Там она вращается и наводит в приёмной катушке напряжение, это и есть сигнал. Градиенты делают так, что каждое место посылает сигнал со своей частотой и фазой, как бегуны на разных дорожках стадиона. Из смеси сигналов преобразование Фурье вычисляет, какое место сколько внесло. Это и есть изображение.',
    },
  },
  {
    id: 'ei-input-output',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Im Skript steht kurz: „Input: Pulssequenz. Output: FID-Signal.“ Was ist damit gemeint?',
      ru: 'В конспекте коротко написано: «Вход: импульсная последовательность. Выход: сигнал FID». Что это значит?',
    },
    options: [
      {
        de: 'Der Scanner schickt eine geplante Folge von HF-Pulsen (und Gradienten) in den Körper. Zurück kommt das abklingende Signal der kreisenden Magnetisierung, der Free Induction Decay.',
        ru: 'Томограф посылает в тело запланированную последовательность РЧ-импульсов (и градиентов). Обратно приходит затухающий сигнал вращающейся намагниченности, спад свободной индукции.',
      },
      { de: 'Der Scanner schickt Röntgenpulse, und der FID ist die Strahlung, die durch den Körper kommt.', ru: 'Томограф посылает рентгеновские импульсы, а FID это излучение, прошедшее через тело.' },
      { de: 'Input ist das fertige Bild, Output ist der Befund.', ru: 'Вход это готовое изображение, выход это заключение.' },
      { de: 'Der FID ist ein dauerhaft konstantes Signal, das nach dem Puls nicht abnimmt.', ru: 'FID это постоянный сигнал, который после импульса не уменьшается.' },
    ],
    answer: 0,
    hint: {
      de: 'FID heißt Free Induction Decay. Achte auf die Wörter „Induktion“ und „Decay“ (Abklingen).',
      ru: 'FID означает Free Induction Decay, спад свободной индукции. Обрати внимание на слова «индукция» и «спад».',
    },
    explanation: {
      de: '**Wir senden Pulse, der Körper antwortet mit einem abklingenden Radiosignal.** Die Pulssequenz ist das Programm aus HF-Pulsen, Gradienten und Wartezeiten wie TR und TE. Nach dem Puls kreist die gekippte Magnetisierung und induziert in der Spule eine Wechselspannung, wie ein Fahrraddynamo. Weil die Spins auseinanderlaufen, wird das Signal mit T2* schnell kleiner. Darum heißt es Free Induction Decay. Mit der Sequenz bestimmst du, welche Gewebeeigenschaft das Signal am stärksten prägt.',
      ru: '**Мы посылаем импульсы, тело отвечает затухающим радиосигналом.** Импульсная последовательность это программа из РЧ-импульсов, градиентов и пауз, например TR и TE. После импульса отклонённая намагниченность вращается и наводит в катушке переменное напряжение, как велосипедное динамо. Поскольку спины расходятся по фазе, сигнал быстро уменьшается с T2*. Поэтому он называется спадом свободной индукции. Последовательностью ты определяешь, какое свойство ткани сильнее всего влияет на сигнал.',
    },
  },
  {
    id: 'ei-larmor-intro',
    generate: (rng, lang) => {
      const b0 = pick(rng, [0.5, 1, 1.5, 3, 7]);
      const f = GAMMA_BAR_INTRO * b0;
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'ei-larmor-intro',
        difficulty: 1,
        prompt: t(
          `Ein MRT-Gerät arbeitet mit $B_0 = ${n(b0, 2, lang)}$ T. Auf welcher Frequenz „funkt“ es? Nutze $f = 42{,}58\\ \\text{MHz/T} \\cdot B_0$.`,
          `Томограф работает при $B_0 = ${n(b0, 2, lang)}$ Тл. На какой частоте он «вещает»? Используй $f = 42{,}58\\ \\text{МГц/Тл} \\cdot B_0$.`,
        ),
        answer: f,
        tolerance: 0.01,
        unit: t('MHz', 'МГц'),
        hint: t(
          'Pro Tesla kommen 42,58 MHz dazu. Multipliziere einfach mit der Feldstärke.',
          'На каждый тесла приходится 42,58 МГц. Просто умножь на индукцию поля.',
        ),
        explanation: t(
          `**Die Protonen kreisen mit ${n(f, 2, lang)} MHz.** Warum: Jeder Wasserstoffkern kreist im Feld wie ein Kreisel, und die Kreiselfrequenz wächst proportional mit dem Feld. Die Zahl 42,58 MHz/T heißt gyromagnetisches Verhältnis $\\bar\\gamma$, sie gehört fest zum Proton. Rechenweg: $f = 42{,}58\\,\\text{MHz/T} \\cdot ${n(b0, 2, lang)}\\,\\text{T} = ${n(f, 2, lang)}$ MHz. Das liegt im Bereich von Radiosendern. Achtung: Im Skript steht ω mit diesem Zahlenwert, gemeint ist aber die Frequenz f.`,
          `**Протоны вращаются с частотой ${n(f, 2, lang)} МГц.** Почему: каждое ядро водорода вращается в поле, как волчок, и частота вращения растёт пропорционально полю. Число 42,58 МГц/Тл называют гиромагнитным отношением $\\bar\\gamma$, оно постоянно для протона. Расчёт: $f = 42{,}58\\,\\text{МГц/Тл} \\cdot ${n(b0, 2, lang)}\\,\\text{Тл} = ${n(f, 2, lang)}$ МГц. Это диапазон радиостанций. Внимание: в конспекте с этим числом стоит ω, но имеется в виду частота f.`,
        ),
      };
    },
  },
  {
    id: 'ei-hydrogen-count',
    generate: (rng, lang) => {
      const volume = pick(rng, [0.5, 1, 2, 5, 10, 20]);
      const moles = volume / WATER_MOLAR_MASS;
      const nuclei = moles * AVOGADRO * 2;
      const answer = nuclei / 1e22;
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'ei-hydrogen-count',
        difficulty: 2,
        prompt: t(
          `Wie viele Wasserstoffkerne stecken ungefähr in ${n(volume, 1, lang)} ml Wasser? Gib das Ergebnis in Einheiten von $10^{22}$ an. Werte: Dichte 1 g/ml, Molmasse 18 g/mol, $N_A = 6{,}022 \\cdot 10^{23}$/mol.`,
          `Сколько примерно ядер водорода содержится в ${n(volume, 1, lang)} мл воды? Дай ответ в единицах $10^{22}$. Данные: плотность 1 г/мл, молярная масса 18 г/моль, $N_A = 6{,}022 \\cdot 10^{23}$/моль.`,
        ),
        answer,
        tolerance: 0.03,
        unit: t('· 10²² Kerne', '· 10²² ядер'),
        hint: t(
          'Erst die Masse, dann die Stoffmenge, dann die Zahl der Moleküle. Jedes Wassermolekül H₂O hat zwei Wasserstoffkerne.',
          'Сначала масса, потом количество вещества, потом число молекул. В каждой молекуле воды H₂O два ядра водорода.',
        ),
        explanation: t(
          `**Es sind etwa ${n(answer, 1, lang)} · 10²² Wasserstoffkerne.** Warum das zählt: Das MRT-Signal kommt von diesen Protonen. Nur ein winziger Teil, einige Millionstel, bildet bei 1,5 T den Überschuss, der das Signal liefert. Weil es aber so unvorstellbar viele sind, reicht das trotzdem. Rechenweg: $m = ${n(volume, 1, lang)}$ g, $n = m / M = ${n(volume, 1, lang)} / 18 \\approx ${n(moles, 3, lang)}$ mol. Moleküle: $${n(moles, 3, lang)} \\cdot 6{,}022 \\cdot 10^{23} \\approx ${n(moles * AVOGADRO / 1e22, 2, lang)} \\cdot 10^{22}$. Mal zwei Kerne pro Molekül ergibt rund $${n(answer, 2, lang)} \\cdot 10^{22}$.`,
          `**Это примерно ${n(answer, 1, lang)} · 10²² ядер водорода.** Почему это важно: сигнал МРТ идёт именно от этих протонов. Лишь крошечная часть, несколько миллионных долей, при 1,5 Тл образует избыток, который даёт сигнал. Но поскольку их невообразимо много, этого всё равно хватает. Расчёт: $m = ${n(volume, 1, lang)}$ г, $n = m / M = ${n(volume, 1, lang)} / 18 \\approx ${n(moles, 3, lang)}$ моль. Молекулы: $${n(moles, 3, lang)} \\cdot 6{,}022 \\cdot 10^{23} \\approx ${n(moles * AVOGADRO / 1e22, 2, lang)} \\cdot 10^{22}$. Умножив на два ядра на молекулу, получаем около $${n(answer, 2, lang)} \\cdot 10^{22}$.`,
        ),
      };
    },
  },
];
