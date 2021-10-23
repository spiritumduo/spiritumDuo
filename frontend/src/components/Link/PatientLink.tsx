import React from 'react';
import './patientlink.css';
import { Link } from "react-router-dom";
import Patient from "../../types/Patient";
interface PatientLinkProps {
  /**
   * Patient object
   */
  patient: Patient;
}

/**
 * Link to individual Patient 
 */
const PatientLink = (props: PatientLinkProps) => {
  return (
    <Link className="patient-link" to={ `/patient/${props.patient.patientHospitalNumber}` }>{ props.patient.patientHospitalNumber }, { props.patient.firstName } {props.patient.lastName}</Link>
  );
};

export default PatientLink;