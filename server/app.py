from flask import Flask, jsonify
from flask_cors import CORS
from flask import Flask, request, jsonify
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
import psycopg2
from db.connection import connect
from db.model import User

app = Flask(__name__)
app.secret_key = 'your_secret_key'
login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)
CORS(app, credentials=True)


@app.route('/api/books', methods=['GET'])
def get_books():
    page = int(request.args.get('page', 1))

    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    books = []
    skip = (page - 1) * 20
    limit = 20
    for elem in collection.find().skip(skip).limit(limit):
        books.append(
            {
                'title': elem['title'],
                'author': elem['author'],
                'rating': '4.8/5',
                'thumbnail': elem['cover']
            }
        )

    # print(books)
    return jsonify(books)


@app.route('/api/books/book/<int:book_id>', methods=['GET'])
def get_curr_book(book_id):
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    cur_book = collection.find_one({"_id": book_id})

    return jsonify({
        'title': cur_book['title'],
        'author': cur_book['author'],
        'rating': '4.8/5',
        'thumbnail': cur_book['cover'],
        'text': cur_book['text']
    })


if __name__ == '__main__':
    app.run(debug=True)
