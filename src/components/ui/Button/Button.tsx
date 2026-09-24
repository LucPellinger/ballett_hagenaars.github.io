import type { ReactNode } from 'react';
import { SmartLink } from '../SmartLink';
import styles from './Button.module.css';

export interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'poster' | 'posterOutline';
}

/** Call-to-action rendered as a link (all CTAs on this site navigate somewhere). */
export function ButtonLink({ href, children, variant = 'primary' }: ButtonLinkProps) {
  return (
    <SmartLink href={href} className={`${styles.button} ${styles[variant]}`}>
      {children}
    </SmartLink>
  );
}
