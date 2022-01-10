from . import db
from sqlalchemy import func, Enum
from SdTypes import DecisionTypes


class DecisionPoint(db.Model):
    __tablename__ = "tbl_decision_point"

    id = db.Column(db.Integer(), primary_key=True)
    clinician_id = db.Column('user_id', db.Integer(), db.ForeignKey('tbl_user.id'), nullable=False)
    on_pathway_id = db.Column(db.Integer(), db.ForeignKey('tbl_on_pathway.id'), nullable=False)
    decision_type = db.Column(
        Enum(DecisionTypes, native_enum=False), default=DecisionTypes.TRIAGE.value,
        server_default=DecisionTypes.TRIAGE.value, nullable=False, native_enum=False
    )
    added_at = db.Column(db.DateTime(), server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    clinic_history = db.Column(db.String(), nullable=False)
    comorbidities = db.Column(db.String(), nullable=False)
