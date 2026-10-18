import { EXAM_MODULES, type ModuleId } from '../modules';
import { LECTURE_LESSONS } from '../lecture';
import { anwendungenQuestions } from './anwendungen';
import { bildQuestions } from './bild';
import { einfuehrungQuestions } from './einfuehrung';
import { fourierQuestions } from './fourier';
import { hardwareQuestions } from './hardware';
import { kernspinQuestions } from './kernspin';
import { kraumQuestions } from './kraum';
import { ortskodierungQuestions } from './ortskodierung';
import { prinzipQuestions } from './prinzip';
import { qualitaetQuestions } from './qualitaet';
import { relaxationQuestions } from './relaxation';
import { sequenzenQuestions } from './sequenzen';
import { shuffle, type QuestionRef, type QuestionSource, type Rng } from './types';
import type { LearningState } from '../../game/learning/memory';
import { drawAdaptive, toRef } from '../../game/learning/select';

/** Fragenpools je Kapitel; die Themendateien sind nach den früheren Modulen benannt. */
export const QUESTION_BANK: Record<ModuleId, QuestionSource[]> = {
  einfuehrung: [...einfuehrungQuestions],
  prinzip: [...kernspinQuestions, ...relaxationQuestions, ...prinzipQuestions],
  bild: [...ortskodierungQuestions, ...kraumQuestions, ...hardwareQuestions, ...bildQuestions],
  anwendungen: [...anwendungenQuestions],
  fourier: [...fourierQuestions],
  sequenzen: [...sequenzenQuestions],
  qualitaet: [...qualitaetQuestions],
};

for (const lesson of LECTURE_LESSONS) QUESTION_BANK[lesson.module].push(lesson.question);

export const CHALLENGE_LENGTH = 8;
export const EXAM_LENGTH = 21;

/**
 * Zieht eine Challenge. Mit Lerngedächtnis adaptiv (fällig, schwach, neu), sonst gemischt wie bisher:
 * Rechen-Puzzles und Verständnisfragen (sprachunabhängig).
 */
export function drawChallenge(moduleId: ModuleId, rng: Rng, count = CHALLENGE_LENGTH, learning?: LearningState, now = Date.now()): QuestionRef[] {
  const bank = QUESTION_BANK[moduleId];
  if (learning) return drawAdaptive(bank, rng, { learning, now, count }).map((src) => toRef(src, rng));
  const generators = shuffle(rng, bank.filter((q) => 'generate' in q));
  const fixed = shuffle(rng, bank.filter((q) => !('generate' in q)));
  const numericCount = Math.min(generators.length, Math.ceil(count * 0.4));
  const chosen = [...generators.slice(0, numericCount), ...fixed.slice(0, count - numericCount)];
  return shuffle(rng, chosen).map((src) => toRef(src, rng));
}

/** Alle Fragen aller Module (für Konzept-Übung und tägliche Wiederholung). */
export const ALL_QUESTIONS: QuestionSource[] = [...new Map(Object.values(QUESTION_BANK).flat().map((q) => [q.id, q])).values()];

/** Gezielte Übung zu einzelnen Konzepten bzw. gemischte Wiederholung über alles. */
export function drawPractice(rng: Rng, learning: LearningState, count: number, concepts?: string[], now = Date.now()): QuestionRef[] {
  return drawAdaptive(ALL_QUESTIONS, rng, { learning, now, count, concepts }).map((src) => toRef(src, rng));
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
