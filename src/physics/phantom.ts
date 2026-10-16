/**
 * Synthetische anatomische Phantome als Gewebe-Label-Karten.
 * Aus einer Label-Karte und einer Signalfunktion entsteht ein MR-Bild mit
 * realistisch wirkendem Kontrast (T1w, T2w, PD, FLAIR, STIR …).
 */
import { TISSUES, type FieldStrength, type TissueId, type TissueParams } from './constants';

export type PhantomId = 'brain' | 'knee' | 'abdomen';

/** 0 = Luft/Hintergrund, 1 = kortikaler Knochen, sonst Gewebe-ID. */
export type Label = 'air' | 'bone' | TissueId;

const LABELS: Label[] = ['air', 'bone', 'wm', 'gm', 'csf', 'fat', 'muscle', 'liver', 'lesion', 'blood'];
const LABEL_INDEX = new Map(LABELS.map((l, i) => [l, i]));

export interface Phantom {
  id: PhantomId;
  size: number;
  labels: Uint8Array;
  /** Objektausdehnung in Phasenrichtung (mm) – relevant für Einfaltungen */
  extentMm: number;
}

interface Shape {
  label: Label;
  cx: number;
  cy: number;
  a: number;
  b: number;
  rot?: number;
  wobble?: { amp: number; freq: number };
}

function inside(s: Shape, x: number, y: number): boolean {
  const rot = s.rot ?? 0;
  const dx = x - s.cx;
  const dy = y - s.cy;
  const c = Math.cos(rot);
  const si = Math.sin(rot);
  const u = dx * c + dy * si;
  const v = -dx * si + dy * c;
  let r = (u * u) / (s.a * s.a) + (v * v) / (s.b * s.b);
  if (s.wobble) {
    const theta = Math.atan2(v / s.b, u / s.a);
    const scale = 1 + s.wobble.amp * Math.sin(s.wobble.freq * theta);
    r /= scale * scale;
  }
  return r <= 1;
}

const SHAPES: Record<PhantomId, Shape[]> = {
  brain: [
    { label: 'fat', cx: 0, cy: 0, a: 0.74, b: 0.92 },
    { label: 'bone', cx: 0, cy: 0, a: 0.69, b: 0.87 },
    { label: 'csf', cx: 0, cy: 0, a: 0.65, b: 0.83 },
    { label: 'gm', cx: 0, cy: 0.01, a: 0.62, b: 0.8, wobble: { amp: 0.025, freq: 22 } },
    { label: 'wm', cx: 0, cy: 0.02, a: 0.52, b: 0.69, wobble: { amp: 0.06, freq: 14 } },
    { label: 'gm', cx: -0.2, cy: 0.12, a: 0.08, b: 0.14, rot: 0.3 },
    { label: 'gm', cx: 0.2, cy: 0.12, a: 0.08, b: 0.14, rot: -0.3 },
    { label: 'csf', cx: -0.1, cy: -0.08, a: 0.06, b: 0.24, rot: -0.25 },
    { label: 'csf', cx: 0.1, cy: -0.08, a: 0.06, b: 0.24, rot: 0.25 },
    { label: 'csf', cx: 0, cy: 0.62, a: 0.03, b: 0.18 },
    { label: 'lesion', cx: 0.22, cy: -0.3, a: 0.05, b: 0.04 },
    { label: 'lesion', cx: -0.27, cy: -0.18, a: 0.035, b: 0.06, rot: 0.4 },
    { label: 'lesion', cx: -0.3, cy: 0.33, a: 0.045, b: 0.045 },
    { label: 'blood', cx: 0, cy: 0.79, a: 0.04, b: 0.025 },
  ],
  knee: [
    { label: 'fat', cx: 0, cy: 0, a: 0.82, b: 0.7 },
    { label: 'muscle', cx: 0, cy: 0, a: 0.72, b: 0.6 },
    { label: 'fat', cx: 0, cy: -0.05, a: 0.55, b: 0.42 },
    { label: 'bone', cx: 0, cy: -0.05, a: 0.5, b: 0.38 },
    { label: 'fat', cx: 0, cy: -0.05, a: 0.46, b: 0.34 },
    { label: 'lesion', cx: 0.16, cy: -0.02, a: 0.14, b: 0.1, rot: 0.3 },
    { label: 'csf', cx: 0, cy: -0.46, a: 0.3, b: 0.04 },
    { label: 'bone', cx: 0, cy: -0.58, a: 0.2, b: 0.08 },
    { label: 'fat', cx: 0, cy: -0.58, a: 0.17, b: 0.055 },
    { label: 'blood', cx: -0.05, cy: 0.5, a: 0.04, b: 0.04 },
    { label: 'blood', cx: 0.06, cy: 0.5, a: 0.03, b: 0.03 },
  ],
  abdomen: [
    { label: 'fat', cx: 0, cy: 0, a: 0.94, b: 0.7 },
    { label: 'muscle', cx: 0, cy: 0, a: 0.85, b: 0.61 },
    { label: 'fat', cx: 0, cy: 0.02, a: 0.8, b: 0.56 },
    { label: 'liver', cx: -0.28, cy: -0.05, a: 0.48, b: 0.42, rot: 0.15 },
    { label: 'lesion', cx: -0.38, cy: -0.12, a: 0.08, b: 0.08 },
    { label: 'lesion', cx: -0.18, cy: 0.12, a: 0.05, b: 0.05 },
    { label: 'muscle', cx: 0.4, cy: -0.05, a: 0.22, b: 0.17, rot: -0.4 },
    { label: 'muscle', cx: 0.05, cy: 0.38, a: 0.15, b: 0.12 },
    { label: 'bone', cx: 0.05, cy: 0.4, a: 0.1, b: 0.09 },
    { label: 'fat', cx: 0.05, cy: 0.4, a: 0.075, b: 0.065 },
    { label: 'blood', cx: 0.15, cy: 0.22, a: 0.05, b: 0.05 },
    { label: 'csf', cx: 0.05, cy: 0.52, a: 0.025, b: 0.025 },
  ],
};

const EXTENT_MM: Record<PhantomId, number> = { brain: 220, knee: 180, abdomen: 380 };

const cache = new Map<string, Phantom>();

export function getPhantom(id: PhantomId, size = 128): Phantom {
  const key = `${id}:${size}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const labels = new Uint8Array(size * size);
  const shapes = SHAPES[id];
  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      const x = ((px + 0.5) / size) * 2 - 1;
      const y = ((py + 0.5) / size) * 2 - 1;
      let label: Label = 'air';
      for (const s of shapes) if (inside(s, x, y)) label = s.label;
      labels[py * size + px] = LABEL_INDEX.get(label) ?? 0;
    }
  }
  const phantom: Phantom = { id, size, labels, extentMm: EXTENT_MM[id] };
  cache.set(key, phantom);
  return phantom;
}

export function labelAt(index: number): Label {
  return LABELS[index] ?? 'air';
}

export type SignalFn = (params: TissueParams, tissue: TissueId) => number;

/** Berechnet das Signalbild eines Phantoms für eine gegebene Signalfunktion. */
export function renderPhantom(phantom: Phantom, field: FieldStrength, signal: SignalFn): Float32Array {
  const lut = LABELS.map((label) => {
    if (label === 'air') return 0;
    if (label === 'bone') return 0.02;
    return Math.max(0, signal(TISSUES[label].params[field], label));
  });
  const out = new Float32Array(phantom.labels.length);
  for (let i = 0; i < out.length; i++) out[i] = lut[phantom.labels[i]];
  return out;
}

/** Maske aller Fett-Pixel – für die Simulation der chemischen Verschiebung. */
export function fatMask(phantom: Phantom): Uint8Array {
  const fatIdx = LABEL_INDEX.get('fat') ?? -1;
  return phantom.labels.map((l) => (l === fatIdx ? 1 : 0));
}

/** Deterministischer Pseudozufallsgenerator (Mulberry32). */
export function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Gaußsches Rauschen (Box-Muller). */
export function gaussian(rand: () => number): number {
  const u = Math.max(rand(), 1e-12);
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}
