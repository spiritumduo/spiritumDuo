import React from 'react';
import { gql, useQuery } from '@apollo/client';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { ErrorMessage } from 'nhsuk-react-components';

import { getRoles } from './__generated__/getRoles';
import { getRolePermissions } from './__generated__/getRolePermissions';

import CreateRoleTab from './tabpages/CreateRoleTab';
import UpdateRoleTab from './tabpages/UpdateRoleTab';
import DeleteRoleTab from './tabpages/DeleteRoleTab';

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
  query getRolePermissions{
    getRolePermissions{
      name
    }
  }
`;

const RoleManagementTabSet = (): JSX.Element => {
  const { loading: loadingRoles,
    data: dataRoles,
    error: errorRoles,
    refetch: refetchRoles } = useQuery<getRoles>(GET_ROLES);

  const { loading: loadingRolePermissions,
    data: dataRolePermissions,
    error: errorRolePermissions } = useQuery<getRolePermissions>(GET_ROLE_PERMISSIONS);

  return (
    <Tabs>
      <TabList>
        <Tab>Create role</Tab>
        <Tab>Update role</Tab>
        <Tab>Delete role</Tab>
      </TabList>
      {
        errorRoles
          ? <ErrorMessage>An error has occured: { errorRoles.message } </ErrorMessage>
          : null
      }
      {
        errorRolePermissions
          ? <ErrorMessage>An error has occured: { errorRolePermissions.message } </ErrorMessage>
          : null
      }
      <TabPanel>
        <CreateRoleTab
          disableForm={ loadingRoles || loadingRolePermissions }
          refetchRoles={ refetchRoles }
          rolePermissions={
            dataRolePermissions?.getRolePermissions?.map((rp) => (
              {
                name: rp.name,
              }
            ))
          }
        />
      </TabPanel>
      <TabPanel>
        <UpdateRoleTab
          disableForm={ loadingRoles || loadingRolePermissions }
          refetchRoles={ refetchRoles }
          roles={
            dataRoles?.getRoles?.map((role) => (
              {
                id: role.id,
                name: role.name,
                permissions: role.permissions.map((rP) => (
                  {
                    name: rP?.name,
                  }
                )),
              }
            ))
          }
          rolePermissions={
            dataRolePermissions?.getRolePermissions?.map((rp) => (
              {
                name: rp.name,
              }
            ))
          }
        />
      </TabPanel>
      <TabPanel>
        <DeleteRoleTab
          disableForm={ loadingRoles || loadingRolePermissions }
          refetchRoles={ refetchRoles }
          roles={
            dataRoles?.getRoles?.map((role) => (
              {
                id: role.id,
                name: role.name,
                permissions: role.permissions.map((rP) => (
                  {
                    name: rP?.name,
                  }
                )),
              }
            ))
          }
          rolePermissions={
            dataRolePermissions?.getRolePermissions?.map((rp) => (
              {
                name: rp.name,
              }
            ))
          }
        />
      </TabPanel>
    </Tabs>
  );
};

export default RoleManagementTabSet;
