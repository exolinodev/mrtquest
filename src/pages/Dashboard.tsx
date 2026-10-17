import { useState } from 'react';
import { Link } from '../components/router';
import { ProgressBar, Stars } from '../components/ui';
import { LECTURE_LESSONS } from '../content/lecture';
import { ALL_SIMULATORS, MODULES, MODULE_BY_ID } from '../content/modules';
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
  const lectureDone = LECTURE_LESSONS.filter((l) => state.flags[`lecture-${l.id}`]).length;
  const [name, setName] = useState(state.playerName);
  const mastered = MODULES.filter((m) => (state.modules[m.id]?.bestScore ?? 0) >= 0.8).length;
  const nextModule = MODULES.find((m) => (state.modules[m.id]?.bestScore ?? 0) < 0.8);
  const recentBadges = Object.entries(state.badges)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => BADGE_BY_ID[id])
    .filter(Boolean);
  const accuracy = state.stats.answered > 0 ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0;
  const examUnlocked = MODULES.every((m) => (state.modules[m.id]?.attempts ?? 0) > 0);
  const questionCount = totalQuestionCount();

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">{tr('MRT-Physik & Gerätetechnik · Hochschulniveau', 'Физика МРТ и оборудование · университетский уровень')}</p>
          <h1>
            {state.playerName
              ? tr(`Willkommen zurück, ${state.playerName}!`, `С возвращением, ${state.playerName}!`)
              : tr('Willkommen bei MRT-Quest', 'Добро пожаловать в MRT-Quest')}
          </h1>
          <p className="lead">
            {tr(
              `Vom Kernspin bis zum klinischen Protokoll: Erarbeite die Physik der Magnetresonanztomographie mit ${MODULES.length} Modulen, ${ALL_SIMULATORS.length} interaktiven Simulatoren, ${questionCount} Aufgabentypen (viele davon mit zufällig generierten Werten) und ${SCENARIOS.length} klinischen Trade-off-Fällen.`,
              `От ядерного спина до клинического протокола: освой физику магнитно-резонансной томографии с помощью ${MODULES.length} модулей, ${ALL_SIMULATORS.length} интерактивных симуляторов, ${questionCount} типов заданий (многие со случайно сгенерированными значениями) и ${SCENARIOS.length} клинических случаев с компромиссами.`,
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
            {mastered}/{MODULES.length}
          </span>
          <span className="kpi-label">{tr('Module gemeistert', 'Модулей освоено')}</span>
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

      <h2 className="section-title">{tr('Lernpfad', 'Учебный путь')}</h2>
      <div className="module-grid">
        <Link to="/vorlesung" className="module-card lecture" style={{ ['--accent' as string]: '#a78bfa' }}>
          <span className="module-index">{tr('Vorlesung', 'Лекция')} · MBR · ZHAW</span>
          <span className="module-icon" aria-hidden="true">
            📚
          </span>
          <strong>{tr('Deine Vorlesung als Lernspiel', 'Твоя лекция в игровой форме')}</strong>
          <span className="module-sub">
            {tr('72 Seiten: Lernmissionen, Bloch- und Fourier-Labor, DTI, Fluss und klinische Anwendungen.', '72 страницы: миссии, лаборатории Блоха и Фурье, DTI, поток и клиническое применение.')}
          </span>
          <ProgressBar value={lectureDone / LECTURE_LESSONS.length} label={tr('Vorlesungsfortschritt', 'Прогресс лекции')} color="#a78bfa" />
          <span className="module-meta">
            {lectureDone}/{LECTURE_LESSONS.length} {tr('Missionen', 'миссий')}
          </span>
        </Link>
        {MODULES.map((m) => {
          const prog = state.modules[m.id];
          const best = prog?.bestScore ?? 0;
          const rec = m.recommendedAfter ? MODULE_BY_ID[m.recommendedAfter] : null;
          const recDone = !rec || (state.modules[rec.id]?.bestScore ?? 0) >= 0.6;
          return (
            <Link key={m.id} to={`/modul/${m.id}`} className="module-card" style={{ ['--accent' as string]: m.accent }}>
              <span className="module-index">
                {tr('Modul', 'Модуль')} {m.index}
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
        })}
        <Link to="/klinik" className="module-card clinic" style={{ ['--accent' as string]: '#f97316' }}>
          <span className="module-index">{tr('Praxis', 'Практика')}</span>
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
        <Link to="/pruefung" className={`module-card exam${examUnlocked ? '' : ' locked'}`} style={{ ['--accent' as string]: '#eab308' }}>
          <span className="module-index">{tr('Finale', 'Финал')}</span>
          <span className="module-icon" aria-hidden="true">
            🎓
          </span>
          <strong>{tr('Abschlussprüfung', 'Итоговый экзамен')}</strong>
          <span className="module-sub">
            {examUnlocked
              ? state.examBest > 0
                ? tr(`Bestwert ${Math.round(state.examBest * 100)} %`, `Лучший результат ${Math.round(state.examBest * 100)} %`)
                : tr('Bereit, wenn du es bist.', 'Всё готово – начинай, когда захочешь.')
              : tr('Freischaltung: alle sieben Modul-Challenges abschließen', 'Открытие: заверши задания всех семи модулей')}
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
