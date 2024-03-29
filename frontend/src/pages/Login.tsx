import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import User from 'types/Users';
import { AuthContext, PathwayContext } from 'app/context';
import { Button, ErrorMessage, Fieldset, Form, Footer, Details } from 'nhsuk-react-components';
import { Container } from 'react-bootstrap';
import { Input } from 'components/nhs-style';
import './login.css';
import useRESTSubmit from 'app/hooks/rest-submit';
import { ConfigInterface, useConfig } from 'components/ConfigContext';
import sdInvertedImage from 'static/i/sd_inverted.png';
import sdImage from 'static/i/sd.svg';

export interface LoginData {
  user?: User;
  config?: ConfigInterface;
  error?: string;
}

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
  const { updateConfig } = useConfig();

  useEffect(() => {
    if (data?.user && data?.config) {
      updateUser(data.user);
      updateCurrentPathwayId(data.user.defaultPathway?.id || data.user.pathways[0]?.id || '1');
      updateConfig(data.config);
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
            <div className="d-inline-block mb-4">
              <img alt="Logo" src={ sdImage } height="50px" className="me-4 d-inline align-middle" />
              <h1 className="d-inline align-middle p-0 m-0 pb-2">Spiritum Duo</h1>
            </div>
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
