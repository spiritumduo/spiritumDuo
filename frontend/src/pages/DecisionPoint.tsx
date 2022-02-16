import React, { useContext, useEffect, useState } from 'react';
import DecisionSubmissionSuccess from 'components/DecisionSubmissionSuccess';
import { AuthContext, PathwayContext } from 'app/context';
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
import { Button, Collapse, FormSelect, Container } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import PathwayComplete from 'components/PathwayComplete';
// eslint-disable-next-line import/extensions
import newResultImage from 'static/i/Image_Pasted_2022-31-01_at_11_31_45_png.png';
import { DecisionType, MilestoneRequestInput } from '../../__generated__/globalTypes';
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
          milestones(notOnDecisionPoint: false) {
            id
            forwardDecisionPoint {
              id
            }
            testResult{
              id
              description
              addedAt
            }
            milestoneType{
              name
            }
          }
          decisionPoints {
            clinicHistory
            comorbidities
            milestones {
              id
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
        isDischarge
        isCheckboxHidden
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
            isDischarge
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
  dischargeRequestId: string;
  something: string;
  milestoneRequests: {
    id: string;
    milestoneTypeId: string;
    name: string;
    checked: boolean;
  }[];
  milestoneResolutions: {
    id: string;
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
    const testResults = data?.getPatient?.onPathways?.[0].milestones?.flatMap(
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
  <Container className="d-flex align-items-center justify-content-left mt-5">
    <div className="d-flex align-items-center">
      <div>
        <strong>No requests selected!</strong>
        <div className="mt-lg-4">
          <p>
            No requests have been selected. Are you sure
            you want to continue?
          </p>
        </div>
        <Button
          className="float-end w-25 mt-lg-4 ms-4"
          variant="outline-secondary"
          href="/app/"
          onClick={ () => {
            confirmFn(true);
            submitFn();
          } }
        >
          Submit
        </Button>
        <Button
          onClick={ () => {
            cancelFn(false);
          } }
          className="float-end w-25 mt-lg-4"
          variant="outline-secondary"
        >
          Cancel
        </Button>
      </div>
    </div>
  </Container>
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
    <div className="row my-5 my-xl-2">
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
      <div className="col-11 col-xl-3">
        <p className="text-left">
          {
            !result.forwardDecisionPointId
              ? (
                <strong>{result.milestoneName}:</strong>
              )
              : <>{result.milestoneName}:</>
          }
        </p>
      </div>
      <div className="col-10 col-xl-7" id={ result.elementId }>
        {
          result.description.length < 75
            ? <>{result.description}</>
            : (
              <>
                { result.description.slice(0, 75) }
                <Collapse in={ testResultCollapseStates[result.elementId] } className="test-collapse">
                  <div>
                    {result.description.slice(75, result.description.length)}
                  </div>
                </Collapse>
              </>
            )
      }
      </div>
      <div className="col-2 col-xl-1 position-relative">
        {
          result.description.length < 75
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
                variant="link"
                className="p-0 position-absolute"
                style={ { bottom: '0' } }
              >
                {
                  testResultCollapseStates[result.elementId]
                    ? <ChevronUp color="black" size="1.5rem" />
                    : <ChevronDown color="black" size="1.5rem" />
                }
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

  // REQUEST CHECKBOXES
  const {
    fields: requestFields,
    append: appendRequestFields,
  } = useFieldArray({
    name: 'milestoneRequests',
    control: control,
  });

  useEffect(() => {
    const fieldProps: DecisionPointPageForm['milestoneRequests'] = data?.getMilestoneTypes
      ? data?.getMilestoneTypes?.flatMap((milestoneType) => (
        !milestoneType.isCheckboxHidden
          ? {
            id: '',
            milestoneTypeId: milestoneType.id,
            name: milestoneType.name,
            checked: false,
          }
          : []
      ))
      : [];
    appendRequestFields(fieldProps);
  }, [data, appendRequestFields]);

  // CONFIRM PREVIOUS TEST RESULTS HIDDEN INPUTS
  const {
    fields: hiddenConfirmationFields,
    append: appendHiddenConfirmationFields,
  } = useFieldArray({
    name: 'milestoneResolutions',
    control: control,
  });

  useEffect(() => {
    const outstandingTestResultIds: DecisionPointPageForm['milestoneResolutions'] | undefined = data?.getPatient?.onPathways?.[0].milestones?.flatMap(
      (ms) => (
        !ms.forwardDecisionPoint && ms.testResult
          ? {
            id: ms.id,
          }
          : []
      ),
    );
    if (outstandingTestResultIds) appendHiddenConfirmationFields(outstandingTestResultIds);
  }, [data, appendHiddenConfirmationFields]);

  // const [dischargeEnabled, setDischargeEnabled] = useState<boolean>(false);
  // DO NOT PUT HOOKS AFTER HERE

  if (loading) return <h1>Loading!</h1>;
  if (!data?.getPatient) return <h1>Error, patient not found!</h1>;
  if (isSubmitted) {
    const _milestones = mutateData?.createDecisionPoint?.decisionPoint?.milestones?.map((ms) => ({
      id: ms.id,
      name: ms.milestoneType.name,
      isDischarge: ms.milestoneType.isDischarge,
    }));
    return _milestones?.find((ms) => ms.isDischarge)
      ? <PathwayComplete />
      : <DecisionSubmissionSuccess milestones={ _milestones } />;
  }

  const patient: Patient = {
    id: parseInt(data.getPatient.id, 10),
    firstName: data.getPatient.firstName,
    lastName: data.getPatient.lastName,
    hospitalNumber: data.getPatient.hospitalNumber,
  };

  // FORM SUBMISSION
  const onSubmitFn = (mutation: typeof createDecision, values: DecisionPointPageForm) => {
    const milestoneRequests: MilestoneRequestInput[] = values.milestoneRequests?.filter(
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
          milestoneResolutions: values.milestoneResolutions.map((mr) => mr.id),
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
        <div className="container col-12 col-lg-6 col-md-8 py-md-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <form className="card p-0 px-4 pt-md-2" onSubmit={ handleSubmit(() => { onSubmitFn(createDecision, getValues()); }) }>
              <fieldset disabled={ loading || mutateLoading || isSubmitted }>
                <input type="hidden" value={ patient.id } { ...register('patientId', { required: true }) } />
                <input type="hidden" value={ user.id } { ...register('clinicianId', { required: true }) } />
                <input type="hidden" value={ onPathwayId } { ...register('onPathwayId', { required: true }) } />
                {
                  hiddenConfirmationFields.map((field, index) => (
                    <input key={ `hidden-test-confirmation-${field.id}` } type="hidden" value={ field.id } { ...register(`milestoneResolutions.${index}.id`) } />
                  ))
                }

                <div className="text-center pt-3">
                  <PatientInfoLonghand patient={ patient } />
                </div>

                <hr />
                <p>{ error?.message }</p>

                <div className="container pt-1 px-sm-0">
                  <div className="form-outline mb-4 row">
                    <div className="col-5 col-lg-2 d-flex align-items-center">
                      Decision:
                    </div>
                    <div className="col-7 col-lg-4">
                      <FormSelect
                        className="d-inline-block float-left mx-2"
                        id="decisionType"
                        defaultValue={ decisionType.toUpperCase() }
                        // eslint-disable-next-line react/jsx-props-no-spreading
                        { ...register('decisionType', { required: true }) }
                      >
                        { decisionSelectOptions }
                      </FormSelect>
                    </div>
                    <div className="col-5 col-lg-2 d-flex align-items-center">
                      Under care of:
                    </div>
                    <div className="col-7 col-lg-4">
                      <FormSelect
                        className="d-inline-block float-left mx-2"
                        disabled
                      >
                        {
                          underCareOf
                            ? (
                              <option>{`${underCareOf.firstName} ${underCareOf.lastName}`}</option>
                            )
                            : <option>AWAITING TRIAGE</option>
                        }
                      </FormSelect>
                    </div>
                  </div>
                  <hr />
                  <PreviousTestResultsElement data={ data } />
                  <div className="col-12 pb-2">
                    <label className="form-label" htmlFor="clinicHistory">Clinical history</label>
                    <textarea className="form-control" style={ { minWidth: '100%' } } id="clinicHistory" rows={ 8 } defaultValue={ previousDecisionPoint?.clinicHistory } { ...register('clinicHistory', { required: true }) } />
                    <p>{ formErrors.clinicHistory?.message }</p>
                  </div>
                  <div className="col-12 pb-2">
                    <label className="form-label" htmlFor="comorbidities">Co-morbidities</label>
                    <textarea className="form-control" style={ { minWidth: '100%' } } id="comorbidities" rows={ 8 } defaultValue={ previousDecisionPoint?.comorbidities } { ...register('comorbidities', { required: true }) } />
                    <p>{ formErrors.comorbidities?.message }</p>
                  </div>
                  {
                    requestFields.map((field, index) => (
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
                  <div className="container">
                    <button type="submit" name="submitBtn" className="btn btn-outline-secondary px-4 my-4 float-end ms-1">Submit</button>
                  </div>

                  <p>{ mutateLoading ? 'Submitting...' : '' }</p>
                  <p>{ mutateError?.message }</p>

                </div>
              </fieldset>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DecisionPointPage;
