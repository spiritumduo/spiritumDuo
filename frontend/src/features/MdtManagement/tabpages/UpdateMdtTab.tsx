import React, { useState, useEffect, useContext } from 'react';

import { Button, ErrorMessage, Form, Label, SummaryList } from 'nhsuk-react-components';
import { Controller, useForm, useFieldArray } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import * as yup from 'yup';
import { gql, useMutation, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input } from 'components/nhs-style';
import MDT from 'types/MDT';
import Select from 'react-select';
import { PathwayContext } from 'app/context';

import { updateMdt } from './__generated__/updateMdt';
import { getUsersOnPathway } from './__generated__/getUsersOnPathway';

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

export const GET_USERS = gql`
  query getUsersOnPathway($pathwayId: ID!){
    getUsers(pathwayId: $pathwayId){
      id
      username
      firstName
      lastName
    }
  }
`;

type UpdateMdtForm = {
  plannedAt: Date;
  id: string;
  location: string;
  users: {
    label: string;
    value: string;
  }[];
};

export interface UpdateMdtInputs {
  plannedAt: Date;
  id: string;
  location: string;
  users: {
    label: string;
    value: string;
  }[];
}

const updateMdtFormSchema = yup.object({
  plannedAt: yup.date().required('A date is required'),
  location: yup.string().required('A location is required'),
  id: yup.string().required(),
  users: yup.array().required(),
});

interface UpdateMdtTabProps{
  mdt: MDT;
  successCallback: () => void;
}

const UpdateMdtTabPage = ({ mdt, successCallback }: UpdateMdtTabProps): JSX.Element => {
  const [newDate, setNewDate] = useState<Date>();
  const [userFields, setUserFields] = useState<
    { label: string, value: string }[]
  >();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const { currentPathwayId } = useContext(PathwayContext);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
    control,
  } = useForm<UpdateMdtForm>({ resolver: yupResolver(updateMdtFormSchema) });

  const { loading, data, error } = useQuery<getUsersOnPathway>(GET_USERS, { variables: {
    pathwayId: currentPathwayId,
  } });

  useEffect(() => {
    setUserFields(data?.getUsers
      ? data.getUsers.flatMap((user) => (
        {
          label: `${user?.firstName} ${user?.lastName} (${user?.username})`,
          value: user?.id || '0',
        }
      ))
      : []);
  }, [data?.getUsers, setUserFields]);

  const [
    updateMdtMutation, { data: updateData, error: updateError, loading: updateLoading },
  ] = useMutation<updateMdt>(UPDATE_MDT_MUTATION);

  const submitFormFn = (values: UpdateMdtInputs) => {
    const selectedUsers: Array<string> = [];
    values.users.forEach((user) => {
      selectedUsers.push( user.value );
    });

    const dateTimeWithOffset = new Date(
      Date.UTC(
        values.plannedAt.getFullYear(),
        values.plannedAt.getMonth(),
        values.plannedAt.getDate(),
      ),
    );

    updateMdtMutation({
      variables: {
        input: {
          plannedAt: dateTimeWithOffset,
          id: values.id,
          location: values.location,
          users: selectedUsers,
        },
      },
    });
  };

  const datePickerFormControl = register('plannedAt');

  useEffect(() => {
    setValue('id', mdt.id);
    setValue('plannedAt', new Date(mdt.plannedAt));
    setNewDate(new Date(mdt.plannedAt));
    setValue('location', mdt.location);

    const users: {label: string, value: string}[] = [];

    mdt.clinicians?.forEach((user) => {
      if (!user) return;
      users.push({
        label: `${user.firstName} ${user.lastName} (${user.username})`,
        value: user.id,
      });
    });

    setValue('users', users);
  }, [mdt, setValue]);

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
            <SummaryList.Value>
              { new Date(updateData?.updateMdt?.mdt?.plannedAt).toLocaleDateString() }
            </SummaryList.Value>
          </SummaryList.Row>
          <SummaryList.Row>
            <SummaryList.Key>Location</SummaryList.Key>
            <SummaryList.Value>{ updateData?.updateMdt?.mdt?.location }</SummaryList.Value>
          </SummaryList.Row>
        </SummaryList>
        <Button className="mt-0 mb-0 float-end" onClick={ () => { successCallback(); setShowConfirmation(false); } }>Close</Button>
      </>
    );
  }

  return (
    <>
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
      {
        error
          ? <ErrorMessage>{error.message}</ErrorMessage>
          : ''
      }
      <Form
        onSubmit={ handleSubmit(() => { submitFormFn(getValues()); setShowConfirmation(true); }) }
        disabled={ updateLoading }
      >
        <input type="hidden" value={ mdt?.id } { ...register('id') } />
        <div className="col-12 col-lg-5 d-inline-block">
          <Label>
            Date
            <DatePicker
              selected={ newDate }
              className="nhsuk-input"
              dateFormat="dd/MM/yyyy"
              onChange={ (date: Date) => { setValue('plannedAt', date); setNewDate(date); } }
              onBlur={ datePickerFormControl.onBlur }
              disabled={
                datePickerFormControl.disabled || updateLoading
              }
              ref={ datePickerFormControl.ref }
              name={ datePickerFormControl.name }
              required={ datePickerFormControl.required }
            />
          </Label>
        </div>
        <div className="col-12 col-lg-5 d-inline-block offset-lg-2">
          <Input
            label="Location"
            { ...register('location') }
          />
        </div>
        <div className="col-12 col-lg-5 d-inline-block">
          <Label>
            Staff present
            <Controller
              name="users"
              control={ control }
              render={ ({ field }) => (
                <Select
                  className="mb-4"
                  isMulti
                  onBlur={ field.onBlur }
                  onChange={ field.onChange }
                  ref={ field.ref }
                  value={ field.value }
                  options={ userFields?.map((user) => (
                    { label: user.label, value: user.value }
                  )) }
                />
              ) }
            />
          </Label>
        </div>
        <br />
        <Button className="mt-4 mb-0 float-end" disabled={ updateLoading }>Update</Button>
      </Form>
    </>
  );
};

export default UpdateMdtTabPage;
