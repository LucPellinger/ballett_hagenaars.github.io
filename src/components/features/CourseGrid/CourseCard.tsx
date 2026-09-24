import type { Course } from '@/content';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import { PlaceholderBadge } from '@/components/ui';
import styles from './CourseGrid.module.css';

export interface CourseCardProps {
  course: Course;
  /** Show full description (courses page) or only the summary (teaser). */
  detailed?: boolean;
  headingLevel?: 'h2' | 'h3';
}

export function CourseCard({ course, detailed = false, headingLevel: H = 'h3' }: CourseCardProps) {
  const { t } = useLanguage();
  return (
    <article className={styles.card} id={course.id} aria-labelledby={`${course.id}-title`}>
      {course.image && <img className={styles.image} src={course.image.src} alt={t(course.image.alt)} loading="lazy" />}
      <div className={styles.body}>
        <H id={`${course.id}-title`} className={styles.title}>
          {t(course.title)}
          <PlaceholderBadge status={course.status} />
        </H>
        <p className={styles.age}>
          <span className="visually-hidden">{t(ui.ageGroup)}: </span>
          {t(course.ageGroup)}
        </p>
        {detailed ? t(course.description).map((p, i) => <p key={i}>{p}</p>) : <p>{t(course.summary)}</p>}
      </div>
    </article>
  );
}
