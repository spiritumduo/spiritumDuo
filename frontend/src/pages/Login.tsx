import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, UseFormRegisterReturn } from 'react-hook-form';
import * as yup from 'yup';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';
import { AuthContext, PathwayContext } from 'app/context';

import { Button, Container, ErrorMessage, Fieldset, Form, Footer } from 'nhsuk-react-components';
import Input from '../components/nhs_style/input/Input';

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

  return (
    <>
      <Container className="py-5 h-100">
        <Form onSubmit={ handleSubmit( () => {
          doLogin(getValues());
        } ) }
        >
          <Fieldset disableErrorLine disabled={ loading }>
            <Fieldset.Legend isPageHeading>Enter credentials here</Fieldset.Legend>
            <Input id="username" type="text" label="Username" error={ errors.username?.message } register={ register('username', { required: true }) } />
            <Input id="password" type="password" label="Password" error={ errors.password?.message } register={ register('password', { required: true }) } />
            {error?.message ? <ErrorMessage>{error?.message}</ErrorMessage> : ''}
            <p>{ loading ? 'Loading' : '' }</p>
            <Button className="float-end" id="submit">Login</Button>
          </Fieldset>
        </Form>
      </Container>
      <Footer>
        <Footer.List />
      </Footer>
    </>
  );
};

export default LoginPage;
