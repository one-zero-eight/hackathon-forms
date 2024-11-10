# КандидатАйКю

## Запуск проекта

Требования:
- Должны быть установлены Docker и Docker Compose 

##### Шаг 1.

Склонируйте репозиторий:

```
git clone https://github.com/Hackathon-qualify-championship-RT/students5.git
```

##### Шаг 2.

Скопируйте файл настроек `./backend/settings.example.yaml` -> `./backend/settings.yaml`:

```
cp backend/settings.example.yaml backend/settings.yaml
```

##### Шаг 3.

Обновите следующие настройки в новом файле `./backend/settings.yaml`:

- smtp -> username - ваша почта на yandex.ru
- smtp -> password - пароль от почты на yandex.ru
- first_user -> email

##### Шаг 4.

Запустите проект (из корневой папки проекта):

```
docker compose -f docker-compose.yaml up --build
```

После запуска, проект будет доступен по пути: [http://localhost:8000](http://localhost:8000)

Входить нужно с почтой, указанной в `./backend/settings.yaml` (first_user -> email).
Если проблемы с доставкой письма, можно использовать тестовый код `666666` (используется только для демонстрации).
