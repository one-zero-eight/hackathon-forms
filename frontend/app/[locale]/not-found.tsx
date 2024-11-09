"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">{t('title')}</h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('subtitle')}
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('description')}
          </p>
        </div>

        <pre className="font-mono text-sm sm:text-base whitespace-pre select-none mx-auto">
{`    ⊂_ヽ
　 ＼＼  
　　 ＼( ͡° ͜ʖ ͡°)
　　　 >　⌒ヽ
　　　/ 　 へ＼
　　 /　　/　＼＼
　　 ﾚ　ノ　　 ヽ_つ
　　/　/
　 /　/|
　(　(ヽ
　|　|、＼
　| 丿 ＼ ⌒)
　| |　　) /
 ノ )　　Lﾉ
(_／`}</pre>

        <div className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">{t('actions.home')}</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            {t('actions.back')}
          </Button>
        </div>
      </div>
    </div>
  );
} 