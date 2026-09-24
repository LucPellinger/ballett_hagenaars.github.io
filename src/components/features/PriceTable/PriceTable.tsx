import type { Localized, PricePlan } from '@/content';
import { formatPrice, useLanguage } from '@/i18n';
import { PlaceholderBadge } from '@/components/ui';
import styles from './PriceTable.module.css';

export interface PriceTableProps {
  plans: PricePlan[];
  notes?: Localized[];
}

const ON_REQUEST: Localized = { de: 'auf Anfrage', en: 'on request' };

export function PriceTable({ plans, notes = [] }: PriceTableProps) {
  const { t, locale } = useLanguage();
  return (
    <div>
      <ul className={styles.plans}>
        {plans.map((plan) => (
          <li key={plan.id} className={`${styles.plan} ${plan.highlight ? styles.highlight : ''}`}>
            <h2 className={styles.title}>
              {t(plan.title)}
              <PlaceholderBadge status={plan.status} />
            </h2>
            <p className={styles.details}>{t(plan.details)}</p>
            <p className={styles.price}>
              <strong>{plan.amount === null ? t(ON_REQUEST) : formatPrice(plan.amount, locale)}</strong>{' '}
              {plan.amount !== null && <span>{t(plan.period)}</span>}
            </p>
          </li>
        ))}
      </ul>
      {notes.length > 0 && (
        <ul className={styles.notes}>
          {notes.map((n, i) => (
            <li key={i}>{t(n)}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
