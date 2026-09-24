import { courses, pages, schedule, team } from '@/content';
import { PageHeader, PageMeta } from '@/components/ui';
import { ScheduleView } from '@/components/features';

export function SchedulePage() {
  return (
    <>
      <PageMeta meta={pages.schedule.meta} />
      <PageHeader content={pages.schedule.header} />
      <div className="container section">
        <ScheduleView entries={schedule} courses={courses} team={team} />
      </div>
    </>
  );
}
