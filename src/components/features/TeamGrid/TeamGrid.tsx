import { useSearchParams } from 'react-router';
import type { TeamMember } from '@/content';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import { PlaceholderBadge } from '@/components/ui';
import { paletteVars } from '@/styles/palette';
import { TeamModal } from './TeamModal';
import styles from './TeamGrid.module.css';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/**
 * Portrait wall. Hover/focus turns a portrait black & white and reveals name + subjects;
 * click opens the "Wer ist …?" profile (deep link: ?person=<id>).
 */
export function TeamGrid({ members }: { members: TeamMember[] }) {
  const { t } = useLanguage();
  const [params, setParams] = useSearchParams();
  const openId = params.get('person');
  const openIndex = members.findIndex((m) => m.id === openId);

  const open = (id: string | null) =>
    setParams(
      (p) => {
        const n = new URLSearchParams(p);
        if (id) n.set('person', id);
        else n.delete('person');
        return n;
      },
      { replace: true, preventScrollReset: true },
    );

  return (
    <>
      <ul className={styles.grid}>
        {members.map((m) => (
          <li key={m.id} className={styles.cell} style={paletteVars(m.color) as React.CSSProperties}>
            <button type="button" className={styles.tile} onClick={() => open(m.id)} aria-haspopup="dialog">
              {m.photo?.src ? (
                <img className={styles.photo} src={m.photo.src} alt="" loading="lazy" width={m.photo.width} height={m.photo.height} />
              ) : (
                <span className={`display ${styles.monogram}`} aria-hidden="true">
                  {initials(m.name)}
                </span>
              )}
              <span className={styles.overlay}>
                <span className={`display ${styles.name}`}>{m.name}</span>
                <span className={styles.subjects}>{t(m.teaches).join(' • ')}</span>
                <span className="visually-hidden">
                  {' – '}
                  {t(ui.moreAbout)} {m.name}
                </span>
              </span>
            </button>
            <PlaceholderBadge status={m.status} />
          </li>
        ))}
      </ul>
      {openIndex >= 0 && <TeamModal member={members[openIndex]!} index={openIndex} onClose={() => open(null)} />}
    </>
  );
}
