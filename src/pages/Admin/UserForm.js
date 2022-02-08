import React, { Fragment, useCallback, useEffect, useMemo, useState } from 'react'
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
    const [practitioners, setPractitioners] = useState([])
    const [value, setValue] = useState()
    const [selectedObject, setSelectedObject] = useState()
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

    useEffect(() => {
        const getClinikoUsers = async () => {
            const users = await API.get('userInfo', "/addUser/clinikoUsers");
            setPractitioners(users.practitioners)
        }
        getClinikoUsers()

    }, [])
    const practitionersOptions = practitioners.map(practitioner => ({ key: practitioner.practitionerId, value: practitioner.full_name }))

    useEffect(() => {
        const selectedObject = practitioners.find(practitioner => practitioner.practitionerId === value);
        if (formRef.current) {
            const isPractitioner = formRef.current.values.role?.includes("Practitioner")
            formRef.current.setFieldValue(
                "email",
                isPractitioner ? selectedObject?.email : ''
            );
            formRef.current.setFieldValue(
                "practitionerId",
                isPractitioner ? selectedObject?.practitionerId : ''
            );
            formRef.current.setFieldValue(
                "clinikoUserId",
                isPractitioner ? selectedObject?.id : ''
            );
        }
        setSelectedObject(selectedObject)
    }, [value, JSON.stringify(formRef.current)])

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
                            <InputBox name="email" placeholder="Email"
                                disabled={values.role?.length >= 1 && values.role?.includes("Practitioner")}
                            />
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
                                onChange={
                                    (value) => {
                                        setFieldValue("role", value)
                                        setValue('')
                                    }
                                }
                            />
                        </LabelWithInputItem>
                        {values.role?.includes("Practitioner") && <>
                            <LabelWithInputItem label="Practitioners">
                                <MultipleTagSelect
                                    name="selected"
                                    width="medium"
                                    mode="-"
                                    options={practitionersOptions}
                                    setFieldValue={setFieldValue}
                                    onChange={
                                        (value) => {
                                            setValue(value)
                                        }
                                    }

                                />
                            </LabelWithInputItem>
                            <LabelWithInputItem label="Cliniko User ID">
                                <InputBox name="clinikoUserId" placeholder="Cliniko User ID" disabled={true} />
                            </LabelWithInputItem>
                            <LabelWithInputItem label="Practitioner Id">
                                <InputBox name="practitionerId" placeholder="Practitioner Id"

                                    disabled={true} />
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
        [practitionersOptions]
    )
    return <Fragment>{memoizedUserForm}</Fragment>
}