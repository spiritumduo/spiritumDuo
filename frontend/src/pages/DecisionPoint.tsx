import React, { useContext, useEffect, useState } from 'react';
import DecisionSubmissionSuccess from 'components/DecisionSubmissionSuccess';
import { AuthContext, PathwayContext } from 'app/context';
import { Link } from 'react-router-dom';
import Patient from 'types/Patient';
import { DecisionPointType } from 'types/DecisionPoint';
import PatientInfoLonghand from 'components/PatientInfoLonghand';
import { gql, useMutation, useQuery } from '@apollo/client';
import { enumKeys } from 'sdutils';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { createDecisionPointVariables, createDecisionPoint } from 'pages/__generated__/createDecisionPoint';
import { GetPatient } from 'pages/__generated__/GetPatient';
import * as yup from 'yup';
import User from 'types/Users';
import { Button, Collapse } from 'react-bootstrap';
import { ArrowDownShort } from 'react-bootstrap-icons';
// eslint-disable-next-line import/extensions
import newResultImage from 'static/i/Image_Pasted_2022-31-01_at_11_31_45_png.png';
import { DecisionType, MilestoneInput } from '../../__generated__/globalTypes';
import './decisionpoint.css';

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
          underCareOf {
            firstName
            lastName
          }
          decisionPoints {
            clinicHistory
            comorbidities
            milestones {
              forwardDecisionPoint {
                id
              }
              testResult {
                id
                description
                addedAt
              }
              milestoneType {
                name
              }
            }
          }
        }
      }
      getMilestoneTypes {
        id
        name
      }
    }
`;

export const CREATE_DECISION_POINT_MUTATION = gql`
  mutation createDecisionPoint($input: DecisionPointInput!) {
    createDecisionPoint(input: $input) {
      decisionPoint {
        id
        milestones {
          id
          milestoneType {
            name
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }
`;

type DecisionPointPageForm = {
  patientId: number;
  clinicianId: number;
  onPathwayId: string;
  decisionType: DecisionType;
  clinicHistory: string;
  comorbidities: string;
  milestoneRequests: {
    id: string;
    milestoneTypeId: string;
    name: string;
    checked: boolean;
  }[];
};

interface TestResultData {
  id: string;
  key: string;
  elementId: string;
  milestoneName: string;
  description: string;
  addedAt: Date;
  forwardDecisionPointId?: string;
}

const usePreviousTestResults = (data: GetPatient | undefined ) => {
  interface CollapseState {
    [elementId: string]: boolean;
  }
  const [testResultCollapseStates, setTestResultCollapseStates] = useState<CollapseState>({});
  const [previousTestResults, setPreviousTestResults] = useState<TestResultData[]>([]);

  useEffect(() => {
    // we could do this transformation outside of the effect hook, but then we'd have to silence the
    // linter and lie in our dependancy array.
    const testResults = data?.getPatient?.onPathways?.[0].decisionPoints?.flatMap(
      (dp) => (
        dp.milestones
          ? dp.milestones?.flatMap(
            (ms) => (
              ms.testResult?.description
                ? {
                  id: ms.testResult.id,
                  key: `tr-${ms.testResult.id}`,
                  elementId: `tr-href-${ms.testResult.id}`,
                  milestoneName: ms.milestoneType.name,
                  description: ms.testResult?.description,
                  addedAt: ms.testResult.addedAt,
                  forwardDecisionPointId: ms.forwardDecisionPoint?.id,
                }
                : []
            ),
          )
          : []
      ),
    );
    testResults?.sort((a, b) => a.addedAt.valueOf() - b.addedAt.valueOf());
    const collapseStates: CollapseState = {};
    testResults?.forEach((tr) => {
      collapseStates[tr.elementId] = false;
    });
    if (testResults) setPreviousTestResults(testResults);
    if (collapseStates) setTestResultCollapseStates(collapseStates);
  }, [data]);

  return { testResultCollapseStates, setTestResultCollapseStates, previousTestResults };
};

interface ConfirmNoMilestonesProps {
  confirmFn: (value: boolean) => void;
  submitFn: () => void;
  cancelFn: (value: boolean) => void;
}

/**
 * Confirmation when user tries to submit without any milestones selected
 * @param {ConfirmNoMilestonesProps} props Props
 * @returns JSX.Element
 */
const ConfirmNoMilestones = (
  { confirmFn, submitFn, cancelFn }: ConfirmNoMilestonesProps,
): JSX.Element => (
  <div className="no-milestones-confirmation">
    <h1>No Milestones Selected!</h1>
    <Button
      onClick={ () => {
        confirmFn(true);
        submitFn();
      } }
    >
      OK
    </Button>
    <Button onClick={ () => cancelFn(false) }>
      Cancel
    </Button>
  </div>
);

interface PreviousTestResultsElementProps {
  data: GetPatient | undefined;
}

const PreviousTestResultsElement = ({ data }: PreviousTestResultsElementProps) => {
  const {
    testResultCollapseStates,
    setTestResultCollapseStates,
    previousTestResults,
  } = usePreviousTestResults(data);

  const TestResultDataElement = ({ result }: { result: TestResultData }) => (
    <div className="row">
      <div className="col-1">
        {
          !result.forwardDecisionPointId
            ? (
              <>
                <img src={ newResultImage } alt="New Result" />
              </>
            )
            : ''
        }
      </div>
      <div className="col-3">
        <p className="text-right">
          { result.milestoneName }:
        </p>
      </div>
      <div className="col" id={ result.elementId }>
        {
          result.description.length < 30
            ? <>{result.description}</>
            : (
              <>
                { result.description.slice(0, 30) }
                <Collapse in={ testResultCollapseStates[result.elementId] }>
                  <div>
                    {result.description.slice(30, result.description.length)}
                  </div>
                </Collapse>
              </>
            )
      }
      </div>
      <div className="col">
        {
          result.description.length < 30
            ? ''
            : (
              <Button
                onClick={ () => {
                  const newCollapseStates = { ...testResultCollapseStates };
                  newCollapseStates[
                    result.elementId
                  ] = !testResultCollapseStates[result.elementId];
                  setTestResultCollapseStates(newCollapseStates);
                } }
                aria-controls="example-collapse-text"
                aria-expanded={ testResultCollapseStates[result.elementId] }
              >
                <ArrowDownShort size="2em" />
              </Button>
            )
        }
      </div>
    </div>
  );

  const elements = previousTestResults?.map((result) => (
    !result.forwardDecisionPointId
      ? (
        <strong key={ `result-data-element-${result.key}` }>
          <TestResultDataElement result={ result } />
        </strong>
      )
      : <TestResultDataElement result={ result } key={ `result-data-element-${result.key}` } />
  ));

  return (
    <div className="">
      { elements }
    </div>
  );
};

const DecisionPointPage = (
  { hospitalNumber, decisionType }: DecisionPointPageProps,
): JSX.Element => {
  // START HOOKS
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
  const [confirmNoRequests, setConfirmNoRequests] = useState<boolean>(false);
  const [requestConfirmation, setRequestConfirmation] = useState<boolean>(false);
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
    control,
  } = useForm<DecisionPointPageForm>({ resolver: yupResolver(newDecisionPointSchema) });

  const { fields, append } = useFieldArray({
    name: 'milestoneRequests',
    control: control,
  });

  // REQUEST CHECKBOXES
  useEffect(() => {
    const fieldProps: DecisionPointPageForm['milestoneRequests'] = data?.getMilestoneTypes
      ? data?.getMilestoneTypes?.map((milestoneType) => ({
        id: '',
        milestoneTypeId: milestoneType.id,
        name: milestoneType.name,
        checked: false,
      }))
      : [];
    append(fieldProps);
    // }
  }, [data, append]);
  // DO NOT PUT HOOKS AFTER HERE

  if (loading) return <h1>Loading!</h1>;
  if (!data?.getPatient) return <h1>Error, patient not found!</h1>;
  if (isSubmitted) {
    const _milestones = mutateData?.createDecisionPoint?.decisionPoint?.milestones?.map((ms) => ({
      id: ms.id,
      name: ms.milestoneType.name,
    }));
    return <DecisionSubmissionSuccess milestones={ _milestones } />;
  }

  const patient: Patient = {
    id: parseInt(data.getPatient.id, 10),
    firstName: data.getPatient.firstName,
    lastName: data.getPatient.lastName,
    hospitalNumber: data.getPatient.hospitalNumber,
  };

  // FORM SUBMISSION
  const onSubmitFn = (mutation: typeof createDecision, values: DecisionPointPageForm) => {
    const milestoneRequests: MilestoneInput[] = values.milestoneRequests.filter(
      (m) => (m.checked !== false),
    ).map((m) => ({
      // The value of 'checked' will be anything we supply in the tag, but the
      // form expects it to be boolean and breaks if it's not - so we do this cast
      milestoneTypeId: m.checked as unknown as string,
    }));

    if (milestoneRequests.length === 0 && !confirmNoRequests) {
      setRequestConfirmation(true);
    } else {
      const variables: createDecisionPointVariables = {
        input: {
          onPathwayId: values.onPathwayId,
          clinicHistory: values.clinicHistory,
          comorbidities: values.comorbidities,
          decisionType: values.decisionType,
          milestoneRequests: milestoneRequests,
        },
      };
      mutation({ variables: variables });
    }
  };

  if (requestConfirmation) {
    return (
      <ConfirmNoMilestones
        confirmFn={ setConfirmNoRequests }
        cancelFn={ setRequestConfirmation }
        submitFn={ () => { onSubmitFn(createDecision, getValues()); } }
      />
    );
  }

  // IF PATIENT HAS PRIOR DECISION
  const previousDecisionPoint = data.getPatient?.onPathways?.[0].decisionPoints
    ? data.getPatient.onPathways[0].decisionPoints[0]
    : null;

  const decisionKeys = enumKeys(DecisionPointType);
  const decisionSelectOptions = decisionKeys.map(
    (k) => <option value={ k } key={ `decisionType-${k}` }>{ DecisionPointType[k] }</option>,
  );
  const onPathwayId = data.getPatient.onPathways?.[0].id;
  const underCareOf = data.getPatient.onPathways?.[0].underCareOf;

  return (
    <div>
      <section>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="card shadow-2-strong col-12 col-md-10">
              <form className="card-body p-5" onSubmit={ handleSubmit(() => { onSubmitFn(createDecision, getValues()); }) }>
                <fieldset disabled={ loading || mutateLoading || isSubmitted }>
                  <input type="hidden" value={ patient.id } { ...register('patientId', { required: true }) } />
                  <input type="hidden" value={ user.id } { ...register('clinicianId', { required: true }) } />
                  <input type="hidden" value={ onPathwayId } { ...register('onPathwayId', { required: true }) } />
                  <div className="container">

                    <div className="text-center">
                      <PatientInfoLonghand patient={ patient } />
                    </div>

                    <hr />
                    <p>{ error?.message }</p>

                    <div className="container pt-1">
                      <div className="form-outline mb-4 row">
                        <div className="col">
                          <p>Decision:
                            <select
                              id="decisionType"
                              defaultValue={ decisionType.toUpperCase() }
                              { ...register('decisionType', { required: true }) }
                            >
                              { decisionSelectOptions }
                            </select>
                          </p>
                        </div>
                        <div className="col">
                          {
                            underCareOf
                              ? (
                                <>Under Care Of: {`${underCareOf.firstName} ${underCareOf.lastName}`}</>
                              )
                              : ''
                          }
                        </div>
                      </div>
                      <PreviousTestResultsElement data={ data } />
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
                      {
                        fields.map((field, index) => (
                          <div className="row" key={ `ms-check-${field.id}` }>
                            <div className="col">
                              <div className="form-check">
                                <label className="form-check-label pull-right" htmlFor={ `milestoneRequests.${index}.checked` }>
                                  <input className="form-check-input" type="checkbox" value={ field.milestoneTypeId } { ...register(`milestoneRequests.${index}.checked` as const) } defaultChecked={ false } />
                                  { field.name }
                                </label>
                              </div>
                            </div>
                            <div className="col" />
                          </div>
                        ))
                      }
                      <div className="container mt-4">
                        <button type="submit" name="submitBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Submit</button>
                      </div>

                      <p>{ mutateLoading ? 'Submitting...' : '' }</p>
                      <p>{ mutateError?.message }</p>

                    </div>
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
