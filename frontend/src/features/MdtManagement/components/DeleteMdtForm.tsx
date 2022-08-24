import React, { useState, useEffect } from 'react';
import { Button, ErrorMessage, Form } from 'nhsuk-react-components';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';

import MDT from 'types/MDT';
import { Select } from 'components/nhs-style';

import { deleteMdt } from './__generated__/deleteMdt';

export const DELETE_MDT_MUTATION = gql`
  mutation deleteMdt($input: DeleteMdtInput!){
    deleteMdt(input: $input){
      success
      userErrors{
        field
        message
      }
    }
  }
`;

type DeleteMdtFormType = {
  id: string;
  movePatientsRequired: boolean;
  movePatientsToMdtId?: string;
};

export interface DeleteMdtInputs {
  id: string;
  movePatientsToMdtId?: string;
}

const updateMdtFormSchema = yup.object({
  id: yup.string().required(),
  movePatientsRequired: yup.boolean(),
  movePatientsToMdtId: yup.number().when('movePatientsRequired', {
    is: true,
    then: yup.number().required('This is a required field').integer().positive('A valid MDT must be selected'),
  }),
});

interface DeleteMdtTabProps {
  mdt: MDT;
  allMdts: (MDT | null)[];
  successCallback: () => void;
}

const DeleteMdtForm = ({ mdt, successCallback, allMdts }: DeleteMdtTabProps): JSX.Element => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState,
    getValues,
    setValue,
  } = useForm<DeleteMdtFormType>({ resolver: yupResolver(updateMdtFormSchema) });

  const [
    deleteMdtMutation, { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation<deleteMdt>(DELETE_MDT_MUTATION);

  const submitFormFn = (values: DeleteMdtInputs) => {
    deleteMdtMutation({
      variables: {
        input: {
          id: values.id,
          movePatientsToMdtId: values.movePatientsToMdtId,
        },
      },
    });
  };

  useEffect(() => {
    setValue('id', mdt.id);
    setValue('movePatientsRequired', mdt.patients ? mdt.patients.length > 0 : false);
  }, [mdt, setValue]);

  if (deleteData?.deleteMdt?.success && showConfirmation) {
    return (
      <>
        <div className="mt-2"><h3>Success</h3></div>
        <Button className="mt-0 mb-0 float-end" onClick={ () => { successCallback(); setShowConfirmation(false); } }>Close</Button>
      </>
    );
  }
  const patientsOnMdt = mdt.patients ? mdt.patients.length > 0 : false;
  return (
    <>
      {
        deleteError
          ? <ErrorMessage>{ deleteError.message }</ErrorMessage>
          : ''
      }
      {
        deleteData?.deleteMdt?.userErrors?.map((val) => (
          <ErrorMessage key={ val.field }>{val.message}</ErrorMessage>
        ))
      }
      <Form
        onSubmit={ handleSubmit(() => { submitFormFn(getValues()); setShowConfirmation(true); }) }
        disabled={ deleteLoading }
      >
        <input type="hidden" value={ mdt.id } { ...register('id') } />
        {
          patientsOnMdt ? (
            <>
              <p><strong>The following patients need to be moved to another MDT:</strong></p>
              {
                mdt.patients?.map(
                  (pt) => (
                    <p key={ pt?.id }>
                      { `${pt?.firstName} ${pt?.lastName} (${pt?.hospitalNumber})` }
                    </p>
                  ),
                )
              }
              <Select
                error={ formState.errors?.movePatientsToMdtId?.message }
                label="Select MDT to move patients to"
                { ...register('movePatientsToMdtId') }
              >
                <option value="-1">Select MDT</option>
                {
                  allMdts.map((_mdt) => (
                    mdt.plannedAt !== _mdt?.plannedAt
                      ? (
                        <option key={ _mdt?.id } value={ _mdt?.id }>
                          {_mdt?.plannedAt.toLocaleDateString()}
                        </option>
                      ) : ''
                  ))
                }
              </Select>
            </>
          )
            : <p>There are no patients on this MDT.</p>
        }
        <Button className="mt-4 mb-0 float-end" disabled={ deleteLoading }>
          {
            patientsOnMdt
              ? 'Move patients and delete MDT'
              : 'Delete MDT'
          }
        </Button>
      </Form>
    </>
  );
};

export default DeleteMdtForm;
