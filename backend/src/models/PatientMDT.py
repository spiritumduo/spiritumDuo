from models import db
from sqlalchemy.sql.expression import func


class PatientMDT(db.Model):
    __tablename__ = "tbl_patient_mdt"

    id = db.Column(db.Integer(), primary_key=True)
    mdt_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_mdt.id'),
        nullable=False
    )
    patient_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_patient.id'),
        nullable=False
    )
    user_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_user.id'),
        nullable=False
    )
    created_at = db.Column(
        db.DateTime(),
        server_default=func.now(),
        nullable=False)
    planned_at = db.Column(
        db.DateTime(),
        server_default=func.now(),
        nullable=False)
