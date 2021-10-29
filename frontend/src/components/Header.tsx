import React from 'react';
import { Link } from 'react-router-dom';
import Patient from '../types/Patient';
import PatientInfoLonghand from './PatientInfoLonghand';

import './header.css';
import PathwaySelector from './PathwaySelector';

export interface HeaderProps {
  patient?: Patient;
  pathwayOptions: string[];
  pathwayOnItemSelect: (name: string) => void;
  searchOnSubmit: (e: React.FormEvent<EventTarget>) => void;
}

const Header = ({ patient, pathwayOptions, pathwayOnItemSelect, searchOnSubmit }: HeaderProps) => (
  <div>
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <form className="d-flex" onSubmit={ searchOnSubmit }>
          <input className="form-control me-2" type="search" name="hospitalNumberSearch" placeholder="Hospital number" aria-label="Hospital number" />
        </form>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link active" to="/Home">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/Triage">Triage</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/Clinic">Clinic</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/MDT">MDT</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/Refer">Refer</Link>
            </li>
          </ul>
        </div>
        <PathwaySelector
          options={ pathwayOptions }
          currentOption={ pathwayOptions[0] }
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

export default Header;
