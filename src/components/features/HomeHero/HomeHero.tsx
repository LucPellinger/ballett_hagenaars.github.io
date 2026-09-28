import type { HeroContent } from '@/content';
import { useLanguage } from '@/i18n';
import { ButtonLink, Logo } from '@/components/ui';
import styles from './HomeHero.module.css';

/**
 * Split colour-block hero: warm orange panel with the welcome + quick links,
 * red-orange panel with the big logo and the school name (page <h1>).
 */
export function HomeHero({ content }: { content: HeroContent }) {
  const { t } = useLanguage();
  return (
    <div className={styles.hero}>
      <div className={styles.left}>
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
      <div className={styles.right}>
        <div className={styles.logo}>
          <Logo decorative />
        </div>
        <h1 className={`display ${styles.title}`}>{t(content.title)}</h1>
      </div>
    </div>
  );
}
