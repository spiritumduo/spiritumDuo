import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { ApolloQueryResult, gql, OperationVariables, useMutation } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form } from 'nhsuk-react-components';
import { Select } from 'components/nhs-style';
import { getPathways } from 'features/PathwayManagement/__generated__/getPathways';
import { deletePathway } from 'features/PathwayManagement/tabpages/__generated__/deletePathway';

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

export type DeletePathwayReturnData = {
  id: number,
  name: string,
  permissions: string[],
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

  const [deletePathwayFunc, {
    data: mutationData, loading: mutationLoading, error: mutationError,
  }] = useMutation<deletePathway>(DELETE_PATHWAY_MUTATION);

  const deletePathwaySchema = yup.object({
    name: yup.string().required('Pathway name is a required field'),
  }).required();

  const [
    checkboxesOrganised,
    setCheckboxesOrganised,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    control,
  } = useForm<DeletePathwayForm>({ resolver: yupResolver(deletePathwaySchema) });

  const {
    fields: milestoneTypeFields,
    append: appendMilestoneTypeFields,
  } = useFieldArray({
    name: 'milestoneTypes',
    control: control,
  });

  useEffect(() => {
    if (!checkboxesOrganised && milestoneTypes) {
      const fieldProps: DeletePathwayForm['milestoneTypes'] = milestoneTypes
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
                pathway?.id
                  ? <option key={ pathway.id } value={ pathway.id }>{ pathway.name }</option>
                  : null
              ))
            }
          </Select>
        </Fieldset>
        <Fieldset
          disabled
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
