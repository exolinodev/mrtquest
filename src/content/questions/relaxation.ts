import { TISSUES, type TissueId } from '../../physics/constants';
import { mxyDecay, mzAfter90 } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

const tissuePool: TissueId[] = ['wm', 'gm', 'fat', 'muscle', 'liver', 'csf'];

export const relaxationQuestions: QuestionSource[] = [
  {
    id: 'rx-mz',
    generate: (rng, lang) => {
      const tid = pick(
        rng,
        tissuePool.filter((x) => x !== 'csf'),
      );
      const field = pick(rng, [1.5, 3] as const);
      const p = TISSUES[tid].params[field];
      const time = pick(rng, [200, 300, 500, 800, 1000]);
      const t = tl(lang);
      const label = TISSUES[tid].label[lang];
      const pct = n(100 * mzAfter90(time, p.t1), 1, lang);
      return {
        kind: 'numeric',
        id: 'rx-mz',
        difficulty: 1,
        prompt: t(
          `${label} hat bei ${n(field, 2, lang)} T ein T1 von ${p.t1} ms. Wie viel Prozent von $M_0$ hat sich ${time} ms nach einem 90°-Puls in z-Richtung erholt?`,
          `${label} при ${n(field, 2, lang)} Тл имеет T1 = ${p.t1} мс. Сколько процентов $M_0$ восстановилось вдоль оси z через ${time} мс после 90°-импульса?`,
        ),
        answer: 100 * mzAfter90(time, p.t1),
        tolerance: 0.02,
        unit: '%',
        hint: t(
          'Direkt nach dem 90°-Puls ist $M_z = 0$. Danach wächst es wieder an, erst schnell, dann immer langsamer: $M_z(t) = M_0\\,(1 - e^{-t/T_1})$.',
          'Сразу после 90°-импульса $M_z = 0$. Затем она снова растёт, сначала быстро, потом всё медленнее: $M_z(t) = M_0\\,(1 - e^{-t/T_1})$.',
        ),
        explanation: t(
          `**Nach ${time} ms sind ${pct} % von $M_0$ zurück.** Der 90°-Puls hat die Längsmagnetisierung auf null gekippt. Danach geben die Spins ihre Energie an die Umgebung ab und richten sich wieder entlang B₀ aus. Das läuft wie ein Akku, der sich auflädt: anfangs schnell, kurz vor voll nur noch langsam. Rechnung: $M_z = 1 - e^{-${time}/${p.t1}} = ${pct}\\,\\%$. Check: ${time} ms ist ${time < p.t1 ? 'weniger' : time === p.t1 ? 'genau' : 'mehr'} als T1 = ${p.t1} ms, also liegt das Ergebnis ${time < p.t1 ? 'unter' : time === p.t1 ? 'genau bei' : 'über'} 63 %. Merkwerte: Nach 1·T1 sind es 63 %, nach 3·T1 95 %, nach 5·T1 über 99 %.`,
          `**Через ${time} мс восстановилось ${pct} % от $M_0$.** 90°-импульс обнулил продольную намагниченность. Затем спины отдают энергию окружению и снова выстраиваются вдоль B₀. Это похоже на зарядку аккумулятора: сначала быстро, а почти у полного заряда уже медленно. Расчёт: $M_z = 1 - e^{-${time}/${p.t1}} = ${pct}\\,\\%$. Проверка: ${time} мс ${time < p.t1 ? 'меньше' : time === p.t1 ? 'ровно' : 'больше'} T1 = ${p.t1} мс, поэтому результат ${time < p.t1 ? 'ниже' : time === p.t1 ? 'ровно' : 'выше'} 63 %. Опорные значения: через 1·T1 это 63 %, через 3·T1 95 %, через 5·T1 больше 99 %.`,
        ),
      };
    },
  },
  {
    id: 'rx-mxy',
    generate: (rng, lang) => {
      const tid = pick(rng, tissuePool);
      const p = TISSUES[tid].params[1.5];
      const te = pick(rng, [15, 30, 50, 80, 100, 120]);
      const t = tl(lang);
      const label = TISSUES[tid].label[lang];
      const pct = n(100 * mxyDecay(te, p.t2), 1, lang);
      return {
        kind: 'numeric',
        id: 'rx-mxy',
        difficulty: 1,
        prompt: t(
          `${label}: T2 = ${p.t2} ms (1,5 T). Wie viel Prozent der Quermagnetisierung sind bei einem Spin-Echo mit TE = ${te} ms noch vorhanden?`,
          `${label}: T2 = ${p.t2} мс (1,5 Тл). Сколько процентов поперечной намагниченности остаётся в спин-эхо с TE = ${te} мс?`,
        ),
        answer: 100 * mxyDecay(te, p.t2),
        tolerance: 0.02,
        unit: '%',
        hint: t(
          'Die Quermagnetisierung zerfällt exponentiell: $M_{\\text{xy}}(t) = M_{\\text{xy}}(0)\\,e^{-t/T_2}$. Beim Spin-Echo zählt T2, nicht T2*.',
          'Поперечная намагниченность спадает экспоненциально: $M_{\\text{xy}}(t) = M_{\\text{xy}}(0)\\,e^{-t/T_2}$. В спин-эхо важно T2, а не T2*.',
        ),
        explanation: t(
          `**Beim Echo sind noch ${pct} % der Quermagnetisierung da.** Nach der Anregung kreiseln die Spins zuerst im Gleichtakt. Durch kleine, zufällige Wechselwirkungen untereinander geraten sie aus dem Takt, wie ein Chor ohne Dirigent. Das Gesamtsignal wird dadurch immer leiser. Rechnung: $e^{-${te}/${p.t2}} = ${pct}\\,\\%$. Check: TE = ${te} ms ist ${te < p.t2 ? 'kürzer' : te === p.t2 ? 'genau so lang wie' : 'länger'} als T2 = ${p.t2} ms, also liegt das Ergebnis ${te < p.t2 ? 'über' : te === p.t2 ? 'genau bei' : 'unter'} 37 %. Merkwert: Nach 1·T2 sind nur noch 37 % übrig.`,
          `**К моменту эха остаётся ${pct} % поперечной намагниченности.** После возбуждения спины сначала вращаются в такт. Из-за маленьких случайных взаимодействий друг с другом они сбиваются с ритма, как хор без дирижёра. Общий сигнал поэтому становится всё тише. Расчёт: $e^{-${te}/${p.t2}} = ${pct}\\,\\%$. Проверка: TE = ${te} мс ${te < p.t2 ? 'короче' : te === p.t2 ? 'ровно равно' : 'длиннее'} T2 = ${p.t2} мс, поэтому результат ${te < p.t2 ? 'выше' : te === p.t2 ? 'ровно' : 'ниже'} 37 %. Опорное значение: через 1·T2 остаётся всего 37 %.`,
        ),
      };
    },
  },
  {
    id: 'rx-time-to',
    generate: (rng, lang) => {
      const t2 = pick(rng, [40, 50, 80, 100, 180]);
      const pct = pick(rng, [50, 25, 10]);
      const time = t2 * Math.log(100 / pct);
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'rx-time-to',
        difficulty: 2,
        prompt: t(
          `Nach welcher Zeit ist die Quermagnetisierung eines Gewebes mit T2 = ${t2} ms auf ${pct} % abgefallen?`,
          `Через какое время поперечная намагниченность ткани с T2 = ${t2} мс спадает до ${pct} %?`,
        ),
        answer: time,
        tolerance: 0.02,
        unit: t('ms', 'мс'),
        hint: t(
          'Diesmal kennst du den Rest und suchst die Zeit. Setze den Anteil $p = e^{-t/T_2}$ an und hole t mit dem Logarithmus aus dem Exponenten.',
          'На этот раз ты знаешь остаток и ищешь время. Запиши долю $p = e^{-t/T_2}$ и достань t из показателя с помощью логарифма.',
        ),
        explanation: t(
          `**Nach ${n(time, 1, lang)} ms ist nur noch ${pct} % übrig.** Der Logarithmus ist die Umkehrung der e-Funktion. Damit holst du die Zeit aus dem Exponenten. Rechnung: $t = T_2 \\ln(1/p) = ${t2} \\cdot \\ln(${n(100 / pct, 2, lang)}) = ${n(time, 1, lang)}$ ms. Check: Bei 37 % wäre t genau T2. Hier sind es ${pct} %, also ${pct > 37 ? 'weniger' : 'mehr'} als T2. Für 50 % ergibt sich die „Halbwertszeit“ T2·ln 2 ≈ 0,69·T2.`,
          `**Через ${n(time, 1, lang)} мс остаётся лишь ${pct} %.** Логарифм это обратная функция к экспоненте. С его помощью ты достаёшь время из показателя. Расчёт: $t = T_2 \\ln(1/p) = ${t2} \\cdot \\ln(${n(100 / pct, 2, lang)}) = ${n(time, 1, lang)}$ мс. Проверка: при 37 % t было бы ровно T2. Здесь ${pct} %, значит, ${pct > 37 ? 'меньше' : 'больше'} T2. Для 50 % получается «период полураспада» T2·ln 2 ≈ 0,69·T2.`,
        ),
      };
    },
  },
  {
    id: 'rx-t2star',
    generate: (rng, lang) => {
      const t2 = pick(rng, [50, 80, 100]);
      const t2p = pick(rng, [20, 40, 60]);
      const t2s = 1 / (1 / t2 + 1 / t2p);
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'rx-t2star',
        difficulty: 2,
        prompt: t(
          `Ein Gewebe hat T2 = ${t2} ms. Lokale Feldinhomogenitäten tragen eine reversible Dephasierung mit $T_2' = ${t2p}$ ms bei. Wie groß ist T2*?`,
          `Ткань имеет T2 = ${t2} мс. Локальные неоднородности поля добавляют обратимую дефазировку с $T_2' = ${t2p}$ мс. Чему равно T2*?`,
        ),
        answer: t2s,
        tolerance: 0.02,
        unit: t('ms', 'мс'),
        hint: t(
          'Zwei Effekte bauen das Signal gleichzeitig ab. Nicht die Zeiten addieren sich, sondern die Raten, also die Kehrwerte.',
          'Два эффекта одновременно разрушают сигнал. Складываются не времена, а скорости, то есть обратные величины.',
        ),
        explanation: t(
          `**T2* beträgt ${n(t2s, 1, lang)} ms.** Zwei Effekte nagen gleichzeitig am Signal. Das ist wie eine Badewanne mit zwei Abflüssen: Sie läuft schneller leer als mit einem allein. Deshalb addierst du die Raten 1/T. Rechnung: $T_2^* = (1/${t2} + 1/${t2p})^{-1} = ${n(t2s, 1, lang)}$ ms. Check: T2* muss kürzer sein als beide Einzelzeiten, also unter ${Math.min(t2, t2p)} ms. Der T2'-Anteil kommt von statischen Feldunterschieden. Ein 180°-Puls kann ihn zurückdrehen, den echten T2-Anteil nicht.`,
          `**T2* равно ${n(t2s, 1, lang)} мс.** Два эффекта одновременно «съедают» сигнал. Это как ванна с двумя сливами: она опустеет быстрее, чем с одним. Поэтому складываются скорости 1/T. Расчёт: $T_2^* = (1/${t2} + 1/${t2p})^{-1} = ${n(t2s, 1, lang)}$ мс. Проверка: T2* должно быть короче обоих времён, то есть меньше ${Math.min(t2, t2p)} мс. Составляющая T2' возникает из-за статических различий поля. 180°-импульс может её обратить, а настоящую составляющую T2 нет.`,
        ),
      };
    },
  },
  {
    id: 'rx-t1-def',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Welcher Prozess bestimmt die T1-Relaxation?', ru: 'Какой процесс определяет T1-релаксацию?' },
    options: [
      {
        de: 'Energieabgabe der Spins an die molekulare Umgebung („Gitter“): Rückkehr in den thermischen Gleichgewichtszustand.',
        ru: 'Передача энергии спинов молекулярному окружению («решётке»): возврат в состояние теплового равновесия.',
      },
      {
        de: 'Dephasierung durch Wechselwirkung benachbarter Spins ohne Energieaustausch mit der Umgebung.',
        ru: 'Дефазировка из-за взаимодействия соседних спинов без обмена энергией с окружением.',
      },
      { de: 'Inhomogenitäten des statischen Magnetfeldes.', ru: 'Неоднородности статического магнитного поля.' },
      { de: 'Die Ausschaltung der Gradienten nach der Anregung.', ru: 'Выключение градиентов после возбуждения.' },
    ],
    answer: 0,
    hint: {
      de: 'Der HF-Puls hat den Spins Energie gegeben. Wohin muss diese Energie, damit M_z wieder voll wird?',
      ru: 'РЧ-импульс передал спинам энергию. Куда должна уйти эта энергия, чтобы M_z снова стала полной?',
    },
    explanation: {
      de: '**T1 ist die Spin-Gitter-Relaxation: Die Spins geben Energie an ihre Umgebung ab.** „Gitter“ meint einfach alle Moleküle drumherum. Beim Anregen haben die Spins Energie aufgenommen. Erst wenn sie diese wieder losgeworden sind, steht M_z wieder voll entlang B₀. Am besten klappt die Abgabe, wenn die Moleküle sich ungefähr im Takt der Larmor-Frequenz bewegen. Mittelgroße Moleküle wie Fett treffen diesen Takt gut, deshalb hat Fett ein kurzes T1. Reines Wasser bewegt sich zu schnell, Festkörper zu langsam, beide relaxieren langsam. Dephasierung ohne Energieaustausch wäre T2, Feldinhomogenitäten gehören zu T2*.',
      ru: '**T1 это спин-решёточная релаксация: спины отдают энергию окружению.** «Решётка» означает просто все молекулы вокруг. При возбуждении спины получили энергию. Только избавившись от неё, M_z снова полностью стоит вдоль B₀. Лучше всего передача идёт, когда молекулы движутся примерно в такт ларморовой частоте. Молекулы среднего размера, как в жире, хорошо попадают в этот такт, поэтому у жира короткое T1. Чистая вода движется слишком быстро, твёрдые тела слишком медленно, обе релаксируют медленно. Дефазировка без обмена энергией это T2, неоднородности поля относятся к T2*.',
    },
  },
  {
    id: 'rx-order',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Welche Reihenfolge der Zeitkonstanten gilt für jedes Gewebe?', ru: 'Какое соотношение временных констант выполняется для любой ткани?' },
    options: [
      { de: '$T_2^* \\le T_2 \\le T_1$', ru: '$T_2^* \\le T_2 \\le T_1$' },
      { de: '$T_1 \\le T_2 \\le T_2^*$', ru: '$T_1 \\le T_2 \\le T_2^*$' },
      { de: '$T_2 \\le T_2^* \\le T_1$', ru: '$T_2 \\le T_2^* \\le T_1$' },
      { de: 'Keine feste Reihenfolge', ru: 'Постоянного порядка нет' },
    ],
    answer: 0,
    hint: {
      de: 'Jeder zusätzliche Störeffekt macht den Signalverlust schneller, nie langsamer. Welche Zeit hat die meisten Störeffekte?',
      ru: 'Каждый дополнительный мешающий эффект ускоряет потерю сигнала, а не замедляет. У какого времени больше всего таких эффектов?',
    },
    explanation: {
      de: '**T2* ist am kürzesten, T1 am längsten.** Jeder Prozess, der Energie abgibt (T1), bringt die Spins auch aus dem Takt. Also kann die Quermagnetisierung nie langsamer verschwinden, als die Längsmagnetisierung zurückkommt: T2 ≤ T1. In reinem Wasser sind beide fast gleich. Feldinhomogenitäten kommen als weiterer Störfaktor obendrauf. Mehr Störung heißt schnellerer Zerfall, deshalb T2* ≤ T2.',
      ru: '**T2* самое короткое, T1 самое длинное.** Каждый процесс, отдающий энергию (T1), заодно сбивает спины с ритма. Значит, поперечная намагниченность не может исчезать медленнее, чем восстанавливается продольная: T2 ≤ T1. В чистой воде они почти равны. Неоднородности поля добавляются как ещё одна помеха. Больше помех значит более быстрый спад, поэтому T2* ≤ T2.',
    },
  },
  {
    id: 'rx-field',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Wie verändern sich typische Gewebe-T1-Zeiten beim Wechsel von 1,5 T auf 3 T?',
      ru: 'Как изменяются типичные времена T1 тканей при переходе с 1,5 Тл на 3 Тл?',
    },
    options: [
      {
        de: 'T1 wird länger (ca. 20–40 %), T2 bleibt ähnlich bzw. sinkt leicht.',
        ru: 'T1 удлиняется (примерно на 20–40 %), T2 остаётся близким или слегка уменьшается.',
      },
      { de: 'T1 halbiert sich, da die Larmor-Frequenz doppelt so hoch ist.', ru: 'T1 уменьшается вдвое, так как ларморова частота вдвое выше.' },
      { de: 'T1 und T2 bleiben exakt gleich, Relaxation ist feldunabhängig.', ru: 'T1 и T2 остаются точно такими же, релаксация не зависит от поля.' },
      { de: 'T2 verdoppelt sich, T1 bleibt gleich.', ru: 'T2 удваивается, T1 остаётся прежним.' },
    ],
    answer: 0,
    hint: {
      de: 'T1 braucht Molekülbewegungen im Takt der Larmor-Frequenz. Was passiert, wenn dieser Takt schneller wird?',
      ru: 'Для T1 нужны движения молекул в такт ларморовой частоте. Что будет, если этот такт ускорится?',
    },
    explanation: {
      de: '**Bei 3 T wird T1 länger, weil weniger Moleküle den schnelleren Takt treffen.** Die Larmor-Frequenz verdoppelt sich. Für die Energieabgabe brauchen die Spins Molekülbewegungen mit genau dieser Frequenz. Davon gibt es bei der höheren Frequenz weniger. Wie Tanzpartner: Wird die Musik schneller, finden weniger Leute den Takt. Die Energieabgabe wird ineffizienter, T1 wächst um etwa 20 bis 40 %. T2 ändert sich kaum. Für die Praxis heißt das: Bei T1-gewichteten Sequenzen muss man TR anpassen. Gadolinium-Kontrastmittel wirken bei 3 T relativ stärker, weil das Gewebe-T1 länger ist.',
      ru: '**При 3 Тл T1 удлиняется, потому что меньше молекул попадает в более быстрый такт.** Ларморова частота удваивается. Для передачи энергии спинам нужны движения молекул именно с этой частотой. При более высокой частоте таких движений меньше. Как с партнёрами по танцу: если музыка быстрее, меньше людей попадает в ритм. Передача энергии становится менее эффективной, T1 растёт примерно на 20–40 %. T2 почти не меняется. На практике это значит: для T1-взвешенных последовательностей нужно подстраивать TR. Гадолиниевые контрастные вещества при 3 Тл действуют относительно сильнее, потому что T1 ткани длиннее.',
    },
  },
  {
    id: 'rx-t2w',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Welche Parameterkombination eines Spin-Echos erzeugt eine T2-Wichtung?',
      ru: 'Какое сочетание параметров спин-эхо даёт T2-взвешенное изображение?',
    },
    options: [
      { de: 'Langes TR, langes TE', ru: 'Длинное TR, длинное TE' },
      { de: 'Kurzes TR, kurzes TE', ru: 'Короткое TR, короткое TE' },
      { de: 'Langes TR, kurzes TE', ru: 'Длинное TR, короткое TE' },
      { de: 'Kurzes TR, langes TE', ru: 'Короткое TR, длинное TE' },
    ],
    answer: 0,
    hint: {
      de: 'Überlege einzeln: Welcher Parameter blendet T1-Unterschiede aus? Und welcher gibt T2-Unterschieden Zeit, sich zu zeigen?',
      ru: 'Подумай по отдельности: какой параметр убирает различия T1? А какой даёт различиям T2 время проявиться?',
    },
    explanation: {
      de: '**T2-Wichtung braucht langes TR und langes TE.** TR ist die Pause zwischen zwei Anregungen. Ist sie lang (ab etwa 2000 ms), haben sich alle Gewebe vollständig erholt. T1-Unterschiede spielen dann keine Rolle mehr. TE ist die Wartezeit bis zum Echo. Ist sie lang (etwa 80 bis 120 ms), hatte jedes Gewebe Zeit, unterschiedlich viel Signal zu verlieren. Gewebe mit langem T2 wie Wasser bleiben hell. Zum Merken: kurz/kurz = T1w, lang/kurz = PDw (Protonendichte), lang/lang = T2w. Kurz/lang liefert kaum Signal und einen unklaren Mischkontrast.',
      ru: '**Для T2-взвешивания нужны длинное TR и длинное TE.** TR это пауза между двумя возбуждениями. Если она длинная (примерно от 2000 мс), все ткани полностью восстановились. Различия T1 тогда больше не играют роли. TE это время ожидания до эха. Если оно длинное (около 80–120 мс), каждая ткань успела потерять разное количество сигнала. Ткани с длинным T2, как вода, остаются светлыми. Для запоминания: короткое/короткое = T1w, длинное/короткое = PDw (протонная плотность), длинное/длинное = T2w. Короткое/длинное даёт почти нет сигнала и неясный смешанный контраст.',
    },
  },
  {
    id: 'rx-t1w-appearance',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Wie erscheinen Fett und Liquor in einem T1-gewichteten Spin-Echo?',
      ru: 'Как выглядят жир и ликвор на T1-взвешенном спин-эхо?',
    },
    options: [
      { de: 'Fett hell, Liquor dunkel', ru: 'Жир светлый, ликвор тёмный' },
      { de: 'Fett dunkel, Liquor hell', ru: 'Жир тёмный, ликвор светлый' },
      { de: 'Beide hell', ru: 'Оба светлые' },
      { de: 'Beide dunkel', ru: 'Оба тёмные' },
    ],
    answer: 0,
    hint: {
      de: 'Bei T1w ist TR kurz. Welches Gewebe erholt sich in dieser kurzen Pause am schnellsten?',
      ru: 'На T1w TR короткое. Какая ткань быстрее всех восстанавливается за эту короткую паузу?',
    },
    explanation: {
      de: '**Fett ist hell, Liquor ist dunkel.** Bei T1w ist die Pause TR kurz. Wer sich schnell erholt, hat bei der nächsten Anregung viel Magnetisierung und gibt viel Signal. Fett hat das kürzeste T1 (etwa 260 ms bei 1,5 T) und ist schon weitgehend zurück, also hell. Liquor ist fast reines Wasser mit T1 von etwa 4 s. Er hat in der kurzen Pause kaum Längsmagnetisierung zurückgewonnen, also dunkel. Wie zwei Läufer nach einem Sprint: Der Fitte ist nach einer kurzen Pause schon wieder startklar, der andere noch lange nicht.',
      ru: '**Жир светлый, ликвор тёмный.** На T1w пауза TR короткая. Кто быстро восстанавливается, тот к следующему возбуждению имеет много намагниченности и даёт много сигнала. У жира самое короткое T1 (около 260 мс при 1,5 Тл), и он уже в основном восстановился, поэтому светлый. Ликвор это почти чистая вода с T1 около 4 с. За короткую паузу он почти не восстановил продольную намагниченность, поэтому тёмный. Как два бегуна после спринта: тренированный после короткой паузы снова готов к старту, а другой ещё долго нет.',
    },
  },
  {
    id: 'rx-spin-echo',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum entsteht nach einem 180°-Puls zur Zeit TE/2 ein Spin-Echo zur Zeit TE?',
      ru: 'Почему после 180°-импульса в момент TE/2 в момент TE возникает спиновое эхо?',
    },
    options: [
      {
        de: 'Der Puls spiegelt die Phasen: Spins, die durch statische Feldunterschiede vorausgeeilt sind, liegen danach zurück und holen bis TE exakt auf.',
        ru: 'Импульс зеркально отражает фазы: спины, опередившие другие из-за статических различий поля, оказываются позади и точно догоняют к моменту TE.',
      },
      { de: 'Der 180°-Puls kehrt die T2-Relaxation um.', ru: '180°-импульс обращает T2-релаксацию вспять.' },
      {
        de: 'Der 180°-Puls erhöht die Längsmagnetisierung, die dann in die Querebene kippt.',
        ru: '180°-импульс увеличивает продольную намагниченность, которая затем отклоняется в поперечную плоскость.',
      },
      { de: 'Das Echo entsteht, weil der Gradient seine Polarität umkehrt.', ru: 'Эхо возникает потому, что градиент меняет полярность.' },
    ],
    answer: 0,
    hint: {
      de: 'Denk an Läufer im Stadion, die alle gleichzeitig umdrehen und mit gleichem Tempo zurücklaufen.',
      ru: 'Представь бегунов на стадионе, которые все одновременно разворачиваются и бегут обратно с той же скоростью.',
    },
    explanation: {
      de: '**Der 180°-Puls spiegelt die Phasen, und die Spins finden wieder zusammen.** Stell dir Läufer im Stadion vor: Schnelle und langsame starten gemeinsam und ziehen auseinander. Zur Zeit TE/2 drehen alle um und laufen mit ihrem Tempo zurück. Der Schnellste hat den weitesten Rückweg, aber er ist auch am schnellsten. Zur Zeit TE kommen alle gleichzeitig an der Startlinie an. Das ist das Echo. Das klappt nur bei statischen Unterschieden wie Feldinhomogenität, Suszeptibilität oder chemischer Verschiebung. Zufällige Spin-Spin-Wechselwirkungen ändern sich ständig und lassen sich nicht zurückdrehen. Deshalb folgt die Echohöhe e^(−TE/T2), nicht e^(−TE/T2*). Ein Gradientenecho dreht dagegen nur die Dephasierung durch den Gradienten zurück.',
      ru: '**180°-импульс зеркально отражает фазы, и спины снова собираются вместе.** Представь бегунов на стадионе: быстрые и медленные стартуют вместе и расходятся. В момент TE/2 все разворачиваются и бегут обратно со своей скоростью. У самого быстрого самый длинный обратный путь, но он и бежит быстрее всех. В момент TE все одновременно приходят к линии старта. Это и есть эхо. Так работает только для статических различий: неоднородности поля, магнитной восприимчивости или химического сдвига. Случайные спин-спиновые взаимодействия всё время меняются, и их нельзя обратить. Поэтому высота эха спадает как e^(−TE/T2), а не e^(−TE/T2*). Градиентное эхо, напротив, обращает только дефазировку от градиента.',
    },
  },
  {
    id: 'rx-bloch',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Welche Gleichung beschreibt die Längskomponente der Bloch-Gleichungen (ohne HF, im Laborsystem)?',
      ru: 'Какое уравнение описывает продольную компоненту уравнений Блоха (без РЧ, в лабораторной системе)?',
    },
    options: [
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z - M_0}{T_1}$', ru: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z - M_0}{T_1}$' },
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z}{T_2}$', ru: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_z}{T_2}$' },
      { de: '$\\dfrac{dM_z}{dt} = \\gamma B_0 M_z$', ru: '$\\dfrac{dM_z}{dt} = \\gamma B_0 M_z$' },
      { de: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_0}{T_1}$', ru: '$\\dfrac{dM_z}{dt} = -\\dfrac{M_0}{T_1}$' },
    ],
    answer: 0,
    hint: {
      de: 'M_z soll zu M₀ zurückkehren und dort stehen bleiben. Bei welcher Gleichung wird die Änderung null, wenn M_z = M₀ ist?',
      ru: 'M_z должна вернуться к M₀ и там остаться. В каком уравнении изменение становится нулевым при M_z = M₀?',
    },
    explanation: {
      de: '**Die Änderung von M_z ist proportional zum Abstand vom Ziel M₀.** Je weiter M_z von M₀ weg ist, desto schneller kehrt es zurück. Bei M_z = M₀ ist die Änderung null, und es bleibt dort. Wie heißer Tee, der umso schneller abkühlt, je heißer er im Vergleich zum Raum ist. Die volle Bloch-Gleichung lautet dM/dt = γ M × B − (M_x x̂ + M_y ŷ)/T2 − (M_z − M₀) ẑ/T1. Für die z-Komponente bleibt nur der T1-Term. Lösung: M_z(t) = M₀ + (M_z(0) − M₀)·e^(−t/T1). Die anderen Optionen kehren nicht zu M₀ zurück oder verwechseln T1 mit T2.',
      ru: '**Изменение M_z пропорционально расстоянию до цели M₀.** Чем дальше M_z от M₀, тем быстрее она возвращается. При M_z = M₀ изменение равно нулю, и она там остаётся. Как горячий чай, который остывает тем быстрее, чем он горячее по сравнению с комнатой. Полное уравнение Блоха: dM/dt = γ M × B − (M_x x̂ + M_y ŷ)/T2 − (M_z − M₀) ẑ/T1. Для z-компоненты остаётся только член с T1. Решение: M_z(t) = M₀ + (M_z(0) − M₀)·e^(−t/T1). Остальные варианты не возвращаются к M₀ или путают T1 с T2.',
    },
  },
  {
    id: 'rx-multi-contrast',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Aussagen zu Gewebekontrasten bei 1,5 T sind korrekt? (Mehrfachauswahl)',
      ru: 'Какие утверждения о тканевом контрасте при 1,5 Тл верны? (несколько вариантов)',
    },
    options: [
      { de: 'Freies Wasser (Liquor, Ödem) hat lange T1- und T2-Zeiten.', ru: 'Свободная вода (ликвор, отёк) имеет длинные времена T1 и T2.' },
      { de: 'Weiße Substanz hat ein kürzeres T1 als graue Substanz (Myelin).', ru: 'У белого вещества T1 короче, чем у серого (миелин).' },
      { de: 'Muskel hat ein besonders langes T2 und ist daher in T2w hell.', ru: 'У мышцы особенно длинное T2, поэтому она светлая на T2w.' },
      {
        de: 'Gadolinium-Kontrastmittel verkürzen vor allem T1 und machen anreicherndes Gewebe in T1w hell.',
        ru: 'Контрастные вещества на основе гадолиния прежде всего укорачивают T1 и делают накапливающую контраст ткань светлой на T1w.',
      },
    ],
    answers: [0, 1, 3],
    hint: {
      de: 'Prüfe jede Aussage einzeln. Wie sieht Muskel in einem T2-Bild aus, eher hell wie Wasser oder eher dunkel?',
      ru: 'Проверь каждое утверждение отдельно. Как выглядит мышца на T2-изображении: светлая, как вода, или скорее тёмная?',
    },
    explanation: {
      de: '**Richtig sind: freies Wasser mit langem T1 und T2, weiße Substanz mit kürzerem T1 und Gadolinium als T1-Verkürzer.** Freies Wasser bewegt sich sehr schnell und ist schlecht im Energieabgeben, daher sind beide Zeiten lang. Myelin, die fettreiche Hülle der Nervenfasern, verkürzt das T1 der weißen Substanz. Deshalb ist sie in T1w heller als die graue Substanz. Gd³⁺ hat 7 ungepaarte Elektronen. Das macht es zu einem starken Magneten, der benachbarte Wasserprotonen schneller relaxieren lässt. Falsch ist die Aussage zum Muskel: Er hat ein kurzes T2 (etwa 40 bis 50 ms) und ist in T2w dunkel.',
      ru: '**Верны: свободная вода с длинными T1 и T2, белое вещество с более коротким T1 и гадолиний как укорачиватель T1.** Свободная вода движется очень быстро и плохо отдаёт энергию, поэтому оба времени длинные. Миелин, богатая жиром оболочка нервных волокон, укорачивает T1 белого вещества. Поэтому на T1w оно светлее серого. У Gd³⁺ 7 неспаренных электронов. Это делает его сильным магнитом, который ускоряет релаксацию соседних протонов воды. Неверно утверждение о мышце: у неё короткое T2 (около 40–50 мс), и на T2w она тёмная.',
    },
  },
];
