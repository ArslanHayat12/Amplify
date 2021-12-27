import styled from 'styled-components'
import { Input } from 'antd'
const getInputWidth = (width) => {
    switch (width) {
        case 'fill':
            return null
        case 'small':
            return 'width: 15.0rem'
        case 'medium':
            return 'width: 26.6rem'
        case 'large':
            return 'width: 55.3rem'
        default:
            return 'width: 26.6rem'
    }
}

export const InputBoxStyle = styled(Input)`
    &.ant-input,
    &.ant-input-affix-wrapper {
        ${props => getInputWidth(props.width && props.width)};
        margin: 5px 0 0;
        padding: 4px 10px;
        border-radius: ${props => (props.isSearchBox || props.rounded ? '1.6rem' : '0.4rem')};
        border: solid 1px ${props => (props.isSearchBox ? '#707070' : props.error ? '#ff4d4f' : '#dbdbdb')};
        ${props => props.isSearchBox && 'opacity: 0.27;'}
    }
    &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px white inset;
        background-color: transparent;
    }
`