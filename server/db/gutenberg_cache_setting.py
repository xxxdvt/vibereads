import requests
import psycopg2
import os


from connection.connect import get_connection_db
from dotenv import load_dotenv


load_dotenv()

API_URL = "https://www.googleapis.com/books/v1/volumes"

# Параметры для API-запроса
params = {
    'q': 'fiction',  # Запрос на русском языке
    'langRestrict': 'en',  # Ограничение на русский язык
    'printType': 'books',  # Искать только книги
    'maxResults': 40,  # Максимальное количество результатов за запрос
    'startIndex': 0  # Начальный индекс (для пагинации)
}

# Установите свой API ключ, если он у вас есть (необязательно)
API_KEY = os.getenv('API_KEY')
print(API_KEY)
if API_KEY:
    params['key'] = API_KEY


def fetch_books_and_save_to_db():
    conn = get_connection_db()
    cursor = conn.cursor()

    # Пагинация (загрузка нескольких страниц данных)
    for i in range(5):  # Загружаем первые 5 страниц по 40 книг (можно изменить)
        params['startIndex'] = i * 40
        response = requests.get(API_URL, params=params)

        if response.status_code == 200:
            books = response.json().get('items', [])
            for book in books:
                # Извлечение основных данных о книге
                volume_info = book.get('volumeInfo', {})
                title = volume_info.get('title', 'Нет названия')
                authors = volume_info.get('authors', ['Нет автора'])
                description = volume_info.get('description', 'Описание отсутствует')
                language = volume_info.get('language', 'unknown')
                published_date = volume_info.get('publishedDate', 'Не указана')
                page_count = volume_info.get('pageCount', 0)
                thumbnail = volume_info.get('imageLinks', {}).get('thumbnail', '')

                # Сохранение книги в базу данных
                cursor.execute('''
                INSERT INTO books (title, author, description, language, published_date, page_count, thumbnail)
                VALUES (%s, %s, %s, %s, %s, %s, %s);
                ''', (title, ', '.join(authors), description, language, published_date, page_count, thumbnail))
                conn.commit()

                print(f"Сохранена книга: {title} | Автор: {', '.join(authors)}")

    # Закрытие соединения
    cursor.close()
    print("Загрузка данных завершена и сохранена в базу.")

import rdflib

# Загружаем RDF файл
g = rdflib.Graph()


# Пример запроса на поиск всех заголовков книг
for i in range(1, 100):
    g.parse(f"cache/epub/{i}/pg{i}.rdf")
    for s, p, o in g:
        if "title" in p:
            print(f"Title: {o}")
