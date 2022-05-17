from .db import db
from sqlalchemy import func, Enum
from RecordTypes import TestResultState


class TestResult(db.Model):
    __tablename__ = "tbl_test_result"

    id = db.Column(db.Integer(), primary_key=True)
    patient_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_patient.id'), nullable=True)
    pathway_name = db.Column(db.String(), nullable=False)
    description = db.Column(db.String(), nullable=True)
    type_reference_name = db.Column(db.String(), nullable=False)
    current_state = db.Column(
        Enum(TestResultState), default=TestResultState.INIT.value,
        server_default=TestResultState.INIT.value, nullable=False
    )
    added_at = db.Column(
        db.DateTime(), server_default=func.now(), nullable=False)
    updated_at = db.Column(
        db.DateTime(), server_default=func.now(), nullable=False)
    planned_return_time = db.Column(
        db.DateTime(), server_default=func.now(), nullable=True)
