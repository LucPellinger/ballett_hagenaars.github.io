import type { ReactNode } from 'react';
import { pages, textSizeProps, type PageId } from '@/content';
import { useLanguage } from '@/i18n';
import { PageMeta, RichText, SectionRail } from '@/components/ui';
import styles from './PageShell.module.css';

/** Standard sub-page: SEO meta + vertical page title (h1) + optional eyebrow/lead + content. */
export function PageShell({ page, children, wide = false }: { page: PageId; children: ReactNode; wide?: boolean }) {
  const { t } = useLanguage();
  const { meta, header } = pages[page];
  return (
    <>
      <PageMeta meta={meta} />
      <SectionRail as="h1" label={t(header.title)} id={`page-${page}`} pageTop>
        <div className={wide ? styles.wide : styles.body}>
          {(header.eyebrow || header.lead) && (
            <div className={styles.intro} {...textSizeProps(header.textSize)}>
              {header.eyebrow && <p className={styles.eyebrow}>{t(header.eyebrow)}</p>}
              {header.lead && (
                <p className={styles.lead}>
                  <RichText text={t(header.lead)} />
                </p>
              )}
            </div>
          )}
          {children}
        </div>
      </SectionRail>
    </>
  );
}
