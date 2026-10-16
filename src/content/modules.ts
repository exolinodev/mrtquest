import type { Loc } from '../i18n/format';

export type ModuleId = 'kernspin' | 'relaxation' | 'ortskodierung' | 'kraum' | 'sequenzen' | 'qualitaet' | 'hardware';

export type SimulatorId = 'larmor' | 'relaxation' | 'gradient' | 'kspace' | 'sequence' | 'artifact' | 'scanner' | 'protocol';

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
    title: { de: 'Kernspin & Larmor', uk: 'Ядерний спін і Лармор' },
    subtitle: { de: 'Spins, Zeeman-Aufspaltung, Präzession und Resonanz', uk: 'Спіни, розщеплення Зеємана, прецесія та резонанс' },
    icon: '🧲',
    accent: '#38bdf8',
    simulator: 'larmor',
    simulatorTitle: { de: 'Präzessions-Labor', uk: 'Лабораторія прецесії' },
  },
  {
    id: 'relaxation',
    index: 2,
    title: { de: 'T1- & T2-Relaxation', uk: 'T1- і T2-релаксація' },
    subtitle: { de: 'Bloch-Gleichungen, Gewebekontrast, T2* und Spin-Echo', uk: 'Рівняння Блоха, тканинний контраст, T2* і спін-ехо' },
    icon: '⏳',
    accent: '#a78bfa',
    simulator: 'relaxation',
    simulatorTitle: { de: 'Relaxations-Simulator', uk: 'Симулятор релаксації' },
    recommendedAfter: 'kernspin',
  },
  {
    id: 'ortskodierung',
    index: 3,
    title: { de: 'Ortskodierung', uk: 'Просторове кодування' },
    subtitle: { de: 'Schicht-, Phasen- und Frequenzkodierung durch Gradienten', uk: 'Вибір зрізу, фазове та частотне кодування градієнтами' },
    icon: '📐',
    accent: '#34d399',
    simulator: 'gradient',
    simulatorTitle: { de: 'Gradienten-Werkbank', uk: 'Градієнтна майстерня' },
    recommendedAfter: 'relaxation',
  },
  {
    id: 'kraum',
    index: 4,
    title: { de: 'K-Raum & Fourier', uk: 'K-простір і Фур’є' },
    subtitle: { de: 'Ortsfrequenzen, Abtastung, Rekonstruktion per FFT', uk: 'Просторові частоти, дискретизація, реконструкція за допомогою FFT' },
    icon: '🌀',
    accent: '#f472b6',
    simulator: 'kspace',
    simulatorTitle: { de: 'K-Raum-Studio', uk: 'Студія k-простору' },
    recommendedAfter: 'ortskodierung',
  },
  {
    id: 'sequenzen',
    index: 5,
    title: { de: 'Pulssequenzen', uk: 'Імпульсні послідовності' },
    subtitle: { de: 'Spin-Echo, TSE, Inversion Recovery, GRE und EPI', uk: 'Спін-ехо, TSE, інверсія-відновлення, GRE та EPI' },
    icon: '📈',
    accent: '#fbbf24',
    simulator: 'sequence',
    simulatorTitle: { de: 'Sequenz-Designer', uk: 'Конструктор послідовностей' },
    recommendedAfter: 'kraum',
  },
  {
    id: 'qualitaet',
    index: 6,
    title: { de: 'SNR, SAR & Artefakte', uk: 'SNR, SAR і артефакти' },
    subtitle: { de: 'Bildqualität, Patientensicherheit und Fehlersuche', uk: 'Якість зображення, безпека пацієнта та пошук несправностей' },
    icon: '🛡️',
    accent: '#fb7185',
    simulator: 'artifact',
    simulatorTitle: { de: 'Artefakt-Detektiv', uk: 'Детектив артефактів' },
    recommendedAfter: 'sequenzen',
  },
  {
    id: 'hardware',
    index: 7,
    title: { de: 'Gerätetechnik', uk: 'Апаратура МРТ' },
    subtitle: { de: 'Magnet, Kryotechnik, Shim, Gradienten- und HF-System', uk: 'Магніт, кріотехніка, шимування, градієнтна та РЧ-система' },
    icon: '🏥',
    accent: '#22d3ee',
    simulator: 'scanner',
    simulatorTitle: { de: 'Scanner-Explorer', uk: 'Дослідник сканера' },
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>;

export const ALL_SIMULATORS: SimulatorId[] = ['larmor', 'relaxation', 'gradient', 'kspace', 'sequence', 'artifact', 'scanner', 'protocol'];
