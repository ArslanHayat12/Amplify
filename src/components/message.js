import { message as AntdMessage } from 'antd'

export const showMessage = (message, type, duration) => {
    AntdMessage[type](message, duration || 3)
}