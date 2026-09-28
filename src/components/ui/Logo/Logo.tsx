import logoUrl from '@/assets/brand/logo.svg';
import { site } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './Logo.module.css';

/**
 * School logo (brush-stroke "h" with bird).
 * Default: the vector logo in src/assets/brand/logo.svg, drawn as a CSS mask so it takes the
 * surrounding text colour (`color`). A logo uploaded in the editor (Schuldaten → Logo) wins.
 */
export function Logo({ className, decorative = false }: { className?: string; decorative?: boolean }) {
  const { t } = useLanguage();
  if (site.logo?.src) {
    return <img className={`${styles.logo} ${className ?? ''}`} src={site.logo.src} alt={decorative ? '' : t(site.logo.alt)} />;
  }
  return (
    <span
      className={`${styles.logo} ${styles.mask} ${className ?? ''}`}
      style={{ '--logo-url': `url("${logoUrl}")` } as React.CSSProperties}
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : site.name}
    />
  );
}
