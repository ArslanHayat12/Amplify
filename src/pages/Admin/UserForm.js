import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Formik } from "formik";
import { Button } from "antd";
import { useUserContext } from "../../context/UserAuthContext";
import { InputBox } from "../../components/Input/Input";
import { LabelWithInputItem } from "../../components/LabelWithInputItem/LabelWithInputItem";
import { MultipleTagSelect } from "../../components/SelectInput/MultipleTagSelect";
import { showMessage } from "../../components/message";
import { userFormValidation } from "./validations";
import { UsersFormStyle } from "./style";
import { useAuthenticator } from "@aws-amplify/ui-react";
import { API } from "aws-amplify";

export const UserForm = (props) => {
  const { formRef, handleCancel } = props;
  const [practitioners, setPractitioners] = useState([]);
  const [value, setValue] = useState();
  const [selectedObject, setSelectedObject] = useState();
  const [businesses, setBusiness] = useState([]);
  const {
    state: { currentUser },
    dispatch,
  } = useUserContext();

  const { user } = useAuthenticator();


  const data = {
    name: "",
    email: "",
    businessId: "",
    clinikoUserId: "",
    practitionerId: "",
    mentorIds: "",
    organizations: "",
  };
  
  useEffect(() => {
   setValue(currentUser?.practitionerId?currentUser?.practitionerId[0]:'')
  }, [currentUser?.practitionerId]);

  useEffect(() => {
    setValue(currentUser?.businessId?currentUser?.businessId[0]:'')
   }, [currentUser?.businessId]);

  useEffect(() => {
    const getClinikoUsers = async () => {
      const users = await API.get("userInfo", "/addUser/clinikoUsers");
      setPractitioners(users.practitioners);
    };
    getClinikoUsers();
  }, []);
  useEffect(() => {
    const getclinikoBusinesses = async () => {
      const businesses = await API.get(
        "userInfo",
        "/addUser/clinikoBusinesses"
      );
      setBusiness(businesses.businesses);
    };
    getclinikoBusinesses();
  }, []);
  const practitionersOptions = practitioners.map((practitioner) => ({
    key: practitioner.practitionerId,
    value: practitioner.full_name,
  }));

  const businessOptions = businesses.map((business) => ({
    key: business.id,
    value: business.business,
  }));

  useEffect(() => {
    console.log("practitioners",value)
    const selectedObject = practitioners.find(
      (practitioner) => practitioner.practitionerId === value
    );
    if (formRef.current) {
      const isPractitioner =
        formRef.current.values.role?.includes("Practitioner");
      formRef.current.setFieldValue(
        "email",
        isPractitioner ? selectedObject?.email : ""
      );
      formRef.current.setFieldValue(
        "selected",
        isPractitioner ? selectedObject?.practitionerId : ""
      );
      formRef.current.setFieldValue(
        "practitionerId",
        isPractitioner ? selectedObject?.practitionerId : ""
      );
      formRef.current.setFieldValue(
        "clinikoUserId",
        isPractitioner ? selectedObject?.id : ""
      );
    }
    setSelectedObject(selectedObject);
  }, [value, JSON.stringify(formRef.current),JSON.stringify(practitioners)]);

  useEffect(() => {
    const selectedObject = businesses.find((business) => business.id === value);
    if (formRef.current) {
      const isBusiness = formRef.current.values.role?.includes("Business");
      formRef.current.setFieldValue(
        "email",
        isBusiness ? selectedObject?.email : formRef.current.values.email
      );

      formRef.current.setFieldValue(
        "businessId",
        isBusiness ? selectedObject?.id : ""
      );
    }
    setSelectedObject(selectedObject);
  }, [value, JSON.stringify(formRef.current), businesses]);

  const handleCreateUser = (values, resetForm) => {
    const {
      email,
      name,
      role,
      clinikoUserId,
      practitionerId,
      businessId,
      mentorIds,
      organizations,
    } = values;
    const addUser = async () => {
      const data = {
        body: {
          name: name,
          email: email,
          display_name:name,
          role: role?.join(),
          parentId: user.attributes.sub,
          clinikoUserId,
          practitionerId,
          businessId,
          mentorIds: (mentorIds || []).join(),
          organizations: (organizations || []).join(),
        },
      };
      try {
        await API.put("userInfo", "/addUser", data);
        const apiData = await API.get("userInfo", "/addUser");
        dispatch({
          type: "SET_USERS_List",
          payload: apiData?.data?.Users || [],
          loggedInUserId: user.attributes.sub,
        });
        showMessage("User created", "success");
        resetForm();
        handleCancel();
      } catch (err) {
        showMessage(`${err?.response?.data?.error?.message||'Error'}`, "error");
      }
    };
    addUser();
  };

  const handleEditUser = useCallback(
    async (values, resetForm) => {
      const {
        clinikoUserId,
        practitionerId,
        businessId,
        email,
        role,
        mentorIds,
        name,
        organizations
      } = values;
      console.log(values)
      const data = {
        body: {
          name,
          display_name:name,
          email,
          role: role.join(),
          clinikoUserId,
          practitionerId,
          businessId,
          parentId:user.attributes.sub,
          mentorIds: (mentorIds || []).join(),
          organizations: (organizations || []).join(),
        },
      };
      try {
        await API.put("userInfo", "/addUser/update", data);
        const apiData = await API.get("userInfo", "/addUser");
        // console.log(user,apiData)
        apiData?.data&&dispatch({
          type: "SET_USERS_List",
          payload: apiData?.data?.Users || [],
          loggedInUserId: user.attributes?.sub,
        });
        showMessage("User Updated", "success");
        resetForm();
        handleCancel();
      } catch (err) {
        
        showMessage(`${err?.response?.data?.error?.message||'Error'}`, "error");
      }
    },
    [currentUser]
  );

  const cancelEdit = () => {
    dispatch({
      type: "SELECTED_USER",
      currentUser: null,
    });
  };

  const memoizedUserForm = useMemo(
    () => (
      <Formik
        enableReinitialize
        initialValues={currentUser ? currentUser : data}
        onSubmit={(values, { resetForm }) => {
          currentUser
            ? handleEditUser(values, resetForm)
            : handleCreateUser(values, resetForm);
        }}
        innerRef={formRef}
        validationSchema={userFormValidation}
        validateOnChange={false}
      >
        {({ values, setFieldValue, submitForm }) => (
          <UsersFormStyle>
            <LabelWithInputItem label="Name">
              <InputBox name="name" placeholder="User Name" />
            </LabelWithInputItem>

            <LabelWithInputItem label="Email">
              <InputBox
                name="email"
                placeholder="Email"
                disabled={
                  values.role?.length >= 1 &&
                  (values.role?.includes("Practitioner") ||
                    values.role?.includes("Business"))
                }
              />
            </LabelWithInputItem>
            <LabelWithInputItem label="Role(s)">
              <MultipleTagSelect
                name="role"
                width="medium"
                options={[
                  { key: "Admin", value: "Admin" },
                  { key: "Practitioner", value: "Practitioner" },
                  { key: "Business", value: "Business" },
                  { key: "Mentor", value: "Mentor" },
                  { key: "Organization", value: "Organization" },
                ]}
                onChange={(value) => {
                  setFieldValue("role", value);
                  setValue("");
                }}
              />
            </LabelWithInputItem>
            {values.role?.includes("Organization") && (
              <LabelWithInputItem label="Businesses">
                <MultipleTagSelect
                  name="organizations"
                  width="medium"
                  options={businessOptions}
                  setFieldValue={setFieldValue}
                  onChange={(value) => {
                    setFieldValue("organizations", value);
                    setValue("");
                  }}
                />
              </LabelWithInputItem>
            )}
            {values.role?.includes("Mentor") && (
              <LabelWithInputItem label="Practitioners">
                <MultipleTagSelect
                  name="mentorIds"
                  width="medium"
                  options={practitionersOptions}
                  setFieldValue={setFieldValue}
                  onChange={(value) => {
                    setFieldValue("mentorIds", value);
                    setValue("");
                  }}
                />
              </LabelWithInputItem>
            )}
            {values.role?.includes("Practitioner") && (
              <>
                <LabelWithInputItem label="Practitioners">
                  <MultipleTagSelect
                    name="selected"
                    width="medium"
                    mode="-"
                    value={value}
                    options={practitionersOptions}
                    setFieldValue={setFieldValue}
                    onChange={(value) => {
                      setValue(value);
                    }}
                  />
                </LabelWithInputItem>
                <LabelWithInputItem label="Cliniko User ID">
                  <InputBox
                    name="clinikoUserId"
                    placeholder="Cliniko User ID"
                    disabled={true}
                  />
                </LabelWithInputItem>
                <LabelWithInputItem label="Practitioner Id">
                  <InputBox
                    name="practitionerId"
                    placeholder="Practitioner Id"
                    disabled={true}
                  />
                </LabelWithInputItem>
              </>
            )}

            {values.role?.includes("Business") && (
              <>
                <LabelWithInputItem label="Businesses">
                  <MultipleTagSelect
                    name="businessSelected"
                    width="medium"
                    mode="-"
                    options={businessOptions}
                    setFieldValue={setFieldValue}
                    onChange={(value) => {
                      setValue(value);
                    }}
                  />
                </LabelWithInputItem>
                <LabelWithInputItem label="Business Id">
                  <InputBox
                    name="businessId"
                    placeholder="Business Id"
                    disabled={true}
                  />
                </LabelWithInputItem>
              </>
            )}

            <div>
              <Button
                onClick={() => {
                  submitForm();
                }}
              >
                SAVE
              </Button>
              {currentUser && <Button onClick={cancelEdit}>Cancel</Button>}
            </div>
          </UsersFormStyle>
        )}
      </Formik>
    ),
    [practitionersOptions,data,currentUser]
  );
  return <Fragment>{memoizedUserForm}</Fragment>;
};
