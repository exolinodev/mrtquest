import { describe, expect, it } from 'vitest';
import { completionBonus, requiredCorrect } from './challenge';
import { parseNumber } from '../content/questions/types';

describe('Challenge-Ziele und angezeigte Belohnungen', () => {
  it('zeigt die tatsächlich erreichbare Anzahl richtiger Antworten', () => {
    expect(requiredCorrect(8)).toBe(7);
    expect(requiredCorrect(21)).toBe(17);
    expect(requiredCorrect(8, 0.6)).toBe(5);
    expect(completionBonus(6 / 8, { type: 'module', moduleId: 'hardware' }, false)).toBe(10);
    expect(completionBonus(7 / 8, { type: 'module', moduleId: 'hardware' }, false)).toBe(25);
    expect(completionBonus(8 / 8, { type: 'module', moduleId: 'hardware' }, false)).toBe(40);
  });
  it('beachtet Bestehensgrenze und gerundete Wiederholungsboni', () => {
    expect(completionBonus(16 / 21, { type: 'exam' }, false)).toBe(60);
    expect(completionBonus(17 / 21, { type: 'exam' }, false)).toBe(150);
    expect(completionBonus(7 / 8, { type: 'module', moduleId: 'hardware' }, true)).toBe(13);
    expect(completionBonus(1, { type: 'exam' }, true)).toBe(75);
  });
  it('liest gemischte deutsche und englische Zahlentrennzeichen korrekt', () => {
    expect(parseNumber('1.234,5')).toBe(1234.5);
    expect(parseNumber('1,234.5')).toBe(1234.5);
    expect(parseNumber('1 234,5')).toBe(1234.5);
    expect(parseNumber('1,2e3')).toBe(1200);
    expect(parseNumber('1,2.3.4')).toBeNull();
  });
});
