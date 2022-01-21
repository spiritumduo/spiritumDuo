from .db import db

class Patient(db.Model):
    __tablename__ = "tbl_patient"

    id = db.Column(db.Integer(), primary_key=True)
    hospital_number = db.Column(db.String(), nullable=False, unique=True)
    national_number = db.Column(db.String(), nullable=False, unique=True)
