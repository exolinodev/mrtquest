import type { QuestionSource } from './types';

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
];
