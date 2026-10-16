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
          `Обчисліть ларморову частоту протонів (¹H, $\\bar\\gamma = 42{,}577$ МГц/Тл) при $B_0 = ${n(b0, 2, lang)}$ Тл.`,
        ),
        answer: larmorMHz(b0),
        tolerance: 0.01,
        unit: t('MHz', 'МГц'),
        hint: t('Larmor-Gleichung: $f_0 = \\bar\\gamma \\cdot B_0$.', 'Рівняння Лармора: $f_0 = \\bar\\gamma \\cdot B_0$.'),
        explanation: t(
          `$f_0 = 42{,}577\\,\\text{MHz/T} \\cdot ${n(b0, 2, lang)}\\,\\text{T} = ${n(larmorMHz(b0), 2, lang)}$ MHz – das liegt im UKW-Rundfunkbereich, deshalb braucht der Scanner einen Faradaykäfig.`,
          `$f_0 = 42{,}577\\,\\text{МГц/Тл} \\cdot ${n(b0, 2, lang)}\\,\\text{Тл} = ${n(larmorMHz(b0), 2, lang)}$ МГц – це діапазон УКХ-радіомовлення, тому сканеру потрібна клітка Фарадея.`,
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
          `Для спектроскопічного вимірювання потрібно збудити ${nuc.label[lang]} при ${n(b0, 2, lang)} Тл ($\\bar\\gamma = ${n(nuc.gammaBar, 3, lang)}$ МГц/Тл). На яку частоту має бути налаштована РЧ-котушка?`,
        ),
        answer: larmorMHz(b0, nuc.gammaBar),
        tolerance: 0.01,
        unit: t('MHz', 'МГц'),
        hint: t(
          'Jeder Kern hat sein eigenes gyromagnetisches Verhältnis – Spulen sind deshalb kernspezifisch abgestimmt.',
          'Кожне ядро має власне гіромагнітне відношення – тому котушки налаштовують під конкретне ядро.',
        ),
        explanation: t(
          `$f_0 = ${n(nuc.gammaBar, 3, lang)} \\cdot ${n(b0, 2, lang)} = ${n(larmorMHz(b0, nuc.gammaBar), 2, lang)}$ MHz. Für X-Kern-Bildgebung sind eigene (doppelt abgestimmte) Spulen und Breitband-Sender nötig.`,
          `$f_0 = ${n(nuc.gammaBar, 3, lang)} \\cdot ${n(b0, 2, lang)} = ${n(larmorMHz(b0, nuc.gammaBar), 2, lang)}$ МГц. Для візуалізації X-ядер потрібні окремі (двочастотні) котушки та широкосмугові передавачі.`,
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
          `У протоколі налаштування сканер показує центральну частоту протонів ${n(f, 3, lang)} МГц. Яка індукція поля магніту?`,
        ),
        answer: b0,
        tolerance: 0.01,
        unit: t('T', 'Тл'),
        explanation: t(
          `$B_0 = f_0/\\bar\\gamma = ${n(f, 3, lang)} / 42{,}577 \\approx ${n(b0, 2, lang)}$ T. Der Scanner bestimmt die exakte Mittenfrequenz vor jeder Untersuchung neu, da B₀ minimal driftet und der Patient das Feld verändert.`,
          `$B_0 = f_0/\\bar\\gamma = ${n(f, 3, lang)} / 42{,}577 \\approx ${n(b0, 2, lang)}$ Тл. Сканер заново визначає точну центральну частоту перед кожним дослідженням, оскільки B₀ незначно дрейфує, а пацієнт змінює поле.`,
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
          `Прямокутний РЧ-імпульс з $B_1 = ${n(b1, 2, lang)}$ мкТл подається протягом ${n(tau, 2, lang)} мс. Який кут відхилення отримують протони?`,
        ),
        answer: flip,
        tolerance: 0.02,
        unit: '°',
        hint: t(
          'Im rotierenden Bezugssystem präzediert M um B₁: $\\alpha = \\gamma B_1 \\tau = 360° \\cdot \\bar\\gamma B_1 \\tau$.',
          'В обертовій системі відліку M прецесує навколо B₁: $\\alpha = \\gamma B_1 \\tau = 360° \\cdot \\bar\\gamma B_1 \\tau$.',
        ),
        explanation: t(
          `$\\alpha = 360° \\cdot 42{,}577\\cdot10^6\\,\\text{Hz/T} \\cdot ${n(b1, 2, lang)}\\cdot10^{-6}\\,\\text{T} \\cdot ${n(tau, 2, lang)}\\cdot10^{-3}\\,\\text{s} \\approx ${n(flip, 1, lang)}°$. B₁ ist rund fünf Größenordnungen schwächer als B₀ – nur durch Resonanz wirkt es dennoch.`,
          `$\\alpha = 360° \\cdot 42{,}577\\cdot10^6\\,\\text{Гц/Тл} \\cdot ${n(b1, 2, lang)}\\cdot10^{-6}\\,\\text{Тл} \\cdot ${n(tau, 2, lang)}\\cdot10^{-3}\\,\\text{с} \\approx ${n(flip, 1, lang)}°$. B₁ приблизно на п’ять порядків слабше за B₀ – діє воно лише завдяки резонансу.`,
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
          `Оцініть відносний надлишок спінів $\\Delta N/N \\approx h f_0 /(2kT)$ для протонів при ${n(b0, 2, lang)} Тл і температурі тіла (310 K). Відповідь у ppm (мільйонних частках).`,
        ),
        answer: ppm,
        tolerance: 0.05,
        unit: 'ppm',
        hint: t('$h = 6{,}626\\cdot10^{-34}$ J·s, $k = 1{,}381\\cdot10^{-23}$ J/K.', '$h = 6{,}626\\cdot10^{-34}$ Дж·с, $k = 1{,}381\\cdot10^{-23}$ Дж/К.'),
        explanation: t(
          `$\\Delta E = h f_0 = ${n(zeemanEnergy(b0) * 1e26, 2, lang)}\\cdot10^{-26}$ J; $\\Delta E/(2kT) \\approx ${n(ppm, 2, lang)}$ ppm. Nur wenige Protonen pro Million tragen netto zur Magnetisierung bei – dass MRT trotzdem funktioniert, liegt an der enormen Anzahl (~10²² Protonen pro cm³ Wasser). Der Überschuss wächst linear mit B₀ → höheres SNR bei 3 T.`,
          `$\\Delta E = h f_0 = ${n(zeemanEnergy(b0) * 1e26, 2, lang)}\\cdot10^{-26}$ Дж; $\\Delta E/(2kT) \\approx ${n(ppm, 2, lang)}$ ppm. Лише кілька протонів на мільйон дають внесок у сумарну намагніченість – МРТ усе одно працює завдяки величезній кількості протонів (~10²² на см³ води). Надлишок зростає лінійно з B₀ → вищий SNR при 3 Тл.`,
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
      uk: 'Яка різниця енергій $\\Delta E$ між двома спіновими станами протона при 3 Тл? Дайте відповідь в одиницях $10^{-26}$ Дж.',
    },
    answer: zeemanEnergy(3) * 1e26,
    tolerance: 0.02,
    unit: { de: '×10⁻²⁶ J', uk: '×10⁻²⁶ Дж' },
    hint: { de: '$\\Delta E = h\\,f_0 = h\\,\\bar\\gamma\\,B_0$', uk: '$\\Delta E = h\\,f_0 = h\\,\\bar\\gamma\\,B_0$' },
    explanation: {
      de: `$\\Delta E = 6{,}626\\cdot10^{-34} \\cdot 127{,}7\\cdot10^{6} \\approx ${n(zeemanEnergy(3) * 1e26, 2, 'de')}\\cdot10^{-26}$ J – rund 10⁶-mal kleiner als die thermische Energie kT ≈ 4,3·10⁻²¹ J. Daher der winzige Spinüberschuss.`,
      uk: `$\\Delta E = 6{,}626\\cdot10^{-34} \\cdot 127{,}7\\cdot10^{6} \\approx ${n(zeemanEnergy(3) * 1e26, 2, 'uk')}\\cdot10^{-26}$ Дж – приблизно в 10⁶ разів менше за теплову енергію kT ≈ 4,3·10⁻²¹ Дж. Звідси й мізерний надлишок спінів.`,
    },
  },
  {
    id: 'ks-why-h',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Warum basiert die klinische MRT fast ausschließlich auf dem Wasserstoffkern ¹H?',
      uk: 'Чому клінічна МРТ майже виключно ґрунтується на ядрі водню ¹H?',
    },
    options: [
      {
        de: 'Er hat das größte gyromagnetische Verhältnis der stabilen Kerne und kommt in Wasser und Fett in sehr hoher Konzentration vor.',
        uk: 'Воно має найбільше гіромагнітне відношення серед стабільних ядер і присутнє у воді та жирі в дуже високій концентрації.',
      },
      { de: 'Er ist der einzige Kern mit Spin ≠ 0.', uk: 'Це єдине ядро зі спіном ≠ 0.' },
      {
        de: 'Er besitzt eine gerade Anzahl an Nukleonen und daher ein großes magnetisches Moment.',
        uk: 'Воно має парну кількість нуклонів і тому великий магнітний момент.',
      },
      {
        de: 'Seine Larmor-Frequenz liegt im Mikrowellenbereich und ist deshalb leicht messbar.',
        uk: 'Його ларморова частота лежить у мікрохвильовому діапазоні, тому її легко виміряти.',
      },
    ],
    answer: 0,
    explanation: {
      de: 'Signal ∝ Spindichte · γ³ (Moment, Polarisation und Induktion skalieren jeweils mit γ). ¹H hat γ̄ = 42,58 MHz/T und ~110 mol/L Konzentration im Gewebe. Kerne mit gerader Protonen- und Neutronenzahl (z. B. ¹²C, ¹⁶O) haben Spin 0 und sind MR-unsichtbar.',
      uk: 'Сигнал ∝ спінова густина · γ³ (момент, поляризація та індукція масштабуються з γ). ¹H має γ̄ = 42,58 МГц/Тл і концентрацію ~110 моль/л у тканинах. Ядра з парною кількістю протонів і нейтронів (напр. ¹²C, ¹⁶O) мають спін 0 і невидимі для МР.',
    },
  },
  {
    id: 'ks-double',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Was passiert, wenn man $B_0$ von 1,5 T auf 3 T verdoppelt (alles andere gleich)?',
      uk: 'Що станеться, якщо подвоїти $B_0$ з 1,5 Тл до 3 Тл (за інших рівних умов)?',
    },
    options: [
      {
        de: 'Larmor-Frequenz und Spinüberschuss verdoppeln sich; das SNR steigt grob um den Faktor 2.',
        uk: 'Ларморова частота та надлишок спінів подвоюються; SNR зростає приблизно вдвічі.',
      },
      {
        de: 'Die Larmor-Frequenz verdoppelt sich, der Spinüberschuss bleibt gleich.',
        uk: 'Ларморова частота подвоюється, надлишок спінів залишається незмінним.',
      },
      { de: 'Die Larmor-Frequenz vervierfacht sich, da ω ∝ B₀².', uk: 'Ларморова частота зростає вчетверо, оскільки ω ∝ B₀².' },
      {
        de: 'Nur T2 verdoppelt sich, alle anderen Größen bleiben konstant.',
        uk: 'Подвоюється лише T2, усі інші величини залишаються сталими.',
      },
    ],
    answer: 0,
    explanation: {
      de: 'f₀ = γ̄B₀ und ΔN/N ≈ γħB₀/(2kT) sind beide linear in B₀. Das SNR steigt in der Praxis etwa linear (nicht ganz 2×, da T1 länger wird und SAR-Limits greifen). Gleichzeitig vervierfacht sich das SAR (∝ B₀²) und die chemische Verschiebung in Hz verdoppelt sich.',
      uk: 'f₀ = γ̄B₀ і ΔN/N ≈ γħB₀/(2kT) обидва лінійні за B₀. На практиці SNR зростає приблизно лінійно (не зовсім у 2×, бо T1 подовжується і діють обмеження SAR). Водночас SAR зростає вчетверо (∝ B₀²), а хімічний зсув у Гц подвоюється.',
    },
  },
  {
    id: 'ks-90pulse',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Was bewirkt ein resonanter 90°-HF-Puls auf die Nettomagnetisierung $\\vec M$?',
      uk: 'Як резонансний 90°-РЧ-імпульс діє на сумарну намагніченість $\\vec M$?',
    },
    options: [
      {
        de: 'Er kippt $\\vec M$ vollständig in die Transversalebene: $M_z = 0$, $M_{\\text{xy}} = M_0$, und die Spins präzedieren phasenkohärent.',
        uk: 'Він повністю відхиляє $\\vec M$ у поперечну площину: $M_z = 0$, $M_{\\text{xy}} = M_0$, і спіни прецесують фазово когерентно.',
      },
      { de: 'Er verdoppelt die Längsmagnetisierung $M_z$.', uk: 'Він подвоює поздовжню намагніченість $M_z$.' },
      { de: 'Er invertiert $\\vec M$ auf $-M_0$ entlang z.', uk: 'Він інвертує $\\vec M$ до $-M_0$ уздовж z.' },
      {
        de: 'Er stoppt die Präzession der Spins für die Dauer der Messung.',
        uk: 'Він зупиняє прецесію спінів на час вимірювання.',
      },
    ],
    answer: 0,
    explanation: {
      de: 'Im rotierenden Bezugssystem steht B₁ still, M rotiert um B₁ um α = γB₁τ. Nach 90° liegt die gesamte Magnetisierung in der xy-Ebene und induziert als rotierender Magnet eine Spannung in der Empfangsspule (FID). Ein 180°-Puls invertiert dagegen M.',
      uk: 'В обертовій системі відліку B₁ нерухоме, M обертається навколо B₁ на кут α = γB₁τ. Після 90° уся намагніченість лежить у площині xy і, як обертовий магніт, індукує напругу в приймальній котушці (FID). Натомість 180°-імпульс інвертує M.',
    },
  },
  {
    id: 'ks-resonance',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum muss das HF-Feld $B_1$ exakt mit der Larmor-Frequenz rotieren?',
      uk: 'Чому РЧ-поле $B_1$ має обертатися точно з ларморовою частотою?',
    },
    options: [
      {
        de: 'Nur dann ruht B₁ im mitrotierenden Bezugssystem der Spins und kann M kumulativ auskippen; bei Fehlabstimmung bleibt ein effektives Feld entlang z übrig.',
        uk: 'Лише тоді B₁ нерухоме в обертовій разом зі спінами системі відліку і може накопичувально відхиляти M; при розстроюванні залишається ефективне поле вздовж z.',
      },
      { de: 'Weil sonst die Gradientenspulen überhitzen.', uk: 'Бо інакше градієнтні котушки перегріваються.' },
      {
        de: 'Weil die Larmor-Frequenz die Abtastrate des Analog-Digital-Wandlers festlegt.',
        uk: 'Бо ларморова частота задає частоту дискретизації аналого-цифрового перетворювача.',
      },
      {
        de: 'Weil B₁ andernfalls B₀ verstärkt und den Magneten quenchen würde.',
        uk: 'Бо інакше B₁ підсилило б B₀ і спричинило квенч магніту.',
      },
    ],
    answer: 0,
    explanation: {
      de: 'Im rotierenden System mit Frequenz ω_RF wirkt das effektive Feld B_eff = (B₀ − ω_RF/γ)·ẑ + B₁·x̂. Nur bei ω_RF = ω₀ verschwindet die z-Komponente und M kippt vollständig. Das ist auch die Grundlage der schichtselektiven Anregung.',
      uk: 'В обертовій системі з частотою ω_RF діє ефективне поле B_eff = (B₀ − ω_RF/γ)·ẑ + B₁·x̂. Лише при ω_RF = ω₀ z-компонента зникає і M відхиляється повністю. На цьому ж ґрунтується селективне збудження зрізу.',
    },
  },
  {
    id: 'ks-gamma-def',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Was beschreibt das gyromagnetische Verhältnis γ?', uk: 'Що описує гіромагнітне відношення γ?' },
    options: [
      {
        de: 'Das Verhältnis von magnetischem Moment zu Drehimpuls (Spin) eines Teilchens.',
        uk: 'Відношення магнітного моменту частинки до її моменту імпульсу (спіну).',
      },
      { de: 'Das Verhältnis von Längs- zu Querrelaxationszeit.', uk: 'Відношення часу поздовжньої до часу поперечної релаксації.' },
      { de: 'Das Verhältnis von HF-Leistung zu Körpermasse.', uk: 'Відношення РЧ-потужності до маси тіла.' },
      { de: 'Das Verhältnis von Gradientenstärke zu Schichtdicke.', uk: 'Відношення амплітуди градієнта до товщини зрізу.' },
    ],
    answer: 0,
    explanation: {
      de: 'μ = γ·S. Daraus folgt direkt die Präzessionsfrequenz ω₀ = γB₀. Für Protonen ist γ = 2,675·10⁸ rad/(s·T), also γ̄ = γ/2π = 42,58 MHz/T.',
      uk: 'μ = γ·S. Звідси безпосередньо випливає частота прецесії ω₀ = γB₀. Для протонів γ = 2,675·10⁸ рад/(с·Тл), тобто γ̄ = γ/2π = 42,58 МГц/Тл.',
    },
  },
  {
    id: 'ks-multi-precession',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Aussagen über Spins im statischen Magnetfeld sind korrekt? (Mehrfachauswahl)',
      uk: 'Які твердження про спіни в статичному магнітному полі правильні? (кілька варіантів)',
    },
    options: [
      { de: 'Die Präzessionsfrequenz ist proportional zu B₀.', uk: 'Частота прецесії пропорційна B₀.' },
      {
        de: 'Ohne Anregung sind die Präzessionsphasen der Spins zufällig verteilt – es gibt keine messbare Quermagnetisierung.',
        uk: 'Без збудження фази прецесії спінів розподілені випадково – вимірюваної поперечної намагніченості немає.',
      },
      { de: 'Alle Spins richten sich exakt parallel zu B₀ aus.', uk: 'Усі спіни орієнтуються строго паралельно B₀.' },
      {
        de: 'Die makroskopische Längsmagnetisierung M₀ entsteht durch den kleinen thermischen Besetzungsüberschuss des energieärmeren Zustands.',
        uk: 'Макроскопічна поздовжня намагніченість M₀ виникає через невеликий тепловий надлишок заселеності нижчого енергетичного стану.',
      },
      {
        de: 'Die Längsmagnetisierung M₀ erzeugt in einer Empfangsspule ein messbares Wechselspannungssignal.',
        uk: 'Поздовжня намагніченість M₀ створює в приймальній котушці вимірюваний сигнал змінної напруги.',
      },
    ],
    answers: [0, 1, 3],
    explanation: {
      de: 'Spins nehmen keine „exakte“ Ausrichtung ein; nur der Mittelwert ergibt M₀ ∥ B₀. Ein statisches M_z ändert den Fluss durch die Spule nicht und induziert daher keine Spannung – messbar ist nur rotierende Quermagnetisierung.',
      uk: 'Спіни не набувають «точної» орієнтації; лише середнє дає M₀ ∥ B₀. Статична M_z не змінює потік через котушку і тому не індукує напруги – вимірюється лише обертова поперечна намагніченість.',
    },
  },
  {
    id: 'ks-boltzmann-temp',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Wie ändert sich die Gleichgewichtsmagnetisierung $M_0$ mit der Temperatur (Curie-Gesetz)?',
      uk: 'Як рівноважна намагніченість $M_0$ залежить від температури (закон Кюрі)?',
    },
    options: [
      { de: '$M_0 \\propto B_0 / T$', uk: '$M_0 \\propto B_0 / T$' },
      { de: '$M_0 \\propto B_0 \\cdot T$', uk: '$M_0 \\propto B_0 \\cdot T$' },
      { de: '$M_0 \\propto T / B_0$', uk: '$M_0 \\propto T / B_0$' },
      { de: '$M_0$ ist temperaturunabhängig', uk: '$M_0$ не залежить від температури' },
    ],
    answer: 0,
    explanation: {
      de: 'Curie-Gesetz: M₀ = Nγ²ħ²B₀/(4kT). Kühlere Proben polarisieren stärker – deshalb funktioniert auch Hyperpolarisation (z. B. ¹²⁹Xe, ¹³C), die den Überschuss künstlich um Faktor 10⁴–10⁵ erhöht.',
      uk: 'Закон Кюрі: M₀ = Nγ²ħ²B₀/(4kT). Холодніші зразки поляризуються сильніше – на цьому ж принципі працює гіперполяризація (напр. ¹²⁹Xe, ¹³C), що штучно збільшує надлишок у 10⁴–10⁵ разів.',
    },
  },
];
