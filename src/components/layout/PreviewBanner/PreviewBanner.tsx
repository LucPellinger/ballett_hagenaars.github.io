import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './PreviewBanner.module.css';

/** Shown on preview deployments only, so nobody mistakes sample content for real information. */
export function PreviewBanner() {
  const { t } = useLanguage();
  return (
    <div className={styles.banner} role="note">
      <p className={`container ${styles.text}`}>{t(ui.previewBanner)}</p>
    </div>
  );
}
