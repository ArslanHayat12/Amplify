import { useAuthenticator } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import React, { useEffect, useState } from 'react'
import { SimpleSelect } from '../../components/SelectInput/SimpleSelect'
import { useRoleBasedContext } from '../../context/RoleBasedContext'
import { useUserContext } from '../../context/UserAuthContext'

import { getCustomRoleType, getEmbededURL } from '../../utils/'
import { IFrameStyle, PractitionerFormStyle } from './style'
export const Practitioner = () => {
    const [practitioners, setPractitioners] = useState([])
    const [value, setValue] = useState()
    const { user } = useAuthenticator()
    const { dispatch: dispatchRole, state: { rolesList } } = useRoleBasedContext()
    const { dispatch } = useUserContext()
    const { isAdmin } = getCustomRoleType(user.attributes['custom:role'])
    const practitionersOptions = practitioners.map(practitioner => ({ key: practitioner.practitionerId, value: practitioner.full_name }))

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
        const getClinikoUsers = async () => {
            const users = await API.get('userInfo', "/addUser/clinikoUsers");
            setPractitioners(users.practitioners)
        }
        isAdmin && getClinikoUsers()

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

    const practitionerUrl = rolesList?.find(role => (role.role.includes('Practitioner')));
    return !user ? 'Loading...' : <>{isAdmin &&
        <PractitionerFormStyle>
            <SimpleSelect
                name="practitionerSelected"
                width="medium"
                mode="-"
                options={practitionersOptions}
                placeholder="Select Practitioner"
                onChange={
                    (value) => {
                        setValue(value)
                    }
                }


            /></PractitionerFormStyle>}<IFrameStyle key={value} src={getEmbededURL(practitionerUrl, user, false, false, isAdmin ? value : '')} onLoad={() => 'Loading'} frameBorder={0}></IFrameStyle></>
}
