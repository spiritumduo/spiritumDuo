import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider } from 'test/mocks/mockContext';
import fetchMock from 'fetch-mock';
import { cache } from 'app/cache';
import DeleteRoleForm from './DeleteRoleForm';

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

export default {
  title: 'Tab Pages/Role Management/Delete Role Tab',
  component: DeleteRoleForm,
  decorators: [
    (DeleteRoleFormStory) => {
      cache.reset();
      return (
        <MemoryRouter>
          <MockAuthProvider>
            <DeleteRoleFormStory />
          </MockAuthProvider>
        </MemoryRouter>
      );
    },
  ],
} as ComponentMeta<typeof DeleteRoleForm>;

const successfulRoleDeleteMock = {
  success: true,
};

export const Default: ComponentStory<typeof DeleteRoleForm> = () => {
  fetchMock.restore().mock('end:/rest/deleterole/', successfulRoleDeleteMock);
  return (
    <DeleteRoleForm
      roles={ roles }
      rolePermissions={ rolePermissions }
    />
  );
};

Default.parameters = {
  roles: roles,
  rolePermissions: rolePermissions,
  successfulRoleDeleteMock: successfulRoleDeleteMock,
};

const conflictingRoleDeleteMock = {
  error: 'error message from server',
};

export const Error: ComponentStory<typeof DeleteRoleForm> = () => {
  fetchMock.restore().mock('end:/rest/deleterole/', { body: conflictingRoleDeleteMock, status: 409});
  return (
    <DeleteRoleForm
      roles={ roles }
      rolePermissions={ rolePermissions }
    />
  );
};
