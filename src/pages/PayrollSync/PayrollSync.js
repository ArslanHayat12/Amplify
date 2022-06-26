import { useAuthenticator } from "@aws-amplify/ui-react";
import { Button,Upload,Table } from "antd";
import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { useRoleBasedContext } from "../../context/RoleBasedContext";
import { useUserContext } from "../../context/UserAuthContext";
import { csvJSON, getCustomRoleType } from "../../utils";
import { BusinessFormStyle } from "./style";
export const PayrollSync = () => {
  const { user } = useAuthenticator();
  const {
    dispatch: dispatchRole,
    state: { rolesList },
  } = useRoleBasedContext();
  const { dispatch } = useUserContext();
  const { isAdmin } = getCustomRoleType(user.attributes["custom:role"]);
 
  const [value, setValue] = useState([]);
  const [title, setTitles] = useState([]);

  useEffect(() => {
    const getRoles = async () => {
      dispatchRole({ type: "SET_LOADING", payload: true });
      const apiData = await API.get("rolebase", "/dashboard-content");
      dispatchRole({ type: "SET_ROLES_LIST", payload: apiData?.Items || [] });
      dispatchRole({ type: "SET_LOADING", payload: false });
    };
    !rolesList && getRoles();
  }, []);



  useEffect(() => {
    const getUser = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const apiData = await API.get("userInfo", "/addUser");
      dispatch({
        type: "SET_LOGGED_IN_USER",
        payload: apiData?.data?.Users || [],
        loggedInUserId: user.attributes.sub,
      });
      dispatch({ type: "SET_LOADING", payload: false });
    };
    getUser();
  }, [user]);

  const businessUrl = rolesList?.find((role) => role.role.includes("Business"));

  return !user ? (
    "Please Wait"
  ) : (
    <>
      {isAdmin && (
        <BusinessFormStyle>
          <Upload
            accept=".txt, .csv"
            showUploadList={false}
            beforeUpload={(file) => {
              const reader = new FileReader();

              reader.onload = (e) => {
                  const parsedData=csvJSON(e.target.result)
                  const mappedValues=parsedData.map((item,index)=>(
                    {
                        key: index,
                        ...item
                      }
                  ))
                  const mappedTitles=Object.keys(parsedData[0])?.map((item,index)=>(
                    {
                        title: item.charAt(0).toUpperCase() + item.slice(1),
                        dataIndex: item,
                        key: item,
                      }
                  ))
                  setValue(mappedValues)
                  setTitles(mappedTitles)
                  // console.log(mappedTitles,mappedValues);
              };
              reader.readAsText(file);

              // Prevent upload
              return false;
            }}
          >
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
          
        </BusinessFormStyle>
      )}
      <Table dataSource={[...value]} columns={[...title]} />;
    </>
  );
};
