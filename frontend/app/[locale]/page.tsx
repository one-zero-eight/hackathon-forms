import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users, Lock, BarChart } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations("home");
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                {t('hero.title')}
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                {t('hero.description')}
              </p>
              <div className="mt-8 flex gap-x-4">
                <Button asChild size="lg">
                  <Link href="/forms">
                    {t('hero.cta')} <ArrowRight />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="mt-12 lg:col-span-6 lg:mt-0">
              <div className="relative">
                <Image
                  src="/form-builder-preview.png"
                  alt="Form Builder Preview"
                  width={800}
                  height={600}
                  className="rounded-lg shadow-xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-slate-50 dark:bg-slate-900">
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t('features.title')}
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:mt-4">
                {t('features.description')}
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={FileText}
                title={t('features.items.builder.title')}
                description={t('features.items.builder.description')}
              />
              <Feature
                icon={Users}
                title={t('features.items.collaboration.title')}
                description={t('features.items.collaboration.description')}
              />
              <Feature
                icon={Lock}
                title={t('features.items.access.title')}
                description={t('features.items.access.description')}
              />
              <Feature
                icon={BarChart}
                title={t('features.items.analytics.title')}
                description={t('features.items.analytics.description')}
              />
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-primary px-6 py-16 sm:p-16">
            <div className="mx-auto max-w-xl lg:max-w-none">
              <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight text-primary-foreground sm:text-3xl">
                  {t('cta.title')}
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                  {t('cta.description')}
                </p>
                <div className="mt-8">
                  <Link href="/forms">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="gap-2 text-primary"
                    >
                      {t('cta.button')}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('privacy.title')}
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {t('terms.title')}
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t('copyright')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="relative rounded-lg border bg-background p-6">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </div>
  );
}
