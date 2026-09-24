import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { navigation } from '@/content';
import { renderRoute } from '@/test/renderWithProviders';

describe('every page renders with exactly one <h1>', () => {
  it.each(navigation.map((n) => [n.path] as const))('%s', async (path) => {
    renderRoute(path);
    const h1 = await screen.findAllByRole('heading', { level: 1 }, { timeout: 3000 });
    expect(h1).toHaveLength(1);
    expect(screen.getByRole('link', { name: /Zum Inhalt springen/ })).toHaveAttribute('href', '#main');
  });

  it('unknown URLs show the 404 page', async () => {
    renderRoute('/gibt-es-nicht');
    expect(await screen.findByRole('heading', { level: 1, name: 'Seite nicht gefunden' })).toBeInTheDocument();
  });

  it('pages render in English', async () => {
    renderRoute('/stundenplan', { locale: 'en' });
    expect(await screen.findByRole('heading', { level: 1, name: 'Timetable' })).toBeInTheDocument();
  });
});
