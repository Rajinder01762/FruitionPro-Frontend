import React, { Component } from "react";
import {
  Container,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Button,
} from "reactstrap";
import Logo from "../../../asset/images/dashboard-icons/logo.png";
import { Link, Redirect } from "react-router-dom";
import { FormGroup, Label, Input } from "reactstrap";
import accountImage from "../../../asset/images/form-images/account.png";
import KeyIcon from "../../../asset/images/icons/Key.png";
import IndividualIcon from "../../../asset/images/icons/Individual.png";
import CheckedIcon from "../../../asset/images/icons/checked.png";
import OrganizationIcon from "../../../asset/images/icons/Organization.png";
import classnames from "classnames";
import SubscriptionPlansModal from "../subscription/subscriptionPlansModal";
import { withRouter } from "react-router-dom";
import FormLayout from "../layout/FormLayout";

class AccountTypeComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 0,
      activeTab: "1",
      licenceKey: "",
      isError: false,
      errorText: "Please enter a licence key",

      isSubscriptionModal: false,
    };
  }

  // componentDidMount() {

  //   const { registerUser, history, userDetails } = this.props;
  //   if (!registerUser.userId || !userDetails.email) {
  //     history.push("/");
  //   }
  // }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onSelectOrganisation = (e) => {
    const { history } = this.props;
    console.log("bcvcmxvmhbvbbdnvbndghurgudfg");
    e.preventDefault();
    const { licenceKey, activeTab } = this.state;
    if (activeTab === "1") {
      const {
        selectUserType,
        registerUser,
        setLoginCredentials,
        setSession,
        setAccountType,
        userDetails,
      } = this.props;
      if (licenceKey === "") {
        this.setState({ isError: true });
        return;
      }

      const userTypeObj = {
        id: registerUser.userId,
        type: activeTab === "1" ? "individual" : "organisation",
        license: licenceKey,
        email: registerUser.email || userDetails.email,
      };

      selectUserType(userTypeObj).then((result) => {
        if (result.payload.data.status === 200) {
          localStorage.setItem("isLogin", true);
          const { data } = result.payload.data;

          setAccountType(true);
          const loginObj = {
            email: data.email,
            name: data.name,
          };
          const sessionObj = {
            token: data.token,
            email_token: data.email_token,
          };
          setLoginCredentials(loginObj);
          setSession(sessionObj);
        }
      });
    } else {
      history.push("/organization-detail");
    }
  };

  toggleSubscriptionModal = () => {
    // e.preventDefault();
    this.setState({
      isSubscriptionModal: !this.state.isSubscriptionModal,
    });
  };

  render() {
    const {
      licenceKey,
      isError,
      errorText,

      isSubscriptionModal,
    } = this.state;
    const { isTypeSet, setUserAccount } = this.props;
    return (
      <>
        <FormLayout>
          {isTypeSet && <Redirect to="/view" />}

          <Container>
            <div className="account-form-screen">
              <div className="img">
                <img src={accountImage} alt="accountImg" />
              </div>
              <div className="account-type-content">
                <div className="account-heading">
                  <h4>Select Type</h4>
                </div>
                <div className="account-type-content-wrapper">
                  <Nav tabs>
                    <NavItem
                      onClick={(e) => {
                        e.preventDefault();
                        setUserAccount("individual");
                      }}
                    >
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "1",
                        })}
                        onClick={() => {
                          this.toggle("1");
                        }}
                      >
                        <img
                          src={IndividualIcon}
                          alt="individualIcon"
                          className="tab-icon ind"
                        />
                        <span>
                          Individual
                          <img
                            src={CheckedIcon}
                            alt="checkedIcon"
                            className="org-success"
                          />
                        </span>
                      </NavLink>
                    </NavItem>
                    <NavItem
                      onClick={(e) => {
                        e.preventDefault();
                        setUserAccount("organization");
                      }}
                    >
                      <NavLink
                        className={classnames({
                          active: this.state.activeTab === "2",
                        })}
                        onClick={() => {
                          this.toggle("2");
                        }}
                      >
                        <img
                          src={OrganizationIcon}
                          alt="tab-icon org"
                          className="tab-icon org"
                        />
                        <span>
                          Organization
                          <img
                            src={CheckedIcon}
                            alt="checkedIcon"
                            className="org-success"
                          />
                        </span>
                      </NavLink>
                    </NavItem>
                  </Nav>
                </div>
                <TabContent activeTab={this.state.activeTab}>
                  <TabPane tabId="1">
                    <FormGroup>
                      <Label for="" className="required">
                        License Key
                      </Label>
                      <div className="key-wrap">
                        <Input
                          type="text"
                          name="licenceKey"
                          onChange={(e) => this.onChange(e)}
                          value={licenceKey}
                          placeholder="Enter license key"
                          className="license-key"
                        />
                        {isError && (
                          <span className="text-danger">{errorText}</span>
                        )}
                        <img src={KeyIcon} alt="keyIcon" className="key" />
                        {/* <img src={CheckedIcon} alt="checkedIcon" className="checked" />  */}
                      </div>
                    </FormGroup>
                    <div>
                      <p className="bottom-text text-right">
                        Don’t have License key?
                        <Link
                          onClick={(e) => this.toggleSubscriptionModal(e)}
                          href
                        >
                          Buy Now
                        </Link>
                      </p>
                    </div>
                  </TabPane>
                  <TabPane tabId="2">
                    {/* <div>Special Title Treatment</div> */}
                  </TabPane>
                </TabContent>
                <center>
                  <Button
                    color="gradient"
                    onClick={(e) => this.onSelectOrganisation(e)}
                  >
                    Next
                  </Button>
                </center>
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
export default withRouter(AccountTypeComponent);
