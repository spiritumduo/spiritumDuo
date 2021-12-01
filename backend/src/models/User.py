from .db import db
from sqlalchemy.sql.expression import func

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(), nullable=False)
    password = db.Column(db.String(), nullable=False)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    department = db.Column(db.String(), nullable=False)
    last_login = db.Column(db.DateTime, server_default=func.now(), nullable=False)

