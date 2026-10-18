import { useEffect, useMemo, useRef, useState } from 'react';
import { LineChart } from '../components/LineChart';
import { TeX } from '../components/RichText';
import { Callout, Panel, Segmented, Slider, Stat } from '../components/ui';
import { useLang } from '../i18n/LanguageContext';
import { BODY_TEMPERATURE_K, BOLTZMANN } from '../physics/constants';
import { fmt, GAMMA_BAR_H1, larmorAngular, larmorMHz, t2StarFromInhomogeneity, zeemanEnergy } from '../physics/mri';
import { seededRandom } from '../physics/phantom';

type Mode = 'boltzmann' | 'frame' | 'dephasing';
type Frame = 'lab' | 'rot';

// ---------------------------------------------------------------- Physik

/** Exakter Spin-½-Überschuss (N↑ − N↓)/N = tanh(ΔE / 2kT). */
function excessFraction(b0: number, tempK: number): number {
  return Math.tanh(zeemanEnergy(b0) / (2 * BOLTZMANN * tempK));
}

/** Protonen pro mm³ Wasser: 1 mg / 18,015 g/mol · Nₐ · 2 */
const PROTONS_PER_MM3 = (1e-3 / 18.015) * 6.02214076e23 * 2;

const SUP: Record<string, string> = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
/** Wissenschaftliche Schreibweise mit Dezimalkomma, z. B. 3,3·10¹⁴ */
function sci(v: number, digits = 2): string {
  if (v === 0) return '0';
  const e = Math.floor(Math.log10(Math.abs(v)));
  const m = v / 10 ** e;
  return `${fmt(m, digits)}·10${String(e)
    .split('')
    .map((c) => SUP[c])
    .join('')}`;
}

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
  return p === 'frame' || p === 'dephasing' ? p : 'boltzmann';
}

/** Spin-Ensemble-Labor: Boltzmann-Überschuss, Labor- und rotierendes Bezugssystem, Dephasierung und Spin-Echo. */
export function EnsembleLab({ preset }: { preset?: string }) {
  const { tr } = useLang();
  const [mode, setMode] = useState<Mode>(() => initialMode(preset));
  const intro: Record<Mode, string> = {
    boltzmann: tr(
      'Im Magnetfeld zeigen fast genauso viele Protonen nach unten wie nach oben. Nur ein winziger Überschuss bildet die Nettomagnetisierung M₀. Die Zahlen sind echt gerechnet, das Pfeilbild ist stark überhöht.',
      'В магнитном поле почти столько же протонов смотрит вниз, сколько вверх. Только крошечный избыток образует суммарную намагниченность M₀. Числа рассчитаны по-настоящему, картинка со стрелками сильно преувеличена.',
    ),
    frame: tr(
      'Derselbe 90°-Puls, zwei Blickwinkel. Im Laborsystem stehst du neben dem Scanner. Im rotierenden System drehst du dich mit der Larmor-Frequenz mit, wie auf einem Karussell.',
      'Один и тот же 90°-импульс, две точки зрения. В лабораторной системе ты стоишь рядом со сканером. Во вращающейся системе ты вращаешься вместе с ларморовой частотой, как на карусели.',
    ),
    dephasing: tr(
      'Nach dem 90°-Puls kreisen viele Spins in der Querebene. Kleine Feldunterschiede geben jedem ein etwas anderes Tempo. Sie laufen auseinander, und ihre Summe schrumpft. Ein 180°-Puls holt sie wieder zusammen.',
      'После 90°-импульса много спинов вращаются в поперечной плоскости. Небольшие различия поля дают каждому немного другой темп. Они расходятся, и их сумма уменьшается. 180°-импульс снова собирает их вместе.',
    ),
  };
  return (
    <div className="sim-grid">
      <Panel title={tr('Experiment wählen', 'Выбор эксперимента')} className="span-3">
        <Segmented
          value={mode}
          onChange={setMode}
          options={[
            { value: 'boltzmann', label: tr('Boltzmann-Überschuss', 'Избыток Больцмана') },
            { value: 'frame', label: tr('Bezugssystem', 'Система отсчёта') },
            { value: 'dephasing', label: tr('Dephasierung (T2*)', 'Расфазировка (T2*)') },
          ]}
        />
        <p className="small">{intro[mode]}</p>
      </Panel>
      {mode === 'boltzmann' && <BoltzmannMode />}
      {mode === 'frame' && <FrameMode />}
      {mode === 'dephasing' && <DephasingMode />}
    </div>
  );
}

// ---------------------------------------------------------------- Modus 1: Boltzmann

const GRID = 20;
const ARROWS = GRID * GRID;
/** Darstellungsfaktor für den Überschuss im Pfeilbild */
const EXAGGERATION = 20000;
const ARROW_SEEDS = (() => {
  const rng = seededRandom(310);
  return Array.from({ length: ARROWS }, () => rng());
})();

function BoltzmannMode() {
  const { tr } = useLang();
  const [b0, setB0] = useState(1.5);
  const [temp, setTemp] = useState(BODY_TEMPERATURE_K);

  const dE = zeemanEnergy(b0);
  const ratioKT = dE / (BOLTZMANN * temp);
  const excess = excessFraction(b0, temp);
  const ppm = excess * 1e6;
  const up = 5e5 * (1 + excess);
  const down = 5e5 * (1 - excess);
  const relM0 = excess / excessFraction(1.5, BODY_TEMPERATURE_K);
  const shown = Math.min(1, excess * EXAGGERATION);
  const capped = excess * EXAGGERATION > 1;
  // Pfeil i zeigt nach oben, wenn sein fester Zufallswert unter (1 + Überschuss)/2 liegt. So kippen beim Verschieben nur einzelne Pfeile.
  const isUp = ARROW_SEEDS.map((u) => u < (1 + shown) / 2);
  const upCount = isUp.filter(Boolean).length;
  const cell = 20;

  return (
    <>
      <Panel title={tr('400 Spins, Überschuss stark überhöht', '400 спинов, избыток сильно преувеличен')} className="span-2">
        <svg
          className="lab-figure"
          viewBox="0 0 400 400"
          role="img"
          aria-label={tr(`${upCount} von 400 Pfeilen zeigen nach oben, überhöhte Darstellung`, `${upCount} из 400 стрелок смотрят вверх, преувеличенное изображение`)}
        >
          {isUp.map((u, i) => {
            const cx = (i % GRID) * cell + cell / 2;
            const cy = Math.floor(i / GRID) * cell + cell / 2;
            const dir = u ? -1 : 1;
            const color = u ? '#38bdf8' : '#f472b6';
            return (
              <g key={i}>
                <line x1={cx} y1={cy - dir * 7} x2={cx} y2={cy + dir * 3} stroke={color} strokeWidth="2" strokeLinecap="round" />
                <path d={`M ${cx - 4.5} ${cy + dir * 2} L ${cx} ${cy + dir * 8} L ${cx + 4.5} ${cy + dir * 2} Z`} fill={color} />
              </g>
            );
          })}
        </svg>
        <p className="small muted">
          {tr(
            `Blau: parallel zu B₀ (energetisch günstiger) · Rosa: antiparallel. Im Bild zeigen ${upCount} Pfeile nach oben und ${ARROWS - upCount} nach unten. Achtung, überhöht: Der Überschuss ist ${fmt(EXAGGERATION, 0)}-fach vergrößert${capped ? ' und hier zusätzlich gedeckelt' : ''}. In Wahrheit wäre bei 400 Spins im Mittel nicht einmal ein einziger Pfeil zu viel.`,
            `Синий: параллельно B₀ (энергетически выгоднее) · розовый: антипараллельно. На картинке ${upCount} стрелок смотрят вверх и ${ARROWS - upCount} вниз. Внимание, преувеличено: избыток увеличен в ${fmt(EXAGGERATION, 0)} раз${capped ? ' и здесь дополнительно ограничен' : ''}. На самом деле при 400 спинах в среднем не набралось бы даже одной лишней стрелки.`,
          )}
        </p>
      </Panel>

      <Panel title={tr('Feld und Temperatur', 'Поле и температура')}>
        <Slider label={tr('Feldstärke B₀', 'Индукция поля B₀')} value={b0} min={0.5} max={7} step={0.1} unit={tr('T', 'Тл')} onChange={setB0} format={(v) => fmt(v, 1)} />
        <Slider
          label={tr('Temperatur', 'Температура')}
          value={temp}
          min={4}
          max={400}
          step={1}
          unit="K"
          onChange={setTemp}
          hint={tr('Körpertemperatur: 310 K (37 °C)', 'Температура тела: 310 K (37 °C)')}
        />
        <div className="row gap wrap">
          <button className={`btn small${temp === BODY_TEMPERATURE_K ? ' primary' : ''}`} type="button" onClick={() => setTemp(BODY_TEMPERATURE_K)}>
            {tr('Körpertemperatur 310 K', 'Температура тела 310 K')}
          </button>
          <button className={`btn small${temp === 4 ? ' primary' : ''}`} type="button" onClick={() => setTemp(4)}>
            {tr('Flüssiges Helium 4 K', 'Жидкий гелий 4 K')}
          </button>
        </div>
        <div className="stat-grid two">
          <Stat label={tr('Spins ↑ pro Million', 'Спинов ↑ на миллион')} value={fmt(up, 2)} />
          <Stat label={tr('Spins ↓ pro Million', 'Спинов ↓ на миллион')} value={fmt(down, 2)} />
          <Stat label={tr('Überschuss', 'Избыток')} value={fmt(ppm, ppm < 10 ? 2 : 1)} unit="ppm" tone="good" />
          <Stat label={tr('M₀ relativ zu 1,5 T / 310 K', 'M₀ относительно 1,5 Тл / 310 K')} value={fmt(relM0, 2)} unit="×" />
          <Stat label={tr('Energieabstand', 'Разность энергий')} value={sci(dE)} unit={tr('J', 'Дж')} sub={`ΔE = h·f₀, f₀ = ${fmt(larmorMHz(b0), 1)} ${tr('MHz', 'МГц')}`} />
          <Stat label={tr('Verhältnis zur Wärme', 'Отношение к теплу')} value={sci(ratioKT)} sub="ΔE / kT" />
          <Stat label={tr('Protonen in 1 mm³ Wasser', 'Протонов в 1 мм³ воды')} value={sci(PROTONS_PER_MM3)} />
          <Stat label={tr('Davon Überschuss', 'Из них избыток')} value={sci(excess * PROTONS_PER_MM3)} tone="good" />
        </div>
      </Panel>

      <Panel title={tr('So wird gerechnet', 'Как считается')} className="span-3">
        <TeX block tex="\begin{aligned} \Delta E &= \gamma\hbar B_0 = h f_0, \qquad \frac{N_\uparrow}{N_\downarrow} = e^{\Delta E / kT} \\ \frac{N_\uparrow - N_\downarrow}{N} &= \tanh\frac{\Delta E}{2kT} \approx \frac{\Delta E}{2kT} \end{aligned}" />
        <p className="small">
          {tr(
            'ΔE ist der Energieabstand der beiden Spinzustände, kT die Wärmeenergie (k ist die Boltzmann-Konstante, T die Temperatur in Kelvin). Bei Körpertemperatur ist ΔE rund eine Million Mal kleiner als kT. Die Wärme kippt die Spins also ständig hin und her, übrig bleiben ein paar ppm. Der Überschuss wächst linear mit B₀ und fällt mit 1/T. M₀ ist proportional zu diesem Überschuss.',
            'ΔE это разность энергий двух спиновых состояний, kT тепловая энергия (k постоянная Больцмана, T температура в кельвинах). При температуре тела ΔE примерно в миллион раз меньше kT. Поэтому тепло постоянно переворачивает спины туда и обратно, остаётся несколько ppm. Избыток растёт линейно с B₀ и падает как 1/T. M₀ пропорциональна этому избытку.',
          )}
        </p>
        <Callout
          variant="merke"
          title={tr('Warum es trotzdem klappt', 'Почему это всё равно работает')}
          text={tr(
            'Ein Kubikmillimeter Wasser enthält rund 6,7·10¹⁹ Protonen. Selbst 5 ppm davon sind noch etwa 3·10¹⁴ Spins, und die ergeben gemeinsam ein messbares M₀. Den Körper kühlen kann man nicht, also bleibt als Hebel ein stärkeres Feld.',
            'В кубическом миллиметре воды около 6,7·10¹⁹ протонов. Даже 5 ppm из них это ещё примерно 3·10¹⁴ спинов, и вместе они дают измеримую M₀. Охладить тело нельзя, поэтому остаётся рычаг более сильного поля.',
          )}
        />
      </Panel>
    </>
  );
}

// ---------------------------------------------------------------- Modus 2: Bezugssystem

/** Reale Werte für die Beschriftung: 90°-Rechteckpuls von 0,5 ms bei 1,5 T */
const REAL_TAU_MS = 0.5;
const REAL_B0 = 1.5;
const REAL_B1_UT = (0.25 / (GAMMA_BAR_H1 * 1e6 * REAL_TAU_MS * 1e-3)) * 1e6;
const REAL_TURNS = larmorMHz(REAL_B0) * 1e6 * REAL_TAU_MS * 1e-3;
const REAL_RATIO = REAL_B0 / (REAL_B1_UT * 1e-6);
const PLAY_MS = 6000;

/** Schräge Projektion: x′ zeigt nach vorne links, y′ nach rechts, z nach oben. */
const project = (v: readonly number[]): [number, number] => [195 + v[1] * 125 - v[0] * 60, 185 + v[0] * 45 - v[2] * 125];

function FrameMode() {
  const { tr } = useLang();
  const reduced = usePrefersReducedMotion();
  const [frame, setFrame] = useState<Frame>('lab');
  const [turns, setTurns] = useState(6);
  const [time, setTime] = useState(REAL_TAU_MS * 0.6);
  const [playing, setPlaying] = useState(false);
  const timeRef = useRef(time);
  timeRef.current = time;

  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    const start = performance.now();
    const t0 = timeRef.current >= REAL_TAU_MS ? 0 : timeRef.current;
    const step = (now: number) => {
      const t = t0 + ((now - start) / PLAY_MS) * REAL_TAU_MS;
      if (t >= REAL_TAU_MS) {
        setTime(REAL_TAU_MS);
        setPlaying(false);
        return;
      }
      setTime(t);
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  useEffect(() => {
    if (reduced) setPlaying(false);
  }, [reduced]);

  const s = time / REAL_TAU_MS;
  const trace = useMemo(() => {
    const vec = (u: number) => {
      const theta = (Math.PI / 2) * u;
      if (frame === 'rot') return [0, Math.sin(theta), Math.cos(theta)];
      const phi = 2 * Math.PI * turns * u;
      return [-Math.sin(theta) * Math.sin(phi), Math.sin(theta) * Math.cos(phi), Math.cos(theta)];
    };
    const steps = 480;
    const pts: string[] = [];
    for (let i = 0; i <= steps * s; i++) pts.push(project(vec(i / steps)).join(','));
    const m = vec(s);
    pts.push(project(m).join(','));
    return { points: pts.join(' '), m };
  }, [s, frame, turns]);
  const m = trace.m;
  const phi = frame === 'lab' ? 2 * Math.PI * turns * s : 0;
  const tip = project(m);
  const b1Tip = project([Math.cos(phi) * 0.75, Math.sin(phi) * 0.75, 0]);
  const b1Label = project([Math.cos(phi) * 0.98, Math.sin(phi) * 0.98, 0]);
  const origin = project([0, 0, 0]);
  const ellipse = Array.from({ length: 73 }, (_, i) => project([Math.cos((i / 72) * 2 * Math.PI), Math.sin((i / 72) * 2 * Math.PI), 0]).join(',')).join(' ');
  const prime = frame === 'rot' ? '′' : '';
  const axes: Array<[number[], string]> = [
    [[1.4, 0, 0], `x${prime}`],
    [[0, 1.4, 0], `y${prime}`],
    [[0, 0, 1.3], 'z ∥ B₀'],
  ];
  const flipNow = 90 * s;
  const ms = tr('ms', 'мс');
  const rounded = (v: number, to: number) => fmt(Math.round(v / to) * to, 0);

  return (
    <>
      <Panel title={frame === 'lab' ? tr('90°-Puls im Laborsystem', '90°-импульс в лабораторной системе') : tr('90°-Puls im rotierenden System', '90°-импульс во вращающейся системе')} className="span-2">
        <svg className="lab-figure ens-fig" viewBox="0 0 400 275" role="img" aria-label={tr(`Magnetisierung nach ${fmt(flipNow, 0)}° Kippung`, `Намагниченность после отклонения на ${fmt(flipNow, 0)}°`)}>
          <polyline points={ellipse} fill="rgba(56,189,248,0.04)" stroke="rgba(56,189,248,0.35)" />
          {axes.map(([v, label]) => {
            const p = project(v);
            return (
              <g key={label}>
                <line x1={origin[0]} y1={origin[1]} x2={p[0]} y2={p[1]} className="lab-axis" />
                <text x={p[0] + 4} y={p[1] - 6} className="lab-axis-label">
                  {label}
                </text>
              </g>
            );
          })}
          <polyline fill="none" stroke="rgba(167,139,250,0.8)" strokeWidth="1.8" points={trace.points} />
          <line x1={origin[0]} y1={origin[1]} x2={b1Tip[0]} y2={b1Tip[1]} stroke="#fbbf24" strokeWidth="3" strokeLinecap="round" />
          <text x={b1Label[0]} y={b1Label[1] + 5} textAnchor="middle" className="fig-label" fill="#fbbf24">
            B₁
          </text>
          <line x1={origin[0]} y1={origin[1]} x2={tip[0]} y2={tip[1]} stroke="#f472b6" strokeWidth="5" strokeLinecap="round" />
          <circle cx={tip[0]} cy={tip[1]} r="6" fill="#f472b6" />
          <text x={tip[0] + 9} y={tip[1] - 9} className="fig-label" fill="#f472b6">
            M
          </text>
        </svg>
        <p className="small muted">
          {frame === 'lab'
            ? tr(
                'Violett: Bahn der Pfeilspitze. Sie kreist um z und sinkt dabei langsam nach unten, eine Spirale auf der Kugel. Gelb: B₁ dreht sich im Takt der Larmor-Frequenz mit.',
                'Фиолетовый: путь кончика стрелки. Он вращается вокруг z и медленно опускается вниз, это спираль на сфере. Жёлтый: B₁ вращается в такт ларморовой частоте.',
              )
            : tr(
                'Violett: Bahn der Pfeilspitze. Sie läuft auf einem Viertelkreis um x′ von z nach y′. Gelb: B₁ steht in diesem System still auf x′.',
                'Фиолетовый: путь кончика стрелки. Он идёт по четверти окружности вокруг x′ от z к y′. Жёлтый: B₁ в этой системе неподвижно лежит на x′.',
              )}
        </p>
        <Slider
          label={tr('Zeit im Puls', 'Время внутри импульса')}
          value={time}
          min={0}
          max={REAL_TAU_MS}
          step={0.005}
          unit={ms}
          onChange={(v) => {
            setPlaying(false);
            setTime(v);
          }}
          format={(v) => fmt(v, 3)}
        />
        <div className="row gap wrap">
          <button className="btn primary" type="button" disabled={reduced} onClick={() => setPlaying((p) => !p)}>
            {playing ? tr('⏸ Anhalten', '⏸ Пауза') : tr('▶ Abspielen', '▶ Воспроизвести')}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setPlaying(false);
              setTime(0);
            }}
          >
            {tr('↺ Auf Anfang', '↺ В начало')}
          </button>
        </div>
        {reduced && (
          <p className="small muted">
            {tr('Dein System wünscht weniger Bewegung. Nutze den Zeitregler, um den Puls Schritt für Schritt anzusehen.', 'Твоя система просит меньше движения. Используй ползунок времени, чтобы посмотреть импульс шаг за шагом.')}
          </p>
        )}
      </Panel>

      <Panel title={tr('Blickwinkel', 'Точка зрения')}>
        <Segmented
          label={tr('Bezugssystem', 'Система отсчёта')}
          value={frame}
          onChange={setFrame}
          options={[
            { value: 'lab', label: tr('Laborsystem', 'Лабораторная') },
            { value: 'rot', label: tr('Rotierendes System', 'Вращающаяся') },
          ]}
        />
        <Slider
          label={tr('Larmor-Umläufe pro Puls (verlangsamt)', 'Обороты Лармора за импульс (замедлено)')}
          value={turns}
          min={2}
          max={12}
          step={1}
          onChange={setTurns}
          disabled={frame === 'rot'}
          hint={frame === 'rot' ? tr('Im rotierenden System ist die Larmor-Drehung herausgerechnet.', 'Во вращающейся системе ларморово вращение исключено.') : undefined}
        />
        <div className="stat-grid two">
          <Stat label={tr('Flipwinkel bisher', 'Угол отклонения пока')} value={fmt(flipNow, 0)} unit="°" />
          <Stat label="Mz" value={fmt(Math.abs(m[2]) < 5e-4 ? 0 : m[2], 2)} />
          <Stat label="|Mxy|" value={fmt(Math.hypot(m[0], m[1]), 2)} />
          <Stat label={tr('Umläufe im Bild', 'Оборотов на картинке')} value={frame === 'lab' ? fmt(turns * s, 1) : '0'} />
        </div>
        <Callout
          variant="achtung"
          title={tr('Didaktisch verlangsamt', 'Учебно замедлено')}
          text={tr(
            `Hier dreht sich M während des Pulses nur ${turns}-mal um z. In Wahrheit kreist M bei 1,5 T während eines 90°-Pulses von 0,5 ms rund ${rounded(REAL_TURNS, 100)}-mal. Das Verhältnis von Larmor- zu Nutationsfrequenz ist B₀/B₁ ≈ ${rounded(REAL_RATIO, 1000)}, mit B₁ ≈ ${fmt(REAL_B1_UT, 1)} µT.`,
            `Здесь M за время импульса оборачивается вокруг z всего ${turns} раз. На самом деле при 1,5 Тл за 90°-импульс длительностью 0,5 мс M делает около ${rounded(REAL_TURNS, 100)} оборотов. Отношение ларморовой частоты к частоте нутации равно B₀/B₁ ≈ ${rounded(REAL_RATIO, 1000)}, при B₁ ≈ ${fmt(REAL_B1_UT, 1)} мкТл.`,
          )}
        />
      </Panel>

      <Panel title={tr('Warum das rotierende System hilft', 'Зачем нужна вращающаяся система')} className="span-3">
        <p className="small">
          {tr(
            'Im Skript steht der HF-Puls als B₁cos(ω₀t) in den Bloch-Gleichungen. Im Laborsystem ist das ein schnell wechselndes Feld, und die Bahn von M wird eine Spirale. Drehst du dein Koordinatensystem mit ω₀ um z mit, verschwindet die Präzession um B₀. Übrig bleibt ein ruhendes B₁ auf x′, und M kippt einfach um diese Achse. Der Kippwinkel ist α = γ·B₁·τ (γ gyromagnetisches Verhältnis, B₁ Pulsamplitude, τ Pulsdauer).',
            'В конспекте РЧ-импульс записан в уравнениях Блоха как B₁cos(ω₀t). В лабораторной системе это быстро меняющееся поле, и путь M становится спиралью. Если вращать систему координат вместе с ω₀ вокруг z, прецессия вокруг B₀ исчезает. Остаётся неподвижное B₁ на x′, и M просто поворачивается вокруг этой оси. Угол поворота α = γ·B₁·τ (γ гиромагнитное отношение, B₁ амплитуда импульса, τ длительность импульса).',
          )}
        </p>
        <TeX block tex="\omega_0 = \gamma B_0 \;\gg\; \omega_1 = \gamma B_1, \qquad \alpha = \gamma B_1 \tau" />
      </Panel>
    </>
  );
}

// ---------------------------------------------------------------- Modus 3: Dephasierung

const SPINS = 24;
const DEPH_B0 = 1.5;
const DEPH_T2 = 100; // ms
const T_MAX = 300; // ms
/** Lorentz-verteilte Frequenzlagen (Quantile). Die Summe vieler solcher Spins zerfällt wie e^(−t/T2′). */
const lorentzQuantiles = (count: number) => Array.from({ length: count }, (_, i) => Math.tan(Math.PI * ((i + 0.5) / count - 0.5)));
/** Gezeigt werden 24 Spins, gerechnet wird die Summe mit 2400 Spins derselben Verteilung. */
const LORENTZ_SHOWN = lorentzQuantiles(SPINS);
const LORENTZ_SUM = lorentzQuantiles(2400);
const spinColor = (i: number) => `hsl(${200 + (130 * i) / (SPINS - 1)} 85% 65%)`;

function DephasingMode() {
  const { tr } = useLang();
  const [ppm, setPpm] = useState(0.1);
  const [time, setTime] = useState(20);
  const [pulseAt, setPulseAt] = useState<number | null>(null);

  const deltaB0uT = ppm * DEPH_B0;
  const dOmega = (larmorAngular(1) * deltaB0uT * 1e-6) / 1000; // rad/ms, Halbwertsbreite der Lorentz-Verteilung
  const t2prime = dOmega > 0 ? 1 / dOmega : Infinity;
  const t2star = t2StarFromInhomogeneity(DEPH_T2, deltaB0uT);

  const model = useMemo(() => {
    const phases = (t: number, spins: number[]) => {
      const eff = pulseAt !== null && t > pulseAt ? t - 2 * pulseAt : t;
      return spins.map((q) => q * dOmega * eff);
    };
    const sumAt = (t: number) => {
      const ph = phases(t, LORENTZ_SUM);
      const c = ph.reduce((a, p) => a + Math.cos(p), 0) / ph.length;
      const sn = ph.reduce((a, p) => a + Math.sin(p), 0) / ph.length;
      return { c, sn, mag: Math.hypot(c, sn) * Math.exp(-t / DEPH_T2) };
    };
    const curve: Array<[number, number]> = Array.from({ length: 301 }, (_, i) => {
      const t = (i / 300) * T_MAX;
      return [t, sumAt(t).mag];
    });
    return { phases, sumAt, curve };
  }, [dOmega, pulseAt]);
  const env = useMemo(() => Array.from({ length: 121 }, (_, i): [number, number] => [(i / 120) * T_MAX, Math.exp(-((i / 120) * T_MAX) / DEPH_T2)]), []);
  const envStar = useMemo(() => Array.from({ length: 121 }, (_, i): [number, number] => [(i / 120) * T_MAX, Math.exp(-((i / 120) * T_MAX) / t2star)]), [t2star]);

  const now = model.sumAt(time);
  const ph = model.phases(time, LORENTZ_SHOWN);
  const amp = Math.exp(-time / DEPH_T2);
  const echoAt = pulseAt !== null ? 2 * pulseAt : null;
  const R = 140;
  const C = 170;
  const ms = tr('ms', 'мс');

  return (
    <>
      <Panel title={tr('24 Spins in der Querebene (rotierendes System)', '24 спина в поперечной плоскости (вращающаяся система)')} className="span-2">
        <svg className="lab-figure ens-fig" viewBox="0 0 340 340" role="img" aria-label={tr(`Fächer aus 24 Spins, Summe ${fmt(now.mag * 100, 0)} Prozent`, `Веер из 24 спинов, сумма ${fmt(now.mag * 100, 0)} процентов`)}>
          <circle cx={C} cy={C} r={R} fill="rgba(56,189,248,0.04)" stroke="rgba(148,163,184,0.35)" />
          <line x1={C - R - 8} y1={C} x2={C + R + 8} y2={C} className="lab-axis" />
          <line x1={C} y1={C + R + 8} x2={C} y2={C - R - 8} className="lab-axis" />
          <text x={C + R - 4} y={C - 8} className="lab-axis-label">
            x′
          </text>
          <text x={C + 8} y={C - R + 4} className="lab-axis-label">
            y′
          </text>
          {ph.map((p, i) => {
            const x = C + R * amp * Math.sin(p);
            const y = C - R * amp * Math.cos(p);
            return (
              <g key={i}>
                <line x1={C} y1={C} x2={x} y2={y} stroke={spinColor(i)} strokeWidth="2" strokeLinecap="round" opacity="0.85" />
                <circle cx={x} cy={y} r="4" fill={spinColor(i)} />
              </g>
            );
          })}
          <line x1={C} y1={C} x2={C + R * amp * now.sn} y2={C - R * amp * now.c} stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" />
          <circle cx={C} cy={C} r="4" fill="var(--text)" />
        </svg>
        <p className="small muted">
          {tr(
            'Dünne Pfeile: 24 Spins als Stichprobe, von Blau (langsamer als f₀) bis Rosa (schneller). Gelb: die Summe Mxy, gerechnet mit 2400 Spins derselben Verteilung. Alle Pfeile werden zusätzlich mit T2 kürzer.',
            'Тонкие стрелки: 24 спина как выборка, от синего (медленнее f₀) до розового (быстрее). Жёлтая: сумма Mxy, рассчитанная по 2400 спинам того же распределения. Кроме того, все стрелки укорачиваются с T2.',
          )}
        </p>
        <Slider label={tr('Zeit nach dem 90°-Puls', 'Время после 90°-импульса')} value={time} min={0} max={T_MAX} step={1} unit={ms} onChange={setTime} />
        <div className="row gap wrap">
          <button className="btn primary" type="button" disabled={pulseAt !== null || time <= 0 || time >= T_MAX} onClick={() => setPulseAt(time)}>
            {tr('180°-Puls', '180°-импульс')}
          </button>
          <button
            className="btn"
            type="button"
            onClick={() => {
              setPulseAt(null);
              setTime(0);
            }}
          >
            {tr('↺ Zurücksetzen', '↺ Сбросить')}
          </button>
        </div>
      </Panel>

      <Panel title={tr('Feld und Zeitkonstanten', 'Поле и временные константы')}>
        <Slider
          label={tr('Feldinhomogenität ΔB₀', 'Неоднородность поля ΔB₀')}
          value={ppm}
          min={0}
          max={0.5}
          step={0.01}
          unit="ppm"
          onChange={setPpm}
          format={(v) => fmt(v, 2)}
          hint={tr(`Bei B₀ = 1,5 T sind das ${fmt(deltaB0uT, 2)} µT.`, `При B₀ = 1,5 Тл это ${fmt(deltaB0uT, 2)} мкТл.`)}
        />
        <div className="stat-grid two">
          <Stat label={tr('|Mxy| jetzt', '|Mxy| сейчас')} value={fmt(now.mag * 100, 0)} unit="%" tone={now.mag > 0.5 ? 'good' : now.mag > 0.2 ? 'warn' : 'bad'} />
          <Stat label="e^(−t/T2)" value={fmt(amp * 100, 0)} unit="%" />
          <Stat label="T2" value={DEPH_T2} unit={ms} sub={tr('fest gewählt', 'задано')} />
          <Stat label="T2′" value={Number.isFinite(t2prime) ? fmt(t2prime, 1) : '∞'} unit={ms} sub="1 / (γ·ΔB₀)" />
          <Stat label="T2*" value={fmt(t2star, 1)} unit={ms} tone="warn" />
          <Stat
            label={tr('Echo bei', 'Эхо при')}
            value={echoAt !== null ? fmt(echoAt, 0) : '–'}
            unit={echoAt !== null ? ms : undefined}
            sub={pulseAt !== null ? tr(`180° bei ${fmt(pulseAt, 0)} ms`, `180° при ${fmt(pulseAt, 0)} мс`) : tr('noch kein 180°-Puls', 'ещё нет 180°-импульса')}
          />
        </div>
        <TeX block tex="\frac{1}{T_2^*} = \frac{1}{T_2} + \frac{1}{T_2'}, \qquad \frac{1}{T_2'} = \gamma\,\Delta B_0" />
      </Panel>

      <Panel title={tr('Summenlänge |Mxy| über der Zeit', 'Длина суммы |Mxy| во времени')} className="span-2">
        <LineChart
          ariaLabel={tr('Summe der Quermagnetisierung im Vergleich mit e hoch minus t durch T2', 'Сумма поперечной намагниченности в сравнении с e в степени минус t на T2')}
          series={[
            { id: 'sum', label: tr('|Mxy|, Summe aller Spins', '|Mxy|, сумма всех спинов'), color: '#fbbf24', points: model.curve, width: 2.4 },
            { id: 't2', label: 'e^(−t/T2)', color: '#34d399', dashed: true, points: env },
            { id: 't2s', label: 'e^(−t/T2*)', color: '#a78bfa', dashed: true, points: envStar },
          ]}
          xDomain={[0, T_MAX]}
          yDomain={[0, 1.05]}
          xLabel={tr('Zeit [ms]', 'Время [мс]')}
          yLabel="|Mxy| / M₀"
          markers={[
            { x: time, label: 't' },
            ...(pulseAt !== null ? [{ x: pulseAt, label: '180°', color: '#f472b6' }] : []),
            ...(echoAt !== null && echoAt <= T_MAX ? [{ x: echoAt, label: tr('Echo', 'Эхо'), color: '#fbbf24' }] : []),
          ]}
        />
      </Panel>

      <Panel title={tr('Was du siehst', 'Что ты видишь')}>
        <p className="small">
          {tr(
            'Ohne Inhomogenität (0 ppm) laufen alle Spins gleich, und die Summe folgt genau e^(−t/T2). Mit Inhomogenität fächern sie auf, und die Summe fällt viel schneller, mit T2*. Der 180°-Puls spiegelt alle Phasen. Wer vorne war, liegt jetzt hinten und holt bei 2τ genau auf. Das ist das Spin-Echo.',
            'Без неоднородности (0 ppm) все спины идут одинаково, и сумма точно следует e^(−t/T2). С неоднородностью они расходятся веером, и сумма падает гораздо быстрее, с T2*. 180°-импульс зеркально отражает все фазы. Кто был впереди, теперь позади и точно догоняет в момент 2τ. Это спиновое эхо.',
          )}
        </p>
        <Callout
          variant="merke"
          title={tr('Das Echo holt T2 nicht zurück', 'Эхо не возвращает T2')}
          text={tr(
            'Das Echo erreicht nur die grüne Kurve e^(−t/T2), nie wieder 100 %. Der 180°-Puls hebt nur statische Feldunterschiede auf (T2′). Die zufälligen Spin-Spin-Wechselwirkungen (T2) bleiben verloren.',
            'Эхо достигает только зелёной кривой e^(−t/T2) и никогда снова 100 %. 180°-импульс устраняет только статические различия поля (T2′). Случайные спин-спиновые взаимодействия (T2) остаются потерянными.',
          )}
        />
      </Panel>
    </>
  );
}
