import type { EventItem } from '@/content';
import { formatDateRange, useLanguage } from '@/i18n';
import { PlaceholderBadge, SmartLink } from '@/components/ui';
import styles from './EventList.module.css';

/** Poster-style event card: big date, grainy red surface. */
export function EventCard({ event, headingLevel: H = 'h3' }: { event: EventItem; headingLevel?: 'h2' | 'h3' }) {
  const { t, locale } = useLanguage();
  return (
    <article className={styles.card} aria-labelledby={`${event.id}-title`}>
      <div className={styles.poster}>
        <H id={`${event.id}-title`} className={styles.title}>
          {t(event.title)}
        </H>
        <p className={styles.when}>
          <time dateTime={event.startDate}>{formatDateRange(event.startDate, event.endDate, locale)}</time>
          <br />
          {event.location}
        </p>
      </div>
      <div className={styles.body}>
        <PlaceholderBadge status={event.status} />
        <p>{t(event.description)}</p>
        {event.link && <SmartLink href={event.link.href}>{t(event.link.label)}</SmartLink>}
      </div>
    </article>
  );
}
