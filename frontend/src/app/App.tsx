/* eslint-disable react/jsx-props-no-spreading */
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap imports first so other modules can override
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import { pathwayOptionsVar, loggedInUserVar, currentPathwayId } from 'app/cache';
import LoginPage from 'pages/Login';
import './App.css';
import HomePage from 'pages/HomePage';
import { FooterProps } from 'components/Footer';
import { HeaderProps } from 'components/Header';
import PageLayout from 'components/PageLayout';
import PathwayOption from 'types/PathwayOption';
import NewPatientPage from 'pages/NewPatient';

const headerProps: HeaderProps = {
  pathwayOptions: pathwayOptionsVar() as PathwayOption[],
  currentPathwayId: currentPathwayId(),
  pathwayOnItemSelect: () => console.log('pathway select'),
  searchOnSubmit: () => console.log('search submit'),
};

const footerProps: FooterProps = { name: `${loggedInUserVar()?.firstName} ${loggedInUserVar()?.lastName}` };

const App = (): JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/logout" element={ <Logout /> } />
      <Route
        path="/"
        element={ (
          <LoggedInRoute>
            <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
              <HomePage patientsPerPage={ 20 } />
            </PageLayout>
          </LoggedInRoute>
        ) }
      />
      <Route
        path="/patient/add"
        element={ (
          <LoggedInRoute>
            <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
              <NewPatientPage />
            </PageLayout>
          </LoggedInRoute>
        ) }
      />
    </Routes>
  </BrowserRouter>
);

const Logout = (): JSX.Element => {
  loggedInUserVar(undefined);
  pathwayOptionsVar(undefined);
  return <Navigate to="/login" replace />;
};

const LoggedInRoute = ({ children }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const user = loggedInUserVar();
  const pathwayOptions = pathwayOptionsVar();
  const loggedIn = user && pathwayOptions;
  return loggedIn
    ? children
    : <Navigate to="/login" replace />;
};

export default App;
