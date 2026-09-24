import { events, pages, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { PageHeader, PageMeta, SectionHeader } from '@/components/ui';
import { EventList, splitEvents } from '@/components/features';

export function EventsPage() {
  const { t } = useLanguage();
  const { upcoming, past } = splitEvents(events);
  return (
    <>
      <PageMeta meta={pages.events.meta} />
      <PageHeader content={pages.events.header} />
      <section className="container section" aria-labelledby="upcoming">
        <SectionHeader id="upcoming" title={t(ui.upcomingEvents)} />
        {upcoming.length > 0 ? <EventList events={upcoming} /> : <p>{t(ui.noUpcoming)}</p>}
      </section>
      {past.length > 0 && (
        <section className="container section" aria-labelledby="past">
          <SectionHeader id="past" title={t(ui.pastEvents)} />
          <EventList events={past} />
        </section>
      )}
    </>
  );
}
