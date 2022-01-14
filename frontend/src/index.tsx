import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloProvider } from '@apollo/client';
import App from 'app/App';
import reportWebVitals from 'reportWebVitals';
import client from 'app/sdApolloClient';
import { AuthProvider, PathwayProvider } from 'app/context';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={ client }>
      <AuthProvider>
        <PathwayProvider>
          <BrowserRouter basename={ process.env.PUBLIC_URL }>
            <App />
          </BrowserRouter>
        </PathwayProvider>
      </AuthProvider>
    </ApolloProvider>
  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
