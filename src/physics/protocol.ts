/**
 * Protokollmodell eines virtuellen MR-Scanners.
 * Berechnet aus Sequenzparametern Kontrast, SNR, Messzeit, SAR und Artefaktrisiken
 * und synthetisiert daraus ein Bild inkl. typischer Artefakte.
 */
import type { Loc } from '../i18n/format';
import { TISSUES, type FieldStrength, type TissueId, type TissueParams } from './constants';
import { imageToKSpace, kSpaceToImage, magnitude } from './fft';
import {
  chemicalShiftHz,
  chemicalShiftPixels,
  clamp,
  epiEchoSpacingMs,
  epiPhaseBandwidthPerPixel,
  gFactor,
  inversionRecoverySignal,
  larmorMHz,
  nullPointTI,
  relativeSnr,
  sarWkg,
  spinEchoSignal,
  spoiledGreSignal,
} from './mri';
import { fatMask, gaussian, getPhantom, renderPhantom, seededRandom, type PhantomId } from './phantom';

export type SequenceType = 'SE' | 'TSE' | 'IR' | 'GRE' | 'EPI';

export const SEQUENCE_LABELS: Record<SequenceType, Loc> = {
  SE: { de: 'Spin-Echo (SE)', ru: 'Спин-эхо (SE)' },
  TSE: { de: 'Turbo-Spin-Echo (TSE)', ru: 'Турбо-спин-эхо (TSE)' },
  IR: { de: 'Inversion Recovery (IR-TSE)', ru: 'Инверсия-восстановление (IR-TSE)' },
  GRE: { de: 'Gradientenecho (FLASH)', ru: 'Градиентное эхо (FLASH)' },
  EPI: { de: 'Echo-Planar (SE-EPI)', ru: 'Эхопланарная (SE-EPI)' },
};

export interface Protocol {
  sequence: SequenceType;
  field: FieldStrength;
  tr: number;
  te: number;
  ti: number;
  /** Anregungs-Flipwinkel (GRE) in Grad */
  flip: number;
  /** Refokussierungswinkel (SE/TSE/IR/EPI) in Grad */
  refocusFlip: number;
  etl: number;
  fovRead: number;
  fovPhase: number;
  matrixRead: number;
  matrixPhase: number;
  sliceThickness: number;
  slices: number;
  nex: number;
  bandwidthPerPixel: number;
  /** Parallele Bildgebung (GRAPPA/SENSE) Beschleunigungsfaktor */
  acceleration: number;
  /** Phasen-Oversampling in % */
  phaseOversampling: number;
  fatSat: boolean;
}

export const DEFAULT_PROTOCOL: Protocol = {
  sequence: 'TSE',
  field: 1.5,
  tr: 4000,
  te: 100,
  ti: 2200,
  flip: 70,
  refocusFlip: 180,
  etl: 16,
  fovRead: 230,
  fovPhase: 230,
  matrixRead: 256,
  matrixPhase: 256,
  sliceThickness: 5,
  slices: 24,
  nex: 1,
  bandwidthPerPixel: 200,
  acceleration: 1,
  phaseOversampling: 0,
  fatSat: false,
};

export interface AnatomyContext {
  phantom: PhantomId;
  /** Spulen-Empfindlichkeit relativ zur Kopfspule */
  coilGain: number;
  /** Referenzgewebe für SNR-Angaben */
  referenceTissue: TissueId;
  /** tolerierbare Messzeit ohne Bewegungsartefakte (s) */
  motionToleranceS: number;
}

export const ANATOMY: Record<PhantomId, AnatomyContext> = {
  brain: { phantom: 'brain', coilGain: 1, referenceTissue: 'wm', motionToleranceS: 360 },
  knee: { phantom: 'knee', coilGain: 1.4, referenceTissue: 'muscle', motionToleranceS: 420 },
  abdomen: { phantom: 'abdomen', coilGain: 0.75, referenceTissue: 'liver', motionToleranceS: 20 },
};

const SNR_NORMALISATION = 30;
/** Rasterauflösung der synthetischen Bilder */
export const SYNTH_SIZE = 256;
const RF_OVERHEAD_MS = 6;

// ---------------------------------------------------------------- Kontrast

/** Signal eines Gewebes für ein gegebenes Protokoll (ohne Rauschen, relative Einheiten). */
export function tissueSignal(p: TissueParams, tissue: TissueId, protocol: Protocol): number {
  const { sequence, tr, te, ti, flip } = protocol;
  // J-Kopplungs-Aufhebung in Echozügen: Fett erscheint in TSE heller als im konventionellen SE.
  const params = tissue === 'fat' && (sequence === 'TSE' || sequence === 'IR') ? { ...p, t2: p.t2 * 1.6 } : p;
  let s: number;
  switch (sequence) {
    case 'SE':
    case 'TSE':
    case 'EPI':
      s = spinEchoSignal(params, tr, te);
      break;
    case 'IR':
      s = inversionRecoverySignal(params, tr, te, ti);
      break;
    case 'GRE':
      s = spoiledGreSignal(params, tr, te, flip);
      break;
  }
  if (protocol.fatSat && tissue === 'fat') s *= 0.05;
  // Unvollständige Refokussierung reduziert das Echosignal (stimulierte Echos ausgenommen).
  if (sequence !== 'GRE' && protocol.refocusFlip < 180) {
    s *= 0.55 + 0.45 * Math.sin((protocol.refocusFlip * Math.PI) / 360) ** 2;
  }
  return s;
}

export function allTissueSignals(protocol: Protocol): Record<TissueId, number> {
  const out = {} as Record<TissueId, number>;
  for (const t of Object.values(TISSUES)) out[t.id] = tissueSignal(t.params[protocol.field], t.id, protocol);
  return out;
}

export function describeWeighting(protocol: Protocol): Loc {
  const { sequence, tr, te, ti, flip, field } = protocol;
  if (sequence === 'IR') {
    const csfNull = nullPointTI(TISSUES.csf.params[field].t1, tr);
    const fatNull = nullPointTI(TISSUES.fat.params[field].t1, tr);
    if (Math.abs(ti - csfNull) <= 0.12 * csfNull) return { de: 'FLAIR (Liquor unterdrückt, T2-gewichtet)', ru: 'FLAIR (ликвор подавлен, T2-взвешенное)' };
    if (Math.abs(ti - fatNull) <= 0.15 * fatNull) return { de: 'STIR (Fett unterdrückt)', ru: 'STIR (жир подавлен)' };
    return ti < 1200 ? { de: 'IR, T1-gewichtet', ru: 'IR, T1-взвешенное' } : { de: 'IR, gemischter Kontrast', ru: 'IR, смешанный контраст' };
  }
  if (sequence === 'GRE') {
    if (flip >= 40 && tr <= 400 && te <= 10) return { de: 'T1-gewichtet (GRE)', ru: 'T1-взвешенное (GRE)' };
    if (flip <= 25 && te >= 15) return { de: 'T2*-gewichtet', ru: 'T2*-взвешенное' };
    if (flip <= 15 && te < 10) return { de: 'PD-gewichtet (GRE)', ru: 'PD-взвешенное (GRE)' };
    return { de: 'gemischter GRE-Kontrast', ru: 'смешанный GRE-контраст' };
  }
  if (sequence === 'EPI') return te >= 60 ? { de: 'T2-gewichtet (EPI, Basis für DWI)', ru: 'T2-взвешенное (EPI, основа для DWI)' } : { de: 'EPI, gemischt', ru: 'EPI, смешанное' };
  if (tr <= 900 && te <= 30) return { de: 'T1-gewichtet', ru: 'T1-взвешенное' };
  if (tr >= 2000 && te >= 70) return { de: 'T2-gewichtet', ru: 'T2-взвешенное' };
  if (tr >= 2000 && te <= 40) return { de: 'PD-gewichtet', ru: 'PD-взвешенное' };
  return { de: 'gemischter Kontrast', ru: 'смешанный контраст' };
}

// ---------------------------------------------------------------- Timing

export interface TimingInfo {
  readoutMs: number;
  echoSpacingMs: number;
  minTE: number;
  maxTE: number;
  minTR: number;
  sliceOccupancyMs: number;
  maxSlicesPerTR: number;
  concatenations: number;
  effectivePhaseLines: number;
}

export function timing(p: Protocol): TimingInfo {
  const readoutMs = 1000 / p.bandwidthPerPixel;
  const effectivePhaseLines = Math.round(p.matrixPhase * (1 + p.phaseOversampling / 100));
  let echoSpacingMs = readoutMs + RF_OVERHEAD_MS;
  let minTE: number;
  let maxTE: number;
  let occ: number;
  let minTR: number;
  switch (p.sequence) {
    case 'SE':
      minTE = readoutMs + RF_OVERHEAD_MS;
      maxTE = 250;
      occ = p.te + readoutMs / 2 + 5;
      minTR = occ;
      break;
    case 'TSE':
      minTE = echoSpacingMs;
      maxTE = p.etl * echoSpacingMs;
      occ = p.etl * echoSpacingMs + 10;
      minTR = occ;
      break;
    case 'IR':
      minTE = echoSpacingMs;
      maxTE = p.etl * echoSpacingMs;
      occ = p.etl * echoSpacingMs + 20;
      minTR = p.ti + occ;
      break;
    case 'GRE':
      echoSpacingMs = 0;
      minTE = readoutMs / 2 + 1.5;
      maxTE = 60;
      occ = p.te + readoutMs / 2 + 3;
      minTR = occ;
      break;
    case 'EPI': {
      echoSpacingMs = epiEchoSpacingMs(p.bandwidthPerPixel);
      const train = (effectivePhaseLines / p.acceleration) * echoSpacingMs;
      minTE = train / 2 + 12;
      maxTE = 200;
      occ = p.te + train / 2 + 10;
      minTR = occ * p.slices;
      break;
    }
  }
  const maxSlicesPerTR = Math.max(1, Math.floor(p.tr / occ));
  const concatenations = p.sequence === 'EPI' ? 1 : Math.ceil(p.slices / maxSlicesPerTR);
  return { readoutMs, echoSpacingMs, minTE, maxTE, minTR, sliceOccupancyMs: occ, maxSlicesPerTR, concatenations, effectivePhaseLines };
}

// ---------------------------------------------------------------- Kennzahlen

export interface ProtocolIssue {
  severity: 'error' | 'warning' | 'info';
  text: Loc;
}

export interface ProtocolMetrics {
  timing: TimingInfo;
  scanTimeS: number;
  snr: number;
  sar: number;
  sarMode: 'normal' | 'first-level' | 'unzulässig';
  pixelRead: number;
  pixelPhase: number;
  voxelMm3: number;
  chemicalShiftPx: number;
  epiDistortionPx: number;
  aliasing: boolean;
  aliasingMm: number;
  motionRisk: number;
  weighting: Loc;
  signals: Record<TissueId, number>;
  issues: ProtocolIssue[];
}

export function computeMetrics(p: Protocol, anatomy: AnatomyContext): ProtocolMetrics {
  const t = timing(p);
  const signals = allTissueSignals(p);
  const issues: ProtocolIssue[] = [];

  const scanTimeS =
    p.sequence === 'EPI'
      ? (Math.max(p.tr, t.minTR) * p.nex) / 1000
      : (p.tr * t.effectivePhaseLines * p.nex * t.concatenations) / ((p.sequence === 'TSE' || p.sequence === 'IR' ? p.etl : 1) * p.acceleration) / 1000;

  const pixelRead = p.fovRead / p.matrixRead;
  const pixelPhase = p.fovPhase / p.matrixPhase;
  const voxelMm3 = pixelRead * pixelPhase * p.sliceThickness;
  const g = gFactor(p.acceleration);
  const base = relativeSnr({
    b0: p.field,
    voxelVolumeMm3: voxelMm3,
    phaseLines: t.effectivePhaseLines,
    nex: p.nex,
    bandwidthPerPixelHz: p.bandwidthPerPixel,
    acceleration: p.acceleration,
    gFactor: g,
    coilGain: anatomy.coilGain,
  });
  const fatSatPenalty = p.fatSat ? 0.92 : 1;
  const snr = SNR_NORMALISATION * base * signals[anatomy.referenceTissue] * fatSatPenalty;

  // SAR: Anzahl HF-Pulse pro Sekunde aus Schichten pro TR
  const slicesPerTR = p.sequence === 'EPI' ? p.slices : Math.ceil(p.slices / t.concatenations);
  const trS = Math.max(p.tr, p.sequence === 'EPI' ? t.minTR : 0) / 1000;
  const rate = slicesPerTR / trS;
  const pulses: Array<{ flipDeg: number; ratePerSecond: number }> = [];
  switch (p.sequence) {
    case 'SE':
      pulses.push({ flipDeg: 90, ratePerSecond: rate }, { flipDeg: p.refocusFlip, ratePerSecond: rate });
      break;
    case 'TSE':
      pulses.push({ flipDeg: 90, ratePerSecond: rate }, { flipDeg: p.refocusFlip, ratePerSecond: rate * p.etl });
      break;
    case 'IR':
      pulses.push(
        { flipDeg: 180, ratePerSecond: rate },
        { flipDeg: 90, ratePerSecond: rate },
        { flipDeg: p.refocusFlip, ratePerSecond: rate * p.etl },
      );
      break;
    case 'GRE':
      pulses.push({ flipDeg: p.flip, ratePerSecond: rate });
      break;
    case 'EPI':
      pulses.push({ flipDeg: 90, ratePerSecond: rate }, { flipDeg: p.refocusFlip, ratePerSecond: rate });
      break;
  }
  if (p.fatSat) pulses.push({ flipDeg: 110, ratePerSecond: rate });
  const sar = sarWkg({ b0: p.field, pulsesPerSecond: pulses });
  const sarMode = sar <= 2 ? 'normal' : sar <= 4 ? 'first-level' : 'unzulässig';

  // Artefakte
  let chemicalShiftPx = chemicalShiftPixels(p.field, p.bandwidthPerPixel);
  let epiDistortionPx = 0;
  if (p.sequence === 'EPI') {
    const bwPhase = epiPhaseBandwidthPerPixel(t.echoSpacingMs, t.effectivePhaseLines, p.acceleration);
    chemicalShiftPx = chemicalShiftHz(p.field) / bwPhase;
    epiDistortionPx = (1.5 * larmorMHz(p.field)) / bwPhase; // ~1,5 ppm Suszeptibilitätssprung
  }
  if (p.fatSat) chemicalShiftPx *= 0.05;
  const fovPhaseEff = p.fovPhase * (1 + p.phaseOversampling / 100);
  const extentMm = getPhantom(anatomy.phantom).extentMm;
  const aliasingMm = Math.max(0, extentMm - fovPhaseEff);
  const aliasing = aliasingMm > 2;
  const motionRisk = clamp((scanTimeS - anatomy.motionToleranceS) / anatomy.motionToleranceS, 0, 1);

  // Plausibilitätsprüfungen
  // Dezimalkomma ohne Tausendertrennung – in Deutsch und Russisch identisch
  const fx = (v: number, d: number) => v.toLocaleString('de-DE', { minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: false });
  const f1 = (v: number) => fx(v, 1);
  const f0 = (v: number) => fx(v, 0);
  const sarTxt = fx(sar, 2);
  if (p.te < t.minTE - 0.5)
    issues.push({
      severity: 'error',
      text: {
        de: `TE ${Math.round(p.te)} ms ist kürzer als das minimal mögliche TE von ${f1(t.minTE)} ms (Bandbreite erhöhen oder TE verlängern).`,
        ru: `TE ${Math.round(p.te)} мс короче минимально возможного TE ${f1(t.minTE)} мс (увеличь полосу пропускания или удлини TE).`,
      },
    });
  if (p.te > t.maxTE + 0.5)
    issues.push({
      severity: 'error',
      text: {
        de: `Effektives TE ${Math.round(p.te)} ms liegt außerhalb des Echozugs (max. ${f0(t.maxTE)} ms) – ETL erhöhen oder TE senken.`,
        ru: `Эффективное TE ${Math.round(p.te)} мс выходит за пределы эхо-цепочки (макс. ${f0(t.maxTE)} мс) – увеличь ETL или уменьши TE.`,
      },
    });
  if (p.tr < t.minTR - 0.5 && p.sequence !== 'EPI')
    issues.push({
      severity: 'error',
      text: {
        de: `TR ${Math.round(p.tr)} ms ist kürzer als die minimal nötige Zeit von ${f0(t.minTR)} ms.`,
        ru: `TR ${Math.round(p.tr)} мс короче минимально необходимого времени ${f0(t.minTR)} мс.`,
      },
    });
  if (p.sequence === 'IR' && p.ti >= p.tr) issues.push({ severity: 'error', text: { de: 'TI muss kürzer als TR sein.', ru: 'TI должно быть короче TR.' } });
  if (t.concatenations > 1)
    issues.push({
      severity: 'warning',
      text: {
        de: `Nur ${t.maxSlicesPerTR} Schichten passen in ein TR → ${t.concatenations} Konkatenationen verlängern die Messzeit.`,
        ru: `В один TR помещается лишь ${t.maxSlicesPerTR} срезов → ${t.concatenations} конкатенации удлиняют время сканирования.`,
      },
    });
  if (sarMode === 'first-level')
    issues.push({
      severity: 'warning',
      text: {
        de: `SAR ${sarTxt} W/kg: First Level Mode – ärztliche Überwachung erforderlich.`,
        ru: `SAR ${sarTxt} Вт/кг: режим First Level – требуется врачебный контроль.`,
      },
    });
  if (sarMode === 'unzulässig')
    issues.push({
      severity: 'error',
      text: {
        de: `SAR ${sarTxt} W/kg überschreitet 4 W/kg – Messung wird vom Scanner blockiert.`,
        ru: `SAR ${sarTxt} Вт/кг превышает 4 Вт/кг – сканер заблокирует измерение.`,
      },
    });
  if (aliasing)
    issues.push({
      severity: 'warning',
      text: {
        de: `Phasen-FOV ${f0(fovPhaseEff)} mm < Objekt ${extentMm} mm → Einfaltung (Aliasing).`,
        ru: `Фазовое FOV ${f0(fovPhaseEff)} мм < объект ${extentMm} мм → заворот (алиасинг).`,
      },
    });
  if (chemicalShiftPx > 2)
    issues.push({
      severity: 'warning',
      text: {
        de: `Chemische Verschiebung ${f1(chemicalShiftPx)} px – Bandbreite erhöhen oder Fettsättigung nutzen.`,
        ru: `Химический сдвиг ${f1(chemicalShiftPx)} пикс. – увеличь полосу пропускания или используй жироподавление.`,
      },
    });
  if (epiDistortionPx > 3)
    issues.push({
      severity: 'warning',
      text: {
        de: `EPI-Verzerrung ${f1(epiDistortionPx)} px – parallele Bildgebung oder höhere Bandbreite nutzen.`,
        ru: `EPI-искажение ${f1(epiDistortionPx)} пикс. – используй параллельную визуализацию или более широкую полосу.`,
      },
    });
  if (motionRisk > 0)
    issues.push({
      severity: 'warning',
      text: {
        de: `Messzeit überschreitet die Bewegungstoleranz (${anatomy.motionToleranceS} s) → Bewegungsartefakte wahrscheinlich.`,
        ru: `Время сканирования превышает допуск на движение (${anatomy.motionToleranceS} с) → вероятны артефакты движения.`,
      },
    });
  if (p.acceleration > 1 && g > 1.3)
    issues.push({
      severity: 'info',
      text: {
        de: `Hoher g-Faktor (${fx(g, 2)}) bei R=${p.acceleration} kostet zusätzlich SNR.`,
        ru: `Высокий g-фактор (${fx(g, 2)}) при R=${p.acceleration} дополнительно снижает SNR.`,
      },
    });

  return {
    timing: t,
    scanTimeS,
    snr,
    sar,
    sarMode,
    pixelRead,
    pixelPhase,
    voxelMm3,
    chemicalShiftPx,
    epiDistortionPx,
    aliasing,
    aliasingMm,
    motionRisk,
    weighting: describeWeighting(p),
    signals,
    issues,
  };
}

// ---------------------------------------------------------------- Bildsynthese

export interface SynthOptions {
  noise?: boolean;
  artifacts?: boolean;
  seed?: number;
}

/**
 * Erzeugt ein SYNTH_SIZE×SYNTH_SIZE-Bild für Protokoll + Anatomie. Artefakte werden physikalisch
 * motiviert simuliert: k-Raum-Trunkierung (Auflösung/Gibbs), Fettverschiebung,
 * Einfaltung, Bewegungsgeister über Phasenfehler, EPI-Verzerrung und Rauschen.
 */
export function synthesizeImage(p: Protocol, anatomy: AnatomyContext, metrics: ProtocolMetrics, opts: SynthOptions = {}): Float32Array {
  const { noise = true, artifacts = true, seed = 7 } = opts;
  const phantom = getPhantom(anatomy.phantom, SYNTH_SIZE);
  const N = phantom.size;
  const pxScale = N / 128;
  const rand = seededRandom(seed);
  let img = renderPhantom(phantom, p.field, (params, tissue) => tissueSignal(params, tissue, p));

  // Fettverschiebung in Ausleserichtung (x) bzw. Phasenrichtung (y) bei EPI
  if (artifacts && Math.abs(metrics.chemicalShiftPx) >= 0.5) {
    const mask = fatMask(phantom);
    // Akquisitionspixel → Phantompixel (bei EPI liegt die Verschiebung in Phasenrichtung)
    const acqPx = p.sequence === 'EPI' ? metrics.pixelPhase : metrics.pixelRead;
    const shift = Math.round((metrics.chemicalShiftPx * acqPx) / (phantom.extentMm / 0.9 / N) * (p.sequence === 'EPI' ? 0.35 : 1));
    const shifted = new Float32Array(img.length);
    for (let i = 0; i < img.length; i++) if (!mask[i]) shifted[i] = img[i];
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const i = y * N + x;
        if (!mask[i]) continue;
        const nx = p.sequence === 'EPI' ? x : x + shift;
        const ny = p.sequence === 'EPI' ? y + shift : y;
        if (nx >= 0 && nx < N && ny >= 0 && ny < N) shifted[ny * N + nx] += img[i];
      }
    }
    img = shifted;
  }

  // EPI-Suszeptibilitätsverzerrung nahe der frontobasalen Luft-Gewebe-Grenze
  if (artifacts && metrics.epiDistortionPx > 0.5) {
    const warped = new Float32Array(img.length);
    const amp = Math.min(metrics.epiDistortionPx, 25) * 0.6 * pxScale;
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const nxp = x / N - 0.5;
        const nyp = y / N - 0.5;
        const bump = Math.exp(-((nxp * nxp) / 0.03 + ((nyp + 0.42) ** 2) / 0.02));
        const ny = Math.round(y - amp * bump);
        if (ny >= 0 && ny < N) warped[ny * N + x] += img[y * N + x];
      }
    }
    img = warped;
  }

  // k-Raum: Auflösung (Trunkierung), Bewegung (Phasenfehler)
  const fovMm = phantom.extentMm / 0.9;
  const nativePx = fovMm / N;
  const keepX = clamp(nativePx / (p.fovRead / p.matrixRead), 0.08, 1);
  const keepY = clamp(nativePx / (p.fovPhase / p.matrixPhase), 0.08, 1);
  const needsK = keepX < 0.999 || keepY < 0.999 || (artifacts && metrics.motionRisk > 0);
  let complexRe: Float64Array | null = null;
  let complexIm: Float64Array | null = null;
  if (needsK) {
    const k = imageToKSpace(img, N);
    const half = N / 2;
    const motionAmp = artifacts ? metrics.motionRisk * 6 * pxScale : 0;
    for (let ky = 0; ky < N; ky++) {
      const kyc = ky - half;
      const disp = motionAmp * Math.sin((2 * Math.PI * ky) / 9);
      const phi = (2 * Math.PI * kyc * disp) / N;
      const cp = Math.cos(phi);
      const sp = Math.sin(phi);
      for (let kx = 0; kx < N; kx++) {
        const kxc = kx - half;
        const i = ky * N + kx;
        if (Math.abs(kxc) > keepX * half || Math.abs(kyc) > keepY * half) {
          k.re[i] = 0;
          k.im[i] = 0;
          continue;
        }
        if (motionAmp > 0) {
          const re = k.re[i];
          k.re[i] = re * cp - k.im[i] * sp;
          k.im[i] = re * sp + k.im[i] * cp;
        }
      }
    }
    const back = kSpaceToImage(k);
    complexRe = back.re;
    complexIm = back.im;
  }
  if (!complexRe || !complexIm) {
    complexRe = Float64Array.from(img);
    complexIm = new Float64Array(img.length);
  }

  // Einfaltung in Phasenrichtung (y)
  let out: Float64Array;
  if (artifacts && metrics.aliasing) {
    const fovPx = Math.max(8, Math.round((N * (p.fovPhase * (1 + p.phaseOversampling / 100))) / fovMm));
    const start = Math.round((N - fovPx) / 2);
    const re = new Float64Array(N * N);
    const im = new Float64Array(N * N);
    for (let y = 0; y < N; y++) {
      const rel = (((y - start) % fovPx) + fovPx) % fovPx;
      const ty = start + rel;
      if (ty < 0 || ty >= N) continue;
      for (let x = 0; x < N; x++) {
        re[ty * N + x] += complexRe[y * N + x];
        im[ty * N + x] += complexIm[y * N + x];
      }
    }
    // Außerhalb des Phasen-FOV wird nichts rekonstruiert
    const oversampled = p.phaseOversampling > 0;
    const shownPx = Math.round((N * p.fovPhase) / fovMm);
    const shownStart = Math.round((N - shownPx) / 2);
    for (let y = 0; y < N; y++) {
      const outside = oversampled ? y < shownStart || y >= shownStart + shownPx : y < start || y >= start + fovPx;
      if (outside) for (let x = 0; x < N; x++) (re[y * N + x] = 0), (im[y * N + x] = 0);
    }
    complexRe = re;
    complexIm = im;
  }

  if (noise) {
    const ref = metrics.signals[anatomy.referenceTissue] || 0.1;
    const sigma = ref / Math.max(metrics.snr, 0.5);
    out = new Float64Array(N * N);
    for (let i = 0; i < out.length; i++) {
      out[i] = Math.hypot(complexRe[i] + sigma * gaussian(rand), complexIm[i] + sigma * gaussian(rand));
    }
  } else {
    out = magnitude({ re: complexRe, im: complexIm, size: N });
  }
  return Float32Array.from(out);
}

/** Schreibt ein Grauwertbild (mit Perzentil-Fensterung) in einen Canvas. */
export function drawGrayscale(canvas: HTMLCanvasElement, data: ArrayLike<number>, size: number, opts: { percentile?: number; max?: number } = {}): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  let max = opts.max;
  if (max === undefined) {
    const sorted = Array.from(data).sort((a, b) => a - b);
    max = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * (opts.percentile ?? 0.995)))] || 1;
  }
  if (canvas.width !== size) canvas.width = size;
  if (canvas.height !== size) canvas.height = size;
  const imgData = ctx.createImageData(size, size);
  for (let i = 0; i < size * size; i++) {
    const v = Math.round(clamp(data[i] / max, 0, 1) * 255);
    imgData.data[i * 4] = v;
    imgData.data[i * 4 + 1] = v;
    imgData.data[i * 4 + 2] = v;
    imgData.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(imgData, 0, 0);
}
