import { courses, pages, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { ButtonLink, PageHeader, PageMeta } from '@/components/ui';
import { CourseGrid } from '@/components/features';

export function CoursesPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageMeta meta={pages.courses.meta} />
      <PageHeader content={pages.courses.header} />
      <div className="container section">
        <CourseGrid courses={courses} detailed headingLevel="h2" />
        <p className="actions-row">
          <ButtonLink href="/stundenplan">{t(ui.toSchedule)}</ButtonLink>
        </p>
      </div>
    </>
  );
}
