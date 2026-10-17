import { useEffect, useId, useMemo, useRef, useState, type FormEvent } from 'react';
import { isNumericCorrect, materialize, parseNumber, type Question, type QuestionRef } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import { answerXp } from '../game/levels';
import { completionBonus, MASTERY_SCORE, type ChallengeKind } from '../game/challenge';
import { numberLocale } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';
import { RichText } from './RichText';
import { ProgressBar } from './ui';
import { Link } from './router';

export type { ChallengeKind } from '../game/challenge';
export { completionBonus } from '../game/challenge';

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

function AnswerSolution({ question }: { question: Question }) {
  const { lang } = useLang();
  if (question.kind === 'numeric') return <p className="solution-value"><strong>{question.answer.toLocaleString(numberLocale(lang), { maximumSignificantDigits: 6, useGrouping: false })}</strong> {question.unit}</p>;
  const indices = question.kind === 'mc' ? [question.answer] : question.answers;
  return <ul className="solution-list">{indices.map((i) => <li key={i}><RichText text={question.options[i]} /></li>)}</ul>;
}

export function ChallengeRunner({ questions, kind, replay: replayAtStart, onRestart, onExit }: Props) {
  const { state, dispatch } = useGame();
  const { lang, tr } = useLang();
  // A newly earned mastery badge affects the next round, not this round’s summary.
  const [replay] = useState(replayAtStart);
  const promptId = useId();
  const helpId = useId();
  const errorId = useId();
  const feedbackId = useId();
  const feedbackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [records, setRecords] = useState<AnswerRecord[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [numeric, setNumeric] = useState('');
  const [inputError, setInputError] = useState<'number' | 'selection' | null>(null);
  const [hintShown, setHintShown] = useState(false);
  const [submitted, setSubmitted] = useState<AnswerRecord | null>(null);
  const [finished, setFinished] = useState<{ score: number; bonus: number } | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    questionRef.current?.focus({ preventScroll: true });
    questionRef.current?.scrollIntoView({ block: 'start' });
  }, [index, finished]);

  useEffect(() => {
    if (!submitted) return;
    feedbackRef.current?.focus({ preventScroll: true });
    feedbackRef.current?.scrollIntoView({ block: 'nearest' });
  }, [submitted]);

  // Bei Sprachwechsel neu materialisiert: gleiche Seeds ⇒ gleiche Werte und Optionsreihenfolge
  const q = useMemo(() => (questions[index] ? materialize(questions[index], lang) : undefined), [questions, index, lang]);
  const correctCount = records.filter((r) => r.correct).length;
  const earned = records.reduce((s, r) => s + r.xp, 0);

  const errorText = inputError === 'number'
    ? tr('Gib eine gültige Zahl ein. Komma oder Punkt als Dezimalzeichen sind möglich.', 'Введи корректное число. Десятичный разделитель — запятая или точка.')
    : tr('Wähle mindestens eine Antwort aus.', 'Выбери хотя бы один ответ.');

  if (finished) {
    const pct = Math.round(finished.score * 100);
    return (
      <div className="challenge-summary" ref={questionRef} tabIndex={-1}>
        <div className="summary-score" data-tone={pct >= 80 ? 'good' : pct >= 60 ? 'warn' : 'bad'}>
          <span className="summary-pct">{pct} %</span>
          <span>{tr(`${correctCount} von ${questions.length} richtig`, `${correctCount} из ${questions.length} правильно`)}</span>
        </div>
        <p className="summary-text">
          {pct === 100
            ? tr('Alles richtig – sehr stark!', 'Все ответы верны — отличный результат!')
            : pct >= 80
              ? tr('Stark – dieses Thema sitzt.', 'Отлично – эта тема усвоена.')
              : pct >= 60
                ? tr('Solide Basis. Schau dir die Erklärungen noch einmal an und versuche es erneut.', 'Прочная основа. Просмотри объяснения ещё раз и попробуй снова.')
                : tr('Hier lohnt sich ein zweiter Blick in Theorie und Simulator.', 'Стоит ещё раз заглянуть в теорию и симулятор.')}
        </p>
        <dl className="summary-rewards">
          <div><dt>{tr('Antwort-XP', 'XP за ответы')}</dt><dd>+{earned}</dd></div>
          <div><dt>{tr('Rundenbonus', 'Бонус за раунд')}</dt><dd>+{finished.bonus}</dd></div>
          <div><dt>{tr('Zusammen', 'Итого')}</dt><dd>+{earned + finished.bonus} XP</dd></div>
        </dl>
        {replay && <p className="challenge-replay-note">{tr('Wiederholungsrunde: Die angezeigten XP sind bereits halbiert und gerundet.', 'Повторение: показанные XP уже уменьшены вдвое и округлены.')}</p>}
        {finished.score >= MASTERY_SCORE && <p className="ok-text">{kind.type === 'module' ? tr('✓ Ziel erreicht: Modul gemeistert.', '✓ Цель достигнута: модуль освоен.') : tr('✓ Abschlussprüfung bestanden.', '✓ Итоговый экзамен сдан.')}</p>}
        <div className="row gap summary-actions">
          <button className="btn primary" type="button" onClick={onRestart}>{tr('Neue Runde starten', 'Начать новый раунд')}</button>
          <button className="btn" type="button" onClick={onExit}>{tr('Zurück zur Übersicht', 'Назад к обзору')}</button>
          {kind.type === 'module' && <Link className="btn ghost" to={`/modul/${kind.moduleId}/theorie`}>{tr('Theorie auffrischen', 'Повторить теорию')}</Link>}
        </div>
        <section className="challenge-review" aria-label={tr('Rückblick auf deine Antworten', 'Разбор твоих ответов')}>
          <h3>{tr('Deine Antworten im Rückblick', 'Разбор твоих ответов')}</h3>
          <p className="small muted">{tr('Öffne eine Aufgabe, um Lösung und Erklärung nachzulesen.', 'Открой задание, чтобы посмотреть решение и объяснение.')}</p>
          {records.map((record, i) => {
            const question = materialize(questions[i], lang);
            return <details key={i} className="challenge-review-item" data-correct={record.correct}>
              <summary><span>{tr('Aufgabe', 'Задание')} {i + 1}</span><span>{record.correct ? tr('✓ Richtig', '✓ Верно') : tr('↻ Noch üben', '↻ Повторить')}</span></summary>
              <p className="review-prompt"><RichText text={question.prompt} /></p>
              <h4>{tr('Die Lösung', 'Решение')}</h4>
              <AnswerSolution question={question} />
              <p><RichText text={question.explanation} /></p>
            </details>;
          })}
        </section>
      </div>
    );
  }

  if (!q) return null;

  const evaluate = (): boolean | null => {
    if (q.kind === 'numeric') {
      const v = parseNumber(numeric);
      if (v === null) {
        setInputError('number');
        return null;
      }
      return isNumericCorrect(q, v);
    }
    if (selected.length === 0) {
      setInputError('selection');
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
    <div className="challenge" ref={questionRef} tabIndex={-1}>
      <div className="challenge-head">
        <span>
          {tr('Aufgabe', 'Задание')} {index + 1} / {questions.length}
        </span>
        <span className="difficulty">{tr(['Basis', 'Aufbau', 'Transfer'][q.difficulty - 1], ['Базовый', 'Средний', 'Продвинутый'][q.difficulty - 1])} · {tr(`Stufe ${q.difficulty}/3`, `Уровень ${q.difficulty}/3`)}</span>
        <span className="combo" data-active={state.stats.streak >= 3}>
          🔥 {tr('Serie', 'Серия')} {state.stats.streak}
          {state.stats.streak >= 6 ? ' · ×1,5 XP' : state.stats.streak >= 3 ? ' · ×1,2 XP' : ''}
        </span>
      </div>
      <ProgressBar value={(index + (submitted ? 1 : 0)) / questions.length} label={tr('Fortschritt der Challenge', 'Прогресс задания')} />

      <form className="question" onSubmit={submit} aria-labelledby={promptId}>
        <p className="question-kind">
          {q.kind === 'numeric'
            ? tr('Rechenaufgabe', 'Расчётная задача')
            : q.kind === 'multi'
              ? tr('Mehrfachauswahl', 'Несколько вариантов')
              : tr('Einfachauswahl', 'Один вариант')}
        </p>
        <h3 className="question-prompt" id={promptId}>
          <RichText text={q.prompt} />
        </h3>

        <p className="question-instruction" id={helpId}>{q.kind === 'numeric'
          ? tr(`Gib dein Ergebnis in ${q.unit} ein. Komma und Punkt sind möglich.`, `Введи результат в ${q.unit}. Можно использовать запятую или точку.`)
          : q.kind === 'multi' ? tr('Wähle alle richtigen Aussagen. Mehrere Antworten sind möglich.', 'Выбери все верные утверждения. Верных ответов может быть несколько.')
            : tr('Wähle genau eine Antwort.', 'Выбери один ответ.')}</p>
        {q.kind === 'numeric' ? (
          <div className="numeric-input">
            <input
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-label={tr(`Dein Ergebnis in ${q.unit}`, `Твой результат в ${q.unit}`)}
              aria-describedby={`${helpId}${inputError ? ` ${errorId}` : ''}`}
              aria-invalid={!!inputError}
              placeholder={tr('Ergebnis', 'Результат')}
              value={numeric}
              disabled={!!submitted}
              onChange={(e) => {
                setNumeric(e.target.value);
                setInputError(null);
              }}
            />
            <span className="unit-label">{q.unit}</span>
            <span className="muted small">
              {tr('Akzeptierte Abweichung', 'Допустимое отклонение')}: ±{q.answer === 0 ? `${q.tolerance.toLocaleString(numberLocale(lang))} ${q.unit}` : `${(q.tolerance * 100).toLocaleString(numberLocale(lang))} %`}
            </span>
          </div>
        ) : (
          <div className="options" role={q.kind === 'mc' ? 'radiogroup' : 'group'} aria-labelledby={promptId} aria-describedby={helpId}>
            {q.options.map((opt, i) => (
              <button
                key={i}
                type="button"
                role={q.kind === 'mc' ? 'radio' : 'checkbox'}
                aria-checked={selected.includes(i)}
                className={`option ${optionState(i)}`}
                onClick={() => toggle(i)}
                disabled={!!submitted}
              >
                <span className="option-marker" aria-hidden="true">
                  {q.kind === 'mc' ? String.fromCharCode(65 + i) : selected.includes(i) ? '☑' : '☐'}
                </span>
                <span className="option-content">
                  <RichText text={opt} />
                  {submitted && (optionState(i) === 'correct' || selected.includes(i)) && <span className="option-result">{optionState(i) === 'correct' ? tr('✓ Richtige Antwort', '✓ Верный ответ') : tr('✘ Deine Auswahl', '✘ Твой выбор')}{optionState(i) === 'correct' && selected.includes(i) ? tr(' · von dir gewählt', ' · твой выбор') : ''}</span>}
                </span>
              </button>
            ))}
          </div>
        )}

        {inputError && <p className="input-error" role="alert" id={errorId}>{errorText}</p>}

        {hintShown && q.hint && !submitted && (
          <p className="hint">
            💡 <RichText text={q.hint} />
          </p>
        )}

        {!submitted ? (
          <div className="row gap">
            <button className="btn primary" type="submit">
              {tr('Antwort prüfen', 'Проверить ответ')}
            </button>
            {q.hint && !hintShown && (
              <button className="btn ghost" type="button" onClick={() => setHintShown(true)}>
                {tr('Hinweis nutzen · ½ Antwort-XP', 'Подсказка · ½ XP за ответ')}
              </button>
            )}
          </div>
        ) : (
          <div className={`feedback ${submitted.correct ? 'is-correct' : 'is-wrong'}`} ref={feedbackRef} tabIndex={-1} aria-labelledby={feedbackId}>
            <strong id={feedbackId}>{submitted.correct ? `✔ ${tr('Richtig!', 'Правильно!')} +${submitted.xp} XP` : tr('Noch nicht richtig – schauen wir es uns an.', 'Пока неверно — давай разберёмся.')}</strong>
            {!submitted.correct && <div className="answer-solution"><h4>{tr('Die richtige Lösung', 'Верное решение')}</h4><AnswerSolution question={q} /></div>}
            <h4>{tr('Warum ist das so?', 'Почему так?')}</h4>
            <p><RichText text={q.explanation} /></p>
            <button className="btn primary" type="button" onClick={next}>
              {index + 1 >= questions.length ? tr('Runde auswerten →', 'Итоги раунда →') : tr('Nächste Aufgabe →', 'Следующее задание →')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
