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
        hint: t('Larmor-Gleichung: $f_0 = \\bar\\gamma \\cdot B_0$.', 'Уравнение Лармора: $f_0 = \\bar\\gamma \\cdot B_0$.'),
        explanation: t(
          `$f_0 = 42{,}577\\,\\text{MHz/T} \\cdot ${n(b0, 2, lang)}\\,\\text{T} = ${n(larmorMHz(b0), 2, lang)}$ MHz – das liegt im UKW-Rundfunkbereich, deshalb braucht der Scanner einen Faradaykäfig.`,
          `$f_0 = 42{,}577\\,\\text{МГц/Тл} \\cdot ${n(b0, 2, lang)}\\,\\text{Тл} = ${n(larmorMHz(b0), 2, lang)}$ МГц – это диапазон УКВ-радиовещания, поэтому сканеру нужна клетка Фарадея.`,
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
          'Jeder Kern hat sein eigenes gyromagnetisches Verhältnis – Spulen sind deshalb kernspezifisch abgestimmt.',
          'У каждого ядра своё гиромагнитное отношение – поэтому катушки настраивают под конкретное ядро.',
        ),
        explanation: t(
          `$f_0 = ${n(nuc.gammaBar, 3, lang)} \\cdot ${n(b0, 2, lang)} = ${n(larmorMHz(b0, nuc.gammaBar), 2, lang)}$ MHz. Für X-Kern-Bildgebung sind eigene (doppelt abgestimmte) Spulen und Breitband-Sender nötig.`,
          `$f_0 = ${n(nuc.gammaBar, 3, lang)} \\cdot ${n(b0, 2, lang)} = ${n(larmorMHz(b0, nuc.gammaBar), 2, lang)}$ МГц. Для визуализации X-ядер нужны отдельные (двухчастотные) катушки и широкополосные передатчики.`,
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
        explanation: t(
          `$B_0 = f_0/\\bar\\gamma = ${n(f, 3, lang)} / 42{,}577 \\approx ${n(b0, 2, lang)}$ T. Der Scanner bestimmt die exakte Mittenfrequenz vor jeder Untersuchung neu, da B₀ minimal driftet und der Patient das Feld verändert.`,
          `$B_0 = f_0/\\bar\\gamma = ${n(f, 3, lang)} / 42{,}577 \\approx ${n(b0, 2, lang)}$ Тл. Сканер заново определяет точную центральную частоту перед каждым исследованием, так как B₀ слегка дрейфует, а пациент изменяет поле.`,
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
          'Im rotierenden Bezugssystem präzediert M um B₁: $\\alpha = \\gamma B_1 \\tau = 360° \\cdot \\bar\\gamma B_1 \\tau$.',
          'Во вращающейся системе отсчёта M прецессирует вокруг B₁: $\\alpha = \\gamma B_1 \\tau = 360° \\cdot \\bar\\gamma B_1 \\tau$.',
        ),
        explanation: t(
          `$\\alpha = 360° \\cdot 42{,}577\\cdot10^6\\,\\text{Hz/T} \\cdot ${n(b1, 2, lang)}\\cdot10^{-6}\\,\\text{T} \\cdot ${n(tau, 2, lang)}\\cdot10^{-3}\\,\\text{s} \\approx ${n(flip, 1, lang)}°$. B₁ ist rund fünf Größenordnungen schwächer als B₀ – nur durch Resonanz wirkt es dennoch.`,
          `$\\alpha = 360° \\cdot 42{,}577\\cdot10^6\\,\\text{Гц/Тл} \\cdot ${n(b1, 2, lang)}\\cdot10^{-6}\\,\\text{Тл} \\cdot ${n(tau, 2, lang)}\\cdot10^{-3}\\,\\text{с} \\approx ${n(flip, 1, lang)}°$. B₁ примерно на пять порядков слабее B₀ – действует оно только благодаря резонансу.`,
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
        hint: t('$h = 6{,}626\\cdot10^{-34}$ J·s, $k = 1{,}381\\cdot10^{-23}$ J/K.', '$h = 6{,}626\\cdot10^{-34}$ Дж·с, $k = 1{,}381\\cdot10^{-23}$ Дж/К.'),
        explanation: t(
          `$\\Delta E = h f_0 = ${n(zeemanEnergy(b0) * 1e26, 2, lang)}\\cdot10^{-26}$ J; $\\Delta E/(2kT) \\approx ${n(ppm, 2, lang)}$ ppm. Nur wenige Protonen pro Million tragen netto zur Magnetisierung bei – dass MRT trotzdem funktioniert, liegt an der enormen Anzahl (~10²² Protonen pro cm³ Wasser). Der Überschuss wächst linear mit B₀ → höheres SNR bei 3 T.`,
          `$\\Delta E = h f_0 = ${n(zeemanEnergy(b0) * 1e26, 2, lang)}\\cdot10^{-26}$ Дж; $\\Delta E/(2kT) \\approx ${n(ppm, 2, lang)}$ ppm. Лишь несколько протонов на миллион вносят вклад в суммарную намагниченность – МРТ всё равно работает благодаря огромному числу протонов (~10²² на см³ воды). Избыток растёт линейно с B₀ → более высокое SNR при 3 Тл.`,
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
    hint: { de: '$\\Delta E = h\\,f_0 = h\\,\\bar\\gamma\\,B_0$', ru: '$\\Delta E = h\\,f_0 = h\\,\\bar\\gamma\\,B_0$' },
    explanation: {
      de: `$\\Delta E = 6{,}626\\cdot10^{-34} \\cdot 127{,}7\\cdot10^{6} \\approx ${n(zeemanEnergy(3) * 1e26, 2, 'de')}\\cdot10^{-26}$ J – rund 10⁶-mal kleiner als die thermische Energie kT ≈ 4,3·10⁻²¹ J. Daher der winzige Spinüberschuss.`,
      ru: `$\\Delta E = 6{,}626\\cdot10^{-34} \\cdot 127{,}7\\cdot10^{6} \\approx ${n(zeemanEnergy(3) * 1e26, 2, 'ru')}\\cdot10^{-26}$ Дж – примерно в 10⁶ раз меньше тепловой энергии kT ≈ 4,3·10⁻²¹ Дж. Отсюда и ничтожный спиновый избыток.`,
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
    explanation: {
      de: 'Signal ∝ Spindichte · γ³ (Moment, Polarisation und Induktion skalieren jeweils mit γ). ¹H hat γ̄ = 42,58 MHz/T und ~110 mol/L Konzentration im Gewebe. Kerne mit gerader Protonen- und Neutronenzahl (z. B. ¹²C, ¹⁶O) haben Spin 0 und sind MR-unsichtbar.',
      ru: 'Сигнал ∝ спиновая плотность · γ³ (момент, поляризация и индукция масштабируются с γ). У ¹H γ̄ = 42,58 МГц/Тл и концентрация ~110 моль/л в тканях. Ядра с чётным числом протонов и нейтронов (напр. ¹²C, ¹⁶O) имеют спин 0 и невидимы для МР.',
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
    explanation: {
      de: 'f₀ = γ̄B₀ und ΔN/N ≈ γħB₀/(2kT) sind beide linear in B₀. Das SNR steigt in der Praxis etwa linear (nicht ganz 2×, da T1 länger wird und SAR-Limits greifen). Gleichzeitig vervierfacht sich das SAR (∝ B₀²) und die chemische Verschiebung in Hz verdoppelt sich.',
      ru: 'f₀ = γ̄B₀ и ΔN/N ≈ γħB₀/(2kT) линейны по B₀. На практике SNR растёт примерно линейно (не совсем в 2×, так как T1 удлиняется и действуют ограничения SAR). Одновременно SAR возрастает вчетверо (∝ B₀²), а химический сдвиг в Гц удваивается.',
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
    explanation: {
      de: 'Im rotierenden Bezugssystem steht B₁ still, M rotiert um B₁ um α = γB₁τ. Nach 90° liegt die gesamte Magnetisierung in der xy-Ebene und induziert als rotierender Magnet eine Spannung in der Empfangsspule (FID). Ein 180°-Puls invertiert dagegen M.',
      ru: 'Во вращающейся системе отсчёта B₁ неподвижно, M поворачивается вокруг B₁ на угол α = γB₁τ. После 90° вся намагниченность лежит в плоскости xy и, как вращающийся магнит, индуцирует напряжение в приёмной катушке (FID). 180°-импульс, напротив, инвертирует M.',
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
    explanation: {
      de: 'Im rotierenden System mit Frequenz ω_RF wirkt das effektive Feld B_eff = (B₀ − ω_RF/γ)·ẑ + B₁·x̂. Nur bei ω_RF = ω₀ verschwindet die z-Komponente und M kippt vollständig. Das ist auch die Grundlage der schichtselektiven Anregung.',
      ru: 'Во вращающейся системе с частотой ω_RF действует эффективное поле B_eff = (B₀ − ω_RF/γ)·ẑ + B₁·x̂. Только при ω_RF = ω₀ z-компонента исчезает и M отклоняется полностью. На этом же основано селективное возбуждение среза.',
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
    explanation: {
      de: 'μ = γ·S. Daraus folgt direkt die Präzessionsfrequenz ω₀ = γB₀. Für Protonen ist γ = 2,675·10⁸ rad/(s·T), also γ̄ = γ/2π = 42,58 MHz/T.',
      ru: 'μ = γ·S. Отсюда непосредственно следует частота прецессии ω₀ = γB₀. Для протонов γ = 2,675·10⁸ рад/(с·Тл), то есть γ̄ = γ/2π = 42,58 МГц/Тл.',
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
        de: 'Ohne Anregung sind die Präzessionsphasen der Spins zufällig verteilt – es gibt keine messbare Quermagnetisierung.',
        ru: 'Без возбуждения фазы прецессии спинов распределены случайно – измеримой поперечной намагниченности нет.',
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
    explanation: {
      de: 'Spins nehmen keine „exakte“ Ausrichtung ein; nur der Mittelwert ergibt M₀ ∥ B₀. Ein statisches M_z ändert den Fluss durch die Spule nicht und induziert daher keine Spannung – messbar ist nur rotierende Quermagnetisierung.',
      ru: 'Спины не принимают «точной» ориентации; лишь среднее даёт M₀ ∥ B₀. Статическая M_z не меняет поток через катушку и поэтому не индуцирует напряжения – измерима только вращающаяся поперечная намагниченность.',
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
    explanation: {
      de: 'Curie-Gesetz: M₀ = Nγ²ħ²B₀/(4kT). Kühlere Proben polarisieren stärker – deshalb funktioniert auch Hyperpolarisation (z. B. ¹²⁹Xe, ¹³C), die den Überschuss künstlich um Faktor 10⁴–10⁵ erhöht.',
      ru: 'Закон Кюри: M₀ = Nγ²ħ²B₀/(4kT). Более холодные образцы поляризуются сильнее – на этом же принципе работает гиперполяризация (напр. ¹²⁹Xe, ¹³C), искусственно увеличивающая избыток в 10⁴–10⁵ раз.',
    },
  },
];
