import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';

export interface SmartLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  external?: boolean;
}

/** Internal paths use client-side routing; external URLs open in a new tab with an a11y hint. */
export function SmartLink({ href, children, className, external }: SmartLinkProps) {
  const { t } = useLanguage();
  const isExternal = external ?? /^(https?:)?\/\//.test(href);
  const isProtocol = /^(mailto|tel):/.test(href);

  if (isProtocol) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  if (isExternal) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="visually-hidden"> {t(ui.opensInNewTab)}</span>
      </a>
    );
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  );
}
