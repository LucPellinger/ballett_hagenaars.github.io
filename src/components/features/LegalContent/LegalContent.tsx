import type { LegalPage } from '@/content';
import { useLanguage } from '@/i18n';
import { PlaceholderBadge } from '@/components/ui';

export function LegalContent({ page }: { page: LegalPage }) {
  const { t } = useLanguage();
  return (
    <>
      <PlaceholderBadge status={page.status} />
      {page.sections.map((s, i) => (
        <section key={i}>
          <h2>{t(s.heading)}</h2>
          {t(s.paragraphs).map((p, j) => (
            <p key={j}>{p}</p>
          ))}
        </section>
      ))}
    </>
  );
}
