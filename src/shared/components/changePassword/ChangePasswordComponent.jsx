import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import FormWrapper from "../Form/FormWrapper";
import { FormGroup, Label, Input } from "reactstrap";
import image from "../../../asset/images/form-images/register.png";
import changePasswordIcon from "../../../asset/images/icons/New-Password.svg";
import queryString from "query-string";
import { Redirect } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

export default class ChangePasswordComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      passwordError: "Password must be atleast of length 6",
      confirmPassword: "",
      confirmPasswordError: "Password does not match",
      isMatch: false,
      data: false,
      isLoading: true,
      error: {},
      id: "",
      token: "",
      isChange: false
    };
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    const values = queryString.parse(this.props.location.search);
    this.setState({
      id: values.id,
      token: values.token
    });
    let verifyObj = {
      id: values.id,
      token: values.token
    };
    const { verifyResetPasswordApi } = this.props;
    verifyResetPasswordApi(verifyObj).then(result => {
      if (result.payload.data.status === 401) {
        this.setState({ isMatch: true });
      }
    });
  }

  handleInput = e => {
    this.setState({
      error: {},
      [e.target.name]: e.target.value
    });
  };
  onResetPassword = e => {
    const { password, confirmPassword, id } = this.state;
    let error = {
      password: false,
      confirmPassword: false
    };
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
    this.setState({ error });
    if (!error.password && !error.confirmPassword) {
      const changePassObj = {
        id,
        password
      };
      const { resetPasswordApi } = this.props;
      resetPasswordApi(changePassObj).then(result => {
        if (result.payload.data.status === 200) {
          this.setState({ isChange: true });
        }
      });
    }
  };
  render() {
    const {
      password,
      confirmPassword,
      isMatch,
      error,
      passwordError,
      confirmPasswordError,
      isChange
    } = this.state;
    if (isChange || isMatch) {
      return <Redirect to="/" />;
    }
    return (
      <>
        <FormLayout>
          {/* {(isChange || !isMatch || passChange )&& <Redirect to="/" />} */}
          <Container className=" chPass-screen">
            <div className="from-screen">
              <div className="img">
                <img src={image} alt="changePassImg" />
              </div>
              <FormWrapper title="Change your password?">
                <div className="text-center changePassIcon">
                  <img src={changePasswordIcon} alt="changePassImg" />
                </div>

                <div className="inp-wrapper">
                  <FormGroup>
                    <Label for="password" className="required">
                      New Password
                    </Label>
                    <Input
                      type="password"
                      name="password"
                      value={password}
                      placeholder="New Password"
                      onChange={e => this.handleInput(e)}
                    />
                    {error.password && (
                      <span className="text-danger">{passwordError}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="confirmpassword" className="required">
                      Confirm Password
                    </Label>
                    <Input
                      type="password"
                      name="confirmPassword"
                      value={confirmPassword}
                      placeholder="Confirm Password"
                      onChange={e => this.handleInput(e)}
                    />
                    {error.confirmPassword && (
                      <span className="text-danger">
                        {confirmPasswordError}
                      </span>
                    )}
                  </FormGroup>
                </div>
                <center>
                  <Button
                    color="gradient"
                    onClick={e => {
                      this.onResetPassword(e);
                    }}
                  >
                    Confirm
                  </Button>
                </center>
              </FormWrapper>
            </div>
          </Container>
        </FormLayout>
      </>
    );
  }
}
