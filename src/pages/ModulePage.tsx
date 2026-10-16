import { useMemo, useState } from 'react';
import { ChallengeRunner } from '../components/ChallengeRunner';
import { RichText, TeX } from '../components/RichText';
import { Link, navigate } from '../components/router';
import { Callout } from '../components/ui';
import { MODULES, MODULE_BY_ID, type ModuleId } from '../content/modules';
import { CHALLENGE_LENGTH, drawChallenge } from '../content/questions';
import { seededRandom } from '../physics/phantom';
import { THEORY, type TheoryBlock } from '../content/theory';
import { useGame } from '../game/GameContext';
import { THEORY_XP } from '../game/reducer';
import { SimulatorHost, SIMULATOR_BY_ID } from '../simulators/registry';

type Tab = 'theorie' | 'simulator' | 'challenge';

function Block({ block }: { block: TheoryBlock }) {
  switch (block.type) {
    case 'p':
      return (
        <p>
          <RichText text={block.text} />
        </p>
      );
    case 'formula':
      return (
        <figure className="formula">
          <TeX tex={block.tex} block />
          {block.caption && <figcaption>{block.caption}</figcaption>}
        </figure>
      );
    case 'list': {
      const items = block.items.map((it, i) => (
        <li key={i}>
          <RichText text={it} />
        </li>
      ));
      return block.ordered ? <ol>{items}</ol> : <ul>{items}</ul>;
    }
    case 'callout':
      return <Callout variant={block.variant} title={block.title} text={block.text} />;
    case 'table':
      return (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, i) => (
                <tr key={i}>
                  {r.map((c, j) => (
                    <td key={j}>
                      <RichText text={c} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

function TheoryView({ moduleId }: { moduleId: ModuleId }) {
  const { state, dispatch } = useGame();
  const sections = THEORY[moduleId];
  const read = state.modules[moduleId]?.theoryRead;
  return (
    <article className="theory">
      <nav className="toc" aria-label="Inhaltsverzeichnis">
        <strong>Inhalt</strong>
        <ol>
          {sections.map((s, i) => (
            <li key={s.title}>
              <a href={`#sec-${moduleId}-${i}`} onClick={(e) => { e.preventDefault(); document.getElementById(`sec-${moduleId}-${i}`)?.scrollIntoView({ behavior: 'smooth' }); }}>
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="theory-body">
        {sections.map((s, i) => (
          <section key={s.title} id={`sec-${moduleId}-${i}`}>
            <h2>
              <span className="sec-num">{i + 1}</span> {s.title}
            </h2>
            {s.blocks.map((b, j) => (
              <Block key={j} block={b} />
            ))}
          </section>
        ))}
        <div className="theory-done">
          {read ? (
            <p className="ok-text">✔ Kapitel abgeschlossen.</p>
          ) : (
            <button className="btn primary" type="button" onClick={() => dispatch({ type: 'READ_THEORY', moduleId })}>
              Kapitel als gelesen markieren (+{THEORY_XP} XP)
            </button>
          )}
          <Link to={`/modul/${moduleId}/simulator`} className="btn">
            Weiter zum Simulator →
          </Link>
        </div>
      </div>
    </article>
  );
}

function ChallengeView({ moduleId }: { moduleId: ModuleId }) {
  const { state } = useGame();
  const [round, setRound] = useState(0);
  const [started, setStarted] = useState(false);
  const progress = state.modules[moduleId];
  const replay = (progress?.bestScore ?? 0) >= 0.8;
  const questions = useMemo(() => drawChallenge(moduleId, seededRandom((Date.now() + round * 7919) & 0xffffffff)), [moduleId, round]);

  if (!started) {
    return (
      <div className="challenge-intro">
        <h2>🏁 Modul-Challenge</h2>
        <p>
          {CHALLENGE_LENGTH} Aufgaben aus Verständnisfragen und Rechen-Puzzles mit zufällig generierten Werten. Jede Runde ist anders.
        </p>
        <ul>
          <li>XP pro richtiger Antwort: ◆ 10 · ◆◆ 15 · ◆◆◆ 25</li>
          <li>Serie ab 3 richtigen: ×1,2 XP · ab 6: ×1,5 XP</li>
          <li>Hinweise halbieren die XP der Frage</li>
          <li>Abschlussbonus: 60 % → +10 · 80 % → +25 · 100 % → +40 XP</li>
          <li>Ab 80 % gilt das Modul als gemeistert (Abzeichen!) – danach Wiederholungsmodus mit halben XP.</li>
        </ul>
        {progress && progress.attempts > 0 && (
          <p className="muted">
            Bisher: {progress.attempts} Versuch(e), Bestwert {Math.round(progress.bestScore * 100)} %
          </p>
        )}
        <button className="btn primary big" type="button" onClick={() => setStarted(true)}>
          Challenge starten
        </button>
      </div>
    );
  }

  return (
    <ChallengeRunner
      key={round}
      questions={questions}
      kind={{ type: 'module', moduleId }}
      replay={replay}
      onRestart={() => setRound((r) => r + 1)}
      onExit={() => {
        setStarted(false);
        setRound((r) => r + 1);
      }}
    />
  );
}

export function ModulePage({ moduleId, tab }: { moduleId: string; tab?: string }) {
  const meta = MODULE_BY_ID[moduleId as ModuleId];
  if (!meta) {
    return (
      <div className="page">
        <h1>Modul nicht gefunden</h1>
        <Link to="/">Zur Übersicht</Link>
      </div>
    );
  }
  const active: Tab = tab === 'simulator' || tab === 'challenge' ? tab : 'theorie';
  const idx = MODULES.findIndex((m) => m.id === meta.id);
  const next = MODULES[idx + 1];
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'theorie', label: '📖 Theorie' },
    { id: 'simulator', label: `🔬 ${SIMULATOR_BY_ID[meta.simulator].title}` },
    { id: 'challenge', label: '🏁 Challenge' },
  ];

  return (
    <div className="page" style={{ ['--accent' as string]: meta.accent }}>
      <header className="module-header">
        <span className="module-icon big" aria-hidden="true">
          {meta.icon}
        </span>
        <div>
          <p className="eyebrow">Modul {meta.index}</p>
          <h1>{meta.title}</h1>
          <p className="lead">{meta.subtitle}</p>
        </div>
      </header>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={active === t.id} className={active === t.id ? 'active' : ''} onClick={() => navigate(`/modul/${meta.id}/${t.id}`)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-body">
        {active === 'theorie' && <TheoryView moduleId={meta.id} />}
        {active === 'simulator' && (
          <>
            <p className="muted">{SIMULATOR_BY_ID[meta.simulator].description}</p>
            <SimulatorHost id={meta.simulator} />
            <div className="row gap end">
              <Link to={`/modul/${meta.id}/challenge`} className="btn primary">
                Zur Challenge →
              </Link>
            </div>
          </>
        )}
        {active === 'challenge' && <ChallengeView key={meta.id} moduleId={meta.id} />}
      </div>
      {next && (
        <p className="next-module">
          Nächstes Modul: <Link to={`/modul/${next.id}`}>{next.icon} {next.title}</Link>
        </p>
      )}
    </div>
  );
}
