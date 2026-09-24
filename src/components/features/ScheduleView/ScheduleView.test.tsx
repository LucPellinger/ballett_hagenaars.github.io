import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { Course, ScheduleEntry, TeamMember } from '@/content';
import { renderWithProviders } from '@/test/renderWithProviders';
import { ScheduleView } from './ScheduleView';
import { groupByDay } from './scheduleUtils';

const courses: Course[] = [
  { id: 'kids', title: { de: 'Kinderkurs' }, audience: ['kids'], ageGroup: { de: '4+' }, summary: { de: 's' }, description: { de: ['d'] } },
  { id: 'adults', title: { de: 'Erwachsenenkurs' }, audience: ['adults'], ageGroup: { de: '18+' }, summary: { de: 's' }, description: { de: ['d'] } },
];
const team: TeamMember[] = [{ id: 'anna', name: 'Anna', role: { de: 'r' }, bio: { de: 'b' }, teaches: { de: [] } }];
const entries: ScheduleEntry[] = [
  { id: '2', day: 'mon', start: '18:00', end: '19:00', courseId: 'adults' },
  { id: '1', day: 'mon', start: '15:00', end: '16:00', courseId: 'kids', teacherId: 'anna' },
  { id: '3', day: 'wed', start: '15:00', end: '16:00', courseId: 'kids' },
];

describe('groupByDay', () => {
  it('orders days Mon→Sun and entries by start time', () => {
    const groups = groupByDay(entries);
    expect(groups.map((g) => g.day)).toEqual(['mon', 'wed']);
    expect(groups[0]!.entries.map((e) => e.id)).toEqual(['1', '2']);
  });
});

describe('<ScheduleView>', () => {
  it('renders one heading per day and resolves teacher names', async () => {
    renderWithProviders(<ScheduleView entries={entries} courses={courses} team={team} />);
    expect(await screen.findByRole('heading', { name: 'Montag' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Mittwoch' })).toBeInTheDocument();
    expect(screen.getByText('Anna')).toBeInTheDocument();
  });

  it('filters by audience', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ScheduleView entries={entries} courses={courses} team={team} />);
    await user.click(await screen.findByRole('button', { name: 'Erwachsene' }));
    expect(screen.getByRole('button', { name: 'Erwachsene' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.queryByText('Kinderkurs')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Mittwoch' })).not.toBeInTheDocument();
  });
});
