import { gallery } from '@/content';
import { Gallery } from '@/components/features';
import { PageShell } from './PageShell';

export function GalleryPage() {
  return (
    <PageShell page="gallery">
      <Gallery items={gallery} />
    </PageShell>
  );
}
