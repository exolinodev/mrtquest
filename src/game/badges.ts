import { ALL_SIMULATORS, MODULES, type ModuleId } from '../content/modules';
import type { Loc } from '../i18n/format';
import { SCENARIOS } from '../content/scenarios';
import { levelFromXp } from './levels';
import type { GameState } from './types';

export type BadgeTier = 'bronze' | 'silver' | 'gold';

export interface BadgeDef {
  id: string;
  title: Loc;
  description: Loc;
  icon: string;
  tier: BadgeTier;
  /** Bonus-XP bei Freischaltung */
  xp: number;
  check: (s: GameState) => boolean;
}

const moduleMastered = (s: GameState, id: ModuleId) => (s.modules[id]?.bestScore ?? 0) >= 0.8;

const MODULE_BADGES: Record<ModuleId, { title: Loc; icon: string }> = {
  kernspin: { title: { de: 'Larmor-Meister:in', uk: 'Майстер Лармора' }, icon: '🧲' },
  relaxation: { title: { de: 'Relaxations-Profi', uk: 'Профі релаксації' }, icon: '⏳' },
  ortskodierung: { title: { de: 'Gradienten-Guru', uk: 'Гуру градієнтів' }, icon: '📐' },
  kraum: { title: { de: 'Fourier-Flüsterer:in', uk: 'Заклинач Фур’є' }, icon: '🌀' },
  sequenzen: { title: { de: 'Sequenz-Architekt:in', uk: 'Архітектор послідовностей' }, icon: '📈' },
  qualitaet: { title: { de: 'Qualitäts-Wächter:in', uk: 'Вартовий якості' }, icon: '🛡️' },
  hardware: { title: { de: 'Technik-Insider:in', uk: 'Знавець апаратури' }, icon: '🏥' },
};

export const BADGES: BadgeDef[] = [
  {
    id: 'erste-schritte',
    title: { de: 'Erste Schritte', uk: 'Перші кроки' },
    description: { de: 'Schließe deine erste Challenge ab.', uk: 'Заверши своє перше завдання.' },
    icon: '👣',
    tier: 'bronze',
    xp: 20,
    check: (s) => s.stats.challengesCompleted >= 1,
  },
  {
    id: 'perfektionist',
    title: { de: 'Perfektionist:in', uk: 'Перфекціоніст' },
    description: { de: 'Beende eine Modul-Challenge mit 100 %.', uk: 'Заверши завдання модуля на 100 %.' },
    icon: '💎',
    tier: 'silver',
    xp: 40,
    check: (s) => Object.values(s.modules).some((m) => m.perfect),
  },
  {
    id: 'theorie-fan',
    title: { de: 'Bücherwurm', uk: 'Книголюб' },
    description: { de: 'Lies alle Theorie-Kapitel vollständig.', uk: 'Прочитай усі теоретичні розділи повністю.' },
    icon: '📚',
    tier: 'silver',
    xp: 40,
    check: (s) => MODULES.every((m) => s.modules[m.id]?.theoryRead),
  },
  ...MODULES.map<BadgeDef>((m) => ({
    id: `meister-${m.id}`,
    title: MODULE_BADGES[m.id].title,
    description: {
      de: `Erreiche mindestens 80 % in der Challenge „${m.title.de}“.`,
      uk: `Набери щонайменше 80 % у завданні «${m.title.uk}».`,
    },
    icon: MODULE_BADGES[m.id].icon,
    tier: 'silver',
    xp: 30,
    check: (s) => moduleMastered(s, m.id),
  })),
  {
    id: 'grand-slam',
    title: { de: 'Grand Slam', uk: 'Великий шолом' },
    description: { de: 'Meistere alle sieben Module mit mindestens 80 %.', uk: 'Опануй усі сім модулів щонайменше на 80 %.' },
    icon: '🏆',
    tier: 'gold',
    xp: 150,
    check: (s) => MODULES.every((m) => moduleMastered(s, m.id)),
  },
  {
    id: 'simulator-entdecker',
    title: { de: 'Simulator-Entdecker:in', uk: 'Дослідник симуляторів' },
    description: { de: 'Öffne jeden virtuellen Simulator mindestens einmal.', uk: 'Відкрий кожен віртуальний симулятор хоча б раз.' },
    icon: '🔭',
    tier: 'silver',
    xp: 40,
    check: (s) => ALL_SIMULATORS.every((id) => s.simulatorsVisited.includes(id)),
  },
  {
    id: 'combo-5',
    title: { de: 'Im Fluss', uk: 'У потоці' },
    description: { de: '5 richtige Antworten in Folge.', uk: '5 правильних відповідей поспіль.' },
    icon: '🔥',
    tier: 'bronze',
    xp: 20,
    check: (s) => s.stats.bestStreak >= 5,
  },
  {
    id: 'combo-15',
    title: { de: 'Kohärente Präzession', uk: 'Когерентна прецесія' },
    description: { de: '15 richtige Antworten in Folge – keine Dephasierung!', uk: '15 правильних відповідей поспіль – жодного дефазування!' },
    icon: '🌊',
    tier: 'gold',
    xp: 80,
    check: (s) => s.stats.bestStreak >= 15,
  },
  {
    id: 'fleissig',
    title: { de: 'Fleißige Spins', uk: 'Працьовиті спіни' },
    description: { de: 'Beantworte insgesamt 100 Fragen.', uk: 'Дай відповідь загалом на 100 запитань.' },
    icon: '🐝',
    tier: 'silver',
    xp: 50,
    check: (s) => s.stats.answered >= 100,
  },
  {
    id: 'treffsicher',
    title: { de: 'Treffsicher', uk: 'Влучний' },
    description: { de: 'Mindestens 85 % Trefferquote bei 40 oder mehr Antworten.', uk: 'Щонайменше 85 % влучності при 40 або більше відповідях.' },
    icon: '🎯',
    tier: 'gold',
    xp: 80,
    check: (s) => s.stats.answered >= 40 && s.stats.correct / s.stats.answered >= 0.85,
  },
  {
    id: 'resonanz',
    title: { de: 'In Resonanz', uk: 'У резонансі' },
    description: { de: 'Treffe im Präzessions-Labor die Resonanzfrequenz.', uk: 'Влуч у резонансну частоту в лабораторії прецесії.' },
    icon: '📡',
    tier: 'bronze',
    xp: 20,
    check: (s) => !!s.flags['resonance-hit'],
  },
  {
    id: 'nullpunkt-jaeger',
    title: { de: 'Nullpunkt-Jäger:in', uk: 'Мисливець за нульовою точкою' },
    description: { de: 'Unterdrücke den Liquor per FLAIR-Inversionszeit (±5 %).', uk: 'Пригніть ліквор за допомогою часу інверсії FLAIR (±5 %).' },
    icon: '🕳️',
    tier: 'silver',
    xp: 30,
    check: (s) => !!s.flags['flair-null'],
  },
  {
    id: 'fett-weg',
    title: { de: 'Fettfrei', uk: 'Без жиру' },
    description: { de: 'Finde die STIR-Inversionszeit, die Fett nullt (±5 %).', uk: 'Знайди час інверсії STIR, який обнуляє жир (±5 %).' },
    icon: '🧈',
    tier: 'silver',
    xp: 30,
    check: (s) => !!s.flags['stir-null'],
  },
  {
    id: 'ernst',
    title: { de: 'Ernsthaft optimiert', uk: 'Оптимізовано за Ернстом' },
    description: { de: 'Stelle im GRE den Ernst-Winkel der weißen Substanz ein (±2°).', uk: 'Встанови в GRE кут Ернста для білої речовини (±2°).' },
    icon: '📐',
    tier: 'bronze',
    xp: 20,
    check: (s) => !!s.flags['ernst-angle'],
  },
  {
    id: 'fischgraet',
    title: { de: 'Fischgrät-Künstler:in', uk: 'Майстер «ялинки»' },
    description: { de: 'Erzeuge im K-Raum-Studio ein Spike-Artefakt.', uk: 'Створи в студії k-простору артефакт спайка.' },
    icon: '🐟',
    tier: 'bronze',
    xp: 15,
    check: (s) => !!s.flags['kspace-spike'],
  },
  {
    id: 'basiswelle',
    title: { de: 'Wellenreiter:in', uk: 'Серфер хвиль' },
    description: { de: 'Untersuche einzelne k-Raum-Punkte und ihre Ortsfrequenz-Muster.', uk: 'Досліди окремі точки k-простору та їхні візерунки просторових частот.' },
    icon: '〰️',
    tier: 'bronze',
    xp: 15,
    check: (s) => !!s.flags['kspace-basis'],
  },
  {
    id: 'schichtwerker',
    title: { de: 'Präzisions-Schichtwerker:in', uk: 'Майстер точних зрізів' },
    description: { de: 'Stelle in der Gradienten-Werkbank exakt die Zielschicht ein.', uk: 'Точно налаштуй цільовий зріз у градієнтній майстерні.' },
    icon: '🔪',
    tier: 'bronze',
    xp: 20,
    check: (s) => !!s.flags['slice-target'],
  },
  {
    id: 'klinik-debut',
    title: { de: 'Klinik-Debüt', uk: 'Клінічний дебют' },
    description: { de: 'Schließe dein erstes klinisches Szenario ab.', uk: 'Заверши свій перший клінічний сценарій.' },
    icon: '🩺',
    tier: 'bronze',
    xp: 20,
    check: (s) => Object.values(s.scenarios).some((sc) => sc.stars >= 1),
  },
  {
    id: 'drei-sterne',
    title: { de: 'Optimales Protokoll', uk: 'Оптимальний протокол' },
    description: { de: 'Erreiche in einem Szenario alle drei Sterne.', uk: 'Отримай у сценарії всі три зірки.' },
    icon: '⭐',
    tier: 'silver',
    xp: 40,
    check: (s) => Object.values(s.scenarios).some((sc) => sc.stars >= 3),
  },
  {
    id: 'sar-waechter',
    title: { de: 'SAR-Wächter:in', uk: 'Вартовий SAR' },
    description: { de: 'Löse ein 3-Tesla-Szenario im Normal Mode (≤ 2 W/kg).', uk: 'Розв’яжи 3-тесловий сценарій у нормальному режимі (≤ 2 Вт/кг).' },
    icon: '🌡️',
    tier: 'silver',
    xp: 40,
    check: (s) => !!s.flags['sar-safe-3t'],
  },
  {
    id: 'klinik-profi',
    title: { de: 'Oberärzt:in der MR', uk: 'Завідувач МР-відділення' },
    description: { de: 'Erreiche in allen Szenarien mindestens zwei Sterne.', uk: 'Отримай щонайменше дві зірки в усіх сценаріях.' },
    icon: '🏅',
    tier: 'gold',
    xp: 150,
    check: (s) => SCENARIOS.every((sc) => (s.scenarios[sc.id]?.stars ?? 0) >= 2),
  },
  {
    id: 'artefakt-detektiv',
    title: { de: 'Artefakt-Detektiv:in', uk: 'Детектив артефактів' },
    description: { de: 'Diagnostiziere und behebe 10 Artefakte korrekt.', uk: 'Правильно діагностуй і усунь 10 артефактів.' },
    icon: '🕵️',
    tier: 'silver',
    xp: 50,
    check: (s) => s.stats.artifactsDiagnosed >= 10,
  },
  {
    id: 'facharzt',
    title: { de: 'Prüfung bestanden', uk: 'Іспит складено' },
    description: { de: 'Bestehe die Abschlussprüfung mit mindestens 80 %.', uk: 'Склади підсумковий іспит щонайменше на 80 %.' },
    icon: '🎓',
    tier: 'gold',
    xp: 150,
    check: (s) => s.examBest >= 0.8,
  },
  {
    id: 'dranbleiben',
    title: { de: 'Dranbleiben', uk: 'Не здавайся' },
    description: { de: 'Lerne an 3 verschiedenen Tagen.', uk: 'Навчайся протягом 3 різних днів.' },
    icon: '📅',
    tier: 'bronze',
    xp: 25,
    check: (s) => s.activeDays.length >= 3,
  },
  {
    id: 'marathon',
    title: { de: 'Langzeit-T1', uk: 'Довге T1' },
    description: { de: 'Lerne an 7 verschiedenen Tagen.', uk: 'Навчайся протягом 7 різних днів.' },
    icon: '🏃',
    tier: 'silver',
    xp: 60,
    check: (s) => s.activeDays.length >= 7,
  },
  {
    id: 'level-5',
    title: { de: 'Halbzeit', uk: 'Півдороги' },
    description: { de: 'Erreiche Level 5.', uk: 'Досягни 5-го рівня.' },
    icon: '🚀',
    tier: 'silver',
    xp: 0,
    check: (s) => levelFromXp(s.xp) >= 5,
  },
  {
    id: 'level-10',
    title: { de: 'Larmor-Legende', uk: 'Легенда Лармора' },
    description: { de: 'Erreiche Level 10.', uk: 'Досягни 10-го рівня.' },
    icon: '👑',
    tier: 'gold',
    xp: 0,
    check: (s) => levelFromXp(s.xp) >= 10,
  },
];

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b])) as Record<string, BadgeDef>;
