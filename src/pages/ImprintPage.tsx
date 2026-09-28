import { imprint, site, ui } from '@/content';
import { useLanguage } from '@/i18n';
import { LegalContent } from '@/components/features';
import { PageShell } from './PageShell';

export function ImprintPage() {
  const { t } = useLanguage();
  return (
    <PageShell page="imprint">
      <div className="prose">
        <h2>{t({ de: 'Angaben gemäß § 5 DDG', en: 'Information pursuant to § 5 DDG' })}</h2>
        <p>
          {site.name}
          <br />
          {site.owner.name}, {t(site.owner.title)}
          <br />
          {site.address.street}, {site.address.zip} {site.address.city}, {t(site.address.country)}
        </p>
        <p>
          {t(ui.phone)}: <a href={site.phone.href}>{site.phone.display}</a>
          <br />
          {t(ui.email)}: <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
        <p>
          {t({ de: 'Steuernummer', en: 'Tax number' })}: {site.taxId}
        </p>
        <LegalContent page={imprint} />
      </div>
    </PageShell>
  );
}
