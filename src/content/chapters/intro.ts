import type { Loc } from '../../i18n/format';
import type { Chapter } from './types';

/** Eröffnung des Kapitels: Gliederung und Lernziele des Skripts, damit man weiß, wohin die Reise geht. */
export const einfuehrungIntro: Chapter = {
  de: [
    {
      title: 'Worum es in diesem Kapitel geht',
      blocks: [
        {
          type: 'hook',
          text: 'Die MRT ist eines der eindrucksvollsten Werkzeuge der Medizin: Sie zeigt Gehirn, Gelenke, Herz und sogar ein ungeborenes Kind, ohne einen einzigen Röntgenstrahl. Die Physik dahinter wirkt zuerst wie ein Berg. Dieser Lernpfad bringt dich Schritt für Schritt nach oben, genau in der Reihenfolge deines Vorlesungsskripts.',
        },
        {
          type: 'p',
          text: 'Das Skript ist in vier Teile gegliedert, und genau so ist auch diese App aufgebaut:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Einführung:** Wofür braucht man die MRT, und was kann sie besonders gut? (Dieses Modul)',
            '**Physikalisches Prinzip:** Warum Protonen im Magnetfeld ein Signal aussenden: Kernspin, Larmor-Frequenz, Bloch-Gleichung, HF-Puls und Relaxation.',
            '**Vom Signal zum Bild:** Wie man das Signal empfängt, jedem Ort eine eigene Frequenz gibt und mit der Fourier-Transformation ein Bild daraus rechnet. Dazu das Gerät mit seinen Komponenten.',
            '**Klinische Anwendungen:** Was man damit in der Klinik sieht und misst, von Kontrastmittel bis Traktografie.',
          ],
        },
        {
          type: 'p',
          text: 'Am Ende des Skripts steht noch ein Anhang zur **Fourier-Transformation** und die Aufgabe für **Lab 3**. Beides findest du hier als eigenes Modul und in der Prüfungsvorbereitung.',
        },
        {
          type: 'analogy',
          title: 'Eine Bergtour mit Karte',
          text: 'Im Skript steht neben den Kontrollfragen ein Berg mit einem roten Weg und zwei Fragezeichen. Genau so fühlt sich das Thema an: Von unten sieht der Gipfel weit weg aus. Mit einer Karte, festen Etappen und Pausen an den Aussichtspunkten kommst du aber sicher hoch. Die Module sind die Etappen, die Merksätze sind die Aussichtspunkte.',
        },
        {
          type: 'p',
          text: 'Laut Skript sollst du nach dem Kapitel vier Dinge können. Genau daran orientiert sich die Prüfung:',
        },
        {
          type: 'list',
          items: [
            'die **physikalischen Prinzipien** der MRT erklären,',
            'erklären, wie aus den gemessenen **Signalen ein Bild** entsteht,',
            'die wesentlichen **technischen Komponenten** samt Funktion beschreiben,',
            'typische **Anwendungen und Indikationen** nennen.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Prinzip, Bild, Technik, Anwendung.** Vier Lernziele, vier Teile des Skripts. Wenn du zu jedem Teil frei erzählen kannst, bist du bereit.',
        },
        {
          type: 'exam',
          question: 'Welche Vorteile hat die MRT gegenüber Röntgen und CT?',
          answer: 'Die MRT arbeitet ohne ionisierende Strahlung, nur mit Magnetfeld und Radiowellen. Sie hat einen sehr guten Weichteilkontrast, weil sie das Signal der Protonen in Wasser und Fett misst, und dieser Kontrast lässt sich über die Messparameter einstellen. Neben der Anatomie liefert sie auch funktionelle Informationen wie Blutfluss, Diffusion oder Stoffwechsel.',
          full: 'Nenne auch die Grenzen: Knochen erscheint dunkel, die Messung dauert länger, und Metallimplantate sowie Herzschrittmacher erfordern besondere Vorsicht.',
          sim: 'applications/cases',
        },
      ],
    },
  ],
  ru: [
    {
      title: 'О чём эта глава',
      blocks: [
        {
          type: 'hook',
          text: 'МРТ один из самых впечатляющих инструментов медицины: она показывает мозг, суставы, сердце и даже ещё не рождённого ребёнка без единого рентгеновского луча. Физика за ней сначала кажется горой. Этот учебный путь шаг за шагом ведёт тебя наверх, точно в порядке твоего лекционного конспекта.',
        },
        {
          type: 'p',
          text: 'Конспект состоит из четырёх частей, и это приложение устроено точно так же:',
        },
        {
          type: 'list',
          ordered: true,
          items: [
            '**Введение:** зачем нужна МРТ и что она умеет особенно хорошо? (Этот модуль)',
            '**Физический принцип:** почему протоны в магнитном поле излучают сигнал: ядерный спин, частота Лармора, уравнение Блоха, РЧ-импульс и релаксация.',
            '**От сигнала к изображению:** как принять сигнал, дать каждой точке свою частоту и рассчитать изображение преобразованием Фурье. И сам аппарат с его компонентами.',
            '**Клиническое применение:** что с этим видят и измеряют в клинике, от контрастного вещества до трактографии.',
          ],
        },
        {
          type: 'p',
          text: 'В конце конспекта есть приложение о **преобразовании Фурье** и задание для **лабораторной 3**. И то и другое ты найдёшь здесь в отдельном модуле и в подготовке к экзамену.',
        },
        {
          type: 'analogy',
          title: 'Поход в горы с картой',
          text: 'В конспекте рядом с контрольными вопросами нарисована гора с красной тропой и двумя вопросительными знаками. Именно так ощущается эта тема: снизу вершина кажется далёкой. Но с картой, понятными этапами и остановками на смотровых площадках ты уверенно поднимешься. Модули это этапы, а правила для запоминания это смотровые площадки.',
        },
        {
          type: 'p',
          text: 'По конспекту после этой главы ты должен уметь четыре вещи. Именно на них ориентируется экзамен:',
        },
        {
          type: 'list',
          items: [
            'объяснять **физические принципы** МРТ,',
            'объяснять, как из измеренных **сигналов получается изображение**,',
            'описывать основные **технические компоненты** и их функцию,',
            'называть типичные **применения и показания**.',
          ],
        },
        {
          type: 'mnemonic',
          text: '**Принцип, изображение, техника, применение.** Четыре цели, четыре части конспекта. Если можешь свободно рассказать о каждой части, ты готов к экзамену.',
        },
        {
          type: 'exam',
          question: 'Какие преимущества у МРТ по сравнению с рентгеном и КТ?',
          answer: 'МРТ работает без ионизирующего излучения, только с магнитным полем и радиоволнами. У неё очень хороший контраст мягких тканей, потому что она измеряет сигнал протонов в воде и жире, и этот контраст можно настраивать параметрами измерения. Кроме анатомии, она даёт и функциональную информацию: кровоток, диффузию или обмен веществ.',
          full: 'Назови и ограничения: кость выглядит тёмной, измерение длится дольше, а металлические импланты и кардиостимуляторы требуют особой осторожности.',
          sim: 'applications/cases',
        },
      ],
    },
  ],
};

/** Einstiege für Kapitel, die aus Abschnitten früherer Module zusammengesetzt sind. */
export const BILD_HOOK: Loc = {
  de: 'Im physikalischen Prinzip hast du gelernt, dass die Protonen nach dem HF-Puls ein Signal aussenden. Aber dieses Signal ist zunächst nur ein einziges Summen aus dem ganzen Körper. Dieses Modul folgt dem Skript Schritt für Schritt: Wie empfängt man das Signal, wie bekommt jeder Ort seine eigene Frequenz, welches Gerät braucht man dafür, und wie rechnet man mit der Fourier-Transformation daraus ein Bild?',
  ru: 'В физическом принципе ты узнал, что после РЧ-импульса протоны излучают сигнал. Но сначала это лишь один общий гул от всего тела. Этот модуль идёт по конспекту шаг за шагом: как принимают сигнал, как каждая точка получает свою частоту, какой аппарат для этого нужен и как с помощью преобразования Фурье из этого рассчитывают изображение?',
};

export const ANWENDUNGEN_HOOK: Loc = {
  de: 'Jetzt kommt der Teil, für den sich die ganze Physik lohnt. Das Skript zeigt eine Reihe klinischer Bilder und Messverfahren. Für die Prüfung musst du keine Diagnosen stellen. Du solltest aber zu jeder Anwendung sagen können, **was man sieht** und **welche Physik dahintersteckt**.',
  ru: 'Теперь та часть, ради которой стоит изучать всю физику. В конспекте показан ряд клинических изображений и методов измерения. Ставить диагнозы на экзамене не нужно. Но к каждому применению ты должен уметь сказать, **что видно** и **какая физика за этим стоит**.',
};
