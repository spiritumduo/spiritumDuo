import './patient.css'

import Header, { HeaderProps } from '../components/Header';
import Footer from '../components/Footer';
import Patient from '../types/Patient';
import User from '../types/Users';
import { Link } from 'react-router-dom';

export interface PatientPageProps {
    patient: Patient;
    user: User;
    decisions: { date: Date, decision: string }[];
    notes: { date: Date, enteredBy: string, note: string }[];
    messages: { date: Date, enteredBy: string, note: string }[];
    headerProps: HeaderProps
}

const PatientPage = (props: PatientPageProps) => {
    return (
        <div>
            <Header {...props.headerProps}/>
            <div className="container-lg flex">
                <div className="row decision-row">
                    <div className="row">
                        <Link to={`/patient/${props.patient.patientId}/decisions`}>Previous decision points</Link>
                    </div>
                    {
                        props.decisions.map( d => (
                            <div className="row justify-content-start">
                                <div className="col">
                                    <h5>Date</h5>
                                    <p>{d.date.toLocaleDateString()}</p>
                                </div>
                                <div className="col">
                                    <h5>Decision</h5>
                                    <p>{d.decision}</p>
                                </div>
                                <div className="col"></div>
                            </div>
                        ))
                    }
                </div>
                <div className="row notes-row">
                    <div className="row">
                        <Link to={`/patient/${props.patient.patientId}/notes`}>Notes</Link>
                    </div>
                    {
                        props.notes.map( n => (
                            <div className="row">
                                <div className="col">
                                    <h5>Date</h5>
                                    <p>{n.date.toLocaleDateString()}</p>
                                </div>
                                <div className="col">
                                    <h5>Entered By</h5>
                                    <p>{n.enteredBy}</p>
                                </div>
                                <div className="col">
                                    <h5>Note</h5>
                                    <p>{n.note}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="row messages-row">
                    <div className="row">
                        <Link to={`/patient/${props.patient.patientId}/messages`}>Messages</Link>
                    </div>
                    {
                        props.messages.map( m => (
                            <div className="row">
                                <div className="col">
                                    <h5>Date</h5>
                                    <p>{m.date.toLocaleDateString()}</p>
                                </div>
                                <div className="col">
                                    <h5>Entered By</h5>
                                    <p>{m.enteredBy}</p>
                                </div>
                                <div className="col">
                                    <h5>Note</h5>
                                    <p>{m.note}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <Footer name={props.user.name}/>
        </div>
    )
}

export default PatientPage;