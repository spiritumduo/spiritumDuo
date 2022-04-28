import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { useFieldArray, useForm } from 'react-hook-form';
import { gql, useQuery } from '@apollo/client';
import { yupResolver } from '@hookform/resolvers/yup';
import { Modal } from 'react-bootstrap';
import { Button, ErrorMessage, Fieldset, Form, SummaryList } from 'nhsuk-react-components';
import { getRolePermissions } from './__generated__/getRolePermissions';
import { Select } from './nhs-style';
import { getRoles } from './__generated__/getRoles';

export const GET_ROLES = gql`
  query getRoles{
    getRoles{
      id
      name
      permissions{
        name
      }
    }
  }
`;

export const GET_ROLE_PERMISSIONS = gql`
  query getRolePerms{
    getRolePermissions{
      name
    }
  }
`;

type DeleteRoleForm = {
  name: string;
  roleIndex: string;
  permissions: {
    name: string;
    checked: boolean;
  }[];
};

export interface DeleteRoleInputs {
  name: string;
  roleIndex: string;
  permissions: { name: string; checked: boolean; }[];
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
  refetchRoles: () => void,
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
      refetchRoles();
    } catch (err) {
      setError(err);
      setData(undefined);
    }
    setLoading(false);
  }
  return [loading, error, data, deleteRole];
}

const DeleteRoleTab = (): JSX.Element => {
  const [showModal, setShowModal] = useState<boolean>(false);

  const { loading: getRolesLoading,
    data: getRolesData,
    error: getRolesError,
    refetch: refetchRoles } = useQuery<getRoles>(GET_ROLES);

  const { loading: getRolePermissionsLoading,
    data: getRolePermissionsData,
    error: getRolePermissionsError } = useQuery<getRolePermissions>(GET_ROLE_PERMISSIONS);

  const [
    loading,
    error,
    data,
    deleteRole,
  ] = useDeleteRoleSubmit(setShowModal, refetchRoles);

  const [selectedRole, setSelectedRole] = useState<string>('-1');

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
    setValue,
    control,
  } = useForm<DeleteRoleForm>({ resolver: yupResolver(newRoleSchema) });

  const {
    fields: permissionFields,
    append: appendPermissionFields,
  } = useFieldArray({
    name: 'permissions',
    control: control,
  });

  useEffect(() => {
    if (!permissionCheckboxesOrganised && getRolePermissionsData) {
      const fieldProps: DeleteRoleForm['permissions'] = getRolePermissionsData?.getRolePermissions
        ? getRolePermissionsData.getRolePermissions.flatMap((rolePermission) => (
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
    getRolePermissionsData,
    appendPermissionFields,
    permissionCheckboxesOrganised,
    setPermissionCheckboxesOrganised,
  ]);

  useEffect(() => {
    permissionFields?.forEach((permission, index) => {
      setValue(`permissions.${index}.checked`, false);
    });

    if (selectedRole !== '-1' && selectedRole) {
      permissionFields?.forEach((permission, index) => {
        setValue(`permissions.${index}.checked`, false);
      });

      const permissionSet = getRolesData?.getRoles?.filter(
        (role) => (role.id === selectedRole),
      )?.[0];

      if (permissionSet) {
        setValue('name', permissionSet.name);
        permissionSet.permissions.forEach((rolePermission) => {
          if (rolePermission) {
            permissionFields.find((permission, index) => (
              permission.name === rolePermission.name
              && setValue(`permissions.${index}.checked`, true)
            ));
          }
        });
      }
    }
  }, [getRolePermissionsData, getRolesData, permissionFields, selectedRole, setValue]);

  return (
    <>
      { error ? <ErrorMessage>{error.message}</ErrorMessage> : null}
      <Form
        onSubmit={ handleSubmit( () => {
          deleteRole(getValues());
        }) }
      >
        { getRolePermissionsError?.message ? <ErrorMessage>{getRolePermissionsError?.message}</ErrorMessage> : '' }
        <Fieldset
          disabled={
            getRolePermissionsLoading || getRolesLoading
            || !!getRolePermissionsError || !!getRolesError
          }
        >
          <Select
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
              getRolesData?.getRoles?.map((role, index) => (
                <option key={ role.id } value={ role.id }>{ role.name }</option>
              ))
            }
          </Select>
        </Fieldset>
        <Fieldset
          disabled
        >
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
        <Fieldset
          disabled={
            getRolePermissionsLoading || getRolesLoading
            || !!getRolePermissionsError || !!getRolesError
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
export default DeleteRoleTab;
