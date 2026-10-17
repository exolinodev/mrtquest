import { useEffect, useMemo, useRef } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { imageToKSpace, kSpaceToImage, magnitude, type Complex2D } from '../../physics/fft';
import { getPhantom, renderPhantom } from '../../physics/phantom';
import { DEFAULT_PROTOCOL, drawGrayscale, tissueSignal } from '../../physics/protocol';

const N = 128;
const R = 10; // Radius des „Zentrums“ in k-Raum-Pixeln

type MaskId = 'full' | 'center' | 'edge' | 'line';
const MASKS: MaskId[] = ['full', 'center', 'edge', 'line'];

function keep(mask: MaskId, kx: number, ky: number): boolean {
  const r = Math.hypot(kx, ky);
  if (mask === 'center') return r <= R;
  if (mask === 'edge') return r > R;
  if (mask === 'line') return ky === 0;
  return true;
}

function drawKSpace(canvas: HTMLCanvasElement, k: Complex2D, m: Uint8Array) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = N;
  canvas.height = N;
  const mag = magnitude(k);
  let max = 0;
  for (const v of mag) max = Math.max(max, Math.log1p(v));
  const img = ctx.createImageData(N, N);
  for (let i = 0; i < N * N; i++) {
    const v = max > 0 ? Math.log1p(mag[i]) / max : 0;
    const off = !m[i];
    img.data[i * 4] = off ? 12 : Math.round(255 * Math.min(1, v * 1.4));
    img.data[i * 4 + 1] = off ? 18 : Math.round(255 * Math.max(0, v * 1.4 - 0.45));
    img.data[i * 4 + 2] = off ? 42 : Math.round(255 * Math.min(1, 0.35 + v * 0.6));
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}

const canvasStyle = { width: '100%', aspectRatio: '1', imageRendering: 'pixelated', display: 'block', borderRadius: 6 } as const;

/** Vier k-Raum-Masken und die daraus rekonstruierten Bilder, echt per FFT berechnet. */
export function KSpaceMasks() {
  const { tr } = useLang();
  const kRefs = useRef<(HTMLCanvasElement | null)[]>([]);
  const iRefs = useRef<(HTMLCanvasElement | null)[]>([]);

  const results = useMemo(() => {
    const phantom = getPhantom('brain', N);
    const protocol = { ...DEFAULT_PROTOCOL, sequence: 'TSE' as const, tr: 4000, te: 100 };
    const img = renderPhantom(phantom, 1.5, (p, t) => tissueSignal(p, t, protocol));
    const base = imageToKSpace(img, N);
    return MASKS.map((id) => {
      const re = new Float64Array(base.re);
      const im = new Float64Array(base.im);
      const m = new Uint8Array(N * N);
      for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
          const i = y * N + x;
          if (keep(id, x - N / 2, y - N / 2)) m[i] = 1;
          else {
            re[i] = 0;
            im[i] = 0;
          }
        }
      }
      const k = { re, im, size: N };
      return { id, k, m, image: magnitude(kSpaceToImage(k)) };
    });
  }, []);

  useEffect(() => {
    results.forEach((r, i) => {
      const kc = kRefs.current[i];
      const ic = iRefs.current[i];
      if (kc) drawKSpace(kc, r.k, r.m);
      if (ic) drawGrayscale(ic, r.image, N);
    });
  }, [results]);

  const text: Record<MaskId, [string, string]> = {
    full: [tr('voller k-Raum', 'весь k-простр.'), tr('scharfes Bild', 'чёткое изображение')],
    center: [tr('nur Zentrum', 'только центр'), tr('Kontrast, unscharf', 'контраст, размыто')],
    edge: [tr('nur Rand', 'только край'), tr('nur Kanten', 'только края')],
    line: [tr('nur eine Zeile', 'только одна строка'), tr('nur Streifen', 'только полосы')],
  };

  return (
    <div
      role="img"
      aria-label={tr('k-Raum-Masken und rekonstruierte Bilder', 'Маски k-пространства и реконструированные изображения')}
      style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px 12px' }}
    >
      {results.map((r, i) => (
        <div key={r.id} style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'center' }}>
          <div style={{ color: 'var(--text)', fontWeight: 600, fontSize: '0.92rem' }}>{text[r.id][0]}</div>
          <canvas ref={(el) => { kRefs.current[i] = el; }} style={canvasStyle} />
          <div style={{ color: 'var(--text-dim)', fontSize: '1.1rem', lineHeight: 1 }}>↓ FFT⁻¹</div>
          <canvas ref={(el) => { iRefs.current[i] = el; }} style={canvasStyle} />
          <div style={{ color: 'var(--text-dim)', fontSize: '0.88rem' }}>{text[r.id][1]}</div>
        </div>
      ))}
    </div>
  );
}
