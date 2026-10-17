import { NUCLEI } from '../../physics/constants';
import { larmorMHz, spinExcess, zeemanEnergy } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

export const kernspinQuestions: QuestionSource[] = [
  {
    id: 'ks-larmor-h',
    generate: (rng, lang) => {
      const b0 = pick(rng, [0.55, 1, 1.5, 3, 7]);
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'ks-larmor-h',
        difficulty: 1,
        prompt: t(
          `Berechne die Larmor-Frequenz von Protonen (¹H, $\\bar\\gamma = 42{,}577$ MHz/T) bei $B_0 = ${n(b0, 2, lang)}$ T.`,
          `Рассчитай ларморову частоту протонов (¹H, $\\bar\\gamma = 42{,}577$ МГц/Тл) при $B_0 = ${n(b0, 2, lang)}$ Тл.`,
        ),
        answer: larmorMHz(b0),
        tolerance: 0.01,
        unit: t('MHz', 'МГц'),
        hint: t(
          'Frequenz und Feld hängen direkt zusammen: Mehr Feld, schnelleres Kreiseln. Larmor-Gleichung: $f_0 = \\bar\\gamma \\cdot B_0$.',
          'Частота и поле связаны напрямую: больше поле, быстрее вращение. Уравнение Лармора: $f_0 = \\bar\\gamma \\cdot B_0$.',
        ),
        explanation: t(
          `**Die Protonen präzedieren mit ${n(larmorMHz(b0), 2, lang)} MHz.** Präzession heißt: Die Spinachse kreist wie ein schiefer Kreisel um die Feldrichtung. $\\bar\\gamma$ sagt dir, wie viel Frequenz pro Tesla dazukommt. Rechnung: $f_0 = 42{,}577\\,\\text{MHz/T} \\cdot ${n(b0, 2, lang)}\\,\\text{T} = ${n(larmorMHz(b0), 2, lang)}$ MHz. Check: 1 T gibt rund 42,6 MHz, doppeltes Feld heißt doppelte Frequenz. Diese Frequenz liegt im UKW-Radiobereich. Deshalb steht der Scanner in einem Faradaykäfig, sonst würden Radiosender ins Bild funken.`,
          `**Протоны прецессируют с частотой ${n(larmorMHz(b0), 2, lang)} МГц.** Прецессия значит: ось спина кружит вокруг направления поля, как наклонённый волчок. $\\bar\\gamma$ говорит, сколько частоты добавляет каждый тесла. Расчёт: $f_0 = 42{,}577\\,\\text{МГц/Тл} \\cdot ${n(b0, 2, lang)}\\,\\text{Тл} = ${n(larmorMHz(b0), 2, lang)}$ МГц. Проверка: 1 Тл даёт около 42,6 МГц, двойное поле значит двойную частоту. Эта частота лежит в диапазоне УКВ-радио. Поэтому сканер стоит в клетке Фарадея, иначе радиостанции попадали бы в изображение.`,
        ),
      };
    },
  },
  {
    id: 'ks-larmor-x',
    generate: (rng, lang) => {
      const nuc = pick(
        rng,
        NUCLEI.filter((x) => x.id !== 'H1'),
      );
      const b0 = pick(rng, [1.5, 3, 7]);
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'ks-larmor-x',
        difficulty: 2,
        prompt: t(
          `Für eine Spektroskopie-Messung soll ${nuc.label[lang]} bei ${n(b0, 2, lang)} T angeregt werden ($\\bar\\gamma = ${n(nuc.gammaBar, 3, lang)}$ MHz/T). Auf welche Frequenz muss die HF-Spule abgestimmt sein?`,
          `Для спектроскопического измерения нужно возбудить ${nuc.label[lang]} при ${n(b0, 2, lang)} Тл ($\\bar\\gamma = ${n(nuc.gammaBar, 3, lang)}$ МГц/Тл). На какую частоту должна быть настроена РЧ-катушка?`,
        ),
        answer: larmorMHz(b0, nuc.gammaBar),
        tolerance: 0.01,
        unit: t('MHz', 'МГц'),
        hint: t(
          'Es ist dieselbe Larmor-Gleichung wie bei Protonen. Nur der Faktor $\\bar\\gamma$ gehört jetzt zu einem anderen Kern.',
          'Это то же уравнение Лармора, что и для протонов. Только множитель $\\bar\\gamma$ теперь относится к другому ядру.',
        ),
        explanation: t(
          `**Die Spule muss auf ${n(larmorMHz(b0, nuc.gammaBar), 2, lang)} MHz abgestimmt sein.** Rechnung: $f_0 = ${n(nuc.gammaBar, 3, lang)} \\cdot ${n(b0, 2, lang)} = ${n(larmorMHz(b0, nuc.gammaBar), 2, lang)}$ MHz. Check: Das $\\bar\\gamma$ dieses Kerns ist kleiner als die 42,58 MHz/T von ¹H, also liegt auch die Frequenz unter der Protonenfrequenz. Jeder Kern hat seinen eigenen „Sender“. Wie beim Radio musst du genau den richtigen Sender einstellen. Deshalb braucht man für solche X-Kerne eigene, oft doppelt abgestimmte Spulen und Breitband-Sender.`,
          `**Катушку нужно настроить на ${n(larmorMHz(b0, nuc.gammaBar), 2, lang)} МГц.** Расчёт: $f_0 = ${n(nuc.gammaBar, 3, lang)} \\cdot ${n(b0, 2, lang)} = ${n(larmorMHz(b0, nuc.gammaBar), 2, lang)}$ МГц. Проверка: $\\bar\\gamma$ этого ядра меньше, чем 42,58 МГц/Тл у ¹H, значит, и частота ниже протонной. У каждого ядра своя «радиостанция». Как в радиоприёмнике, нужно поймать именно её. Поэтому для таких X-ядер нужны отдельные, часто двухчастотные катушки и широкополосные передатчики.`,
        ),
      };
    },
  },
  {
    id: 'ks-field-from-f',
    generate: (rng, lang) => {
      const b0 = pick(rng, [0.35, 0.5, 1, 1.2, 2, 4.7, 9.4]);
      const f = larmorMHz(b0);
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'ks-field-from-f',
        difficulty: 1,
        prompt: t(
          `Ein Scanner zeigt im Justageprotokoll eine Protonen-Mittenfrequenz von ${n(f, 3, lang)} MHz. Welche Feldstärke hat der Magnet?`,
          `В протоколе настройки сканер показывает центральную частоту протонов ${n(f, 3, lang)} МГц. Какова индукция поля магнита?`,
        ),
        answer: b0,
        tolerance: 0.01,
        unit: t('T', 'Тл'),
        hint: t(
          'Du kennst die Frequenz und suchst das Feld. Dreh die Larmor-Gleichung einfach um.',
          'Ты знаешь частоту и ищешь поле. Просто переверни уравнение Лармора.',
        ),
        explanation: t(
          `**Der Magnet hat rund ${n(b0, 2, lang)} T.** Die Larmor-Gleichung funktioniert in beide Richtungen: Aus dem Feld folgt die Frequenz, aus der Frequenz das Feld. Rechnung: $B_0 = f_0/\\bar\\gamma = ${n(f, 3, lang)} / 42{,}577 \\approx ${n(b0, 2, lang)}$ T. Check: Pro Tesla kommen etwa 42,6 MHz dazu, also teilst du die Frequenz durch 42,6. Der Scanner misst diese Mittenfrequenz vor jeder Untersuchung neu. B₀ driftet minimal, und der Körper des Patienten verändert das Feld ein kleines bisschen.`,
          `**Поле магнита около ${n(b0, 2, lang)} Тл.** Уравнение Лармора работает в обе стороны: из поля следует частота, из частоты следует поле. Расчёт: $B_0 = f_0/\\bar\\gamma = ${n(f, 3, lang)} / 42{,}577 \\approx ${n(b0, 2, lang)}$ Тл. Проверка: на каждый тесла приходится около 42,6 МГц, значит, делишь частоту на 42,6. Сканер заново измеряет эту центральную частоту перед каждым исследованием. B₀ слегка дрейфует, а тело пациента немного изменяет поле.`,
        ),
      };
    },
  },
  {
    id: 'ks-flip',
    generate: (rng, lang) => {
      const b1 = pick(rng, [2.94, 5.87, 11.74, 4.4, 7.34]);
      const tau = pick(rng, [0.5, 1, 2]);
      const flip = 360 * 42.577e6 * b1 * 1e-6 * tau * 1e-3;
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'ks-flip',
        difficulty: 3,
        prompt: t(
          `Ein rechteckiger HF-Puls mit $B_1 = ${n(b1, 2, lang)}$ µT wird für ${n(tau, 2, lang)} ms eingestrahlt. Welcher Flipwinkel ergibt sich für Protonen?`,
          `Прямоугольный РЧ-импульс с $B_1 = ${n(b1, 2, lang)}$ мкТл подаётся в течение ${n(tau, 2, lang)} мс. Какой угол отклонения получают протоны?`,
        ),
        answer: flip,
        tolerance: 0.02,
        unit: '°',
        hint: t(
          'Während des Pulses kreiselt M um B₁, so wie sonst um B₀. Wie viele Umdrehungen schafft M in der Pulsdauer? Eine Umdrehung sind 360°.',
          'Во время импульса M вращается вокруг B₁, как обычно вокруг B₀. Сколько оборотов успевает сделать M за время импульса? Один оборот равен 360°.',
        ),
        explanation: t(
          `**Der Flipwinkel beträgt etwa ${n(flip, 1, lang)}°.** Im mitrotierenden Bezugssystem steht B₁ still, und M dreht sich um B₁. Die Drehfrequenz ist $\\bar\\gamma B_1$, der Winkel ist also Frequenz mal Zeit mal 360°. Rechnung: $\\alpha = 360° \\cdot 42{,}577\\cdot10^6\\,\\text{Hz/T} \\cdot ${n(b1, 2, lang)}\\cdot10^{-6}\\,\\text{T} \\cdot ${n(tau, 2, lang)}\\cdot10^{-3}\\,\\text{s} \\approx ${n(flip, 1, lang)}°$. Check: Doppelte Pulsdauer oder doppeltes B₁ gibt den doppelten Winkel. B₁ ist rund fünf Größenordnungen schwächer als B₀. Es wirkt trotzdem, weil es im Takt der Spins schiebt, wie beim Anschubsen einer Schaukel.`,
          `**Угол отклонения около ${n(flip, 1, lang)}°.** Во вращающейся вместе со спинами системе отсчёта B₁ неподвижно, и M поворачивается вокруг B₁. Частота этого поворота равна $\\bar\\gamma B_1$, значит, угол равен частоте, умноженной на время и на 360°. Расчёт: $\\alpha = 360° \\cdot 42{,}577\\cdot10^6\\,\\text{Гц/Тл} \\cdot ${n(b1, 2, lang)}\\cdot10^{-6}\\,\\text{Тл} \\cdot ${n(tau, 2, lang)}\\cdot10^{-3}\\,\\text{с} \\approx ${n(flip, 1, lang)}°$. Проверка: двойная длительность или двойное B₁ дают двойной угол. B₁ примерно на пять порядков слабее B₀. Оно всё равно действует, потому что толкает спины в их ритме, как при раскачивании качелей.`,
        ),
      };
    },
  },
  {
    id: 'ks-excess',
    generate: (rng, lang) => {
      const b0 = pick(rng, [1.5, 3, 7]);
      const ppm = spinExcess(b0) * 1e6;
      const t = tl(lang);
      return {
        kind: 'numeric',
        id: 'ks-excess',
        difficulty: 3,
        prompt: t(
          `Schätze den relativen Spinüberschuss $\\Delta N/N \\approx h f_0 /(2kT)$ für Protonen bei ${n(b0, 2, lang)} T und Körpertemperatur (310 K). Angabe in ppm (Teile pro Million).`,
          `Оцени относительный спиновый избыток $\\Delta N/N \\approx h f_0 /(2kT)$ для протонов при ${n(b0, 2, lang)} Тл и температуре тела (310 K). Ответ в ppm (миллионных долях).`,
        ),
        answer: ppm,
        tolerance: 0.05,
        unit: 'ppm',
        hint: t(
          'Rechne zuerst $f_0$ aus, dann die Energie $h f_0$. Vergleiche sie mit der Wärmeenergie $kT$. Konstanten: $h = 6{,}626\\cdot10^{-34}$ J·s, $k = 1{,}381\\cdot10^{-23}$ J/K.',
          'Сначала найди $f_0$, затем энергию $h f_0$. Сравни её с тепловой энергией $kT$. Константы: $h = 6{,}626\\cdot10^{-34}$ Дж·с, $k = 1{,}381\\cdot10^{-23}$ Дж/К.',
        ),
        explanation: t(
          `**Nur etwa ${n(ppm, 2, lang)} von einer Million Protonen bilden den Überschuss.** Die Wärmebewegung wirbelt die Spins ständig durcheinander. Die Energielücke zwischen „mit dem Feld“ und „gegen das Feld“ ist winzig dagegen. Rechnung: $\\Delta E = h f_0 = ${n(zeemanEnergy(b0) * 1e26, 2, lang)}\\cdot10^{-26}$ J, und $\\Delta E/(2kT) \\approx ${n(ppm, 2, lang)}$ ppm. Check: Bei 3 T liegt der Wert um 10 ppm, und er wächst linear mit B₀. Doppeltes Feld heißt doppelter Überschuss und damit mehr Signal. Dass die MRT trotzdem funktioniert, liegt an der riesigen Zahl: Ein Kubikzentimeter Wasser enthält rund 10²² Protonen.`,
          `**Лишь около ${n(ppm, 2, lang)} протонов из миллиона образуют избыток.** Тепловое движение постоянно перемешивает спины. Энергетическая щель между состояниями «по полю» и «против поля» по сравнению с этим ничтожна. Расчёт: $\\Delta E = h f_0 = ${n(zeemanEnergy(b0) * 1e26, 2, lang)}\\cdot10^{-26}$ Дж, и $\\Delta E/(2kT) \\approx ${n(ppm, 2, lang)}$ ppm. Проверка: при 3 Тл значение около 10 ppm, и оно растёт линейно с B₀. Двойное поле значит двойной избыток и больше сигнала. МРТ всё равно работает благодаря огромному числу: в кубическом сантиметре воды около 10²² протонов.`,
        ),
      };
    },
  },
  {
    id: 'ks-energy',
    kind: 'numeric',
    difficulty: 2,
    prompt: {
      de: 'Wie groß ist die Energiedifferenz $\\Delta E$ zwischen den beiden Spinzuständen eines Protons bei 3 T? Gib das Ergebnis in Einheiten von $10^{-26}$ J an.',
      ru: 'Какова разность энергий $\\Delta E$ между двумя спиновыми состояниями протона при 3 Тл? Дай ответ в единицах $10^{-26}$ Дж.',
    },
    answer: zeemanEnergy(3) * 1e26,
    tolerance: 0.02,
    unit: { de: '×10⁻²⁶ J', ru: '×10⁻²⁶ Дж' },
    hint: {
      de: 'Ein Photon mit der Larmor-Frequenz passt genau in die Energielücke. Seine Energie ist $h$ mal Frequenz.',
      ru: 'Фотон с ларморовой частотой точно подходит к энергетической щели. Его энергия равна $h$, умноженной на частоту.',
    },
    explanation: {
      de: `**Die Lücke beträgt nur etwa ${n(zeemanEnergy(3) * 1e26, 2, 'de')}·10⁻²⁶ J.** Die beiden Spinzustände sind wie zwei Treppenstufen. Um von unten nach oben zu springen, braucht ein Proton genau die Energie eines HF-Photons mit der Larmor-Frequenz. Bei 3 T sind das 127,7 MHz. Rechnung: $\\Delta E = h f_0 = 6{,}626\\cdot10^{-34} \\cdot 127{,}7\\cdot10^{6} \\approx ${n(zeemanEnergy(3) * 1e26, 2, 'de')}\\cdot10^{-26}$ J. Check: Die Wärmeenergie bei Körpertemperatur ist kT ≈ 4,3·10⁻²¹ J, also rund eine Million Mal größer. Deshalb ist der Spinüberschuss so winzig.`,
      ru: `**Щель составляет всего около ${n(zeemanEnergy(3) * 1e26, 2, 'ru')}·10⁻²⁶ Дж.** Два спиновых состояния похожи на две ступеньки лестницы. Чтобы перейти снизу наверх, протону нужна ровно энергия РЧ-фотона с ларморовой частотой. При 3 Тл это 127,7 МГц. Расчёт: $\\Delta E = h f_0 = 6{,}626\\cdot10^{-34} \\cdot 127{,}7\\cdot10^{6} \\approx ${n(zeemanEnergy(3) * 1e26, 2, 'ru')}\\cdot10^{-26}$ Дж. Проверка: тепловая энергия при температуре тела kT ≈ 4,3·10⁻²¹ Дж, то есть примерно в миллион раз больше. Поэтому спиновый избыток так мал.`,
    },
  },
  {
    id: 'ks-why-h',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Warum basiert die klinische MRT fast ausschließlich auf dem Wasserstoffkern ¹H?',
      ru: 'Почему клиническая МРТ почти исключительно основана на ядре водорода ¹H?',
    },
    options: [
      {
        de: 'Er hat das größte gyromagnetische Verhältnis der stabilen Kerne und kommt in Wasser und Fett in sehr hoher Konzentration vor.',
        ru: 'У него наибольшее гиромагнитное отношение среди стабильных ядер, и оно присутствует в воде и жире в очень высокой концентрации.',
      },
      { de: 'Er ist der einzige Kern mit Spin ≠ 0.', ru: 'Это единственное ядро со спином ≠ 0.' },
      {
        de: 'Er besitzt eine gerade Anzahl an Nukleonen und daher ein großes magnetisches Moment.',
        ru: 'У него чётное число нуклонов и поэтому большой магнитный момент.',
      },
      {
        de: 'Seine Larmor-Frequenz liegt im Mikrowellenbereich und ist deshalb leicht messbar.',
        ru: 'Его ларморова частота лежит в микроволновом диапазоне, поэтому её легко измерить.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Denk an zwei Dinge: Wie viele dieser Kerne gibt es im Körper, und wie stark reagiert jeder einzelne?',
      ru: 'Подумай о двух вещах: сколько таких ядер в теле и насколько сильно реагирует каждое из них?',
    },
    explanation: {
      de: '**Viel und laut: ¹H ist überall und reagiert am stärksten.** Wasser und Fett machen den Großteil des Körpers aus, im Gewebe stecken rund 110 mol Protonen pro Liter. Dazu hat ¹H mit γ̄ = 42,58 MHz/T das größte gyromagnetische Verhältnis aller stabilen Kerne. γ zählt beim Signal gleich dreifach: Es bestimmt die Stärke jedes Mini-Magneten, den Spinüberschuss und wie kräftig das Signal in der Spule induziert. Grob gilt also Signal ∝ Spindichte · γ³. Die anderen Optionen stimmen nicht: Viele Kerne haben einen Spin, und Kerne mit gerader Protonen- und Neutronenzahl wie ¹²C oder ¹⁶O haben gar keinen Spin. Die Frequenz liegt im Radiobereich, nicht bei Mikrowellen.',
      ru: '**Много и громко: ¹H есть везде и реагирует сильнее всех.** Вода и жир составляют большую часть тела, в тканях около 110 моль протонов на литр. Кроме того, у ¹H с γ̄ = 42,58 МГц/Тл наибольшее гиромагнитное отношение среди стабильных ядер. γ входит в сигнал трижды: оно определяет силу каждого мини-магнита, спиновый избыток и то, насколько сильно сигнал наводится в катушке. Грубо: сигнал ∝ спиновая плотность · γ³. Остальные варианты неверны: спин есть у многих ядер, а ядра с чётным числом протонов и нейтронов, как ¹²C или ¹⁶O, вообще не имеют спина. Частота лежит в радиодиапазоне, а не в микроволновом.',
    },
  },
  {
    id: 'ks-double',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Was passiert, wenn man $B_0$ von 1,5 T auf 3 T verdoppelt (alles andere gleich)?',
      ru: 'Что произойдёт, если удвоить $B_0$ с 1,5 Тл до 3 Тл (при прочих равных условиях)?',
    },
    options: [
      {
        de: 'Larmor-Frequenz und Spinüberschuss verdoppeln sich; das SNR steigt grob um den Faktor 2.',
        ru: 'Ларморова частота и спиновый избыток удваиваются; SNR растёт примерно вдвое.',
      },
      {
        de: 'Die Larmor-Frequenz verdoppelt sich, der Spinüberschuss bleibt gleich.',
        ru: 'Ларморова частота удваивается, спиновый избыток остаётся неизменным.',
      },
      { de: 'Die Larmor-Frequenz vervierfacht sich, da ω ∝ B₀².', ru: 'Ларморова частота возрастает вчетверо, так как ω ∝ B₀².' },
      {
        de: 'Nur T2 verdoppelt sich, alle anderen Größen bleiben konstant.',
        ru: 'Удваивается только T2, все остальные величины остаются постоянными.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Schau, wie Frequenz und Spinüberschuss von B₀ abhängen: linear oder quadratisch?',
      ru: 'Посмотри, как частота и спиновый избыток зависят от B₀: линейно или квадратично?',
    },
    explanation: {
      de: '**Frequenz und Spinüberschuss wachsen beide linear mit B₀.** Es gilt f₀ = γ̄B₀ und ΔN/N ≈ γħB₀/(2kT). Doppeltes Feld heißt also doppelte Frequenz und doppelt so viele „überzählige“ Spins. Mehr Spins im Überschuss geben mehr Signal, das SNR (Signal-Rausch-Verhältnis) steigt grob um den Faktor 2. In der Praxis ist es etwas weniger, weil T1 länger wird und die SAR-Grenzen bremsen. SAR ist die im Körper deponierte HF-Leistung, und sie wächst mit B₀², also auf das Vierfache. Auch die chemische Verschiebung in Hz verdoppelt sich.',
      ru: '**Частота и спиновый избыток оба растут линейно с B₀.** Действует f₀ = γ̄B₀ и ΔN/N ≈ γħB₀/(2kT). Двойное поле значит двойную частоту и вдвое больше «лишних» спинов. Больше избыточных спинов дают больше сигнала, SNR (отношение сигнал/шум) растёт примерно вдвое. На практике чуть меньше, потому что T1 удлиняется и мешают ограничения SAR. SAR это поглощённая телом РЧ-мощность, и она растёт как B₀², то есть вчетверо. Химический сдвиг в Гц тоже удваивается.',
    },
  },
  {
    id: 'ks-90pulse',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Was bewirkt ein resonanter 90°-HF-Puls auf die Nettomagnetisierung $\\vec M$?',
      ru: 'Как резонансный 90°-РЧ-импульс действует на суммарную намагниченность $\\vec M$?',
    },
    options: [
      {
        de: 'Er kippt $\\vec M$ vollständig in die Transversalebene: $M_z = 0$, $M_{\\text{xy}} = M_0$, und die Spins präzedieren phasenkohärent.',
        ru: 'Он полностью отклоняет $\\vec M$ в поперечную плоскость: $M_z = 0$, $M_{\\text{xy}} = M_0$, и спины прецессируют фазово-когерентно.',
      },
      { de: 'Er verdoppelt die Längsmagnetisierung $M_z$.', ru: 'Он удваивает продольную намагниченность $M_z$.' },
      { de: 'Er invertiert $\\vec M$ auf $-M_0$ entlang z.', ru: 'Он инвертирует $\\vec M$ до $-M_0$ вдоль z.' },
      {
        de: 'Er stoppt die Präzession der Spins für die Dauer der Messung.',
        ru: 'Он останавливает прецессию спинов на время измерения.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Der Winkel sagt es schon: Wohin zeigt ein Pfeil, den du von senkrecht um 90° kippst?',
      ru: 'Угол уже подсказывает: куда указывает стрелка, которую ты наклонил из вертикали на 90°?',
    },
    explanation: {
      de: '**Der 90°-Puls legt M komplett in die xy-Ebene.** Stell dir M als Pfeil vor, der entlang B₀ nach oben zeigt. Während des Pulses dreht sich M um B₁, und nach 90° liegt der Pfeil flach. Jetzt kreiseln alle Spins im Gleichtakt, also phasenkohärent, um die z-Achse. Diese rotierende Magnetisierung wirkt wie ein Fahrraddynamo: Sie induziert in der Empfangsspule eine Wechselspannung, das FID-Signal. Ein 180°-Puls würde M dagegen nach unten klappen, also invertieren.',
      ru: '**90°-импульс полностью укладывает M в плоскость xy.** Представь M как стрелку, направленную вдоль B₀ вверх. Во время импульса M поворачивается вокруг B₁, и после 90° стрелка лежит горизонтально. Теперь все спины вращаются в такт, то есть фазово-когерентно, вокруг оси z. Эта вращающаяся намагниченность работает как велосипедная динамо-машина: она наводит в приёмной катушке переменное напряжение, сигнал FID. 180°-импульс, напротив, перевернул бы M вниз, то есть инвертировал бы её.',
    },
  },
  {
    id: 'ks-resonance',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum muss das HF-Feld $B_1$ exakt mit der Larmor-Frequenz rotieren?',
      ru: 'Почему РЧ-поле $B_1$ должно вращаться точно с ларморовой частотой?',
    },
    options: [
      {
        de: 'Nur dann ruht B₁ im mitrotierenden Bezugssystem der Spins und kann M kumulativ auskippen; bei Fehlabstimmung bleibt ein effektives Feld entlang z übrig.',
        ru: 'Только тогда B₁ неподвижно во вращающейся вместе со спинами системе отсчёта и может накопительно отклонять M; при расстройке остаётся эффективное поле вдоль z.',
      },
      { de: 'Weil sonst die Gradientenspulen überhitzen.', ru: 'Потому что иначе градиентные катушки перегреваются.' },
      {
        de: 'Weil die Larmor-Frequenz die Abtastrate des Analog-Digital-Wandlers festlegt.',
        ru: 'Потому что ларморова частота задаёт частоту дискретизации аналого-цифрового преобразователя.',
      },
      {
        de: 'Weil B₁ andernfalls B₀ verstärkt und den Magneten quenchen würde.',
        ru: 'Потому что иначе B₁ усилило бы B₀ и вызвало квенч магнита.',
      },
    ],
    answer: 0,
    hint: {
      de: 'Denk an eine Schaukel: Wann bringt Anschubsen am meisten?',
      ru: 'Вспомни качели: когда толчок даёт больше всего?',
    },
    explanation: {
      de: '**Nur im Gleichtakt schiebt B₁ die Magnetisierung immer in dieselbe Richtung.** Das ist wie bei einer Schaukel: Schubst du im Takt, wird der Ausschlag immer größer. Schubst du außer Takt, hebt sich alles wieder auf. Physikalisch: Im mitrotierenden Bezugssystem wirkt das effektive Feld B_eff = (B₀ − ω_RF/γ)·ẑ + B₁·x̂. Nur bei ω_RF = ω₀ fällt der z-Anteil weg, und M kippt vollständig um B₁. Auf genau diesem Prinzip beruht auch die schichtselektive Anregung: Nur die Schicht, deren Frequenz passt, wird angeregt.',
      ru: '**Только в такт B₁ толкает намагниченность всё время в одну сторону.** Это как с качелями: толкаешь в такт, и размах растёт. Толкаешь не в такт, и всё гасится. Физически: во вращающейся системе отсчёта действует эффективное поле B_eff = (B₀ − ω_RF/γ)·ẑ + B₁·x̂. Только при ω_RF = ω₀ z-составляющая исчезает, и M полностью отклоняется вокруг B₁. На этом же принципе основано селективное возбуждение среза: возбуждается только тот срез, чья частота совпадает.',
    },
  },
  {
    id: 'ks-gamma-def',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Was beschreibt das gyromagnetische Verhältnis γ?', ru: 'Что описывает гиромагнитное отношение γ?' },
    options: [
      {
        de: 'Das Verhältnis von magnetischem Moment zu Drehimpuls (Spin) eines Teilchens.',
        ru: 'Отношение магнитного момента частицы к её моменту импульса (спину).',
      },
      { de: 'Das Verhältnis von Längs- zu Querrelaxationszeit.', ru: 'Отношение времени продольной релаксации ко времени поперечной релаксации.' },
      { de: 'Das Verhältnis von HF-Leistung zu Körpermasse.', ru: 'Отношение РЧ-мощности к массе тела.' },
      { de: 'Das Verhältnis von Gradientenstärke zu Schichtdicke.', ru: 'Отношение амплитуды градиента к толщине среза.' },
    ],
    answer: 0,
    hint: {
      de: 'Das Wort steckt im Namen: „gyro“ wie Kreisel (Drehimpuls) und „magnetisch“.',
      ru: 'Подсказка в названии: «гиро» как волчок (момент импульса) и «магнитное».',
    },
    explanation: {
      de: '**γ sagt, wie viel Magnet in einem Stück Drehimpuls steckt.** Denk an einen Kreisel mit eingebautem Stabmagnet: γ ist der Übersetzungsfaktor zwischen Drehung und Magnetstärke. Formel: μ = γ·S, mit μ als magnetischem Moment und S als Spin. Daraus folgt direkt die Präzessionsfrequenz ω₀ = γB₀. Für Protonen ist γ = 2,675·10⁸ rad/(s·T). Teilt man durch 2π, erhält man γ̄ = 42,58 MHz/T. Achtung, im Skript steht 42,57 MHz/T bei ω. Gemeint ist γ̄ = γ/2π, also die Frequenz f, nicht die Kreisfrequenz ω.',
      ru: '**γ показывает, сколько магнита приходится на единицу момента импульса.** Представь волчок со встроенным стержневым магнитом: γ это коэффициент пересчёта между вращением и силой магнита. Формула: μ = γ·S, где μ магнитный момент, а S спин. Отсюда сразу следует частота прецессии ω₀ = γB₀. Для протонов γ = 2,675·10⁸ рад/(с·Тл). Если разделить на 2π, получается γ̄ = 42,58 МГц/Тл. Внимание: в конспекте 42,57 МГц/Тл стоит при ω. Имеется в виду γ̄ = γ/2π, то есть частота f, а не круговая частота ω.',
    },
  },
  {
    id: 'ks-multi-precession',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Aussagen über Spins im statischen Magnetfeld sind korrekt? (Mehrfachauswahl)',
      ru: 'Какие утверждения о спинах в статическом магнитном поле верны? (несколько вариантов)',
    },
    options: [
      { de: 'Die Präzessionsfrequenz ist proportional zu B₀.', ru: 'Частота прецессии пропорциональна B₀.' },
      {
        de: 'Ohne Anregung sind die Präzessionsphasen der Spins zufällig verteilt: Es gibt keine messbare Quermagnetisierung.',
        ru: 'Без возбуждения фазы прецессии спинов распределены случайно: измеримой поперечной намагниченности нет.',
      },
      { de: 'Alle Spins richten sich exakt parallel zu B₀ aus.', ru: 'Все спины ориентируются строго параллельно B₀.' },
      {
        de: 'Die makroskopische Längsmagnetisierung M₀ entsteht durch den kleinen thermischen Besetzungsüberschuss des energieärmeren Zustands.',
        ru: 'Макроскопическая продольная намагниченность M₀ возникает из-за небольшого теплового избытка заселённости нижнего энергетического состояния.',
      },
      {
        de: 'Die Längsmagnetisierung M₀ erzeugt in einer Empfangsspule ein messbares Wechselspannungssignal.',
        ru: 'Продольная намагниченность M₀ создаёт в приёмной катушке измеримый сигнал переменного напряжения.',
      },
    ],
    answers: [0, 1, 3],
    hint: {
      de: 'Eine Spule misst nur, wenn sich der Magnetfluss durch sie ändert. Welche Magnetisierung ändert sich?',
      ru: 'Катушка измеряет только тогда, когда меняется магнитный поток через неё. Какая намагниченность меняется?',
    },
    explanation: {
      de: '**Richtig sind: f ∝ B₀, zufällige Phasen ohne Anregung und M₀ aus dem kleinen Überschuss.** Die Spins stehen nicht stramm parallel zu B₀. Sie kreiseln in alle möglichen Richtungen, nur im Mittel gibt es ein kleines Plus entlang B₀. Das ergibt M₀. Stell dir ein Stadion vor, in dem jeder Zuschauer zu einem anderen Zeitpunkt aufsteht: Es entsteht keine La-Ola-Welle, also keine Quermagnetisierung. M₀ selbst ist statisch und ändert den Fluss durch die Spule nicht. Ohne Flussänderung wird keine Spannung induziert. Messbar ist nur die rotierende Quermagnetisierung nach einer Anregung.',
      ru: '**Верны: f ∝ B₀, случайные фазы без возбуждения и M₀ из маленького избытка.** Спины не выстраиваются строго параллельно B₀. Они вращаются во всевозможных направлениях, и лишь в среднем есть небольшой перевес вдоль B₀. Это и даёт M₀. Представь стадион, где каждый зритель встаёт в своё время: волны не получается, то есть нет поперечной намагниченности. Сама M₀ статична и не меняет поток через катушку. Без изменения потока напряжение не наводится. Измерить можно только вращающуюся поперечную намагниченность после возбуждения.',
    },
  },
  {
    id: 'ks-boltzmann-temp',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Wie ändert sich die Gleichgewichtsmagnetisierung $M_0$ mit der Temperatur (Curie-Gesetz)?',
      ru: 'Как равновесная намагниченность $M_0$ зависит от температуры (закон Кюри)?',
    },
    options: [
      { de: '$M_0 \\propto B_0 / T$', ru: '$M_0 \\propto B_0 / T$' },
      { de: '$M_0 \\propto B_0 \\cdot T$', ru: '$M_0 \\propto B_0 \\cdot T$' },
      { de: '$M_0 \\propto T / B_0$', ru: '$M_0 \\propto T / B_0$' },
      { de: '$M_0$ ist temperaturunabhängig', ru: '$M_0$ не зависит от температуры' },
    ],
    answer: 0,
    hint: {
      de: 'Das Feld ordnet die Spins, die Wärme bringt sie durcheinander. Was steht also im Zähler, was im Nenner?',
      ru: 'Поле упорядочивает спины, тепло их перемешивает. Что тогда стоит в числителе, а что в знаменателе?',
    },
    explanation: {
      de: '**M₀ wächst mit dem Feld und sinkt mit der Temperatur.** Das Feld will die Spins ausrichten, die Wärmebewegung wirbelt sie durcheinander. Wie bei einer Menschenmenge: Ein lauter Ordner (starkes Feld) sorgt für Ordnung, ein unruhiges Publikum (hohe Temperatur) für Chaos. Curie-Gesetz: M₀ = Nγ²ħ²B₀/(4kT), mit N als Zahl der Spins, k als Boltzmann-Konstante und T als Temperatur. Kältere Proben polarisieren also stärker. Im Körper ist T aber fest bei etwa 310 K. Hyperpolarisation, zum Beispiel von ¹²⁹Xe oder ¹³C, umgeht diese Grenze: Sie erhöht den Überschuss künstlich um den Faktor 10⁴ bis 10⁵.',
      ru: '**M₀ растёт с полем и падает с температурой.** Поле стремится выстроить спины, тепловое движение их перемешивает. Как в толпе: громкий распорядитель (сильное поле) наводит порядок, беспокойная публика (высокая температура) создаёт хаос. Закон Кюри: M₀ = Nγ²ħ²B₀/(4kT), где N число спинов, k постоянная Больцмана, T температура. Значит, более холодные образцы поляризуются сильнее. Но в теле T фиксирована, около 310 K. Гиперполяризация, например ¹²⁹Xe или ¹³C, обходит это ограничение: она искусственно увеличивает избыток примерно в 10⁴ или даже 10⁵ раз.',
    },
  },
];
