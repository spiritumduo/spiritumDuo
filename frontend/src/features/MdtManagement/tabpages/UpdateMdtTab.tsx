/* eslint-disable max-len */
import React, { useState, useContext, useEffect } from 'react';

import { Button, ErrorMessage, Form, Label, SummaryList } from 'nhsuk-react-components';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import * as yup from 'yup';
import { gql, useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/nhs-style';

import { PathwayContext } from 'app/context';
import { getMdtForUpdate } from './__generated__/getMdtForUpdate';
import { updateMdt } from './__generated__/updateMdt';

export const GET_MDT_QUERY = gql`
  query getMdtForUpdate($pathwayId: ID!, $plannedAt: Date!){
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

export const UPDATE_MDT_MUTATION = gql`
  mutation updateMdt($input: UpdateMdtInput!){
    updateMdt(input: $input){
      mdt{
        id
        pathway{
          id
          name
        }
        creator{
          id
          username
        }
        createdAt
        plannedAt
        updatedAt
        location
      }
      userErrors{
        field
        message
      }
    }
  }
`;

type UpdateMdtForm = {
  plannedAt: Date;
  id: string;
  location: string;
};

export interface UpdateMdtInputs {
  plannedAt: Date;
  id: string;
  location: string;
}

const updateMdtFormSchema = yup.object({
  plannedAt: yup.date().required('A date is required'),
  location: yup.string().required('A location is required'),
  id: yup.string().required(),
});

const UpdateMdtTabPage = (): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [newDate, setNewDate] = useState<Date>();
  const { currentPathwayId } = useContext(PathwayContext);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
  } = useForm<UpdateMdtForm>({ resolver: yupResolver(updateMdtFormSchema) });

  const { data, loading, error } = useQuery<getMdtForUpdate>(GET_MDT_QUERY, {
    variables: {
      pathwayId: currentPathwayId,
      plannedAt: selectedDate,
    },
  });

  const [
    updateMdtMutation, { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation<updateMdt>(UPDATE_MDT_MUTATION);

  const submitFormFn = (values: UpdateMdtInputs) => {
    updateMdtMutation({
      variables: {
        input: {
          plannedAt: new Date(Date.UTC(values.plannedAt.getFullYear(), values.plannedAt.getMonth(), values.plannedAt.getDate())),
          id: values.id,
          location: values.location,
        },
      },
    });
  };

  useEffect(() => {
    if (data?.getMdt?.id) {
      setValue('location', data.getMdt.location);
      setNewDate(new Date(data.getMdt.plannedAt));
      setValue('plannedAt', new Date(data.getMdt.plannedAt));
      setValue('id', data.getMdt.id);
    } else {
      setNewDate(undefined);
      setValue('location', '');
    }
  }, [setNewDate, setValue, data]);

  const datePickerFormControl = register('plannedAt');

  if (updateData?.updateMdt?.mdt?.id && showConfirmation) {
    return (
      <>
        <div className="mt-2"><h3>Success</h3></div>
        <SummaryList>
          <SummaryList.Row>
            <SummaryList.Key>Pathway name</SummaryList.Key>
            <SummaryList.Value>{ updateData?.updateMdt?.mdt?.pathway.name }</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Date Planned</SummaryList.Key>
            <SummaryList.Value>{ updateData?.updateMdt?.mdt?.plannedAt }</SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Location</SummaryList.Key>
            <SummaryList.Value>{ updateData?.updateMdt?.mdt?.location }</SummaryList.Value>
          </SummaryList.Row>
        </SummaryList>
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
        updateError
          ? <ErrorMessage>{ updateError.message }</ErrorMessage>
          : ''
      }
      {
        updateData?.updateMdt?.userErrors?.map((val) => (
          <ErrorMessage key={ val.field }>{val.message}</ErrorMessage>
        ))
      }
      {
        formErrors?.plannedAt
          ? <ErrorMessage>{ formErrors?.plannedAt?.message }</ErrorMessage>
          : ''
      }
      {
        formErrors?.location
          ? <ErrorMessage>{ formErrors?.location?.message }</ErrorMessage>
          : ''
      }
      <Form
        onSubmit={ handleSubmit(() => { submitFormFn(getValues()); setShowConfirmation(true); }) }
        disabled={ loading || updateLoading }
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
          <Label>
            Update Date of MDT
            <DatePicker
              selected={ newDate }
              className="nhsuk-input"
              dateFormat="dd/MM/yyyy"
              onChange={ (date: Date) => { setValue('plannedAt', date); setNewDate(date); } }
              onBlur={ datePickerFormControl.onBlur }
              disabled={
                datePickerFormControl.disabled || loading || !data?.getMdt?.id || updateLoading
              }
              ref={ datePickerFormControl.ref }
              name={ datePickerFormControl.name }
              required={ datePickerFormControl.required }
            />
          </Label>
        </div>
        <div className="col-12 col-lg-5 d-inline-block">
          <Input
            label="Location"
            { ...register('location') }
            disabled={ !data?.getMdt?.id }
          />
        </div>
        <div className="col-12 col-lg-5 d-inline-block offset-lg-2">
          <Input
            label="Creator (read-only)"
            disabled
            value={
              data?.getMdt
                ? `${data?.getMdt?.creator?.firstName} ${data?.getMdt?.creator?.lastName} (${data?.getMdt?.creator?.username})`
                : ''
            }
          />
        </div>
        <br />
        <Button className="mt-4 mb-0 float-end" disabled={ loading || updateLoading }>Update</Button>
      </Form>
    </>
  );
};

export default UpdateMdtTabPage;
