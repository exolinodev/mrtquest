import { useId, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Panel } from '../components/ui';
import { useGame } from '../game/GameContext';
import { answerXp } from '../game/levels';
import type { Loc } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';

import { ScannerDiagram, SCANNER_VISUALS, type ComponentId } from './ScannerDiagram';

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

const COMPONENT_IDS = Object.keys(INFO) as ComponentId[];

type Feedback = { ok: boolean; picked: ComponentId; expected: ComponentId; xp: number };

export function ScannerExplorer() {
  const detailsId = useId();
  const { state, dispatch } = useGame();
  const { tr, loc } = useLang();
  const [selected, setSelected] = useState<ComponentId | null>('coils');
  const [zoom, setZoom] = useState(1);
  const [listOpen, setListOpen] = useState(false);
  const [quizMode, setQuizMode] = useState(false);
  const [qIdx, setQIdx] = useState(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const revealMap = useRef(false);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || viewport.clientWidth === 0) return;
    if (zoom === 1) {
      viewport.scrollTo(0, 0);
      return;
    }
    const targetId = feedback?.expected ?? selected;
    const target = targetId ? viewport.querySelector(`[data-part="${targetId}"]`) : null;
    if (!target) return;
    const bounds = target.getBoundingClientRect();
    const frame = viewport.getBoundingClientRect();
    viewport.scrollTo({
      left: viewport.scrollLeft + bounds.left + bounds.width / 2 - frame.left - frame.width / 2,
      top: viewport.scrollTop + bounds.top + bounds.height / 2 - frame.top - frame.height / 2,
    });
  }, [zoom, selected, feedback]);

  useLayoutEffect(() => {
    if (!revealMap.current) return;
    revealMap.current = false;
    mapRef.current?.focus({ preventScroll: true });
    mapRef.current?.scrollIntoView({ block: 'nearest', behavior: 'instant' });
  }, [selected, feedback, listOpen]);

  const choose = (id: ComponentId, reveal = false) => {
    if (quizMode && feedback) return;
    revealMap.current = reveal;
    setSelected(id);
    setListOpen(false);
    if (!quizMode) return;
    const ok = id === QUIZ[qIdx].answer;
    const xp = ok ? answerXp(1, state.stats.streak + 1, false, false) : 0;
    dispatch({ type: 'ANSWER', correct: ok, xp, hintUsed: false });
    setFeedback({ ok, picked: id, expected: QUIZ[qIdx].answer, xp });
  };

  const toggleQuiz = () => {
    revealMap.current = true;
    setQuizMode((value) => !value);
    setSelected(quizMode ? 'coils' : null);
    setFeedback(null);
    setQIdx(0);
    setListOpen(false);
    setZoom(1);
  };

  const componentButtons = () => (
    <div className="scanner-component-list" role="group" aria-label={tr('Scanner-Komponenten', 'Компоненты сканера')}>
      {COMPONENT_IDS.map((id, index) => (
        <button key={id} type="button" className={`scanner-component${selected === id ? ' selected' : ''}`} data-component={id} aria-pressed={selected === id} aria-controls={detailsId} onClick={() => choose(id, true)}>
          <span className="scanner-component-number" aria-hidden="true" style={{ color: SCANNER_VISUALS[id].color }}>{String(index + 1).padStart(2, '0')}</span>
          <span>{loc(INFO[id].title)}</span>
          <span aria-hidden="true">{selected === id ? '✓' : '›'}</span>
        </button>
      ))}
    </div>
  );
  const selectedIndex = selected ? COMPONENT_IDS.indexOf(selected) : 0;
  const detail = feedback?.expected ?? selected;
  const visual = detail ? SCANNER_VISUALS[detail] : null;

  return (
    <div className="scanner-workspace" style={{ '--scanner-color': visual?.color ?? '#38bdf8' } as CSSProperties}>
      <div ref={mapRef} className="scanner-visual-column" tabIndex={-1}>
        <Panel
          title={tr('Scanner entdecken', 'Исследуй сканер')}
          className="scanner-map"
          actions={
            <button
              className={`btn small${quizMode ? ' primary' : ''}`}
              type="button"
              onClick={toggleQuiz}
            >
              {quizMode ? tr('Quiz beenden', 'Завершить') : tr('🎯 Quiz starten', '🎯 Викторина')}
            </button>
          }
        >
          {quizMode && (
            <div className="scanner-question">
              <span className="small muted">{tr('Frage', 'Вопрос')} {qIdx + 1} / {QUIZ.length}</span>
              <p className="quiz-prompt">🔎 {loc(QUIZ[qIdx].question)}</p>
            </div>
          )}
          {!quizMode && (
            <div className="scanner-component-nav">
              <button className="btn" type="button" aria-label={tr('Vorherige Komponente', 'Предыдущий компонент')} onClick={() => choose(COMPONENT_IDS[(selectedIndex - 1 + COMPONENT_IDS.length) % COMPONENT_IDS.length])}>←</button>
              <span className="scanner-step"><span className="eyebrow">{tr('BAUTEIL', 'КОМПОНЕНТ')}</span><strong>{String(selectedIndex + 1).padStart(2, '0')} <span>/ {COMPONENT_IDS.length}</span></strong></span>
              <button className="btn" type="button" aria-label={tr('Nächste Komponente', 'Следующий компонент')} onClick={() => choose(COMPONENT_IDS[(selectedIndex + 1) % COMPONENT_IDS.length])}>→</button>
            </div>
          )}
          {feedback && (
            <div className={`scanner-quiz-feedback ${feedback.ok ? 'is-correct' : 'is-wrong'}`} role="status">
              <strong>{feedback.ok ? tr(`✔ Richtig! +${feedback.xp} XP`, `✔ Правильно! +${feedback.xp} XP`) : tr('✘ Noch nicht richtig.', '✘ Пока неверно.')}</strong>
              {!feedback.ok && <p>{tr('Deine Wahl', 'Твой выбор')}: {loc(INFO[feedback.picked].title)}</p>}
              <button className="btn primary scanner-next-question" type="button" onClick={() => {
                revealMap.current = true;
                setQIdx((index) => (index + 1) % QUIZ.length);
                setFeedback(null);
                setSelected(null);
                setZoom(1);
              }}>{tr('Nächste Frage →', 'Следующий вопрос →')}</button>
            </div>
          )}
          {detail && <div className="scanner-focus-heading" aria-live="polite" aria-atomic="true">
            <span className="scanner-symbol" aria-hidden="true">{visual?.symbol}</span>
            <div><span className="small scanner-focus-label">{feedback && !feedback.ok ? tr('Gesuchte Komponente', 'Правильный компонент') : tr('Im Scanner hervorgehoben', 'Выделено на схеме')}</span><h3>{loc(INFO[detail].title)}</h3></div>
          </div>}
          <div ref={viewportRef} className="scanner-viewport" role="region" tabIndex={0} aria-label={tr('Scanner-Diagramm. Vergrößert durch Wischen verschiebbar.', 'Схема сканера. После увеличения можно перемещать свайпом.')}>
            <div className="scanner-stage" style={{ width: `${zoom * 100}%` }}>
              <ScannerDiagram selected={selected} expected={feedback?.expected} incorrect={feedback && !feedback.ok ? feedback.picked : undefined} disabled={quizMode && !!feedback} titles={INFO} detailsId={detailsId} onChoose={(id) => choose(id)} />
            </div>
          </div>
          {visual && <div className="scanner-visual-caption">
            <span className="scanner-caption-line" aria-hidden="true" />
            <div>
              <p>{loc(visual.caption)}</p>
              {(detail === 'coils' || detail === 'shim' || detail === 'gradient') && <p className="scanner-field-key">{tr('⊙ Feldrichtung aus der Bildebene heraus', '⊙ Поле направлено из плоскости рисунка к нам')}</p>}
            </div>
          </div>}
          <div className="scanner-zoom" role="group" aria-label={tr('Diagramm vergrößern', 'Масштаб схемы')}>
            <button className="btn" type="button" aria-label={tr('Verkleinern', 'Уменьшить')} disabled={zoom === 1} onClick={() => setZoom((value) => Math.max(1, value - 1))}>−</button>
            <output aria-live="polite">{zoom}×</output>
            <button className="btn" type="button" aria-label={tr('Vergrößern', 'Увеличить')} disabled={zoom === 3} onClick={() => setZoom((value) => Math.min(3, value + 1))}>+</button>
            <button className="btn ghost" type="button" disabled={zoom === 1} onClick={() => setZoom(1)}>{tr('Ganzansicht', 'Вся схема')}</button>
          </div>
          <p className="scanner-diagram-hint small muted">
            {zoom > 1
              ? tr('↔ Wische im Bild, um kleine Bauteile zu erreichen.', '↔ Перемещай схему свайпом, чтобы рассмотреть мелкие детали.')
              : tr('Tippe ins Bild oder wechsle mit den Pfeilen. Die Erklärung folgt direkt darunter.', 'Нажми на схему или используй стрелки. Объяснение — сразу под ней.')}
          </p>
        </Panel>
      </div>
      <Panel className="scanner-info">
        <div id={detailsId} className="scanner-details">
          {detail ? (
            <div className="scanner-facts" aria-live="polite" aria-atomic="true">
              <p className="eyebrow">{tr('SO FUNKTIONIERT’S', 'КАК ЭТО РАБОТАЕТ')}</p>
              <h3>{visual && loc(visual.action)}</h3>
              <p className="scanner-detail-name">{loc(INFO[detail].title)}</p>
              <ul className="fact-list">
                {INFO[detail].facts.map((fact) => <li key={fact.de}>{loc(fact)}</li>)}
              </ul>
            </div>
          ) : <h3>{tr('Welche Komponente ist gesucht?', 'Какой компонент нужен?')}</h3>}
        </div>
        {!quizMode && <div className="scanner-detail-nav">
          <button className="btn" type="button" onClick={() => choose(COMPONENT_IDS[(selectedIndex - 1 + COMPONENT_IDS.length) % COMPONENT_IDS.length], true)}>{tr('← Vorheriges Bauteil', '← Предыдущий')}</button>
          <button className="btn" type="button" onClick={() => choose(COMPONENT_IDS[(selectedIndex + 1) % COMPONENT_IDS.length], true)}>{tr('Nächstes Bauteil →', 'Следующий →')}</button>
        </div>}
        {quizMode ? (!feedback && componentButtons()) : (
          <details className="scanner-index" open={listOpen} onToggle={(event) => setListOpen(event.currentTarget.open)}>
            <summary>{tr('Alle 11 Komponenten auswählen', 'Выбрать из 11 компонентов')}</summary>
            {componentButtons()}
          </details>
        )}
      </Panel>
    </div>
  );
}
