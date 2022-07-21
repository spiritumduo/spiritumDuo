from .db import db


class ClinicalRequestType(db.Model):
    __tablename__ = "tbl_clinical_request_type"

    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(), nullable=False)
    ref_name = db.Column(db.String(), nullable=False)
    is_discharge = db.Column(db.Boolean(), nullable=False, default=False)
    is_checkbox_hidden = db.Column(
        db.Boolean(), nullable=False, default=False,
        server_default="FALSE"
    )
    is_test_request = db.Column(db.Boolean(), nullable=False, default=False)
    is_mdt = db.Column(db.Boolean(), nullable=False, default=False)
