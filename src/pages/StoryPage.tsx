import type { PageId, StoryPage as StoryContent } from '@/content';
import { PlaceholderBadge } from '@/components/ui';
import { StoryBlocks } from '@/components/features';
import { PageShell } from './PageShell';

/** Über uns / Qualität / Spitzentanz / Aufführung – same layout, different content. */
export function StoryPage({ page, content }: { page: PageId; content: StoryContent }) {
  return (
    <PageShell page={page}>
      <PlaceholderBadge status={content.status} />
      <StoryBlocks blocks={content.blocks} />
    </PageShell>
  );
}
