import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/renderWithProviders';
import { Header } from './Header';

describe('<Header>', () => {
  it('toggles the mobile menu with aria-expanded', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    const button = await screen.findByRole('button', { name: 'Menü öffnen' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    await user.click(button);
    expect(screen.getByRole('button', { name: 'Menü schließen' })).toHaveAttribute('aria-expanded', 'true');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toHaveAttribute('aria-expanded', 'false');
  });

  it('switches language and updates <html lang>', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    const nav = await screen.findByRole('navigation', { name: 'Hauptnavigation' });
    expect(within(nav).getByRole('link', { name: 'Stundenplan' })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'English' }));
    expect(document.documentElement.lang).toBe('en');
    expect(screen.getByRole('link', { name: 'Timetable' })).toBeInTheDocument();
  });

  it('toggles dark mode', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);
    await user.click(await screen.findByRole('button', { name: 'Dunkles Design aktivieren' }));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(screen.getByRole('button', { name: 'Helles Design aktivieren' })).toBeInTheDocument();
  });
});
