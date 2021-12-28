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
import { API } from 'aws-amplify'

export const UserForm = (props) => {
    const { formRef,handleCancel } = props
    const {
        state: { currentUser },
        dispatch
    } = useUserContext()

    const data = {
        name: '',
        email: ''
    }

    const handleCreateUser = (values, resetForm) => {
        const { email, name,role } = values
        const addUser = (
            async (parentId) => {
                const data = {
                    body: {
                        name: name,
                        email: email,
                        role:role.join()
                    }
                }
                try {
                    await API.put('userInfo', "/addUser", data);
                    const apiData = await API.get('userInfo', "/addUser");
                    dispatch({ type: "SET_USERS_List", payload: apiData?.data?.Users || [] })
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
        async(user, resetForm) => {
            const data = {
                body: {
                    email:user.email,
                    role:user.role.join()
                }
            }
            try {
                await API.put('userInfo', "/addUser/update", data);
                const apiData = await API.get('userInfo', "/addUser");
                dispatch({ type: "SET_USERS_List", payload: apiData?.data?.Users || [] })
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
                            <InputBox name="name" placeholder="Untitled" />
                        </LabelWithInputItem>
                        <LabelWithInputItem label="Email">
                            <InputBox name="email" placeholder="Untitled" />
                        </LabelWithInputItem>
                        <LabelWithInputItem label="Role(s)">
                            <MultipleTagSelect
                                name="role"
                                width="medium"
                                options={[
                                    { key: 'Admin', value: 'Admin' },
                                    { key: 'Practioner', value: 'Practioner' },
                                    { key: 'Business', value: 'Business' }
                                ]}
                                setFieldValue={setFieldValue}
                            />
                        </LabelWithInputItem>

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