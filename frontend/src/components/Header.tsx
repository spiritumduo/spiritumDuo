import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';

import Patient from '../types/Patient';
import PathwayOption from '../types/PathwayOption';
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
    <Navbar expand="lg">
      <Container fluid>
        <Navbar.Brand>Spiritum Duo</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link href="/app">Home</Nav.Link>
            <Nav.Link href="/app/patients">All Patients</Nav.Link>
            <Nav.Link href="/app/mdt">MDT</Nav.Link>
            <Nav.Link href="/app/patient/add" disabled>Add Patient</Nav.Link>
            <Nav.Item>
              <PathwaySelector
                options={ pathwayOptions }
                currentOption={ currentOption as PathwayOption }
                onItemSelect={ pathwayOnItemSelect }
              />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
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
    </Navbar>
  );
  // return (
  //   <div>
  //     <nav className="navbar navbar-expand-md navbar-light bg-light">
  //       <div className="container-fluid">
  //         <form className="d-none d-md-flex" onSubmit={ searchOnSubmit }>
  //           <input disabled className="form-control me-2" type="search"
  // name="hospitalNumberSearch" placeholder="Hospital number" aria-label="Hospital number" />
  //         </form>

  //         <button className="navbar-toggler" type="button" data-toggle="collapse" d
  // ata-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
  // aria-expanded="false" aria-label="Toggle navigation">
  //           <span className="navbar-toggler-icon" />
  //         </button>

  //         <div className="collapse navbar-collapse" id="navbarSupportedContent">
  //           <ul className="navbar-nav">
  //             <li className="nav-item">
  //               <Link className="nav-link active" to="/">Home</Link>
  //             </li>
  //             <li className="nav-item">
  //               <Link className="nav-link active" to="/mdt">MDT</Link>
  //             </li>
  //             <li className="nav-item">
  //               <Link className="nav-link active" to="/patients">All Patients</Link>
  //             </li>
  //             <li className="nav-item">
  //               <Link className="nav-link active" to="/patient/add">Add Patient</Link>
  //             </li>
  //           </ul>
  //         </div>
  //         <PathwaySelector
  //           options={ pathwayOptions }
  //           currentOption={ currentOption as PathwayOption }
  //           onItemSelect={ pathwayOnItemSelect }
  //         />
  //       </div>
  //     </nav>
  //     <div className="container col-6">
  //       <div className="row text-center">
  //         { patient
  //           ? (
  //             <PatientInfoLonghand
  //               patient={ patient }
  //             />
  //           )
  //           : ''}
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default Header;
