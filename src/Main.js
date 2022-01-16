import React, { useEffect } from 'react';
import './App.css';
import { useAuthenticator, } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { useSessionContext } from './context/SessionContext';

function Main() {
    const { user,_state:{value} } = useAuthenticator()
    const [session, setSession] = useSessionContext();

    useEffect(() => {
        setSession({ ...session, isAuthenticated: value==="authenticated", role: user.attributes?.['custom:role'] || 'Admin' });
    
    }, [value,user])
    // eslint-disable-next-line no-undef
    return <Dashboard />;
}

export default Main;