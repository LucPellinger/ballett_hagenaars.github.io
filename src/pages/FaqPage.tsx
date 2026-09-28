import { faq } from '@/content';
import { FaqList } from '@/components/features';
import { PageShell } from './PageShell';

export function FaqPage() {
  return (
    <PageShell page="faq">
      <FaqList faq={faq} />
    </PageShell>
  );
}
