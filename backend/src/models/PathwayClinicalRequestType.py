from .db import db


class PathwayClinicalRequestType(db.Model):
    __tablename__ = "tbl_pathway_clinical_requesttype"

    pathway_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_pathway.id'),
        primary_key=True
    )
    clinical_request_type_id = db.Column(
        db.Integer(), db.ForeignKey('tbl_clinical_request_type.id'),
        primary_key=True
    )
