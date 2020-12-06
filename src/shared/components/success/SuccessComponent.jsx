import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import FormWrapper from "../Form/FormWrapper";
import image from "../../../asset/images/form-images/login.png";
import SuccessIcon from "../../../asset/images/icons/success-icon.svg";
import { Redirect } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

export default class SuccessComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isRedirect: false
    };
  }
  onDone = e => {
    const { setSentMail } = this.props;
    setSentMail();
    this.setState({ isRedirect: true });
  };
  render() {
    const { isRedirect } = this.state;
    return (
      <>
        <FormLayout>
          {isRedirect && <Redirect to="/" />}
          <Container className="success-form">
            <div className="from-screen">
              <div className="img">
                <img src={image} alt="successImg" />
              </div>
              <FormWrapper title="Successfully Sent">
                <div className="content-wrap">
                  <div>
                    <div className="text-center success-icon">
                      <img src={SuccessIcon} alt="successImg" />
                    </div>
                    <p className="success-content">
                      We have sent you a verificaiton link, please click on the
                      link to reset your password
                    </p>
                  </div>
                  <center>
                    <Button
                      onClick={e => {
                        this.onDone(e);
                      }}
                      color="gradient"
                    >
                      Done
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
