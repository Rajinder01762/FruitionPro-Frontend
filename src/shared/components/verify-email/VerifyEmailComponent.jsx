import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import FormWrapper from "../Form/FormWrapper";
import image from "../../../asset/images/form-images/loginImage.png";
import SuccessIcon from "../../../asset/images/icons/success-icon.svg";
import { Redirect } from "react-router-dom";
import Loader from "react-loader-spinner";
import queryString from "query-string";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

class VerifyEmailComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "",
      isRedirect: false,
      token: "",
      isLoading: false,
      data: false,
      isValid: false,
      isValidToken: true,
    };
  }

  componentDidMount() {
    const { location } = this.props;
    //    if (!location.state && !location.state.from && location.state.from !=='signUp'){
    const values = queryString.parse(location.search);
    if (values.id && values.token) {
      this.setState({
        id: values.id,
        token: values.token,
      });
      let verifyObj = {
        token: values.token,
        id: values.id,
      };

      const { verifyEmail, setLoginCredentials } = this.props;
      verifyEmail(verifyObj).then((result) => {
        const { status, data } = result.payload;
        if (status === 200) {
          const { history } = this.props;
          const loginObj = {
            email: data && data.email,
            name: data && data.name,
          };
          setLoginCredentials(loginObj);
          history.push("/account-type");
        }
      });
    }
  }
  goToLogin = (e) => {
    e.preventDefault();
    const { setRegisterSuccess, history } = this.props;
    setRegisterSuccess();
    history.push("/");
  };

  render() {
    const { isLoading } = this.props;
    const values = queryString.parse(this.props.location.search);
    if (Object.keys(values).length > 0 && !this.state.isValidToken) {
      return (
        <>
          <FormLayout>
            <Container>
              <div className="from-screen">
                <div className="img">
                  <img src={image} alt="successImg" />
                </div>
                <FormWrapper title="Invalid Token">
                  <div className="content-wrap">
                    <div>
                      <div className="text-center success-icon">
                        <img src={SuccessIcon} alt="successImg" />
                      </div>
                    </div>
                  </div>
                </FormWrapper>
              </div>
            </Container>
          </FormLayout>
        </>
      );
    }

    if (isLoading) {
      return (
        <div className="loader">
          <Loader type="TailSpin" color="#00BFFF" height={100} width={100} />
          <div className="load-text">Please wait ...</div>
        </div>
      );
    }
    return (
      <>
        <FormLayout>
          <Container>
            <div className="from-screen">
              <div className="img">
                <img src={image} alt="successImg" />
              </div>
              <FormWrapper title="Verification link sent to your email Successfully">
                <div className="content-wrap">
                  <div>
                    <div className="text-center success-icon">
                      <img src={SuccessIcon} alt="successImg" />
                    </div>
                    {
                      <p className="content">
                        Please check your email. Email is sent successfully
                      </p>
                    }
                  </div>
                  <center>
                    <Button onClick={(e) => this.goToLogin(e)} color="gradient">
                      Done
                    </Button>
                  </center>
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
export default withRouter(VerifyEmailComponent);
