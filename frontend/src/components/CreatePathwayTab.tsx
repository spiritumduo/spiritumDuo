import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { ApolloQueryResult, gql, OperationVariables, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form, SummaryList } from 'nhsuk-react-components';

import { Input } from './nhs-style';
import { createPathway } from './__generated__/createPathway';
import { getPathways } from './__generated__/getPathways';

export const CREATE_PATHWAY_MUTATION = gql`
mutation createPathway($input: PathwayInput!){
  createPathway(input: $input){
    pathway{
      id
      name
      milestoneTypes{
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
  milestoneTypes: {
    milestoneTypeId: string;
    name: string;
    refName: string;
    checked: boolean;
  }[];
};

export interface CreatePathwayInputs {
  name: string;
  milestoneTypes: { id: string, name: string; refName: string; checked: boolean; }[];
}

export interface CreatePathwayTabProps {
  disableForm?: boolean | undefined,
  refetchPathways?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<getPathways>>,
  milestoneTypes: {id: string, name: string, refName: string}[] | undefined,
}

const CreatePathwayTab = (
  {
    disableForm,
    milestoneTypes,
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
    const selectedMilestoneTypes = values.milestoneTypes?.filter(
      (mT) => (mT.checked !== false || null),
    ).map((mT) => ({
      id: mT.checked as unknown as string,
    }));
    mutation({
      variables: {
        input: {
          name: values.name,
          milestoneTypes: selectedMilestoneTypes,
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
    fields: milestoneTypeFields,
    append: appendMilestoneTypeFields,
  } = useFieldArray({
    name: 'milestoneTypes',
    control: control,
  });

  useEffect(() => {
    if (!checkboxesOrganised && milestoneTypes) {
      const fieldProps: CreatePathwayForm['milestoneTypes'] = milestoneTypes
        ? milestoneTypes.flatMap((mT) => (
          {
            milestoneTypeId: mT.id,
            name: mT.name,
            refName: mT.refName,
            checked: false,
          }
        ))
        : [];
      appendMilestoneTypeFields(fieldProps);
      setCheckboxesOrganised(true);
    }
  }, [
    milestoneTypes,
    appendMilestoneTypeFields,
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
          <Input Pathway="textbox" id="name" label="Pathway name" error={ formErrors.name?.message } { ...register('name', { required: true }) } />
        </Fieldset>
        <Fieldset disabled={ disableForm || mutationLoading || showModal }>
          <Fieldset.Legend>Milestone types</Fieldset.Legend>
          {
            milestoneTypeFields.map((mT, index) => (
              <div className="form-check" key={ `milestoneTypes.${mT.name}.checked` }>
                <label className="form-check-label pull-right" htmlFor={ `milestoneTypes.${index}.checked` }>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={ mT.milestoneTypeId }
                    id={ `milestoneTypes.${index}.checked` }
                    { ...register(`milestoneTypes.${index}.checked` as const) }
                    defaultChecked={ false }
                  />
                  { mT.name } ({ mT.refName })
                </label>
              </div>
            ))
          }
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
              <SummaryList.Key>Permissions</SummaryList.Key>
              <SummaryList.Value>
                <ul>
                  {
                    mutationData?.createPathway?.pathway?.milestoneTypes?.map((mT) => (
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