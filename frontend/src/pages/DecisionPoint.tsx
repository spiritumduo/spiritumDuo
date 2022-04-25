/* eslint-disable quotes */
import React, { useContext, useEffect, useState } from 'react';

// LIBRARIES
import { gql, useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { Collapse, Container, Row, Col, Button as BootstrapButton } from 'react-bootstrap';
import { ChevronDown, ChevronUp } from 'react-bootstrap-icons';
import { Button, Fieldset, ErrorMessage, ErrorSummary } from 'nhsuk-react-components';
import * as yup from 'yup';
import classNames from 'classnames';

// APP
import { AuthContext, PathwayContext } from 'app/context';
import { DecisionPointType } from 'types/DecisionPoint';
import Patient from 'types/Patient';
import User from 'types/Users';
import { enumKeys } from 'sdutils';
import { setIsTabDisabled } from 'components/ModalPatient.slice';
import { useAppDispatch } from 'app/hooks';

// COMPONENTS
import DecisionSubmissionSuccess from 'components/DecisionSubmissionSuccess';
import DecisionSubmissionConfirmation from 'components/DecisionSubmissionConfirmation';
import PathwayComplete from 'components/PathwayComplete';
import { Select, Textarea } from 'components/nhs-style';

import newResultImage from 'static/i/Image_Pasted_2022-31-01_at_11_31_45_png.png';

// GENERATED TYPES
import { createDecisionPointVariables, createDecisionPoint } from 'pages/__generated__/createDecisionPoint';
import { GetPatient } from 'pages/__generated__/GetPatient';
import { DecisionType, MilestoneRequestInput } from '../../__generated__/globalTypes';

import './decisionpoint.css';

export interface DecisionPointPageProps {
  hospitalNumber: string;
  decisionType: DecisionPointType;
  onPathwayLock?: {
    lockUser: {
      id: string;
      firstName: string;
      lastName: string;
    };
    lockEndTime: Date;
  }
}

export const GET_PATIENT_QUERY = gql`
    query GetPatient($hospitalNumber: String, $pathwayId: ID, $includeDischarged: Boolean) {
      getPatient(hospitalNumber: $hospitalNumber) {
        hospitalNumber
        id
        communicationMethod
        firstName
        lastName
        dateOfBirth

        onPathways(pathwayId: $pathwayId, includeDischarged: $includeDischarged) {
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
        isTestRequest
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
            id
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
    discharge: boolean;
    isTestRequest: boolean;
  }[];
  milestoneResolutions?: {
    id: string;
    name: string;
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
      collapseStates[tr.elementId] = !tr.forwardDecisionPointId;
    });
    if (testResults) setPreviousTestResults(testResults);
    if (collapseStates) setTestResultCollapseStates(collapseStates);
  }, [data]);

  return { testResultCollapseStates, setTestResultCollapseStates, previousTestResults };
};

interface ConfirmNoMilestonesProps {
  confirmFn: () => void;
  submitFn: () => void;
  cancelFn: () => void;
  milestoneResolutions?: string[];
}

/**
 * Confirmation when user tries to submit without any milestones selected
 * @param {ConfirmNoMilestonesProps} props Props
 * @returns JSX.Element
 */
const ConfirmNoMilestones = (
  { confirmFn, submitFn, cancelFn, milestoneResolutions }: ConfirmNoMilestonesProps,
): JSX.Element => {
  const [disabledState, setDisabledState] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setIsTabDisabled(true));
    return () => {
      dispatch(setIsTabDisabled(false));
    };
  }, [dispatch]);
  return (
    <Container>
      <Row>
        <strong>No requests selected!</strong>
        <p>
          No requests have been selected. Are you sure
          you want to continue?
        </p>
      </Row>
      <Row>
        {
          milestoneResolutions
            ? (
              <div>By clicking &apos;Submit&apos; you are acknowledging:
                <ul>
                  {
                    milestoneResolutions?.map((m) => (
                      <li key={ m }>{m}</li>
                    ))
                  }
                </ul>
              </div>
            )
            : false
        }
      </Row>
      <Button
        className="float-end w-25 mt-lg-4 ms-4"
        disabled={ disabledState }
        onClick={ () => {
          setDisabledState(true);
          confirmFn();
          submitFn();
        } }
        secondary
      >
        Submit
      </Button>
      <Button
        disabled={ disabledState }
        onClick={ () => {
          cancelFn();
        } }
        className="float-end w-25 mt-lg-4"
      >
        Cancel
      </Button>
    </Container>
  );
};

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
    <Row role="row" className={ classNames('my-3', { 'test-new': !result.forwardDecisionPointId }) }>
      <Col role="cell">
        {
          !result.forwardDecisionPointId
            ? (
              <>
                <img src={ newResultImage } alt="New Result" />
              </>
            )
            : false
        }
      </Col>
      <Col role="cell" xs={ 12 } sm={ 11 } xl={ 3 }>
        <p className="text-left">
          {result.milestoneName}: <br />
          {`${result.addedAt.toLocaleDateString()} ${result.addedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
        </p>
      </Col>
      <Col role="cell" xs={ 10 } sm={ 10 } xl={ 7 } id={ result.elementId }>
        {
          result.description.length < 75
            ? <>{result.description}</>
            : (
              <>
                {
                  testResultCollapseStates[result.elementId]
                    ? result.description.slice(0, 75)
                    : `${result.description.slice(0, 75)}...`
                }
                <Collapse in={ testResultCollapseStates[result.elementId] } className="test-collapse">
                  <div>
                    {result.description.slice(75, result.description.length)}
                  </div>
                </Collapse>
              </>
            )
      }
      </Col>
      <Col role="cell" xs={ 2 } sm={ 2 } xl={ 1 } className="position-relative">
        {
          result.description.length < 75
            ? ''
            : (
              <BootstrapButton
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
              </BootstrapButton>
            )
        }
      </Col>
    </Row>
  );

  const elements = previousTestResults?.map((result) => <TestResultDataElement result={ result } key={ `result-data-element-${result.key}` } />);

  return (
    <div role="table" aria-label="Previous Test Results">
      <div role="rowgroup" className="visually-hidden">
        <div role="row">
          <div role="columnheader">New?</div>
          <div role="columnheader">Name</div>
          <div role="columnheader">Description</div>
        </div>
      </div>
      <div role="rowgroup">
        { elements }
      </div>
    </div>
  );
};

const DecisionPointPage = (
  { hospitalNumber, decisionType, onPathwayLock }: DecisionPointPageProps,
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
        includeDischarged: true,
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
  const [requestConfirmation, setRequestConfirmation] = useState<number | boolean>(false);
  const newDecisionPointSchema = yup.object({
    decisionType: yup.mixed().oneOf([Object.keys(DecisionPointType)]).required(),
    clinicHistory: yup.string().required('A clinical history is required'),
    comorbidities: yup.string().required('Comorbidities are required'),
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

  const [hasBuiltCheckboxes, updateHasBuiltCheckboxes] = useState<boolean>(false);

  useEffect(() => {
    if (!hasBuiltCheckboxes && data) {
      const fieldProps: DecisionPointPageForm['milestoneRequests'] = data.getMilestoneTypes
        ? data.getMilestoneTypes?.flatMap((milestoneType) => (
          !milestoneType.isCheckboxHidden
            ? {
              id: '',
              milestoneTypeId: milestoneType.id,
              name: milestoneType.name,
              checked: false,
              discharge: milestoneType.isDischarge,
              isTestRequest: milestoneType.isTestRequest,
            }
            : []
        ))
        : [];
      appendRequestFields(fieldProps);
      updateHasBuiltCheckboxes(true);
    }
  }, [data, appendRequestFields, hasBuiltCheckboxes]);

  // CONFIRM PREVIOUS TEST RESULTS HIDDEN INPUTS
  const {
    fields: hiddenConfirmationFields,
    append: appendHiddenConfirmationFields,
  } = useFieldArray({
    name: 'milestoneResolutions',
    control: control,
  });

  const [
    hasBuiltHiddenConfirmationFields, updateHasBuiltHiddenConfirmationFields,
  ] = useState<boolean>(false);
  useEffect(() => {
    if (!hasBuiltHiddenConfirmationFields && data) {
      const outstandingTestResultIds: DecisionPointPageForm['milestoneResolutions'] | undefined = data?.getPatient?.onPathways?.[0]?.milestones?.flatMap(
        (ms) => (
          !ms.forwardDecisionPoint && ms.testResult
            ? {
              id: ms.id,
              name: ms.milestoneType.name,
            }
            : []
        ),
      );
      if (outstandingTestResultIds) appendHiddenConfirmationFields(outstandingTestResultIds);
      updateHasBuiltHiddenConfirmationFields(true);
    }
  }, [data, appendHiddenConfirmationFields, hasBuiltHiddenConfirmationFields]);

  // DO NOT PUT HOOKS AFTER HERE

  if (loading) return <h1>Loading!</h1>;
  if (!data?.getPatient) return <h1>Error, patient not found!</h1>;
  if (data.getPatient?.onPathways?.[0] === undefined ) return <h1>Patient not on this pathway!</h1>;

  if (isSubmitted) {
    const _milestones = mutateData?.createDecisionPoint?.decisionPoint?.milestones?.map((ms) => ({
      id: ms.id,
      name: ms.milestoneType.name,
      isDischarge: ms.milestoneType.isDischarge,
    }));
    return _milestones?.find((ms) => ms.isDischarge)
      ? <PathwayComplete />
      : (
        <DecisionSubmissionSuccess
          milestones={ _milestones }
          milestoneResolutions={ hiddenConfirmationFields.map((field) => field.name) }
        />
      );
  }

  const patient: Patient = {
    id: data.getPatient.id,
    firstName: data.getPatient.firstName,
    lastName: data.getPatient.lastName,
    hospitalNumber: data.getPatient.hospitalNumber,
  };

  // FORM SUBMISSION
  const onSubmitFn = (
    mutation: typeof createDecision, values: DecisionPointPageForm, isConfirmed = false,
  ) => {
    const milestoneRequests: MilestoneRequestInput[] = values.milestoneRequests?.filter(
      (m) => (m.checked !== false),
    ).map((m) => ({
      // The value of 'checked' will be anything we supply in the tag, but the
      // form expects it to be boolean and breaks if it's not - so we do this cast
      milestoneTypeId: m.checked as unknown as string,
    }));

    if (!confirmNoRequests && !isConfirmed) {
      setRequestConfirmation(milestoneRequests.length);
    } else {
      const variables: createDecisionPointVariables = {
        input: {
          onPathwayId: values.onPathwayId,
          clinicHistory: values.clinicHistory,
          comorbidities: values.comorbidities,
          decisionType: values.decisionType,
          milestoneRequests: milestoneRequests,
          milestoneResolutions: values.milestoneResolutions?.map((mr) => mr.id),
        },
      };
      mutation({ variables: variables });
    }
  };

  // CONFIRM SUBMISSION DIALOGUES
  if (requestConfirmation !== false) {
    // NO REQUESTS SELECTED
    if (requestConfirmation === 0 || requestConfirmation === true) {
      return (
        <ConfirmNoMilestones
          confirmFn={ () => setConfirmNoRequests(true) }
          cancelFn={ () => {
            setRequestConfirmation(false);
          } }
          submitFn={ () => {
            setConfirmNoRequests(true);
            onSubmitFn(createDecision, getValues(), true);
          } }
          milestoneResolutions={ hiddenConfirmationFields.map((field) => field.name) }
        />
      );
    }
    // REQUESTS SELECTED
    const milestones = getValues()
      .milestoneRequests
      .filter((m) => m.checked)
      .map((m) => ({ id: m.milestoneTypeId, name: m.name }));
    return (
      <DecisionSubmissionConfirmation
        cancelCallback={ () => {
          setRequestConfirmation(false);
        } }
        okCallback={ () => {
          setConfirmNoRequests(true);
          onSubmitFn(createDecision, getValues(), true);
        } }
        milestones={ milestones }
        milestoneResolutions={ hiddenConfirmationFields.map((field) => field.name) }
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

  // CHECKBOX COLUMNS
  const testOptionsElements: JSX.Element[] = [];
  const referNoDischargeOptionsElements: JSX.Element[] = [];
  const referAndDischargeOptionsElements: JSX.Element[] = [];

  requestFields.forEach((field, index) => {
    const element = (
      <div className="form-check" key={ `ms-check-${field.id}` }>
        <label className="form-check-label pull-right" htmlFor={ `milestoneRequests.${index}.checked` }>
          <input className="form-check-input" type="checkbox" value={ field.milestoneTypeId } { ...register(`milestoneRequests.${index}.checked` as const) } defaultChecked={ false } />
          { field.name }
        </label>
      </div>
    );
    if (field.isTestRequest) {
      testOptionsElements.push(element);
    } else if (!field.isTestRequest && !field.discharge) {
      referNoDischargeOptionsElements.push(element);
    } else if (field.discharge) {
      referAndDischargeOptionsElements.push(element);
    }
  });

  return (
    <div>
      <section>
        <Container fluid>
          <ErrorSummary className="sd-dp-errormessage" aria-labelledby="error-summary-title" role="alert" hidden={ onPathwayLock === undefined }>
            <ErrorSummary.Title id="error-summary-title">
              This patient is locked by { `${onPathwayLock?.lockUser.firstName} ${onPathwayLock?.lockUser.lastName}` }
            </ErrorSummary.Title>
          </ErrorSummary>
          <form className="card px-4" onSubmit={ handleSubmit(() => { onSubmitFn(createDecision, getValues()); }) }>
            <input type="hidden" value={ patient.id } { ...register('patientId', { required: true }) } />
            <input type="hidden" value={ user.id } { ...register('clinicianId', { required: true }) } />
            <input type="hidden" value={ onPathwayId } { ...register('onPathwayId', { required: true }) } />
            {
              hiddenConfirmationFields.map((field, index) => (
                <input
                  key={ `hidden-test-confirmation-${field.id}` }
                  type="hidden"
                  value={ field.id }
                  data-result-name={ field.name }
                  { ...register(`milestoneResolutions.${index}.id`) }
                />
              ))
            }
            { error ? <ErrorMessage>{error.message}</ErrorMessage> : false }
            <Fieldset disabled={
              loading || mutateLoading || isSubmitted || onPathwayLock !== undefined
              }
            >
              <Row className="mt-4 align-items-center">
                <Col xs={ 5 } sm={ 4 } md={ 3 } className="offset-sm-1 offset-md-0">
                  Decision:
                </Col>
                <Col xs={ 7 } sm={ 6 } md={ 3 }>
                  <Select
                    className="d-inline-block w-100"
                    id="decisionType"
                    defaultValue={ decisionType.toUpperCase() }
                    // eslint-disable-next-line react/jsx-props-no-spreading
                    { ...register('decisionType', { required: true }) }
                  >
                    { decisionSelectOptions }
                  </Select>
                </Col>
                <Col xs={ 5 } sm={ 4 } md={ 3 } className="offset-sm-1 offset-md-0">
                  Under care of:
                </Col>
                <Col xs={ 7 } sm={ 6 } md={ 3 }>
                  <Select
                    className="d-inline-block w-100"
                    disabled
                  >
                    {
                      underCareOf
                        ? (
                          <option>{`${underCareOf.firstName} ${underCareOf.lastName}`}</option>
                        )
                        : <option>{`${user.firstName} ${user.lastName}`}</option>
                    }
                  </Select>
                </Col>
              </Row>
            </Fieldset>
            <hr className="mt-0 mb-1" />
            <PreviousTestResultsElement data={ data } />
            <Fieldset disabled={
              loading || mutateLoading || isSubmitted || onPathwayLock !== undefined
              }
            >
              <Row>
                <Textarea
                  className="form-control"
                  label="Clinical history"
                  error={ formErrors.clinicHistory?.message }
                  style={ { minWidth: '100%' } }
                  id="clinicHistory"
                  rows={ 8 }
                  defaultValue={ previousDecisionPoint?.clinicHistory }
                  { ...register('clinicHistory', { required: true }) }
                />
              </Row>
              <Row>
                <Textarea
                  className="form-control"
                  label="Co-morbidities"
                  error={ formErrors.comorbidities?.message }
                  style={ { minWidth: '100%' } }
                  id="comorbidities"
                  rows={ 8 }
                  defaultValue={ previousDecisionPoint?.comorbidities }
                  { ...register('comorbidities', { required: true }) }
                />
              </Row>
            </Fieldset>
            <Fieldset disabled={
              loading || mutateLoading || isSubmitted || onPathwayLock !== undefined
              }
            >
              <Row>
                <Col>
                  <h5>Tests</h5>
                  {
                    testOptionsElements.length !== 0
                      ? testOptionsElements
                      : false
                  }
                </Col>
                <Col>
                  <h5>Internal Referrals</h5>
                  {
                    referNoDischargeOptionsElements.length !== 0
                      ? referNoDischargeOptionsElements
                      : false
                  }
                </Col>
                <Col>
                  <h5>External Referrals</h5>
                  {
                    referAndDischargeOptionsElements.length !== 0
                      ? referAndDischargeOptionsElements
                      : false
                  }
                </Col>
              </Row>
            </Fieldset>
            <p>{ mutateLoading ? 'Submitting...' : '' }</p>
            { mutateError ? <ErrorMessage> {mutateError?.message} </ErrorMessage> : false }
            <div>
              <Button
                type="submit"
                name="submitBtn"
                className="btn btn-outline-secondary px-4 my-4 float-end ms-1"
                disabled={ onPathwayLock !== undefined }
              >
                Submit
              </Button>
            </div>
          </form>
        </Container>
      </section>
    </div>
  );
};

export default DecisionPointPage;
