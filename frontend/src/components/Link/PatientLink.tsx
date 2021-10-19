import React from 'react';
import './patientlink.css';
import { Link } from "react-router-dom";

interface PatientLinkProps {
  /**
   * Patient ID
   */
  patientId: string;
  /**
   * Patient name
   */
  name: string;
}

/**
 * Link to individual Patient 
 */
const PatientLink = ({ patientId, name }: PatientLinkProps) => {
  return (
    <Link className="patient-link" to={ `/patient/${patientId}` }>{ patientId }, { name }</Link>
  );
};

export default PatientLink;