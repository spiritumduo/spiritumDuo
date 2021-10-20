import './previousdecisionpoints.css'
import Header, { HeaderProps } from "../components/Header";
import Footer from "../components/Footer";
import Patient from "../types/Patient";
import User from "../types/Users";

export interface PreviousDecisionPointsProps {
    headerProps: HeaderProps;
    patient: Patient;
    decisions: {
        type: string;
        date: Date;
        doctor: User;
        history: string;
        comorbidities: string;
        requests: string;
    }[];
}

const PreviousDecisionPoints = (props: PreviousDecisionPointsProps) => {
    return (
        <div>
            <Header {...props.headerProps} patient={props.patient}/>
            <div className="container previous-decision-points-container">
                <div className="row previous-decision-points-header">
                    <h3>Previous Decision Points</h3>
                </div>
                {
                    props.decisions.map( d => (
                        <div className="previous-decision-points-row">
                            <p><strong>Decision for {d.type}, {d.date.toLocaleString()}, Dr {d.doctor.name}</strong><br />
                            Clinical History: {d.history} <br />
                            Comormidities: {d.comorbidities} <br />
                            Requests / referrals made: {d.requests}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default PreviousDecisionPoints;