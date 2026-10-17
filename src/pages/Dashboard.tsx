import { useState } from 'react';
import { Link } from '../components/router';
import { ProgressBar, Stars } from '../components/ui';
import { EXAM_QUESTIONS, RECAP_QUESTIONS } from '../content/examPrep';
import { ALL_SIMULATORS, BONUS_MODULES, EXAM_MODULES, MODULE_BY_ID, type ModuleMeta } from '../content/modules';
import { totalQuestionCount } from '../content/questions';
import { SCENARIOS } from '../content/scenarios';
import { BADGES, BADGE_BY_ID } from '../game/badges';
import { useGame } from '../game/GameContext';
import { levelProgress } from '../game/levels';
import { numberLocale } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';

export function Dashboard() {
  const { state, dispatch } = useGame();
  const { lang, tr, loc } = useLang();
  const lp = levelProgress(state.xp, lang);
  const prepTotal = RECAP_QUESTIONS.length + EXAM_QUESTIONS.length;
  const prepDone = [...RECAP_QUESTIONS.map((q) => `recap-${q.id}`), ...EXAM_QUESTIONS.map((q) => `exq-${q.id}`)].filter((f) => state.flags[f]).length;
  const [name, setName] = useState(state.playerName);
  const mastered = EXAM_MODULES.filter((m) => (state.modules[m.id]?.bestScore ?? 0) >= 0.8).length;
  const nextModule = EXAM_MODULES.find((m) => (state.modules[m.id]?.bestScore ?? 0) < 0.8);
  const recentBadges = Object.entries(state.badges)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => BADGE_BY_ID[id])
    .filter(Boolean);
  const accuracy = state.stats.answered > 0 ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0;
  const examUnlocked = EXAM_MODULES.every((m) => (state.modules[m.id]?.attempts ?? 0) > 0);
  const questionCount = totalQuestionCount();

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">{tr('Dein Prüfungstrainer für die MRT', 'Твой тренажёр к экзамену по МРТ')}</p>
          <h1>
            {state.playerName
              ? tr(`Willkommen zurück, ${state.playerName}!`, `С возвращением, ${state.playerName}!`)
              : tr('Willkommen bei MRT-Quest', 'Добро пожаловать в MRT-Quest')}
          </h1>
          <p className="lead">
            {tr(
              `MRT klingt nach Raketenwissenschaft. Hier wird sie Schritt für Schritt verständlich: in einfacher Sprache, mit Bildern aus dem Alltag, ${ALL_SIMULATORS.length} Simulatoren zum Ausprobieren und ${questionCount} Aufgabentypen. Alles folgt dem Vorlesungsskript, damit du genau das lernst, was in der Prüfung drankommt.`,
              `МРТ звучит как ракетостроение. Здесь она становится понятной шаг за шагом: простым языком, с образами из жизни, ${ALL_SIMULATORS.length} симуляторами и ${questionCount} типами заданий. Всё следует лекционному конспекту, чтобы ты учил(а) именно то, что будет на экзамене.`,
            )}
          </p>
          {!state.playerName && (
            <form
              className="row gap name-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) dispatch({ type: 'SET_NAME', name: name.trim() });
              }}
            >
              <input
                className="text-field"
                placeholder={tr('Dein Name (optional)', 'Твоё имя (необязательно)')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label={tr('Name', 'Имя')}
                maxLength={40}
              />
              <button className="btn" type="submit">
                {tr('Speichern', 'Сохранить')}
              </button>
            </form>
          )}
          {nextModule && (
            <Link to={`/modul/${nextModule.id}`} className="btn primary big">
              {state.stats.answered === 0 ? tr('▶ Jetzt starten:', '▶ Начать:') : tr('▶ Weiter mit', '▶ Продолжить:')} {nextModule.icon} {loc(nextModule.title)}
            </Link>
          )}
        </div>
        <div className="hero-card">
          <div className="level-ring" style={{ ['--p' as string]: lp.ratio }}>
            <span>{tr('Lv', 'Ур.')}</span>
            <strong>{lp.level}</strong>
          </div>
          <p className="hero-title">{lp.title}</p>
          <ProgressBar value={lp.ratio} label={tr('Level-Fortschritt', 'Прогресс уровня')} />
          <p className="small muted">{tr(`${lp.needed - lp.current} XP bis Level ${lp.level + 1}`, `${lp.needed - lp.current} XP до уровня ${lp.level + 1}`)}</p>
        </div>
      </section>

      <section className="kpi-row">
        <div className="kpi">
          <span className="kpi-value">{state.xp.toLocaleString(numberLocale(lang))}</span>
          <span className="kpi-label">{tr('Erfahrungspunkte', 'Очки опыта')}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">
            {mastered}/{EXAM_MODULES.length}
          </span>
          <span className="kpi-label">{tr('Prüfungsmodule gemeistert', 'Экзаменационных модулей освоено')}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">{accuracy} %</span>
          <span className="kpi-label">{tr(`Trefferquote (${state.stats.answered} Antworten)`, `Точность (${state.stats.answered} ответов)`)}</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">
            {Object.keys(state.badges).length}/{BADGES.length}
          </span>
          <span className="kpi-label">{tr('Abzeichen', 'Награды')}</span>
        </div>
      </section>

      <h2 className="section-title">{tr('Dein Lernpfad entlang des Skripts', 'Твой путь по конспекту')}</h2>
      <p className="muted">
        {tr(
          'Die fünf Module folgen genau der Gliederung deines Vorlesungsskripts: Einführung, physikalisches Prinzip, vom Signal zum Bild, klinische Anwendungen und der Fourier-Anhang. Arbeite sie der Reihe nach durch: lesen, ausprobieren, Challenge spielen.',
          'Пять модулей точно следуют структуре твоего лекционного конспекта: введение, физический принцип, от сигнала к изображению, клиническое применение и приложение о Фурье. Проходи их по порядку: читай, пробуй, проходи задание.',
        )}
      </p>
      <div className="module-grid">
        {EXAM_MODULES.map((m) => (
          <ModuleCard key={m.id} m={m} />
        ))}
        <Link to="/vorlesung" className="module-card lecture" style={{ ['--accent' as string]: '#34d399' }}>
          <span className="module-index">{tr('Prüfung', 'Экзамен')}</span>
          <span className="module-icon" aria-hidden="true">
            🎯
          </span>
          <strong>{tr('Prüfungsvorbereitung', 'Подготовка к экзамену')}</strong>
          <span className="module-sub">
            {tr('Die 5 Kontrollfragen des Profs, wahrscheinliche Prüfungsfragen, Spickzettel und Lab 3.', '5 контрольных вопросов профессора, вероятные экзаменационные вопросы, шпаргалка и лабораторная 3.')}
          </span>
          <ProgressBar value={prepTotal ? prepDone / prepTotal : 0} label={tr('Prüfungsfragen geübt', 'Экзаменационные вопросы')} color="#34d399" />
          <span className="module-meta">
            {prepDone}/{prepTotal} {tr('Fragen sitzen', 'вопросов усвоено')}
          </span>
        </Link>
        <Link to="/pruefung" className={`module-card exam${examUnlocked ? '' : ' locked'}`} style={{ ['--accent' as string]: '#eab308' }}>
          <span className="module-index">{tr('Finale', 'Финал')}</span>
          <span className="module-icon" aria-hidden="true">
            🎓
          </span>
          <strong>{tr('Probeprüfung', 'Пробный экзамен')}</strong>
          <span className="module-sub">
            {examUnlocked
              ? state.examBest > 0
                ? tr(`Bestwert ${Math.round(state.examBest * 100)} %`, `Лучший результат ${Math.round(state.examBest * 100)} %`)
                : tr('Bereit, wenn du es bist.', 'Всё готово – начинай, когда захочешь.')
              : tr(`Freischaltung: alle ${EXAM_MODULES.length} Prüfungsmodule einmal spielen`, `Открытие: пройди все ${EXAM_MODULES.length} экзаменационных модулей`)}
          </span>
        </Link>
      </div>

      <h2 className="section-title">{tr('Bonus: Praxiswissen', 'Бонус: практические знания')}</h2>
      <p className="muted">
        {tr(
          'Nicht prüfungsrelevant, aber spannend: Wie die Grundlagen im klinischen Alltag weitergehen. Ideal, wenn du tiefer verstehen willst.',
          'Не входит в экзамен, но интересно: как основы применяются в клинической практике. Для тех, кто хочет понять глубже.',
        )}
      </p>
      <div className="module-grid">
        {BONUS_MODULES.map((m) => (
          <ModuleCard key={m.id} m={m} />
        ))}
        <Link to="/klinik" className="module-card clinic" style={{ ['--accent' as string]: '#f97316' }}>
          <span className="module-index">{tr('Bonus · Praxis', 'Бонус · практика')}</span>
          <span className="module-icon" aria-hidden="true">
            🩺
          </span>
          <strong>{tr('Klinische Fälle', 'Клинические случаи')}</strong>
          <span className="module-sub">{tr('Protokolle unter realen Randbedingungen optimieren', 'Оптимизация протоколов в реальных условиях')}</span>
          <span className="module-meta">
            {SCENARIOS.map((s) => (
              <Stars key={s.id} count={state.scenarios[s.id]?.stars ?? 0} max={3} />
            ))}
          </span>
        </Link>
      </div>

      {recentBadges.length > 0 && (
        <>
          <h2 className="section-title">{tr('Zuletzt freigeschaltet', 'Недавно получено')}</h2>
          <div className="badge-row">
            {recentBadges.map((b) => (
              <div key={b.id} className={`badge-mini tier-${b.tier}`}>
                <span aria-hidden="true">{b.icon}</span>
                <span>{loc(b.title)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ModuleCard({ m }: { m: ModuleMeta }) {
  const { state } = useGame();
  const { tr, loc } = useLang();
  const prog = state.modules[m.id];
  const best = prog?.bestScore ?? 0;
  const rec = m.recommendedAfter ? MODULE_BY_ID[m.recommendedAfter] : null;
  const recDone = !rec || (state.modules[rec.id]?.bestScore ?? 0) >= 0.6;
  return (
    <Link to={`/modul/${m.id}`} className="module-card" style={{ ['--accent' as string]: m.accent }}>
      <span className="module-index">
        {tr('Modul', 'Модуль')} {m.index}
        {m.track === 'bonus' && ` · ${tr('Bonus', 'Бонус')}`}
      </span>
      <span className="module-icon" aria-hidden="true">
        {m.icon}
      </span>
      <strong>{loc(m.title)}</strong>
      <span className="module-sub">{loc(m.subtitle)}</span>
      <ProgressBar value={best} label={`${tr('Bestwert', 'Лучший результат')} ${loc(m.title)}`} color={m.accent} />
      <span className="module-meta">
        {prog?.theoryRead ? '📖 ✓' : '📖'} · {state.simulatorsVisited.includes(m.simulator) ? '🔬 ✓' : '🔬'} · {best > 0 ? `🏁 ${Math.round(best * 100)} %` : '🏁 –'}
      </span>
      {!recDone && rec && <span className="module-rec">{tr(`Empfohlen nach „${rec.title.de}“`, `Рекомендуется после «${rec.title.ru}»`)}</span>}
    </Link>
  );
}
