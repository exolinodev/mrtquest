import { useMemo, useState } from 'react';
import { ChallengeRunner } from '../components/ChallengeRunner';
import { Link } from '../components/router';
import { Panel } from '../components/ui';
import { ALL_QUESTIONS, drawPractice } from '../content/questions';
import type { QuestionRef } from '../content/questions/types';
import { useGame } from '../game/GameContext';
import { CONCEPT_BY_ID } from '../game/learning/concepts';
import { conceptMastery, dueItems } from '../game/learning/memory';
import { randomSeed } from '../game/learning/select';
import { useLang } from '../i18n/LanguageContext';
import { seededRandom } from '../physics/phantom';
import { MODULE_BY_ID } from '../content/modules';

const CONCEPT_ROUND = 5;
const REVIEW_ROUND = 8;

/** Gezieltes Üben eines Konzepts (/ueben/:konzept) oder gemischte Wiederholung über alles (/ueben). */
export function PracticePage({ conceptId }: { conceptId?: string }) {
  const { tr, loc } = useLang();
  const { state } = useGame();
  const concept = conceptId ? CONCEPT_BY_ID[conceptId] : undefined;
  const [questions, setQuestions] = useState<QuestionRef[] | null>(null);
  const [round, setRound] = useState(0);
  const now = Date.now();
  const due = dueItems(state.learning, now).length;
  const mastery = concept ? conceptMastery(state.learning, concept.id, now) : null;
  const pool = useMemo(() => (concept ? ALL_QUESTIONS.filter((q) => concept.items.includes(q.id)) : ALL_QUESTIONS), [concept]);

  if (conceptId && !concept) {
    return (
      <div className="page">
        <h1>{tr('Thema nicht gefunden', 'Тема не найдена')}</h1>
        <Link to="/vorlesung/luecken">{tr('Zur Lückenkarte', 'К карте пробелов')}</Link>
      </div>
    );
  }

  const start = () => {
    const count = concept ? Math.min(CONCEPT_ROUND, Math.max(1, pool.length)) : REVIEW_ROUND;
    setQuestions(drawPractice(seededRandom(randomSeed()), state.learning, count, concept ? [concept.id] : undefined));
    setRound((r) => r + 1);
  };

  const title = concept ? `🎯 ${loc(concept.title)}` : `🔁 ${tr('Tägliche Wiederholung', 'Ежедневное повторение')}`;

  return (
    <div className="page practice-page">
      <Link to="/vorlesung/luecken" className="back-link">
        ← {tr('Meine Lücken', 'Мои пробелы')}
      </Link>
      <h1>{title}</h1>
      {!questions ? (
        <Panel>
          {concept ? (
            <>
              <p className="lead">
                {tr(
                  `Eine kurze Runde nur zu diesem Thema aus „${loc(MODULE_BY_ID[concept.module].title)}“. Falsche Antworten bekommen eine Nachhak-Frage, Rechenaufgaben kommen mit neuen Zahlen.`,
                  `Короткий раунд только по этой теме из «${loc(MODULE_BY_ID[concept.module].title)}». На ошибки приходит контрольный вопрос, расчётные задачи идут с новыми числами.`,
                )}
              </p>
              <p className="small muted">
                {!mastery || mastery.mastery === null
                  ? tr('Für dieses Thema hast du noch wenig Antworten gegeben.', 'По этой теме у тебя пока мало ответов.')
                  : tr(`Aktuelle Sicherheit: ${Math.round(mastery.mastery * 100)} %`, `Текущая уверенность: ${Math.round(mastery.mastery * 100)} %`)}
              </p>
              <div className="row gap wrap">
                <button type="button" className="btn primary" onClick={start}>
                  ▶ {tr('Übung starten', 'Начать упражнение')}
                </button>
                <Link className="btn ghost" to={`/modul/${concept.module}/theorie/${concept.section}`}>
                  📖 {tr('Erst nachlesen', 'Сначала перечитать')}
                </Link>
                {concept.lab && (
                  <Link className="btn ghost" to={`/labor/${concept.lab}`}>
                    🔬 {tr('Im Labor ausprobieren', 'Попробовать в лаборатории')}
                  </Link>
                )}
              </div>
            </>
          ) : (
            <>
              <p className="lead">
                {due > 0
                  ? tr(
                      `Heute sind ${due} Wiederholungen fällig. Die Runde holt genau diese Fragen zurück, bevor du sie vergisst, und ergänzt sie um deine schwächsten Themen.`,
                      `Сегодня к повторению ${due} вопросов. Раунд возвращает именно их, пока ты их не забыл(а), и дополняет самыми слабыми темами.`,
                    )
                  : tr(
                      'Gerade ist nichts fällig. Die Runde mischt deine schwächsten Themen mit neuen Fragen aus allen Modulen.',
                      'Сейчас ничего не нужно повторять. Раунд смешает самые слабые темы с новыми вопросами из всех модулей.',
                    )}
              </p>
              <button type="button" className="btn primary" onClick={start}>
                ▶ {tr('Wiederholung starten', 'Начать повторение')}
              </button>
            </>
          )}
        </Panel>
      ) : (
        <ChallengeRunner
          key={round}
          questions={questions}
          kind={{ type: 'practice' }}
          replay={false}
          followUpPool={pool}
          onRestart={start}
          onExit={() => setQuestions(null)}
        />
      )}
    </div>
  );
}
