import { ui, type ContentStatus } from '@/content';
import { useLanguage } from '@/i18n';
import { showPlaceholderBadges } from '@/config/env';
import styles from './PlaceholderBadge.module.css';

/**
 * Visible marker on sample content – rendered during local development and on preview
 * deployments (never on the real live site) so reviewers see what still needs real data.
 */
export function PlaceholderBadge({ status }: { status?: ContentStatus }) {
  const { t } = useLanguage();
  if (status !== 'placeholder' || !showPlaceholderBadges) return null;
  return <span className={styles.badge}>{t(ui.placeholderBadge)}</span>;
}
