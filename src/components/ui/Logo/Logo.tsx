import { site } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './Logo.module.css';

/**
 * School logo. Uses `site.logo` from the content when present, otherwise a painted
 * brush-stroke placeholder (vertical stroke + wave). Colour follows `currentColor`.
 */
export function Logo({ className, decorative = false }: { className?: string; decorative?: boolean }) {
  const { t } = useLanguage();
  if (site.logo?.src) {
    return <img className={`${styles.logo} ${className ?? ''}`} src={site.logo.src} alt={decorative ? '' : t(site.logo.alt)} />;
  }
  return (
    <svg
      className={`${styles.logo} ${className ?? ''}`}
      viewBox="0 0 120 100"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : site.name}
      focusable="false"
    >
      <defs>
        <filter id="logo-rough" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="4" />
          <feDisplacementMap in="SourceGraphic" scale="4" />
        </filter>
      </defs>
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" filter="url(#logo-rough)">
        <path d="M38 8 L20 90" strokeWidth="13" />
        <path d="M29 54 C 44 38, 56 36, 64 50 S 88 66, 112 30" strokeWidth="11" />
        <path d="M96 10 l8 -4 M97 12 l-3 3" strokeWidth="3" />
      </g>
    </svg>
  );
}
