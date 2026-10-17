export type Vector3 = [number, number, number];

/** Rotating-frame Bloch integration. Times in seconds; frequencies in rad/s. */
export function blochTrajectory(flip: number, offsetHz: number, t1ms: number, t2ms: number, pulseMs = 2, durationMs = 400) {
  const dt = 0.00005;
  const pulse = pulseMs / 1000;
  const w1 = flip * Math.PI / 180 / pulse;
  const wz = offsetHz * 2 * Math.PI;
  const t1 = t1ms / 1000, t2 = t2ms / 1000;
  const derivative = (m: Vector3, rf: number): Vector3 => [wz * m[1] - m[0] / t2, rf * m[2] - wz * m[0] - m[1] / t2, -rf * m[1] - (m[2] - 1) / t1];
  const add = (m: Vector3, k: Vector3, h: number): Vector3 => m.map((v, i) => v + k[i] * h) as Vector3;
  let m: Vector3 = [0, 0, 1];
  const out: { t: number; m: Vector3 }[] = [{ t: 0, m }];
  const steps = Math.round(durationMs / 1000 / dt);
  for (let i = 0; i < steps; i++) {
    const rf = i * dt < pulse - dt / 2 ? w1 : 0;
    const k1 = derivative(m, rf), k2 = derivative(add(m, k1, dt / 2), rf), k3 = derivative(add(m, k2, dt / 2), rf), k4 = derivative(add(m, k3, dt), rf);
    m = m.map((v, j) => v + dt / 6 * (k1[j] + 2 * k2[j] + 2 * k3[j] + k4[j])) as Vector3;
    if (i % 10 === 9 || i === steps - 1) out.push({ t: (i + 1) * dt * 1000, m });
  }
  return out;
}

export function dft(samples: readonly number[]) {
  const n = samples.length;
  return samples.map((_, k) => {
    let re = 0, im = 0;
    samples.forEach((s, j) => { const a = 2 * Math.PI * k * j / n; re += s * Math.cos(a); im -= s * Math.sin(a); });
    return { re, im, magnitude: Math.hypot(re, im) / n, phase: Math.atan2(im, re) };
  });
}

export function inverseDft(spectrum: { re: number; im: number }[]) {
  const n = spectrum.length;
  return spectrum.map((_, j) => spectrum.reduce((sum, z, k) => { const a = 2 * Math.PI * k * j / n; return sum + z.re * Math.cos(a) - z.im * Math.sin(a); }, 0) / n);
}

/** Periodic Gaussian convolution. Unit-sum kernel; DFT multiplier is real and even. */
export function gaussianConvolution(samples: number[], sigma: number) {
  if (sigma <= 0) return [...samples];
  const n = samples.length;
  const kernel = samples.map((_, j) => Math.exp(-(Math.min(j, n - j) ** 2) / (2 * sigma ** 2)));
  const sum = kernel.reduce((s, v) => s + v, 0);
  return samples.map((_, j) => kernel.reduce((s, w, i) => s + w / sum * samples[(j - i + n) % n], 0));
}

export const linewidthHz = (t2starMs: number) => 1000 / (Math.PI * t2starMs);
export const lorentzAbsorption = (hz: number, center: number, t2starMs: number) => 1 / (1 + (2 * Math.PI * (hz - center) * t2starMs / 1000) ** 2);
export function phaseContrast(velocity: number, venc: number) {
  const phase = Math.PI * velocity / venc;
  const wrapped = ((phase + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI;
  return { phase, wrapped, measured: wrapped / Math.PI * venc, aliased: velocity < -venc || velocity >= venc };
}
export function diffusionSignal(b: number, angle: number, axial: number, radial: number) {
  const a = angle * Math.PI / 180;
  const adc = axial * Math.cos(a) ** 2 + radial * Math.sin(a) ** 2;
  return { adc, signal: Math.exp(-b * adc) };
}

export function boldResponse(t: number, onset: number) {
  const x = t - onset;
  if (x <= 0) return 0;
  // Stylized gamma response with an undershoot; not a fitted physiological model.
  return x ** 5 * Math.exp(-x) / 120 - x ** 15 * Math.exp(-x) / 1307674368000 / 6;
}
