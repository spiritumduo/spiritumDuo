import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider } from 'test/mocks/mockContext';
import fetchMock from 'fetch-mock';
import { Standard } from 'components/Notification.stories';
import { cache } from 'app/cache';
import DeleteRoleTab, { GET_ROLES, GET_ROLE_PERMISSIONS } from './DeleteRoleTab';

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
  title: 'Components/Delete Role Tab',
  component: DeleteRoleTab,
  decorators: [
    (DeleteRoleTabStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <DeleteRoleTabStory />
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof DeleteRoleTab>;

const successfulRoleDeleteMock = {
  success: true,
};

export const Default: ComponentStory<typeof DeleteRoleTab> = () => {
  fetchMock.restore().mock('end:/rest/deleterole/', successfulRoleDeleteMock);
  return <DeleteRoleTab />;
};

Default.parameters = {
  apolloClient: {
    mocks: [
      ...apolloMocks,
      Standard.parameters?.apolloClient.mocks[0], // notification mock
    ],
  },
};

const conflictingRoleDeleteMock = {
  error: 'error message from server',
};

export const Error: ComponentStory<typeof DeleteRoleTab> = () => {
  fetchMock.restore().mock('end:/rest/deleterole/', { body: conflictingRoleDeleteMock, status: 409});
  return <DeleteRoleTab />;
};

Error.parameters = {
  apolloClient: {
    mocks: [
      ...apolloMocks,
      Standard.parameters?.apolloClient.mocks[0], // notification mock
    ],
  },
};
