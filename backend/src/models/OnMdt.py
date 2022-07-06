from sqlalchemy import UniqueConstraint
from models import db
from sqlalchemy.sql.expression import func


class OnMdt(db.Model):
    __tablename__ = "tbl_on_mdt"
    __table_args__ = (
        UniqueConstraint(
            "mdt_id",
            "patient_id"
        )
    )
    id = db.Column(
        db.Integer(),
        primary_key=True)
    mdt_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_mdt.id'),
        nullable=False)
    patient_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_patient.id'),
        nullable=False)
    user_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_user.id'),
        nullable=False)
    added_at = db.Column(
        db.DateTime(),
        server_default=func.now(),
        nullable=False)
    reason = db.Column(
        db.String(),
        nullable=False)
    outcome = db.Column(
        db.String(),
        nullable=True)
    lock_user_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_user.id'),
        nullable=True)
    lock_end_time = db.Column(
        db.DateTime(),
        nullable=True)
    actioned = db.Column(
        db.Boolean(),
        default=False,
        nullable=False)
