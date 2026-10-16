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
          `Зрізоселективний імпульс має смугу пропускання ${n(bw, 2, lang)} Гц, градієнт вибору зрізу становить ${g} мТл/м. Яка товщина збудженого зрізу?`,
        ),
        answer: dz,
        tolerance: 0.02,
        unit: t('mm', 'мм'),
        hint: t(
          '$\\Delta z = \\Delta f_{\\text{RF}} / (\\bar\\gamma \\, G_s)$ – auf Einheiten achten: mT/m → T/m.',
          '$\\Delta z = \\Delta f_{\\text{RF}} / (\\bar\\gamma \\, G_s)$ – зверніть увагу на одиниці: мТл/м → Тл/м.',
        ),
        explanation: t(
          `$\\bar\\gamma G_s = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} = ${hzm}$ Hz/m → $\\Delta z = ${bw}/${hzm}\\,\\text{m} = ${n(dz, 2, lang)}$ mm.`,
          `$\\bar\\gamma G_s = 42{,}577\\cdot10^6 \\cdot ${g}\\cdot10^{-3} = ${hzm}$ Гц/м → $\\Delta z = ${bw}/${hzm}\\,\\text{м} = ${n(dz, 2, lang)}$ мм.`,
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
          `Потрібно збудити зріз товщиною ${dz} мм імпульсом зі смугою пропускання ${n(bw, 2, lang)} Гц. Яка амплітуда градієнта вибору зрізу необхідна?`,
        ),
        answer: g,
        tolerance: 0.02,
        unit: t('mT/m', 'мТл/м'),
        explanation: t(
          `$G_s = \\Delta f/(\\bar\\gamma\\,\\Delta z) = ${bw} / (42{,}577\\cdot10^6 \\cdot ${dz}\\cdot10^{-3})\\,\\text{T/m} = ${n(g, 2, lang)}$ mT/m. Dünne Schichten stoßen an die Gradientengrenze (≈ 40–80 mT/m) – alternativ verlängert man den Puls (geringere Bandbreite).`,
          `$G_s = \\Delta f/(\\bar\\gamma\\,\\Delta z) = ${bw} / (42{,}577\\cdot10^6 \\cdot ${dz}\\cdot10^{-3})\\,\\text{Тл/м} = ${n(g, 2, lang)}$ мТл/м. Тонкі зрізи впираються в межу градієнтної системи (≈ 40–80 мТл/м) – як альтернативу подовжують імпульс (менша смуга пропускання).`,
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
          `Під час зчитування увімкнено градієнт частотного кодування ${g} мТл/м. На скільки Гц відрізняються частоти прецесії двох протонів, розташованих на відстані ${dx} мм один від одного?`,
        ),
        answer: df,
        tolerance: 0.02,
        unit: t('Hz', 'Гц'),
        explanation: t(
          `$\\Delta f = \\bar\\gamma\\,G\\,\\Delta x = 42{,}577\\,\\text{MHz/T} \\cdot ${g}\\,\\text{mT/m} \\cdot ${dx}\\,\\text{mm} = ${n(df, 1, lang)}$ Hz. Genau diese Frequenzunterschiede trennt die Fourier-Transformation in Ortspositionen auf.`,
          `$\\Delta f = \\bar\\gamma\\,G\\,\\Delta x = 42{,}577\\,\\text{МГц/Тл} \\cdot ${g}\\,\\text{мТл/м} \\cdot ${dx}\\,\\text{мм} = ${n(df, 1, lang)}$ Гц. Саме ці різниці частот перетворення Фур’є розділяє на просторові позиції.`,
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
          `Загальна смуга пропускання приймача становить ${n(bw / 1000, 2, lang)} кГц (±${n(bw / 2000, 2, lang)} кГц), градієнт зчитування – ${g} мТл/м. Яке поле огляду (FOV) у напрямку зчитування?`,
        ),
        answer: fov,
        tolerance: 0.02,
        unit: t('mm', 'мм'),
        hint: t(
          'Die gesamte Bandbreite muss genau das FOV abdecken: $BW = \\bar\\gamma\\,G_x\\,FOV$.',
          'Уся смуга пропускання має точно охоплювати FOV: $BW = \\bar\\gamma\\,G_x\\,FOV$.',
        ),
        explanation: t(
          `$FOV = BW/(\\bar\\gamma G_x) = ${bw}/${hzm}\\,\\text{m} = ${n(fov, 1, lang)}$ mm. Bei gleicher Bandbreite verkleinert ein stärkerer Gradient das FOV.`,
          `$FOV = BW/(\\bar\\gamma G_x) = ${bw}/${hzm}\\,\\text{м} = ${n(fov, 1, lang)}$ мм. За однакової смуги пропускання сильніший градієнт зменшує FOV.`,
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
          `За градієнта вибору зрізу ${g} мТл/м частоту передавача зсунуто на +${n(off, 2, lang)} Гц відносно центральної частоти. На якій відстані від ізоцентру розташований збуджений зріз?`,
        ),
        answer: z,
        tolerance: 0.02,
        unit: t('mm', 'мм'),
        explanation: t(
          `$z = \\Delta f_{\\text{offset}}/(\\bar\\gamma G_s) = ${off}/${hzm}\\,\\text{m} = ${n(z, 1, lang)}$ mm. Multi-Slice-Messungen verschieben nur die Sendefrequenz – der Gradient bleibt gleich.`,
          `$z = \\Delta f_{\\text{зсув}}/(\\bar\\gamma G_s) = ${off}/${hzm}\\,\\text{м} = ${n(z, 1, lang)}$ мм. Багатозрізові вимірювання зсувають лише частоту передавача – градієнт залишається незмінним.`,
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
          `FOV = ${fov} мм, матриця ${nmat} у напрямку зчитування. Який розмір пікселя?`,
        ),
        answer: fov / nmat,
        tolerance: 0.01,
        unit: t('mm', 'мм'),
        explanation: t(
          `$\\Delta x = FOV/N = ${fov}/${nmat} = ${n(fov / nmat, 3, lang)}$ mm. Kleinere Pixel verbessern die Auflösung, verringern aber das Voxelvolumen und damit das SNR proportional.`,
          `$\\Delta x = FOV/N = ${fov}/${nmat} = ${n(fov / nmat, 3, lang)}$ мм. Менші пікселі покращують роздільну здатність, але пропорційно зменшують об’єм вокселя, а отже й SNR.`,
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
      uk: 'Чому для кожного рядка фазового кодування послідовність потрібно збуджувати заново (або формувати нове ехо), тоді як частотне кодування вдається за одне зчитування?',
    },
    options: [
      {
        de: 'Pro Echo wird genau ein Phasenkodierschritt (eine k-Raum-Zeile) eingeprägt; die Ortsinformation in Phasenrichtung entsteht erst aus der Serie unterschiedlicher Phasenmomente.',
        uk: 'За одне ехо задається рівно один крок фазового кодування (один рядок k-простору); просторова інформація у фазовому напрямку виникає лише із серії різних фазових моментів.',
      },
      {
        de: 'Weil der Phasengradient nur einmal pro Sekunde geschaltet werden kann.',
        uk: 'Тому що фазовий градієнт можна вмикати лише раз на секунду.',
      },
      {
        de: 'Weil die Phasenkodierung mit Hochfrequenz statt mit Gradienten arbeitet.',
        uk: 'Тому що фазове кодування працює з радіочастотою, а не з градієнтами.',
      },
      {
        de: 'Weil der ADC während des Phasengradienten ausgeschaltet sein muss, um die Spule zu schützen.',
        uk: 'Тому що АЦП під час фазового градієнта має бути вимкнений, щоб захистити котушку.',
      },
    ],
    answer: 0,
    explanation: {
      de: 'Während der Auslese durchläuft das Signal eine ganze k-Raum-Zeile (k_x variiert kontinuierlich). Die Phasenkodierung legt dagegen nur eine k_y-Position fest. N_PE verschiedene Gradientenmomente → N_PE Zeilen. Deshalb gilt TA ∝ TR·N_PE.',
      uk: 'Під час зчитування сигнал проходить цілий рядок k-простору (k_x змінюється неперервно). Фазове кодування ж задає лише одну позицію k_y. N_PE різних градієнтних моментів → N_PE рядків. Тому TA ∝ TR·N_PE.',
    },
  },
  {
    id: 'ok-shift-slice',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Wie verschiebt der Scanner die Position einer Schicht, ohne den Patienten zu bewegen?',
      uk: 'Як сканер зсуває положення зрізу, не переміщуючи пацієнта?',
    },
    options: [
      {
        de: 'Durch Änderung der Mittenfrequenz (Offset) des HF-Pulses bei gleichem Schichtgradienten.',
        uk: 'Зміною центральної частоти (зсуву) РЧ-імпульсу за незмінного градієнта вибору зрізу.',
      },
      { de: 'Durch Änderung der Polarität des Auslesegradienten.', uk: 'Зміною полярності градієнта зчитування.' },
      { de: 'Durch Erhöhung der Feldstärke B₀.', uk: 'Збільшенням індукції поля B₀.' },
      { de: 'Durch Umschalten auf eine andere Empfangsspule.', uk: 'Перемиканням на іншу приймальну котушку.' },
    ],
    answer: 0,
    explanation: {
      de: 'Unter dem Gradienten hat jede z-Position ihre eigene Resonanzfrequenz. Eine Frequenzverschiebung Δf verschiebt die Schicht um Δz = Δf/(γ̄ G).',
      uk: 'Під дією градієнта кожна позиція z має власну резонансну частоту. Зсув частоти Δf переміщує зріз на Δz = Δf/(γ̄ G).',
    },
  },
  {
    id: 'ok-thin',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Maßnahmen führen zu einer dünneren Schicht? (Mehrfachauswahl)',
      uk: 'Які заходи дають тонший зріз? (кілька варіантів)',
    },
    options: [
      { de: 'Stärkerer Schichtgradient', uk: 'Сильніший градієнт вибору зрізу' },
      { de: 'Längerer HF-Puls (geringere Bandbreite)', uk: 'Довший РЧ-імпульс (вужча смуга пропускання)' },
      { de: 'Höhere Sendeleistung bei gleicher Pulsdauer', uk: 'Вища потужність передавача за тієї ж тривалості імпульсу' },
      { de: 'Größeres FOV', uk: 'Більше FOV' },
    ],
    answers: [0, 1],
    explanation: {
      de: 'Δz = Δf/(γ̄G). Die Bandbreite eines Pulses ist umgekehrt proportional zu seiner Dauer. Die Sendeleistung beeinflusst den Flipwinkel, nicht die Schichtdicke.',
      uk: 'Δz = Δf/(γ̄G). Смуга пропускання імпульсу обернено пропорційна його тривалості. Потужність передавача впливає на кут відхилення, а не на товщину зрізу.',
    },
  },
  {
    id: 'ok-sinc',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum verwendet man für die Schichtanregung sinc-förmige HF-Pulse?',
      uk: 'Чому для збудження зрізу використовують РЧ-імпульси у формі sinc?',
    },
    options: [
      {
        de: 'In Kleinwinkelnäherung ist das Schichtprofil die Fourier-Transformierte der Pulshüllkurve – ein sinc erzeugt ein annähernd rechteckiges Profil.',
        uk: 'У наближенні малих кутів профіль зрізу є Фур’є-образом обвідної імпульсу – sinc дає майже прямокутний профіль.',
      },
      {
        de: 'Weil sinc-Pulse die geringste SAR-Belastung aller denkbaren Pulse haben.',
        uk: 'Тому що sinc-імпульси мають найменше навантаження SAR серед усіх можливих імпульсів.',
      },
      { de: 'Weil sinc-Pulse die Larmor-Frequenz erhöhen.', uk: 'Тому що sinc-імпульси підвищують ларморову частоту.' },
      { de: 'Weil sie keine Rephasierung der Schicht benötigen.', uk: 'Тому що вони не потребують рефазування зрізу.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ein unendlich langer sinc ergäbe ein perfektes Rechteckprofil; reale, abgeschnittene (gefensterte) sincs liefern leicht verrundete Flanken. Deshalb lässt man zwischen Schichten oft einen Abstand (Gap) bzw. misst verschachtelt, um Cross-Talk zu vermeiden.',
      uk: 'Нескінченно довгий sinc дав би ідеальний прямокутний профіль; реальні, обрізані (з віконною функцією) sinc-імпульси дають дещо заокруглені краї. Тому між зрізами часто залишають проміжок (gap) або вимірюють їх почергово, щоб уникнути перехресних завад (cross-talk).',
    },
  },
  {
    id: 'ok-rephase',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Wozu dient der kurze, umgepolte Gradientenlobus direkt nach dem Schichtselektionsgradienten?',
      uk: 'Для чого потрібна коротка пелюстка градієнта зворотної полярності одразу після градієнта вибору зрізу?',
    },
    options: [
      {
        de: 'Er rephasiert die Spins über die Schichtdicke, die während der Anregung unter dem Gradienten unterschiedlich viel Phase akkumuliert haben (ca. halbe Gradientenfläche).',
        uk: 'Вона рефазує спіни по товщині зрізу, які під час збудження під дією градієнта набули різної фази (приблизно половина площі градієнта).',
      },
      {
        de: 'Er invertiert die Magnetisierung für eine Inversion Recovery.',
        uk: 'Вона інвертує намагніченість для інверсії-відновлення.',
      },
      { de: 'Er erzeugt die Phasenkodierung.', uk: 'Вона створює фазове кодування.' },
      { de: 'Er kompensiert die Wirbelströme in der Kryostatwand.', uk: 'Вона компенсує вихрові струми в стінці кріостата.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ohne Rephasierung würde sich das Signal über die Schichtdicke weitgehend auslöschen. Die Fläche des Rephasierers entspricht etwa der Hälfte der Fläche des Schichtgradienten (ab Pulsmitte).',
      uk: 'Без рефазування сигнал по товщині зрізу здебільшого взаємно погасився б. Площа рефазувальної пелюстки дорівнює приблизно половині площі градієнта вибору зрізу (від середини імпульсу).',
    },
  },
  {
    id: 'ok-readout-dephase',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum wird vor dem Auslesegradienten ein Dephasiergradient mit umgekehrter Polarität geschaltet?',
      uk: 'Чому перед градієнтом зчитування вмикають дефазувальний градієнт зворотної полярності?',
    },
    options: [
      {
        de: 'Damit das Echo (k_x = 0) in der Mitte des Auslesefensters entsteht und der k-Raum symmetrisch von −k_max bis +k_max abgetastet wird.',
        uk: 'Щоб ехо (k_x = 0) виникало в середині вікна зчитування, а k-простір дискретизувався симетрично від −k_max до +k_max.',
      },
      { de: 'Um T2*-Effekte vollständig zu eliminieren.', uk: 'Щоб повністю усунути T2*-ефекти.' },
      { de: 'Um die Gradientenspulen zu entmagnetisieren.', uk: 'Щоб розмагнітити градієнтні котушки.' },
      { de: 'Um die Schichtdicke festzulegen.', uk: 'Щоб задати товщину зрізу.' },
    ],
    answer: 0,
    explanation: {
      de: 'Der Prephaser bewegt die k-Raum-Position nach −k_max. Unter dem Auslesegradienten läuft k_x dann durch null (Gradientenecho) bis +k_max.',
      uk: 'Префазувальний градієнт переміщує позицію в k-просторі до −k_max. Під дією градієнта зчитування k_x потім проходить через нуль (градієнтне ехо) до +k_max.',
    },
  },
];
