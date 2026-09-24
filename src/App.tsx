import { createBrowserRouter, RouterProvider } from 'react-router';
import { LanguageProvider } from '@/i18n';
import { ThemeProvider } from '@/theme';
import { routes } from './routes';

const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  );
}
