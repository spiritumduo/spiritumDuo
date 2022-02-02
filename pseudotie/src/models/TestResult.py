from .db import db
from sqlalchemy import func


class TestResult(db.Model):
    __tablename__ = "tbl_test_result"

    id = db.Column(db.Integer(), primary_key=True)
    milestone_id = db.Column(db.Integer(), db.ForeignKey('tbl_milestone.id'), nullable=True)
    description = db.Column(db.String(), nullable=False)
    added_at = db.Column(db.DateTime(), server_default=func.now(), nullable=False)
