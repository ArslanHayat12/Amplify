import React from "react";
import { Layout } from "antd";

import logo from "./../../logo.png";
const SideBar = ({ menu }) => {
  return (
    <Layout.Sider
      className="sidebar"
      breakpoint={"lg"}
      theme="dark"
      collapsedWidth={0}
      trigger={null}
    >
      <a href="/">
        <img src={logo} className="logo" alt="logo" height="60" width='200'
        />
      </a>
      {menu}
    </Layout.Sider>
  );
};

export default SideBar;