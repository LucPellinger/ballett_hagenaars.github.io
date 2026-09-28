import { courses } from '@/content';
import { CourseTiles } from '@/components/features';
import { PageShell } from './PageShell';

export function CoursesPage() {
  return (
    <PageShell page="courses">
      <CourseTiles courses={courses} />
    </PageShell>
  );
}
