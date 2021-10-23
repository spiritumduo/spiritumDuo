import React from "react";
import { Link } from "react-router-dom";

const LoginPage = () => (
    <div className="vh-100">
        <section className="vh-100">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="card shadow-2-strong col-12 col-md-8 col-lg-6 col-xl-5">
                        <form className="card-body p-5" action="/handleLogin" method="POST">
                            <div className="form-group mb-2">
                                <label>Please enter credentials below to access Spiritum Duo</label>
                            </div>

                            <div className="form-group row mb-2">
                                <label className="col-sm-3 col-form-label">Username</label>
                                <div className="col-sm-9">
                                    <input type="text" name="usernameTxt" className="form-control" placeholder="john.doe" />
                                </div>
                            </div>

                            <div className="form-group row mb-4">
                                <label className="col-sm-3 col-form-label">Password</label>
                                <div className="col-sm-9">
                                    <input type="password" name="passwordTxt" className="form-control" placeholder="********" />
                                </div>
                            </div>
                    
                            <button type="submit" name="loginBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Login</button>
                            <Link to="/register" className="btn btn-outline-secondary w-25 float-end">Register</Link>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    </div>
);

export default LoginPage;