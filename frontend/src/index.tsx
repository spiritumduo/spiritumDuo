import React from 'react';
import ReactDOM from 'react-dom';
import { onError } from '@apollo/client/link/error';
import { ApolloClient, ApolloProvider, HttpLink, from } from '@apollo/client';
import { cache } from 'app/cache';
import App from 'app/App';
import reportWebVitals from 'reportWebVitals';
import scalarLink from 'app/scalars';
import { AuthProvider, PathwayProvider } from 'app/context';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const link = new HttpLink({
  uri: `${window.location.protocol}//${window.location.host}/api/graphql`,
  credentials: 'include',
});

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`);
    });
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const client = new ApolloClient({
  link: from([scalarLink, errorLink, link]),
  cache: cache,
  connectToDevTools: true,
});

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
