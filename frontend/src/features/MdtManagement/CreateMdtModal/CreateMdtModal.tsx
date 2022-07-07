import React, { useState, useContext } from 'react';

// libraries
import { BsX } from 'react-icons/bs';
import { Button, ErrorMessage, Form, Label, SummaryList } from 'nhsuk-react-components';
import { useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import * as yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';

// app
import { PathwayContext } from 'app/context';

// components
import { Input } from 'components/nhs-style';
import { Modal } from 'react-bootstrap';
import { createMdt } from './__generated__/createMdt';

type CreateMdtForm = {
  plannedAt: Date;
  pathwayId: number;
  location: string;
};

const createMdtFormSchema = yup.object({
  plannedAt: yup.date().required('A date is required'),
  location: yup.string().required('A location is required'),
});

export const CREATE_MDT_MUTATION = gql`
  mutation createMdt($input: MdtInput!){
    createMdt(input: $input){
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

export interface CreateMdtInputs {
  plannedAt: Date;
  pathwayId: number;
  location: string;
}

interface CreateMdtModalProps{
  showModal: boolean
  setShowModal: (arg0: boolean) => void
  refetch?: () => void
}

const CreateMdtModal = ({ showModal, setShowModal, refetch }: CreateMdtModalProps): JSX.Element => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { currentPathwayId } = useContext(PathwayContext);
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

  const [
    createMdtMutation, { data, error, loading },
  ] = useMutation<createMdt>(CREATE_MDT_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
  } = useForm<CreateMdtForm>({ resolver: yupResolver(createMdtFormSchema) });

  const submitFormFn = (values: CreateMdtInputs) => {
    const formattedDate = new Date();
    if (values.plannedAt) {
      formattedDate.setUTCHours(0, 0, 0);
      formattedDate.setUTCDate(values.plannedAt.getDate());
    }
    createMdtMutation({
      variables: {
        input: {
          plannedAt: formattedDate,
          pathwayId: values.pathwayId,
          location: values.location,
        },
      },
    });
  };

  const datePickerFormControl = register('plannedAt');

  if (data?.createMdt?.mdt?.id && showConfirmation) {
    return (
      <Modal size="lg" show={ showModal } setShowModal={ setShowModal } onHide={ () => setShowModal(false) }>
        <Modal.Header>
          <Modal.Title>Create MDT</Modal.Title>
          <button
            type="button"
            className="bg-transparent"
            name="Close"
            style={ { border: 'none' } }
            onClick={ () => setShowModal(false) }
          >
            <p className="nhsuk-u-visually-hidden">Close</p>
            <BsX size="2rem" />
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2"><h3>Success</h3></div>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Pathway name</SummaryList.Key>
              <SummaryList.Value>{ data?.createMdt?.mdt?.pathway.name }</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Date Planned</SummaryList.Key>
              <SummaryList.Value>
                { new Date(data?.createMdt?.mdt?.plannedAt).toLocaleDateString() }
              </SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Location</SummaryList.Key>
              <SummaryList.Value>{ data?.createMdt?.mdt?.location }</SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
          <Button className="mt-0 mb-0 float-end" onClick={ () => { if (refetch) refetch(); setShowModal(false); setShowConfirmation(false); } }>Close</Button>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal size="lg" show={ showModal } setShowModal={ setShowModal } onHide={ () => setShowModal(false) }>
      <Modal.Header>
        <Modal.Title>Create MDT</Modal.Title>
        <button
          type="button"
          className="bg-transparent"
          name="Close"
          style={ { border: 'none' } }
          onClick={ () => setShowModal(false) }
        >
          <p className="nhsuk-u-visually-hidden">Close</p>
          <BsX size="2rem" />
        </button>
      </Modal.Header>
      <Modal.Body>
        {
          error
            ? <ErrorMessage><strong>GraphQL error:&nbsp;</strong>{ error.message }</ErrorMessage>
            : ''
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
          data?.createMdt?.userErrors?.map((val) => (
            <ErrorMessage key={ val.field }>{val.message}</ErrorMessage>
          ))
        }
        <Form
          onSubmit={ handleSubmit(() => { submitFormFn(getValues()); setShowConfirmation(true); }) }
          disabled={ loading }
        >
          <input type="hidden" value={ currentPathwayId } { ...register('pathwayId') } />
          <div className="col-12 col-lg-5 d-inline-block">
            <Label>
              Date of MDT
              <DatePicker
                selected={ selectedDate }
                className="nhsuk-input"
                dateFormat="dd/MM/yyyy"
                onChange={ (date: Date) => { setValue('plannedAt', date); setSelectedDate(date); } }
                onBlur={ datePickerFormControl.onBlur }
                disabled={ datePickerFormControl.disabled || loading }
                ref={ datePickerFormControl.ref }
                name={ datePickerFormControl.name }
                required={ datePickerFormControl.required }
              />
            </Label>
          </div>
          <div className="col-12 col-lg-5 d-inline-block offset-lg-2">
            <Input label="Location" { ...register('location') } />
          </div><br />
          <Button className="mt-4 mb-0 float-end" disabled={ loading }>Create</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateMdtModal;
