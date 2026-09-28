import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router';
import { mainNav, ui, type NavItem } from '@/content';
import { useLanguage } from '@/i18n';
import { LanguageSwitcher, Logo, TextSizeSwitcher, ThemeToggle } from '@/components/ui';
import styles from './Header.module.css';

/** True when the current URL belongs to this item or one of its children. */
const isInSection = (item: NavItem, pathname: string) =>
  item.path === '/' ? pathname === '/' : [item, ...(item.children ?? [])].some((c) => pathname === c.path || pathname.startsWith(`${c.path}/`));

function DropdownItem({ item, open, onToggle }: { item: NavItem; open: boolean; onToggle: () => void }) {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const menuId = useId();
  const active = isInSection(item, pathname);
  return (
    <li className={`${styles.item} ${styles.hasMenu} ${open ? styles.isOpen : ''}`}>
      <span className={styles.parent}>
        <Link to={item.path} className={`${styles.link} ${active ? styles.active : ''}`} aria-current={active ? 'true' : undefined}>
          {t(item.label)}
        </Link>
        <button
          type="button"
          className={styles.caret}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={`${t(ui.submenu)}: ${t(item.label)}`}
          onClick={onToggle}
        >
          <svg viewBox="0 0 12 8" width="12" height="8" aria-hidden="true" focusable="false">
            <path d="M1 1l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </span>
      <ul id={menuId} className={styles.submenu}>
        {item.children!.map((c) => (
          <li key={c.path}>
            <NavLink to={c.path} end className={({ isActive }) => `${styles.sublink} ${isActive ? styles.active : ''}`}>
              {t(c.label)}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
}

/**
 * Full-width navigation bar: logo + menu (with dropdowns) on the left,
 * language + theme switch on the right.
 */
export function Header() {
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const panelId = useId();
  const ref = useRef<HTMLElement>(null);

  // Close menus after navigation.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
    setOpenMenu(null);
  }

  // Escape and outside clicks close open menus.
  useEffect(() => {
    if (!mobileOpen && !openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setOpenMenu(null);
      }
    };
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('click', onClick);
    };
  }, [mobileOpen, openMenu]);

  return (
    <header ref={ref} className={styles.header}>
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.menuButton}
          aria-expanded={mobileOpen}
          aria-controls={panelId}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="visually-hidden">{t(mobileOpen ? ui.closeMenu : ui.openMenu)}</span>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
            )}
          </svg>
        </button>
        <Link to="/" className={styles.mobileLogo} aria-label={t(ui.home)}>
          <Logo decorative />
        </Link>

        <nav id={panelId} aria-label={t(ui.mainNav)} className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}>
          <ul className={styles.list}>
            {mainNav.map((item) =>
              item.children ? (
                <DropdownItem
                  key={item.path}
                  item={item}
                  open={openMenu === item.path}
                  onToggle={() => setOpenMenu((o) => (o === item.path ? null : item.path))}
                />
              ) : (
                <li key={item.path} className={styles.item}>
                  <NavLink
                    to={item.path}
                    end
                    className={({ isActive }) => `${styles.link} ${item.page === 'home' ? styles.homeLink : ''} ${isActive ? styles.active : ''}`}
                  >
                    {item.page === 'home' && (
                      <span className={styles.homeLogo}>
                        <Logo decorative />
                      </span>
                    )}
                    <span>{t(item.label)}</span>
                  </NavLink>
                </li>
              ),
            )}
          </ul>
          {/* Small screens: the text size lives in the menu (no room in the bar) */}
          <div className={styles.menuExtras}>
            <span>{t(ui.textSize)}</span>
            <TextSizeSwitcher />
          </div>
        </nav>

        <div className={styles.tools}>
          <TextSizeSwitcher className={styles.barTextSize} />
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
