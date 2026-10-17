import { useEffect, useState } from 'react';
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

function RecapCard({ q, index }: { q: RecapQuestion; index: number }) {
  const { tr, loc } = useLang();
  const { state, dispatch } = useGame();
  const flag = `recap-${q.id}`;
  const done = !!state.flags[flag];
  return (
    <Panel className={`recap-card${done ? ' done' : ''}`} title={`${tr('Frage', 'Вопрос')} ${index + 1}${done ? ' ✔' : ''}`}>
      <p className="exam-block-question">
        <RichText text={loc(q.question)} />
      </p>
      <details>
        <summary>{tr('Lösungsweg Schritt für Schritt', 'Решение шаг за шагом')}</summary>
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
      </details>
    </Panel>
  );
}

function QuestionCard({ q }: { q: ExamQuestion }) {
  const { tr, loc } = useLang();
  const { state, dispatch } = useGame();
  const [again, setAgain] = useState(false);
  const flag = `exq-${q.id}`;
  const known = !!state.flags[flag];
  const module = MODULE_BY_ID[q.module];
  return (
    <article className={`exam-card${known ? ' known' : ''}${again && !known ? ' again' : ''}`} style={{ ['--accent' as string]: module.accent }}>
      <p className="exam-card-module">
        {module.icon} {loc(module.title)}
        {known && <span className="ok-text"> · ✔ {tr('gewusst', 'знаю')}</span>}
        {again && !known && <span className="warn-text"> · ↻ {tr('nochmal anschauen', 'повторить')}</span>}
      </p>
      <p className="exam-block-question">
        <RichText text={loc(q.question)} />
      </p>
      <details>
        <summary>{tr('Antwort aufdecken', 'Показать ответ')}</summary>
        <p>
          <RichText text={loc(q.short)} />
        </p>
        <p className="exam-block-full">
          <strong>{tr('Für volle Punkte: ', 'Для полного балла: ')}</strong>
          <RichText text={loc(q.full)} />
        </p>
        <div className="row gap wrap">
          {!known && (
            <>
              <button type="button" className="btn primary" onClick={() => dispatch({ type: 'FLAG', flag, xp: QUESTION_XP })}>
                ✓ {tr('Gewusst', 'Знал(а)')} (+{QUESTION_XP} XP)
              </button>
              <button type="button" className="btn" onClick={() => setAgain(true)}>
                ↻ {tr('Nochmal', 'Ещё раз')}
              </button>
            </>
          )}
          <Link to={`/modul/${q.module}`} className="btn">
            📖 {tr('Im Kapitel nachlesen', 'Прочитать в главе')}
          </Link>
        </div>
      </details>
    </article>
  );
}

function ExamQuestions() {
  const { tr, loc } = useLang();
  const { state } = useGame();
  const [objective, setObjective] = useState<ObjectiveId | 'all'>('all');
  const list = EXAM_QUESTIONS.filter((q) => objective === 'all' || q.objective === objective);
  const known = EXAM_QUESTIONS.filter((q) => state.flags[`exq-${q.id}`]).length;
  return (
    <>
      <Segmented
        label={tr('Nach Lernziel filtern', 'Фильтр по цели обучения')}
        value={objective}
        onChange={setObjective}
        options={[{ value: 'all' as const, label: tr('Alle', 'Все') }, ...OBJECTIVES.map((o, i) => ({ value: o.id, label: `${tr('Ziel', 'Цель')} ${i + 1}` }))]}
      />
      {objective !== 'all' && <p className="muted small">{loc(OBJECTIVES.find((o) => o.id === objective)!.title)}</p>}
      <ProgressBar value={EXAM_QUESTIONS.length ? known / EXAM_QUESTIONS.length : 0} label={`${known}/${EXAM_QUESTIONS.length} ${tr('gewusst', 'знаю')}`} color="var(--good)" />
      <div className="exam-card-grid">
        {list.map((q) => (
          <QuestionCard key={q.id} q={q} />
        ))}
      </div>
    </>
  );
}

function CheatSheet() {
  const { tr, loc } = useLang();
  return (
    <section className="cheat-sheet">
      <div className="row gap end no-print">
        <button type="button" className="btn" onClick={() => window.print()}>
          🖨️ {tr('Spickzettel drucken', 'Распечатать шпаргалку')}
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

function ExamCenter() {
  const { tr, loc } = useLang();
  const { state } = useGame();
  const recapDone = RECAP_QUESTIONS.filter((q) => state.flags[`recap-${q.id}`]).length;
  const known = EXAM_QUESTIONS.filter((q) => state.flags[`exq-${q.id}`]).length;
  const readiness = OBJECTIVES.map((o) => o.modules.reduce((s, id) => s + moduleReadiness(state, id), 0) / Math.max(1, o.modules.length));
  const objectivesReached = readiness.filter((r) => r >= 0.99).length;

  return (
    <>
      <h1>🎓 {tr('Prüfungsvorbereitung', 'Подготовка к экзамену')}</h1>
      <p className="lead">
        {tr(
          'Hier läuft alles zusammen, was du für die Prüfung zum MRI-Kapitel brauchst. Grundlage ist das Vorlesungsskript deines Professors. Du findest seine fünf Kontrollfragen mit Lösungsweg, die Fragen, die er sehr wahrscheinlich stellt, einen Spickzettel zum Ausdrucken und die Vorbereitung auf Lab 3.',
          'Здесь собрано всё, что нужно для экзамена по разделу МРТ. Основа: лекционный конспект твоего профессора. Здесь его пять контрольных вопросов с решением, вопросы, которые он скорее всего задаст, шпаргалка для печати и подготовка к лабораторной 3.',
        )}
      </p>

      <section className="kpi-row">
        <div className="kpi">
          <span className="kpi-value">
            {objectivesReached}/{OBJECTIVES.length}
          </span>
          <span className="kpi-label">{tr('Lernziele erreicht', 'Целей достигнуто')}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">
            {recapDone}/{RECAP_QUESTIONS.length}
          </span>
          <span className="kpi-label">{tr('Kontrollfragen sitzen', 'Контрольных вопросов усвоено')}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">
            {known}/{EXAM_QUESTIONS.length}
          </span>
          <span className="kpi-label">{tr('Prüfungsfragen gewusst', 'Экзаменационных вопросов')}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">{Math.round(state.examBest * 100)} %</span>
          <span className="kpi-label">{tr('Bestwert Probeprüfung', 'Лучший пробный экзамен')}</span>
        </div>
      </section>

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

      <h2 className="section-title">{tr('Die fünf Kontrollfragen aus dem Skript', 'Пять контрольных вопросов из конспекта')}</h2>
      <p className="muted">
        {tr(
          'Am Ende des Skripts stellt dein Professor selbst fünf Fragen. Das ist der deutlichste Hinweis darauf, was ihm wichtig ist. Versuche jede Frage erst laut zu beantworten, dann klapp den Lösungsweg auf.',
          'В конце конспекта профессор сам задаёт пять вопросов. Это самая явная подсказка, что для него важно. Сначала попробуй ответить вслух, потом открой решение.',
        )}
      </p>
      <div className="recap-grid">
        {RECAP_QUESTIONS.map((q, i) => (
          <RecapCard key={q.id} q={q} index={i} />
        ))}
      </div>

      <h2 className="section-title">{tr('Das fragt der Prof wahrscheinlich', 'Что скорее всего спросит профессор')}</h2>
      <p className="muted">
        {tr(
          'Diese Fragen leiten sich aus den Lernzielen und den Schwerpunkten des Skripts ab. Beantworte sie zuerst im Kopf oder auf Papier. Dann deck die Antwort auf und sei ehrlich zu dir: gewusst oder nochmal?',
          'Эти вопросы выведены из целей обучения и акцентов конспекта. Сначала ответь в голове или на бумаге. Потом открой ответ и честно оцени себя: знал(а) или ещё раз?',
        )}
      </p>
      <ExamQuestions />

      <h2 className="section-title">{tr('Spickzettel', 'Шпаргалка')}</h2>
      <p className="muted">
        {tr(
          'Alle Kernformeln und Merksätze auf einen Blick. Ideal für die letzte Wiederholung am Abend vor der Prüfung.',
          'Все ключевые формулы и правила на одной странице. Идеально для последнего повторения вечером перед экзаменом.',
        )}
      </p>
      <CheatSheet />

      <h2 className="section-title">{tr('Lab 3 vorbereiten', 'Подготовка к лабораторной 3')}</h2>
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

      <Panel className="exam-cta">
        <p>
          <strong>{tr('Bereit für den Ernstfall?', 'Готов(а) к настоящему испытанию?')}</strong>{' '}
          {tr(
            'Die Probeprüfung mischt Fragen aus allen Prüfungsmodulen, ganz ohne Hinweise.',
            'Пробный экзамен смешивает вопросы из всех экзаменационных модулей, без подсказок.',
          )}
        </p>
        <Link to="/pruefung" className="btn primary">
          🏆 {tr('Probeprüfung starten', 'Начать пробный экзамен')}
        </Link>
      </Panel>

      <h2 className="section-title">{tr('Quelle und Literatur', 'Источник и литература')}</h2>
      <Panel>
        <p>
          <strong>{LECTURE_SOURCE.title}</strong> · {LECTURE_SOURCE.author}
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

/** /vorlesung ist die Prüfungszentrale; alte Missions-Links /vorlesung/:id führen ins passende Modul. */
export function LecturePage({ lessonId }: { lessonId?: string }) {
  const lesson = LECTURE_LESSONS.find((l) => l.id === lessonId);
  useEffect(() => {
    if (lessonId) navigate(lesson ? `/modul/${lesson.module}` : '/vorlesung');
  }, [lessonId, lesson]);
  if (lessonId) return null;
  return (
    <div className="page exam-center">
      <ExamCenter />
    </div>
  );
}
