import { useMemo, useState } from 'react';
import { ChallengeRunner } from '../components/ChallengeRunner';
import { ChallengeIntro } from '../components/ChallengeIntro';
import { Figure } from '../components/figures';
import { RichText, TeX } from '../components/RichText';
import { Link, navigate } from '../components/router';
import { Callout } from '../components/ui';
import { MODULES, MODULE_BY_ID, type ModuleId } from '../content/modules';
import { CHALLENGE_LENGTH, drawChallenge } from '../content/questions';
import { seededRandom } from '../physics/phantom';
import { THEORY, type TheoryBlock } from '../content/theory';
import { useGame } from '../game/GameContext';
import { THEORY_XP } from '../game/reducer';
import { useLang } from '../i18n/LanguageContext';
import { SimulatorHost, SIMULATOR_BY_ID } from '../simulators/registry';

type Tab = 'theorie' | 'simulator' | 'challenge';

function ExamBlock({ block }: { block: Extract<TheoryBlock, { type: 'exam' }> }) {
  const { tr, loc } = useLang();
  const simId = block.sim?.split('/')[0] as keyof typeof SIMULATOR_BY_ID | undefined;
  return (
    <aside className="exam-block">
      <p className="exam-block-label">🎓 {tr('So fragt der Prof', 'Так спросит профессор')}</p>
      <p className="exam-block-question">
        <RichText text={block.question} />
      </p>
      <details>
        <summary>{tr('Musterantwort zeigen', 'Показать образец ответа')}</summary>
        <p>
          <RichText text={block.answer} />
        </p>
        {block.full && (
          <p className="exam-block-full">
            <strong>{tr('Für volle Punkte: ', 'Для полного балла: ')}</strong>
            <RichText text={block.full} />
          </p>
        )}
        {simId && SIMULATOR_BY_ID[simId] && (
          <Link to={`/labor/${block.sim}`} className="btn">
            {SIMULATOR_BY_ID[simId].icon} {tr('Selbst ausprobieren', 'Попробовать самому')}: {loc(SIMULATOR_BY_ID[simId].title)} →
          </Link>
        )}
      </details>
    </aside>
  );
}

function Block({ block }: { block: TheoryBlock }) {
  const { tr } = useLang();
  switch (block.type) {
    case 'hook':
      return (
        <p className="theory-hook">
          <RichText text={block.text} />
        </p>
      );
    case 'analogy':
      return (
        <aside className="analogy">
          <p className="analogy-label">🖼️ {tr('Stell dir vor', 'Представь себе')}</p>
          <p className="analogy-title">{block.title}</p>
          <p>
            <RichText text={block.text} />
          </p>
        </aside>
      );
    case 'mnemonic':
      return (
        <aside className="mnemonic">
          <span aria-hidden="true">💡</span>
          <p>
            <strong>{tr('Merksatz: ', 'Запомни: ')}</strong>
            <RichText text={block.text} />
          </p>
        </aside>
      );
    case 'exam':
      return <ExamBlock block={block} />;
    case 'figure':
      return <Figure id={block.id} caption={block.caption} />;
    case 'pitfall':
      return (
        <aside className="pitfall">
          <p className="pitfall-label">⚠️ {tr('Typische Denkfehler', 'Типичные ошибки')}</p>
          <ul>
            {block.items.map((it, i) => (
              <li key={i}>
                <RichText text={it} />
              </li>
            ))}
          </ul>
        </aside>
      );
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
          {block.caption && (
            <figcaption>
              <RichText text={block.caption} />
            </figcaption>
          )}
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
  const { lang, tr } = useLang();
  const sections = THEORY[lang][moduleId];
  const read = state.modules[moduleId]?.theoryRead;
  return (
    <article className="theory">
      <nav className="toc" aria-label={tr('Inhaltsverzeichnis', 'Содержание')}>
        <strong>{tr('Inhalt', 'Содержание')}</strong>
        <ol>
          {sections.map((s, i) => (
            <li key={i}>
              <a
                href={`#sec-${moduleId}-${i}`}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(`sec-${moduleId}-${i}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="theory-body">
        {MODULE_BY_ID[moduleId].track === 'bonus' && (
          <Callout
            variant="info"
            title={tr('Bonus: Praxiswissen', 'Бонус: практические знания')}
            text={tr(
              'Dieses Modul geht über das Vorlesungsskript hinaus. Es zeigt, wie die Grundlagen im klinischen Alltag weitergehen. Für die Prüfung ist es nicht nötig, aber es hilft beim Verstehen.',
              'Этот модуль выходит за рамки лекционного конспекта. Он показывает, как основы применяются в клинике. Для экзамена он не обязателен, но помогает понять материал.',
            )}
          />
        )}
        {sections.map((s, i) => (
          <section key={i} id={`sec-${moduleId}-${i}`}>
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
            <p className="ok-text">{tr('✔ Kapitel abgeschlossen.', '✔ Глава завершена.')}</p>
          ) : (
            <button className="btn primary" type="button" onClick={() => dispatch({ type: 'READ_THEORY', moduleId })}>
              {tr('Kapitel als gelesen markieren', 'Отметить главу как прочитанную')} (+{THEORY_XP} XP)
            </button>
          )}
          <Link to={`/modul/${moduleId}/simulator`} className="btn">
            {tr('Weiter zum Simulator →', 'К симулятору →')}
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
      <ChallengeIntro count={CHALLENGE_LENGTH} kind={{ type: 'module', moduleId }} replay={replay}
        attempts={progress?.attempts} bestScore={progress?.bestScore} onStart={() => setStarted(true)} />
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

export function ModulePage({ moduleId, tab, lab }: { moduleId: string; tab?: string; lab?: string }) {
  const { tr, loc } = useLang();
  const meta = MODULE_BY_ID[moduleId as ModuleId];
  if (!meta) {
    return (
      <div className="page">
        <h1>{tr('Modul nicht gefunden', 'Модуль не найден')}</h1>
        <Link to="/">{tr('Zur Übersicht', 'К обзору')}</Link>
      </div>
    );
  }
  const active: Tab = tab === 'simulator' || tab === 'challenge' ? tab : 'theorie';
  const idx = MODULES.findIndex((m) => m.id === meta.id);
  const next = MODULES[idx + 1];
  const tabs: Array<{ id: Tab; label: string }> = [
    { id: 'theorie', label: tr('📖 Theorie', '📖 Теория') },
    { id: 'simulator', label: meta.labs?.length ? tr(`🔬 Labore (${meta.labs.length + 1})`, `🔬 Лаборатории (${meta.labs.length + 1})`) : `🔬 ${loc(SIMULATOR_BY_ID[meta.simulator].title)}` },
    { id: 'challenge', label: tr('🏁 Challenge', '🏁 Задание') },
  ];

  return (
    <div className="page" style={{ ['--accent' as string]: meta.accent }}>
      <header className="module-header">
        <span className="module-icon big" aria-hidden="true">
          {meta.icon}
        </span>
        <div>
          <p className="eyebrow">
            {tr('Modul', 'Модуль')} {meta.index}
            {meta.track === 'bonus' ? tr(' · Bonus', ' · Бонус') : tr(' · Prüfungsstoff', ' · Экзаменационный материал')}
          </p>
          <h1>{loc(meta.title)}</h1>
          <p className="lead">{loc(meta.subtitle)}</p>
        </div>
      </header>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button key={t.id} role="tab" type="button" aria-selected={active === t.id} aria-label={t.label} className={active === t.id ? 'active' : ''} onClick={() => navigate(`/modul/${meta.id}/${t.id}`)}>
            <span className={t.id === 'simulator' ? 'tab-label-full' : undefined}>{t.label}</span>
            {t.id === 'simulator' && <span className="tab-label-short" aria-hidden="true">{tr('🔬 Simulator', '🔬 Симулятор')}</span>}
          </button>
        ))}
      </div>
      <div className="tab-body">
        {active === 'theorie' && <TheoryView moduleId={meta.id} />}
        {active === 'simulator' && (
          <>
            <LabSwitcher meta={meta} lab={lab} />
            <div className="row gap end">
              <Link to={`/modul/${meta.id}/challenge`} className="btn primary">
                {tr('Zur Challenge →', 'К заданию →')}
              </Link>
            </div>
          </>
        )}
        {active === 'challenge' && <ChallengeView key={meta.id} moduleId={meta.id} />}
      </div>
      {next && (
        <p className="next-module">
          {tr('Nächstes Modul', 'Следующий модуль')}:{' '}
          <Link to={`/modul/${next.id}`}>
            {next.icon} {loc(next.title)}
          </Link>
        </p>
      )}
    </div>
  );
}

/** Simulator-Tab: das Hauptlabor des Kapitels plus weitere passende Labore zur Auswahl. */
function LabSwitcher({ meta, lab }: { meta: (typeof MODULES)[number]; lab?: string }) {
  const { loc } = useLang();
  const options = [meta.simulator, ...(meta.labs ?? [])];
  const active = options.find((id) => id === lab) ?? meta.simulator;
  return (
    <>
      {options.length > 1 && (
        <div className="lab-switcher" role="tablist">
          {options.map((id) => (
            <button key={id} type="button" role="tab" aria-selected={id === active} className={`chip${id === active ? ' on' : ''}`} onClick={() => navigate(`/modul/${meta.id}/simulator/${id}`)}>
              {SIMULATOR_BY_ID[id].icon} {loc(SIMULATOR_BY_ID[id].title)}
            </button>
          ))}
        </div>
      )}
      <SimulatorHost key={active} id={active} preset={active === meta.simulator ? meta.simulatorPreset : undefined} />
    </>
  );
}
