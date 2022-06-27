from sqlalchemy import UniqueConstraint
from models import db
from sqlalchemy.sql.expression import func


class UserMDT(db.Model):
    __tablename__ = "tbl_user_mdt"
    __table_args__ = (
        UniqueConstraint(
            "mdt_id",
            "user_id"
        )
    )
    id = db.Column(
        db.Integer(),
        primary_key=True
    )
    mdt_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_mdt.id'),
        nullable=False
    )
    user_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_user.id'),
        nullable=False
    )
    added_at = db.Column(
        db.DateTime(),
        server_default=func.now(),
        nullable=False)
