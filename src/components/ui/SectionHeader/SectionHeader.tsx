import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

export interface SectionHeaderProps {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Heading level – keep the document outline logical (h1 → h2 → h3). */
  as?: 'h2' | 'h3';
  align?: 'start' | 'center';
}

/** Large poster-type section title with an optional small eyebrow line. */
export function SectionHeader({ id, eyebrow, title, as: Tag = 'h2', align = 'start' }: SectionHeaderProps) {
  return (
    <div className={`${styles.wrap} ${align === 'center' ? styles.center : ''}`}>
      {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
      <Tag id={id} className={styles.title}>
        {title}
      </Tag>
    </div>
  );
}
