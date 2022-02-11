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
  const user: User = {
    id: 1,
    firstName: 'Test-John',
    lastName: 'Test-Doe',
    department: 'Respiratory',
    defaultPathwayId: 1,
    roles: [],
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
  const pathways: PathwayOption[] = [
    {
      id: 1,
      name: 'Lung Cancer Test',
    },
    {
      id: 2,
      name: 'Bronchieactasis Test',
    },
  ];

  const providerValue = value?.pathwayOptions === undefined
    ? {
      pathwayOptions: pathways,
      updateCurrentPathwayId: () => { },
      currentPathwayId: 1,
      updatePathwayOptions: () => { },
    }
    : value;
  return (
    <PathwayContext.Provider value={ providerValue }>
      { children }
    </PathwayContext.Provider>
  );
};
