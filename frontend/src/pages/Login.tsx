import React from 'react';
import { Redirect } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useLoginSubmit, LoginFormInputs, loginSuccess } from 'app/hooks/LoginHooks';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginPageProps { }

const LoginPage = (): JSX.Element => {
  // const { status, setLoginStatus } = useLoginStatus();
  let invalidLogin = false;
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

  if (data) {
    loginSuccess(data);
    return (<Redirect to="/" />);
  // eslint-disable-next-line no-else-return
  } else if (error) {
    invalidLogin = true;
  }

  return (
    <div>
      <section>
        <div className="container py-5 h-100">
          <div className="row d-flex justify-content-center align-items-center h-100">
            <div className="card shadow-2-strong col-12 col-sm-12 col-md-10 col-lg-7 col-xl-5 mb-5">
              <form onSubmit={ handleSubmit( () => {
                doLogin(getValues());
              } ) }
              >
                <div className="form-group mb-2">
                  <h5>Please enter credentials below to access Spiritum Duo</h5>
                </div>

                <div className="form-group row mb-2">
                  <label className="col-sm-9 col-form-label" htmlFor="username">Username
                    <div className="col-sm-9">
                      <input type="text" placeholder="Username" className="form-control" { ...register('username', { required: true }) } />
                      <p>{ errors.username?.message }</p>
                    </div>
                  </label>
                </div>

                <div className="form-group row mb-4">
                  <label className="col-sm-9 col-form-label" htmlFor="password">Password
                    <div className="col-sm-9">
                      <input type="password" placeholder="Password" className="form-control" { ...register('password', { required: true }) } />
                      <p>{ errors.password?.message }</p>
                    </div>
                  </label>
                </div>
                {
                  invalidLogin
                    ? 'Invalid Username or Password'
                    : ''
                }
                {
                  loading
                    ? 'Loading'
                    : ''
                }
                {
                  error
                    ? 'Error'
                    : ''
                }
                <button type="submit" className="btn btn-outline-secondary float-end ms-1">Login</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
