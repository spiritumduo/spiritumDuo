import Patient from "./Patient";

export default interface TestResult {
    id: number;
    patient: Patient;
    addedAt: Date;
    description: string;
    mediaUrls: string[];
}