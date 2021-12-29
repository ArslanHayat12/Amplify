import React, { useEffect } from 'react';
import './App.css';
import { useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { useSessionContext } from './context/SessionContext';
import { useHistory } from 'react-router-dom';
import { getRoleBasedRoutes } from './models/session';

function Main() {
    const { user } = useAuthenticator()
    const [session, setSession] = useSessionContext();
    const history = useHistory();

    useEffect(() => {
        setSession({ ...session, isAuthenticated: !!user, role: user.attributes?.['custom:role'] || 'Admin' });
        history.push(getRoleBasedRoutes(user.attributes?.['custom:role'] || 'Admin')?.redirectPath);
    }, [])
    // eslint-disable-next-line no-undef
    return <Dashboard />;
}

export default Main;