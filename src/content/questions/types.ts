/**
 * Fragetypen der Challenges. Texte unterstützen Inline-Formeln in $…$ (KaTeX).
 *
 * Feste Fragen speichern zweisprachige Texte ({ de, ru }). Generatoren erhalten
 * die Sprache als Parameter und müssen den Zufallsgenerator unabhängig von der
 * Sprache identisch konsumieren – so liefert derselbe Seed in beiden Sprachen
 * dieselben Zahlenwerte, und ein Sprachwechsel mitten in der Challenge ist möglich.
 */
import { numberLocale, type Lang, type Loc } from '../../i18n/format';
import { seededRandom } from '../../physics/phantom';

interface QuestionBase {
  id: string;
  prompt: string;
  explanation: string;
  hint?: string;
  difficulty: 1 | 2 | 3;
}

export interface SingleChoiceQuestion extends QuestionBase {
  kind: 'mc';
  options: string[];
  answer: number;
}

export interface MultiChoiceQuestion extends QuestionBase {
  kind: 'multi';
  options: string[];
  answers: number[];
}

export interface NumericQuestion extends QuestionBase {
  kind: 'numeric';
  answer: number;
  /** relative Toleranz, z. B. 0.02 = ±2 % */
  tolerance: number;
  unit: string;
}

/** Eine Frage in genau einer Sprache – so wird sie angezeigt. */
export type Question = SingleChoiceQuestion | MultiChoiceQuestion | NumericQuestion;

interface FixedBase {
  id: string;
  prompt: Loc;
  explanation: Loc;
  hint?: Loc;
  difficulty: 1 | 2 | 3;
}

export type FixedQuestion =
  | (FixedBase & { kind: 'mc'; options: Loc[]; answer: number })
  | (FixedBase & { kind: 'multi'; options: Loc[]; answers: number[] })
  | (FixedBase & { kind: 'numeric'; answer: number; tolerance: number; unit: Loc });

export type Rng = () => number;

export interface GeneratedQuestion {
  id: string;
  generate: (rng: Rng, lang: Lang) => Question;
}

/** Entweder eine feste zweisprachige Frage oder ein Generator für parametrisierte Rechen-Puzzles. */
export type QuestionSource = FixedQuestion | GeneratedQuestion;

/** Liefert für Generatoren eine kompakte Auswahlfunktion: t('deutsch', 'русский'). */
export function tl(lang: Lang): (de: string, ru: string) => string {
  return (de, ru) => (lang === 'ru' ? ru : de);
}

export function pick<T>(rng: Rng, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length) % items.length];
}

export function shuffle<T>(rng: Rng, items: readonly T[]): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Zahlendarstellung für Fragetexte in der aktiven Sprache. */
export function n(v: number, digits = 2, lang?: Lang): string {
  return v.toLocaleString(numberLocale(lang), { maximumFractionDigits: digits });
}

export function resolveQuestion(src: QuestionSource, rng: Rng, lang: Lang): Question {
  if ('generate' in src) return src.generate(rng, lang);
  const base = { id: src.id, difficulty: src.difficulty, prompt: src.prompt[lang], explanation: src.explanation[lang], hint: src.hint?.[lang] };
  switch (src.kind) {
    case 'mc':
      return { ...base, kind: 'mc', options: src.options.map((o) => o[lang]), answer: src.answer };
    case 'multi':
      return { ...base, kind: 'multi', options: src.options.map((o) => o[lang]), answers: src.answers };
    case 'numeric':
      return { ...base, kind: 'numeric', answer: src.answer, tolerance: src.tolerance, unit: src.unit[lang] };
  }
}

/** Gezogene Frage: Quelle + Seeds. Erst beim Anzeigen wird sie in der aktiven Sprache materialisiert. */
export interface QuestionRef {
  source: QuestionSource;
  seed: number;
  shuffleSeed: number;
}

export function materialize(ref: QuestionRef, lang: Lang): Question {
  return shuffleOptions(resolveQuestion(ref.source, seededRandom(ref.seed), lang), seededRandom(ref.shuffleSeed));
}

/** Prüft eine numerische Eingabe (deutsches oder englisches Dezimalformat). */
export function parseNumber(input: string): number | null {
  let cleaned = input.trim().replace(/[\s  ]/g, '');
  // „1.234,5“ → Punkt ist Tausendertrenner; sonst wird ein Komma als Dezimalzeichen gelesen.
  if (cleaned.includes(',') && cleaned.includes('.')) cleaned = cleaned.replace(/\./g, '');
  cleaned = cleaned.replace(',', '.');
  if (cleaned === '' || !/^[-+]?(\d+\.?\d*|\.\d+)(e[-+]?\d+)?$/i.test(cleaned)) return null;
  const v = Number(cleaned);
  return Number.isFinite(v) ? v : null;
}

export function isNumericCorrect(q: NumericQuestion, value: number): boolean {
  if (q.answer === 0) return Math.abs(value) <= q.tolerance;
  return Math.abs(value - q.answer) / Math.abs(q.answer) <= q.tolerance;
}

/**
 * Mischt die Antwortoptionen einer Auswahlfrage, damit die richtige Lösung nicht
 * an einer festen Position steht.
 */
export function shuffleOptions(q: Question, rng: Rng): Question {
  if (q.kind === 'numeric') return q;
  const order = shuffle(
    rng,
    q.options.map((_, i) => i),
  );
  const options = order.map((i) => q.options[i]);
  if (q.kind === 'mc') return { ...q, options, answer: order.indexOf(q.answer) };
  return { ...q, options, answers: q.answers.map((a) => order.indexOf(a)).sort((a, b) => a - b) };
}
