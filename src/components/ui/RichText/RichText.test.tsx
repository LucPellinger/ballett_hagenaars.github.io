import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/renderWithProviders';
import { RichText } from './RichText';

describe('<RichText>', () => {
  it('renders links and highlights, and never raw HTML', async () => {
    renderWithProviders(<p><RichText text="Siehe [DBfT](https://www.dbft.de) und **Urban Space** <b>x</b>" /></p>);
    const link = await screen.findByRole('link', { name: /DBfT/ });
    expect(link).toHaveAttribute('href', 'https://www.dbft.de');
    expect(screen.getByText('Urban Space').tagName).toBe('STRONG');
    expect(screen.getByText(/<b>x<\/b>/)).toBeInTheDocument();
  });
});
