import { InMemoryCache, ReactiveVar, makeVar } from '@apollo/client';
import { relayStylePagination } from '@apollo/client/utilities';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';

export const cache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        pathwayOptions: { read: () => pathwayOptionsVar() },
        loggedInUser: { read: () => pathwayOptionsVar() },
        getPatientOnPathwayConnection: relayStylePagination(['pathwayId', 'awaitingDecisionType']),
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

// Get initial pathway options from LocalStorage if cached.
const pathwayOptionsArray: PathwayOption[] = [];
const pathwayOptionsLocalStorage = localStorage.getItem('pathwayOptions');
if (pathwayOptionsLocalStorage) {
  try {
    const pathwayOptions = JSON.parse(pathwayOptionsLocalStorage);
    if (Array.isArray(pathwayOptions)) {
      pathwayOptions.forEach((p) => {
        const pathway = { id: p.id, name: p.name };
        pathwayOptionsArray.push(pathway);
      });
    }
  } catch (err) {
    console.warn(err);
  }
}

// eslint-disable-next-line max-len
export const pathwayOptionsVar: ReactiveVar<PathwayOption[]> = makePersistantVar<PathwayOption[]>(
  pathwayOptionsArray,
  'pathwayOptions',
);

const _currentId = pathwayOptionsArray[0] ? pathwayOptionsArray[0].id : 0;
// Save the current pathway ID
export const currentPathwayIdVar: ReactiveVar<number> = makePersistantVar<number>(_currentId, 'currentPathwayId');

// Here we reconstruct the user from local storage. If any fields are missing, we
// don't use it
let sanitisedUser: User | null = {
  id: 0,
  firstName: '',
  lastName: '',
  department: '',
  roles: [],
};

const loggedInuserLocalStorage = localStorage.getItem('loggedInUser');
if (loggedInuserLocalStorage) {
  try {
    const loggedInUser: User = JSON.parse(loggedInuserLocalStorage) as User;
    sanitisedUser.id = parseInt(loggedInUser.id.toString(), 10);
    sanitisedUser.firstName = loggedInUser.firstName;
    sanitisedUser.lastName = loggedInUser.lastName;
    sanitisedUser.department = loggedInUser.department;
    sanitisedUser.roles = loggedInUser.roles;
    sanitisedUser = sanitisedUser.id === 0 ? null : sanitisedUser;
  } catch (err) {
    console.warn(err);
    sanitisedUser = null;
  }
}
export const loggedInUserVar: ReactiveVar<User | null> = makePersistantVar<User | null>(
  sanitisedUser,
  'loggedInUser',
);
