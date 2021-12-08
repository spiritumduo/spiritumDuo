import React from 'react';
import { Link } from 'react-router-dom';
import Patient from 'types/Patient';
import DecisionPoint, { DecisionPointType } from 'types/DecisionPoint';
import PatientInfoLonghand from 'components/PatientInfoLonghand';
import { gql, useMutation, useQuery } from '@apollo/client';
import { enumKeys } from 'sdutils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { currentPathwayId, loggedInUserVar } from 'app/cache';
import { createDecisionPointVariables, createDecisionPoint } from 'pages/__generated__/createDecisionPoint';
import { GetPatient, GetPatient_getPatient_decisionPoints } from 'pages/__generated__/GetPatient';
import * as yup from 'yup';
import { DecisionType } from '../../__generated__/globalTypes';

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

export const CREATE_DECISION_POINT_MUTATION = gql`
  mutation createDecisionPoint($input: DecisionPointInput!) {
    createDecisionPoint(input: $input) {
      id
    }
  }
`;

interface DecisionPointPageForm {
  patientId: number;
  clinicianId: number;
  pathwayId: number;
  decisionType: DecisionType;
  clinicHistory: string;
  comorbidities: string;
  referCtHead: boolean;
  referMRIHead: boolean;
  referCTThorax: boolean;
  referPhysiotherapy: boolean;
  referXRay: boolean;
  referDietician: boolean;
  referBronchoscopy: boolean;
  referSmokingCessation: boolean;
  referMDT: boolean;
}

const DecisionPointPage = (
  { hospitalNumber, decisionType }: DecisionPointPageProps,
): JSX.Element => {
  const { loading, data, error } = useQuery<GetPatient>(
    GET_PATIENT_QUERY, {
      variables: {
        hospitalNumber: hospitalNumber,
        limit: 1,
      },
    },
  );

  const [createDecision, {
    data: mutateData, loading: mutateLoading, error: mutateError,
  }] = useMutation<createDecisionPoint>(CREATE_DECISION_POINT_MUTATION);

  const newDecisionPointSchema = yup.object({
    decisionType: yup.mixed().oneOf([Object.keys(DecisionPointType)]).required(),
    clinicHistory: yup.string().required(),
    comorbidities: yup.string().required(),
    patientId: yup.number().required().positive().integer(),
    pathwayId: yup.number().required().positive().integer(),
    clinicianId: yup.number().required().positive().integer(),
    // TODO: we currently just send referrals as a string, change & validate when we get proper
    // system in place
  });
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
  } = useForm<DecisionPointPageForm>({ resolver: yupResolver(newDecisionPointSchema) });

  if (loading) return <h1>Loading!</h1>;

  if (!data?.getPatient) return <h1>Error, patient not found!</h1>;
  const patient: Patient = {
    id: parseInt(data.getPatient.id, 10),
    firstName: data.getPatient.firstName,
    lastName: data.getPatient.lastName,
    hospitalNumber: data.getPatient.hospitalNumber,
  };

  const decisionKeys = enumKeys(DecisionPointType);

  const decisionSelectOptions = decisionKeys.map(
    (k) => <option value={ k } key={ `decisionType-${k}` }>{ DecisionPointType[k] }</option>,
  );

  const onSubmitFn = (mutation: typeof createDecision, values: DecisionPointPageForm) => {
    // for some reason this gets coerced into a string. Cast it back
    const clinicianIdCast = values.clinicianId as unknown;
    const clinicianId = parseInt(clinicianIdCast as string, 10);
    const variables: createDecisionPointVariables = {
      input: {
        patientId: values.patientId,
        pathwayId: values.pathwayId,
        // pathwayId: 19,
        clinicianId: clinicianId,
        clinicHistory: values.clinicHistory,
        comorbidities: values.comorbidities,
        decisionType: values.decisionType,
        requestsReferrals: 'Some referrals',
      },
    };
    mutation({ variables: variables });
  };

  const previousDecisionPoint = data.getPatient.decisionPoints
    ? data.getPatient.decisionPoints[0]
    : null;

  const currentUser = loggedInUserVar();
  const currentUserId = currentUser ? currentUser.id : 0;

  return (
    <div>
      <section>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="card shadow-2-strong col-12 col-md-10 col-lg-9 col-xl-7">
              <form className="card-body p-5" onSubmit={ handleSubmit(() => { onSubmitFn(createDecision, getValues()); }) }>
                <input type="hidden" value={ patient.id } { ...register('patientId', { required: true }) } />
                <input type="hidden" value={ currentUserId } { ...register('clinicianId', { required: true }) } />
                <input type="hidden" value={ currentPathwayId() } { ...register('pathwayId', { required: true }) } />
                <div className="container">

                  <div className="text-center">
                    <PatientInfoLonghand patient={ patient } /> <Link to={ `/decisionpoint/${patient.hospitalNumber}/edit` }>Edit patient record</Link>
                  </div>

                  <hr />
                  <p>{ error?.message }</p>

                  <div className="container pt-1">
                    <div className="form-outline mb-4">
                      <p>Decision: <select id="decisionType" defaultValue={ decisionType.toUpperCase() } { ...register('decisionType', { required: true }) }>{ decisionSelectOptions }</select></p>
                    </div>

                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="clinicHistory">Clinical history
                        <textarea className="form-control" id="clinicHistory" rows={ 3 } defaultValue={ previousDecisionPoint?.clinicHistory } { ...register('clinicHistory', { required: true }) } />
                        <p>{ formErrors.clinicHistory?.message }</p>
                      </label>
                    </div>
                    <div className="form-outline mb-4">
                      <label className="form-label" htmlFor="comorbidities">Co-morbidities
                        <textarea className="form-control" id="comorbidities" rows={ 3 } defaultValue={ previousDecisionPoint?.comorbidities } { ...register('comorbidities', { required: true }) } />
                        <p>{ formErrors.comorbidities?.message }</p>
                      </label>
                    </div>

                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referCTHead">
                            <input className="form-check-input" type="checkbox" value="" id="referCtHead" { ...register('referCtHead') } />
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
                            <input className="form-check-input" type="checkbox" value="" id="referMRIHead" { ...register('referMRIHead') } />
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
                            <input className="form-check-input" type="checkbox" value="" id="referCTThorax" { ...register('referCTThorax') } />
                            CT-thorax
                          </label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referPhysiotherapy">
                            <input className="form-check-input" type="checkbox" value="" id="referPhysiotherapy" { ...register('referPhysiotherapy') } />
                            Refer to physiotherapy
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referXRay">
                            <input className="form-check-input" type="checkbox" value="" id="referXRay" { ...register('referXRay') } />
                            Chest x-ray
                          </label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referDietician">
                            <input className="form-check-input" type="checkbox" value="" id="referDietician" { ...register('referDietician') } />
                            Refer to dietician
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referBronchoscopy">
                            <input className="form-check-input" type="checkbox" value="" id="referBronchoscopy" { ...register('referBronchoscopy') } />
                            Bronchoscopy
                          </label>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referSmokingCessation">
                            <input className="form-check-input" type="checkbox" value="" id="referSmokingCessation" { ...register('referSmokingCessation') } />
                            Refer to smoking cessation
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col">
                        <div className="form-check">
                          <label className="form-check-label pull-right" htmlFor="referMDT">
                            <input className="form-check-input" type="checkbox" value="" id="referMDT" { ...register('referMDT') } />
                            Add to MDT
                          </label>
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className="container mt-4">
                    <button type="submit" name="submitBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Submit</button>
                  </div>
                  <p>{ mutateLoading ? 'Submitting...' : '' }</p>
                  <p>{ mutateError?.message }</p>

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
