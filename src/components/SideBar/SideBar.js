import React from "react";

import logo from "./../../logo.png";
import { LogoStyle, SidebarStyle } from "./style";
const SideBar = ({ menu }) => {
  return (
    <SidebarStyle
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
    </SidebarStyle>
  );
};

export default SideBar;