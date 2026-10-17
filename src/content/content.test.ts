import { describe, expect, it } from 'vitest';
import { ALL_SIMULATORS, EXAM_MODULES, MODULES } from './modules';
import { CHAPTERS } from './chapters';
import { THEORY, type TheoryBlock } from './theory';
import { SIM_GUIDES } from './simGuides';
import { CHEAT_SHEET, EXAM_QUESTIONS, LAB3_STEPS, OBJECTIVES, RECAP_QUESTIONS } from './examPrep';

const LANGS = ['de', 'ru'] as const;

/** Sammelt allen sichtbaren Text eines Werts (Strings in beliebig verschachtelten Objekten). */
function texts(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(texts);
  if (value && typeof value === 'object') return Object.values(value).flatMap(texts);
  return [];
}

const countBlocks = (blocks: TheoryBlock[], type: TheoryBlock['type']) => blocks.filter((b) => b.type === type).length;

describe('Kapitel im Erklärformat', () => {
  it('jedes Modul hat ein neues Kapitel in beiden Sprachen mit gleicher Struktur', () => {
    for (const m of MODULES) {
      const chapter = CHAPTERS[m.id];
      expect(chapter, m.id).toBeDefined();
      expect(chapter!.de.length, m.id).toBeGreaterThanOrEqual(4);
      expect(chapter!.ru.map((s) => s.blocks.map((b) => b.type)), m.id).toEqual(chapter!.de.map((s) => s.blocks.map((b) => b.type)));
      for (const lang of LANGS) expect(THEORY[lang][m.id], `${m.id}/${lang}`).toBe(chapter![lang]);
    }
  });

  it('Prüfungsmodule enthalten Einstieg, Analogien, Merksätze und Prüfungsfragen', () => {
    for (const m of EXAM_MODULES) {
      for (const lang of LANGS) {
        const sections = CHAPTERS[m.id]![lang];
        const blocks = sections.flatMap((s) => s.blocks);
        expect(countBlocks(blocks, 'hook'), `${m.id}/${lang} hook`).toBeGreaterThanOrEqual(1);
        expect(countBlocks(blocks, 'analogy'), `${m.id}/${lang} analogy`).toBeGreaterThanOrEqual(2);
        expect(countBlocks(blocks, 'exam'), `${m.id}/${lang} exam`).toBeGreaterThanOrEqual(3);
        for (const s of sections) expect(countBlocks(s.blocks, 'mnemonic'), `${m.id}/${lang}: ${s.title}`).toBeGreaterThanOrEqual(1);
      }
    }
  });

  it('Prüfungsfragen verlinken nur existierende Simulatoren', () => {
    for (const m of MODULES) {
      for (const b of CHAPTERS[m.id]!.de.flatMap((s) => s.blocks)) {
        if (b.type === 'exam' && b.sim) expect(ALL_SIMULATORS, `${m.id}: ${b.sim}`).toContain(b.sim.split('/')[0]);
      }
    }
  });
});

describe('Simulator-Anleitungen', () => {
  it('jeder Simulator hat Intro, drei Mini-Experimente und eine Kernaussage', () => {
    for (const id of ALL_SIMULATORS) {
      const guide = SIM_GUIDES[id];
      expect(guide, id).toBeDefined();
      expect(guide!.steps, id).toHaveLength(3);
      for (const text of texts(guide)) expect(text.trim().length, id).toBeGreaterThan(0);
    }
  });
});

describe('Prüfungszentrale', () => {
  it('enthält die vier Lernziele und die fünf Kontrollfragen des Skripts', () => {
    expect(OBJECTIVES.map((o) => o.id)).toEqual(['prinzip', 'bild', 'technik', 'anwendung']);
    expect(RECAP_QUESTIONS).toHaveLength(5);
    for (const q of RECAP_QUESTIONS) expect(q.steps.length, q.id).toBeGreaterThanOrEqual(3);
  });

  it('hat genug antizipierte Fragen für jedes Lernziel und eindeutige IDs', () => {
    expect(EXAM_QUESTIONS.length).toBeGreaterThanOrEqual(24);
    expect(new Set(EXAM_QUESTIONS.map((q) => q.id)).size).toBe(EXAM_QUESTIONS.length);
    for (const o of OBJECTIVES) expect(EXAM_QUESTIONS.filter((q) => q.objective === o.id).length, o.id).toBeGreaterThanOrEqual(4);
  });

  it('hat Spickzettel und die drei Schritte von Lab 3', () => {
    expect(CHEAT_SHEET.length).toBeGreaterThanOrEqual(5);
    expect(LAB3_STEPS).toHaveLength(3);
  });
});

describe('Sprache', () => {
  const visible = [CHAPTERS, SIM_GUIDES, OBJECTIVES, RECAP_QUESTIONS, EXAM_QUESTIONS, CHEAT_SHEET, LAB3_STEPS].flatMap(texts);

  it('verweist nicht auf Seitenzahlen oder Foliennummern', () => {
    const offenders = visible.filter((t) => /\b(Folie|Seite|S\.)\s*\d|MBR\s*\d|PDF\s*\d|слайд\w*\s*\d|страниц\w*\s*\d/i.test(t));
    expect(offenders).toEqual([]);
  });

  it('verwendet keine Gedankenstriche als Stilmittel', () => {
    const offenders = visible.filter((t) => /\s[—–]\s/.test(t));
    expect(offenders).toEqual([]);
  });
});

describe('Formeln', () => {
  it('alle Formeln aus Kapiteln, Spickzettel und Inline-Text rendern ohne KaTeX-Fehler', async () => {
    const katex = (await import('katex')).default;
    const blocks = MODULES.flatMap((m) => LANGS.flatMap((lang) => CHAPTERS[m.id][lang].flatMap((s) => s.blocks)));
    const display = [...blocks.flatMap((b) => (b.type === 'formula' ? [b.tex] : [])), ...CHEAT_SHEET.flatMap((s) => s.items.flatMap((i) => (i.tex ? [i.tex] : [])))];
    const inline = [CHAPTERS, SIM_GUIDES, RECAP_QUESTIONS, EXAM_QUESTIONS, CHEAT_SHEET, LAB3_STEPS].flatMap(texts).flatMap((t) => [...t.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]));
    const broken = [...display, ...inline].filter((tex) => {
      try {
        katex.renderToString(tex, { throwOnError: true, displayMode: true });
        return false;
      } catch {
        return true;
      }
    });
    expect(broken).toEqual([]);
  });
});
