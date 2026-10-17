import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import { useLang } from '../i18n/LanguageContext';
import { BADGE_BY_ID } from './badges';
import { levelFromXp, levelTitle } from './levels';
import { gameReducer, loadState, saveState, todayKey } from './reducer';
import type { GameAction, GameState, Toast } from './types';

interface GameContextValue {
  state: GameState;
  dispatch: (action: GameAction) => void;
  toasts: Toast[];
  dismissToast: (id: number) => void;
  notify: (toast: Omit<Toast, 'id'>) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

let toastCounter = 0;

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, rawDispatch] = useReducer(gameReducer, undefined, () => loadState());
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { lang, tr } = useLang();
  // Die Toast-Texte entstehen beim Zustandswechsel; die Sprache wird per Ref gelesen,
  // damit ein Sprachwechsel keine erneute Auswertung des Effekts auslöst.
  const langRef = useRef({ lang, tr });
  langRef.current = { lang, tr };
  const prevRef = useRef<GameState>(state);
  const lastActionRef = useRef<GameAction | null>(null);

  const notify = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = ++toastCounter;
    setToasts((t) => [...t.slice(-4), { ...toast, id }]);
  }, []);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);
  const activeToast = toasts[0];
  useEffect(() => {
    if (!activeToast) return;
    const timer = window.setTimeout(() => dismissToast(activeToast.id), activeToast.kind === 'level' ? 6500 : 4500);
    return () => window.clearTimeout(timer);
  }, [activeToast, dismissToast]);

  const dispatch = useCallback((action: GameAction) => {
    lastActionRef.current = action;
    rawDispatch(action);
  }, []);

  useEffect(() => {
    dispatch({ type: 'TOUCH_DAY', day: todayKey() });
  }, [dispatch]);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = state;
    if (prev === state) return;
    saveState(state);
    const action = lastActionRef.current;
    if (action?.type === 'RESET') return;

    const { lang: l, tr: t } = langRef.current;
    for (const id of Object.keys(state.badges)) {
      if (!prev.badges[id]) {
        const b = BADGE_BY_ID[id];
        if (b) {
          const description = b.description[l];
          notify({ kind: 'badge', title: `${t('Abzeichen', 'Награда')}: ${b.title[l]}`, detail: b.xp ? `${description} (+${b.xp} XP)` : description, icon: b.icon });
        }
      }
    }
    const before = levelFromXp(prev.xp);
    const after = levelFromXp(state.xp);
    if (after > before) {
      notify({
        kind: 'level',
        title: t(`Level ${after} erreicht!`, `Достигнут уровень ${after}!`),
        detail: `${t('Neuer Titel', 'Новое звание')}: ${levelTitle(after, l)}`,
        icon: '⬆️',
      });
    }
    const gained = state.xp - prev.xp;
    if (gained > 0 && action && (action.type === 'FLAG' || action.type === 'READ_THEORY')) {
      notify({
        kind: 'xp',
        title: `+${gained} XP`,
        detail: action.type === 'READ_THEORY'
          ? t('Theorie-Kapitel abgeschlossen', 'Теоретическая глава завершена')
          : action.flag.startsWith('lecture-')
            ? t('MBR-Lernmission abgeschlossen', 'Миссия MBR завершена')
            : t('Entdeckung im Simulator', 'Открытие в симуляторе'),
        icon: '✨',
      });
    }
  }, [state, notify]);

  const value = useMemo(() => ({ state, dispatch, toasts, dismissToast, notify }), [state, dispatch, toasts, dismissToast, notify]);
  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame muss innerhalb von <GameProvider> verwendet werden');
  return ctx;
}
