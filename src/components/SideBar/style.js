import styled from "styled-components";
import { Layout } from "antd";
export const SidebarStyle = styled(Layout.Sider)`
  .sidebar {
    height: 1000px;
    margin-right: 24px;
  }
  &.ant-layout-sider {
    background: #1877f2;
    .ant-menu{
        background: #1877f2;
    }
  }
`;

export const LogoStyle = styled.a`
  display: flex;
  justify-content: center;
`;
