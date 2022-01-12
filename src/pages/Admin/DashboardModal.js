import React, { useRef } from 'react'
import { useRoleBasedContext } from '../../context/RoleBasedContext'
import { ModalComponent } from '../../components/Modal/Modal'
import { UsersModalBodyStyles } from './style'
import { DashboardForm } from './DashboardForm'


export const DashboardModal = (props) => {
    const { isModalVisible, setIsModalVisible } = props
    const formRef = useRef(null)

    const { dispatch } = useRoleBasedContext()

    const handleCancel = () => {
        setIsModalVisible(false)
        dispatch({
            type: 'SELECTED_ROLE',
            currentUser: null
        })
    }

    return (
        <ModalComponent
            width="550px"
            title="Add / Edit Role For Dashboard"
            isModalVisible={isModalVisible}
            handleCancel={handleCancel}
            footer={null}
        >
            <UsersModalBodyStyles>
                <DashboardForm formRef={formRef} handleCancel={handleCancel}/>
            </UsersModalBodyStyles>
        </ModalComponent>
    )
}