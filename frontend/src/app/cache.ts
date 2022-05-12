import { InMemoryCache, ReactiveVar, makeVar } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import User from 'types/Users';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        pathwayOptions: { read: () => loggedInUserVar()?.pathways },
        loggedInUser: { read: () => loggedInUserVar() },
        getPatientOnPathwayConnection: relayStylePagination(['outstanding', 'pathwayId', 'underCareOf', 'includeDischarged']),
        getPatient: {
          merge: true,
        },
        getUserConnection: relayStylePagination(),
      },
    },
  },
});

/**
 * Decorator for ReactiveVar. This will persist vars in localStorage.
 *
 * @param value Initial value
 * @param storageKey local storage key
 * @returns Decorated ReactiveVar
 */
function makePersistantVar<T>(value: T, storageKey: string): ReactiveVar<T> {
  const reactiveVar = makeVar(value);
  const _constStorageKey = storageKey; // keep a reference around in this closure
  // eslint-disable-next-line func-names
  const persistantReactiveVar: ReactiveVar<T> = function (newValue): T {
    if (arguments.length > 0) {
      localStorage.setItem(_constStorageKey, JSON.stringify(newValue));
      return reactiveVar(newValue);
    }
    if (newValue === null) {
      localStorage.removeItem(_constStorageKey);
      return reactiveVar(undefined);
    }
    return reactiveVar();
  };

  persistantReactiveVar.onNextChange = reactiveVar.onNextChange;
  persistantReactiveVar.attachCache = reactiveVar.attachCache;
  persistantReactiveVar.forgetCache = reactiveVar.forgetCache;
  return persistantReactiveVar;
}

// Here we reconstruct the user from local storage. If any fields are missing, we
// don't use it
let sanitisedUser: User | null = {
  id: '0',
  firstName: '',
  lastName: '',
  department: '',
  roles: [],
  defaultPathway: undefined,
  token: '',
  pathways: [],
};

const localStorageUserJson = localStorage.getItem('loggedInUser');
if (localStorageUserJson) {
  try {
    const localStorageUser: User = JSON.parse(localStorageUserJson) as User;
    sanitisedUser.id = localStorageUser.id;
    sanitisedUser.firstName = localStorageUser.firstName;
    sanitisedUser.lastName = localStorageUser.lastName;
    sanitisedUser.department = localStorageUser.department;
    sanitisedUser.roles = localStorageUser.roles;
    sanitisedUser.defaultPathway = localStorageUser.defaultPathway;
    sanitisedUser.token = localStorageUser.token;
    sanitisedUser.pathways = localStorageUser.pathways;
  } catch (err) {
    sanitisedUser = null;
  }
}
sanitisedUser = sanitisedUser?.id === '0'
  ? null
  : sanitisedUser;
export const loggedInUserVar: ReactiveVar<User | null> = makePersistantVar<User | null>(
  sanitisedUser,
  'loggedInUser',
);

const currentPathwayIdLocalStorage = localStorage.getItem('currentPathwayId');
const currentPathwayId = currentPathwayIdLocalStorage
  ? JSON.parse(currentPathwayIdLocalStorage)
  : null;
const userDefaultPathway = loggedInUserVar()?.defaultPathway?.id;

let _currentPathway;
if (currentPathwayId) {
  _currentPathway = currentPathwayId;
} else if (userDefaultPathway) {
  _currentPathway = userDefaultPathway;
} else if (loggedInUserVar()?.pathways?.[0]) {
  _currentPathway = loggedInUserVar()?.pathways[0].id;
} else {
  _currentPathway = null;
}

// Save the current pathway ID
export const currentPathwayIdVar: ReactiveVar<string | null> = makePersistantVar<string | null>(
  _currentPathway, 'currentPathwayId',
);
