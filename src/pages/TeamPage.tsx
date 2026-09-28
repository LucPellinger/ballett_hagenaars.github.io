import { team } from '@/content';
import { TeamGrid } from '@/components/features';
import { PageShell } from './PageShell';

export function TeamPage() {
  return (
    <PageShell page="team">
      <TeamGrid members={team} />
    </PageShell>
  );
}
