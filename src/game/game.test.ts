import { describe, expect, it } from 'vitest';
import { MODULES } from '../content/modules';
import { drawChallenge, drawExam, QUESTION_BANK } from '../content/questions';
import { isNumericCorrect, materialize, parseNumber, resolveQuestion } from '../content/questions/types';
import { THEORY } from '../content/theory';
import { LANGS } from '../i18n/format';
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
    s = gameReducer(s, { type: 'COMPLETE_CHALLENGE', moduleId: 'prinzip', score: 1, bonusXp: 40 });
    expect(s.badges['erste-schritte']).toBeDefined();
    expect(s.badges['perfektionist']).toBeDefined();
    expect(s.badges['meister-prinzip']).toBeDefined();
  });
  it('Theorie-XP nur einmal', () => {
    let s = createInitialState(0);
    s = gameReducer(s, { type: 'READ_THEORY', moduleId: 'fourier' });
    const xp = s.xp;
    s = gameReducer(s, { type: 'READ_THEORY', moduleId: 'fourier' });
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

/** Buchstaben, die es im Ukrainischen, aber nicht im Russischen gibt (inkl. Apostroph ’). */
const UKRAINIAN_ONLY = /[іїєґІЇЄҐ’]/;

describe('Fragenkatalog', () => {
  it('jede Quelle liefert gültige Fragen in beiden Sprachen (inkl. Generatoren, viele Seeds)', () => {
    const cyrillic = /[\u0400-\u04FF]/;
    for (const id of Object.keys(QUESTION_BANK) as Array<keyof typeof QUESTION_BANK>) {
      for (const src of QUESTION_BANK[id]) {
        for (let seed = 1; seed < 30; seed++) {
          const [de, ru] = LANGS.map((lang) => resolveQuestion(src, seededRandom(seed), lang));
          for (const q of [de, ru]) {
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
          }
          // Gleicher Seed ⇒ gleiche Aufgabe in beiden Sprachen
          expect(ru.kind).toBe(de.kind);
          if (de.kind === 'numeric' && ru.kind === 'numeric') expect(ru.answer).toBe(de.answer);
          if (de.kind === 'mc' && ru.kind === 'mc') expect(ru.answer).toBe(de.answer);
          if (de.kind !== 'numeric' && ru.kind !== 'numeric') expect(ru.options.length).toBe(de.options.length);
          expect(cyrillic.test(ru.prompt), `ru-Text fehlt: ${src.id}`).toBe(true);
          for (const text of [ru.prompt, ru.explanation, ru.hint ?? '', ...(ru.kind === 'numeric' ? [ru.unit] : ru.options)]) {
            expect(UKRAINIAN_ONLY.test(text), `ukrainische Zeichen in ru-Text (${src.id}): ${text.slice(0, 80)}`).toBe(false);
          }
          expect(cyrillic.test(de.prompt), `de-Text enthält Kyrillisch: ${src.id}`).toBe(false);
          if (!('generate' in src)) break;
        }
      }
    }
  });
  it('Challenges und Prüfung haben die richtige Länge ohne Duplikate', () => {
    for (const m of MODULES) {
      const refs = drawChallenge(m.id, seededRandom(5));
      expect(refs).toHaveLength(8);
      expect(new Set(refs.map((r) => r.source.id)).size).toBe(8);
      // Sprachwechsel ändert weder Optionsreihenfolge noch Lösung
      for (const ref of refs) {
        const de = materialize(ref, 'de');
        const ru = materialize(ref, 'ru');
        if (de.kind === 'mc' && ru.kind === 'mc') expect(ru.answer).toBe(de.answer);
        if (de.kind === 'multi' && ru.kind === 'multi') expect(ru.answers).toEqual(de.answers);
      }
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
    it(`„${sc.title.de}“ ist lösbar und startet ungelöst`, () => {
      const startEval = evaluateScenario(sc, sc.start, computeMetrics(sc.start, ANATOMY[sc.anatomy]));
      expect(startEval.passed).toBe(false);
      const p: Protocol = { ...sc.start, ...SOLUTIONS[sc.id] };
      const ev = evaluateScenario(sc, p, computeMetrics(p, ANATOMY[sc.anatomy]));
      const failed = ev.results.filter((r) => r.req.hard && !r.ok).map((r) => r.req.label.de);
      expect(failed).toEqual([]);
      expect(ev.stars).toBeGreaterThanOrEqual(1);
    });
  }
});

describe('Theorie zweisprachig (DE/RU)', () => {
  it('russische Kapitel haben dieselbe Struktur wie die deutschen', () => {
    for (const m of MODULES) {
      const de = THEORY.de[m.id];
      const ru = THEORY.ru[m.id];
      expect(ru.length).toBe(de.length);
      de.forEach((sec, i) => {
        expect(ru[i].blocks.map((b) => b.type)).toEqual(sec.blocks.map((b) => b.type));
        expect(/[\u0400-\u04FF]/.test(ru[i].title)).toBe(true);
        expect(UKRAINIAN_ONLY.test(JSON.stringify(ru[i])), `ukrainische Zeichen in Theorie ${m.id}/${i}`).toBe(false);
      });
    }
  });
});

describe('Migration', () => {
  it('überträgt Fortschritt der früheren Module auf die Kapitel des Skripts', async () => {
    const { migrateModules } = await import('./reducer');
    const p = (bestScore: number, attempts: number, theoryRead: boolean) => ({ bestScore, attempts, perfect: false, theoryRead, xpEarned: 10 });
    const m = migrateModules({ kernspin: p(0.5, 1, true), relaxation: p(0.9, 2, false), hardware: p(0.3, 1, false), anwendungen: p(0.7, 1, true) });
    expect(m.prinzip).toEqual({ bestScore: 0.9, attempts: 3, perfect: false, theoryRead: true, xpEarned: 20 });
    expect(m.bild?.bestScore).toBe(0.3);
    expect(m.anwendungen?.bestScore).toBe(0.7);
    expect(m.kernspin).toBeUndefined();
  });
});
