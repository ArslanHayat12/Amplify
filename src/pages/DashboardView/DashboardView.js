import React,{useEffect} from 'react'
import { useAuthenticator } from "@aws-amplify/ui-react";
import { useRoleBasedContext } from "../../context/RoleBasedContext";
import { useUserContext } from '../../context/UserAuthContext';
import { API } from 'aws-amplify'
export const DashboardView=()=> {
    const { user } = useAuthenticator()
    const {state:{rolesList}}=useRoleBasedContext()
    const {dispatch,state}=useUserContext()
    useEffect(() => {
        const getUser = async () => {
            dispatch({ type: "SET_LOADING", payload: true })
            const apiData = await API.get('userInfo', "/addUser");
            dispatch({ type: "SET_LOGGED_IN_USER", payload: apiData?.data?.Users || [], loggedInUserId: user.attributes.sub })
            dispatch({ type: "SET_LOADING", payload: false })
        }
        getUser()
    }, [user])

    const url=rolesList?.find(role=>(state.user?.role.includes(role?.role)));
    url&&console.log(url?.url+"/"+url?.dashboardId,url)
    return <>DashboardView</>
}
