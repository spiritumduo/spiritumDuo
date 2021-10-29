import React from 'react';
import { Formik, Form, Field, FormikHelpers } from 'formik';
import { Redirect } from 'react-router-dom';

export enum LoginStatus {
  SUCCESS,
  INVALID_LOGIN,
  INITIAL
}

export interface LoginValues {
  username: string;
  password: string;
}
export interface LoginPageProps {
  submitFn: (
      values: LoginValues,
      { setSubmitting, setStatus }: FormikHelpers<LoginValues>
    ) => void;
}

const LoginPage = ({ submitFn }: LoginPageProps): JSX.Element => (
  <div className="vh-100">
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="card shadow-2-strong col-12 col-sm-12 col-md-10 col-lg-7 col-xl-5 mb-5">
            <Formik
              initialValues={ {
                username: '',
                password: '',
              } }
              onSubmit={ submitFn }
              initialStatus={ LoginStatus.INITIAL }
            >
              { (formik) => (
                <Form className="card-body p-xl-5 p-lg-5 p-md-5 py-5">
                  {
                    formik.status === LoginStatus.SUCCESS
                      ? <Redirect to="/" />
                      : ''
                  }
                  <div className="form-group mb-2">
                    <h5>Please enter credentials below to access Spiritum Duo</h5>
                  </div>

                  <div className="form-group row mb-2">
                    <label className="col-sm-3 col-form-label" htmlFor="username">Username
                      <div className="col-sm-9">
                        <Field required name="username" className="form-control" id="username" placeholder="Username" />
                      </div>
                    </label>
                  </div>

                  <div className="form-group row mb-4">
                    <label className="col-sm-3 col-form-label" htmlFor="password">Password
                      <div className="col-sm-9">
                        <Field required type="password" name="password" className="form-control" id="password" placeholder="Password" />
                      </div>
                    </label>
                  </div>
                  {
                    formik.status === LoginStatus.INVALID_LOGIN
                      ? 'Invalid Username or Password'
                      : ''
                  }
                  <button type="submit" className="btn btn-outline-secondary float-end ms-1">Login</button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default LoginPage;
