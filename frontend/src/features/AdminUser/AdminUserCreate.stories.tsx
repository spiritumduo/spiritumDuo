/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import User from 'types/Users';
import { MemoryRouter } from 'react-router';
import { MockPathwayProvider } from 'test/mocks/mockContext';
import { DocumentNode } from '@apollo/client';
import { RequestHandler } from 'mock-apollo-client';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';

import { AdminUserCreate, USER_ADMIN_GET_ROLES_WITH_PATHWAYS_QUERY } from './AdminUserCreate';
import { userAdminGetRolesWithPathways } from './__generated__/userAdminGetRolesWithPathways';

// MOCKS

export type CreateUserReturnData = {
  user?: User;
  error?: string;
  detail?: string;
};

const mockPathways: userAdminGetRolesWithPathways['getPathways'] = [
  {
    __typename: 'Pathway',
    id: '1',
    name: 'test',
  },
];

const mockUser: User = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@test.com',
  username: 'jdoe',
  department: 'Respiratory',
  defaultPathway: mockPathways[0],
  isActive: true,
  roles: [
    {
      id: '1',
      name: 'first role',
    },
    {
      id: '2',
      name: 'second role',
    },
  ],
  pathways: mockPathways,
};

const mockRoles: userAdminGetRolesWithPathways['getRoles'] = [
  {
    __typename: 'Role',
    id: '1',
    name: 'first role',
  },
  {
    __typename: 'Role',
    id: '2',
    name: 'second role',
  },
  {
    __typename: 'Role',
    id: '3',
    name: 'third role',
  },
  {
    __typename: 'Role',
    id: '4',
    name: 'fourth role',
  },
];

const apolloMocks: {
  query: DocumentNode;
  mockFn: RequestHandler<userAdminGetRolesWithPathways, undefined>;
}[] = [
  {
    query: USER_ADMIN_GET_ROLES_WITH_PATHWAYS_QUERY,
    mockFn: () => Promise.resolve({
      data: {
        getRoles: mockRoles,
        getPathways: mockPathways,
      },
    }),
  },
];

/**
 * Successful creation
 */
const successfulCreateAccountMock: CreateUserReturnData = {
  user: mockUser,
};

export default {
  title: 'features/AdminUser/AdminUserCreate',
  component: AdminUserCreate,
  decorators: [
    (AdminUserCreateStory) => (
      <MemoryRouter>
        <MockPathwayProvider>
          <NewMockSdApolloProvider mocks={ apolloMocks }>
            <AdminUserCreateStory />
          </NewMockSdApolloProvider>
        </MockPathwayProvider>
      </MemoryRouter>
    ),
  ],
} as Meta<typeof AdminUserCreate>;

// STORIES

/**
 * Working state
 */
export const Default: Story = () => {
  fetchMock.restore().mock('end:/rest/createuser/', successfulCreateAccountMock);
  return <AdminUserCreate />;
};
Default.parameters = {
  apolloMocks: apolloMocks,
};

/**
 * Working state with loading delay
 */
export const Loading: Story = () => {
  fetchMock.restore().mock('end:/rest/createuser/', successfulCreateAccountMock, { delay: 1000 });
  return <AdminUserCreate />;
};
Loading.parameters = {
  apolloMocks: apolloMocks,
};

/**
 * HTTP error state
 */
export const Error: Story = () => {
  fetchMock.restore().mock('end:/rest/createuser/', { body: { detail: 'Error: server error' }, status: 500 });
  return <AdminUserCreate />;
};
Error.parameters = {
  apolloMocks: apolloMocks,
};

/**
 * User account already exists
 */
export const UsernameAlreadyExists: Story = () => {
  fetchMock.restore().mock('end:/rest/createuser/', { body: { detail: 'an account with this username already exists' }, status: 422 });
  return <AdminUserCreate />;
};
UsernameAlreadyExists.parameters = {
  apolloMocks: apolloMocks,
};
