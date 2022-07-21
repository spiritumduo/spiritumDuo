from .db import db
from SdTypes import ClinicalRequestState
from sqlalchemy import Enum, func


class ClinicalRequest(db.Model):
    __tablename__ = "tbl_clinical_request"

    id = db.Column(db.Integer(), primary_key=True)
    on_pathway_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_on_pathway.id'), nullable=False)
    decision_point_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_decision_point.id'), nullable=True)
    fwd_decision_point_id = db.Column(
        db.Integer(),
        db.ForeignKey('tbl_decision_point.id'), nullable=True)
    test_result_reference_id = db.Column(
        db.String(), nullable=True)
    current_state = db.Column(
        Enum(ClinicalRequestState, native_enum=False),
        default=ClinicalRequestState.INIT.value,
        server_default=ClinicalRequestState.INIT.value, nullable=False
    )
    clinical_request_type_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_clinical_request_type.id'), nullable=False)
    added_at = db.Column(
        db.DateTime(), server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), onupdate=func.now(),
        nullable=False)
    completed_at = db.Column(
        db.DateTime(), nullable=True)
