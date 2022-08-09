import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import User from 'types/Users';
import PathwayOption from 'types/PathwayOption';
import { AuthContext, PathwayContext } from 'app/context';
import { Button, ErrorMessage, Fieldset, Form, Footer, Details } from 'nhsuk-react-components';
import { Container } from 'react-bootstrap';
import { Input } from 'components/nhs-style';
import './login.css';
import useRESTSubmit from 'app/hooks/rest-submit';

export type LoginData = {
  user?: User;
  pathways?: PathwayOption[];
  token?: string;
  error?: string;
};

export interface LoginFormInputs {
  username: string;
  password: string;
}

const LoginPage = (): JSX.Element => {
  const [loading, error, data, doLogin] = useRESTSubmit<LoginData, LoginFormInputs>('/api/rest/login/');

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
  const { updateCurrentPathwayId } = useContext(PathwayContext);
  useEffect(() => {
    if (data?.user) {
      updateUser(data.user);
      updateCurrentPathwayId(data.user.defaultPathway?.id || data.user.pathways[0]?.id || '1');
      navigate('/', { replace: true });
    }
  });

  return (
    <>
      <Container className="py-5 login-container">
        <Form onSubmit={ handleSubmit( () => {
          doLogin(getValues());
        } ) }
        >
          <Fieldset disabled={ loading }>
            <Fieldset.Legend isPageHeading>Enter credentials here</Fieldset.Legend>
            <Input className="login-input" id="username" type="text" label="Username" autoCapitalize="off" autoCorrect="username" error={ errors.username?.message } { ...register('username', { required: true }) } />
            <Input className="login-input" id="password" type="password" label="Password" autoCapitalize="off" autoCorrect="password" error={ errors.password?.message } { ...register('password', { required: true }) } />
            {error?.message ? <ErrorMessage>{error?.message}</ErrorMessage> : ''}
            <p>{ loading ? 'Loading' : '' }</p>
            <Button className="float-end" id="submit">Login</Button>
            <Details>
              <Details.Summary>Forgot your credentials?</Details.Summary>
              <Details.Text>
                This is a proof-of-concept system. If you are the administrator,
                a username and password is generated when running `manage.py` that
                will also generate test data.
              </Details.Text>
            </Details>
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
