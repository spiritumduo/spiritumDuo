import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { ApolloQueryResult, gql, OperationVariables, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form, SummaryList } from 'nhsuk-react-components';
import { Input } from 'components/nhs-style';
import { createPathway } from 'features/PathwayManagement/tabpages/__generated__/createPathway';
import { getPathways } from 'features/PathwayManagement/__generated__/getPathways';

import Select from 'react-select';

export const CREATE_PATHWAY_MUTATION = gql`
mutation createPathway($input: PathwayInput!){
  createPathway(input: $input){
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

type CreatePathwayForm = {
  name: string;
  clinicalRequestTypes: {
    label: string;
    value: string;
  }[];
};

export interface CreatePathwayInputs {
  name: string;
  clinicalRequestTypes: {
    label: string;
    value: string;
  }[];
}

export interface CreatePathwayTabProps {
  disableForm?: boolean | undefined,
  refetchPathways?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<getPathways>>,
  clinicalRequestTypes: {id: string, name: string, refName: string}[] | undefined,
}

const CreatePathwayTab = (
  {
    disableForm,
    clinicalRequestTypes,
    refetchPathways,
  }: CreatePathwayTabProps,
): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const [createPathwayFunc, {
    data: mutationData, loading: mutationLoading, error: mutationError,
  }] = useMutation<createPathway>(CREATE_PATHWAY_MUTATION);

  const onSubmit = (
    mutation: typeof createPathwayFunc, values: CreatePathwayForm,
  ) => {
    const selectedClinicalRequestTypes: Array<{id: string}> = [];
    values.clinicalRequestTypes.forEach((mT) => {
      selectedClinicalRequestTypes.push( { id: mT.value } );
    });

    mutation({
      variables: {
        input: {
          name: values.name,
          clinicalRequestTypes: selectedClinicalRequestTypes,
        },
      },
    });
  };

  useEffect(() => {
    if (mutationData?.createPathway?.pathway?.id !== undefined) {
      setShowModal(true);
      if (refetchPathways) {
        refetchPathways();
      }
    }
  }, [mutationData, setShowModal, refetchPathways]);

  const newPathwaySchema = yup.object({
    name: yup.string().required('Pathway name is a required field'),
  }).required();

  const [
    checkboxesOrganised,
    setCheckboxesOrganised,
  ] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    control,
  } = useForm<CreatePathwayForm>({ resolver: yupResolver(newPathwaySchema) });

  const {
    fields: clinicalRequestTypeFields,
    append: appendClinicalRequestTypeFields,
  } = useFieldArray({
    name: 'clinicalRequestTypes',
    control: control,
  });

  useEffect(() => {
    if (!checkboxesOrganised && clinicalRequestTypes) {
      const fieldProps: CreatePathwayForm['clinicalRequestTypes'] = clinicalRequestTypes
        ? clinicalRequestTypes.flatMap((mT) => (
          {
            label: `${mT.name} (${mT.refName})`,
            value: mT.id,
          }
        ))
        : [];
      appendClinicalRequestTypeFields(fieldProps);
      setCheckboxesOrganised(true);
    }
  }, [
    clinicalRequestTypes,
    appendClinicalRequestTypeFields,
    checkboxesOrganised,
    setCheckboxesOrganised,
  ]);

  return (
    <>
      { mutationError ? <ErrorMessage>{mutationError.message}</ErrorMessage> : null}
      { mutationData?.createPathway?.userErrors
        ? (
          <ErrorMessage>
            An error occured:&nbsp;
            {
              mutationData?.createPathway?.userErrors?.map((userError) => (
                `${userError.message}`
              ))
            }
          </ErrorMessage>
        ) : null}
      <Form
        onSubmit={ handleSubmit( () => {
          onSubmit(createPathwayFunc, getValues());
        }) }
      >
        <Fieldset disabled={ disableForm || mutationLoading || showModal }>
          <Input role="textbox" id="name" label="Pathway name" error={ formErrors.name?.message } { ...register('name', { required: true }) } />
        </Fieldset>
        <Fieldset disabled={ disableForm || mutationLoading || showModal }>
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
                options={ clinicalRequestTypeFields?.map((mT) => (
                  { label: mT.label, value: mT.value }
                )) }
              />
            ) }
          />
        </Fieldset>
        <Fieldset disabled={ disableForm || mutationLoading || showModal }>
          <Button className="float-end">Create pathway</Button>
        </Fieldset>
      </Form>
      <Modal show={ showModal } onHide={ (() => setShowModal(false)) }>
        <Modal.Header>
          <Modal.Title>Pathway created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Pathway name</SummaryList.Key>
              <SummaryList.Value>{mutationData?.createPathway?.pathway?.name}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Clinical requests</SummaryList.Key>
              <SummaryList.Value>
                <ul>
                  {
                    mutationData?.createPathway?.pathway?.clinicalRequestTypes?.map((mT) => (
                      <li key={ `create_pathway_modal_perm_${mT.id}` }>{mT.name}</li>
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
export default CreatePathwayTab;
