/* eslint-disable react/jsx-props-no-spreading */
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap imports first so other modules can override
import React from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Navigate, useParams } from 'react-router-dom';
import { pathwayOptionsVar, loggedInUserVar, currentPathwayId } from 'app/cache';
import LoginPage from 'pages/Login';
import HomePage from 'pages/HomePage';
import { FooterProps } from 'components/Footer';
import { HeaderProps } from 'components/Header';
import PageLayout from 'components/PageLayout';
import PathwayOption from 'types/PathwayOption';
import NewPatientPage from 'pages/NewPatient';
import DecisionPointPage, { DecisionPointPageProps } from 'pages/DecisionPoint';
import PreviousDecisionPoints, { PreviousDecisionPointsProps } from 'pages/PreviousDecisionPoints';
import './App.css';
import { DecisionPointType } from 'types/DecisionPoint';

const headerProps: HeaderProps = {
  pathwayOptions: pathwayOptionsVar() as PathwayOption[],
  currentPathwayId: currentPathwayId(),
  pathwayOnItemSelect: () => console.log('pathway select'),
  searchOnSubmit: () => console.log('search submit'),
};

const footerProps: FooterProps = { name: `${loggedInUserVar()?.firstName} ${loggedInUserVar()?.lastName}` };

const PreviousDecisionPointsPageRoute = () => {
  const { hospitalNumber } = useParams();
  return (
    <>
      <RequireAuth>
        <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
          <PreviousDecisionPoints hospitalNumber={ hospitalNumber as string } />
        </PageLayout>
      </RequireAuth>
    </>
  );
};

const PatientRoutes = () => (
  <Routes>
    <Route path="add">
      <RequireAuth>
        <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
          <NewPatientPage />
        </PageLayout>
      </RequireAuth>
    </Route>
    <Route path=":hospitalNumber/decisions">
      <PreviousDecisionPointsPageRoute />
    </Route>
  </Routes>
);

const DecisionPointPageRoute = () => {
  const { decisionType, hospitalNumber } = useParams();
  try {
    const decisionTypeEnum = decisionType?.toUpperCase() as DecisionPointType;
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
    return <h1>Invalid decision type!</h1>;
  }
};

const DecisionRoutes = () => (
  <Routes>
    <Route path=":decisionType/:hospitalNumber">
      <DecisionPointPageRoute />
    </Route>
  </Routes>
);

const App = (): JSX.Element => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={ <LoginPage /> } />
      <Route path="/logout" element={ <Logout /> } />
      <Route path="/patient/*" element={ <PatientRoutes /> } />
      <Route path="/decision" element={ <DecisionRoutes /> } />
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
);

const Logout = () => {
  loggedInUserVar(undefined);
  pathwayOptionsVar(undefined);
  return (<Navigate to="/" />);
};

const RequireAuth = ({ children, location }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const user = loggedInUserVar();
  const pathwayOptions = pathwayOptionsVar();
  const loggedIn = user && pathwayOptions;
  if (!loggedIn) return <Navigate to="/login" state={ { from: location } } />;
  return children;
};

export default App;
