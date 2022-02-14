import React from "react";
import { Layout } from "antd";

import logo from "./../../logo.png";
import { LogoStyle } from "./style";
const SideBar = ({ menu }) => {
  return (
    <Layout.Sider
      className="sidebar"
      breakpoint={"lg"}
      theme="dark"
      collapsedWidth={0}
      trigger={null}
    >
      <LogoStyle href="/">
        <img src={logo} className="logo" alt="logo" height="60" width='100'
        />
      </LogoStyle>
      {menu}
    </Layout.Sider>
  );
};

export default SideBar;