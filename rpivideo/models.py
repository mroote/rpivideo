from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import UserMixin, AnonymousUserMixin
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String())
    password = db.Column(db.String())

    def __init__(self, username, password):
        self.username = username
        self.set_password(password)

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, value):
        return check_password_hash(self.password, value)

    def is_authenticated(self):
        if isinstance(self, AnonymousUserMixin):
            return False
        else:
            return True

    def is_active(self):
        return True

    def is_anonymous(self):
        if isinstance(self, AnonymousUserMixin):
            return True
        else:
            return False

    def get_id(self):
        return self.id

    def __repr__(self):
        return '<User %r>' % self.username


class Video(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    url = db.Column(db.String())
    title = db.Column(db.String())
    vid_format = db.Column(db.String())
    format_id = db.Column(db.Integer())
    upload_date = db.Column(db.String())
    height = db.Column(db.Integer())
    width = db.Column(db.Integer())
    vid_id = db.Column(db.String())
    play_count = db.Column(db.Integer())
    duration = db.Column(db.Integer())
