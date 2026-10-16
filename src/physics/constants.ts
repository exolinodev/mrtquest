/**
 * Physikalische Konstanten und Referenzwerte für die MRT-Simulationen.
 *
 * Quellen der Größenordnungen (gerundet, didaktisch vereinfacht):
 * - Gyromagnetische Verhältnisse: CODATA / NIST
 * - Relaxationszeiten: Stanisz et al., MRM 54:507 (2005); Bojorquez et al., MRI 35:69 (2017)
 * - SAR-Grenzwerte: IEC 60601-2-33 (Ganzkörper, 6-min-Mittelung)
 */

export const PLANCK = 6.62607015e-34; // J·s
export const HBAR = PLANCK / (2 * Math.PI);
export const BOLTZMANN = 1.380649e-23; // J/K
export const BODY_TEMPERATURE_K = 310;

/** Chemische Verschiebung Fett–Wasser (Hauptpeak der Methylengruppen) in ppm. */
export const FAT_WATER_SHIFT_PPM = 3.5;

export interface Nucleus {
  id: string;
  label: string;
  /** γ/2π in MHz/T */
  gammaBar: number;
  spin: string;
  /** natürliche Häufigkeit in % */
  abundance: number;
  /** relative Sensitivität gegenüber ¹H bei gleicher Feldstärke und Teilchenzahl */
  relSensitivity: number;
  note: string;
}

export const NUCLEI: Nucleus[] = [
  {
    id: 'H1',
    label: '¹H (Proton)',
    gammaBar: 42.577,
    spin: '1/2',
    abundance: 99.98,
    relSensitivity: 1,
    note: 'Standard der klinischen MRT: in Wasser und Fett allgegenwärtig, höchstes γ aller stabilen Kerne.',
  },
  {
    id: 'F19',
    label: '¹⁹F',
    gammaBar: 40.052,
    spin: '1/2',
    abundance: 100,
    relSensitivity: 0.83,
    note: 'Kaum endogen vorhanden – ideal für Kontrastmittel- und Tracer-Bildgebung ohne Hintergrund.',
  },
  {
    id: 'P31',
    label: '³¹P',
    gammaBar: 17.235,
    spin: '1/2',
    abundance: 100,
    relSensitivity: 0.066,
    note: 'Spektroskopie des Energiestoffwechsels (ATP, Phosphokreatin), z. B. im Muskel.',
  },
  {
    id: 'Na23',
    label: '²³Na',
    gammaBar: 11.262,
    spin: '3/2',
    abundance: 100,
    relSensitivity: 0.093,
    note: 'Natrium-Bildgebung: Marker für Zellintegrität, sehr kurze T2-Komponenten.',
  },
  {
    id: 'C13',
    label: '¹³C',
    gammaBar: 10.708,
    spin: '1/2',
    abundance: 1.1,
    relSensitivity: 0.016,
    note: 'Geringe natürliche Häufigkeit; mit Hyperpolarisation für Stoffwechsel-Bildgebung nutzbar.',
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
  label: string;
  color: string;
  params: Record<FieldStrength, TissueParams>;
}

export const TISSUES: Record<TissueId, Tissue> = {
  wm: {
    id: 'wm',
    label: 'Weiße Substanz',
    color: '#e2e8f0',
    params: {
      1.5: { t1: 780, t2: 80, t2star: 55, pd: 0.69 },
      3: { t1: 1080, t2: 70, t2star: 45, pd: 0.69 },
    },
  },
  gm: {
    id: 'gm',
    label: 'Graue Substanz',
    color: '#94a3b8',
    params: {
      1.5: { t1: 1100, t2: 95, t2star: 65, pd: 0.8 },
      3: { t1: 1600, t2: 90, t2star: 55, pd: 0.8 },
    },
  },
  csf: {
    id: 'csf',
    label: 'Liquor (CSF)',
    color: '#38bdf8',
    params: {
      1.5: { t1: 4000, t2: 2000, t2star: 1000, pd: 1.0 },
      3: { t1: 4300, t2: 1800, t2star: 800, pd: 1.0 },
    },
  },
  fat: {
    id: 'fat',
    label: 'Fettgewebe',
    color: '#facc15',
    params: {
      1.5: { t1: 260, t2: 85, t2star: 40, pd: 0.9 },
      3: { t1: 370, t2: 75, t2star: 30, pd: 0.9 },
    },
  },
  muscle: {
    id: 'muscle',
    label: 'Muskel',
    color: '#f87171',
    params: {
      1.5: { t1: 1000, t2: 44, t2star: 30, pd: 0.75 },
      3: { t1: 1410, t2: 50, t2star: 25, pd: 0.75 },
    },
  },
  liver: {
    id: 'liver',
    label: 'Leber',
    color: '#fb923c',
    params: {
      1.5: { t1: 580, t2: 46, t2star: 30, pd: 0.75 },
      3: { t1: 810, t2: 34, t2star: 20, pd: 0.75 },
    },
  },
  lesion: {
    id: 'lesion',
    label: 'Läsion / Ödem',
    color: '#c084fc',
    params: {
      1.5: { t1: 1350, t2: 180, t2star: 110, pd: 0.86 },
      3: { t1: 1750, t2: 160, t2star: 90, pd: 0.86 },
    },
  },
  blood: {
    id: 'blood',
    label: 'Blut (venös)',
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
