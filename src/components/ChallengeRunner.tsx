import { useMemo, useState, type FormEvent } from 'react';
import { isNumericCorrect, materialize, parseNumber, type QuestionRef } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import { answerXp } from '../game/levels';
import { numberLocale } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';
import { RichText } from './RichText';
import { ProgressBar } from './ui';

export type ChallengeKind = { type: 'module'; moduleId: string } | { type: 'exam' };

interface Props {
  /** sprachunabhängige Fragen; materialisiert in der aktiven Sprache */
  questions: QuestionRef[];
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
  const { lang, tr } = useLang();
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [numeric, setNumeric] = useState('');
  const [inputError, setInputError] = useState<string | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const [submitted, setSubmitted] = useState<AnswerRecord | null>(null);
  const [finished, setFinished] = useState<{ score: number; bonus: number } | null>(null);

  // Bei Sprachwechsel neu materialisiert: gleiche Seeds ⇒ gleiche Werte und Optionsreihenfolge
  const q = useMemo(() => (questions[index] ? materialize(questions[index], lang) : undefined), [questions, index, lang]);
  const correctCount = records.filter((r) => r.correct).length;
  const earned = records.reduce((s, r) => s + r.xp, 0);

  const correctText = useMemo(() => {
    if (!q) return '';
    if (q.kind === 'numeric') return `${q.answer.toLocaleString(numberLocale(lang), { maximumFractionDigits: 3 })} ${q.unit}`;
    if (q.kind === 'mc') return q.options[q.answer];
    return q.answers.map((a) => q.options[a]).join(' · ');
  }, [q, lang]);

  if (finished) {
    const pct = Math.round(finished.score * 100);
    return (
      <div className="challenge-summary">
        <div className="summary-score" data-tone={pct >= 80 ? 'good' : pct >= 60 ? 'warn' : 'bad'}>
          <span className="summary-pct">{pct} %</span>
          <span>{tr(`${correctCount} von ${questions.length} richtig`, `${correctCount} з ${questions.length} правильно`)}</span>
        </div>
        <p className="summary-text">
          {pct === 100
            ? tr('Perfekt! Kohärenter geht es nicht.', 'Ідеально! Когерентніше не буває.')
            : pct >= 80
              ? tr('Stark – dieses Thema sitzt.', 'Чудово – цю тему засвоєно.')
              : pct >= 60
                ? tr('Solide Basis. Schau dir die Erklärungen noch einmal an und versuche es erneut.', 'Міцна основа. Переглянь пояснення ще раз і спробуй знову.')
                : tr('Hier lohnt sich ein zweiter Blick in Theorie und Simulator.', 'Варто ще раз переглянути теорію та симулятор.')}
        </p>
        <ul className="summary-xp">
          <li>
            {tr('Antworten', 'Відповіді')}: <strong>+{earned} XP</strong>
          </li>
          <li>
            {tr('Abschlussbonus', 'Бонус за завершення')}: <strong>+{finished.bonus} XP</strong>
          </li>
          {replay && <li className="muted">{tr('Wiederholungsmodus: XP halbiert, da bereits gemeistert.', 'Режим повторення: XP зменшено вдвічі, бо тему вже опановано.')}</li>}
        </ul>
        <div className="row gap">
          <button className="btn primary" type="button" onClick={onRestart}>
            {tr('Neue Runde', 'Новий раунд')}
          </button>
          <button className="btn" type="button" onClick={onExit}>
            {tr('Zurück', 'Назад')}
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
        setInputError(tr('Bitte eine Zahl eingeben (z. B. 63,87).', 'Введи число (напр. 63,87).'));
        return null;
      }
      return isNumericCorrect(q, v);
    }
    if (selected.length === 0) {
      setInputError(tr('Bitte eine Antwort auswählen.', 'Обери відповідь.'));
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
          {tr('Frage', 'Питання')} {index + 1} / {questions.length}
        </span>
        <span className="difficulty" title={tr('Schwierigkeit', 'Складність')}>
          {'◆'.repeat(q.difficulty)}
          {'◇'.repeat(3 - q.difficulty)}
        </span>
        <span className="combo" data-active={state.stats.streak >= 3}>
          🔥 {tr('Serie', 'Серія')} {state.stats.streak}
          {state.stats.streak >= 6 ? ' · ×1,5 XP' : state.stats.streak >= 3 ? ' · ×1,2 XP' : ''}
        </span>
      </div>
      <ProgressBar value={index / questions.length} label={tr('Fortschritt der Challenge', 'Прогрес завдання')} />

      <form className="question" onSubmit={submit}>
        <p className="question-kind">
          {q.kind === 'numeric'
            ? tr('🧮 Rechen-Puzzle', '🧮 Розрахункова задача')
            : q.kind === 'multi'
              ? tr('☑️ Mehrfachauswahl', '☑️ Кілька варіантів')
              : tr('🔘 Einfachauswahl', '🔘 Один варіант')}
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
              aria-label={tr('Antwort', 'Відповідь')}
              placeholder={tr('Ergebnis', 'Результат')}
              value={numeric}
              disabled={!!submitted}
              onChange={(e) => {
                setNumeric(e.target.value);
                setInputError(null);
              }}
              autoFocus
            />
            <span className="unit-label">{q.unit}</span>
            <span className="muted small">
              {tr('Toleranz', 'Допуск')} ±{(q.tolerance * 100).toLocaleString(numberLocale(lang))} %
            </span>
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
              {tr('Antwort prüfen', 'Перевірити відповідь')}
            </button>
            {q.hint && !hintShown && (
              <button className="btn ghost" type="button" onClick={() => setHintShown(true)}>
                {tr('Hinweis (halbe XP)', 'Підказка (половина XP)')}
              </button>
            )}
          </div>
        ) : (
          <div className={`feedback ${submitted.correct ? 'is-correct' : 'is-wrong'}`}>
            <strong>{submitted.correct ? `✔ ${tr('Richtig!', 'Правильно!')} +${submitted.xp} XP` : tr('✘ Leider falsch.', '✘ На жаль, неправильно.')}</strong>
            {!submitted.correct && (
              <p>
                {tr('Richtige Antwort', 'Правильна відповідь')}: <RichText text={correctText} />
              </p>
            )}
            <p>
              <RichText text={q.explanation} />
            </p>
            <button className="btn primary" type="button" onClick={next} autoFocus>
              {index + 1 >= questions.length ? tr('Auswertung', 'Результати') : tr('Weiter →', 'Далі →')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
