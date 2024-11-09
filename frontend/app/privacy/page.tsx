import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Политика конфиденциальности</h1>

      <div className="space-y-8">
        {/* Introduction */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Введение</h2>
          <p className="text-muted-foreground">
            КандидатАйКю (далее - "мы", "наш" или "платформа") обязуется защищать вашу конфиденциальность. 
            Эта политика описывает, как мы собираем, используем и защищаем ваши персональные данные в соответствии 
            с Общим регламентом по защите данных (GDPR) и Федеральным законом "О персональных данных" (ФЗ-152).
          </p>
        </section>

        {/* Data Collection */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Сбор данных</h2>
          <p className="text-muted-foreground">Мы собираем следующие типы данных:</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Информация профиля (имя, email)</li>
            <li>Данные об использовании платформы</li>
            <li>Технические данные (IP-адрес, тип браузера)</li>
            <li>Файлы cookie и подобные технологии</li>
          </ul>
        </section>

        {/* Data Processing */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Обработка данных</h2>
          <p className="text-muted-foreground">
            Мы обрабатываем ваши данные для следующих целей:
          </p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Предоставление доступа к платформе</li>
            <li>Улучшение пользовательского опыта</li>
            <li>Обеспечение безопасности</li>
            <li>Соблюдение законодательных требований</li>
          </ul>
        </section>

        {/* User Rights */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Права пользователей</h2>
          <p className="text-muted-foreground">Вы имеете право:</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Получать доступ к своим данным</li>
            <li>Исправлять неточные данные</li>
            <li>Удалять свои данные</li>
            <li>Ограничивать обработку данных</li>
            <li>Отзывать согласие на обработку</li>
          </ul>
        </section>

        {/* Security Measures */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Меры безопасности</h2>
          <p className="text-muted-foreground">
            Мы применяем следующие меры для защиты ваших данных:
          </p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Шифрование данных при передаче и хранении</li>
            <li>Регулярные проверки безопасности</li>
            <li>Строгий контроль доступа</li>
            <li>Регулярное обучение персонала</li>
          </ul>
        </section>

        {/* Contact Information */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Контактная информация</h2>
          <p className="text-muted-foreground">
            По вопросам обработки персональных данных вы можете связаться с нашим 
            специалистом по защите данных:
          </p>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Специалист по защите данных</p>
            <p className="text-muted-foreground">Email: dpo@kandidatiq.ru</p>
            <p className="text-muted-foreground">Телефон: +7 (XXX) XXX-XX-XX</p>
          </div>
        </section>

        {/* Cookie Policy */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Политика использования cookie</h2>
          <p className="text-muted-foreground">
            Мы используем следующие типы cookie:
          </p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Необходимые для работы сайта</li>
            <li>Аналитические</li>
            <li>Функциональные</li>
          </ul>
        </section>
      </div>

      <div className="mt-8 flex justify-center">
        <Link href="/">
          <Button variant="outline">Вернуться на главную</Button>
        </Link>
      </div>
    </div>
  );
} 