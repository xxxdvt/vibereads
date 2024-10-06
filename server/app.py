from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с фронтенда

# Пример простого API-роута




@app.route('/api/books', methods=['GET'])
def get_books():
    books = [
                    { "title": 'Книга 1', "author": 'Автор 1', "rating": '4.8/5', "thumbnail": "https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api" },
                    { "title": 'Книга 2', "author": 'Автор 2', "rating": '4.8/5', "thumbnail": 'url_to_image_1' },
                    { "title": 'Книга 3', "author": 'Автор 3', "rating": '4.8/5', "thumbnail": 'url_to_image_1' },
                    { "title": 'Книга 4', "author": 'Автор 4', "rating": '4.8/5', "thumbnail": 'url_to_image_1' },
                    { "title": 'Книга 5', "author": 'Автор 5', "rating": '4.8/5', "thumbnail": 'url_to_image_1' },
                    { "title": 'Книга 6', "author": 'Автор 6', "rating": '4.8/5', "thumbnail": 'url_to_image_1' },
                    { "title": 'Книга 7', "author": 'Автор 7', "rating": '4.8/5', "thumbnail": 'url_to_image_1' },
                    { "title": 'Книга 8', "author": 'Автор 8', "rating": '4.8/5', "thumbnail": 'url_to_image_1' },
                    { "title": 'Книга 9', "author": 'Автор 9', "rating": '4.8/5', "thumbnail": 'url_to_image_1' },
                ]
    return jsonify(books)

if __name__ == '__main__':
    app.run(debug=True)