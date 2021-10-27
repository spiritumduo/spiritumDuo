import React from 'react';
import ReactDOM from 'react-dom';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import './index.css';
import App from 'app/App';
import reportWebVitals from 'reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

const client = new ApolloClient({
  uri: 'https://4cc1760e-f6a2-4dec-a24e-3193f4cf639b.mock.pstmn.io',
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={ client }>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </React.StrictMode>,
  // eslint-disable-next-line no-undef
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
