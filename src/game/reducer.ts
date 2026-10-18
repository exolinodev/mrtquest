import { BADGES } from './badges';
import type { GameAction, GameState, ModuleProgress } from './types';

export const STORAGE_KEY = 'mrt-quest:v1';

export function createInitialState(now = Date.now()): GameState {
  return {
    version: 1,
    playerName: '',
    xp: 0,
    modules: {},
    scenarios: {},
    badges: {},
    stats: {
      answered: 0,
      correct: 0,
      streak: 0,
      bestStreak: 0,
      hintsUsed: 0,
      challengesCompleted: 0,
      artifactsDiagnosed: 0,
    },
    simulatorsVisited: [],
    activeDays: [],
    flags: {},
    examBest: 0,
    createdAt: now,
  };
}

const emptyModule = (): ModuleProgress => ({ bestScore: 0, attempts: 0, perfect: false, theoryRead: false, xpEarned: 0 });

/** XP für das erstmalige Lesen eines Theorie-Kapitels. */
export const THEORY_XP = 20;

function updateModule(state: GameState, id: string, fn: (m: ModuleProgress) => ModuleProgress): GameState {
  return { ...state, modules: { ...state.modules, [id]: fn(state.modules[id] ?? emptyModule()) } };
}

function baseReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ANSWER': {
      const streak = action.correct ? state.stats.streak + 1 : 0;
      return {
        ...state,
        xp: state.xp + (action.correct ? action.xp : 0),
        stats: {
          ...state.stats,
          answered: state.stats.answered + 1,
          correct: state.stats.correct + (action.correct ? 1 : 0),
          streak,
          bestStreak: Math.max(state.stats.bestStreak, streak),
          hintsUsed: state.stats.hintsUsed + (action.hintUsed ? 1 : 0),
        },
      };
    }
    case 'COMPLETE_CHALLENGE': {
      const next = updateModule(state, action.moduleId, (m) => ({
        ...m,
        attempts: m.attempts + 1,
        bestScore: Math.max(m.bestScore, action.score),
        perfect: m.perfect || action.score >= 1,
        xpEarned: m.xpEarned + action.bonusXp,
      }));
      return {
        ...next,
        xp: next.xp + action.bonusXp,
        stats: { ...next.stats, challengesCompleted: next.stats.challengesCompleted + 1 },
      };
    }
    case 'READ_THEORY': {
      if (state.modules[action.moduleId]?.theoryRead) return state;
      const next = updateModule(state, action.moduleId, (m) => ({ ...m, theoryRead: true, xpEarned: m.xpEarned + THEORY_XP }));
      return { ...next, xp: next.xp + THEORY_XP };
    }
    case 'VISIT_SIMULATOR':
      if (state.simulatorsVisited.includes(action.simulatorId)) return state;
      return { ...state, simulatorsVisited: [...state.simulatorsVisited, action.simulatorId] };
    case 'FLAG':
      if (state.flags[action.flag]) return state;
      return { ...state, flags: { ...state.flags, [action.flag]: true }, xp: state.xp + (action.xp ?? 0) };
    case 'SCENARIO_RESULT': {
      const prev = state.scenarios[action.scenarioId] ?? { stars: 0, attempts: 0 };
      return {
        ...state,
        xp: state.xp + action.xp,
        scenarios: {
          ...state.scenarios,
          [action.scenarioId]: { stars: Math.max(prev.stars, action.stars), attempts: prev.attempts + 1 },
        },
      };
    }
    case 'ARTIFACT_DIAGNOSED':
      return {
        ...state,
        xp: state.xp + action.xp,
        stats: { ...state.stats, artifactsDiagnosed: state.stats.artifactsDiagnosed + 1 },
      };
    case 'EXAM_RESULT':
      return { ...state, xp: state.xp + action.xp, examBest: Math.max(state.examBest, action.score) };
    case 'TOUCH_DAY':
      if (state.activeDays.includes(action.day)) return state;
      return { ...state, activeDays: [...state.activeDays, action.day].slice(-366) };
    case 'SET_NAME':
      return { ...state, playerName: action.name.slice(0, 40) };
    case 'RESET':
      return createInitialState();
  }
}

/** Prüft alle Abzeichen und vergibt neu erfüllte inklusive Bonus-XP (iterativ, da XP weitere freischalten kann). */
export function awardBadges(state: GameState, now = Date.now()): GameState {
  let current = state;
  for (let round = 0; round < 4; round++) {
    const newly = BADGES.filter((b) => !current.badges[b.id] && b.check(current));
    if (newly.length === 0) break;
    const badges = { ...current.badges };
    let xp = current.xp;
    for (const b of newly) {
      badges[b.id] = now;
      xp += b.xp;
    }
    current = { ...current, badges, xp };
  }
  return current;
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  const next = baseReducer(state, action);
  return next === state ? state : awardBadges(next);
}

// ---------------------------------------------------------------- Persistenz

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

/** Frühere Module (vor der Gliederung nach dem Skript) → heutige Kapitel. */
const LEGACY_MODULES: Record<string, string> = {
  kernspin: 'prinzip',
  relaxation: 'prinzip',
  ortskodierung: 'bild',
  kraum: 'bild',
  hardware: 'bild',
};

/** Überträgt Fortschritt alter Module auf die neuen Kapitel: Bestwert und Theorie werden übernommen, Versuche addiert. */
export function migrateModules(modules: GameState['modules']): GameState['modules'] {
  const result: GameState['modules'] = {};
  for (const [id, progress] of Object.entries(modules)) {
    const target = LEGACY_MODULES[id] ?? id;
    const prev = result[target];
    result[target] = prev
      ? {
          bestScore: Math.max(prev.bestScore, progress.bestScore),
          attempts: prev.attempts + progress.attempts,
          perfect: prev.perfect || progress.perfect,
          theoryRead: prev.theoryRead || progress.theoryRead,
          xpEarned: prev.xpEarned + progress.xpEarned,
        }
      : { ...progress };
  }
  return result;
}

/** Lädt und validiert den gespeicherten Zustand; fehlende Felder werden ergänzt. */
export function loadState(storage: Pick<Storage, 'getItem'> | undefined = globalThis.localStorage): GameState {
  const initial = createInitialState();
  try {
    const raw = storage?.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed) || parsed.version !== 1) return initial;
    const merged: GameState = {
      ...initial,
      ...(parsed as Partial<GameState>),
      stats: { ...initial.stats, ...(isRecord(parsed.stats) ? (parsed.stats as Partial<GameState['stats']>) : {}) },
      modules: isRecord(parsed.modules) ? migrateModules(parsed.modules as GameState['modules']) : {},
      scenarios: isRecord(parsed.scenarios) ? (parsed.scenarios as GameState['scenarios']) : {},
      badges: isRecord(parsed.badges) ? (parsed.badges as GameState['badges']) : {},
      flags: isRecord(parsed.flags) ? (parsed.flags as GameState['flags']) : {},
      simulatorsVisited: Array.isArray(parsed.simulatorsVisited) ? parsed.simulatorsVisited.filter((x): x is string => typeof x === 'string') : [],
      activeDays: Array.isArray(parsed.activeDays) ? parsed.activeDays.filter((x): x is string => typeof x === 'string') : [],
    };
    if (typeof merged.xp !== 'number' || !Number.isFinite(merged.xp) || merged.xp < 0) merged.xp = 0;
    return merged;
  } catch {
    return initial;
  }
}

export function saveState(state: GameState, storage: Pick<Storage, 'setItem'> | undefined = globalThis.localStorage): void {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Speicher voll oder deaktiviert (z. B. privater Modus) – Spiel läuft ohne Persistenz weiter.
  }
}

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}
