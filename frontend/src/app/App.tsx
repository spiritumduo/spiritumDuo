/* eslint-disable max-len */
/* eslint-disable react/jsx-props-no-spreading */
// APP IMPORTS
import React, { useContext, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { loggedInUserVar } from 'app/cache';
import { AuthContext, PathwayContext } from 'app/context';

// PAGES
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/Login';
import PageLayout from 'components/PageLayout';
import AdministrationPage from 'pages/Administration';
import { Button, Container, ErrorSummary } from 'nhsuk-react-components';

import './App.css';

const LoggedInRoutes = () => (
  <PageLayout>
    <RequirePathways>
      <Routes>
        <Route
          path="/patient/:hospitalNumber"
          element={ (
            <HomePage patientsPerPage={ 20 } modalPatient />
          ) }
        />
        <Route
          path="/"
          element={ (
            <HomePage patientsPerPage={ 20 } />
          ) }
        />
        <Route
          path="/patients/all"
          element={ <HomePage patientsPerPage={ 20 } allPatients /> }
        />
        <Route
          path="/admin"
          element={ (
            <RequireAdmin>
              <AdministrationPage />
            </RequireAdmin>
          ) }
        />
      </Routes>
    </RequirePathways>
  </PageLayout>
);

const App = (): JSX.Element => (
  <Routes>
    <Route path="/login" element={ <LoginPage /> } />
    <Route path="/logout" element={ <Logout /> } />
    <Route
      path="/*"
      element={ (
        <RequireAuth>
          <LoggedInRoutes />
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
  return (<Navigate to="/login" />);
};

const RequireAuth = ({ children, location }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const { user } = useContext(AuthContext);
  // if no session cookie or for some reason we lost the user
  if (!user) return <Navigate to="/login" state={ { from: location } } />;
  return children;
};

const RequirePathways = ({ children, location }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { currentPathwayId } = useContext(PathwayContext);
  const isAdmin = user?.roles.find((r) => r.name === 'admin');
  if (!user?.pathways?.[0] || !currentPathwayId) {
    return (
      <Container>
        <ErrorSummary aria-labelledby="error-summary-title" role="alert" tabIndex={ -1 }>
          <ErrorSummary.Title>A configuration error has occured</ErrorSummary.Title>
          <ErrorSummary.Body>
            <ErrorSummary.List>
              <ErrorSummary.Item>The current logged in user does not have access to any pathways.</ErrorSummary.Item>
              <ErrorSummary.Item>Please contact a system administrator.</ErrorSummary.Item>
            </ErrorSummary.List>
            <div className="mt-4">
              {
                isAdmin
                  ? (
                    <Button
                      onClick={ () => {
                        navigate(
                          '/admin',
                          { state: { from: location } },
                        );
                      } }
                      className="mb-0 me-2"
                    >
                      Administration panel
                    </Button>
                  )
                  : ''
              }
              <Button
                onClick={ () => {
                  navigate(
                    '/logout',
                    { state: { from: location } },
                  );
                } }
                className="mb-0"
              >
                Logout
              </Button>
            </div>
          </ErrorSummary.Body>
        </ErrorSummary>
      </Container>
    );
  }
  return children;
};

const RequireAdmin = ({ children, location }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!user?.roles.find((r) => r.name === 'admin')) navigate('/', { state: { from: location } });
  return children;
};

export default App;
