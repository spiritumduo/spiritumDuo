/* eslint-disable quotes */
import React, { useContext, useLayoutEffect, useState } from 'react';

// LIBRARIES
import { gql, useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray } from 'react-hook-form';
import { Container, Row, Col } from 'react-bootstrap';
import { Button, Fieldset, ErrorMessage, ErrorSummary } from 'nhsuk-react-components';
import * as yup from 'yup';

// APP
import { AuthContext, PathwayContext } from 'app/context';
import { DecisionPointType } from 'types/DecisionPoint';
import Patient from 'types/Patient';
import User from 'types/Users';

// COMPONENTS
import DecisionSubmissionSuccess from 'components/DecisionSubmissionSuccess';
import DecisionSubmissionConfirmation from 'components/DecisionSubmissionConfirmation';
import PathwayComplete from 'components/PathwayComplete';
import { Select, Textarea } from 'components/nhs-style';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

// GENERATED TYPES
import { createDecisionPointVariables, createDecisionPoint } from 'features/DecisionPoint/__generated__/createDecisionPoint';
import { GetPatient } from 'features/DecisionPoint/__generated__/GetPatient';
import { DecisionType, MilestoneRequestInput } from '../../__generated__/globalTypes';

// LOCAL COMPONENTS
import ConfirmNoMilestones from './components/ConfirmNoMilestones';
import PreviousTestResultsElement from './components/PreviousTestResultsElement';

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
          milestones{
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
      getMilestoneTypes(pathwayId: $pathwayId) {
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

  useLayoutEffect(() => {
    if (!hasBuiltCheckboxes && data) {
      updateHasBuiltCheckboxes(true);
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
    }
  }, [data, appendRequestFields, hasBuiltCheckboxes, updateHasBuiltCheckboxes]);

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
  useLayoutEffect(() => {
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
  if (!loading && !data?.getPatient) return <h1>Error, patient not found!</h1>;
  if (!loading && data?.getPatient?.onPathways?.[0] === undefined ) {
    return <h1>Patient not on this pathway!</h1>;
  }

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
  const previousDecisionPoint = data?.getPatient?.onPathways?.[0]?.decisionPoints
    ? data.getPatient.onPathways[0].decisionPoints[0]
    : null;

  const onPathwayId = data?.getPatient?.onPathways?.[0].id;
  const underCareOf = data?.getPatient?.onPathways?.[0].underCareOf;

  // CHECKBOX COLUMNS
  const testOptionsElements: JSX.Element[] = [];
  const referNoDischargeOptionsElements: JSX.Element[] = [];
  const referAndDischargeOptionsElements: JSX.Element[] = [];

  requestFields.forEach((field, index) => {
    const element = (
      <div className="form-check" key={ `ms-check-${field.id}` }>
        <label className="form-check-label pull-right" htmlFor={ `milestoneRequests.${index}.checked` }>
          <input
            className="form-check-input"
            type="checkbox"
            value={ field.milestoneTypeId }
            { ...register(`milestoneRequests.${index}.checked` as const) }
            defaultChecked={ false }
          />
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
    <LoadingSpinner loading={ loading }>
      <Container fluid>
        <ErrorSummary className="sd-dp-errormessage" aria-labelledby="error-summary-title" role="alert" hidden={ onPathwayLock === undefined }>
          <ErrorSummary.Title id="error-summary-title">
            This patient is locked by { `${onPathwayLock?.lockUser.firstName} ${onPathwayLock?.lockUser.lastName}` }
          </ErrorSummary.Title>
        </ErrorSummary>
        <form className="card px-4" onSubmit={ handleSubmit(() => { onSubmitFn(createDecision, getValues()); }) }>
          <input type="hidden" value={ data?.getPatient?.id } { ...register('patientId', { required: true }) } />
          <input type="hidden" value={ user.id } { ...register('clinicianId', { required: true }) } />
          <input type="hidden" value={ onPathwayId } { ...register('onPathwayId', { required: true }) } />
          <input type="hidden" value={ decisionType.toUpperCase() } { ...register('decisionType', { required: true }) } />
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
                <h5>Handover Referrals</h5>
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
    </LoadingSpinner>
  );
};

export default DecisionPointPage;
