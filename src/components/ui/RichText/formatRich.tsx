import type { ReactNode } from 'react';
import { SmartLink } from '../SmartLink';

/**
 * Tiny, safe formatter for content text (no HTML):
 *   [Linktext](https://…)  or  [Linktext](/interne-seite)  → link
 *   **Wort**                                               → highlighted (orange)
 */
const TOKEN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;

export function formatRich(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(TOKEN)) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      out.push(
        <SmartLink key={key++} href={m[2]}>
          {m[1]}
        </SmartLink>,
      );
    } else if (m[3]) {
      out.push(
        <strong key={key++} className="hl">
          {m[3]}
        </strong>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

