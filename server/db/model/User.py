class User:
    def __init__(self, id, surname, name, username, password):
        self.id = id
        self.surname = surname
        self.name = name
        self.username = username
        self.password = password

    def is_authenticated(self):
        return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        return str(self.id)
