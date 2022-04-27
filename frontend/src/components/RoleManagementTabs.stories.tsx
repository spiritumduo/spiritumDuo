/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import fetchMock from 'fetch-mock';
import { Standard } from 'components/Notification.stories';
import { cache } from 'app/cache';
import RoleManagementTabs, { GET_ROLE_PERMISSIONS, CreateRoleReturnData } from './RoleManagementTabs';

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

const apolloMocks = [
  {
    request: {
      query: GET_ROLE_PERMISSIONS,
    },
    result: {
      data: {
        getRolePermissions: rolePermissions,
      },
    },
  },
];

export default {
  title: 'Components/Role Management Tabs',
  component: RoleManagementTabs,
  decorators: [
    (RoleManagementTabsStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <MockPathwayProvider>
              <RoleManagementTabsStory />
            </MockPathwayProvider>
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof RoleManagementTabs>;

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

export const Default: ComponentStory<typeof RoleManagementTabs> = () => {
  fetchMock.restore().mock('end:/rest/createrole/', successfulRoleCreationMock);
  fetchMock.mock('end:/rest/updaterole/', successfulRoleUpdateMock);
  return <RoleManagementTabs />;
};

Default.parameters = {
  apolloClient: {
    mocks: [
      ...apolloMocks,
      Standard.parameters?.apolloClient.mocks[0], // notification mock
    ],
  },
};

export const RoleExistsError: ComponentStory<typeof RoleManagementTabs> = () => {
  fetchMock.restore().mock('end:/rest/createrole/', { status: 409 });
  return <RoleManagementTabs />;
};

RoleExistsError.parameters = {
  apolloClient: {
    mocks: [
      ...apolloMocks,
      Standard.parameters?.apolloClient.mocks[0], // notification mock
    ],
  },
};
