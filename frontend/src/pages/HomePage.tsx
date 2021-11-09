import React from 'react';
import './homepage.css';
import Patient from 'types/Patient';
import PatientList, { PatientListDataFn } from 'components/PatientList';

export interface HomePageProps {
  triageData: PatientListDataFn;
  clinicData: PatientListDataFn;
  patientsPerPage: number;
}

const HomePage = ({
  triageData, patientsPerPage,
  clinicData,
}: HomePageProps): JSX.Element => {
  const x = 1;
  return (
    <div className="container text-center">
      <div className="row mt-1">
        <div className="col">
          <h4>Patients Needing Triage</h4>
          <PatientList
            updateData={ triageData }
            pageLimit={ patientsPerPage }
          />
        </div>
        <div className="col">
          <h4>Clinic Patients</h4>
          <PatientList
            updateData={ clinicData }
            pageLimit={ patientsPerPage }
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
