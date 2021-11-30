import React from 'react';
import './patientlink.css';
import { Link } from 'react-router-dom';
import Patient from '../../types/Patient';

interface PatientLinkProps {
  /**
   * Patient object
   */
  patient: Patient;
  /**
   * Location to go to
   */
  to?: string;
}

/**
 * Link to individual Patient
 */
const PatientLink = ({ patient, to = `/patient/${patient.hospitalNumber}` }: PatientLinkProps) => (
  <Link className="patient-link" to={ to }>{patient.hospitalNumber}, {patient.firstName} {patient.lastName}</Link>
);

export default PatientLink;
