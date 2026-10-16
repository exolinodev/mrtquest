/**
 * Iterative Radix-2-FFT (Cooley-Tukey) für komplexe Daten in getrennten
 * Real-/Imaginär-Arrays, plus 2D-Varianten und fftshift.
 * Größen müssen Zweierpotenzen sein (die Simulatoren nutzen 128×128).
 */

export interface Complex2D {
  re: Float64Array;
  im: Float64Array;
  size: number;
}

function assertPow2(n: number): void {
  if (n < 1 || (n & (n - 1)) !== 0) throw new Error(`FFT-Länge muss eine Zweierpotenz sein (erhalten: ${n})`);
}

/** In-place 1D-FFT. inverse=true berechnet die IFFT inkl. 1/N-Normierung. */
export function fft1d(re: Float64Array, im: Float64Array, inverse = false): void {
  const n = re.length;
  assertPow2(n);
  // Bit-Umkehr-Permutation
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  const sign = inverse ? 1 : -1;
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (sign * 2 * Math.PI) / len;
    const wRe = Math.cos(ang);
    const wIm = Math.sin(ang);
    const half = len >> 1;
    for (let i = 0; i < n; i += len) {
      let cRe = 1;
      let cIm = 0;
      for (let k = 0; k < half; k++) {
        const aIdx = i + k;
        const bIdx = aIdx + half;
        const tRe = re[bIdx] * cRe - im[bIdx] * cIm;
        const tIm = re[bIdx] * cIm + im[bIdx] * cRe;
        re[bIdx] = re[aIdx] - tRe;
        im[bIdx] = im[aIdx] - tIm;
        re[aIdx] += tRe;
        im[aIdx] += tIm;
        const nRe = cRe * wRe - cIm * wIm;
        cIm = cRe * wIm + cIm * wRe;
        cRe = nRe;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) {
      re[i] /= n;
      im[i] /= n;
    }
  }
}

/** 2D-FFT (zeilen-, dann spaltenweise). Arbeitet auf einer Kopie. */
export function fft2d(input: Complex2D, inverse = false): Complex2D {
  const { size } = input;
  const re = new Float64Array(input.re);
  const im = new Float64Array(input.im);
  const rowRe = new Float64Array(size);
  const rowIm = new Float64Array(size);
  for (let y = 0; y < size; y++) {
    const off = y * size;
    rowRe.set(re.subarray(off, off + size));
    rowIm.set(im.subarray(off, off + size));
    fft1d(rowRe, rowIm, inverse);
    re.set(rowRe, off);
    im.set(rowIm, off);
  }
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      rowRe[y] = re[y * size + x];
      rowIm[y] = im[y * size + x];
    }
    fft1d(rowRe, rowIm, inverse);
    for (let y = 0; y < size; y++) {
      re[y * size + x] = rowRe[y];
      im[y * size + x] = rowIm[y];
    }
  }
  return { re, im, size };
}

/** Vertauscht Quadranten, sodass k = 0 in der Bildmitte liegt (selbstinvers für gerade N). */
export function fftshift(data: Complex2D): Complex2D {
  const { size } = data;
  const half = size >> 1;
  const re = new Float64Array(size * size);
  const im = new Float64Array(size * size);
  for (let y = 0; y < size; y++) {
    const ys = (y + half) % size;
    for (let x = 0; x < size; x++) {
      const xs = (x + half) % size;
      re[ys * size + xs] = data.re[y * size + x];
      im[ys * size + xs] = data.im[y * size + x];
    }
  }
  return { re, im, size };
}

/** Bild (reell) → zentrierter k-Raum. */
export function imageToKSpace(image: Float32Array | Float64Array, size: number): Complex2D {
  const input: Complex2D = { re: Float64Array.from(image), im: new Float64Array(size * size), size };
  return fftshift(fft2d(fftshift(input)));
}

/** Zentrierter k-Raum → komplexes Bild. */
export function kSpaceToImage(kspace: Complex2D): Complex2D {
  return fftshift(fft2d(fftshift(kspace), true));
}

export function magnitude(data: Complex2D): Float64Array {
  const out = new Float64Array(data.re.length);
  for (let i = 0; i < out.length; i++) out[i] = Math.hypot(data.re[i], data.im[i]);
  return out;
}
