import type { TeamMember } from '@/content';
import { ui } from '@/content';
import { useLanguage } from '@/i18n';
import { PlaceholderBadge } from '@/components/ui';
import styles from './TeamGrid.module.css';

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

export function TeamGrid({ members }: { members: TeamMember[] }) {
  const { t } = useLanguage();
  return (
    <ul className={styles.grid}>
      {members.map((m) => (
        <li key={m.id} className={styles.card}>
          {m.photo ? (
            <img className={styles.photo} src={m.photo.src} alt={t(m.photo.alt)} loading="lazy" />
          ) : (
            <div className={styles.monogram} aria-hidden="true">
              {initials(m.name)}
            </div>
          )}
          <h3 className={styles.name}>
            {m.name}
            <PlaceholderBadge status={m.status} />
          </h3>
          <p className={styles.role}>{t(m.role)}</p>
          <p>{t(m.bio)}</p>
          <p className={styles.teaches}>
            <strong>{t(ui.teaches)}:</strong> {t(m.teaches).join(', ')}
          </p>
        </li>
      ))}
    </ul>
  );
}
