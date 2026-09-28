import { useSearchParams } from 'react-router';
import type { AudienceId, Course, ScheduleEntry } from '@/content';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import { PlaceholderBadge } from '@/components/ui';
import { calendarFrame, filterByAudience, filterByCourse, groupByDay, toMinutes } from './scheduleUtils';
import styles from './ScheduleView.module.css';

export interface ScheduleViewProps {
  entries: ScheduleEntry[];
  courses: Course[];
}

const FILTERS: (AudienceId | 'all')[] = ['all', 'kids', 'teens', 'adults', 'family'];
type View = 'liste' | 'kalender';

/**
 * Timetable with two views – day lists and a week calendar – sharing the same filters
 * (audience + class). View and filters live in the URL (?ansicht=kalender&kurs=ballett).
 */
export function ScheduleView({ entries, courses }: ScheduleViewProps) {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const view: View = params.get('ansicht') === 'kalender' ? 'kalender' : 'liste';
  const audience = (params.get('zielgruppe') as AudienceId | null) ?? 'all';
  const courseId = params.get('kurs');

  const set = (key: string, value: string | null) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        if (value) n.set(key, value);
        else n.delete(key);
        return n;
      },
      { replace: true, preventScrollReset: true },
    );

  const courseById = new Map(courses.map((c) => [c.id, c]));
  const filtered = filterByCourse(filterByAudience(entries, courses, audience), courseId);

  return (
    <div>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label={t(ui.filterBy)}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={styles.chip}
              aria-pressed={audience === f}
              onClick={() => set('zielgruppe', f === 'all' ? null : f)}
            >
              {f === 'all' ? t(ui.all) : t(ui.audiences[f])}
            </button>
          ))}
        </div>
        <label className={styles.select}>
          <span>{t(ui.course)}</span>
          <select value={courseId ?? ''} onChange={(e) => set('kurs', e.target.value || null)}>
            <option value="">{t(ui.all)}</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {t(c.title)}
              </option>
            ))}
          </select>
        </label>
        <div className={styles.views} role="group" aria-label={t(ui.view)}>
          {(['liste', 'kalender'] as View[]).map((v) => (
            <button key={v} type="button" className={styles.viewBtn} aria-pressed={view === v} onClick={() => set('ansicht', v === 'liste' ? null : v)}>
              {v === 'liste' ? t(ui.listView) : t(ui.calendarView)}
            </button>
          ))}
        </div>
      </div>

      <div aria-live="polite">
        {filtered.length === 0 && <p>{t(ui.noEntries)}</p>}
        {filtered.length > 0 &&
          (view === 'liste' ? (
            <ListView entries={filtered} courseById={courseById} />
          ) : (
            <CalendarView all={entries} entries={filtered} courseById={courseById} />
          ))}
      </div>
    </div>
  );
}

interface ViewProps {
  entries: ScheduleEntry[];
  courseById: Map<string, Course>;
}

function ListView({ entries, courseById }: ViewProps) {
  const { t } = useLanguage();
  return (
    <div className={styles.days}>
      {groupByDay(entries).map(({ day, entries: dayEntries }) => (
        <section key={day} className={styles.day} aria-labelledby={`day-${day}`}>
          <h2 id={`day-${day}`} className={`display ${styles.dayTitle}`}>
            {t(ui.weekdays[day])}
          </h2>
          <table className={styles.table}>
            <caption className="visually-hidden">{t(ui.weekdays[day])}</caption>
            <thead>
              <tr>
                <th scope="col">{t(ui.time)}</th>
                <th scope="col">{t(ui.course)}</th>
              </tr>
            </thead>
            <tbody>
              {dayEntries.map((e) => {
                const course = courseById.get(e.courseId);
                return (
                  <tr key={e.id}>
                    <td data-label={t(ui.time)} className={styles.time}>
                      <time dateTime={e.start}>{e.start}</time>–<time dateTime={e.end}>{e.end}</time>
                    </td>
                    <th scope="row" data-label={t(ui.course)}>
                      {course && <span className={styles.swatch} style={{ background: `var(--palette-${course.color})` }} aria-hidden="true" />}
                      {course ? t(course.title) : e.courseId}
                      {e.level && <span className={styles.level}> · {t(e.level)}</span>}
                      {course && <span className={styles.age}>{t(course.ageGroup)}</span>}
                      <PlaceholderBadge status={e.status} />
                    </th>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}

function CalendarView({ all, entries, courseById }: ViewProps & { all: ScheduleEntry[] }) {
  const { t } = useLanguage();
  const { days, from, to } = calendarFrame(all);
  const span = to - from;
  const hours = Array.from({ length: span / 60 + 1 }, (_, i) => from + i * 60);
  const pct = (min: number) => `${((min - from) / span) * 100}%`;

  return (
    <div className={styles.calendarScroll}>
      <div className={styles.calendar} style={{ '--days': days.length, '--hours': span / 60 } as React.CSSProperties}>
        <div className={styles.hours} aria-hidden="true">
          {hours.map((h) => (
            <span key={h} style={{ top: pct(h) }}>
              {String(h / 60).padStart(2, '0')}:00
            </span>
          ))}
        </div>
        {days.map((day) => {
          const list = entries.filter((e) => e.day === day).sort((a, b) => a.start.localeCompare(b.start));
          return (
            <section key={day} className={styles.calDay} aria-labelledby={`cal-${day}`}>
              <h2 id={`cal-${day}`} className={styles.calDayTitle}>
                <abbr title={t(ui.weekdays[day])}>{t(ui.weekdaysShort[day])}</abbr>
              </h2>
              <ol className={styles.calCol}>
                {hours.map((h) => (
                  <li key={h} className={styles.hourLine} style={{ top: pct(h) }} aria-hidden="true" />
                ))}
                {list.map((e) => {
                  const course = courseById.get(e.courseId);
                    const s = toMinutes(e.start);
                  const en = toMinutes(e.end);
                  return (
                    <li
                      key={e.id}
                      className={styles.event}
                      style={{
                        top: pct(s),
                        height: `${((en - s) / span) * 100}%`,
                        background: `var(--palette-${course?.color ?? 'orange'})`,
                        color: `var(--on-${course?.color ?? 'orange'})`,
                      }}
                    >
                      <span className={styles.eventTime}>
                        {e.start}–{e.end}
                      </span>
                      <strong className={styles.eventTitle}>
                        {course ? t(course.title) : e.courseId}
                        {e.level && ` · ${t(e.level)}`}
                      </strong>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </div>
  );
}
