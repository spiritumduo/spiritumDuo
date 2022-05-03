from .db import db
from sqlalchemy.sql.expression import func


class User(db.Model):
    __tablename__ = "tbl_user"

    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(), nullable=False, unique=True)
    password = db.Column(db.String(), nullable=False)
    email = db.Column(db.String(), nullable=False, unique=True)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    department = db.Column(db.String(), nullable=False)
    last_login = db.Column(
        db.DateTime(), server_default=func.now(),
        nullable=False
    )
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    default_pathway_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_pathway.id'), nullable=False
    )

