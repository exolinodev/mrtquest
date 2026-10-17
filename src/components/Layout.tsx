import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { MODULES } from '../content/modules';
import { BADGES } from '../game/badges';
import { useGame } from '../game/GameContext';
import { levelProgress } from '../game/levels';
import { numberLocale, type Lang } from '../i18n/format';
import { useLang } from '../i18n/LanguageContext';
import { Link } from './router';
import { ProgressBar } from './ui';

function NavItem({ to, active, icon, label, sub }: { to: string; active: boolean; icon: string; label: string; sub?: ReactNode }) {
  return (
    <Link to={to} className={`nav-item${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined}>
      <span className="nav-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="nav-text">
        <span>{label}</span>
        {sub && <span className="nav-sub">{sub}</span>}
      </span>
    </Link>
  );
}

const LANG_OPTIONS: Array<{ value: Lang; flag: string; short: string; name: string }> = [
  { value: 'de', flag: '🇨🇭', short: 'DE', name: 'Deutsch' },
  { value: 'ru', flag: '🇺🇦', short: 'РУС', name: 'Русский' },
];

/** Sprachumschalter: ein Klick wechselt sofort, ohne Neuladen (Tastatur: Alt+L). */
export function LanguageToggle() {
  const { lang, setLang, tr } = useLang();
  return (
    <div className="lang-toggle" role="group" aria-label={tr('Sprache wählen (Alt+L)', 'Выбор языка (Alt+L)')} title={tr('Sprache wechseln – Tastenkürzel Alt+L', 'Сменить язык – сочетание клавиш Alt+L')}>
      {LANG_OPTIONS.map((o) => (
        <button key={o.value} type="button" lang={o.value} aria-pressed={lang === o.value} aria-label={o.name} className={lang === o.value ? 'active' : ''} onClick={() => setLang(o.value)}>
          <span aria-hidden="true">{o.flag}</span> {o.short}
        </button>
      ))}
    </div>
  );
}

export function Layout({ route, children }: { route: string[]; children: ReactNode }) {
  const { state } = useGame();
  const { lang, tr, loc } = useLang();
  const lp = levelProgress(state.xp, lang);
  const [open, setOpen] = useState(false);
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 900px)').matches);
  const sidebarRef = useRef<HTMLElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const resize = () => {
      setMobile(media.matches);
      setOpen(false);
    };
    media.addEventListener('change', resize);
    return () => media.removeEventListener('change', resize);
  }, []);
  useLayoutEffect(() => {
    if (sidebarRef.current) sidebarRef.current.inert = mobile && !open;
    if (mainRef.current) mainRef.current.inert = mobile && open;
    if (!mobile || !open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
      }
      if (event.key !== 'Tab') return;
      const targets = sidebarRef.current?.querySelectorAll<HTMLElement>('a[href], button');
      if (!targets?.length) return;
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
      if (mainRef.current) mainRef.current.inert = false;
      menuRef.current?.focus();
    };
  }, [mobile, open]);
  const section = route[0] ?? '';
  const badgeCount = Object.keys(state.badges).length;
  const nf = (v: number) => v.toLocaleString(numberLocale(lang));

  return (
    <div className={`app-shell${open ? ' nav-open' : ''}`}>
      <aside
        id="main-navigation"
        ref={sidebarRef}
        className="sidebar"
        role={mobile && open ? 'dialog' : undefined}
        aria-modal={mobile && open ? true : undefined}
        aria-label={tr('Hauptnavigation', 'Главная навигация')}
        aria-hidden={mobile && !open ? true : undefined}
        onClick={(e) => {
          if ((e.target as Element).closest('a[href]')) setOpen(false);
        }}
      >
        <div className="sidebar-heading">
          <button ref={closeRef} className="nav-close" type="button" aria-label={tr('Navigation schließen', 'Закрыть навигацию')} onClick={() => setOpen(false)}>
            ×
          </button>
          <Link to="/" className="brand">
            <span className="brand-logo" aria-hidden="true">
              <svg viewBox="0 0 64 64" width="34" height="34">
                <circle cx="32" cy="32" r="20" fill="none" stroke="#38bdf8" strokeWidth="5" />
                <circle cx="32" cy="32" r="9" fill="#a78bfa" />
                <path d="M32 32 L46 14" stroke="#f472b6" strokeWidth="4" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <strong>MRT-Quest</strong>
              <small>{tr('Physik & Gerätetechnik', 'Физика и оборудование')}</small>
            </span>
          </Link>
        </div>
        <nav aria-label={tr('Hauptnavigation', 'Главная навигация')}>
          <NavItem to="/" active={section === ''} icon="🏠" label={tr('Übersicht', 'Обзор')} />
          <div className="nav-group">{tr('Lernmodule', 'Учебные модули')}</div>
          {MODULES.map((m) => {
            const best = state.modules[m.id]?.bestScore ?? 0;
            return (
              <NavItem
                key={m.id}
                to={`/modul/${m.id}`}
                active={section === 'modul' && route[1] === m.id}
                icon={m.icon}
                label={`${m.index}. ${loc(m.title)}`}
                sub={best > 0 ? `${tr('Bestwert', 'Лучший результат')} ${Math.round(best * 100)} %` : undefined}
              />
            );
          })}
          <div className="nav-group">{tr('Praxis', 'Практика')}</div>
          <NavItem to="/klinik" active={section === 'klinik'} icon="🩺" label={tr('Klinische Fälle', 'Клинические случаи')} sub={tr('Protokoll-Trade-offs', 'Компромиссы протоколов')} />
          <NavItem to="/labor" active={section === 'labor'} icon="🔬" label={tr('Simulator-Labor', 'Лаборатория симуляторов')} sub={tr('Alle Simulatoren', 'Все симуляторы')} />
          <NavItem to="/pruefung" active={section === 'pruefung'} icon="🎓" label={tr('Abschlussprüfung', 'Итоговый экзамен')} />
          <NavItem
            to="/profil"
            active={section === 'profil'}
            icon="🏅"
            label={tr('Profil & Abzeichen', 'Профиль и награды')}
            sub={`${badgeCount}/${BADGES.length} ${tr('Abzeichen', 'наград')}`}
          />
        </nav>
      </aside>
      <div className="main-col" ref={mainRef}>
        <header className="topbar">
          <button ref={menuRef} className="menu-btn" type="button" aria-label={tr('Navigation öffnen', 'Открыть навигацию')} aria-controls="main-navigation" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            ☰
          </button>
          <Link to="/profil" className="level-chip" title={tr('Zum Profil', 'К профилю')}>
            <span className="level-badge">{tr('Lv', 'Ур.')} {lp.level}</span>
            <span className="level-info">
              <span className="level-title">{lp.title}</span>
              <ProgressBar value={lp.ratio} label={tr('Fortschritt zum nächsten Level', 'Прогресс до следующего уровня')} />
              <span className="level-xp">
                {nf(lp.current)} / {nf(lp.needed)} XP
              </span>
            </span>
          </Link>
          <div className="topbar-stats">
            <span title={tr('Gesamt-XP', 'Всего XP')}>✨ {nf(state.xp)} XP</span>
            <span title={tr('Aktuelle Serie richtiger Antworten', 'Текущая серия правильных ответов')}>🔥 {state.stats.streak}</span>
            <span title={tr('Abzeichen', 'Награды')}>🏅 {badgeCount}</span>
          </div>
          <LanguageToggle />
        </header>
        <main className="content" id="main">
          {children}
        </main>
        <footer className="footer">
          {tr(
            'MRT-Quest · Lernsoftware für Medizininformatik · Werte didaktisch vereinfacht, kein Medizinprodukt · Fortschritt wird lokal im Browser gespeichert',
            'MRT-Quest · учебная программа по медицинской информатике · значения дидактически упрощены, не является медицинским изделием · прогресс сохраняется локально в браузере',
          )}
        </footer>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </div>
  );
}

export function ToastStack() {
  const { toasts, dismissToast } = useGame();
  const { tr } = useLang();
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.slice(0, 1).map((t) => (
        <button key={t.id} type="button" className={`toast toast-${t.kind}`} aria-label={`${tr('Meldung schließen', 'Закрыть уведомление')}: ${t.title}`} onClick={() => dismissToast(t.id)}>
          <span className="toast-icon" aria-hidden="true">
            {t.icon ?? '✨'}
          </span>
          <span>
            <strong>{t.title}</strong>
            {t.detail && <small>{t.detail}</small>}
            {toasts.length > 1 && <small className="toast-queue-count">{tr(toasts.length === 2 ? 'Eine weitere Meldung folgt' : `Noch ${toasts.length - 1} Meldungen`, `В очереди: ${toasts.length - 1}`)}</small>}
          </span>
        </button>
      ))}
    </div>
  );
}
