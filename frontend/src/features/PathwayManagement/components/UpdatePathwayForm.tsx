import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { ApolloQueryResult, gql, OperationVariables, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form, SummaryList } from 'nhsuk-react-components';

import { Input, Select as NHSSelect } from 'components/nhs-style';
import { updatePathway } from 'features/PathwayManagement/components/__generated__/updatePathway';
import { getPathways } from 'features/PathwayManagement/__generated__/getPathways';

import Select from 'react-select';

export const UPDATE_PATHWAY_MUTATION = gql`
mutation updatePathway($input: UpdatePathwayInput!){
  updatePathway(input: $input){
    pathway{
      id
      name
      clinicalRequestTypes{
        id
        name
        refName
      }
    }
    userErrors{
      field
      message
    }
  }
}
`;

type UpdatePathwayFormType = {
  pathwayIndex: string;
  name: string;
  clinicalRequestTypes: {
    label: string;
    value: string;
  }[];
};

export interface UpdatePathwayInputs {
  name: string;
  clinicalRequestTypes: {
    label: string;
    value: string;
  }[];
}

export interface UpdatePathwayFormProps {
  disableForm?: boolean | undefined,
  refetchPathways?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<getPathways>>,
  clinicalRequestTypes: {id: string, name: string, refName: string}[] | undefined,
  pathways: (
    {
      id: string;
      name: string;
      clinicalRequestTypes: {
        id: string;
        name: string;
        refName: string;
      }[] | undefined;
    } | null
  )[] | undefined
}

const UpdatePathwayForm = (
  { disableForm, clinicalRequestTypes, pathways, refetchPathways }: UpdatePathwayFormProps,
): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPathway, setSelectedPathway] = useState<string>('-1');
  const [clinicalRequestTypeFields, setClinicalRequestTypeFields] = useState<
    {label: string, value: string}[]
  >();

  const [updatePathwayFunc, {
    data: mutationData, loading: mutationLoading, error: mutationError,
  }] = useMutation<updatePathway>(UPDATE_PATHWAY_MUTATION);

  const onSubmit = (
    mutation: typeof updatePathwayFunc, values: UpdatePathwayFormType,
  ) => {
    const selectedClinicalRequestTypes: Array<{id: string}> = [];
    values.clinicalRequestTypes.forEach((mT) => {
      selectedClinicalRequestTypes.push( { id: mT.value } );
    });

    mutation({
      variables: {
        input: {
          id: selectedPathway,
          name: values.name,
          clinicalRequestTypes: selectedClinicalRequestTypes,
        },
      },
    });
  };

  useEffect(() => {
    if (mutationData?.updatePathway?.pathway?.id !== undefined) {
      setShowModal(true);
      if (refetchPathways) {
        refetchPathways();
      }
    }
  }, [mutationData, setShowModal, refetchPathways]);

  const newPathwaySchema = yup.object({
    name: yup.string().required('Pathway name is a required field'),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
    control,
  } = useForm<UpdatePathwayFormType>({ resolver: yupResolver(newPathwaySchema) });

  useEffect(() => {
    setClinicalRequestTypeFields(clinicalRequestTypes
      ? clinicalRequestTypes.flatMap((mT) => (
        {
          label: mT.name,
          value: mT.id,
        }
      ))
      : []);
  }, [clinicalRequestTypes, setClinicalRequestTypeFields]);

  useEffect(() => {
    setValue('name', '');
    setValue('clinicalRequestTypes', []);

    if (selectedPathway !== '-1' && selectedPathway) {
      const currPathway = pathways?.filter(
        (pathway) => (pathway?.id === selectedPathway),
      )?.[0];

      const listOfClinicalRequestTypes: Array<{label: string, value: string}> = [];

      if (currPathway) {
        setValue('name', currPathway.name);
        currPathway?.clinicalRequestTypes?.forEach((clinicalRequestType) => {
          if (clinicalRequestType) {
            clinicalRequestTypeFields?.find((mT) => (
              mT.value === clinicalRequestType.id
              && listOfClinicalRequestTypes.push({ label: mT.label, value: mT.value })
            ));
          }
        });
      }
      setValue('clinicalRequestTypes', listOfClinicalRequestTypes);
    }
  }, [pathways, clinicalRequestTypeFields, selectedPathway, setValue]);

  return (
    <>
      { mutationError ? <ErrorMessage>{mutationError.message}</ErrorMessage> : null}
      {
        mutationData?.updatePathway?.userErrors
          ? (
            mutationData?.updatePathway?.userErrors?.map((userError) => (
              <ErrorMessage key={ userError.field }>{userError.message}</ErrorMessage>
            ))
          ) : null
      }
      <Form
        onSubmit={ handleSubmit( () => {
          onSubmit(updatePathwayFunc, getValues());
        }) }
      >
        <Fieldset
          disabled={
            mutationLoading || showModal || disableForm
          }
        >
          <NHSSelect
            className="col-12"
            label="Select existing pathway"
            // eslint-disable-next-line react/jsx-props-no-spreading
            { ...register('pathwayIndex') }
            onChange={ (
              (e: { currentTarget: { value: React.SetStateAction<string> } }) => {
                setSelectedPathway(e.currentTarget.value);
              }) }
          >
            <option value="-1">Select a pathway</option>
            {
              pathways?.map((pathway) => (
                pathway ? <option key={ pathway.id } value={ pathway.id }>{ pathway.name }</option>
                  : null
              ))
            }
          </NHSSelect>
        </Fieldset>

        <Fieldset
          disabled={
            mutationLoading || showModal
            || disableForm
          }
        >
          <Input id="name" label="Pathway name" error={ formErrors.name?.message } { ...register('name', { required: true }) } />
        </Fieldset>
        <Fieldset
          disabled={
            mutationLoading || showModal
            || disableForm
          }
        >
          <Fieldset.Legend>Clinical request types</Fieldset.Legend>
          <Controller
            name="clinicalRequestTypes"
            control={ control }
            render={ ({ field }) => (
              <Select
                className="mb-4"
                isMulti
                isClearable
                onBlur={ field.onBlur }
                onChange={ field.onChange }
                ref={ field.ref }
                value={ field.value }
                options={ clinicalRequestTypeFields?.map((mT) => (
                  { label: mT.label, value: mT.value }
                )) }
              />
            ) }
          />
        </Fieldset>
        <Fieldset
          disabled={
            mutationLoading || showModal
            || disableForm
          }
        >
          <Button className="float-end">Update pathway</Button>
        </Fieldset>
      </Form>
      <Modal show={ showModal } onHide={ (() => setShowModal(false)) }>
        <Modal.Header>
          <Modal.Title>Pathway Updated</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Pathway name</SummaryList.Key>
              <SummaryList.Value>{mutationData?.updatePathway?.pathway?.name}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Permissions</SummaryList.Key>
              <SummaryList.Value>
                <ul>
                  {
                    mutationData?.updatePathway?.pathway?.clinicalRequestTypes?.map((mT) => (
                      <li key={ `update_pathway_modal_perm_${mT.id}` }>{mT.name}</li>
                    ))
                  }
                </ul>
              </SummaryList.Value>
            </SummaryList.Row>
          </SummaryList>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={ (() => setShowModal(false)) }>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default UpdatePathwayForm;
