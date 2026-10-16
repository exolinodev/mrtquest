/**
 * Fragetypen der Challenges. Texte unterstützen Inline-Formeln in $…$ (KaTeX).
 */
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

export type Question = SingleChoiceQuestion | MultiChoiceQuestion | NumericQuestion;

export type Rng = () => number;

/** Entweder eine feste Frage oder ein Generator für parametrisierte Rechen-Puzzles. */
export type QuestionSource = Question | { generate: (rng: Rng) => Question; id: string };

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

/** Deutsche Zahlendarstellung für Fragetexte. */
export function n(v: number, digits = 2): string {
  return v.toLocaleString('de-DE', { maximumFractionDigits: digits });
}

export function resolveQuestion(src: QuestionSource, rng: Rng): Question {
  return 'generate' in src ? src.generate(rng) : src;
}

/** Prüft eine numerische Eingabe (deutsches oder englisches Dezimalformat). */
export function parseNumber(input: string): number | null {
  let cleaned = input.trim().replace(/\s/g, '');
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
