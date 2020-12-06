import React, { Component } from "react";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import Logo from "../../../../../asset/images/dashboard-icons/logo.png";
import { connect } from "react-redux";
import NotesIcon from "../../../../icons/notesIcon";
import LogoutIcon from "../../../../icons/logoutIcon";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import { resetStore } from "../../../../store/actions/action";
import { logoutUser } from "../../../login/store/action";
import { updateMeeting } from "../../../createMeeting/store/action";
import { withRouter, Redirect } from "react-router-dom";
import PlusIcon from "../../../../../asset/images/dashboard-icons/plus.png";
import { importSocialMeetings, importSocialContacts } from "../../store/action";
import { fetchNotifications } from "../../../dashboard/store/action";
import {
  resetMeetingData,
  setPrivateNotes,
  sharePdf,
} from "../../../createMeeting/store/action";
import GoogleLogin from "react-google-login";
import ReactLoginMS from "react-ms-login";
import { togglePrivateNote } from "../../store/action";
import ModalContainer from "../../../modals";
import {
  fetchMeetings,
  setFetchMeetings,
  setMeetingsType,
} from "../../../dashboard/store/action";
import { setArchivedStatus } from "../../../taskManagement/store/action";
import menus from "./menus";
import _ from "lodash";
import MicrosoftLogin from "react-microsoft-login";
import { gClientId, msClientId, frontendUrl } from "../../../../../api";
import DropdownShareOptions from "./dropdownShareOptions";
import MeetingsPdf from "../../../createMeeting/pdf";
import { renderToString } from "react-dom/server";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogout: false,
      activeTab: this.getActiveTab(),
      modal: false,
      meetingModal: false,
      error: {},
      title: "",
      projects: "",
      department: "",
      topic: "",
      startDateTime: "",
      endDateTime: "",
      location: "",
      type: "Daily",
      dropdownOpen: false,
      isRadioOn: true,
      recurrenceState: "",
      // isVisible: this.props.isShowPrivateNotes
    };

    this.modalContainerRef = React.createRef();
    this.Invitetoggle = this.Invitetoggle.bind(this);
    this.handlePrivateNotes = this.handlePrivateNotes.bind(this);
  }

  MeetingModalToggle = () => {
    const { toggle } = this.props;
    this.setState({ modal: false });
    if (this.modalContainerRef.openModal) {
      this.modalContainerRef.openModal();
      this.props.resetMeetingData();
      toggle();
    }
  };
  RecurringToggle = () => {
    this.setState((prevState) => ({
      recurringModal: !prevState.recurringModal,
    }));
  };
  onChange = (date) => this.setState({ date });

  getActiveTab = () => {
    const { location } = this.props;
    if (location.pathname === "/view") {
      return 1;
    } else if (location.pathname === "/view/profile") {
      return 2;
    } else if (location.pathname === "/view/tasks") {
      return 4;
    } else if (location.pathname === "/view/manage-users") {
      return 3;
    } else if (location.pathname === "/view/report") {
      return 5;
    } else if (location.pathname === "/view/setting") {
      return 6;
    } else if (location.pathname === "/view/contacts") {
      return 7;
    }
  };

  Invitetoggle() {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  }

  onLogout = (e) => {
    e.preventDefault();
    const { logoutUser, resetStore } = this.props;
    if (window && window.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2 != null) {
        auth2.signOut().then(auth2.disconnect());
      }
    }
    resetStore();
    localStorage.clear();
    logoutUser();
    this.setState({ isLogout: true });
  };
  toggle = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal,
      error: "",
    }));
    this.props.resetMeetingData();
  };
  componentDidMount() {
    this.setState({ currentActivelink: this.props.location.pathname });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.location.pathname !== state.link) {
      const inx = _.findIndex(menus, { link: props.location.pathname });
      return { activeTab: inx + 1, currentActivelink: props.location.pathname };
    }

    return null;
  }

  setActiveTab = (e, tab, currentActivelink) => {
    const { toggleSidebar } = this.props;
    e.preventDefault();
    this.setState({ activeTab: tab, currentActivelink });
    toggleSidebar();
  };
  handleInput = (e, input) => {
    if (input === "department")
      this.setState({
        [input]: e.value,
      });
    else
      this.setState({
        [e.target.name]: e.target.value,
      });
  };

  responseGoogle = (response, type) => {
    const { importSocialMeetings, userDetails, toggle } = this.props;
    if (type === "google") {
      const obj = {
        accessToken: response.accessToken,
        type,
        email: userDetails.email,
      };
      importSocialMeetings(obj);
    } else if (type === "microsoft") {
      const obj = {
        accessToken:
          response &&
          response.authResponseWithAccessToken &&
          response.authResponseWithAccessToken.accessToken,
        type,
        email: userDetails.email,
      };
      importSocialMeetings(obj);
    }
    toggle();
    this.setState({
      modal: false,
    });
  };

  handlePrivateNotes = (notes) => {
    const { setPrivateNotes, userDetails } = this.props;
    const payload = {
      notes,
      email: userDetails.email,
    };
    setPrivateNotes(payload);
    this.setState(
      { privateNotes: notes },
      console.log(this.state.privateNotes)
    );
  };

  visibleBtn = (isOpen) => {
    const { togglePrivateNote } = this.props;
    togglePrivateNote(isOpen);
  };

  onSidebarTabs = (name) => {
    const { isSearch } = this.props.meetings;

    const { fetchNotifications, userDetails } = this.props;
    const notificationObj = {
      email: userDetails && userDetails.email,
    };
    fetchNotifications(notificationObj).then((result) => {});
    if (name !== "Action Management") {
      const { setArchivedStatus } = this.props;
      setArchivedStatus(false);
    }
    const { setMeetingsType } = this.props;
    if (name === "Dashboard") {
      setMeetingsType("upcoming");
    }

    if (name === "Reports and Analytics") {
      setMeetingsType("upcoming");
    }
    if (isSearch) {
      const { fetchMeetings, userDetails, setFetchMeetings } = this.props;
      const obj = {
        type: "upcoming",
        email: userDetails.email,
      };
      fetchMeetings(obj).then((result) => {
        if (
          result &&
          result.payload &&
          result.payload.data &&
          result.payload.data.data
        ) {
          const meetings = this.filterMeetings(result.payload.data.data);
          setFetchMeetings(meetings);
        }
      });
    }
    window.scrollTo({ top: 0, left: 0 });
  };
  filterMeetings = (meetings) => {
    let arr = [];
    meetings &&
      meetings.length > 0 &&
      meetings.filter((item) => {
        const found = arr.some((el) => {
          if (item.meeting_id && typeof item.meeting_id !== "string") {
            return el._id === item.meeting_id._id;
          } else {
            return el._id === item._id;
          }
        });
        if (!found) {
          if (item.meeting_id && typeof item.meeting_id !== "string") {
            let obj = {
              ...item.meeting_id,
            };
            arr.push(obj);
          } else {
            arr.push(item);
          }
        }
      });
    if (!arr) {
      return [];
    }
    return arr;
  };
  authHandler = (err, authData) => {
    if (authData) {
      this.responseGoogle(authData, "microsoft");
    }
  };

  handleUpdate = (share, isShareOpen) => {
    const {
      createMeetingData,
      agendaItems,
      meetingDocuments,
      addedParticipants,
      userDetails,
      organizationData,
      updateMeeting,
      meetingId,
      logo,
      togglePrivateNote,
      userNotes,
    } = this.props;
    const { meetingNotes, selectedParticipants } = this.state;
    const contactData = _.unionWith(
      selectedParticipants,
      addedParticipants,
      (a, b) => a.email === b.email
    );
    togglePrivateNote(false);
    updateMeeting({
      ...createMeetingData,
      agendas: agendaItems,
      documents: meetingDocuments,
      participants: contactData,
      private_notes: [{ email: userDetails.email, notes: userNotes }],
      email: userDetails.email || "",
      notes: meetingNotes,
      _id: meetingId,
      owner: userDetails.name || "",
      company: organizationData.name || "",
      share,
      logo,
    }).then((result) => {
      const { status } = result.payload.data;
      if (status === 200) {
        console.log(userNotes);
        if (isShareOpen) {
          this.setState({
            isUpdated: false,
          });
        } else {
          this.setState({
            isUpdated: true,
          });
        }
      }
    });
  };

  handleDownload = () => {
    const { createMeetingData, userNotes } = this.props;

    console.log(createMeetingData);
    const element = document.createElement("a");
    const file = new Blob([userNotes], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Private Notes " + "(" + createMeetingData.title + ")";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  handleSharePdf = (emails, callback) => {
    const { createMeetingData, sharePdf, userDetails, userNotes } = this.props;
    // const name = createMeetingData.title || Date.now().toString()
    // const file_name = name.replace(/[^A-Z0-9]+/gi, "_");

    const titleStyle = {
      textTransform: "capitalize",
      fontSize: "20px",
      fontFamily: "raleway",
      fontWeight: "700",
      color: "rgb(41, 197, 236)",
      textAlign: "center",
      borderBottom: "2px solid rgb(41, 197, 236)",
      paddingBottom: "10px",
    };
    const contentStyle = {
      fontSize: "14px",
      color: "rgb(43, 43, 43)",
      fontFamily: "raleway",
      fontWeight: "500",
      wordBreak: "break-all",
      overflow: "hidden",
      whiteSpace: "pre-wrap",
    };
    const tableStyle = {
      width: "100%",
      marginBottom: "30px",
      fontFamily: "Raleway",
      borderCollapse: "collapse",
      borderSpacing: "0",
      border: "none",
    };

    const html = renderToString(
      <html>
        <body>
          <head>
            <link
              href="https://fonts.googleapis.com/css?family=Raleway:400,500,700,800&display=swap"
              rel="stylesheet"
            />
          </head>
          <div style={{ padding: "20px" }}>
            <table style={tableStyle}>
              <tr>
                <td style={titleStyle}>
                  Private Notes - {createMeetingData.title}
                </td>
              </tr>
            </table>
            <span style={contentStyle}>{userNotes}</span>
          </div>
        </body>
      </html>
    );
    const payload = {
      // meeting: createMeetingData.title,
      meeting_id: createMeetingData.meetingId,
      emails,
      attachment: `${html}`,
      sender_email: userDetails.email,
      // file_name
    };
    sharePdf(payload).then((res) => {
      if (res) {
        callback();
      }
    });
  };

  render() {
    const { isLogout, activeTab } = this.state;
    const {
      userNotes,
      isOpenPrivateNote,
      isOpen,
      toggle,
      userDetails,
    } = this.props;
    const { pathname } = this.props.location;
    const { type } = this.props.organizationReducer;
    return (
      <>
        <div
          className={`sidebar-wrapper ${
            this.props.isSidebarOpen ? "opening" : "closing"
          }`}
        >
          <div className="backdrop" onClick={this.props.toggleSidebar} />

          <div className="meetingbtn-wrapper">
            {isLogout && <Redirect to="/" />}
            {pathname === "/view/meetings-details" ? (
              <Button
                className="private-btn"
                onClick={() => this.visibleBtn(true)}
              >
                Private Notes
              </Button>
            ) : (
              <Button
                className="meeting-btn"
                disabled={userDetails.isLicenseExpired}
                onClick={toggle}
              >
                Create/Import Meeting
              </Button>
            )}
          </div>
          {/* <Button className="meeting-btn" onClick={this.toggle}>Create  Meeting</Button>

          <Button className="private-btn" onClick={this.visibleBtn}>Private Notes</Button> */}
          <div className="sidebar-content">
            <div className="sidebar-logo logo">
              <img src={Logo} alt="logo" />
            </div>
            <div className="menu-list">
              <ul className="dashboard-menu">
                {menus.map(({ icon, name, link }, index) => {
                  if (name === "Manage Users" && type !== "organization") {
                    return null;
                  } else {
                    return (
                      <li
                        className={
                          userDetails && userDetails.isLicenseExpired === false
                            ? activeTab === index + 1
                              ? "active"
                              : ""
                            : ""
                        }
                        key={`${name}${index}`}
                        onClick={(e) => {
                          if (
                            userDetails &&
                            userDetails.isLicenseExpired === false
                          ) {
                            this.setActiveTab(e, index + 1, link);
                          }
                        }}
                      >
                        {
                          <Link
                            to={link}
                            onClick={() => this.onSidebarTabs(name)}
                          >
                            {icon}
                            <span>{name}</span>
                          </Link>
                        }
                      </li>
                    );
                  }
                })}
              </ul>
            </div>
            <div className="logout-btn">
              <button onClick={(e) => this.onLogout(e)}>
                <LogoutIcon />
                Logout
              </button>
            </div>
          </div>
        </div>
        <Modal isOpen={isOpen} toggle={toggle} className="meetings-modal">
          <ModalHeader toggle={toggle}>Create/Import Meetings</ModalHeader>
          <ModalBody>
            <div className="meetings-content" onClick={this.MeetingModalToggle}>
              <img src={PlusIcon} alt="noImg" />
              <span>Create new meeting</span>
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
                btnContent="Import/Sync from Microsoft"
                handleLogin={data => {
                  this.responseGoogle(data, "microsoft");
                }}
              /> */}
              <div className="ms-wrapper">
                <MicrosoftLogin
                  clientId={msClientId}
                  className="msBtn"
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
                <p>Import/Sync from Microsoft</p>
              </div>
            </div>
          </ModalBody>
        </Modal>
        <ModalContainer
          getRef={(ref) => (this.modalContainerRef = ref)}
          isEditMode={false}
        />

        <div className={`private-note ${isOpenPrivateNote ? "visible" : ""}`}>
          <div className="note-title">
            <h2>Private Notes</h2>
            <div className="note-title-wrapper">
              <DropdownShareOptions
                ref="isShareMeeting"
                setModal={(modalType) => this.toggleMeetingModal(modalType)}
                isReadyToStop={null}
                meetingId={null}
                setMeetingStatus={null}
                meetingData={this.props.createMeetingData}
                userDetails={userDetails}
                userNotes={userNotes}
                handleSharePdf={this.handleSharePdf}
              />
              <span onClick={() => this.visibleBtn(false)}>
                <i
                  className="fas fa-times"
                  style={{ display: "inline-block", padding: "17px 0px" }}
                ></i>
              </span>
            </div>
          </div>
          <div className="note-content">
            <textarea
              onChange={(e) => this.handlePrivateNotes(e.target.value)}
              value={userNotes}
              style={{ height: "500px" }}
              multiline
            ></textarea>
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={() => this.handleUpdate(false)}
              type="button"
              className="btn btn-sidebar"
            >
              Save
            </button>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  const {
    createMeetingData,
    agendaItems,
    documents,
    paricipants,
    meetingId,
  } = state.createMeetingReducer;
  const notes = state.createMeetingReducer.private_notes;
  let userNotes = "";
  if (notes && notes.length > 0) {
    if (typeof notes !== "string") {
      notes.forEach((element) => {
        if (state.userDetails.email === element.email) {
          userNotes = element.notes;
        }
      });
    } else {
      userNotes = notes;
    }
  }

  let logo = "";
  if (state.individualUserReducer.logo) logo = state.individualUserReducer.logo;
  else if (state.organizationReducer.organizationLogo)
    logo = state.organizationReducer.organizationLogo;

  return {
    organizationData: state.organizationReducer,
    organizationReducer: state.organizationReducer,
    sessionReducer: state.sessionReducer,
    userDetails: state.userDetails,
    userNotes,
    isOpenPrivateNote: state.meetingReducer.isOpenPrivateNote,
    meetings: state.meetingReducer,
    userDetails: state.userDetails,
    createMeetingData,
    agendaItems,
    meetingDocuments: documents,
    addedParticipants: paricipants,
    organizationData: state.organizationReducer,
    meetingId,
    logo,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      resetStore,
      logoutUser,
      importSocialMeetings,
      importSocialContacts,
      resetMeetingData,
      togglePrivateNote,
      setPrivateNotes,
      fetchMeetings,
      setFetchMeetings,
      setMeetingsType,
      setArchivedStatus,
      updateMeeting,
      sharePdf,
      setMeetingsType,
      fetchNotifications,
    },
    dispatch
  );
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(Sidebar)
);
