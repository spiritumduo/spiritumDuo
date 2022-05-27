import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { ApolloQueryResult, gql, OperationVariables, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form } from 'nhsuk-react-components';
import { Select as NHSSelect } from 'components/nhs-style';
import { getPathways } from 'features/PathwayManagement/__generated__/getPathways';
import { deletePathway } from 'features/PathwayManagement/tabpages/__generated__/deletePathway';

import Select from 'react-select';

export const DELETE_PATHWAY_MUTATION = gql`
mutation deletePathway($pathwayId: ID!){
  deletePathway(id: $pathwayId){
    success
    userErrors{
      field
      message
    }
  }
}
`;

type DeletePathwayForm = {
  name: string
  pathwayIndex: string;
  milestoneTypes: {
    label: string;
    value: string;
  }[];
};

export interface UpdatePathwayInputs {
  name: string;
  milestoneTypes: {
    label: string;
    value: string;
  }[];
}

export type DeletePathwayReturnData = {
  id: number,
  name: string,
  milestoneTypes: string[],
};

export interface DeletePathwayTabProps {
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

const DeletePathwayTab = ({
  disableForm, milestoneTypes, pathways, refetchPathways,
}: DeletePathwayTabProps): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPathway, setSelectedPathway] = useState<string>('-1');
  const [milestoneTypeFields, setMilestoneTypeFields] = useState<
  {label: string, value: string}[]
>();

  const [deletePathwayFunc, {
    data: mutationData, loading: mutationLoading, error: mutationError,
  }] = useMutation<deletePathway>(DELETE_PATHWAY_MUTATION);

  const deletePathwaySchema = yup.object({
    name: yup.string().required('Pathway name is a required field'),
  }).required();

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
  } = useForm<DeletePathwayForm>({ resolver: yupResolver(deletePathwaySchema) });

  useEffect(() => {
    setMilestoneTypeFields(milestoneTypes
      ? milestoneTypes.flatMap((mT) => (
        {
          label: mT.name,
          value: mT.id,
        }
      ))
      : []);
  }, [milestoneTypes, setMilestoneTypeFields]);

  useEffect(() => {
    setValue('name', '');
    setValue('milestoneTypes', []);

    if (selectedPathway !== '-1' && selectedPathway) {
      const milestoneTypeSet = pathways?.filter(
        (pW) => (pW?.id === selectedPathway),
      )?.[0];

      const listOfPermissions: Array<{label: string, value: string}> = [];

      if (milestoneTypeSet) {
        setValue('name', milestoneTypeSet.name);
        milestoneTypeSet?.milestoneTypes?.forEach((milestoneType) => {
          if (milestoneType) {
            milestoneTypeFields?.find((mT) => (
              mT.value === milestoneType.id
              && listOfPermissions.push({ label: milestoneType.name, value: milestoneType.id })
            ));
          }
        });
      }
      setValue('milestoneTypes', listOfPermissions);
    }
  }, [milestoneTypeFields, pathways, selectedPathway, setValue]);

  const onSubmit = (
    mutation: typeof deletePathwayFunc, values: DeletePathwayForm,
  ) => {
    mutation({
      variables: {
        pathwayId: values.pathwayIndex,
      },
    });
  };

  useEffect(() => {
    if (mutationData?.deletePathway?.success === true) {
      setShowModal(true);
      if (refetchPathways) {
        refetchPathways();
      }
    }
  }, [mutationData, refetchPathways, setShowModal]);

  return (
    <>
      { mutationError ? <ErrorMessage>{mutationError.message}</ErrorMessage> : null}
      { mutationData?.deletePathway?.userErrors
        ? (
          <ErrorMessage>
            An error occured:&nbsp;
            {
              mutationData?.deletePathway?.userErrors?.map((userError) => (
                `${userError.message}`
              ))
            }
          </ErrorMessage>
        ) : null}
      <Form
        onSubmit={ handleSubmit( () => {
          onSubmit(deletePathwayFunc, getValues());
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
                pathway?.id
                  ? <option key={ pathway.id } value={ pathway.id }>{ pathway.name }</option>
                  : null
              ))
            }
          </NHSSelect>
        </Fieldset>
        <Fieldset
          disabled
        >
          <Fieldset.Legend>Milestone types</Fieldset.Legend>
          <Controller
            name="milestoneTypes"
            control={ control }
            render={ ({ field }) => (
              <Select
                className="mb-4"
                isMulti
                onBlur={ field.onBlur }
                onChange={ field.onChange }
                ref={ field.ref }
                value={ field.value }
                options={ milestoneTypeFields?.map((mT) => (
                  { label: mT.label, value: mT.value }
                )) }
              />
            ) }
          />
        </Fieldset>
        <Fieldset
          disabled={
            mutationLoading || showModal || disableForm
          }
        >
          <Button
            type="submit"
            name="submitBtn"
            className="float-end"
          >
            Delete pathway
          </Button>
        </Fieldset>
      </Form>
      <Modal show={ showModal } onHide={ (() => setShowModal(false)) }>
        <Modal.Header>
          <Modal.Title>Pathway deleted</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={ (() => setShowModal(false)) }>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeletePathwayTab;
