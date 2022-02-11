import React from 'react';
import {Navbar, Container, Nav, Form} from 'react-bootstrap';
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
  usersName: string;
}

const Header = ({
  patient, pathwayOptions, currentPathwayId, pathwayOnItemSelect, searchOnSubmit, usersName,
}: HeaderProps): JSX.Element => {
  const currentOption = pathwayOptions.find((p) => p.id === currentPathwayId);
  return (
    <Navbar expand="lg">
      <Container fluid className="w-100">
        <Form>
          <Form.Group>
            <Form.Control disabled type="text" placeholder="Hospital number" />
          </Form.Group>
        </Form>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto">
            <Nav.Link href="/app">Home</Nav.Link>
            <Nav.Link href="/app/patients">All Patients</Nav.Link>
            <Nav.Link href="/app/mdt">MDT</Nav.Link>
            <Nav.Link href="/app/patient/add" disabled>Add Patient</Nav.Link>
            <Nav.Link href="/app/logout">Logout</Nav.Link>
          </Nav>
          <Nav className="">
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
    </Navbar>
  );
};

export default Header;
