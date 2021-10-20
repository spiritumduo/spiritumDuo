import React from 'react';
import './homepage.css'
import { Header } from '../components/Header'
import PatientList, { PatientListDataFn, PatientListProps } from '../components/PatientList'
import { LogoutLink } from '../components/Link';
import Patient from '../types/Patient';
import User from '../types/Users'
import Footer from '../components/Footer';

export interface HomePageProps {
  user: User;
  pathwayOptions: string[];
  pathwayOptionsCallback: (name: string) => void;
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
          <div className="container text-center">
            <div className="row mt-1">
              <div className="col">
                <h4>Patients Needing Triage</h4>
                <PatientList 
                  updateData={props.triageData}
                  pageLimit={props.patientsPerPage}
                  totalCount={props.triagePatients.length}
                />
              </div>
              <div className="col">
                <h4>Clinic Patients</h4>
                <PatientList 
                  updateData={props.clinicData}
                  pageLimit={props.patientsPerPage}
                  totalCount={props.clinicPatients.length}
                />
              </div>
            </div>
          </div>
          <Footer name="John Doe"/>
      </div>
  );
};

export default HomePage;