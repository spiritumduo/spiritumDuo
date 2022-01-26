from .db import db
from SdTypes import MilestoneState
from sqlalchemy import Enum, func

class Milestone(db.Model):
    __tablename__ = "tbl_milestone"

    id = db.Column(db.Integer(), primary_key=True)
    decision_point_id = db.Column(db.Integer(), db.ForeignKey('tbl_decision_point.id'), nullable=False)
    fwd_decision_point_id = db.Column(db.Integer(), db.ForeignKey('tbl_decision_point.id'), nullable=True)
    reference_id = db.Column(db.Integer(), unique=True, nullable=False)
    current_state = db.Column(
        Enum(MilestoneState, native_enum=False), default=MilestoneState.INIT.value,
        server_default=MilestoneState.INIT.value, nullable=False, native_enum=False
    )
    milestone_type_id = db.Column(db.Integer(), nullable=False)
    added_at = db.Column(db.DateTime(), server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime(), server_default=func.now(), onupdate=func.now(), nullable=False)
