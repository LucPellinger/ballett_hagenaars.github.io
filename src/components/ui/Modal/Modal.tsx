import { useEffect, useRef, type ReactNode } from 'react';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import styles from './Modal.module.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  /** id of the heading inside the modal (accessible name). */
  labelledBy: string;
  children: ReactNode;
  /** Optional colour stripe (CSS colour value). */
  accent?: string;
}

/**
 * Accessible dialog built on <dialog>: focus is trapped and restored by the browser,
 * Escape and backdrop click close it, page scrolling is locked while open.
 */
export function Modal({ open, onClose, labelledBy, children, accent }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal?.();
      document.documentElement.classList.add('modal-open');
    }
    if (!open && d.open) d.close();
    return () => document.documentElement.classList.remove('modal-open');
  }, [open]);

  return (
    // Backdrop click is a mouse convenience; keyboard users close with Escape (native) or the button.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
    <dialog
      ref={ref}
      className={styles.dialog}
      aria-labelledby={labelledBy}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      style={accent ? ({ '--modal-accent': accent } as React.CSSProperties) : undefined}
    >
      <div className={styles.inner}>
        <button type="button" className={styles.close} onClick={onClose} aria-label={t(ui.close)}>
          <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" focusable="false">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
        {open && children}
      </div>
    </dialog>
  );
}
