/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { Story, Meta } from '@storybook/react';
import { MockedProvider } from '@apollo/client/testing';
import { action } from '@storybook/addon-actions';
import { LoginStatus, LoginFormInputs, useLoginSubmit, useLoginForm, LOGIN_QUERY } from 'app/hooks/LoginHooks';
import LoginPage, { LoginPageProps } from './Login';

const apolloMocks = [
  {
    request: {
      query: LOGIN_QUERY,
      variables: {
        username: 'Bob',
        password: 'Bob',
      },
    },
    result: {
      data: {
        login: {
          user: {
            id: '1',
            firstName: 'John',
            lastName: 'Doe',
            username: 'bob',
            department: 'respiratory',
          },
        },
      },
    },
  },
];

export default {
  title: 'Pages/Login',
  component: LoginPage,
  decorators: [
    StoryRouter(),
    (LoginStory) => (
      <MockedProvider mocks={ apolloMocks }>
        <LoginStory />
      </MockedProvider>
    ),
  ],
} as Meta<typeof LoginPage>;

const Template: Story<LoginPageProps> = () => <LoginPage />;

export const Default = Template.bind({});
Default.args = { };

export const InvalidLogin = Template.bind({});
InvalidLogin.args = { };
