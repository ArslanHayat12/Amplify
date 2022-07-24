import PrivateRoutes from "./PrivateRoutes";
import { useSessionContext } from "../context/SessionContext";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Main from "../Main";
import {
  Authenticator,
  Button,
  Heading,
  Image,
  Text,
  useAuthenticator,
  TextField,
  useTheme,
  View,
  FieldGroupIcon,
} from "@aws-amplify/ui-react";
import { AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { Auth } from "aws-amplify";
import { useEffect } from "react";
import {
  AuthWrapper,
  LoginFormStyle,
  SubButtonWrapper,
  SubTextWrapper,
  TextWrapper,
} from "./style";
import logo from "./../logo.png";

export const Routes = () => {
  const [sessionContext, updateSessionContext] = useSessionContext();
  const setRedirectPath = (path) => {
    updateSessionContext({ ...sessionContext, redirectPath: path });
  };

  const defaultPrivateRoutesProps = {
    isAuthenticated: !!sessionContext.isAuthenticated,
    authenticationPath: "/login",
    redirectPath: sessionContext.redirectPath,
    setRedirectPath: setRedirectPath,
    role: "Admin",
  };
  const history = useHistory();

  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
    } catch (err) {
      history.push("/login");
    }
  }
  useEffect(() => {
    checkAuthState();
  }, [sessionContext.isAuthenticated]);
  const components = {
    Header() {
      const { tokens } = useTheme();

      return (
        <View textAlign="center" padding={tokens.space.large}>
          <Image alt="Cntrol logo" src={logo} height={50} width={50} />
        </View>
      );
    },

    SignIn: {
     
      Header() {
        const { tokens } = useTheme();

        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            <TextWrapper>
              Let's <b>Sign In</b>
            </TextWrapper>
            <SubTextWrapper>
              Login with your UserName, Email OR Create an account
            </SubTextWrapper>

          </Heading>
        );
      },
     
      Footer() {
        const { toSignUp,toResetPassword } = useAuthenticator();

        return (
            <>
             <SubButtonWrapper >
              <Button
                fontWeight="normal"
                onClick={toResetPassword}
                size="small"
                variation="link"
                color={"#e15b37"}
              >
                Forgot Password
              </Button>
            </SubButtonWrapper>
            
          <View textAlign="center">
              
            <SubTextWrapper>
              Don't have an account.
              <Button
                fontWeight="normal"
                onClick={toSignUp}
                size="small"
                variation="link"
                color={"#e15b37"}
              >
                Register
              </Button>
            </SubTextWrapper>
          </View>
          </>
        );
      },
    },

    SignUp: {
      FormFields() {
        return (
          <LoginFormStyle>
            <TextField
              innerStartComponent={
                <FieldGroupIcon ariaLabel="">
                  {/** Accessibility tip: pass empty ariaLabel for decorative icons. */}

                  <AiOutlineUser color="#e9a292" />
                </FieldGroupIcon>
              }
              placeholder="Username"
              name="username"
            />
            <TextField
              placeholder="Email"
              innerStartComponent={
                <FieldGroupIcon ariaLabel="">
                  {/** Accessibility tip: pass empty ariaLabel for decorative icons. */}
                  <AiOutlineMail color="#e9a292" />
                </FieldGroupIcon>
              }
              name="email"
            />
            <TextField
              placeholder="Password"
              name="password"
              type="password"
              innerStartComponent={
                <FieldGroupIcon ariaLabel="">
                  {/** Accessibility tip: pass empty ariaLabel for decorative icons. */}
                  <RiLockPasswordLine color="#e9a292" />
                </FieldGroupIcon>
              }
            />
            <TextField
              placeholder="Confirm Password"
              name="confirm_password"
              type="password"
              innerStartComponent={
                <FieldGroupIcon ariaLabel="">
                  {/** Accessibility tip: pass empty ariaLabel for decorative icons. */}
                  <RiLockPasswordLine color="#e9a292" />
                </FieldGroupIcon>
              }
            />
          </LoginFormStyle>
        );
      },
      Header() {
        const { tokens } = useTheme();

        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            <TextWrapper>
              Create your <b>account</b>
            </TextWrapper>
            <SubTextWrapper>New to cntrol? Create an account</SubTextWrapper>
          </Heading>
        );
      },
      Footer() {
        const { toSignIn } = useAuthenticator();

        return (
          <View textAlign="center">
            <SubTextWrapper>
              Already have an account.
              <Button
                fontWeight="normal"
                onClick={toSignIn}
                size="small"
                variation="link"
                color={"#e15b37"}
              >
                Login
              </Button>
            </SubTextWrapper>
          </View>
        );
      },
    },
    ConfirmSignUp: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    SetupTOTP: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    ConfirmSignIn: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    ResetPassword: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
    ConfirmResetPassword: {
      Header() {
        const { tokens } = useTheme();
        return (
          <Heading
            padding={`${tokens.space.xl} 0 0 ${tokens.space.xl}`}
            level={3}
          >
            Enter Information:
          </Heading>
        );
      },
      Footer() {
        return <Text>Footer Information</Text>;
      },
    },
  };

  const formFields = {
    signIn: {
      username: {
        labelHidden: false,
        placeholder: "Enter your email",
      },
    },
    signUp: {
      password: {
        labelHidden: false,
        label: "Password:",
        placeholder: "Enter your Password:",
        isRequired: false,
        order: 2,
      },
      confirm_password: {
        labelHidden: false,
        label: "Confirm Password:",
        order: 1,
      },
    },
    forceNewPassword: {
      password: {
        labelHidden: false,
        placeholder: "Enter your Password:",
      },
    },
    resetPassword: {
      username: {
        labelHidden: false,
        placeholder: "Enter your email:",
      },
    },
    confirmResetPassword: {
      confirmation_code: {
        labelHidden: false,
        placeholder: "Enter your Confirmation Code:",
        label: "New Label",
        isRequired: false,
      },
      confirm_password: {
        labelHidden: false,
        placeholder: "Enter your Password Please:",
      },
    },
    setupTOTP: {
      QR: {
        totpIssuer: "test issuer",
        totpUsername: "amplify_qr_test_user",
      },
      confirmation_code: {
        labelHidden: false,
        label: "New Label",
        placeholder: "Enter your Confirmation Code:",
        isRequired: false,
      },
    },
    confirmSignIn: {
      confirmation_code: {
        labelHidden: false,
        label: "New Label",
        placeholder: "Enter your Confirmation Code:",
        isRequired: false,
      },
    },
  };
  return (
      <Authenticator formFields={formFields} components={components}>
        {() => (
          <Switch>
            <PrivateRoutes
              {...defaultPrivateRoutesProps}
              path="/admin"
              redirectPath="/admin"
              component={Main}
              role="Admin"
            />
            <PrivateRoutes
              {...defaultPrivateRoutesProps}
              path="/dashboard"
              redirectPath="/dashboard"
              component={Main}
              role="Dashboard"
            />
            <PrivateRoutes
              {...defaultPrivateRoutesProps}
              redirectPath="/practitioner"
              path="/practitioner"
              component={Main}
              role="Practitioner"
            />
            <PrivateRoutes
              {...defaultPrivateRoutesProps}
              redirectPath="/business"
              path="/business"
              component={Main}
              role="Business"
            />
            <PrivateRoutes
              {...defaultPrivateRoutesProps}
              redirectPath="/organizations"
              path="/organizations"
              component={Main}
              role="Organizations"
            />
            <PrivateRoutes
              {...defaultPrivateRoutesProps}
              redirectPath="/mentors"
              path="/mentors"
              component={Main}
              role="Mentor"
            />
            <PrivateRoutes
              {...defaultPrivateRoutesProps}
              redirectPath="/sync"
              path="/sync"
              component={Main}
              role="PayrollSync"
            />

            <Route path="/login" component={Main} />
            <Redirect
              to={{
                pathname: "/login",
                state: { from: "/" },
              }}
            />
            <Redirect to="/login" />
          </Switch>
        )}
      </Authenticator>
  );
};
