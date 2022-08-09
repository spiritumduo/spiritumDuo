/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import { Story, Meta } from '@storybook/react';
import fetchMock from 'fetch-mock';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';
import { Routes, Route, useNavigate, MemoryRouter } from 'react-router-dom';
import { ConfigProvider } from 'components/ConfigContext/ConfigContext';
import LoginPage, { LoginData } from './Login';

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
    <ConfigProvider>
      <MemoryRouter initialEntries={ ['/login'] }>
        <Routes>
          <Route path="/" element={ <MockHome /> } />
          <Route path="/login" element={ <LoginStory /> } />
        </Routes>
      </MemoryRouter>
    </ConfigProvider>
  )],
} as Meta<typeof LoginPage>;

/**
 * MOCK RESPONSES
 */

const mockPathways: PathwayOption[] = [
  {
    id: '1',
    name: 'Lung Cancer',
  },
  {
    id: '2',
    name: 'Broncheastasis',
  },
];

/**
 * Successful login
 */
const successfulLoginMock: LoginData = {
  user: {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    department: 'Respiratory',
    roles: [],
    defaultPathway: mockPathways[0],
    token: 'authToken',
    pathways: mockPathways,
  },
  config: {
    hospitalNumberFormat: 'f@@@:@@@@@@@l',
    nationalNumberFormat: 'f@@@:@@@-@@@-@@@@l',
  },
  error: undefined,
};

/**
 * Invalid login
 */
const invalidLoginMock: LoginData = {
  error: 'Incorrect username and/or password',
};

/**
 * STORIES
 */

/**
 * Default login page - results in successful login
 */
export const Default: Story = () => {
  fetchMock.restore().mock('end:/rest/login/', successfulLoginMock);
  return <LoginPage />;
};

/**
 * Loading state - will pause loading for short time
 */
export const Loading: Story = () => {
  fetchMock.restore().mock('end:/rest/login/', successfulLoginMock, { delay: 1000 });
  return <LoginPage />;
};

/**
 * Error state - fetch responds with error code
 */
export const Error: Story = () => {
  fetchMock.restore().mock('end:/rest/login/', { body: { user: null, pathways: null }, status: 500 });
  return <LoginPage />;
};

/**
 * Invalid login - incorrect username or passsword
 */
export const InvalidLogin: Story = () => {
  fetchMock.restore().mock('end:/rest/login/', invalidLoginMock);
  return <LoginPage />;
};
