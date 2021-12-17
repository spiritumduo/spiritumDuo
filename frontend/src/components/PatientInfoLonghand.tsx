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
const PatientInfoLonghand = ({ patient }: PatientInfoLonghandProps): JSX.Element => (
  <div>
    {/* eslint-disable-next-line max-len */}
    {patient.hospitalNumber}, {patient.firstName} {patient.lastName}, {patient.dateOfBirth?.toLocaleDateString()}
  </div>
);

export default PatientInfoLonghand;
