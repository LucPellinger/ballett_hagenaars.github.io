import { useEffect, useId, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { navigation, site, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { LanguageSwitcher, ThemeToggle } from '@/components/ui';
import styles from './Header.module.css';

export function Header() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const menuId = useId();
  const items = navigation.filter((n) => n.header);

  // Close the mobile menu after navigating.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  // Close with Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.brand} aria-label={`${site.name} – ${t(ui.home)}`}>
          <span className={styles.brandSmall}>Ballettschule</span>
          <span className={styles.brandName}>Hagenaars</span>
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="visually-hidden">{t(open ? ui.closeMenu : ui.openMenu)}</span>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            )}
          </svg>
        </button>

        <div id={menuId} className={`${styles.panel} ${open ? styles.panelOpen : ''}`}>
          <nav aria-label={t(ui.mainNav)}>
            <ul className={styles.navList}>
              {items.map((item) => (
                <li key={item.page}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
                  >
                    {t(item.label)}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.controls}>
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
