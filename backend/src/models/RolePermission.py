from .db import db
from sqlalchemy import Enum, UniqueConstraint
from SdTypes import Permissions


class RolePermission(db.Model):
    __tablename__ = "tbl_role_permission"

    role_id = db.Column(db.Integer(), db.ForeignKey('tbl_role.id'), primary_key=True)
    permission = db.Column(
        Enum(Permissions, native_enum=False),
        nullable=False,
        primary_key=True
    )