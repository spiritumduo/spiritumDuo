/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { Story, Meta } from '@storybook/react';

import { MemoryRouter } from 'react-router';
import { NewMockSdApolloProvider } from 'test/mocks/mockApolloProvider';
import { MockPathwayProvider } from 'test/mocks/mockContext';
import { DocumentNode } from '@apollo/client';
import { RequestHandler } from 'mock-apollo-client';
import { UserListQuery, UserListQueryVariables } from 'features/AdminUser/components/__generated__/UserListQuery';
import { userAdminGetUserWithRoles } from 'features/AdminUser/__generated__/userAdminGetUserWithRoles';
import { userAdminGetRoles } from 'features/AdminUser/__generated__/userAdminGetRoles';
import { AdminUser } from './AdminUser';
import { Default as UpdateDefault } from './AdminUserUpdate.stories';
import { Default as CreateDefault } from './AdminUserCreate.stories';
import { Default as UserListDefault } from './components/UserList.stories';

const apolloMocks: {
  query: DocumentNode;
  mockFn: RequestHandler<UserListQuery, UserListQueryVariables>
  | RequestHandler<userAdminGetUserWithRoles, { id: string }>
  | RequestHandler<userAdminGetRoles, undefined>;
}[] = [
  ...UpdateDefault.parameters?.apolloMocks,
  ...CreateDefault.parameters?.apolloMocks,
  ...UserListDefault.parameters?.apolloMocks,
];

export default {
  title: 'features/AdminUser',
  component: AdminUser,
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
} as Meta<typeof AdminUser>;

const Template: Story<typeof AdminUser> = () => <AdminUser />;

export const Default = Template.bind({});
Default.parameters = {
  apolloMocks: apolloMocks,
};
