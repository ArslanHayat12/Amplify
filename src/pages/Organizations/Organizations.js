import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { SimpleSelect } from "../../components/SelectInput/SimpleSelect";
import { useRoleBasedContext } from "../../context/RoleBasedContext";
import { useUserContext } from "../../context/UserAuthContext";
import { getCustomRoleType, getOrgMentorURL } from "../../utils";
import { IFrameStyle, OrganizationFormStyle } from "./style";
export const Organizations = () => {
  const { dispatch, state } = useUserContext();
  const [businesses, setBusiness] = useState([]);
  const [value, setValue] = useState();
  const [organizations, setOrganizations] = useState([]);
  const [organizationIds, setOrganizationIds] = useState([]);
  const { user } = useAuthenticator();
  const { isAdmin } = getCustomRoleType(user.attributes["custom:role"]);

  const {
    dispatch: dispatchRole,
    state: { rolesList },
  } = useRoleBasedContext();

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
    const getUsers = async () => {
      dispatch({ type: "SET_LOADING", payload: true });
      const apiData = await API.get("userInfo", "/addUser");
      dispatch({
        type: "SET_USERS_List",
        payload: apiData?.data?.Users || [],
        loggedInUserId: user.attributes.sub,
      });
      dispatch({ type: "SET_LOADING", payload: false });
    };
    getUsers();
  }, [user]);
  useEffect(() => {
    const getclinikoBusinesses = async () => {
      const businesses = await API.get(
        "userInfo",
        "/addUser/clinikoBusinesses"
      );
      setBusiness(businesses.businesses);
    };
    getclinikoBusinesses();
  }, [state.usersList]);

  
  useEffect(() => {
    if (value) {
      const selectedOrganization =
        data?.find((business) => business.key === value) || [];
      setOrganizations(selectedOrganization.organizations);
    }
  }, [value]);

  const data = state.usersList?.map((user) => ({
    key: user.Username,
    name: user.Username,
    email: user.email,
    email_verified: user.email_verified,
    role: user.role,
    sub: user.sub,
    organizations: businesses
      ?.filter((business) => {
        return user.organizations?.includes(business.id);
      })
      .map((business) => ({
        key: business.id,
        value: business.business,
      })),
    mentorIds: user.mentorIds,
  }));

  const businessOptions =
    data?.map((business) => ({
      key: business.key,
      value: business.name,
    })) || [];


  const organizationUrl = rolesList?.find((role) =>
    role?.role?.includes("Business")
  );
  return (
    <>
    <OrganizationFormStyle>
      <SimpleSelect
        name="businessSelected"
        width="medium"
        mode="-"
        options={businessOptions}
        placeholder="Select Organization"
        onChange={(value) => {
          setValue(value);
        }}
      />

      <SimpleSelect
        name="businessSelected"
        width="medium"
        mode="multiple"
        options={organizations}
        placeholder="Select Business"
        onChange={(value) => {
          setOrganizationIds(value)
        }}
      />
      </OrganizationFormStyle>
      <IFrameStyle
        key={value}
        src={getOrgMentorURL(organizationUrl,true,organizationIds)}
      ></IFrameStyle>
    </>
  );
};
