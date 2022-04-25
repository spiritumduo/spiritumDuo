/* eslint-disable react/jsx-props-no-spreading */
// APP IMPORTS
import React, { useContext, useEffect } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import { pathwayOptionsVar, loggedInUserVar } from 'app/cache';
import { AuthContext, PathwayContext } from 'app/context';

// PAGES
import HomePage from 'pages/HomePage';
import LoginPage from 'pages/Login';
import PageLayout from 'components/PageLayout';
import './App.css';
import AdministrationPage from 'pages/Administration';

const App = (): JSX.Element => (
  <Routes>
    <Route path="/login" element={ <LoginPage /> } />
    <Route path="/logout" element={ <Logout /> } />
    <Route
      path="/patient/:hospitalNumber"
      element={ (
        <RequireAuth>
          <PageLayout>
            <HomePage patientsPerPage={ 20 } modalPatient />
          </PageLayout>
        </RequireAuth>
      ) }
    />
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
            <RequireAdmin>
              <AdministrationPage />
            </RequireAdmin>
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

const RequireAdmin = ({ children, location }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  if (!user?.roles.find((r) => r.name === 'admin')) navigate('/', { state: { from: location } });
  return children;
};

export default App;
