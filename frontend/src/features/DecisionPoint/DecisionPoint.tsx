/* eslint-disable quotes */
import React, { useContext, useLayoutEffect, useState, useEffect } from 'react';

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
import User from 'types/Users';

// COMPONENTS
import DecisionSubmissionSuccess from 'components/DecisionSubmissionSuccess';
import DecisionSubmissionConfirmation from 'components/DecisionSubmissionConfirmation';
import PathwayComplete from 'components/PathwayComplete';
import { Select, Textarea } from 'components/nhs-style';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

// GENERATED TYPES
import { createDecisionPointVariables, createDecisionPoint } from 'features/DecisionPoint/__generated__/createDecisionPoint';
import { GetPatient, GetPatientVariables } from 'features/DecisionPoint/__generated__/GetPatient';
import { getMdts, getMdtsVariables } from './__generated__/getMdts';
import { DecisionType, ClinicalRequestRequestInput, ClinicalRequestState } from '../../__generated__/globalTypes';

// LOCAL COMPONENTS
import ConfirmNoClinicalRequests from './components/ConfirmNoClinicalRequests';
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
  closeCallback?: () => void;
  fromMdtId?: string;
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
          clinicalRequests{
            id
            forwardDecisionPoint {
              id
            }
            testResult{
              id
              description
              addedAt
            }
            clinicalRequestType{
              name
            }
            currentState
            completedAt
          }
          decisionPoints {
            clinicHistory
            comorbidities
            clinicalRequests {
              id
              forwardDecisionPoint {
                id
              }
              testResult {
                id
                description
                addedAt
              }
              clinicalRequestType {
                name
              }
              currentState
              completedAt
            }
          }
        }
      }
      getClinicalRequestTypes(pathwayId: $pathwayId) {
        id
        name
        isDischarge
        isCheckboxHidden
        isTestRequest
        isMdt
      }
    }
`;

export const CREATE_DECISION_POINT_MUTATION = gql`
  mutation createDecisionPoint($input: DecisionPointInput!) {
    createDecisionPoint(input: $input) {
      decisionPoint {
        id
        clinicalRequests {
          id
          clinicalRequestType {
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

export const GET_MDTS = gql`
  query getMdts($pathwayId: ID!){
    getMdts(pathwayId: $pathwayId){
      id
      plannedAt
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
  clinicalRequestRequests: {
    id: string;
    clinicalRequestTypeId: string;
    name: string;
    checked: boolean;
    discharge: boolean;
    isTestRequest: boolean;
    isMdt: boolean;
  }[];
  clinicalRequestResolutions?: {
    id: string;
    name: string;
  }[];
  mdtSessionId: string;
  mdtReason: string;
  mdtSelected: boolean;
};

const DecisionPointPage = (
  { hospitalNumber, decisionType, onPathwayLock, closeCallback, fromMdtId }: DecisionPointPageProps,
): JSX.Element => {
  // START HOOKS
  // CONTEXT
  const { currentPathwayId } = useContext(PathwayContext);
  const { user: contextUser } = useContext(AuthContext);
  const [showMdtDetails, setShowMdtDetails] = useState<boolean>(true);
  const user = contextUser as User; // context can be undefined
  // GET PATIENT DATA QUERY
  const { loading, data, error } = useQuery<GetPatient, GetPatientVariables>(
    GET_PATIENT_QUERY, {
      variables: {
        hospitalNumber: hospitalNumber,
        pathwayId: currentPathwayId,
        includeDischarged: true,
      },
    },
  );

  // GET MDTS QUERY
  const {
    loading: mdtLoading, data: mdtData, error: mdtError,
  } = useQuery<getMdts, getMdtsVariables>(
    GET_MDTS, {
      variables: {
        pathwayId: currentPathwayId || '',
      },
    },
  );

  // CREATE DECISION POINT MUTATION
  const [createDecision, {
    data: mutateData, loading: mutateLoading, error: mutateError,
  }] = useMutation<createDecisionPoint>(CREATE_DECISION_POINT_MUTATION);

  const isSubmitted = mutateData?.createDecisionPoint?.decisionPoint?.id !== undefined;

  // FORM HOOK & VALIDATION
  const [requestConfirmation, setRequestConfirmation] = useState<number | boolean>(false);
  const newDecisionPointSchema = yup.object({
    decisionType: yup.mixed().oneOf([Object.keys(DecisionPointType)]).required(),
    clinicHistory: yup.string().required('A clinical history is required'),
    comorbidities: yup.string().required('Comorbidities are required'),
    patientId: yup.number().required().positive().integer(),
    onPathwayId: yup.number().required().positive().integer(),
    mdtSelected: yup.boolean(),
    mdtSessionId: yup.number().when('mdtSelected', {
      is: true,
      then: yup.number().required().integer().positive('A valid entry must be selected'),
    }),
    mdtReason: yup.string().when('mdtSelected', {
      is: true,
      then: yup.string().required('A reason is required'),
    }),
  });

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    control,
    watch,
    setValue,
  } = useForm<DecisionPointPageForm>({ resolver: yupResolver(newDecisionPointSchema) });

  // REQUEST CHECKBOXES
  const {
    fields: requestFields,
    append: appendRequestFields,
  } = useFieldArray({
    name: 'clinicalRequestRequests',
    control: control,
  });

  useEffect(() => {
    // Form watch using callback, monitors + yeets callback when any value in form changes
    const sub = watch((value) => {
      const filteredOptions = value?.clinicalRequestRequests?.filter(
        (cRQ) => cRQ?.checked && cRQ?.isMdt,
      );
      const isMdtChecked = (filteredOptions && filteredOptions.length > 0) || false;
      setShowMdtDetails(isMdtChecked);
    });
    return () => sub.unsubscribe();
  }, [watch]);

  useEffect(() => {
    setValue('mdtSelected', showMdtDetails);
  }, [setShowMdtDetails, setValue, showMdtDetails]);

  const [hasBuiltCheckboxes, updateHasBuiltCheckboxes] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (!hasBuiltCheckboxes && data) {
      updateHasBuiltCheckboxes(true);
      const fieldProps: DecisionPointPageForm['clinicalRequestRequests'] = data.getClinicalRequestTypes
        ? data.getClinicalRequestTypes?.flatMap((clinicalRequestType) => (
          !clinicalRequestType.isCheckboxHidden
            ? {
              id: '',
              clinicalRequestTypeId: clinicalRequestType.id,
              name: clinicalRequestType.name,
              checked: false,
              discharge: clinicalRequestType.isDischarge,
              isTestRequest: clinicalRequestType.isTestRequest,
              isMdt: clinicalRequestType.isMdt,
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
    name: 'clinicalRequestResolutions',
    control: control,
  });

  const [
    hasBuiltHiddenConfirmationFields, updateHasBuiltHiddenConfirmationFields,
  ] = useState<boolean>(false);
  useLayoutEffect(() => {
    if (!hasBuiltHiddenConfirmationFields && data) {
      const outstandingTestResultIds: DecisionPointPageForm['clinicalRequestResolutions'] | undefined = data?.getPatient?.onPathways?.[0]?.clinicalRequests?.flatMap(
        (ms) => (
          !ms.forwardDecisionPoint && ms.currentState === ClinicalRequestState.COMPLETED
            ? {
              id: ms.id,
              name: ms.clinicalRequestType.name,
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

  // FORM SUBMISSION
  const onSubmitFn = (
    mutation: typeof createDecision, values: DecisionPointPageForm, isConfirmed = false,
  ) => {
    const clinicalRequestRequests: ClinicalRequestRequestInput[] = values
      .clinicalRequestRequests?.filter(
        (m) => (m.checked !== false),
      ).map((m) => ({
        // The value of 'checked' will be anything we supply in the tag, but the
        // form expects it to be boolean and breaks if it's not - so we do this cast
        clinicalRequestTypeId: m.checked as unknown as string,
      }));

    if (!isConfirmed) {
      setRequestConfirmation(clinicalRequestRequests.length);
    } else {
      let addPatientToMdt = null;
      if (values.mdtSelected) {
        addPatientToMdt = {
          id: values.mdtSessionId,
          reason: values.mdtReason,
        };
      }
      const variables: createDecisionPointVariables = {
        input: {
          onPathwayId: values.onPathwayId,
          clinicHistory: values.clinicHistory,
          comorbidities: values.comorbidities,
          decisionType: values.decisionType,
          clinicalRequestRequests: clinicalRequestRequests,
          clinicalRequestResolutions: values.clinicalRequestResolutions?.map((mr) => mr.id),
          mdt: addPatientToMdt,
          fromMdtId: fromMdtId,
        },
      };
      mutation({ variables: variables });
    }
  };
  if (requestConfirmation !== null) {
    if (requestConfirmation === true || requestConfirmation === 0) {
      return (
        <ConfirmNoClinicalRequests
          confirmFn={ () => setRequestConfirmation(false) }
          cancelFn={ () => {
            setRequestConfirmation(false);
          } }
          submitFn={ () => {
            onSubmitFn(createDecision, getValues(), true);
            setRequestConfirmation(false);
          } }
          clinicalRequestResolutions={ hiddenConfirmationFields.map((field) => field.name) }
        />
      );
    }
    if (requestConfirmation > 0) {
      const clinicalRequests = getValues()?.clinicalRequestRequests?.filter(
        (m) => m.checked,
      ).map((m) => ({ id: m.clinicalRequestTypeId, name: m.name }));
      return (
        <DecisionSubmissionConfirmation
          cancelCallback={ () => {
            setRequestConfirmation(false);
          } }
          okCallback={ () => {
            onSubmitFn(createDecision, getValues(), true);
            setRequestConfirmation(false);
          } }
          clinicalRequests={ clinicalRequests }
          clinicalRequestResolutions={ hiddenConfirmationFields.map((field) => field.name) }
        />
      );
    }
  }

  if (
    // && !mutateData?.createDecisionPoint?.userErrors
    !mutateData?.createDecisionPoint?.userErrors
    && mutateData?.createDecisionPoint.decisionPoint
  ) {
    const _clinicalRequests = mutateData?.createDecisionPoint?.decisionPoint?.clinicalRequests?.map(
      (ms) => ({
        id: ms.id,
        name: ms.clinicalRequestType.name,
        isDischarge: ms.clinicalRequestType.isDischarge,
      }),
    );
    return _clinicalRequests?.find((ms) => ms.isDischarge)
      ? <PathwayComplete />
      : (
        <DecisionSubmissionSuccess
          clinicalRequests={ _clinicalRequests }
          clinicalRequestResolutions={ hiddenConfirmationFields.map((field) => field.name) }
          onClose={ () => {
            if (closeCallback) closeCallback();
          } }
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
        <label className="form-check-label pull-right" htmlFor={ `clinicalRequestRequests.${index}.checked` }>
          <input
            className="form-check-input"
            type="checkbox"
            value={ field.clinicalRequestTypeId }
            { ...register(`clinicalRequestRequests.${index}.checked` as const) }
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
    <LoadingSpinner loading={ loading || mdtLoading }>
      <Container fluid>
        <ErrorSummary className="sd-dp-errormessage" aria-labelledby="error-summary-title" role="alert" hidden={ onPathwayLock === undefined }>
          <ErrorSummary.Title id="error-summary-title">
            This patient is locked by { `${onPathwayLock?.lockUser.firstName} ${onPathwayLock?.lockUser.lastName}` }
          </ErrorSummary.Title>
        </ErrorSummary>
        {
          mutateData?.createDecisionPoint?.userErrors
            ? mutateData?.createDecisionPoint?.userErrors?.map(
              (uE) => <ErrorMessage key={ uE.field }> {uE.message} </ErrorMessage>,
            )
            : ''
        }
        { mutateError ? <ErrorMessage> {mutateError?.message} </ErrorMessage> : false }
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
                { ...register(`clinicalRequestResolutions.${index}.id`) }
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
          {
            showMdtDetails
              ? (
                <div className="row">
                  <hr />
                  { mdtError ? <ErrorMessage> {mdtError?.message} </ErrorMessage> : false }
                  {
                    formErrors.mdtSessionId
                      ? <ErrorMessage> {formErrors.mdtSessionId?.message} </ErrorMessage>
                      : false
                  }
                  {
                    formErrors.mdtReason
                      ? <ErrorMessage> {formErrors.mdtReason?.message} </ErrorMessage>
                      : false
                  }
                  <div className="col-12 col-md-5 d-inline-block">
                    <Select label="MDT session" className="w-100" { ...register('mdtSessionId') }>
                      <option value="-1">Select MDT</option>
                      {
                        mdtData?.getMdts.map((mdt) => (
                          mdt
                            ? (
                              <option
                                key={ mdt.id }
                                value={ mdt.id }
                              >
                                { new Date(mdt.plannedAt).toLocaleDateString() }
                              </option>
                            )
                            : ''
                        ))
                      }
                    </Select>
                  </div>
                  <div className="col-12 col-md-5 offset-md-2 d-inline-block">
                    <Textarea label="Discussion points" { ...register('mdtReason') } />
                  </div>
                </div>
              )
              : ''
          }
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
