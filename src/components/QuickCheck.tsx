import { useMemo, useState, type FormEvent } from 'react';
import { ALL_QUESTIONS } from '../content/questions';
import { isNumericCorrect, materialize, parseNumber, type QuestionRef } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import { CONCEPT_BY_ID } from '../game/learning/concepts';
import { drawAdaptive, randomSeed, toRef } from '../game/learning/select';
import { useLang } from '../i18n/LanguageContext';
import { seededRandom } from '../physics/phantom';
import { RichText } from './RichText';
import { Link } from './router';

const CHECK_XP = 5;

/**
 * Kurz-Check am Ende eines Theorieabschnitts: eine Frage zum Konzept des Abschnitts,
 * bevorzugt fällig, schwach oder neu. Optional und eingeklappt; das Ergebnis fließt ins Lerngedächtnis.
 */
export function QuickCheck({ conceptId }: { conceptId: string }) {
  const { tr, lang } = useLang();
  const { state, dispatch } = useGame();
  const [ref, setRef] = useState<QuestionRef | null>(null);
  const [selected, setSelected] = useState<number[]>([]);
  const [numeric, setNumeric] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const concept = CONCEPT_BY_ID[conceptId];
  const pool = useMemo(() => ALL_QUESTIONS.filter((q) => concept?.items.includes(q.id)), [concept]);
  const q = useMemo(() => (ref ? materialize(ref, lang) : null), [ref, lang]);
  if (!concept || !pool.length) return null;

  const open = () => {
    const rng = seededRandom(randomSeed());
    const [pick] = drawAdaptive(pool, rng, { learning: state.learning, now: Date.now(), count: 1, concepts: [conceptId] });
    if (!pick) return;
    setRef(toRef(pick, rng));
    setSelected([]);
    setNumeric('');
    setResult(null);
  };

  if (!ref || !q) {
    return (
      <button type="button" className="quick-check-open" onClick={open}>
        🧠 {tr('Kurz-Check: Sitzt das?', 'Мини-проверка: усвоено?')} <span className="small muted">{tr('1 Frage · +5 XP', '1 вопрос · +5 XP')}</span>
      </button>
    );
  }

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (result !== null) return;
    let correct: boolean;
    if (q.kind === 'numeric') {
      const v = parseNumber(numeric);
      if (v === null) return;
      correct = isNumericCorrect(q, v);
    } else if (q.kind === 'mc') {
      if (!selected.length) return;
      correct = selected[0] === q.answer;
    } else {
      if (!selected.length) return;
      correct = [...selected].sort().join(',') === [...q.answers].sort().join(',');
    }
    dispatch({ type: 'ANSWER', correct, xp: correct ? CHECK_XP : 0, hintUsed: false, questionId: ref.source.id });
    setResult(correct);
  };

  const optionState = (i: number) => {
    if (result === null || q.kind === 'numeric') return selected.includes(i) ? 'selected' : '';
    const right = q.kind === 'mc' ? q.answer === i : q.answers.includes(i);
    if (right) return 'correct';
    return selected.includes(i) ? 'wrong' : 'dim';
  };

  return (
    <form className="quick-check" onSubmit={submit}>
      <p className="exam-block-label">🧠 {tr('Kurz-Check', 'Мини-проверка')}</p>
      <p className="question-prompt">
        <RichText text={q.prompt} />
      </p>
      {q.kind === 'numeric' ? (
        <div className="numeric-input">
          <input
            type="text"
            inputMode="decimal"
            autoComplete="off"
            aria-label={tr(`Ergebnis in ${q.unit}`, `Результат в ${q.unit}`)}
            value={numeric}
            disabled={result !== null}
            onChange={(e) => setNumeric(e.target.value)}
          />
          <span className="unit-label">{q.unit}</span>
        </div>
      ) : (
        <div className="options" role={q.kind === 'mc' ? 'radiogroup' : 'group'}>
          {q.options.map((opt, i) => (
            <button
              key={i}
              type="button"
              role={q.kind === 'mc' ? 'radio' : 'checkbox'}
              aria-checked={selected.includes(i)}
              className={`option ${optionState(i)}`}
              disabled={result !== null}
              onClick={() => setSelected((s) => (q.kind === 'mc' ? [i] : s.includes(i) ? s.filter((x) => x !== i) : [...s, i]))}
            >
              <span className="option-marker" aria-hidden="true">
                {q.kind === 'mc' ? String.fromCharCode(65 + i) : selected.includes(i) ? '☑' : '☐'}
              </span>
              <span className="option-content">
                <RichText text={opt} />
              </span>
            </button>
          ))}
        </div>
      )}
      {result === null ? (
        <button className="btn primary" type="submit">
          {tr('Prüfen', 'Проверить')}
        </button>
      ) : (
        <div className={`feedback ${result ? 'is-correct' : 'is-wrong'}`}>
          <strong>{result ? `✔ ${tr('Sitzt!', 'Усвоено!')} +${CHECK_XP} XP` : tr('Noch nicht. Die App merkt sich das und fragt es bald wieder.', 'Пока нет. Приложение запомнит это и скоро спросит снова.')}</strong>
          {!result && q.kind === 'numeric' && (
            <p>
              {tr('Richtig wäre', 'Верно')}: <strong>{q.answer.toLocaleString(lang === 'ru' ? 'ru-RU' : 'de-DE', { maximumSignificantDigits: 4 })}</strong> {q.unit}
            </p>
          )}
          <p>
            <RichText text={q.explanation} />
          </p>
          <div className="row gap wrap">
            <button type="button" className="btn" onClick={open}>
              ↻ {tr('Noch eine Frage', 'Ещё вопрос')}
            </button>
            <Link className="btn ghost" to={`/ueben/${conceptId}`}>
              🎯 {tr('Thema gezielt üben', 'Целевая практика по теме')}
            </Link>
          </div>
        </div>
      )}
    </form>
  );
}
