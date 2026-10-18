import type { Loc } from '../i18n/format';

export type ModuleId = 'einfuehrung' | 'prinzip' | 'bild' | 'anwendungen' | 'fourier' | 'sequenzen' | 'qualitaet';

export type SimulatorId = 'larmor' | 'relaxation' | 'gradient' | 'kspace' | 'sequence' | 'artifact' | 'scanner' | 'protocol' | 'signal' | 'fourier' | 'applications' | 'modality';

export interface ModuleMeta {
  id: ModuleId;
  index: number;
  title: Loc;
  subtitle: Loc;
  icon: string;
  accent: string;
  simulator: SimulatorId;
  simulatorTitle: Loc;
  /** Startansicht einzelner Labore in diesem Kapitel, z. B. { applications: 'cases' } */
  labPresets?: Partial<Record<SimulatorId, string>>;
  /** weitere Labore zum Kapitel, im Simulator-Tab wählbar */
  labs?: SimulatorId[];
  /** exam: Stoff des MBR-Skripts und prüfungsrelevant · bonus: Praxiswissen darüber hinaus */
  track: 'exam' | 'bonus';
  /** Modul, das zuvor mit ≥ 60 % abgeschlossen sein sollte (Empfehlung, kein harter Lock) */
  recommendedAfter?: ModuleId;
}

/** Die Prüfungsmodule folgen Gliederung und Reihenfolge des Vorlesungsskripts. */
const MODULE_LIST: ModuleMeta[] = [
  {
    id: 'einfuehrung',
    index: 1,
    title: { de: 'Einführung: MRT in der Klinik', ru: 'Введение: МРТ в клинике' },
    subtitle: { de: 'Wofür man MRT braucht, was sie besonders gut kann und was dich in diesem Kapitel erwartet', ru: 'Зачем нужна МРТ, что она умеет особенно хорошо и что тебя ждёт в этой главе' },
    icon: '🏥',
    accent: '#22d3ee',
    simulator: 'modality',
    simulatorTitle: { de: 'Modalitäten-Labor', ru: 'Лаборатория методов' },
    labs: ['applications', 'scanner'],
    labPresets: { applications: 'cases' },
    track: 'exam',
  },
  {
    id: 'prinzip',
    index: 2,
    title: { de: 'Physikalisches Prinzip', ru: 'Физический принцип' },
    subtitle: { de: 'Kernspin, Larmor-Frequenz, Bloch-Gleichung, HF-Puls und Relaxation', ru: 'Ядерный спин, частота Лармора, уравнение Блоха, РЧ-импульс и релаксация' },
    icon: '🧲',
    accent: '#38bdf8',
    simulator: 'larmor',
    simulatorTitle: { de: 'Präzessions-Labor', ru: 'Лаборатория прецессии' },
    labs: ['signal', 'relaxation'],
    track: 'exam',
    recommendedAfter: 'einfuehrung',
  },
  {
    id: 'bild',
    index: 3,
    title: { de: 'Vom Signal zum Bild', ru: 'От сигнала к изображению' },
    subtitle: { de: 'Signaldetektion, Gradienten, Gerät und Spulen, k-Raum, Rekonstruktion und Gewichtung', ru: 'Регистрация сигнала, градиенты, аппарат и катушки, k-пространство, реконструкция и взвешивание' },
    icon: '🖼️',
    accent: '#34d399',
    simulator: 'gradient',
    simulatorTitle: { de: 'Gradienten-Werkbank', ru: 'Градиентная мастерская' },
    labs: ['scanner', 'kspace', 'signal', 'relaxation'],
    track: 'exam',
    recommendedAfter: 'prinzip',
  },
  {
    id: 'anwendungen',
    index: 4,
    title: { de: 'Klinische Anwendungen', ru: 'Клиническое применение' },
    subtitle: { de: 'Bildbeispiele, Kontrastmittel, PET/MRT, Fluss, DTI und Spektroskopie', ru: 'Примеры снимков, контрастное вещество, ПЭТ/МРТ, поток, DTI и спектроскопия' },
    icon: '🧬',
    accent: '#c084fc',
    simulator: 'applications',
    simulatorTitle: { de: 'Anwendungs-Labor', ru: 'Лаборатория применения' },
    track: 'exam',
    recommendedAfter: 'bild',
  },
  {
    id: 'fourier',
    index: 5,
    title: { de: 'Fourier-Transformation kompakt', ru: 'Преобразование Фурье кратко' },
    subtitle: { de: 'Der Anhang des Skripts: Reihe, Testfunktion, Koeffizienten, DFT, Linearität und Faltung', ru: 'Приложение конспекта: ряд, тестовая функция, коэффициенты, ДПФ, линейность и свёртка' },
    icon: '〰️',
    accent: '#f472b6',
    simulator: 'fourier',
    simulatorTitle: { de: 'Fourier-Werkstatt', ru: 'Мастерская Фурье' },
    labs: ['kspace'],
    track: 'exam',
    recommendedAfter: 'anwendungen',
  },
  {
    id: 'sequenzen',
    index: 6,
    title: { de: 'Pulssequenzen', ru: 'Импульсные последовательности' },
    subtitle: { de: 'Bonus: Spin-Echo, TSE, Inversion Recovery, GRE und EPI', ru: 'Бонус: спин-эхо, TSE, инверсия-восстановление, GRE и EPI' },
    icon: '📈',
    accent: '#fbbf24',
    simulator: 'sequence',
    simulatorTitle: { de: 'Sequenz-Designer', ru: 'Конструктор последовательностей' },
    track: 'bonus',
  },
  {
    id: 'qualitaet',
    index: 7,
    title: { de: 'SNR, SAR & Artefakte', ru: 'SNR, SAR и артефакты' },
    subtitle: { de: 'Bonus: Bildqualität, Patientensicherheit und Fehlersuche', ru: 'Бонус: качество изображения, безопасность пациента и поиск ошибок' },
    icon: '🛡️',
    accent: '#fb7185',
    simulator: 'artifact',
    simulatorTitle: { de: 'Artefakt-Detektiv', ru: 'Детектив артефактов' },
    labs: ['protocol'],
    track: 'bonus',
    recommendedAfter: 'sequenzen',
  },
];

/** Lernpfad in Reihenfolge: zuerst der Prüfungsstoff, danach die Bonus-Module. */
export const MODULES = [...MODULE_LIST].sort((a, b) => a.index - b.index);
export const EXAM_MODULES = MODULES.filter((m) => m.track === 'exam');
export const BONUS_MODULES = MODULES.filter((m) => m.track === 'bonus');

export const MODULE_BY_ID = Object.fromEntries(MODULES.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>;

export const ALL_SIMULATORS: SimulatorId[] = ['larmor', 'relaxation', 'gradient', 'kspace', 'sequence', 'artifact', 'scanner', 'protocol', 'signal', 'fourier', 'applications', 'modality'];
