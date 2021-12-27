import React from 'react'
import { ModalStyle } from './style'

export const ModalComponent = (props) => {
    const { title, isModalVisible, handleCancel, footer, children, width, maskClosable = true } = props

    return (
        <ModalStyle
            title={title}
            width={width ? width : '884px'}
            centered={true}
            visible={isModalVisible}
            onCancel={handleCancel}
            footer={footer}
            maskClosable={maskClosable}
        >
            {children}
        </ModalStyle>
    )
}