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
  const [user, updateUser] = useState<User | undefined>();

  if (!user) {
    const localStorageUser = loggedInUserVar(); // user has refreshed browser?
    // this will trigger a single re-render
    if (localStorageUser) updateUser(localStorageUser);
  }
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
  const [pathwayOptions, updatePathwayOptions] = useState<PathwayOption[]>([]);
  const [currentPathwayId, updateCurrentPathwayId] = useState<number | undefined>();

  if (pathwayOptions.length === 0) {
    const localStoragePathwayOptions = pathwayOptionsVar();
    if (localStoragePathwayOptions.length !== 0) updatePathwayOptions(localStoragePathwayOptions);
  }

  if (!currentPathwayId) {
    const localStorageCurrentPathwayId = currentPathwayIdVar();
    if (localStorageCurrentPathwayId) updateCurrentPathwayId(localStorageCurrentPathwayId);
  }
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
