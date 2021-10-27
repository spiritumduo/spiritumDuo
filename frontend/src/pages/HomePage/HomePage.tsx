import React from 'react';
import './homepage.css';
import Patient from 'types/Patient';
import PatientList, { PatientListDataFn } from 'components/PatientList';
import PageLayout, { PageLayoutProps } from 'components/PageLayout';

export interface HomePageProps {
  pageLayoutProps: PageLayoutProps;
  triagePatients: Patient[];
  triageData: PatientListDataFn;
  clinicPatients: Patient[];
  clinicData: PatientListDataFn;
  patientsPerPage: number;
}

const HomePage = ({
  pageLayoutProps, triageData, patientsPerPage,
  triagePatients, clinicData, clinicPatients,
}: HomePageProps) => {
  const page = (
    <div className="container text-center">
      <div className="row mt-1">
        <div className="col">
          <h4>Patients Needing Triage</h4>
          <PatientList
            updateData={ triageData }
            pageLimit={ patientsPerPage }
            totalCount={ triagePatients.length }
          />
        </div>
        <div className="col">
          <h4>Clinic Patients</h4>
          <PatientList
            updateData={ clinicData }
            pageLimit={ patientsPerPage }
            totalCount={ clinicPatients.length }
          />
        </div>
      </div>
    </div>
  );

  return PageLayout({
    headerProps: pageLayoutProps.headerProps,
    footerProps: pageLayoutProps.footerProps,
    element: page,
  });
};

export default HomePage;
