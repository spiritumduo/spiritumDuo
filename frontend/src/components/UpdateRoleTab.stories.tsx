/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider } from 'test/mocks/mockContext';
import fetchMock from 'fetch-mock';
import { Standard } from 'components/Notification.stories';
import { cache } from 'app/cache';
import UpdateRoleTab, { GET_ROLES, GET_ROLE_PERMISSIONS, UpdateRoleReturnData } from './UpdateRoleTab';

const roles = [
  {
    id: '1',
    name: 'Role 1',
    permissions: [{
      name: 'TEST_PERMISSION_ONE',
    }],
  },
];

const rolePermissions = [
  {
    name: 'TEST_PERMISSION_ONE',
  },
  {
    name: 'TEST_PERMISSION_TWO',
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
  {
    request: {
      query: GET_ROLES,
    },
    result: {
      data: {
        getRoles: roles,
      },
    },
  },
];

export default {
  title: 'Components/Update Role Tab',
  component: UpdateRoleTab,
  decorators: [
    (UpdateRoleTabStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <UpdateRoleTabStory />
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof UpdateRoleTab>;

const successfulRoleUpdateMock: UpdateRoleReturnData = {
  id: 1,
  name: 'name returned from server',
  permissions: ['permission 1 from server', 'permission 2 from server'],
};

export const Default: ComponentStory<typeof UpdateRoleTab> = () => {
  fetchMock.restore().mock('end:/rest/updaterole/', successfulRoleUpdateMock);
  return <UpdateRoleTab />;
};

Default.parameters = {
  apolloClient: {
    mocks: [
      ...apolloMocks,
      Standard.parameters?.apolloClient.mocks[0], // notification mock
    ],
  },
};
