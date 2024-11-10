from src.modules.forms.schemas import CreateFormReq

json__ = """
{
  "title": "Тестирование для разработчиков Flutter для трудоустройства в Озон",
  "description": "Эта форма предназначена для оценки знаний Flutter-разработчиков, которые претендуют на трудоустройство в компанию Озон.",
  "nodes": [
    {
      "id": 1,
      "content": {
        "title": "Вопрос 1",
        "md_content": "Что такое **Flutter** и для чего он используется?",
        "medias": []
      },
      "question": {
        "question_type": "input",
        "textarea": true,
        "explanation": {
          "explanation": "Flutter позволяет создавать кроссплатформенные мобильные приложения на базе единого кода.",
          "for_correct_answer_too": true
        }
      },
      "required": true,
      "next_node": 2
    },
    {
      "id": 2,
      "content": {
        "title": "Вопрос 2",
        "md_content": "Какой основной язык программирования используется в Flutter?",
        "medias": []
      },
      "question": {
        "question_type": "select",
        "options": [
          "Java",
          "Kotlin",
          "Swift",
          "Dart"
        ],
        "correct_answer": null,
        "explanation": {
          "explanation": "Основной язык Flutter — Dart, разработанный Google для удобной кроссплатформенной разработки.",
          "for_correct_answer_too": false
        }
      },
      "required": true,
      "next_node": 3
    },
    {
      "id": 3,
      "content": {
        "title": "Вопрос 3",
        "md_content": "Какие виджеты вы бы использовали для реализации навигации?",
        "medias": []
      },
      "question": {
        "question_type": "multiple_choice",
        "options": [
          "Navigator",
          "Scaffold",
          "BottomNavigationBar",
          "ListView"
        ],
        "correct_answer": null,
        "explanation": {
          "explanation": "Для навигации обычно используются виджеты Navigator и BottomNavigationBar.",
          "for_correct_answer_too": false
        }
      },
      "required": true,
      "next_node": 4
    },
    {
      "id": 4,
      "content": {
        "title": "Вопрос 4",
        "md_content": "Оцените ваш опыт работы с Flutter от 1 до 5.",
        "medias": []
      },
      "question": {
        "question_type": "scale",
        "scale": [
          "1 - Начинающий",
          "2 - Знаком с основами",
          "3 - Средний уровень",
          "4 - Продвинутый",
          "5 - Эксперт"
        ]
      },
      "required": true,
      "next_node": 5
    },
    {
      "id": 5,
      "content": {
        "title": "Вопрос 5",
        "md_content": "Выберите правильное соответствие между виджетами и их основными задачами.",
        "medias": []
      },
      "question": {
        "question_type": "matching",
        "options_first": [
          "Text",
          "Image",
          "Column",
          "Padding"
        ],
        "options_second": [
          "Отображение текста",
          "Отображение изображения",
          "Расположение виджетов вертикально",
          "Добавление отступов"
        ],
        "correct_answer": null,
        "explanation": {
          "explanation": "Эти виджеты используются для различных UI-элементов и организации в Flutter.",
          "for_correct_answer_too": false
        }
      },
      "required": true,
      "next_node": 6
    },
    {
      "id": 6,
      "content": {
        "title": "Вопрос 6",
        "md_content": "Что из этого не является преимуществом использования Flutter?",
        "medias": []
      },
      "question": {
        "question_type": "select",
        "options": [
          "Высокая производительность",
          "Поддержка широкого спектра платформ",
          "Использование нативного UI",
          "Быстрая разработка"
        ],
        "correct_answer": null,
        "explanation": {
          "explanation": "Flutter не использует нативные элементы UI, а вместо этого рендерит все элементы сам.",
          "for_correct_answer_too": false
        }
      },
      "required": true,
      "next_node": 7
    },
    {
      "id": 7,
      "content": {
        "title": "Вопрос 7",
        "md_content": "Какие библиотеки и пакеты для управления состоянием вы использовали в проектах на Flutter?",
        "medias": []
      },
      "question": {
        "question_type": "input",
        "textarea": true
      },
      "required": true,
      "next_node": 8
    },
    {
      "id": 8,
      "content": {
        "title": "Вопрос 8",
        "md_content": "Предоставьте ссылку на ваш репозиторий GitHub с примерами работ на Flutter.",
        "medias": []
      },
      "question": {
        "question_type": "list_of_links"
      },
      "required": false,
      "next_node": 9
    },
    {
      "id": 9,
      "content": {
        "title": "Вопрос 9",
        "md_content": "Укажите порядок жизненного цикла виджетов Stateful в Flutter.",
        "medias": []
      },
      "question": {
        "question_type": "ranking",
        "options": [
          "initState",
          "build",
          "dispose",
          "setState"
        ],
        "correct_answer": null,
        "explanation": {
          "explanation": "Правильный порядок жизненного цикла: initState, build, setState, dispose.",
          "for_correct_answer_too": true
        }
      },
      "required": true,
      "next_node": 10
    },
    {
      "id": 10,
      "content": {
        "title": "Вопрос 10",
        "md_content": "С каким форматом данных вы работаете для сериализации в Flutter? (например, JSON, XML и т.д.)",
        "medias": []
      },
      "question": {
        "question_type": "input",
        "textarea": false,
        "correct_answer": null,
        "explanation": {
          "explanation": "Чаще всего для сериализации используется формат JSON.",
          "for_correct_answer_too": true
        }
      },
      "required": true
    }
  ]
}
"""

as_create_form = CreateFormReq.model_validate_json(json__)
