import React, { useCallback, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify'
import { Authenticator,useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Dashboard } from './pages/Dashboard/Dashboard';
import {UserAuthProvider} from "./context/UserAuthContext";
import Test from './Test';

function App() {
  
  const addUser = useCallback(
    async (parentId) => {
      const data = {
        body: {
          name: "Arslan",
          email: "arsalan.hayat@teamo.io",
          address: "xyz",
          role: "Practioner",
          parentId
        }
      }
      const apiData = await API.put('userInfo', "/addUser", data);
      console.log("User Data", apiData)

    },
    [],
  )
  return (
    // <Authenticator>
    //   {({ signOut, user }) => (
        <div className="App">
          <UserAuthProvider>
            <Test />
          </UserAuthProvider>
        </div>
    //   )}
    // </Authenticator>
  );
}

export default App;