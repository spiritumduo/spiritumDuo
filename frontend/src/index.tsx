import 'bootstrap/dist/css/bootstrap.min.css';
import 'nhsuk-frontend/dist/nhsuk.css';

// Bootstrap imports first so other modules can override
import React from 'react';

// LIBRARIES
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

// APP
import App from 'app/App';
import reportWebVitals from 'reportWebVitals';
import SdApolloProvider from 'app/SdApolloProvider';
import { AuthProvider, PathwayProvider } from 'app/context';
import store from 'app/store';

// LOCAL IMPORT
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import './index.css';

const container = document.getElementById('root');

render(
  <React.StrictMode>
    <Provider store={ store }>
      <AuthProvider>
        <PathwayProvider>
          <SdApolloProvider>
            <BrowserRouter basename={ process.env.PUBLIC_URL }>
              <App />
            </BrowserRouter>
          </SdApolloProvider>
        </PathwayProvider>
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
  container,
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
