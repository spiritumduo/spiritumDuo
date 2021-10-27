import React from 'react';
import Patient from '../types/Patient';

interface PatientInfoLonghandProps {
  /**
  * Patient object
  */
  patient: Patient;
}

/**
* Primary UI component for user interaction
*/
const PatientInfoLonghand = ({ patient }: PatientInfoLonghandProps) => (
  <div>
    {/* eslint-disable-next-line max-len */}
    {patient.patientHospitalNumber}, {patient.firstName} {patient.lastName}, {patient.dob?.toLocaleDateString()}
  </div>
);

export default PatientInfoLonghand;
