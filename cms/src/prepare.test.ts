import { describe, expect, it } from 'vitest';
import type { AllContent } from '@/content/collections';
import { prepare } from './prepare';

const all = {} as AllContent;

describe('editor prepare()', () => {
  it('drops empty English texts and empty lines, fills missing ids', () => {
    const out = prepare(
      'courses',
      [
        {
          id: '',
          title: { de: '  Ballett für Senioren ', en: '' },
          audience: ['adults'],
          ageGroup: { de: 'ab 60' },
          summary: { de: 'Sanft.' },
          description: { de: ['Absatz 1', '', 'Absatz 2'], en: [''] },
        },
        { id: 'ballett-fuer-senioren', title: { de: 'Doppelt' }, audience: [], ageGroup: { de: 'x' }, summary: { de: 'x' }, description: { de: ['x'] } },
      ],
      all,
    ) as Record<string, unknown>[];
    expect(out[0]).toMatchObject({
      id: 'ballett-fuer-senioren-2',
      title: { de: 'Ballett für Senioren' },
      description: { de: ['Absatz 1', 'Absatz 2'] },
    });
    expect((out[0]!.title as object)).not.toHaveProperty('en');
    expect(out[0]!.description).not.toHaveProperty('en');
  });

  it('removes optional fields left empty', () => {
    const out = prepare('events', [{ id: 'x', title: { de: 'X' }, startDate: '2027-01-01', location: 'H', description: { de: 'D' }, link: { label: { de: '' }, href: '' } }], all) as Record<string, unknown>[];
    expect(out[0]).not.toHaveProperty('link');
  });

  it('fills ids of nested price plans', () => {
    const out = prepare('prices', { plans: [{ id: '', title: { de: '2 × pro Woche' }, details: { de: 'd' }, amount: 50, period: { de: 'p' } }], notes: [] }, all) as {
      plans: { id: string }[];
    };
    expect(out.plans[0]!.id).toBe('2-pro-woche');
  });
});
