import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import { ButtonLink, SectionRail } from '@/components/ui';

export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <>
      <title>{`404 · ${t(ui.notFoundTitle)}`}</title>
      <meta name="robots" content="noindex" />
      <SectionRail as="h1" label="404">
        <p style={{ fontSize: 'var(--fs-lg)', fontWeight: 600 }}>{t(ui.notFoundTitle)}</p>
        <p>{t(ui.notFoundText)}</p>
        <ButtonLink href="/">{t(ui.backHome)}</ButtonLink>
      </SectionRail>
    </>
  );
}
