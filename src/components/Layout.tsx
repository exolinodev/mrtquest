import { useState, type ReactNode } from 'react';
import { MODULES } from '../content/modules';
import { BADGES } from '../game/badges';
import { useGame } from '../game/GameContext';
import { levelProgress } from '../game/levels';
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

export function Layout({ route, children }: { route: string[]; children: ReactNode }) {
  const { state } = useGame();
  const lp = levelProgress(state.xp);
  const [open, setOpen] = useState(false);
  const section = route[0] ?? '';
  const badgeCount = Object.keys(state.badges).length;

  return (
    <div className={`app-shell${open ? ' nav-open' : ''}`}>
      <aside className="sidebar" onClick={() => setOpen(false)}>
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
            <small>Physik & Gerätetechnik</small>
          </span>
        </Link>
        <nav aria-label="Hauptnavigation">
          <NavItem to="/" active={section === ''} icon="🏠" label="Übersicht" />
          <div className="nav-group">Lernmodule</div>
          {MODULES.map((m) => {
            const best = state.modules[m.id]?.bestScore ?? 0;
            return (
              <NavItem
                key={m.id}
                to={`/modul/${m.id}`}
                active={section === 'modul' && route[1] === m.id}
                icon={m.icon}
                label={`${m.index}. ${m.title}`}
                sub={best > 0 ? `Bestwert ${Math.round(best * 100)} %` : undefined}
              />
            );
          })}
          <div className="nav-group">Praxis</div>
          <NavItem to="/klinik" active={section === 'klinik'} icon="🩺" label="Klinische Fälle" sub="Protokoll-Trade-offs" />
          <NavItem to="/labor" active={section === 'labor'} icon="🔬" label="Simulator-Labor" sub="Alle Simulatoren" />
          <NavItem to="/pruefung" active={section === 'pruefung'} icon="🎓" label="Abschlussprüfung" />
          <NavItem to="/profil" active={section === 'profil'} icon="🏅" label="Profil & Abzeichen" sub={`${badgeCount}/${BADGES.length} Abzeichen`} />
        </nav>
      </aside>
      <div className="main-col">
        <header className="topbar">
          <button className="menu-btn" type="button" aria-label="Navigation öffnen" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            ☰
          </button>
          <Link to="/profil" className="level-chip" title="Zum Profil">
            <span className="level-badge">Lv {lp.level}</span>
            <span className="level-info">
              <span className="level-title">{lp.title}</span>
              <ProgressBar value={lp.ratio} label="Fortschritt zum nächsten Level" />
              <span className="level-xp">
                {lp.current.toLocaleString('de-DE')} / {lp.needed.toLocaleString('de-DE')} XP
              </span>
            </span>
          </Link>
          <div className="topbar-stats">
            <span title="Gesamt-XP">✨ {state.xp.toLocaleString('de-DE')} XP</span>
            <span title="Aktuelle Serie richtiger Antworten">🔥 {state.stats.streak}</span>
            <span title="Abzeichen">🏅 {badgeCount}</span>
          </div>
        </header>
        <main className="content" id="main">
          {children}
        </main>
        <footer className="footer">
          MRT-Quest · Lernsoftware für Medizininformatik · Werte didaktisch vereinfacht, kein Medizinprodukt · Fortschritt wird lokal im Browser gespeichert
        </footer>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
    </div>
  );
}

export function ToastStack() {
  const { toasts, dismissToast } = useGame();
  return (
    <div className="toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <button key={t.id} type="button" className={`toast toast-${t.kind}`} onClick={() => dismissToast(t.id)}>
          <span className="toast-icon" aria-hidden="true">
            {t.icon ?? '✨'}
          </span>
          <span>
            <strong>{t.title}</strong>
            {t.detail && <small>{t.detail}</small>}
          </span>
        </button>
      ))}
    </div>
  );
}
