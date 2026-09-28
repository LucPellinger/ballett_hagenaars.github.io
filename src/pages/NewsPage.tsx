import { events } from '@/content';
import { EventsExplorer } from '@/components/features';
import { PageShell } from './PageShell';

export function NewsPage() {
  return (
    <PageShell page="news">
      <EventsExplorer events={events} />
    </PageShell>
  );
}
