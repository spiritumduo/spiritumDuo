import './patientlist.css';
import { Link } from "react-router-dom";
import { PatientLink } from "./Link";
import Patient from "../types/Patient";

interface PatientListProps {
  /**
   * Patient ID
   */
  patients: Array<Patient>;
}

/**
 * Link to individual Patient 
 */
const PatientList = ({ patients }: PatientListProps) => {
  return (
    <ul className="patient-list">
      {
        patients.map( p => ( <li> <PatientLink patientId={p.patientId} name={p.name} /> </li>))
      }
    </ul>
  );
};

export default PatientList;