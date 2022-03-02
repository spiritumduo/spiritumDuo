import React, { useContext, useEffect, useState, MutableRefObject } from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';
import { AuthContext, PathwayContext } from 'app/context';

import { Button, Container, ErrorMessage, Fieldset, Form, Input } from 'nhsuk-react-components';
import { FormGroup } from 'react-bootstrap';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginPageProps { }

export type LoginData = {
  user: User | null;
  pathways: PathwayOption[] | null;
  error: string;
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
      const { location } = window;
      const uriPrefix = `${location.protocol}//${location.host}`;
      const response = await window.fetch(`${uriPrefix}/api/rest/login`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify(variables),
      });
      if (!response.ok) {
        throw new Error(`Error: Response ${response.status} ${response.statusText}`);
      }
      const decoded: LoginData = await response.json();
      if (decoded.error) {
        setError({ message: decoded.error }); // e.g. invalid password
      } else {
        setData(decoded);
      }
    } catch (err) {
      setError(err);
    }
    setLoading(false);
  }
  return [loading, error, data, doLogin];
}

const LoginPage = (): JSX.Element => {
  const [loading, error, data, doLogin] = useLoginSubmit();

  const loginSchema = yup.object({
    username: yup.string().required(),
    password: yup.string().required(),
  }).required();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormInputs>({ resolver: yupResolver(loginSchema) });
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);
  const { updatePathwayOptions, updateCurrentPathwayId } = useContext(PathwayContext);
  useEffect(() => {
    if (data?.user && data?.pathways) {
      updateUser(data.user);
      updatePathwayOptions(data.pathways);
      updateCurrentPathwayId(data.user?.defaultPathwayId);
      navigate('/', { replace: true });
    }
  });

  const usernameRef = register('username', { required: true });
  const passwordRef = register('password', { required: true });

  // eslint-disable-next-line react/jsx-props-no-spreading
  const usernameInput = <Input type="text" id="username" label="Username" error={ !!errors.username?.message } inputRef={ usernameRef.ref } { ...usernameRef } />;
  // eslint-disable-next-line react/jsx-props-no-spreading
  const passwordInput = <Input type="password" id="password" label="Password" error={ !!errors.password?.message } inputRef={ passwordRef.ref } { ...passwordRef } />;

  return (
    <Container className="py-5">
      <Form onSubmit={ handleSubmit( () => {
        doLogin(getValues());
      } ) }
      >
        <Fieldset disableErrorLine disabled={ loading }>
          <Fieldset.Legend isPageHeading>Enter credentials here</Fieldset.Legend>
          { usernameInput }
          { passwordInput }
          {error?.message ? <ErrorMessage className="pt-4">{error?.message}</ErrorMessage> : ''}
          <p>{ loading ? 'Loading' : '' }</p>
          <Button id="submit">Login</Button>
        </Fieldset>
      </Form>
    </Container>
  );
};

export default LoginPage;
