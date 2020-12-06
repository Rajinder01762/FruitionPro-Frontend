import React, { Component } from "react";
import {
  Input,
  Button,
  FormGroup,
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import Logo from "../../../../../asset/images/dashboard-icons/logo.png";
import Avatar from "../../../../../asset/images/icons/user.svg";
import LogoutIcon from "../../../../icons/logoutIcon";
import SearchIcon from "../../../../../asset/images/dashboard-icons/search.svg";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import MenuIcon from "../../../../../asset/images/dashboard-icons/menu.svg";
import AddIcon from "../../../../icons/addIcon";
import NotesIcon from "../../../../icons/notesIcon";
import FilterIcon from "../../../../icons/settingsIcon";
import { togglePrivateNote, searchMeetings } from "../../store/action";
import SearchFilter from "../../../../../asset/images/mom-icons/search-filter.svg";
import { resetStore } from "../../../../store/actions/action";
import { logoutUser } from "../../../login/store/action";
import { readNotification } from "../../store/action";

import Notification from "../../../dashboard/notifications";
import {
  setMeetingSummaryData,
  setMeetingAttendance,
} from "../../../dashboard/store/action";
import { setTaskSummaryData } from "../../../taskManagement/store/action";

const shortName = (data) => {
  if (data) {
    if (data.logo) {
      return <img src={data.logo} alt="" />;
    } else {
      if (data.name) {
        const nameArr = data.name.split(" ");
        if (nameArr.length >= 2) {
          return (
            <span>
              {nameArr[0].charAt(0) +
                nameArr[nameArr.length - 1].charAt(0).toUpperCase()}
            </span>
          );
        } else {
          return (
            <span>
              {nameArr[0].charAt(0) + nameArr[0].charAt(1).toUpperCase() || ""}
            </span>
          );
        }
      } else if (data.email) {
        return (
          <span>
            {data && data.email.charAt(0) + data.email.charAt(1).toUpperCase()}
          </span>
        );
      }
    }
  } else {
    return data;
  }
};

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      search: "",
      meetingTitle: true,
      project: true,
      task: true,
      agenda: true,
      notes: true,
      isSearchActive: false,
      notificationVisible: false,
    };
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  state = {
    isFocus: false,
  };
  static getDerivedStateFromProps(nextProps, prevState) {
    if (
      nextProps &&
      nextProps.meetings &&
      nextProps.meetings.isSearch === false &&
      prevState.isSearchActive === true &&
      prevState.search !== ""
    ) {
      return {
        search: "",
        isSearchActive: false,
        meetingTitle: true,
        project: true,
        task: true,
        agenda: true,
        notes: true,
        isOpen: false,
      };
    }

    return null;
  }

  onFocus() {
    this.setState({
      isFocus: true,
    });
  }
  onBlur() {
    this.setState({
      isFocus: false,
    });
  }
  visibleBtn = () => {
    const { togglePrivateNote } = this.props;
    togglePrivateNote(true);
  };
  isVisible = () => {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  };
  handleNotification = () => {
    this.setState({
      notificationVisible: !this.state.notificationVisible,
    });
  };

  onLogout = (e) => {
    e.preventDefault();
    const { logoutUser, resetStore, history } = this.props;
    if (window && window.gapi) {
      const auth2 = window.gapi.auth2.getAuthInstance();
      if (auth2 != null) {
        auth2.signOut().then(auth2.disconnect());
      }
    }
    resetStore();
    localStorage.clear();
    logoutUser();
    history.push("/");
  };

  onSearch = () => {
    const { meetingTitle, project, task, agenda, notes, search } = this.state;
    const { history } = this.props;
    if (search.length > 0) {
      history.push("/view/search-results");
      const { searchMeetings, userDetails } = this.props;
      const obj = {
        email: userDetails && userDetails.email,
        keyword: search,
        title: meetingTitle,
        project,
        task,
        agenda,
        notes,
      };
      searchMeetings(obj).then((result) => {
        const { status } = result.payload.data;
        if (status === 200) {
          this.setState({
            isSearchActive: true,
          });
        }
      });
    }
    this.setState({ isOpen: false });
  };
  selectSearchOptions = (e) => {
    this.setState({
      [e.target.name]: e.target.checked,
    });
  };

  onUserProfile = () => {
    const { history } = this.props;
    history.push("/view/profile");
  };
  onResetSearch = () => {
    this.setState({
      isOpen: false,
      meetingTitle: false,
      project: false,
      task: false,
      agenda: false,
      notes: false,
    });
  };
  render() {
    const {
      isFocus,
      isOpen,
      meetingTitle,
      project,
      agenda,
      task,
      notes,
      search,
      notificationVisible,
    } = this.state;
    const {
      userDetails,
      toggleMeetingModal,
      organization,
      individual,
      location,
      history,
      setMeetingAttendance,
      setMeetingSummaryData,
      setTaskSummaryData,
      notificationsData,
      meetings,
      readNotification,
    } = this.props;
    const arr = location.pathname.split("/");
    let filterLength = 0;
    if (meetingTitle) {
      filterLength++;
    }
    if (project) {
      filterLength++;
    }
    if (agenda) {
      filterLength++;
    }
    if (notes) {
      filterLength++;
    }
    if (task) {
      filterLength++;
    }
    let unReadCount = 0;
    for (let i = 0; i < notificationsData.length; i++) {
      if (notificationsData[i] && notificationsData[i].is_read === false) {
        unReadCount = unReadCount + 1;
      }
    }

    return (
      <div className="header-wrapper">
        <button onClick={this.props.toggleSidebar} className="mobile-menuIcon">
          <img src={MenuIcon} alt="noImg" />
        </button>
        <div className="logo">
          <img src={Logo} alt="logo" />
        </div>
        <div className="add-icon">
          {location.pathname !== "/view/meetings-details" && <Button onClick={() => toggleMeetingModal()}>
            <AddIcon />
          </Button>}
          {location.pathname === "/view/meetings-details" && (
            <Button onClick={this.visibleBtn}>
              <NotesIcon />
            </Button>
          )}
        </div>

          <div className={`search ${isFocus ? "active" : ""}`}>
            {/* <img src={SearchIcon} alt="noImg" className="search-icon" /> */}
            <span className="srchInput">
              <Input
                type="search"
                name="search"
                placeholder="Search"
                value={search}
                onChange={(e) => {
                  this.setState({
                    [e.target.name]: e.target.value,
                  });
                }}
                onKeyUp={(e) => {
                  if (e.keyCode === 13) {
                    this.onSearch();
                  }
                }}
                onFocus={this.onFocus}
                onBlur={this.onBlur}
              />
              {search && search.length > 0 && (
                <i
                  className="fas fa-times srchCross"
                  onClick={() => {
                    this.setState({
                      search: "",
                    });
                  }}
                ></i>
              )}
            </span>
            <button
              type="submit"
              className="btn btn-primary ml-1 srchBtn"
              disabled={search.length === 0}
              onClick={this.onSearch}
            >
              Search
            </button>
            <button
              type="submit"
              className="btn btn-primary ml-1 filterBtn"
              onClick={this.isVisible}
            >
              <i className="fas fa-chevron-down"></i>
            </button>
            <div>
              <div className={`search-dropdown ${isOpen ? "visible" : ""}`}>
                <div className="closeBtn" onClick={this.isVisible}>
                  <p className="mb-0">
                    <i className="fas fa-times"></i>
                  </p>{" "}
                </div>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="meetingTitle"
                      checked={meetingTitle}
                      onChange={this.selectSearchOptions}
                    />
                    Meeting
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="project"
                      checked={project}
                      onChange={this.selectSearchOptions}
                    />{" "}
                    Project
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="notes"
                      checked={notes}
                      onChange={this.selectSearchOptions}
                    />{" "}
                    Notes
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="agenda"
                      checked={agenda}
                      onChange={this.selectSearchOptions}
                    />{" "}
                    Agenda
                  </Label>
                </FormGroup>
                <FormGroup check>
                  <Label check>
                    <Input
                      type="checkbox"
                      name="task"
                      checked={task}
                      onChange={this.selectSearchOptions}
                    />{" "}
                    Action
                  </Label>
                </FormGroup>
                <div className="d-flex justify-content-between">
                  <button className="clearbtn" onClick={this.onSearch}>
                    Apply
                  </button>
                  <button className="clearbtn" onClick={this.onResetSearch}>
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </div>
        <div
          className={`user-img ${isFocus ? "hide" : ""}`}
          onClick={this.logoutVisible}
        >
          <div className="header-notification">
            <Dropdown
              isOpen={notificationVisible}
              toggle={this.handleNotification}
            >
              <DropdownToggle className="bell-btn">
                <div className="bell-icon">
                  {unReadCount !== 0 && (
                    <span className="count">{unReadCount}</span>
                  )}
                  <i className="fas fa-bell" />
                </div>
                {/* <i
                  className={`fas fa-bell ${
                    notificationVisible ? "text-primary" : ""
                  }`}
                /> */}
              </DropdownToggle>
              <DropdownMenu>
                <Notification
                  userDetails={userDetails}
                  meetings={meetings}
                  notifications={notificationsData}
                  setMeetingSummaryData={setMeetingSummaryData}
                  setTaskSummaryData={setTaskSummaryData}
                  setMeetingAttendance={setMeetingAttendance}
                  handleNotification={this.handleNotification}
                  readNotification={readNotification}
                />
              </DropdownMenu>
            </Dropdown>
          </div>
          <div style={{ cursor: "pointer" }}>
            <div className="user-icon" onClick={this.onUserProfile}>
              {organization.type === "organization" &&
                shortName({
                  logo: organization.organizationLogo || individual.logo,
                  name: userDetails.name,
                  email: userDetails.email,
                })}
              {individual.type === "individual" &&
                shortName({
                  logo: organization.organizationLogo || individual.logo,
                  name: userDetails.name,
                  email: userDetails.email,
                })}
              {((individual.department !== null &&
                individual.designation !== null &&
                individual.type === null) ||
                individual.type === "invitedUser") &&
                shortName({
                  logo: individual.logo,
                  name: userDetails.name,
                  email: userDetails.email,
                })}
            </div>
            <div className="username-wrapper">
              <p className="user-name">
                {userDetails.name}
                <i className="fas fa-caret-down ml-1"></i>
              </p>
              <div className="user-dropdown">
                <div className="user-logout">
                  <span onClick={(e) => this.onLogout(e)}>
                    <LogoutIcon />
                    Logout
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userDetails: state.userDetails,
    organization: state.organizationReducer,
    individual: state.individualUserReducer,
    meetings: state.meetingReducer,
    notificationsData: state.notificationsData.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      resetStore,
      logoutUser,
      togglePrivateNote,
      searchMeetings,
      setMeetingSummaryData,
      setTaskSummaryData,
      setMeetingAttendance,
      readNotification,
    },
    dispatch
  );
};
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
