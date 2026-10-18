import { useLang } from '../i18n/LanguageContext';

/** Same chapter navigation for learning modules and exam preparation. */
export function StudyContents({ items }: { items: Array<{ id: string; title: string }> }) {
  const { tr } = useLang();
  return (
    <nav className="toc" aria-label={tr('Inhaltsverzeichnis', 'Содержание')}>
      <strong>{tr('Inhalt', 'Содержание')}</strong>
      <ol>
        {items.map((item) => (
          <li key={item.id}>
            <a href={`#${item.id}`} onClick={(event) => {
              event.preventDefault();
              const section = document.getElementById(item.id);
              section?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
              section?.querySelector<HTMLElement>('h2, h3')?.focus({ preventScroll: true });
            }}>{item.title}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
