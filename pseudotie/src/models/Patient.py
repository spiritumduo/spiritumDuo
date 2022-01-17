from .db import db

class Patient(db.Model):
    __tablename__ = "tbl_patient"

    id = db.Column(db.Integer(), primary_key=True)
    hospital_number = db.Column(db.String(), nullable=False, unique=True)
    national_number = db.Column(db.String(), nullable=False, unique=True)
    communication_method = db.Column(db.String(), nullable=False)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    date_of_birth = db.Column(db.Date(), nullable=False)