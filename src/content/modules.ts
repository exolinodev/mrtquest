import type { Loc } from '../i18n/format';

export type ModuleId = 'kernspin' | 'relaxation' | 'ortskodierung' | 'kraum' | 'sequenzen' | 'qualitaet' | 'hardware';

export type SimulatorId = 'larmor' | 'relaxation' | 'gradient' | 'kspace' | 'sequence' | 'artifact' | 'scanner' | 'protocol' | 'signal' | 'fourier' | 'applications';

export interface ModuleMeta {
  id: ModuleId;
  index: number;
  title: Loc;
  subtitle: Loc;
  icon: string;
  accent: string;
  simulator: SimulatorId;
  simulatorTitle: Loc;
  /** Modul, das zuvor mit ≥ 60 % abgeschlossen sein sollte (Empfehlung, kein harter Lock) */
  recommendedAfter?: ModuleId;
}

export const MODULES: ModuleMeta[] = [
  {
    id: 'kernspin',
    index: 1,
    title: { de: 'Kernspin & Larmor', ru: 'Ядерный спин и Лармор' },
    subtitle: { de: 'Spins, Zeeman-Aufspaltung, Präzession und Resonanz', ru: 'Спины, зеемановское расщепление, прецессия и резонанс' },
    icon: '🧲',
    accent: '#38bdf8',
    simulator: 'larmor',
    simulatorTitle: { de: 'Präzessions-Labor', ru: 'Лаборатория прецессии' },
  },
  {
    id: 'relaxation',
    index: 2,
    title: { de: 'T1- & T2-Relaxation', ru: 'T1- и T2-релаксация' },
    subtitle: { de: 'Bloch-Gleichungen, Gewebekontrast, T2* und Spin-Echo', ru: 'Уравнения Блоха, тканевой контраст, T2* и спин-эхо' },
    icon: '⏳',
    accent: '#a78bfa',
    simulator: 'relaxation',
    simulatorTitle: { de: 'Relaxations-Simulator', ru: 'Симулятор релаксации' },
    recommendedAfter: 'kernspin',
  },
  {
    id: 'ortskodierung',
    index: 3,
    title: { de: 'Ortskodierung', ru: 'Пространственное кодирование' },
    subtitle: { de: 'Schicht-, Phasen- und Frequenzkodierung durch Gradienten', ru: 'Выбор среза, фазовое и частотное кодирование градиентами' },
    icon: '📐',
    accent: '#34d399',
    simulator: 'gradient',
    simulatorTitle: { de: 'Gradienten-Werkbank', ru: 'Градиентная мастерская' },
    recommendedAfter: 'relaxation',
  },
  {
    id: 'kraum',
    index: 4,
    title: { de: 'K-Raum & Fourier', ru: 'K-пространство и Фурье' },
    subtitle: { de: 'Ortsfrequenzen, Abtastung, Rekonstruktion per FFT', ru: 'Пространственные частоты, дискретизация, реконструкция с помощью FFT' },
    icon: '🌀',
    accent: '#f472b6',
    simulator: 'kspace',
    simulatorTitle: { de: 'K-Raum-Studio', ru: 'Студия k-пространства' },
    recommendedAfter: 'ortskodierung',
  },
  {
    id: 'sequenzen',
    index: 5,
    title: { de: 'Pulssequenzen', ru: 'Импульсные последовательности' },
    subtitle: { de: 'Spin-Echo, TSE, Inversion Recovery, GRE und EPI', ru: 'Спин-эхо, TSE, инверсия-восстановление, GRE и EPI' },
    icon: '📈',
    accent: '#fbbf24',
    simulator: 'sequence',
    simulatorTitle: { de: 'Sequenz-Designer', ru: 'Конструктор последовательностей' },
    recommendedAfter: 'kraum',
  },
  {
    id: 'qualitaet',
    index: 6,
    title: { de: 'SNR, SAR & Artefakte', ru: 'SNR, SAR и артефакты' },
    subtitle: { de: 'Bildqualität, Patientensicherheit und Fehlersuche', ru: 'Качество изображения, безопасность пациента и поиск неисправностей' },
    icon: '🛡️',
    accent: '#fb7185',
    simulator: 'artifact',
    simulatorTitle: { de: 'Artefakt-Detektiv', ru: 'Детектив артефактов' },
    recommendedAfter: 'sequenzen',
  },
  {
    id: 'hardware',
    index: 7,
    title: { de: 'Gerätetechnik', ru: 'Оборудование МРТ' },
    subtitle: { de: 'Magnet, Kryotechnik, Shim, Gradienten- und HF-System', ru: 'Магнит, криотехника, шиммирование, градиентная и РЧ-система' },
    icon: '🏥',
    accent: '#22d3ee',
    simulator: 'scanner',
    simulatorTitle: { de: 'Scanner-Explorer', ru: 'Исследователь сканера' },
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>;

export const ALL_SIMULATORS: SimulatorId[] = ['larmor', 'relaxation', 'gradient', 'kspace', 'sequence', 'artifact', 'scanner', 'protocol', 'signal', 'fourier', 'applications'];
