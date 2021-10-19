import React from 'react';
import './homepage.css'
import { Header } from '../components/Header'
import PatientList, { PatientListDataFn } from '../components/PatientList'
import { LogoutLink } from '../components/Link';
import Patient from '../types/Patient';
import User from '../types/Users'

export interface HomePageProps {
  user: User;
  pathwayOptions: string[];
  pathwayOptionsCallback: () => void;
  triagePatients: Patient[];
  triageData: PatientListDataFn;
  clinicPatients: Patient[];
  clinicData: PatientListDataFn;
  patientsPerPage: number;
  searchCallback: (e: React.FormEvent<EventTarget>) => void;
}

const HomePage = (props: HomePageProps) => {
  console.log(props)
  return (
      <div>
          <Header 
            pathwayOptions={props.pathwayOptions}
            pathwayOnItemSelect={props.pathwayOptionsCallback}
            searchOnSubmit={props.searchCallback}
          />
          <div className="d-flex p-2 justify-content-centre">
            <div>
              <h3>Patients Needing Triage:</h3>
              <PatientList 
                updateData={props.triageData}
                pageLimit={props.patientsPerPage}
                totalCount={props.triagePatients.length}
              />
            </div>
            <div>
              <h3>Clinic Patients:</h3>
              <PatientList 
                updateData={props.clinicData}
                pageLimit={props.patientsPerPage}
                totalCount={props.clinicPatients.length}
              />
            </div>
          </div>
      </div>
  );
};

export default HomePage;