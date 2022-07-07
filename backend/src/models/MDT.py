from models import db
from sqlalchemy.sql.expression import func
from sqlalchemy import UniqueConstraint


class MDT(db.Model):
    __tablename__ = "tbl_mdt"
    __table_args__ = (
        UniqueConstraint(
            "pathway_id",
            "planned_at",
        )
    )

    id = db.Column(
        db.Integer(),
        primary_key=True)
    pathway_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_pathway.id'),
        nullable=False)
    creator_user_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_user.id'),
        nullable=False)
    location = db.Column(
        db.String(),
        nullable=False)
    created_at = db.Column(
        db.DateTime(),
        server_default=func.now(),
        nullable=False)
    planned_at = db.Column(
        db.DateTime(),
        server_default=func.now(),
        nullable=False)
    updated_at = db.Column(
        db.DateTime(),
        server_default=func.now(),
        nullable=False)
