import { useEffect, useState, type AnchorHTMLAttributes, type ReactNode } from 'react';

/** Minimaler Hash-Router: funktioniert ohne Server-Konfiguration (auch per file:// bzw. statischem Hosting). */
function currentPath(): string {
  const hash = window.location.hash.replace(/^#/, '');
  return hash.startsWith('/') ? hash : '/';
}

export function useRoute(): string[] {
  const [path, setPath] = useState(currentPath);
  useEffect(() => {
    const onChange = () => {
      setPath(currentPath());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return path.split('/').filter(Boolean).map(decodeURIComponent);
}

export function navigate(path: string): void {
  window.location.hash = path;
}

export function Link({ to, children, ...rest }: { to: string; children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>) {
  return (
    <a href={`#${to}`} {...rest}>
      {children}
    </a>
  );
}
