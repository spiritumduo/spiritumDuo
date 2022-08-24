/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import { ApolloQueryResult, OperationVariables } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form } from 'nhsuk-react-components';
import { Select as NHSSelect } from 'components/nhs-style';
import ReactSelectWrapper from 'components/ReactSelectWrapper/ReactSelectWrapper';

import { getRoles } from 'features/RoleManagement/__generated__/getRoles';

type DeleteRoleForm = {
  name: string;
  roleIndex: string;
  permissions: {
    label: string;
    value: string;
  }[];
};

export interface DeleteRoleInputs {
  name: string;
  roleIndex: string;
  permissions: {
    label: string;
    value: string;
  }[];
}

export type DeleteRoleReturnData = {
  id: number,
  name: string,
  permissions: string[],
};

type DeleteRoleSubmitHook = [
  boolean,
  any,
  DeleteRoleReturnData | undefined,
  (variables: DeleteRoleInputs) => void
];

export function useDeleteRoleSubmit(
  setShowModal: (arg0: boolean) => void,
  refetchRoles?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<getRoles>>,
): DeleteRoleSubmitHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [data, setData] = useState<DeleteRoleReturnData | undefined>(undefined);

  async function deleteRole(variables: DeleteRoleInputs) {
    setLoading(true);
    setData(undefined);
    setError(undefined);

    try {
      const { location } = window;
      const uriPrefix = `${location.protocol}//${location.host}`;

      const deleteResponse = await window.fetch(`${uriPrefix}/api/rest/deleterole/`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
          id: variables.roleIndex,
        }),
      });
      if (!deleteResponse.ok) {
        const decoded = await deleteResponse.json();
        if (decoded) {
          setError(`Error: ${decoded.error} (HTTP${deleteResponse.status} ${deleteResponse.statusText})`);
          throw new Error(`Error: ${decoded.error} (HTTP${deleteResponse.status} ${deleteResponse.statusText})`);
        }
        setError(`Error: Response ${deleteResponse.status} ${deleteResponse.statusText}`);
        throw new Error(`Error: Response ${deleteResponse.status} ${deleteResponse.statusText}}`);
      }
      const decodedResponse: DeleteRoleReturnData = await deleteResponse.json();
      setData(decodedResponse);
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
  return [loading, error, data, deleteRole];
}

export interface DeleteRoleFormProps {
  disableForm?: boolean | undefined,
  refetchRoles?: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<ApolloQueryResult<getRoles>>,
  roles?: {
    id: string;
    name: string;
    permissions: { name: string | undefined; }[];
  }[] | undefined
  rolePermissions?: {name: string}[],
}

const DeleteRoleForm = (
  { disableForm, refetchRoles, roles, rolePermissions }: DeleteRoleFormProps,
): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [permissionFields, setPermissionFields] = useState<{label: string, value: string}[]>();
  const [selectedRole, setSelectedRole] = useState<string>('-1');

  const [
    loading,
    error,
    data,
    deleteRole,
  ] = useDeleteRoleSubmit(setShowModal, refetchRoles);

  const newRoleSchema = yup.object({
    name: yup.string().required('Role name is a required field'),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors: formErrors },
    getValues,
    setValue,
    control,
  } = useForm<DeleteRoleForm>({ resolver: yupResolver(newRoleSchema) });

  useEffect(() => {
    setPermissionFields(rolePermissions
      ? rolePermissions.flatMap((rolePermission) => (
        {
          label: rolePermission.name,
          value: rolePermission.name,
        }
      ))
      : []);
  }, [rolePermissions, setPermissionFields]);

  useEffect(() => {
    setValue('name', '');
    setValue('permissions', []);

    if (selectedRole !== '-1' && selectedRole) {
      const permissionSet = roles?.filter(
        (role) => (role.id === selectedRole),
      )?.[0];

      const listOfPermissions: Array<{label: string, value: string}> = [];

      if (permissionSet) {
        setValue('name', permissionSet.name);
        permissionSet.permissions.forEach((rolePermission) => {
          if (rolePermission) {
            permissionFields?.find((permission) => (
              permission.label === rolePermission.name
              && listOfPermissions.push({ label: permission.label, value: permission.label })
            ));
          }
        });
      }
      setValue('permissions', listOfPermissions);
    }
  }, [permissionFields, roles, selectedRole, setValue]);

  return (
    <>
      { error ? <ErrorMessage>{error.message}</ErrorMessage> : null}
      <Form
        onSubmit={ handleSubmit( () => {
          deleteRole(getValues());
        }) }
      >
        <Fieldset
          disabled={
            disableForm || loading
          }
        >
          <NHSSelect
            className="col-12"
            label="Select existing role"
            { ...register('roleIndex') }
            onChange={ (
              (e: { currentTarget: { value: React.SetStateAction<string> } }) => {
                setSelectedRole(e.currentTarget.value);
              }) }
          >
            <option value="-1">Select a role</option>
            {
              roles?.map((role) => (
                <option key={ role.id } value={ role.id }>{ role.name }</option>
              ))
            }
          </NHSSelect>
        </Fieldset>
        <Fieldset
          disabled
        >
          <Fieldset.Legend>Role permissions</Fieldset.Legend>
          <Controller
            name="permissions"
            control={ control }
            render={ ({ field }) => (
              <ReactSelectWrapper
                className="mb-4"
                isMulti
                onBlur={ field.onBlur }
                onChange={ field.onChange }
                forwardRef={ field.ref }
                value={ field.value }
                options={ permissionFields?.map((permission) => (
                  { label: permission.label, value: permission.label }
                )) }
              />
            ) }
          />
        </Fieldset>
        <Fieldset
          disabled={
            disableForm || loading
            || selectedRole === '-1'
          }
        >
          <Button
            type="submit"
            name="submitBtn"
            className="float-end"
          >
            Delete role
          </Button>
        </Fieldset>
      </Form>
      <Modal show={ showModal } onHide={ (() => setShowModal(false)) }>
        <Modal.Header>
          <Modal.Title>Role deleted</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button onClick={ (() => setShowModal(false)) }>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default DeleteRoleForm;
