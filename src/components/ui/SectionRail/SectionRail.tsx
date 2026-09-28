import type { ReactNode } from 'react';
import styles from './SectionRail.module.css';

export interface SectionRailProps {
  /** Text of the big vertical label (the section/page heading). */
  label: string;
  /** h1 on sub-pages (one per page), h2 for sections on the home page. */
  as?: 'h1' | 'h2';
  id?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Section with the signature vertical orange label on the left edge.
 * The label is the real heading (h1/h2); on small screens it turns horizontal.
 */
export function SectionRail({ label, as: Tag = 'h2', id, children, className }: SectionRailProps) {
  const headingId = id ? `${id}-title` : undefined;
  return (
    <section id={id} className={`${styles.section} ${className ?? ''}`} aria-labelledby={headingId}>
      <div className={styles.rail}>
        <Tag id={headingId} className={styles.label}>
          {label}
        </Tag>
      </div>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
