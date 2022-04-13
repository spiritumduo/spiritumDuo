/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import User from 'types/Users';
import { DefaultLayout } from 'components/PageLayout.stories';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import AdministrationPage, { AdministrationPageProps } from './Administration';

const user: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  department: 'Respiratory',
  defaultPathwayId: 1,
  roles: [],
  token: 'token',
  isAdmin: true,
};

export default {
  title: 'Pages/Administration',
  component: AdministrationPage,
  decorators: [
    (AdministrationPageStory) => (
      <MemoryRouter>
        {/* eslint-disable-next-line object-shorthand */}
        <MockAuthProvider value={ { user, updateUser: (() => ({})) } }>
          <MockPathwayProvider>
            <PageLayout { ...DefaultLayout.args as PageLayoutProps }>
              <AdministrationPageStory />
            </PageLayout>
          </MockPathwayProvider>
        </MockAuthProvider>
      </MemoryRouter>
    ),
  ],
} as Meta<typeof AdministrationPage>;

export const Default: Story<AdministrationPageProps> = (args: AdministrationPageProps) => (
  <AdministrationPage { ...args } />
);

Default.args = { user: undefined };
Default.parameters = {

};
