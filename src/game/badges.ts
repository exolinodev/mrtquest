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
  kernspin: { title: { de: 'Larmor-Meister:in', ru: 'Мастер Лармора' }, icon: '🧲' },
  relaxation: { title: { de: 'Relaxations-Profi', ru: 'Профи релаксации' }, icon: '⏳' },
  ortskodierung: { title: { de: 'Gradienten-Guru', ru: 'Гуру градиентов' }, icon: '📐' },
  kraum: { title: { de: 'Fourier-Flüsterer:in', ru: 'Заклинатель Фурье' }, icon: '🌀' },
  sequenzen: { title: { de: 'Sequenz-Architekt:in', ru: 'Архитектор последовательностей' }, icon: '📈' },
  qualitaet: { title: { de: 'Qualitäts-Wächter:in', ru: 'Страж качества' }, icon: '🛡️' },
  hardware: { title: { de: 'Technik-Insider:in', ru: 'Знаток оборудования' }, icon: '🏥' },
  anwendungen: { title: { de: 'Klinik-Navigator:in', ru: 'Клинический навигатор' }, icon: '🧬' },
};

export const BADGES: BadgeDef[] = [
  {
    id: 'erste-schritte',
    title: { de: 'Erste Schritte', ru: 'Первые шаги' },
    description: { de: 'Schließe deine erste Challenge ab.', ru: 'Заверши своё первое задание.' },
    icon: '👣',
    tier: 'bronze',
    xp: 20,
    check: (s) => s.stats.challengesCompleted >= 1,
  },
  {
    id: 'perfektionist',
    title: { de: 'Perfektionist:in', ru: 'Перфекционист' },
    description: { de: 'Beende eine Modul-Challenge mit 100 %.', ru: 'Заверши задание модуля на 100 %.' },
    icon: '💎',
    tier: 'silver',
    xp: 40,
    check: (s) => Object.values(s.modules).some((m) => m.perfect),
  },
  {
    id: 'theorie-fan',
    title: { de: 'Bücherwurm', ru: 'Книголюб' },
    description: { de: 'Lies alle Theorie-Kapitel vollständig.', ru: 'Прочитай все теоретические главы полностью.' },
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
      ru: `Набери не менее 80 % в задании «${m.title.ru}».`,
    },
    icon: MODULE_BADGES[m.id].icon,
    tier: 'silver',
    xp: 30,
    check: (s) => moduleMastered(s, m.id),
  })),
  {
    id: 'grand-slam',
    title: { de: 'Grand Slam', ru: 'Большой шлем' },
    description: { de: 'Meistere alle acht Module mit mindestens 80 %.', ru: 'Освой все восемь модулей не менее чем на 80 %.' },
    icon: '🏆',
    tier: 'gold',
    xp: 150,
    check: (s) => MODULES.every((m) => moduleMastered(s, m.id)),
  },
  {
    id: 'simulator-entdecker',
    title: { de: 'Simulator-Entdecker:in', ru: 'Исследователь симуляторов' },
    description: { de: 'Öffne jeden virtuellen Simulator mindestens einmal.', ru: 'Открой каждый виртуальный симулятор хотя бы раз.' },
    icon: '🔭',
    tier: 'silver',
    xp: 40,
    check: (s) => ALL_SIMULATORS.every((id) => s.simulatorsVisited.includes(id)),
  },
  {
    id: 'combo-5',
    title: { de: 'Im Fluss', ru: 'В потоке' },
    description: { de: '5 richtige Antworten in Folge.', ru: '5 правильных ответов подряд.' },
    icon: '🔥',
    tier: 'bronze',
    xp: 20,
    check: (s) => s.stats.bestStreak >= 5,
  },
  {
    id: 'combo-15',
    title: { de: 'Kohärente Präzession', ru: 'Когерентная прецессия' },
    description: { de: '15 richtige Antworten in Folge – keine Dephasierung!', ru: '15 правильных ответов подряд – никакой дефазировки!' },
    icon: '🌊',
    tier: 'gold',
    xp: 80,
    check: (s) => s.stats.bestStreak >= 15,
  },
  {
    id: 'fleissig',
    title: { de: 'Fleißige Spins', ru: 'Трудолюбивые спины' },
    description: { de: 'Beantworte insgesamt 100 Fragen.', ru: 'Ответь в общей сложности на 100 вопросов.' },
    icon: '🐝',
    tier: 'silver',
    xp: 50,
    check: (s) => s.stats.answered >= 100,
  },
  {
    id: 'treffsicher',
    title: { de: 'Treffsicher', ru: 'Меткий' },
    description: { de: 'Mindestens 85 % Trefferquote bei 40 oder mehr Antworten.', ru: 'Не менее 85 % точности при 40 и более ответах.' },
    icon: '🎯',
    tier: 'gold',
    xp: 80,
    check: (s) => s.stats.answered >= 40 && s.stats.correct / s.stats.answered >= 0.85,
  },
  {
    id: 'resonanz',
    title: { de: 'In Resonanz', ru: 'В резонансе' },
    description: { de: 'Treffe im Präzessions-Labor die Resonanzfrequenz.', ru: 'Попади в резонансную частоту в лаборатории прецессии.' },
    icon: '📡',
    tier: 'bronze',
    xp: 20,
    check: (s) => !!s.flags['resonance-hit'],
  },
  {
    id: 'nullpunkt-jaeger',
    title: { de: 'Nullpunkt-Jäger:in', ru: 'Охотник за нулевой точкой' },
    description: { de: 'Unterdrücke den Liquor per FLAIR-Inversionszeit (±5 %).', ru: 'Подави ликвор с помощью времени инверсии FLAIR (±5 %).' },
    icon: '🕳️',
    tier: 'silver',
    xp: 30,
    check: (s) => !!s.flags['flair-null'],
  },
  {
    id: 'fett-weg',
    title: { de: 'Fettfrei', ru: 'Без жира' },
    description: { de: 'Finde die STIR-Inversionszeit, die Fett nullt (±5 %).', ru: 'Найди время инверсии STIR, обнуляющее жир (±5 %).' },
    icon: '🧈',
    tier: 'silver',
    xp: 30,
    check: (s) => !!s.flags['stir-null'],
  },
  {
    id: 'ernst',
    title: { de: 'Ernsthaft optimiert', ru: 'Оптимизировано по Эрнсту' },
    description: { de: 'Stelle im GRE den Ernst-Winkel der weißen Substanz ein (±2°).', ru: 'Установи в GRE угол Эрнста для белого вещества (±2°).' },
    icon: '📐',
    tier: 'bronze',
    xp: 20,
    check: (s) => !!s.flags['ernst-angle'],
  },
  {
    id: 'fischgraet',
    title: { de: 'Fischgrät-Künstler:in', ru: 'Мастер «ёлочки»' },
    description: { de: 'Erzeuge im K-Raum-Studio ein Spike-Artefakt.', ru: 'Создай в студии k-пространства артефакт спайка.' },
    icon: '🐟',
    tier: 'bronze',
    xp: 15,
    check: (s) => !!s.flags['kspace-spike'],
  },
  {
    id: 'basiswelle',
    title: { de: 'Wellenreiter:in', ru: 'Серфер волн' },
    description: { de: 'Untersuche einzelne k-Raum-Punkte und ihre Ortsfrequenz-Muster.', ru: 'Исследуй отдельные точки k-пространства и их узоры пространственных частот.' },
    icon: '〰️',
    tier: 'bronze',
    xp: 15,
    check: (s) => !!s.flags['kspace-basis'],
  },
  {
    id: 'schichtwerker',
    title: { de: 'Präzisions-Schichtwerker:in', ru: 'Мастер точных срезов' },
    description: { de: 'Stelle in der Gradienten-Werkbank exakt die Zielschicht ein.', ru: 'Точно настрой целевой срез в градиентной мастерской.' },
    icon: '🔪',
    tier: 'bronze',
    xp: 20,
    check: (s) => !!s.flags['slice-target'],
  },
  {
    id: 'klinik-debut',
    title: { de: 'Klinik-Debüt', ru: 'Клинический дебют' },
    description: { de: 'Schließe dein erstes klinisches Szenario ab.', ru: 'Заверши свой первый клинический сценарий.' },
    icon: '🩺',
    tier: 'bronze',
    xp: 20,
    check: (s) => Object.values(s.scenarios).some((sc) => sc.stars >= 1),
  },
  {
    id: 'drei-sterne',
    title: { de: 'Optimales Protokoll', ru: 'Оптимальный протокол' },
    description: { de: 'Erreiche in einem Szenario alle drei Sterne.', ru: 'Получи в сценарии все три звезды.' },
    icon: '⭐',
    tier: 'silver',
    xp: 40,
    check: (s) => Object.values(s.scenarios).some((sc) => sc.stars >= 3),
  },
  {
    id: 'sar-waechter',
    title: { de: 'SAR-Wächter:in', ru: 'Страж SAR' },
    description: { de: 'Löse ein 3-Tesla-Szenario im Normal Mode (≤ 2 W/kg).', ru: 'Реши 3-тесловый сценарий в нормальном режиме (≤ 2 Вт/кг).' },
    icon: '🌡️',
    tier: 'silver',
    xp: 40,
    check: (s) => !!s.flags['sar-safe-3t'],
  },
  {
    id: 'klinik-profi',
    title: { de: 'Oberärzt:in der MR', ru: 'Заведующий МР-отделением' },
    description: { de: 'Erreiche in allen Szenarien mindestens zwei Sterne.', ru: 'Получи не менее двух звёзд во всех сценариях.' },
    icon: '🏅',
    tier: 'gold',
    xp: 150,
    check: (s) => SCENARIOS.every((sc) => (s.scenarios[sc.id]?.stars ?? 0) >= 2),
  },
  {
    id: 'artefakt-detektiv',
    title: { de: 'Artefakt-Detektiv:in', ru: 'Детектив артефактов' },
    description: { de: 'Diagnostiziere und behebe 10 Artefakte korrekt.', ru: 'Правильно диагностируй и устрани 10 артефактов.' },
    icon: '🕵️',
    tier: 'silver',
    xp: 50,
    check: (s) => s.stats.artifactsDiagnosed >= 10,
  },
  {
    id: 'facharzt',
    title: { de: 'Prüfung bestanden', ru: 'Экзамен сдан' },
    description: { de: 'Bestehe die Probeprüfung mit mindestens 80 %.', ru: 'Сдай пробный экзамен не менее чем на 80 %.' },
    icon: '🎓',
    tier: 'gold',
    xp: 150,
    check: (s) => s.examBest >= 0.8,
  },
  {
    id: 'dranbleiben',
    title: { de: 'Dranbleiben', ru: 'Не сдавайся' },
    description: { de: 'Lerne an 3 verschiedenen Tagen.', ru: 'Занимайся в течение 3 разных дней.' },
    icon: '📅',
    tier: 'bronze',
    xp: 25,
    check: (s) => s.activeDays.length >= 3,
  },
  {
    id: 'marathon',
    title: { de: 'Langzeit-T1', ru: 'Долгое T1' },
    description: { de: 'Lerne an 7 verschiedenen Tagen.', ru: 'Занимайся в течение 7 разных дней.' },
    icon: '🏃',
    tier: 'silver',
    xp: 60,
    check: (s) => s.activeDays.length >= 7,
  },
  {
    id: 'level-5',
    title: { de: 'Halbzeit', ru: 'Полпути' },
    description: { de: 'Erreiche Level 5.', ru: 'Достигни 5-го уровня.' },
    icon: '🚀',
    tier: 'silver',
    xp: 0,
    check: (s) => levelFromXp(s.xp) >= 5,
  },
  {
    id: 'level-10',
    title: { de: 'Larmor-Legende', ru: 'Легенда Лармора' },
    description: { de: 'Erreiche Level 10.', ru: 'Достигни 10-го уровня.' },
    icon: '👑',
    tier: 'gold',
    xp: 0,
    check: (s) => levelFromXp(s.xp) >= 10,
  },
];

export const BADGE_BY_ID = Object.fromEntries(BADGES.map((b) => [b.id, b])) as Record<string, BadgeDef>;
