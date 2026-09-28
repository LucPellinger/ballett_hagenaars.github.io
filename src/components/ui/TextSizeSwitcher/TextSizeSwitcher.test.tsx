import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/renderWithProviders';
import { TextSizeSwitcher } from './TextSizeSwitcher';

describe('<TextSizeSwitcher>', () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.textSize;
  });

  it('sets the text size on <html> and remembers it', async () => {
    const user = userEvent.setup();
    renderWithProviders(<TextSizeSwitcher />);
    const normal = await screen.findByRole('button', { name: 'Normale Schrift' });
    expect(normal).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: 'Sehr große Schrift' }));
    expect(document.documentElement.dataset.textSize).toBe('xl');
    expect(localStorage.getItem('bh-text-size')).toBe('xl');

    await user.click(normal);
    expect(document.documentElement.dataset.textSize).toBeUndefined();
    expect(localStorage.getItem('bh-text-size')).toBeNull();
  });
});
