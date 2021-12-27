import React from "react";
import { SidebarStyle } from "./style";
import { Card } from "antd"
export const Tile = ({ title, value }) => {
    return (
        <SidebarStyle>
            <Card bordered={false} style={{ width: 200, height: 100 }}>
                <b>{title}</b>
                <div className="value">
                    <p className="text">{value}</p>
                </div>
            </Card>
        </SidebarStyle>
    );
};
