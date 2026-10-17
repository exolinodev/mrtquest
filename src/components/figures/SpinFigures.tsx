import { useLang } from '../../i18n/LanguageContext';
import { Arrow, C, Txt, polyPoints, useAnimTime } from './shared';

/* ------------------------------------------------------------------ spins-field */

function Proton({ x, y, angleDeg }: { x: number; y: number; angleDeg: number }) {
  // 0° = nach oben, im Uhrzeigersinn
  const a = (angleDeg * Math.PI) / 180;
  const ux = Math.sin(a);
  const uy = -Math.cos(a);
  return (
    <g>
      <circle cx={x} cy={y} r={15} fill={C.pink} opacity={0.9} />
      <Arrow x1={x - ux * 24} y1={y - uy * 24} x2={x + ux * 38} y2={y + uy * 38} color={C.blue} width={3.5} />
    </g>
  );
}

/** Protonen ohne Feld (zufällig, Summe 0) und mit B₀ (minimaler Überschuss parallel, M₀). */
export function SpinsFieldFigure() {
  const { tr } = useLang();
  // neun gleichmäßig verteilte Richtungen, gemischt angeordnet: Vektorsumme exakt 0
  const chaos = [0, 200, 80, 280, 160, 40, 320, 120, 240];
  // fünf parallel, vier antiparallel, leicht geneigt (sie präzedieren mit zufälliger Phase)
  const aligned = [10, 172, -14, 190, 6, 166, -8, 186, 16];
  const xsL = [70, 150, 230];
  const xsR = [385, 450, 515];
  const ys = [100, 190, 280];
  return (
    <svg viewBox="0 0 600 380" role="img" aria-label={tr('Protonen ohne und mit Magnetfeld', 'Протоны без поля и в поле')}>
      <line x1={300} y1={20} x2={300} y2={360} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="4 6" />
      <Txt x={150} y={36} strong anchor="middle">{tr('Ohne Feld', 'Без поля')}</Txt>
      <Txt x={450} y={36} strong anchor="middle">{tr('Mit B₀', 'В поле B₀')}</Txt>

      {chaos.map((a, i) => (
        <Proton key={`c${i}`} x={xsL[i % 3]} y={ys[Math.floor(i / 3)]} angleDeg={a} />
      ))}
      <Txt x={150} y={352} strong anchor="middle">Σ = 0</Txt>

      <Arrow x1={330} y1={330} x2={330} y2={62} color="var(--text-dim)" width={3} />
      <Txt x={342} y={78} strong>B₀</Txt>
      {aligned.map((a, i) => (
        <Proton key={`a${i}`} x={xsR[i % 3]} y={ys[Math.floor(i / 3)]} angleDeg={a} />
      ))}
      <Arrow x1={570} y1={290} x2={570} y2={110} color={C.green} width={10} head={26} />
      <Txt x={570} y={96} strong anchor="middle" fill={C.green}>M₀</Txt>
      <Txt x={450} y={340} strong anchor="middle">{tr('5 ↑ : 4 ↓', '5 ↑ : 4 ↓')}</Txt>
      <Txt x={450} y={368} anchor="middle" size={19}>{tr('Überschuss stark übertrieben', 'избыток сильно преувеличен')}</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ precession */

/** Magnetisches Moment präzediert auf einem Kegel um B₀. */
export function PrecessionFigure() {
  const { tr } = useLang();
  const { t } = useAnimTime();
  const ox = 170;
  const oy = 320;
  const cx = 170;
  const cy = 130;
  const rx = 95;
  const ry = 28;
  // Umlauf im Uhrzeigersinn von oben gesehen (Proton, γ > 0); 4 s pro Umlauf zur Anschauung
  const th = 0.5 + (2 * Math.PI * t) / 4;
  const tipX = cx + rx * Math.cos(th);
  const tipY = cy + ry * Math.sin(th);
  const front = Math.sin(th) > 0;
  return (
    <svg viewBox="0 0 600 370" role="img" aria-label={tr('Präzession um B₀', 'Прецессия вокруг B₀')}>
      <Arrow x1={ox} y1={oy + 20} x2={ox} y2={36} color="var(--text-dim)" width={3} />
      <Txt x={ox + 14} y={50} strong>B₀</Txt>
      <line x1={ox} y1={oy} x2={cx - rx} y2={cy} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="5 6" />
      <line x1={ox} y1={oy} x2={cx + rx} y2={cy} stroke="var(--muted)" strokeWidth={1.5} strokeDasharray="5 6" />
      {/* hintere Hälfte der Kreisbahn */}
      <path d={`M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`} fill="none" stroke={C.violet} strokeWidth={2} strokeDasharray="5 6" opacity={0.7} />
      {!front && <Arrow x1={ox} y1={oy} x2={tipX} y2={tipY} color={C.blue} width={5} head={20} />}
      {/* vordere Hälfte */}
      <path d={`M ${cx + rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx - rx} ${cy}`} fill="none" stroke={C.violet} strokeWidth={2.5} />
      <Arrow x1={cx + 14} y1={cy + ry} x2={cx - 10} y2={cy + ry} color={C.violet} width={2.5} head={14} />
      {front && <Arrow x1={ox} y1={oy} x2={tipX} y2={tipY} color={C.blue} width={5} head={20} />}
      <circle cx={ox} cy={oy} r={13} fill={C.pink} />
      <Txt x={tipX + (Math.cos(th) >= 0 ? 16 : -16)} y={tipY - 12} strong anchor={Math.cos(th) >= 0 ? 'start' : 'end'} fill={C.blue}>μ</Txt>

      <Txt x={330} y={80} strong>{tr('Präzession', 'Прецессия')}</Txt>
      <Txt x={330} y={140}>{tr('Larmor-Frequenz', 'Ларморова частота')}</Txt>
      <Txt x={330} y={186} strong size={32} fill={C.yellow}>
        f₀ = <tspan style={{ textDecoration: 'overline' }}>γ</tspan> · B₀
      </Txt>
      <Txt x={330} y={232}>
        <tspan style={{ textDecoration: 'overline' }}>γ</tspan> = 42,57 {tr('MHz/T', 'МГц/Тл')}
      </Txt>
      <Txt x={330} y={276}>{tr('1,5 T → 63,9 MHz', '1,5 Тл → 63,9 МГц')}</Txt>
      <Txt x={330} y={310}>{tr('3 T → 127,7 MHz', '3 Тл → 127,7 МГц')}</Txt>
    </svg>
  );
}

/* ------------------------------------------------------------------ rf-pulse */

function Axes({ cx, oy }: { cx: number; oy: number }) {
  const col = 'var(--muted)';
  return (
    <g>
      <Arrow x1={cx} y1={oy} x2={cx} y2={oy - 120} color={col} width={2} head={10} />
      <Arrow x1={cx} y1={oy} x2={cx + 85} y2={oy} color={col} width={2} head={10} />
      <Arrow x1={cx} y1={oy} x2={cx - 52} y2={oy + 34} color={col} width={2} head={10} />
      <Txt x={cx + 9} y={oy - 108} size={19}>z</Txt>
      <Txt x={cx + 84} y={oy - 10} size={19}>y</Txt>
      <Txt x={cx - 58} y={oy + 30} size={19} anchor="end">x</Txt>
    </g>
  );
}

/** Drei Schritte: M entlang z, 90°-HF-Puls kippt M, kreisende Quermagnetisierung sendet den FID. */
export function RfPulseFigure() {
  const { tr } = useLang();
  const { t } = useAnimTime();
  const oy = 185;
  const p = [100, 300, 500];
  const phi = 0.9 + (2 * Math.PI * t) / 3;
  const mx = p[2] + 58 * Math.cos(phi);
  const my = oy + 24 * Math.sin(phi);
  const base = 345;
  return (
    <svg viewBox="0 0 600 400" role="img" aria-label={tr('HF-Puls kippt die Magnetisierung', 'РЧ-импульс опрокидывает намагниченность')}>
      <line x1={200} y1={20} x2={200} y2={390} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 6" />
      <line x1={400} y1={20} x2={400} y2={390} stroke="var(--muted)" strokeWidth={1} strokeDasharray="3 6" />
      <Txt x={p[0]} y={34} strong anchor="middle">{tr('1 · Ruhe', '1 · Покой')}</Txt>
      <Txt x={p[1]} y={34} strong anchor="middle">{tr('2 · HF-Puls', '2 · РЧ-импульс')}</Txt>
      <Txt x={p[2]} y={34} strong anchor="middle">{tr('3 · Signal', '3 · Сигнал')}</Txt>

      {/* Schritt 1 */}
      <Axes cx={p[0]} oy={oy} />
      <Arrow x1={p[0]} y1={oy} x2={p[0]} y2={oy - 96} color={C.green} width={6} head={20} />
      <Txt x={p[0] - 12} y={oy - 62} strong anchor="end" fill={C.green}>M₀</Txt>

      {/* Schritt 2 */}
      <Axes cx={p[1]} oy={oy} />
      <path d={`M ${p[1]} ${oy - 96} A 74 96 0 0 1 ${p[1] + 74} ${oy - 6}`} fill="none" stroke={C.yellow} strokeWidth={2.5} strokeDasharray="6 5" />
      <Arrow x1={p[1] + 72} y1={oy - 24} x2={p[1] + 74} y2={oy - 6} color={C.yellow} width={2.5} head={13} />
      <Txt x={p[1] + 44} y={oy - 76} strong fill={C.yellow}>90°</Txt>
      <Arrow x1={p[1]} y1={oy} x2={p[1] + 74} y2={oy} color={C.green} width={6} head={20} />
      <Txt x={p[1] + 40} y={oy + 30} strong anchor="middle" fill={C.green}>M</Txt>

      {/* Schritt 3 */}
      <Axes cx={p[2]} oy={oy} />
      <ellipse cx={p[2]} cy={oy} rx={58} ry={24} fill="none" stroke={C.violet} strokeWidth={2} strokeDasharray="5 5" />
      <Arrow x1={p[2] + 12} y1={oy + 24} x2={p[2] - 10} y2={oy + 24} color={C.violet} width={2.5} head={13} />
      <Arrow x1={p[2]} y1={oy} x2={mx} y2={my} color={C.green} width={6} head={20} />
      <text x={p[2] - 14} y={oy - 62} textAnchor="end" className="fig-label-strong" style={{ fontSize: 23, fill: C.green }}>
        M<tspan dy={6} style={{ fontSize: 16 }}>xy</tspan>
      </text>

      {/* Zeitachse */}
      <Arrow x1={14} y1={base} x2={592} y2={base} color="var(--muted)" width={1.5} head={10} />
      <Txt x={590} y={base + 26} size={19} anchor="end">t</Txt>
      <line x1={24} y1={base} x2={190} y2={base} stroke={C.blue} strokeWidth={2.5} />
      <Txt x={p[0]} y={base - 50} anchor="middle" size={19}>{tr('kein Signal', 'нет сигнала')}</Txt>
      <polyline
        fill="none"
        stroke={C.pink}
        strokeWidth={2.5}
        points={polyPoints(160, (i) => {
          const x = 220 + i;
          return [x, base - 26 * Math.sin((2 * Math.PI * i) / 20)];
        })}
      />
      <Txt x={p[1]} y={base - 50} anchor="middle" size={19} fill={C.pink}>{tr('B₁ bei f₀', 'B₁ на f₀')}</Txt>
      <polyline
        fill="none"
        stroke={C.blue}
        strokeWidth={2.5}
        points={polyPoints(176, (i) => {
          const x = 410 + i;
          return [x, base - 40 * Math.exp(-i / 55) * Math.cos((2 * Math.PI * i) / 18)];
        })}
      />
      <Txt x={p[2] + 30} y={base - 50} anchor="middle" size={19} fill={C.blue}>FID</Txt>
    </svg>
  );
}
