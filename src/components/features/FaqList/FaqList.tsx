import type { FaqContent } from '@/content';
import { useLanguage } from '@/i18n';
import { PlaceholderBadge, RichParagraphs } from '@/components/ui';
import styles from './FaqList.module.css';

/** Accordion of questions (native <details>, keyboard & screen-reader friendly). */
export function FaqList({ faq }: { faq: FaqContent }) {
  const { t } = useLanguage();
  return (
    <div className={styles.list}>
      <PlaceholderBadge status={faq.status} />
      {faq.items.map((item, i) => (
        <details key={i} className={styles.item}>
          <summary className={styles.question}>
            <h2 className={styles.qText}>{t(item.question)}</h2>
          </summary>
          <div className={styles.answer}>
            <RichParagraphs items={t(item.answer)} />
          </div>
        </details>
      ))}
    </div>
  );
}
