import { EXAM_MODULES, type ModuleId } from '../modules';
import { LECTURE_LESSONS } from '../lecture';
import { anwendungenQuestions } from './anwendungen';
import { einfuehrungQuestions } from './einfuehrung';
import { fourierQuestions } from './fourier';
import { hardwareQuestions } from './hardware';
import { kernspinQuestions } from './kernspin';
import { kraumQuestions } from './kraum';
import { ortskodierungQuestions } from './ortskodierung';
import { qualitaetQuestions } from './qualitaet';
import { relaxationQuestions } from './relaxation';
import { sequenzenQuestions } from './sequenzen';
import { shuffle, type QuestionRef, type QuestionSource, type Rng } from './types';

/** Fragenpools je Kapitel; die Themendateien sind nach den früheren Modulen benannt. */
export const QUESTION_BANK: Record<ModuleId, QuestionSource[]> = {
  einfuehrung: [...einfuehrungQuestions],
  prinzip: [...kernspinQuestions, ...relaxationQuestions],
  bild: [...ortskodierungQuestions, ...kraumQuestions, ...hardwareQuestions],
  anwendungen: [...anwendungenQuestions],
  fourier: [...fourierQuestions],
  sequenzen: [...sequenzenQuestions],
  qualitaet: [...qualitaetQuestions],
};

for (const lesson of LECTURE_LESSONS) QUESTION_BANK[lesson.module].push(lesson.question);

export const CHALLENGE_LENGTH = 8;
export const EXAM_LENGTH = 21;

const seedFrom = (rng: Rng) => Math.floor(rng() * 0xffffffff);
const toRef = (source: QuestionSource, rng: Rng): QuestionRef => ({ source, seed: seedFrom(rng), shuffleSeed: seedFrom(rng) });

/** Zieht eine Challenge: Rechen-Puzzles und Verständnisfragen gemischt (sprachunabhängig). */
export function drawChallenge(moduleId: ModuleId, rng: Rng, count = CHALLENGE_LENGTH): QuestionRef[] {
  const bank = QUESTION_BANK[moduleId];
  const generators = shuffle(rng, bank.filter((q) => 'generate' in q));
  const fixed = shuffle(rng, bank.filter((q) => !('generate' in q)));
  const numericCount = Math.min(generators.length, Math.ceil(count * 0.4));
  const chosen = [...generators.slice(0, numericCount), ...fixed.slice(0, count - numericCount)];
  return shuffle(rng, chosen).map((src) => toRef(src, rng));
}

/** Abschlussprüfung: nur Prüfungsstoff, gleichmäßig über die Prüfungsmodule verteilt. */
export function drawExam(rng: Rng): QuestionRef[] {
  const perModule = Math.ceil(EXAM_LENGTH / EXAM_MODULES.length);
  const all = EXAM_MODULES.map((m) => m.id).flatMap((id) =>
    shuffle(rng, QUESTION_BANK[id])
      .slice(0, perModule)
      .map((src) => toRef(src, rng)),
  );
  return shuffle(rng, all).slice(0, EXAM_LENGTH);
}

export function totalQuestionCount(): number {
  return Object.values(QUESTION_BANK).reduce((sum, b) => sum + b.length, 0);
}
