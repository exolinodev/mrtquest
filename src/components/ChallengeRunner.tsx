import { useMemo, useState, type FormEvent } from 'react';
import { isNumericCorrect, parseNumber, type Question } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import { answerXp } from '../game/levels';
import { RichText } from './RichText';
import { ProgressBar } from './ui';

export type ChallengeKind = { type: 'module'; moduleId: string } | { type: 'exam' };

interface Props {
  questions: Question[];
  kind: ChallengeKind;
  /** Wiederholungsmodus (bereits gemeistert): halbierte XP */
  replay: boolean;
  onRestart: () => void;
  onExit: () => void;
}

interface AnswerRecord {
  correct: boolean;
  xp: number;
}

export function completionBonus(score: number, kind: ChallengeKind, replay: boolean): number {
  const factor = replay ? 0.5 : 1;
  if (kind.type === 'exam') return Math.round((score >= 0.8 ? 150 : score >= 0.6 ? 60 : 0) * factor);
  return Math.round((score >= 1 ? 40 : score >= 0.8 ? 25 : score >= 0.6 ? 10 : 0) * factor);
}

export function ChallengeRunner({ questions, kind, replay, onRestart, onExit }: Props) {
  const { state, dispatch } = useGame();
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [numeric, setNumeric] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const [submitted, setSubmitted] = useState<AnswerRecord | null>(null);
  const [finished, setFinished] = useState<{ score: number; bonus: number } | null>(null);

  const q = questions[index];
  const correctCount = records.filter((r) => r.correct).length;
  const earned = records.reduce((s, r) => s + r.xp, 0);

  const correctText = useMemo(() => {
    if (!q) return '';
    if (q.kind === 'numeric') return `${q.answer.toLocaleString('de-DE', { maximumFractionDigits: 3 })} ${q.unit}`;
    if (q.kind === 'mc') return q.options[q.answer];
    return q.answers.map((a) => q.options[a]).join(' · ');
  }, [q]);

  if (finished) {
    const pct = Math.round(finished.score * 100);
    return (
      <div className="challenge-summary">
        <div className="summary-score" data-tone={pct >= 80 ? 'good' : pct >= 60 ? 'warn' : 'bad'}>
          <span className="summary-pct">{pct} %</span>
          <span>
            {correctCount} von {questions.length} richtig
          </span>
        </div>
        <p className="summary-text">
          {pct === 100
            ? 'Perfekt! Kohärenter geht es nicht.'
            : pct >= 80
              ? 'Stark – dieses Thema sitzt.'
              : pct >= 60
                ? 'Solide Basis. Schau dir die Erklärungen noch einmal an und versuche es erneut.'
                : 'Hier lohnt sich ein zweiter Blick in Theorie und Simulator.'}
        </p>
        <ul className="summary-xp">
          <li>
            Antworten: <strong>+{earned} XP</strong>
          </li>
          <li>
            Abschlussbonus: <strong>+{finished.bonus} XP</strong>
          </li>
          {replay && <li className="muted">Wiederholungsmodus: XP halbiert, da bereits gemeistert.</li>}
        </ul>
        <div className="row gap">
          <button className="btn primary" type="button" onClick={onRestart}>
            Neue Runde
          </button>
          <button className="btn" type="button" onClick={onExit}>
            Zurück
          </button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  const evaluate = (): boolean | null => {
    if (q.kind === 'numeric') {
      const v = parseNumber(numeric);
      if (v === null) {
        setInputError('Bitte eine Zahl eingeben (z. B. 63,87).');
        return null;
      }
      return isNumericCorrect(q, v);
    }
    if (selected.length === 0) {
      setInputError('Bitte eine Antwort auswählen.');
      return null;
    }
    if (q.kind === 'mc') return selected[0] === q.answer;
    const want = [...q.answers].sort().join(',');
    return [...selected].sort().join(',') === want;
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (submitted) return;
    const correct = evaluate();
    if (correct === null) return;
    setInputError(null);
    const xp = correct ? answerXp(q.difficulty, state.stats.streak + 1, hintShown, replay) : 0;
    dispatch({ type: 'ANSWER', correct, xp, hintUsed: hintShown });
    const rec = { correct, xp };
    setSubmitted(rec);
    setRecords((r) => [...r, rec]);
  };

  const next = () => {
    if (index + 1 >= questions.length) {
      const score = records.filter((r) => r.correct).length / questions.length;
      const bonus = completionBonus(score, kind, replay);
      if (kind.type === 'module') dispatch({ type: 'COMPLETE_CHALLENGE', moduleId: kind.moduleId, score, bonusXp: bonus });
      else dispatch({ type: 'EXAM_RESULT', score, xp: bonus });
      setFinished({ score, bonus });
      return;
    }
    setIndex((i) => i + 1);
    setSelected([]);
    setNumeric('');
    setHintShown(false);
    setSubmitted(null);
    setInputError(null);
  };

  const toggle = (i: number) => {
    if (submitted) return;
    setInputError(null);
    if (q.kind === 'mc') setSelected([i]);
    else setSelected((s) => (s.includes(i) ? s.filter((x) => x !== i) : [...s, i]));
  };

  const optionState = (i: number): string => {
    if (!submitted || q.kind === 'numeric') return selected.includes(i) ? 'selected' : '';
    const isCorrect = q.kind === 'mc' ? q.answer === i : q.answers.includes(i);
    if (isCorrect) return 'correct';
    if (selected.includes(i)) return 'wrong';
    return 'dim';
  };

  return (
    <div className="challenge">
      <div className="challenge-head">
        <span>
          Frage {index + 1} / {questions.length}
        </span>
        <span className="difficulty" title="Schwierigkeit">
          {'◆'.repeat(q.difficulty)}
          {'◇'.repeat(3 - q.difficulty)}
        </span>
        <span className="combo" data-active={state.stats.streak >= 3}>
          🔥 Serie {state.stats.streak}
          {state.stats.streak >= 6 ? ' · ×1,5 XP' : state.stats.streak >= 3 ? ' · ×1,2 XP' : ''}
        </span>
      </div>
      <ProgressBar value={index / questions.length} label="Fortschritt der Challenge" />

      <form className="question" onSubmit={submit}>
        <p className="question-kind">
          {q.kind === 'numeric' ? '🧮 Rechen-Puzzle' : q.kind === 'multi' ? '☑️ Mehrfachauswahl' : '🔘 Einfachauswahl'}
        </p>
        <h3 className="question-prompt">
          <RichText text={q.prompt} />
        </h3>

        {q.kind === 'numeric' ? (
          <div className="numeric-input">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-label="Antwort"
              placeholder="Ergebnis"
              value={numeric}
              disabled={!!submitted}
              onChange={(e) => {
                setNumeric(e.target.value);
                setInputError(null);
              }}
              autoFocus
            />
            <span className="unit-label">{q.unit}</span>
            <span className="muted small">Toleranz ±{(q.tolerance * 100).toLocaleString('de-DE')} %</span>
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
                onClick={() => toggle(i)}
                disabled={!!submitted && optionState(i) === 'dim'}
              >
                <span className="option-marker" aria-hidden="true">
                  {q.kind === 'mc' ? String.fromCharCode(65 + i) : selected.includes(i) ? '☑' : '☐'}
                </span>
                <span>
                  <RichText text={opt} />
                </span>
              </button>
            ))}
          </div>
        )}

        {inputError && <p className="input-error">{inputError}</p>}

        {hintShown && q.hint && !submitted && (
          <p className="hint">
            💡 <RichText text={q.hint} />
          </p>
        )}

        {!submitted ? (
          <div className="row gap">
            <button className="btn primary" type="submit">
              Antwort prüfen
            </button>
            {q.hint && !hintShown && (
              <button className="btn ghost" type="button" onClick={() => setHintShown(true)}>
                Hinweis (halbe XP)
              </button>
            )}
          </div>
        ) : (
          <div className={`feedback ${submitted.correct ? 'is-correct' : 'is-wrong'}`}>
            <strong>{submitted.correct ? `✔ Richtig! +${submitted.xp} XP` : '✘ Leider falsch.'}</strong>
            {!submitted.correct && (
              <p>
                Richtige Antwort: <RichText text={correctText} />
              </p>
            )}
            <p>
              <RichText text={q.explanation} />
            </p>
            <button className="btn primary" type="button" onClick={next} autoFocus>
              {index + 1 >= questions.length ? 'Auswertung' : 'Weiter →'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
