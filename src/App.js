import React from 'react';
import './App.css';
import { UserAuthProvider } from "./context/UserAuthContext";
import { RoleBasedContextProvider } from "./context/RoleBasedContext";
import Main from './Main';

function App() {

  return (
    <div className="App">

      <RoleBasedContextProvider>
        <UserAuthProvider>
          <Main />
        </UserAuthProvider>
      </RoleBasedContextProvider>
    </div >
  );
}

export default App;