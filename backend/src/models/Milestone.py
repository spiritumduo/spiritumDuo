from .db import db
from sqlalchemy import func, Enum
from SdTypes import MilestoneState


class Milestone(db.Model):
    __tablename__ = "tbl_milestone"

    id = db.Column(db.Integer(), primary_key=True)
    milestone_type = db.Column('milestone_type_id', db.Integer(), db.ForeignKey('tbl_milestone_type.id'), nullable=False)
    decision_point = db.Column('decision_point_id', db.Integer(), db.ForeignKey('tbl_decision_point.id'), nullable=False)
    added_at = db.Column(db.DateTime(), server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    current_state = db.Column(
        Enum(MilestoneState, native_enum=False), default=MilestoneState.INIT.value,
        server_default=MilestoneState.INIT.value, nullable=False, native_enum=False
    )