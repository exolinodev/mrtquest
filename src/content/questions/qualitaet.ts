import { chemicalShiftHz, chemicalShiftPixels } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

export const qualitaetQuestions: QuestionSource[] = [
  {
    id: 'q-nex',
    generate: (rng, lang) => {
      const t = tl(lang);
      const a = pick(rng, [1, 2]);
      const b = pick(rng, [4, 6, 8]);
      return {
        kind: 'numeric',
        id: 'q-nex',
        difficulty: 1,
        prompt: t(
          `Um welchen Faktor steigt das SNR, wenn die Anzahl der Mittelungen (NEX) von ${a} auf ${b} erhöht wird?`,
          `У скільки разів зростає SNR, якщо кількість усереднень (NEX) збільшити з ${a} до ${b}?`,
        ),
        answer: Math.sqrt(b / a),
        tolerance: 0.02,
        unit: '×',
        hint: t(
          'Signal addiert sich kohärent (∝ N), Rauschen inkohärent (∝ √N).',
          'Сигнал додається когерентно (∝ N), шум – некогерентно (∝ √N).',
        ),
        explanation: t(
          `SNR ∝ √NEX → Faktor √(${b}/${a}) = ${n(Math.sqrt(b / a), 2, lang)}. Die Messzeit steigt dabei um den Faktor ${n(b / a, 2, lang)} – Mittelung ist eine teure SNR-Quelle.`,
          `SNR ∝ √NEX → коефіцієнт √(${b}/${a}) = ${n(Math.sqrt(b / a), 2, lang)}. Час сканування при цьому зростає в ${n(b / a, 2, lang)} раз(и) – усереднення є дорогим джерелом SNR.`,
        ),
      };
    },
  },
  {
    id: 'q-voxel',
    generate: (rng, lang) => {
      const t = tl(lang);
      const d1 = pick(rng, [5, 4, 3]);
      const d2 = pick(rng, [2, 1.5, 1]);
      const m1 = pick(rng, [256, 320]);
      const m2 = pick(rng, [384, 512]);
      const factor = (d2 / d1) * (m1 / m2) * Math.sqrt(m2 / m1);
      return {
        kind: 'numeric',
        id: 'q-voxel',
        difficulty: 3,
        prompt: t(
          `Ein Protokoll wird von ${n(d1, 2, lang)} mm auf ${n(d2, 2, lang)} mm Schichtdicke und gleichzeitig in Phasenrichtung von ${m1} auf ${m2} Matrixpunkte geändert (FOV, NEX, Bandbreite, Auslesematrix unverändert). Um welchen Faktor ändert sich das SNR?`,
          `Протокол змінюють з товщини зрізу ${n(d1, 2, lang)} мм на ${n(d2, 2, lang)} мм і одночасно у фазовому напрямку з ${m1} на ${m2} точок матриці (FOV, NEX, смуга пропускання, матриця зчитування без змін). У скільки разів змінюється SNR?`,
        ),
        answer: factor,
        tolerance: 0.03,
        unit: '×',
        hint: t(
          'SNR ∝ Voxelvolumen · √(N_PE). Mehr Phasenzeilen verkleinern das Voxel, verlängern aber auch die Messzeit.',
          'SNR ∝ об’єм вокселя · √(N_PE). Більше фазових рядків зменшують воксель, але й подовжують час сканування.',
        ),
        explanation: t(
          `Voxelvolumen: Faktor (${n(d2, 2, lang)}/${n(d1, 2, lang)})·(${m1}/${m2}) = ${n((d2 / d1) * (m1 / m2), 3, lang)}; zusätzliche Messzeit: √(${m2}/${m1}) = ${n(Math.sqrt(m2 / m1), 3, lang)}. Gesamt: ${n(factor, 3, lang)}. Hohe Auflösung kostet überproportional SNR.`,
          `Об’єм вокселя: коефіцієнт (${n(d2, 2, lang)}/${n(d1, 2, lang)})·(${m1}/${m2}) = ${n((d2 / d1) * (m1 / m2), 3, lang)}; додатковий час сканування: √(${m2}/${m1}) = ${n(Math.sqrt(m2 / m1), 3, lang)}. Разом: ${n(factor, 3, lang)}. Висока роздільна здатність коштує непропорційно багато SNR.`,
        ),
      };
    },
  },
  {
    id: 'q-bw',
    generate: (rng, lang) => {
      const t = tl(lang);
      const a = pick(rng, [100, 130, 200]);
      const f = pick(rng, [2, 3, 4]);
      return {
        kind: 'numeric',
        id: 'q-bw',
        difficulty: 2,
        prompt: t(
          `Die Empfangsbandbreite wird von ${a} Hz/Pixel auf ${a * f} Hz/Pixel erhöht. Um welchen Faktor ändert sich das SNR?`,
          `Смугу пропускання приймача збільшують з ${a} Гц/піксель до ${a * f} Гц/піксель. У скільки разів змінюється SNR?`,
        ),
        answer: 1 / Math.sqrt(f),
        tolerance: 0.02,
        unit: '×',
        hint: t(
          'Das Rauschen ist weiß – seine Leistung ist proportional zur erfassten Bandbreite.',
          'Шум білий – його потужність пропорційна зареєстрованій смузі пропускання.',
        ),
        explanation: t(
          `SNR ∝ 1/√BW → Faktor 1/√${f} = ${n(1 / Math.sqrt(f), 3, lang)}. Dafür sinken chemische Verschiebung und Suszeptibilitätsverzerrung um den Faktor ${f}, und die Auslese wird kürzer (kürzeres TE/ESP möglich).`,
          `SNR ∝ 1/√BW → коефіцієнт 1/√${f} = ${n(1 / Math.sqrt(f), 3, lang)}. Натомість хімічний зсув і спотворення через магнітну сприйнятливість зменшуються в ${f} рази, а зчитування стає коротшим (можливі коротші TE/ESP).`,
        ),
      };
    },
  },
  {
    id: 'q-cs',
    generate: (rng, lang) => {
      const t = tl(lang);
      const field = pick(rng, [1.5, 3]);
      const bw = pick(rng, [100, 130, 200, 260, 400]);
      return {
        kind: 'numeric',
        id: 'q-cs',
        difficulty: 2,
        prompt: t(
          `Wie viele Pixel beträgt der Fett-Wasser-Versatz (3,5 ppm) in Ausleserichtung bei ${n(field, 2, lang)} T und einer Bandbreite von ${bw} Hz/Pixel?`,
          `На скільки пікселів зміщення жир–вода (3,5 ppm) у напрямку зчитування при ${n(field, 2, lang)} Тл і смузі пропускання ${bw} Гц/піксель?`,
        ),
        answer: chemicalShiftPixels(field, bw),
        tolerance: 0.03,
        unit: t('px', 'пікс.'),
        explanation: t(
          `Δf = 3,5 ppm · ${n(42.577 * field, 2, lang)} MHz = ${n(chemicalShiftHz(field), 0, lang)} Hz → ${n(chemicalShiftHz(field), 0, lang)}/${bw} = ${n(chemicalShiftPixels(field, bw), 2, lang)} px. Bei 3 T verdoppelt sich der Versatz – man kompensiert mit doppelter Bandbreite.`,
          `Δf = 3,5 ppm · ${n(42.577 * field, 2, lang)} МГц = ${n(chemicalShiftHz(field), 0, lang)} Гц → ${n(chemicalShiftHz(field), 0, lang)}/${bw} = ${n(chemicalShiftPixels(field, bw), 2, lang)} пікс. При 3 Тл зміщення подвоюється – його компенсують подвійною смугою пропускання.`,
        ),
      };
    },
  },
  {
    id: 'q-sar',
    generate: (rng, lang) => {
      const t = tl(lang);
      const flipOld = 180;
      const flipNew = pick(rng, [120, 135, 150]);
      const f = 4 * (flipNew / flipOld) ** 2;
      return {
        kind: 'numeric',
        id: 'q-sar',
        difficulty: 2,
        prompt: t(
          `Ein TSE-Protokoll wird von 1,5 T auf 3 T übertragen und der Refokussierungswinkel von 180° auf ${flipNew}° reduziert. Um welchen Faktor ändert sich das SAR näherungsweise (Refokussierungspulse dominieren)?`,
          `Протокол TSE переносять з 1,5 Тл на 3 Тл і зменшують кут рефокусування зі 180° до ${flipNew}°. У скільки разів приблизно змінюється SAR (домінують рефокусувальні імпульси)?`,
        ),
        answer: f,
        tolerance: 0.03,
        unit: '×',
        hint: 'SAR ∝ B₀² · α²',
        explanation: t(
          `(3/1,5)² · (${flipNew}/180)² = 4 · ${n((flipNew / 180) ** 2, 3, lang)} = ${n(f, 2, lang)}. Selbst mit reduzierten Winkeln liegt das SAR bei 3 T deutlich höher.`,
          `(3/1,5)² · (${flipNew}/180)² = 4 · ${n((flipNew / 180) ** 2, 3, lang)} = ${n(f, 2, lang)}. Навіть зі зменшеними кутами SAR при 3 Тл значно вищий.`,
        ),
      };
    },
  },
  {
    id: 'q-sar-limit',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Welcher Ganzkörper-SAR-Grenzwert gilt nach IEC 60601-2-33 im Normal Operating Mode (gemittelt über 6 min)?',
      uk: 'Яка гранична величина SAR для всього тіла діє згідно з IEC 60601-2-33 у нормальному режимі роботи (Normal Operating Mode, усереднення за 6 хв)?',
    },
    options: [
      { de: '2 W/kg', uk: '2 Вт/кг' },
      { de: '4 W/kg', uk: '4 Вт/кг' },
      { de: '10 W/kg', uk: '10 Вт/кг' },
      { de: '0,4 W/kg', uk: '0,4 Вт/кг' },
    ],
    answer: 0,
    explanation: {
      de: 'Normal Mode: 2 W/kg, First Level Controlled Mode: 4 W/kg (mit medizinischer Überwachung). Für den Kopf gelten 3,2 W/kg; lokal 10 W/kg (Kopf/Rumpf) bzw. 20 W/kg (Extremitäten). Ziel: Kerntemperaturanstieg ≤ 0,5 °C (normal) bzw. ≤ 1 °C.',
      uk: 'Normal Mode: 2 Вт/кг, First Level Controlled Mode: 4 Вт/кг (під медичним наглядом). Для голови діє 3,2 Вт/кг; локально 10 Вт/кг (голова/тулуб) або 20 Вт/кг (кінцівки). Мета: підвищення температури ядра тіла ≤ 0,5 °C (нормальний режим) або ≤ 1 °C.',
    },
  },
  {
    id: 'q-aliasing',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'In einer axialen Abdomen-Aufnahme falten die Arme von links nach rechts ins Bild. Was hilft am effektivsten?',
      uk: 'На аксіальному знімку черевної порожнини руки загортаються в зображення зліва направо. Що допомагає найефективніше?',
    },
    options: [
      {
        de: 'Phasen-Oversampling bzw. FOV in Phasenrichtung vergrößern (oder Phasenrichtung auf anterior–posterior tauschen).',
        uk: 'Фазовий оверсемплінг або збільшення FOV у фазовому напрямку (чи зміна фазового напрямку на передньо-задній).',
      },
      { de: 'Bandbreite erhöhen.', uk: 'Збільшити смугу пропускання.' },
      { de: 'TE verkürzen.', uk: 'Скоротити TE.' },
      { de: 'Schichtdicke reduzieren.', uk: 'Зменшити товщину зрізу.' },
    ],
    answer: 0,
    explanation: {
      de: 'Einfaltung (Wrap-around) tritt in Phasenrichtung auf, wenn das Objekt größer als das FOV ist – die Phase ist 2π-periodisch. In Ausleserichtung verhindert das Oversampling mit Anti-Aliasing-Filter dies standardmäßig ohne Zeitverlust.',
      uk: 'Загортання (аліасинг, wrap-around) виникає у фазовому напрямку, коли об’єкт більший за FOV – фаза є 2π-періодичною. У напрямку зчитування цьому стандартно запобігає оверсемплінг з антиаліасинговим фільтром без втрати часу.',
    },
  },
  {
    id: 'q-motion-direction',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum erscheinen Bewegungsartefakte (Atmung, Pulsation) fast ausschließlich in Phasenrichtung?',
      uk: 'Чому артефакти руху (дихання, пульсація) з’являються майже виключно у фазовому напрямку?',
    },
    options: [
      {
        de: 'Zwischen zwei Phasenkodierschritten liegt ein ganzes TR (hunderte ms), während eine Auslesezeile nur wenige ms dauert – Bewegung erzeugt inkonsistente Phasen von Zeile zu Zeile.',
        uk: 'Між двома кроками фазового кодування минає цілий TR (сотні мс), тоді як рядок зчитування триває лише кілька мс – рух створює неузгоджені фази від рядка до рядка.',
      },
      { de: 'Weil der Phasengradient schwächer ist.', uk: 'Тому що фазовий градієнт слабший.' },
      { de: 'Weil Bewegung immer senkrecht zur Ausleserichtung erfolgt.', uk: 'Тому що рух завжди відбувається перпендикулярно до напрямку зчитування.' },
      { de: 'Weil die Frequenzkodierung Bewegung automatisch korrigiert.', uk: 'Тому що частотне кодування автоматично коригує рух.' },
    ],
    answer: 0,
    explanation: {
      de: 'Periodische Bewegung → diskrete Geister im Abstand ∝ TR·N_PE/Periode. Gegenmaßnahmen: Atemanhalt, Triggerung/Navigator, Sättigungsbänder, radiale Trajektorien (PROPELLER/BLADE), schnellere Sequenzen.',
      uk: 'Періодичний рух → дискретні «привиди» на відстані ∝ TR·N_PE/період. Контрзаходи: затримка дихання, тригерування/навігатор, смуги насичення, радіальні траєкторії (PROPELLER/BLADE), швидші послідовності.',
    },
  },
  {
    id: 'q-suscept',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Maßnahmen verringern Suszeptibilitätsartefakte (z. B. durch eine Hüftprothese)? (Mehrfachauswahl)',
      uk: 'Які заходи зменшують артефакти магнітної сприйнятливості (напр., від ендопротеза кульшового суглоба)? (Множинний вибір)',
    },
    options: [
      { de: 'TSE statt GRE verwenden', uk: 'Використовувати TSE замість GRE' },
      { de: 'Empfangsbandbreite erhöhen', uk: 'Збільшити смугу пропускання приймача' },
      { de: 'Kurze Echozeit wählen', uk: 'Обрати короткий час відлуння' },
      { de: 'Auf 1,5 T statt 3 T messen', uk: 'Сканувати на 1,5 Тл замість 3 Тл' },
      { de: 'EPI-Auslese verwenden', uk: 'Використовувати EPI-зчитування' },
    ],
    answers: [0, 1, 2, 3],
    explanation: {
      de: 'Suszeptibilität ∝ B₀. SE/TSE refokussiert die Dephasierung; hohe Bandbreite reduziert geometrische Verzerrungen; kurzes TE begrenzt Signalverlust. EPI ist am empfindlichsten. Spezialsequenzen: SEMAC, MAVRIC, View-Angle-Tilting.',
      uk: 'Ефекти сприйнятливості ∝ B₀. SE/TSE рефокусує дефазування; широка смуга пропускання зменшує геометричні спотворення; короткий TE обмежує втрату сигналу. EPI найчутливіша. Спеціальні послідовності: SEMAC, MAVRIC, View-Angle-Tilting.',
    },
  },
  {
    id: 'q-zipper',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Eine feine, punktierte Linie zieht sich in Phasenrichtung an fester Frequenzposition durch alle Bilder. Was ist die wahrscheinlichste Ursache?',
      uk: 'Тонка пунктирна лінія тягнеться у фазовому напрямку на фіксованій частотній позиції через усі зображення. Яка найімовірніша причина?',
    },
    options: [
      {
        de: 'HF-Einstreuung (Zipper-Artefakt), z. B. durch offene Kabinentür oder ein defektes elektronisches Gerät im Raum.',
        uk: 'РЧ-наведення (zipper-артефакт), напр. через відчинені двері кабіни або несправний електронний пристрій у приміщенні.',
      },
      { de: 'Patientenbewegung.', uk: 'Рух пацієнта.' },
      { de: 'Zu niedrige Matrix.', uk: 'Занадто мала матриця.' },
      { de: 'Falsche Inversionszeit.', uk: 'Неправильний час інверсії.' },
    ],
    answer: 0,
    explanation: {
      de: 'Eine externe Störfrequenz erscheint im Bild an der zugehörigen Frequenzposition, über alle Phasenschritte hinweg → Linie in Phasenrichtung. Der Faradaykäfig muss geschlossen sein.',
      uk: 'Зовнішня частота завади з’являється на зображенні у відповідній частотній позиції на всіх фазових кроках → лінія у фазовому напрямку. Клітка Фарадея має бути зачиненою.',
    },
  },
  {
    id: 'q-pns',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Wodurch wird die periphere Nervenstimulation (PNS) während einer MRT ausgelöst?',
      uk: 'Чим спричиняється стимуляція периферичних нервів (PNS) під час МРТ?',
    },
    options: [
      {
        de: 'Durch schnell geschaltete Gradientenfelder (hohes dB/dt), die elektrische Felder im Gewebe induzieren.',
        uk: 'Швидко перемиканими градієнтними полями (високе dB/dt), які індукують електричні поля в тканинах.',
      },
      { de: 'Durch die HF-Energie (SAR).', uk: 'РЧ-енергією (SAR).' },
      { de: 'Durch das statische Feld B₀ allein.', uk: 'Лише статичним полем B₀.' },
      { de: 'Durch Kontrastmittel.', uk: 'Контрастною речовиною.' },
    ],
    answer: 0,
    explanation: {
      de: 'Faraday: E ∝ dB/dt. Hohe Slew-Rates (EPI, DWI) können Muskelzucken/Kribbeln auslösen. Der Scanner begrenzt dB/dt über ein Stimulationsmodell. SAR beschreibt dagegen die Erwärmung durch HF.',
      uk: 'Фарадей: E ∝ dB/dt. Високі швидкості наростання (EPI, DWI) можуть викликати посмикування м’язів/поколювання. Сканер обмежує dB/dt за допомогою моделі стимуляції. SAR натомість описує нагрівання РЧ-полем.',
    },
  },
  {
    id: 'q-snr-field',
    kind: 'mc',
    difficulty: 2,
    prompt: { de: 'Welche Aussage zum SNR ist korrekt?', uk: 'Яке твердження про SNR правильне?' },
    options: [
      {
        de: 'SNR ∝ Voxelvolumen · √(Messzeit-Anteil N_PE·NEX) / √BW und wächst etwa linear mit B₀.',
        uk: 'SNR ∝ об’єм вокселя · √(частка часу сканування N_PE·NEX) / √BW і зростає приблизно лінійно з B₀.',
      },
      { de: 'SNR ist unabhängig von der Schichtdicke.', uk: 'SNR не залежить від товщини зрізу.' },
      { de: 'Eine doppelte Bandbreite verdoppelt das SNR.', uk: 'Подвоєння смуги пропускання подвоює SNR.' },
      { de: 'Parallele Bildgebung erhöht das SNR um den Faktor R.', uk: 'Паралельна візуалізація збільшує SNR у R разів.' },
    ],
    answer: 0,
    explanation: {
      de: 'Parallele Bildgebung senkt das SNR: SNR_R = SNR/(g·√R). Eine Verdopplung der Bandbreite senkt das SNR um √2.',
      uk: 'Паралельна візуалізація знижує SNR: SNR_R = SNR/(g·√R). Подвоєння смуги пропускання знижує SNR у √2 раза.',
    },
  },
  {
    id: 'q-cs-direction',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'In welcher Richtung ist das Chemical-Shift-Artefakt (1. Art) in einer TSE bzw. in einer EPI sichtbar?',
      uk: 'У якому напрямку видно артефакт хімічного зсуву (1-го роду) у TSE та в EPI?',
    },
    options: [
      {
        de: 'TSE: Ausleserichtung (Frequenz); EPI: Phasenrichtung (dort niedrigste Bandbreite pro Pixel).',
        uk: 'TSE: напрямок зчитування (частотний); EPI: фазовий напрямок (там найменша смуга пропускання на піксель).',
      },
      { de: 'TSE: Phasenrichtung; EPI: Ausleserichtung.', uk: 'TSE: фазовий напрямок; EPI: напрямок зчитування.' },
      { de: 'In beiden in Schichtrichtung.', uk: 'В обох – у напрямку зрізу.' },
      { de: 'Es tritt nur in GRE auf.', uk: 'Він виникає лише в GRE.' },
    ],
    answer: 0,
    explanation: {
      de: 'Die Verschiebung beträgt Δf/BW_px in der Richtung mit der geringsten Bandbreite pro Pixel. In EPI liegt diese in Phasenrichtung bei nur ≈ 10–30 Hz/px → mehrere Pixel Fettversatz ohne Fettsättigung.',
      uk: 'Зміщення становить Δf/BW_px у напрямку з найменшою смугою пропускання на піксель. В EPI це фазовий напрямок лише з ≈ 10–30 Гц/піксель → зміщення жиру на кілька пікселів без жиропригнічення.',
    },
  },
];
