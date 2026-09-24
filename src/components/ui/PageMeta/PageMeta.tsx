import { site, type PageMeta as PageMetaContent } from '@/content';
import { useLanguage } from '@/i18n';

/**
 * Sets <title> and meta description. React 19 hoists these tags into <head> automatically.
 */
export function PageMeta({ meta, isHome = false }: { meta: PageMetaContent; isHome?: boolean }) {
  const { t } = useLanguage();
  const title = isHome ? t(meta.title) : `${t(meta.title)} · ${site.name}`;
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={t(meta.description)} />
    </>
  );
}
