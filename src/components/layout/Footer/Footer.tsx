import { Link } from 'react-router';
import { legalNav, mainNav, site, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { Logo, SmartLink } from '@/components/ui';
import styles from './Footer.module.css';

/** Brand-coloured footer: address, every menu point (incl. sub-pages), legal links, socials. */
export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();
  const groups = mainNav.filter((n) => n.children);
  const singles = mainNav.filter((n) => !n.children);

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <Logo decorative />
          </div>
          <p className={styles.name}>{site.name}</p>
          <p>{t(site.tagline)}</p>
        </div>

        <address className={styles.address}>
          {site.address.street}
          <br />
          {site.address.zip} {site.address.city}
          <br />
          <a href={site.phone.href}>{site.phone.display}</a>
          <br />
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </address>

        <nav aria-label={t(ui.footerNav)} className={styles.nav}>
          {groups.map((g) => (
            <div key={g.path}>
              <p className={styles.groupTitle}>{t(g.label)}</p>
              <ul>
                {g.children!.map((c) => (
                  <li key={c.path}>
                    <Link to={c.path}>{t(c.label)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className={styles.groupTitle}>{t({ de: 'mehr', en: 'more' })}</p>
            <ul>
              {singles.map((n) => (
                <li key={n.path}>
                  <Link to={n.path}>{t(n.label)}</Link>
                </li>
              ))}
              {site.socials.map((s) => (
                <li key={s.platform}>
                  <SmartLink href={s.href}>{s.label}</SmartLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
      <div className={styles.bottom}>
        <p>
          © {year} {site.name}. {t(ui.copyright)}
        </p>
        <ul>
          {legalNav.map((n) => (
            <li key={n.path}>
              <Link to={n.path}>{t(n.label)}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
