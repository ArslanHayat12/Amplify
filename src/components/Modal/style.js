import styled from 'styled-components';
import { Modal } from 'antd'

export const ModalStyle = styled(Modal)`
    .ant-modal-content {
        border-radius: 0.7rem;
        color: #5d5d5d;
        .ant-modal-header {
            border-bottom: 1px dotted #c4c4c4;
            border-radius: 0.7rem 0.7rem 0 0;
            .ant-modal-title {
                font-size: 1.2rem;
                color: #5d5d5d;
                .custom-title {
                    display: grid;
                    grid-template-columns: max-content max-content;
                    column-gap: 1.5rem;
                }
            }
        }
        .anticon svg {
            height: 1rem;
            width: 1rem;
            color: #b4b4b4;
        }
        .error-message {
            margin-top: 0.5rem;
            font-size: 0.8rem;
            color: #ff4b4f;
        }
        .ant-modal-footer {
            border-top: 1px solid #ebebeb;
            text-align: left;
        }
    }
`