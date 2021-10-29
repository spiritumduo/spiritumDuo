import React from 'react';
import LoginPage, { LoginStatus, LoginValues } from 'pages/Login';
import { pathwayOptionsVar, loggedInUserVar } from 'app/cache';
import { FormikHelpers } from 'formik';
import { LoginModel } from 'app/models/LoginModel';

const LoginController = (model: LoginModel, view: typeof LoginPage): JSX.Element => {
  // Login Form Callback
  const submitFn = async (values: LoginValues, { setStatus }: FormikHelpers<LoginValues>) => {
    const loginDetails = await model.doLogin(values.username, values.password);
    if (loginDetails) {
      pathwayOptionsVar(loginDetails.pathwayOptions);
      loggedInUserVar(loginDetails.user);
      setStatus(LoginStatus.SUCCESS);
    } else {
      setStatus(LoginStatus.INVALID_LOGIN);
    }
  };
  return view({ submitFn: submitFn });
};

export default LoginController;
