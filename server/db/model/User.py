from flask_login import UserMixin


class User(UserMixin):
    def __init__(self, id, surname, name, username, password, role='user'):
        self.id = id
        self.surname = surname
        self.name = name
        self.username = username
        self.password = password
        self.role = role

    def get_id(self):
        return str(self.id)

    def is_admin(self):
        return self.role == 'admin'
