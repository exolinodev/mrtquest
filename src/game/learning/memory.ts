import { CONCEPTS, conceptOf } from './concepts';

/** Gedächtnis eines Lern-Items (Leitner-System). */
export interface ItemMemory {
  /** 0 = neu/falsch, 1–5 = steigende Sicherheit */
  box: number;
  seen: number;
  correct: number;
  last: number;
  /** fällig ab (ms) */
  due: number;
  /** jüngste Ergebnisse, neuestes zuletzt (max. HISTORY) */
  history: boolean[];
}

export interface LearningState {
  items: Record<string, ItemMemory>;
  /** Items der zuletzt gestarteten Runde, damit die nächste Runde anders beginnt */
  lastRound: string[];
}

export const DAY = 24 * 60 * 60 * 1000;
/** Wiedervorlage je Box: sofort, 1, 3, 7, 16, 35 Tage */
export const BOX_INTERVAL_DAYS = [0, 1, 3, 7, 16, 35];
const HISTORY = 8;
/** Ab so vielen Antworten gilt ein Konzept als eingeschätzt */
export const MIN_EVIDENCE = 2;

export type Rating = 'again' | 'hard' | 'good';

export const emptyLearning = (): LearningState => ({ items: {}, lastRound: [] });

/** Neuer Gedächtniszustand nach einer Antwort bzw. Karteikarten-Bewertung. */
export function updateItem(prev: ItemMemory | undefined, result: boolean | Rating, now: number): ItemMemory {
  const rating: Rating = typeof result === 'boolean' ? (result ? 'good' : 'again') : result;
  const base = prev ?? { box: 0, seen: 0, correct: 0, last: 0, due: 0, history: [] };
  const ok = rating !== 'again';
  const box = rating === 'again' ? 1 : rating === 'hard' ? Math.max(1, base.box) : Math.min(5, base.box + 1);
  // Falsch beantwortete Items kommen in derselben Sitzung wieder (10 Minuten), sonst gemäß Box
  const wait = rating === 'again' ? 10 * 60 * 1000 : BOX_INTERVAL_DAYS[box] * DAY;
  return {
    box,
    seen: base.seen + 1,
    correct: base.correct + (ok ? 1 : 0),
    last: now,
    due: now + wait,
    history: [...base.history, ok].slice(-HISTORY),
  };
}

export const isDue = (m: ItemMemory | undefined, now: number) => !!m && m.due <= now;

/**
 * Behaltenswahrscheinlichkeit eines Items: Trefferquote der letzten Antworten
 * (neuere zählen doppelt so viel wie die ältesten), gedämpft durch die Vergessenskurve.
 */
export function itemStrength(m: ItemMemory, now: number): number {
  const n = m.history.length;
  if (!n) return 0;
  let sum = 0;
  let weight = 0;
  m.history.forEach((ok, i) => {
    const w = 1 + i / Math.max(1, n - 1);
    sum += ok ? w : 0;
    weight += w;
  });
  const accuracy = sum / weight;
  const stability = Math.max(1, BOX_INTERVAL_DAYS[m.box]) * 2 * DAY;
  const retention = Math.exp(-Math.max(0, now - m.last) / stability);
  return accuracy * (0.5 + 0.5 * retention);
}

export interface ConceptMastery {
  concept: string;
  /** 0..1, null = noch zu wenig Daten */
  mastery: number | null;
  answers: number;
  /** Anzahl fälliger Items */
  due: number;
  /** nächste Fälligkeit (ms) oder null */
  nextDue: number | null;
  /** Veränderung der letzten Antworten: +1 besser, -1 schlechter, 0 gleich/unklar */
  trend: -1 | 0 | 1;
}

export function conceptMastery(learning: LearningState, conceptId: string, now: number): ConceptMastery {
  const concept = CONCEPTS.find((c) => c.id === conceptId);
  const memories = (concept?.items ?? []).map((id) => learning.items[id]).filter((m): m is ItemMemory => !!m);
  const answers = memories.reduce((s, m) => s + m.seen, 0);
  const mastery = answers >= MIN_EVIDENCE ? memories.reduce((s, m) => s + itemStrength(m, now) * m.seen, 0) / answers : null;
  const recent = memories.flatMap((m) => m.history.map((ok, i) => ({ ok, t: m.last - (m.history.length - 1 - i) })));
  recent.sort((a, b) => a.t - b.t);
  const half = Math.floor(recent.length / 2);
  const rate = (xs: typeof recent) => (xs.length ? xs.filter((x) => x.ok).length / xs.length : 0);
  const delta = recent.length >= 4 ? rate(recent.slice(half)) - rate(recent.slice(0, half)) : 0;
  const dues = memories.map((m) => m.due);
  return {
    concept: conceptId,
    mastery,
    answers,
    due: memories.filter((m) => m.due <= now).length,
    nextDue: dues.length ? Math.min(...dues) : null,
    trend: delta > 0.15 ? 1 : delta < -0.15 ? -1 : 0,
  };
}

export type MasteryLevel = 'unknown' | 'weak' | 'shaky' | 'solid';

export function masteryLevel(mastery: number | null): MasteryLevel {
  if (mastery === null) return 'unknown';
  if (mastery < 0.5) return 'weak';
  if (mastery < 0.8) return 'shaky';
  return 'solid';
}

/** Konzepte eines Bereichs, schwächste zuerst; ungeübte gelten als mittel-schwach. */
export function weakestConcepts(learning: LearningState, conceptIds: string[], now: number): ConceptMastery[] {
  return conceptIds.map((id) => conceptMastery(learning, id, now)).sort((a, b) => (a.mastery ?? 0.55) - (b.mastery ?? 0.55));
}

/** Alle fälligen Items, die zu einem Konzept gehören. */
export function dueItems(learning: LearningState, now: number): string[] {
  return Object.entries(learning.items)
    .filter(([id, m]) => m.due <= now && conceptOf(id))
    .sort((a, b) => a[1].due - b[1].due)
    .map(([id]) => id);
}

/** Karteikarte „sitzt“: ab Box 3 (zweimal in Folge gut) oder nach altem Spielstand als gewusst markiert. */
export function isCardSolid(learning: LearningState, flags: Record<string, boolean>, cardId: string): boolean {
  return !!flags[`exq-${cardId}`] || (learning.items[`card:${cardId}`]?.box ?? 0) >= 3;
}
