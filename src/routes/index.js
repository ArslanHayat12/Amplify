import PrivateRoutes from "./PrivateRoutes";
import { useSessionContext } from "../context/SessionContext";
import { Redirect, Route, Switch } from 'react-router';
import { Login } from "../pages/Login/Login";
import Test from "../Test";
import { Authenticator } from "@aws-amplify/ui-react"

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

    return (
        <div>
            <Authenticator>
                {() => (
                    <Switch>
                        <PrivateRoutes {...defaultPrivateRoutesProps} path='/admin' component={Test} role='Admin' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/practioner" path='/practioner' component={Test} role='Practioner' />
                        <PrivateRoutes {...defaultPrivateRoutesProps} redirectPath="/business" path='/business' component={Test} role='Business' />

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
