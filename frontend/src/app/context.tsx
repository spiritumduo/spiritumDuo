/* eslint-disable @typescript-eslint/no-empty-function */
import React from 'react';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';

interface AuthContextInterface {
    user?: User;
    updateUser: (user: User | undefined) => void;
}
export const AuthContext = React.createContext<AuthContextInterface>({ updateUser: () => { } });
export const AuthProvider = AuthContext.Provider;

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
export const PathwayProvider = PathwayContext.Provider;
