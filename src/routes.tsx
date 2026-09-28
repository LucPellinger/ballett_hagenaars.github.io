import { lazy, type ComponentType } from 'react';
import { Navigate, type RouteObject } from 'react-router';
import { Layout } from '@/components/layout';
import { aboutPage, pathFor, performancePage, pointePage, qualityPage, redirects, type PageId } from '@/content';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { StoryPage } from '@/pages/StoryPage';

// Sub-pages are code-split: each is downloaded only when first visited.
const lazyPage = (load: () => Promise<Record<string, ComponentType>>, name: string) =>
  lazy(() => load().then((m) => ({ default: m[name]! })));

const TeamPage = lazyPage(() => import('@/pages/TeamPage'), 'TeamPage');
const FaqPage = lazyPage(() => import('@/pages/FaqPage'), 'FaqPage');
const NewsPage = lazyPage(() => import('@/pages/NewsPage'), 'NewsPage');
const CoursesPage = lazyPage(() => import('@/pages/CoursesPage'), 'CoursesPage');
const SchedulePage = lazyPage(() => import('@/pages/SchedulePage'), 'SchedulePage');
const PricesPage = lazyPage(() => import('@/pages/PricesPage'), 'PricesPage');
const GalleryPage = lazyPage(() => import('@/pages/GalleryPage'), 'GalleryPage');
const ContactPage = lazyPage(() => import('@/pages/ContactPage'), 'ContactPage');
const ImprintPage = lazyPage(() => import('@/pages/ImprintPage'), 'ImprintPage');
const PrivacyPage = lazyPage(() => import('@/pages/PrivacyPage'), 'PrivacyPage');

/** Which element renders which page. URLs come from src/content/navigation.ts. */
const pageElements: Record<Exclude<PageId, 'home'>, React.ReactElement> = {
  about: <StoryPage page="about" content={aboutPage} />,
  quality: <StoryPage page="quality" content={qualityPage} />,
  pointe: <StoryPage page="pointe" content={pointePage} />,
  performance: <StoryPage page="performance" content={performancePage} />,
  team: <TeamPage />,
  faq: <FaqPage />,
  news: <NewsPage />,
  courses: <CoursesPage />,
  schedule: <SchedulePage />,
  prices: <PricesPage />,
  gallery: <GalleryPage />,
  contact: <ContactPage />,
  imprint: <ImprintPage />,
  privacy: <PrivacyPage />,
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      ...Object.entries(pageElements).map(([page, element]) => ({
        path: pathFor(page as PageId).replace(/^\//, ''),
        element,
      })),
      ...Object.entries(redirects).map(([from, to]) => ({
        path: from.replace(/^\//, ''),
        element: <Navigate to={to} replace />,
      })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
