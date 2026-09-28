import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './ScrollCue.module.css';

/** Chevron that jumps to the next section. */
export function ScrollCue({ targetId }: { targetId: string }) {
  const { t } = useLanguage();
  return (
    <div className={styles.wrap}>
      <a className={styles.cue} href={`#${targetId}`} aria-label={t(ui.scrollDown)}>
        <svg viewBox="0 0 48 24" width="48" height="24" aria-hidden="true" focusable="false">
          <path d="M4 4 L24 20 L44 4" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </a>
    </div>
  );
}
