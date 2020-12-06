import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Container,
  Button,
  Row,
  Col,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import FormWrapper from "../Form/FormWrapper";
import image from "../../../asset/images/form-images/register.png";
import { Redirect } from "react-router-dom";
import queryString from "query-string";
import moment from "moment";
import FormLayout from "../layout/FormLayout";
// eslint-disable-next-line no-unused-vars
import momentTimezone from "moment-timezone";
import Select from "react-select";
import { resetStore } from "../../store/actions/action";
class RegisterComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      paramEmail: "",
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      errorText: "",
      error: {},
      isLoading: false,
      isSent: false,
      is_redirect: undefined,
      verified_status: undefined,
      attendiee: "",
      meetingInvited: false,
      calender: "",
      isRegister: false,
    };
  }
  componentDidMount() {
    const {
      verifyOrganizationUserToken,
      location,
      loginOrRegisterParticipant,
      email,
      setLoginCredentials,
      setAccountType,
    } = this.props;
    const isLogin = localStorage.getItem("isLogin");
    // const { resetStore } = this.props;

    resetStore();
    // localStorage.clear();

    if (isLogin) {
      this.setState({ verified_status: true });
    } else {
      const values = queryString.parse(location.search);
      const tokenObj = {
        token: values.token,
      };
      const { history } = this.props;
      if (values && values.type === "meeting") {
        loginOrRegisterParticipant({
          id: values.id,
          token: values.token,
        }).then((result) => {
          const { status, data, email: attendie, exists } = result.payload.data;
          console.log(
            "result.payload.dataresult.payload.datacgdfhjfghjghj",
            result.payload.data
          );
          if (status === 200) {
            setLoginCredentials({
              name: data.name,
              email: data.email,
            });
            const isLogin = localStorage.getItem("isLogin");
            if (
              isLogin === "true" &&
              data.email &&
              email === data.email &&
              (data.license || data.organization_id)
            ) {
              this.setState({ verified_status: true });
            } else if (data.license || data.organization_id) {
              this.setState({
                isLicensedUser: true,
                is_redirect: false,
                licensedMail: data.email,
              });
              setAccountType(true);
            } else {
              this.setState({ is_redirect: false });
              if (exists) {
                history.push("/");
              }
            }
          } else if (status === 400) {
            this.setState({ attendiee: attendie });
          }
        });
      } else {
        if (location.search !== "") {
          verifyOrganizationUserToken(tokenObj).then((result) => {
            console.log(
              "result.payload.dataresult.payload.data5654654654",
              result.payload.data
            );
            const { setOrganizationIdVerifyEmail } = this.props;
            let email = result.payload.data.email;
            let organizationId = values.oid;
            console.log("organizationIdorganizationId", organizationId);
            if (result.payload.status === 200) {
              setAccountType(true);
              setOrganizationIdVerifyEmail(organizationId);
              // this.props.history.push("/view")
            }

            const isAlreadyRegistered =
              result.payload.data.userAlreadyRegistered;
            if (isAlreadyRegistered) {
              history.push("/");
              this.setState({
                paramEmail: email,
                // is_redirect: false,
              });
            } else {
              this.setState({
                paramEmail: email,
              });
            }
          });
        }
      }
    }
  }

  handleInput = (e, fieldName) => {
    if (fieldName === "calender") {
      this.setState({
        [fieldName]: e.value,
      });
    } else
      this.setState({
        error: {},
        [fieldName]: e.target.value,
      });
  };

  validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  onRegister = (e) => {
    e.preventDefault();
    const {
      name,
      email,
      password,
      confirmPassword,
      attendiee,
      calender,
    } = this.state;

    let error = {
      name: false,
      email: false,
      password: false,
      confirmPassword: false,
      calender: false,
    };

    if (name === "") {
      error.name = true;
    }

    if (!this.state.paramEmail) {
      if (email === "") {
        error.email = true;
      }

      if (email !== "") {
        if (!this.validateEmail(email)) {
          error.email = true;
        }
      }
    }

    if (password === "") {
      error.password = true;
    }
    if (password !== "") {
      if (password.length < 6) {
        error.password = true;
      }
    }
    if (confirmPassword === "") {
      error.confirmPassword = true;
    }

    if (password !== confirmPassword) {
      error.confirmPassword = true;
    }
    if (calender === "") {
      error.calender = true;
    }
    this.setState({ error });

    if (
      !error.name &&
      !error.email &&
      !email.password &&
      !error.confirmPassword &&
      !error.calender
    ) {
      const timeZone = moment.tz.guess(true);
      const registerObj = {
        name,
        email: this.state.paramEmail ? this.state.paramEmail : email,
        password,
        is_verified:
          this.state.paramEmail || attendiee === email ? true : false,
        time_zone: timeZone,
        preferred_calender: calender,
      };
      this.props.signupApiAction(registerObj).then((result) => {
        console.log(
          "result.payload.dataresult.payload.datayjtyutyutyu",
          result.payload.data
        );

        if (result.payload.data.status === 200) {
          let res = true;
          if (!result.payload.data.data.is_redirect) {
            res = false;
          }
          const { location, setLoginCredentials } = this.props;
          const values = queryString.parse(location.search);

          if (values.token && values.token !== "" && values.oid) {
            localStorage.setItem("isLogin", false);
            this.setState({ verified_status: true });
            setLoginCredentials({
              name,
              email,
            });
          } else if (
            values.token &&
            values.token !== "" &&
            values.type &&
            values.type === "meeting"
          ) {
            localStorage.setItem("isLogin", false);
            setLoginCredentials({
              name,
              email,
            });
            let obj = {
              meetingInvited: true,
            };
            if (res) {
              // obj.isRegister = true;
              obj.is_redirect = result.payload.data.data.is_redirect;
            }

            this.setState(obj);
          }
          // console.log("dgsfhdsgs", res);
          if (res) {
            this.setState({
              isRegister: true,
            });
          }
        }
      });
    }
  };
  render() {
    const {
      error,
      isRegister,
      paramEmail,
      verified_status,
      is_redirect,
      meetingInvited,
    } = this.state;

    const isLogin = localStorage.getItem("isLogin");
    console.log("sghfjgdfhgjdf456546gjidfgjkdjfg", isRegister);
    const Calenders = [
      { value: "Google", label: "Google" },
      { value: "Outlook", label: "Outlook" },
    ];
    const fieldData = [
      {
        name: "name",
        label: "Name",
        placeholder: "Name",
        type: "text",
        errorText: "Name is empty",
      },
      {
        name: "email",
        label: "Email Address",
        placeholder: "Email Address",
        type: "email",
        errorText: "Email Incorrect",
      },
      {
        name: "password",
        label: "Password",
        placeholder: "Password",
        type: "password",
        errorText: "Password must be atleast of length 6",
      },
      {
        name: "confirmPassword",
        label: "Confirm Password",
        placeholder: "Confirm Password",
        type: "password",
        errorText: "Password doesn't match",
      },
      {
        name: "preferredCalender",
        label: "Preferred Calendar",
        placeholder: "Please select calendar",
        type: "password",
        errorText: "Please select One Calender",
      },
    ];
    console.log("hfghhffgufug", isRegister, meetingInvited);
    if (isRegister) {
      return (
        <Redirect
          to={{
            pathname: "/verify-email",
            state: { from: "signUp" },
          }}
        />
      );
    }
    return (
      <>
        <FormLayout>
          {isRegister && (
            <Redirect
              to={{
                pathname: "/verify-email",
                state: { from: "signUp" },
              }}
            />
          )}

          {meetingInvited && <Redirect to="/account-type" />}
          {/* {!is_redirect && is_redirect !== undefined && <Redirect to="/" />} */}
          {verified_status && <Redirect to="/view" />}
          {/* {isLogin && <Redirect to="/view" />} */}
          <Container>
            <div className="from-screen">
              <div className="img">
                <img src={image} alt="registerImg" />
              </div>
              <FormWrapper className="register" title="Get started for free!">
                <div className="input-wrap">
                  {fieldData.map((data, i) => {
                    return data.name !== "preferredCalender" ? (
                      <FormGroup key={i}>
                        <Label for={data.name} className="required">
                          {data.label}
                        </Label>
                        <Input
                          type={data.type}
                          name={data.name}
                          placeholder={data.placeholder}
                          value={
                            data.name === "email" && paramEmail
                              ? paramEmail
                              : this.state[data.name]
                          }
                          onChange={(e) => this.handleInput(e, data.name)}
                          readOnly={
                            data.name === "email" && paramEmail ? true : false
                          }
                        />
                        {error[data.name] && (
                          <span className="text-danger">{data.errorText}</span>
                        )}
                      </FormGroup>
                    ) : (
                      <FormGroup>
                        <Label for={data.name} className="required">
                          {data.label}
                        </Label>
                        <Select
                          value={Calenders.filter(
                            (option) => option.value === this.state.calender
                          )}
                          options={Calenders}
                          className="popup-select"
                          onChange={(e) => this.handleInput(e, "calender")}
                        />
                        {error.calender && (
                          <span className="text-danger">
                            {"Please select calender"}
                          </span>
                        )}
                      </FormGroup>
                    );
                  })}
                </div>
                <center>
                  <Button color="gradient" onClick={(e) => this.onRegister(e)}>
                    Sign up
                  </Button>
                </center>
                <div>
                  <p className="bottom-text">
                    Already have account?<Link to="/">Log In</Link>
                  </p>
                </div>
              </FormWrapper>
            </div>
          </Container>
        </FormLayout>
      </>
    );
  }
}

export default withRouter(RegisterComponent);
