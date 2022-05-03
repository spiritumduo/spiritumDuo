/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import fetchMock from 'fetch-mock';
import { cache } from 'app/cache';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';

import { CreateRoleReturnData } from '../components/CreateRoleTab';

import RoleManagementTabSet, { GET_ROLE_PERMISSIONS, GET_ROLES } from './RoleManagement';

const rolePermissions = [
  {
    name: 'TEST_PERMISSION_ONE',
  },
  {
    name: 'TEST_PERMISSION_TWO',
  },
];

const roles = [
  {
    id: '1',
    name: 'Role 1',
    permissions: [{
      name: 'TEST_PERMISSION_ONE',
    }],
  },
  {
    id: '2',
    name: 'Role 2',
    permissions: [{
      name: 'TEST_PERMISSION_TWO',
    }],
  },
];

const successfulRoleCreationMock: CreateRoleReturnData = {
  id: 1,
  name: 'test permission',
  permissions: [],
};

const successfulRoleUpdateMock: CreateRoleReturnData = {
  id: 1,
  name: 'name returned from server',
  permissions: ['permission 1 from server', 'permission 2 from server'],
};

const successfulRoleDeleteMock = {
  success: true,
};

export default {
  title: 'Tab Pages/Role Management',
  component: RoleManagementTabSet,
  decorators: [
    (RoleManagementTabSetStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <MockPathwayProvider>
              <RoleManagementTabSetStory />
            </MockPathwayProvider>
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof RoleManagementTabSet>;

export const Default: ComponentStory<typeof RoleManagementTabSet> = () => {
  fetchMock.restore().mock('end:/rest/createrole/', successfulRoleCreationMock);
  fetchMock.mock('end:/rest/updaterole/', successfulRoleUpdateMock);
  fetchMock.mock('end:/rest/deleterole/', successfulRoleDeleteMock);
  return (
    <NewMockSdApolloProvider
      mocks={
        [
          {
            query: GET_ROLES,
            mockFn: () => Promise.resolve({
              data: {
                getRoles: roles,
              },
            }),
          },
          {
            query: GET_ROLE_PERMISSIONS,
            mockFn: () => Promise.resolve({
              data: {
                getRolePermissions: rolePermissions,
              },
            }),
          },
        ]
      }
    >
      <RoleManagementTabSet />
    </NewMockSdApolloProvider>
  );
};
