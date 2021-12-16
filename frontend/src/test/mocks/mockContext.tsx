/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { AuthContext, PathwayContext } from 'app/context';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';

export const MockAuthProvider = (
  { children }: React.ComponentPropsWithRef<any>,
  value?: { user: User, updateUser: () => void },
): JSX.Element => {
  const user: User = {
    id: 1,
    firstName: 'Test-John',
    lastName: 'Test-Doe',
    department: 'Respiratory',
    roles: [],
  };
  const providerValue = value || {
    user: user,
    updateUser: () => { },
  };
  return (
    <AuthContext.Provider value={ providerValue }>
      { children }
    </AuthContext.Provider>
  );
};

export const MockPathwayProvider = (
  { children }: React.ComponentPropsWithRef<any>,
  value?: {
    pathwayOptions: PathwayOption[],
    updateCurrentPathwayId: () => void,
    updatePathwayOptions: () => void
  },
): JSX.Element => {
  const pathways: PathwayOption[] = [
    {
      id: 1,
      name: 'Lung Cancer Feet',
    },
    {
      id: 2,
      name: 'Bronchieactasis Deux',
    },
  ];
  const providerValue = value || {
    pathwayOptions: pathways,
    updateCurrentPathwayId: () => { },
    updatePathwayOptions: () => { },
  };
  return (
    <PathwayContext.Provider value={ providerValue }>
      { children }
    </PathwayContext.Provider>
  );
};
