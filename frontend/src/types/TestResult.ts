import Patient from './Patient';

interface TestResult {
    id: number;
    patient: Patient;
    addedAt: Date;
    description: string;
    mediaUrls: string[];
}

export default TestResult;
