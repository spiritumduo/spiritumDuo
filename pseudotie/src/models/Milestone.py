from .db import db
from sqlalchemy import func, Enum
from RecordTypes import MilestoneState


class Milestone(db.Model):
    __tablename__ = "tbl_milestone"

    id = db.Column(db.Integer(), primary_key=True)
    current_state = db.Column(
        Enum(MilestoneState, native_enum=False), default=MilestoneState.INIT.value,
        server_default=MilestoneState.INIT.value, nullable=False, native_enum=False
    )
    type_reference_id = db.Column(db.String(), nullable=False)
    added_at = db.Column(db.DateTime(), server_default=func.now(), nullable=False)
    updated_at = db.Column(db.DateTime(), server_default=func.now(), onupdate=func.now(), nullable=False)