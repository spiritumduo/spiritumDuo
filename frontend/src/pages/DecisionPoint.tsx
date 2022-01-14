import React, { useContext, useEffect, useState } from 'react';
import { AuthContext, PathwayContext } from 'app/context';
import { Link, useNavigate } from 'react-router-dom';
import Patient from 'types/Patient';
import { DecisionPointType } from 'types/DecisionPoint';
import PatientInfoLonghand from 'components/PatientInfoLonghand';
import { gql, useMutation, useQuery } from '@apollo/client';
import { enumKeys } from 'sdutils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { createDecisionPointVariables, createDecisionPoint } from 'pages/__generated__/createDecisionPoint';
import { GetPatient } from 'pages/__generated__/GetPatient';
import * as yup from 'yup';
import User from 'types/Users';
import { DecisionType } from '../../__generated__/globalTypes';

export interface DecisionPointPageProps {
  hospitalNumber: string;
  decisionType: DecisionPointType;
}

export const GET_PATIENT_QUERY = gql`
    query GetPatient($hospitalNumber: String, $pathwayId: ID) {
      getPatient(hospitalNumber: $hospitalNumber) {
        hospitalNumber
        id
        communicationMethod
        firstName
        lastName
        dateOfBirth

        onPathways(pathwayId: $pathwayId, isDischarged: false) {
          id
          decisionPoints {
            clinicHistory
            comorbidities
          }
        }
      }
    }
`;

export const CREATE_DECISION_POINT_MUTATION = gql`
  mutation createDecisionPoint($input: DecisionPointInput!) {
    createDecisionPoint(input: $input) {
      decisionPoint {
        id
      }
      userErrors {
        message
        field
      }
    }
  }
`;

interface DecisionPointPageForm {
  patientId: number;
  clinicianId: number;
  onPathwayId: string;
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
  // CONTEXT
  const { currentPathwayId } = useContext(PathwayContext);
  const { user: contextUser } = useContext(AuthContext);
  const user = contextUser as User; // context can be undefined

  // GET PATIENT DATA QUERY
  const { loading, data, error } = useQuery<GetPatient>(
    GET_PATIENT_QUERY, {
      variables: {
        hospitalNumber: hospitalNumber,
        pathwayId: currentPathwayId,
      },
    },
  );

  // CREATE DECISION POINT MUTATION
  const [createDecision, {
    data: mutateData, loading: mutateLoading, error: mutateError,
  }] = useMutation<createDecisionPoint>(CREATE_DECISION_POINT_MUTATION);
  const isSubmitted = mutateData?.createDecisionPoint?.decisionPoint?.id !== undefined;

  // FORM HOOK & VALIDATION
  const newDecisionPointSchema = yup.object({
    decisionType: yup.mixed().oneOf([Object.keys(DecisionPointType)]).required(),
    clinicHistory: yup.string().required(),
    comorbidities: yup.string().required(),
    patientId: yup.number().required().positive().integer(),
    onPathwayId: yup.number().required().positive().integer(),
  });
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
  } = useForm<DecisionPointPageForm>({ resolver: yupResolver(newDecisionPointSchema) });

  const navigate = useNavigate();
  useEffect(() => {
    if (isSubmitted) setTimeout(() => { navigate('/'); }, 2000);
  });
  if (loading) return <h1>Loading!</h1>;

  if (!data?.getPatient) return <h1>Error, patient not found!</h1>;
  const patient: Patient = {
    id: parseInt(data.getPatient.id, 10),
    firstName: data.getPatient.firstName,
    lastName: data.getPatient.lastName,
    hospitalNumber: data.getPatient.hospitalNumber,
  };

  const onSubmitFn = (mutation: typeof createDecision, values: DecisionPointPageForm) => {
    const variables: createDecisionPointVariables = {
      input: {
        onPathwayId: values.onPathwayId,
        clinicHistory: values.clinicHistory,
        comorbidities: values.comorbidities,
        decisionType: values.decisionType,
      },
    };
    mutation({ variables: variables });
  };

  const previousDecisionPoint = data.getPatient?.onPathways?.[0].decisionPoints
    ? data.getPatient.onPathways[0].decisionPoints[0]
    : null;

  const decisionKeys = enumKeys(DecisionPointType);
  const decisionSelectOptions = decisionKeys.map(
    (k) => <option value={ k } key={ `decisionType-${k}` }>{ DecisionPointType[k] }</option>,
  );
  const onPathwayId = data.getPatient.onPathways?.[0].id;

  return (
    <div>
      <section>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="card shadow-2-strong col-12 col-md-10 col-lg-9 col-xl-7">
              <form className="card-body p-5" onSubmit={ handleSubmit(() => { onSubmitFn(createDecision, getValues()); }) }>
                <fieldset disabled={ loading || mutateLoading || isSubmitted }>
                  <input type="hidden" value={ patient.id } { ...register('patientId', { required: true }) } />
                  <input type="hidden" value={ user.id } { ...register('clinicianId', { required: true }) } />
                  <input type="hidden" value={ onPathwayId } { ...register('onPathwayId', { required: true }) } />
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
                    <p>{ isSubmitted ? 'Success!' : '' }</p>
                    <p>{ mutateError?.message }</p>

                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DecisionPointPage;
