/** XP-Schwelle für Level n: 50·n·(n−1) → 0, 100, 300, 600, 1000, … */
export function xpForLevel(level: number): number {
  return 50 * level * (level - 1);
}

export function levelFromXp(xp: number): number {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  return level;
}

export interface LevelProgress {
  level: number;
  title: string;
  current: number;
  needed: number;
  ratio: number;
}

const TITLES = [
  'Erstsemester',
  'Praktikant:in am MRT',
  'MTR-Azubi',
  'Spin-Flüsterer:in',
  'Gradienten-Jongleur:in',
  'K-Raum-Navigator:in',
  'Sequenz-Architekt:in',
  'Protokoll-Optimierer:in',
  'MR-Physiker:in',
  'Larmor-Legende',
];

export function levelTitle(level: number): string {
  if (level <= TITLES.length) return TITLES[level - 1];
  return `${TITLES[TITLES.length - 1]} ${toRoman(level - TITLES.length + 1)}`;
}

function toRoman(n: number): string {
  const map: Array<[number, string]> = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let out = '';
  for (const [v, s] of map) while (n >= v) (out += s), (n -= v);
  return out;
}

export function levelProgress(xp: number): LevelProgress {
  const level = levelFromXp(xp);
  const base = xpForLevel(level);
  const next = xpForLevel(level + 1);
  return {
    level,
    title: levelTitle(level),
    current: xp - base,
    needed: next - base,
    ratio: (xp - base) / (next - base),
  };
}

/** XP für eine richtig beantwortete Frage nach Schwierigkeit, Combo und Hinweisnutzung. */
export function answerXp(difficulty: 1 | 2 | 3, streak: number, hintUsed: boolean, replay: boolean): number {
  const base = difficulty === 1 ? 10 : difficulty === 2 ? 15 : 25;
  const combo = streak >= 6 ? 1.5 : streak >= 3 ? 1.2 : 1;
  const hint = hintUsed ? 0.5 : 1;
  const replayFactor = replay ? 0.5 : 1;
  return Math.max(1, Math.round(base * combo * hint * replayFactor));
}
