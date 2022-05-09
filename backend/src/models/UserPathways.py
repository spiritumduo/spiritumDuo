from .db import db


class UserPathways(db.Model):
    __tablename__ = "tbl_user_pathways"

    user_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_user.id'),
        nullable=False,
        primary_key=True
    )

    pathway_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_pathway.id'),
        nullable=False,
        primary_key=True
    )
