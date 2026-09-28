import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { Course, ScheduleEntry, TeamMember } from '@/content';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ScheduleView } from './ScheduleView';
import { calendarFrame, groupByDay } from './scheduleUtils';

const course = (id: string, title: string, audience: Course['audience']): Course => ({
  id,
  title: { de: title },
  audience,
  ageGroup: { de: '4+' },
  summary: { de: 's' },
  description: { de: ['d'] },
  color: 'orange',
});
const courses: Course[] = [course('kids', 'Kinderkurs', ['kids']), course('adults', 'Erwachsenenkurs', ['adults'])];
const team: TeamMember[] = [{ id: 'anna', name: 'Anna', role: { de: 'r' }, bio: { de: 'b' }, teaches: { de: [] }, color: 'pink' }];
const entries: ScheduleEntry[] = [
  { id: '2', day: 'mon', start: '18:00', end: '19:00', courseId: 'adults' },
  { id: '1', day: 'mon', start: '15:00', end: '16:00', courseId: 'kids', teacherId: 'anna' },
  { id: '3', day: 'wed', start: '15:00', end: '16:30', courseId: 'kids' },
];

describe('scheduleUtils', () => {
  it('groups Mon→Sun and sorts by start time', () => {
    const groups = groupByDay(entries);
    expect(groups.map((g) => g.day)).toEqual(['mon', 'wed']);
    expect(groups[0]!.entries.map((e) => e.id)).toEqual(['1', '2']);
  });

  it('calendar frame covers full hours and Mon–Fri', () => {
    expect(calendarFrame(entries)).toEqual({ days: ['mon', 'tue', 'wed', 'thu', 'fri'], from: 15 * 60, to: 19 * 60 });
  });
});

describe('<ScheduleView>', () => {
  it('list view: one heading per day, teacher names resolved', async () => {
    renderWithProviders(<ScheduleView entries={entries} courses={courses} team={team} />);
    expect(await screen.findByRole('heading', { name: 'Montag' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mittwoch' })).toBeInTheDocument();
    expect(screen.getByText('Anna')).toBeInTheDocument();
  });

  it('filters by audience and by class', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ScheduleView entries={entries} courses={courses} team={team} />);
    await user.click(await screen.findByRole('button', { name: 'Erwachsene' }));
    expect(screen.getAllByRole('row')).toHaveLength(2); // header + Erwachsenenkurs
    await user.click(screen.getByRole('button', { name: 'Alle' }));
    await user.selectOptions(screen.getByRole('combobox', { name: 'Kurs' }), 'kids');
    expect(screen.getAllByRole('row')).toHaveLength(4); // 2 days × (header + Kinderkurs)
  });

  it('switches to the week calendar with the same filters', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ScheduleView entries={entries} courses={courses} team={team} />);
    await user.click(await screen.findByRole('button', { name: 'Wochenkalender' }));
    expect(screen.getByRole('button', { name: 'Wochenkalender' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(5);
    expect(screen.getAllByText('Kinderkurs', { selector: 'strong' })).toHaveLength(2);
  });
});
