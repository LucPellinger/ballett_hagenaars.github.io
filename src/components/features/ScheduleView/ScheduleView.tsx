import { useState } from 'react';
import type { AudienceId, Course, ScheduleEntry, TeamMember } from '@/content';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import { PlaceholderBadge } from '@/components/ui';
import { filterByAudience, groupByDay } from './scheduleUtils';
import styles from './ScheduleView.module.css';

export interface ScheduleViewProps {
  entries: ScheduleEntry[];
  courses: Course[];
  team: TeamMember[];
}

const FILTERS: (AudienceId | 'all')[] = ['all', 'kids', 'teens', 'adults', 'family'];

/** Weekly timetable – one accessible table per day, with an audience filter. Tables stack on mobile. */
export function ScheduleView({ entries, courses, team }: ScheduleViewProps) {
  const { t } = useLanguage();
  const [filter, setFilter] = useState<AudienceId | 'all'>('all');

  const courseById = new Map(courses.map((c) => [c.id, c]));
  const teacherById = new Map(team.map((m) => [m.id, m]));
  const days = groupByDay(filterByAudience(entries, courses, filter));

  return (
    <div>
      <div className={styles.filters} role="group" aria-label={t(ui.filterBy)}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={styles.chip}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? t(ui.all) : t(ui.audiences[f])}
          </button>
        ))}
      </div>

      <div aria-live="polite">
        {days.length === 0 && <p>{t(ui.noEntries)}</p>}
        <div className={styles.days}>
          {days.map(({ day, entries: dayEntries }) => (
            <section key={day} className={styles.day} aria-labelledby={`day-${day}`}>
              <h2 id={`day-${day}`} className={styles.dayTitle}>
                {t(ui.weekdays[day])}
              </h2>
              <table className={styles.table}>
                <caption className="visually-hidden">{t(ui.weekdays[day])}</caption>
                <thead>
                  <tr>
                    <th scope="col">{t(ui.time)}</th>
                    <th scope="col">{t(ui.course)}</th>
                    <th scope="col">{t(ui.teacher)}</th>
                  </tr>
                </thead>
                <tbody>
                  {dayEntries.map((e) => {
                    const course = courseById.get(e.courseId);
                    const teacher = e.teacherId ? teacherById.get(e.teacherId) : undefined;
                    return (
                      <tr key={e.id}>
                        <td data-label={t(ui.time)} className={styles.time}>
                          <time dateTime={e.start}>{e.start}</time>–<time dateTime={e.end}>{e.end}</time>
                        </td>
                        <th scope="row" data-label={t(ui.course)}>
                          {course ? t(course.title) : e.courseId}
                          {e.level && <span className={styles.level}> · {t(e.level)}</span>}
                          {course && <span className={styles.age}>{t(course.ageGroup)}</span>}
                          <PlaceholderBadge status={e.status} />
                        </th>
                        <td data-label={t(ui.teacher)}>{teacher?.name ?? '–'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
