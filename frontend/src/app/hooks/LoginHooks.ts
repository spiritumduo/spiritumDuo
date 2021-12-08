import { useState } from 'react';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { pathwayOptionsVar, loggedInUserVar, currentPathwayId } from 'app/cache';
import User from 'types/Users';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ValuesOfCorrectTypeRule } from 'graphql';
import { getPatientOnPathwayConnectionVariables } from 'app/queries/__generated__/getPatientOnPathwayConnection';
import PathwayOption from 'types/PathwayOption';

export enum LoginStatus {
  SUCCESS,
  INVALID_LOGIN,
  INITIAL,
  LOADING
}

export interface LoginFormInputs {
  username: string;
  password: string;
}

type LoginStatusHook = {
  status: LoginStatus;
  setLoginStatus: (status: LoginStatus) => void;
};

export function useLoginStatus(): LoginStatusHook {
  const [status, setStatus] = useState(LoginStatus.INITIAL);
  function setLoginStatus(loginStatus: LoginStatus) {
    setStatus(loginStatus);
  }
  return {
    status: status,
    setLoginStatus: setLoginStatus,
  };
}

type LoginSubmitHook = [
  boolean,
  any,
  LoginData | undefined,
  (variables: LoginFormInputs) => void
];

export const LOGIN_QUERY = gql`
mutation login ($username: String!, $password: String!) {
  login (username: $username, password: $password) {
        id
        firstName
        lastName
        username
        department
    }
  }`;

export function useLoginSubmit(): LoginSubmitHook {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<unknown>(undefined);
  const [data, setData] = useState<LoginData | undefined>(undefined);

  async function doLogin(variables: LoginFormInputs) {
    // loginMutation({ variables: variables });
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
      setData(decoded);
    } catch (err) {
      setError(err);
    }
  }
  // const [loginMutation, { loading, error, data }] = useMutation(LOGIN_QUERY);

  return [loading, error, data, doLogin];
}

type LoginData = {
  user: User;
  pathways: PathwayOption[];
};

export function loginSuccess({ user, pathways }: LoginData) {
  loggedInUserVar(user);
  pathwayOptionsVar(pathways);
  currentPathwayId(pathways[0].id);
}

export function useLoginForm() {
  const loginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  }).required();

  return useForm<LoginFormInputs>({ resolver: yupResolver(loginSchema) });
}
