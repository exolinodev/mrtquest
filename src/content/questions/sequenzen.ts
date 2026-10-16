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
          `Обчисліть час сканування 2D-TSE: TR = ${tr} мс, ${ny} кроків фазового кодування, NEX = ${nex}, довжина ехо-послідовності (ETL) = ${etl}.`,
        ),
        answer: ta,
        tolerance: 0.02,
        unit: t('s', 'с'),
        hint: '$TA = TR \\cdot N_{\\text{PE}} \\cdot NEX / ETL$',
        explanation: t(
          `TA = ${tr / 1000} s · ${ny} · ${nex} / ${etl} = ${n(ta, 1, lang)} s. Gegenüber einem SE (ETL = 1) ist die TSE ${etl}-mal schneller.`,
          `TA = ${tr / 1000} с · ${ny} · ${nex} / ${etl} = ${n(ta, 1, lang)} с. Порівняно зі SE (ETL = 1) TSE у ${etl} разів швидша.`,
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
          `Жир при ${n(field, 2, lang)} Тл має T1 = ${t1} мс. Який час інверсії обнуляє сигнал жиру в STIR (наближення TR ≫ T1)?`,
        ),
        answer: ti,
        tolerance: 0.03,
        unit: t('ms', 'мс'),
        hint: t('Am Nulldurchgang gilt $M_z = M_0(1 - 2e^{-TI/T_1}) = 0$.', 'У точці проходження через нуль $M_z = M_0(1 - 2e^{-TI/T_1}) = 0$.'),
        explanation: t(
          `$TI = T_1 \\ln 2 = ${t1} \\cdot 0{,}693 = ${n(ti, 0, lang)}$ ms. Weil die Feldstärke T1 verlängert, ist die STIR-TI bei 3 T länger als bei 1,5 T.`,
          `$TI = T_1 \\ln 2 = ${t1} \\cdot 0{,}693 = ${n(ti, 0, lang)}$ мс. Оскільки вища індукція поля подовжує T1, TI для STIR при 3 Тл довший, ніж при 1,5 Тл.`,
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
          `FLAIR при 1,5 Тл: T1 ліквору = ${t1} мс, TR = ${tr} мс. При якому TI сигнал ліквору обнуляється? (Врахуйте скінченний TR.)`,
        ),
        answer: ti,
        tolerance: 0.03,
        unit: t('ms', 'мс'),
        hint: t('Mit endlichem TR: $M_z(TI) = 1 - 2e^{-TI/T_1} + e^{-TR/T_1} = 0$.', 'Зі скінченним TR: $M_z(TI) = 1 - 2e^{-TI/T_1} + e^{-TR/T_1} = 0$.'),
        explanation: t(
          `$TI = T_1 \\ln\\big(2/(1 + e^{-TR/T_1})\\big) = ${t1}\\cdot\\ln(2/${n(1 + Math.exp(-tr / t1), 3, lang)}) = ${n(ti, 0, lang)}$ ms. Bei TR → ∞ wären es ${n(t1 * Math.LN2, 0, lang)} ms.`,
          `$TI = T_1 \\ln\\big(2/(1 + e^{-TR/T_1})\\big) = ${t1}\\cdot\\ln(2/${n(1 + Math.exp(-tr / t1), 3, lang)}) = ${n(ti, 0, lang)}$ мс. При TR → ∞ це було б ${n(t1 * Math.LN2, 0, lang)} мс.`,
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
          `Спойлерне GRE з TR = ${tr} мс. При якому куті відхилення сигнал тканини «${TISSUES[tid].label.uk}» (T1 = ${t1} мс) максимальний?`,
        ),
        answer: a,
        tolerance: 0.03,
        unit: '°',
        hint: t('Ernst-Winkel: $\\cos\\alpha_E = e^{-TR/T_1}$', 'Кут Ернста: $\\cos\\alpha_E = e^{-TR/T_1}$'),
        explanation: t(
          `$\\alpha_E = \\arccos(e^{-${tr}/${t1}}) = ${n(a, 1, lang)}°$. Je kürzer TR relativ zu T1, desto kleiner der optimale Flipwinkel.`,
          `$\\alpha_E = \\arccos(e^{-${tr}/${t1}}) = ${n(a, 1, lang)}°$. Що коротший TR відносно T1, то менший оптимальний кут відхилення.`,
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
          `Для візуалізації хімічного зсуву (Dixon) при ${n(field, 2, lang)} Тл: через який найкоротший час відлуння сигнали жиру та води ${which === 'opposed' ? 'перебувають у протифазі (opposed phase)' : 'знову синфазні (in phase, після першої протифази)'}? (Δ = 3,5 ppm)`,
        ),
        answer: times[which],
        tolerance: 0.04,
        unit: t('ms', 'мс'),
        hint: t(
          'Frequenzdifferenz $\\Delta f = 3{,}5\\,\\text{ppm} \\cdot f_0$; eine volle Periode ist $1/\\Delta f$.',
          'Різниця частот $\\Delta f = 3{,}5\\,\\text{ppm} \\cdot f_0$; повний період дорівнює $1/\\Delta f$.',
        ),
        explanation: t(
          `$\\Delta f = 3{,}5\\cdot10^{-6}\\cdot ${n(42.577 * field, 2, lang)}$ MHz $= ${n(1000 / times.inPhase, 0, lang)}$ Hz → Periode ${n(times.inPhase, 2, lang)} ms. Gegenphase nach der halben Periode (${n(times.opposed, 2, lang)} ms). Im Opposed-Phase-Bild verlieren Voxel mit Fett-Wasser-Gemisch Signal (z. B. Leberverfettung, Nebennierenadenom).`,
          `$\\Delta f = 3{,}5\\cdot10^{-6}\\cdot ${n(42.577 * field, 2, lang)}$ МГц $= ${n(1000 / times.inPhase, 0, lang)}$ Гц → період ${n(times.inPhase, 2, lang)} мс. Протифаза настає через половину періоду (${n(times.opposed, 2, lang)} мс). На зображенні в протифазі вокселі із сумішшю жиру та води втрачають сигнал (напр. стеатоз печінки, аденома наднирника).`,
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
      uk: 'Чим принципово відрізняється градієнтне ехо (GRE) від спін-ехо (SE)?',
    },
    options: [
      {
        de: 'GRE verzichtet auf den 180°-Refokussierungspuls; das Echo entsteht nur durch Gradientenumkehr, daher T2*- statt T2-Abklingen.',
        uk: 'У GRE немає 180°-рефокусувального імпульсу; ехо виникає лише через інверсію градієнта, тому загасання визначається T2*, а не T2.',
      },
      {
        de: 'GRE verwendet zwei 180°-Pulse und ist deshalb T1-unempfindlich.',
        uk: 'GRE використовує два 180°-імпульси і тому нечутливе до T1.',
      },
      { de: 'GRE arbeitet ohne Auslesegradienten.', uk: 'GRE працює без градієнта зчитування.' },
      { de: 'Im GRE ist TR grundsätzlich länger als im SE.', uk: 'У GRE TR завжди довший, ніж у SE.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ohne 180°-Puls werden statische Inhomogenitäten nicht refokussiert → empfindlich für Suszeptibilität (Blutungen, Verkalkungen, Metall), aber sehr kurze TR und kleine Flipwinkel möglich → schnell, geringes SAR.',
      uk: 'Без 180°-імпульсу статичні неоднорідності не рефокусуються → висока чутливість до магнітної сприйнятливості (крововиливи, кальцинати, метал), але можливі дуже короткі TR і малі кути відхилення → швидко, низький SAR.',
    },
  },
  {
    id: 'sq-tse-cons',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Eigenschaften hat eine TSE (Fast Spin Echo) im Vergleich zum konventionellen SE? (Mehrfachauswahl)',
      uk: 'Які властивості має TSE (швидке спін-ехо) порівняно зі звичайним SE? (Кілька варіантів)',
    },
    options: [
      { de: 'Deutlich kürzere Messzeit (Faktor ETL).', uk: 'Значно коротший час сканування (у ETL разів).' },
      { de: 'Höheres SAR durch viele 180°-Pulse pro TR.', uk: 'Вищий SAR через велику кількість 180°-імпульсів за TR.' },
      { de: 'Fett erscheint heller (Aufhebung der J-Kopplung).', uk: 'Жир виглядає яскравішим (усунення J-зв’язку).' },
      { de: 'Geringere Anzahl an Schichten pro TR bei langem Echozug.', uk: 'Менша кількість зрізів за TR при довгій ехо-послідовності.' },
      {
        de: 'Stärkere Empfindlichkeit für Suszeptibilitätsartefakte als GRE.',
        uk: 'Вища чутливість до артефактів магнітної сприйнятливості, ніж у GRE.',
      },
    ],
    answers: [0, 1, 2, 3],
    explanation: {
      de: 'Die schnelle Folge von 180°-Pulsen refokussiert Suszeptibilitätseffekte sogar besonders gut → TSE ist robuster als GRE. Der lange Echozug belegt Zeit im TR → weniger Schichten. J-Kopplungs-Effekte werden durch kurze Echoabstände unterdrückt → Fett hell.',
      uk: 'Швидка послідовність 180°-імпульсів навіть особливо добре рефокусує ефекти магнітної сприйнятливості → TSE стійкіша за GRE. Довга ехо-послідовність займає час у TR → менше зрізів. Ефекти J-зв’язку пригнічуються короткими міжехо-інтервалами → жир яскравий.',
    },
  },
  {
    id: 'sq-epi',
    kind: 'mc',
    difficulty: 2,
    prompt: { de: 'Was charakterisiert Single-Shot-EPI?', uk: 'Що характеризує однокрокову (single-shot) EPI?' },
    options: [
      {
        de: 'Nach einer Anregung wird der komplette k-Raum durch einen schnell oszillierenden Auslesegradienten mit kurzen Phasen-„Blips“ abgetastet (< 100 ms).',
        uk: 'Після одного збудження весь k-простір зчитується швидко осцилювальним градієнтом зчитування з короткими фазовими «бліпами» (< 100 мс).',
      },
      { de: 'Pro TR wird genau eine k-Raum-Zeile gemessen.', uk: 'За один TR вимірюється рівно один рядок k-простору.' },
      { de: 'EPI benötigt keine Gradienten.', uk: 'EPI не потребує градієнтів.' },
      { de: 'EPI ist besonders unempfindlich gegenüber Suszeptibilität.', uk: 'EPI особливо нечутлива до магнітної сприйнятливості.' },
    ],
    answer: 0,
    explanation: {
      de: 'EPI ist die schnellste Methode (fMRT, DWI, Perfusion). Wegen der langen Auslesedauer ist die Bandbreite in Phasenrichtung sehr klein → starke Verzerrungen und Fett-Verschiebung in Phasenrichtung, N/2-Ghosting durch Gradientenasymmetrien.',
      uk: 'EPI – найшвидший метод (фМРТ, DWI, перфузія). Через тривале зчитування смуга пропускання у фазовому напрямку дуже мала → сильні спотворення та зсув жиру у фазовому напрямку, N/2-ореоли (ghosting) через асиметрії градієнтів.',
    },
  },
  {
    id: 'sq-flair-use',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Wofür wird die FLAIR-Sequenz klinisch vor allem eingesetzt?', uk: 'Для чого переважно застосовують послідовність FLAIR у клініці?' },
    options: [
      {
        de: 'Erkennung T2-heller Läsionen nahe des Liquors (z. B. MS-Herde periventrikulär, kortikal) durch Unterdrückung des Liquorsignals.',
        uk: 'Виявлення T2-гіперінтенсивних вогнищ поблизу ліквору (напр. вогнища РС перивентрикулярно, кортикально) завдяки пригніченню сигналу ліквору.',
      },
      { de: 'Darstellung von Fettgewebe ohne Wassersignal.', uk: 'Візуалізація жирової тканини без сигналу води.' },
      { de: 'Messung der Diffusion.', uk: 'Вимірювання дифузії.' },
      { de: 'Darstellung des arteriellen Blutflusses.', uk: 'Візуалізація артеріального кровотоку.' },
    ],
    answer: 0,
    explanation: {
      de: 'FLAIR = Fluid Attenuated Inversion Recovery: lange TI (≈ 2000–2500 ms bei 1,5 T) nullt freies Wasser; ein langes TE erzeugt T2-Gewichtung.',
      uk: 'FLAIR = Fluid Attenuated Inversion Recovery: довгий TI (≈ 2000–2500 мс при 1,5 Тл) обнуляє вільну воду; довгий TE створює T2-зважування.',
    },
  },
  {
    id: 'sq-tieff',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum kann eine Inversion-Recovery mit Betragsrekonstruktion bei ungünstiger TI zu Kontrastumkehr bzw. dunklen Grenzlinien führen?',
      uk: 'Чому інверсія-відновлення з реконструкцією за модулем при невдалому TI може спричиняти інверсію контрасту або темні межові лінії?',
    },
    options: [
      {
        de: 'Weil negative Längsmagnetisierung (Gewebe noch nicht durch null) im Betragsbild ebenfalls hell erscheint; Voxel mit Geweben auf beiden Seiten des Nulldurchgangs löschen sich aus.',
        uk: 'Бо від’ємна поздовжня намагніченість (тканина ще не пройшла через нуль) на зображенні за модулем також виглядає яскравою; вокселі з тканинами по обидва боки від нуля взаємно гасяться.',
      },
      { de: 'Weil die Inversion das T2 umkehrt.', uk: 'Бо інверсія обертає T2.' },
      { de: 'Weil die Gradienten bei IR invertiert werden müssen.', uk: 'Бо в IR градієнти потрібно інвертувати.' },
      { de: 'Weil der 180°-Puls die chemische Verschiebung verdoppelt.', uk: 'Бо 180°-імпульс подвоює хімічний зсув.' },
    ],
    answer: 0,
    explanation: {
      de: 'Betragsbild: S ∝ |M_z|. Gewebe mit langem T1 ist bei kurzer TI noch negativ, erscheint aber hell. Phasensensitive IR (PSIR) erhält das Vorzeichen und vermeidet dies.',
      uk: 'Зображення за модулем: S ∝ |M_z|. Тканина з довгим T1 при короткому TI ще від’ємна, але виглядає яскравою. Фазочутлива IR (PSIR) зберігає знак і запобігає цьому.',
    },
  },
  {
    id: 'sq-dwi',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum basiert die Diffusionsbildgebung (DWI) in der Regel auf Single-Shot-SE-EPI?',
      uk: 'Чому дифузійно-зважена візуалізація (DWI) зазвичай ґрунтується на однокроковій SE-EPI?',
    },
    options: [
      {
        de: 'Die starken Diffusionsgradienten machen das Signal extrem bewegungsempfindlich – nur eine Auslese nach einer einzigen Anregung „friert“ makroskopische Bewegung ein.',
        uk: 'Сильні дифузійні градієнти роблять сигнал надзвичайно чутливим до руху – лише зчитування після одного збудження «заморожує» макроскопічний рух.',
      },
      { de: 'Weil EPI kein Rauschen erzeugt.', uk: 'Бо EPI не створює шуму.' },
      { de: 'Weil die Diffusion nur in GRE-Sequenzen messbar ist.', uk: 'Бо дифузію можна виміряти лише в GRE-послідовностях.' },
      { de: 'Weil EPI das niedrigste SAR aller Sequenzen hat.', uk: 'Бо EPI має найнижчий SAR серед усіх послідовностей.' },
    ],
    answer: 0,
    explanation: {
      de: 'Bei Multi-Shot-Verfahren erzeugen kleinste Bewegungen zwischen den Shots unterschiedliche Phasenfehler pro Zeile → Geister. Single-Shot-EPI vermeidet das. Der 180°-Puls (SE-EPI) verringert T2*-Signalverlust.',
      uk: 'У багатокрокових методах найменші рухи між кроками спричиняють різні фазові похибки в рядках → ореоли. Однокрокова EPI цього уникає. 180°-імпульс (SE-EPI) зменшує втрату сигналу через T2*.',
    },
  },
  {
    id: 'sq-psd',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'In einem Pulsdiagramm eines SE: Wo wird der Phasenkodiergradient typischerweise geschaltet?',
      uk: 'На діаграмі імпульсної послідовності SE: де зазвичай вмикається градієнт фазового кодування?',
    },
    options: [
      {
        de: 'Zwischen 90°-Puls und Auslese (meist vor dem 180°-Puls), mit pro TR wechselnder Amplitude – im Diagramm als „Leiter“ dargestellt.',
        uk: 'Між 90°-імпульсом і зчитуванням (зазвичай перед 180°-імпульсом), з амплітудою, що змінюється з кожним TR, – на діаграмі зображується як «драбинка».',
      },
      { de: 'Gleichzeitig mit dem Auslesegradienten.', uk: 'Одночасно з градієнтом зчитування.' },
      { de: 'Während des 90°-Pulses.', uk: 'Під час 90°-імпульсу.' },
      { de: 'Erst nach dem Echo.', uk: 'Лише після ехо.' },
    ],
    answer: 0,
    explanation: {
      de: 'Die Phasenkodierung muss vor der Auslese abgeschlossen sein. Ihre Amplitude ändert sich pro Wiederholung (−k_y,max … +k_y,max) – daher die Leiterdarstellung.',
      uk: 'Фазове кодування має завершитися до зчитування. Його амплітуда змінюється з кожним повторенням (−k_y,max … +k_y,max) – звідси зображення у вигляді драбинки.',
    },
  },
];
