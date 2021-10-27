import React from 'react';
import './patientlink.css';
import { Link } from 'react-router-dom';
import Patient from '../../types/Patient';

interface PatientLinkProps {
  /**
   * Patient object
   */
  patient: Patient;
}

/**
 * Link to individual Patient
 */
const PatientLink = ({ patient }: PatientLinkProps) => (
  <Link className="patient-link" to={ `/patient/${patient.patientHospitalNumber}` }>{patient.patientHospitalNumber}, {patient.firstName} {patient.lastName}</Link>
);

export default PatientLink;
