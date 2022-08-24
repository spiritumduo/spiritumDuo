/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import fetchMock from 'fetch-mock';
import { cache } from 'app/cache';
import CreateRoleForm, { CreateRoleReturnData } from './CreateRoleForm';

const rolePermissions = [
  {
    name: 'Test permission 1',
  },
  {
    name: 'Test permission 2',
  },
  {
    name: 'Test permission 3',
  },
  {
    name: 'Test permission 4',
  },
];

export default {
  title: 'Tab Pages/Role Management/Create Role Tab',
  component: CreateRoleForm,
  decorators: [
    (CreateRoleFormStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <MockPathwayProvider>
              <CreateRoleFormStory />
            </MockPathwayProvider>
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof CreateRoleForm>;

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

export const Default: ComponentStory<typeof CreateRoleForm> = () => {
  fetchMock.restore().mock('end:/rest/createrole/', successfulRoleCreationMock, { delay: 1 });
  fetchMock.mock('end:/rest/updaterole/', successfulRoleUpdateMock);
  return <CreateRoleForm rolePermissions={ rolePermissions } />;
};

Default.parameters = {
  rolePermissions: rolePermissions,
  successfulRoleCreationMock: successfulRoleCreationMock,
};

export const RoleExistsError: ComponentStory<typeof CreateRoleForm> = () => {
  fetchMock.restore().mock('end:/rest/createrole/', { status: 409 });
  return <CreateRoleForm rolePermissions={ rolePermissions } />;
};
