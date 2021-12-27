import styled from "styled-components"
import { Card } from 'antd';
export const SidebarStyle = styled(Card)`
background: #ececec;
.value{
    display: flex;
    justify-content: center;
    align-items: center;
    .text{
        font-size:40px;
    }
}
.ant-card-body {
    padding: 8px;
}
`