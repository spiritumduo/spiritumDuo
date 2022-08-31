import React, { useEffect, useState } from 'react';

// LIBRARIES
import { Button, SummaryList, ErrorMessage } from 'nhsuk-react-components';
import { Modal } from 'react-bootstrap';
import { BsX } from 'react-icons/bs';
import { Tabs, Tab, TabPanel, TabList } from 'react-tabs';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { gql, useMutation } from '@apollo/client';
import LoadingSpinner from 'components/LoadingSpinner/LoadingSpinner';

// APP
import { useHospitalNumberFormat, useNationalNumberFormat } from 'app/hooks/format-identifier';

// COMPONENTS
import { Textarea } from 'components/nhs-style';

// LOCAL
import { updateOnMdt } from './__generated__/updateOnMdt';
import { deleteOnMdt } from './__generated__/deleteOnMdt';

export const UPDATE_ON_MDT_MUTATION = gql`
  mutation updateOnMdt($input: UpdateOnMdtInput!){
    updateOnMdt(input: $input){
      onMdt{
        id
        reason
      }
      userErrors{
        field
        message
      }
    }
  }
`;

export const DELETE_ON_MDT_MUTATION = gql`
  mutation deleteOnMdt($id: ID!){
    deleteOnMdt(id: $id){
      success
      userErrors{
        field
        message
      }
    }
  }
`;

interface OnMdtElement {
  id: string; onMdtId: string; firstName: string; lastName: string;
  hospitalNumber: string; nationalNumber: string;
  dateOfBirth: Date; mdtReason: string;
}

const updateSchema = yup.object({
  id: yup.number().positive().required(),
  reason: yup.string().required('A reason is required'),
});

type UpdateForm = {
  id: string;
  reason: string;
};

const deleteSchema = yup.object({
  id: yup.number().positive().required(),
});

type DeleteForm = {
  id: string;
};

interface PatientOnMdtProps{
  onMdt: OnMdtElement;
  closeCallback: () => void;
  refetch?: () => void;
}

const OnMdtManagement = ({ onMdt, closeCallback, refetch }: PatientOnMdtProps) => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const formatHospitalNumber = useHospitalNumberFormat();
  const formatNationalNumber = useNationalNumberFormat();

  const [
    updateMutation, { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation<updateOnMdt>(UPDATE_ON_MDT_MUTATION);

  const [
    deleteMutation, { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation<deleteOnMdt>(DELETE_ON_MDT_MUTATION);

  const {
    register: updateFormRegister,
    handleSubmit: updateFormHandleSubmit,
    formState: { errors: updateFormFormErrors },
    getValues: updateFormGetValues,
    setValue: updateFormSetValue,
  } = useForm<UpdateForm>({ resolver: yupResolver(updateSchema) });

  const {
    register: deleteFormRegister,
    handleSubmit: deleteFormHandleSubmit,
    getValues: deleteFormGetValues,
    setValue: deleteFormSetValue,
  } = useForm<DeleteForm>({ resolver: yupResolver(deleteSchema) });

  useEffect(() => {
    if (onMdt) {
      updateFormSetValue('id', onMdt.onMdtId);
      updateFormSetValue('reason', onMdt.mdtReason);
      deleteFormSetValue('id', onMdt.onMdtId);
    }
  }, [deleteFormSetValue, onMdt, updateFormSetValue]);

  const updateFormFn = ((values: UpdateForm) => {
    updateMutation({ variables: { input: values } });
    setShowConfirmation(true);
    if (refetch) refetch();
  });

  const deleteFormFn = ((values: DeleteForm) => {
    deleteMutation({ variables: values });
    setShowConfirmation(true);
    if (refetch) refetch();
  });

  return (
    <Modal show={ !!onMdt } onHide={ () => closeCallback() }>
      <Modal.Header>
        <Modal.Title>
          MDT Management -&nbsp;
          { `${onMdt?.firstName} ${onMdt?.lastName}, ${formatHospitalNumber(onMdt?.hospitalNumber)}, ${formatNationalNumber(onMdt?.nationalNumber)}` }
        </Modal.Title>
        <button
          type="button"
          className="bg-transparent"
          name="Close"
          style={ { border: 'none' } }
          onClick={ () => closeCallback() }
        >
          <p className="nhsuk-u-visually-hidden">Close</p>
          <BsX size="2rem" />
        </button>
      </Modal.Header>
      <Modal.Body>
        <Tabs>
          <TabList>
            <Tab disabled={ showConfirmation }>Update</Tab>
            <Tab disabled={ showConfirmation }>Delete</Tab>
          </TabList>
          <TabPanel>
            {
              updateError?.message
                ? <ErrorMessage>{updateError.message}</ErrorMessage>
                : ''
            }
            {
              showConfirmation && (
                (updateData && !updateData?.updateOnMdt?.userErrors)
                || updateLoading
              )
                ? (
                  <LoadingSpinner loading={ updateLoading }>
                    <strong>Success</strong>
                    <SummaryList>
                      <SummaryList.Row>
                        <SummaryList.Key>Reason</SummaryList.Key>
                        <SummaryList.Value>
                          {updateData?.updateOnMdt.onMdt?.reason}
                        </SummaryList.Value>
                      </SummaryList.Row>
                    </SummaryList>
                    <Button className="float-end mt-4 mb-1" onClick={ () => { setShowConfirmation(false); if (refetch) refetch(); closeCallback(); } }>Close</Button>
                  </LoadingSpinner>
                )
                : (
                  <form
                    onSubmit={ updateFormHandleSubmit(() => {
                      updateFormFn(updateFormGetValues());
                    }) }
                  >
                    {
                      updateData?.updateOnMdt?.userErrors?.map(
                        (er) => <ErrorMessage key={ er.field }>{er.message}</ErrorMessage>,
                      )
                    }
                    <input type="hidden" value={ onMdt?.onMdtId } { ...updateFormRegister('id') } />
                    <Textarea label="Reason added to MDT" { ...updateFormRegister('reason') } error={ updateFormFormErrors?.reason?.message } />
                    <Button className="float-end mt-4 mb-1">Update patient&apos;s MDT registration</Button>
                  </form>
                )
            }
          </TabPanel>
          <TabPanel>
            {
              deleteError?.message
                ? <ErrorMessage>{deleteError?.message}</ErrorMessage>
                : ''
            }
            {
              showConfirmation && (
                (deleteData && !deleteData?.deleteOnMdt?.userErrors)
                || deleteLoading
              )
                ? (
                  <LoadingSpinner loading={ deleteLoading }>
                    <strong>Success</strong>
                    <Button className="float-end mt-4 mb-1" onClick={ () => { setShowConfirmation(false); if (refetch) refetch(); closeCallback(); } }>Close</Button>
                  </LoadingSpinner>
                )
                : (
                  <form
                    onSubmit={ deleteFormHandleSubmit(() => {
                      deleteFormFn(deleteFormGetValues());
                    }) }
                  >
                    {
                      deleteData?.deleteOnMdt?.userErrors?.map(
                        (er) => <ErrorMessage key={ er.field }>{er.message}</ErrorMessage>,
                      )
                    }
                    <input type="hidden" value={ onMdt?.onMdtId } { ...deleteFormRegister('id') } />
                    <Button className="float-end mt-4 mb-1">Remove patient&apos;s MDT registration</Button>
                  </form>
                )
            }
          </TabPanel>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default OnMdtManagement;
