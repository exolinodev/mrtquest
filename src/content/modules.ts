export type ModuleId = 'kernspin' | 'relaxation' | 'ortskodierung' | 'kraum' | 'sequenzen' | 'qualitaet' | 'hardware';

export type SimulatorId = 'larmor' | 'relaxation' | 'gradient' | 'kspace' | 'sequence' | 'artifact' | 'scanner' | 'protocol';

export interface ModuleMeta {
  id: ModuleId;
  index: number;
  title: string;
  subtitle: string;
  icon: string;
  accent: string;
  simulator: SimulatorId;
  simulatorTitle: string;
  /** Modul, das zuvor mit ≥ 60 % abgeschlossen sein sollte (Empfehlung, kein harter Lock) */
  recommendedAfter?: ModuleId;
}

export const MODULES: ModuleMeta[] = [
  {
    id: 'kernspin',
    index: 1,
    title: 'Kernspin & Larmor',
    subtitle: 'Spins, Zeeman-Aufspaltung, Präzession und Resonanz',
    icon: '🧲',
    accent: '#38bdf8',
    simulator: 'larmor',
    simulatorTitle: 'Präzessions-Labor',
  },
  {
    id: 'relaxation',
    index: 2,
    title: 'T1- & T2-Relaxation',
    subtitle: 'Bloch-Gleichungen, Gewebekontrast, T2* und Spin-Echo',
    icon: '⏳',
    accent: '#a78bfa',
    simulator: 'relaxation',
    simulatorTitle: 'Relaxations-Simulator',
    recommendedAfter: 'kernspin',
  },
  {
    id: 'ortskodierung',
    index: 3,
    title: 'Ortskodierung',
    subtitle: 'Schicht-, Phasen- und Frequenzkodierung durch Gradienten',
    icon: '📐',
    accent: '#34d399',
    simulator: 'gradient',
    simulatorTitle: 'Gradienten-Werkbank',
    recommendedAfter: 'relaxation',
  },
  {
    id: 'kraum',
    index: 4,
    title: 'K-Raum & Fourier',
    subtitle: 'Ortsfrequenzen, Abtastung, Rekonstruktion per FFT',
    icon: '🌀',
    accent: '#f472b6',
    simulator: 'kspace',
    simulatorTitle: 'K-Raum-Studio',
    recommendedAfter: 'ortskodierung',
  },
  {
    id: 'sequenzen',
    index: 5,
    title: 'Pulssequenzen',
    subtitle: 'Spin-Echo, TSE, Inversion Recovery, GRE und EPI',
    icon: '📈',
    accent: '#fbbf24',
    simulator: 'sequence',
    simulatorTitle: 'Sequenz-Designer',
    recommendedAfter: 'kraum',
  },
  {
    id: 'qualitaet',
    index: 6,
    title: 'SNR, SAR & Artefakte',
    subtitle: 'Bildqualität, Patientensicherheit und Fehlersuche',
    icon: '🛡️',
    accent: '#fb7185',
    simulator: 'artifact',
    simulatorTitle: 'Artefakt-Detektiv',
    recommendedAfter: 'sequenzen',
  },
  {
    id: 'hardware',
    index: 7,
    title: 'Gerätetechnik',
    subtitle: 'Magnet, Kryotechnik, Shim, Gradienten- und HF-System',
    icon: '🏥',
    accent: '#22d3ee',
    simulator: 'scanner',
    simulatorTitle: 'Scanner-Explorer',
  },
];

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>;

export const ALL_SIMULATORS: SimulatorId[] = ['larmor', 'relaxation', 'gradient', 'kspace', 'sequence', 'artifact', 'scanner', 'protocol'];
