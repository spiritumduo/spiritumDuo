from .db import db


class Role(db.Model):
    __tablename__ = "tbl_role"

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), unique=True, nullable=False)
