import type { HeroContent } from '@/content';
import { useLanguage } from '@/i18n';
import { ButtonLink, Logo } from '@/components/ui';
import styles from './HomeHero.module.css';

/**
 * Split colour-block hero. "Willkommen!" slowly pulses between dark brown and the red-orange of the
 * right panel (stops while the visitor interacts, off for reduced motion).: warm orange panel with the welcome + quick links,
 * red-orange panel with the big logo and the school name (page <h1>).
 */
export function HomeHero({ content }: { content: HeroContent }) {
  const { t } = useLanguage();
  return (
    <div className={styles.hero}>
      <div className={styles.left}>
        {/* Hovering (or keyboard-focusing) this block reveals the quick links on desktop;
            on touch devices and small screens they are always visible. */}
        <div className={styles.intro}>
          <p className={`display ${styles.welcome}`}>{t(content.welcome)}</p>
          <p className={styles.lead}>{t(content.lead)}</p>
          <ul className={styles.quick}>
          {content.quickLinks.map((l) => (
            <li key={l.href}>
              <ButtonLink href={l.href} variant="hero">
                {t(l.label)}
              </ButtonLink>
            </li>
          ))}
          </ul>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.logo}>
          <Logo decorative />
        </div>
        <h1 className={`display ${styles.title}`}>{t(content.title)}</h1>
      </div>
    </div>
  );
}
