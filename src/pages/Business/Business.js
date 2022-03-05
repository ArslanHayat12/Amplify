import { useAuthenticator } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { SimpleSelect } from '../../components/SelectInput/SimpleSelect'
import { useRoleBasedContext } from '../../context/RoleBasedContext'
import { useUserContext } from '../../context/UserAuthContext'
import { getCustomRoleType, getEmbededURL } from '../../utils'
import { BusinessFormStyle, IFrameStyle } from './style'
export const Business = () => {
    const [businesses, setBusiness] = useState([])
    const { user } = useAuthenticator()
    const { dispatch: dispatchRole, state: { rolesList } } = useRoleBasedContext()
    const { dispatch } = useUserContext()
    const { isAdmin } = getCustomRoleType(user.attributes['custom:role'])
    const businessOptions = businesses.map(business => ({ key: business.id, value: business.business }))
    const [value, setValue] = useState()



    useEffect(() => {
        const getRoles = async () => {
            dispatchRole({ type: "SET_LOADING", payload: true })
            const apiData = await API.get('rolebase', "/dashboard-content");
            dispatchRole({ type: "SET_ROLES_LIST", payload: apiData?.Items || [] })
            dispatchRole({ type: "SET_LOADING", payload: false })
        }
        !rolesList && getRoles()
    }, [])

    useEffect(() => {
        const getclinikoBusinesses = async () => {
            const businesses = await API.get('userInfo', "/addUser/clinikoBusinesses");
            setBusiness(businesses.businesses)
        }
        isAdmin && getclinikoBusinesses()

    }, [isAdmin])

    useEffect(() => {
        const getUser = async () => {
            dispatch({ type: "SET_LOADING", payload: true })
            const apiData = await API.get('userInfo', "/addUser");
            dispatch({ type: "SET_LOGGED_IN_USER", payload: apiData?.data?.Users || [], loggedInUserId: user.attributes.sub })
            dispatch({ type: "SET_LOADING", payload: false })
        }
        getUser()
    }, [user])

    const businessUrl = rolesList?.find(role => (role.role.includes("Business")));

   
    return !user ? 'Please Wait' : <>{isAdmin &&
        <BusinessFormStyle>
        <SimpleSelect
            name="businessSelected"
            width="medium"
            mode="-"
            options={businessOptions}
            placeholder="Select Business"
            onChange={
                (value) => {
                    setValue(value)
                }
            }


        /></BusinessFormStyle>}
          <IFrameStyle key={value} src={getEmbededURL(businessUrl, user, null, Boolean(businessUrl), isAdmin?value:'')} ></IFrameStyle>
    </>
}
