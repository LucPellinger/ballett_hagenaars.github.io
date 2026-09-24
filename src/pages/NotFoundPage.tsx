import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import { ButtonLink, PageHeader } from '@/components/ui';

export function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <>
      <title>{`404 · ${t(ui.notFoundTitle)}`}</title>
      <meta name="robots" content="noindex" />
      <PageHeader content={{ eyebrow: { de: '404' }, title: ui.notFoundTitle, lead: ui.notFoundText }} />
      <div className="container section">
        <ButtonLink href="/">{t(ui.backHome)}</ButtonLink>
      </div>
    </>
  );
}
