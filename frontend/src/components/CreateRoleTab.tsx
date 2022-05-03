import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form, SummaryList } from 'nhsuk-react-components';

import { Input } from './nhs-style';
import { getRoles } from './__generated__/getRoles';

type CreateRoleForm = {
  name: string;
  permissions: {
    name: string;
    checked: boolean;
  }[];
};

export interface CreateRoleInputs {
  name: string;
  permissions: { name: string; checked: boolean; }[];
}

export type CreateRoleReturnData = {
  id: number,
  name: string,
  permissions: string[],
};

type CreateRoleSubmitHook = [
  boolean,
  any,
  CreateRoleReturnData | undefined,
  (variables: CreateRoleInputs) => void
];

export function useCreateRoleSubmit(
  setShowModal: (arg0: boolean) => void,
  refetchRoles?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<getRoles>>,
): CreateRoleSubmitHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [data, setData] = useState<CreateRoleReturnData | undefined>(undefined);

  async function createRole(variables: CreateRoleInputs) {
    setLoading(true);
    setData(undefined);
    setError(undefined);

    try {
      const { location } = window;
      const uriPrefix = `${location.protocol}//${location.host}`;
      const createResponse = await window.fetch(`${uriPrefix}/api/rest/createrole/`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(variables),
      });
      if (!createResponse.ok) {
        if (createResponse.status === 409) {
          setError('Error: a role with this name already exists');
          throw new Error('Error: a role with this name already exists');
        } else {
          setError(`Error: Response ${createResponse.status} ${createResponse.statusText}`);
          throw new Error(`Error: Response ${createResponse.status} ${createResponse.statusText}`);
        }
      }
      const decodedCreateResponse: CreateRoleReturnData = await createResponse.json();

      const listOfPermissions = variables.permissions.filter(
        (perm) => (perm.checked !== false || null),
      ).map((value) => (value.checked as unknown as string));

      const updateBody = JSON.stringify({
        id: decodedCreateResponse.id,
        name: variables.name,
        permissions: listOfPermissions,
      });

      const updateResponse = await window.fetch(`${uriPrefix}/api/rest/updaterole/`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: updateBody,
      });

      const decodedUpdateResponse: CreateRoleReturnData = await updateResponse.json();

      setData(decodedUpdateResponse);
      setShowModal(true);

      if (refetchRoles) {
        refetchRoles();
      }
    } catch (err) {
      setError(err);
      setData(undefined);
    }
    setLoading(false);
  }
  return [loading, error, data, createRole];
}

export interface CreateRoleTabProps {
  disableForm?: boolean | undefined,
  refetchRoles?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<getRoles>>,
  rolePermissions: {name: string}[] | undefined,
}

const CreateRoleTab = (
  { disableForm, refetchRoles, rolePermissions }: CreateRoleTabProps,
): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [
    loading,
    error,
    data,
    createRole,
  ] = useCreateRoleSubmit(setShowModal, refetchRoles);

  const newRoleSchema = yup.object({
    name: yup.string().required('Role name is a required field'),
  }).required();

  const [
    permissionCheckboxesOrganised,
    setPermissionCheckboxesOrganised,
  ] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    control,
  } = useForm<CreateRoleForm>({ resolver: yupResolver(newRoleSchema) });

  const {
    fields: permissionFields,
    append: appendPermissionFields,
  } = useFieldArray({
    name: 'permissions',
    control: control,
  });

  useEffect(() => {
    if (!permissionCheckboxesOrganised && rolePermissions) {
      const fieldProps: CreateRoleForm['permissions'] = rolePermissions
        ? rolePermissions.flatMap((rolePermission) => (
          {
            name: rolePermission.name,
            checked: false,
          }
        ))
        : [];
      appendPermissionFields(fieldProps);
      setPermissionCheckboxesOrganised(true);
    }
  }, [
    rolePermissions,
    appendPermissionFields,
    permissionCheckboxesOrganised,
    setPermissionCheckboxesOrganised,
  ]);

  return (
    <>
      { error ? <ErrorMessage>{error.message}</ErrorMessage> : null}
      <Form
        onSubmit={ handleSubmit( () => {
          createRole(getValues());
        }) }
      >
        <Fieldset disabled={ disableForm || loading }>
          <Input role="textbox" id="name" label="Role name" error={ formErrors.name?.message } { ...register('name', { required: true }) } />
        </Fieldset>
        <Fieldset disabled={ disableForm }>
          <Fieldset.Legend>Role permissions</Fieldset.Legend>
          {
            permissionFields?.map((permission, index) => (
              <div className="form-check" key={ `permissions.${permission.name}.checked` }>
                <label className="form-check-label pull-right" htmlFor={ `permissions.${index}.checked` }>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={ permission.name }
                    id={ `permissions.${index}.checked` }
                    { ...register(`permissions.${index}.checked` as const) }
                    defaultChecked={ false }
                  />
                  { permission.name }
                </label>
              </div>
            ))
          }
        </Fieldset>
        <Fieldset disabled={ disableForm || loading }>
          <Button className="float-end">Create role</Button>
        </Fieldset>
      </Form>
      <Modal show={ showModal } onHide={ (() => setShowModal(false)) }>
        <Modal.Header>
          <Modal.Title>Role created</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <SummaryList>
            <SummaryList.Row>
              <SummaryList.Key>Role name</SummaryList.Key>
              <SummaryList.Value>{data?.name}</SummaryList.Value>
            </SummaryList.Row>
            <SummaryList.Row>
              <SummaryList.Key>Permissions</SummaryList.Key>
              <SummaryList.Value>
                <ul>
                  {
                    data?.permissions.map((name) => (
                      <li key={ `create_role_modal_perm_${name}` }>{name}</li>
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
export default CreateRoleTab;
