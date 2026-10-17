/**
 * Theorie-Kapitel der Module. Texte unterstützen **fett** und Inline-Formeln in $…$.
 * Die Kapitel liegen je Modul in ./chapters und folgen dem Erklärformat
 * hook → analogy → Text und Formel → mnemonic → exam/pitfall.
 */
import type { Lang } from '../i18n/format';
import type { ModuleId } from './modules';
import { CHAPTERS } from './chapters';

export type TheoryBlock =
  /** Einstieg: worum es geht und warum es sich lohnt */
  | { type: 'hook'; text: string }
  /** Alltagsbild, das die Physik greifbar macht */
  | { type: 'analogy'; title: string; text: string }
  /** Merksatz oder Eselsbrücke */
  | { type: 'mnemonic'; text: string }
  /** Typische Prüfungsfrage mit Musterantwort; sim ist ein Pfad unter /labor, z. B. 'signal/spectrum' */
  | { type: 'exam'; question: string; answer: string; full?: string; sim?: string }
  /** Schematische Abbildung aus src/components/figures (id), mit Bildunterschrift */
  | { type: 'figure'; id: string; caption: string }
  /** Häufige Denkfehler */
  | { type: 'pitfall'; items: string[] }
  | { type: 'p'; text: string }
  | { type: 'formula'; tex: string; caption?: string }
  | { type: 'list'; items: string[]; ordered?: boolean }
  | { type: 'callout'; variant: 'merke' | 'klinik' | 'vertiefung' | 'achtung'; title: string; text: string }
  | { type: 'table'; head: string[]; rows: string[][] };

export interface TheorySection {
  title: string;
  blocks: TheoryBlock[];
}

const pick = (lang: Lang): Record<ModuleId, TheorySection[]> =>
  Object.fromEntries(Object.entries(CHAPTERS).map(([id, chapter]) => [id, chapter[lang]])) as Record<ModuleId, TheorySection[]>;

export const THEORY: Record<Lang, Record<ModuleId, TheorySection[]>> = { de: pick('de'), ru: pick('ru') };
