import requests

from connection.connect import get_connection_db, get_cache_db

cache_db = get_cache_db()
collection = cache_db["books_cache"]

conn = get_connection_db()
cursor = conn.cursor()

url = "https://gutendex.com/books/"
params = {
    "subject": "Fiction",  # Категория Fiction
    "languages": ["en"]  # Фильтрация по английскому языку
}
max_pages = 5
current_page = 1

authors_books_list = []
while url and current_page <= max_pages:  # Пока существует ссылка на следующую страницу
    params['page'] = current_page
    response = requests.get(url, params=params)

    if response.status_code == 200:
        data = response.json()
        books = data.get('results', [])

        for book in books:
            book_id = book.get('id')  # Получаем ID книги
            title = book.get('title', 'No title')
            authors = book.get('authors', [])
            author_names = ', '.join([author['name'] for author in authors])
            authors_books_list.append([author_names, title])
            book_example = {
                "_id": book_id,
                "title": title,
                "author": author_names,
                "cover": f'https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}.cover.medium.jpg',
                "text": f'https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}-images.html'
            }
            collection.insert_one(book_example)
            print(f"ID: {book_id}\nTitle: {title}\nAuthor(s): {author_names}\n")

            cursor.execute(
                "INSERT INTO books (book_id, title) VALUES (%s, %s)", (book_id, title)
            )
            conn.commit()

        # Обновляем URL на следующую страницу
        url = data.get('next')
        params = {}  # Очистка параметров, так как они не нужны при переходе на `next`
        current_page += 1
    else:
        print("Failed to retrieve data from the API.")
        break
for author in set([info[0] if info[0] != '' else 'No author' for info in authors_books_list]):
    cursor.execute(
        "INSERT INTO authors (name) VALUES (%s)", (author,)
    )
    conn.commit()
for author, book in authors_books_list:
    cursor.execute("SELECT book_id FROM books WHERE title = (%s)", (book,))
    id_book = cursor.fetchone()
    cursor.execute("SELECT author_id FROM authors WHERE name = (%s)", (author,))
    id_author = cursor.fetchone()
    cursor.execute(
        "INSERT INTO book_author (book_id, author_id) VALUES (%s, %s)", (id_book, id_author)
    )
    conn.commit()

cursor.close()
print("Загрузка данных завершена и сохранена в базу.")
