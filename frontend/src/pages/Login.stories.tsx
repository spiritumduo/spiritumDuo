/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import StoryRouter from 'storybook-react-router';
import { Story, Meta } from '@storybook/react';
import { FormikHelpers } from 'formik';
import { action } from '@storybook/addon-actions';
import LoginPage, { LoginPageProps, LoginStatus, LoginValues } from './Login';

export default {
  title: 'Pages/Login',
  component: LoginPage,
  decorators: [StoryRouter()],
} as Meta<typeof LoginPage>;

const Template: Story<LoginPageProps> = (args: LoginPageProps) => <LoginPage { ...args } />;

export const Default = Template.bind({});
Default.args = {
  submitFn: (values: LoginValues, { setSubmitting, setStatus }: FormikHelpers<LoginValues>) => {
    action('form-submit');
    setStatus(LoginStatus.SUCCESS);
    setSubmitting(false);
  },
};

export const InvalidLogin = Template.bind({});
InvalidLogin.args = {
  submitFn: (values: LoginValues, { setSubmitting, setStatus }: FormikHelpers<LoginValues>) => {
    action('form-submit');
    setStatus(LoginStatus.INVALID_LOGIN);
    setSubmitting(false);
  },
};
