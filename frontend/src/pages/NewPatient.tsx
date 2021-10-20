import React from 'react';
import { Link } from "react-router-dom";
import { Header } from '../components/Header';
import { LogoutLink } from '../components/Link';
import User from '../types/Users';

interface NewPatientPageProps {
    user: User;
    pathwayOptions: string[];
    pathwayOnItemSelect: (name: string) => void;
    searchOnSubmit: (e: React.FormEvent<EventTarget>) => void;
}

export const NewPatientPage = (props: NewPatientPageProps) => {
    return(
        <>
            <Header
                pathwayOptions={props.pathwayOptions}
                pathwayOnItemSelect={props.pathwayOnItemSelect}
                searchOnSubmit={props.searchOnSubmit}
            />
            <div className="vh-100">
                <section className="vh-100">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="card shadow-2-strong col-12 col-md-10 col-lg-9 col-xl-7">
                                <form className="card-body p-5" action="/addPatient" method="POST">
                                    <div className="form-group mb-2">
                                        <label>Please enter details below to add a new patient</label>
                                    </div>

                                    <div className="form-group row mb-2">
                                        <label className="col-sm-3 col-form-label">First name</label>
                                        <div className="col-sm-9">
                                        <input type="text" className="form-control" placeholder="John" />
                                        </div>
                                    </div>

                                    <div className="form-group row mb-2">
                                        <label className="col-sm-3 col-form-label">Last name</label>
                                        <div className="col-sm-9">
                                        <input type="text" className="form-control" placeholder="Doe" />
                                        </div>
                                    </div>

                                    <div className="form-group row mb-2">
                                        <label className="col-sm-3 col-form-label">Hospital number</label>
                                        <div className="col-sm-9">
                                        <input type="text" className="form-control" placeholder="MRN1234567" />
                                        </div>
                                    </div>

                                    <div className="form-group row mb-2">
                                        <label className="col-sm-3 col-form-label">Date of birth</label>
                                        <div className="col-sm-9">
                                        <input type="text" className="form-control" placeholder="01/01/1970" />
                                        </div>
                                    </div>
                                   
                                    
                                    <button type="submit" name="loginBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Register patient</button>
                                    <Link to="/home" className="btn btn-outline-secondary w-25 float-end">Cancel</Link>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <LogoutLink name="John Doe"/>
        </>
    );
};