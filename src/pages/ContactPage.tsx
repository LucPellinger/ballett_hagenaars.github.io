import { ContactDetails } from '@/components/features';
import { PageShell } from './PageShell';

export function ContactPage() {
  return (
    <PageShell page="contact">
      <ContactDetails />
    </PageShell>
  );
}
