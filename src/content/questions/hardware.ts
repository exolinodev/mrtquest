import { larmorMHz } from '../../physics/mri';
import { n, pick, tl, type QuestionSource } from './types';

export const hardwareQuestions: QuestionSource[] = [
  {
    id: 'hw-rise',
    generate: (rng, lang) => {
      const t = tl(lang);
      const g = pick(rng, [30, 40, 45, 80]);
      const sr = pick(rng, [100, 150, 200]);
      const time = (g / 1000 / sr) * 1e6; // µs
      return {
        kind: 'numeric',
        id: 'hw-rise',
        difficulty: 1,
        prompt: t(
          `Ein Gradientensystem hat eine Slew-Rate von ${sr} T/m/s. Wie lange dauert der Anstieg von 0 auf ${g} mT/m?`,
          `Градиентная система имеет скорость нарастания (slew rate) ${sr} Тл/м/с. Сколько длится нарастание от 0 до ${g} мТл/м?`,
        ),
        answer: time,
        tolerance: 0.02,
        unit: t('µs', 'мкс'),
        hint: t('Slew-Rate = Gradientenänderung pro Zeit.', 'Скорость нарастания = изменение градиента за единицу времени.'),
        explanation: t(
          `$t = G/SR = ${g}\\cdot10^{-3}/${sr}$ s $= ${n(time, 0, lang)}$ µs. Kurze Rampen ermöglichen kurze Echoabstände (EPI, TSE), sind aber durch PNS (dB/dt) begrenzt.`,
          `$t = G/SR = ${g}\\cdot10^{-3}/${sr}$ с $= ${n(time, 0, lang)}$ мкс. Короткие фронты позволяют получить короткие межэховые интервалы (EPI, TSE), но ограничены стимуляцией периферических нервов (dB/dt).`,
        ),
      };
    },
  },
  {
    id: 'hw-lambda',
    generate: (rng, lang) => {
      const t = tl(lang);
      const field = pick(rng, [1.5, 3, 7]);
      const f = larmorMHz(field) * 1e6;
      const lambda = (3e8 / (f * Math.sqrt(64))) * 100;
      return {
        kind: 'numeric',
        id: 'hw-lambda',
        difficulty: 3,
        prompt: t(
          `Wie groß ist die HF-Wellenlänge im Gewebe bei ${n(field, 2, lang)} T, wenn man eine relative Permittivität $\\varepsilon_r \\approx 64$ annimmt? (Angabe in cm)`,
          `Какова длина РЧ-волны в ткани при ${n(field, 2, lang)} Тл, если принять относительную диэлектрическую проницаемость $\\varepsilon_r \\approx 64$? (Ответ в см)`,
        ),
        answer: lambda,
        tolerance: 0.03,
        unit: t('cm', 'см'),
        hint: '$\\lambda = c / (f\\sqrt{\\varepsilon_r})$',
        explanation: t(
          `$\\lambda = 3\\cdot10^8 / (${n(f / 1e6, 1, lang)}\\cdot10^6 \\cdot 8)$ m $= ${n(lambda, 1, lang)}$ cm. Liegt λ in der Größenordnung des Körperquerschnitts (ab 3 T), entstehen stehende Wellen → inhomogenes B₁ („dielektrische Effekte“, Signalabschattungen im Abdomen). Abhilfe: dielektrische Pads, parallele Sendetechnik (pTx).`,
          `$\\lambda = 3\\cdot10^8 / (${n(f / 1e6, 1, lang)}\\cdot10^6 \\cdot 8)$ м $= ${n(lambda, 1, lang)}$ см. Если λ сравнима с поперечным сечением тела (от 3 Тл), возникают стоячие волны → неоднородное B₁ («диэлектрические эффекты», затенение сигнала в брюшной полости). Решение: диэлектрические подушки, параллельная передача (pTx).`,
        ),
      };
    },
  },
  {
    id: 'hw-gauss',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Welche Bedeutung hat die 0,5-mT-Linie (5-Gauss-Linie) im MR-Bereich?',
      ru: 'Какое значение имеет линия 0,5 мТл (линия 5 Гаусс) в зоне МР?',
    },
    options: [
      {
        de: 'Grenze des kontrollierten Bereichs: Darüber können Herzschrittmacher und andere aktive Implantate gestört werden.',
        ru: 'Граница контролируемой зоны: за ней могут нарушаться функции кардиостимуляторов и других активных имплантатов.',
      },
      { de: 'Ab dort ist das Feld so stark, dass jede Person quencht.', ru: 'Начиная оттуда поле настолько сильное, что любой человек вызывает квенч.' },
      { de: 'Grenze, ab der die HF-Abschirmung beginnt.', ru: 'Граница, с которой начинается РЧ-экранирование.' },
      { de: 'Ort, an dem die Shimspulen montiert sind.', ru: 'Место, где смонтированы шиммирующие катушки.' },
    ],
    answer: 0,
    explanation: {
      de: 'Das Streufeld außerhalb des Magneten fällt steil ab, insbesondere bei aktiv abgeschirmten Magneten. Innerhalb der 0,5-mT-Linie gelten Zugangsbeschränkungen. Ferromagnetische Gegenstände werden in Richtung Isozentrum beschleunigt (Projektil-Effekt), am stärksten im Bereich höchster Feldgradienten am Tunneleingang.',
      ru: 'Поле рассеяния за пределами магнита резко спадает, особенно у активно экранированных магнитов. Внутри линии 0,5 мТл действуют ограничения доступа. Ферромагнитные предметы ускоряются к изоцентру (эффект снаряда), сильнее всего в зоне наибольших градиентов поля у входа в туннель.',
    },
  },
  {
    id: 'hw-superconductor',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Woraus bestehen die Spulen eines supraleitenden klinischen MR-Magneten und wie werden sie gekühlt?',
      ru: 'Из чего состоят катушки сверхпроводящего клинического МР-магнита и как их охлаждают?',
    },
    options: [
      { de: 'Niob-Titan-Drähte (in Kupfermatrix), gekühlt mit flüssigem Helium auf ≈ 4,2 K.', ru: 'Провода из ниобий-титана (в медной матрице), охлаждённые жидким гелием до ≈ 4,2 K.' },
      { de: 'Kupferdraht, gekühlt mit Wasser auf 10 °C.', ru: 'Медный провод, охлаждённый водой до 10 °C.' },
      { de: 'Permanentmagnetisches Neodym, ungekühlt.', ru: 'Постоянный неодимовый магнит, без охлаждения.' },
      { de: 'Aluminiumspulen, gekühlt mit flüssigem Stickstoff (77 K).', ru: 'Алюминиевые катушки, охлаждённые жидким азотом (77 K).' },
    ],
    answer: 0,
    explanation: {
      de: 'NbTi wird unterhalb von ≈ 9 K supraleitend. Im „Persistent Mode“ fließt der Strom (einige hundert A) ohne Spannungsquelle verlustfrei weiter. Ein Kaltkopf rekondensiert verdampfendes Helium (Zero-Boil-Off). Neuere Systeme kommen mit wenigen Litern Helium in geschlossenen Kreisläufen aus.',
      ru: 'Сверхпроводник NbTi переходит в сверхпроводящее состояние ниже ≈ 9 K. В режиме «persistent mode» ток (несколько сотен А) течёт без источника напряжения и без потерь. Холодная головка реконденсирует испаряющийся гелий (Zero-Boil-Off). Новые системы обходятся несколькими литрами гелия в замкнутых контурах.',
    },
  },
  {
    id: 'hw-quench',
    kind: 'multi',
    difficulty: 2,
    prompt: { de: 'Welche Aussagen zum Quench sind korrekt? (Mehrfachauswahl)', ru: 'Какие утверждения о квенче верны? (Множественный выбор)' },
    options: [
      {
        de: 'Die Supraleitung bricht zusammen; die gespeicherte Feldenergie wird als Wärme frei und Helium verdampft schlagartig.',
        ru: 'Сверхпроводимость разрушается; накопленная энергия поля высвобождается в виде тепла, и гелий мгновенно испаряется.',
      },
      {
        de: 'Das gasförmige Helium muss über ein Quenchrohr ins Freie geleitet werden; andernfalls droht Sauerstoffverdrängung.',
        ru: 'Газообразный гелий должен отводиться наружу через квенч-трубу; иначе грозит вытеснение кислорода.',
      },
      {
        de: 'Ein Notfall-Quench (Magnet-Stopp-Taster) ist z. B. bei einer eingeklemmten Person durch ferromagnetische Gegenstände angezeigt.',
        ru: 'Аварийный квенч (кнопка остановки магнита) показан, например, если человек зажат ферромагнитным предметом.',
      },
      {
        de: 'Nach einem Quench ist das Magnetfeld innerhalb von Millisekunden wieder vollständig aufgebaut.',
        ru: 'После квенча магнитное поле полностью восстанавливается в течение миллисекунд.',
      },
    ],
    answers: [0, 1, 2],
    explanation: {
      de: 'Nach einem Quench muss der Magnet neu mit Helium befüllt und wieder hochgefahren (geramped) und geshimmt werden – das dauert Tage und ist teuer. Bei einem Herzstillstand wird der Patient dagegen aus dem Raum gebracht; ein Quench wäre zu langsam und unnötig.',
      ru: 'После квенча магнит нужно заново заправить гелием, поднять поле (ramp-up) и выполнить шиммирование – это занимает дни и стоит дорого. При остановке сердца пациента, напротив, выносят из помещения; квенч был бы слишком медленным и ненужным.',
    },
  },
  {
    id: 'hw-shim',
    kind: 'mc',
    difficulty: 2,
    prompt: { de: 'Was ist die Aufgabe des Shimsystems?', ru: 'Какова задача системы шиммирования?' },
    options: [
      {
        de: 'Homogenisierung von B₀ über das Messvolumen – passiv (Eisenplättchen bei Installation) und aktiv (Shimspulen höherer Ordnung, patientenspezifisch).',
        ru: 'Гомогенизация B₀ в измерительном объёме – пассивно (железные пластинки при установке) и активно (шиммирующие катушки высших порядков, индивидуально для пациента).',
      },
      { de: 'Erzeugung des HF-Anregungsfeldes.', ru: 'Создание РЧ-поля возбуждения.' },
      { de: 'Kühlung der Gradientenspulen.', ru: 'Охлаждение градиентных катушек.' },
      { de: 'Abschirmung gegen externe Radiowellen.', ru: 'Экранирование от внешних радиоволн.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ziel sind wenige ppm Homogenität über ein kugelförmiges Volumen (DSV) von 40–50 cm. Gute Homogenität ist entscheidend für Fettsättigung (CHESS), EPI und Spektroskopie. Der Patient selbst stört das Feld (Suszeptibilität), daher wird vor jeder Untersuchung neu geshimmt.',
      ru: 'Цель – однородность в несколько ppm в сферическом объёме (DSV) 40–50 см. Хорошая однородность решающе важна для жироподавления (CHESS), EPI и спектроскопии. Сам пациент искажает поле (магнитная восприимчивость), поэтому шиммирование выполняют перед каждым исследованием.',
    },
  },
  {
    id: 'hw-gradient-coils',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Welche Feldkomponente verändern die Gradientenspulen?', ru: 'Какую компоненту поля изменяют градиентные катушки?' },
    options: [
      {
        de: 'Sie überlagern B₀ mit einer zusätzlichen z-Komponente, deren Stärke linear vom Ort (x, y oder z) abhängt.',
        ru: 'Они накладывают на B₀ дополнительную z-компоненту, величина которой линейно зависит от положения (x, y или z).',
      },
      { de: 'Sie erzeugen ein rotierendes Feld senkrecht zu B₀.', ru: 'Они создают вращающееся поле, перпендикулярное B₀.' },
      { de: 'Sie drehen die Richtung von B₀ um 90°.', ru: 'Они поворачивают направление B₀ на 90°.' },
      { de: 'Sie erzeugen das statische Grundfeld.', ru: 'Они создают статическое основное поле.' },
    ],
    answer: 0,
    explanation: {
      de: 'B_z(x,y,z) = B₀ + G_x·x + G_y·y + G_z·z. Drei orthogonale Spulensätze (Maxwell-Paar für z, Golay-Sattelspulen für x/y). Die Lorentzkraft auf die Leiter im starken B₀ verursacht den typischen Lärm (bis > 110 dB(A)) – Gehörschutz ist Pflicht.',
      ru: 'B_z(x,y,z) = B₀ + G_x·x + G_y·y + G_z·z. Три ортогональных набора катушек (пара Максвелла для z, седловидные катушки Голея для x/y). Сила Лоренца, действующая на проводники в сильном B₀, вызывает характерный шум (до > 110 дБ(A)) – защита слуха обязательна.',
    },
  },
  {
    id: 'hw-faraday',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Wozu dient der Faradaykäfig (HF-Kabine) um den Scanner?', ru: 'Для чего служит клетка Фарадея (РЧ-кабина) вокруг сканера?' },
    options: [
      {
        de: 'Er schirmt externe Radiofrequenzen (UKW, Funk) ab, die genau im Larmor-Frequenzbereich liegen und das schwache MR-Signal überlagern würden.',
        ru: 'Она экранирует внешние радиочастоты (УКВ, радиосвязь), лежащие как раз в диапазоне ларморовых частот и перекрывающие бы слабый МР-сигнал.',
      },
      { de: 'Er schirmt das statische Magnetfeld vollständig ab.', ru: 'Она полностью экранирует статическое магнитное поле.' },
      { de: 'Er verhindert den Austritt von Heliumgas.', ru: 'Она предотвращает выход газообразного гелия.' },
      { de: 'Er dient als Erdung für die Gradientenspulen.', ru: 'Она служит заземлением для градиентных катушек.' },
    ],
    answer: 0,
    explanation: {
      de: 'Das MR-Signal liegt im µV-Bereich. Kupfer- oder Aluminiumverkleidung inkl. HF-dichter Tür und Filterplatte (Durchführungen) verhindern Einstreuungen. Das statische Feld wird davon nicht abgeschirmt.',
      ru: 'МР-сигнал лежит в диапазоне микровольт. Медная или алюминиевая обшивка вместе с РЧ-герметичной дверью и фильтровой панелью (вводы) предотвращают наводки. Статическое поле этим не экранируется.',
    },
  },
  {
    id: 'hw-coils',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum werden für die Bildgebung meist lokale Mehrkanal-Empfangsspulen (Phased Arrays) statt der Körperspule verwendet?',
      ru: 'Почему для визуализации обычно используют локальные многоканальные приёмные катушки (фазированные решётки) вместо катушки для тела?',
    },
    options: [
      {
        de: 'Kleine Spulenelemente nah an der Anatomie sehen weniger Rauschen aus dem Körpervolumen → höheres SNR; die unterschiedlichen Sensitivitäten ermöglichen parallele Bildgebung.',
        ru: 'Маленькие элементы катушки вблизи анатомии «видят» меньше шума из объёма тела → более высокое SNR; разные профили чувствительности делают возможной параллельную визуализацию.',
      },
      { de: 'Weil die Körperspule nur senden, aber niemals empfangen kann.', ru: 'Потому что катушка для тела может только передавать, но никогда не принимать.' },
      { de: 'Weil lokale Spulen das SAR auf null senken.', ru: 'Потому что локальные катушки снижают SAR до нуля.' },
      { de: 'Weil Phased-Array-Spulen das Magnetfeld verstärken.', ru: 'Потому что катушки – фазированные решётки усиливают магнитное поле.' },
    ],
    answer: 0,
    explanation: {
      de: 'Das Rauschen stammt überwiegend vom Patienten (Gewebeleitfähigkeit). Eine kleine Spule „sieht“ nur ein kleines Volumen. Die integrierte Körperspule dient meist als homogener Sender. Bei Empfang werden die Sendespulen verstimmt (Decoupling) – defekte Verstimmung kann Verbrennungen verursachen.',
      ru: 'Шум исходит преимущественно от пациента (электропроводность тканей). Маленькая катушка «видит» лишь малый объём. Встроенная катушка для тела в основном служит однородным передатчиком. При приёме передающие катушки расстраиваются (decoupling) – неисправная расстройка может вызвать ожоги.',
    },
  },
  {
    id: 'hw-burns',
    kind: 'multi',
    difficulty: 2,
    prompt: { de: 'Welche Maßnahmen beugen HF-Verbrennungen vor? (Mehrfachauswahl)', ru: 'Какие меры предотвращают РЧ-ожоги? (Множественный выбор)' },
    options: [
      {
        de: 'Keine Hautkontakt-Schleifen (Hände/Oberschenkel nicht berühren lassen, Polster verwenden).',
        ru: 'Никаких петель через контакт кожи (руки/бёдра не должны соприкасаться, использовать подкладки).',
      },
      { de: 'Kabel nicht in Schlaufen legen und nicht direkt auf die Haut legen.', ru: 'Не укладывать кабели петлями и не класть их непосредственно на кожу.' },
      {
        de: 'Metallhaltige Kleidung, Pflaster (z. B. Nikotinpflaster mit Aluminium) entfernen.',
        ru: 'Снять одежду с металлом, пластыри (например, никотиновый пластырь с алюминием).',
      },
      {
        de: 'Den Patienten mit nassen Tüchern abdecken, um die Leitfähigkeit zu erhöhen.',
        ru: 'Накрыть пациента влажными полотенцами, чтобы повысить электропроводность.',
      },
    ],
    answers: [0, 1, 2],
    explanation: {
      de: 'Leitende Schleifen bilden Antennen bzw. Stromkreise, in denen das HF-Feld Ströme induziert. Feuchtigkeit erhöht die Leitfähigkeit eher und wäre kontraproduktiv.',
      ru: 'Проводящие петли образуют антенны или электрические контуры, в которых РЧ-поле индуцирует токи. Влага скорее повышает электропроводность и была бы контрпродуктивной.',
    },
  },
  {
    id: 'hw-active-shield',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Wozu dienen die äußeren, gegensinnig gewickelten Spulen eines aktiv abgeschirmten Magneten bzw. einer abgeschirmten Gradientenspule?',
      ru: 'Для чего служат внешние, встречно намотанные катушки активно экранированного магнита или экранированной градиентной катушки?',
    },
    options: [
      {
        de: 'Magnet: Reduktion des Streufelds (kleinere 0,5-mT-Zone). Gradienten: Minimierung von Wirbelströmen in der Kryostatwand.',
        ru: 'Магнит: уменьшение поля рассеяния (меньшая зона 0,5 мТл). Градиенты: минимизация вихревых токов в стенке криостата.',
      },
      { de: 'Sie verdoppeln die Feldstärke im Isozentrum.', ru: 'Они удваивают индукцию поля в изоцентре.' },
      { de: 'Sie erzeugen das B₁-Feld.', ru: 'Они создают поле B₁.' },
      { de: 'Sie kühlen das Helium zusätzlich.', ru: 'Они дополнительно охлаждают гелий.' },
    ],
    answer: 0,
    explanation: {
      de: 'Wirbelströme verzerren die Gradientenpulse zeitlich (Bildverzerrungen, Ghosting bei EPI/DWI); die Abschirmung plus Pre-Emphasis kompensieren sie. Das reduzierte Streufeld erleichtert die Raumplanung erheblich.',
      ru: 'Вихревые токи искажают градиентные импульсы во времени (искажения изображения, «призраки» в EPI/DWI); экранирование вместе с предыскажением (pre-emphasis) компенсируют их. Уменьшенное поле рассеяния значительно упрощает планирование помещения.',
    },
  },
  {
    id: 'hw-noise',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Was ist die physikalische Ursache des lauten Klopfens im MRT?', ru: 'Какова физическая причина громкого стука в МРТ?' },
    options: [
      {
        de: 'Lorentzkräfte auf die stromdurchflossenen Gradientenspulen im starken Magnetfeld lassen diese mechanisch vibrieren.',
        ru: 'Силы Лоренца, действующие на градиентные катушки с током в сильном магнитном поле, заставляют их механически вибрировать.',
      },
      { de: 'Das siedende Helium.', ru: 'Кипение гелия.' },
      { de: 'Die HF-Pulse, die hörbar sind.', ru: 'Слышимые РЧ-импульсы.' },
      { de: 'Die Lüftung des Patiententunnels.', ru: 'Вентиляция туннеля пациента.' },
    ],
    answer: 0,
    explanation: {
      de: 'F = I·L × B. Das Geräusch folgt dem Gradienten-Schaltmuster (EPI: hoher Dauerton). Die Kräfte steigen mit B₀ → 3 T ist lauter. „Silent“-Sequenzen nutzen sanfte Gradientenformen.',
      ru: 'F = I·L × B. Шум повторяет схему переключения градиентов (EPI: высокий непрерывный тон). Силы растут с B₀ → 3 Тл громче. «Тихие» (silent) последовательности используют плавные формы градиентов.',
    },
  },
];
