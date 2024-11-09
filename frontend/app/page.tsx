import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Users, Lock, BarChart } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="sm:text-center lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
                Создавайте мощные формы для оценки кандидатов
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Простой и эффективный способ создания форм для оценки кандидатов. Создавайте, делитесь и анализируйте результаты в одном месте.
              </p>
              <div className="mt-8 flex gap-x-4">
                <Button asChild size="lg">
                  <Link href="/forms">
                    Начать <ArrowRight />
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
                Все необходимое для создания эффективных форм
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground sm:mt-4">
                Наш конструктор форм содержит все функции, необходимые для создания профессиональных форм и опросов.
              </p>
            </div>

            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <Feature
                icon={FileText}
                title="Drag & Drop Конструктор"
                description="Интуитивный интерфейс для создания форм за считанные минуты"
              />
              <Feature
                icon={Users}
                title="Совместная работа"
                description="Делитесь формами с командой и работайте вместе"
              />
              <Feature
                icon={Lock}
                title="Контроль доступа"
                description="Управляйте тем, кто может просматривать и отправлять ответы"
              />
              <Feature
                icon={BarChart}
                title="Аналитика"
                description="Получайте аналитику по ответам с помощью мощных инструментов"
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
                  Готовы начать?
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/80">
                  Присоединяйтесь к тысячам команд, которые уже используют наш конструктор форм для сбора и анализа данных.
                </p>
                <div className="mt-8">
                  <Link href="/forms">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="gap-2 text-primary"
                    >
                      Создать первую форму
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
              Политика конфиденциальности
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Условия использования
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} КандидатАйКю. Все права защищены.
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
