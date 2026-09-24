import { pages, privacy } from '@/content';
import { PageHeader, PageMeta } from '@/components/ui';
import { LegalContent } from '@/components/features';

export function PrivacyPage() {
  return (
    <>
      <PageMeta meta={pages.privacy.meta} />
      <PageHeader content={pages.privacy.header} />
      <div className="container section prose">
        <LegalContent page={privacy} />
      </div>
    </>
  );
}
