import { pages, priceNotes, pricePlans } from '@/content';
import { PageHeader, PageMeta } from '@/components/ui';
import { PriceTable } from '@/components/features';

export function PricesPage() {
  return (
    <>
      <PageMeta meta={pages.prices.meta} />
      <PageHeader content={pages.prices.header} />
      <div className="container section">
        <PriceTable plans={pricePlans} notes={priceNotes} />
      </div>
    </>
  );
}
