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
 * Primary UI component for user interaction
 */
const PatientLink = ({ patientId, name }: PatientLinkProps) => {
  return (
    <Link to={ `/patient/${patientId}` }>{ patientId }, { name }</Link>
  );
};

export default PatientLink;