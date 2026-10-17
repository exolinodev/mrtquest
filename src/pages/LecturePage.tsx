import { useMemo, useState } from 'react';
import { ClinicalAtlas, hasClinicalAtlas } from '../components/ClinicalAtlas';
import { RichText, TeX } from '../components/RichText';
import { Link } from '../components/router';
import { Callout, Panel, ProgressBar } from '../components/ui';
import { lectureExperimentPath, LECTURE_CONTEXT_PAGES, LECTURE_LESSONS, LECTURE_SOURCE, type LectureLesson } from '../content/lecture';
import { ALL_SIMULATORS, MODULE_BY_ID } from '../content/modules';
import { materialize } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import { useLang } from '../i18n/LanguageContext';
import { SIMULATOR_BY_ID } from '../simulators/registry';

const LESSON_XP = 15;

const pageRange = (pages: number[]) => (pages.length > 2 && pages[pages.length - 1] - pages[0] === pages.length - 1 ? `${pages[0]}–${pages[pages.length - 1]}` : pages.join(', '));
const missionNumber = (index: number) => String(index + 1).padStart(2, '0');

/** Wissenscheck einer Mission – gleiche Antwortkarten und Rückmeldung wie in den Challenges. */
function LessonCheck({ lesson }: { lesson: LectureLesson }) {
  const { lang, tr } = useLang();
  const { state, dispatch } = useGame();
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const seed = [...lesson.id].reduce((s, c) => s * 31 + c.charCodeAt(0), 1) >>> 0;
  const q = useMemo(() => materialize({ source: lesson.question, seed, shuffleSeed: seed }, lang), [lesson, seed, lang]);
  const done = !!state.flags[`lecture-${lesson.id}`];
  if (q.kind !== 'mc') return null;
  const correct = choice === q.answer;

  const optionState = (i: number): string => {
    if (!checked) return choice === i ? 'selected' : '';
    if (i === q.answer) return 'correct';
    if (i === choice) return 'wrong';
    return 'dim';
  };

  const check = () => {
    setChecked(true);
    if (correct) dispatch({ type: 'FLAG', flag: `lecture-${lesson.id}`, xp: LESSON_XP });
  };

  return (
    <Panel title={tr('Wissenscheck', 'Проверка знаний')} className="span-3 lecture-check">
      <p className="question-kind">
        {tr('Einfachauswahl', 'Один вариант')}
        {!done && ` · +${LESSON_XP} XP`}
      </p>
      <h3 className="question-prompt">
        <RichText text={q.prompt} />
      </h3>
      <div className="options" role="radiogroup" aria-label={tr('Antwort wählen', 'Выбор ответа')}>
        {q.options.map((option, i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={choice === i}
            className={`option ${optionState(i)}`}
            disabled={checked}
            onClick={() => setChoice(i)}
          >
            <span className="option-marker" aria-hidden="true">
              {String.fromCharCode(65 + i)}
            </span>
            <span>
              <RichText text={option} />
            </span>
          </button>
        ))}
      </div>
      {!checked ? (
        <button type="button" className="btn primary" disabled={choice === null} onClick={check}>
          {tr('Antwort prüfen', 'Проверить ответ')}
        </button>
      ) : (
        <div className={`feedback ${correct ? 'is-correct' : 'is-wrong'}`}>
          <strong>{correct ? tr('✔ Richtig – Mission geschafft!', '✔ Верно — миссия выполнена!') : tr('✘ Noch nicht. Schau dir die Begründung an.', '✘ Пока нет. Прочитай объяснение.')}</strong>
          <p>
            <RichText text={q.explanation} />
          </p>
          {!correct && (
            <button
              className="btn"
              type="button"
              onClick={() => {
                setChoice(null);
                setChecked(false);
              }}
            >
              {tr('Erneut versuchen', 'Попробовать снова')}
            </button>
          )}
        </div>
      )}
      {done && <p className="ok-text small">✓ {tr('Wissenscheck gespeichert. Wiederholen ist jederzeit möglich.', 'Проверка знаний сохранена. Можно повторять в любое время.')}</p>}
    </Panel>
  );
}

function Lesson({ lesson }: { lesson: LectureLesson }) {
  const { tr, loc } = useLang();
  const index = LECTURE_LESSONS.indexOf(lesson);
  const next = LECTURE_LESSONS[index + 1];
  const module = MODULE_BY_ID[lesson.module];
  const withAtlas = hasClinicalAtlas(lesson.id);

  return (
    <div style={{ ['--accent' as string]: module.accent }}>
      <header className="module-header">
        <span className="module-icon big" aria-hidden="true">
          {module.icon}
        </span>
        <div>
          <p className="eyebrow">
            {tr('Mission', 'Миссия')} {missionNumber(index)} / {LECTURE_LESSONS.length} · {tr('Folien', 'Слайды')} {pageRange(lesson.pages)}
          </p>
          <h1>{loc(lesson.title)}</h1>
          <p className="lead">{loc(lesson.text)}</p>
        </div>
      </header>

      {lesson.formula && (
        <figure className="formula">
          <TeX tex={lesson.formula} block />
        </figure>
      )}

      <div className="sim-grid">
        {withAtlas && <ClinicalAtlas key={lesson.id} id={lesson.id} />}
        <Panel title={tr('Dein Experiment', 'Твой эксперимент')} className={withAtlas ? '' : 'span-3'}>
          <p>{loc(lesson.experiment)}</p>
          <Link className="btn primary" to={lectureExperimentPath(lesson)}>
            🔬 {loc(SIMULATOR_BY_ID[lesson.simulator].title)} →
          </Link>
          <p className="small muted">
            {tr('Kehre danach zu dieser Mission zurück. Dein Wissenscheck bleibt als Abschluss gespeichert.', 'Затем вернись к миссии. Успешная проверка знаний сохранится как завершение.')}
          </p>
        </Panel>
        <LessonCheck lesson={lesson} />
      </div>

      <div className="row gap end">
        <Link className="btn" to={`/modul/${lesson.module}/theorie`}>
          📖 {loc(module.title)} · {tr('Vertiefung', 'Подробнее')}
        </Link>
        {next && (
          <Link className="btn primary" to={`/vorlesung/${next.id}`}>
            {tr('Nächste Mission', 'Следующая миссия')} →
          </Link>
        )}
      </div>
    </div>
  );
}

function LectureOverview({ notFound }: { notFound: boolean }) {
  const { tr, loc } = useLang();
  const { state } = useGame();
  const isDone = (l: LectureLesson) => !!state.flags[`lecture-${l.id}`];
  const completed = LECTURE_LESSONS.filter(isDone).length;
  const next = LECTURE_LESSONS.find((l) => !isDone(l));

  return (
    <>
      <h1>📚 {tr('MBR-Vorlesung', 'Лекция MBR')}</h1>
      <p className="lead">
        {tr(
          'Vom einzelnen Spin bis zur Traktografie: Alle fachlichen Themen deiner 72-seitigen Vorlage sind als Lernmissionen mit Quellenbezug, Experiment und Wissenscheck aufbereitet.',
          'От отдельного спина до трактографии: все учебные темы 72-страничной лекции представлены миссиями с источниками, экспериментом и проверкой знаний.',
        )}
      </p>
      {notFound && (
        <p className="bad-text" role="status">
          {tr('Diese Mission wurde nicht gefunden. Wähle eine Mission aus der Liste.', 'Миссия не найдена. Выбери миссию из списка.')}
        </p>
      )}

      <section className="kpi-row">
        <div className="kpi">
          <span className="kpi-value">{LECTURE_LESSONS.length}</span>
          <span className="kpi-label">{tr('Lernmissionen', 'Учебных миссий')}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">{LECTURE_SOURCE.pages}</span>
          <span className="kpi-label">{tr('Folien in der Vorlage', 'Слайдов в лекции')}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">{ALL_SIMULATORS.length}</span>
          <span className="kpi-label">{tr('Simulatoren', 'Симуляторов')}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">
            {completed}/{LECTURE_LESSONS.length}
          </span>
          <span className="kpi-label">{tr('Wissenschecks geschafft', 'Проверок пройдено')}</span>
        </div>
      </section>

      <div className="lecture-progress">
        <ProgressBar value={completed / LECTURE_LESSONS.length} label={tr('Vorlesungsfortschritt', 'Прогресс лекции')} />
        {next && (
          <Link className="btn primary" to={`/vorlesung/${next.id}`}>
            ▶ {tr('Weiter mit', 'Продолжить')}: {loc(next.title)}
          </Link>
        )}
      </div>

      <h2 className="section-title">{tr('Lernmissionen', 'Учебные миссии')}</h2>
      <div className="module-grid">
        {LECTURE_LESSONS.map((l, i) => {
          const module = MODULE_BY_ID[l.module];
          return (
            <Link key={l.id} to={`/vorlesung/${l.id}`} className={`module-card${isDone(l) ? ' done' : ''}`} style={{ ['--accent' as string]: module.accent }}>
              <span className="module-index">
                {tr('Mission', 'Миссия')} {missionNumber(i)} · {tr('Folien', 'Слайды')} {pageRange(l.pages)}
              </span>
              <span className="module-icon" aria-hidden="true">
                {module.icon}
              </span>
              <strong>{loc(l.title)}</strong>
              <span className="module-sub">{loc(l.experiment)}</span>
              <span className="module-meta">
                🔬 {loc(SIMULATOR_BY_ID[l.simulator].title)} · {isDone(l) ? `✓ ${tr('geschafft', 'пройдено')}` : `${LESSON_XP} XP`}
              </span>
            </Link>
          );
        })}
      </div>

      <h2 className="section-title">{tr('Quelle', 'Источник')}</h2>
      <Panel title={tr('Quelle und vollständiger Seitenabgleich', 'Источник и полный указатель страниц')}>
        <p>
          <strong>{LECTURE_SOURCE.filename}</strong> · {LECTURE_SOURCE.title}
          <br />
          {LECTURE_SOURCE.author}
        </p>
        <p>
          {tr(
            `Die PDF-Seiten ${LECTURE_CONTEXT_PAGES.join(', ')} enthalten Titel, Kontakt, Inhaltsübersicht, Lernziele, Literatur und eine Fragen-Trennseite. Alle anderen Seiten sind oben mindestens einer fachlichen Mission zugeordnet. Wiederholte Folien werden zusammengeführt.`,
            `Страницы PDF ${LECTURE_CONTEXT_PAGES.join(', ')} содержат титул, контакты, содержание, цели, литературу и разделитель вопросов. Все остальные страницы связаны с одной или несколькими миссиями выше. Повторяющиеся слайды объединены.`,
          )}
        </p>
        <p>
          {tr(
            'Die Lehrtexte, Diagramme und Simulationen sind neu aufbereitet. Originale Patientendarstellungen und Abbildungen Dritter werden nicht als Diagnosebilder nachgebaut. Die Fallkarten erklären die Fragestellungen der Folien.',
            'Тексты, диаграммы и симуляции подготовлены заново. Исходные изображения пациентов и сторонние иллюстрации не воспроизводятся как диагностические снимки. Карточки объясняют задачи со слайдов.',
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
        <Callout
          variant="info"
          title={tr('Bewusst präzisiert', 'Уточнения')}
          text={tr(
            'Frequenz f und Kreisfrequenz ω werden getrennt. Im 2D-Exponent steht kₓx+kᵧy. Linienbreite bezieht sich auf das absorptive Spektrum und normalerweise T₂*. Fourier-Normierungen werden konsistent verwendet. Einzelne klinische Beispiele begründen keine allgemeinen Diagnosen oder Dosisempfehlungen.',
            'Частота f и угловая частота ω разделены. В 2D-показателе стоит kₓx+kᵧy. Ширина относится к спектру поглощения и обычно T₂*. Нормировки Фурье согласованы. Отдельные клинические примеры не задают общие диагнозы и рекомендации доз.',
          )}
        />
      </Panel>
    </>
  );
}

export function LecturePage({ lessonId }: { lessonId?: string }) {
  const { tr } = useLang();
  const lesson = LECTURE_LESSONS.find((l) => l.id === lessonId);
  return (
    <div className="page">
      {lessonId && (
        <Link to="/vorlesung" className="back-link">
          ← {tr('Alle Lernmissionen', 'Все учебные миссии')}
        </Link>
      )}
      {lesson ? <Lesson key={lesson.id} lesson={lesson} /> : <LectureOverview notFound={!!lessonId} />}
    </div>
  );
}
