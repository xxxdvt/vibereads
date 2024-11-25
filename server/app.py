from datetime import timedelta
from functools import wraps

import flask_login
import requests
from flask_cors import CORS
from flask import Flask, request, jsonify, session
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from flask_bcrypt import Bcrypt
from db.connection import connect
from db.connection.connect import get_connection_db
from db.model.User import User
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
        cur.execute("SELECT id, surname, name, username, password, role FROM users WHERE id = %s", (user_id,))
        user = cur.fetchone()
        if user:
            return User(id=user[0], surname=user[1], name=user[2], username=user[3], password=user[4], role=user[5])
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
        cur.execute("SELECT id, surname, name, username, password, role FROM users WHERE username = %s", (username,))
        user = cur.fetchone()
        if user and bcrypt.check_password_hash(user[4], password):
            login_user(User(id=user[0], surname=user[1], name=user[2], username=user[3], password=user[4], role=user[5]))
            # session.permanent = True
            return jsonify({
                "id": current_user.id,
                "surname": current_user.surname,
                "name": current_user.name,
                "username": current_user.username,
                "role": current_user.role
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
            "role": current_user.role
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
        conn.commit()
    cursor.execute("DELETE FROM ratings WHERE rating = 0")
    conn.commit()
    cursor.execute("SELECT calculate_rating(%s)", [book_id])
    curr_rating = cursor.fetchone()
    collection.update_one(
        {"_id": book_id},
        {"$set": {"rating": round(curr_rating[0], 2)}}
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
    conn.close()
    return jsonify(favs)


@app.route('/api/books/check-favourites/<int:book_id>', methods=['GET'])
def is_book_in_favourites(book_id):
    conn = get_connection_db()
    cursor = conn.cursor()
    cur_user_id = current_user.id
    cursor.execute("SELECT user_id, book_id FROM favourites WHERE user_id = (%s) AND book_id = (%s)",
                   (cur_user_id, book_id))
    if cursor.fetchone() is None:
        conn.close()

        return jsonify({"message": "button-fav"})
    else:
        conn.close()

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
        conn.close()

        return jsonify({"message": f"book {book_id} was added to {cur_user_id} favourites"})
    else:
        cursor.execute("DELETE FROM favourites WHERE user_id = (%s) AND book_id = (%s)",
                   (cur_user_id, book_id))
        conn.commit()
        conn.close()

        return jsonify({"message": f"the book {book_id} is already in {cur_user_id} favourites"})


@app.route('/api/favourites', methods=['GET'])
@login_required
def get_favourites():
    cur_user_id = current_user.id
    conn = get_connection_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM favourites WHERE user_id = (%s)", (cur_user_id, ))
    num = cursor.fetchone()
    conn.close()

    return jsonify({'number': f'{num[0]}'})


@app.route('/api/user/ratings', methods=['GET'])
def get_ratings_list():
    rates = []
    conn = connect.get_connection_db()
    cursor = conn.cursor()
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    cur_user_id = current_user.id
    cursor.execute("SELECT user_id, book_id, rating FROM ratings WHERE user_id = (%s)", (cur_user_id,))
    for elem in cursor.fetchall():
        cur_id = elem[1]
        print(cur_id)
        res = collection.find_one({"_id": cur_id})
        rates.append(
            {
                'title': res['title'],
                'author': res['author'],
                'rating': elem[2],
                'cover': res['cover'],
                'text': res['text']
            }
        )
        rates = sorted(rates, key=lambda book: book['rating'], reverse=True)
    conn.close()

    return jsonify(rates)


@app.route('/api/ratingsNum', methods=['GET'])
@login_required
def get_ratings_num():
    cur_user_id = current_user.id
    conn = get_connection_db()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM ratings WHERE user_id = (%s)", (cur_user_id,))
    num = cursor.fetchone()
    conn.close()

    return jsonify({'number': f'{num[0]}'})


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
                {"title": {"$regex": f"\\b{query}", "$options": "i"}},
                {"author": {"$regex": f"\\b{query}", "$options": "i"}},
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


def get_not_None_books(query):
    cache_conn = connect.get_cache_db()
    collection = cache_conn['books_cache']
    results = []
    answer = []
    while len([elem for elem in results if elem is not None]) < 5:
        list_of_books = get_books_by_mood(query)
        for book in list_of_books:
            result = collection.find_one({"title": book})
            results.append(result)
            if result is not None:
                answer.append([book, result])
    return answer


@app.route('/api/moody', methods=['GET'])
def mood_search():
    query = request.args.get('query', '')
    formatted_list = []
    for _, data in get_not_None_books(query):
        formatted_list.append(
            {
                'title': data['title'],
                'author': data['author'],
                'rating': str(data['rating']) + '/5',
                'thumbnail': data['cover'],
                'text': data['text']
            }
        )
    return jsonify(formatted_list)


@app.route('/api/current_user/check-password', methods=['POST'])
@login_required
def check_password():
    data = request.get_json()
    password = data['password']
    
    conn = get_connection_db()
    cursor = conn.cursor()
    cur_user_id = current_user.id
    cursor.execute("SELECT id, password FROM users WHERE id = %s", (cur_user_id,))
    user = cursor.fetchone()
    print(user)
    if user and bcrypt.check_password_hash(user[1], password):
        # conn.close()
        return jsonify({"message": "Password is correct"}), 200
    # conn.close()
    return jsonify({"message": "Password is incorrect"}), 401


@app.route('/api/profile/edit/change', methods=['POST'])
def change_users_data():
    data = request.get_json()
    new_name = data['name']
    new_surname = data['surname']
    new_username = data['username']
    new_password = bcrypt.generate_password_hash(data['password']).decode('utf-8') if data['password'] != '' else ''
    conn = get_connection_db()
    cur_user_id = current_user.id
    with conn.cursor() as cur:
        cur.execute("SELECT id, password FROM users WHERE id = %s", (cur_user_id,))
        cur_password = cur.fetchone()[1]
        if new_password == cur_password or new_password == '':
            cur.execute("UPDATE users SET name = (%s), surname = (%s), username = (%s) WHERE id = (%s)",
                        (new_name, new_surname, new_username, cur_user_id))
            conn.commit()
        else:
            cur.execute("UPDATE users SET name = (%s), surname = (%s), username = (%s), password = (%s) WHERE id = (%s)",
                        (new_name, new_surname, new_username, new_password, cur_user_id))
            conn.commit()
    return jsonify({"message": "Information was changed"}), 200


def admin_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.is_admin():
            return jsonify({'error': 'Access denied. Admins only.'}), 403
        return func(*args, **kwargs)
    return wrapper


@app.route('/admin/dashboard')
@login_required
@admin_required
def admin_dashboard():
    return jsonify({'message': 'Admin is working currently'})


if __name__ == '__main__':
    app.run(debug=True)
