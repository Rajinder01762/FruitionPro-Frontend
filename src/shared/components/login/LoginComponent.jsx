import React, { Component } from "react";
import ReactLoginMS from "react-ms-login";
import { Container, Button } from "reactstrap";
import FormWrapper from "../Form/FormWrapper";
import { Link } from "react-router-dom";
import { FormGroup, Label, Input } from "reactstrap";
import image from "../../../asset/images/form-images/loginImage.png";
import GoogleLogin from "react-google-login";
import moment from "moment";
import FormLayout from "../layout/FormLayout";
// eslint-disable-next-line no-unused-vars
import momentTimezone from "moment-timezone";
import { Redirect } from "react-router-dom";
import MicrosoftLogin from "react-microsoft-login";
import { gClientId, msClientId, frontendUrl } from "../../../api";
import { resetStore } from "../../store/actions/action";
export default class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      emailError: "Incorrect Email",
      passwordError: "Password must be atleast of length 6",
      error: {},
      isLoading: false,
    };
  }
  componentDidMount() {
    // const { resetStore } = this.props;

    resetStore();
    localStorage.clear();
  }
  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  onLogin = (e) => {
    console.log("onLoginonLoginonLoginonLoginonLogin");
    e.preventDefault();
    const { email, password } = this.state;
    const { history } = this.props;
    let error = {
      email: false,
      password: false,
    };
    if (email === "") {
      error.email = true;
    }

    if (email !== "") {
      if (!this.validateEmail(email)) {
        error.email = true;
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
    this.setState({ error });
    if (!error.email && !error.password) {
      this.setState({
        isLoading: true,
      });
      const timeZone = moment.tz.guess(true);
      const { organizationId } = this.props;
      const loginObj = {
        email,
        password,
        id: organizationId ? organizationId : "",
        time_zone: timeZone,
      };

      this.props.loginApiAction(loginObj).then((result) => {
        if (result.payload.data.status === 200) {
          localStorage.setItem("isLogin", true);
          history.push("/view");
        }
      });
    }
  };

  responseGoogle = async (response, type) => {
    let socialObj = {};
    const timeZone = moment.tz.guess(true);
    const { history } = this.props;
    if (type === "mslogin") {
      socialObj = {
        type: "microsoft",
        loginAccessToken:
          response &&
          response.authResponseWithAccessToken &&
          response.authResponseWithAccessToken.accessToken,
        time_zone: timeZone,
      };
    } else {
      socialObj = {
        type: "google",
        loginAccessToken:
          (response && response.Zi && response.Zi.id_token) ||
          (response && response.tokenObj && response.tokenObj.id_token),
        eventAccessToken: response && response.accessToken,
        time_zone: timeZone,
      };
    }

    const {
      socialLogin,
      setUserId,
      setAccessToken,
      setAccountType,
    } = this.props;
    socialLogin(socialObj).then((result) => {
      const { exist, status } = result.payload.data;
      if (status === 200) {
        if (type === "mslogin") {
          setAccessToken(response.access_token);
        } else {
          setAccessToken(response.accessToken);
        }
        localStorage.setItem("isLogin", true);
        if (exist) {
          // setAccountType(true);
        } else {
          if (result.payload.data.status === 200) {
            const { user } = result.payload.data.data;
            const data =user && user._id;
            setUserId(data);
          }
        }
        history.push("/view");
      }
    });
  };
  authHandler = (err, authData) => {
    if (authData) {
      this.responseGoogle(authData, "mslogin");
    }
  };
  render() {
    const { email, password, emailError, passwordError, error } = this.state;

    return (
      <>
        <FormLayout>
          <Container>
            <div className="from-screen">
              <div className="img">
                <img src={image} alt="loginImg" />
              </div>
              <FormWrapper title="Get started for free!">
                <div className="input-wrap">
                  <FormGroup>
                    <Label for="emailAddress" className="required">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      value={email}
                      placeholder="Email Address"
                      onChange={(e) => this.handleInput(e)}
                    />
                    {error.email && (
                      <span className="text-danger">{emailError}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="password" className="required">
                      Password
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      value={password}
                      placeholder="Password"
                      onChange={(e) => this.handleInput(e)}
                    />
                    {error.password && (
                      <span className="text-danger">{passwordError}</span>
                    )}
                  </FormGroup>
                  <div className="text-right f-pass-wrap">
                    <Link to="/forgot" className="forgot">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="social-login">
                    <p className="diff-text">or</p>
                    <div className="btnHolder">
                      <div className="btn-item">
                        <GoogleLogin
                          clientId={gClientId}
                          buttonText=""
                          scope="https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/contacts"
                          onSuccess={(response) =>
                            this.responseGoogle(response, "google")
                          }
                          onFailure={(err) => {
                            console.log(err);
                          }}
                          cookiePolicy={"single_host_origin"}
                          className="google-icon"
                        />
                      </div>
                      <div className="btn-item">
                        <MicrosoftLogin
                          className="msBtn"
                          clientId={msClientId}
                          authCallback={this.authHandler}
                          redirectUri={`${frontendUrl}/view`}
                          graphScopes={[
                            "user.read",
                            "Calendars.ReadWrite",
                            "Mail.Read",
                            "User.Read.All",
                            "Contacts.Read",
                            "Contacts.ReadWrite",
                          ]}
                          // prompt={"login" | "select_account" | "consent" | "none"}
                          prompt={"select_account"}
                          buttonTheme="light_short"
                        />

                        {/* <ReactLoginMS
                          clientId={msClientId}
                          redirectUri={`${frontendUrl}/authComplete.html`}
                          scopes={[
                            "user.read",
                            "Calendars.ReadWrite",
                            "Mail.Read",
                            "User.Read.All",
                            "Contacts.Read",
                            "Contacts.ReadWrite"
                          ]}
                          responseType="token"
                          btnContent="MS Login"
                          handleLogin={data => {
                            this.responseGoogle(data, "mslogin");
                          }}
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>
                <center>
                  <Button
                    type="submit"
                    color="gradient"
                    onClick={(e) => this.onLogin(e)}
                  >
                    Log in
                  </Button>
                </center>
                <div>
                  <p className="bottom-text">
                    Don’t have account?<Link to="/register">Sign Up</Link>
                  </p>
                  <p className="bottom-text mt-0">
                    Haven't got the mail?
                    <Link to="/verification-email">Resend Mail</Link>
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
