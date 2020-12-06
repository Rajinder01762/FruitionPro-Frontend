import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import FormWrapper from "../Form/FormWrapper";
import { FormGroup, Label, Input } from "reactstrap";
import image from "../../../asset/images/form-images/loginImage.png";
import forgotIcon from "../../../asset/images/icons/Forgot-Password.svg";
import { Redirect } from "react-router-dom";
import FormLayout from "../layout/FormLayout";
// import Loader from 'react-loader-spinner'
// import { forgotPassword } from '../../../api/index'
export default class ForgotComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      errorType: false,
      errorText: "Incorect Email",
      isRedirect: false
    };
  }

  handleInput = e => {
    this.setState({
      errorType: false,
      [e.target.name]: e.target.value
    });
  };
  validateEmail = email => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  onForgot = e => {
    const { email, errorType } = this.state;
    if (email === "") {
      this.setState({ errorType: true });
      return;
    }

    if (email !== "") {
      if (!this.validateEmail(email)) {
        this.setState({ errorType: true });
        return;
      }
    }
    if (!errorType) {
      const forgotObj = {
        email
      };
      this.props.forgotPassApi(forgotObj).then(result => {
        if (result.payload.data.status === 200) {
          this.setState({
            isRedirect: true
          });
        }
      });
    }
  };

  render() {
    const { email, errorText, errorType, isRedirect } = this.state;

    return (
      <>
        <FormLayout>
          {isRedirect && <Redirect to="/" />}
          <Container className=" forgot-screen">
            <div className="from-screen">
              <div className="img">
                <img src={image} alt="forgotIcon" />
              </div>
              <FormWrapper title="Forgot your password?">
                <div className="content-wrap">
                  <div className="text-center forgot-icon">
                    <img src={forgotIcon} alt="" />
                  </div>
                  <p className="content">
                    Enter the email address associated with your account
                  </p>
                  <div className="forgot-wrap">
                    <FormGroup>
                      <Label for="emailAddress" className="required">
                        Email Address
                      </Label>
                      <Input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email Address"
                        onChange={e => this.handleInput(e)}
                      />
                      {errorType && (
                        <span className="text-danger">{errorText}</span>
                      )}
                    </FormGroup>
                  </div>
                  <center>
                    <Button
                      color="gradient"
                      onClick={e => {
                        this.onForgot(e);
                      }}
                    >
                      Send
                    </Button>
                  </center>
                </div>
              </FormWrapper>
            </div>
          </Container>
        </FormLayout>
      </>
    );
  }
}
