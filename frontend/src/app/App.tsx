import 'bootstrap/dist/css/bootstrap.min.css';
// Bootstrap imports first so other modules can override
import React from 'react';
import logo from './logo.svg';
import './App.css';

const App = () => (
  <div className="App">
    <header className="App-header">
      <img src={ logo } className="App-logo" alt="logo" />
      <p>
        {/* eslint-disable-next-line react/jsx-one-expression-per-line */}
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        className="App-link"
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
);

export default App;
