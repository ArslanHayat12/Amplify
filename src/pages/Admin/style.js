import styled from "styled-components"
import { Form } from 'formik';

export const AdminStyle = styled.div`
display:flex;
gap:20px;
flex-wrap: wrap;
`
export const ButtonStyle = styled.div`
display:flex;
margin:10px 0;
justify-content: end;
`

export const UsersFormStyle = styled(Form)`
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 0.5rem;
     width: fit-content;
    padding: 2rem 2.5rem;
    border-radius: 0.4rem;
    // background-color: #f1f5f8;
 
`

export const UsersModalBodyStyles = styled.div`
    display: flex;
    margin: -24px;
`