interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  hospitalNumber: string;
  nationalNumber?: string;
  communicationMethod?: PatientCommunicationMethods;
  dateOfBirth?: Date;
}

export enum PatientCommunicationMethods{
  LETTER = 'Letter',
  EMAIL = 'Email',
  LANDLINE = 'Landline',
  MOBILE = 'Mobile',
}

export default Patient;
