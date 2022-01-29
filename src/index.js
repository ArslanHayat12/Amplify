import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { Routes } from './routes/';
import { BrowserRouter } from "react-router-dom";
import { SessionContextProvider } from './context/SessionContext';
import Amplify from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

// >>New - Configuring Auth Module
// Auth.configure(awsconfig);
ReactDOM.render(
  <React.StrictMode>
      <BrowserRouter>
            <SessionContextProvider>
                <Routes />
            </SessionContextProvider>
        </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
