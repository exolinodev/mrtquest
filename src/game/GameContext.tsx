import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
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
  const prevRef = useRef<GameState>(state);
  const lastActionRef = useRef<GameAction | null>(null);

  const notify = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = ++toastCounter;
    setToasts((t) => [...t.slice(-4), { ...toast, id }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), toast.kind === 'level' ? 6500 : 4500);
  }, []);

  const dismissToast = useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

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

    for (const id of Object.keys(state.badges)) {
      if (!prev.badges[id]) {
        const b = BADGE_BY_ID[id];
        if (b) notify({ kind: 'badge', title: `Abzeichen: ${b.title}`, detail: b.xp ? `${b.description} (+${b.xp} XP)` : b.description, icon: b.icon });
      }
    }
    const before = levelFromXp(prev.xp);
    const after = levelFromXp(state.xp);
    if (after > before) {
      notify({ kind: 'level', title: `Level ${after} erreicht!`, detail: `Neuer Titel: ${levelTitle(after)}`, icon: '⬆️' });
    }
    const gained = state.xp - prev.xp;
    if (gained > 0 && action && (action.type === 'FLAG' || action.type === 'READ_THEORY')) {
      notify({ kind: 'xp', title: `+${gained} XP`, detail: action.type === 'READ_THEORY' ? 'Theorie-Kapitel abgeschlossen' : 'Entdeckung im Simulator', icon: '✨' });
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
