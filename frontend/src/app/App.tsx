/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-props-no-spreading */
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap imports first so other modules can override
import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { pathwayOptionsVar, loggedInUserVar } from 'app/cache';
import LoginPage from 'pages/Login';
import HomePage from 'pages/HomePage';
import PageLayout from 'components/PageLayout';
import NewPatientPage from 'pages/NewPatient';
import DecisionPointPage from 'pages/DecisionPoint';
import PreviousDecisionPoints from 'pages/PreviousDecisionPoints';
import PathwayDemo from 'pages/PathwayDemo';
import { DecisionPointType } from 'types/DecisionPoint';
import { AuthContext, AuthProvider, PathwayProvider } from 'app/context';
import './App.css';
import { useEffect } from '@storybook/addons';

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
      path=":hospitalNumber/decisions"
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
          <PageLayout>
            <DecisionPointPage
              decisionType={ decisionTypeEnum }
              hospitalNumber={ hospitalNumber as string }
            />
          </PageLayout>
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

const App = (): JSX.Element => (
  <AuthProvider>
    <PathwayProvider>
      <BrowserRouter basename={ process.env.PUBLIC_URL }>
        <Routes>
          <Route path="/login" element={ <LoginPage /> } />
          <Route path="/logout" element={ <Logout /> } />
          <Route path="/patient/*" element={ <PatientRoutes /> } />
          <Route path="/decision/*" element={ <DecisionRoutes /> } />
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
        </Routes>
      </BrowserRouter>
    </PathwayProvider>
  </AuthProvider>
);

const Logout = (): JSX.Element => {
  const { updateUser } = useContext(AuthContext);
  useEffect(() => {
    updateUser(undefined);
  });
  loggedInUserVar(null);
  pathwayOptionsVar([]);
  return (<Navigate to="/login" />);
};

const RequireAuth = ({ children, location }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const { user } = useContext(AuthContext);
  if (!user) return <Navigate to="/login" state={ { from: location } } />;
  return children;
};

export default App;
