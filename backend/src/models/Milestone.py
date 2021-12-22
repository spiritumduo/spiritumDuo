from .db import db
from sqlalchemy import func, Enum
from SdTypes import MilestoneState


class Milestone(db.Model):
    __tablename__ = "tbl_milestone"

    id = db.Column(db.Integer(), primary_key=True)
    patient_id = db.Column(db.Integer(), db.ForeignKey('patient.id'), nullable=False)
    milestone_type_id = db.Column(db.Integer(), db.ForeignKey('tbl_milestone_type.id'), nullable=False)
    on_pathway_id = db.Column(db.Integer(), db.ForeignKey('on_pathway.id'), nullable=False)
    added_at = db.Column(db.DateTime(), server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    current_state = db.Column(
        Enum(MilestoneState, native_enum=False), default=MilestoneState.INIT.value,
        server_default=MilestoneState.INIT.value, nullable=False, native_enum=False
    )