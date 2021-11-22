import React from 'react';
import { Link } from 'react-router-dom';
import Patient from 'types/Patient';
import PatientInfoLonghand from 'components/PatientInfoLonghand';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';

interface DecisionPointPageProps {
  patient: Patient;
}

const DecisionPointPage = ({ patient }: DecisionPointPageProps): JSX.Element => (
  <div className="vh-100">
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="card shadow-2-strong col-12 col-md-10 col-lg-9 col-xl-7">
            <form className="card-body p-5" action="/addPatient" method="POST">
              <div className="container">

                <p className="text-center">
                  <PatientInfoLonghand patient={ patient } /> <Link to={ `/decisionpoint/${patient.hospitalNumber}/edit` }>Edit patient record</Link>
                </p>

                <hr />

                <div className="container pt-1">
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="decisionType">Decision
                      <select className="form-select" id="decisionType" name="decisionType">
                        <option selected>Triage</option>
                        <option>Follow-up</option>
                      </select>
                    </label>
                  </div>

                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="clinicHistory">Clinical history
                      <textarea readOnly className="form-control" id="clinicHistory" name="clinicHistory" rows={ 3 } />
                    </label>
                  </div>
                  <div className="form-outline mb-4">
                    <label className="form-label" htmlFor="comorbidities">Co-morbidities
                      <textarea readOnly className="form-control" id="comorbidities" name="comorbidities" rows={ 3 } />
                    </label>
                  </div>

                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
                          CT-head
                        </label>
                      </div>
                    </div>
                    <div className="col" />
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck2">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck2" />
                          MRI-head
                        </label>
                      </div>
                    </div>
                    <div className="col" />
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck3">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck3" />
                          CT-thorax
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck4">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck4" />
                          Refer to physiotherapy
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck4">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck4" />
                          Chest x-ray
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck5">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck5" />
                          Refer to dietician
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck6">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck6" />
                          Bronchoscopy
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck7">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck7" />
                          Refer to smoking cessation
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck8">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck8" />
                          Insert another option here
                        </label>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-check">
                        <label className="form-check-label pull-right" htmlFor="defaultCheck9">
                          <input className="form-check-input" type="checkbox" value="" id="defaultCheck9" />
                          Add to MDT
                        </label>
                      </div>
                    </div>
                  </div>

                </div>

                <div className="container mt-4">
                  <button type="submit" name="loginBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Update patient</button>
                  <Link to={ `/decisionpoint/${patient.hospitalNumber}` } className="btn btn-outline-secondary w-25 float-end">Cancel</Link>
                </div>

              </div>

            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default DecisionPointPage;
