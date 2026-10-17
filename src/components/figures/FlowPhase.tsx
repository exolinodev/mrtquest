import { useLang } from '../../i18n/LanguageContext';
import { Arrow, C, Txt, polyPoints } from './shared';

/**
 * Phasenkontrast: Nach einem bipolaren Gradienten hat ruhendes Gewebe die Phase 0,
 * fließendes Blut eine Restphase proportional zur Geschwindigkeit.
 * Rechnung (normiert, Lobe-Dauer T = 1): φ(t) = γ ∫ G(t') x(t') dt' mit x = x₀ + v·t.
 */
export function FlowPhaseFigure() {
  const { tr } = useLang();
  const TX0 = 40;
  const TX1 = 360;
  const Tx = (t: number) => TX0 + (t / 2) * (TX1 - TX0); // t in 0..2
  const a = 0.8; // γ·G·x₀·T in rad (Ortsanteil, hebt sich auf)
  const c = 0.7; // γ·G·v·T² in rad für Geschwindigkeit v
  // analytisches Integral von g(t)·(x₀ + v t)
  const phase = (t: number, vMul: number) => {
    const pos = t < 1 ? -a * t : -a + a * (t - 1);
    const vel = t < 1 ? -(t * t) / 2 : -0.5 + (t * t - 1) / 2;
    return pos + vMul * c * vel;
  };
  const rows = [
    { v: 0, label: tr('Gewebe, v = 0', 'Ткань, v = 0'), color: C.green, end: '0' },
    { v: 1, label: tr('Blut, v', 'Кровь, v'), color: C.blue, end: 'Δφ' },
    { v: 2, label: tr('Blut, 2v', 'Кровь, 2v'), color: C.pink, end: '2Δφ' },
  ];
  const k = 22; // Einheiten pro rad
  const gBase = 88;
  const dialX = 488;
  const R = 34;
  return (
    <svg viewBox="0 0 600 505" role="img" aria-label={tr('Phase nach bipolarem Gradienten', 'Фаза после биполярного градиента')}>
      {/* Gradient */}
      <Txt x={TX0} y={30} strong>{tr('bipolarer Gradient G(t)', 'биполярный градиент G(t)')}</Txt>
      <line x1={TX0} y1={gBase} x2={TX1 + 10} y2={gBase} stroke="var(--muted)" strokeWidth={1.5} />
      <polyline
        fill={C.yellow}
        fillOpacity={0.2}
        stroke={C.yellow}
        strokeWidth={2.5}
        points={`${Tx(0)},${gBase} ${Tx(0)},${gBase + 28} ${Tx(1)},${gBase + 28} ${Tx(1)},${gBase - 28} ${Tx(2)},${gBase - 28} ${Tx(2)},${gBase}`}
      />
      <Txt x={Tx(0.5)} y={gBase + 22} anchor="middle" size={19} fill={C.yellow}>−G</Txt>
      <Txt x={Tx(1.5)} y={gBase - 8} anchor="middle" size={19} fill={C.yellow}>+G</Txt>
      {[1, 2].map((t) => (
        <line key={t} x1={Tx(t)} y1={gBase + 34} x2={Tx(t)} y2={470} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 6" />
      ))}
      <Txt x={TX0} y={142} size={19}>{tr('Phase φ(t)', 'Фаза φ(t)')}</Txt>
      <Txt x={dialX} y={142} anchor="middle" size={19}>{tr('am Ende', 'в конце')}</Txt>

      {rows.map((r, i) => {
        const top = 184 + i * 100;
        const yb = top + 46;
        const phiEnd = phase(2, r.v);
        const tipX = dialX + (R - 4) * Math.sin(phiEnd);
        const tipY = yb - (R - 4) * Math.cos(phiEnd);
        const arcR = R - 12;
        return (
          <g key={r.v}>
            <Txt x={TX0} y={top} strong size={21} fill={r.color}>{r.label}</Txt>
            <line x1={TX0} y1={yb} x2={TX1} y2={yb} stroke="var(--muted)" strokeWidth={1} strokeDasharray="4 5" />
            <polyline fill="none" stroke={r.color} strokeWidth={3} points={polyPoints(120, (j) => {
              const t = (j / 120) * 2;
              return [Tx(t), yb - k * phase(t, r.v)];
            })} />
            <circle cx={Tx(2)} cy={yb - k * phiEnd} r={5} fill={r.color} />
            <Arrow x1={TX1 + 14} y1={yb} x2={dialX - R - 10} y2={yb} color="var(--muted)" width={1.5} head={9} />

            {/* Zeiger */}
            <circle cx={dialX} cy={yb} r={R} fill="var(--surface-2)" stroke="var(--muted)" strokeWidth={1.5} />
            <line x1={dialX} y1={yb} x2={dialX} y2={yb - R} stroke="var(--text-dim)" strokeWidth={1.5} strokeDasharray="3 4" />
            {phiEnd > 0.01 && (
              <path
                d={`M ${dialX} ${yb - arcR} A ${arcR} ${arcR} 0 0 1 ${dialX + arcR * Math.sin(phiEnd)} ${yb - arcR * Math.cos(phiEnd)}`}
                fill="none"
                stroke={C.yellow}
                strokeWidth={3}
              />
            )}
            <Arrow x1={dialX} y1={yb} x2={tipX} y2={tipY} color={r.color} width={4} head={13} />
            <circle cx={dialX} cy={yb} r={3.5} fill="var(--text)" />
            <Txt x={dialX + R + 8} y={yb + 7} strong size={21} fill={r.color}>{r.end}</Txt>
          </g>
        );
      })}
      <Txt x={300} y={497} strong anchor="middle" fill={C.yellow}>{tr('Restphase Δφ ∝ v', 'Остаточная фаза Δφ ∝ v')}</Txt>
    </svg>
  );
}
