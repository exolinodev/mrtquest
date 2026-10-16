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
    title: { de: 'HF-Kabine (Faradaykäfig)', uk: 'РЧ-кабіна (клітка Фарадея)' },
    facts: [
      { de: 'Kupfer-/Aluminiumverkleidung von Wänden, Decke, Boden und Tür.', uk: 'Мідне/алюмінієве облицювання стін, стелі, підлоги та дверей.' },
      {
        de: 'Schirmt UKW, Funk und Mobilfunk ab – das MR-Signal liegt im µV-Bereich bei 64–128 MHz.',
        uk: 'Екранує УКХ, радіо- та мобільний зв’язок – МР-сигнал має рівень мікровольт на 64–128 МГц.',
      },
      {
        de: 'Kabel werden über eine Filterplatte bzw. Wellenleiter hindurchgeführt. Offene Tür → Zipper-Artefakte.',
        uk: 'Кабелі проводять через фільтрувальну панель або хвилеводи. Відчинені двері → артефакти «блискавка».',
      },
    ],
  },
  cryostat: {
    title: { de: 'Kryostat (Vakuumbehälter)', uk: 'Кріостат (вакуумна посудина)' },
    facts: [
      { de: 'Mehrlagige Isolation: Vakuum, Strahlungsschilde, Heliumbad.', uk: 'Багатошарова ізоляція: вакуум, радіаційні екрани, гелієва ванна.' },
      { de: 'Hält die supraleitenden Spulen bei 4,2 K bei Raumtemperatur außen.', uk: 'Утримує надпровідні котушки при 4,2 К за кімнатної температури ззовні.' },
      {
        de: 'Wirbelströme in der Kryostatwand werden durch abgeschirmte Gradienten minimiert.',
        uk: 'Вихрові струми в стінці кріостата мінімізуються екранованими градієнтними котушками.',
      },
    ],
  },
  coils: {
    title: { de: 'Supraleitende Hauptfeldspulen', uk: 'Надпровідні котушки основного поля' },
    facts: [
      { de: 'NbTi-Filamente in Kupfermatrix, supraleitend unter ≈ 9 K.', uk: 'Філаменти NbTi у мідній матриці, надпровідні нижче ≈ 9 К.' },
      {
        de: 'Persistent Mode: einige hundert Ampere fließen verlustfrei, das Feld ist permanent aktiv.',
        uk: 'Persistent Mode: кілька сотень ампер течуть без втрат, поле увімкнене постійно.',
      },
      { de: 'Aktive Abschirmspulen (außen, gegensinnig) reduzieren das Streufeld.', uk: 'Активні екранувальні котушки (зовнішні, зустрічного намотування) зменшують поле розсіювання.' },
      { de: 'Homogenität: wenige ppm über 40–50 cm DSV.', uk: 'Однорідність: кілька ppm у сфері діаметром (DSV) 40–50 см.' },
    ],
  },
  coldhead: {
    title: { de: 'Kaltkopf (Cryocooler)', uk: 'Холодна головка (кріокулер)' },
    facts: [
      { de: 'Gifford-McMahon- oder Pulsrohrkühler mit Heliumkompressor.', uk: 'Кріокулер Гіффорда–Мак-Магона або пульсаційна труба з гелієвим компресором.' },
      { de: 'Rekondensiert verdampfendes Helium → „Zero Boil-Off“.', uk: 'Повторно конденсує випарований гелій → «Zero Boil-Off».' },
      {
        de: 'Typisches Klopfgeräusch auch ohne Messung; Ausfall führt langsam zu Heliumverlust.',
        uk: 'Характерний стукіт навіть без сканування; відмова поступово призводить до втрати гелію.',
      },
    ],
  },
  quench: {
    title: { de: 'Quenchrohr', uk: 'Квенч-труба' },
    facts: [
      {
        de: 'Leitet bei einem Quench das schlagartig verdampfende Helium (≈ 700 L Gas pro L flüssig) ins Freie.',
        uk: 'Під час квенчу відводить назовні гелій, що миттєво випаровується (≈ 700 л газу на 1 л рідини).',
      },
      {
        de: 'Gefahr bei Fehlfunktion: Sauerstoffverdrängung und Kälteverbrennungen im Raum.',
        uk: 'Небезпека при несправності: витіснення кисню та холодові опіки в приміщенні.',
      },
      {
        de: 'Raum-Sauerstoffsensoren und Notabluft gehören zur Sicherheitsausstattung.',
        uk: 'Датчики кисню в кімнаті та аварійна витяжка входять до обладнання безпеки.',
      },
    ],
  },
  shim: {
    title: { de: 'Shimsystem', uk: 'Система шимування' },
    facts: [
      { de: 'Passiv: Eisenplättchen bei Installation.', uk: 'Пасивне: залізні пластинки під час інсталяції.' },
      {
        de: 'Aktiv: Shimspulen 2./3. Ordnung + Gradienten-Offsets (1. Ordnung), vor jeder Messung patientenspezifisch.',
        uk: 'Активне: шим-котушки 2-го/3-го порядку + зміщення градієнтів (1-й порядок), індивідуально перед кожним скануванням.',
      },
      { de: 'Entscheidend für Fettsättigung, EPI, Spektroskopie.', uk: 'Вирішальне для жиропригнічення, EPI, спектроскопії.' },
    ],
  },
  gradient: {
    title: { de: 'Gradientenspulen (x, y, z)', uk: 'Градієнтні котушки (x, y, z)' },
    facts: [
      {
        de: 'Erzeugen ortsabhängige Zusatzfelder ∂Bz/∂x, ∂Bz/∂y, ∂Bz/∂z – Basis der Ortskodierung.',
        uk: 'Створюють просторово залежні додаткові поля ∂Bz/∂x, ∂Bz/∂y, ∂Bz/∂z – основа просторового кодування.',
      },
      { de: 'Typisch 40–80 mT/m, Slew-Rate bis 200 T/m/s, wassergekühlt.', uk: 'Типово 40–80 мТл/м, швидкість наростання до 200 Тл/м/с, водяне охолодження.' },
      {
        de: 'Lorentzkräfte → Lärm > 110 dB(A); dB/dt kann Nerven stimulieren (PNS).',
        uk: 'Сили Лоренца → шум > 110 дБ(A); dB/dt може стимулювати нерви (PNS).',
      },
    ],
  },
  body: {
    title: { de: 'HF-Körperspule (Birdcage)', uk: 'РЧ-котушка тіла (Birdcage)' },
    facts: [
      { de: 'Sendet ein homogenes, zirkular polarisiertes B₁-Feld.', uk: 'Випромінює однорідне циркулярно поляризоване поле B₁.' },
      {
        de: 'Leistungsverstärker 15–35 kW; die SAR-Überwachung begrenzt die Sendeleistung.',
        uk: 'Підсилювач потужності 15–35 кВт; моніторинг SAR обмежує потужність передавання.',
      },
      {
        de: 'Ab 3 T: dielektrische Effekte, Abhilfe durch Mehrkanal-Senden (pTx, B₁-Shimming).',
        uk: 'Від 3 Тл: діелектричні ефекти, рішення – багатоканальне передавання (pTx, B₁-шимування).',
      },
    ],
  },
  surface: {
    title: { de: 'Lokale Empfangsspule (Phased Array)', uk: 'Локальна приймальна котушка (фазована решітка)' },
    facts: [
      { de: 'Viele kleine Elemente nah an der Anatomie → hohes SNR.', uk: 'Багато малих елементів близько до анатомії → високе SNR.' },
      {
        de: 'Unterschiedliche Sensitivitätsprofile ermöglichen parallele Bildgebung (SENSE/GRAPPA).',
        uk: 'Різні профілі чутливості уможливлюють паралельну візуалізацію (SENSE/GRAPPA).',
      },
      {
        de: 'Wird beim Senden verstimmt (Detuning) – Kabel nie in Schlaufen legen!',
        uk: 'Під час передавання розстроюється (detuning) – ніколи не складайте кабелі петлями!',
      },
    ],
  },
  table: {
    title: { de: 'Patiententisch', uk: 'Стіл пацієнта' },
    facts: [
      {
        de: 'Fährt die Untersuchungsregion ins Isozentrum (beste Homogenität und Gradientenlinearität).',
        uk: 'Переміщує ділянку дослідження в ізоцентр (найкраща однорідність і лінійність градієнтів).',
      },
      { de: 'Spulenanschlüsse sind im Tisch integriert.', uk: 'Роз’єми котушок вбудовані в стіл.' },
      {
        de: 'Bei großen Untersuchungsbereichen: Move-during-scan bzw. mehrere Stationen.',
        uk: 'Для великих ділянок: переміщення під час сканування або кілька станцій.',
      },
    ],
  },
  patient: {
    title: { de: 'Patient:in im Isozentrum', uk: 'Пацієнт в ізоцентрі' },
    facts: [
      {
        de: 'Ist selbst Hauptrauschquelle (leitfähiges Gewebe) und verändert durch Suszeptibilität das Feld.',
        uk: 'Сам є головним джерелом шуму (провідна тканина) і змінює поле через магнітну сприйнятливість.',
      },
      { de: 'Gehörschutz, Notrufball und Kommunikation sind Pflicht.', uk: 'Захист слуху, тривожна груша та зв’язок обов’язкові.' },
      {
        de: 'Hautkontakt-Schleifen vermeiden (Verbrennungsgefahr durch induzierte Ströme).',
        uk: 'Уникайте петель із контактом шкіри (ризик опіків через індуковані струми).',
      },
    ],
  },
};

const QUIZ: Array<{ question: Loc; answer: ComponentId }> = [
  {
    question: {
      de: 'Welche Komponente erzeugt die linear ortsabhängigen Felder zur Ortskodierung?',
      uk: 'Який компонент створює лінійно просторово залежні поля для просторового кодування?',
    },
    answer: 'gradient',
  },
  { question: { de: 'Wo entweicht das Helium bei einem Quench?', uk: 'Куди виходить гелій під час квенчу?' }, answer: 'quench' },
  {
    question: { de: 'Was verhindert, dass Radiosender das MR-Signal stören?', uk: 'Що не дає радіостанціям заважати МР-сигналу?' },
    answer: 'cage',
  },
  {
    question: { de: 'Welche Komponente sendet typischerweise den homogenen HF-Puls?', uk: 'Який компонент зазвичай випромінює однорідний РЧ-імпульс?' },
    answer: 'body',
  },
  { question: { de: 'Womit wird B₀ patientenspezifisch homogenisiert?', uk: 'Чим B₀ гомогенізується індивідуально для пацієнта?' }, answer: 'shim' },
  {
    question: { de: 'Welche Komponente liefert das höchste SNR beim Empfang?', uk: 'Який компонент дає найвище SNR під час приймання?' },
    answer: 'surface',
  },
  { question: { de: 'Was rekondensiert verdampfendes Helium?', uk: 'Що повторно конденсує випарований гелій?' }, answer: 'coldhead' },
  { question: { de: 'Wo fließt der Strom im Persistent Mode?', uk: 'Де тече струм у режимі Persistent Mode?' }, answer: 'coils' },
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
        title={tr('Querschnitt eines 1,5/3-T-Scanners (Blick in den Tunnel)', 'Поперечний переріз сканера 1,5/3 Тл (погляд у тунель)')}
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
            {quizMode ? tr('Quiz beenden', 'Завершити вікторину') : tr('🎯 Such-Quiz starten', '🎯 Почати вікторину-пошук')}
          </button>
        }
      >
        {quizMode && <p className="quiz-prompt">🔎 {loc(QUIZ[qIdx].question)}</p>}
        {feedback && (
          <p className={feedback.ok ? 'ok-text' : 'bad-text'}>
            {feedback.ok
              ? `${tr('✔ Richtig', '✔ Правильно')}: ${loc(INFO[feedback.picked].title)} (+${feedback.xp} XP)`
              : `${tr('✘ Das ist', '✘ Це')} ${loc(INFO[feedback.picked].title)}. ${tr('Gesucht', 'Шукали')}: ${loc(INFO[feedback.expected].title)}.`}
          </p>
        )}
        <svg viewBox="0 0 600 470" className="scanner-svg">
          <rect x="8" y="8" width="584" height="454" rx="10" {...part('cage')} />
          <text x="20" y="30" className="sx-label">
            {tr('HF-Kabine', 'РЧ-кабіна')}
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
            'Клацни на компонент (клавіатура: Tab + Enter). Ззовні всередину: кабіна → кріостат із котушками → шим → градієнти → РЧ-котушка тіла → тунель.',
          )}
        </p>
      </Panel>
      <Panel title={selected ? loc(INFO[selected].title) : tr('Komponente wählen', 'Обери компонент')}>
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
              'Обери компонент на перерізі, щоб побачити його функцію, типові характеристики та аспекти безпеки.',
            )}
          </p>
        )}
      </Panel>
    </div>
  );
}
