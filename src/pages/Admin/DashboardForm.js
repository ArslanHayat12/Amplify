import React, { Fragment, useCallback, useMemo } from 'react'
import { Formik } from 'formik'
import { Button } from 'antd'
import { useRoleBasedContext } from '../../context/RoleBasedContext'
import { InputBox } from '../../components/Input/Input'
import { LabelWithInputItem } from '../../components/LabelWithInputItem/LabelWithInputItem'
import { MultipleTagSelect } from '../../components/SelectInput/MultipleTagSelect'
import { showMessage } from '../../components/message'
import { dashboardFormValidation } from './validations'
import { UsersFormStyle } from './style'
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from 'aws-amplify'

export const DashboardForm = (props) => {
    const { formRef, handleCancel } = props
    const {
        state: { currentRole },
        dispatch
    } = useRoleBasedContext()

    const { user } = useAuthenticator()

    const data = {
        role: '',
        url: '',
        dashboardId: ''
    }
    const handleCreateRole = (values, resetForm) => {
        const { role, url, dashboardId } = values
        console.log(values)
        const addRole = (
            async () => {
                const data = {
                    body: { role, url, dashboardId }
                }
                try {
                    await API.put('rolebase', "/dashboard-content", data);
                    const apiData = await API.get('rolebase', "/dashboard-content");
                    dispatch({ type: "SET_ROLES_LIST", payload: apiData?.Items || [] })
                    showMessage('Role created', 'success')
                    resetForm()
                    handleCancel()
                }
                catch (err) {
                    showMessage(`${err.error}`, 'error')
                }

            }
        )
        addRole()
    }

    const handleEditRole = useCallback(
        async (dashboardConent, resetForm) => {
            const { role, url, dashboardId } = dashboardConent
            const data = {
                body: { role, url, dashboardId }
            }
            try {
                await API.put('rolebase', "/dashboard-content", data);

                const apiData = await API.get('rolebase', "/dashboard-content");
                dispatch({ type: "SET_ROLES_LIST", payload: apiData?.Items || [] })
                showMessage('Role Updated', 'success')
                resetForm()
                handleCancel()
            }
            catch (err) {
                showMessage(`${err.error}`, 'error')
            }
        },
        [currentRole]
    )
    console.log(currentRole)

    const cancelEdit = () => {
        dispatch({
            type: 'SELECTED_ROLE',
            currentRole: null
        })
    }

    const memoizedDashboardForm = useMemo(
        () => (
            <Formik
                enableReinitialize
                initialValues={currentRole ? currentRole : data}
                onSubmit={(values, { resetForm }) => {
                    currentRole ? handleEditRole(values, resetForm) : handleCreateRole(values, resetForm)
                }}
                innerRef={formRef}
                validationSchema={dashboardFormValidation}
                validateOnChange={false}
            >
                {({ values, setFieldValue, submitForm }) => (
                    <UsersFormStyle>
                        <LabelWithInputItem label="Role(s)">
                            <MultipleTagSelect
                                name="role"
                                width="medium"
                                mode="-"
                                options={[
                                    { key: 'Admin', value: 'Admin' },
                                    { key: 'Practitioner', value: 'Practitioner' },
                                    { key: 'Business', value: 'Business' }
                                ]}
                                setFieldValue={setFieldValue}
                            />
                        </LabelWithInputItem>
                        <LabelWithInputItem label="URL">
                            <InputBox name="url" placeholder="URL" />
                        </LabelWithInputItem>
                        <LabelWithInputItem label="Dashboard Id">
                            <InputBox name="dashboardId" placeholder="Id" />
                        </LabelWithInputItem>
                        <div>
                            <Button
                                onClick={() => {
                                    submitForm()
                                }}
                            >
                                SAVE
                            </Button>
                            {currentRole && (
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
    return <Fragment>{memoizedDashboardForm}</Fragment>
}