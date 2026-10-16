import { useState } from 'react';
import { Link } from '../components/router';
import { ProgressBar, Stars } from '../components/ui';
import { MODULES, MODULE_BY_ID } from '../content/modules';
import { totalQuestionCount } from '../content/questions';
import { SCENARIOS } from '../content/scenarios';
import { BADGES, BADGE_BY_ID } from '../game/badges';
import { useGame } from '../game/GameContext';
import { levelProgress } from '../game/levels';

export function Dashboard() {
  const { state, dispatch } = useGame();
  const lp = levelProgress(state.xp);
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

  return (
    <div className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">MRT-Physik & Gerätetechnik · Hochschulniveau</p>
          <h1>{state.playerName ? `Willkommen zurück, ${state.playerName}!` : 'Willkommen bei MRT-Quest'}</h1>
          <p className="lead">
            Vom Kernspin bis zum klinischen Protokoll: Erarbeite die Physik der Magnetresonanztomographie mit {MODULES.length} Modulen, 8 interaktiven Simulatoren, {totalQuestionCount()} Aufgabentypen
            (viele davon mit zufällig generierten Werten) und {SCENARIOS.length} klinischen Trade-off-Fällen.
          </p>
          {!state.playerName && (
            <form
              className="row gap name-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) dispatch({ type: 'SET_NAME', name: name.trim() });
              }}
            >
              <input className="text-field" placeholder="Dein Name (optional)" value={name} onChange={(e) => setName(e.target.value)} aria-label="Name" maxLength={40} />
              <button className="btn" type="submit">
                Speichern
              </button>
            </form>
          )}
          {nextModule && (
            <Link to={`/modul/${nextModule.id}`} className="btn primary big">
              {state.stats.answered === 0 ? '▶ Jetzt starten:' : '▶ Weiter mit'} {nextModule.icon} {nextModule.title}
            </Link>
          )}
        </div>
        <div className="hero-card">
          <div className="level-ring" style={{ ['--p' as string]: lp.ratio }}>
            <span>Lv</span>
            <strong>{lp.level}</strong>
          </div>
          <p className="hero-title">{lp.title}</p>
          <ProgressBar value={lp.ratio} label="Level-Fortschritt" />
          <p className="small muted">
            {lp.needed - lp.current} XP bis Level {lp.level + 1}
          </p>
        </div>
      </section>

      <section className="kpi-row">
        <div className="kpi">
          <span className="kpi-value">{state.xp.toLocaleString('de-DE')}</span>
          <span className="kpi-label">Erfahrungspunkte</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">
            {mastered}/{MODULES.length}
          </span>
          <span className="kpi-label">Module gemeistert</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">{accuracy} %</span>
          <span className="kpi-label">Trefferquote ({state.stats.answered} Antworten)</span>
        </div>
        <div className="kpi">
          <span className="kpi-value">
            {Object.keys(state.badges).length}/{BADGES.length}
          </span>
          <span className="kpi-label">Abzeichen</span>
        </div>
      </section>

      <h2 className="section-title">Lernpfad</h2>
      <div className="module-grid">
        {MODULES.map((m) => {
          const prog = state.modules[m.id];
          const best = prog?.bestScore ?? 0;
          const rec = m.recommendedAfter ? MODULE_BY_ID[m.recommendedAfter] : null;
          const recDone = !rec || (state.modules[rec.id]?.bestScore ?? 0) >= 0.6;
          return (
            <Link key={m.id} to={`/modul/${m.id}`} className="module-card" style={{ ['--accent' as string]: m.accent }}>
              <span className="module-index">Modul {m.index}</span>
              <span className="module-icon" aria-hidden="true">
                {m.icon}
              </span>
              <strong>{m.title}</strong>
              <span className="module-sub">{m.subtitle}</span>
              <ProgressBar value={best} label={`Bestwert ${m.title}`} color={m.accent} />
              <span className="module-meta">
                {prog?.theoryRead ? '📖 ✓' : '📖'} · {state.simulatorsVisited.includes(m.simulator) ? '🔬 ✓' : '🔬'} · {best > 0 ? `🏁 ${Math.round(best * 100)} %` : '🏁 –'}
              </span>
              {!recDone && rec && <span className="module-rec">Empfohlen nach „{rec.title}“</span>}
            </Link>
          );
        })}
        <Link to="/klinik" className="module-card clinic" style={{ ['--accent' as string]: '#f97316' }}>
          <span className="module-index">Praxis</span>
          <span className="module-icon" aria-hidden="true">
            🩺
          </span>
          <strong>Klinische Fälle</strong>
          <span className="module-sub">Protokolle unter realen Randbedingungen optimieren</span>
          <span className="module-meta">
            {SCENARIOS.map((s) => (
              <Stars key={s.id} count={state.scenarios[s.id]?.stars ?? 0} max={3} />
            ))}
          </span>
        </Link>
        <Link to="/pruefung" className={`module-card exam${examUnlocked ? '' : ' locked'}`} style={{ ['--accent' as string]: '#eab308' }}>
          <span className="module-index">Finale</span>
          <span className="module-icon" aria-hidden="true">
            🎓
          </span>
          <strong>Abschlussprüfung</strong>
          <span className="module-sub">{examUnlocked ? `${state.examBest > 0 ? `Bestwert ${Math.round(state.examBest * 100)} %` : 'Bereit, wenn du es bist.'}` : 'Freischaltung: jede Modul-Challenge einmal spielen'}</span>
        </Link>
      </div>

      {recentBadges.length > 0 && (
        <>
          <h2 className="section-title">Zuletzt freigeschaltet</h2>
          <div className="badge-row">
            {recentBadges.map((b) => (
              <div key={b.id} className={`badge-mini tier-${b.tier}`}>
                <span aria-hidden="true">{b.icon}</span>
                <span>{b.title}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
