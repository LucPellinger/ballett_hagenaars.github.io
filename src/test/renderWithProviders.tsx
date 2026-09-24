import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { LanguageProvider, type Locale } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { routes } from '@/routes';

/** Render a single component with all app providers (router, theme, language). */
export function renderWithProviders(ui: ReactElement, { locale = 'de' as Locale } = {}) {
  const router = createMemoryRouter([{ path: '*', element: ui }]);
  return render(
    <ThemeProvider>
      <LanguageProvider initialLocale={locale}>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>,
  );
}

/** Render the full app at a given URL. */
export function renderRoute(path: string, { locale = 'de' as Locale } = {}) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <ThemeProvider>
      <LanguageProvider initialLocale={locale}>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>,
  );
}
