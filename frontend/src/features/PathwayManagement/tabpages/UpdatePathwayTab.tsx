import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { ApolloQueryResult, gql, OperationVariables, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form, SummaryList } from 'nhsuk-react-components';

import { Input, Select } from 'components/nhs-style';
import { updatePathway } from './__generated__/updatePathway';
import { getPathways } from '../__generated__/getPathways';

export const UPDATE_PATHWAY_MUTATION = gql`
mutation updatePathway($input: UpdatePathwayInput!){
  updatePathway(input: $input){
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

type UpdatePathwayForm = {
  pathwayIndex: string;
  name: string;
  milestoneTypes: {
    milestoneTypeId: string;
    name: string;
    refName: string;
    checked: boolean;
  }[];
};

export interface UpdatePathwayInputs {
  name: string;
  milestoneTypes: { id: string, name: string; refName: string; checked: boolean; }[];
}

export interface UpdatePathwayTabProps {
  disableForm?: boolean | undefined,
  refetchPathways?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<getPathways>>,
  milestoneTypes: {id: string, name: string, refName: string}[] | undefined,
  pathways: (
    {
      id: string;
      name: string;
      milestoneTypes: {
        id: string;
        name: string;
        refName: string;
      }[] | undefined;
    } | null
  )[] | undefined
}

const UpdatePathwayTab = (
  { disableForm, milestoneTypes, pathways, refetchPathways }: UpdatePathwayTabProps,
): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPathway, setSelectedPathway] = useState<string>('-1');

  const [updatePathwayFunc, {
    data: mutationData, loading: mutationLoading, error: mutationError,
  }] = useMutation<updatePathway>(UPDATE_PATHWAY_MUTATION);

  const onSubmit = (
    mutation: typeof updatePathwayFunc, values: UpdatePathwayForm,
  ) => {
    const selectedMilestoneTypes = values.milestoneTypes?.filter(
      (mT) => (mT.checked !== false || null),
    ).map((mT) => ({
      id: mT.milestoneTypeId as unknown as string,
    }));

    mutation({
      variables: {
        input: {
          id: selectedPathway,
          name: values.name,
          milestoneTypes: selectedMilestoneTypes,
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

  const [
    checkboxesOrganised,
    setCheckboxesOrganised,
  ] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
    control,
  } = useForm<UpdatePathwayForm>({ resolver: yupResolver(newPathwaySchema) });

  const {
    fields: milestoneTypeFields,
    append: appendMilestoneTypeFields,
  } = useFieldArray({
    name: 'milestoneTypes',
    control: control,
  });

  useEffect(() => {
    if (!checkboxesOrganised && milestoneTypes) {
      const fieldProps: UpdatePathwayForm['milestoneTypes'] = milestoneTypes
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

  useEffect(() => {
    milestoneTypeFields?.forEach((mT, index) => {
      setValue(`milestoneTypes.${index}.checked`, false);
    });

    setValue('name', '');

    if (selectedPathway !== '-1' && selectedPathway) {
      milestoneTypeFields?.forEach((mT, index) => {
        setValue(`milestoneTypes.${index}.checked`, false);
      });

      const currPathway = pathways?.filter(
        (pathway) => (pathway?.id === selectedPathway),
      )?.[0];

      if (currPathway) {
        setValue('name', currPathway.name);
        currPathway?.milestoneTypes?.forEach((milestoneType) => {
          if (milestoneType) {
            milestoneTypeFields.find((mT, index) => (
              mT.name === milestoneType.name
              && setValue(`milestoneTypes.${index}.checked`, true)
            ));
          }
        });
      }
    }
  }, [pathways, milestoneTypeFields, selectedPathway, setValue]);

  return (
    <>
      { mutationError ? <ErrorMessage>{mutationError.message}</ErrorMessage> : null}
      { mutationData?.updatePathway?.userErrors
        ? (
          <ErrorMessage>
            An error occured:&nbsp;
            {
              mutationData?.updatePathway?.userErrors?.map((userError) => (
                `${userError.message}`
              ))
            }
          </ErrorMessage>
        ) : null}
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
          <Select
            className="col-12"
            label="Select existing pathway"
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
          </Select>
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
                    mutationData?.updatePathway?.pathway?.milestoneTypes?.map((mT) => (
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
export default UpdatePathwayTab;
