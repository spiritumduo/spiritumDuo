import React from 'react';
import './logoutlink.css';
import { Link } from 'react-router-dom';

interface LogoutLinkProps {
  /**
   * Patient ID
   */
  name: string;
}

/**
 * Link to individual Patient
 */
const LogoutLink = ({ name }: LogoutLinkProps) => (
  <div className="position-absolute bottom-0 end-0 m-2">Logged in: { name }, <Link to="/logout">Logout</Link></div>
);

export default LogoutLink;
