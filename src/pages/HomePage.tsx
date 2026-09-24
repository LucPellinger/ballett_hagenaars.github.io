import { courses, events, homeHero, homeHighlights, homeSections, pages, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { ButtonLink, Hero, PageMeta, SectionHeader } from '@/components/ui';
import { CourseGrid, EventList, Highlights, splitEvents } from '@/components/features';

export function HomePage() {
  const { t } = useLanguage();
  const { upcoming } = splitEvents(events);

  return (
    <>
      <PageMeta meta={pages.home.meta} isHome />
      <Hero content={homeHero} />

      <section className="container section" aria-labelledby="home-highlights">
        <h2 id="home-highlights" className="visually-hidden">
          {t(homeSections.highlights.title)}
        </h2>
        <Highlights items={homeHighlights} />
      </section>

      <section className="container section" aria-labelledby="home-courses">
        <SectionHeader id="home-courses" eyebrow={t(homeSections.courses.eyebrow)} title={t(homeSections.courses.title)} />
        <CourseGrid courses={courses.slice(0, 6)} />
        <p className="actions-row">
          <ButtonLink href="/unterricht" variant="secondary">
            {t(ui.allCourses)}
          </ButtonLink>
        </p>
      </section>

      {upcoming.length > 0 && (
        <section className="container section" aria-labelledby="home-events">
          <SectionHeader id="home-events" eyebrow={t(homeSections.events.eyebrow)} title={t(homeSections.events.title)} />
          <EventList events={upcoming.slice(0, 3)} />
        </section>
      )}

      <section className="container section" aria-labelledby="home-cta">
        <SectionHeader id="home-cta" title={t(homeSections.cta.title)} />
        <p className="prose">{t(homeSections.cta.text)}</p>
        <ButtonLink href={homeSections.cta.link.href}>{t(homeSections.cta.link.label)}</ButtonLink>
      </section>
    </>
  );
}
