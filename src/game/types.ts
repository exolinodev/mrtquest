export interface ModuleProgress {
  /** bester Anteil korrekter Antworten in einer Challenge (0..1) */
  bestScore: number;
  attempts: number;
  perfect: boolean;
  theoryRead: boolean;
  xpEarned: number;
}

export interface ScenarioProgress {
  stars: number;
  attempts: number;
}

export interface GameStats {
  answered: number;
  correct: number;
  streak: number;
  bestStreak: number;
  hintsUsed: number;
  challengesCompleted: number;
  artifactsDiagnosed: number;
}

export interface GameState {
  version: 1;
  playerName: string;
  xp: number;
  modules: Record<string, ModuleProgress>;
  scenarios: Record<string, ScenarioProgress>;
  /** Abzeichen-ID → Zeitstempel der Freischaltung */
  badges: Record<string, number>;
  stats: GameStats;
  simulatorsVisited: string[];
  activeDays: string[];
  /** Ereignis-Flags aus Simulatoren (z. B. „FLAIR-Nullpunkt getroffen“) */
  flags: Record<string, boolean>;
  examBest: number;
  createdAt: number;
}

export type GameAction =
  | { type: 'ANSWER'; correct: boolean; xp: number; hintUsed: boolean }
  | { type: 'COMPLETE_CHALLENGE'; moduleId: string; score: number; bonusXp: number }
  | { type: 'READ_THEORY'; moduleId: string }
  | { type: 'VISIT_SIMULATOR'; simulatorId: string }
  | { type: 'FLAG'; flag: string; xp?: number }
  | { type: 'SCENARIO_RESULT'; scenarioId: string; stars: number; xp: number }
  | { type: 'ARTIFACT_DIAGNOSED'; xp: number }
  | { type: 'EXAM_RESULT'; score: number; xp: number }
  | { type: 'TOUCH_DAY'; day: string }
  | { type: 'SET_NAME'; name: string }
  | { type: 'RESET' };

export interface Toast {
  id: number;
  kind: 'xp' | 'level' | 'badge' | 'info';
  title: string;
  detail?: string;
  icon?: string;
}
