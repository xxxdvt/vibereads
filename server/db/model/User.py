from flask_login import UserMixin


class User(UserMixin):
    def __init__(self, id, surname, name, username, password):
        self.id = id
        self.surname = surname
        self.name = name
        self.username = username
        self.password = password

    def get_id(self):
        return str(self.id)
