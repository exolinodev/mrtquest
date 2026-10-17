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
        hint: t(
          'Die Slew-Rate ist das Tempo, mit dem der Gradient steigt. Zeit ist Ziel geteilt durch Tempo. Rechne mT/m zuerst in T/m um.',
          'Скорость нарастания: это темп, с которым растёт градиент. Время равно цели, делённой на темп. Сначала переведи мТл/м в Тл/м.',
        ),
        explanation: t(
          `Die Anstiegszeit ist die Zielstärke geteilt durch die Slew-Rate: $t = G/SR = ${g}\\cdot10^{-3}/${sr}$ s $= ${n(time, 0, lang)}$ µs. Check: ${sr} T/m/s sind ${sr} mT/m pro Millisekunde, für ${g} mT/m braucht das System also weniger als eine Millisekunde. Kurze Rampen erlauben kurze Echoabstände (EPI, TSE). Begrenzt werden sie durch Nervenstimulation (PNS), denn schnelle Feldänderungen dB/dt induzieren Ströme im Körper.`,
          `Время нарастания равно целевой амплитуде, делённой на скорость нарастания: $t = G/SR = ${g}\\cdot10^{-3}/${sr}$ с $= ${n(time, 0, lang)}$ мкс. Проверка: ${sr} Тл/м/с это ${sr} мТл/м за миллисекунду, значит для ${g} мТл/м системе нужно меньше миллисекунды. Короткие фронты позволяют короткие межэховые интервалы (EPI, TSE). Их ограничивает стимуляция периферических нервов (PNS), потому что быстрые изменения поля dB/dt наводят токи в теле.`,
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
        hint: t(
          'Erst die Larmorfrequenz bestimmen. Im Gewebe läuft die Welle um den Faktor $\\sqrt{\\varepsilon_r}$ langsamer als in Luft. Was heißt das für ihre Länge?',
          'Сначала найди частоту Лармора. В ткани волна идёт медленнее, чем в воздухе, в $\\sqrt{\\varepsilon_r}$ раз. Что это значит для её длины?',
        ),
        explanation: t(
          `Im Gewebe schrumpft die Wellenlänge um den Faktor $\\sqrt{64} = 8$. Mit $\\lambda = c/(f\\sqrt{\\varepsilon_r})$ gilt: $\\lambda = 3\\cdot10^8 / (${n(f / 1e6, 1, lang)}\\cdot10^6 \\cdot 8)$ m $= ${n(lambda, 1, lang)}$ cm. Check: In Luft wäre die Welle 8-mal so lang. Liegt λ in der Größenordnung des Körperquerschnitts (ab 3 T), bilden sich stehende Wellen. B₁ wird ungleichmäßig, und zum Beispiel im Bauchraum entstehen dunkle Flecken („dielektrische Effekte“). Abhilfe: dielektrische Pads oder parallele Sendetechnik (pTx).`,
          `В ткани длина волны уменьшается в $\\sqrt{64} = 8$ раз. По формуле $\\lambda = c/(f\\sqrt{\\varepsilon_r})$: $\\lambda = 3\\cdot10^8 / (${n(f / 1e6, 1, lang)}\\cdot10^6 \\cdot 8)$ м $= ${n(lambda, 1, lang)}$ см. Проверка: в воздухе волна была бы в 8 раз длиннее. Если λ сравнима с поперечным сечением тела (от 3 Тл), возникают стоячие волны. B₁ становится неоднородным, и, например, в брюшной полости появляются тёмные пятна («диэлектрические эффекты»). Что помогает: диэлектрические подушки или параллельная передача (pTx).`,
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
      de: 'Die 0,5-mT-Linie markiert, ab wo aktive Implantate wie Herzschrittmacher gestört werden können. Deshalb gelten innerhalb dieser Linie Zugangsbeschränkungen. Das Streufeld fällt außerhalb des Magneten steil ab, vor allem bei aktiv abgeschirmten Magneten. Für ferromagnetische Gegenstände wird es gefährlich: Sie werden zum Isozentrum gerissen (Projektil-Effekt). Am stärksten zieht es am Tunneleingang, wo sich das Feld räumlich am schnellsten ändert.',
      ru: 'Линия 0,5 мТл отмечает, с какого места могут нарушаться активные имплантаты, например кардиостимуляторы. Поэтому внутри этой линии действуют ограничения доступа. Поле рассеяния за пределами магнита резко спадает, особенно у активно экранированных магнитов. Для ферромагнитных предметов это опасно: их притягивает к изоцентру (эффект снаряда). Сильнее всего тянет у входа в туннель, где поле быстрее всего меняется в пространстве.',
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
      de: 'Die Spulen bestehen aus Niob-Titan in einer Kupfermatrix und werden mit flüssigem Helium auf etwa 4,2 K gekühlt. NbTi wird erst unterhalb von etwa 9 K supraleitend, flüssiger Stickstoff mit 77 K wäre also viel zu warm. Im „Persistent Mode“ fließt der Strom von einigen hundert Ampere ohne Spannungsquelle und ohne Verluste weiter, wie ein Karussell ohne Reibung. Ein Kaltkopf verflüssigt verdampfendes Helium wieder (Zero-Boil-Off). Neuere Systeme kommen mit wenigen Litern Helium in geschlossenen Kreisläufen aus.',
      ru: 'Катушки сделаны из ниобий-титана в медной матрице и охлаждаются жидким гелием примерно до 4,2 K. NbTi становится сверхпроводящим только ниже примерно 9 K, так что жидкий азот при 77 K был бы слишком тёплым. В режиме «persistent mode» ток в несколько сотен ампер течёт дальше без источника напряжения и без потерь, как карусель без трения. Холодная головка снова сжижает испаряющийся гелий (Zero-Boil-Off). Новые системы обходятся несколькими литрами гелия в замкнутых контурах.',
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
      de: 'Falsch ist nur die Aussage, das Feld sei nach Millisekunden wieder da. Bei einem Quench bricht die Supraleitung zusammen, die Feldenergie wird zu Wärme, und das Helium verdampft schlagartig. Es muss über das Quenchrohr ins Freie, sonst verdrängt es den Sauerstoff im Raum. Danach muss der Magnet neu mit Helium befüllt, wieder hochgefahren (geramped) und geshimmt werden. Das dauert Tage und ist teuer. Bei einem Herzstillstand bringt man den Patienten deshalb aus dem Raum, statt zu quenchen. Ein Quench wäre dafür zu langsam und unnötig.',
      ru: 'Неверно только утверждение, что поле восстанавливается за миллисекунды. При квенче сверхпроводимость разрушается, энергия поля переходит в тепло, и гелий мгновенно испаряется. Его нужно отвести наружу через квенч-трубу, иначе он вытеснит кислород из помещения. Потом магнит нужно заново заправить гелием, снова поднять поле (ramp-up) и выполнить шиммирование. Это занимает дни и стоит дорого. Поэтому при остановке сердца пациента выносят из помещения, а не делают квенч. Квенч был бы для этого слишком медленным и ненужным.',
    },
  },
  {
    id: 'hw-shim',
    kind: 'mc',
    difficulty: 2,
    prompt: { de: 'Was ist die Aufgabe des Shimsystems?', ru: 'Какова задача системы шиммирования?' },
    options: [
      {
        de: 'Homogenisierung von B₀ über das Messvolumen: passiv (Eisenplättchen bei Installation) und aktiv (Shimspulen höherer Ordnung, patientenspezifisch).',
        ru: 'Гомогенизация B₀ в измерительном объёме: пассивно (железные пластинки при установке) и активно (шиммирующие катушки высших порядков, индивидуально для пациента).',
      },
      { de: 'Erzeugung des HF-Anregungsfeldes.', ru: 'Создание РЧ-поля возбуждения.' },
      { de: 'Kühlung der Gradientenspulen.', ru: 'Охлаждение градиентных катушек.' },
      { de: 'Abschirmung gegen externe Radiowellen.', ru: 'Экранирование от внешних радиоволн.' },
    ],
    answer: 0,
    explanation: {
      de: 'Das Shimsystem macht B₀ im Messvolumen so gleichmäßig wie möglich. Ziel sind wenige ppm Abweichung über eine Kugel (DSV) von 40 bis 50 cm Durchmesser. Schon kleine Feldfehler verschieben die Larmorfrequenz, und darunter leiden besonders Fettsättigung (CHESS), EPI und Spektroskopie. Passiv shimmt man einmal bei der Installation mit Eisenplättchen. Aktiv shimmt man vor jeder Untersuchung mit Shimspulen, denn auch der Patient selbst verzerrt das Feld (Suszeptibilität).',
      ru: 'Система шиммирования делает B₀ в измерительном объёме максимально однородным. Цель: отклонение в несколько ppm в сфере (DSV) диаметром 40–50 см. Даже небольшие ошибки поля сдвигают частоту Лармора, и от этого особенно страдают жироподавление (CHESS), EPI и спектроскопия. Пассивное шиммирование делают один раз при установке с помощью железных пластинок. Активное шиммирование выполняют катушками перед каждым исследованием, потому что сам пациент тоже искажает поле (магнитная восприимчивость).',
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
      de: 'Gradientenspulen addieren zu B₀ eine z-Komponente, die linear mit dem Ort wächst. Die Feldrichtung bleibt z, nur die Stärke hängt vom Ort ab: B_z(x,y,z) = B₀ + G_x·x + G_y·y + G_z·z. Dafür gibt es drei Spulensätze: ein Maxwell-Paar für z und Golay-Sattelspulen für x und y. Der typische Lärm kommt von der Lorentzkraft auf die Leiter im starken B₀, er erreicht über 110 dB(A). Gehörschutz ist deshalb Pflicht.',
      ru: 'Градиентные катушки добавляют к B₀ z-компоненту, которая линейно растёт с координатой. Направление поля остаётся z, от места зависит только величина: B_z(x,y,z) = B₀ + G_x·x + G_y·y + G_z·z. Для этого есть три набора катушек: пара Максвелла для z и седловидные катушки Голея для x и y. Характерный шум создаёт сила Лоренца, действующая на проводники в сильном B₀, он превышает 110 дБ(A). Поэтому защита слуха обязательна.',
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
      de: 'Der Faradaykäfig hält Radiowellen von außen fern. Die Larmorfrequenz liegt bei 1,5 T bei etwa 64 MHz und bei 3 T bei etwa 128 MHz, also mitten im UKW-Bereich, in dem auch Radio und Funk senden. Das MR-Signal ist nur Mikrovolt stark. Ohne Abschirmung ginge es im Funklärm unter, wie ein Flüstern neben einem Lautsprecher. Wände aus Kupfer oder Aluminium, eine HF-dichte Tür und eine Filterplatte für Durchführungen halten die Störungen draußen. Das statische Magnetfeld schirmt der Käfig nicht ab.',
      ru: 'Клетка Фарадея не пропускает радиоволны снаружи. Частота Лармора при 1,5 Тл около 64 МГц, а при 3 Тл около 128 МГц, то есть прямо в диапазоне УКВ, где работают радио и связь. МР-сигнал составляет всего микровольты. Без экранирования он утонул бы в радиошуме, как шёпот рядом с громкоговорителем. Стены из меди или алюминия, РЧ-герметичная дверь и фильтровая панель для вводов не пускают помехи внутрь. Статическое магнитное поле клетка не экранирует.',
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
      { de: 'Weil Phased-Array-Spulen das Magnetfeld verstärken.', ru: 'Потому что катушки типа фазированных решёток усиливают магнитное поле.' },
    ],
    answer: 0,
    explanation: {
      de: 'Lokale Spulen sehen weniger Rauschen und liefern deshalb mehr SNR. Das Rauschen stammt hauptsächlich aus dem Patienten selbst, aus der Leitfähigkeit des Gewebes. Eine kleine Spule nah an der Anatomie „hört“ nur ein kleines Volumen und damit wenig Rauschen, wie ein Ansteckmikrofon statt eines Raummikrofons. Mehrere Elemente mit unterschiedlicher Empfindlichkeit ermöglichen zusätzlich parallele Bildgebung. Die Körperspule dient meist als gleichmäßiger Sender. Während des Sendens werden die Empfangsspulen verstimmt (Decoupling). Fällt das aus, können HF-Ströme in der Spule Verbrennungen verursachen.',
      ru: 'Локальные катушки «видят» меньше шума и поэтому дают больше SNR. Шум идёт в основном от самого пациента, из-за электропроводности тканей. Маленькая катушка рядом с анатомией «слышит» лишь малый объём и поэтому мало шума, как петличный микрофон вместо микрофона на всю комнату. Несколько элементов с разной чувствительностью к тому же делают возможной параллельную визуализацию. Катушка для тела обычно служит однородным передатчиком. Во время передачи приёмные катушки расстраивают (decoupling). Если это не срабатывает, РЧ-токи в катушке могут вызвать ожоги.',
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
      de: 'Alle Maßnahmen helfen, nur die nassen Tücher nicht. Leitende Schleifen wirken wie Antennen oder Stromkreise: Das HF-Feld induziert darin Ströme, und an engen Kontaktstellen wird es heiß. Deshalb vermeidet man Hautkontakt-Schleifen, Kabelschlaufen und Metall auf der Haut. Nässe erhöht die Leitfähigkeit eher und wäre kontraproduktiv.',
      ru: 'Помогают все меры, кроме влажных полотенец. Проводящие петли работают как антенны или электрические контуры: РЧ-поле наводит в них токи, и в узких местах контакта становится горячо. Поэтому избегают петель через контакт кожи, петель кабелей и металла на коже. Влага скорее повышает электропроводность и навредила бы.',
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
      de: 'Die gegensinnigen Spulen löschen das Feld nach außen hin weitgehend aus. Beim Magneten schrumpft so das Streufeld, die 0,5-mT-Zone wird kleiner, und der Raum lässt sich viel leichter planen. Bei den Gradienten verhindern sie, dass das schnell wechselnde Feld in der Kryostatwand Wirbelströme erzeugt. Solche Wirbelströme verzerren die Gradientenpulse zeitlich und führen zu Bildverzerrungen und Geisterbildern bei EPI und DWI. Was übrig bleibt, gleicht die Pre-Emphasis aus.',
      ru: 'Встречные катушки в основном гасят поле снаружи. У магнита так уменьшается поле рассеяния, зона 0,5 мТл становится меньше, и помещение гораздо проще планировать. У градиентов они не дают быстро меняющемуся полю наводить вихревые токи в стенке криостата. Такие вихревые токи искажают градиентные импульсы во времени и приводят к искажениям изображения и «призракам» в EPI и DWI. Остаток компенсирует предыскажение (pre-emphasis).',
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
      de: 'Das Klopfen kommt von der Lorentzkraft F = I·L × B auf die Gradientenspulen. Fließt Strom durch einen Leiter im starken Magnetfeld, wirkt eine Kraft auf ihn. Die Gradienten schalten ständig um, die Spulen ruckeln mit und wirken wie die Membran eines Lautsprechers. Das Geräusch folgt deshalb dem Schaltmuster, EPI erzeugt zum Beispiel einen hohen Dauerton. Die Kraft wächst mit B₀, darum ist 3 T lauter als 1,5 T. „Silent“-Sequenzen nutzen sanftere Gradientenformen.',
      ru: 'Стук создаёт сила Лоренца F = I·L × B, действующая на градиентные катушки. Если ток течёт по проводнику в сильном магнитном поле, на него действует сила. Градиенты постоянно переключаются, катушки дёргаются вместе с ними и работают как мембрана громкоговорителя. Поэтому шум повторяет схему переключения, например EPI даёт высокий непрерывный тон. Сила растёт с B₀, поэтому 3 Тл громче, чем 1,5 Тл. «Тихие» (silent) последовательности используют более плавные формы градиентов.',
    },
  },
];
