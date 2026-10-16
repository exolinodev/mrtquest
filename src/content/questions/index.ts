import type { ModuleId } from '../modules';
import { hardwareQuestions } from './hardware';
import { kernspinQuestions } from './kernspin';
import { kraumQuestions } from './kraum';
import { ortskodierungQuestions } from './ortskodierung';
import { qualitaetQuestions } from './qualitaet';
import { relaxationQuestions } from './relaxation';
import { sequenzenQuestions } from './sequenzen';
import { resolveQuestion, shuffle, shuffleOptions, type Question, type QuestionSource, type Rng } from './types';

export const QUESTION_BANK: Record<ModuleId, QuestionSource[]> = {
  kernspin: kernspinQuestions,
  relaxation: relaxationQuestions,
  ortskodierung: ortskodierungQuestions,
  kraum: kraumQuestions,
  sequenzen: sequenzenQuestions,
  qualitaet: qualitaetQuestions,
  hardware: hardwareQuestions,
};

export const CHALLENGE_LENGTH = 8;
export const EXAM_LENGTH = 21;

/** Zieht eine Challenge: Rechen-Puzzles und Verständnisfragen gemischt. */
export function drawChallenge(moduleId: ModuleId, rng: Rng, count = CHALLENGE_LENGTH): Question[] {
  const bank = QUESTION_BANK[moduleId];
  const generators = shuffle(rng, bank.filter((q) => 'generate' in q));
  const fixed = shuffle(rng, bank.filter((q) => !('generate' in q)));
  const numericCount = Math.min(generators.length, Math.ceil(count * 0.4));
  const chosen = [...generators.slice(0, numericCount), ...fixed.slice(0, count - numericCount)];
  return shuffle(rng, chosen).map((src) => shuffleOptions(resolveQuestion(src, rng), rng));
}

/** Abschlussprüfung: je drei Fragen pro Modul, gemischt. */
export function drawExam(rng: Rng): Question[] {
  const perModule = Math.floor(EXAM_LENGTH / Object.keys(QUESTION_BANK).length);
  const all = (Object.keys(QUESTION_BANK) as ModuleId[]).flatMap((id) =>
    shuffle(rng, QUESTION_BANK[id])
      .slice(0, perModule)
      .map((src) => shuffleOptions(resolveQuestion(src, rng), rng)),
  );
  return shuffle(rng, all);
}

export function totalQuestionCount(): number {
  return Object.values(QUESTION_BANK).reduce((sum, b) => sum + b.length, 0);
}
