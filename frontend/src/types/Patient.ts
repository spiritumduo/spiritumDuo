interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber?: string;
  communicationMethod?: string;
  dob?: Date;
}

export default Patient;
