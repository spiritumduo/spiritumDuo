from .db import db

class MilestoneType(db.Model):
    __tablename__ = "tbl_milestone_type"

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    ref_name = db.Column(db.String(), nullable=False)
    ref_id = db.Column(db.String(), nullable=False)
