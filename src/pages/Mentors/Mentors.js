import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";
import React, { useEffect, useState } from "react";
import { SimpleSelect } from "../../components/SelectInput/SimpleSelect";
import { useRoleBasedContext } from "../../context/RoleBasedContext";
import { useUserContext } from "../../context/UserAuthContext";
import { getCustomRoleType, getEmbededURL } from "../../utils";
import { IFrameStyle, MentorFormStyle } from "./style";
export const Mentors = () => {
    const { dispatch, state } = useUserContext();
    const [practitioners, setPractitioners] = useState([])
    const [value, setValue] = useState();
    const [mentors, setMentors] = useState([]);
    const [prcatitionerIds, setPrcatitionerIds] = useState([]);
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
        const getClinikoUsers = async () => {
            const users = await API.get('userInfo', "/addUser/clinikoUsers");
            setPractitioners(users.practitioners)
        }
        isAdmin && getClinikoUsers()

    }, [isAdmin])


   
    const data = state.usersList?.map((user) => ({
        key: user.Username,
        name: user.Username,
        email: user.email,
        email_verified: user.email_verified,
        role: user.role,
        sub: user.sub,
        mentors: practitioners
            .filter((practitioner) => {
                return user.mentorIds.includes(practitioner.practitionerId);
            })
            .map(practitioner => ({ key: practitioner.practitionerId, value: practitioner.full_name }))
    }));



    const practitionersOptions = data?.map(practitioner => ({ key: practitioner.key, value: practitioner.name }))||[]

    useEffect(() => {
        if (value) {
            const selectedOrganization =
                data?.find((practitioner) => practitioner.name === value) || [];
            setMentors(selectedOrganization.mentors);
        }
    }, [value]);


    const mentorUrl = rolesList?.find((role) =>
        role.role.includes("Mentors")
    );
    return (
        <>
            <MentorFormStyle>
                <SimpleSelect
                    width="medium"
                    mode="-"
                    options={practitionersOptions}
                    placeholder="Select Mentor"
                    onChange={(value) => {
                        setValue(value);
                    }}
                />

                <SimpleSelect
                    width="medium"
                    mode="multiple"
                    options={mentors}
                    placeholder="Select Practioner"
                    onChange={(value) => {
                        console.log(value);
                        setPrcatitionerIds(value)
                    }}
                />
            </MentorFormStyle>
            <IFrameStyle
                key={value}
                src={getEmbededURL(
                    mentorUrl,
                    user,
                    null,
                    Boolean(mentorUrl),
                    isAdmin ? value : ""
                )}
            ></IFrameStyle>
        </>
    );
};
