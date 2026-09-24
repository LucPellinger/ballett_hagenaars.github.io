import { site, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { SmartLink } from '@/components/ui';
import styles from './ContactDetails.module.css';

/** Address, phone, email, office hours. No embedded map (privacy) – links to OpenStreetMap instead. */
export function ContactDetails() {
  const { t } = useLanguage();
  return (
    <div className={styles.grid}>
      <section className={styles.block} aria-labelledby="contact-address">
        <h2 id="contact-address" className={styles.label}>
          {t(ui.address)}
        </h2>
        <address className={styles.value}>
          {site.name}
          <br />
          {site.address.street}
          <br />
          {site.address.zip} {site.address.city}
        </address>
        <SmartLink href={site.mapUrl}>{t(ui.openMap)}</SmartLink>
      </section>

      <section className={styles.block} aria-labelledby="contact-phone">
        <h2 id="contact-phone" className={styles.label}>
          {t(ui.phone)}
        </h2>
        <a className={styles.big} href={site.phone.href}>
          {site.phone.display}
        </a>
      </section>

      <section className={styles.block} aria-labelledby="contact-email">
        <h2 id="contact-email" className={styles.label}>
          {t(ui.email)}
        </h2>
        <a className={styles.big} href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </section>

      <section className={styles.block} aria-labelledby="contact-hours">
        <h2 id="contact-hours" className={styles.label}>
          {t(ui.openingHours)}
        </h2>
        <dl className={styles.hours}>
          {site.openingHours.map((h, i) => (
            <div key={i}>
              <dt>{t(h.days)}</dt>
              <dd>{h.hours}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
