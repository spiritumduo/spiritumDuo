from .db import db


class Milestone(db.Model):
    __tablename__ = "tbl_milestone"

    id = db.Column(db.Integer(), primary_key=True)
    reference_id = db.Column(db.String(), unique=True, nullable=False)
    decision_point_id = db.Column(db.Integer(), db.ForeignKey('tbl_decision_point.id'), nullable=False)