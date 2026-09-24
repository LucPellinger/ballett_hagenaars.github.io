import { pages, qualityStatement, team } from '@/content';
import { useLanguage } from '@/i18n';
import { PageHeader, PageMeta, SectionHeader } from '@/components/ui';
import { TeamGrid } from '@/components/features';

export function SchoolPage() {
  const { t } = useLanguage();
  return (
    <>
      <PageMeta meta={pages.school.meta} />
      <PageHeader content={pages.school.header} />
      <section className="container section" aria-label={t(pages.school.header.title)}>
        <TeamGrid members={team} />
      </section>
      <section className="container section" aria-labelledby="quality">
        <SectionHeader id="quality" title={t(qualityStatement.title)} />
        <div className="prose">
          {t(qualityStatement.paragraphs).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>
    </>
  );
}
