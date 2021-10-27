import React from 'react';
import { Link } from 'react-router-dom';
import Patient from 'types/Patient';
import Footer from 'components/Footer';
import PatientInfoLonghand from 'components/PatientInfoLonghand';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';

export interface EditDecisionPointPageProps {
  pageLayoutProps: PageLayoutProps;
  patient: Patient;
}

const EditDecisionPointPage = ({ pageLayoutProps, patient }: EditDecisionPointPageProps) => {
  const page = (
    <div className="vh-100">
      <section className="vh-100">
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="card shadow-2-strong col-12 col-md-10 col-lg-9 col-xl-7">
              <form className="card-body p-5" action="/addPatient" method="POST">
                <div className="container">

                  <p className="text-center">
                    <PatientInfoLonghand patient={ patient } />
                  </p>

                  <div className="form-group mb-2">
                    <h5>Please enter details below to edit a patient`&apos`s information</h5>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-sm-3 col-form-label" htmlFor="firstName">First name
                      <div className="col-sm-9">
                        <input type="text" className="form-control" id="firstName" name="firstName" placeholder="First name" defaultValue={ patient.firstName } />
                      </div>
                    </label>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-sm-3 col-form-label" htmlFor="lastName">Last name
                      <div className="col-sm-9">
                        <input type="text" className="form-control" id="lastName" name="lastName" placeholder="Last name" defaultValue={ patient.lastName } />
                      </div>
                    </label>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-sm-3 col-form-label" htmlFor="patientHostpitalNumber">Hospital number
                      <div className="col-sm-9">
                        <input type="text" className="form-control" id="patientHostpitalNumber" name="patientHostpitalNumber" placeholder="Hospital number" defaultValue={ patient.patientHospitalNumber } />
                      </div>
                    </label>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-sm-3 col-form-label" htmlFor="dateOfBirth">Date of birth
                      <div className="col-sm-9">
                        <input type="text" className="form-control" id="dateOfBirth" name="dateOfBirth" placeholder="Date of birth" defaultValue={ patient.dob?.toDateString() } />
                      </div>
                    </label>
                  </div>

                  <button type="submit" name="loginBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Update patient</button>
                  <Link to={ `/decisionpoint/${patient.patientHospitalNumber}` } className="btn btn-outline-secondary w-25 float-end">Cancel</Link>
                </div>

                <div className="container pt-5">
                  <hr />
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="clinicHistory">Clinical history
                      <textarea className="form-control" id="clinicHistory" name="clinicHistory" rows={ 3 }> </textarea>
                    </label>
                  </div>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="comorbidities">Co-morbidities
                      <textarea className="form-control" id="comorbidities" name="comorbidities" rows={ 3 }> </textarea>
                    </label>
                  </div>
                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return PageLayout({
    headerProps: pageLayoutProps.headerProps,
    footerProps: pageLayoutProps.footerProps,
    element: page,
  });
};

export default EditDecisionPointPage;
