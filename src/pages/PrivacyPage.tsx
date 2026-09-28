import { privacy } from '@/content';
import { LegalContent } from '@/components/features';
import { PageShell } from './PageShell';

export function PrivacyPage() {
  return (
    <PageShell page="privacy">
      <div className="prose">
        <LegalContent page={privacy} />
      </div>
    </PageShell>
  );
}
