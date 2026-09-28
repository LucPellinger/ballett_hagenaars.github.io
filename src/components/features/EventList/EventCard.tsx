import type { CSSProperties } from 'react';
import type { EventItem } from '@/content';
import { textSizeProps, ui } from '@/content';
import { formatDateRange, INTL_LOCALE, parseIsoDate, useLanguage } from '@/i18n';
import { PlaceholderBadge, RichText, SmartLink } from '@/components/ui';
import { paletteVars } from '@/styles/palette';
import { CATEGORY_COLOR } from './eventUtils';
import styles from './EventList.module.css';

/** Event card: colour block with big day/month (colour = category), text beside it. */
export function EventCard({ event, headingLevel: H = 'h3' }: { event: EventItem; headingLevel?: 'h2' | 'h3' }) {
  const { t, locale } = useLanguage();
  const start = parseIsoDate(event.startDate);
  const month = new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: 'short' }).format(start);
  return (
    <article className={styles.card} aria-labelledby={`${event.id}-title`} style={paletteVars(CATEGORY_COLOR[event.category]) as CSSProperties} {...textSizeProps(event.textSize)}>
      <div className={styles.date} aria-hidden="true">
        <span className={`display ${styles.dateDay}`}>{start.getDate()}</span>
        <span className={styles.dateMonth}>
          {month} {start.getFullYear()}
        </span>
      </div>
      <div className={styles.body}>
        <p className={styles.category}>{t(ui.eventCategories[event.category])}</p>
        <H id={`${event.id}-title`} className={`display ${styles.title}`}>
          {t(event.title)}
        </H>
        <p className={styles.when}>
          <time dateTime={event.startDate}>{formatDateRange(event.startDate, event.endDate, locale)}</time> · {event.location}
        </p>
        <p>
          <RichText text={t(event.description)} />
        </p>
        {event.link && <SmartLink href={event.link.href}>{t(event.link.label)}</SmartLink>}
        <PlaceholderBadge status={event.status} />
      </div>
    </article>
  );
}
