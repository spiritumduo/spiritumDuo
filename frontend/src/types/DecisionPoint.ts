import Patient from "./Patient";
import User from "./Users";

export enum DecisionPointType {
    TRIAGE = 'triage',
    CLINIC = 'clinic',
    MDT = 'MDT',
    AD_HOC = 'ad hoc',
    FOLLOW_UP = 'follow up'
}

export default interface DecisionPoint {
    id: number;
    patient: Patient;
    addedAt: Date;
    updatedAt?: Date;
    clinician: User;
    decisionType: DecisionPointType;
    clinicHistory: string;
    comorbidities: string;
    requestsReferrals: string;
}