import React from 'react';
import { Link } from 'react-router-dom';
import Patient from 'types/Patient';
import PathwayOption from 'types/PathwayOption';
import PatientInfoLonghand from './PatientInfoLonghand';
import './header.css';
import PathwaySelector from './PathwaySelector';

export interface HeaderProps {
  patient?: Patient;
  pathwayOptions: PathwayOption[];
  currentPathwayId: number;
  pathwayOnItemSelect: (name: string) => void;
  searchOnSubmit: (e: React.FormEvent<EventTarget>) => void;
}

const Header = ({
  patient, pathwayOptions, currentPathwayId, pathwayOnItemSelect, searchOnSubmit,
}: HeaderProps): JSX.Element => {
  const currentOption = pathwayOptions.find((p) => p.id === currentPathwayId);
  return (
    <div>
      <nav className="navbar navbar-expand-md navbar-light bg-light">
        <div className="container-fluid">
          <form className="d-flex" onSubmit={ searchOnSubmit }>
            <input disabled className="form-control me-2" type="search" name="hospitalNumberSearch" placeholder="Hospital number" aria-label="Hospital number" />
          </form>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link className="nav-link active" to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/mdt">MDT</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" to="/patient/add">Add Patient</Link>
              </li>
            </ul>
          </div>
          <PathwaySelector
            options={ pathwayOptions }
            currentOption={ currentOption as PathwayOption }
            onItemSelect={ pathwayOnItemSelect }
          />
        </div>
      </nav>
      <div className="container col-6">
        <div className="row text-center">
          { patient
            ? (
              <PatientInfoLonghand
                patient={ patient }
              />
            )
            : ''}
        </div>
      </div>
    </div>
  );
};

export default Header;
