# КандидатАйКю

## Запуск

1. Склонируйте репозиторий.
2. Установите Docker и Docker Compose.
3. Скопируйте файл настроек:
    ```bash
    cp backend/settings.example.yaml backend/settings.yaml
    ```
4. Запишите почтовый адрес и пароль от аккаунта в файле настроек `backend/settings.yaml`.
5. Запустите контейнеры:
    ```bash
    docker compose up -d
    ```
