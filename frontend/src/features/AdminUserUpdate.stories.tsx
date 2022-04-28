/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import User from 'types/Users';
import { MemoryRouter } from 'react-router';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { DocumentNode } from '@apollo/client';
import { RequestHandler } from 'mock-apollo-client';
import { MockPathwayProvider } from 'test/mocks/mockContext';
import AdminUserUpdate, { USER_ADMIN_GET_USER_WITH_ROLES_QUERY } from './AdminUserUpdate';
import { userAdminGetUserWithRoles } from './__generated__/userAdminGetUserWithRoles';

// MOCKS

export type CreateUserReturnData = {
  user?: User;
  error?: string;
  detail?: string;
};

const mockUser: userAdminGetUserWithRoles['getUser'] = {
  __typename: 'User',
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'test@test.com',
  username: 'jdoe',
  department: 'Respiratory',
  defaultPathwayId: '1',
  isActive: true,
  roles: [
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
  ],
};

const mockRoles: userAdminGetUserWithRoles['getRoles'] = [
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

// Successful creation
const successfulCreateAccountMock: CreateUserReturnData = {
  user: mockUser,
};

const apolloMocks: {
  query: DocumentNode;
  mockFn: RequestHandler<userAdminGetUserWithRoles, { id: string }>;
}[] = [
  {
    query: USER_ADMIN_GET_USER_WITH_ROLES_QUERY,
    mockFn: () => Promise.resolve({
      data: {
        getUser: mockUser,
        getRoles: mockRoles,
      },
    }),
  },
];

export default {
  title: 'features/AdminUserUpdate',
  component: AdminUserUpdate,
  decorators: [
    (AdminUserUpdateStory) => (
      <MemoryRouter>
        <MockPathwayProvider>
          <NewMockSdApolloProvider mocks={ apolloMocks }>
            <AdminUserUpdateStory />
          </NewMockSdApolloProvider>
        </MockPathwayProvider>
      </MemoryRouter>
    ),
  ],
} as Meta<typeof AdminUserUpdate>;

// STORIES

/**
 * Working state
 */
export const Default: Story = () => {
  fetchMock.restore().mock('end:/rest/updateuser/', successfulCreateAccountMock);
  return <AdminUserUpdate updateUserId={ mockUser.id } />;
};
Default.parameters = {
  apolloMocks: apolloMocks,
};

/**
 * Working state with loading delay
 */
export const Loading: Story = () => {
  fetchMock.restore().mock('end:/rest/updateuser/', successfulCreateAccountMock, { delay: 1000 });
  return <AdminUserUpdate updateUserId={ mockUser.id } />;
};
Loading.parameters = {
  apolloMocks: apolloMocks,
};

/**
 * HTTP error state
 */
export const Error: Story = () => {
  fetchMock.restore().mock('end:/rest/updateuser/', { body: { detail: 'Error: ±Server error' }, status: 500 });
  return <AdminUserUpdate updateUserId={ mockUser.id } />;
};
Error.parameters = {
  apolloMocks: apolloMocks,
};
