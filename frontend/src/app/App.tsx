/* eslint-disable react/jsx-props-no-spreading */
// APP IMPORTS
import React, { useContext, useEffect } from 'react';
import { Route, Routes, Navigate, useParams } from 'react-router-dom';
import { pathwayOptionsVar, loggedInUserVar } from 'app/cache';
import { AuthContext, PathwayContext } from 'app/context';
import { DecisionPointType } from 'types/DecisionPoint';

// PAGES
import DecisionPointPage from 'pages/DecisionPoint';
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/Login';
import NewPatientPage from 'pages/NewPatient';
import PageLayout from 'components/PageLayout';
import PathwayDemo from 'pages/PathwayDemo';
import PreviousDecisionPoints from 'pages/PreviousDecisionPoints';
import './App.css';
import AllPatients from 'pages/AllPatients';
import AdministrationPage from 'pages/Administration';

const PreviousDecisionPointsPageRoute = () => {
  const { hospitalNumber } = useParams();
  return (
    <RequireAuth>
      <PageLayout>
        <PreviousDecisionPoints hospitalNumber={ hospitalNumber as string } />
      </PageLayout>
    </RequireAuth>
  );
};

const PatientPathwayPageRoute = () => {
  const { hospitalNumber } = useParams();
  return (
    <RequireAuth>
      <PageLayout>
        <PathwayDemo hospitalNumber={ hospitalNumber as string } />
      </PageLayout>
    </RequireAuth>
  );
};

const PatientRoutes = () => (
  <Routes>
    <Route
      path="add"
      element={ (
        <RequireAuth>
          <PageLayout>
            <NewPatientPage />
          </PageLayout>
        </RequireAuth>
      ) }
    />
    <Route
      path=":hospitalNumber"
      element={ (<PreviousDecisionPointsPageRoute />) }
    />
    <Route
      path=":hospitalNumber/pathway"
      element={ (<PatientPathwayPageRoute />) }
    />
  </Routes>
);

const DecisionPointPageRoute = () => {
  const { decisionType, hospitalNumber } = useParams();
  try {
    const decisionTypeEnum = Object.values(DecisionPointType).find(
      (x) => x === decisionType?.toUpperCase(),
    );
    if (decisionTypeEnum === undefined) throw new Error('Invalid Decision Type!');
    return (
      <>
        <RequireAuth>
          <PageLayout />
        </RequireAuth>
      </>
    );
  } catch (err) {
    return (
      <PageLayout>
        <h1>Error: Invalid decision type!</h1>
      </PageLayout>
    );
  }
};

const DecisionRoutes = () => (
  <Routes>
    <Route path=":decisionType/:hospitalNumber" element={ <DecisionPointPageRoute /> } />
  </Routes>
);

const PathwayDemoRoute = () => {
  const { hospitalNumber } = useParams();

  return (
    <RequireAuth>
      <PageLayout>
        <PathwayDemo hospitalNumber={ hospitalNumber || '' } />
      </PageLayout>
    </RequireAuth>
  );
};

const App = (): JSX.Element => (
  <Routes>
    <Route path="/login" element={ <LoginPage /> } />
    <Route path="/logout" element={ <Logout /> } />
    <Route
      path="/patients"
      element={ (
        <RequireAuth>
          <PageLayout>
            <AllPatients patientsPerPage={ 20 } />
          </PageLayout>
        </RequireAuth>
      ) }
    />
    <Route path="/patient/*" element={ <PatientRoutes /> } />
    <Route path="/decision/*" element={ <DecisionRoutes /> } />
    <Route path="/pathwaydemo/:hospitalNumber" element={ <PathwayDemoRoute /> } />
    <Route
      path="/"
      element={ (
        <RequireAuth>
          <PageLayout>
            <HomePage patientsPerPage={ 20 } />
          </PageLayout>
        </RequireAuth>
      ) }
    />
    <Route
      path="/admin"
      element={ (
        <RequireAuth>
          <PageLayout>
            <AdministrationPage />
          </PageLayout>
        </RequireAuth>
      ) }
    />
  </Routes>
);

const Logout = (): JSX.Element => {
  const { updateUser } = useContext(AuthContext);
  useEffect(() => {
    updateUser(undefined);
  });
  loggedInUserVar(null);
  localStorage.clear();
  pathwayOptionsVar([]);
  return (<Navigate to="/login" />);
};

const RequireAuth = ({ children, location }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const { user } = useContext(AuthContext);
  const { pathwayOptions, currentPathwayId } = useContext(PathwayContext);
  // if no session cookie or for some reason we lost the user
  if (!user) return <Navigate to="/login" state={ { from: location } } />;
  if ((!pathwayOptions) || (!currentPathwayId)) {
    return <h1>No pathways. Application not configured!</h1>;
  }
  return children;
};

export default App;
