import { useAuthenticator } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import React,{useEffect} from 'react'
import { useRoleBasedContext } from '../../context/RoleBasedContext'
import { useUserContext } from '../../context/UserAuthContext'
import { getEmbededURL } from '../../utils'
import { IFrameStyle } from './style'
export const Business=()=> {
    const { user } = useAuthenticator()
    const {dispatch:dispatchRole,state:{rolesList}}=useRoleBasedContext()
    const {dispatch}=useUserContext()
   
    useEffect(() => {
        const getRoles = async () => {
            dispatchRole({ type: "SET_LOADING", payload: true })
            const apiData = await API.get('rolebase', "/dashboard-content");
            dispatchRole({ type: "SET_ROLES_LIST", payload: apiData?.Items || [] })
            dispatchRole({ type: "SET_LOADING", payload: false })
        }
        !rolesList&&getRoles()
    }, [])

    useEffect(() => {
        const getUser = async () => {
            dispatch({ type: "SET_LOADING", payload: true })
            const apiData = await API.get('userInfo', "/addUser");
            dispatch({ type: "SET_LOGGED_IN_USER", payload: apiData?.data?.Users || [], loggedInUserId: user.attributes.sub })
            dispatch({ type: "SET_LOADING", payload: false })
        }
        getUser()
    }, [user])

    const adminUrl=rolesList?.find(role=>(role.role==='Admin'));
    const businessUrl=rolesList?.find(role=>(role.role==='Business'));
    return !user?'Please Wait':<IFrameStyle src={getEmbededURL(adminUrl||businessUrl,user,Boolean(adminUrl),Boolean(businessUrl))} ></IFrameStyle>
}
