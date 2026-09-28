import type { CSSProperties } from 'react';
import { Link, useSearchParams } from 'react-router';
import type { Course } from '@/content';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import { ButtonLink, Modal, PlaceholderBadge, RichParagraphs } from '@/components/ui';
import { paletteVars } from '@/styles/palette';
import styles from './CourseTiles.module.css';

export interface CourseTilesProps {
  courses: Course[];
  /** Home page preview: tiles link to the class page instead of opening a dialog. */
  preview?: boolean;
}

/** Colour-block tiles, one per class. Click opens the class details (deep link ?kurs=<id>). */
export function CourseTiles({ courses, preview = false }: CourseTilesProps) {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const current = preview ? undefined : courses.find((c) => c.id === params.get('kurs'));

  const open = (id: string | null) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        if (id) n.set('kurs', id);
        else n.delete('kurs');
        return n;
      },
      { replace: true, preventScrollReset: true },
    );

  const inner = (c: Course) => (
    <>
      <span className={`display ${styles.title}`}>{t(c.title)}</span>
      <span className={styles.age}>{t(c.ageGroup)}</span>
    </>
  );

  return (
    <>
      <ul className={styles.grid}>
        {courses.map((c) => (
          <li key={c.id} style={paletteVars(c.color) as CSSProperties} className={styles.cell}>
            {preview ? (
              <Link to={`/angebot/kurse?kurs=${c.id}`} className={styles.tile}>
                {inner(c)}
              </Link>
            ) : (
              <button type="button" className={styles.tile} onClick={() => open(c.id)} aria-haspopup="dialog">
                {inner(c)}
              </button>
            )}
            <PlaceholderBadge status={c.status} />
          </li>
        ))}
      </ul>
      {current && (
        <Modal open onClose={() => open(null)} labelledBy={`course-${current.id}`} accent={`var(--palette-${current.color})`}>
          <article className={styles.detail}>
            <p className={styles.detailAge}>{t(current.ageGroup)}</p>
            <h2 id={`course-${current.id}`} className={`display ${styles.detailTitle}`}>
              {t(current.title)}
            </h2>
            <p className={styles.summary}>{t(current.summary)}</p>
            <div className={styles.description}>
              <RichParagraphs items={t(current.description)} />
            </div>
            <ButtonLink href={`/angebot/stundenplan?kurs=${current.id}`}>{t(ui.toSchedule)}</ButtonLink>
          </article>
        </Modal>
      )}
    </>
  );
}
