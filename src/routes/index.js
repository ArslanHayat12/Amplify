import PrivateRoutes from "./PrivateRoutes";
import { useSessionContext } from "../context/SessionContext";
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import Main from "../Main";
import { Authenticator } from "@aws-amplify/ui-react"
import { Auth } from "aws-amplify";
import { useEffect } from "react";

export const Routes = () => {
    const [sessionContext, updateSessionContext] = useSessionContext();
    const setRedirectPath = (path) => {
        updateSessionContext({ ...sessionContext, redirectPath: path });
    }

    const defaultPrivateRoutesProps = {
        isAuthenticated: !!sessionContext.isAuthenticated,
        authenticationPath: '/login',
        redirectPath: sessionContext.redirectPath,
        setRedirectPath: setRedirectPath,
        role: 'Admin'
    };
    const history = useHistory()

    async function checkAuthState() {
        try {
            await Auth.currentAuthenticatedUser()
        } catch (err) {
            history.push('/login')
        }
    }
    useEffect(() => {
        checkAuthState()
    }, [sessionContext.isAuthenticated])

    return (
        <div>
            <Authenticator>
                {() => (
                    <Switch>
                      
                        <PrivateRoutes {...defaultPrivateRoutesProps} path='/admin' redirectPath="/admin" component={Main} role='Admin' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} path='/dashboard'  redirectPath="/dashboard"component={Main} role='Dashboard' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/practitioner" path='/practitioner' component={Main} role='Practitioner' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/business" path='/business' component={Main} role='Business' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/organizations" path='/organizations' component={Main} role='Organizations' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/mentors" path='/mentors' component={Main} role='Mentor' />

                        <Route path='/login' component={Main} />
                        <Redirect
                            to={{
                                pathname: "/login",
                                state: { from: '/' }
                            }}
                        />
                        <Redirect
                            to='/login'
                        />
                    </Switch>)}
            </Authenticator>
        </div>
    );
};
