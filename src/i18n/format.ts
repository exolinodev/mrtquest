/**
 * Sprachzustand ohne React-Abhängigkeit, damit auch reine Module (Physik,
 * Fragengeneratoren) Zahlen in der aktiven Sprache formatieren können.
 */
export type Lang = 'de' | 'ru';

export const LANGS: Lang[] = ['de', 'ru'];

/** Zweisprachiger Text. */
export interface Loc {
  de: string;
  ru: string;
}

let current: Lang = 'de';

export function setFormatLang(lang: Lang): void {
  current = lang;
}

export function currentLang(): Lang {
  return current;
}

export function numberLocale(lang: Lang = current): string {
  return lang === 'ru' ? 'ru-RU' : 'de-DE';
}

/** Wählt die Übersetzung eines zweisprachigen Textes. */
export function loc(text: Loc, lang: Lang = current): string {
  return text[lang];
}
