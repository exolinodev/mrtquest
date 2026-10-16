import { useMemo, useState } from 'react';
import { ChallengeRunner } from '../components/ChallengeRunner';
import { Link } from '../components/router';
import { ProgressBar, Stars } from '../components/ui';
import { MODULES } from '../content/modules';
import { drawExam, EXAM_LENGTH } from '../content/questions';
import { SCENARIO_BY_ID, SCENARIOS } from '../content/scenarios';
import { BADGES } from '../game/badges';
import { useGame } from '../game/GameContext';
import { levelProgress, xpForLevel } from '../game/levels';
import { seededRandom } from '../physics/phantom';
import { ProtocolConsole } from '../simulators/ProtocolConsole';
import { SimulatorHost, SIMULATOR_BY_ID, SIMULATORS } from '../simulators/registry';
import type { SimulatorId } from '../content/modules';

const DIFF_LABEL = ['', 'Einstieg', 'Fortgeschritten', 'Expert:in'];

export function ClinicPage({ scenarioId }: { scenarioId?: string }) {
  const { state } = useGame();
  const scenario = scenarioId ? SCENARIO_BY_ID[scenarioId] : undefined;

  if (scenarioId && scenario) {
    return (
      <div className="page">
        <Link to="/klinik" className="back-link">
          ← Alle Fälle
        </Link>
        <header className="scenario-header">
          <span className="module-icon big" aria-hidden="true">
            {scenario.icon}
          </span>
          <div>
            <p className="eyebrow">
              Klinischer Fall · {DIFF_LABEL[scenario.difficulty]} · bis {scenario.xp} XP
            </p>
            <h1>{scenario.title}</h1>
            <p className="lead">{scenario.story}</p>
            <p className="task">
              <strong>Auftrag:</strong> {scenario.task}
            </p>
          </div>
          <Stars count={state.scenarios[scenario.id]?.stars ?? 0} />
        </header>
        <ProtocolConsole key={scenario.id} scenario={scenario} />
      </div>
    );
  }

  return (
    <div className="page">
      <h1>🩺 Klinische Fälle</h1>
      <p className="lead">
        In der Praxis gibt es selten das eine „richtige“ Protokoll. Jeder Fall bringt Randbedingungen mit – Atemanhalt, SAR-Grenzen von Implantaten, Zeitdruck oder
        Klaustrophobie. Optimiere Kontrast, SNR, Auflösung, Messzeit und Sicherheit gleichzeitig. Pflichtkriterien entscheiden über das Bestehen, Bonuskriterien über die Sterne.
      </p>
      <div className="scenario-grid">
        {SCENARIOS.map((sc) => (
          <Link key={sc.id} to={`/klinik/${sc.id}`} className="scenario-card">
            <span className="module-icon" aria-hidden="true">
              {sc.icon}
            </span>
            <strong>{sc.title}</strong>
            <span className="muted small">
              {DIFF_LABEL[sc.difficulty]} · bis {sc.xp} XP
            </span>
            <span className="scenario-task">{sc.task}</span>
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
  if (meta) {
    return (
      <div className="page">
        <Link to="/labor" className="back-link">
          ← Simulator-Labor
        </Link>
        <h1>
          {meta.icon} {meta.title}
        </h1>
        <p className="lead">{meta.description}</p>
        <SimulatorHost id={meta.id} />
      </div>
    );
  }
  return (
    <div className="page">
      <h1>🔬 Simulator-Labor</h1>
      <p className="lead">Alle virtuellen Simulatoren auf einen Blick – zum freien Experimentieren. Entdecke alle, um das Abzeichen „Simulator-Entdecker:in“ zu erhalten.</p>
      <div className="scenario-grid">
        {SIMULATORS.map((s) => (
          <Link key={s.id} to={`/labor/${s.id}`} className="scenario-card">
            <span className="module-icon" aria-hidden="true">
              {s.icon}
            </span>
            <strong>{s.title}</strong>
            <span className="scenario-task">{s.description}</span>
            <span className="small muted">{state.simulatorsVisited.includes(s.id) ? '✔ entdeckt' : 'noch nicht geöffnet'}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function ExamPage() {
  const { state } = useGame();
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);
  const unlocked = MODULES.every((m) => (state.modules[m.id]?.attempts ?? 0) > 0);
  const questions = useMemo(() => drawExam(seededRandom((Date.now() + round * 104729) & 0xffffffff)), [round]);

  if (!unlocked) {
    return (
      <div className="page">
        <h1>🎓 Abschlussprüfung</h1>
        <p className="lead">Die Prüfung wird freigeschaltet, sobald du jede Modul-Challenge mindestens einmal gespielt hast.</p>
        <ul className="checklist">
          {MODULES.map((m) => (
            <li key={m.id} className={(state.modules[m.id]?.attempts ?? 0) > 0 ? 'ok' : ''}>
              {(state.modules[m.id]?.attempts ?? 0) > 0 ? '✔' : '○'} <Link to={`/modul/${m.id}/challenge`}>{m.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="page">
        <h1>🎓 Abschlussprüfung</h1>
        <div className="challenge-intro">
          <p>
            {EXAM_LENGTH} gemischte Aufgaben aus allen sieben Modulen. Bestehensgrenze: 80 %. Bestanden gibt es +150 XP und das Gold-Abzeichen „Prüfung bestanden“.
          </p>
          {state.examBest > 0 && <p className="muted">Bisheriger Bestwert: {Math.round(state.examBest * 100)} %</p>}
          <button className="btn primary big" type="button" onClick={() => setStarted(true)}>
            Prüfung beginnen
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>🎓 Abschlussprüfung</h1>
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
  const lp = levelProgress(state.xp);
  const [name, setName] = useState(state.playerName);
  const [confirmReset, setConfirmReset] = useState(false);
  const unlocked = Object.keys(state.badges).length;

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
      <h1>🏅 Profil & Abzeichen</h1>
      <section className="profile-grid">
        <div className="panel">
          <h3>Spieler:in</h3>
          <form
            className="row gap"
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: 'SET_NAME', name: name.trim() });
            }}
          >
            <input className="text-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" aria-label="Name" maxLength={40} />
            <button className="btn" type="submit">
              Speichern
            </button>
          </form>
          <p className="hero-title">
            Level {lp.level} · {lp.title}
          </p>
          <ProgressBar value={lp.ratio} label="Level-Fortschritt" />
          <p className="small muted">
            {state.xp.toLocaleString('de-DE')} XP gesamt · nächstes Level bei {xpForLevel(lp.level + 1).toLocaleString('de-DE')} XP
          </p>
        </div>
        <div className="panel">
          <h3>Statistik</h3>
          <dl className="stats-list">
            <dt>Beantwortete Fragen</dt>
            <dd>{state.stats.answered}</dd>
            <dt>Richtig</dt>
            <dd>
              {state.stats.correct} ({state.stats.answered ? Math.round((state.stats.correct / state.stats.answered) * 100) : 0} %)
            </dd>
            <dt>Beste Serie</dt>
            <dd>{state.stats.bestStreak}</dd>
            <dt>Abgeschlossene Challenges</dt>
            <dd>{state.stats.challengesCompleted}</dd>
            <dt>Gelöste Artefakt-Fälle</dt>
            <dd>{state.stats.artifactsDiagnosed}</dd>
            <dt>Lerntage</dt>
            <dd>{state.activeDays.length}</dd>
            <dt>Prüfung (Bestwert)</dt>
            <dd>{state.examBest ? `${Math.round(state.examBest * 100)} %` : '–'}</dd>
          </dl>
        </div>
        <div className="panel">
          <h3>Modulfortschritt</h3>
          {MODULES.map((m) => (
            <div key={m.id} className="module-progress-row">
              <span>
                {m.icon} {m.title}
              </span>
              <ProgressBar value={state.modules[m.id]?.bestScore ?? 0} color={m.accent} label={m.title} />
            </div>
          ))}
        </div>
      </section>

      <h2 className="section-title">
        Abzeichen ({unlocked}/{BADGES.length})
      </h2>
      <div className="badge-grid">
        {BADGES.map((b) => {
          const at = state.badges[b.id];
          return (
            <div key={b.id} className={`badge-card tier-${b.tier}${at ? ' unlocked' : ' locked'}`}>
              <span className="badge-icon" aria-hidden="true">
                {at ? b.icon : '🔒'}
              </span>
              <strong>{b.title}</strong>
              <span className="small">{b.description}</span>
              <span className="badge-meta">
                {b.tier === 'gold' ? 'Gold' : b.tier === 'silver' ? 'Silber' : 'Bronze'}
                {b.xp ? ` · +${b.xp} XP` : ''}
                {at ? ` · ${new Date(at).toLocaleDateString('de-DE')}` : ''}
              </span>
            </div>
          );
        })}
      </div>

      <h2 className="section-title">Daten</h2>
      <div className="row gap wrap">
        <button className="btn" type="button" onClick={exportProgress}>
          Fortschritt exportieren (JSON)
        </button>
        {!confirmReset ? (
          <button className="btn danger" type="button" onClick={() => setConfirmReset(true)}>
            Fortschritt zurücksetzen
          </button>
        ) : (
          <span className="row gap">
            <span className="bad-text">Wirklich alle XP, Level und Abzeichen löschen?</span>
            <button
              className="btn danger"
              type="button"
              onClick={() => {
                dispatch({ type: 'RESET' });
                setName('');
                setConfirmReset(false);
              }}
            >
              Ja, zurücksetzen
            </button>
            <button className="btn" type="button" onClick={() => setConfirmReset(false)}>
              Abbrechen
            </button>
          </span>
        )}
      </div>
      <p className="small muted">Der Fortschritt wird ausschließlich lokal in diesem Browser gespeichert (localStorage). Es werden keine Daten übertragen.</p>
    </div>
  );
}
