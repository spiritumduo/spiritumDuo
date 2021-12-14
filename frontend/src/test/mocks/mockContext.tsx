/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import { AuthProvider, PathwayProvider } from 'app/context';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';

const user: User = {
  id: 1,
  firstName: 'John',
  lastName: 'Doe',
  department: 'Respiratory',
  roles: [],
};

const pathways: PathwayOption[] = [
  {
    id: 0,
    name: 'Lung Cancer',
  },
  {
    id: 1,
    name: 'Bronchieactasis',
  },
];

export const MockAuthProvider = (
  { children }: React.ComponentPropsWithRef<any>,
): JSX.Element => (
  <AuthProvider value={ { user: user, updateUser: () => { } } }>{ children }</AuthProvider>
);

export const MockPathwayProvider = (
  { children }: React.ComponentPropsWithRef<any>,
): JSX.Element => (
  <PathwayProvider value={ {
    pathwayOptions: pathways,
    updateCurrentPathwayId: () => { },
    updatePathwayOptions: () => { },
  } }
  >
    { children }
  </PathwayProvider>
);
