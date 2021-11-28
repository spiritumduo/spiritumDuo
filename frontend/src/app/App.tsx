/* eslint-disable react/jsx-props-no-spreading */
import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap imports first so other modules can override
import React from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
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
    <Switch>
      <Route path="/login">
        <LoginPage />
      </Route>
      <Route path="/logout">
        <Logout />
      </Route>
      <Route path="/patient/add">
        <LoggedInRoute>
          <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
            <NewPatientPage />
          </PageLayout>
        </LoggedInRoute>
      </Route>
      <Route path="/">
        <LoggedInRoute>
          <PageLayout headerProps={ headerProps } footerProps={ footerProps }>
            <HomePage patientsPerPage={ 20 } />
          </PageLayout>
        </LoggedInRoute>
      </Route>
    </Switch>
  </BrowserRouter>
);

const Logout = () => {
  loggedInUserVar(undefined);
  pathwayOptionsVar(undefined);
  return (<Redirect to="/" />);
};

const LoggedInRoute = ({ children, ...props }: React.ComponentPropsWithRef<any>): JSX.Element => {
  const user = loggedInUserVar();
  console.log(user);
  const pathwayOptions = pathwayOptionsVar();
  const loggedIn = user && pathwayOptions;
  return (
    <Route
      // eslint-disable-next-line react/jsx-props-no-spreading
      { ...props }
      render={ ({ location }) => (
        loggedIn
          ? children
          : (
            <Redirect to={ {
              pathname: '/login',
              state: { from: location },
            } }
            />
          )
      ) }
    />
  );
};

export default App;
