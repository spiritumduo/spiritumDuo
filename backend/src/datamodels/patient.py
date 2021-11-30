from db import database

class Patient(database.Model):
    id = database.Column(database.Integer(), primary_key = True)
    hospital_number = database.Column(database.String())
    national_number = database.Column(database.String())
    communication_method = database.Column(database.String())
    first_name = database.Column(database.String())
    last_name = database.Column(database.String())
    date_of_birth = database.Column(database.Integer())