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

- TODO

##### Шаг 4.

Запустите проект (из корневой папки проекта):

```
docker compose -f docker-compose.yaml up --build
```

После запуска, проект будет доступен по пути: [http://localhost](http://localhost)
