import { useEffect, useMemo, useState } from 'react';
import { RichText, TeX } from '../components/RichText';
import { Link, navigate } from '../components/router';
import { Panel, ProgressBar, Segmented } from '../components/ui';
import { CHEAT_SHEET, EXAM_QUESTIONS, LAB3_STEPS, OBJECTIVES, RECAP_QUESTIONS, type ExamQuestion, type ObjectiveId, type RecapQuestion } from '../content/examPrep';
import { LECTURE_LESSONS, LECTURE_SOURCE } from '../content/lecture';
import { MODULE_BY_ID, type ModuleId } from '../content/modules';
import { useGame } from '../game/GameContext';
import type { GameState } from '../game/types';
import { useLang } from '../i18n/LanguageContext';
import { SIMULATOR_BY_ID } from '../simulators/registry';

const RECAP_XP = 20;
const QUESTION_XP = 10;
const ACCENT = '#34d399';

type Tab = 'ueberblick' | 'kontrollfragen' | 'karteikarten' | 'spickzettel' | 'lab3';
const TABS: Tab[] = ['ueberblick', 'kontrollfragen', 'karteikarten', 'spickzettel', 'lab3'];

/** Fortschritt eines Moduls: halb Theorie gelesen, halb Challenge (voll ab 80 %). */
function moduleReadiness(state: GameState, id: ModuleId): number {
  const m = state.modules[id];
  if (!m) return 0;
  return (m.theoryRead ? 0.5 : 0) + 0.5 * Math.min(1, m.bestScore / 0.8);
}

function SimLink({ sim }: { sim?: string }) {
  const { tr, loc } = useLang();
  const meta = sim ? SIMULATOR_BY_ID[sim.split('/')[0] as keyof typeof SIMULATOR_BY_ID] : undefined;
  if (!sim || !meta) return null;
  return (
    <Link to={`/labor/${sim}`} className="btn">
      {meta.icon} {tr('Im Labor ausprobieren', 'Попробовать в лаборатории')}: {loc(meta.title)} →
    </Link>
  );
}

/* ------------------------------------------------------------------ Überblick */

function Overview() {
  const { tr, loc } = useLang();
  const { state } = useGame();
  const readiness = OBJECTIVES.map((o) => o.modules.reduce((s, id) => s + moduleReadiness(state, id), 0) / Math.max(1, o.modules.length));
  const recapDone = RECAP_QUESTIONS.filter((q) => state.flags[`recap-${q.id}`]).length;
  const known = EXAM_QUESTIONS.filter((q) => state.flags[`exq-${q.id}`]).length;
  const steps: Array<{ icon: string; title: string; text: string; to: string; done: number; total: number }> = [
    {
      icon: '📖',
      title: tr('Module durcharbeiten', 'Пройти модули'),
      text: tr('Lies jedes Kapitel, probier den Simulator aus und spiel die Challenge.', 'Прочитай каждую главу, попробуй симулятор и пройди задание.'),
      to: '/modul/einfuehrung',
      done: Math.round(readiness.reduce((a, b) => a + b, 0)),
      total: OBJECTIVES.length,
    },
    {
      icon: '🎯',
      title: tr('Kontrollfragen meistern', 'Освоить контрольные вопросы'),
      text: tr('Die fünf Fragen, die der Professor selbst ins Skript geschrieben hat.', 'Пять вопросов, которые профессор сам включил в конспект.'),
      to: '/vorlesung/kontrollfragen',
      done: recapDone,
      total: RECAP_QUESTIONS.length,
    },
    {
      icon: '🃏',
      title: tr('Karteikarten üben', 'Тренировать карточки'),
      text: tr('Die Fragen, die sehr wahrscheinlich drankommen. Eine nach der anderen.', 'Вопросы, которые скорее всего будут на экзамене. По одному.'),
      to: '/vorlesung/karteikarten',
      done: known,
      total: EXAM_QUESTIONS.length,
    },
    {
      icon: '🏆',
      title: tr('Probeprüfung schreiben', 'Написать пробный экзамен'),
      text: tr('Alles gemischt, ohne Hinweise. Ab 80 % bist du bereit.', 'Всё вперемешку, без подсказок. От 80 % ты готов(а).'),
      to: '/pruefung',
      done: state.examBest >= 0.8 ? 1 : 0,
      total: 1,
    },
  ];
  return (
    <>
      <h2 className="section-title">{tr('Dein Fahrplan in vier Schritten', 'Твой план в четыре шага')}</h2>
      <div className="prep-steps">
        {steps.map((s, i) => (
          <Link key={s.to} to={s.to} className={`prep-step${s.done >= s.total ? ' done' : ''}`}>
            <span className="prep-step-num">{s.done >= s.total ? '✓' : i + 1}</span>
            <span className="prep-step-body">
              <strong>
                {s.icon} {s.title}
              </strong>
              <span className="small muted">{s.text}</span>
              <ProgressBar value={s.done / s.total} label={`${s.done}/${s.total}`} color={ACCENT} />
            </span>
          </Link>
        ))}
      </div>

      <h2 className="section-title">{tr('Die vier Lernziele', 'Четыре цели обучения')}</h2>
      <p className="muted">
        {tr(
          'Das Skript nennt vier Dinge, die du nach dem Kapitel können sollst. Genau daran orientiert sich die Prüfung. Der Balken füllt sich, wenn du die zugehörigen Kapitel liest und die Challenges schaffst.',
          'Конспект называет четыре вещи, которые ты должен уметь после этого раздела. Именно на них ориентируется экзамен. Полоса заполняется, когда ты читаешь главы и проходишь задания.',
        )}
      </p>
      <div className="module-grid objective-grid">
        {OBJECTIVES.map((o, i) => (
          <div key={o.id} className={`module-card${readiness[i] >= 0.99 ? ' done' : ''}`}>
            <span className="module-index">
              {tr('Lernziel', 'Цель')} {i + 1}
            </span>
            <strong>{loc(o.title)}</strong>
            <ProgressBar value={readiness[i]} label={`${Math.round(readiness[i] * 100)} %`} />
            <span className="objective-links">
              {o.modules.map((id) => (
                <Link key={id} to={`/modul/${id}`}>
                  {MODULE_BY_ID[id].icon} {loc(MODULE_BY_ID[id].title)}
                </Link>
              ))}
            </span>
          </div>
        ))}
      </div>

      <h2 className="section-title">{tr('Quelle und Literatur', 'Источник и литература')}</h2>
      <Panel>
        <p>
          <strong>{LECTURE_SOURCE.title}</strong> · {tr('Vorlesungsskript', 'лекционный конспект')}
        </p>
        <p className="small muted">
          {tr(
            'Alle Erklärungen, Grafiken und Simulationen sind eigenständig neu aufbereitet. Abbildungen Dritter aus dem Skript werden nicht nachgebaut.',
            'Все объяснения, графики и симуляции подготовлены заново. Сторонние иллюстрации из конспекта не воспроизводятся.',
          )}
        </p>
        <ul className="lecture-bibliography">
          {LECTURE_SOURCE.bibliography.map((b) => (
            <li key={b.title}>
              {'url' in b ? (
                <a href={b.url} target="_blank" rel="noreferrer">
                  {b.title}
                </a>
              ) : (
                <>
                  {b.title} · ISBN {b.isbn}
                </>
              )}
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}

/* ------------------------------------------------------------------ Kontrollfragen */

function RecapLesson({ q, index }: { q: RecapQuestion; index: number }) {
  const { tr, loc } = useLang();
  const { state, dispatch } = useGame();
  const [open, setOpen] = useState(false);
  const flag = `recap-${q.id}`;
  const done = !!state.flags[flag];
  return (
    <section className={`recap-lesson${done ? ' done' : ''}`}>
      <h2>
        <span className="sec-num">{done ? '✓' : index + 1}</span> <RichText text={loc(q.question)} />
      </h2>
      {!open ? (
        <>
          <p className="muted">
            {tr(
              'Versuch zuerst, die Frage laut oder auf Papier zu beantworten. Erst dann den Lösungsweg öffnen. So merkst du dir die Antwort viel besser.',
              'Сначала попробуй ответить вслух или на бумаге. Только потом открывай решение. Так ответ запомнится гораздо лучше.',
            )}
          </p>
          <button type="button" className="btn primary" onClick={() => setOpen(true)}>
            {tr('Lösungsweg zeigen', 'Показать решение')}
          </button>
        </>
      ) : (
        <>
          <ol className="recap-steps">
            {q.steps.map((s, i) => (
              <li key={i}>
                <RichText text={loc(s)} />
              </li>
            ))}
          </ol>
          <div className="recap-answer">
            <p className="exam-block-label">✍️ {tr('So schreibst du es in der Prüfung', 'Так пиши на экзамене')}</p>
            <p>
              <RichText text={loc(q.answer)} />
            </p>
          </div>
          <aside className="mnemonic">
            <span aria-hidden="true">💡</span>
            <p>
              <strong>{tr('Merksatz: ', 'Запомни: ')}</strong>
              <RichText text={loc(q.mnemonic)} />
            </p>
          </aside>
          <div className="row gap wrap">
            <SimLink sim={q.sim} />
            {done ? (
              <span className="ok-text">✔ {tr('Sitzt', 'Усвоено')}</span>
            ) : (
              <button type="button" className="btn primary" onClick={() => dispatch({ type: 'FLAG', flag, xp: RECAP_XP })}>
                ✓ {tr('Kann ich erklären', 'Могу объяснить')} (+{RECAP_XP} XP)
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}

function RecapTab() {
  const { tr } = useLang();
  return (
    <article className="theory recap-tab">
      <div className="theory-body">
        <p className="theory-hook">
          {tr(
            'Am Ende des Skripts stellt dein Professor selbst fünf Fragen. Das ist der deutlichste Hinweis darauf, was ihm wichtig ist. Wer diese fünf sicher erklären kann, hat den Kern des Kapitels verstanden.',
            'В конце конспекта профессор сам задаёт пять вопросов. Это самая явная подсказка, что для него важно. Кто уверенно объясняет эти пять, понял суть раздела.',
          )}
        </p>
        {RECAP_QUESTIONS.map((q, i) => (
          <RecapLesson key={q.id} q={q} index={i} />
        ))}
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ Karteikarten */

function Flashcards() {
  const { tr, loc } = useLang();
  const { state, dispatch } = useGame();
  const [objective, setObjective] = useState<ObjectiveId | 'all'>('all');
  const [onlyOpen, setOnlyOpen] = useState(true);
  const [round, setRound] = useState(0);
  const deck = useMemo(
    () => EXAM_QUESTIONS.filter((q) => (objective === 'all' || q.objective === objective) && (!onlyOpen || !state.flags[`exq-${q.id}`])),
    // Der Stapel wird nur beim Start einer Runde gebildet, nicht nach jeder Antwort.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [objective, onlyOpen, round],
  );
  const [queue, setQueue] = useState<ExamQuestion[]>(deck);
  const [revealed, setRevealed] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  useEffect(() => {
    setQueue(deck);
    setRevealed(false);
    setKnownCount(0);
  }, [deck]);

  const card = queue[0];
  const total = EXAM_QUESTIONS.length;
  const knownTotal = EXAM_QUESTIONS.filter((q) => state.flags[`exq-${q.id}`]).length;

  const answer = (known: boolean) => {
    if (!card) return;
    if (known) {
      dispatch({ type: 'FLAG', flag: `exq-${card.id}`, xp: QUESTION_XP });
      setKnownCount((n) => n + 1);
      setQueue((q) => q.slice(1));
    } else {
      setQueue((q) => [...q.slice(1), q[0]]);
    }
    setRevealed(false);
  };

  return (
    <div className="flashcards">
      <div className="flashcard-controls">
        <Segmented
          label={tr('Lernziel', 'Цель обучения')}
          value={objective}
          onChange={setObjective}
          options={[{ value: 'all' as const, label: tr('Alle', 'Все') }, ...OBJECTIVES.map((o, i) => ({ value: o.id, label: `${tr('Ziel', 'Цель')} ${i + 1}` }))]}
        />
        <Segmented
          label={tr('Karten', 'Карточки')}
          value={onlyOpen ? 'open' : 'all'}
          onChange={(v) => setOnlyOpen(v === 'open')}
          options={[
            { value: 'open', label: tr('Nur offene', 'Только новые') },
            { value: 'all', label: tr('Alle', 'Все') },
          ]}
        />
      </div>
      {objective !== 'all' && <p className="muted small">{loc(OBJECTIVES.find((o) => o.id === objective)!.title)}</p>}
      <ProgressBar value={total ? knownTotal / total : 0} label={`${knownTotal}/${total} ${tr('Karten sitzen', 'карточек усвоено')}`} color={ACCENT} />

      {card ? (
        <article className="flashcard" style={{ ['--accent' as string]: MODULE_BY_ID[card.module].accent }}>
          <p className="question-kind">
            {MODULE_BY_ID[card.module].icon} {loc(MODULE_BY_ID[card.module].title)} · {tr('noch', 'осталось')} {queue.length}
          </p>
          <h2 className="question-prompt">
            <RichText text={loc(card.question)} />
          </h2>
          {!revealed ? (
            <>
              <p className="muted small">{tr('Antworte zuerst im Kopf oder auf Papier.', 'Сначала ответь в голове или на бумаге.')}</p>
              <button type="button" className="btn primary" onClick={() => setRevealed(true)}>
                {tr('Antwort aufdecken', 'Показать ответ')}
              </button>
            </>
          ) : (
            <>
              <div className="recap-answer">
                <p className="exam-block-label">✍️ {tr('Das gehört mindestens rein', 'Минимум для ответа')}</p>
                <p>
                  <RichText text={loc(card.short)} />
                </p>
              </div>
              <p className="exam-block-full">
                <strong>{tr('Für volle Punkte: ', 'Для полного балла: ')}</strong>
                <RichText text={loc(card.full)} />
              </p>
              <p className="small muted">{tr('Ehrlich zu dir: Hättest du das so gewusst?', 'Честно: ты бы так ответил(а)?')}</p>
              <div className="row gap wrap">
                <button type="button" className="btn primary" onClick={() => answer(true)}>
                  ✓ {tr('Gewusst', 'Знал(а)')} (+{QUESTION_XP} XP)
                </button>
                <button type="button" className="btn" onClick={() => answer(false)}>
                  ↻ {tr('Nochmal, später', 'Ещё раз, позже')}
                </button>
                <Link to={`/modul/${card.module}`} className="btn ghost">
                  📖 {tr('Im Kapitel nachlesen', 'Прочитать в главе')}
                </Link>
              </div>
            </>
          )}
        </article>
      ) : (
        <Panel className="flashcard-done">
          <p>
            <strong>{deck.length ? tr('Runde geschafft! 🎉', 'Раунд пройден! 🎉') : tr('Hier ist nichts mehr offen. 🎉', 'Здесь всё пройдено. 🎉')}</strong>{' '}
            {deck.length
              ? tr(`Du hast ${knownCount} Karten gewusst. Karten mit „Nochmal“ kamen so lange wieder, bis sie saßen.`, `Ты знал(а) ${knownCount} карточек. Карточки «Ещё раз» возвращались, пока не запомнились.`)
              : tr('Wähle „Alle“, um alle Karten noch einmal durchzugehen.', 'Выбери «Все», чтобы пройти все карточки ещё раз.')}
          </p>
          <div className="row gap wrap">
            <button type="button" className="btn" onClick={() => setRound((r) => r + 1)}>
              ↻ {tr('Neue Runde', 'Новый раунд')}
            </button>
            <Link to="/pruefung" className="btn primary">
              🏆 {tr('Zur Probeprüfung', 'К пробному экзамену')}
            </Link>
          </div>
        </Panel>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Spickzettel & Lab 3 */

function CheatSheet() {
  const { tr, loc } = useLang();
  return (
    <section className="cheat-sheet">
      <div className="row gap end no-print">
        <p className="muted small grow">
          {tr(
            'Alle Kernformeln und Merksätze auf einen Blick. Ideal für die letzte Wiederholung am Abend vor der Prüfung.',
            'Все ключевые формулы и правила на одной странице. Идеально для последнего повторения вечером перед экзаменом.',
          )}
        </p>
        <button type="button" className="btn" onClick={() => window.print()}>
          🖨️ {tr('Drucken', 'Печать')}
        </button>
      </div>
      <div className="cheat-grid">
        {CHEAT_SHEET.map((sec, i) => (
          <Panel key={i} title={loc(sec.title)} className="cheat-section">
            <dl>
              {sec.items.map((it, j) => (
                <div key={j} className="cheat-item">
                  <dt>{loc(it.label)}</dt>
                  <dd>
                    {it.tex && <TeX tex={it.tex} block />}
                    {it.text && <RichText text={loc(it.text)} />}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>
        ))}
      </div>
    </section>
  );
}

function Lab3() {
  const { tr, loc } = useLang();
  return (
    <>
      <p className="theory-hook">
        {tr(
          'Im Lab 3 rechnest du selbst nach, was im Kapitel steht: erst die Fourier-Transformation im Tabellenblatt, dann was Signaländerungen mit dem Spektrum machen, und schließlich ein echtes Bloch-Modell. Hier kannst du alle drei Schritte vorher ausprobieren.',
          'В лабораторной 3 ты сам(а) проверяешь то, что написано в главе: сначала преобразование Фурье в таблице, затем как изменения сигнала влияют на спектр, и наконец настоящая модель Блоха. Здесь можно заранее попробовать все три шага.',
        )}
      </p>
      <div className="sim-grid">
        {LAB3_STEPS.map((step, i) => (
          <Panel key={i} title={`${i + 1}. ${loc(step.title)}`}>
            <p>
              <RichText text={loc(step.text)} />
            </p>
            <SimLink sim={step.sim} />
          </Panel>
        ))}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ Seite */

function ExamCenter({ tab }: { tab: Tab }) {
  const { tr } = useLang();
  const { state } = useGame();
  const recapDone = RECAP_QUESTIONS.filter((q) => state.flags[`recap-${q.id}`]).length;
  const known = EXAM_QUESTIONS.filter((q) => state.flags[`exq-${q.id}`]).length;
  const labels: Record<Tab, string> = {
    ueberblick: tr('🧭 Überblick', '🧭 Обзор'),
    kontrollfragen: `${tr('🎯 Kontrollfragen', '🎯 Контрольные')} ${recapDone}/${RECAP_QUESTIONS.length}`,
    karteikarten: `${tr('🃏 Karteikarten', '🃏 Карточки')} ${known}/${EXAM_QUESTIONS.length}`,
    spickzettel: tr('📝 Spickzettel', '📝 Шпаргалка'),
    lab3: tr('🧪 Lab 3', '🧪 Лаб. 3'),
  };

  return (
    <div className="page exam-center" style={{ ['--accent' as string]: ACCENT }}>
      <header className="module-header">
        <span className="module-icon big" aria-hidden="true">
          🎯
        </span>
        <div>
          <p className="eyebrow">{tr('Prüfungsvorbereitung', 'Подготовка к экзамену')}</p>
          <h1>{tr('Fit für die Prüfung', 'Готов(а) к экзамену')}</h1>
          <p className="lead">
            {tr(
              'Hier übst du genau das, was in der Prüfung zum MRI-Kapitel drankommt: die Kontrollfragen aus dem Skript, die wahrscheinlichsten Prüfungsfragen als Karteikarten, einen Spickzettel und die Vorbereitung auf Lab 3.',
              'Здесь ты тренируешь именно то, что будет на экзамене по МРТ: контрольные вопросы из конспекта, самые вероятные экзаменационные вопросы в виде карточек, шпаргалку и подготовку к лабораторной 3.',
            )}
          </p>
        </div>
      </header>
      <div className="tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t} role="tab" type="button" aria-selected={tab === t} className={tab === t ? 'active' : ''} onClick={() => navigate(`/vorlesung/${t}`)}>
            {labels[t]}
          </button>
        ))}
      </div>
      <div className="tab-body">
        {tab === 'ueberblick' && <Overview />}
        {tab === 'kontrollfragen' && <RecapTab />}
        {tab === 'karteikarten' && <Flashcards />}
        {tab === 'spickzettel' && <CheatSheet />}
        {tab === 'lab3' && <Lab3 />}
      </div>
      <p className="next-module">
        {tr('Bereit für den Ernstfall?', 'Готов(а) к настоящему испытанию?')} <Link to="/pruefung">🏆 {tr('Probeprüfung starten', 'Начать пробный экзамен')}</Link>
      </p>
    </div>
  );
}

/** /vorlesung ist die Prüfungsvorbereitung mit Tabs; alte Missions-Links /vorlesung/:id führen ins passende Modul. */
export function LecturePage({ lessonId }: { lessonId?: string }) {
  const lesson = LECTURE_LESSONS.find((l) => l.id === lessonId);
  const tab = TABS.find((t) => t === lessonId);
  useEffect(() => {
    if (lessonId && !tab) navigate(lesson ? `/modul/${lesson.module}` : '/vorlesung');
  }, [lessonId, lesson, tab]);
  if (lessonId && !tab) return null;
  return <ExamCenter tab={tab ?? 'ueberblick'} />;
}
