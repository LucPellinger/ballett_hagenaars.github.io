import { Fragment } from 'react';
import { formatRich } from './formatRich';

export function RichText({ text }: { text: string }) {
  return <>{formatRich(text)}</>;
}

export function RichParagraphs({ items, className }: { items: string[]; className?: string }) {
  return (
    <>
      {items.map((p, i) => (
        <p key={i} className={className}>
          {formatRich(p).map((n, j) => (
            <Fragment key={j}>{n}</Fragment>
          ))}
        </p>
      ))}
    </>
  );
}
