import type { TeamMember } from '@/content';
import { textSizeProps, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { Modal, RichParagraphs } from '@/components/ui';
import styles from './TeamGrid.module.css';

/** "Wer ist …?" profile: big two-line heading overlapping a B/W photo, story text beside it. */
export function TeamModal({ member, index, onClose }: { member: TeamMember; index: number; onClose: () => void }) {
  const { t } = useLanguage();
  const headingId = `person-${member.id}`;
  const photo = member.actionPhoto?.src ? member.actionPhoto : member.photo;
  const story = member.story ? t(member.story) : [];
  return (
    <Modal open onClose={onClose} labelledBy={headingId} accent={`var(--palette-${member.color})`}>
      <article className={`${styles.profile} ${index % 2 ? styles.profileReverse : ''}`} {...textSizeProps(member.textSize)}>
        <h2 id={headingId} className={`display ${styles.whoIs}`}>
          <span className={styles.whoIsLine}>{t(ui.whoIs)}</span>
          <span className={styles.whoIsName}>{member.name}?</span>
        </h2>
        <div className={styles.profilePhoto}>
          {photo?.src ? (
            <img src={photo.src} alt={t(photo.alt)} width={photo.width} height={photo.height} />
          ) : (
            <div className={styles.photoFallback} aria-hidden="true" />
          )}
        </div>
        <div className={styles.profileText}>
          <p className={styles.role}>{t(member.role)}</p>
          {story.length ? <RichParagraphs items={story} /> : <p>{t(member.bio)}</p>}
          <p className={styles.teaches}>
            <strong>{t(ui.teaches)}:</strong> {t(member.teaches).join(', ')}
          </p>
        </div>
      </article>
    </Modal>
  );
}
