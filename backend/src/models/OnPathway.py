from . import db
from sqlalchemy import func, false, Enum
from SdTypes import DecisionTypes

class OnPathway(db.Model):
    __tablename__ = "tbl_on_pathway"

    id = db.Column(db.Integer(), primary_key=True)
    patient_id = db.Column(db.Integer(), db.ForeignKey('tbl_patient.id'), nullable=False)
    pathway_id = db.Column(db.Integer(), db.ForeignKey('tbl_pathway.id'), nullable=False)
    is_discharged = db.Column(db.Boolean(), server_default=false(), default=False, nullable=False)
    awaiting_decision_type = db.Column(
     Enum(DecisionTypes, native_enum=False), default=DecisionTypes.TRIAGE.value,
     server_default=DecisionTypes.TRIAGE.value, nullable=False
    )
    added_at = db.Column(db.DateTime(), server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )
    referred_at = db.Column(db.DateTime(), server_default=func.now(), nullable=False)
    under_care_of_id = db.Column(db.Integer(), db.ForeignKey('tbl_user.id'), nullable=True)
