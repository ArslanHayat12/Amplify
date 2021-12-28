import React from 'react';
import './App.css';
import {UserAuthProvider} from "./context/UserAuthContext";
import Main from './Main';

function App() {
  
  return (
        <div className="App">
          <UserAuthProvider>
            <Main />
          </UserAuthProvider>
        </div>
  );
}

export default App;