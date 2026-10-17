import { useMemo, useState } from 'react';
import { ChallengeRunner } from '../components/ChallengeRunner';
import { ChallengeIntro } from '../components/ChallengeIntro';
import { RichText } from '../components/RichText';
import { Link } from '../components/router';
import { ProgressBar, Stars } from '../components/ui';
import { EXAM_MODULES, MODULES } from '../content/modules';
import { drawExam, EXAM_LENGTH } from '../content/questions';
import { SCENARIO_BY_ID, SCENARIOS } from '../content/scenarios';
import { BADGES } from '../game/badges';
import { useGame } from '../game/GameContext';
import { levelProgress, xpForLevel } from '../game/levels';
import { numberLocale, type Loc } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';
import { seededRandom } from '../physics/phantom';
import { ProtocolConsole } from '../simulators/ProtocolConsole';
import { SimulatorHost, SIMULATOR_BY_ID, SIMULATORS } from '../simulators/registry';
import type { SimulatorId } from '../content/modules';

const DIFF_LABEL: Loc[] = [
  { de: '', ru: '' },
  { de: 'Einstieg', ru: 'Начальный' },
  { de: 'Fortgeschritten', ru: 'Продвинутый' },
  { de: 'Expert:in', ru: 'Экспертный' },
];

export function ClinicPage({ scenarioId }: { scenarioId?: string }) {
  const { state } = useGame();
  const { tr, loc } = useLang();
  const scenario = scenarioId ? SCENARIO_BY_ID[scenarioId] : undefined;

  if (scenarioId && scenario) {
    return (
      <div className="page">
        <Link to="/klinik" className="back-link">
          {tr('← Alle Fälle', '← Все случаи')}
        </Link>
        <header className="scenario-header">
          <span className="module-icon big" aria-hidden="true">
            {scenario.icon}
          </span>
          <div>
            <p className="eyebrow">
              {tr('Klinischer Fall', 'Клинический случай')} · {loc(DIFF_LABEL[scenario.difficulty])} · {tr('bis', 'до')} {scenario.xp} XP
            </p>
            <h1>{loc(scenario.title)}</h1>
            <p className="lead">{loc(scenario.story)}</p>
            <p className="task">
              <strong>{tr('Auftrag', 'Задание')}:</strong> {loc(scenario.task)}
            </p>
          </div>
          <Stars count={state.scenarios[scenario.id]?.stars ?? 0} />
        </header>
        {scenario.physicsStory && (
          <aside className="analogy">
            <p className="analogy-label">🧠 {tr('Die Physik dahinter', 'Физика за этим случаем')}</p>
            <p>
              <RichText text={loc(scenario.physicsStory)} />
            </p>
          </aside>
        )}
        <ProtocolConsole key={scenario.id} scenario={scenario} />
      </div>
    );
  }

  return (
    <div className="page">
      <h1>🩺 {tr('Klinische Fälle', 'Клинические случаи')}</h1>
      <p className="lead">
        {tr(
          'Bonus für alle, die wissen wollen, wie es in der Klinik weitergeht. In der Praxis gibt es selten das eine „richtige“ Protokoll. Jeder Fall bringt Randbedingungen mit: Atemanhalt, SAR-Grenzen von Implantaten, Zeitdruck oder Klaustrophobie. Du stellst Kontrast, Bildrauschen, Auflösung, Messzeit und Sicherheit gleichzeitig ein. Pflichtkriterien entscheiden über das Bestehen, Bonuskriterien über die Sterne. Jeder Fall erklärt dir vorher, welche Physik aus den Prüfungsmodulen dahintersteckt.',
          'Бонус для тех, кто хочет узнать, что происходит дальше в клинике. На практике редко бывает один «правильный» протокол. У каждого случая свои ограничения: задержка дыхания, пределы SAR для имплантов, нехватка времени или клаустрофобия. Ты одновременно настраиваешь контраст, шум, разрешение, время сканирования и безопасность. Обязательные критерии определяют, выполнено ли задание, бонусные дают звёзды. Каждый случай сначала объясняет, какая физика из экзаменационных модулей за ним стоит.',
        )}
      </p>
      <div className="scenario-grid">
        {SCENARIOS.map((sc) => (
          <Link key={sc.id} to={`/klinik/${sc.id}`} className="scenario-card">
            <span className="module-icon" aria-hidden="true">
              {sc.icon}
            </span>
            <strong>{loc(sc.title)}</strong>
            <span className="muted small">
              {loc(DIFF_LABEL[sc.difficulty])} · {tr('bis', 'до')} {sc.xp} XP
            </span>
            <span className="scenario-task">{loc(sc.task)}</span>
            <Stars count={state.scenarios[sc.id]?.stars ?? 0} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function LabPage({ simulatorId }: { simulatorId?: string }) {
  const meta = simulatorId ? SIMULATOR_BY_ID[simulatorId as SimulatorId] : undefined;
  const { state } = useGame();
  const { tr, loc } = useLang();
  if (meta) {
    return (
      <div className="page">
        <Link to="/labor" className="back-link">
          {tr('← Simulator-Labor', '← Лаборатория симуляторов')}
        </Link>
        <h1>
          {meta.icon} {loc(meta.title)}
        </h1>
        <p className="lead">{loc(meta.description)}</p>
        <SimulatorHost id={meta.id} />
      </div>
    );
  }
  return (
    <div className="page">
      <h1>🔬 {tr('Simulator-Labor', 'Лаборатория симуляторов')}</h1>
      <p className="lead">
        {tr(
          'Alle virtuellen Simulatoren auf einen Blick – zum freien Experimentieren. Entdecke alle, um das Abzeichen „Simulator-Entdecker:in“ zu erhalten.',
          'Все виртуальные симуляторы в одном месте – для свободных экспериментов. Открой все, чтобы получить награду «Исследователь симуляторов».',
        )}
      </p>
      <div className="scenario-grid">
        {SIMULATORS.map((s) => (
          <Link key={s.id} to={`/labor/${s.id}`} className="scenario-card">
            <span className="module-icon" aria-hidden="true">
              {s.icon}
            </span>
            <strong>{loc(s.title)}</strong>
            <span className="scenario-task">{loc(s.description)}</span>
            <span className="small muted">{state.simulatorsVisited.includes(s.id) ? tr('✔ entdeckt', '✔ открыт') : tr('noch nicht geöffnet', 'ещё не открыт')}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ExamPage() {
  const { state } = useGame();
  const { tr, loc } = useLang();
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);
  const unlocked = EXAM_MODULES.every((m) => (state.modules[m.id]?.attempts ?? 0) > 0);
  const questions = useMemo(() => drawExam(seededRandom((Date.now() + round * 104729) & 0xffffffff)), [round]);
  const title = `🎓 ${tr('Probeprüfung', 'Пробный экзамен')}`;

  if (!unlocked) {
    return (
      <div className="page">
        <h1>{title}</h1>
        <p className="lead">
          {tr(
            'Die Probeprüfung wird freigeschaltet, sobald du jede Challenge der sechs Prüfungsmodule mindestens einmal gespielt hast. Die Bonus-Module zählen nicht dazu.',
            'Пробный экзамен откроется, когда ты хотя бы раз пройдёшь задание каждого из шести экзаменационных модулей. Бонусные модули не учитываются.',
          )}
        </p>
        <ul className="checklist">
          {EXAM_MODULES.map((m) => (
            <li key={m.id} className={(state.modules[m.id]?.attempts ?? 0) > 0 ? 'ok' : ''}>
              {(state.modules[m.id]?.attempts ?? 0) > 0 ? '✔' : '○'} <Link to={`/modul/${m.id}/challenge`}>{loc(m.title)}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="page">
        <h1>{title}</h1>
        <ChallengeIntro count={EXAM_LENGTH} kind={{ type: 'exam' }} replay={state.examBest >= 0.8}
          bestScore={state.examBest} onStart={() => setStarted(true)} />
      </div>
    );
  }

  return (
    <div className="page">
      <h1>{title}</h1>
      <ChallengeRunner
        key={round}
        questions={questions}
        kind={{ type: 'exam' }}
        replay={state.examBest >= 0.8}
        onRestart={() => setRound((r) => r + 1)}
        onExit={() => {
          setStarted(false);
          setRound((r) => r + 1);
        }}
      />
    </div>
  );
}

export function ProfilePage() {
  const { state, dispatch } = useGame();
  const { lang, tr, loc } = useLang();
  const lp = levelProgress(state.xp, lang);
  const [name, setName] = useState(state.playerName);
  const [confirmReset, setConfirmReset] = useState(false);
  const unlocked = Object.keys(state.badges).length;
  const nf = (v: number) => v.toLocaleString(numberLocale(lang));
  const tierLabel = (tier: string) => (tier === 'gold' ? tr('Gold', 'Золото') : tier === 'silver' ? tr('Silber', 'Серебро') : tr('Bronze', 'Бронза'));

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mrt-quest-fortschritt.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="page">
      <h1>🏅 {tr('Profil & Abzeichen', 'Профиль и награды')}</h1>
      <section className="profile-grid">
        <div className="panel">
          <h3>{tr('Spieler:in', 'Игрок')}</h3>
          <form
            className="row gap"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: 'SET_NAME', name: name.trim() });
            }}
          >
            <input className="text-field" value={name} onChange={(e) => setName(e.target.value)} placeholder={tr('Name', 'Имя')} aria-label={tr('Name', 'Имя')} maxLength={40} />
            <button className="btn" type="submit">
              {tr('Speichern', 'Сохранить')}
            </button>
          </form>
          <p className="hero-title">
            {tr('Level', 'Уровень')} {lp.level} · {lp.title}
          </p>
          <ProgressBar value={lp.ratio} label={tr('Level-Fortschritt', 'Прогресс уровня')} />
          <p className="small muted">
            {tr(
              `${nf(state.xp)} XP gesamt · nächstes Level bei ${nf(xpForLevel(lp.level + 1))} XP`,
              `${nf(state.xp)} XP всего · следующий уровень при ${nf(xpForLevel(lp.level + 1))} XP`,
            )}
          </p>
        </div>
        <div className="panel">
          <h3>{tr('Statistik', 'Статистика')}</h3>
          <dl className="stats-list">
            <dt>{tr('Beantwortete Fragen', 'Отвеченные вопросы')}</dt>
            <dd>{state.stats.answered}</dd>
            <dt>{tr('Richtig', 'Правильно')}</dt>
            <dd>
              {state.stats.correct} ({state.stats.answered ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0} %)
            </dd>
            <dt>{tr('Beste Serie', 'Лучшая серия')}</dt>
            <dd>{state.stats.bestStreak}</dd>
            <dt>{tr('Abgeschlossene Challenges', 'Завершённые задания')}</dt>
            <dd>{state.stats.challengesCompleted}</dd>
            <dt>{tr('Gelöste Artefakt-Fälle', 'Решённые случаи артефактов')}</dt>
            <dd>{state.stats.artifactsDiagnosed}</dd>
            <dt>{tr('Lerntage', 'Дни обучения')}</dt>
            <dd>{state.activeDays.length}</dd>
            <dt>{tr('Prüfung (Bestwert)', 'Экзамен (лучший)')}</dt>
            <dd>{state.examBest ? `${Math.round(state.examBest * 100)} %` : '–'}</dd>
          </dl>
        </div>
        <div className="panel">
          <h3>{tr('Modulfortschritt', 'Прогресс модулей')}</h3>
          {MODULES.map((m) => (
            <div key={m.id} className="module-progress-row">
              <span>
                {m.icon} {loc(m.title)}
              </span>
              <ProgressBar value={state.modules[m.id]?.bestScore ?? 0} color={m.accent} label={loc(m.title)} />
            </div>
          ))}
        </div>
      </section>

      <h2 className="section-title">
        {tr('Abzeichen', 'Награды')} ({unlocked}/{BADGES.length})
      </h2>
      <div className="badge-grid">
        {BADGES.map((b) => {
          const at = state.badges[b.id];
          return (
            <div key={b.id} className={`badge-card tier-${b.tier}${at ? ' unlocked' : ' locked'}`}>
              <span className="badge-icon" aria-hidden="true">
                {at ? b.icon : '🔒'}
              </span>
              <strong>{loc(b.title)}</strong>
              <span className="small">{loc(b.description)}</span>
              <span className="badge-meta">
                {tierLabel(b.tier)}
                {b.xp ? ` · +${b.xp} XP` : ''}
                {at ? ` · ${new Date(at).toLocaleDateString(numberLocale(lang))}` : ''}
              </span>
            </div>
          );
        })}
      </div>

      <h2 className="section-title">{tr('Daten', 'Данные')}</h2>
      <div className="row gap wrap">
        <button className="btn" type="button" onClick={exportProgress}>
          {tr('Fortschritt exportieren (JSON)', 'Экспортировать прогресс (JSON)')}
        </button>
        {!confirmReset ? (
          <button className="btn danger" type="button" onClick={() => setConfirmReset(true)}>
            {tr('Fortschritt zurücksetzen', 'Сбросить прогресс')}
          </button>
        ) : (
          <span className="row gap">
            <span className="bad-text">{tr('Wirklich alle XP, Level und Abzeichen löschen?', 'Действительно удалить все XP, уровни и награды?')}</span>
            <button
              className="btn danger"
              type="button"
              onClick={() => {
                dispatch({ type: 'RESET' });
                setName('');
                setConfirmReset(false);
              }}
            >
              {tr('Ja, zurücksetzen', 'Да, сбросить')}
            </button>
            <button className="btn" type="button" onClick={() => setConfirmReset(false)}>
              {tr('Abbrechen', 'Отмена')}
            </button>
          </span>
        )}
      </div>
      <p className="small muted">
        {tr(
          'Der Fortschritt wird ausschließlich lokal in diesem Browser gespeichert (localStorage). Es werden keine Daten übertragen.',
          'Прогресс сохраняется только локально в этом браузере (localStorage). Никакие данные не передаются.',
        )}
      </p>
    </div>
  );
}
