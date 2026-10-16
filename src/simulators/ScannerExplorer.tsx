import { useState, type KeyboardEvent } from 'react';
import { Panel } from '../components/ui';
import { useGame } from '../game/GameContext';
import { answerXp } from '../game/levels';
import type { Loc } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';

type ComponentId = 'cage' | 'cryostat' | 'coils' | 'coldhead' | 'quench' | 'shim' | 'gradient' | 'body' | 'surface' | 'table' | 'patient';

interface ComponentInfo {
  title: Loc;
  facts: Loc[];
}

const INFO: Record<ComponentId, ComponentInfo> = {
  cage: {
    title: { de: 'HF-Kabine (Faradaykäfig)', ru: 'РЧ-кабина (клетка Фарадея)' },
    facts: [
      { de: 'Kupfer-/Aluminiumverkleidung von Wänden, Decke, Boden und Tür.', ru: 'Медная/алюминиевая облицовка стен, потолка, пола и двери.' },
      {
        de: 'Schirmt UKW, Funk und Mobilfunk ab – das MR-Signal liegt im µV-Bereich bei 64–128 MHz.',
        ru: 'Экранирует УКВ, радио- и мобильную связь – МР-сигнал имеет уровень микровольт на 64–128 МГц.',
      },
      {
        de: 'Kabel werden über eine Filterplatte bzw. Wellenleiter hindurchgeführt. Offene Tür → Zipper-Artefakte.',
        ru: 'Кабели проводят через фильтровую панель или волноводы. Открытая дверь → zipper-артефакты.',
      },
    ],
  },
  cryostat: {
    title: { de: 'Kryostat (Vakuumbehälter)', ru: 'Криостат (вакуумный сосуд)' },
    facts: [
      { de: 'Mehrlagige Isolation: Vakuum, Strahlungsschilde, Heliumbad.', ru: 'Многослойная изоляция: вакуум, радиационные экраны, гелиевая ванна.' },
      { de: 'Hält die supraleitenden Spulen bei 4,2 K bei Raumtemperatur außen.', ru: 'Удерживает сверхпроводящие катушки при 4,2 К при комнатной температуре снаружи.' },
      {
        de: 'Wirbelströme in der Kryostatwand werden durch abgeschirmte Gradienten minimiert.',
        ru: 'Вихревые токи в стенке криостата минимизируются экранированными градиентными катушками.',
      },
    ],
  },
  coils: {
    title: { de: 'Supraleitende Hauptfeldspulen', ru: 'Сверхпроводящие катушки основного поля' },
    facts: [
      { de: 'NbTi-Filamente in Kupfermatrix, supraleitend unter ≈ 9 K.', ru: 'Филаменты NbTi в медной матрице, сверхпроводящие ниже ≈ 9 К.' },
      {
        de: 'Persistent Mode: einige hundert Ampere fließen verlustfrei, das Feld ist permanent aktiv.',
        ru: 'Persistent Mode: несколько сотен ампер текут без потерь, поле включено постоянно.',
      },
      { de: 'Aktive Abschirmspulen (außen, gegensinnig) reduzieren das Streufeld.', ru: 'Активные экранирующие катушки (внешние, встречной намотки) уменьшают поле рассеяния.' },
      { de: 'Homogenität: wenige ppm über 40–50 cm DSV.', ru: 'Однородность: несколько ppm в сфере диаметром (DSV) 40–50 см.' },
    ],
  },
  coldhead: {
    title: { de: 'Kaltkopf (Cryocooler)', ru: 'Холодная головка (криокулер)' },
    facts: [
      { de: 'Gifford-McMahon- oder Pulsrohrkühler mit Heliumkompressor.', ru: 'Криокулер Гиффорда–Мак-Магона или пульсационная труба с гелиевым компрессором.' },
      { de: 'Rekondensiert verdampfendes Helium → „Zero Boil-Off“.', ru: 'Повторно конденсирует испарившийся гелий → «Zero Boil-Off».' },
      {
        de: 'Typisches Klopfgeräusch auch ohne Messung; Ausfall führt langsam zu Heliumverlust.',
        ru: 'Характерный стук даже без сканирования; отказ постепенно приводит к потере гелия.',
      },
    ],
  },
  quench: {
    title: { de: 'Quenchrohr', ru: 'Квенч-труба' },
    facts: [
      {
        de: 'Leitet bei einem Quench das schlagartig verdampfende Helium (≈ 700 L Gas pro L flüssig) ins Freie.',
        ru: 'При квенче отводит наружу мгновенно испаряющийся гелий (≈ 700 л газа на 1 л жидкости).',
      },
      {
        de: 'Gefahr bei Fehlfunktion: Sauerstoffverdrängung und Kälteverbrennungen im Raum.',
        ru: 'Опасность при неисправности: вытеснение кислорода и холодовые ожоги в помещении.',
      },
      {
        de: 'Raum-Sauerstoffsensoren und Notabluft gehören zur Sicherheitsausstattung.',
        ru: 'Датчики кислорода в помещении и аварийная вытяжка входят в оборудование безопасности.',
      },
    ],
  },
  shim: {
    title: { de: 'Shimsystem', ru: 'Система шиммирования' },
    facts: [
      { de: 'Passiv: Eisenplättchen bei Installation.', ru: 'Пассивное: железные пластинки при установке.' },
      {
        de: 'Aktiv: Shimspulen 2./3. Ordnung + Gradienten-Offsets (1. Ordnung), vor jeder Messung patientenspezifisch.',
        ru: 'Активное: шим-катушки 2-го/3-го порядка + смещения градиентов (1-й порядок), индивидуально перед каждым сканированием.',
      },
      { de: 'Entscheidend für Fettsättigung, EPI, Spektroskopie.', ru: 'Решающее для жироподавления, EPI, спектроскопии.' },
    ],
  },
  gradient: {
    title: { de: 'Gradientenspulen (x, y, z)', ru: 'Градиентные катушки (x, y, z)' },
    facts: [
      {
        de: 'Erzeugen ortsabhängige Zusatzfelder ∂Bz/∂x, ∂Bz/∂y, ∂Bz/∂z – Basis der Ortskodierung.',
        ru: 'Создают пространственно зависимые дополнительные поля ∂Bz/∂x, ∂Bz/∂y, ∂Bz/∂z – основа пространственного кодирования.',
      },
      { de: 'Typisch 40–80 mT/m, Slew-Rate bis 200 T/m/s, wassergekühlt.', ru: 'Типично 40–80 мТл/м, скорость нарастания до 200 Тл/м/с, водяное охлаждение.' },
      {
        de: 'Lorentzkräfte → Lärm > 110 dB(A); dB/dt kann Nerven stimulieren (PNS).',
        ru: 'Силы Лоренца → шум > 110 дБ(A); dB/dt может стимулировать нервы (PNS).',
      },
    ],
  },
  body: {
    title: { de: 'HF-Körperspule (Birdcage)', ru: 'РЧ-катушка тела (Birdcage)' },
    facts: [
      { de: 'Sendet ein homogenes, zirkular polarisiertes B₁-Feld.', ru: 'Излучает однородное циркулярно поляризованное поле B₁.' },
      {
        de: 'Leistungsverstärker 15–35 kW; die SAR-Überwachung begrenzt die Sendeleistung.',
        ru: 'Усилитель мощности 15–35 кВт; мониторинг SAR ограничивает мощность передачи.',
      },
      {
        de: 'Ab 3 T: dielektrische Effekte, Abhilfe durch Mehrkanal-Senden (pTx, B₁-Shimming).',
        ru: 'От 3 Тл: диэлектрические эффекты, решение – многоканальная передача (pTx, B₁-шиммирование).',
      },
    ],
  },
  surface: {
    title: { de: 'Lokale Empfangsspule (Phased Array)', ru: 'Локальная приёмная катушка (фазированная решётка)' },
    facts: [
      { de: 'Viele kleine Elemente nah an der Anatomie → hohes SNR.', ru: 'Много малых элементов близко к анатомии → высокое SNR.' },
      {
        de: 'Unterschiedliche Sensitivitätsprofile ermöglichen parallele Bildgebung (SENSE/GRAPPA).',
        ru: 'Разные профили чувствительности делают возможной параллельную визуализацию (SENSE/GRAPPA).',
      },
      {
        de: 'Wird beim Senden verstimmt (Detuning) – Kabel nie in Schlaufen legen!',
        ru: 'При передаче расстраивается (detuning) – никогда не укладывай кабели петлями!',
      },
    ],
  },
  table: {
    title: { de: 'Patiententisch', ru: 'Стол пациента' },
    facts: [
      {
        de: 'Fährt die Untersuchungsregion ins Isozentrum (beste Homogenität und Gradientenlinearität).',
        ru: 'Перемещает область исследования в изоцентр (наилучшая однородность и линейность градиентов).',
      },
      { de: 'Spulenanschlüsse sind im Tisch integriert.', ru: 'Разъёмы катушок встроены в стол.' },
      {
        de: 'Bei großen Untersuchungsbereichen: Move-during-scan bzw. mehrere Stationen.',
        ru: 'Для больших областей: перемещение во время сканирования или несколько станций.',
      },
    ],
  },
  patient: {
    title: { de: 'Patient:in im Isozentrum', ru: 'Пациент в изоцентре' },
    facts: [
      {
        de: 'Ist selbst Hauptrauschquelle (leitfähiges Gewebe) und verändert durch Suszeptibilität das Feld.',
        ru: 'Сам является главным источником шума (проводящая ткань) и изменяет поле за счёт магнитной восприимчивости.',
      },
      { de: 'Gehörschutz, Notrufball und Kommunikation sind Pflicht.', ru: 'Защита слуха, тревожная груша и связь обязательны.' },
      {
        de: 'Hautkontakt-Schleifen vermeiden (Verbrennungsgefahr durch induzierte Ströme).',
        ru: 'Избегай петель с контактом кожи (риск ожогов из-за индуцированных токов).',
      },
    ],
  },
};

const QUIZ: Array<{ question: Loc; answer: ComponentId }> = [
  {
    question: {
      de: 'Welche Komponente erzeugt die linear ortsabhängigen Felder zur Ortskodierung?',
      ru: 'Какой компонент создаёт линейно зависящие от положения поля для пространственного кодирования?',
    },
    answer: 'gradient',
  },
  { question: { de: 'Wo entweicht das Helium bei einem Quench?', ru: 'Куда выходит гелий при квенче?' }, answer: 'quench' },
  {
    question: { de: 'Was verhindert, dass Radiosender das MR-Signal stören?', ru: 'Что не даёт радиостанциям мешать МР-сигналу?' },
    answer: 'cage',
  },
  {
    question: { de: 'Welche Komponente sendet typischerweise den homogenen HF-Puls?', ru: 'Какой компонент обычно излучает однородный РЧ-импульс?' },
    answer: 'body',
  },
  { question: { de: 'Womit wird B₀ patientenspezifisch homogenisiert?', ru: 'Чем B₀ гомогенизируется индивидуально для пациента?' }, answer: 'shim' },
  {
    question: { de: 'Welche Komponente liefert das höchste SNR beim Empfang?', ru: 'Какой компонент даёт наибольшее SNR при приёме?' },
    answer: 'surface',
  },
  { question: { de: 'Was rekondensiert verdampfendes Helium?', ru: 'Что повторно конденсирует испарившийся гелий?' }, answer: 'coldhead' },
  { question: { de: 'Wo fließt der Strom im Persistent Mode?', ru: 'Где течёт ток в режиме Persistent Mode?' }, answer: 'coils' },
];

type Feedback = { ok: boolean; picked: ComponentId; expected: ComponentId; xp: number };

export function ScannerExplorer() {
  const { state, dispatch } = useGame();
  const { tr, loc } = useLang();
  const [selected, setSelected] = useState<ComponentId | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const click = (id: ComponentId) => {
    setSelected(id);
    if (!quizMode) return;
    const q = QUIZ[qIdx];
    const ok = id === q.answer;
    const xp = ok ? answerXp(1, state.stats.streak + 1, false, false) : 0;
    dispatch({ type: 'ANSWER', correct: ok, xp, hintUsed: false });
    setFeedback({ ok, picked: id, expected: q.answer, xp });
    setQIdx((i) => (i + 1) % QUIZ.length);
  };

  const cls = (id: ComponentId) => `sx-part${selected === id ? ' active' : ''}`;
  const part = (id: ComponentId) => ({
    className: cls(id),
    'data-part': id,
    onClick: () => click(id),
    role: 'button',
    tabIndex: 0,
    'aria-label': loc(INFO[id].title),
    onKeyDown: (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        click(id);
      }
    },
  });

  return (
    <div className="sim-grid">
      <Panel
        title={tr('Querschnitt eines 1,5/3-T-Scanners (Blick in den Tunnel)', 'Поперечное сечение сканера 1,5/3 Тл (взгляд в тоннель)')}
        className="span-2"
        actions={
          <button
            className={`btn small${quizMode ? ' primary' : ''}`}
            type="button"
            onClick={() => {
              setQuizMode((q) => !q);
              setFeedback(null);
            }}
          >
            {quizMode ? tr('Quiz beenden', 'Завершить викторину') : tr('🎯 Such-Quiz starten', '🎯 Начать викторину-поиск')}
          </button>
        }
      >
        {quizMode && <p className="quiz-prompt">🔎 {loc(QUIZ[qIdx].question)}</p>}
        {feedback && (
          <p className={feedback.ok ? 'ok-text' : 'bad-text'}>
            {feedback.ok
              ? `${tr('✔ Richtig', '✔ Правильно')}: ${loc(INFO[feedback.picked].title)} (+${feedback.xp} XP)`
              : `${tr('✘ Das ist', '✘ Это')} ${loc(INFO[feedback.picked].title)}. ${tr('Gesucht', 'Искали')}: ${loc(INFO[feedback.expected].title)}.`}
          </p>
        )}
        <svg viewBox="0 0 600 470" className="scanner-svg">
          <rect x="8" y="8" width="584" height="454" rx="10" {...part('cage')} />
          <text x="20" y="30" className="sx-label">
            {tr('HF-Kabine', 'РЧ-кабина')}
          </text>
          <rect x="285" y="8" width="30" height="62" {...part('quench')} />
          <rect x="250" y="40" width="44" height="40" rx="6" {...part('coldhead')} />
          <circle cx="300" cy="260" r="180" {...part('cryostat')} />
          <circle cx="300" cy="260" r="160" className="sx-gap" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
            return <rect key={i} x={300 + Math.cos(a) * 168 - 9} y={260 + Math.sin(a) * 168 - 9} width="18" height="18" rx="3" {...part('coils')} />;
          })}
          <circle cx="300" cy="260" r="148" {...part('shim')} />
          <circle cx="300" cy="260" r="138" {...part('gradient')} />
          <circle cx="300" cy="260" r="112" {...part('body')} />
          <circle cx="300" cy="260" r="100" className="sx-bore" />
          <rect x="215" y="318" width="170" height="16" rx="4" {...part('table')} />
          <ellipse cx="300" cy="282" rx="70" ry="36" {...part('patient')} />
          <path d="M235 258 Q300 220 365 258" fill="none" strokeWidth="10" strokeLinecap="round" {...part('surface')} />
        </svg>
        <p className="small muted">
          {tr(
            'Klicke auf eine Komponente (Tastatur: Tab + Enter). Von außen nach innen: Kabine → Kryostat mit Spulen → Shim → Gradienten → HF-Körperspule → Tunnel.',
            'Нажми на компонент (клавиатура: Tab + Enter). Снаружи внутрь: кабина → криостат с катушками → шим → градиенты → РЧ-катушка тела → тоннель.',
          )}
        </p>
      </Panel>
      <Panel title={selected ? loc(INFO[selected].title) : tr('Komponente wählen', 'Выбери компонент')}>
        {selected ? (
          <ul className="fact-list">
            {INFO[selected].facts.map((f) => (
              <li key={f.de}>{loc(f)}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">
            {tr(
              'Wähle im Querschnitt eine Komponente aus, um ihre Funktion, typische Kennzahlen und Sicherheitsaspekte zu sehen.',
              'Выбери компонент на сечении, чтобы увидеть его функцию, типичные характеристики и аспекты безопасности.',
            )}
          </p>
        )}
      </Panel>
    </div>
  );
}
