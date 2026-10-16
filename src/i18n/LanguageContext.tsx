import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { loc as pickLoc, setFormatLang, type Lang, type Loc } from './format';

const STORAGE_KEY = 'mrt-quest:lang';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  /** Inline-Übersetzung: tr('Deutsch', 'Українська') */
  tr: (de: string, uk: string) => string;
  /** Übersetzung eines zweisprachigen Datensatzes */
  loc: (text: Loc) => string;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function initialLang(): Lang {
  try {
    const stored = globalThis.localStorage?.getItem(STORAGE_KEY);
    if (stored === 'de' || stored === 'uk') return stored;
  } catch {
    // Speicher nicht verfügbar – Standardsprache verwenden
  }
  return globalThis.navigator?.language?.toLowerCase().startsWith('uk') ? 'uk' : 'de';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const l = initialLang();
    setFormatLang(l);
    return l;
  });

  const setLang = useCallback((next: Lang) => {
    setFormatLang(next);
    setLangState(next);
  }, []);

  const toggle = useCallback(() => setLang(lang === 'de' ? 'uk' : 'de'), [lang, setLang]);

  useEffect(() => {
    try {
      globalThis.localStorage?.setItem(STORAGE_KEY, lang);
    } catch {
      // ignorieren
    }
    document.documentElement.lang = lang;
    document.title = lang === 'uk' ? 'MRT-Quest · Фізика МРТ у грі' : 'MRT-Quest · MRT-Physik spielerisch meistern';
  }, [lang]);

  // Schnellumschaltung per Tastatur: Alt+L
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.code === 'KeyL') {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [toggle]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang,
      toggle,
      tr: (de, uk) => (lang === 'uk' ? uk : de),
      loc: (text) => pickLoc(text, lang),
    }),
    [lang, setLang, toggle],
  );
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLang muss innerhalb von <LanguageProvider> verwendet werden');
  return ctx;
}
