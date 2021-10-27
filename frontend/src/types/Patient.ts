interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  patientHospitalNumber: string;
  patientNationalNumber?: string;
  communicationMethod?: string;
  dob?: Date;
}

export default Patient;
