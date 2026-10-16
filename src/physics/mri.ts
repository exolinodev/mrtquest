/**
 * Kernformeln der MR-Physik. Alle Funktionen sind rein (seiteneffektfrei)
 * und werden sowohl von den Simulatoren als auch von den Rechen-Puzzles genutzt.
 *
 * Einheiten-Konvention: Zeiten in ms, Felder in T, Gradienten in mT/m,
 * Frequenzen in Hz (sofern nicht anders im Namen angegeben), Längen in mm.
 */
import { numberLocale } from '../i18n/format';
import { BODY_TEMPERATURE_K, BOLTZMANN, FAT_WATER_SHIFT_PPM, PLANCK, type TissueParams } from './constants';

export const GAMMA_BAR_H1 = 42.577; // MHz/T

// ---------------------------------------------------------------- Kernspin

/** Larmor-Frequenz f₀ = γ̄·B₀ in MHz. */
export function larmorMHz(b0: number, gammaBar = GAMMA_BAR_H1): number {
  return gammaBar * b0;
}

/** Kreisfrequenz ω₀ = γ·B₀ in rad/s. */
export function larmorAngular(b0: number, gammaBar = GAMMA_BAR_H1): number {
  return 2 * Math.PI * gammaBar * 1e6 * b0;
}

/** Energiedifferenz der beiden Spinzustände ΔE = h·f₀ in J. */
export function zeemanEnergy(b0: number, gammaBar = GAMMA_BAR_H1): number {
  return PLANCK * larmorMHz(b0, gammaBar) * 1e6;
}

/**
 * Relativer Spinüberschuss (N↑ − N↓)/N für Spin-½ in Hochtemperaturnäherung:
 * ΔN/N ≈ ΔE / (2kT).
 */
export function spinExcess(b0: number, gammaBar = GAMMA_BAR_H1, temperatureK = BODY_TEMPERATURE_K): number {
  return zeemanEnergy(b0, gammaBar) / (2 * BOLTZMANN * temperatureK);
}

// ---------------------------------------------------------------- Relaxation

/** Längsmagnetisierung nach einem 90°-Puls (Start Mz = 0). */
export function mzAfter90(t: number, t1: number, m0 = 1): number {
  return m0 * (1 - Math.exp(-t / t1));
}

/** Längsmagnetisierung nach einem 180°-Inversionspuls (Start Mz = −M₀). */
export function mzAfterInversion(t: number, t1: number, m0 = 1): number {
  return m0 * (1 - 2 * Math.exp(-t / t1));
}

/** Quermagnetisierung, Zerfall mit T2 (oder T2*). */
export function mxyDecay(t: number, t2: number, m0 = 1): number {
  return m0 * Math.exp(-t / t2);
}

/** 1/T2* = 1/T2 + γ·ΔB₀ (ΔB₀ in µT, Ergebnis in ms). */
export function t2StarFromInhomogeneity(t2: number, deltaB0_uT: number, gammaBar = GAMMA_BAR_H1): number {
  const gamma = 2 * Math.PI * gammaBar * 1e6; // rad/(s·T)
  const r2prime = gamma * deltaB0_uT * 1e-6; // 1/s
  return 1 / (1 / t2 + r2prime / 1000);
}

// ---------------------------------------------------------------- Signalgleichungen

/** Spin-Echo: S = PD·(1 − e^(−TR/T1))·e^(−TE/T2)   (Näherung für TR ≫ TE). */
export function spinEchoSignal(p: TissueParams, tr: number, te: number): number {
  return p.pd * (1 - Math.exp(-tr / p.t1)) * Math.exp(-te / p.t2);
}

/** Inversion Recovery (Betragsbild): S = PD·|1 − 2e^(−TI/T1) + e^(−TR/T1)|·e^(−TE/T2). */
export function inversionRecoverySignal(p: TissueParams, tr: number, te: number, ti: number, magnitude = true): number {
  const mz = 1 - 2 * Math.exp(-ti / p.t1) + Math.exp(-tr / p.t1);
  return p.pd * (magnitude ? Math.abs(mz) : mz) * Math.exp(-te / p.t2);
}

/** Gespoiltes Gradientenecho (FLASH): S = PD·sin α·(1 − E1)/(1 − cos α·E1)·e^(−TE/T2*). */
export function spoiledGreSignal(p: TissueParams, tr: number, te: number, flipDeg: number): number {
  const a = (flipDeg * Math.PI) / 180;
  const e1 = Math.exp(-tr / p.t1);
  return (p.pd * Math.sin(a) * (1 - e1)) / (1 - Math.cos(a) * e1) * Math.exp(-te / p.t2star);
}

/** Ernst-Winkel: Flipwinkel maximalen Signals im gespoilten GRE, in Grad. */
export function ernstAngleDeg(tr: number, t1: number): number {
  return (Math.acos(Math.exp(-tr / t1)) * 180) / Math.PI;
}

/** Inversionszeit, bei der ein Gewebe genullt wird: TI = T1·ln(2 / (1 + e^(−TR/T1))). */
export function nullPointTI(t1: number, tr = Infinity): number {
  const e = Number.isFinite(tr) ? Math.exp(-tr / t1) : 0;
  return t1 * Math.log(2 / (1 + e));
}

// ---------------------------------------------------------------- Ortskodierung

/** Frequenzänderung pro Meter: γ̄·G in Hz/m (G in mT/m). */
export function hzPerMeter(gradient_mT_m: number, gammaBar = GAMMA_BAR_H1): number {
  return gammaBar * 1e6 * gradient_mT_m * 1e-3;
}

/** Schichtdicke Δz = Δf_RF / (γ̄·G_s) in mm. */
export function sliceThicknessMm(rfBandwidthHz: number, gradient_mT_m: number, gammaBar = GAMMA_BAR_H1): number {
  return (rfBandwidthHz / hzPerMeter(gradient_mT_m, gammaBar)) * 1000;
}

/** Benötigter Schichtgradient für eine gewünschte Schichtdicke in mT/m. */
export function gradientForSlice(rfBandwidthHz: number, thicknessMm: number, gammaBar = GAMMA_BAR_H1): number {
  return rfBandwidthHz / (gammaBar * 1e6 * (thicknessMm / 1000)) * 1e3;
}

/** Schichtposition z = Δf_offset / (γ̄·G_s) in mm. */
export function slicePositionMm(offsetHz: number, gradient_mT_m: number, gammaBar = GAMMA_BAR_H1): number {
  return (offsetHz / hzPerMeter(gradient_mT_m, gammaBar)) * 1000;
}

/** Field of View in Ausleserichtung: FOV = BW_gesamt / (γ̄·G_x) in mm. */
export function readoutFovMm(totalBandwidthHz: number, gradient_mT_m: number, gammaBar = GAMMA_BAR_H1): number {
  return (totalBandwidthHz / hzPerMeter(gradient_mT_m, gammaBar)) * 1000;
}

/** k-Raum-Abstand Δk = 1/FOV in 1/m (FOV in mm). */
export function deltaK(fovMm: number): number {
  return 1 / (fovMm / 1000);
}

/** Maximale Ortsfrequenz k_max = N/(2·FOV) in 1/m. */
export function kMax(fovMm: number, matrix: number): number {
  return matrix / (2 * (fovMm / 1000));
}

/** Pixelgröße Δx = FOV/N in mm. */
export function pixelSizeMm(fovMm: number, matrix: number): number {
  return fovMm / matrix;
}

/** Phasenwinkel (in Grad) eines Spins an Ort y nach Phasenkodier-Gradientenmoment. */
export function phaseEncodeAngleDeg(gradient_mT_m: number, durationMs: number, yMm: number, gammaBar = GAMMA_BAR_H1): number {
  const cycles = hzPerMeter(gradient_mT_m, gammaBar) * (yMm / 1000) * (durationMs / 1000);
  return cycles * 360;
}

// ---------------------------------------------------------------- Artefakte

/** Chemische Verschiebung Fett–Wasser in Hz. */
export function chemicalShiftHz(b0: number, ppm = FAT_WATER_SHIFT_PPM): number {
  return larmorMHz(b0) * ppm; // MHz · ppm = Hz
}

/** Fett-Wasser-Versatz in Pixeln in Ausleserichtung. */
export function chemicalShiftPixels(b0: number, bandwidthPerPixelHz: number): number {
  return chemicalShiftHz(b0) / bandwidthPerPixelHz;
}

/** Echozeiten, bei denen Fett und Wasser gegenphasig (opposed) bzw. in Phase sind, in ms. */
export function fatWaterPhaseTimes(b0: number): { opposed: number; inPhase: number } {
  const period = 1000 / chemicalShiftHz(b0);
  return { opposed: period / 2, inPhase: period };
}

/** Echo-Abstand eines EPI-Readouts in ms (Rampen pauschal 0,2 ms). */
export function epiEchoSpacingMs(bandwidthPerPixelHz: number): number {
  return 1000 / bandwidthPerPixelHz + 0.2;
}

/** Bandbreite pro Pixel in Phasenrichtung bei EPI in Hz. */
export function epiPhaseBandwidthPerPixel(echoSpacingMs: number, phaseLines: number, acceleration = 1): number {
  return 1000 / (echoSpacingMs * (phaseLines / acceleration));
}

// ---------------------------------------------------------------- Messzeit, SNR, SAR

/** 2D-Messzeit TA = TR·N_PE·NEX/(ETL·R) in s. */
export function scanTimeSeconds(trMs: number, phaseLines: number, nex: number, etl = 1, acceleration = 1, concatenations = 1): number {
  return (trMs * phaseLines * nex * concatenations) / (etl * acceleration) / 1000;
}

/**
 * Relatives SNR (ohne Gewebesignal):
 * SNR ∝ B₀ · V_Voxel · √(N_PE · NEX / BW_px) / (g·√R)
 */
export function relativeSnr(opts: {
  b0: number;
  voxelVolumeMm3: number;
  phaseLines: number;
  nex: number;
  bandwidthPerPixelHz: number;
  acceleration?: number;
  gFactor?: number;
  coilGain?: number;
}): number {
  const { b0, voxelVolumeMm3, phaseLines, nex, bandwidthPerPixelHz, acceleration = 1, gFactor = 1, coilGain = 1 } = opts;
  return (b0 * voxelVolumeMm3 * Math.sqrt((phaseLines * nex) / bandwidthPerPixelHz) * coilGain) / (gFactor * Math.sqrt(acceleration));
}

/** Empirischer g-Faktor-Verlauf moderner Mehrkanalspulen. */
export function gFactor(acceleration: number): number {
  return 1 + 0.06 * (acceleration - 1) ** 2;
}

/**
 * Vereinfachtes SAR-Modell: SAR ∝ B₀² · Σ(α/90°)² · Pulse/s.
 * Die Konstante ist so kalibriert, dass ein T2-TSE bei 1,5 T mit typischen Parametern
 * etwa 1–2 W/kg erreicht.
 */
export const SAR_CONSTANT = 0.0018; // W/kg pro (Normpuls/s) bei 1 T²

export function sarWkg(opts: {
  b0: number;
  pulsesPerSecond: Array<{ flipDeg: number; ratePerSecond: number }>;
  patientFactor?: number;
}): number {
  const { b0, pulsesPerSecond, patientFactor = 1 } = opts;
  const energy = pulsesPerSecond.reduce((sum, p) => sum + (p.flipDeg / 90) ** 2 * p.ratePerSecond, 0);
  return SAR_CONSTANT * b0 * b0 * energy * patientFactor;
}

/** Wie stark ändert sich SAR bei Feld- und Flipwinkeländerung? Faktor relativ. */
export function sarScaling(b0Ratio: number, flipRatio: number): number {
  return b0Ratio ** 2 * flipRatio ** 2;
}

// ---------------------------------------------------------------- Hilfsfunktionen

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/** Formatiert Zahlen in der aktiven Sprache mit begrenzter Anzahl Nachkommastellen. */
export function fmt(v: number, digits = 2): string {
  if (!Number.isFinite(v)) return '–';
  return v.toLocaleString(numberLocale(), { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

/** Formatiert Sekunden als m:ss. */
export function fmtDuration(seconds: number): string {
  if (!Number.isFinite(seconds)) return '–';
  const s = Math.round(seconds);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')} ${numberLocale() === 'uk-UA' ? 'хв' : 'min'}`;
}
