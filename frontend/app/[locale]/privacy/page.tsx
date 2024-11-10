import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function PrivacyPolicy() {
  const t = useTranslations('privacy');

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t('title')}</h1>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.introduction.title')}</h2>
          <p className="text-muted-foreground">
            {t('sections.introduction.content')}
          </p>
        </section>

        {/* Data Collection */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.dataCollection.title')}</h2>
          <p className="text-muted-foreground">{t('sections.dataCollection.intro')}</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            {t.raw('sections.dataCollection.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Data Processing */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.dataProcessing.title')}</h2>
          <p className="text-muted-foreground">{t('sections.dataProcessing.intro')}</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            {t.raw('sections.dataProcessing.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* User Rights */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.userRights.title')}</h2>
          <p className="text-muted-foreground">{t('sections.userRights.intro')}</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            {t.raw('sections.userRights.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Security Measures */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.security.title')}</h2>
          <p className="text-muted-foreground">{t('sections.security.intro')}</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            {t.raw('sections.security.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.contact.title')}</h2>
          <p className="text-muted-foreground">{t('sections.contact.intro')}</p>
          <div className="rounded-lg border p-4">
            <p className="font-medium">{t('sections.contact.dpo')}</p>
            <p className="text-muted-foreground">{t('sections.contact.email')}</p>
            <p className="text-muted-foreground">{t('sections.contact.phone')}</p>
          </div>
        </section>

        {/* Cookie Policy */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">{t('sections.cookies.title')}</h2>
          <p className="text-muted-foreground">{t('sections.cookies.intro')}</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            {t.raw('sections.cookies.items').map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </section>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/">
          <Button variant="outline">{t('actions.backToHome')}</Button>
        </Link>
      </div>
    </div>
  );
}