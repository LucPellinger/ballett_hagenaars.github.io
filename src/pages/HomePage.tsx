import { courses, events, homeHero, homeHighlights, homeKeywords, homePhilosophy, homeSections, pages, textSizeProps, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { BrushImage, ButtonLink, Marquee, PageMeta, RichParagraphs, ScrollCue, SectionRail } from '@/components/ui';
import { CourseTiles, EventList, Highlights, HomeHero, splitEvents } from '@/components/features';
import styles from './HomePage.module.css';

export function HomePage() {
  const { t } = useLanguage();
  const { upcoming } = splitEvents(events);

  return (
    <>
      <PageMeta meta={pages.home.meta} isHome />
      <HomeHero content={homeHero} />
      <Marquee items={homeKeywords} />
      <ScrollCue targetId="highlights" />

      <section id="highlights" className={styles.highlights} aria-labelledby="highlights-title">
        <h2 id="highlights-title" className="visually-hidden">
          {t(homeSections.highlights.title)}
        </h2>
        <Highlights items={homeHighlights} />
      </section>

      <SectionRail label={t(homePhilosophy.label)} id="philosophie">
        <div className={styles.split} {...textSizeProps(homePhilosophy.textSize)}>
          <div className={styles.text}>
            <RichParagraphs items={t(homePhilosophy.paragraphs)} />
            {homePhilosophy.emphasis && <p className={styles.emphasis}>{t(homePhilosophy.emphasis)}</p>}
          </div>
          <BrushImage visual={homePhilosophy.visual} variant={1} />
        </div>
      </SectionRail>

      <SectionRail label={t(homeSections.courses.label)} id="unterricht">
        {homeSections.courses.intro && <p className={styles.intro} {...textSizeProps(homeSections.courses.textSize)}>{t(homeSections.courses.intro)}</p>}
        <CourseTiles courses={courses} preview />
      </SectionRail>

      {upcoming.length > 0 && (
        <SectionRail label={t(homeSections.events.label)} id="demnaechst">
          {homeSections.events.intro && <p className={styles.intro} {...textSizeProps(homeSections.events.textSize)}>{t(homeSections.events.intro)}</p>}
          <EventList events={upcoming.slice(0, 3)} />
          <p className={styles.more}>
            <ButtonLink href="/aktuelles" variant="secondary">
              {t(ui.allEvents)}
            </ButtonLink>
          </p>
        </SectionRail>
      )}

      <section className={styles.cta} aria-labelledby="cta-title" {...textSizeProps(homeSections.cta.textSize)}>
        <h2 id="cta-title" className={`display ${styles.ctaTitle}`}>
          {t(homeSections.cta.title)}
        </h2>
        <p className={styles.ctaText}>{t(homeSections.cta.text)}</p>
        <ButtonLink href={homeSections.cta.link.href} variant="hero">
          {t(homeSections.cta.link.label)}
        </ButtonLink>
      </section>
    </>
  );
}
