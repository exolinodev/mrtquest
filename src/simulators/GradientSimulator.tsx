import { useMemo, useState } from 'react';
import { LineChart, sampleCurve } from '../components/LineChart';
import { TeX } from '../components/RichText';
import { Panel, Segmented, Slider, Stat } from '../components/ui';
import { useGame } from '../game/GameContext';
import { useLang } from '../i18n/LanguageContext';
import { HARDWARE } from '../physics/constants';
import { fmt, hzPerMeter, readoutFovMm, sliceThicknessMm, slicePositionMm } from '../physics/mri';

type Tab = 'slice' | 'readout' | 'phase';

function randomTarget() {
  const thick = [1, 2, 3, 4, 5, 8][Math.floor(Math.random() * 6)];
  const pos = Math.round((Math.random() * 160 - 80) / 5) * 5;
  return { thick, pos };
}

type SliceResult = { ok: true } | { ok: false; thickness: 'thick' | 'thin' | null; posOffset: number | null };

function SliceSelection() {
  const { dispatch } = useGame();
  const { tr } = useLang();
  const [g, setG] = useState(10);
  const [bw, setBw] = useState(1500);
  const [offset, setOffset] = useState(0);
  const [target, setTarget] = useState(randomTarget);
  const [result, setResult] = useState<SliceResult | null>(null);
  const thick = sliceThicknessMm(bw, g);
  const pos = slicePositionMm(offset, g);
  const hzmm = hzPerMeter(g) / 1000;
  const mm = tr('mm', 'мм');
  const Hz = tr('Hz', 'Гц');

  // Diagramm: Frequenzoffset über Ort
  const zRange: [number, number] = [-200, 200];
  const fMax = (hzPerMeter(HARDWARE.maxGradient_mT_per_m) * 0.2) / 1000;

  const check = () => {
    const thickOk = Math.abs(thick - target.thick) <= Math.max(0.15, target.thick * 0.05);
    const posOk = Math.abs(pos - target.pos) <= 1;
    if (thickOk && posOk) {
      setResult({ ok: true });
      dispatch({ type: 'FLAG', flag: 'slice-target', xp: 20 });
      setTarget(randomTarget());
    } else {
      setResult({ ok: false, thickness: thickOk ? null : thick > target.thick ? 'thick' : 'thin', posOffset: posOk ? null : pos - target.pos });
    }
  };

  const resultText = (r: SliceResult): string => {
    if (r.ok) return tr('✔ Zielschicht exakt getroffen! Neue Zielschicht generiert.', '✔ Целевой срез точно задан! Сгенерирован новый целевой срез.');
    const hints: string[] = [];
    if (r.thickness === 'thick') hints.push(tr('Schicht zu dick (Gradient ↑ oder Bandbreite ↓)', 'Срез слишком толстый (градиент ↑ или полоса ↓)'));
    if (r.thickness === 'thin') hints.push(tr('Schicht zu dünn (Gradient ↓ oder Bandbreite ↑)', 'Срез слишком тонкий (градиент ↓ или полоса ↑)'));
    if (r.posOffset !== null) hints.push(tr(`Position um ${fmt(r.posOffset, 1)} mm versetzt (Offset anpassen)`, `Положение смещено на ${fmt(r.posOffset, 1)} мм (подстрой сдвиг частоты)`));
    return `✘ ${hints.join('; ')}.`;
  };

  return (
    <div className="sim-grid">
      <Panel title={tr('Resonanzfrequenz unter dem Schichtgradienten', 'Резонансная частота под градиентом выбора среза')} className="span-2">
        <LineChart
          ariaLabel={tr('Frequenzoffset in Abhängigkeit vom Ort', 'Сдвиг частоты в зависимости от положения')}
          xDomain={zRange}
          yDomain={[-fMax, fMax]}
          xLabel={tr('Position z [mm]', 'Положение z [мм]')}
          yLabel={tr('Frequenzoffset [kHz]', 'Сдвиг частоты [кГц]')}
          zeroLine
          series={[
            { id: 'f', label: `f(z) − f₀ = γ̄·Gs·z  (${fmt(hzmm, 0)} ${Hz}/${mm})`, color: '#34d399', points: sampleCurve((z) => (hzmm * z) / 1000, zRange, 4) },
            {
              id: 'lo',
              label: tr('Pulsbandbreite', 'Полоса импульса'),
              color: '#f472b6',
              dashed: true,
              points: [
                [zRange[0], (offset - bw / 2) / 1000],
                [zRange[1], (offset - bw / 2) / 1000],
              ],
            },
            {
              id: 'hi',
              label: '',
              color: '#f472b6',
              dashed: true,
              points: [
                [zRange[0], (offset + bw / 2) / 1000],
                [zRange[1], (offset + bw / 2) / 1000],
              ],
            },
          ]}
          markers={[
            { x: pos - thick / 2, label: '', color: '#fbbf24' },
            { x: pos + thick / 2, label: `${tr('Schicht', 'Срез')} ${fmt(thick, 2)} ${mm}`, color: '#fbbf24' },
            { x: target.pos, label: tr('Ziel', 'Цель'), color: '#94a3b8' },
          ]}
        />
        <div className="body-strip" aria-hidden="true">
          <div className="body-silhouette" />
          <div className="slice-band" style={{ left: `${((pos - thick / 2 - zRange[0]) / 400) * 100}%`, width: `${Math.max(0.4, (thick / 400) * 100)}%` }} />
          <div className="slice-target" style={{ left: `${((target.pos - target.thick / 2 - zRange[0]) / 400) * 100}%`, width: `${Math.max(0.4, (target.thick / 400) * 100)}%` }} />
        </div>
        <p className="small muted">
          {tr(
            'Gelb: angeregte Schicht · grau umrandet: Zielschicht. Nur Spins, deren Frequenz im rosa Band liegt, werden angeregt.',
            'Жёлтый: возбуждённый срез · серая рамка: целевой срез. Возбуждаются только спины, частота которых лежит в розовой полосе.',
          )}
        </p>
      </Panel>
      <Panel title={tr('Stellgrößen', 'Управляющие параметры')}>
        <Slider label={tr('Schichtgradient Gs', 'Градиент выбора среза Gs')} value={g} min={1} max={HARDWARE.maxGradient_mT_per_m} step={0.5} unit={tr('mT/m', 'мТл/м')} onChange={setG} />
        <Slider
          label={tr('HF-Bandbreite Δf', 'Полоса РЧ-импульса Δf')}
          value={bw}
          min={250}
          max={6000}
          step={50}
          unit={Hz}
          onChange={setBw}
          hint={tr('Bandbreite ≈ 1/Pulsdauer: kürzere Pulse haben eine größere Bandbreite.', 'Полоса ≈ 1/длительность импульса: у более коротких импульсов полоса шире.')}
        />
        <Slider label={tr('Frequenz-Offset', 'Сдвиг частоты')} value={offset} min={-40000} max={40000} step={100} unit={Hz} onChange={setOffset} format={(v) => fmt(v, 0)} />
        <div className="stat-grid two">
          <Stat label={tr('Schichtdicke', 'Толщина среза')} value={fmt(thick, 2)} unit={mm} />
          <Stat label={tr('Position', 'Положение')} value={fmt(pos, 1)} unit={mm} />
        </div>
        <TeX block tex={`\\Delta z = \\frac{${bw}\\,\\text{${Hz}}}{${fmt(hzmm, 0)}\\,\\text{${Hz}/${mm}}} = ${thick.toFixed(2)}\\,\\text{${mm}}`} />
      </Panel>
      <Panel title={tr('🎯 Schicht-Challenge', '🎯 Задание: срез')} className="span-3">
        <p>
          {tr('Regt eine', 'Возбуди срез толщиной')}{' '}
          <strong>
            {target.thick} {mm}
          </strong>{' '}
          {tr('dicke Schicht bei', 'в положении')}{' '}
          <strong>
            z = {target.pos} {mm}
          </strong>{' '}
          {tr('an (Toleranz: ±5 % Dicke, ±1 mm Position).', '(допуск: ±5 % толщины, ±1 мм положения).')}
        </p>
        <div className="row gap">
          <button className="btn primary" type="button" onClick={check}>
            {tr('Anregen & prüfen', 'Возбудить и проверить')}
          </button>
          <button className="btn ghost" type="button" onClick={() => setTarget(randomTarget())}>
            {tr('Andere Zielschicht', 'Другой целевой срез')}
          </button>
        </div>
        {result && <p className={result.ok ? 'ok-text' : 'bad-text'}>{resultText(result)}</p>}
      </Panel>
    </div>
  );
}

const SAMPLES = [
  { x: -70, a: 1, label: 'A' },
  { x: 10, a: 0.6, label: 'B' },
  { x: 55, a: 0.35, label: 'C' },
];

function Readout() {
  const { tr } = useLang();
  const [g, setG] = useState(6);
  const [bwPx, setBwPx] = useState(200);
  const [nx, setNx] = useState(256);
  const totalBw = bwPx * nx;
  const fov = readoutFovMm(totalBw, g);
  const tRead = (1 / bwPx) * 1000; // ms
  const hzmm = hzPerMeter(g) / 1000;
  const mm = tr('mm', 'мм');
  const kHz = tr('kHz', 'кГц');
  const ms = tr('ms', 'мс');

  const signal = useMemo(
    () =>
      sampleCurve(
        (t) =>
          SAMPLES.reduce((s, smp) => {
            const inFov = Math.abs(smp.x) <= fov / 2;
            return s + (inFov ? smp.a * Math.cos(2 * Math.PI * hzmm * smp.x * ((t - tRead / 2) / 1000)) : 0);
          }, 0) * Math.exp(-(((t - tRead / 2) / tRead) ** 2) * 2),
        [0, tRead],
        400,
      ),
    [fov, hzmm, tRead],
  );

  return (
    <div className="sim-grid">
      <Panel title={tr('Objekt: drei Wasserröhrchen entlang x', 'Объект: три пробирки с водой вдоль x')} className="span-3">
        <div className="readout-ruler">
          <div className="fov-window" style={{ left: `${50 - (fov / 2 / 200) * 50}%`, width: `${(fov / 400) * 100}%` }}>
            FOV {fmt(fov, 0)} {mm}
          </div>
          {SAMPLES.map((s) => (
            <div key={s.label} className={`tube${Math.abs(s.x) > fov / 2 ? ' outside' : ''}`} style={{ left: `${50 + (s.x / 200) * 50}%`, opacity: 0.4 + s.a * 0.6 }}>
              <span>{s.label}</span>
              <small>
                {fmt((hzmm * s.x) / 1000, 2)} {kHz}
              </small>
            </div>
          ))}
        </div>
        <p className="small muted">
          {tr(
            'Jedes Röhrchen präzediert unter dem Auslesegradienten mit eigener Frequenz. Röhrchen außerhalb des FOV werden vom Anti-Aliasing-Filter entfernt.',
            'Каждая пробирка под градиентом считывания прецессирует со своей частотой. Пробирки вне FOV удаляются антиалиасинговым фильтром.',
          )}
        </p>
      </Panel>
      <Panel title={tr('Empfangenes Echo (Summe der Frequenzen)', 'Принятое эхо (сумма частот)')} className="span-2">
        <LineChart
          ariaLabel={tr('Echosignal während der Auslese', 'Сигнал эха во время считывания')}
          series={[{ id: 's', label: tr('Echo-Realteil', 'Действительная часть эха'), color: '#38bdf8', points: signal }]}
          xDomain={[0, tRead]}
          yDomain={[-2.1, 2.1]}
          xLabel={tr('Auslesezeit [ms]', 'Время считывания [мс]')}
          yLabel={tr('Signal', 'Сигнал')}
          zeroLine
          markers={[{ x: tRead / 2, label: tr('Echo (k = 0)', 'Эхо (k = 0)') }]}
        />
        <p className="small muted">
          {tr(
            'Die Fourier-Transformation zerlegt dieses Schwebungssignal wieder in die drei Frequenzen = drei Orte. Die Schwebung wird schneller, wenn der Gradient steigt.',
            'Преобразование Фурье снова раскладывает этот сигнал биений на три частоты = три положения. Биения ускоряются, когда градиент растёт.',
          )}
        </p>
      </Panel>
      <Panel title={tr('Auslese-Parameter', 'Параметры считывания')}>
        <Slider label={tr('Auslesegradient Gx', 'Градиент считывания Gx')} value={g} min={1} max={30} step={0.5} unit={tr('mT/m', 'мТл/м')} onChange={setG} />
        <Slider label={tr('Bandbreite pro Pixel', 'Полоса на пиксель')} value={bwPx} min={50} max={1000} step={10} unit={tr('Hz/px', 'Гц/пикс.')} onChange={setBwPx} />
        <Slider label={tr('Matrix Nx', 'Матрица Nx')} value={nx} min={64} max={512} step={64} onChange={setNx} />
        <div className="stat-grid two">
          <Stat label="FOV" value={fmt(fov, 0)} unit={mm} />
          <Stat label={tr('Pixel', 'Пиксель')} value={fmt(fov / nx, 2)} unit={mm} />
          <Stat label={tr('Gesamtbandbreite', 'Общая полоса')} value={fmt(totalBw / 1000, 1)} unit={kHz} />
          <Stat label={tr('Auslesedauer', 'Длительность считывания')} value={fmt(tRead, 2)} unit={ms} />
        </div>
        <TeX block tex="FOV = \frac{BW_{\text{px}} \cdot N_x}{\bar\gamma\, G_x}" />
      </Panel>
    </div>
  );
}

function PhaseEncoding() {
  const { tr } = useLang();
  const [step, setStep] = useState(1);
  const [n, setN] = useState(16);
  const spins = 12;
  const fovMm = 240;
  // Phase eines Spins an Ort y: φ = 2π · k_y · y, k_y = step / FOV
  const phases = Array.from({ length: spins }, (_, i) => {
    const y = ((i + 0.5) / spins - 0.5) * fovMm;
    return 2 * Math.PI * (step / fovMm) * y;
  });
  const sumRe = phases.reduce((s, p) => s + Math.cos(p), 0) / spins;
  const sumIm = phases.reduce((s, p) => s + Math.sin(p), 0) / spins;
  const area = (step / (fovMm / 1000) / 42.577e6) * 1e6; // Gradientenmoment G·t = k/γ̄ in mT/m·ms
  return (
    <div className="sim-grid">
      <Panel title={tr('Phasenkodierung entlang y', 'Фазовое кодирование вдоль y')} className="span-2">
        <div className="phase-column">
          {phases.map((p, i) => (
            <div key={i} className="phase-spin">
              <span className="phase-y">
                {fmt(((i + 0.5) / spins - 0.5) * fovMm, 0)} {tr('mm', 'мм')}
              </span>
              <svg viewBox="-20 -20 40 40" width="38" height="38" aria-hidden="true">
                <circle r="17" className="fan-circle" />
                <line x1="0" y1="0" x2={Math.cos(p - Math.PI / 2) * 15} y2={Math.sin(p - Math.PI / 2) * 15} stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
              </svg>
              <span className="phase-deg">{fmt(((((p * 180) / Math.PI) % 360) + 360) % 360, 0)}°</span>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title={tr('Phasenschritt', 'Шаг фазового кодирования')}>
        <Slider
          label={tr('Anzahl Phasenschritte N_y', 'Число фазовых шагов N_y')}
          value={n}
          min={8}
          max={64}
          step={8}
          onChange={(v) => {
            setN(v);
            setStep((s) => Math.max(-v / 2, Math.min(v / 2 - 1, s)));
          }}
        />
        <Slider label={tr('Aktueller Schritt k_y-Index', 'Текущий шаг: индекс k_y')} value={step} min={-n / 2} max={n / 2 - 1} step={1} onChange={setStep} />
        <div className="stat-grid two">
          <Stat label="k_y" value={fmt(step / (fovMm / 1000), 1)} unit={tr('1/m', 'м⁻¹')} />
          <Stat label={tr('Gradientenmoment', 'Момент градиента')} value={fmt(area, 3)} unit={tr('mT/m·ms', 'мТл/м·мс')} />
          <Stat label={tr('Summensignal |S|', 'Суммарный сигнал |S|')} value={fmt(Math.hypot(sumRe, sumIm) * 100, 0)} unit="%" sub={tr('homogenes Objekt', 'однородный объект')} />
          <Stat label={tr('Messzeit-Anteil', 'Доля времени сканирования')} value={`${n}×TR`} />
        </div>
        <p className="small">
          {tr(
            'Bei k_y = 0 sind alle Spins in Phase (maximales Signal). Mit jedem Schritt windet sich die Phase einmal mehr über das FOV – das Signal eines homogenen Objekts löscht sich aus, Strukturen mit passender Ortsfrequenz liefern dagegen Signal. Jeder Schritt benötigt ein eigenes Echo → TA ∝ N_y.',
            'При k_y = 0 все спины в фазе (максимальный сигнал). С каждым шагом фаза закручивается через FOV ещё на один оборот – сигнал однородного объекта гасится, зато структуры с подходящей пространственной частотой дают сигнал. Каждому шагу нужно своё эхо → TA ∝ N_y.',
          )}
        </p>
      </Panel>
    </div>
  );
}

export function GradientSimulator() {
  const { tr } = useLang();
  const [tab, setTab] = useState<Tab>('slice');
  return (
    <div>
      <Segmented<Tab>
        value={tab}
        options={[
          { value: 'slice', label: tr('1 · Schichtselektion', '1 · Выбор среза') },
          { value: 'readout', label: tr('2 · Frequenzkodierung', '2 · Частотное кодирование') },
          { value: 'phase', label: tr('3 · Phasenkodierung', '3 · Фазовое кодирование') },
        ]}
        onChange={setTab}
      />
      <div className="tab-body">
        {tab === 'slice' && <SliceSelection />}
        {tab === 'readout' && <Readout />}
        {tab === 'phase' && <PhaseEncoding />}
      </div>
    </div>
  );
}
