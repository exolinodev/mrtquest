import { useEffect, useMemo, useRef, useState } from 'react';
import { RichText, TeX } from '../components/RichText';
import { Callout, Panel, Segmented, Slider, Stat } from '../components/ui';
import { useLang } from '../i18n/LanguageContext';
import { imageToKSpace, kSpaceToImage, magnitude } from '../physics/fft';
import { deltaK, fmt, fmtDuration, GAMMA_BAR_H1, kMax, pixelSizeMm } from '../physics/mri';
import { getPhantom, renderPhantom } from '../physics/phantom';
import { DEFAULT_PROTOCOL, drawGrayscale, tissueSignal } from '../physics/protocol';

type Mode = 'lines' | 'fov';
type Contrast = 'T1w' | 'T2w';
type Order = 'linear' | 'centric';
type Etl = 1 | 4 | 8;

const N = 128;
const FIELD = 1.5;

function usePrefersReducedMotion(): boolean {
  const query = '(prefers-reduced-motion: reduce)';
  const [reduced, setReduced] = useState(() => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches);
  useEffect(() => {
    const mq = window.matchMedia?.(query);
    if (!mq) return;
    const on = () => setReduced(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduced;
}

function initialMode(preset?: string): Mode {
  const p = preset ?? window.location.hash.split('/')[3];
  return p === 'fov' ? 'fov' : 'lines';
}

/** Bildaufbau-Labor: k-Raum Zeile für Zeile füllen, FOV, Matrix und Einfaltung. */
export function ImagingLab({ preset }: { preset?: string }) {
  const { tr } = useLang();
  const [mode, setMode] = useState<Mode>(() => initialMode(preset));
  const intro: Record<Mode, string> = {
    lines: tr(
      'Eine Sequenz misst den k-Raum nicht auf einmal, sondern Zeile für Zeile. Beim Spin-Echo kommt pro Repetitionszeit TR genau eine Zeile dazu. Rechts siehst du, welches Bild die inverse Fourier-Transformation aus den bisher gemessenen Zeilen macht. Fehlende Zeilen zählen als null.',
      'Последовательность измеряет k-пространство не сразу, а строка за строкой. В спин-эхо за каждое время повторения TR добавляется ровно одна строка. Справа видно, какое изображение обратное преобразование Фурье строит из уже измеренных строк. Недостающие строки считаются нулями.',
    ),
    fov: tr(
      'Das Bildfeld (FOV) und die Matrix legen fest, wie fein der k-Raum abgetastet wird. Die Zahlen rechts sind echt gerechnet. Wird das FOV kleiner als der Kopf, faltet sich das, was außerhalb liegt, in Phasenrichtung ins Bild.',
      'Поле обзора (FOV) и матрица определяют, насколько мелко дискретизируется k-пространство. Числа справа рассчитаны по-настоящему. Если FOV меньше головы, то, что лежит снаружи, заворачивается в изображение в фазовом направлении.',
    ),
  };
  return (
    <div className="sim-grid">
      <Panel title={tr('Experiment wählen', 'Выбор эксперимента')} className="span-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'lines', label: tr('Zeile für Zeile', 'Строка за строкой') },
            { value: 'fov', label: tr('FOV & Auflösung', 'FOV и разрешение') },
          ]}
        />
        <p className="small">{intro[mode]}</p>
      </Panel>
      {mode === 'lines' ? <LinesMode /> : <FovMode />}
    </div>
  );
}

// ---------------------------------------------------------------- Modus 1: Zeile für Zeile

const CONTRAST: Record<Contrast, { te: number; tr: number }> = {
  T1w: { te: 12, tr: 550 },
  T2w: { te: 100, tr: 4000 },
};
/** Darstellungsdauer pro TR beim Abspielen */
const TICK_MS = 45;

/** Reihenfolge der Phasenkodierzeilen: linear von oben nach unten oder zentrisch (Mitte zuerst, dann abwechselnd nach außen). */
function lineOrder(order: Order): number[] {
  return Array.from({ length: N }, (_, i) => (order === 'linear' ? i : N / 2 + (i % 2 === 0 ? i / 2 : -(i + 1) / 2)));
}

function drawKSpace(canvas: HTMLCanvasElement, logMag: Float64Array, measured: Uint8Array, lastShot: Set<number>) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  canvas.width = N;
  canvas.height = N;
  const img = ctx.createImageData(N, N);
  for (let y = 0; y < N; y++) {
    const fresh = lastShot.has(y);
    for (let x = 0; x < N; x++) {
      const i = y * N + x;
      const v = logMag[i];
      const o = i * 4;
      if (!measured[y]) {
        img.data[o] = 10;
        img.data[o + 1] = 16;
        img.data[o + 2] = 40;
      } else if (fresh) {
        img.data[o] = Math.round(30 + 120 * v);
        img.data[o + 1] = Math.round(110 + 145 * v);
        img.data[o + 2] = Math.round(70 + 110 * v);
      } else {
        img.data[o] = Math.round(255 * Math.min(1, v * 1.4));
        img.data[o + 1] = Math.round(255 * Math.max(0, v * 1.4 - 0.45));
        img.data[o + 2] = Math.round(255 * Math.min(1, 0.35 + v * 0.6));
      }
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

function percentile(data: ArrayLike<number>, q: number): number {
  const sorted = Array.from(data).sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))] || 1;
}

function LinesMode() {
  const { tr } = useLang();
  const reduced = usePrefersReducedMotion();
  const [contrast, setContrast] = useState<Contrast>('T2w');
  const [order, setOrder] = useState<Order>('linear');
  const [etl, setEtl] = useState<Etl>(1);
  const [trMs, setTrMs] = useState(CONTRAST.T2w.tr);
  const [count, setCount] = useState(N);
  const [playing, setPlaying] = useState(false);
  const kCanvas = useRef<HTMLCanvasElement>(null);
  const imgCanvas = useRef<HTMLCanvasElement>(null);
  const countRef = useRef(count);
  countRef.current = count;

  const sequence = etl === 1 ? 'SE' : 'TSE';
  const te = CONTRAST[contrast].te;

  // Phantom und k-Raum nur neu rechnen, wenn sich der Kontrast ändert
  const { k, logMag, fullImg, fullMax, rowEnergy, totalEnergy } = useMemo(() => {
    const protocol = { ...DEFAULT_PROTOCOL, sequence, tr: trMs, te } as const;
    const img = renderPhantom(getPhantom('brain', N), FIELD, (p, t) => tissueSignal(p, t, protocol));
    const k = imageToKSpace(img, N);
    const mag = magnitude(k);
    let max = 0;
    for (const v of mag) max = Math.max(max, Math.log1p(v));
    const logMag = Float64Array.from(mag, (v) => (max > 0 ? Math.log1p(v) / max : 0));
    const rowEnergy = new Float64Array(N);
    for (let i = 0; i < N * N; i++) rowEnergy[Math.floor(i / N)] += mag[i] * mag[i];
    const totalEnergy = rowEnergy.reduce((a, b) => a + b, 0);
    const fullImg = magnitude(kSpaceToImage(k));
    return { k, logMag, fullImg, fullMax: percentile(fullImg, 0.995), rowEnergy, totalEnergy };
  }, [sequence, trMs, te]);

  const rows = useMemo(() => lineOrder(order), [order]);

  const { measured, lastShot, recon, energy, deviation } = useMemo(() => {
    const measured = new Uint8Array(N);
    for (let i = 0; i < count; i++) measured[rows[i]] = 1;
    const lastShot = new Set(rows.slice(Math.max(0, count - etl), count));
    const re = new Float64Array(N * N);
    const im = new Float64Array(N * N);
    let energy = 0;
    for (let y = 0; y < N; y++) {
      if (!measured[y]) continue;
      energy += rowEnergy[y];
      const off = y * N;
      re.set(k.re.subarray(off, off + N), off);
      im.set(k.im.subarray(off, off + N), off);
    }
    const recon = magnitude(kSpaceToImage({ re, im, size: N }));
    let diff = 0;
    let ref = 0;
    for (let i = 0; i < recon.length; i++) {
      diff += (recon[i] - fullImg[i]) ** 2;
      ref += fullImg[i] ** 2;
    }
    return { measured, lastShot, recon, energy: totalEnergy > 0 ? energy / totalEnergy : 0, deviation: ref > 0 ? Math.sqrt(diff / ref) : 1 };
  }, [k, rows, count, etl, rowEnergy, totalEnergy, fullImg]);

  useEffect(() => {
    if (kCanvas.current) drawKSpace(kCanvas.current, logMag, measured, lastShot);
    if (imgCanvas.current) drawGrayscale(imgCanvas.current, recon, N, { max: fullMax });
  }, [logMag, measured, lastShot, recon, fullMax]);

  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      const next = Math.min(N, countRef.current + etl);
      setCount(next);
      if (next >= N) setPlaying(false);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [playing, etl]);
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  const shots = Math.ceil(count / etl);
  const totalShots = N / etl;
  const timeNow = (shots * trMs) / 1000;
  const timeTotal = (totalShots * trMs) / 1000;
  const ms = tr('ms', 'мс');

  const chooseContrast = (c: Contrast) => {
    setContrast(c);
    setTrMs(CONTRAST[c].tr);
  };
  const chooseEtl = (e: Etl) => {
    setEtl(e);
    setCount((c) => Math.min(N, Math.ceil(c / e) * e));
  };
  const togglePlay = () => {
    if (!playing && count >= N) setCount(0);
    setPlaying((p) => !p);
  };

  return (
    <>
      <Panel title={tr('k-Raum: gemessene Zeilen', 'k-пространство: измеренные строки')}>
        <canvas ref={kCanvas} className="pixel-canvas" aria-label={tr(`k-Raum, ${count} von ${N} Zeilen gemessen`, `k-пространство, измерено ${count} из ${N} строк`)} />
        <p className="small muted">
          {tr(
            'Dunkelblau: noch nicht gemessen · Grün: Zeilen aus dem letzten TR · Bildmitte = k-Raum-Zentrum',
            'Тёмно-синий: ещё не измерено · зелёный: строки из последнего TR · середина = центр k-пространства',
          )}
        </p>
      </Panel>
      <Panel title={tr('Bild aus den bisherigen Zeilen', 'Изображение из уже измеренных строк')}>
        <canvas ref={imgCanvas} className="pixel-canvas" aria-label={tr('Rekonstruiertes Kopfbild aus den gemessenen Zeilen', 'Изображение головы, реконструированное из измеренных строк')} />
        <p className="small muted">
          {tr(
            'Inverse 2D-FFT, fehlende Zeilen = 0. Die Helligkeitsskala ist fest auf das fertige Bild eingestellt.',
            'Обратное 2D-FFT, недостающие строки = 0. Шкала яркости зафиксирована по готовому изображению.',
          )}
        </p>
      </Panel>
      <Panel title={tr('Messung steuern', 'Управление измерением')}>
        <div className="imaging-controls">
          <Segmented<Contrast>
            label={tr('Kontrast', 'Контраст')}
            value={contrast}
            onChange={chooseContrast}
            options={[
              { value: 'T1w', label: `T1w (TE 12 ${ms})` },
              { value: 'T2w', label: `T2w (TE 100 ${ms})` },
            ]}
          />
          <Segmented<Order>
            label={tr('Reihenfolge', 'Порядок')}
            value={order}
            onChange={setOrder}
            options={[
              { value: 'linear', label: tr('Linear', 'Линейный') },
              { value: 'centric', label: tr('Zentrisch', 'Центрический') },
            ]}
          />
          <Segmented<Etl>
            label={tr('Sequenz', 'Последовательность')}
            value={etl}
            onChange={chooseEtl}
            options={[
              { value: 1, label: tr('Spin-Echo', 'Спин-эхо') },
              { value: 4, label: 'TSE ETL 4' },
              { value: 8, label: 'TSE ETL 8' },
            ]}
          />
          <Slider
            label={tr('Repetitionszeit TR', 'Время повторения TR')}
            value={trMs}
            min={300}
            max={5000}
            step={50}
            unit={ms}
            onChange={setTrMs}
            hint={tr('Ändert die Messzeit und auch den Kontrast.', 'Меняет время измерения и контраст.')}
          />
          <Slider
            label={tr('Gemessene Zeilen', 'Измеренные строки')}
            value={count}
            min={0}
            max={N}
            step={etl}
            onChange={(v) => {
              setPlaying(false);
              setCount(v);
            }}
          />
          <div className="row gap wrap">
            <button className="btn primary" type="button" disabled={reduced} onClick={togglePlay}>
              {playing ? tr('⏸ Pause', '⏸ Пауза') : tr('▶ Abspielen', '▶ Запустить')}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setPlaying(false);
                setCount(0);
              }}
            >
              {tr('Von vorn', 'Сначала')}
            </button>
            <button
              className="btn"
              type="button"
              onClick={() => {
                setPlaying(false);
                setCount(N);
              }}
            >
              {tr('Alles messen', 'Измерить всё')}
            </button>
          </div>
          {reduced && (
            <p className="small muted">
              {tr('Bewegung ist reduziert. Schiebe den Regler „Gemessene Zeilen“ von Hand.', 'Анимация отключена. Двигай ползунок «Измеренные строки» вручную.')}
            </p>
          )}
        </div>
        <div className="stat-grid two imaging-stats">
          <Stat label={tr('Zeilen gemessen', 'Строк измерено')} value={`${count} / ${N}`} />
          <Stat
            label={tr('TR-Durchgänge', 'Повторений TR')}
            value={`${shots} / ${totalShots}`}
            sub={etl > 1 ? tr(`${etl} Zeilen pro TR`, `${etl} строк за TR`) : tr('1 Zeile pro TR', '1 строка за TR')}
          />
          <Stat label={tr('Messzeit bisher', 'Время измерения сейчас')} value={fmtDuration(timeNow)} sub={`${fmt(timeNow, 1)} ${tr('s', 'с')}`} />
          <Stat
            label={tr('Messzeit gesamt', 'Полное время')}
            value={fmtDuration(timeTotal)}
            sub={`${N} · ${fmt(trMs, 0)} ${ms} / ${etl}`}
            tone={etl > 1 ? 'good' : undefined}
          />
          <Stat label={tr('Signalenergie erfasst', 'Собранная энергия сигнала')} value={fmt(energy * 100, 1)} unit="%" tone={energy > 0.9 ? 'good' : energy > 0.5 ? 'warn' : 'bad'} />
          <Stat
            label={tr('Abweichung vom Endbild', 'Отличие от итогового')}
            value={fmt(deviation * 100, 0)}
            unit="%"
            tone={deviation < 0.2 ? 'good' : deviation < 0.5 ? 'warn' : 'bad'}
          />
        </div>
      </Panel>

      <Panel title={tr('Was du hier siehst', 'Что здесь видно')} className="span-3">
        <TeX block tex={tr('T_A = \\frac{N_{\\text{Zeilen}} \\cdot TR}{ETL}', 'T_A = \\frac{N_{\\text{строк}} \\cdot TR}{ETL}')} />
        <p className="small">
          <RichText
            text={tr(
              `Die Messzeit $T_A$ ist die Zahl der Phasenkodierzeilen mal TR, geteilt durch die Echozuglänge ETL. Beim Spin-Echo ist ETL = 1, hier also ${N} · ${fmt(trMs, 0)} ms = ${fmt((N * trMs) / 1000, 1)} s. Eine TSE mit ETL 8 nimmt pro TR acht Zeilen mit und ist deshalb achtmal so schnell.`,
              `Время измерения $T_A$ равно числу строк фазового кодирования, умноженному на TR и делённому на длину эхо-цепочки ETL. В спин-эхо ETL = 1, значит здесь ${N} · ${fmt(trMs, 0)} мс = ${fmt((N * trMs) / 1000, 1)} с. TSE с ETL 8 берёт за один TR восемь строк и поэтому работает в восемь раз быстрее.`,
            )}
          />
        </p>
        <Callout
          variant="merke"
          title={tr('Zentrisch: Kontrast zuerst', 'Центрический порядок: сначала контраст')}
          text={tr(
            'Probier beide Reihenfolgen bei etwa 16 Zeilen. Linear hast du nur den oberen Rand des k-Raums: Das Bild ist dunkel und zeigt fast nur feine Streifen. Zentrisch hast du die Mitte: Das Bild ist noch unscharf, aber hell und dunkel stimmen schon. **Die Mitte des k-Raums trägt den Kontrast, der Rand die feinen Details.**',
            'Попробуй оба порядка примерно при 16 строках. При линейном порядке у тебя только верхний край k-пространства: изображение тёмное и показывает почти одни мелкие полосы. При центрическом у тебя середина: изображение ещё размыто, но светлое и тёмное уже на своих местах. **Центр k-пространства несёт контраст, край несёт мелкие детали.**',
          )}
        />
      </Panel>
    </>
  );
}

// ---------------------------------------------------------------- Modus 2: FOV & Auflösung

/** Feines Rechenraster: 256 × 256 Punkte über 2·FOV. Gemessen wird davon jede 2. Zeile, also Δk = 1/FOV. */
const G = 256;
/** Kopfphantom: 220 mm Höhe entsprechen 0,92 der halben Rasterbreite des 128er-Phantoms */
const HEAD_MM = 220;
const PHANTOM_PX_MM = HEAD_MM / (0.92 * N);
const MATRICES = [32, 64, 128] as const;
type Matrix = (typeof MATRICES)[number];

function FovMode() {
  const { tr } = useLang();
  const [fov, setFov] = useState(240);
  const [matrix, setMatrix] = useState<Matrix>(128);
  const [grad, setGrad] = useState(10);
  const overview = useRef<HTMLCanvasElement>(null);
  const imgCanvas = useRef<HTMLCanvasElement>(null);

  const base = useMemo(
    () => renderPhantom(getPhantom('brain', N), FIELD, (p, t) => tissueSignal(p, t, { ...DEFAULT_PROTOCOL, sequence: 'TSE', tr: 4000, te: 100 })),
    [],
  );

  /** Objekt auf dem feinen Raster (Breite 2·FOV), bilinear aus dem 128er-Phantom, und sein k-Raum. */
  const { obj, k } = useMemo(() => {
    const px = (2 * fov) / G;
    const obj = new Float64Array(G * G);
    const sample = (sx: number, sy: number) => (sx < 0 || sy < 0 || sx >= N || sy >= N ? 0 : base[sy * N + sx]);
    for (let y = 0; y < G; y++) {
      const fy = ((y + 0.5 - G / 2) * px) / PHANTOM_PX_MM + N / 2 - 0.5;
      const y0 = Math.floor(fy);
      const wy = fy - y0;
      for (let x = 0; x < G; x++) {
        const fx = ((x + 0.5 - G / 2) * px) / PHANTOM_PX_MM + N / 2 - 0.5;
        const x0 = Math.floor(fx);
        const wx = fx - x0;
        obj[y * G + x] =
          (1 - wy) * ((1 - wx) * sample(x0, y0) + wx * sample(x0 + 1, y0)) + wy * ((1 - wx) * sample(x0, y0 + 1) + wx * sample(x0 + 1, y0 + 1));
      }
    }
    return { obj, k: imageToKSpace(obj, G) };
  }, [base, fov]);

  /** Nur jede 2. ky-Zeile (Δk = 1/FOV) und nur |k| < k_max der Matrix, dann Ausschnitt FOV × FOV. */
  const recon = useMemo(() => {
    const re = new Float64Array(G * G);
    const im = new Float64Array(G * G);
    for (let y = 0; y < G; y++) {
      const ky = y - G / 2;
      if (ky % 2 !== 0 || Math.abs(ky) >= matrix) continue;
      for (let x = 0; x < G; x++) {
        if (Math.abs(x - G / 2) >= matrix) continue;
        const i = y * G + x;
        re[i] = k.re[i];
        im[i] = k.im[i];
      }
    }
    const mag = magnitude(kSpaceToImage({ re, im, size: G }));
    // In Phasenrichtung ist das Bild jetzt periodisch mit FOV; in Ausleserichtung schneidet der Filter ab.
    const out = new Float64Array(N * N);
    for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) out[y * N + x] = mag[(y + G / 4) * G + x + G / 4];
    return out;
  }, [k, matrix]);

  useEffect(() => {
    const c = overview.current;
    if (c) {
      drawGrayscale(c, obj, G);
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(G / 4, G / 4, G / 2, G / 2);
      }
    }
    if (imgCanvas.current) drawGrayscale(imgCanvas.current, recon, N);
  }, [obj, recon]);

  const pixel = pixelSizeMm(fov, matrix);
  const dk = deltaK(fov);
  const km = kMax(fov, matrix);
  const bw = GAMMA_BAR_H1 * 1e6 * grad * 1e-3 * (fov / 1000);
  const bwPx = bw / matrix;
  const aliasing = fov < HEAD_MM;
  const mm = tr('mm', 'мм');
  const perM = tr('1/m', 'м⁻¹');

  return (
    <>
      <Panel title={tr('Objekt und FOV (gelb)', 'Объект и FOV (жёлтый)')}>
        <canvas ref={overview} className="pixel-canvas" aria-label={tr(`Kopf mit eingezeichnetem FOV von ${fov} mm`, `Голова с отмеченным FOV ${fov} мм`)} />
        <p className="small muted">
          {tr(
            `Der Kopf ist in Phasenrichtung (vertikal) ${HEAD_MM} mm hoch. Gezeigt sind ${2 * fov} mm, das gelbe Quadrat ist das FOV.`,
            `Голова в фазовом направлении (по вертикали) высотой ${HEAD_MM} мм. Показано ${2 * fov} мм, жёлтый квадрат это FOV.`,
          )}
        </p>
      </Panel>
      <Panel title={tr('Rekonstruiertes Bild im FOV', 'Реконструированное изображение в FOV')}>
        <canvas
          ref={imgCanvas}
          className="pixel-canvas"
          aria-label={aliasing ? tr('Rekonstruiertes Bild mit Einfaltung', 'Реконструированное изображение с заворотом') : tr('Rekonstruiertes Bild ohne Einfaltung', 'Реконструированное изображение без заворота')}
        />
        <p className="small muted">
          {tr(
            `Gemessen wird nur jede 2. Zeile des feinen Rasters, also Δk = 1/FOV. Matrix ${matrix} bedeutet ${matrix} Phasenzeilen.`,
            `Измеряется только каждая 2-я строка мелкой сетки, то есть Δk = 1/FOV. Матрица ${matrix} означает ${matrix} фазовых строк.`,
          )}
        </p>
      </Panel>
      <Panel title={tr('Parameter', 'Параметры')}>
        <div className="imaging-controls">
          <Slider label="FOV" value={fov} min={120} max={300} step={10} unit={mm} onChange={setFov} hint={tr(`Kopfhöhe: ${HEAD_MM} mm`, `Высота головы: ${HEAD_MM} мм`)} />
          <Segmented<Matrix>
            label={tr('Matrix N', 'Матрица N')}
            value={matrix}
            onChange={setMatrix}
            options={MATRICES.map((m) => ({ value: m, label: String(m) }))}
          />
          <Slider label={tr('Auslesegradient Gₓ', 'Градиент считывания Gₓ')} value={grad} min={2} max={30} step={1} unit={tr('mT/m', 'мТл/м')} onChange={setGrad} />
        </div>
        <div className="stat-grid two imaging-stats">
          <Stat label={tr('Pixelgröße', 'Размер пикселя')} value={fmt(pixel, 2)} unit={mm} sub="FOV / N" />
          <Stat label="Δk" value={fmt(dk, 2)} unit={perM} sub="1 / FOV" />
          <Stat label="k_max" value={fmt(km, 0)} unit={perM} sub="N / (2·FOV)" />
          <Stat label={tr('Bandbreite', 'Полоса')} value={fmt(bw / 1000, 1)} unit={tr('kHz', 'кГц')} sub="γ̄ · Gₓ · FOV" />
          <Stat label={tr('Δf pro Pixel', 'Δf на пиксель')} value={fmt(bwPx, 0)} unit={tr('Hz', 'Гц')} sub="BW / N" />
          <Stat
            label={tr('Einfaltung', 'Заворот')}
            value={aliasing ? tr('ja', 'да') : tr('nein', 'нет')}
            tone={aliasing ? 'bad' : 'good'}
            sub={aliasing ? tr(`${fmt(HEAD_MM - fov, 0)} mm zu viel`, `${fmt(HEAD_MM - fov, 0)} мм лишние`) : tr('Kopf passt ins FOV', 'голова помещается')}
          />
        </div>
      </Panel>

      <Panel title={tr('So wird gerechnet', 'Как считается')} className="span-3">
        <TeX block tex="\begin{aligned} \Delta x &= \frac{FOV}{N}, \quad \Delta k = \frac{1}{FOV} \\ k_{\max} &= \frac{N}{2\,FOV} \\ BW &= \bar\gamma\, G_x\, FOV, \quad \Delta f_{\text{Pixel}} = \frac{BW}{N} \end{aligned}" />
        <p className="small">
          {tr(
            'N ist die Matrix, also die Zahl der Pixel bzw. Zeilen. γ̄ = 42,58 MHz/T ist das gyromagnetische Verhältnis geteilt durch 2π, Gₓ der Auslesegradient. Bild und k-Raum verhalten sich wie Kehrwerte: Der Abstand Δk legt das Bildfeld fest, die Reichweite k_max die Pixelgröße.',
            'N это матрица, то есть число пикселей или строк. γ̄ = 42,58 МГц/Тл это гиромагнитное отношение, делённое на 2π, Gₓ градиент считывания. Изображение и k-пространство ведут себя как обратные величины: шаг Δk задаёт поле обзора, а размах k_max задаёт размер пикселя.',
          )}
        </p>
        <Callout
          variant={aliasing ? 'achtung' : 'merke'}
          title={tr('Warum sich das Bild einfaltet', 'Почему изображение заворачивается')}
          text={tr(
            'Tastest du den k-Raum im Abstand Δk = 1/FOV ab, wird das Bild periodisch: Es wiederholt sich alle FOV Millimeter. Ragt der Kopf über das FOV hinaus, überlappen sich die Kopien, und der obere Rand taucht unten im Bild auf. Das passiert in **Phasenrichtung**. In Ausleserichtung schneidet der Empfangsfilter alles außerhalb der Bandbreite ab, dort fehlt der Rand einfach.',
            'Если дискретизировать k-пространство с шагом Δk = 1/FOV, изображение становится периодическим: оно повторяется через каждые FOV миллиметров. Если голова выступает за FOV, копии накладываются, и верхний край появляется внизу изображения. Это происходит в **фазовом направлении**. В направлении считывания приёмный фильтр отрезает всё вне полосы, там край просто пропадает.',
          )}
        />
      </Panel>
    </>
  );
}
