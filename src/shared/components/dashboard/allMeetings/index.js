import React, { Component } from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import MoreIcon from "../../../icons/moreIcon";
import _ from "lodash";
import moment from "moment";
import LockIcon from "../../../../asset/images/dashboard-icons/lock.svg";
import { circleCharacter } from "../../createMeeting/createMeetingComponent";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import {
  fetchMeetings,
  setFetchMeetings,
  deleteMeeting,
  setMeetingSummaryData,
  setFetchTodayMeetings,
} from "../store/action";
import DeleteMeetingModal from "../../modals/deleteMeetingModal";

export const getUserType = (data) => {
  const { meeting, email } = data;
  const { attendees } = meeting;
  let type = "";
  if (attendees && attendees.length > 0) {
    if (email === meeting.admin_email) {
      type = "organiser";
    } else {
      const index = attendees.findIndex((i) => i.email === email);
      if (index > -1) {
        type = "attendee";
      }
    }
  }
  return type;
};

class AllMeetings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      isLogout: false,
      modal: false,
      dropdownOpen: false,
      collapse: false,
      id: "",
      dropdownDeleteIndex: "",
      dropdownUserIndex: "",
      isDisplayAll: false,
      isDeleteModalOpen: false,
      isDeleteAll: false,
      selectedDeleteMeeting: {},
    };
    this.toggle = this.toggle.bind(this);
    this.accordion = this.accordion.bind(this);
  }

  handleInput = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }
  accordion() {
    this.setState((state) => ({ collapse: !state.collapse }));
  }
  dropdownToggle(id) {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
      dropdownUserIndex: "",
      id,
    }));
  }
  dtToggle = (e, index) => {
    e.preventDefault();
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      dropdownUserIndex: index,
      id: "",
    });
  };

  monthMeetings = (Meetings) => {
    let upcomingMeetings = [];
    const { meetings } = this.props;
    if (Meetings && Meetings.length > 0) {
      for (const data of Meetings) {
        let stillUtcStart = moment.utc(data.start_date_time).toDate();
        let startDate = moment(stillUtcStart)
          .local()
          .format("YYYY-MM-DD HH:mm:ss");
        const date = moment(startDate).format("MMMM-YYYY");
        upcomingMeetings.push({ ...data, date });
      }
    }
    const totalMeetings = meetings && meetings.meetingsType==='past'?upcomingMeetings.reverse() : upcomingMeetings;
    debugger
    const groupedUpcomingMeetings = _.mapValues(
      _.groupBy(totalMeetings, "date")
    );
    Object.keys(groupedUpcomingMeetings).map((monthData, index) => {
      const data = groupedUpcomingMeetings[monthData];
      groupedUpcomingMeetings[monthData] =
        meetings && meetings.meetingsType === "past"
          ? _.sortBy(data, "start_date_time").reverse()
          : _.sortBy(data, "start_date_time");
    });
    return groupedUpcomingMeetings;
  };
  onDeleteMeeting = (e, meeting) => {
    if (meeting && meeting.status !== "started") {
      this.setState({
        isDeleteModalOpen: true,
        selectedDeleteMeeting: meeting,
      });
    }
  };

  onsetDeleteType = (type, isMyselfDelete) => {
    const { selectedDeleteMeeting } = this.state;
    const { userDetails } = this.props;
    const { email } = userDetails;
    if (
      selectedDeleteMeeting &&
      selectedDeleteMeeting._id &&
      selectedDeleteMeeting.status !== "started"
    ) {
      const { deleteMeeting } = this.props;
      const userType = getUserType({ meeting: selectedDeleteMeeting, email });
      const deleteObj = {
        id: selectedDeleteMeeting._id,
        isMySelf: userType && userType === "attendee" ? true : isMyselfDelete,
        isDeleteAll: type === "all" ? true : false,
        email: email || "",
      };
      deleteMeeting(deleteObj);
    }
  };

  isMeetingTimeOver = (dateTime) => {
    const a = moment(dateTime);
    const b = moment();
    const c = moment.duration(b.diff(a)).asMinutes();
    if (c > 0) return true;
    else return false;
  };

  toggleDeleteModal = () => {
    this.setState((prevState) => ({
      isDeleteModalOpen: !prevState.isDeleteModalOpen,
    }));
  };

  renderMeetings = (data) => {
    const {
      id,
      isDisplayAll,
      dropdownOpen,
      dropdownUserIndex,
      isDeleteModalOpen,
    } = this.state;

    const { setMeetingSummaryData, history, userDetails } = this.props;
    return data && Object.keys(data).length > 0 ? (
      Object.keys(data).map((temp, index) => {
        var arr = temp;
        var res = arr.split("-");
        return (
          <>
            <h2 className="meeting-header">
              {res[0] || ""}&nbsp;
              <span>{res[1] || ""}</span>
            </h2>
            <ul className="meetings-list">
              {data[temp] &&
                data[temp].length > 0 &&
                data[temp].map((upcomingMeetings, index) => {
                  let stillUtcStart = moment
                    .utc(upcomingMeetings.start_date_time)
                    .toDate();
                  let stillUtcEnd = moment
                    .utc(upcomingMeetings.end_date_time)
                    .toDate();
                  let startDate = moment(stillUtcStart)
                    .local()
                    .format("YYYY-MM-DD HH:mm:ss");
                  let endDate = moment(stillUtcEnd)
                    .local()
                    .format("YYYY-MM-DD HH:mm:ss");
                  let isReadyToStop = this.isMeetingTimeOver(
                    upcomingMeetings.end_date_time
                  );
                  const matchedIn = upcomingMeetings.matchedIn;
                  const arrray =
                    upcomingMeetings &&
                    upcomingMeetings.matchedIn &&
                    Object.keys(upcomingMeetings.matchedIn);

                  return (
                    <>
                      <li
                        onClick={() => {
                          setMeetingSummaryData(
                            upcomingMeetings,
                            userDetails.email || ""
                          );
                          history.push("/view/meetings-details");
                        }}
                      >
                        <div className="date">
                          {/* <h4>{moment(upcomingMeetings.dateTime).format('ddd').toUpperCase()}A</h4> */}
                          <h4>
                            {moment(startDate).format("ddd").toUpperCase()}
                          </h4>
                          <h3>{moment(startDate).format("DD")}</h3>
                        </div>
                        <div className="meeting-content">
                          <div className="meeting-details lock">
                            {upcomingMeetings.is_closed && (
                              <div className="mr-3 lock-icon">
                                <img src={LockIcon} alt="" />
                              </div>
                            )}

                            <div>
                              <h3>{upcomingMeetings.title}</h3>
                              {arrray &&
                                arrray.length > 0 &&
                                arrray.map((data) => {
                                  return (
                                    <h5 className="meetTitle">
                                      <b>{data} : </b> {matchedIn[data]}
                                    </h5>
                                  );
                                })}
                              <p>
                                {startDate === ""
                                  ? "All day"
                                  : "(" +
                                    moment(startDate).format("hh:mm a") +
                                    "-" +
                                    moment(endDate).format("hh:mm a") +
                                    ")"}
                              </p>
                            </div>
                          </div>
                          <div className="meetings-user">
                            <div className="meeting-user-inner">
                              {upcomingMeetings &&
                                upcomingMeetings.attendees &&
                                upcomingMeetings.attendees.length > 0 &&
                                upcomingMeetings.attendees.map(
                                  (attendee, i) => {
                                    if (!isDisplayAll && i < 2) {
                                      return (
                                        <div
                                          title={
                                            (attendee &&
                                              attendee._id &&
                                              attendee._id.email) ||
                                            ""
                                          }
                                          style={{
                                            height: "38px",
                                            width: "38px",
                                            backgroundColor: "#d0eaff",
                                            borderRadius: "24px",
                                            textAlign: "center",
                                            color: "black",
                                            marginLeft: "5px",
                                            position: "relative",
                                            fontSize: "12px",
                                          }}
                                        >
                                          <span
                                            title={
                                              (attendee &&
                                                attendee._id &&
                                                attendee._id.email) ||
                                              ""
                                            }
                                            style={{
                                              position: "absolute",
                                              top: "50%",
                                              left: "50%",
                                              transform:
                                                "translate(-50%, -50%)",
                                              // }}>{i < 3 && (attendee._id.email.charAt(0).toUpperCase())}</span></div>
                                            }}
                                          >
                                            {i < 3 &&
                                              circleCharacter(
                                                attendee && attendee.user_id
                                                  ? attendee.user_id
                                                  : attendee
                                              )}
                                          </span>
                                        </div>
                                      );
                                    }
                                  }
                                )}
                              {upcomingMeetings.attendees &&
                                upcomingMeetings.attendees.length > 2 && (
                                  <>
                                    <Dropdown
                                      className="dropdown-more"
                                      isOpen={
                                        dropdownOpen &&
                                        dropdownUserIndex ===
                                          upcomingMeetings._id
                                      }
                                      size="sm"
                                      toggle={(e) =>
                                        this.dtToggle(e, upcomingMeetings._id)
                                      }
                                    >
                                      <DropdownToggle>
                                        <span
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            this.dtToggle(
                                              e,
                                              upcomingMeetings._id
                                            );
                                          }}
                                        >
                                          More..
                                        </span>
                                      </DropdownToggle>
                                      <DropdownMenu>
                                        {upcomingMeetings.attendees &&
                                          upcomingMeetings.attendees.length >
                                            0 &&
                                          upcomingMeetings.attendees.map(
                                            (attendee, i) => {
                                              if (i + 1 > 2) {
                                                return (
                                                  <>
                                                    <div
                                                      title={
                                                        attendee._id.email
                                                          ? attendee._id.email
                                                          : attendee.email || ""
                                                      }
                                                      style={{
                                                        height: "38px",
                                                        width: "38px",
                                                        backgroundColor:
                                                          "#d0eaff",
                                                        borderRadius: "24px",
                                                        textAlign: "center",
                                                        color: "black",
                                                        marginLeft: "5px",
                                                        position: "relative",
                                                      }}
                                                    >
                                                      <span
                                                        title={
                                                          attendee._id.email
                                                            ? attendee._id.email
                                                            : attendee.email ||
                                                              ""
                                                        }
                                                        style={{
                                                          position: "absolute",
                                                          top: "50%",
                                                          left: "50%",
                                                          transform:
                                                            "translate(-50%, -50%)",
                                                          // }}>{(attendee._id.email.charAt(0).toUpperCase())}
                                                          // {i > 3 && attendee._id.email.charAt(0).toUpperCase()}
                                                        }}
                                                      >
                                                        {circleCharacter(
                                                          attendee &&
                                                            attendee.user_id
                                                            ? attendee.user_id
                                                            : attendee
                                                        )}
                                                        {/* {i > 3 && circleCharacter(attendee._id)} */}
                                                      </span>
                                                    </div>
                                                  </>
                                                );
                                              }
                                            }
                                          )}
                                      </DropdownMenu>
                                    </Dropdown>
                                  </>
                                )}
                            </div>
                            {/* {upcomingMeetings.attendees.length > 3 && <a href style={{ top: '13px', position: 'relative', fontWeight: '520', fontSize: '14px' }}>more..</a>} */}
                            <div className="user-edit">
                              <Dropdown
                                isOpen={
                                  this.state.dropdownOpen &&
                                  id === upcomingMeetings._id
                                }
                                toggle={() => {
                                  this.dropdownToggle(upcomingMeetings._id);
                                }}
                                className={
                                  upcomingMeetings &&
                                  upcomingMeetings.status === "started"
                                    ? "Btnfade"
                                    : ""
                                }
                              >
                                <DropdownToggle>
                                  <span
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.dropdownToggle(upcomingMeetings._id);
                                    }}
                                  >
                                    {" "}
                                    <MoreIcon />
                                  </span>
                                </DropdownToggle>
                                <DropdownMenu>
                                  <DropdownItem
                                    // className={
                                    //   upcomingMeetings &&
                                    //   upcomingMeetings.status === "started"
                                    //     ? "fade"
                                    //     : ""
                                    // }
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.onDeleteMeeting(e, upcomingMeetings);
                                    }}
                                  >
                                    Delete
                                  </DropdownItem>
                                </DropdownMenu>
                              </Dropdown>
                            </div>
                          </div>
                        </div>
                      </li>
                    </>
                  );
                })}
            </ul>
          </>
        );
      })
    ) : (
      <div className="no-meeting">
        <p>No Meetings</p>
      </div>
    );
  };

  render() {
    const { meetings, userDetails } = this.props;

    const { isDeleteModalOpen, selectedDeleteMeeting } = this.state;
    let allMeetings = [];
    const meetingData =
      meetings && meetings.meetingsType === "upcoming"
        ? meetings.meetings
        : meetings.meetingsType === "today"
        ? meetings.todayMeetings
        : meetings.pastMeetings;
    if (
      meetings &&
      meetings.meetingsType === "upcoming" &&
      meetingData &&
      meetingData.length > 0
    ) {
      for (const meeting of meetingData) {
        let startDate = moment.utc(meeting.start_date_time).toDate();
        let meetingDate = moment(startDate).format("ll");
        let todayDate = moment().format("ll");
        if (meetingDate !== todayDate) {
          allMeetings.push(meeting);
        }
      }
    } else {
      allMeetings = meetingData;
    }
    const data = this.monthMeetings(allMeetings);
    let searchMeetings = [];
    let othersMeetings = [];
    if (meetings && meetings.searchedMeetings) {
      searchMeetings = this.monthMeetings(meetings.searchedMeetings);
    }
    if (meetings && meetings.otherMeetings) {
      othersMeetings = this.monthMeetings(meetings.otherMeetings);
    }
    return (
      <div className="dashboard-wrapper">
        <DeleteMeetingModal
          isOpen={isDeleteModalOpen}
          toggle={this.toggleDeleteModal}
          onsetDeleteType={this.onsetDeleteType}
          userDetails={userDetails}
          selectedDeleteMeeting={selectedDeleteMeeting}
        />
        {meetings.isSearch ? (
          <div className="dashboard-content">
            {Object.entries(searchMeetings).length !== 0 && (
              <div className="dashboard-title">
                <h2>Relevant Search Results</h2>
              </div>
            )}
            {this.renderMeetings(searchMeetings)}
            {Object.entries(searchMeetings).length === 0 && (
              <div className="noFound">No matches found</div>
            )}
          </div>
        ) : (
          <div className="dashboard-content">
            {meetings.meetingsType === "upcoming" ? (
              <div>
                <div className="dashboard-title">
                  <h2>{"Scheduled Meetings"}</h2>
                </div>
                {this.renderMeetings(data)}
              </div>
            ) : meetings.meetingsType === "today" ? (
              <div>
                <div className="dashboard-title">
                  <h2>{"Today Meetings"}</h2>
                </div>
                {this.renderMeetings(data)}
              </div>
            ) : (
              <div>
                <div className="dashboard-title">
                  <h2>{"Past Meetings"}</h2>
                </div>
                {this.renderMeetings(data)}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    meetings: state.meetingReducer,
    userDetails: state.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchMeetings,
      setFetchMeetings,
      deleteMeeting,
      setMeetingSummaryData,
      setFetchTodayMeetings,
    },
    dispatch
  );
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllMeetings)
);
