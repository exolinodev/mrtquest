import { answerXp } from '../game/levels';
import { completionBonus, requiredCorrect, type ChallengeKind } from '../game/challenge';
import { numberLocale } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';

export function ChallengeIntro({ count, kind, replay, attempts = 0, bestScore = 0, onStart }: {
  count: number; kind: ChallengeKind; replay: boolean; attempts?: number; bestScore?: number; onStart: () => void;
}) {
  const { lang, tr } = useLang();
  const exam = kind.type === 'exam';
  const target = requiredCorrect(count);
  const tiers = exam ? [0.6, 0.8] : [0.6, 0.8, 1];
  return <section className="challenge-intro" aria-labelledby="challenge-intro-title">
    <p className="eyebrow">{tr(exam ? 'DEIN WISSEN IM GESAMTBILD' : 'VOM VERSTEHEN ZUM ANWENDEN', exam ? 'ПРОВЕРЬ ЗНАНИЯ ПО ВСЕМ ТЕМАМ' : 'ОТ ПОНИМАНИЯ К ПРАКТИКЕ')}</p>
    <h2 id="challenge-intro-title">{exam ? tr('Bereit für die Probeprüfung?', 'Готов(а) к пробному экзамену?') : tr('Deine Modul-Challenge', 'Проверь знания по модулю')}</h2>
    <p className="challenge-intro-lead">{exam
      ? tr('Wende dein Wissen aus allen Prüfungsmodulen an. Nach jeder Antwort erfährst du, wie die Lösung zustande kommt.', 'Примени знания из всех экзаменационных модулей. После каждого ответа ты увидишь объяснение решения.')
      : tr('Teste dein Verständnis und löse Rechenaufgaben. Nach jeder Antwort bekommst du die Lösung mit Erklärung.', 'Проверь понимание темы и реши расчётные задачи. После каждого ответа ты получишь решение с объяснением.')}</p>
    <dl className="challenge-overview">
      <div><dt>{tr('Umfang', 'Объём')}</dt><dd>{count} <span>{tr('Aufgaben', 'заданий')}</span></dd></div>
      <div><dt>{tr(exam ? 'Zum Bestehen' : 'Zum Meistern', exam ? 'Для сдачи' : 'Для освоения')}</dt><dd>{target} <span>{tr(`von ${count} richtig`, `из ${count} верно`)}</span></dd></div>
      <div><dt>{tr('Dein Tempo', 'В своём темпе')}</dt><dd className="challenge-no-timer">{tr('Ohne Zeitlimit', 'Без таймера')}</dd></div>
    </dl>
    <p className="challenge-goal">{exam
      ? tr('Ab 80 % erhältst du das Gold-Abzeichen „Prüfung bestanden“.', 'От 80 % ты получишь золотую награду «Экзамен сдан».')
      : tr('Ab 80 % ist das Modul gemeistert und du erhältst das Modul-Abzeichen.', 'От 80 % модуль считается освоенным, и ты получишь награду за модуль.')}</p>
    {replay && <p className="challenge-replay-note">{tr('✓ Bereits gemeistert · Wiederholungsrunde mit halben XP. Alle XP-Werte unten sind dafür angepasst und gerundet.', '✓ Уже освоено · Повторение с половиной XP. Все значения XP ниже уже уменьшены и округлены.')}</p>}
    {(attempts > 0 || bestScore > 0) && <dl className="challenge-history">
      {attempts > 0 && <div><dt>{tr('Bisherige Runden', 'Пройдено раундов')}</dt><dd>{attempts.toLocaleString(numberLocale(lang))}</dd></div>}
      <div><dt>{tr('Dein Bestwert', 'Лучший результат')}</dt><dd>{Math.round(bestScore * 100)} %</dd></div>
    </dl>}
    <button className="btn primary big challenge-start" type="button" onClick={onStart}>{exam ? tr('Prüfung starten →', 'Начать экзамен →') : tr('Challenge starten →', 'Начать раунд →')}</button>
    <p className="challenge-start-note">{tr('Neue Aufgabenauswahl pro Runde. Rechenwerte werden variiert.', 'В каждом раунде новая подборка заданий и новые числовые значения.')}</p>
    <details className="challenge-rules">
      <summary>{tr('So funktionieren XP und Hinweise', 'Как начисляются XP и работают подсказки')}</summary>
      <h3>{tr('XP für richtige Antworten', 'XP за верные ответы')}</h3>
      <div className="challenge-reward-grid">
        {([1, 2, 3] as const).map((difficulty) => <div key={difficulty}><span>{tr(['Basis', 'Aufbau', 'Transfer'][difficulty - 1], ['Базовый', 'Средний', 'Продвинутый'][difficulty - 1])}</span><strong>+{answerXp(difficulty, 1, false, replay)} XP</strong></div>)}
      </div>
      <ul className="challenge-rule-list">
        <li>{tr('Ab 3 richtigen Antworten in Folge: ×1,2. Ab 6 richtigen: ×1,5. Eine falsche Antwort setzt die Serie zurück.', 'От 3 верных ответов подряд: ×1,2. От 6: ×1,5. Неверный ответ обнуляет серию.')}</li>
        <li>{tr('Ein Hinweis halbiert die Antwort-XP dieser Aufgabe. Hinweise gibt es bei ausgewählten Aufgaben. Multiplikatoren gelten vor dem Runden auf ganze XP.', 'Подсказка уменьшает XP за ответ вдвое. Она доступна не во всех заданиях. Множители применяются до округления XP до целого числа.')}</li>
      </ul>
      <h3>{tr('Bonus am Ende der Runde', 'Бонус в конце раунда')}</h3>
      <div className="challenge-reward-grid" data-columns={tiers.length}>
        {tiers.map((score) => <div key={score}><span>{tr(`Ab ${requiredCorrect(count, score)} richtigen`, `От ${requiredCorrect(count, score)} верных`)}</span><strong>+{completionBonus(score, kind, replay)} XP</strong></div>)}
      </div>
      <p className="small muted">{tr('Es zählt die höchste erreichte Bonusstufe. Abzeichen können zusätzliche XP bringen.', 'Начисляется только наибольший достигнутый бонус. Награды могут приносить дополнительные XP.')}</p>
    </details>
  </section>;
}
