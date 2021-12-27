import React, { useRef } from 'react'
import { useUserContext } from '../../context/UserAuthContext'
import { ModalComponent } from '../../components/Modal/Modal'
import { UsersModalBodyStyles } from './style'
import { UserForm } from './UserForm'


export const UsersModal = (props) => {
    const { isModalVisible, setIsModalVisible } = props
    console.log(props)
    const formRef = useRef(null)

    const { dispatch } = useUserContext()

    const handleCancel = () => {
        setIsModalVisible(false)
        dispatch({
            type: 'SELECTED_USER',
            currentUser: null
        })
    }

    return (
        <ModalComponent
            width="550px"
            title="Add / Edit Users"
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            footer={null}
        >
            <UsersModalBodyStyles>
                <UserForm formRef={formRef} handleCancel={handleCancel}/>
            </UsersModalBodyStyles>
        </ModalComponent>
    )
}