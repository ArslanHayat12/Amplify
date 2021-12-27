import { useEffect } from 'react'
import { Redirect, Route, useLocation } from 'react-router'

export default function PrivateRoutes({
    isAuthenticated,
    authenticationPath,
    redirectPath,
    setRedirectPath,
    role,
    ...routeProps
}) {
    const currentLocation = useLocation()
console.log(isAuthenticated)
    useEffect(() => {
        if (!isAuthenticated) {
            setRedirectPath(currentLocation.pathname)
        }
    }, [isAuthenticated, setRedirectPath, currentLocation])

    if (isAuthenticated && redirectPath === currentLocation.pathname) {
        return (
            <Route {...routeProps} />
        )
    } else {
        return <Redirect to={{ pathname: isAuthenticated ? redirectPath : authenticationPath }} />
    }
}
