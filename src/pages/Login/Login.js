import React from 'react';
import App from '../../App';
import Amplify from '@aws-amplify/core';
import config from "../../aws-exports"
import { Authenticator } from '@aws-amplify/ui-react';
Amplify.configure(config)

export const Login = () => {
  return (
    <Authenticator>
      {() => (
        <App />)}
    </Authenticator>
  );
}
