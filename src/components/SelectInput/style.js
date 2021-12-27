import styled from 'styled-components';
import { Select } from 'antd'


const getInputWidth = (width) => {
    switch (width) {
        case 'xs':
            return 'width: 117px';
        case 'small':
            return 'width: 238px';
        case 'medium':
            return 'width: 266px';
        case 'fill':
            return null;
        default:
            return 'width: 266px';
    }
}

export const SelectInputStyle = styled(Select)`
    &.ant-select {
        ${props => getInputWidth(props.width && props.width)};
        margin: 5px 0;
        font-size: 1rem;
        color: #5d5d5d;
        
        .ant-select-selector{
            border-radius: 0.4rem !important;
            border: solid 1px ${props => props.error ? '#ff4d4f' : '#dbdbdb'} !important;
            ${props => props.width && props.width === 'small' && 'height: 26px !important;'}
        }
    }
`
export const SelectHoverInputStyle = styled(Select)`
    &.ant-select {
        font-size: 1rem;
        color: #3ba0d6;
        max-height: 2.3rem;
        width: 100%;
        margin-top: -2rem;
        .ant-select-arrow{
            color: #3ba0d6;
            
        }
        div.ant-select-selector{
            border:none;
            background-color:transparent; 
            color: #3ba0d6;
            max-height: 2.3rem;
            padding-left: 0;
        }
    }
`