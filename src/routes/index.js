import PrivateRoutes from "./PrivateRoutes";
import { useSessionContext } from "../context/SessionContext";
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { Login } from "../pages/Login/Login";
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
    },[sessionContext.isAuthenticated])
    
    return (
        <div>
            <Authenticator>
                {() => (
                    <Switch>
                        <PrivateRoutes {...defaultPrivateRoutesProps} path='/admin' component={Main} role='Admin' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/practioner" path='/practioner' component={Main} role='Practioner' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/business" path='/business' component={Main} role='Business' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/organization" path='/organization' component={Main} role='Organization' />

                        <Route path='/login' component={Login} />
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
