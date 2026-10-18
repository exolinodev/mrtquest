import { describe, expect, it } from 'vitest';
import { CHAPTERS } from '../../content/chapters';
import { EXAM_QUESTIONS, RECAP_QUESTIONS } from '../../content/examPrep';
import { ALL_QUESTIONS, drawChallenge, QUESTION_BANK } from '../../content/questions';
import { seededRandom } from '../../physics/phantom';
import { createInitialState, gameReducer, loadState } from '../reducer';
import { CONCEPTS, conceptOf } from './concepts';
import { conceptMastery, DAY, emptyLearning, masteryLevel, updateItem, type LearningState } from './memory';
import { drawAdaptive, followUpQuestion } from './select';

const NOW = Date.UTC(2026, 9, 18, 12);

describe('Konzeptkarte', () => {
  it('ordnet jede Frage, Karteikarte und Kontrollfrage genau einem Konzept zu', () => {
    const items = [...ALL_QUESTIONS.map((q) => q.id), ...EXAM_QUESTIONS.map((q) => `card:${q.id}`), ...RECAP_QUESTIONS.map((q) => `recap:${q.id}`)];
    expect(items.filter((id) => !conceptOf(id))).toEqual([]);
    const all = CONCEPTS.flatMap((c) => c.items);
    expect(new Set(all).size).toBe(all.length);
    expect(all.filter((id) => !items.includes(id))).toEqual([]);
  });

  it('verweist auf existierende Kapitelabschnitte', () => {
    for (const c of CONCEPTS) expect(c.section, c.id).toBeLessThan(CHAPTERS[c.module].de.length);
  });
});

describe('Lerngedächtnis', () => {
  it('steigt bei richtigen Antworten Box für Box und fällt bei Fehlern zurück', () => {
    let m = updateItem(undefined, true, NOW);
    expect(m.box).toBe(1);
    expect(m.due).toBe(NOW + DAY);
    m = updateItem(m, true, NOW);
    m = updateItem(m, true, NOW);
    expect(m.box).toBe(3);
    expect(m.due).toBe(NOW + 7 * DAY);
    m = updateItem(m, false, NOW);
    expect(m.box).toBe(1);
    expect(m.due - NOW).toBeLessThan(DAY);
    expect(updateItem(m, 'hard', NOW).box).toBe(1);
  });

  it('Beherrschung steigt mit Treffern, fällt mit Fehlern und verblasst mit der Zeit', () => {
    const answer = (learning: LearningState, ids: string[], ok: boolean, t = NOW): LearningState => ({
      ...learning,
      items: Object.fromEntries([...Object.entries(learning.items), ...ids.map((id) => [id, updateItem(learning.items[id], ok, t)] as const)]),
    });
    const ids = ['ks-larmor-h', 'ks-larmor-x', 'ks-double'];
    let good = emptyLearning();
    for (let i = 0; i < 3; i++) good = answer(good, ids, true);
    let bad = emptyLearning();
    for (let i = 0; i < 3; i++) bad = answer(bad, ids, false);
    const g = conceptMastery(good, 'larmor', NOW).mastery!;
    const b = conceptMastery(bad, 'larmor', NOW).mastery!;
    expect(g).toBeGreaterThan(0.8);
    expect(b).toBeLessThan(0.2);
    expect(masteryLevel(g)).toBe('solid');
    expect(masteryLevel(b)).toBe('weak');
    expect(conceptMastery(good, 'larmor', NOW + 120 * DAY).mastery!).toBeLessThan(g);
    expect(conceptMastery(emptyLearning(), 'larmor', NOW).mastery).toBeNull();
  });
});

describe('Adaptive Auswahl', () => {
  it('zwei Runden hintereinander unterscheiden sich und die letzte Runde wird gemieden', () => {
    const pool = QUESTION_BANK.prinzip;
    const first = drawAdaptive(pool, seededRandom(1), { learning: emptyLearning(), now: NOW, count: 8 }).map((q) => q.id);
    const second = drawAdaptive(pool, seededRandom(2), { learning: { items: {}, lastRound: first }, now: NOW, count: 8 }).map((q) => q.id);
    expect(second.filter((id) => first.includes(id))).toEqual([]);
    expect(new Set(first).size).toBe(8);
  });

  it('nimmt fällige Wiederholungen bevorzugt in die Runde', () => {
    const learning = emptyLearning();
    for (const id of ['rx-mz', 'rx-mxy', 'ks-why-h']) learning.items[id] = { ...updateItem(undefined, true, NOW - 3 * DAY) };
    const round = drawAdaptive(QUESTION_BANK.prinzip, seededRandom(5), { learning, now: NOW, count: 8 }).map((q) => q.id);
    expect(round).toEqual(expect.arrayContaining(['rx-mz', 'rx-mxy', 'ks-why-h']));
  });

  it('erkennt eine Schwäche und übt sie überdurchschnittlich oft (Simulation)', () => {
    let state = createInitialState(NOW);
    const weakConcept = 't2';
    let t = NOW;
    let weakShare = 0;
    for (let round = 0; round < 6; round++) {
      const refs = drawChallenge('prinzip', seededRandom(100 + round), 8, state.learning, t);
      if (round >= 3) weakShare += refs.filter((r) => conceptOf(r.source.id) === weakConcept).length / refs.length;
      state = gameReducer(state, { type: 'START_ROUND', itemIds: refs.map((r) => r.source.id) });
      for (const r of refs) {
        const correct = conceptOf(r.source.id) !== weakConcept;
        state = gameReducer(state, { type: 'ANSWER', correct, xp: 0, hintUsed: false, questionId: r.source.id, now: t });
      }
      t += DAY / 4;
    }
    expect(masteryLevel(conceptMastery(state.learning, weakConcept, t).mastery)).toBe('weak');
    const baseShare = CONCEPTS.find((c) => c.id === weakConcept)!.items.filter((id) => QUESTION_BANK.prinzip.some((q) => q.id === id)).length / QUESTION_BANK.prinzip.length;
    expect(weakShare / 3).toBeGreaterThan(baseShare * 1.5);
  });

  it('liefert eine Nachhak-Frage zum selben Konzept', () => {
    const q = followUpQuestion(QUESTION_BANK.prinzip, 'larmor', ['ks-larmor-h'], seededRandom(3));
    expect(q && conceptOf(q.id)).toBe('larmor');
    expect(q?.id).not.toBe('ks-larmor-h');
  });
});

describe('Spielstand', () => {
  it('lädt alte Spielstände ohne Lerngedächtnis und speichert Antworten mit Frage-ID', () => {
    const old = JSON.stringify({ version: 1, xp: 50, modules: {}, flags: {} });
    const state = loadState({ getItem: () => old });
    expect(state.learning).toEqual(emptyLearning());
    const next = gameReducer(state, { type: 'ANSWER', correct: false, xp: 0, hintUsed: false, questionId: 'ks-why-h', now: NOW });
    expect(next.learning.items['ks-why-h'].seen).toBe(1);
    const rated = gameReducer(next, { type: 'RATE_CARD', itemId: 'card:dti', rating: 'good', now: NOW });
    expect(rated.learning.items['card:dti'].box).toBe(1);
  });
});
