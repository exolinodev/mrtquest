import { useId, type ReactNode } from 'react';
import { numberLocale } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';
import { RichText } from './RichText';

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  format?: (v: number) => string;
  hint?: string;
  disabled?: boolean;
}

export function Slider({ label, value, min, max, step = 1, unit, onChange, format, hint, disabled }: SliderProps) {
  const id = useId();
  return (
    <div className={`slider${disabled ? ' is-disabled' : ''}`}>
      <div className="slider-head">
        <label htmlFor={id}>{label}</label>
        <output htmlFor={id}>
          {format ? format(value) : value.toLocaleString(numberLocale())}
          {unit && <span className="unit"> {unit}</span>}
        </output>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} disabled={disabled} onChange={(e) => onChange(Number(e.target.value))} />
      {hint && <p className="slider-hint">{hint}</p>}
    </div>
  );
}

interface SegmentedProps<T extends string | number> {
  label?: string;
  value: T;
  options: Array<{ value: T; label: string; disabled?: boolean }>;
  onChange: (v: T) => void;
}

export function Segmented<T extends string | number>({ label, value, options, onChange }: SegmentedProps<T>) {
  return (
    <div className="segmented-wrap">
      {label && <span className="segmented-label">{label}</span>}
      <div className="segmented" role="radiogroup" aria-label={label}>
        {options.map((o) => (
          <button
            key={String(o.value)}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            className={o.value === value ? 'active' : ''}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Toggle({ label, checked, onChange, disabled }: { label: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label className={`toggle${disabled ? ' is-disabled' : ''}`}>
      <input type="checkbox" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} />
      <span className="toggle-track" aria-hidden="true">
        <span className="toggle-thumb" />
      </span>
      <span>{label}</span>
    </label>
  );
}

export function Stat({ label, value, unit, tone, sub }: { label: string; value: ReactNode; unit?: string; tone?: 'good' | 'warn' | 'bad'; sub?: ReactNode }) {
  return (
    <div className={`stat${tone ? ` tone-${tone}` : ''}`}>
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {value}
        {unit && <span className="unit"> {unit}</span>}
      </span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  );
}

export function Panel({ title, children, actions, className = '' }: { title?: ReactNode; children: ReactNode; actions?: ReactNode; className?: string }) {
  return (
    <section className={`panel ${className}`}>
      {(title || actions) && (
        <header className="panel-head">
          {title && <h3>{title}</h3>}
          {actions}
        </header>
      )}
      {children}
    </section>
  );
}

export function Callout({ variant, title, text }: { variant: 'merke' | 'klinik' | 'vertiefung' | 'achtung' | 'info'; title: string; text: string }) {
  const icon = { merke: '💡', klinik: '🩺', vertiefung: '🔬', achtung: '⚠️', info: 'ℹ️' }[variant];
  return (
    <aside className={`callout callout-${variant}`}>
      <strong>
        {icon} {title}
      </strong>
      <p>
        <RichText text={text} />
      </p>
    </aside>
  );
}

export function ProgressBar({ value, label, color }: { value: number; label?: string; color?: string }) {
  const pct = Math.round(Math.max(0, Math.min(1, value)) * 100);
  return (
    <div className="progress" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="progress-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export function Stars({ count, max = 3 }: { count: number; max?: number }) {
  const { tr } = useLang();
  return (
    <span className="stars" aria-label={tr(`${count} von ${max} Sternen`, `${count} з ${max} зірок`)}>
      {Array.from({ length: max }, (_, i) => (
        <span key={i} className={i < count ? 'star on' : 'star'}>
          ★
        </span>
      ))}
    </span>
  );
}
