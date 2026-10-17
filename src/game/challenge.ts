export type ChallengeKind = { type: 'module'; moduleId: string } | { type: 'exam' };

export const MASTERY_SCORE = 0.8;

export function requiredCorrect(count: number, score = MASTERY_SCORE): number {
  return Math.ceil(count * score);
}

export function completionBonus(score: number, kind: ChallengeKind, replay: boolean): number {
  const factor = replay ? 0.5 : 1;
  const bonus = kind.type === 'exam'
    ? score >= MASTERY_SCORE ? 150 : score >= 0.6 ? 60 : 0
    : score >= 1 ? 40 : score >= MASTERY_SCORE ? 25 : score >= 0.6 ? 10 : 0;
  return Math.round(bonus * factor);
}
