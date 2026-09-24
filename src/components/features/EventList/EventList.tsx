import type { EventItem } from '@/content';
import { EventCard } from './EventCard';
import styles from './EventList.module.css';

export function EventList({ events, headingLevel }: { events: EventItem[]; headingLevel?: 'h2' | 'h3' }) {
  return (
    <ul className={styles.list}>
      {events.map((e) => (
        <li key={e.id}>
          <EventCard event={e} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
