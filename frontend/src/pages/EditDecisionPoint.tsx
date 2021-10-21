import React from 'react';
import { Link } from "react-router-dom";
import Header from '../components/Header';
import User from '../types/Users';
import Patient from '../types/Patient';
import Footer from '../components/Footer';
import PatientInfoLonghand from '../components/PatientInfoLonghand';

interface EditDecisionPointPageProps {
    user: User;
    patient: Patient;
    pathwayOptions: string[];
    pathwayOnItemSelect: (name: string) => void;
    searchOnSubmit: (e: React.FormEvent<EventTarget>) => void;
}

export const EditDecisionPointPage = (props: EditDecisionPointPageProps) => {
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
                                    <div className="container">

                                        <p className="text-center">
                                            <PatientInfoLonghand patient={props.patient} />
                                        </p>

                                        <div className="form-group mb-2">
                                            <label>Please enter details below to edit a patient's information</label>
                                        </div>

                                        <div className="form-group row mb-2">
                                            <label className="col-sm-3 col-form-label">First name</label>
                                            <div className="col-sm-9">
                                            <input type="text" className="form-control" placeholder="First name" defaultValue={props.patient.firstName} />
                                            </div>
                                        </div>

                                        <div className="form-group row mb-2">
                                            <label className="col-sm-3 col-form-label">Last name</label>
                                            <div className="col-sm-9">
                                            <input type="text" className="form-control" placeholder="Last name" defaultValue={props.patient.lastName} />
                                            </div>
                                        </div>

                                        <div className="form-group row mb-2">
                                            <label className="col-sm-3 col-form-label">Hospital number</label>
                                            <div className="col-sm-9">
                                            <input type="text" className="form-control" placeholder="Hospital number" defaultValue={props.patient.patientId} />
                                            </div>
                                        </div>

                                        <div className="form-group row mb-2">
                                            <label className="col-sm-3 col-form-label">Date of birth</label>
                                            <div className="col-sm-9">
                                            <input type="text" className="form-control" placeholder="Date of birth" defaultValue={props.patient.dob?.toDateString()} />
                                            </div>
                                        </div>
                                    
                                        
                                        <button type="submit" name="loginBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Update patient</button>
                                        <Link to={"/decisionpoint/"+props.patient.patientId} className="btn btn-outline-secondary w-25 float-end">Cancel</Link>
                                    </div>

                                    <div className="container pt-5">
                                        <hr />
                                        <div className="form-outline mb-4">
                                            <label className="form-label">Clinical history</label>
                                            <textarea readOnly={true} className="form-control" rows={3}></textarea>
                                        </div>
                                        <div className="form-outline mb-4">
                                            <label className="form-label">Co-morbidities</label>
                                            <textarea readOnly={true} className="form-control" rows={3}></textarea>
                                        </div>
                                    </div>

                                </form>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            <Footer name="John Doe"/>
        </>
    );
};