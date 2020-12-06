import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import MoreIcon from "../../icons/moreIcon";
// import image from '../../../asset/images/form-images/login.png'
// import SuccessIcon from '../../../asset/images/icons/success-icon.svg'
import PlusIcon from "../../../asset/images/dashboard-icons/plus.png";
import GoogleLogin from "react-google-login";
import ReactLoginMS from "react-ms-login";
// import { url } from 'inspector';
import MicrosoftLogin from "react-microsoft-login";
import { gClientId, msClientId, frontendUrl } from "../../../api";

export default class ContactsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      id: "",
    };
    this.toggle = this.toggle.bind(this);
    this.dropdownToggle = this.dropdownToggle.bind(this);
    this.accordion = this.accordion.bind(this);
  }

  componentDidMount() {
    const { fetchContacts, userDetails } = this.props;
    const obj = {
      email: userDetails.email,
    };
    fetchContacts(obj);
  }

  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  };

  accordion() {
    this.setState((state) => ({ collapse: !state.collapse }));
  }

  dropdownToggle(id) {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
      id,
    }));
  }
  responseGoogle = (response, type) => {
    const { userDetails, importSocialContacts } = this.props;
    if (type === "google") {
      const obj = {
        accessToken: response.accessToken,
        type,
        email: userDetails.email,
      };

      importSocialContacts(obj);
    } else if (type === "microsoft") {
      const obj = {
        accessToken: response.access_token,
        type,
        email: userDetails.email,
      };
      importSocialContacts(obj);
    }
    this.setState({
      modal: false,
    });
  };
  onDeleteContact = (e, id) => {
    e.preventDefault();
    const { deleteContact } = this.props;
    const deleteObj = {
      id,
    };
    deleteContact(deleteObj);
  };

  authHandler = (err, authData) => {
    if (authData) {
      this.responseGoogle(authData, "microsoft");
    }
  };
  render() {
    const { id } = this.state;
    const { contacts } = this.props.meetingReducer;
    return (
      <>
        <div className="dashboard-wrapper">
          <div className="dashboard-content">
            <div className="dashboard-title">
              <h2>Contacts Details</h2>
            </div>
            <div className="text-center import-btn">
              <Button className="meeting-btn" onClick={this.toggle}>
                Import Contacts
              </Button>
            </div>
            <hr />
            <div className="contact-list">
              <ul className="meetings-list">
                {contacts &&
                  contacts.length > 0 &&
                  contacts.map((item, index) => {
                    return (
                      <div>
                        <li key={index}>
                          <div className="meeting-content">
                            <div className="meeting-details">
                              <h3>
                                {item.name ? item.name.toUpperCase() : ""}
                              </h3>
                              <p className="phone">
                                {item.contact ? item.contact : ""}
                              </p>
                              <p>{item.email ? item.email : ""}</p>
                            </div>
                          </div>
                          <div className="user-edit">
                            <Dropdown
                              isOpen={
                                this.state.dropdownOpen && id === item._id
                              }
                              toggle={() => this.dropdownToggle(item._id)}
                            >
                              <DropdownToggle>
                                <MoreIcon />
                              </DropdownToggle>
                              <DropdownMenu>
                                {/* <DropdownItem >Modify</DropdownItem>
                                    <DropdownItem divider /> */}
                                <DropdownItem
                                  onClick={(e) =>
                                    this.onDeleteContact(e, item._id)
                                  }
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </div>
                        </li>
                      </div>
                    );
                  })}
              </ul>
            </div>
            <Modal
              isOpen={this.state.modal}
              toggle={this.toggle}
              className="meetings-modal contact-modal"
            >
              <ModalHeader toggle={this.toggle}>
                Create/Import Contacts
              </ModalHeader>
              <ModalBody>
                <div className="meetings-content">
                  <img src={PlusIcon} alt="noImg" />
                  <span>Create new contact</span>
                </div>
                <div className="meetings-content">
                  <GoogleLogin
                    clientId={gClientId}
                    buttonText=""
                    scope="https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/contacts"
                    onSuccess={(response) =>
                      this.responseGoogle(response, "google")
                    }
                    onFailure={(err) => {}}
                    cookiePolicy={"single_host_origin"}
                    className="google-icon"
                  />
                </div>
                <div className="meetings-content">
                  <MicrosoftLogin
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
                  />
                  {/* <ReactLoginMS
                    clientId={msClientId}
                    redirectUri={`${frontendUrl}/authComplete.html`}
                    scopes={["user.read", "Calendars.ReadWrite", "Mail.Read", "User.Read.All", "Contacts.Read", "Contacts.ReadWrite"]}
                    responseType="token"
                    btnContent="MS Login"
                    handleLogin={data => {
                      this.responseGoogle(data, 'microsoft');
                    }}
                  /> */}
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </>
    );
  }
}
