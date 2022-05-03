/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DocumentNode } from 'graphql';
import { RequestHandler } from 'mock-apollo-client';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';

import { UserList, GET_USER_CONNECTION_QUERY } from './UserList';
import { UserListQuery, UserListQueryVariables } from './__generated__/UserListQuery';

const userConnectionMock: UserListQuery = {
  getUserConnection: {
    __typename: 'UserConnection',
    totalCount: 3,
    pageInfo: {
      __typename: 'PageInfo',
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: 'start-cursor',
      endCursor: 'end-cursor',
    },
    edges: [
      {
        __typename: 'UserEdge',
        node: {
          __typename: 'User',
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          department: 'Department',
        },
        cursor: 'edge-cursor',
      },
      {
        __typename: 'UserEdge',
        node: {
          __typename: 'User',
          id: '2',
          firstName: 'John',
          lastName: 'Doe',
          department: 'Department',
        },
        cursor: 'edge-cursor',
      },
      {
        __typename: 'UserEdge',
        node: {
          __typename: 'User',
          id: '3',
          firstName: 'John',
          lastName: 'Doe',
          department: 'Department',
        },
        cursor: 'edge-cursor',
      },
    ],
  },
};

const apolloMocks: {
  query: DocumentNode;
  mockFn: RequestHandler<UserListQuery, UserListQueryVariables>;
}[] = [
  {
    query: GET_USER_CONNECTION_QUERY,
    mockFn: () => Promise.resolve({
      data: userConnectionMock,
    }),
  },
];

export default {
  title: 'features/AdminUser/UserList',
  component: UserList,
  decorators: [
    (UserListStory) => (
      <MemoryRouter>
        <NewMockSdApolloProvider mocks={ apolloMocks }>
          <UserListStory />
        </NewMockSdApolloProvider>
      </MemoryRouter>
    ),
  ],
  argTypes: { userOnClick: { action: 'clicked' } },
} as ComponentMeta<typeof UserList>;

const Template: ComponentStory<typeof UserList> = (args) => <UserList { ...args } />;

export const Default = Template.bind({});
Default.parameters = {
  apolloMocks: apolloMocks,
};
