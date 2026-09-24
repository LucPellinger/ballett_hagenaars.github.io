import { gallery, pages } from '@/content';
import { PageHeader, PageMeta } from '@/components/ui';
import { Gallery } from '@/components/features';

export function GalleryPage() {
  return (
    <>
      <PageMeta meta={pages.gallery.meta} />
      <PageHeader content={pages.gallery.header} />
      <div className="container section">
        <Gallery items={gallery} />
      </div>
    </>
  );
}
