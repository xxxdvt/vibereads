import requests
from bs4 import BeautifulSoup


def get_gutenberg_id(book_title):
    search_url = f"https://www.gutenberg.org/ebooks/search/?query={book_title.replace(' ', '+')}"
    response = requests.get(search_url)

    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')
        # Находим первый результат
        result = soup.find('li', class_='booklink')
        if result:
            # Извлекаем ID из ссылки
            link = result.find('a')['href']
            book_id = link.split('/')[-1]
            return book_id
        else:
            print("Книга не найдена")
            return None
    else:
        print("Ошибка запроса:", response.status_code)
        return None
