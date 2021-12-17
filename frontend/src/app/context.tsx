/* eslint-disable @typescript-eslint/no-empty-function */
import React, { useState } from 'react';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';
import { currentPathwayIdVar, loggedInUserVar, pathwayOptionsVar } from 'app/cache';

interface AuthContextInterface {
    user?: User;
    updateUser: (user: User | undefined) => void;
}
export const AuthContext = React.createContext<AuthContextInterface>({ updateUser: () => { } });
export const AuthProvider = ({ children }: React.ComponentPropsWithRef<any>): JSX.Element => {
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

interface PathwayContextInterface {
    pathwayOptions: PathwayOption[];
    updatePathwayOptions: (pathways: PathwayOption[]) => void;
    currentPathwayId?: number;
    updateCurrentPathwayId: (id: number) => void;
}
export const PathwayContext = React.createContext<PathwayContextInterface>({
  pathwayOptions: [],
  updatePathwayOptions: () => { },
  updateCurrentPathwayId: () => { },
});

export const PathwayProvider = ({ children }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const [pathwayOptions, updatePathwayOptionsState] = useState<PathwayOption[]>([]);
  const [currentPathwayId, updateCurrentPathwayIdState] = useState<number | undefined>();

  if (pathwayOptions.length === 0) {
    const localStoragePathwayOptions = pathwayOptionsVar();
    if (localStoragePathwayOptions.length !== 0) {
      updatePathwayOptionsState(localStoragePathwayOptions);
    }
  }

  if (!currentPathwayId) {
    const localStorageCurrentPathwayId = currentPathwayIdVar();
    if (localStorageCurrentPathwayId) updateCurrentPathwayIdState(localStorageCurrentPathwayId);
  }

  const updatePathwayOptions = (pathways: PathwayOption[]) => {
    updatePathwayOptionsState(pathways);
    pathwayOptionsVar(pathways);
  };

  const updateCurrentPathwayId = (id: number) => {
    updateCurrentPathwayIdState(id);
    currentPathwayIdVar(id);
  };

  return (
    <PathwayContext.Provider
      value={ {
        pathwayOptions,
        updatePathwayOptions,
        currentPathwayId,
        updateCurrentPathwayId,
      } }
    > { children }
    </PathwayContext.Provider>
  );
};
