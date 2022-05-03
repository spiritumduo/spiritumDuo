from .db import db


class PathwayMilestoneType(db.Model):
    __tablename__ = "tbl_pathway_milestonetype"

    pathway_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_pathway.id'),
        primary_key=True
    )
    milestone_type_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_milestone_type.id'),
        primary_key=True
    )
