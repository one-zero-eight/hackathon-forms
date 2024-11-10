import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function TermsOfService() {
  const t = useTranslations('terms');
  const commonT = useTranslations('common');

  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight">{t('title')}</h1>
      </header>

      <div className="prose prose-neutral max-w-none dark:prose-invert space-y-12">
        {/* Introduction */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">{t('sections.introduction.title')}</h2>
          <p className="text-muted-foreground text-lg">
            {t('sections.introduction.content')}
          </p>
        </section>

        {/* Service Description */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">{t('sections.serviceDescription.title')}</h2>
          <p className="text-muted-foreground text-lg">
            {t('sections.serviceDescription.content')}
          </p>
        </section>

        {/* User Obligations Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {t('sections.userObligations.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('sections.userObligations.intro')}
          </p>
          <ul className="space-y-3 list-disc pl-6">
            {t.raw('sections.userObligations.items').map((item: string, index: number) => (
              <li key={index} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Intellectual Property Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {t('sections.intellectualProperty.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('sections.intellectualProperty.content')}
          </p>
        </section>

        {/* Liability Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">
            {t('sections.liability.title')}
          </h2>
          <p className="text-muted-foreground text-lg">
            {t('sections.liability.intro')}
          </p>
          <ul className="space-y-3 list-disc pl-6">
            {t.raw('sections.liability.items').map((item: string, index: number) => (
              <li key={index} className="text-muted-foreground">
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Data Protection */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">{t('sections.dataProtection.title')}</h2>
          <p className="text-muted-foreground text-lg">
            {t('sections.dataProtection.content')}
          </p>
        </section>

        {/* Termination */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">{t('sections.termination.title')}</h2>
          <p className="text-muted-foreground text-lg">
            {t('sections.termination.content')}
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">{t('sections.changes.title')}</h2>
          <p className="text-muted-foreground text-lg">
            {t('sections.changes.content')}
          </p>
        </section>

        {/* Back Button */}
        <div className="pt-8">
          <Link href="/">
            <Button variant="outline" size="lg">
              {commonT('actions.back')}
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}

// Add metadata
export const metadata = {
  title: 'Terms of Service - CandidateIQ',
  description: 'Terms of Service and User Agreement for CandidateIQ platform',
}; 