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


def get_16_most_popular():
    conn = connect.get_connection_db()
    cursor = conn.cursor()
    cursor.execute("SELECT get_16_most_popular()")
    ids = cursor.fetchall()
    conn.close()
    return ids[0][0]


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
                'rating': str(elem['rating']),
                'thumbnail': elem['cover']
            }
        )
    return jsonify(books)


@app.route('/api/books/popular', methods=['GET'])
def get_popular():
    ids = get_16_most_popular()
    print(ids)
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    books = []
    for cur_id in ids:
        book = collection.find_one({"_id": cur_id})
        books.append(
            {
                'title': book['title'],
                'author': book['author'],
                'rating': str(book['rating']),
                'thumbnail': book['cover']
            }
        )

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


@app.route('/api/books/rating/<int:book_id>/<int:rate>', methods=['POST'])
def add_or_change_rating(book_id, rate):
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    conn = connect.get_connection_db()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO ratings (user_id, book_id, rating) VALUES (1, %s, %s)", (book_id, rate))
    conn.commit()
    cursor.execute("SELECT calculate_rating(%s)", [book_id])
    curr_rating = cursor.fetchone()
    collection.update_one(
        {"_id": book_id},
        {"$set": {"rating": curr_rating}}
    )
    conn.close()



if __name__ == '__main__':
    app.run(debug=True)
