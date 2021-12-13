from .db import db
from sqlalchemy import func

class Session(db.Model):
    __tablename__ = "session"

    session_key = db.Column(db.String(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'), nullable=False)
    expiry = db.Column(db.DateTime(), server_default=func.now(), nullable=False)