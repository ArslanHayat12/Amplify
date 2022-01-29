import { useAuthenticator } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import React,{useEffect} from 'react'
import { useRoleBasedContext } from '../../context/RoleBasedContext'
import { useUserContext } from '../../context/UserAuthContext'
import { IFrameStyle } from './style'
export const Practitioner=()=> {
    const { user } = useAuthenticator()
    const {dispatch:dispatchRole,state:{rolesList}}=useRoleBasedContext()
    const {dispatch,state}=useUserContext()
   
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

    const url=rolesList?.find(role=>(role.role==='Practitioner'));
    console.log(state.user,rolesList)
    url&&console.log(url?.url+url?.dashboardId,url)
    return <IFrameStyle src="https://45165593c88d40849d9cd81b0862bfe1.ap-southeast-2.aws.found.io:9243/app/dashboards#/view/31ad4d40-796d-11ec-b275-070a29d78d3f?embed=true&_g=(filters%3A!(practioner.keyword=)%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-2y%2Cto%3Anow))&hide-filter-bar=true" ></IFrameStyle>
}
