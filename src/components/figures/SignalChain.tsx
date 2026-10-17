import { useLang } from '../../i18n/LanguageContext';
import { ArrowDefs, C, FS } from './figB-util';

const H = 70; // Boxhöhe
const ROW = [0, 104, 208, 312, 416, 520].map((y) => y + 4);

interface BoxProps {
  x: number;
  y: number;
  w: number;
  title: string;
  sub: string;
  color: string;
  dashed?: boolean;
}

/** Text, der bei Bedarf auf die Boxbreite gestaucht wird. */
function FitText({ x, y, text, max, size, strong }: { x: number; y: number; text: string; max: number; size: number; strong?: boolean }) {
  const estimate = text.length * size * (strong ? 0.58 : 0.5);
  return (
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className={strong ? 'fig-label-strong' : 'fig-label'}
      style={{ fontSize: size }}
      {...(estimate > max ? { textLength: max, lengthAdjust: 'spacingAndGlyphs' } : {})}
    >
      {text}
    </text>
  );
}

function Box({ x, y, w, title, sub, color, dashed }: BoxProps) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={H} rx="10" fill="var(--surface-2)" stroke={color} strokeWidth="2" strokeDasharray={dashed ? '6 4' : undefined} />
      <FitText x={x + w / 2} y={y + 29} text={title} max={w - 14} size={FS.strong} strong />
      <FitText x={x + w / 2} y={y + 56} text={sub} max={w - 14} size={FS.small} />
    </g>
  );
}

/** Blockschema eines MRT-Geräts: Steuerung, Sendeseite, Patient, Empfangskette bis zum Bild. */
export function SignalChain() {
  const { tr } = useLang();
  const a = 'url(#sc-arrow)';
  const arrow = (x1: number, y1: number, x2: number, y2: number, dashed = false) => (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--muted)" strokeWidth="2.2" strokeDasharray={dashed ? '6 5' : undefined} markerEnd={a} />
  );
  const w3 = 164;
  const xs3 = [8, 188, 368];
  const w2 = 228;
  const xl = 8;
  const xr = 292;
  return (
    <svg viewBox="0 0 540 600" role="img" aria-label={tr('Blockschema der Signalkette', 'Блок-схема сигнальной цепи')}>
      <ArrowDefs id="sc-arrow" />
      <Box x={8} y={ROW[0]} w={524} title={tr('Steuerung (Sequenzrechner)', 'Управление (компьютер)')} sub={tr('spielt die Sequenz ab', 'запускает последовательность')} color={C.violet} dashed />

      <Box x={xs3[0]} y={ROW[1]} w={w3} title={tr('Magnet B₀', 'Магнит B₀')} sub={tr('richtet Spins aus', 'ориентирует спины')} color={C.blue} />
      <Box x={xs3[1]} y={ROW[1]} w={w3} title={tr('Gradienten', 'Градиенты')} sub={tr('kodieren den Ort', 'кодируют место')} color={C.blue} />
      <Box x={xs3[2]} y={ROW[1]} w={w3} title={tr('HF-Sender', 'РЧ-передатчик')} sub={tr('regt Spins an', 'возбуждает спины')} color={C.blue} />
      {arrow(xs3[1] + w3 / 2, ROW[0] + H, xs3[1] + w3 / 2, ROW[1] - 2, true)}
      {arrow(xs3[2] + w3 / 2, ROW[0] + H, xs3[2] + w3 / 2, ROW[1] - 2, true)}

      <Box x={140} y={ROW[2]} w={260} title={tr('Patient', 'Пациент')} sub={tr('Spins senden Signal', 'спины излучают сигнал')} color={C.pink} />
      {xs3.map((x, i) => arrow(x + w3 / 2, ROW[1] + H, 270 + (i - 1) * 70, ROW[2] - 2))}

      <Box x={xl} y={ROW[3]} w={w2} title={tr('Empfangsspule', 'Приёмная катушка')} sub={tr('fängt µV-Signal auf', 'ловит сигнал в мкВ')} color={C.green} />
      <Box x={xr} y={ROW[3]} w={w2} title={tr('Vorverstärker', 'Предусилитель')} sub={tr('verstärkt rauscharm', 'усиливает без шума')} color={C.green} />
      {arrow(220, ROW[2] + H, xl + w2 / 2, ROW[3] - 2)}
      {arrow(xl + w2, ROW[3] + H / 2, xr - 2, ROW[3] + H / 2)}

      <Box x={xr} y={ROW[4]} w={w2} title={tr('ADC', 'АЦП')} sub={tr('digitalisiert I und Q', 'оцифровывает I и Q')} color={C.yellow} />
      <Box x={xl} y={ROW[4]} w={w2} title={tr('Rechner (FFT)', 'Компьютер (БПФ)')} sub={tr('k-Raum → Bild', 'k-простр. → изображение')} color={C.yellow} />
      {arrow(xr + w2 / 2, ROW[3] + H, xr + w2 / 2, ROW[4] - 2)}
      {arrow(xr, ROW[4] + H / 2, xl + w2 + 2, ROW[4] + H / 2)}
      {/* Takt der Steuerung für den ADC */}
      <path d={`M532,${ROW[0] + H / 2} H536 V${ROW[4] + H / 2}`} fill="none" stroke="var(--muted)" strokeWidth="2.2" strokeDasharray="6 5" />
      {arrow(536, ROW[4] + H / 2, xr + w2 + 2, ROW[4] + H / 2, true)}

      <Box x={xl} y={ROW[5]} w={w2} title={tr('Bild', 'Изображение')} sub={tr('Graustufen', 'оттенки серого')} color="var(--text-dim)" />
      {arrow(xl + w2 / 2, ROW[4] + H, xl + w2 / 2, ROW[5] - 2)}
      <line x1={xr + 10} y1={ROW[5] + 36} x2={xr + 60} y2={ROW[5] + 36} stroke="var(--muted)" strokeWidth="2.2" strokeDasharray="6 5" />
      <text x={xr + 70} y={ROW[5] + 43} className="fig-label" style={{ fontSize: FS.small }}>
        {tr('Steuersignal', 'управление')}
      </text>
    </svg>
  );
}
