import React, { Fragment, useCallback, useMemo } from 'react'
import { Formik } from 'formik'
import { Button } from 'antd'
import { useUserContext } from '../../context/UserAuthContext'
import { InputBox } from '../../components/Input/Input'
import { LabelWithInputItem } from '../../components/LabelWithInputItem/LabelWithInputItem'
import { MultipleTagSelect } from '../../components/SelectInput/MultipleTagSelect'
import { showMessage } from '../../components/message'
import { userFormValidation } from './validations'
import { UsersFormStyle } from './style'
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from 'aws-amplify'

export const UserForm = (props) => {
    const { formRef, handleCancel } = props
    const {
        state: { currentUser },
        dispatch
    } = useUserContext()

    const { user } = useAuthenticator()

    const data = {
        name: '',
        email: '',
        businessId: '',
        clinikoUserId: '',
        practitionerId: ''
    }
    const handleCreateUser = (values, resetForm) => {
        const { email, name, role, clinikoUserId, practitionerId, businessId } = values
        const addUser = (
            async () => {
                const data = {
                    body: {
                        name: name,
                        email: email,
                        role: role.join(),
                        parentId: user.attributes.sub,
                        clinikoUserId,
                        practitionerId,
                        businessId
                    }
                }
                try {
                    await API.put('userInfo', "/addUser", data);
                    const apiData = await API.get('userInfo', "/addUser");
                    dispatch({ type: "SET_USERS_List", payload: apiData?.data?.Users || [], loggedInUserId: user.attributes.sub })
                    showMessage('User created', 'success')
                    resetForm()
                    handleCancel()
                }
                catch (err) {
                    showMessage(`${err.error}`, 'error')
                }

            }
        )
        addUser()
    }

    const handleEditUser = useCallback(
        async (user, resetForm) => {
            const { clinikoUserId, practitionerId, businessId, email, role } = user;
            const data = {
                body: {
                    email,
                    role: role.join(),
                    clinikoUserId,
                    practitionerId,
                    businessId
                }
            }
            try {
                await API.put('userInfo', "/addUser/update", data);
                const apiData = await API.get('userInfo', "/addUser");
                dispatch({ type: "SET_USERS_List", payload: apiData?.data?.Users || [], loggedInUserId: user.attributes.sub })
                showMessage('User Updated', 'success')
                resetForm()
                handleCancel()
            }
            catch (err) {
                showMessage(`${err.error}`, 'error')
            }
        },
        [currentUser]
    )

    const cancelEdit = () => {
        dispatch({
            type: 'SELECTED_USER',
            currentUser: null
        })
    }

    const memoizedUserForm = useMemo(
        () => (
            <Formik
                enableReinitialize
                initialValues={currentUser ? currentUser : data}
                onSubmit={(values, { resetForm }) => {
                    currentUser ? handleEditUser(values, resetForm) : handleCreateUser(values, resetForm)
                }}
                innerRef={formRef}
                validationSchema={userFormValidation}
                validateOnChange={false}
            >
                {({ values, setFieldValue, submitForm }) => (
                    <UsersFormStyle>
                        <LabelWithInputItem label="User Name">
                            <InputBox name="name" placeholder="User Name" />
                        </LabelWithInputItem>
                        <LabelWithInputItem label="Email">
                            <InputBox name="email" placeholder="Email" />
                        </LabelWithInputItem>
                        <LabelWithInputItem label="Role(s)">
                            <MultipleTagSelect
                                name="role"
                                width="medium"
                                options={[
                                    { key: 'Admin', value: 'Admin' },
                                    { key: 'Practitioner', value: 'Practitioner' },
                                    { key: 'Business', value: 'Business' }
                                ]}
                                setFieldValue={setFieldValue}
                            />
                        </LabelWithInputItem>
                        {values.role?.includes("Practitioner") && <>
                            <LabelWithInputItem label="Cliniko User ID">
                                <InputBox name="clinikoUserId" placeholder="Cliniko User ID" />
                            </LabelWithInputItem>
                            <LabelWithInputItem label="Practitioner Id">
                                <InputBox name="practitionerId" placeholder="Practitioner Id" />
                            </LabelWithInputItem></>}

                        {values.role?.includes("Business") &&
                            <LabelWithInputItem label="Business Id">
                                <InputBox name="businessId" placeholder="Business Id" />
                            </LabelWithInputItem>}

                        <div>
                            <Button
                                onClick={() => {
                                    submitForm()
                                }}
                            >
                                SAVE
                            </Button>
                            {currentUser && (
                                <Button onClick={cancelEdit}>
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </UsersFormStyle>
                )}
            </Formik>
        ),
        []
    )
    return <Fragment>{memoizedUserForm}</Fragment>
}