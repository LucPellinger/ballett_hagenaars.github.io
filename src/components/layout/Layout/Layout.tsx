import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router';
import { Footer } from '../Footer';
import { Header } from '../Header';
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
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    window.scrollTo({ top: 0 });
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (
    <>
      <SkipLink />
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
