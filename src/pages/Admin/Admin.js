import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Tile } from "../../components/Tiles/Tile";
import { API } from 'aws-amplify'
import { useUserContext } from "./../../context/UserAuthContext";
import { AdminStyle, ButtonStyle } from "./style"
import { UsersModal } from "./UsersModal"
import { Table, Tag, Space, Button } from 'antd';
import { DeleteModal } from '../../components/Modal/DeleteModal';
import { showMessage } from '../../components/message';



export const Admin = () => {
    const [isUserModalVisible, setIsUserModalVisible] = useState(false)
    
    const [isUserDeleteModalVisible, setIsUserDeleteModalVisible] = useState(false)
    
    const { dispatch, state } = useUserContext()
    const handleModalForm = useCallback(
        () => {
            setIsUserModalVisible(true)
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
            title: 'Email varified',
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
    useEffect(() => {
        const getUsers = async () => {
            dispatch({ type: "SET_LOADING", payload: true })
            const apiData = await API.get('userInfo', "/addUser");
            dispatch({ type: "SET_USERS_List", payload: apiData?.data?.Users || [] })
            dispatch({ type: "SET_LOADING", payload: false })
            console.log("User Data", apiData)
        }
        getUsers()
    }, [])


    const deleteUser = (
        async () => {
            try {
                await API.del('userInfo', "/addUser/" + state.currentUser?.name);
                const apiData = await API.get('userInfo', "/addUser");
                dispatch({ type: "SET_USERS_List", payload: apiData?.data?.Users || [] })

                showMessage('User Deleted', 'success')
       
                setIsUserDeleteModalVisible(false)
            }
            catch (err) {
                console.log(err)
                showMessage(`${err.error}`, 'error')
            }

        }
    )

const data = state.usersList?.map(user => ({
    key: user.Username,
    name: user.Username,
    email: user.email,
    email_verified: user.email_verified,
    role: user.role
}))

const UserModal = useMemo(() => {
    return isUserModalVisible && <UsersModal isModalVisible={isUserModalVisible} setIsModalVisible={setIsUserModalVisible} />
}, [isUserModalVisible, setIsUserModalVisible])

const MemoizedDeleteModal = useMemo(() => {
    return (<DeleteModal title={state.currentUser?.name} isModalVisible={isUserDeleteModalVisible} handleClose={() => setIsUserDeleteModalVisible(false)} handleAccept={deleteUser} />)
}, [isUserDeleteModalVisible, state.currentUser])

return (
    <>
        <AdminStyle>
            <Tile title={"Total Users"} value={state.usersList?.length} />
            <Tile title={"Total Admins"} value={state.role?.admin} />
            <Tile title={"Total Practioners"} value={state.role?.practioner} />
            <Tile title={"Total Business"} value={state.role?.business} />

            <hr />

        </AdminStyle>
        <ButtonStyle>
            <Button onClick={() => handleModalForm()}>Add User</Button>

        </ButtonStyle>
        {UserModal}
        {MemoizedDeleteModal}
        <Table columns={columns} dataSource={data} />
    </>
);
};
