import type { Loc } from '../i18n/format';

export type ModuleId = 'kernspin' | 'relaxation' | 'ortskodierung' | 'kraum' | 'hardware' | 'anwendungen' | 'sequenzen' | 'qualitaet';

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
  /** exam: Stoff des MBR-Skripts und prüfungsrelevant · bonus: Praxiswissen darüber hinaus */
  track: 'exam' | 'bonus';
  /** Modul, das zuvor mit ≥ 60 % abgeschlossen sein sollte (Empfehlung, kein harter Lock) */
  recommendedAfter?: ModuleId;
}

const MODULE_LIST: ModuleMeta[] = [
  {
    id: 'kernspin',
    index: 1,
    title: { de: 'Kernspin & Resonanz', ru: 'Ядерный спин и резонанс' },
    subtitle: { de: 'Warum Protonen ein Signal liefern: Spin, Larmor, Bloch und HF-Puls', ru: 'Почему протоны дают сигнал: спин, Лармор, Блох и РЧ-импульс' },
    icon: '🧲',
    accent: '#38bdf8',
    simulator: 'larmor',
    simulatorTitle: { de: 'Präzessions-Labor', ru: 'Лаборатория прецессии' },
    track: 'exam',
  },
  {
    id: 'relaxation',
    index: 2,
    title: { de: 'Relaxation & Kontrast', ru: 'Релаксация и контраст' },
    subtitle: { de: 'T1, T2, T2* und wie daraus PD-, T1- und T2-Bilder werden', ru: 'T1, T2, T2* и как из них получаются PD-, T1- и T2-изображения' },
    icon: '⏳',
    accent: '#a78bfa',
    simulator: 'relaxation',
    simulatorTitle: { de: 'Relaxations-Simulator', ru: 'Симулятор релаксации' },
    track: 'exam',
    recommendedAfter: 'kernspin',
  },
  {
    id: 'ortskodierung',
    index: 3,
    title: { de: 'Ortskodierung', ru: 'Пространственное кодирование' },
    subtitle: { de: 'Wie Gradienten jedem Ort eine eigene Frequenz und Phase geben', ru: 'Как градиенты дают каждой точке свою частоту и фазу' },
    icon: '📐',
    accent: '#34d399',
    simulator: 'gradient',
    simulatorTitle: { de: 'Gradienten-Werkbank', ru: 'Градиентная мастерская' },
    track: 'exam',
    recommendedAfter: 'relaxation',
  },
  {
    id: 'kraum',
    index: 4,
    title: { de: 'Fourier & k-Raum', ru: 'Фурье и k-пространство' },
    subtitle: { de: 'Vom gemessenen Signal zum Bild: Fourier, k-Raum und Rekonstruktion', ru: 'От измеренного сигнала к изображению: Фурье, k-пространство и реконструкция' },
    icon: '🌀',
    accent: '#f472b6',
    simulator: 'kspace',
    simulatorTitle: { de: 'K-Raum-Studio', ru: 'Студия k-пространства' },
    track: 'exam',
    recommendedAfter: 'ortskodierung',
  },
  {
    id: 'sequenzen',
    index: 7,
    title: { de: 'Pulssequenzen', ru: 'Импульсные последовательности' },
    subtitle: { de: 'Bonus: Spin-Echo, TSE, Inversion Recovery, GRE und EPI', ru: 'Бонус: спин-эхо, TSE, инверсия-восстановление, GRE и EPI' },
    icon: '📈',
    accent: '#fbbf24',
    simulator: 'sequence',
    simulatorTitle: { de: 'Sequenz-Designer', ru: 'Конструктор последовательностей' },
    track: 'bonus',
    recommendedAfter: 'anwendungen',
  },
  {
    id: 'qualitaet',
    index: 8,
    title: { de: 'SNR, SAR & Artefakte', ru: 'SNR, SAR и артефакты' },
    subtitle: { de: 'Bonus: Bildqualität, Patientensicherheit und Fehlersuche', ru: 'Бонус: качество изображения, безопасность пациента и поиск ошибок' },
    icon: '🛡️',
    accent: '#fb7185',
    simulator: 'artifact',
    simulatorTitle: { de: 'Artefakt-Detektiv', ru: 'Детектив артефактов' },
    track: 'bonus',
    recommendedAfter: 'sequenzen',
  },
  {
    id: 'hardware',
    index: 5,
    title: { de: 'Gerätetechnik', ru: 'Оборудование МРТ' },
    subtitle: { de: 'Magnet, Gradienten, HF-Sender, Spulen und die Signalkette', ru: 'Магнит, градиенты, РЧ-передатчик, катушки и сигнальная цепь' },
    icon: '🏥',
    accent: '#22d3ee',
    simulator: 'scanner',
    simulatorTitle: { de: 'Scanner-Explorer', ru: 'Исследователь сканера' },
    track: 'exam',
    recommendedAfter: 'kraum',
  },
  {
    id: 'anwendungen',
    index: 6,
    title: { de: 'Anwendungen & Klinik', ru: 'Применение и клиника' },
    subtitle: { de: 'Wofür man MRT einsetzt: Indikationen, Kontrastmittel, Fluss, DTI und Spektroskopie', ru: 'Для чего применяют МРТ: показания, контраст, поток, DTI и спектроскопия' },
    icon: '🧬',
    accent: '#c084fc',
    simulator: 'applications',
    simulatorTitle: { de: 'Anwendungs-Labor', ru: 'Лаборатория применения' },
    track: 'exam',
    recommendedAfter: 'hardware',
  },
];

/** Lernpfad in Reihenfolge: zuerst der Prüfungsstoff, danach die Bonus-Module. */
export const MODULES = [...MODULE_LIST].sort((a, b) => a.index - b.index);
export const EXAM_MODULES = MODULES.filter((m) => m.track === 'exam');
export const BONUS_MODULES = MODULES.filter((m) => m.track === 'bonus');

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>;

export const ALL_SIMULATORS: SimulatorId[] = ['larmor', 'relaxation', 'gradient', 'kspace', 'sequence', 'artifact', 'scanner', 'protocol', 'signal', 'fourier', 'applications'];
