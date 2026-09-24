import { Link } from 'react-router';
import { navigation, site, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { SmartLink } from '@/components/ui';
import styles from './Footer.module.css';

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div>
          <p className={styles.name}>{site.name}</p>
          <p className={styles.muted}>{t(site.tagline)}</p>
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

        <nav aria-label={t(ui.footerNav)}>
          <ul className={styles.links}>
            {navigation
              .filter((n) => n.footer)
              .map((n) => (
                <li key={n.page}>
                  <Link to={n.path}>{t(n.label)}</Link>
                </li>
              ))}
            {site.socials.map((s) => (
              <li key={s.platform}>
                <SmartLink href={s.href}>{s.label}</SmartLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container">
        <p className={styles.copy}>
          © {year} {site.name}. {t(ui.copyright)}
        </p>
      </div>
    </footer>
  );
}
