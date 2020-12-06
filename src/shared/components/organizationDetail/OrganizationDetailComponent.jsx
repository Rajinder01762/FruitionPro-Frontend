import React, { Component } from "react";
import { Container, Button } from "reactstrap";
import { Link, Redirect } from "react-router-dom";

import { FormGroup, Label, Input } from "reactstrap";
import accountImage from "../../../asset/images/form-images/account.png";
import KeyIcon from "../../../asset/images/icons/Key.png";
// import CheckedIcon from '../../../asset/images/icons/checked.png';
import UploadIcon from "../../../asset/images/icons/Upload.png";
import { onFileUpload } from "../../util/fileUpload";
import Loader from "react-loader-spinner";
import SubscriptionPlansModal from "../subscription/subscriptionPlansModal";
import { withRouter } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

class OrganizationDetailComponent extends Component {
  state = {
    name: "",
    license: "",
    email: "",
    error: {},
    file: null,
    isUploading: false,
    isSubscriptionModal: false,
    isBack: false,
  };

  // componentDidMount() {
  //   const { registerUser, history, userDetails } = this.props;
  //   if (!registerUser.userId || !userDetails.email) {
  //     history.push("/");
  //   }
  // }

  validateEmail = (email) => {
    let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  submit = (e) => {
    e.preventDefault();

    const { selectOrganization, registerUser } = this.props;
    const { name, license, email, file } = this.state;

    let error = {
      name: false,
      license_key: false,
      email: false,
    };

    if (name === "") {
      error.name = true;
    }

    if (license === "") {
      error.license = true;
    }

    if (email === "") {
      error.email = true;
    }

    if (email !== "") {
      if (!this.validateEmail(email)) {
        error.email = true;
      }
    }

    this.setState({ error });
    if (!error.name && !error.email && !error.license_key) {
      const { setLoginCredentials, setSession, setAccountType } = this.props;
      const organizationObj = {
        id: registerUser.userId,
        name,
        email,
        license,
        logo: file,
      };
      selectOrganization(organizationObj).then((result) => {
        if (result.payload.data.status === 200) {
          localStorage.setItem("isLogin", true);

          setAccountType(true);
          const { data } = result.payload.data;
          const { user } = data;
          const loginObj = {
            email: user.email,
            name: user.name,
          };
          const sessionObj = {
            token: user.token,
            email_token: user.email_token,
          };
          setLoginCredentials(loginObj);
          setSession(sessionObj);
        }
      });
    }
  };

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  handleFileUpload = (e) => {
    this.setState({
      isUploading: true,
    });
    onFileUpload(e.target.files[0]).then((res) => {
      if (res) {
        this.setState({ file: res, isUploading: false });
      }
    });
  };

  toggleSubscriptionModal = () => {
    // e.preventDefault();
    this.setState({
      isSubscriptionModal: !this.state.isSubscriptionModal,
    });
  };
  backButton = () => {
    this.props.setUserAccount("individual");
    this.setState({
      isBack: true,
    });
  };
  render() {
    const {
      error,
      email,
      name,
      license,
      file,
      isUploading,
      isSubscriptionModal,
      isBack,
    } = this.state;
    const { isTypeSet } = this.props;
    if (isBack) {
      return <Redirect to="/account-type" />;
    }
    return (
      <>
        <FormLayout>
          {isTypeSet && <Redirect to="/view" />}

          <Container>
            <div className="account-form-screen">
              <div className="img">
                <img src={accountImage} alt="changePassImg" />
              </div>
              <div className="account-type-content organization-content">
                <div className="account-heading">
                  <h4>Organization Details</h4>
                </div>
                <div className="text-center upload-icon">
                  {isUploading ? (
                    <div className="doc-content">
                      <span style={{ textAlign: "center" }}>
                        <Loader
                          type="TailSpin"
                          color="#00BFFF"
                          height={60}
                          width={60}
                        />
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <div>
                      <input
                        type="file"
                        accept="image/x-png,image/gif,image/jpeg"
                        className="d-none"
                        id="f-upload"
                        onChange={this.handleFileUpload}
                      />
                      <label htmlFor="f-upload">
                        <div className="camera-icon">
                          <img
                            className="d-block"
                            src={file && file ? file : UploadIcon}
                            style={{
                              width: 100,
                              height: 100,
                              borderRadius: "100%",
                              objectFit: "cover",
                            }}
                            alt="UploadIcon"
                          />
                        </div>
                      </label>
                    </div>
                  )}
                </div>
                <div className="org-detail">
                  <FormGroup>
                    <Label for="" className="required">
                      Company Name
                    </Label>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Enter company name"
                      value={name}
                      onChange={(e) => this.handleInput(e)}
                    />
                    {error.name && (
                      <span className="text-danger">{"Name is empty"}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="" className="required">
                      Email
                    </Label>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => this.handleInput(e)}
                    />
                    {error.email && (
                      <span className="text-danger">{"Incorrect Email"}</span>
                    )}
                  </FormGroup>
                  <FormGroup>
                    <Label for="" className="required">
                      License Key
                    </Label>
                    <div className="key-wrap">
                      <Input
                        type="text"
                        name="license"
                        value={license}
                        onChange={(e) => this.handleInput(e)}
                        placeholder="Enter license key"
                        className="license-key"
                      />
                      {error.license && (
                        <span className="text-danger">
                          {"license key is empty"}
                        </span>
                      )}
                      <img src={KeyIcon} alt="keyIcon" className="key" />
                      {/* <img src={CheckedIcon} alt="checkedIcon" className="checked" /> */}
                    </div>
                  </FormGroup>
                  <div>
                    <p className="bottom-text text-right">
                      Don’t have License key?
                      <Link onClick={(e) => this.toggleSubscriptionModal(e)}>
                        Buy Now
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <Button
                    color="gradient"
                    className="backBtn"
                    onClick={this.backButton}
                  >
                    Back
                  </Button>
                  <Button color="gradient" onClick={this.submit}>
                    Next
                  </Button>
                </div>
                {/* <p className="mt-4 text-center logout-text">
                  Do you want to logout your account?
                  <a href="/logout" className="ml-2">
                    Logout
                  </a>
                </p> */}
              </div>
            </div>
          </Container>
          {isSubscriptionModal && (
            <SubscriptionPlansModal
              isOpen={isSubscriptionModal}
              isToggle={this.toggleSubscriptionModal}
            />
          )}
        </FormLayout>
      </>
    );
  }
}

export default withRouter(OrganizationDetailComponent);
