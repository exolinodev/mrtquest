/**
 * Physikalische Konstanten und Referenzwerte für die MRT-Simulationen.
 *
 * Quellen der Größenordnungen (gerundet, didaktisch vereinfacht):
 * - Gyromagnetische Verhältnisse: CODATA / NIST
 * - Relaxationszeiten: Stanisz et al., MRM 54:507 (2005); Bojorquez et al., MRI 35:69 (2017)
 * - SAR-Grenzwerte: IEC 60601-2-33 (Ganzkörper, 6-min-Mittelung)
 */
import type { Loc } from '../i18n/format';

export const PLANCK = 6.62607015e-34; // J·s
export const HBAR = PLANCK / (2 * Math.PI);
export const BOLTZMANN = 1.380649e-23; // J/K
export const BODY_TEMPERATURE_K = 310;

/** Chemische Verschiebung Fett–Wasser (Hauptpeak der Methylengruppen) in ppm. */
export const FAT_WATER_SHIFT_PPM = 3.5;

export interface Nucleus {
  id: string;
  /** Kurzsymbol, z. B. ¹H */
  symbol: string;
  label: Loc;
  /** γ/2π in MHz/T */
  gammaBar: number;
  spin: string;
  /** natürliche Häufigkeit in % */
  abundance: number;
  /** relative Sensitivität gegenüber ¹H bei gleicher Feldstärke und Teilchenzahl */
  relSensitivity: number;
  note: Loc;
}

export const NUCLEI: Nucleus[] = [
  {
    id: 'H1',
    symbol: '¹H',
    label: { de: '¹H (Proton)', uk: '¹H (протон)' },
    gammaBar: 42.577,
    spin: '1/2',
    abundance: 99.98,
    relSensitivity: 1,
    note: {
      de: 'Standard der klinischen MRT: in Wasser und Fett allgegenwärtig, höchstes γ aller stabilen Kerne.',
      uk: 'Стандарт клінічної МРТ: присутній усюди у воді та жирі, найвище γ серед стабільних ядер.',
    },
  },
  {
    id: 'F19',
    symbol: '¹⁹F',
    label: { de: '¹⁹F', uk: '¹⁹F' },
    gammaBar: 40.052,
    spin: '1/2',
    abundance: 100,
    relSensitivity: 0.83,
    note: {
      de: 'Kaum endogen vorhanden – ideal für Kontrastmittel- und Tracer-Bildgebung ohne Hintergrund.',
      uk: 'Майже відсутній в організмі – ідеальний для візуалізації контрастних речовин і трейсерів без фону.',
    },
  },
  {
    id: 'P31',
    symbol: '³¹P',
    label: { de: '³¹P', uk: '³¹P' },
    gammaBar: 17.235,
    spin: '1/2',
    abundance: 100,
    relSensitivity: 0.066,
    note: {
      de: 'Spektroskopie des Energiestoffwechsels (ATP, Phosphokreatin), z. B. im Muskel.',
      uk: "Спектроскопія енергетичного обміну (АТФ, фосфокреатин), напр. у м’язах.",
    },
  },
  {
    id: 'Na23',
    symbol: '²³Na',
    label: { de: '²³Na', uk: '²³Na' },
    gammaBar: 11.262,
    spin: '3/2',
    abundance: 100,
    relSensitivity: 0.093,
    note: {
      de: 'Natrium-Bildgebung: Marker für Zellintegrität, sehr kurze T2-Komponenten.',
      uk: 'Натрієва візуалізація: маркер цілісності клітин, дуже короткі T2-компоненти.',
    },
  },
  {
    id: 'C13',
    symbol: '¹³C',
    label: { de: '¹³C', uk: '¹³C' },
    gammaBar: 10.708,
    spin: '1/2',
    abundance: 1.1,
    relSensitivity: 0.016,
    note: {
      de: 'Geringe natürliche Häufigkeit; mit Hyperpolarisation für Stoffwechsel-Bildgebung nutzbar.',
      uk: 'Низька природна поширеність; з гіперполяризацією придатний для метаболічної візуалізації.',
    },
  },
];

export type FieldStrength = 1.5 | 3;

export type TissueId = 'wm' | 'gm' | 'csf' | 'fat' | 'muscle' | 'liver' | 'lesion' | 'blood';

export interface TissueParams {
  /** Längsrelaxationszeit in ms */
  t1: number;
  /** Querrelaxationszeit in ms */
  t2: number;
  /** effektive Querrelaxation inkl. Feldinhomogenitäten in ms */
  t2star: number;
  /** relative Protonendichte (0..1) */
  pd: number;
}

export interface Tissue {
  id: TissueId;
  label: Loc;
  color: string;
  params: Record<FieldStrength, TissueParams>;
}

export const TISSUES: Record<TissueId, Tissue> = {
  wm: {
    id: 'wm',
    label: { de: 'Weiße Substanz', uk: 'Біла речовина' },
    color: '#e2e8f0',
    params: {
      1.5: { t1: 780, t2: 80, t2star: 55, pd: 0.69 },
      3: { t1: 1080, t2: 70, t2star: 45, pd: 0.69 },
    },
  },
  gm: {
    id: 'gm',
    label: { de: 'Graue Substanz', uk: 'Сіра речовина' },
    color: '#94a3b8',
    params: {
      1.5: { t1: 1100, t2: 95, t2star: 65, pd: 0.8 },
      3: { t1: 1600, t2: 90, t2star: 55, pd: 0.8 },
    },
  },
  csf: {
    id: 'csf',
    label: { de: 'Liquor (CSF)', uk: 'Ліквор (СМР)' },
    color: '#38bdf8',
    params: {
      1.5: { t1: 4000, t2: 2000, t2star: 1000, pd: 1.0 },
      3: { t1: 4300, t2: 1800, t2star: 800, pd: 1.0 },
    },
  },
  fat: {
    id: 'fat',
    label: { de: 'Fettgewebe', uk: 'Жирова тканина' },
    color: '#facc15',
    params: {
      1.5: { t1: 260, t2: 85, t2star: 40, pd: 0.9 },
      3: { t1: 370, t2: 75, t2star: 30, pd: 0.9 },
    },
  },
  muscle: {
    id: 'muscle',
    label: { de: 'Muskel', uk: "М’яз" },
    color: '#f87171',
    params: {
      1.5: { t1: 1000, t2: 44, t2star: 30, pd: 0.75 },
      3: { t1: 1410, t2: 50, t2star: 25, pd: 0.75 },
    },
  },
  liver: {
    id: 'liver',
    label: { de: 'Leber', uk: 'Печінка' },
    color: '#fb923c',
    params: {
      1.5: { t1: 580, t2: 46, t2star: 30, pd: 0.75 },
      3: { t1: 810, t2: 34, t2star: 20, pd: 0.75 },
    },
  },
  lesion: {
    id: 'lesion',
    label: { de: 'Läsion / Ödem', uk: 'Вогнище / набряк' },
    color: '#c084fc',
    params: {
      1.5: { t1: 1350, t2: 180, t2star: 110, pd: 0.86 },
      3: { t1: 1750, t2: 160, t2star: 90, pd: 0.86 },
    },
  },
  blood: {
    id: 'blood',
    label: { de: 'Blut (venös)', uk: 'Кров (венозна)' },
    color: '#fb7185',
    params: {
      1.5: { t1: 1440, t2: 180, t2star: 60, pd: 0.85 },
      3: { t1: 1930, t2: 100, t2star: 30, pd: 0.85 },
    },
  },
};

export const TISSUE_IDS = Object.keys(TISSUES) as TissueId[];

/** SAR-Grenzwerte nach IEC 60601-2-33 (Ganzkörper, gemittelt über 6 min) in W/kg. */
export const SAR_LIMITS = {
  wholeBodyNormal: 2,
  wholeBodyFirstLevel: 4,
  headAnyMode: 3.2,
  localHeadTrunkNormal: 10,
  localExtremitiesNormal: 20,
} as const;

/** Typische Hardware-Kennzahlen eines klinischen Ganzkörperscanners. */
export const HARDWARE = {
  maxGradient_mT_per_m: 45,
  maxSlewRate_T_per_m_s: 200,
  heliumBoilingPointK: 4.2,
  nbtiCriticalTempK: 9.2,
} as const;
