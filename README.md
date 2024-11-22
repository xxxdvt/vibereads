# 📚 VibeReads

**VibeReads** — это онлайн-библиотека, предлагающая уникальный подход к поиску книг на основе настроения и эмоционального состояния пользователя. Проект создан, чтобы каждый читатель смог подобрать книгу, которая лучше всего соответствует его текущим переживаниям.

## 🌟 Описание проекта

VibeReads позволяет пользователям исследовать литературные произведения с учетом их эмоциональных предпочтений, предлагая книги для разных состояний — будь то радость, грусть или вдохновение. Сайт также поддерживает классический поиск по названию книг и авторам, а благодаря возможности регистрации пользователи могут добавлять книги в избранное и оставлять личные оценки.

### 🔍 Ключевые функции:

- **Поиск книг по настроению:** Платформа анализирует запросы пользователей и рекомендует книги, соответствующие заданным эмоциональным параметрам.
- **Классический поиск:** Возможность поиска по названию книг или авторам.
- **Система оценок и избранного:** Зарегистрированные пользователи могут оценивать книги и добавлять их в раздел "Избранное".

[//]: # (- **Адаптивный дизайн:** Проект оптимизирован для использования на различных устройствах, включая мобильные телефоны и планшеты.)

## 🚀 Технологический стек

- **Frontend:** React, SCSS
- **Backend:** Flask
- **База данных:** PostgreSQL, MongoDB
- **Прочие инструменты:** JavaScript, HTML, CSS, tailwindCSS, Material UI

## 🛠 Установка и запуск

Следуйте этим шагам для локальной установки и запуска VibeReads:

1. **Клонируйте репозиторий:**

   ```bash
   git clone https://github.com/xxxdvt/vibereads.git
   ```

2. **Перейдите в директорию проекта:**

   ```bash
   cd vibereads
   ```

3. **Установка зависимостей frontend:**

   ```bash
   cd client
   npm install
   ```

4. **Запуск frontend-сервера:**

   ```bash
   npm start
   ```

5. **Установка зависимостей backend:**

   ```bash
   cd ../server
   pip install -r requirements.txt
   ```

6. **Запуск backend-сервера:**

   ```bash
   python app.py
   ```

7. **Откройте проект в браузере по адресу:**

   ```
   http://127.0.0.1:3000
   ```
   
## 🗂 Структура проекта

```
vibereads/
├── client/                 # Исходные файлы frontend
│   ├── public/             # Публичные ресурсы
│   └── src/                # Исходный код React
│       ├── components/     # Компоненты React
│       ├── assets/         # Ассеты (медиа)
│           ├── img/        # Изображения
│           └── icons/      # Иконки
│       ├── containers/     # Контейнеры React
│       ├── context/        # Контекст приложения
│       ├── providers/      # Провайдеры
│       ├── pages/          # Страницы React
│       ├── scss/           # SCSS стили
│       ├── App.js          # Главный файл приложения
│       └── index.js        # Корневой ReactJS-файл
├── server/                 # Исходные файлы backend
│   ├── app.py              # Главный файл Flask
│   ├── tags.py             # Скрипт поиска по настроению
│   ├── get_gutenberg.py    # Скрипт поиска книги на Gutenberg
│   ├── db/                 # База данных
│       ├── connection/
│           └── connect.py  # Подключение к базам данных
│       ├── model/          # Модели 
│           └── User.py     # Модель пользователя
│       └── loader_db.py    # Загрузчик баз данных
└── README.md               # Файл с описанием проекта
```

## 📈 Планы по развитию

- Добавление поддержки рекомендательных алгоритмов на основе машинного обучения.
- Интеграция с внешними API для получения информации о книгах.
- Улучшение UI/UX для создания еще более интуитивного и удобного интерфейса.

## 💬 Обратная связь

Мы будем рады услышать ваши отзывы и предложения! Пожалуйста, оставляйте их в разделе [Issues](https://github.com/username/vibereads/issues).

---
 
