import { textSizeProps, type Localized, type TextSize } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './Highlights.module.css';

/** Numbered key selling points ("01 / 02 / 03") in poster typography. */
export function Highlights({ items }: { items: { title: Localized; text: Localized; textSize?: TextSize }[] }) {
  const { t } = useLanguage();
  return (
    <ol className={styles.list}>
      {items.map((item, i) => (
        <li key={i} className={styles.item} {...textSizeProps(item.textSize)}>
          <span className={styles.number} aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <h3 className={styles.title}>{t(item.title)}</h3>
          <p className={styles.text}>{t(item.text)}</p>
        </li>
      ))}
    </ol>
  );
}
