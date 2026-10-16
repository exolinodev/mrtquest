import type { ReactElement } from 'react';
import type { SequenceType } from '../physics/protocol';

/**
 * Schematisches Pulssequenzdiagramm (nicht maßstabsgetreu) mit den Zeilen
 * HF, Schicht-, Phasen- und Auslesegradient sowie Signal.
 */
const W = 680;
const ROW = 46;
const LEFT = 64;
const ROWS = ['HF', 'G_S', 'G_P', 'G_R', 'Signal'] as const;

function rowY(i: number) {
  return 20 + i * ROW + ROW / 2;
}

function sinc(x0: number, width: number, amp: number, y: number): string {
  let d = `M${x0 - width / 2},${y}`;
  for (let i = 0; i <= 40; i++) {
    const u = (i / 40) * 2 - 1;
    const arg = u * 3 * Math.PI;
    const v = Math.abs(arg) < 1e-6 ? 1 : Math.sin(arg) / arg;
    d += ` L${x0 + (u * width) / 2},${y - v * amp}`;
  }
  return d;
}

function trap(x0: number, width: number, amp: number, y: number, ramp = 5): string {
  return `M${x0},${y} L${x0 + ramp},${y - amp} L${x0 + width - ramp},${y - amp} L${x0 + width},${y} Z`;
}

function echo(x0: number, width: number, amp: number, y: number, decay = 1): string {
  let d = `M${x0 - width / 2},${y}`;
  for (let i = 0; i <= 60; i++) {
    const u = (i / 60) * 2 - 1;
    const env = Math.exp(-u * u * 4) * decay;
    d += ` L${x0 + (u * width) / 2},${y - Math.cos(u * 10 * Math.PI) * env * amp}`;
  }
  return d;
}

function fid(x0: number, width: number, amp: number, y: number): string {
  let d = `M${x0},${y}`;
  for (let i = 0; i <= 50; i++) {
    const u = i / 50;
    d += ` L${x0 + u * width},${y - Math.cos(u * 12 * Math.PI) * Math.exp(-u * 4) * amp}`;
  }
  return d;
}

function ladder(x0: number, width: number, y: number, amp = 14): ReactElement {
  // Phasenkodier-„Leiter“: Hüllkurve ±amp mit Zwischenstufen
  const levels = [-1, -0.6, -0.2, 0.2, 0.6, 1];
  return (
    <g>
      <path d={trap(x0, width, Math.abs(amp), y, 4)} className="pd-ladder-outline" />
      <path d={trap(x0, width, -Math.abs(amp), y, 4)} className="pd-ladder-outline" />
      {levels.map((l) => (
        <line key={l} x1={x0 + 4} x2={x0 + width - 4} y1={y - l * Math.abs(amp)} y2={y - l * Math.abs(amp)} className="pd-ladder" />
      ))}
    </g>
  );
}

interface Props {
  sequence: SequenceType;
  te: number;
  ti: number;
  etl: number;
  flip: number;
}

export function PulseDiagram({ sequence, te, ti, etl, flip }: Props) {
  const y = ROWS.map((_, i) => rowY(i));
  const els: ReactElement[] = [];
  const labels: Array<{ x: number; text: string; row: number }> = [];
  const spans: Array<{ x1: number; x2: number; text: string }> = [];

  const exc = (x: number, label: string, amp = 18) => {
    els.push(<path key={`rf${x}`} d={sinc(x, 34, amp, y[0])} className="pd-rf" />);
    els.push(<path key={`gs${x}`} d={trap(x - 22, 44, 12, y[1])} className="pd-grad" />);
    labels.push({ x, text: label, row: 0 });
  };

  if (sequence === 'SE' || sequence === 'TSE' || sequence === 'IR') {
    let t0 = LEFT + 40;
    if (sequence === 'IR') {
      exc(t0, '180° inv', 22);
      els.push(<path key="spoil" d={trap(t0 + 30, 30, 14, y[1])} className="pd-spoil" />);
      spans.push({ x1: t0, x2: t0 + 130, text: `TI = ${Math.round(ti)} ms` });
      t0 += 130;
    }
    exc(t0, '90°');
    els.push(<path key="reph" d={trap(t0 + 24, 20, -10, y[1])} className="pd-grad" />);
    const echoes = sequence === 'SE' ? 1 : Math.min(sequence === 'IR' ? 3 : 5, Math.max(2, etl));
    const esp = sequence === 'SE' ? 170 : sequence === 'IR' ? 120 : 92;
    els.push(<path key="pre" d={trap(t0 + 30, 26, 12, y[3])} className="pd-grad" />);
    for (let e = 0; e < echoes; e++) {
      const refoc = t0 + esp / 2 + e * esp;
      const ec = t0 + esp + e * esp;
      exc(refoc, '180°', 22);
      els.push(<g key={`pe${e}`}>{ladder(refoc + 22, 18, y[2])}</g>);
      if (sequence !== 'SE') els.push(<g key={`rw${e}`}>{ladder(ec + 28, 14, y[2], -10)}</g>);
      els.push(<path key={`ro${e}`} d={trap(ec - 26, 52, 10, y[3])} className="pd-grad" />);
      const eff = sequence === 'SE' ? 0 : Math.floor((echoes - 1) / 2);
      els.push(<path key={`sig${e}`} d={echo(ec, 50, 14, y[4], Math.exp(-e * 0.25))} className={e === eff ? 'pd-signal pd-eff' : 'pd-signal'} />);
    }
    els.push(<path key="fid" d={fid(t0 + 18, 40, 12, y[4])} className="pd-signal pd-faint" />);
    const effIdx = sequence === 'SE' ? 0 : Math.floor((echoes - 1) / 2);
    spans.push({ x1: t0, x2: t0 + esp + effIdx * esp, text: sequence === 'SE' ? `TE = ${Math.round(te)} ms` : `TE_eff = ${Math.round(te)} ms` });
    if (sequence !== 'SE') labels.push({ x: t0 + esp * (echoes + 0.3), text: `… ETL = ${etl}`, row: 4 });
  } else if (sequence === 'GRE') {
    const t0 = LEFT + 70;
    exc(t0, `α = ${flip}°`, 12);
    els.push(<path key="reph" d={trap(t0 + 24, 22, -10, y[1])} className="pd-grad" />);
    els.push(<g key="pe">{ladder(t0 + 26, 24, y[2])}</g>);
    els.push(<path key="pre" d={trap(t0 + 26, 28, -12, y[3])} className="pd-grad" />);
    const ec = t0 + 150;
    els.push(<path key="ro" d={trap(ec - 50, 100, 12, y[3])} className="pd-grad" />);
    els.push(<path key="sig" d={echo(ec, 80, 14, y[4])} className="pd-signal pd-eff" />);
    els.push(<path key="spoil" d={trap(ec + 60, 40, 14, y[1])} className="pd-spoil" />);
    spans.push({ x1: t0, x2: ec, text: `TE = ${te} ms` });
    labels.push({ x: ec + 80, text: 'Spoiler', row: 1 });
    exc(t0 + 360, `α`, 12);
  } else {
    const t0 = LEFT + 40;
    exc(t0, '90°');
    exc(t0 + 70, '180°', 22);
    let x = t0 + 110;
    const lobes = 9;
    const lw = 44;
    els.push(<path key="pre" d={trap(x - 30, 24, -10, y[3])} className="pd-grad" />);
    els.push(<path key="prep" d={trap(x - 30, 24, -10, y[2])} className="pd-grad" />);
    for (let i = 0; i < lobes; i++) {
      const sign = i % 2 === 0 ? 1 : -1;
      els.push(<path key={`ro${i}`} d={trap(x, lw, 12 * sign, y[3], 6)} className="pd-grad" />);
      if (i < lobes - 1) els.push(<path key={`bl${i}`} d={trap(x + lw - 4, 8, 7, y[2], 3)} className="pd-grad" />);
      const center = Math.floor(lobes / 2);
      els.push(<path key={`s${i}`} d={echo(x + lw / 2, lw - 6, 13, y[4], Math.exp(-Math.abs(i - center) * 0.18))} className={i === center ? 'pd-signal pd-eff' : 'pd-signal'} />);
      x += lw;
    }
    spans.push({ x1: t0, x2: t0 + 110 + lw * 4.5, text: `TE = ${te} ms (k-Raum-Zentrum)` });
    labels.push({ x: t0 + 110 + lw * 1.5, text: 'Blips', row: 2 });
  }

  const h = 20 + ROWS.length * ROW + 48;
  return (
    <svg viewBox={`0 0 ${W} ${h}`} className="pulse-diagram" role="img" aria-label={`Schematisches Pulssequenzdiagramm ${sequence}`}>
      {ROWS.map((r, i) => (
        <g key={r}>
          <line x1={LEFT - 6} x2={W - 6} y1={y[i]} y2={y[i]} className="pd-baseline" />
          <text x={8} y={y[i] + 4} className="pd-rowlabel">
            {r === 'G_S' ? 'G Schicht' : r === 'G_P' ? 'G Phase' : r === 'G_R' ? 'G Auslese' : r}
          </text>
        </g>
      ))}
      {els}
      {labels.map((l, i) => (
        <text key={i} x={l.x} y={y[l.row] - 24} className="pd-label" textAnchor="middle">
          {l.text}
        </text>
      ))}
      {spans.map((s, i) => (
        <g key={i}>
          <line x1={s.x1} x2={s.x2} y1={h - 10 - i * 18} y2={h - 10 - i * 18} className="pd-span" markerEnd="url(#pd-arrow)" markerStart="url(#pd-arrow)" />
          <text x={(s.x1 + s.x2) / 2} y={h - 15 - i * 18} className="pd-label" textAnchor="middle">
            {s.text}
          </text>
        </g>
      ))}
      <defs>
        <marker id="pd-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
        </marker>
      </defs>
    </svg>
  );
}
