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
          `Градієнтна система має швидкість наростання (slew rate) ${sr} Тл/м/с. Скільки триває наростання від 0 до ${g} мТл/м?`,
        ),
        answer: time,
        tolerance: 0.02,
        unit: t('µs', 'мкс'),
        hint: t('Slew-Rate = Gradientenänderung pro Zeit.', 'Швидкість наростання = зміна градієнта за одиницю часу.'),
        explanation: t(
          `$t = G/SR = ${g}\\cdot10^{-3}/${sr}$ s $= ${n(time, 0, lang)}$ µs. Kurze Rampen ermöglichen kurze Echoabstände (EPI, TSE), sind aber durch PNS (dB/dt) begrenzt.`,
          `$t = G/SR = ${g}\\cdot10^{-3}/${sr}$ с $= ${n(time, 0, lang)}$ мкс. Короткі рампи дають змогу отримати короткі інтервали між відлуннями (EPI, TSE), але обмежені стимуляцією периферичних нервів (dB/dt).`,
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
          `Яка довжина РЧ-хвилі в тканині при ${n(field, 2, lang)} Тл, якщо прийняти відносну діелектричну проникність $\\varepsilon_r \\approx 64$? (Відповідь у см)`,
        ),
        answer: lambda,
        tolerance: 0.03,
        unit: t('cm', 'см'),
        hint: '$\\lambda = c / (f\\sqrt{\\varepsilon_r})$',
        explanation: t(
          `$\\lambda = 3\\cdot10^8 / (${n(f / 1e6, 1, lang)}\\cdot10^6 \\cdot 8)$ m $= ${n(lambda, 1, lang)}$ cm. Liegt λ in der Größenordnung des Körperquerschnitts (ab 3 T), entstehen stehende Wellen → inhomogenes B₁ („dielektrische Effekte“, Signalabschattungen im Abdomen). Abhilfe: dielektrische Pads, parallele Sendetechnik (pTx).`,
          `$\\lambda = 3\\cdot10^8 / (${n(f / 1e6, 1, lang)}\\cdot10^6 \\cdot 8)$ м $= ${n(lambda, 1, lang)}$ см. Якщо λ порівнянна з поперечним перерізом тіла (від 3 Тл), виникають стоячі хвилі → неоднорідне B₁ («діелектричні ефекти», затінення сигналу в черевній порожнині). Рішення: діелектричні подушки, паралельне передавання (pTx).`,
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
      uk: 'Яке значення має лінія 0,5 мТл (лінія 5 Гаус) у зоні МР?',
    },
    options: [
      {
        de: 'Grenze des kontrollierten Bereichs: Darüber können Herzschrittmacher und andere aktive Implantate gestört werden.',
        uk: 'Межа контрольованої зони: за нею можуть порушуватися кардіостимулятори та інші активні імплантати.',
      },
      { de: 'Ab dort ist das Feld so stark, dass jede Person quencht.', uk: 'Звідти поле настільки сильне, що кожна людина спричиняє квенч.' },
      { de: 'Grenze, ab der die HF-Abschirmung beginnt.', uk: 'Межа, з якої починається РЧ-екранування.' },
      { de: 'Ort, an dem die Shimspulen montiert sind.', uk: 'Місце, де змонтовано шим-котушки.' },
    ],
    answer: 0,
    explanation: {
      de: 'Das Streufeld außerhalb des Magneten fällt steil ab, insbesondere bei aktiv abgeschirmten Magneten. Innerhalb der 0,5-mT-Linie gelten Zugangsbeschränkungen. Ferromagnetische Gegenstände werden in Richtung Isozentrum beschleunigt (Projektil-Effekt), am stärksten im Bereich höchster Feldgradienten am Tunneleingang.',
      uk: 'Поле розсіювання поза магнітом різко спадає, особливо в активно екранованих магнітів. Усередині лінії 0,5 мТл діють обмеження доступу. Феромагнітні предмети прискорюються до ізоцентру (ефект снаряда), найсильніше в зоні найбільших градієнтів поля біля входу в тунель.',
    },
  },
  {
    id: 'hw-superconductor',
    kind: 'mc',
    difficulty: 1,
    prompt: {
      de: 'Woraus bestehen die Spulen eines supraleitenden klinischen MR-Magneten und wie werden sie gekühlt?',
      uk: 'З чого складаються котушки надпровідного клінічного МР-магніту і як їх охолоджують?',
    },
    options: [
      { de: 'Niob-Titan-Drähte (in Kupfermatrix), gekühlt mit flüssigem Helium auf ≈ 4,2 K.', uk: 'Дроти з ніобій-титану (у мідній матриці), охолоджені рідким гелієм до ≈ 4,2 K.' },
      { de: 'Kupferdraht, gekühlt mit Wasser auf 10 °C.', uk: 'Мідний дріт, охолоджений водою до 10 °C.' },
      { de: 'Permanentmagnetisches Neodym, ungekühlt.', uk: 'Постійний неодимовий магніт, без охолодження.' },
      { de: 'Aluminiumspulen, gekühlt mit flüssigem Stickstoff (77 K).', uk: 'Алюмінієві котушки, охолоджені рідким азотом (77 K).' },
    ],
    answer: 0,
    explanation: {
      de: 'NbTi wird unterhalb von ≈ 9 K supraleitend. Im „Persistent Mode“ fließt der Strom (einige hundert A) ohne Spannungsquelle verlustfrei weiter. Ein Kaltkopf rekondensiert verdampfendes Helium (Zero-Boil-Off). Neuere Systeme kommen mit wenigen Litern Helium in geschlossenen Kreisläufen aus.',
      uk: 'Надпровідник NbTi стає надпровідним нижче ≈ 9 K. У «persistent mode» струм (кілька сотень А) тече без джерела напруги та без втрат. Холодна голова реконденсує гелій, що випаровується (Zero-Boil-Off). Новіші системи обходяться кількома літрами гелію в замкнених контурах.',
    },
  },
  {
    id: 'hw-quench',
    kind: 'multi',
    difficulty: 2,
    prompt: { de: 'Welche Aussagen zum Quench sind korrekt? (Mehrfachauswahl)', uk: 'Які твердження про квенч правильні? (Множинний вибір)' },
    options: [
      {
        de: 'Die Supraleitung bricht zusammen; die gespeicherte Feldenergie wird als Wärme frei und Helium verdampft schlagartig.',
        uk: 'Надпровідність руйнується; накопичена енергія поля вивільняється у вигляді тепла, і гелій миттєво випаровується.',
      },
      {
        de: 'Das gasförmige Helium muss über ein Quenchrohr ins Freie geleitet werden; andernfalls droht Sauerstoffverdrängung.',
        uk: 'Газоподібний гелій має відводитися назовні через квенч-трубу; інакше загрожує витіснення кисню.',
      },
      {
        de: 'Ein Notfall-Quench (Magnet-Stopp-Taster) ist z. B. bei einer eingeklemmten Person durch ferromagnetische Gegenstände angezeigt.',
        uk: 'Аварійний квенч (кнопка зупинки магніту) показаний, напр., якщо людину затиснуто феромагнітним предметом.',
      },
      {
        de: 'Nach einem Quench ist das Magnetfeld innerhalb von Millisekunden wieder vollständig aufgebaut.',
        uk: 'Після квенчу магнітне поле повністю відновлюється протягом мілісекунд.',
      },
    ],
    answers: [0, 1, 2],
    explanation: {
      de: 'Nach einem Quench muss der Magnet neu mit Helium befüllt und wieder hochgefahren (geramped) und geshimmt werden – das dauert Tage und ist teuer. Bei einem Herzstillstand wird der Patient dagegen aus dem Raum gebracht; ein Quench wäre zu langsam und unnötig.',
      uk: 'Після квенчу магніт треба знову заправити гелієм, підняти поле (ramp-up) і виконати шимування – це триває дні та дорого коштує. При зупинці серця пацієнта натомість виносять із приміщення; квенч був би надто повільним і непотрібним.',
    },
  },
  {
    id: 'hw-shim',
    kind: 'mc',
    difficulty: 2,
    prompt: { de: 'Was ist die Aufgabe des Shimsystems?', uk: 'Яке завдання системи шимування?' },
    options: [
      {
        de: 'Homogenisierung von B₀ über das Messvolumen – passiv (Eisenplättchen bei Installation) und aktiv (Shimspulen höherer Ordnung, patientenspezifisch).',
        uk: 'Гомогенізація B₀ у вимірювальному об’ємі – пасивно (залізні пластинки під час встановлення) та активно (шим-котушки вищого порядку, індивідуально для пацієнта).',
      },
      { de: 'Erzeugung des HF-Anregungsfeldes.', uk: 'Створення РЧ-поля збудження.' },
      { de: 'Kühlung der Gradientenspulen.', uk: 'Охолодження градієнтних котушок.' },
      { de: 'Abschirmung gegen externe Radiowellen.', uk: 'Екранування від зовнішніх радіохвиль.' },
    ],
    answer: 0,
    explanation: {
      de: 'Ziel sind wenige ppm Homogenität über ein kugelförmiges Volumen (DSV) von 40–50 cm. Gute Homogenität ist entscheidend für Fettsättigung (CHESS), EPI und Spektroskopie. Der Patient selbst stört das Feld (Suszeptibilität), daher wird vor jeder Untersuchung neu geshimmt.',
      uk: 'Мета – однорідність у кілька ppm у сферичному об’ємі (DSV) 40–50 см. Добра однорідність вирішальна для жиропригнічення (CHESS), EPI та спектроскопії. Сам пацієнт спотворює поле (магнітна сприйнятливість), тому шимування виконують перед кожним дослідженням.',
    },
  },
  {
    id: 'hw-gradient-coils',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Welche Feldkomponente verändern die Gradientenspulen?', uk: 'Яку компоненту поля змінюють градієнтні котушки?' },
    options: [
      {
        de: 'Sie überlagern B₀ mit einer zusätzlichen z-Komponente, deren Stärke linear vom Ort (x, y oder z) abhängt.',
        uk: 'Вони накладають на B₀ додаткову z-компоненту, сила якої лінійно залежить від положення (x, y або z).',
      },
      { de: 'Sie erzeugen ein rotierendes Feld senkrecht zu B₀.', uk: 'Вони створюють обертове поле, перпендикулярне до B₀.' },
      { de: 'Sie drehen die Richtung von B₀ um 90°.', uk: 'Вони повертають напрямок B₀ на 90°.' },
      { de: 'Sie erzeugen das statische Grundfeld.', uk: 'Вони створюють статичне основне поле.' },
    ],
    answer: 0,
    explanation: {
      de: 'B_z(x,y,z) = B₀ + G_x·x + G_y·y + G_z·z. Drei orthogonale Spulensätze (Maxwell-Paar für z, Golay-Sattelspulen für x/y). Die Lorentzkraft auf die Leiter im starken B₀ verursacht den typischen Lärm (bis > 110 dB(A)) – Gehörschutz ist Pflicht.',
      uk: 'B_z(x,y,z) = B₀ + G_x·x + G_y·y + G_z·z. Три ортогональні набори котушок (пара Максвелла для z, сідлоподібні котушки Голея для x/y). Сила Лоренца на провідники в сильному B₀ спричиняє характерний шум (до > 110 дБ(A)) – захист слуху обов’язковий.',
    },
  },
  {
    id: 'hw-faraday',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Wozu dient der Faradaykäfig (HF-Kabine) um den Scanner?', uk: 'Для чого слугує клітка Фарадея (РЧ-кабіна) навколо сканера?' },
    options: [
      {
        de: 'Er schirmt externe Radiofrequenzen (UKW, Funk) ab, die genau im Larmor-Frequenzbereich liegen und das schwache MR-Signal überlagern würden.',
        uk: 'Вона екранує зовнішні радіочастоти (УКХ, радіозв’язок), що лежать саме в діапазоні ларморових частот і перекривали б слабкий МР-сигнал.',
      },
      { de: 'Er schirmt das statische Magnetfeld vollständig ab.', uk: 'Вона повністю екранує статичне магнітне поле.' },
      { de: 'Er verhindert den Austritt von Heliumgas.', uk: 'Вона запобігає виходу газоподібного гелію.' },
      { de: 'Er dient als Erdung für die Gradientenspulen.', uk: 'Вона слугує заземленням для градієнтних котушок.' },
    ],
    answer: 0,
    explanation: {
      de: 'Das MR-Signal liegt im µV-Bereich. Kupfer- oder Aluminiumverkleidung inkl. HF-dichter Tür und Filterplatte (Durchführungen) verhindern Einstreuungen. Das statische Feld wird davon nicht abgeschirmt.',
      uk: 'МР-сигнал лежить у діапазоні мікровольт. Мідне або алюмінієве облицювання разом із РЧ-герметичними дверима та фільтровою панеллю (вводи) запобігають наведенням. Статичне поле цим не екранується.',
    },
  },
  {
    id: 'hw-coils',
    kind: 'mc',
    difficulty: 2,
    prompt: {
      de: 'Warum werden für die Bildgebung meist lokale Mehrkanal-Empfangsspulen (Phased Arrays) statt der Körperspule verwendet?',
      uk: 'Чому для візуалізації зазвичай використовують локальні багатоканальні приймальні котушки (фазовані решітки) замість котушки тіла?',
    },
    options: [
      {
        de: 'Kleine Spulenelemente nah an der Anatomie sehen weniger Rauschen aus dem Körpervolumen → höheres SNR; die unterschiedlichen Sensitivitäten ermöglichen parallele Bildgebung.',
        uk: 'Малі елементи котушки поблизу анатомії «бачать» менше шуму з об’єму тіла → вищий SNR; різні профілі чутливості уможливлюють паралельну візуалізацію.',
      },
      { de: 'Weil die Körperspule nur senden, aber niemals empfangen kann.', uk: 'Тому що котушка тіла може лише передавати, але ніколи не приймати.' },
      { de: 'Weil lokale Spulen das SAR auf null senken.', uk: 'Тому що локальні котушки знижують SAR до нуля.' },
      { de: 'Weil Phased-Array-Spulen das Magnetfeld verstärken.', uk: 'Тому що котушки-фазовані решітки підсилюють магнітне поле.' },
    ],
    answer: 0,
    explanation: {
      de: 'Das Rauschen stammt überwiegend vom Patienten (Gewebeleitfähigkeit). Eine kleine Spule „sieht“ nur ein kleines Volumen. Die integrierte Körperspule dient meist als homogener Sender. Bei Empfang werden die Sendespulen verstimmt (Decoupling) – defekte Verstimmung kann Verbrennungen verursachen.',
      uk: 'Шум походить переважно від пацієнта (електропровідність тканин). Мала котушка «бачить» лише малий об’єм. Вбудована котушка тіла здебільшого слугує однорідним передавачем. Під час прийому передавальні котушки розлаштовуються (decoupling) – несправне розлаштування може спричинити опіки.',
    },
  },
  {
    id: 'hw-burns',
    kind: 'multi',
    difficulty: 2,
    prompt: { de: 'Welche Maßnahmen beugen HF-Verbrennungen vor? (Mehrfachauswahl)', uk: 'Які заходи запобігають РЧ-опікам? (Множинний вибір)' },
    options: [
      {
        de: 'Keine Hautkontakt-Schleifen (Hände/Oberschenkel nicht berühren lassen, Polster verwenden).',
        uk: 'Жодних петель через контакт шкіри (руки/стегна не повинні торкатися, використовувати подушки).',
      },
      { de: 'Kabel nicht in Schlaufen legen und nicht direkt auf die Haut legen.', uk: 'Не укладати кабелі петлями і не класти їх безпосередньо на шкіру.' },
      {
        de: 'Metallhaltige Kleidung, Pflaster (z. B. Nikotinpflaster mit Aluminium) entfernen.',
        uk: 'Зняти одяг із металом, пластирі (напр., нікотиновий пластир з алюмінієм).',
      },
      {
        de: 'Den Patienten mit nassen Tüchern abdecken, um die Leitfähigkeit zu erhöhen.',
        uk: 'Накрити пацієнта вологими рушниками, щоб підвищити електропровідність.',
      },
    ],
    answers: [0, 1, 2],
    explanation: {
      de: 'Leitende Schleifen bilden Antennen bzw. Stromkreise, in denen das HF-Feld Ströme induziert. Feuchtigkeit erhöht die Leitfähigkeit eher und wäre kontraproduktiv.',
      uk: 'Провідні петлі утворюють антени чи електричні контури, в яких РЧ-поле індукує струми. Волога радше підвищує електропровідність і була б контрпродуктивною.',
    },
  },
  {
    id: 'hw-active-shield',
    kind: 'mc',
    difficulty: 3,
    prompt: {
      de: 'Wozu dienen die äußeren, gegensinnig gewickelten Spulen eines aktiv abgeschirmten Magneten bzw. einer abgeschirmten Gradientenspule?',
      uk: 'Для чого слугують зовнішні, зустрічно намотані котушки активно екранованого магніту або екранованої градієнтної котушки?',
    },
    options: [
      {
        de: 'Magnet: Reduktion des Streufelds (kleinere 0,5-mT-Zone). Gradienten: Minimierung von Wirbelströmen in der Kryostatwand.',
        uk: 'Магніт: зменшення поля розсіювання (менша зона 0,5 мТл). Градієнти: мінімізація вихрових струмів у стінці кріостата.',
      },
      { de: 'Sie verdoppeln die Feldstärke im Isozentrum.', uk: 'Вони подвоюють індукцію поля в ізоцентрі.' },
      { de: 'Sie erzeugen das B₁-Feld.', uk: 'Вони створюють поле B₁.' },
      { de: 'Sie kühlen das Helium zusätzlich.', uk: 'Вони додатково охолоджують гелій.' },
    ],
    answer: 0,
    explanation: {
      de: 'Wirbelströme verzerren die Gradientenpulse zeitlich (Bildverzerrungen, Ghosting bei EPI/DWI); die Abschirmung plus Pre-Emphasis kompensieren sie. Das reduzierte Streufeld erleichtert die Raumplanung erheblich.',
      uk: 'Вихрові струми спотворюють градієнтні імпульси в часі (спотворення зображення, «привиди» в EPI/DWI); екранування разом із попередньою компенсацією (pre-emphasis) усувають їх. Зменшене поле розсіювання значно полегшує планування приміщення.',
    },
  },
  {
    id: 'hw-noise',
    kind: 'mc',
    difficulty: 1,
    prompt: { de: 'Was ist die physikalische Ursache des lauten Klopfens im MRT?', uk: 'Яка фізична причина гучного стукоту в МРТ?' },
    options: [
      {
        de: 'Lorentzkräfte auf die stromdurchflossenen Gradientenspulen im starken Magnetfeld lassen diese mechanisch vibrieren.',
        uk: 'Сили Лоренца, що діють на градієнтні котушки зі струмом у сильному магнітному полі, змушують їх механічно вібрувати.',
      },
      { de: 'Das siedende Helium.', uk: 'Кипіння гелію.' },
      { de: 'Die HF-Pulse, die hörbar sind.', uk: 'Чутні РЧ-імпульси.' },
      { de: 'Die Lüftung des Patiententunnels.', uk: 'Вентиляція тунелю пацієнта.' },
    ],
    answer: 0,
    explanation: {
      de: 'F = I·L × B. Das Geräusch folgt dem Gradienten-Schaltmuster (EPI: hoher Dauerton). Die Kräfte steigen mit B₀ → 3 T ist lauter. „Silent“-Sequenzen nutzen sanfte Gradientenformen.',
      uk: 'F = I·L × B. Шум відтворює схему перемикання градієнтів (EPI: високий безперервний тон). Сили зростають із B₀ → 3 Тл гучніший. «Тихі» (silent) послідовності використовують плавні форми градієнтів.',
    },
  },
];
