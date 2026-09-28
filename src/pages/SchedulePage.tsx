import { courses, schedule, team } from '@/content';
import { ScheduleView } from '@/components/features';
import { PageShell } from './PageShell';

export function SchedulePage() {
  return (
    <PageShell page="schedule">
      <ScheduleView entries={schedule} courses={courses} team={team} />
    </PageShell>
  );
}
