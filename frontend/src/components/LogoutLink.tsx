import './patientlink.css';
import { Link } from "react-router-dom";

interface LogoutLinkProps {
  /**
   * Patient ID
   */
  name: string;
}

/**
 * Link to individual Patient 
 */
const LogoutLink = ({ name }: LogoutLinkProps) => {
  return (
    <div className="logout-link">Logged in: { name }. <Link to="/logout">Logout</Link></div>
  );
};

export default LogoutLink;