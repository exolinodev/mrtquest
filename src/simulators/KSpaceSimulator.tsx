import { useEffect, useMemo, useRef, useState, type MouseEvent } from 'react';
import { Panel, Segmented, Slider, Toggle } from '../components/ui';
import { useGame } from '../game/GameContext';
import { useLang } from '../i18n/LanguageContext';
import { imageToKSpace, kSpaceToImage, magnitude, type Complex2D } from '../physics/fft';
import { fmt } from '../physics/mri';
import { getPhantom, renderPhantom, seededRandom, type PhantomId } from '../physics/phantom';
import { DEFAULT_PROTOCOL, drawGrayscale, tissueSignal, type Protocol } from '../physics/protocol';

const N = 128;

type Contrast = 'T1w' | 'T2w';
type FilterMode = 'none' | 'lowpass' | 'highpass';

const CONTRAST: Record<Contrast, Protocol> = {
  T1w: { ...DEFAULT_PROTOCOL, sequence: 'SE', tr: 550, te: 12 },
  T2w: { ...DEFAULT_PROTOCOL, sequence: 'TSE', tr: 4000, te: 100 },
};

function drawKSpace(canvas: HTMLCanvasElement, k: Complex2D, mask: Uint8Array) {
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
    const off = !mask[i];
    // Gemessene Daten: Magma-ähnliche Farbskala; verworfene Daten: abgedunkelt blau
    img.data[i * 4] = off ? 10 : Math.round(255 * Math.min(1, v * 1.4));
    img.data[i * 4 + 1] = off ? 16 : Math.round(255 * Math.max(0, v * 1.4 - 0.45));
    img.data[i * 4 + 2] = off ? 40 : Math.round(255 * Math.min(1, 0.35 + v * 0.6));
    img.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(img, 0, 0);
}

function drawSigned(canvas: HTMLCanvasElement, data: Float64Array) {
  let max = 0;
  for (const v of data) max = Math.max(max, Math.abs(v));
  const shifted = Float64Array.from(data, (v) => (max > 0 ? (v / max + 1) / 2 : 0.5));
  drawGrayscale(canvas, shifted, N, { max: 1 });
}

export function KSpaceSimulator() {
  const { dispatch } = useGame();
  const { tr } = useLang();
  const [phantomId, setPhantomId] = useState<PhantomId>('brain');
  const [contrast, setContrast] = useState<Contrast>('T2w');
  const [filter, setFilter] = useState<FilterMode>('none');
  const [radius, setRadius] = useState(20);
  const [skip, setSkip] = useState(1);
  const [partial, setPartial] = useState(1);
  const [spike, setSpike] = useState(false);
  const [motion, setMotion] = useState(0);
  const [basis, setBasis] = useState<{ kx: number; ky: number } | null>(null);
  const kCanvas = useRef<HTMLCanvasElement>(null);
  const imgCanvas = useRef<HTMLCanvasElement>(null);
  const basisCanvas = useRef<HTMLCanvasElement>(null);

  const baseK = useMemo(() => {
    const phantom = getPhantom(phantomId, N);
    const img = renderPhantom(phantom, 1.5, (p, t) => tissueSignal(p, t, CONTRAST[contrast]));
    return imageToKSpace(img, N);
  }, [phantomId, contrast]);

  const { k, mask, energyKept } = useMemo(() => {
    const re = new Float64Array(baseK.re);
    const im = new Float64Array(baseK.im);
    const mask = new Uint8Array(N * N);
    const half = N / 2;
    const rand = seededRandom(42);
    let total = 0;
    let kept = 0;
    for (let ky = 0; ky < N; ky++) {
      const kyc = ky - half;
      // Bewegung: zufällige Verschiebung pro Phasenkodierzeile → linearer Phasenfehler
      const shift = motion > 0 ? (rand() - 0.5) * motion : 0;
      for (let kx = 0; kx < N; kx++) {
        const kxc = kx - half;
        const i = ky * N + kx;
        const r = Math.hypot(kxc, kyc);
        let keep = true;
        if (filter === 'lowpass' && r > radius) keep = false;
        if (filter === 'highpass' && r < radius) keep = false;
        if (skip > 1 && ((ky - half) % skip + skip) % skip !== 0) keep = false;
        if (partial < 1 && ky < Math.round(N * (1 - partial))) keep = false;
        const e = re[i] * re[i] + im[i] * im[i];
        total += e;
        if (!keep) {
          re[i] = 0;
          im[i] = 0;
          continue;
        }
        kept += e;
        mask[i] = 1;
        if (shift !== 0) {
          const phi = (2 * Math.PI * kyc * shift) / N;
          const c = Math.cos(phi);
          const s = Math.sin(phi);
          const r0 = re[i];
          re[i] = r0 * c - im[i] * s;
          im[i] = r0 * s + im[i] * c;
        }
      }
    }
    if (spike) {
      const i = (half + 23) * N + (half + 31);
      const peak = Math.hypot(baseK.re[half * N + half], baseK.im[half * N + half]);
      re[i] += peak * 0.18;
      mask[i] = 1;
    }
    return { k: { re, im, size: N }, mask, energyKept: total > 0 ? kept / total : 0 };
  }, [baseK, filter, radius, skip, partial, spike, motion]);

  useEffect(() => {
    if (kCanvas.current) drawKSpace(kCanvas.current, k, mask);
    if (imgCanvas.current) drawGrayscale(imgCanvas.current, magnitude(kSpaceToImage(k)), N);
  }, [k, mask]);

  useEffect(() => {
    if (!basis || !basisCanvas.current) return;
    const re = new Float64Array(N * N);
    const im = new Float64Array(N * N);
    re[(basis.ky + N / 2) * N + basis.kx + N / 2] = 1;
    drawSigned(basisCanvas.current, kSpaceToImage({ re, im, size: N }).re);
  }, [basis]);

  useEffect(() => {
    if (spike) dispatch({ type: 'FLAG', flag: 'kspace-spike', xp: 10 });
  }, [spike, dispatch]);

  const onKClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const kx = Math.floor(((e.clientX - rect.left) / rect.width) * N) - N / 2;
    const ky = Math.floor(((e.clientY - rect.top) / rect.height) * N) - N / 2;
    setBasis({ kx, ky });
    if (kx !== 0 || ky !== 0) dispatch({ type: 'FLAG', flag: 'kspace-basis', xp: 10 });
  };

  const reset = () => {
    setFilter('none');
    setSkip(1);
    setPartial(1);
    setSpike(false);
    setMotion(0);
  };

  const presets: Array<{ id: string; label: string; text: string; apply: () => void }> = [
    {
      id: 'center',
      label: tr('Nur Zentrum', 'Только центр'),
      text: tr('Tiefpass: Kontrast bleibt, Details verschwinden, Gibbs-Ringing an Kanten.', 'Фильтр нижних частот: контраст сохраняется, детали исчезают, на краях – звон Гиббса.'),
      apply: () => {
        reset();
        setFilter('lowpass');
        setRadius(12);
      },
    },
    {
      id: 'periphery',
      label: tr('Nur Peripherie', 'Только периферия'),
      text: tr('Hochpass: nur Kanten bleiben – Kontrast und Flächen fehlen.', 'Фильтр верхних частот: остаются только края – контраст и площади исчезают.'),
      apply: () => {
        reset();
        setFilter('highpass');
        setRadius(8);
      },
    },
    {
      id: 'skip',
      label: tr('Jede 2. Zeile', 'Каждая 2-я строка'),
      text: tr('Δk verdoppelt → FOV halbiert → Einfaltung in Phasenrichtung.', 'Δk удваивается → FOV уменьшается вдвое → заворот в фазовом направлении.'),
      apply: () => {
        reset();
        setSkip(2);
      },
    },
    {
      id: 'partial',
      label: tr('Partial Fourier 5/8', 'Partial Fourier 5/8'),
      text: tr(
        'Fehlende Hälfte wird hier ohne Symmetrie-Rekonstruktion mit Nullen gefüllt → leichte Unschärfe/Phasenfehler.',
        'Недостающая часть здесь заполнена нулями без симметричной реконструкции → лёгкая размытость/фазовые ошибки.',
      ),
      apply: () => {
        reset();
        setPartial(0.625);
      },
    },
    {
      id: 'spike',
      label: tr('Spike', 'Спайк'),
      text: tr('Ein einziger fehlerhafter Datenpunkt → Streifenmuster über das gesamte Bild.', 'Одна-единственная ошибочная точка данных → полосатый узор по всему изображению.'),
      apply: () => {
        reset();
        setSpike(true);
      },
    },
    {
      id: 'motion',
      label: tr('Bewegung', 'Движение'),
      text: tr(
        'Zufällige Verschiebung zwischen den Phasenkodierzeilen → Geister/Verschmierung in Phasenrichtung.',
        'Случайное смещение между строками фазового кодирования → фантомы/размытие в фазовом направлении.',
      ),
      apply: () => {
        reset();
        setMotion(4);
      },
    },
  ];
  const [presetId, setPresetId] = useState<string | null>(null);
  const presetText = presets.find((p) => p.id === presetId)?.text;

  return (
    <div className="sim-grid">
      <Panel title={tr('k-Raum (log. Betrag)', 'k-пространство (лог. модуль)')} actions={<span className="small muted">{tr('Klick: Basiswelle', 'Клик: базисная волна')}</span>}>
        <canvas ref={kCanvas} className="pixel-canvas clickable" onClick={onKClick} aria-label={tr('k-Raum-Darstellung, anklickbar', 'Изображение k-пространства, кликабельное')} />
        <p className="small muted">
          {tr('Dunkelblau = nicht gemessene/verworfene Daten · Signalenergie erhalten', 'Тёмно-синий = неизмеренные/отброшенные данные · сохранённая энергия сигнала')}:{' '}
          <strong>{fmt(energyKept * 100, 1)} %</strong>
        </p>
      </Panel>
      <Panel title={tr('Rekonstruiertes Bild (inverse 2D-FFT)', 'Реконструированное изображение (обратное 2D-FFT)')}>
        <canvas ref={imgCanvas} className="pixel-canvas" aria-label={tr('Rekonstruiertes MR-Bild', 'Реконструированное МР-изображение')} />
        <p className="small muted">{tr('Phasenrichtung: vertikal (y) · Ausleserichtung: horizontal (x)', 'Фазовое направление: вертикальное (y) · направление считывания: горизонтальное (x)')}</p>
      </Panel>
      <Panel title={tr('Basiswelle eines k-Punkts', 'Базисная волна точки k-пространства')}>
        {basis ? (
          <>
            <canvas ref={basisCanvas} className="pixel-canvas" aria-label={tr('Ortsfrequenz-Muster des gewählten k-Raum-Punkts', 'Узор пространственной частоты выбранной точки k-пространства')} />
            <p className="small">
              k<sub>x</sub> = {basis.kx}, k<sub>y</sub> = {basis.ky} → {fmt(Math.hypot(basis.kx, basis.ky), 1)}{' '}
              {tr(
                'Perioden über das FOV. Ein einzelner k-Punkt ist eine ebene Welle über das ganze Bild!',
                'периодов на FOV. Отдельная точка k-пространства – это плоская волна на всё изображение!',
              )}
            </p>
          </>
        ) : (
          <p className="muted">
            {tr(
              'Klicke in den k-Raum, um die zugehörige Ortsfrequenz (ebene Welle) zu sehen. Punkte nahe dem Zentrum sind langwellig, äußere Punkte fein gestreift.',
              'Кликни в k-пространстве, чтобы увидеть соответствующую пространственную частоту (плоскую волну). Точки вблизи центра длинноволновые, внешние – мелкополосатые.',
            )}
          </p>
        )}
      </Panel>

      <Panel title={tr('Experimente', 'Эксперименты')} className="span-3">
        <div className="row wrap gap">
          <Segmented<PhantomId>
            label={tr('Objekt', 'Объект')}
            value={phantomId}
            options={[
              { value: 'brain', label: tr('Kopf', 'Голова') },
              { value: 'knee', label: tr('Knie', 'Колено') },
              { value: 'abdomen', label: tr('Abdomen', 'Живот') },
            ]}
            onChange={setPhantomId}
          />
          <Segmented<Contrast>
            label={tr('Kontrast', 'Контраст')}
            value={contrast}
            options={[
              { value: 'T1w', label: 'T1w' },
              { value: 'T2w', label: 'T2w' },
            ]}
            onChange={setContrast}
          />
        </div>
        <div className="row wrap gap preset-row">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              className="btn small"
              onClick={() => {
                p.apply();
                setPresetId(p.id);
              }}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            className="btn small ghost"
            onClick={() => {
              reset();
              setPresetId(null);
            }}
          >
            {tr('Zurücksetzen', 'Сбросить')}
          </button>
        </div>
        {presetText && <p className="callout callout-info small">{presetText}</p>}
        <div className="control-grid">
          <Segmented<FilterMode>
            label={tr('k-Raum-Filter', 'Фильтр k-пространства')}
            value={filter}
            options={[
              { value: 'none', label: tr('aus', 'выкл.') },
              { value: 'lowpass', label: tr('Tiefpass', 'Нижних частот') },
              { value: 'highpass', label: tr('Hochpass', 'Верхних частот') },
            ]}
            onChange={setFilter}
          />
          <Slider label={tr('Filterradius', 'Радиус фильтра')} value={radius} min={2} max={60} unit={tr('k-Punkte', 'точек k')} onChange={setRadius} disabled={filter === 'none'} />
          <Slider label={tr('Unterabtastung R (jede R-te Zeile)', 'Неполная выборка R (каждая R-я строка)')} value={skip} min={1} max={4} onChange={setSkip} />
          <Slider
            label={tr('Partial Fourier (gemessener Anteil)', 'Частичное Фурье (измеренная доля)')}
            value={partial}
            min={0.5}
            max={1}
            step={0.125}
            onChange={setPartial}
            format={(v) => `${fmt(v * 8, 0)}/8`}
          />
          <Slider label={tr('Bewegung (Verschiebung pro Zeile)', 'Движение (смещение на строку)')} value={motion} min={0} max={8} step={0.5} unit={tr('px', 'пикс.')} onChange={setMotion} />
          <Toggle label={tr('Spike (fehlerhafter Datenpunkt)', 'Спайк (ошибочная точка данных)')} checked={spike} onChange={setSpike} />
        </div>
      </Panel>
    </div>
  );
}
