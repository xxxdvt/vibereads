from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Разрешаем запросы с фронтенда

# Пример простого API-роута

@app.route('/')
def home():
    home = {
        'id': "home",
        'title': "flask-backend"
    }

    return jsonify(home)


@app.route('/api/books', methods=['GET'])
def get_books():
    books = [
        {"id": 1, "title": "Book 1", "mood": "happy"},
        {"id": 2, "title": "Book 2", "mood": "sad"}
    ]
    return jsonify(books)

if __name__ == '__main__':
    app.run(debug=True)