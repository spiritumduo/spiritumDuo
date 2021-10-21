import React from 'react';
import { Link } from "react-router-dom";
import Header from '../components/Header';
import User from '../types/Users';
import Patient from '../types/Patient';
import Footer from '../components/Footer';
import PatientInfoLonghand from '../components/PatientInfoLonghand';

interface DecisionPointPageProps {
    user: User;
    patient: Patient;
    pathwayOptions: string[];
    pathwayOnItemSelect: (name: string) => void;
    searchOnSubmit: (e: React.FormEvent<EventTarget>) => void;
}

export const DecisionPointPage = (props: DecisionPointPageProps) => {
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
                                            <PatientInfoLonghand patient={props.patient} /> <Link to={"/decisionpoint/"+props.patient.patientId+"/edit"}>Edit patient record</Link>
                                        </p>

                                        <hr />
                                        
                                        <div className="container pt-1">
                                            <div className="form-outline mb-4">
                                                <label className="form-label">Decision</label>
                                                <select className="form-select">
                                                    <option selected>Triage</option>
                                                    <option>Follow-up</option>
                                                </select>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <label className="form-label">Clinical information</label>
                                                <textarea readOnly={true} className="form-control" rows={3}></textarea>
                                            </div>
                                            <div className="form-outline mb-4">
                                                <label className="form-label">Co-morbidities</label>
                                                <textarea readOnly={true} className="form-control" rows={3}></textarea>
                                            </div>

                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            CT-head
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            MRI-head
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            CT-thorax
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            Refer to physiotherapy
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            Chest x-ray
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            Refer to dietician
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            Bronchoscopy
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            Refer to smoking cessation
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            Insert another option here
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" value="" id="defaultCheck1"/>
                                                        <label className="form-check-label pull-right" htmlFor="defaultCheck1">
                                                            Add to MDT
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                        </div>
                                        
                                        <div className="container mt-4">
                                            <button type="submit" name="loginBtn" className="btn btn-outline-secondary w-25 float-end ms-1">Update patient</button>
                                            <Link to={"/decisionpoint/"+props.patient.patientId} className="btn btn-outline-secondary w-25 float-end">Cancel</Link>
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