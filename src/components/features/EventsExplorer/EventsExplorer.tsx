import { useId, useMemo, useState } from 'react';
import type { EventCategory, EventItem } from '@/content';
import { ui } from '@/content';
import { INTL_LOCALE, useLanguage } from '@/i18n';
import { EventList, emptyFilter, filterEvents, splitEvents, yearsOf, type EventFilter } from '../EventList';
import styles from './EventsExplorer.module.css';

const CATEGORIES: EventCategory[] = ['auffuehrung', 'workshop', 'show', 'ferien', 'sonstiges'];

/**
 * Events archive + upcoming dates with filters: upcoming/past, year, month, day,
 * type (multi-select) and a keyword search.
 */
export function EventsExplorer({ events }: { events: EventItem[] }) {
  const { t, locale } = useLanguage();
  const [f, setF] = useState<EventFilter>(emptyFilter);
  const id = useId();
  const set = <K extends keyof EventFilter>(k: K, v: EventFilter[K]) => setF((x) => ({ ...x, [k]: v }));

  const years = useMemo(() => yearsOf(events), [events]);
  const months = useMemo(
    () => Array.from({ length: 12 }, (_, i) => new Intl.DateTimeFormat(INTL_LOCALE[locale], { month: 'long' }).format(new Date(2026, i, 1))),
    [locale],
  );
  const textOf = (e: EventItem) => [t(e.title), t(e.description), e.location, t(ui.eventCategories[e.category]), ...(e.tags ?? [])].join(' ');
  const result = filterEvents(events, f, new Date(), textOf);
  const { upcoming, past } = splitEvents(result);
  const active = JSON.stringify(f) !== JSON.stringify(emptyFilter);

  const toggleCat = (c: EventCategory) =>
    set('categories', f.categories.includes(c) ? f.categories.filter((x) => x !== c) : [...f.categories, c]);

  return (
    <div>
      <form className={styles.filters} onSubmit={(e) => e.preventDefault()} role="search">
        <div className={styles.row}>
          <fieldset className={styles.group}>
            <legend>{t(ui.when)}</legend>
            {(['all', 'upcoming', 'past'] as const).map((w) => (
              <button key={w} type="button" className={styles.chip} aria-pressed={f.when === w} onClick={() => set('when', w)}>
                {w === 'all' ? t(ui.all) : w === 'upcoming' ? t(ui.upcoming) : t(ui.past)}
              </button>
            ))}
          </fieldset>
          <fieldset className={styles.group}>
            <legend>{t(ui.type)}</legend>
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className={styles.chip} aria-pressed={f.categories.includes(c)} onClick={() => toggleCat(c)}>
                {t(ui.eventCategories[c])}
              </button>
            ))}
          </fieldset>
        </div>
        <div className={styles.row}>
          <label className={styles.field}>
            <span>{t(ui.year)}</span>
            <select value={f.year ?? ''} onChange={(e) => set('year', e.target.value ? Number(e.target.value) : null)}>
              <option value="">{t(ui.all)}</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>{t(ui.month)}</span>
            <select value={f.month ?? ''} onChange={(e) => set('month', e.target.value ? Number(e.target.value) : null)}>
              <option value="">{t(ui.all)}</option>
              {months.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
          </label>
          <label className={styles.field}>
            <span>{t(ui.day)}</span>
            <select value={f.day ?? ''} onChange={(e) => set('day', e.target.value ? Number(e.target.value) : null)}>
              <option value="">{t(ui.all)}</option>
              {Array.from({ length: 31 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}.
                </option>
              ))}
            </select>
          </label>
          <label className={`${styles.field} ${styles.search}`}>
            <span>{t(ui.search)}</span>
            <input type="search" value={f.query} placeholder={t(ui.searchPlaceholder)} onChange={(e) => set('query', e.target.value)} />
          </label>
          {active && (
            <button type="button" className={styles.reset} onClick={() => setF(emptyFilter)}>
              {t(ui.resetFilters)}
            </button>
          )}
        </div>
      </form>

      <p className={styles.count} aria-live="polite" id={`${id}-count`}>
        {result.length} {t(ui.resultsCount)}
      </p>

      {result.length === 0 && <p>{t(ui.noEventsMatch)}</p>}
      {upcoming.length > 0 && (
        <section aria-labelledby={`${id}-up`} className={styles.block}>
          <h2 id={`${id}-up`} className={`display ${styles.heading}`}>
            {t(ui.upcomingEvents)}
          </h2>
          <EventList events={upcoming} />
        </section>
      )}
      {past.length > 0 && (
        <section aria-labelledby={`${id}-past`} className={styles.block}>
          <h2 id={`${id}-past`} className={`display ${styles.heading}`}>
            {t(ui.pastEvents)}
          </h2>
          <EventList events={past} />
        </section>
      )}
    </div>
  );
}
