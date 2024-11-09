import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function TermsOfService() {
  const t = useTranslations('terms');

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>

        {/* User Obligations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.userObligations.title')}</h2>
          <p className="text-muted-foreground">{t('sections.userObligations.intro')}</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            {t.raw('sections.userObligations.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.intellectualProperty.title')}</h2>
          <p className="text-muted-foreground">
            {t('sections.intellectualProperty.content')}
          </p>
        </section>

        {/* Liability */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.liability.title')}</h2>
          <p className="text-muted-foreground">{t('sections.liability.intro')}</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            {t.raw('sections.liability.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
} 