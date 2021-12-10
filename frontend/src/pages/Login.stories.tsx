/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { Story, Meta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';
import LoginPage, { LoginPageProps } from './Login';

export default {
  title: 'Pages/Login',
  component: LoginPage,
} as Meta<typeof LoginPage>;

const validLoginMock: { user: User, pathways: PathwayOption[], errors: string | null } = {
  user: {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    department: 'Respiratory',
    roles: [],
  },
  pathways: [
    {
      id: 1,
      name: 'Lung Cancer',
    },
    {
      id: 2,
      name: 'Broncheastasis',
    },
  ],
  errors: null,
};
export const Default: Story<LoginPageProps> = () => {
  fetchMock.restore().mock('end:/rest/login', validLoginMock);
  return <LoginPage />;
};
Default.args = { };

export const Loading: Story<LoginPageProps> = () => {
  fetchMock.restore().mock('end:/rest/login', validLoginMock);
  return <LoginPage />;
};

export const Error: Story<LoginPageProps> = () => {
  fetchMock.restore().mock('end:/rest/login', validLoginMock, { headers: { status: 403 } });
  return <LoginPage />;
};

const invalidLoginMock: {
  user?: User,
  pathways?: PathwayOption[],
  errors?: string;
} = {
  user: undefined,
  pathways: undefined,
  errors: 'Invalid username or password',
};
export const InvalidLogin: Story<LoginPageProps> = () => {
  fetchMock.restore().mock('end:/rest/login', invalidLoginMock);
  return <LoginPage />;
};
InvalidLogin.args = { };
