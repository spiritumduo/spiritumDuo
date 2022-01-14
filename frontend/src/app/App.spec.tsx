/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { render, screen } from '@testing-library/react';
// we want fetchMock to prevent any accidental logins, even though we
// don't test login here
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import fetchMock from 'fetch-mock';
import { MockedProvider } from '@apollo/client/testing';
import Cookies from 'js-cookie';
import { AuthContext, AuthContextInterface, PathwayContext, PathwayContextInterface } from 'app/context';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';
import { MemoryRouter } from 'react-router';
import App from './App';

const fakeUser: User = {
  id: 1,
  firstName: 'Test-John',
  lastName: 'Test-Doe',
  department: 'Respiratory',
  roles: [],
};

const fakePathways: PathwayOption[] = [
  {
    id: 1,
    name: 'Lung Cancer Test',
  },
  {
    id: 2,
    name: 'Bronchieactasis Test',
  },
];

const mockAuthProviderProps: AuthContextInterface = {
  updateUser: () => {},
  user: fakeUser,
};

const mockPathwayProviderProps: PathwayContextInterface = {
  pathwayOptions: fakePathways,
  currentPathwayId: fakePathways[0].id,
  updateCurrentPathwayId: () => {},
  updatePathwayOptions: () => {},
};

interface AppElementProps {
  authProviderProps?: AuthContextInterface,
  pathwayProviderProps?: PathwayContextInterface,
  sessionCookie?: boolean,
}

const renderApp = (props?: AppElementProps) => {
  const setCookie = props?.sessionCookie !== undefined
    ? props.sessionCookie
    : true;
  if (setCookie) {
    Cookies.set('SDSESSION', '1234567');
  } else {
    Cookies.remove('SDSESSION');
  }
  render(
    <MockedProvider>
      <AuthContext.Provider value={ props?.authProviderProps || mockAuthProviderProps }>
        <PathwayContext.Provider value={ props?.pathwayProviderProps || mockPathwayProviderProps }>
          <MemoryRouter>
            <App />
          </MemoryRouter>
        </PathwayContext.Provider>
      </AuthContext.Provider>
    </MockedProvider>,
  );
};

test('Should render login page with no user in context', () => {
  renderApp({
    authProviderProps: {
      user: undefined,
      updateUser: () => {},
    },
  });
  expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('Should render login page with no session cookie', () => {
  renderApp({ sessionCookie: false });
  expect(screen.getByRole('textbox', { name: 'Username' })).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test('Should render home page with valid user and pathways', () => {
  renderApp();
  expect(screen.getByText(/patients needing triage/i)).toBeInTheDocument();
  expect(screen.getByText(/clinic patients/i)).toBeInTheDocument();
});

test('Should display error if no pathways present while logged in', () => {
  renderApp({
    pathwayProviderProps: {
      pathwayOptions: [],
      updateCurrentPathwayId: () => {},
      updatePathwayOptions: () => {},
    },
  });
  expect(screen.getByText(/application not configured/i)).toBeInTheDocument();
});
