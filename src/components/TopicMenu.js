import React from "react";
import {Menu} from "antd";
import { MenuStyle } from "./style";

const TopicMenu = ({ topics, selectedKey, changeSelectedKey }) => {
  const styledTopics = [];
  topics.forEach((topic, index) =>
    styledTopics.push(
      <Menu.Item key={index} onClick={changeSelectedKey}>
        {topic}
      </Menu.Item>
    )
  );

  return (
    <MenuStyle  theme="dark" mode="inline" selectedKeys={[selectedKey]}>
      {styledTopics}
    </MenuStyle>
  );
}
export default TopicMenu;
