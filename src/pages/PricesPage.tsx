import { priceNotes, pricePlans } from '@/content';
import { PriceTable } from '@/components/features';
import { PageShell } from './PageShell';

export function PricesPage() {
  return (
    <PageShell page="prices">
      <PriceTable plans={pricePlans} notes={priceNotes} />
    </PageShell>
  );
}
