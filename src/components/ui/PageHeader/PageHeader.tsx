import type { PageHeaderContent } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './PageHeader.module.css';

/** Poster-style header band at the top of every sub-page. Renders the page's <h1>. */
export function PageHeader({ content }: { content: PageHeaderContent }) {
  const { t } = useLanguage();
  return (
    <header className={styles.header}>
      <div className="container">
        {content.eyebrow && <p className={styles.eyebrow}>{t(content.eyebrow)}</p>}
        <h1 className={styles.title}>{t(content.title)}</h1>
        {content.lead && <p className={styles.lead}>{t(content.lead)}</p>}
      </div>
    </header>
  );
}
