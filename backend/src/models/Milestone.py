from .db import db
from SdTypes import MilestoneState
from sqlalchemy import Enum, func


class Milestone(db.Model):
    __tablename__ = "tbl_milestone"

    id = db.Column(db.Integer(), primary_key=True)
    on_pathway_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_on_pathway.id'), nullable=False
    )
    decision_point_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_decision_point.id'), nullable=True
    )
    fwd_decision_point_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_decision_point.id'), nullable=True
    )
    test_result_reference_id = db.Column(
        db.String(), unique=True, nullable=False)
    current_state = db.Column(
        Enum(MilestoneState, native_enum=False),
        default=MilestoneState.INIT.value,
        server_default=MilestoneState.INIT.value, nullable=False
    )
    milestone_type_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_milestone_type.id'), nullable=False
    )
    added_at = db.Column(
        db.DateTime(), server_default=func.now(), nullable=False
    )
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), onupdate=func.now(),
        nullable=False
    )
