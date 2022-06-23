/* eslint-disable max-len */
import React, { useState, useContext, useEffect } from 'react';

import { Button, ErrorMessage, Form, Label } from 'nhsuk-react-components';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import * as yup from 'yup';
import { gql, useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/nhs-style';

import { PathwayContext } from 'app/context';
import { getMdtForUpdate } from './__generated__/getMdtForUpdate';
import { deleteMdt } from './__generated__/deleteMdt';

export const GET_MDT_QUERY = gql`
  query getMdtForDelete($pathwayId: ID!, $plannedAt: Date!){
    getMdt(pathwayId: $pathwayId, plannedAt: $plannedAt){
      id
      pathway{
        id
        name
      }
      creator{
        id
        username
        firstName
        lastName
      }
      createdAt
      plannedAt
      updatedAt
      location
    }
  }
`;

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

const DeleteMdtTabPage = (): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { currentPathwayId } = useContext(PathwayContext);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
  } = useForm<DeleteMdtForm>({ resolver: yupResolver(updateMdtFormSchema) });

  const { data, loading, error } = useQuery<getMdtForUpdate>(GET_MDT_QUERY, {
    variables: {
      pathwayId: currentPathwayId,
      plannedAt: selectedDate,
    },
  });

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
    if (data?.getMdt?.id) {
      setValue('id', data.getMdt.id);
    }
  }, [setValue, data]);

  if (deleteData?.deleteMdt?.success && showConfirmation) {
    return (
      <>
        <div className="mt-2"><h3>Success</h3></div>
        <Button className="mt-0 mb-0 float-end" onClick={ () => setShowConfirmation(false) }>Back</Button>
      </>
    );
  }

  return (
    <>
      {
        error?.message
          ? <ErrorMessage><strong>GraphQL error:&nbsp;</strong>{ error.message }</ErrorMessage>
          : ''
      }
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
        disabled={ loading || deleteLoading }
      >
        <input type="hidden" value={ data?.getMdt?.id } { ...register('id') } />
        <div className="col-12 col-lg-5 d-inline-block">
          <Label>
            Select MDT
            <DatePicker
              selected={ selectedDate }
              className="nhsuk-input"
              dateFormat="dd/MM/yyyy"
              onChange={ (date: Date) => { setSelectedDate(date); } }
            />
          </Label>
        </div>
        <div className="col-12 col-lg-5 d-inline-block offset-lg-2">
          <Input
            label="Location"
            disabled
            value={ data?.getMdt?.location }
          />
        </div>
        <div className="col-12 col-lg-5 d-inline-block">
          <Input
            label="Creator"
            disabled
            value={
              data?.getMdt
                ? `${data?.getMdt?.creator?.firstName} ${data?.getMdt?.creator?.lastName} (${data?.getMdt?.creator?.username})`
                : ''
            }
          />
        </div>
        <br />
        <Button className="mt-4 mb-0 float-end" disabled={ loading || deleteLoading }>Delete</Button>
      </Form>
    </>
  );
};

export default DeleteMdtTabPage;
