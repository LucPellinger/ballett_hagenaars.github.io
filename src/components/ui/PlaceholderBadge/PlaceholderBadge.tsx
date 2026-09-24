import { ui, type ContentStatus } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './PlaceholderBadge.module.css';

/**
 * Visible marker on sample content – only rendered during local development
 * (never in production builds) so editors immediately see what still needs real data.
 */
export function PlaceholderBadge({ status }: { status?: ContentStatus }) {
  const { t } = useLanguage();
  if (status !== 'placeholder' || !import.meta.env.DEV) return null;
  return <span className={styles.badge}>{t(ui.placeholderBadge)}</span>;
}
