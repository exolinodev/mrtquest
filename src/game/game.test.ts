import { describe, expect, it } from 'vitest';
import { MODULES } from '../content/modules';
import { drawChallenge, drawExam, QUESTION_BANK } from '../content/questions';
import { isNumericCorrect, parseNumber, resolveQuestion } from '../content/questions/types';
import { evaluateScenario, SCENARIOS } from '../content/scenarios';
import { seededRandom } from '../physics/phantom';
import { ANATOMY, computeMetrics, type Protocol } from '../physics/protocol';
import { answerXp, levelFromXp, levelProgress, xpForLevel } from './levels';
import { createInitialState, gameReducer, loadState, saveState } from './reducer';

describe('Level-System', () => {
  it('Schwellen steigen quadratisch', () => {
    expect([1, 2, 3, 4, 5].map(xpForLevel)).toEqual([0, 100, 300, 600, 1000]);
    expect(levelFromXp(0)).toBe(1);
    expect(levelFromXp(99)).toBe(1);
    expect(levelFromXp(100)).toBe(2);
    expect(levelFromXp(4500)).toBe(10);
  });
  it('Fortschritt innerhalb eines Levels', () => {
    const p = levelProgress(200);
    expect(p.level).toBe(2);
    expect(p.ratio).toBeCloseTo(0.5, 6);
  });
  it('Combo, Hinweis und Wiederholung beeinflussen XP', () => {
    expect(answerXp(1, 1, false, false)).toBe(10);
    expect(answerXp(3, 6, false, false)).toBe(38);
    expect(answerXp(2, 1, true, false)).toBe(8);
    expect(answerXp(2, 1, false, true)).toBe(8);
  });
});

describe('Reducer & Abzeichen', () => {
  it('vergibt XP und Serien', () => {
    let s = createInitialState(0);
    for (let i = 0; i < 5; i++) s = gameReducer(s, { type: 'ANSWER', correct: true, xp: 10, hintUsed: false });
    expect(s.stats.bestStreak).toBe(5);
    expect(s.badges['combo-5']).toBeDefined();
    expect(s.xp).toBe(50 + 20); // inkl. Abzeichen-Bonus
    s = gameReducer(s, { type: 'ANSWER', correct: false, xp: 0, hintUsed: false });
    expect(s.stats.streak).toBe(0);
  });
  it('Challenge-Abschluss schaltet Abzeichen frei', () => {
    let s = createInitialState(0);
    s = gameReducer(s, { type: 'COMPLETE_CHALLENGE', moduleId: 'kernspin', score: 1, bonusXp: 40 });
    expect(s.badges['erste-schritte']).toBeDefined();
    expect(s.badges['perfektionist']).toBeDefined();
    expect(s.badges['meister-kernspin']).toBeDefined();
  });
  it('Theorie-XP nur einmal', () => {
    let s = createInitialState(0);
    s = gameReducer(s, { type: 'READ_THEORY', moduleId: 'kraum' });
    const xp = s.xp;
    s = gameReducer(s, { type: 'READ_THEORY', moduleId: 'kraum' });
    expect(s.xp).toBe(xp);
  });
  it('Szenario speichert die besten Sterne', () => {
    let s = createInitialState(0);
    s = gameReducer(s, { type: 'SCENARIO_RESULT', scenarioId: 'ms-flair', stars: 3, xp: 120 });
    s = gameReducer(s, { type: 'SCENARIO_RESULT', scenarioId: 'ms-flair', stars: 1, xp: 0 });
    expect(s.scenarios['ms-flair'].stars).toBe(3);
    expect(s.scenarios['ms-flair'].attempts).toBe(2);
  });
  it('Persistenz: Speichern und Laden, defekte Daten werden ignoriert', () => {
    const mem = new Map<string, string>();
    const storage = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    let s = createInitialState(0);
    s = gameReducer(s, { type: 'ANSWER', correct: true, xp: 25, hintUsed: false });
    saveState(s, storage);
    expect(loadState(storage).xp).toBe(25);
    mem.set('mrt-quest:v1', '{kaputt');
    expect(loadState(storage).xp).toBe(0);
    mem.set('mrt-quest:v1', JSON.stringify({ version: 1, xp: -5 }));
    expect(loadState(storage).xp).toBe(0);
  });
});

describe('Fragenkatalog', () => {
  it('jede Quelle liefert gültige Fragen (inkl. Generatoren, viele Seeds)', () => {
    for (const id of Object.keys(QUESTION_BANK) as Array<keyof typeof QUESTION_BANK>) {
      for (const src of QUESTION_BANK[id]) {
        for (let seed = 1; seed < 30; seed++) {
          const q = resolveQuestion(src, seededRandom(seed));
          expect(q.prompt.length).toBeGreaterThan(10);
          expect(q.explanation.length).toBeGreaterThan(10);
          if (q.kind === 'numeric') {
            expect(Number.isFinite(q.answer)).toBe(true);
            expect(isNumericCorrect(q, q.answer)).toBe(true);
          } else if (q.kind === 'mc') {
            expect(q.answer).toBeGreaterThanOrEqual(0);
            expect(q.answer).toBeLessThan(q.options.length);
          } else {
            expect(q.answers.every((a) => a >= 0 && a < q.options.length)).toBe(true);
          }
          if (!('generate' in src)) break;
        }
      }
    }
  });
  it('Challenges und Prüfung haben die richtige Länge ohne Duplikate', () => {
    for (const m of MODULES) {
      const qs = drawChallenge(m.id, seededRandom(5));
      expect(qs).toHaveLength(8);
      expect(new Set(qs.map((q) => q.id)).size).toBe(8);
    }
    expect(drawExam(seededRandom(9))).toHaveLength(21);
  });
  it('Zahleneingabe akzeptiert deutsches und englisches Format', () => {
    expect(parseNumber('63,87')).toBe(63.87);
    expect(parseNumber('63.87')).toBe(63.87);
    expect(parseNumber('0,125')).toBe(0.125);
    expect(parseNumber('1.234,5')).toBe(1234.5);
    expect(parseNumber('abc')).toBeNull();
    expect(parseNumber('')).toBeNull();
  });
});

/** Musterlösungen: Beweis, dass jedes Szenario lösbar ist. */
const SOLUTIONS: Record<string, Partial<Protocol>> = {
  'ms-flair': { ti: 2370 },
  'claustro-brain': { nex: 1, etl: 16, matrixPhase: 256, matrixRead: 256 },
  'knee-stir-3t': { ti: 255, refocusFlip: 120, tr: 3500, matrixRead: 288, matrixPhase: 320 },
  'liver-breathhold': { sequence: 'GRE', tr: 220, te: 4.6, flip: 70, matrixPhase: 160, fovPhase: 380, acceleration: 2 },
  'stroke-dwi': { acceleration: 3, matrixPhase: 96, bandwidthPerPixel: 2000, fatSat: true, te: 70, field: 1.5 },
  'implant-spine': { field: 1.5, refocusFlip: 150, tr: 3000, etl: 20 },
};

describe('Klinische Szenarien', () => {
  for (const sc of SCENARIOS) {
    it(`„${sc.title}“ ist lösbar und startet ungelöst`, () => {
      const startEval = evaluateScenario(sc, sc.start, computeMetrics(sc.start, ANATOMY[sc.anatomy]));
      expect(startEval.passed).toBe(false);
      const p: Protocol = { ...sc.start, ...SOLUTIONS[sc.id] };
      const ev = evaluateScenario(sc, p, computeMetrics(p, ANATOMY[sc.anatomy]));
      const failed = ev.results.filter((r) => r.req.hard && !r.ok).map((r) => r.req.label);
      expect(failed).toEqual([]);
      expect(ev.stars).toBeGreaterThanOrEqual(1);
    });
  }
});
