from .db import db

class Patient(db.Model):
    __tablename__ = "patient"

    id = db.Column(db.Integer(), primary_key=True)
    hospital_number = db.Column(db.String(), nullable=False)
    national_number = db.Column(db.String(), nullable=False)
    communication_method = db.Column(db.String(), nullable=False)
    first_name = db.Column(db.String(), nullable=False)
    last_name = db.Column(db.String(), nullable=False)
    date_of_birth = db.Column(db.Date(), nullable=False)