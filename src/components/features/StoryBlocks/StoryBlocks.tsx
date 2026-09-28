import { textSizeProps, type StoryBlock } from '@/content';
import { useLanguage } from '@/i18n';
import { BrushImage, RichParagraphs } from '@/components/ui';
import styles from './StoryBlocks.module.css';

/**
 * Alternating text + brush-image rows (image left / text right, then swapped),
 * the core layout of the "Über uns" pages.
 */
export function StoryBlocks({ blocks, headingLevel: H = 'h2' }: { blocks: StoryBlock[]; headingLevel?: 'h2' | 'h3' }) {
  const { t } = useLanguage();
  return (
    <div className={styles.blocks}>
      {blocks.map((b, i) => (
        <div key={i} className={`${styles.row} ${i % 2 ? styles.reverse : ''}`} {...textSizeProps(b.textSize)}>
          <div className={styles.visual}>
            <BrushImage visual={b.visual} variant={i} />
          </div>
          <div className={styles.text}>
            {b.heading && <H className={styles.heading}>{t(b.heading)}</H>}
            <RichParagraphs items={t(b.paragraphs)} />
            {b.bullets && t(b.bullets).length > 0 && (
              <ul className={styles.bullets}>
                {t(b.bullets).map((x, j) => (
                  <li key={j}>{x}</li>
                ))}
              </ul>
            )}
            {b.after && <RichParagraphs items={t(b.after)} />}
          </div>
        </div>
      ))}
    </div>
  );
}
