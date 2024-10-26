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
CORS(app, credentials=True)  # Разрешаем запросы с фронтенда


# Пример простого API-роута
tmp = 0


@app.route('/api/books', methods=['GET'])
def get_books():
    conn = connect.get_connection_db()
    cur = conn.cursor()
    cur.execute('SELECT title, author, thumbnail FROM books')
    books = []
    for elem in cur.fetchall()[:20]:
        books.append(
            {
                'title': elem[0],
                'author': elem[1],
                'rating': '4.8/5',
                'thumbnail': elem[2]
            }
        )
    print(books)
    # books = [
    #     {"title": 'Книга 1', "author": 'Автор 1', "rating": '4.8/5',
    #      "thumbnail": "https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api"},
    #     {"title": 'Книга 2', "author": 'Автор 2', "rating": '4.8/5', "thumbnail": 'url_to_image_1'},
    #     {"title": 'Книга 3', "author": 'Автор 3', "rating": '4.8/5', "thumbnail": 'url_to_image_1'},
    #     {"title": 'Книга 4', "author": 'Автор 4', "rating": '4.8/5', "thumbnail": 'url_to_image_1'},
    #     {"title": 'Книга 5', "author": 'Автор 5', "rating": '4.8/5', "thumbnail": 'url_to_image_1'},
    #     {"title": 'Книга 6', "author": 'Автор 6', "rating": '4.8/5', "thumbnail": 'url_to_image_1'},
    #     {"title": 'Книга 7', "author": 'Автор 7', "rating": '4.8/5', "thumbnail": 'url_to_image_1'},
    #     {"title": 'Книга 8', "author": 'Автор 8', "rating": '4.8/5', "thumbnail": 'url_to_image_1'},
    #     {"title": 'Книга 9', "author": 'Автор 9', "rating": '4.8/5', "thumbnail": 'url_to_image_1'},
    # ]
    return jsonify(books)


@login_manager.user_loader
def load_user(user_id):
    conn = connect.get_connection_db()
    cur = conn.cursor()
    cur.execute('SELECT id, surname, name, username, password FROM users WHERE id = %s', (user_id,))
    user_data = cur.fetchone()
    cur.close()
    conn.close()

    if user_data:
        return User.User(id=user_data[0], surname=user_data[1], name=user_data[2], username=user_data[3],
                         password=user_data[4])
    return None


# Registration route
@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    surname = data['surname']
    name = data['name']
    username = data['username']
    password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

    conn = connect.get_connection_db()
    cur = conn.cursor()

    cur.execute('SELECT id FROM users WHERE username = %s', (username,))
    if cur.fetchone():
        return jsonify({'message': 'User already exists'}), 409

    cur.execute('INSERT INTO users (surname, name, username, password) VALUES (%s, %s, %s, %s)',
                (surname, name, username, password))
    conn.commit()

    cur.close()
    conn.close()
    return jsonify({'message': 'Registration successful'}), 201


# Login route
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data['username']
    password = data['password']

    conn = connect.get_connection_db()
    cur = conn.cursor()
    cur.execute('SELECT id, surname, name, password FROM users WHERE username = %s', (username,))
    user_data = cur.fetchone()
    cur.close()
    conn.close()

    if user_data and bcrypt.check_password_hash(user_data[3], password):
        user = User.User(id=user_data[0], surname=user_data[1], name=user_data[2], username=username,
                         password=user_data[3])
        login_user(user)
        print(user_data)
        return jsonify({'message': 'Login successful', 'user': [{
            'surname': user_data[1],
            'name': user_data[2]
        }]}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


# Logout route
@app.route('/api/logout', methods=['POST'])
@login_required
def logout():
    logout_user()
    return jsonify({'message': 'Logged out successfully'}), 200


# Example protected route
@app.route('/api/profile', methods=['GET'])
@login_required
def profile():
    return jsonify({
        'username': current_user.username,
        'surname': current_user.surname,
        'name': current_user.name
    }), 200


if __name__ == '__main__':
    app.run(debug=True)
