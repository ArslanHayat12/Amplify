import React from 'react'
import { Button, Modal } from 'antd'



export const ConfirmationModal = (props) => {
    const { modalTitle, confirmationMessage, isModalVisible, handleClose, handleAccept } = props

    return (
        <Modal
            visible={isModalVisible}
            title={modalTitle}
            onOk={handleAccept}
            onCancel={handleClose}
            footer={[
                <Button key="back" onClick={handleClose}>
                    No
                </Button>,
                <Button key="submit" onClick={handleAccept}>
                    Yes
                </Button>
            ]}
        >
            {confirmationMessage}
        </Modal>
    )
}