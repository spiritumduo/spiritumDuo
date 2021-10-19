import React from 'react';
import './homepage.css'
import { Header } from '../components/Header'
import PatientList, { PatientListDataFn } from '../components/PatientList'
import { LogoutLink } from '../components/Link';
import User from '../types/Users'

export interface HomePageProps {
  user: User;
  pathwayOptions: string[];
  pathwayOptionsCallback: () => void;
  triageData: PatientListDataFn;
  clinicData: PatientListDataFn;
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
          <h1>Home Page!</h1>
      </div>
  );
};

export default HomePage;