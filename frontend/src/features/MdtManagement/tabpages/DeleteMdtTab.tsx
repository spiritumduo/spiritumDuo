import React, { useState, useEffect } from 'react';

import { Button, ErrorMessage, Form } from 'nhsuk-react-components';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';

import MDT from 'types/MDT';
import { deleteMdt } from './__generated__/deleteMdt';

export const DELETE_MDT_MUTATION = gql`
  mutation deleteMdt($id: ID!){
    deleteMdt(id: $id){
      success
      userErrors{
        field
        message
      }
    }
  }
`;

type DeleteMdtForm = {
  id: string;
};

export interface UpdateMdtInputs {
  id: string;
}

const updateMdtFormSchema = yup.object({
  id: yup.string().required(),
});

interface DeleteMdtTabProps {
  mdt: MDT;
  successCallback: () => void;
}

const DeleteMdtTabPage = ({ mdt, successCallback }: DeleteMdtTabProps): JSX.Element => {
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
  } = useForm<DeleteMdtForm>({ resolver: yupResolver(updateMdtFormSchema) });

  const [
    deleteMdtMutation, { data: deleteData, error: deleteError, loading: deleteLoading },
  ] = useMutation<deleteMdt>(DELETE_MDT_MUTATION);

  const submitFormFn = (values: UpdateMdtInputs) => {
    deleteMdtMutation({
      variables: {
        id: values.id,
      },
    });
  };

  useEffect(() => {
    setValue('id', mdt.id);
  }, [mdt, setValue]);

  if (deleteData?.deleteMdt?.success && showConfirmation) {
    return (
      <>
        <div className="mt-2"><h3>Success</h3></div>
        <Button className="mt-0 mb-0 float-end" onClick={ () => { successCallback(); setShowConfirmation(false); } }>Close</Button>
      </>
    );
  }

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
        <p>NOTE: you cannot delete an MDT with patients associated.</p>
        <Button className="mt-4 mb-0 float-end" disabled={ deleteLoading }>Delete</Button>
      </Form>
    </>
  );
};

export default DeleteMdtTabPage;
