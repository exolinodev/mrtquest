import { useMemo, useState } from 'react';
import { LineChart, sampleCurve } from '../components/LineChart';
import { TeX } from '../components/RichText';
import { Panel, Segmented, Slider } from '../components/ui';
import { TISSUES, type FieldStrength, type TissueId } from '../physics/constants';
import { fmt, mxyDecay, mzAfter90, mzAfterInversion, spinEchoSignal } from '../physics/mri';
import { describeWeighting, DEFAULT_PROTOCOL } from '../physics/protocol';
import { useLang } from '../i18n/LanguageContext';

const SELECTABLE: TissueId[] = ['wm', 'gm', 'csf', 'fat', 'muscle', 'liver', 'lesion'];

/** Phasenfächer von Spins mit unterschiedlicher Off-Resonanz vor und nach einem 180°-Puls. */
function SpinEchoFan({ te }: { te: number }) {
  const { tr } = useLang();
  const [t, setT] = useState(te / 4);
  const offsets = [-4, -3, -2, -1, 0, 1, 2, 3, 4].map((k) => k * 9); // Grad pro 10 ms
  const phaseAt = (dw: number) => (t <= te / 2 ? dw * (t / 10) : dw * ((t - te) / 10));
  const coherence = Math.abs(offsets.reduce((s, dw) => s + Math.cos((phaseAt(dw) * Math.PI) / 180), 0)) / offsets.length;
  return (
    <div className="spin-fan">
      <svg viewBox="-110 -110 220 220" role="img" aria-label={tr('Phasenfächer der Spins', 'Фазовый веер спинов')}>
        <circle r="95" className="fan-circle" />
        {offsets.map((dw, i) => {
          const ph = ((phaseAt(dw) - 90) * Math.PI) / 180;
          const hue = 200 + i * 15;
          return (
            <line key={dw} x1={0} y1={0} x2={Math.cos(ph) * 88} y2={Math.sin(ph) * 88} stroke={`hsl(${hue} 90% 65%)`} strokeWidth={3} strokeLinecap="round" />
          );
        })}
        <circle r="5" fill="#f8fafc" />
      </svg>
      <div>
        <Slider label={tr('Zeit nach 90°-Puls', 'Время после 90°-импульса')} value={t} min={0} max={te * 1.5} step={1} unit={tr('ms', 'мс')} onChange={setT} />
        <p className="small">
          {t < te / 2
            ? tr('Dephasierung durch statische Off-Resonanzen (T2′).', 'Дефазировка из-за статических отклонений от резонанса (T2′).')
            : t < te - 1
              ? tr('180°-Puls bei TE/2 hat die Phasen gespiegelt – die Spins laufen wieder zusammen.', '180°-импульс в момент TE/2 зеркально отразил фазы – спины снова сходятся.')
              : t <= te + 1
                ? tr('✔ Spin-Echo: Phasenkohärenz wiederhergestellt!', '✔ Спин-эхо: фазовая когерентность восстановлена!')
                : tr('Nach dem Echo fächern die Spins erneut auf.', 'После эха спины снова расходятся веером.')}
        </p>
        <p className="small muted">
          {tr('Kohärenz (Betrag des Summenvektors)', 'Когерентность (модуль суммарного вектора)')}: {fmt(coherence * 100, 0)} %
        </p>
      </div>
    </div>
  );
}

export function RelaxationSimulator() {
  const { tr, loc } = useLang();
  const [field, setField] = useState<FieldStrength>(1.5);
  const [selected, setSelected] = useState<TissueId[]>(['wm', 'gm', 'csf', 'fat']);
  const [mode, setMode] = useState<'90' | '180'>('90');
  const [trMs, setTr] = useState(600);
  const [te, setTe] = useState(15);
  const [showStar, setShowStar] = useState(true);

  const tMax = mode === '90' ? Math.max(5000, trMs * 1.2) : 5000;
  const mzSeries = useMemo(
    () =>
      selected.map((id) => {
        const p = TISSUES[id].params[field];
        return {
          id,
          label: `${loc(TISSUES[id].label)} (T1 ${p.t1} ${tr('ms', 'мс')})`,
          color: TISSUES[id].color,
          points: sampleCurve((t) => (mode === '90' ? mzAfter90(t, p.t1) : mzAfterInversion(t, p.t1)), [0, tMax]),
        };
      }),
    [selected, field, mode, tMax, tr, loc],
  );

  const mxySeries = useMemo(
    () =>
      selected.flatMap((id) => {
        const p = TISSUES[id].params[field];
        const base = { id, label: `${loc(TISSUES[id].label)} (T2 ${p.t2} ${tr('ms', 'мс')})`, color: TISSUES[id].color, points: sampleCurve((t) => mxyDecay(t, p.t2), [0, 300]) };
        return showStar
          ? [base, { id: `${id}-star`, label: '', color: TISSUES[id].color, dashed: true, width: 1.4, points: sampleCurve((t) => mxyDecay(t, p.t2star), [0, 300]) }]
          : [base];
      }),
    [selected, field, showStar, tr, loc],
  );

  const signals = selected.map((id) => ({ id, s: spinEchoSignal(TISSUES[id].params[field], trMs, te) }));
  const maxS = Math.max(...signals.map((x) => x.s), 1e-6);
  const weighting = describeWeighting({ ...DEFAULT_PROTOCOL, sequence: 'SE', tr: trMs, te, field });

  const toggle = (id: TissueId) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const presets: Array<{ label: string; tr: number; te: number }> = [
    { label: 'T1w', tr: 550, te: 12 },
    { label: 'PDw', tr: 3000, te: 20 },
    { label: 'T2w', tr: 4000, te: 100 },
  ];

  return (
    <div className="sim-grid">
      <Panel title={tr('Gewebe & Feld', 'Ткани и поле')} className="span-3">
        <div className="row wrap gap">
          <Segmented<FieldStrength>
            label={tr('Feldstärke', 'Индукция поля')}
            value={field}
            options={[
              { value: 1.5, label: tr('1,5 T', '1,5 Тл') },
              { value: 3, label: tr('3 T', '3 Тл') },
            ]}
            onChange={setField}
          />
          <Segmented<'90' | '180'>
            label={tr('Anregung', 'Возбуждение')}
            value={mode}
            options={[
              { value: '90', label: tr('90°-Puls (Sättigung)', '90°-импульс (насыщение)') },
              { value: '180', label: tr('180°-Puls (Inversion)', '180°-импульс (инверсия)') },
            ]}
            onChange={setMode}
          />
        </div>
        <div className="chips" role="group" aria-label={tr('Gewebe auswählen', 'Выбери ткани')}>
          {SELECTABLE.map((id) => (
            <button key={id} type="button" className={`chip${selected.includes(id) ? ' on' : ''}`} style={{ ['--chip' as string]: TISSUES[id].color }} onClick={() => toggle(id)} aria-pressed={selected.includes(id)}>
              {loc(TISSUES[id].label)}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title={tr('Längsmagnetisierung Mz(t) – T1-Erholung', 'Продольная намагниченность Mz(t) – T1-восстановление')} className="span-2">
        <LineChart
          ariaLabel={tr('T1-Relaxationskurven', 'Кривые T1-релаксации')}
          series={mzSeries}
          xDomain={[0, tMax]}
          yDomain={mode === '90' ? [0, 1.05] : [-1.05, 1.05]}
          xLabel={tr('Zeit [ms]', 'Время [мс]')}
          yLabel="Mz / M₀"
          zeroLine
          markers={[{ x: trMs, label: `${mode === '90' ? 'TR' : 't'} = ${trMs} ${tr('ms', 'мс')}` }]}
        />
        <TeX
          block
          tex={
            mode === '90'
              ? 'M_z(t) = M_0\\left(1 - e^{-t/T_1}\\right)'
              : `M_z(t) = M_0\\left(1 - 2e^{-t/T_1}\\right),\\quad M_z = 0 \\;\\text{${tr('bei', 'при')}}\\; t = T_1\\ln 2`
          }
        />
        {mode === '180' && (
          <p className="small">
            {tr('Nulldurchgänge (TI)', 'Точки перехода через ноль (TI)')}:{' '}
            {selected.map((id) => `${loc(TISSUES[id].label)} ${fmt(TISSUES[id].params[field].t1 * Math.LN2, 0)} ${tr('ms', 'мс')}`).join(' · ')}
          </p>
        )}
      </Panel>

      <Panel title={tr('Sequenzparameter (Spin-Echo)', 'Параметры последовательности (спин-эхо)')}>
        <Slider label={tr('Repetitionszeit TR', 'Время повторения TR')} value={trMs} min={100} max={6000} step={50} unit={tr('ms', 'мс')} onChange={setTr} />
        <Slider label={tr('Echozeit TE', 'Время эха TE')} value={te} min={5} max={250} step={1} unit={tr('ms', 'мс')} onChange={setTe} />
        <div className="row wrap gap">
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className="btn small"
              onClick={() => {
                setTr(p.tr);
                setTe(p.te);
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="weighting-tag">{loc(weighting)}</p>
      </Panel>

      <Panel
        title={tr('Quermagnetisierung Mxy(t) – T2 / T2*', 'Поперечная намагниченность Mxy(t) – T2 / T2*')}
        className="span-2"
        actions={
          <label className="small">
            <input type="checkbox" checked={showStar} onChange={(e) => setShowStar(e.target.checked)} /> {tr('T2* (gestrichelt)', 'T2* (пунктир)')}
          </label>
        }
      >
        <LineChart
          ariaLabel={tr('T2-Relaxationskurven', 'Кривые T2-релаксации')}
          series={mxySeries}
          xDomain={[0, 300]}
          yDomain={[0, 1.05]}
          xLabel={tr('Zeit [ms]', 'Время [мс]')}
          yLabel="Mxy / M₀"
          markers={[{ x: te, label: `TE = ${te} ${tr('ms', 'мс')}` }]}
        />
      </Panel>

      <Panel title={tr('Spin-Echo-Signal', 'Сигнал спин-эха')}>
        <TeX block tex="S = \rho\,(1 - e^{-TR/T_1})\,e^{-TE/T_2}" />
        <div className="bars">
          {signals
            .slice()
            .sort((a, b) => b.s - a.s)
            .map(({ id, s }) => (
              <div key={id} className="bar-row">
                <span className="bar-label">{loc(TISSUES[id].label)}</span>
                <span className="bar-track">
                  <span className="bar-fill" style={{ width: `${(s / maxS) * 100}%`, background: TISSUES[id].color }} />
                </span>
                <span className="bar-value">{fmt(s, 3)}</span>
              </div>
            ))}
        </div>
        <p className="small muted">
          {tr('Die Balkenlänge entspricht der Helligkeit im Bild (relativ zum hellsten Gewebe).', 'Длина столбца соответствует яркости на изображении (относительно самой яркой ткани).')}
        </p>
      </Panel>

      <Panel title={tr('Spin-Echo verstehen: Dephasierung & Refokussierung', 'Понять спин-эхо: дефазировка и рефокусировка')} className="span-3">
        <SpinEchoFan te={Math.max(20, te)} />
      </Panel>
    </div>
  );
}
