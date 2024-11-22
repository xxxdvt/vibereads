from datetime import timedelta

import flask_login
import requests
from flask_cors import CORS
from flask import Flask, request, jsonify, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from db.connection import connect
from db.connection.connect import get_connection_db
from db.model.User import User
# from tags import get_books_by_mood
from get_gutenberg_id import get_gutenberg_id
from tags import get_books_by_mood

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)
app.config['SESSION_COOKIE_HTTPONLY'] = False
app.config['SESSION_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_DOMAIN'] = '127.0.0.1'
login_manager = LoginManager()
login_manager.init_app(app)
bcrypt = Bcrypt(app)
CORS(app, supports_credentials=True)


@login_manager.user_loader
def load_user(user_id):
    conn = get_connection_db()
    with conn.cursor() as cur:
        cur.execute("SELECT id, surname, name, username, password FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        if user:
            return User(id=user[0], surname=user[1], name=user[2], username=user[3], password=user[4])
    return None


@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    surname = data['surname']
    name = data['name']
    username = data['username']
    password = data['password']
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    conn = get_connection_db()

    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO users (surname, name, username, password)
            VALUES (%s, %s, %s, %s) RETURNING id
        """, (surname, name, username, hashed_password))
        user_id = cur.fetchone()[0]
        conn.commit()

        login_user(User(id=user_id, surname=surname, name=name, username=username, password=hashed_password))
    return jsonify({
        "id": current_user.id,
        "surname": current_user.surname,
        "name": current_user.name,
        "username": current_user.username,
    }), 200


@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data['username']
    password = data['password']
    conn = get_connection_db()

    with conn.cursor() as cur:
        cur.execute("SELECT id, surname, name, username, password FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        if user and bcrypt.check_password_hash(user[4], password):
            login_user(User(id=user[0], surname=user[1], name=user[2], username=user[3], password=user[4]))
            # session.permanent = True
            return jsonify({
                "id": current_user.id,
                "surname": current_user.surname,
                "name": current_user.name,
                "username": current_user.username,
            }), 200
    return jsonify({"message": "Invalid credentials"}), 401


@app.route('/api/check_session', methods=['GET'])
def check_session():
    if current_user.is_authenticated:
        return jsonify({'message': 'User is authenticated'})
    return jsonify({'message': 'User is not authenticated'}), 401


@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logout successful"}), 200


# Получение данных о текущем пользователе
@app.route('/api/current_user', methods=['GET'])
def get_current_user():
    if current_user.is_authenticated:
        return jsonify({
            "id": current_user.id,
            "surname": current_user.surname,
            "name": current_user.name,
            "username": current_user.username,
        }), 200
    return jsonify({
        "message": "UNAUTHORIZED"
    }), 200


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
                'rating': str(elem['rating']) + '/5',
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
                'rating': str(book['rating']) + '/5',
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
        'rating': str(cur_book['rating']) + '/5',
        'thumbnail': cur_book['cover'],
        'text': cur_book['text']
    })


@app.route('/api/books/rating/<int:book_id>', methods=['GET'])
def get_rating_if_exists(book_id):
    conn = get_connection_db()
    cursor = conn.cursor()
    cur_user_id = current_user.id
    cursor.execute("SELECT user_id, book_id, rating FROM ratings WHERE (user_id = %s) AND (book_id = %s)",
                   (cur_user_id, book_id))
    info = cursor.fetchone()
    if info is None:
        print("No rating")
        return jsonify({"message": "rating does not exist"})
    return jsonify({
        'user_id': cur_user_id,
        'book_id': book_id,
        'rating': info[2]
    })


@app.route('/api/books/rating/<int:book_id>/<int:rate>', methods=['GET', 'POST'])
def add_or_change_rating(book_id, rate):
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    conn = connect.get_connection_db()
    cursor = conn.cursor()
    cur_user_id = current_user.id
    cursor.execute("SELECT user_id, book_id, rating FROM ratings WHERE (user_id = %s) AND (book_id = %s)",
                   (cur_user_id, book_id))
    if cursor.fetchone() is None:
        cursor.execute("INSERT INTO ratings (user_id, book_id, rating) VALUES (%s, %s, %s)",
                       (cur_user_id, book_id, rate))
        conn.commit()
    else:
        cursor.execute("UPDATE ratings SET rating = (%s) WHERE (user_id = %s) AND (book_id = %s)",
                       (rate, cur_user_id, book_id))
        # cursor.execute("INSERT INTO ratings (user_id, book_id, rating) VALUES (%s, %s, %s)",
        #                (cur_user_id, book_id, rate))
        conn.commit()
    cursor.execute("SELECT calculate_rating(%s)", [book_id])
    curr_rating = cursor.fetchone()
    collection.update_one(
        {"_id": book_id},
        {"$set": {"rating": curr_rating}}
    )
    conn.close()
    return jsonify({"message": "rating was added or changed"}), 200


@app.route('/api/user/favourites', methods=['GET'])
def get_favourites_list():
    favs = []
    conn = connect.get_connection_db()
    cursor = conn.cursor()
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    cur_user_id = current_user.id
    cursor.execute("SELECT user_id, book_id FROM favourites WHERE user_id = (%s)", (cur_user_id,))
    for elem in cursor.fetchall():
        cur_id = elem[1]
        print(cur_id)
        favs.append(collection.find_one({"_id": cur_id}))
    return jsonify(favs)


@app.route('/api/books/check-favourites/<int:book_id>', methods=['GET'])
def is_book_in_favourites(book_id):
    conn = get_connection_db()
    cursor = conn.cursor()
    cur_user_id = current_user.id
    cursor.execute("SELECT user_id, book_id FROM favourites WHERE user_id = (%s) AND book_id = (%s)",
                   (cur_user_id, book_id))
    if cursor.fetchone() is None:
        return jsonify({"message": "button-fav"})
    else:
        return jsonify({"message": "button-fav validate"})



@app.route('/api/books/favourites/<int:book_id>', methods=['POST'])
def add_or_delete_favourites(book_id):
    conn = get_connection_db()
    cursor = conn.cursor()
    cur_user_id = current_user.id
    cursor.execute("SELECT user_id, book_id FROM favourites WHERE user_id = (%s) AND book_id = (%s)",
                   (cur_user_id, book_id))
    if cursor.fetchone() is None:
        cursor.execute("INSERT INTO favourites (user_id, book_id) VALUES (%s, %s)", (cur_user_id, book_id))
        conn.commit()
        return jsonify({"message": f"book {book_id} was added to {cur_user_id} favourites"})
    else:
        cursor.execute("DELETE FROM favourites WHERE user_id = (%s) AND book_id = (%s)",
                   (cur_user_id, book_id))
        conn.commit()
        return jsonify({"message": f"the book {book_id} is already in {cur_user_id} favourites"})


@app.route('/api/favourites', methods=['GET'])
@login_required
def get_favourites():
    return jsonify({'number': '10'})


@app.route('/api/ratingsNum', methods=['GET'])
@login_required
def get_ratings_num():
    return jsonify({'number': '10'})


@app.route('/api/autocomplete', methods=['GET'])
def autocomplete():
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    query = request.args.get('query', '')

    if not query:
        return jsonify([])

    results = collection.find(
        {
            "$or": [
                {"title": {"$regex": f"\\b{query}", "$options": "i"}},
                {"author": {"$regex": f"\\b{query}", "$options": "i"}},
            ]
        },
    ).limit(16)  # Ограничение для автозаполнения

    books = [{
        'title': book['title'],
        'author': book['author'],
        'rating': str(book['rating']) + '/5',
        'thumbnail': book['cover'],
        'text': book['text']
    } for book in results]

    return jsonify(books)


# API для основного поиска
@app.route('/api/search', methods=['GET'])
def search():
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    query = request.args.get('query', '')

    if not query:
        return jsonify([])

    results = collection.find(
        {
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"author": {"$regex": query, "$options": "i"}},
            ]
        }
    )

    books = [{
        'title': book['title'],
        'author': book['author'],
        'rating': str(book['rating']) + '/5',
        'thumbnail': book['cover'],
        'text': book['text']
    } for book in results]

    return jsonify(books)


@app.route('/api/moody', methods=['GET'])
def mood_search():
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    query = request.args.get('query', '')
    formatted_list = []
    list_of_books = get_books_by_mood(query)
    print(list_of_books)
    for book in list_of_books:
        result = collection.find_one({"title": book})
        print('====== S T A R T ======')
        print(book, result)
        if result is None:
            print("There is a NONE")

            #     conn = get_connection_db()
            #     cursor = conn.cursor()
            g_id = get_gutenberg_id(book)
            print('id: ', g_id)
            url = f"https://gutendex.com/books/{g_id}"
            #
            response = requests.get(url)
            if response.status_code == 200:
                data = response.json()
                # #
                book_id = data.get('id')  # Получаем ID книги
                title = data.get('title', 'No title')
                authors = data.get('authors', [])
                author_names = ', '.join([author['name'] for author in authors])
                new_book = {
                    "_id": book_id,
                    "title": title,
                    "author": author_names,
                    "cover": f'https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}.cover.medium.jpg',
                    "text": f'https://www.gutenberg.org/cache/epub/{book_id}/pg{book_id}-images.html',
                    "rating": 0,
                }
                print(new_book)
        #         result = new_book
        #         collection.insert_one(new_book)
        #         cursor.execute(
        #             "INSERT INTO books (book_id, title) VALUES (%s, %s)", (book_id, title)
        #         )
        #         conn.commit()
        #         cursor.execute(
        #             "SELECT name FROM authors WHERE name = (%s)", (author_names, )
        #         )
        #         if cursor.fetchone() is None:
        #             cursor.execute(
        #                 "INSERT INTO authors (name) VALUES (%s)", (author_names,)
        #             )
        #             conn.commit()
        #         cursor.execute("SELECT author_id FROM authors WHERE name = (%s)", (author_names,))
        #         id_author = cursor.fetchone()
        #         cursor.execute(
        #             "INSERT INTO book_author (book_id, author_id) VALUES (%s, %s)", (book_id, id_author)
        #         )
        #         conn.commit()
        #         conn.close()
        print('====== E N D ======')

        if result != 'Книга не найдена' and result is not None:
            formatted_list.append(
                {
                    'title': result['title'],
                    'author': result['author'],
                    'rating': str(result['rating']) + '/5',
                    'thumbnail': result['cover'],
                    'text': result['text']
                }
            )

    return jsonify(formatted_list)


if __name__ == '__main__':
    app.run(debug=True)
