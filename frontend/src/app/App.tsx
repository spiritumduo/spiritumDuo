/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-props-no-spreading */
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap imports first so other modules can override
import React, { useContext, useState } from 'react';
import { BrowserRouter, Route, Routes, Navigate, useParams } from 'react-router-dom';
import { pathwayOptionsVar, loggedInUserVar, currentPathwayIdVar } from 'app/cache';
import LoginPage from 'pages/Login';
import HomePage from 'pages/HomePage';
import { FooterProps } from 'components/Footer';
import { HeaderProps } from 'components/Header';
import PageLayout from 'components/PageLayout';
import PathwayOption from 'types/PathwayOption';
import NewPatientPage from 'pages/NewPatient';
import DecisionPointPage from 'pages/DecisionPoint';
import PreviousDecisionPoints from 'pages/PreviousDecisionPoints';
import { DecisionPointType } from 'types/DecisionPoint';
import { AuthContext, AuthProvider, PathwayContext, PathwayProvider } from 'app/context';
import './App.css';
import User from 'types/Users';

const headerProps: HeaderProps = {
  pathwayOptions: pathwayOptionsVar() as PathwayOption[],
  currentPathwayId: currentPathwayIdVar(),
  pathwayOnItemSelect: () => console.log('pathway select'),
  searchOnSubmit: () => console.log('search submit'),
};

const footerProps: FooterProps = { name: `${loggedInUserVar()?.firstName} ${loggedInUserVar()?.lastName}` };

const PreviousDecisionPointsPageRoute = () => {
  const { hospitalNumber } = useParams();
  return (
    <RequireAuth>
      <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
        <PreviousDecisionPoints hospitalNumber={ hospitalNumber as string } />
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
          <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
            <NewPatientPage />
          </PageLayout>
        </RequireAuth>
      ) }
    />
    <Route
      path=":hospitalNumber/decisions"
      element={ (<PreviousDecisionPointsPageRoute />) }
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
          <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
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
      <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
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

const App = (): JSX.Element => {
  const [user, updateUser] = useState<User | undefined>();
  if (!user) {
    const localStorageUser = loggedInUserVar(); // user has refreshed browser?
    // this will trigger a single re-render
    if (localStorageUser) updateUser(localStorageUser);
  }
  const [pathwayOptions, updatePathwayOptions] = useState<PathwayOption[]>([]);
  if (pathwayOptions === []) {
    const localStoragePathwayOptions = pathwayOptionsVar();
    if (localStoragePathwayOptions !== []) updatePathwayOptions(localStoragePathwayOptions);
  }
  const [currentPathwayId, updateCurrentPathwayId] = useState<number | undefined>();
  if (!currentPathwayId) {
    const localStorageCurrentPathwayId = currentPathwayIdVar();
    if (localStorageCurrentPathwayId) updateCurrentPathwayId(localStorageCurrentPathwayId);
  }

  return (
    <AuthProvider value={ { user: user, updateUser: updateUser } }>
      <PathwayProvider
        value={ { pathwayOptions, updatePathwayOptions, currentPathwayId, updateCurrentPathwayId } }
      >
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/logout" element={ <Logout /> } />
            <Route path="/patient/*" element={ <PatientRoutes /> } />
            <Route path="/decision/*" element={ <DecisionRoutes /> } />
            <Route
              path="/"
              element={ (
                <RequireAuth>
                  <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
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
};

const Logout = (): JSX.Element => {
  const { updateUser } = useContext(AuthContext);
  updateUser(undefined);
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
