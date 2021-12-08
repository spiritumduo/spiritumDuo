import React from 'react';
import { Link } from 'react-router-dom';
import Patient from 'types/Patient';
import PatientInfoLonghand from 'components/PatientInfoLonghand';
import { DecisionPointType } from 'types/DecisionPoint';
import { gql, useQuery } from '@apollo/client';
import { enumKeys } from 'sdutils';

export interface DecisionPointPageProps {
  hospitalNumber: string;
  decisionType: DecisionPointType;
}

export const GET_PATIENT_QUERY = gql`
    query GetPatient($hospitalNumber: String) {
      getPatient(hospitalNumber: $hospitalNumber) {
        hospitalNumber
        id
        communicationMethod
        firstName
        lastName
        dateOfBirth

        decisionPoints(limit: 1) {
          clinicHistory
          comorbidities
        }
      }
    }
`;

const DecisionPointPage = (
  { hospitalNumber, decisionType }: DecisionPointPageProps,
): JSX.Element => {
  const { loading, data, error } = useQuery(
    GET_PATIENT_QUERY, {
      variables: {
        hospitalNumber: hospitalNumber,
        limit: 1,
      },
    },
  );
  if (loading) return <h1>Loading!</h1>;
  console.log(data);
  const patient = data?.getPatient;

  const decisionKeys = enumKeys(DecisionPointType);

  const decisionSelectOptions = decisionKeys.map(
    (k) => <option value={ k } key={ `decisionType-${k}` }>{ DecisionPointType[k] }</option>,
  );

  return (
    <div>
      <section>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="card shadow-2-strong col-12 col-md-10 col-lg-9 col-xl-7">
              <form className="card-body p-5" action="/addPatient" method="POST">
                <div className="container">

                  <div className="text-center">
                    <PatientInfoLonghand patient={ patient } /> <Link to={ `/decisionpoint/${patient.hospitalNumber}/edit` }>Edit patient record</Link>
                  </div>

                  <hr />
                  <p>{ error?.message }</p>

                  <div className="container pt-1">
                    <div className="form-outline mb-4">
                      <p>Decision: <select name="" id="" defaultValue={ decisionType.toUpperCase() }>{ decisionSelectOptions }</select></p>
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="clinicHistory">Clinical history
                        <textarea className="form-control" id="clinicHistory" name="clinicHistory" rows={ 3 } defaultValue={ data.getPatient.decisionPoints[0]?.clinicHistory } />
                      </label>
                    </div>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="comorbidities">Co-morbidities
                        <textarea className="form-control" id="comorbidities" name="comorbidities" rows={ 3 } defaultValue={ data.getPatient.decisionPoints[0]?.comorbidities } />
                      </label>
                    </div>

                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referCTHead">
                            <input className="form-check-input" type="checkbox" value="" id="referCtHead" />
                            CT-head
                          </label>
                        </div>
                      </div>
                      <div className="col" />
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referMRIHead">
                            <input className="form-check-input" type="checkbox" value="" id="referMRIHead" />
                            MRI-head
                          </label>
                        </div>
                      </div>
                      <div className="col" />
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referCTThorax">
                            <input className="form-check-input" type="checkbox" value="" id="referCTThorax" />
                            CT-thorax
                          </label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referPhysiotherapy">
                            <input className="form-check-input" type="checkbox" value="" id="referPhysiotherapy" />
                            Refer to physiotherapy
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referXRay">
                            <input className="form-check-input" type="checkbox" value="" id="referXRay" />
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
                          <label className="form-check-label pull-right" htmlFor="referBronchoscopy">
                            <input className="form-check-input" type="checkbox" value="" id="referBronchoscopy" />
                            Bronchoscopy
                          </label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referSmokingCessation">
                            <input className="form-check-input" type="checkbox" value="" id="referSmokingCessation" />
                            Refer to smoking cessation
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referMDT">
                            <input className="form-check-input" type="checkbox" value="" id="referMDT" />
                            Add to MDT
                          </label>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="container mt-4">
                    <button type="submit" name="submitBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Submit</button>
                  </div>

                </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DecisionPointPage;
