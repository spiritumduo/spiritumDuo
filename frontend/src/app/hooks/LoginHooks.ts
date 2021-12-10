import { useState } from 'react';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';

export enum LoginStatus {
  SUCCESS,
  INVALID_LOGIN,
  INITIAL,
  LOADING
}

export type LoginData = {
  user: User | null;
  pathways: PathwayOption[] | null;
  errors: string;
};

export interface LoginFormInputs {
  username: string;
  password: string;
}

type LoginSubmitHook = [
  boolean,
  any,
  LoginData | undefined,
  (variables: LoginFormInputs) => void
];

export function useLoginSubmit(): LoginSubmitHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [data, setData] = useState<LoginData | undefined>(undefined);

  async function doLogin(variables: LoginFormInputs) {
    setLoading(true);
    try {
      const response = await window.fetch('http://localhost:8080/rest/login', {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(variables),
      });
      const decoded: LoginData = await response.json();
      if (decoded.errors) {
        setError(decoded.errors); // e.g. invalid password
      } else {
        setData(decoded);
      }
    } catch (err) {
      setError(err);
    }
  }
  return [loading, error, data, doLogin];
}
