from .db import db


class UserRole(db.Model):
    __tablename__ = "tbl_user_role"

    user_id = db.Column(db.Integer(), db.ForeignKey('tbl_user.id'), nullable=False)
    role_id = db.Column(db.Integer(), db.ForeignKey('tbl_role.id'), nullable=False)
