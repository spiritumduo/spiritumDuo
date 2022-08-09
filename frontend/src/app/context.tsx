/* eslint-disable @typescript-eslint/no-empty-function */
import React, { ElementType, useState } from 'react';
import User from 'types/Users';
import { currentPathwayIdVar, loggedInUserVar } from 'app/cache';

export interface AuthContextInterface {
    user?: User;
    updateUser: (user: User | undefined) => void;
}
export const AuthContext = React.createContext<AuthContextInterface>({ updateUser: () => { } });
export const AuthProvider = (
  { children }: React.ComponentPropsWithRef<ElementType>,
): JSX.Element => {
  const [user, updateContextUser] = useState<User | undefined>();

  if (!user) {
    const localStorageUser = loggedInUserVar(); // user has refreshed browser?
    // this will trigger a single re-render
    if (localStorageUser) updateContextUser(localStorageUser);
  }

  const updateUser = (newUser?: User) => {
    updateContextUser(newUser);
    loggedInUserVar(newUser);
  };
  return (
    <AuthContext.Provider value={ { user: user, updateUser: updateUser } }>
      { children }
    </AuthContext.Provider>
  );
};

export interface PathwayContextInterface {
    currentPathwayId?: string;
    updateCurrentPathwayId: (id: string) => void;
}
export const PathwayContext = React.createContext<PathwayContextInterface>({
  updateCurrentPathwayId: () => { },
});

export const PathwayProvider = ({ children }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const [currentPathwayId, updateCurrentPathwayIdState] = useState<string | undefined>();

  if (!currentPathwayId) {
    const localStorageCurrentPathwayId = currentPathwayIdVar();
    if (localStorageCurrentPathwayId) updateCurrentPathwayIdState(localStorageCurrentPathwayId);
  }

  const updateCurrentPathwayId = (id: string) => {
    updateCurrentPathwayIdState(id);
    currentPathwayIdVar(id);
  };

  return (
    <PathwayContext.Provider
      value={ {
        currentPathwayId,
        updateCurrentPathwayId,
      } }
    > { children }
    </PathwayContext.Provider>
  );
};
