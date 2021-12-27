import React from 'react'
import { ConfirmationModal } from './ConfirmationModal'

export const DeleteModal = (props) => {
    const { title, isModalVisible, handleClose, handleAccept } = props

    return (
        <ConfirmationModal
            modalTitle="Delete"
            confirmationMessage={`Are you sure to want to delete '${title}' ?`}
            isModalVisible={isModalVisible}
            handleClose={handleClose}
            handleAccept={handleAccept}
        />
    )
}