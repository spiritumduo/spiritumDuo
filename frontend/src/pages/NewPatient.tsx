import React from 'react';
import { Link } from 'react-router-dom';

const NewPatientPage = () => (
  <div>
    <div className="vh-100">
      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="card shadow-2-strong col-12 col-md-10 col-lg-9 col-xl-7">
              <form className="card-body p-5" action="/addPatient" method="POST">
                <div className="form-group mb-2">
                  <h5>Please enter details below to add a new patient</h5>
                </div>

                <div className="form-group row mb-2">
                  <label className="col-sm-3 col-form-label" htmlFor="firstName">First name
                    <div className="col-sm-9">
                      <input type="text" name="firstName" id="firstName" className="form-control" placeholder="John" />
                    </div>
                  </label>
                </div>

                <div className="form-group row mb-2">
                  <label className="col-sm-3 col-form-label" htmlFor="lastName">Last name
                    <div className="col-sm-9">
                      <input type="text" name="lastName" id="lastName" className="form-control" placeholder="Doe" />
                    </div>
                  </label>
                </div>

                <div className="form-group row mb-2">
                  <label className="col-sm-3 col-form-label" htmlFor="patientHospitalNumber">Hospital number
                    <div className="col-sm-9">
                      <input type="text" className="form-control" id="patientHospitalNumber" name="patientHospitalNumber" placeholder="MRN1234567" />
                    </div>
                  </label>
                </div>

                <div className="form-group row mb-2">
                  <label className="col-sm-3 col-form-label" htmlFor="dateOfBirth">Date of birth
                    <div className="col-sm-9">
                      <input type="date" className="form-control" id="dateOfBirth" name="dateOfBirth" placeholder="01/01/1970" />
                    </div>
                  </label>
                </div>
                <button type="submit" name="loginBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Register patient</button>
                <Link to="/home" className="btn btn-outline-secondary w-25 float-end">Cancel</Link>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export default NewPatientPage;
