import React, { useState } from "react";
import { Drawer, Button, Dropdown, Avatar } from "antd";
import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { NavbarStyle } from "./style";
import TopicMenu from "../TopicMenu";
import logo from "./../../logo.svg";
import { useHistory } from "react-router-dom";

import { useSessionContext } from '../../context/SessionContext';

const NavBar = ({ menu, signOut, user }) => {
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const [session, setSession] = useSessionContext();
  return (
    <NavbarStyle>
      <div>
        <Button
          className="menu"
          type="primary"
          icon={<MenuOutlined />}
          onClick={() => setVisible(true)}
        />
        <Drawer
          title="Topics"
          placement="left"
          onClick={() => setVisible(false)}
          onClose={() => setVisible(false)}
          visible={visible}
        >
          {menu}
        </Drawer>
        <a href="/">
          <img src={logo} className="logo" alt="logo" />
        </a>
      </div>
      <div>
        
    
        <Dropdown
          overlay={<TopicMenu
            topics={['Sign Out']}
            changeSelectedKey={() => {
              setSession({...session, isAuthenticated: false});
              signOut()
              history.push('/login')
            }}

          />}
           trigger={["click"]}
          placement="bottomLeft"

        >
          
          <div >
            {user.username}
            <Avatar size="default" icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </div>
    </NavbarStyle>
  );
};

export default NavBar;
