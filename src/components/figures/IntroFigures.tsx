import type { ReactNode } from 'react';
import { useLang } from '../../i18n/LanguageContext';
import { Arrow, C, FS, Txt, polyPoints } from './shared';

/** Text, der bei Bedarf auf eine Maximalbreite gestaucht wird (grobe Breitenschätzung). */
function Fit({
  x,
  y,
  text,
  max,
  size = FS,
  strong,
  anchor = 'start',
  fill,
}: {
  x: number;
  y: number;
  text: string;
  max: number;
  size?: number;
  strong?: boolean;
  anchor?: 'start' | 'middle' | 'end';
  fill?: string;
}) {
  const estimate = text.length * size * (strong ? 0.6 : 0.54);
  return (
    <text
      x={x}
      y={y}
      textAnchor={anchor}
      className={strong ? 'fig-label-strong' : 'fig-label'}
      style={{ fontSize: size, ...(fill ? { fill } : {}) }}
      {...(estimate > max ? { textLength: max, lengthAdjust: 'spacingAndGlyphs' } : {})}
    >
      {text}
    </text>
  );
}

/** Kleine Sinuswelle als Polyline */
function Wave({ x, y, w, amp, cycles, color, decay = 0, width = 2.5 }: { x: number; y: number; w: number; amp: number; cycles: number; color: string; decay?: number; width?: number }) {
  const pts = polyPoints(80, (i) => {
    const u = i / 80;
    return [x + u * w, y - amp * Math.exp(-decay * u) * Math.sin(2 * Math.PI * cycles * u)];
  });
  return <polyline points={pts} fill="none" stroke={color} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />;
}

/* ------------------------------------------------------------------ modality-compare */

function Badge({ x, y, ionizing, tr }: { x: number; y: number; ionizing: boolean; tr: (de: string, ru: string) => string }) {
  const col = ionizing ? C.red : C.green;
  const label = ionizing ? tr('☢ ionisierend', '☢ ионизирующее') : tr('☢ nicht ionisierend', '☢ не ионизирующее');
  const w = 210;
  return (
    <g>
      <rect x={x - w} y={y - 22} width={w} height={32} rx={16} fill="none" stroke={col} strokeWidth={2} />
      <Fit x={x - w / 2} y={y} text={label} max={w - 16} size={18} strong anchor="middle" fill={col} />
    </g>
  );
}

/** Körperquerschnitt als Ellipse */
function Body({ cx, cy, rx = 34, ry = 26 }: { cx: number; cy: number; rx?: number; ry?: number }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="var(--surface-2)" stroke="var(--muted)" strokeWidth={2} />;
}

function IconXray({ y }: { y: number }) {
  const cy = y + 50;
  return (
    <g>
      <rect x={14} y={cy - 16} width={24} height={32} rx={4} fill={C.yellow} opacity={0.85} />
      <Body cx={88} cy={cy} />
      {[-12, 0, 12].map((d) => (
        <Arrow key={d} x1={40} y1={cy + d * 0.5} x2={146} y2={cy + d * 1.4} color={C.yellow} width={2.2} head={9} opacity={0.9} />
      ))}
      <rect x={150} y={cy - 30} width={8} height={60} fill="var(--text-dim)" />
    </g>
  );
}

function IconCt({ y }: { y: number }) {
  const cx = 86;
  const cy = y + 50;
  return (
    <g>
      <circle cx={cx} cy={cy} r={44} fill="none" stroke="var(--muted)" strokeWidth={6} />
      <Body cx={cx} cy={cy} rx={24} ry={18} />
      <rect x={cx - 10} y={cy - 54} width={20} height={14} rx={3} fill={C.yellow} />
      <path d={`M ${cx - 22} ${cy + 50} A 30 6 0 0 0 ${cx + 22} ${cy + 50}`} stroke="var(--text-dim)" strokeWidth={6} fill="none" />
      <line x1={cx} y1={cy - 40} x2={cx} y2={cy + 44} stroke={C.yellow} strokeWidth={2} strokeDasharray="4 4" />
      <path d={`M ${cx + 54} ${cy - 18} A 56 56 0 0 1 ${cx + 54} ${cy + 18}`} stroke={C.blue} strokeWidth={3} fill="none" />
      <Arrow x1={cx + 56} y1={cy + 10} x2={cx + 50} y2={cy + 26} color={C.blue} width={3} head={10} />
    </g>
  );
}

function IconUs({ y }: { y: number }) {
  const cy = y + 50;
  return (
    <g>
      <rect x={14} y={cy - 18} width={22} height={36} rx={5} fill={C.blue} />
      {/* Grenzfläche */}
      <line x1={128} y1={cy - 38} x2={128} y2={cy + 38} stroke="var(--text-dim)" strokeWidth={4} />
      {[0, 1, 2].map((i) => (
        <path key={`o${i}`} d={`M ${50 + i * 22} ${cy - 22} Q ${60 + i * 22} ${cy} ${50 + i * 22} ${cy + 22}`} stroke={C.blue} strokeWidth={2.5} fill="none" />
      ))}
      {[0, 1].map((i) => (
        <path key={`e${i}`} d={`M ${112 - i * 22} ${cy - 16} Q ${102 - i * 22} ${cy} ${112 - i * 22} ${cy + 16}`} stroke={C.green} strokeWidth={2.5} fill="none" strokeDasharray="4 3" />
      ))}
      <Txt x={150} y={cy + 8} size={18} anchor="middle" fill={C.green}>
        ↩
      </Txt>
    </g>
  );
}

function IconPet({ y }: { y: number }) {
  const cx = 86;
  const cy = y + 50;
  return (
    <g>
      <circle cx={cx} cy={cy} r={44} fill="none" stroke="var(--muted)" strokeWidth={6} strokeDasharray="8 4" />
      <Body cx={cx} cy={cy} rx={26} ry={20} />
      <circle cx={cx - 4} cy={cy + 2} r={6} fill={C.pink} />
      <Arrow x1={cx - 8} y1={cy - 2} x2={cx - 36} y2={cy - 30} color={C.pink} width={2.5} head={10} />
      <Arrow x1={cx} y1={cy + 6} x2={cx + 28} y2={cy + 34} color={C.pink} width={2.5} head={10} />
      <Txt x={cx + 52} y={cy - 22} size={18} fill={C.pink}>
        γ
      </Txt>
      <Txt x={cx - 60} y={cy + 40} size={18} fill={C.pink}>
        γ
      </Txt>
    </g>
  );
}

function IconMri({ y }: { y: number }) {
  const cy = y + 50;
  return (
    <g>
      <rect x={14} y={cy - 46} width={130} height={14} rx={4} fill={C.violet} opacity={0.8} />
      <rect x={14} y={cy + 32} width={130} height={14} rx={4} fill={C.violet} opacity={0.8} />
      {[40, 72, 104].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={cy} r={8} fill={C.pink} />
          <Arrow x1={x} y1={cy + 12} x2={x + (i - 1) * 3} y2={cy - 22} color={C.blue} width={2.5} head={9} />
        </g>
      ))}
      <Wave x={118} y={cy} w={40} amp={9} cycles={2.5} color={C.green} />
    </g>
  );
}

/** Fünf Bildgebungsverfahren mit Messprinzip und Strahlenart. */
export function ModalityCompareFigure() {
  const { tr } = useLang();
  const rows: { name: string; measures: string; ionizing: boolean; icon: (y: number) => ReactNode }[] = [
    { name: tr('Röntgen', 'Рентген'), measures: tr('misst: Schwächung des Strahls', 'измеряет: ослабление пучка'), ionizing: true, icon: (y) => <IconXray y={y} /> },
    { name: tr('CT', 'КТ'), measures: tr('misst: Schwächung aus allen Richtungen', 'измеряет: ослабление со всех сторон'), ionizing: true, icon: (y) => <IconCt y={y} /> },
    { name: tr('Ultraschall', 'УЗИ'), measures: tr('misst: Echos an Grenzflächen', 'измеряет: эхо от границ тканей'), ionizing: false, icon: (y) => <IconUs y={y} /> },
    { name: tr('PET', 'ПЭТ'), measures: tr('misst: Tracer über Gammaquanten', 'измеряет: трейсер по гамма-квантам'), ionizing: true, icon: (y) => <IconPet y={y} /> },
    { name: tr('MRT', 'МРТ'), measures: tr('misst: Protonen und ihre Umgebung', 'измеряет: протоны и их окружение'), ionizing: false, icon: (y) => <IconMri y={y} /> },
  ];
  const H = 112;
  return (
    <svg viewBox={`0 0 600 ${rows.length * H + 10}`} role="img" aria-label={tr('Vergleich der Bildgebungsverfahren', 'Сравнение методов визуализации')}>
      {rows.map((r, i) => {
        const y = 4 + i * H;
        return (
          <g key={i}>
            {i > 0 && <line x1={10} y1={y - 4} x2={590} y2={y - 4} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 6" />}
            {r.icon(y)}
            <Txt x={190} y={y + 38} strong size={26}>
              {r.name}
            </Txt>
            <Badge x={590} y={y + 36} ionizing={r.ionizing} tr={tr} />
            <Fit x={190} y={y + 80} text={r.measures} max={400} size={20} />
          </g>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------ tissue-water */

/** Ungefährer Wassergehalt verschiedener Gewebe und ihre ungefähre Helligkeit im PD-Bild. */
export function TissueWaterFigure() {
  const { tr } = useLang();
  const rows = [
    { name: tr('Liquor', 'Ликвор'), water: 99, gray: 0.95 },
    { name: tr('graue Substanz', 'Серое вещество'), water: 80, gray: 0.74 },
    { name: tr('Muskel', 'Мышца'), water: 75, gray: 0.45 },
    { name: tr('weiße Substanz', 'Белое вещество'), water: 70, gray: 0.62 },
    { name: tr('Fett', 'Жир'), water: 15, gray: 0.88, fat: true },
    { name: tr('kompakter Knochen', 'Компактная кость'), water: 15, gray: 0.03, bone: true },
  ];
  const x0 = 20;
  const full = 420;
  const RH = 66;
  const top = 64;
  return (
    <svg viewBox={`0 0 600 ${top + rows.length * RH + 70}`} role="img" aria-label={tr('Wassergehalt und Helligkeit im PD-Bild', 'Содержание воды и яркость на PD-снимке')}>
      <Txt x={x0} y={32} strong>
        {tr('Wassergehalt (ungefähr)', 'Содержание воды (примерно)')}
      </Txt>
      <Txt x={530} y={22} strong anchor="middle" size={19}>
        {tr('PD-Bild', 'PD-снимок')}
      </Txt>
      <Txt x={530} y={46} anchor="middle" size={17}>
        {tr('(ungefähr)', '(примерно)')}
      </Txt>
      {rows.map((r, i) => {
        const y = top + i * RH;
        const w = (r.water / 100) * full;
        const g = Math.round(r.gray * 235 + 10);
        return (
          <g key={i}>
            <Txt x={x0} y={y + 18} size={20}>
              {r.name}
            </Txt>
            <Txt x={x0 + full} y={y + 18} size={20} anchor="end" strong>
              {`≈ ${r.water} %`}
            </Txt>
            <rect x={x0} y={y + 28} width={full} height={20} rx={4} fill="var(--surface-2)" />
            <rect x={x0} y={y + 28} width={w} height={20} rx={4} fill={C.blue} />
            {r.fat && (
              <g>
                <rect x={x0 + w + 2} y={y + 28} width={full * 0.62} height={20} rx={4} fill={C.yellow} opacity={0.85} />
                <Fit x={x0 + w + 12} y={y + 44} text={tr('+ Fettprotonen', '+ протоны жира')} max={full * 0.58} size={17} strong fill="#1f2937" />
              </g>
            )}
            {r.bone && (
              <Fit x={x0 + w + 12} y={y + 44} text={tr('T2 extrem kurz', 'T2 крайне короткое')} max={full - w - 20} size={17} strong fill={C.red} />
            )}
            <rect x={480} y={y + 6} width={100} height={44} rx={6} fill={`rgb(${g},${g},${g})`} stroke="var(--muted)" strokeWidth={1.5} />
          </g>
        );
      })}
      <rect x={x0} y={top + rows.length * RH + 8} width={18} height={14} rx={3} fill={C.blue} />
      <Txt x={x0 + 26} y={top + rows.length * RH + 21} size={17}>
        {tr('Wasser', 'вода')}
      </Txt>
      <rect x={x0 + 120} y={top + rows.length * RH + 8} width={18} height={14} rx={3} fill={C.yellow} />
      <Txt x={x0 + 146} y={top + rows.length * RH + 21} size={17}>
        {tr('Fettprotonen', 'протоны жира')}
      </Txt>
      <Txt x={300} y={top + rows.length * RH + 54} size={17} anchor="middle">
        {tr('schematisch, alle Werte ungefähr', 'схематично, все значения примерные')}
      </Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ proton-to-image */

function StepIcon({ step, cx, cy }: { step: number; cx: number; cy: number }) {
  switch (step) {
    case 1:
      return (
        <g>
          <Arrow x1={cx - 50} y1={cy + 34} x2={cx - 50} y2={cy - 34} color="var(--text-dim)" width={3} head={11} />
          <Txt x={cx - 42} y={cy - 22} size={17} strong>
            B₀
          </Txt>
          {[-6, 22, 50].map((dx) => (
            <g key={dx}>
              <circle cx={cx + dx} cy={cy + 6} r={7} fill={C.pink} />
              <Arrow x1={cx + dx} y1={cy + 22} x2={cx + dx} y2={cy - 22} color={C.blue} width={2.5} head={9} />
            </g>
          ))}
        </g>
      );
    case 2:
      return (
        <g>
          <Arrow x1={cx - 10} y1={cy + 30} x2={cx - 10} y2={cy - 30} color={C.blue} width={2} head={8} opacity={0.4} />
          <Arrow x1={cx - 10} y1={cy + 30} x2={cx + 50} y2={cy + 30} color={C.blue} width={3.5} head={12} />
          <path d={`M ${cx - 4} ${cy - 22} A 50 50 0 0 1 ${cx + 40} ${cy + 18}`} stroke={C.violet} strokeWidth={2.5} fill="none" strokeDasharray="4 4" />
          <Txt x={cx + 28} y={cy - 12} size={17} fill={C.violet} strong>
            90°
          </Txt>
          <Wave x={cx - 66} y={cy} w={44} amp={14} cycles={3} color={C.yellow} />
        </g>
      );
    case 3:
      return <Wave x={cx - 60} y={cy} w={120} amp={30} cycles={6} decay={3} color={C.green} width={3} />;
    case 4:
      return (
        <g>
          <polygon points={`${cx - 60},${cy + 30} ${cx + 60},${cy + 30} ${cx + 60},${cy - 30}`} fill={C.blue} opacity={0.25} stroke={C.blue} strokeWidth={2} />
          <Wave x={cx - 58} y={cy - 22} w={34} amp={6} cycles={1} color={C.yellow} width={2} />
          <Wave x={cx + 8} y={cy - 22} w={34} amp={6} cycles={3} color={C.yellow} width={2} />
          <Txt x={cx - 40} y={cy + 22} size={16}>
            f
          </Txt>
          <Txt x={cx + 28} y={cy + 22} size={16} strong>
            f ↑
          </Txt>
        </g>
      );
    case 5:
      return (
        <g>
          <rect x={cx - 64} y={cy - 18} width={40} height={36} rx={6} fill="none" stroke={C.violet} strokeWidth={2.5} />
          <Txt x={cx - 44} y={cy + 7} size={18} strong anchor="middle" fill={C.violet}>
            FT
          </Txt>
          <Arrow x1={cx - 20} y1={cy} x2={cx + 4} y2={cy} color="var(--muted)" width={2.5} head={9} />
          {[0, 1, 2].map((r) =>
            [0, 1, 2].map((c) => {
              const v = [
                [0.2, 0.6, 0.2],
                [0.6, 1, 0.6],
                [0.2, 0.6, 0.2],
              ][r][c];
              const g = Math.round(40 + v * 200);
              return <rect key={`${r}${c}`} x={cx + 10 + c * 17} y={cy - 26 + r * 17} width={16} height={16} fill={`rgb(${g},${g},${g})`} />;
            }),
          )}
        </g>
      );
    default:
      return null;
  }
}

/** Die Kette vom Proton zum Bild in fünf Schritten, als Schlange in zwei Zeilen. */
export function ProtonToImageFigure() {
  const { tr } = useLang();
  const steps = [
    { title: tr('Magnetfeld', 'Магнитное поле'), sub: tr('richtet aus', 'выстраивает'), color: C.violet },
    { title: tr('HF-Puls', 'РЧ-импульс'), sub: tr('kippt', 'наклоняет'), color: C.violet },
    { title: tr('Spins senden', 'Спины излучают'), sub: tr('FID-Signal', 'сигнал FID'), color: C.violet },
    { title: tr('Gradienten', 'Градиенты'), sub: tr('kodieren den Ort', 'кодируют место'), color: C.blue },
    { title: tr('Fourier-', 'Преобразование'), sub: tr('Transformation', 'Фурье'), color: C.blue },
  ];
  // Positionen: Zeile 1 von links nach rechts, Zeile 2 von rechts nach links
  const pos: [number, number][] = [
    [100, 30],
    [300, 30],
    [500, 30],
    [500, 230],
    [300, 230],
  ];
  const W = 150;
  const BH = 90;
  return (
    <svg viewBox="0 0 600 440" role="img" aria-label={tr('Vom Proton zum Bild in fünf Schritten', 'От протона к изображению за пять шагов')}>
      {steps.map((s, i) => {
        const [cx, y] = pos[i];
        return (
          <g key={i}>
            <rect x={cx - W / 2} y={y} width={W} height={BH} rx={12} fill="var(--surface-2)" stroke={s.color} strokeWidth={2.5} />
            <StepIcon step={i + 1} cx={cx} cy={y + BH / 2} />
            <circle cx={cx - W / 2 + 4} cy={y + 4} r={15} fill={s.color} />
            <Txt x={cx - W / 2 + 4} y={y + 11} strong anchor="middle" size={19} fill="#111827">
              {String(i + 1)}
            </Txt>
            <Fit x={cx} y={y + BH + 28} text={s.title} max={190} size={20} strong anchor="middle" />
            <Fit x={cx} y={y + BH + 52} text={s.sub} max={190} size={19} anchor="middle" />
          </g>
        );
      })}
      {/* Pfeile */}
      <Arrow x1={178} y1={75} x2={222} y2={75} color="var(--muted)" width={3} head={12} />
      <Arrow x1={378} y1={75} x2={422} y2={75} color="var(--muted)" width={3} head={12} />
      <path d="M 578 75 Q 596 75 596 150 Q 596 275 578 275" fill="none" stroke="var(--muted)" strokeWidth={3} />
      <Arrow x1={590} y1={270} x2={577} y2={275} color="var(--muted)" width={3} head={12} />
      <Arrow x1={422} y1={275} x2={378} y2={275} color="var(--muted)" width={3} head={12} />
      <Arrow x1={222} y1={275} x2={178} y2={275} color="var(--muted)" width={3} head={12} />
      {/* Ergebnis: Bild */}
      <rect x={40} y={230} width={120} height={90} rx={12} fill="#0b0f14" stroke={C.green} strokeWidth={2.5} />
      <ellipse cx={100} cy={275} rx={40} ry={32} fill="rgb(150,150,150)" />
      <ellipse cx={100} cy={275} rx={28} ry={22} fill="rgb(200,200,200)" />
      <ellipse cx={92} cy={272} rx={5} ry={9} fill="rgb(245,245,245)" />
      <ellipse cx={108} cy={272} rx={5} ry={9} fill="rgb(245,245,245)" />
      <Txt x={100} y={348} strong anchor="middle" size={20} fill={C.green}>
        {tr('MR-Bild', 'МР-снимок')}
      </Txt>
      {/* Legende */}
      <rect x={20} y={404} width={18} height={14} rx={3} fill={C.violet} />
      <Fit x={46} y={417} text={tr('Physikalisches Prinzip', 'Физический принцип')} max={240} size={17} />
      <rect x={310} y={404} width={18} height={14} rx={3} fill={C.blue} />
      <Fit x={336} y={417} text={tr('Vom Signal zum Bild', 'От сигнала к изображению')} max={254} size={17} />
    </svg>
  );
}

/* ------------------------------------------------------------------ scanner-io */

/** Tunnelmagnet im Längsschnitt mit Patient: Input Pulssequenz, Output FID-Signal. */
export function ScannerIoFigure() {
  const { tr } = useLang();
  const mx0 = 170;
  const mx1 = 450;
  const dots = (y0: number) => {
    const out: ReactNode[] = [];
    for (let x = mx0 + 14; x < mx1 - 6; x += 18) {
      for (let j = 0; j < 3; j++) out.push(<circle key={`${y0}-${x}-${j}`} cx={x} cy={y0 + 12 + j * 13} r={2.6} fill="var(--muted)" />);
    }
    return out;
  };
  return (
    <svg viewBox="0 0 600 430" role="img" aria-label={tr('Tunnelmagnet mit Input und Output', 'Туннельный магнит: вход и выход')}>
      {/* Magnetblöcke (Längsschnitt der Röhre) */}
      <rect x={mx0} y={90} width={mx1 - mx0} height={50} rx={12} fill="var(--surface-2)" stroke="var(--muted)" strokeWidth={2} />
      <rect x={mx0} y={262} width={mx1 - mx0} height={50} rx={12} fill="var(--surface-2)" stroke="var(--muted)" strokeWidth={2} />
      {dots(90)}
      {dots(262)}
      {/* Tisch */}
      <rect x={110} y={222} width={350} height={10} rx={3} fill="var(--muted)" />
      {/* Patient */}
      <rect x={220} y={196} width={160} height={26} rx={13} fill={C.pink} opacity={0.35} stroke={C.pink} strokeWidth={2} />
      <circle cx={398} cy={204} r={17} fill={C.pink} opacity={0.35} stroke={C.pink} strokeWidth={2} />
      {/* B0 entlang der Röhre */}
      <Arrow x1={200} y1={250} x2={380} y2={250} color="var(--text-dim)" width={2.5} head={11} />
      <Txt x={390} y={257} size={18} strong>
        B₀
      </Txt>
      {/* Input */}
      <Txt x={20} y={30} strong fill={C.red}>
        {tr('Input:', 'Вход:')}
      </Txt>
      <Fit x={20} y={58} text={tr('Pulssequenz (HF + Gradienten)', 'импульсная последовательность')} max={330} size={20} fill={C.red} />
      <Arrow x1={70} y1={72} x2={262} y2={190} color={C.red} width={5} head={18} />
      {/* kleiner HF-Puls neben dem Label */}
      <Wave x={400} y={44} w={60} amp={14} cycles={4} color={C.yellow} />
      <Txt x={470} y={50} size={17}>
        {tr('HF-Puls', 'РЧ-импульс')}
      </Txt>
      {/* Output: aus der Röhre nach rechts */}
      <Arrow x1={330} y1={176} x2={588} y2={168} color={C.violet} width={5} head={18} />
      <Txt x={588} y={214} strong anchor="end" fill={C.violet}>
        {tr('Output:', 'Выход:')}
      </Txt>
      <Txt x={588} y={242} anchor="end" size={20} fill={C.violet}>
        {tr('FID-Signal', 'сигнал FID')}
      </Txt>
      <Wave x={300} y={370} w={200} amp={30} cycles={8} decay={3} color={C.green} />
      <Txt x={400} y={420} size={17} anchor="middle">
        {tr('FID: abklingendes Signal', 'FID: затухающий сигнал')}
      </Txt>
    </svg>
  );
}
