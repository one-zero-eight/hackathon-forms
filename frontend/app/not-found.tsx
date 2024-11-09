"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center px-4 text-center">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Страница не найдена
          </h2>
          <p className="text-lg text-muted-foreground">
            Извините, мы не смогли найти страницу, которую вы ищете.
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
            <Link href="/">На главную</Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
} 