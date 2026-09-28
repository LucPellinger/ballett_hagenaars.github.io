import type { Keyword } from '@/content';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './Marquee.module.css';

/**
 * Scrolling band of coloured keywords. The moving copy is decorative (aria-hidden);
 * screen readers get a plain list. Pauses on hover and stops for "reduced motion".
 */
export function Marquee({ items }: { items: Keyword[] }) {
  const { t } = useLanguage();
  const row = (copy: number) => (
    <span className={styles.row} aria-hidden="true" key={copy}>
      {items.map((k, i) => (
        <span key={i} className={styles.item}>
          <span style={{ color: `var(--palette-${k.color})` }}>{t(k.text)}</span>
          <span className={styles.dot}>•</span>
        </span>
      ))}
    </span>
  );
  return (
    <section className={styles.band} aria-label={t(ui.keywordsLabel)}>
      <ul className="visually-hidden">
        {items.map((k, i) => (
          <li key={i}>{t(k.text)}</li>
        ))}
      </ul>
      <div className={styles.track}>{[row(0), row(1)]}</div>
    </section>
  );
}
