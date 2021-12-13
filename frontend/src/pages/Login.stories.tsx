/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Story, Meta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';
import { Routes, Route, useNavigate, MemoryRouter } from 'react-router-dom';
import LoginPage, { LoginPageProps } from './Login';

const MockHome = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/login');
    }, 1000);
    return () => clearTimeout(timer);
  });
  return <h1>Login Success!</h1>;
};

export default {
  title: 'Pages/Login',
  component: LoginPage,
  decorators: [(LoginStory) => (
    <MemoryRouter initialEntries={ ['/login'] }>
      <Routes>
        <Route path="/" element={ <MockHome /> } />
        <Route path="/login" element={ <LoginStory /> } />
      </Routes>
    </MemoryRouter>
  )],
} as Meta<typeof LoginPage>;

/**
 * MOCK RESPONSES
 */

/**
 * Successful login
 */
const successfulLoginMock: { user: User, pathways: PathwayOption[], error: string | null } = {
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
  error: null,
};

/**
 * Invalid login
 */
const invalidLoginMock: {
  user?: User,
  pathways?: PathwayOption[],
  error?: string;
} = {
  error: 'Incorrect username and/or password',
};

/**
 * STORIES
 */

/**
 * Default login page - results in successful login
 */
export const Default: Story<LoginPageProps> = () => {
  fetchMock.restore().mock('end:/rest/login', successfulLoginMock);
  return <LoginPage />;
};

/**
 * Loading state - will pause loading for short time
 */
export const Loading: Story<LoginPageProps> = () => {
  fetchMock.restore().mock('end:/rest/login', successfulLoginMock, { delay: 1000 });
  return <LoginPage />;
};

/**
 * Error state - fetch responds with error code
 */
export const Error: Story<LoginPageProps> = () => {
  fetchMock.restore().mock('end:/rest/login', { body: { user: null, pathways: null }, status: 500 });
  return <LoginPage />;
};

/**
 * Invalid login - incorrect username or passsword
 */
export const InvalidLogin: Story<LoginPageProps> = () => {
  fetchMock.restore().mock('end:/rest/login', invalidLoginMock);
  return <LoginPage />;
};
