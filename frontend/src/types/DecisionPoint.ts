import Patient from './Patient';
import User from './Users';

export enum DecisionPointType {
    TRIAGE = 'TRIAGE',
    CLINIC = 'CLINIC',
    MDT = 'MDT',
    AD_HOC = 'AD_HOC',
    FOLLOW_UP = 'FOLLOW_UP',
    POST_REQUEST = 'POST_REQUEST'
}

interface DecisionPoint {
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

export default DecisionPoint;
