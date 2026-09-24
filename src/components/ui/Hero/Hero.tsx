import type { HeroContent } from '@/content';
import { useLanguage } from '@/i18n';
import { ButtonLink } from '../Button';
import styles from './Hero.module.css';

export interface HeroProps {
  content: HeroContent;
}

/**
 * Poster-style hero (inspired by Swiss/International typographic posters):
 * oversized tight grotesk headline, grainy red surface, black & white photo cut-out.
 */
export function Hero({ content }: HeroProps) {
  const { t } = useLanguage();
  const lines = t(content.headline);
  const meta = t(content.meta);

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <h1 id="hero-title" className={styles.headline}>
          {lines.map((line, i) => (
            <span key={i} className={styles.line}>
              {line}
            </span>
          ))}
        </h1>

        {content.image && (
          <img
            className={styles.image}
            src={content.image.src}
            alt={t(content.image.alt)}
            width={content.image.width}
            height={content.image.height}
            fetchPriority="high"
          />
        )}

        <div className={styles.bottom}>
          <div className={styles.intro}>
            <p className={styles.lead}>{t(content.lead)}</p>
            <div className={styles.actions}>
              <ButtonLink href={content.primaryCta.href} variant="poster">
                {t(content.primaryCta.label)}
              </ButtonLink>
              {content.secondaryCta && (
                <ButtonLink href={content.secondaryCta.href} variant="posterOutline">
                  {t(content.secondaryCta.label)}
                </ButtonLink>
              )}
            </div>
          </div>
          <p className={styles.meta}>
            {meta.map((line, i) => (
              <span key={i}>{line}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  );
}
