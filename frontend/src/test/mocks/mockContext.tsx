/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { AuthContext, PathwayContext } from 'app/context';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';

interface MockAuthProviderProps {
  children: JSX.Element;
  value?: { user: User, updateUser: () => void };
}

export const MockAuthProvider = ({ children, value }: MockAuthProviderProps): JSX.Element => {
  const user: User = {
    id: 1,
    firstName: 'Test-John',
    lastName: 'Test-Doe',
    department: 'Respiratory',
    roles: [],
  };
  // eslint-disable-next-line no-unneeded-ternary
  const providerValue = value !== undefined ? value : {
    user: user,
    updateUser: () => { },
  };
  return (
    <AuthContext.Provider value={ providerValue }>
      { children }
    </AuthContext.Provider>
  );
};

interface MockPathwayProviderProps {
  children: JSX.Element;
  value?: {
    pathwayOptions: PathwayOption[],
    updateCurrentPathwayId: () => void,
    updatePathwayOptions: () => void
  }
}

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
      updatePathwayOptions: () => { },
    }
    : value;
  return (
    <PathwayContext.Provider value={ providerValue }>
      { children }
    </PathwayContext.Provider>
  );
};
