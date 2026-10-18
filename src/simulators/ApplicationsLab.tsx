import { useState } from 'react';
import { LineChart, sampleCurve } from '../components/LineChart';
import { ClinicalAtlas } from '../components/ClinicalAtlas';
import { RichText } from '../components/RichText';
import { Callout, Panel, Segmented, Slider, Stat } from '../components/ui';
import { LECTURE_LESSONS } from '../content/lecture';
import { useLang } from '../i18n/LanguageContext';
import { boldResponse, diffusionSignal, phaseContrast } from '../physics/lecture';

type Mode = 'flow' | 'dti' | 'mrs' | 'bold' | 'contrast' | 'cases';
const CASE_LABELS: Record<string, { de: string; ru: string }> = {
  brain: { de: 'Gehirn', ru: 'Мозг' },
  hybrid: { de: 'PET/MRT', ru: 'ПЭТ/МРТ' },
  knee: { de: 'Knie', ru: 'Колено' },
  pelvis: { de: 'Becken', ru: 'Таз' },
  pregnancy: { de: 'Schwangerschaft', ru: 'Беременность' },
};
const CASES = LECTURE_LESSONS.filter((l) => ['brain', 'hybrid', 'knee', 'pelvis', 'pregnancy'].includes(l.id));

/** Klinische Anwendungen: Flussmessung, DTI, Spektroskopie, BOLD, Kontrastmittel und Fallkarten. */
export function ApplicationsLab({ preset: initial }: { preset?: string }) {
  const { tr, loc } = useLang();
  const [mode, setMode] = useState<Mode>(() => {
    const preset = initial ?? window.location.hash.split('/')[3];
    return ['flow', 'dti', 'mrs', 'bold', 'contrast', 'cases'].includes(preset) ? (preset as Mode) : 'flow';
  });
  const [caseId, setCaseId] = useState('brain');
  const [velocity, setVelocity] = useState(120),
    [venc, setVenc] = useState(80);
  const [angle, setAngle] = useState(0),
    [b, setB] = useState(1000),
    [isotropic, setIsotropic] = useState(false);
  const [field, setField] = useState(1.5),
    [choline, setCholine] = useState(0.6);
  const [onset, setOnset] = useState(5),
    [concentration, setConcentration] = useState(0);
  const flow = phaseContrast(velocity, venc);
  const diffusion = diffusionSignal(b, angle, isotropic ? 0.001 : 0.0017, isotropic ? 0.001 : 0.0003);
  const t1 = 1 / (1 / 1.2 + 4.5 * concentration);
  const t1Signal = (1 - Math.exp(-0.5 / t1)) * Math.exp(-0.01 / 0.08);
  const peaks = [
    { ppm: 2.02, a: 1, label: 'NAA', color: '#38bdf8' },
    { ppm: 3.03, a: 0.65, label: tr('Kreatin', 'Креатин'), color: '#34d399' },
    { ppm: 3.2, a: choline, label: tr('Cholin', 'Холин'), color: '#f472b6' },
  ];
  return (
    <div className="sim-grid">
      <Panel title={tr('Anwendung wählen', 'Выбор применения')} className="span-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'flow', label: tr('Fluss', 'Поток') },
            { value: 'dti', label: 'DTI' },
            { value: 'mrs', label: tr('Spektroskopie', 'Спектроскопия') },
            { value: 'bold', label: 'BOLD' },
            { value: 'contrast', label: tr('Kontrastmittel', 'Контраст') },
            { value: 'cases', label: tr('Fallkarten', 'Случаи') },
          ]}
        />
      </Panel>
      {mode === 'flow' && (
        <>
          <Panel title={tr('Phasenkontrast: Geschwindigkeit als Phase', 'Фазовый контраст: скорость как фаза')} className="span-2">
            <svg
              className="lab-figure"
              viewBox="0 0 600 250"
              role="img"
              aria-label={tr('Schematisches Gefäß mit Flussrichtung und Phasenkarte', 'Схематический сосуд с направлением потока и фазовой картой')}
            >
              <rect x="35" y="60" width="530" height="100" rx="50" fill="#162d49" stroke="#38bdf8" strokeWidth="2" />
              {[100, 200, 300, 400, 500].map((x, i) => (
                <g key={x} transform={`translate(${x},110) scale(${velocity < 0 ? -1 : 1},1)`}>
                  <circle r="26" fill={`hsl(${210 + (flow.wrapped / Math.PI) * 100} 80% ${30 + i * 5}%)`} />
                  <path d="M-12 0 H12 M5 -7 L12 0 L5 7" stroke="white" fill="none" strokeWidth="3" />
                </g>
              ))}
            </svg>
            <p className={flow.aliased ? 'bad-text' : 'ok-text'} aria-live="polite">
              {flow.aliased
                ? tr('Phase gefaltet: Geschwindigkeit mehrdeutig', 'Фаза свёрнута: скорость неоднозначна')
                : tr('Geschwindigkeit im VENC-Bereich', 'Скорость в диапазоне VENC')}
            </p>
            <div className="stat-grid">
              <Stat label={tr('Wahre Geschwindigkeit', 'Истинная скорость')} value={velocity} unit={tr('cm/s', 'см/с')} />
              <Stat label={tr('Gemessene Phase', 'Измеренная фаза')} value={(flow.wrapped / Math.PI).toFixed(2)} unit="π" />
              <Stat label={tr('Aus Phase abgeleitet', 'Вычислено из фазы')} value={flow.measured.toFixed(1)} unit={tr('cm/s', 'см/с')} tone={flow.aliased ? 'bad' : 'good'} />
            </div>
          </Panel>
          <Panel title={tr('Geschwindigkeit und VENC', 'Скорость и VENC')}>
            <Slider label={tr('Wahre Geschwindigkeit', 'Истинная скорость')} value={velocity} min={-200} max={200} step={5} unit={tr('cm/s', 'см/с')} onChange={setVelocity} />
            <Slider label="VENC" value={venc} min={20} max={250} step={10} unit={tr('cm/s', 'см/с')} onChange={setVenc} />
          </Panel>
          <div className="span-3">
            <Callout
              variant="merke"
              title={tr('Auftrag: Aliasing auflösen', 'Задание: устранить алиасинг')}
              text={tr(
                'Starte mit 120 cm/s und VENC 80 cm/s. Die gefaltete Phase lässt den Fluss scheinbar in die andere Richtung laufen. Erhöhe VENC über die wahre Geschwindigkeit. Modell: gleichförmiger Fluss, ideale Phasendifferenz, keine Turbulenz oder Partialvolumen-Effekte.',
                'Начни со 120 см/с и VENC 80 см/с. Свёрнутая фаза создаёт видимость обратного потока. Подними VENC выше истинной скорости. Модель: однородный поток, идеальная разность фаз, без турбулентности и частичного объёма.',
              )}
            />
          </div>
        </>
      )}
      {mode === 'dti' && (
        <>
          <Panel title={tr('Diffusionsellipse und Messrichtung', 'Эллипс диффузии и направление измерения')} className="span-2">
            <svg
              className="lab-figure"
              viewBox="0 0 600 330"
              role="img"
              aria-label={tr('Diffusionsellipse, schematische Faserpfade und Messrichtung', 'Эллипс диффузии, схемы волокон и направление измерения')}
            >
              {Array.from({ length: 9 }, (_, i) => (
                <path key={i} d={`M25 ${90 + i * 19} Q300 ${40 + i * 22} 575 ${90 + i * 19}`} fill="none" stroke={`hsl(${180 + i * 13} 75% 60%)`} strokeWidth="2" opacity=".45" />
              ))}
              <ellipse cx="300" cy="165" rx={isotropic ? 90 : 135} ry={isotropic ? 90 : 57} fill="#38bdf820" stroke="#38bdf8" strokeWidth="3" />
              <g transform={`rotate(${-angle} 300 165)`}>
                <line x1="160" y1="165" x2="440" y2="165" stroke="#fbbf24" strokeWidth="4" />
                <circle cx="440" cy="165" r="7" fill="#fbbf24" />
              </g>
            </svg>
            <p className="small muted">{tr('Schematische Modellpfade · keine echten Trakte', 'Схематические модельные пути · не настоящие тракты')}</p>
            <div className="stat-grid">
              <Stat label="ADC" value={(diffusion.adc * 1000).toFixed(2)} unit={tr('10⁻³ mm²/s', '10⁻³ мм²/с')} />
              <Stat label="S/S₀" value={diffusion.signal.toFixed(3)} />
              <Stat label={tr('Richtung', 'Направление')} value={angle} unit="°" />
            </div>
          </Panel>
          <Panel title={tr('Gewebemodell und Diffusionsgradient', 'Модель ткани и диффузионный градиент')}>
            <Segmented
              label={tr('Gewebemodell', 'Модель ткани')}
              value={isotropic ? 'iso' : 'aniso'}
              onChange={(v) => setIsotropic(v === 'iso')}
              options={[
                { value: 'aniso', label: tr('Anisotrop', 'Анизотропно') },
                { value: 'iso', label: tr('Isotrop', 'Изотропно') },
              ]}
            />
            <Slider label={tr('Messrichtung zur Faser', 'Направление относительно волокна')} value={angle} min={0} max={180} step={5} unit="°" onChange={setAngle} />
            <Slider label={tr('Diffusionsgewichtung b', 'Диффузионное взвешивание b')} value={b} min={0} max={2000} step={50} unit={tr('s/mm²', 'с/мм²')} onChange={setB} />
          </Panel>
          <Panel title={tr('Signal in Abhängigkeit vom Winkel', 'Сигнал в зависимости от угла')} className="span-2">
            <LineChart
              ariaLabel={tr('Richtungsabhängige Signaldämpfung', 'Затухание сигнала в зависимости от направления')}
              series={[
                {
                  id: 'adc',
                  label: 'S/S₀',
                  color: '#34d399',
                  points: sampleCurve((a) => diffusionSignal(b, a, isotropic ? 0.001 : 0.0017, isotropic ? 0.001 : 0.0003).signal, [0, 180]),
                },
              ]}
              xDomain={[0, 180]}
              yDomain={[0, 1.05]}
              xLabel={tr('Winkel / °', 'Угол / °')}
              markers={[{ x: angle, label: tr('Messung', 'Измерение') }]}
            />
          </Panel>
          <Panel title={tr('Modellannahmen', 'Допущения модели')}>
            <p className="small">
              {tr(
                'Vereinfachter axialsymmetrischer Tensor: D∥ = 1,7 und D⊥ = 0,3 ×10⁻³ mm²/s; isotrop D = 1,0 ×10⁻³ mm²/s. Keine kreuzenden Fasern. Traktografie ist eine modellbasierte Schätzung, kein direkter Axon-Nachweis.',
                'Упрощённый осесимметричный тензор: D∥ = 1,7 и D⊥ = 0,3 ×10⁻³ мм²/с; изотропно D = 1,0 ×10⁻³ мм²/с. Без перекрёстных волокон. Трактография — модельная оценка, не прямое изображение аксонов.',
              )}
            </p>
          </Panel>
        </>
      )}
      {mode === 'mrs' && (
        <>
          <Panel title={tr('Protonen-Spektrum (synthetisch)', 'Протонный спектр (синтетический)')} className="span-2">
            <LineChart
              ariaLabel={tr('Synthetisches Protonen-MR-Spektrum mit NAA, Kreatin und Cholin', 'Синтетический протонный МР-спектр с NAA, креатином и холином')}
              series={peaks.map((p) => ({ id: p.label, label: p.label, color: p.color, points: sampleCurve((ppm) => p.a / (1 + ((ppm - p.ppm) / 0.035) ** 2), [1, 4], 600) }))}
              xDomain={[1, 4]}
              yDomain={[0, 1.6]}
              xLabel={tr('Chemische Verschiebung / ppm (aufsteigend)', 'Химический сдвиг / ppm (по возрастанию)')}
            />
            <div className="stat-grid">
              <Stat label="f₀ (¹H)" value={(42.577 * field).toFixed(2)} unit={tr('MHz', 'МГц')} />
              <Stat label={tr('1 ppm entspricht', '1 ppm соответствует')} value={(42.577 * field).toFixed(2)} unit={tr('Hz', 'Гц')} />
              <Stat label={tr('Cr–Cho Abstand', 'Расстояние Cr–Cho')} value={(0.17 * 42.577 * field).toFixed(2)} unit={tr('Hz', 'Гц')} />
            </div>
          </Panel>
          <Panel title={tr('Feldstärke und Peak-Höhe', 'Поле и высота пика')}>
            <Segmented label="B₀" value={field} onChange={setField} options={[1.5, 3, 7].map((v) => ({ value: v, label: tr(`${v} T`, `${v} Тл`) }))} />
            <Slider label={tr('Cholin: relative Peak-Höhe', 'Холин: относительная высота пика')} value={choline} min={0.1} max={1.5} step={0.1} onChange={setCholine} />
          </Panel>
          <div className="span-3">
            <Callout
              variant="achtung"
              title={tr('Synthetisches Lehrspektrum', 'Синтетический учебный спектр')}
              text={tr(
                'Drei vereinfachte Lorentz-Peaks; kein Wasserpeak, keine Kopplung, kein Rauschen und keine Gewebediagnose. Die ppm-Achse läuft hier aufsteigend. Der ppm-Abstand bleibt bei Feldwechsel konstant, der Hz-Abstand wächst. Peak-Höhen sind keine kalibrierten Konzentrationen.',
                'Три упрощённых лоренцевых пика; без воды, спиновой связи, шума и диагностики ткани. Ось ppm здесь возрастает. При смене поля расстояние в ppm постоянно, в Гц растёт. Высоты пиков не являются калиброванными концентрациями.',
              )}
            />
          </div>
        </>
      )}
      {mode === 'bold' && (
        <>
          <Panel title={tr('Hämodynamische Antwort (BOLD)', 'Гемодинамический ответ (BOLD)')} className="span-2">
            <LineChart
              ariaLabel={tr('Reizzeitpunkt und verzögerte schematische BOLD-Antwort', 'Момент стимула и задержанный схематический BOLD-ответ')}
              series={[
                {
                  id: 'bold',
                  label: tr('Schematische BOLD-Antwort', 'Схематический BOLD-ответ'),
                  color: '#f472b6',
                  points: sampleCurve((t) => (boldResponse(t, onset) * 2) / 0.175, [0, 40], 400),
                },
              ]}
              xDomain={[0, 40]}
              yDomain={[-0.5, 2.3]}
              xLabel="t / s"
              yLabel={tr('Signaländerung / %', 'Изменение сигнала / %')}
              markers={[{ x: onset, label: tr('Reiz', 'Стимул'), color: '#fbbf24' }]}
            />
            <Slider label={tr('Aktivierungszeitpunkt', 'Момент активации')} value={onset} min={2} max={15} unit={tr('s', 'с')} onChange={setOnset} />
          </Panel>
          <Panel title={tr('Einordnung', 'Интерпретация')}>
            <Callout
              variant="merke"
              title={tr('Indirekt und verzögert', 'Косвенно и с задержкой')}
              text={tr(
                'Illustrative Gamma-Antwort mit kleinem Nachschwingen, auf ungefähr 2 % skaliert. Kein individueller physiologischer Fit. BOLD beruht auf Hämodynamik und Deoxyhämoglobin, nicht auf einer direkten Messung elektrischer Aktivität.',
                'Иллюстративный гамма-ответ с небольшим последующим спадом, масштаб около 2 %. Не индивидуальная физиологическая модель. BOLD основан на гемодинамике и дезоксигемоглобине, а не прямом измерении электрической активности.',
              )}
            />
          </Panel>
        </>
      )}
      {mode === 'contrast' && (
        <>
          <Panel title={tr('T₁-Erholung mit Kontrastmittel', 'Восстановление T₁ с контрастом')} className="span-2">
            <LineChart
              ariaLabel={tr('T₁-Erholung mit und ohne Modell-Kontrastmittel', 'Восстановление T₁ с модельным контрастом и без него')}
              series={[
                { id: 'before', label: tr('Ohne', 'Без'), color: '#a78bfa', points: sampleCurve((t) => 1 - Math.exp(-t / 1200), [0, 2000]) },
                {
                  id: 'after',
                  label: tr('Mit Modell-Konzentration', 'С модельной концентрацией'),
                  color: '#34d399',
                  points: sampleCurve((t) => 1 - Math.exp(-t / (t1 * 1000)), [0, 2000]),
                },
              ]}
              xDomain={[0, 2000]}
              yDomain={[0, 1.05]}
              xLabel="t / ms"
              yLabel="Mz/M₀"
            />
            <div className="stat-grid">
              <Stat label="T₁" value={Math.round(t1 * 1000)} unit={tr('ms', 'мс')} />
              <Stat label="S / (ρ·M₀)" value={t1Signal.toFixed(3)} />
              <Stat label="TR / TE" value="500 / 10" unit={tr('ms', 'мс')} />
            </div>
          </Panel>
          <Panel title={tr('Modell-Konzentration', 'Модельная концентрация')}>
            <Slider
              label={tr('Lokale Modell-Konzentration c', 'Локальная модельная концентрация c')}
              value={concentration}
              min={0}
              max={0.5}
              step={0.02}
              unit={tr('mmol/L', 'ммоль/л')}
              onChange={setConcentration}
            />
          </Panel>
          <div className="span-3">
            <Callout
              variant="achtung"
              title={tr('Konzentration ist keine Dosisempfehlung', 'Концентрация не является рекомендацией дозы')}
              text={tr(
                'Modell: T₁₀=1200 ms, r₁=4,5 L/(mmol·s), konstantes T₂=80 ms und konstante PD. T₂-/T₂*-Verkürzung und Pharmakokinetik sind nicht enthalten. Aus der Kurve lässt sich keine klinische Dosierung ableiten. Eine KI-Nachverarbeitung belegt keine sichere Dosisreduktion.',
                'Модель: T₁₀=1200 мс, r₁=4,5 л/(ммоль·с), постоянные T₂=80 мс и PD. Сокращение T₂/T₂* и фармакокинетика не учтены. Кривая не позволяет определить клиническую дозу. ИИ-обработка не доказывает безопасность снижения дозы.',
              )}
            />
          </div>
        </>
      )}
      {mode === 'cases' && (
        <>
          <Panel title={tr('Fallbeispiel wählen', 'Выбор клинического примера')} className="span-3">
            <Segmented value={caseId} onChange={setCaseId} options={CASES.map((l) => ({ value: l.id, label: loc(CASE_LABELS[l.id]) }))} />
            <p className="small">
              <RichText text={loc(LECTURE_LESSONS.find((l) => l.id === caseId)!.text)} />
            </p>
          </Panel>
          <ClinicalAtlas key={caseId} id={caseId} />
          <Panel title={tr('Was du hier lernst', 'Чему ты здесь научишься')}>
            <p className="small">
              {tr(
                'Die schematische Karte zeigt, welche Strukturen in diesem Fallbeispiel wichtig sind und warum die MRT dafür passt. Tippe die Bereiche an. Es sind keine echten Patientenbilder und keine Diagnosehilfe.',
                'Схема показывает, какие структуры важны в этом примере и почему для него подходит МРТ. Нажимай на области. Это не настоящие снимки пациентов и не помощь в диагностике.',
              )}
            </p>
          </Panel>
        </>
      )}
    </div>
  );
}
