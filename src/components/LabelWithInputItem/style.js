import styled from 'styled-components'
export const LabelWithInputItemStyle = styled.div`
    display: grid;
    grid-template-columns: ${props => props.type === 'horizontal' ? 'auto auto' : '1fr'};
    grid-column-gap: 1.5rem;
    align-items: center;
    ${props => props.type !== 'horizontal' && 'align-content: start;'}
    
    .input-item-label {
        font-size: 1rem;
    }
`