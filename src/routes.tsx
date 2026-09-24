import { lazy, type ComponentType } from 'react';
import type { RouteObject } from 'react-router';
import { Layout } from '@/components/layout';
import { pathFor, type PageId } from '@/content';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';

// Sub-pages are code-split: each is downloaded only when first visited.
const CoursesPage = lazy(() => import('@/pages/CoursesPage').then((m) => ({ default: m.CoursesPage })));
const SchedulePage = lazy(() => import('@/pages/SchedulePage').then((m) => ({ default: m.SchedulePage })));
const PricesPage = lazy(() => import('@/pages/PricesPage').then((m) => ({ default: m.PricesPage })));
const SchoolPage = lazy(() => import('@/pages/SchoolPage').then((m) => ({ default: m.SchoolPage })));
const EventsPage = lazy(() => import('@/pages/EventsPage').then((m) => ({ default: m.EventsPage })));
const GalleryPage = lazy(() => import('@/pages/GalleryPage').then((m) => ({ default: m.GalleryPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then((m) => ({ default: m.ContactPage })));
const ImprintPage = lazy(() => import('@/pages/ImprintPage').then((m) => ({ default: m.ImprintPage })));
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage').then((m) => ({ default: m.PrivacyPage })));

/** Which component renders which page. URLs come from src/content/navigation.ts. */
const pageComponents: Record<Exclude<PageId, 'home'>, ComponentType> = {
  courses: CoursesPage,
  schedule: SchedulePage,
  prices: PricesPage,
  school: SchoolPage,
  events: EventsPage,
  gallery: GalleryPage,
  contact: ContactPage,
  imprint: ImprintPage,
  privacy: PrivacyPage,
};

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      ...Object.entries(pageComponents).map(([page, Component]) => ({
        path: pathFor(page as PageId).replace(/^\//, ''),
        element: <Component />,
      })),
      { path: '*', element: <NotFoundPage /> },
    ],
  },
];
