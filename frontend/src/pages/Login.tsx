import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = (): JSX.Element => (
  <div className="vh-100">
    <section className="vh-100">
      <div className="container py-5 h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="card shadow-2-strong col-12 col-sm-12 col-md-10 col-lg-7 col-xl-5 mb-5">
            <form className="card-body p-xl-5 p-lg-5 p-md-5 py-5" action="/handleLogin" method="POST">
              <div className="form-group mb-2">
                <h5>Please enter credentials below to access Spiritum Duo</h5>
              </div>

              <div className="form-group row mb-2">
                <label className="col-sm-3 col-form-label" htmlFor="username">Username
                  <div className="col-sm-9">
                    <input type="text" name="username" id="username" className="form-control" placeholder="john.doe" />
                  </div>
                </label>
              </div>

              <div className="form-group row mb-4">
                <label className="col-sm-3 col-form-label" htmlFor="password">Password
                  <div className="col-sm-9">
                    <input type="password" name="password" id="password" className="form-control" placeholder="********" />
                  </div>
                </label>
              </div>

              <button type="submit" name="loginBtn" className="btn btn-outline-secondary float-end ms-1">Login</button>
              <Link to="/register" className="btn btn-outline-secondary float-end">Register</Link>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
);

export default LoginPage;
