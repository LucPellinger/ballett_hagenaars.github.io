import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './SkipLink.module.css';

/** First focusable element: lets keyboard & screen-reader users jump past the navigation. */
export function SkipLink({ targetId = 'main' }: { targetId?: string }) {
  const { t } = useLanguage();
  return (
    <a className={styles.skip} href={`#${targetId}`}>
      {t(ui.skipToContent)}
    </a>
  );
}
