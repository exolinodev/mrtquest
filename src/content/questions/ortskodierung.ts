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
          '$\\Delta z = \\Delta f_{\\text{RF}} / (\\bar\\gamma \\, G_s)$ – auf Einheiten achten: mT/m → T/m.',
          '$\\Delta z = \\Delta f_{\\text{РЧ}} / (\\bar\\gamma \\, G_s)$ – следи за единицами: мТл/м → Тл/м.',
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
          `Ты хочешь возбудить срез толщиной ${dz} мм импульсом с полосой пропускания ${n(bw, 2, lang)} Гц. Какая амплитуда градиента выбора среза нужна?`,
        ),
        answer: g,
        tolerance: 0.02,
        unit: t('mT/m', 'мТл/м'),
        explanation: t(
          `$G_s = \\Delta f/(\\bar\\gamma\\,\\Delta z) = ${bw} / (42{,}577\\cdot10^6 \\cdot ${dz}\\cdot10^{-3})\\,\\text{T/m} = ${n(g, 2, lang)}$ mT/m. Dünne Schichten stoßen an die Gradientengrenze (≈ 40–80 mT/m) – alternativ verlängert man den Puls (geringere Bandbreite).`,
          `$G_s = \\Delta f/(\\bar\\gamma\\,\\Delta z) = ${bw} / (42{,}577\\cdot10^6 \\cdot ${dz}\\cdot10^{-3})\\,\\text{Тл/м} = ${n(g, 2, lang)}$ мТл/м. Тонкие срезы упираются в предел градиентной системы (≈ 40–80 мТл/м) – в качестве альтернативы удлиняют импульс (более узкая полоса пропускания).`,
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
        explanation: t(
          `$\\Delta f = \\bar\\gamma\\,G\\,\\Delta x = 42{,}577\\,\\text{MHz/T} \\cdot ${g}\\,\\text{mT/m} \\cdot ${dx}\\,\\text{mm} = ${n(df, 1, lang)}$ Hz. Genau diese Frequenzunterschiede trennt die Fourier-Transformation in Ortspositionen auf.`,
          `$\\Delta f = \\bar\\gamma\\,G\\,\\Delta x = 42{,}577\\,\\text{МГц/Тл} \\cdot ${g}\\,\\text{мТл/м} \\cdot ${dx}\\,\\text{мм} = ${n(df, 1, lang)}$ Гц. Именно эти разности частот преобразование Фурье разделяет на пространственные позиции.`,
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
          `Общая полоса пропускания приёмника составляет ${n(bw / 1000, 2, lang)} кГц (±${n(bw / 2000, 2, lang)} кГц), градиент считывания – ${g} мТл/м. Каково поле обзора (FOV) в направлении считывания?`,
        ),
        answer: fov,
        tolerance: 0.02,
        unit: t('mm', 'мм'),
        hint: t(
          'Die gesamte Bandbreite muss genau das FOV abdecken: $BW = \\bar\\gamma\\,G_x\\,FOV$.',
          'Вся полоса пропускания должна точно охватывать FOV: $BW = \\bar\\gamma\\,G_x\\,FOV$.',
        ),
        explanation: t(
          `$FOV = BW/(\\bar\\gamma G_x) = ${bw}/${hzm}\\,\\text{m} = ${n(fov, 1, lang)}$ mm. Bei gleicher Bandbreite verkleinert ein stärkerer Gradient das FOV.`,
          `$FOV = BW/(\\bar\\gamma G_x) = ${bw}/${hzm}\\,\\text{м} = ${n(fov, 1, lang)}$ мм. При той же полосе пропускания более сильный градиент уменьшает FOV.`,
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
        explanation: t(
          `$z = \\Delta f_{\\text{offset}}/(\\bar\\gamma G_s) = ${off}/${hzm}\\,\\text{m} = ${n(z, 1, lang)}$ mm. Multi-Slice-Messungen verschieben nur die Sendefrequenz – der Gradient bleibt gleich.`,
          `$z = \\Delta f_{\\text{сдвиг}}/(\\bar\\gamma G_s) = ${off}/${hzm}\\,\\text{м} = ${n(z, 1, lang)}$ мм. Многосрезовые измерения смещают только частоту передатчика – градиент остаётся неизменным.`,
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
        explanation: t(
          `$\\Delta x = FOV/N = ${fov}/${nmat} = ${n(fov / nmat, 3, lang)}$ mm. Kleinere Pixel verbessern die Auflösung, verringern aber das Voxelvolumen und damit das SNR proportional.`,
          `$\\Delta x = FOV/N = ${fov}/${nmat} = ${n(fov / nmat, 3, lang)}$ мм. Меньшие пиксели улучшают разрешение, но пропорционально уменьшают объём вокселя, а значит, и SNR.`,
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
    explanation: {
      de: 'Während der Auslese durchläuft das Signal eine ganze k-Raum-Zeile (k_x variiert kontinuierlich). Die Phasenkodierung legt dagegen nur eine k_y-Position fest. N_PE verschiedene Gradientenmomente → N_PE Zeilen. Deshalb gilt TA ∝ TR·N_PE.',
      ru: 'Во время считывания сигнал проходит целую строку k-пространства (k_x меняется непрерывно). Фазовое же кодирование задаёт только одну позицию k_y. N_PE разных градиентных моментов → N_PE строк. Поэтому TA ∝ TR·N_PE.',
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
    explanation: {
      de: 'Unter dem Gradienten hat jede z-Position ihre eigene Resonanzfrequenz. Eine Frequenzverschiebung Δf verschiebt die Schicht um Δz = Δf/(γ̄ G).',
      ru: 'Под действием градиента каждая позиция z имеет собственную резонансную частоту. Сдвиг частоты Δf перемещает срез на Δz = Δf/(γ̄ G).',
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
    explanation: {
      de: 'Δz = Δf/(γ̄G). Die Bandbreite eines Pulses ist umgekehrt proportional zu seiner Dauer. Die Sendeleistung beeinflusst den Flipwinkel, nicht die Schichtdicke.',
      ru: 'Δz = Δf/(γ̄G). Полоса пропускания импульса обратно пропорциональна его длительности. Мощность передатчика влияет на угол отклонения, а не на толщину среза.',
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
        de: 'In Kleinwinkelnäherung ist das Schichtprofil die Fourier-Transformierte der Pulshüllkurve – ein sinc erzeugt ein annähernd rechteckiges Profil.',
        ru: 'В приближении малых углов профиль среза является фурье-образом огибающей импульса – sinc даёт почти прямоугольный профиль.',
      },
      {
        de: 'Weil sinc-Pulse die geringste SAR-Belastung aller denkbaren Pulse haben.',
        ru: 'Потому что sinc-импульсы дают наименьшую нагрузку SAR среди всех возможных импульсов.',
      },
      { de: 'Weil sinc-Pulse die Larmor-Frequenz erhöhen.', ru: 'Потому что sinc-импульсы повышают ларморову частоту.' },
      { de: 'Weil sie keine Rephasierung der Schicht benötigen.', ru: 'Потому что они не требуют рефазирования среза.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ein unendlich langer sinc ergäbe ein perfektes Rechteckprofil; reale, abgeschnittene (gefensterte) sincs liefern leicht verrundete Flanken. Deshalb lässt man zwischen Schichten oft einen Abstand (Gap) bzw. misst verschachtelt, um Cross-Talk zu vermeiden.',
      ru: 'Бесконечно длинный sinc дал бы идеальный прямоугольный профиль; реальные, усечённые (с оконной функцией) sinc-импульсы дают слегка скруглённые края. Поэтому между срезами часто оставляют промежуток (gap) или измеряют их поочерёдно, чтобы избежать перекрёстных помех (cross-talk).',
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
    explanation: {
      de: 'Ohne Rephasierung würde sich das Signal über die Schichtdicke weitgehend auslöschen. Die Fläche des Rephasierers entspricht etwa der Hälfte der Fläche des Schichtgradienten (ab Pulsmitte).',
      ru: 'Без рефазирования сигнал по толщине среза в значительной мере взаимно погасился бы. Площадь рефазирующего лепестка примерно равна половине площади градиента выбора среза (от середины импульса).',
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
    explanation: {
      de: 'Der Prephaser bewegt die k-Raum-Position nach −k_max. Unter dem Auslesegradienten läuft k_x dann durch null (Gradientenecho) bis +k_max.',
      ru: 'Префазирующий градиент перемещает позицию в k-пространстве к −k_max. Под действием градиента считывания k_x затем проходит через ноль (градиентное эхо) до +k_max.',
    },
  },
];
