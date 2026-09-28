import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { isPreview } from '@/config/env';
import { Footer } from '../Footer';
import { Header } from '../Header';
import { PreviewBanner } from '../PreviewBanner';
import { SkipLink } from '../SkipLink';
import styles from './Layout.module.css';

/**
 * App shell: skip link → header → main → footer.
 * On every route change we scroll to the top and move focus to <main>,
 * so screen-reader users hear the new page instead of staying in the menu.
 */
export function Layout() {
  const { pathname } = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const lastPath = useRef(pathname);

  useEffect(() => {
    // Only on real navigations (StrictMode runs effects twice on mount).
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <SkipLink />
      {isPreview && <PreviewBanner />}
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1} className={styles.main}>
        <Suspense fallback={<div className={styles.loading} aria-hidden="true" />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
