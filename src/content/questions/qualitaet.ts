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
          `Во сколько раз возрастает SNR, если число усреднений (NEX) увеличить с ${a} до ${b}?`,
        ),
        answer: Math.sqrt(b / a),
        tolerance: 0.02,
        unit: '×',
        hint: t(
          'Signal addiert sich kohärent (∝ N), Rauschen inkohärent (∝ √N).',
          'Сигнал складывается когерентно (∝ N), шум – некогерентно (∝ √N).',
        ),
        explanation: t(
          `SNR ∝ √NEX → Faktor √(${b}/${a}) = ${n(Math.sqrt(b / a), 2, lang)}. Die Messzeit steigt dabei um den Faktor ${n(b / a, 2, lang)} – Mittelung ist eine teure SNR-Quelle.`,
          `SNR ∝ √NEX → коэффициент √(${b}/${a}) = ${n(Math.sqrt(b / a), 2, lang)}. Время сканирования при этом возрастает в ${n(b / a, 2, lang)} раза – усреднение является дорогим источником SNR.`,
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
          `Протокол изменяют с толщины среза ${n(d1, 2, lang)} мм на ${n(d2, 2, lang)} мм и одновременно в фазовом направлении с ${m1} на ${m2} точек матрицы (FOV, NEX, полоса пропускания, матрица считывания без изменений). Во сколько раз изменяется SNR?`,
        ),
        answer: factor,
        tolerance: 0.03,
        unit: '×',
        hint: t(
          'SNR ∝ Voxelvolumen · √(N_PE). Mehr Phasenzeilen verkleinern das Voxel, verlängern aber auch die Messzeit.',
          'SNR ∝ объём вокселя · √(N_PE). Больше фазовых строк уменьшают воксель, но и удлиняют время сканирования.',
        ),
        explanation: t(
          `Voxelvolumen: Faktor (${n(d2, 2, lang)}/${n(d1, 2, lang)})·(${m1}/${m2}) = ${n((d2 / d1) * (m1 / m2), 3, lang)}; zusätzliche Messzeit: √(${m2}/${m1}) = ${n(Math.sqrt(m2 / m1), 3, lang)}. Gesamt: ${n(factor, 3, lang)}. Hohe Auflösung kostet überproportional SNR.`,
          `Объём вокселя: коэффициент (${n(d2, 2, lang)}/${n(d1, 2, lang)})·(${m1}/${m2}) = ${n((d2 / d1) * (m1 / m2), 3, lang)}; дополнительное время сканирования: √(${m2}/${m1}) = ${n(Math.sqrt(m2 / m1), 3, lang)}. Итого: ${n(factor, 3, lang)}. Высокое разрешение обходится непропорционально большой потерей SNR.`,
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
          `Полосу пропускания приёмника увеличивают с ${a} Гц/пикс. до ${a * f} Гц/пикс. Во сколько раз изменяется SNR?`,
        ),
        answer: 1 / Math.sqrt(f),
        tolerance: 0.02,
        unit: '×',
        hint: t(
          'Das Rauschen ist weiß – seine Leistung ist proportional zur erfassten Bandbreite.',
          'Шум белый – его мощность пропорциональна регистрируемой полосе пропускания.',
        ),
        explanation: t(
          `SNR ∝ 1/√BW → Faktor 1/√${f} = ${n(1 / Math.sqrt(f), 3, lang)}. Dafür sinken chemische Verschiebung und Suszeptibilitätsverzerrung um den Faktor ${f}, und die Auslese wird kürzer (kürzeres TE/ESP möglich).`,
          `SNR ∝ 1/√BW → коэффициент 1/√${f} = ${n(1 / Math.sqrt(f), 3, lang)}. Зато химический сдвиг и искажения из-за магнитной восприимчивости уменьшаются в ${f} раза, а считывание становится короче (возможны более короткие TE/ESP).`,
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
          `На сколько пикселей составляет смещение жир–вода (3,5 ppm) в направлении считывания при ${n(field, 2, lang)} Тл и полосе пропускания ${bw} Гц/пикс.?`,
        ),
        answer: chemicalShiftPixels(field, bw),
        tolerance: 0.03,
        unit: t('px', 'пикс.'),
        explanation: t(
          `Δf = 3,5 ppm · ${n(42.577 * field, 2, lang)} MHz = ${n(chemicalShiftHz(field), 0, lang)} Hz → ${n(chemicalShiftHz(field), 0, lang)}/${bw} = ${n(chemicalShiftPixels(field, bw), 2, lang)} px. Bei 3 T verdoppelt sich der Versatz – man kompensiert mit doppelter Bandbreite.`,
          `Δf = 3,5 ppm · ${n(42.577 * field, 2, lang)} МГц = ${n(chemicalShiftHz(field), 0, lang)} Гц → ${n(chemicalShiftHz(field), 0, lang)}/${bw} = ${n(chemicalShiftPixels(field, bw), 2, lang)} пикс. При 3 Тл смещение удваивается – его компенсируют удвоенной полосой пропускания.`,
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
          `Протокол TSE переносят с 1,5 Тл на 3 Тл и уменьшают угол рефокусировки со 180° до ${flipNew}°. Во сколько раз приблизительно изменяется SAR (доминируют рефокусирующие импульсы)?`,
        ),
        answer: f,
        tolerance: 0.03,
        unit: '×',
        hint: 'SAR ∝ B₀² · α²',
        explanation: t(
          `(3/1,5)² · (${flipNew}/180)² = 4 · ${n((flipNew / 180) ** 2, 3, lang)} = ${n(f, 2, lang)}. Selbst mit reduzierten Winkeln liegt das SAR bei 3 T deutlich höher.`,
          `(3/1,5)² · (${flipNew}/180)² = 4 · ${n((flipNew / 180) ** 2, 3, lang)} = ${n(f, 2, lang)}. Даже при уменьшенных углах SAR при 3 Тл значительно выше.`,
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
      ru: 'Какое предельное значение SAR для всего тела действует согласно IEC 60601-2-33 в нормальном режиме работы (Normal Operating Mode, усреднение за 6 мин)?',
    },
    options: [
      { de: '2 W/kg', ru: '2 Вт/кг' },
      { de: '4 W/kg', ru: '4 Вт/кг' },
      { de: '10 W/kg', ru: '10 Вт/кг' },
      { de: '0,4 W/kg', ru: '0,4 Вт/кг' },
    ],
    answer: 0,
    explanation: {
      de: 'Normal Mode: 2 W/kg, First Level Controlled Mode: 4 W/kg (mit medizinischer Überwachung). Für den Kopf gelten 3,2 W/kg; lokal 10 W/kg (Kopf/Rumpf) bzw. 20 W/kg (Extremitäten). Ziel: Kerntemperaturanstieg ≤ 0,5 °C (normal) bzw. ≤ 1 °C.',
      ru: 'Normal Mode: 2 Вт/кг, First Level Controlled Mode: 4 Вт/кг (под медицинским наблюдением). Для головы действует 3,2 Вт/кг; локально 10 Вт/кг (голова/туловище) или 20 Вт/кг (конечности). Цель: повышение температуры ядра тела ≤ 0,5 °C (нормальный режим) или ≤ 1 °C.',
    },
  },
  {
    id: 'q-aliasing',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'In einer axialen Abdomen-Aufnahme falten die Arme von links nach rechts ins Bild. Was hilft am effektivsten?',
      ru: 'На аксиальном снимке брюшной полости руки заворачиваются в изображение слева направо. Что помогает эффективнее всего?',
    },
    options: [
      {
        de: 'Phasen-Oversampling bzw. FOV in Phasenrichtung vergrößern (oder Phasenrichtung auf anterior–posterior tauschen).',
        ru: 'Фазовый оверсэмплинг или увеличение FOV в фазовом направлении (либо смена фазового направления на переднезаднее).',
      },
      { de: 'Bandbreite erhöhen.', ru: 'Увеличить полосу пропускания.' },
      { de: 'TE verkürzen.', ru: 'Сократить TE.' },
      { de: 'Schichtdicke reduzieren.', ru: 'Уменьшить толщину среза.' },
    ],
    answer: 0,
    explanation: {
      de: 'Einfaltung (Wrap-around) tritt in Phasenrichtung auf, wenn das Objekt größer als das FOV ist – die Phase ist 2π-periodisch. In Ausleserichtung verhindert das Oversampling mit Anti-Aliasing-Filter dies standardmäßig ohne Zeitverlust.',
      ru: 'Артефакт наложения (заворот, wrap-around) возникает в фазовом направлении, когда объект больше FOV – фаза 2π-периодична. В направлении считывания этому по умолчанию препятствует оверсэмплинг с антиалиасинговым фильтром без потери времени.',
    },
  },
  {
    id: 'q-motion-direction',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum erscheinen Bewegungsartefakte (Atmung, Pulsation) fast ausschließlich in Phasenrichtung?',
      ru: 'Почему артефакты движения (дыхание, пульсация) появляются почти исключительно в фазовом направлении?',
    },
    options: [
      {
        de: 'Zwischen zwei Phasenkodierschritten liegt ein ganzes TR (hunderte ms), während eine Auslesezeile nur wenige ms dauert – Bewegung erzeugt inkonsistente Phasen von Zeile zu Zeile.',
        ru: 'Между двумя шагами фазового кодирования проходит целый TR (сотни мс), тогда как строка считывания длится лишь несколько мс – движение создаёт несогласованные фазы от строки к строке.',
      },
      { de: 'Weil der Phasengradient schwächer ist.', ru: 'Потому что фазовый градиент слабее.' },
      { de: 'Weil Bewegung immer senkrecht zur Ausleserichtung erfolgt.', ru: 'Потому что движение всегда происходит перпендикулярно направлению считывания.' },
      { de: 'Weil die Frequenzkodierung Bewegung automatisch korrigiert.', ru: 'Потому что частотное кодирование автоматически корректирует движение.' },
    ],
    answer: 0,
    explanation: {
      de: 'Periodische Bewegung → diskrete Geister im Abstand ∝ TR·N_PE/Periode. Gegenmaßnahmen: Atemanhalt, Triggerung/Navigator, Sättigungsbänder, radiale Trajektorien (PROPELLER/BLADE), schnellere Sequenzen.',
      ru: 'Периодическое движение → дискретные «призраки» на расстоянии ∝ TR·N_PE/период. Меры противодействия: задержка дыхания, триггеринг/навигатор, полосы насыщения, радиальные траектории (PROPELLER/BLADE), более быстрые последовательности.',
    },
  },
  {
    id: 'q-suscept',
    kind: 'multi',
    difficulty: 2,
    prompt: {
      de: 'Welche Maßnahmen verringern Suszeptibilitätsartefakte (z. B. durch eine Hüftprothese)? (Mehrfachauswahl)',
      ru: 'Какие меры уменьшают артефакты магнитной восприимчивости (например, от эндопротеза тазобедренного сустава)? (Множественный выбор)',
    },
    options: [
      { de: 'TSE statt GRE verwenden', ru: 'Использовать TSE вместо GRE' },
      { de: 'Empfangsbandbreite erhöhen', ru: 'Увеличить полосу пропускания приёмника' },
      { de: 'Kurze Echozeit wählen', ru: 'Выбрать короткое время эха' },
      { de: 'Auf 1,5 T statt 3 T messen', ru: 'Сканировать на 1,5 Тл вместо 3 Тл' },
      { de: 'EPI-Auslese verwenden', ru: 'Использовать EPI-считывание' },
    ],
    answers: [0, 1, 2, 3],
    explanation: {
      de: 'Suszeptibilität ∝ B₀. SE/TSE refokussiert die Dephasierung; hohe Bandbreite reduziert geometrische Verzerrungen; kurzes TE begrenzt Signalverlust. EPI ist am empfindlichsten. Spezialsequenzen: SEMAC, MAVRIC, View-Angle-Tilting.',
      ru: 'Эффекты восприимчивости ∝ B₀. SE/TSE рефокусирует дефазировку; широкая полоса пропускания уменьшает геометрические искажения; короткое TE ограничивает потерю сигнала. EPI наиболее чувствительна. Специальные последовательности: SEMAC, MAVRIC, View-Angle-Tilting.',
    },
  },
  {
    id: 'q-zipper',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Eine feine, punktierte Linie zieht sich in Phasenrichtung an fester Frequenzposition durch alle Bilder. Was ist die wahrscheinlichste Ursache?',
      ru: 'Тонкая пунктирная линия тянется в фазовом направлении в фиксированной частотной позиции через все изображения. Какова наиболее вероятная причина?',
    },
    options: [
      {
        de: 'HF-Einstreuung (Zipper-Artefakt), z. B. durch offene Kabinentür oder ein defektes elektronisches Gerät im Raum.',
        ru: 'РЧ-наводка (zipper-артефакт), например из-за открытой двери кабины или неисправного электронного устройства в помещении.',
      },
      { de: 'Patientenbewegung.', ru: 'Движение пациента.' },
      { de: 'Zu niedrige Matrix.', ru: 'Слишком маленькая матрица.' },
      { de: 'Falsche Inversionszeit.', ru: 'Неправильное время инверсии.' },
    ],
    answer: 0,
    explanation: {
      de: 'Eine externe Störfrequenz erscheint im Bild an der zugehörigen Frequenzposition, über alle Phasenschritte hinweg → Linie in Phasenrichtung. Der Faradaykäfig muss geschlossen sein.',
      ru: 'Внешняя частота помехи появляется на изображении в соответствующей частотной позиции на всех фазовых шагах → линия в фазовом направлении. Клетка Фарадея должна быть закрыта.',
    },
  },
  {
    id: 'q-pns',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Wodurch wird die periphere Nervenstimulation (PNS) während einer MRT ausgelöst?',
      ru: 'Чем вызывается стимуляция периферических нервов (PNS) во время МРТ?',
    },
    options: [
      {
        de: 'Durch schnell geschaltete Gradientenfelder (hohes dB/dt), die elektrische Felder im Gewebe induzieren.',
        ru: 'Быстро переключаемыми градиентными полями (высокое dB/dt), которые индуцируют электрические поля в тканях.',
      },
      { de: 'Durch die HF-Energie (SAR).', ru: 'РЧ-энергией (SAR).' },
      { de: 'Durch das statische Feld B₀ allein.', ru: 'Только статическим полем B₀.' },
      { de: 'Durch Kontrastmittel.', ru: 'Контрастным веществом.' },
    ],
    answer: 0,
    explanation: {
      de: 'Faraday: E ∝ dB/dt. Hohe Slew-Rates (EPI, DWI) können Muskelzucken/Kribbeln auslösen. Der Scanner begrenzt dB/dt über ein Stimulationsmodell. SAR beschreibt dagegen die Erwärmung durch HF.',
      ru: 'Фарадей: E ∝ dB/dt. Высокие скорости нарастания (EPI, DWI) могут вызывать подёргивания мышц/покалывание. Сканер ограничивает dB/dt с помощью модели стимуляции. SAR же описывает нагрев РЧ-полем.',
    },
  },
  {
    id: 'q-snr-field',
    kind: 'mc',
    difficulty: 2,
    prompt: { de: 'Welche Aussage zum SNR ist korrekt?', ru: 'Какое утверждение об SNR верно?' },
    options: [
      {
        de: 'SNR ∝ Voxelvolumen · √(Messzeit-Anteil N_PE·NEX) / √BW und wächst etwa linear mit B₀.',
        ru: 'SNR ∝ объём вокселя · √(доля времени сканирования N_PE·NEX) / √BW и растёт приблизительно линейно с B₀.',
      },
      { de: 'SNR ist unabhängig von der Schichtdicke.', ru: 'SNR не зависит от толщины среза.' },
      { de: 'Eine doppelte Bandbreite verdoppelt das SNR.', ru: 'Удвоение полосы пропускания удваивает SNR.' },
      { de: 'Parallele Bildgebung erhöht das SNR um den Faktor R.', ru: 'Параллельная визуализация увеличивает SNR в R раз.' },
    ],
    answer: 0,
    explanation: {
      de: 'Parallele Bildgebung senkt das SNR: SNR_R = SNR/(g·√R). Eine Verdopplung der Bandbreite senkt das SNR um √2.',
      ru: 'Параллельная визуализация снижает SNR: SNR_R = SNR/(g·√R). Удвоение полосы пропускания снижает SNR в √2 раза.',
    },
  },
  {
    id: 'q-cs-direction',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'In welcher Richtung ist das Chemical-Shift-Artefakt (1. Art) in einer TSE bzw. in einer EPI sichtbar?',
      ru: 'В каком направлении виден артефакт химического сдвига (1-го рода) в TSE и в EPI?',
    },
    options: [
      {
        de: 'TSE: Ausleserichtung (Frequenz); EPI: Phasenrichtung (dort niedrigste Bandbreite pro Pixel).',
        ru: 'TSE: направление считывания (частотное); EPI: фазовое направление (там наименьшая полоса пропускания на пиксель).',
      },
      { de: 'TSE: Phasenrichtung; EPI: Ausleserichtung.', ru: 'TSE: фазовое направление; EPI: направление считывания.' },
      { de: 'In beiden in Schichtrichtung.', ru: 'В обоих – в направлении среза.' },
      { de: 'Es tritt nur in GRE auf.', ru: 'Он возникает только в GRE.' },
    ],
    answer: 0,
    explanation: {
      de: 'Die Verschiebung beträgt Δf/BW_px in der Richtung mit der geringsten Bandbreite pro Pixel. In EPI liegt diese in Phasenrichtung bei nur ≈ 10–30 Hz/px → mehrere Pixel Fettversatz ohne Fettsättigung.',
      ru: 'Смещение составляет Δf/BW_px в направлении с наименьшей полосой пропускания на пиксель. В EPI это фазовое направление, всего ≈ 10–30 Гц/пикс. → смещение жира на несколько пикселей без жироподавления.',
    },
  },
];
