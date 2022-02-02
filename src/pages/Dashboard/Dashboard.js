import React, { useState,useEffect } from "react";
import { Layout } from "antd";
import TopicMenu from "../../components/TopicMenu";
import NavBar from "../../components/NavBar/NavBar";
import SideBar from "../../components/SideBar/SideBar";
import {Admin} from "../../pages/Admin/Admin";
import {Organization} from "../../pages/Organization/Organization";
import {DashboardView} from "../../pages/DashboardView/DashboardView";
import { useSessionContext } from "../../context/SessionContext";
import { getRoleBasedRoutes } from "../../models/session";
import { Practitioner } from "../Practitioner/Practitioner";
import { Business } from "../Business/Business";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { UserAuthProvider } from "../../context/UserAuthContext";
import { RoleBasedContextProvider } from "../../context/RoleBasedContext";
import { useHistory } from "react-router-dom";

export const Dashboard = () => {
  const [session, ] = useSessionContext()
  const { user, signOut }=useAuthenticator()
  const routes=session&&getRoleBasedRoutes(session.role)?.routes;
  const topics = session&&getRoleBasedRoutes(session.role)?.routes?.map((route) => {
    return(route.name)

  });

  const topicsIndex = session&&getRoleBasedRoutes(session.role)?.routes?.map((route,index) => {
    return(route.path===session.redirectPath)?index:''

  }).filter(Number.isInteger);

  const initialContentIndex=topicsIndex&&topicsIndex.length?topicsIndex[0]:0;

  const history=useHistory()
  const [contentIndex, setContentIndex] = useState(initialContentIndex);
  const [selectedKey, setSelectedKey] = useState(initialContentIndex.toString());

  useEffect(() => {
  session.isAuthenticated&&history.push(session.redirectPath)
  }, [session])

  const changeSelectedKey = (event) => {
    const key = event.key;
    setSelectedKey(key);
    setContentIndex(+key);
    history.push(routes[+key].path)
  };
  const Menu = (
    topics&& <TopicMenu
      topics={topics}
      selectedKey={selectedKey}
      changeSelectedKey={changeSelectedKey}
    />
  );

  const project = () => {
    switch (topics&&topics.length&&topics[contentIndex]) {
      case "Admin": return   <Admin />;
      case "Dashboard": return <DashboardView />;
      case "Practitioner": return <Practitioner />;
      case "Business": return <Business />;
      case "Organization": return <Organization />;
      default: return <h1>No project match</h1>
    }
  }

  return (
    <div className="App">
      {/* <NavBar menu={Menu} user={user} signOut={signOut}/> */}
      <Layout>
        <SideBar menu={Menu} />
        <Layout>
        <NavBar menu={Menu} user={user} signOut={signOut}/>
        <Layout.Content className="content">
          
      <RoleBasedContextProvider>
        <UserAuthProvider>     
          {project()}
          </UserAuthProvider>
          </RoleBasedContextProvider>
        </Layout.Content>
        </Layout>
      </Layout>
    </div>
  );
}
