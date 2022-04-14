/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Story, Meta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import User from 'types/Users';
import { DefaultLayout } from 'components/PageLayout.stories';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';
import { MemoryRouter } from 'react-router';
import { MockAuthProvider, MockPathwayProvider } from 'test/mocks/mockContext';
import AdministrationPage from './Administration';

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

export type CreateUserReturnUser = {
  username: string;
  firstName: string;
  lastName: string;
  department: string;
  defaultPathwayId: number;
  isActive: boolean;
};

export type CreateUserReturnData = {
  user: CreateUserReturnUser | null;
  error: string | null;
};

/**
 * Successful creation
 */
const successfulCreateAccountMock: CreateUserReturnData = {
  user: {
    firstName: 'John',
    lastName: 'Doe',
    username: 'jdoe',
    department: 'Respiratory',
    defaultPathwayId: 1,
    isActive: false,
  },
  error: null,
};

/**
 * User account already exists
 */
const usernameExistsCreateAccountMock: CreateUserReturnData = {
  user: null,
  error: 'an account with this username already exists',
};

/**
 * Working state
 */
export const Default: Story = () => {
  fetchMock.restore().mock('end:/rest/createuser', successfulCreateAccountMock);
  return <AdministrationPage />;
};

/**
 * Working state with loading delay
 */
export const Loading: Story = () => {
  fetchMock.restore().mock('end:/rest/createuser', successfulCreateAccountMock, { delay: 1000 });
  return <AdministrationPage />;
};

/**
 * HTTP error state
 */
export const Error: Story = () => {
  fetchMock.restore().mock('end:/rest/createuser', { body: { user: null, error: null }, status: 500 });
  return <AdministrationPage />;
};

/**
 * User account already exists
 */
export const UsernameAlreadyExists: Story = () => {
  fetchMock.restore().mock('end:/rest/createuser', usernameExistsCreateAccountMock);
  return <AdministrationPage />;
};
