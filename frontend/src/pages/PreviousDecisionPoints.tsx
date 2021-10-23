import React from 'react';
import './previousdecisionpoints.css'
import Header, { HeaderProps } from "../components/Header";
import Footer from "../components/Footer";
import Patient from "../types/Patient";
import User from "../types/Users";
import DecisionPoint from "../types/DecisionPoint";

export interface PreviousDecisionPointsProps {
    user: User;
    headerProps: HeaderProps;
    patient: Patient;
    decisions: DecisionPoint[];
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
                        <div className="previous-decision-points-row" key={d.id}>
                            <p><strong>Decision for {d.decisionType}, {d.addedAt.toLocaleString()}, Dr {d.clinician.firstName}, {d.clinician.lastName}</strong><br />
                            Clinical History: {d.clinicHistory} <br />
                            Comormidities: {d.comorbidities} <br />
                            Requests / referrals made: {d.requestsReferrals}</p>
                        </div>
                    ))
                }
            </div>
            <Footer name={`${props.user.firstName}, ${props.user.lastName}`} />
        </div>
    )
}

export default PreviousDecisionPoints;