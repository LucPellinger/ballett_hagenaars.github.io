import { useEffect, useState } from 'react';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './TextSizeSwitcher.module.css';

export type VisitorTextSize = 'base' | 'lg' | 'xl';
const SIZES: VisitorTextSize[] = ['base', 'lg', 'xl'];
const STORAGE_KEY = 'bh-text-size';
const EVENT = 'bh-text-size';

function readTextSize(): VisitorTextSize {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === 'lg' || v === 'xl' ? v : 'base';
  } catch {
    return 'base';
  }
}

function apply(size: VisitorTextSize) {
  if (size === 'base') delete document.documentElement.dataset.textSize;
  else document.documentElement.dataset.textSize = size;
  try {
    if (size === 'base') window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, size);
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: size }));
}

/**
 * Text size for visitors: normal / large / extra large (three "A" of growing size).
 * Scales the root font size (all sizes are rem), remembered per browser; index.html applies it
 * before first paint. Works on top of the browser's own font-size setting.
 */
export function TextSizeSwitcher({ className = '' }: { className?: string }) {
  const { t } = useLanguage();
  const [size, setSize] = useState<VisitorTextSize>(readTextSize);
  // Keep several switchers (desktop bar + mobile menu) in sync.
  useEffect(() => {
    const onChange = (e: Event) => setSize((e as CustomEvent<VisitorTextSize>).detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);
  return (
    <div className={`${styles.switcher} ${className}`} role="group" aria-label={t(ui.textSize)}>
      {SIZES.map((s) => (
        <button
          key={s}
          type="button"
          className={`${styles.option} ${styles[s]}`}
          aria-pressed={size === s}
          aria-label={t(ui.textSizes[s])}
          title={t(ui.textSizes[s])}
          onClick={() => apply(s)}
        >
          A
        </button>
      ))}
    </div>
  );
}
