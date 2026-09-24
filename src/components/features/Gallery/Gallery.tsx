import type { GalleryItem } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './Gallery.module.css';

/** Responsive masonry-style photo grid. Every image needs alt text (enforced by tests). */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const { t } = useLanguage();
  return (
    <ul className={styles.grid}>
      {items.map((item) => (
        <li key={item.id} className={styles.item}>
          <figure className={styles.figure}>
            <img
              src={item.image.src}
              alt={t(item.image.alt)}
              width={item.image.width}
              height={item.image.height}
              loading="lazy"
              decoding="async"
            />
            {item.caption && <figcaption className={styles.caption}>{t(item.caption)}</figcaption>}
          </figure>
        </li>
      ))}
    </ul>
  );
}
