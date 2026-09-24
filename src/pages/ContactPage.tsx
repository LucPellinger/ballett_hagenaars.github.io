import { pages } from '@/content';
import { PageHeader, PageMeta } from '@/components/ui';
import { ContactDetails } from '@/components/features';

export function ContactPage() {
  return (
    <>
      <PageMeta meta={pages.contact.meta} />
      <PageHeader content={pages.contact.header} />
      <div className="container section">
        <ContactDetails />
      </div>
    </>
  );
}
