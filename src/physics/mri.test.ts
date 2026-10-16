import { describe, expect, it } from 'vitest';
import { TISSUES } from './constants';
import { fft1d, imageToKSpace, kSpaceToImage, magnitude } from './fft';
import {
  chemicalShiftPixels,
  ernstAngleDeg,
  fatWaterPhaseTimes,
  larmorMHz,
  mzAfterInversion,
  nullPointTI,
  readoutFovMm,
  scanTimeSeconds,
  sliceThicknessMm,
  spinExcess,
  t2StarFromInhomogeneity,
} from './mri';
import { ANATOMY, computeMetrics, DEFAULT_PROTOCOL, synthesizeImage } from './protocol';

describe('Larmor & Kernspin', () => {
  it('liefert 63,87 MHz für Protonen bei 1,5 T', () => {
    expect(larmorMHz(1.5)).toBeCloseTo(63.87, 2);
    expect(larmorMHz(3)).toBeCloseTo(127.73, 2);
  });
  it('Spinüberschuss ≈ 3,3 ppm/T bei 310 K und skaliert linear', () => {
    expect(spinExcess(1) * 1e6).toBeCloseTo(3.29, 1);
    expect(spinExcess(3) / spinExcess(1.5)).toBeCloseTo(2, 6);
  });
});

describe('Relaxation & Kontrast', () => {
  it('Nulldurchgang nach Inversion bei T1·ln2', () => {
    const t1 = 800;
    expect(mzAfterInversion(t1 * Math.LN2, t1)).toBeCloseTo(0, 10);
    expect(nullPointTI(t1)).toBeCloseTo(t1 * Math.LN2, 8);
  });
  it('endliches TR verkürzt die Null-TI', () => {
    expect(nullPointTI(4000, 9000)).toBeLessThan(4000 * Math.LN2);
    expect(nullPointTI(4000, 9000)).toBeGreaterThan(2300);
  });
  it('Ernst-Winkel: cos α = e^(−TR/T1)', () => {
    expect(Math.cos((ernstAngleDeg(100, 780) * Math.PI) / 180)).toBeCloseTo(Math.exp(-100 / 780), 10);
  });
  it('T2* ist immer kürzer als T2', () => {
    expect(t2StarFromInhomogeneity(80, 0.1)).toBeLessThan(80);
    for (const t of Object.values(TISSUES)) {
      expect(t.params[1.5].t2star).toBeLessThanOrEqual(t.params[1.5].t2);
      expect(t.params[1.5].t2).toBeLessThanOrEqual(t.params[1.5].t1);
    }
  });
});

describe('Ortskodierung', () => {
  it('Schichtdicke Δz = Δf/(γ̄G)', () => {
    expect(sliceThicknessMm(1000, 10)).toBeCloseTo(2.349, 2);
  });
  it('FOV aus Bandbreite und Gradient', () => {
    expect(readoutFovMm(64000, 6)).toBeCloseTo(250.5, 0);
  });
  it('chemische Verschiebung bei 1,5 T und 220 Hz/px ≈ 1 px', () => {
    expect(chemicalShiftPixels(1.5, 223.5)).toBeCloseTo(1, 1);
  });
  it('Fett/Wasser gegenphasig bei ≈ 2,2 ms (1,5 T)', () => {
    expect(fatWaterPhaseTimes(1.5).opposed).toBeCloseTo(2.24, 1);
    expect(fatWaterPhaseTimes(3).inPhase).toBeCloseTo(2.24, 1);
  });
  it('Messzeit TSE', () => {
    expect(scanTimeSeconds(4000, 256, 1, 16)).toBeCloseTo(64, 6);
  });
});

describe('FFT', () => {
  it('Hin- und Rücktransformation ist verlustfrei', () => {
    const re = Float64Array.from({ length: 16 }, (_, i) => Math.sin(i) + i * 0.1);
    const im = new Float64Array(16);
    const orig = Float64Array.from(re);
    fft1d(re, im);
    fft1d(re, im, true);
    for (let i = 0; i < 16; i++) expect(re[i]).toBeCloseTo(orig[i], 10);
  });
  it('2D-Rekonstruktion eines Bildes', () => {
    const N = 16;
    const img = Float64Array.from({ length: N * N }, (_, i) => ((i * 7) % 5) / 5);
    const back = magnitude(kSpaceToImage(imageToKSpace(img, N)));
    for (let i = 0; i < N * N; i++) expect(back[i]).toBeCloseTo(img[i], 8);
  });
  it('k-Raum-Zentrum enthält die Bildsumme', () => {
    const N = 8;
    const img = new Float64Array(N * N).fill(1);
    const k = imageToKSpace(img, N);
    expect(k.re[(N / 2) * N + N / 2]).toBeCloseTo(N * N, 8);
  });
});

describe('Protokollmodell', () => {
  it('Standard-T2-TSE ist plausibel', () => {
    const m = computeMetrics(DEFAULT_PROTOCOL, ANATOMY.brain);
    expect(m.weighting.de).toContain('T2');
    expect(m.weighting.uk).toContain('T2');
    expect(m.scanTimeS).toBeGreaterThan(30);
    expect(m.scanTimeS).toBeLessThan(180);
    expect(m.sar).toBeGreaterThan(0.5);
    expect(m.sar).toBeLessThan(4);
    expect(m.issues.filter((i) => i.severity === 'error')).toHaveLength(0);
  });
  it('3 T vervierfacht das SAR', () => {
    const a = computeMetrics(DEFAULT_PROTOCOL, ANATOMY.brain).sar;
    const b = computeMetrics({ ...DEFAULT_PROTOCOL, field: 3 }, ANATOMY.brain).sar;
    expect(b / a).toBeCloseTo(4, 6);
  });
  it('NEX ×4 verdoppelt das SNR', () => {
    const a = computeMetrics(DEFAULT_PROTOCOL, ANATOMY.brain).snr;
    const b = computeMetrics({ ...DEFAULT_PROTOCOL, nex: 4 }, ANATOMY.brain).snr;
    expect(b / a).toBeCloseTo(2, 6);
  });
  it('zu kleines Phasen-FOV erzeugt Einfaltung, Oversampling behebt sie', () => {
    expect(computeMetrics({ ...DEFAULT_PROTOCOL, fovPhase: 150 }, ANATOMY.brain).aliasing).toBe(true);
    expect(computeMetrics({ ...DEFAULT_PROTOCOL, fovPhase: 150, phaseOversampling: 60 }, ANATOMY.brain).aliasing).toBe(false);
  });
  it('FLAIR nullt den Liquor', () => {
    const ti = nullPointTI(TISSUES.csf.params[1.5].t1, 9000);
    const m = computeMetrics({ ...DEFAULT_PROTOCOL, sequence: 'IR', tr: 9000, ti, te: 100 }, ANATOMY.brain);
    expect(m.signals.csf).toBeLessThan(0.01);
    expect(m.weighting.de).toContain('FLAIR');
  });
  it('synthetisiert ein endliches Bild', () => {
    const m = computeMetrics(DEFAULT_PROTOCOL, ANATOMY.brain);
    const img = synthesizeImage(DEFAULT_PROTOCOL, ANATOMY.brain, m);
    expect(img.length).toBe(256 * 256);
    expect(img.every((v) => Number.isFinite(v))).toBe(true);
  });
});
