import { shuffle, type QuestionRef, type QuestionSource, type Rng } from '../../content/questions/types';
import { CONCEPT_BY_ID, conceptOf } from './concepts';
import { conceptMastery, type LearningState } from './memory';

/** Echter Zufallsstartwert, damit keine zwei Runden gleich beginnen. */
export function randomSeed(): number {
  const buf = new Uint32Array(1);
  globalThis.crypto?.getRandomValues?.(buf);
  return (buf[0] ^ Date.now()) >>> 0;
}

const seedFrom = (rng: Rng) => Math.floor(rng() * 0xffffffff);
export const toRef = (source: QuestionSource, rng: Rng): QuestionRef => ({ source, seed: seedFrom(rng), shuffleSeed: seedFrom(rng) });

const isGenerator = (q: QuestionSource) => 'generate' in q;
const difficultyOf = (q: QuestionSource) => ('difficulty' in q ? q.difficulty : 2);

export interface AdaptiveOptions {
  learning: LearningState;
  now: number;
  count: number;
  /** nur Fragen dieser Konzepte (z. B. gezieltes Üben) */
  concepts?: string[];
}

/** Anteile einer Runde: fällige Wiederholungen, Schwächen, Neues; der Rest füllt auf. */
const QUOTA = { due: 0.4, weak: 0.35, fresh: 0.25 };

/**
 * Stellt eine adaptive Runde zusammen.
 * - fällige Wiederholungen zuerst, dann Fragen aus den schwächsten Konzepten, dann Ungesehenes
 * - Fragen der letzten Runde nur, wenn der Pool sonst nicht reicht
 * - bei schwachen Konzepten leichtere Fragen zuerst, bei sicheren schwerere
 * - Rechenaufgaben erzeugen bei jedem Ziehen neue Zahlen
 */
export function drawAdaptive(pool: QuestionSource[], rng: Rng, opts: AdaptiveOptions): QuestionSource[] {
  const { learning, now, count } = opts;
  const unique = [...new Map(pool.map((q) => [q.id, q])).values()].filter((q) => !opts.concepts || opts.concepts.includes(conceptOf(q.id) ?? ''));
  const last = new Set(learning.lastRound);
  const masteryCache = new Map<string, number | null>();
  const mastery = (q: QuestionSource) => {
    const c = conceptOf(q.id);
    if (!c) return null;
    if (!masteryCache.has(c)) masteryCache.set(c, conceptMastery(learning, c, now).mastery);
    return masteryCache.get(c)!;
  };

  const fresh = shuffle(rng, unique.filter((q) => !learning.items[q.id]));
  const due = shuffle(rng, unique.filter((q) => learning.items[q.id] && learning.items[q.id].due <= now)).sort((a, b) => learning.items[a.id].due - learning.items[b.id].due);
  const weak = shuffle(
    rng,
    unique.filter((q) => {
      const m = mastery(q);
      return learning.items[q.id] && m !== null && m < 0.8;
    }),
  ).sort((a, b) => (mastery(a) ?? 1) - (mastery(b) ?? 1) || difficultyOf(a) - difficultyOf(b));

  const chosen: QuestionSource[] = [];
  const take = (list: QuestionSource[], n: number, allowLast = false) => {
    for (const q of list) {
      if (chosen.length >= count || n <= 0) break;
      if (chosen.includes(q) || (!allowLast && last.has(q.id))) continue;
      chosen.push(q);
      n--;
    }
  };
  take(due, Math.round(count * QUOTA.due));
  take(weak, Math.round(count * QUOTA.weak));
  take(fresh, count - chosen.length);
  // Auffüllen: erst alles außer der letzten Runde, notfalls auch die letzte Runde
  const rest = shuffle(rng, unique).sort((a, b) => (mastery(a) ?? 0.55) - (mastery(b) ?? 0.55));
  take(rest, count - chosen.length);
  take(shuffle(rng, unique), count - chosen.length, true);

  // Sichere Konzepte bekommen schwere, unsichere leichte Fragen zuerst
  return shuffle(rng, chosen).sort((a, b) => {
    const ma = mastery(a) ?? 0.55;
    const mb = mastery(b) ?? 0.55;
    return ma < 0.5 && mb < 0.5 ? difficultyOf(a) - difficultyOf(b) : 0;
  });
}

/** Nachhak-Frage zu einem Konzept: bevorzugt eine noch nicht gestellte Frage, sonst eine Rechenaufgabe mit neuen Zahlen. */
export function followUpQuestion(pool: QuestionSource[], conceptId: string, askedIds: string[], rng: Rng): QuestionSource | undefined {
  const same = pool.filter((q) => conceptOf(q.id) === conceptId);
  const unasked = shuffle(rng, same.filter((q) => !askedIds.includes(q.id)));
  if (unasked.length) return unasked[0];
  return shuffle(rng, same.filter(isGenerator))[0];
}

/** Konzepte mit dem größten Übungsbedarf innerhalb eines Pools, für die Anzeige „Fokus dieser Runde“. */
export function focusConcepts(pool: QuestionSource[], learning: LearningState, now: number, n = 2): string[] {
  const ids = [...new Set(pool.map((q) => conceptOf(q.id)).filter((c): c is string => !!c && !!CONCEPT_BY_ID[c]))];
  return ids
    .map((id) => conceptMastery(learning, id, now))
    .filter((c) => c.mastery !== null && c.mastery < 0.8)
    .sort((a, b) => (a.mastery ?? 1) - (b.mastery ?? 1))
    .slice(0, n)
    .map((c) => c.concept);
}
