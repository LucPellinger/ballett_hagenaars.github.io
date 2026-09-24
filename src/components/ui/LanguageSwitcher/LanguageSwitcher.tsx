import { ui } from '@/content';
import { LOCALES, useLanguage } from '@/i18n';
import styles from './LanguageSwitcher.module.css';

const LABELS = { de: { short: 'DE', long: 'Deutsch' }, en: { short: 'EN', long: 'English' } } as const;

/** DE | EN toggle. Each option is announced in its own language (lang attribute). */
export function LanguageSwitcher() {
  const { locale, setLocale, t } = useLanguage();
  return (
    <div className={styles.switcher} role="group" aria-label={t(ui.language)}>
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          lang={l}
          className={styles.option}
          aria-pressed={locale === l}
          aria-label={LABELS[l].long}
          onClick={() => setLocale(l)}
        >
          {LABELS[l].short}
        </button>
      ))}
    </div>
  );
}
