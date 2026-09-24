import type { Course } from '@/content';
import { CourseCard } from './CourseCard';
import styles from './CourseGrid.module.css';

export interface CourseGridProps {
  courses: Course[];
  detailed?: boolean;
  headingLevel?: 'h2' | 'h3';
}

export function CourseGrid({ courses, detailed, headingLevel }: CourseGridProps) {
  return (
    <ul className={styles.grid}>
      {courses.map((c) => (
        <li key={c.id}>
          <CourseCard course={c} detailed={detailed} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
