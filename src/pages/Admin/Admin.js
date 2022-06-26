import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Tile } from "../../components/Tiles/Tile";
import { API } from 'aws-amplify'
import { useUserContext } from "./../../context/UserAuthContext";
import { AdminStyle, ButtonStyle } from "./style"
import { UsersModal } from "./UsersModal"
import { Table, Tag, Space, Button } from 'antd';
import { DeleteModal } from '../../components/Modal/DeleteModal';
import { showMessage } from '../../components/message';
import { useAuthenticator } from "@aws-amplify/ui-react";
import { DashboardModal } from './DashboardModal';
import { useRoleBasedContext } from '../../context/RoleBasedContext';



export const Admin = () => {
    const [isUserModalVisible, setIsUserModalVisible] = useState(false)
    const [isDashboardModalVisible, setIsDashboardModalVisible] = useState(false)
    const [isUserDeleteModalVisible, setIsUserDeleteModalVisible] = useState(false)
    const [isRoleDeleteModalVisible, setIsRoleDeleteModalVisible] = useState(false)
    const { dispatch, state } = useUserContext()
    const { dispatch: dispatchRole, state: { rolesList, currentRole } } = useRoleBasedContext()
    const { user } = useAuthenticator()
    const handleModalForm = useCallback(
        () => {
            setIsUserModalVisible(true)
        },
        [],
    )

    const handleDashboardModalForm = useCallback(
        () => {
            setIsDashboardModalVisible(true)
        },
        [],
    )


    const handleEditModalForm = useCallback(
        (user) => {
            dispatch({ type: "SELECTED_USER", payload: user })
            setIsUserModalVisible(true)
        },
        [],
    )

    const handleDeleteModalForm = useCallback(
        (user) => {
            dispatch({ type: "SELECTED_USER", payload: user })
            setIsUserDeleteModalVisible(true)
        },
        [],
    )


    const handleRoleEditModalForm = useCallback(
        (role) => {
            dispatchRole({ type: "SELECTED_ROLE", payload: role })
            setIsDashboardModalVisible(true)
        },
        [],
    )

    const handleRoleDeleteModalForm = useCallback(
        (role) => {
            dispatchRole({ type: "SELECTED_ROLE", payload: role })
            setIsRoleDeleteModalVisible(true)
        },
        [],
    )

    const columns = [
        {
            title: 'User Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <a>{text}</a>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Email verified',
            dataIndex: 'email_verified',
            key: 'email_verified',
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'role',
            render: role => (
                <>
                    {role?.map(tag => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';

                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => handleEditModalForm(record)}>Update</a>
                    <a onClick={() => handleDeleteModalForm(record)}>Delete</a>
                </Space>
            ),
        },
    ];

    const roleBasedColumns = [
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role'
        },
        {
            title: 'URL',
            dataIndex: 'url',
            key: 'url',
        },
        {
            title: 'Dashboard Id',
            dataIndex: 'dashboardId',
            key: 'dashboardId',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Space size="middle">
                    <a onClick={() => handleRoleEditModalForm(record)}>Update</a>
                    <a onClick={() => handleRoleDeleteModalForm(record)}>Delete</a>
                </Space>
            ),
        },
    ];

    useEffect(() => {
        const getUsers = async () => {
            dispatch({ type: "SET_LOADING", payload: true })
            const apiData = await API.get('userInfo', "/addUser");
            dispatch({ type: "SET_USERS_List", payload: apiData?.data?.Users || [], loggedInUserId: user.attributes.sub })
            dispatch({ type: "SET_LOADING", payload: false })
            console.log("User Data", apiData)
        }
        getUsers()
    }, [user])

    useEffect(() => {
        const getRoles = async () => {
            dispatchRole({ type: "SET_LOADING", payload: true })
            const apiData = await API.get('rolebase', "/dashboard-content");
            dispatchRole({ type: "SET_ROLES_LIST", payload: apiData?.Items || [] })
            dispatchRole({ type: "SET_LOADING", payload: false })
        }
        getRoles()
    }, [])

    const deleteUser = (
        async () => {
            try {
                await API.del('userInfo', "/addUser/" + state.currentUser?.name);
                const apiData = await API.get('userInfo', "/addUser");
                dispatch({ type: "SET_USERS_List", payload: apiData?.data?.Users || [], loggedInUserId: user.attributes.sub  })

                showMessage('User Deleted', 'success')

                setIsUserDeleteModalVisible(false)
            }
            catch (err) {
                console.log(err)
                showMessage(`${err.error}`, 'error')
            }

        }
    )


    const deleteRole = (
        async () => {
            try {
                await API.del('rolebase', "/dashboard-content/object/" + currentRole?.role+"/"+ currentRole?.url);
                const apiData = await API.get('rolebase', "/dashboard-content");
                dispatchRole({ type: "SET_ROLES_LIST", payload: apiData?.Items || [] })
                showMessage('Role Deleted', 'success')
                setIsRoleDeleteModalVisible(false)
            }
            catch (err) {
                console.log(err)
                showMessage(`${err.error}`, 'error')
            }

        }
    )
console.log(state.usersList)
    const data = state.usersList?.map(user => ({
        key: user.Username,
        name: user.display_name||user.Username||user.email,
        email: user.email,
        email_verified: user.email_verified,
        role: user.role,
        sub: user.sub,
        organizations:user.organizations,
        mentorIds:user.mentorIds,
        practitionerId:user.practitionerId,
        businessId:user.businessId

    }))

    const UserModal = useMemo(() => {
        return isUserModalVisible && <UsersModal isModalVisible={isUserModalVisible} setIsModalVisible={setIsUserModalVisible} />
    }, [isUserModalVisible, setIsUserModalVisible])

    const DashboardFormModal = useMemo(() => {
        return isDashboardModalVisible && <DashboardModal isModalVisible={isDashboardModalVisible} setIsModalVisible={setIsDashboardModalVisible} />
    }, [isDashboardModalVisible, setIsDashboardModalVisible])

    const MemoizedDeleteModal = useMemo(() => {
        return (<DeleteModal title={state.currentUser?.name} isModalVisible={isUserDeleteModalVisible} handleClose={() => setIsUserDeleteModalVisible(false)} handleAccept={deleteUser} />)
    }, [isUserDeleteModalVisible, state.currentUser])


    const MemoizedRoleDeleteModal = useMemo(() => {
        return (<DeleteModal title={currentRole?.role} isModalVisible={isRoleDeleteModalVisible} handleClose={() => setIsRoleDeleteModalVisible(false)} handleAccept={deleteRole} />)
    }, [isRoleDeleteModalVisible, currentRole])



    return (
        <>
            <AdminStyle>
                <Tile title={"Total Users"} value={state.usersList?.length} />
                <Tile title={"Total Admins"} value={state.role?.admin} />
                <Tile title={"Total Practitioners"} value={state.role?.practitioner} />
                <Tile title={"Total Business"} value={state.role?.business} />

                <hr />

            </AdminStyle>
            <ButtonStyle>
                <Button onClick={() => handleDashboardModalForm()}>Add Dashboard Settings</Button>
            </ButtonStyle>
            {DashboardFormModal}
            {MemoizedRoleDeleteModal}
            <Table columns={roleBasedColumns} dataSource={rolesList} />
            <ButtonStyle>
                <Button onClick={() => handleModalForm()}>Add User</Button>
            </ButtonStyle>
            {UserModal}
            {MemoizedDeleteModal}
            <Table columns={columns} dataSource={data} />
        </>
    );
};
