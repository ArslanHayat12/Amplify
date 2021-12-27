import React, { useCallback, useEffect } from 'react';
import './App.css';
import { API } from 'aws-amplify'
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Routes } from './routes';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { useSessionContext } from './context/SessionContext';
import { useHistory } from 'react-router-dom';
import { roleBasedRoutes } from './models/session';

function Test() {
    const {user}=useAuthenticator()
    const [session, setSession] = useSessionContext();
    const history = useHistory();

     console.log(user)
    useEffect(() => {
        setSession({...session, isAuthenticated: !!user,role:user.attributes?.['custom:role']||'Admin'});
         history.push(roleBasedRoutes[user.attributes?.['custom:role']||'Admin']?.redirectPath);
    }, [])
    // eslint-disable-next-line no-undef
    return <Dashboard />;
}

export default Test;