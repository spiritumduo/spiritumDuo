/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { AuthContext, AuthContextInterface, PathwayContext, PathwayContextInterface } from 'app/context';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';

interface MockAuthProviderProps {
  children: JSX.Element;
  value?: AuthContextInterface;
}

/**
 * This mock sets a mock user so test can use it and not worry
 * about it.
 *
 *
 * @param props MockAuthProviderProps
 * @returns AuthContext.Provider
 */
export const MockAuthProvider = ({ children, value }: MockAuthProviderProps): JSX.Element => {
  const pathways: PathwayOption[] = [
    {
      id: '1',
      name: 'Lung Cancer Test',
    },
    {
      id: '2',
      name: 'Bronchieactasis Test',
    },
  ];
  const user: User = {
    id: '1',
    firstName: 'Test-John',
    lastName: 'Test-Doe',
    department: 'Respiratory',
    defaultPathwayId: '1',
    roles: [],
    token: 'token',
    pathways: pathways,
  };
  // eslint-disable-next-line no-unneeded-ternary
  const providerValue = value !== undefined
    ? value
    : { user: user, updateUser: () => { } };
  return (
    <AuthContext.Provider value={ providerValue }>
      { children }
    </AuthContext.Provider>
  );
};

interface MockPathwayProviderProps {
  children: JSX.Element;
  value?: PathwayContextInterface;
}

/**
 * This mock sets default pathways so tests can just use it and not worry
 * about it.
 *
 *
 * @param props MockPathwayProviderProps
 * @returns PathwayContext.Provider
 */
export const MockPathwayProvider = ({
  children, value,
}: MockPathwayProviderProps ): JSX.Element => {
  const providerValue = value?.currentPathwayId === undefined
    ? {
      currentPathwayId: '1',
      updateCurrentPathwayId: () => { },
    }
    : value;
  return (
    <PathwayContext.Provider value={ providerValue }>
      { children }
    </PathwayContext.Provider>
  );
};
