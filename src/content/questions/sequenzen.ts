import { TISSUES } from '../../physics/constants';
import { ernstAngleDeg, fatWaterPhaseTimes, nullPointTI, scanTimeSeconds } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

export const sequenzenQuestions: QuestionSource[] = [
  {
    id: 'sq-ta',
    generate: (rng, lang) => {
      const t = tl(lang);
      const tr = pick(rng, [3000, 4000, 5000]);
      const ny = pick(rng, [256, 320, 384]);
      const nex = pick(rng, [1, 2]);
      const etl = pick(rng, [8, 12, 16, 24]);
      const ta = scanTimeSeconds(tr, ny, nex, etl);
      return {
        kind: 'numeric',
        id: 'sq-ta',
        difficulty: 1,
        prompt: t(
          `Berechne die Messzeit einer 2D-TSE: TR = ${tr} ms, ${ny} Phasenkodierschritte, NEX = ${nex}, Echozuglänge (ETL) = ${etl}.`,
          `Рассчитай время сканирования 2D-TSE: TR = ${tr} мс, ${ny} шагов фазового кодирования, NEX = ${nex}, длина эхо-цепочки (ETL) = ${etl}.`,
        ),
        answer: ta,
        tolerance: 0.02,
        unit: t('s', 'с'),
        hint: '$TA = TR \\cdot N_{\\text{PE}} \\cdot NEX / ETL$',
        explanation: t(
          `TA = ${tr / 1000} s · ${ny} · ${nex} / ${etl} = ${n(ta, 1, lang)} s. Gegenüber einem SE (ETL = 1) ist die TSE ${etl}-mal schneller.`,
          `TA = ${tr / 1000} с · ${ny} · ${nex} / ${etl} = ${n(ta, 1, lang)} с. По сравнению с SE (ETL = 1) TSE быстрее в ${etl} раз.`,
        ),
      };
    },
  },
  {
    id: 'sq-stir',
    generate: (rng, lang) => {
      const t = tl(lang);
      const field = pick(rng, [1.5, 3] as const);
      const t1 = TISSUES.fat.params[field].t1;
      const ti = t1 * Math.LN2;
      return {
        kind: 'numeric',
        id: 'sq-stir',
        difficulty: 2,
        prompt: t(
          `Fett hat bei ${n(field, 2, lang)} T ein T1 von ${t1} ms. Welche Inversionszeit nullt das Fettsignal in einer STIR (Näherung TR ≫ T1)?`,
          `При ${n(field, 2, lang)} Тл жир имеет T1 = ${t1} мс. Какое время инверсии обнуляет сигнал жира в STIR (приближение TR ≫ T1)?`,
        ),
        answer: ti,
        tolerance: 0.03,
        unit: t('ms', 'мс'),
        hint: t('Am Nulldurchgang gilt $M_z = M_0(1 - 2e^{-TI/T_1}) = 0$.', 'В точке перехода через ноль $M_z = M_0(1 - 2e^{-TI/T_1}) = 0$.'),
        explanation: t(
          `$TI = T_1 \\ln 2 = ${t1} \\cdot 0{,}693 = ${n(ti, 0, lang)}$ ms. Weil die Feldstärke T1 verlängert, ist die STIR-TI bei 3 T länger als bei 1,5 T.`,
          `$TI = T_1 \\ln 2 = ${t1} \\cdot 0{,}693 = ${n(ti, 0, lang)}$ мс. Поскольку более сильное поле удлиняет T1, TI для STIR при 3 Тл больше, чем при 1,5 Тл.`,
        ),
      };
    },
  },
  {
    id: 'sq-flair',
    generate: (rng, lang) => {
      const t = tl(lang);
      const tr = pick(rng, [6000, 8000, 9000, 10000]);
      const t1 = TISSUES.csf.params[1.5].t1;
      const ti = nullPointTI(t1, tr);
      return {
        kind: 'numeric',
        id: 'sq-flair',
        difficulty: 3,
        prompt: t(
          `FLAIR bei 1,5 T: Liquor-T1 = ${t1} ms, TR = ${tr} ms. Bei welcher TI wird Liquor genullt? (Berücksichtige das endliche TR.)`,
          `FLAIR при 1,5 Тл: T1 ликвора = ${t1} мс, TR = ${tr} мс. При каком TI сигнал ликвора обнуляется? (Учти конечное TR.)`,
        ),
        answer: ti,
        tolerance: 0.03,
        unit: t('ms', 'мс'),
        hint: t('Mit endlichem TR: $M_z(TI) = 1 - 2e^{-TI/T_1} + e^{-TR/T_1} = 0$.', 'С конечным TR: $M_z(TI) = 1 - 2e^{-TI/T_1} + e^{-TR/T_1} = 0$.'),
        explanation: t(
          `$TI = T_1 \\ln\\big(2/(1 + e^{-TR/T_1})\\big) = ${t1}\\cdot\\ln(2/${n(1 + Math.exp(-tr / t1), 3, lang)}) = ${n(ti, 0, lang)}$ ms. Bei TR → ∞ wären es ${n(t1 * Math.LN2, 0, lang)} ms.`,
          `$TI = T_1 \\ln\\big(2/(1 + e^{-TR/T_1})\\big) = ${t1}\\cdot\\ln(2/${n(1 + Math.exp(-tr / t1), 3, lang)}) = ${n(ti, 0, lang)}$ мс. При TR → ∞ было бы ${n(t1 * Math.LN2, 0, lang)} мс.`,
        ),
      };
    },
  },
  {
    id: 'sq-ernst',
    generate: (rng, lang) => {
      const t = tl(lang);
      const tr = pick(rng, [10, 30, 100, 200, 500]);
      const tid = pick(rng, ['wm', 'gm', 'liver', 'fat'] as const);
      const t1 = TISSUES[tid].params[1.5].t1;
      const a = ernstAngleDeg(tr, t1);
      return {
        kind: 'numeric',
        id: 'sq-ernst',
        difficulty: 2,
        prompt: t(
          `Gespoiltes GRE mit TR = ${tr} ms. Bei welchem Flipwinkel wird das Signal von ${TISSUES[tid].label.de} (T1 = ${t1} ms) maximal?`,
          `Спойлированное GRE с TR = ${tr} мс. При каком угле отклонения сигнал ткани «${TISSUES[tid].label.ru}» (T1 = ${t1} мс) максимален?`,
        ),
        answer: a,
        tolerance: 0.03,
        unit: '°',
        hint: t('Ernst-Winkel: $\\cos\\alpha_E = e^{-TR/T_1}$', 'Угол Эрнста: $\\cos\\alpha_E = e^{-TR/T_1}$'),
        explanation: t(
          `$\\alpha_E = \\arccos(e^{-${tr}/${t1}}) = ${n(a, 1, lang)}°$. Je kürzer TR relativ zu T1, desto kleiner der optimale Flipwinkel.`,
          `$\\alpha_E = \\arccos(e^{-${tr}/${t1}}) = ${n(a, 1, lang)}°$. Чем короче TR относительно T1, тем меньше оптимальный угол отклонения.`,
        ),
      };
    },
  },
  {
    id: 'sq-opposed',
    generate: (rng, lang) => {
      const t = tl(lang);
      const field = pick(rng, [1.5, 3] as const);
      const times = fatWaterPhaseTimes(field);
      const which = pick(rng, ['opposed', 'inPhase'] as const);
      return {
        kind: 'numeric',
        id: 'sq-opposed',
        difficulty: 3,
        prompt: t(
          `Für eine Chemical-Shift-Bildgebung (Dixon) bei ${n(field, 2, lang)} T: Nach welcher kürzesten Echozeit stehen Fett- und Wassersignal ${which === 'opposed' ? 'gegenphasig (opposed phase)' : 'wieder in Phase (in phase, nach der ersten Gegenphase)'}? (Δ = 3,5 ppm)`,
          `Для визуализации химического сдвига (Dixon) при ${n(field, 2, lang)} Тл: через какое наименьшее время эха сигналы жира и воды ${which === 'opposed' ? 'находятся в противофазе (opposed phase)' : 'снова синфазны (in phase, после первой противофазы)'}? (Δ = 3,5 ppm)`,
        ),
        answer: times[which],
        tolerance: 0.04,
        unit: t('ms', 'мс'),
        hint: t(
          'Frequenzdifferenz $\\Delta f = 3{,}5\\,\\text{ppm} \\cdot f_0$; eine volle Periode ist $1/\\Delta f$.',
          'Разность частот $\\Delta f = 3{,}5\\,\\text{ppm} \\cdot f_0$; полный период равен $1/\\Delta f$.',
        ),
        explanation: t(
          `$\\Delta f = 3{,}5\\cdot10^{-6}\\cdot ${n(42.577 * field, 2, lang)}$ MHz $= ${n(1000 / times.inPhase, 0, lang)}$ Hz → Periode ${n(times.inPhase, 2, lang)} ms. Gegenphase nach der halben Periode (${n(times.opposed, 2, lang)} ms). Im Opposed-Phase-Bild verlieren Voxel mit Fett-Wasser-Gemisch Signal (z. B. Leberverfettung, Nebennierenadenom).`,
          `$\\Delta f = 3{,}5\\cdot10^{-6}\\cdot ${n(42.577 * field, 2, lang)}$ МГц $= ${n(1000 / times.inPhase, 0, lang)}$ Гц → период ${n(times.inPhase, 2, lang)} мс. Противофаза наступает через половину периода (${n(times.opposed, 2, lang)} мс). На изображении в противофазе воксели со смесью жира и воды теряют сигнал (напр. стеатоз печени, аденома надпочечника).`,
        ),
      };
    },
  },
  {
    id: 'sq-180',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Was unterscheidet ein Gradientenecho (GRE) grundsätzlich von einem Spin-Echo (SE)?',
      ru: 'Чем принципиально отличается градиентное эхо (GRE) от спин-эхо (SE)?',
    },
    options: [
      {
        de: 'GRE verzichtet auf den 180°-Refokussierungspuls; das Echo entsteht nur durch Gradientenumkehr, daher T2*- statt T2-Abklingen.',
        ru: 'В GRE нет 180°-рефокусирующего импульса; эхо возникает только за счёт инверсии градиента, поэтому затухание определяется T2*, а не T2.',
      },
      {
        de: 'GRE verwendet zwei 180°-Pulse und ist deshalb T1-unempfindlich.',
        ru: 'GRE использует два 180°-импульса и поэтому нечувствительно к T1.',
      },
      { de: 'GRE arbeitet ohne Auslesegradienten.', ru: 'GRE работает без градиента считывания.' },
      { de: 'Im GRE ist TR grundsätzlich länger als im SE.', ru: 'В GRE TR всегда длиннее, чем в SE.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ohne 180°-Puls werden statische Inhomogenitäten nicht refokussiert → empfindlich für Suszeptibilität (Blutungen, Verkalkungen, Metall), aber sehr kurze TR und kleine Flipwinkel möglich → schnell, geringes SAR.',
      ru: 'Без 180°-импульса статические неоднородности не рефокусируются → высокая чувствительность к магнитной восприимчивости (кровоизлияния, кальцинаты, металл), но возможны очень короткие TR и малые углы отклонения → быстро, низкий SAR.',
    },
  },
  {
    id: 'sq-tse-cons',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Eigenschaften hat eine TSE (Fast Spin Echo) im Vergleich zum konventionellen SE? (Mehrfachauswahl)',
      ru: 'Какими свойствами обладает TSE (быстрое спин-эхо) по сравнению с обычным SE? (Несколько вариантов)',
    },
    options: [
      { de: 'Deutlich kürzere Messzeit (Faktor ETL).', ru: 'Значительно меньшее время сканирования (в ETL раз).' },
      { de: 'Höheres SAR durch viele 180°-Pulse pro TR.', ru: 'Более высокий SAR из-за множества 180°-импульсов за TR.' },
      { de: 'Fett erscheint heller (Aufhebung der J-Kopplung).', ru: 'Жир выглядит ярче (подавление J-связи).' },
      { de: 'Geringere Anzahl an Schichten pro TR bei langem Echozug.', ru: 'Меньшее число срезов за TR при длинной эхо-цепочке.' },
      {
        de: 'Stärkere Empfindlichkeit für Suszeptibilitätsartefakte als GRE.',
        ru: 'Более высокая чувствительность к артефактам магнитной восприимчивости, чем у GRE.',
      },
    ],
    answers: [0, 1, 2, 3],
    explanation: {
      de: 'Die schnelle Folge von 180°-Pulsen refokussiert Suszeptibilitätseffekte sogar besonders gut → TSE ist robuster als GRE. Der lange Echozug belegt Zeit im TR → weniger Schichten. J-Kopplungs-Effekte werden durch kurze Echoabstände unterdrückt → Fett hell.',
      ru: 'Быстрая последовательность 180°-импульсов даже особенно хорошо рефокусирует эффекты магнитной восприимчивости → TSE устойчивее, чем GRE. Длинная эхо-цепочка занимает время в TR → меньше срезов. Эффекты J-связи подавляются короткими межэховыми интервалами → жир яркий.',
    },
  },
  {
    id: 'sq-epi',
    kind: 'mc',
    difficulty: 2,
    prompt: { de: 'Was charakterisiert Single-Shot-EPI?', ru: 'Что характеризует однократную (single-shot) EPI?' },
    options: [
      {
        de: 'Nach einer Anregung wird der komplette k-Raum durch einen schnell oszillierenden Auslesegradienten mit kurzen Phasen-„Blips“ abgetastet (< 100 ms).',
        ru: 'После одного возбуждения всё k-пространство считывается быстро осциллирующим градиентом считывания с короткими фазовыми «блипами» (< 100 мс).',
      },
      { de: 'Pro TR wird genau eine k-Raum-Zeile gemessen.', ru: 'За один TR измеряется ровно одна строка k-пространства.' },
      { de: 'EPI benötigt keine Gradienten.', ru: 'EPI не требует градиентов.' },
      { de: 'EPI ist besonders unempfindlich gegenüber Suszeptibilität.', ru: 'EPI особенно нечувствительна к магнитной восприимчивости.' },
    ],
    answer: 0,
    explanation: {
      de: 'EPI ist die schnellste Methode (fMRT, DWI, Perfusion). Wegen der langen Auslesedauer ist die Bandbreite in Phasenrichtung sehr klein → starke Verzerrungen und Fett-Verschiebung in Phasenrichtung, N/2-Ghosting durch Gradientenasymmetrien.',
      ru: 'EPI – самый быстрый метод (фМРТ, DWI, перфузия). Из-за длительного считывания полоса пропускания в фазовом направлении очень мала → сильные искажения и сдвиг жира в фазовом направлении, N/2-фантомы (ghosting) из-за асимметрии градиентов.',
    },
  },
  {
    id: 'sq-flair-use',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Wofür wird die FLAIR-Sequenz klinisch vor allem eingesetzt?', ru: 'Для чего в клинике в первую очередь применяют последовательность FLAIR?' },
    options: [
      {
        de: 'Erkennung T2-heller Läsionen nahe des Liquors (z. B. MS-Herde periventrikulär, kortikal) durch Unterdrückung des Liquorsignals.',
        ru: 'Выявление T2-гиперинтенсивных очагов вблизи ликвора (напр. очаги РС перивентрикулярно, кортикально) за счёт подавления сигнала ликвора.',
      },
      { de: 'Darstellung von Fettgewebe ohne Wassersignal.', ru: 'Визуализация жировой ткани без сигнала воды.' },
      { de: 'Messung der Diffusion.', ru: 'Измерение диффузии.' },
      { de: 'Darstellung des arteriellen Blutflusses.', ru: 'Визуализация артериального кровотока.' },
    ],
    answer: 0,
    explanation: {
      de: 'FLAIR = Fluid Attenuated Inversion Recovery: lange TI (≈ 2000–2500 ms bei 1,5 T) nullt freies Wasser; ein langes TE erzeugt T2-Gewichtung.',
      ru: 'FLAIR = Fluid Attenuated Inversion Recovery: длинное TI (≈ 2000–2500 мс при 1,5 Тл) обнуляет свободную воду; длинное TE создаёт T2-взвешенность.',
    },
  },
  {
    id: 'sq-tieff',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum kann eine Inversion-Recovery mit Betragsrekonstruktion bei ungünstiger TI zu Kontrastumkehr bzw. dunklen Grenzlinien führen?',
      ru: 'Почему инверсия-восстановление с реконструкцией по модулю при неудачном TI может приводить к инверсии контраста или тёмным пограничным линиям?',
    },
    options: [
      {
        de: 'Weil negative Längsmagnetisierung (Gewebe noch nicht durch null) im Betragsbild ebenfalls hell erscheint; Voxel mit Geweben auf beiden Seiten des Nulldurchgangs löschen sich aus.',
        ru: 'Потому что отрицательная продольная намагниченность (ткань ещё не прошла через ноль) на изображении по модулю тоже выглядит яркой; воксели с тканями по обе стороны от нуля взаимно гасятся.',
      },
      { de: 'Weil die Inversion das T2 umkehrt.', ru: 'Потому что инверсия обращает T2.' },
      { de: 'Weil die Gradienten bei IR invertiert werden müssen.', ru: 'Потому что в IR градиенты нужно инвертировать.' },
      { de: 'Weil der 180°-Puls die chemische Verschiebung verdoppelt.', ru: 'Потому что 180°-импульс удваивает химический сдвиг.' },
    ],
    answer: 0,
    explanation: {
      de: 'Betragsbild: S ∝ |M_z|. Gewebe mit langem T1 ist bei kurzer TI noch negativ, erscheint aber hell. Phasensensitive IR (PSIR) erhält das Vorzeichen und vermeidet dies.',
      ru: 'Изображение по модулю: S ∝ |M_z|. Ткань с длинным T1 при коротком TI ещё отрицательна, но выглядит яркой. Фазочувствительная IR (PSIR) сохраняет знак и предотвращает это.',
    },
  },
  {
    id: 'sq-dwi',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum basiert die Diffusionsbildgebung (DWI) in der Regel auf Single-Shot-SE-EPI?',
      ru: 'Почему диффузионно-взвешенное изображение (DWI) обычно основано на однократной SE-EPI?',
    },
    options: [
      {
        de: 'Die starken Diffusionsgradienten machen das Signal extrem bewegungsempfindlich – nur eine Auslese nach einer einzigen Anregung „friert“ makroskopische Bewegung ein.',
        ru: 'Сильные диффузионные градиенты делают сигнал чрезвычайно чувствительным к движению – только считывание после одного возбуждения «замораживает» макроскопическое движение.',
      },
      { de: 'Weil EPI kein Rauschen erzeugt.', ru: 'Потому что EPI не создаёт шума.' },
      { de: 'Weil die Diffusion nur in GRE-Sequenzen messbar ist.', ru: 'Потому что диффузию можно измерить только в GRE-последовательностях.' },
      { de: 'Weil EPI das niedrigste SAR aller Sequenzen hat.', ru: 'Потому что у EPI самый низкий SAR среди всех последовательностей.' },
    ],
    answer: 0,
    explanation: {
      de: 'Bei Multi-Shot-Verfahren erzeugen kleinste Bewegungen zwischen den Shots unterschiedliche Phasenfehler pro Zeile → Geister. Single-Shot-EPI vermeidet das. Der 180°-Puls (SE-EPI) verringert T2*-Signalverlust.',
      ru: 'В многократных методах малейшие движения между повторами вызывают разные фазовые ошибки в строках → фантомы. Однократная EPI этого избегает. 180°-импульс (SE-EPI) уменьшает потерю сигнала из-за T2*.',
    },
  },
  {
    id: 'sq-psd',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'In einem Pulsdiagramm eines SE: Wo wird der Phasenkodiergradient typischerweise geschaltet?',
      ru: 'На диаграмме импульсной последовательности SE: где обычно включается градиент фазового кодирования?',
    },
    options: [
      {
        de: 'Zwischen 90°-Puls und Auslese (meist vor dem 180°-Puls), mit pro TR wechselnder Amplitude – im Diagramm als „Leiter“ dargestellt.',
        ru: 'Между 90°-импульсом и считыванием (обычно перед 180°-импульсом), с амплитудой, меняющейся с каждым TR, – на диаграмме изображается как «лесенка».',
      },
      { de: 'Gleichzeitig mit dem Auslesegradienten.', ru: 'Одновременно с градиентом считывания.' },
      { de: 'Während des 90°-Pulses.', ru: 'Во время 90°-импульса.' },
      { de: 'Erst nach dem Echo.', ru: 'Только после эха.' },
    ],
    answer: 0,
    explanation: {
      de: 'Die Phasenkodierung muss vor der Auslese abgeschlossen sein. Ihre Amplitude ändert sich pro Wiederholung (−k_y,max … +k_y,max) – daher die Leiterdarstellung.',
      ru: 'Фазовое кодирование должно завершиться до считывания. Его амплитуда меняется с каждым повторением (−k_y,max … +k_y,max) – отсюда изображение в виде лесенки.',
    },
  },
];
