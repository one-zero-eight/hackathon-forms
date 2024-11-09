import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function TermsOfService() {
  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-8 text-3xl font-bold">Условия использования</h1>

      <div className="space-y-8">
        {/* Agreement */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">1. Соглашение</h2>
          <p className="text-muted-foreground">
            Используя платформу КандидатАйКю (далее - "Сервис"), вы соглашаетесь с настоящими условиями использования. 
            Если вы не согласны с каким-либо пунктом условий, вы не можете использовать наш Сервис.
          </p>
        </section>

        {/* Service Description */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">2. Описание сервиса</h2>
          <p className="text-muted-foreground">
            КандидатАйКю предоставляет платформу для создания и управления формами оценки кандидатов. 
            Мы оставляем за собой право изменять, приостанавливать или прекращать работу Сервиса или любой его части 
            в любое время без предварительного уведомления.
          </p>
        </section>

        {/* User Obligations */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">3. Обязательства пользователя</h2>
          <p className="text-muted-foreground">Вы обязуетесь:</p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Предоставлять достоверную информацию при регистрации</li>
            <li>Не передавать доступ к своей учетной записи третьим лицам</li>
            <li>Соблюдать все применимые законы и правила</li>
            <li>Не использовать Сервис для незаконной деятельности</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">4. Интеллектуальная собственность</h2>
          <p className="text-muted-foreground">
            Все права на Сервис, включая авторские права, товарные знаки и другие права интеллектуальной собственности, 
            принадлежат КандидатАйКю или его лицензиарам. Пользователи сохраняют права на свой контент, но предоставляют 
            нам лицензию на его использование в рамках работы Сервиса.
          </p>
        </section>

        {/* Liability */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">5. Ответственность</h2>
          <p className="text-muted-foreground">
            Сервис предоставляется "как есть". Мы не несем ответственности за:
          </p>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>Перерывы в работе Сервиса</li>
            <li>Потерю данных</li>
            <li>Любой косвенный ущерб</li>
            <li>Действия третьих лиц</li>
          </ul>
        </section>

        {/* Data Usage */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">6. Использование данных</h2>
          <p className="text-muted-foreground">
            Обработка персональных данных осуществляется в соответствии с нашей{' '}
            <Link href="/privacy" className="underline hover:text-foreground">
              Политикой конфиденциальности
            </Link>
            . Используя Сервис, вы соглашаетесь на обработку ваших данных согласно этой политике.
          </p>
        </section>

        {/* Termination */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">7. Прекращение доступа</h2>
          <p className="text-muted-foreground">
            Мы оставляем за собой право прекратить или приостановить ваш доступ к Сервису в любое время 
            без предварительного уведомления в случае нарушения условий использования или по другим обоснованным причинам.
          </p>
        </section>

        {/* Changes to Terms */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">8. Изменения условий</h2>
          <p className="text-muted-foreground">
            Мы можем изменять эти условия в любое время. Продолж��я использовать Сервис после внесения изменений, 
            вы принимаете обновленные условия. Рекомендуем периодически проверять эту страницу на наличие изменений.
          </p>
        </section>

        {/* Contact */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">9. Контакты</h2>
          <p className="text-muted-foreground">
            По вопросам, связанным с условиями использования, обращайтесь:
          </p>
          <div className="rounded-lg border p-4">
            <p className="text-muted-foreground">Email: support@kandidatiq.ru</p>
            <p className="text-muted-foreground">Телефон: +7 (XXX) XXX-XX-XX</p>
          </div>
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