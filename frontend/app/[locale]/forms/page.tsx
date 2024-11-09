"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FormsPage() {
  const t = useTranslations('forms.list');

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <Button asChild>
            <Link href="/forms/create">{t('createNew')}</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('empty')}</CardTitle>
            <CardDescription>{t('createFirst')}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href="/forms/create">{t('createNew')}</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
