import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { circleCharacter } from "../../createMeeting/createMeetingComponent";
import { setTaskSummaryData } from "../../taskManagement/store/action";
import { setMeetingSummaryData, setMeetingAttendance } from "../store/action";
import { clearNotifications } from "../../dashboard/store/action";
import { readNotification } from "../../wrapper/store/action";
import Modal from "../../../util/index";
import { result } from "lodash";

class AllNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onNotification = (data) => {
    const {
      setTaskSummaryData,
      setMeetingSummaryData,
      history,
      userDetails,
      readNotification,
    } = this.props;
    const obj = {
      id: data && data._id,
    };
    readNotification(obj).then(result);
    if (data && data.type === "meeting" && userDetails) {
      if (data.meeting && data.meeting.title) {
        if (data.meeting && userDetails.email) {
          if (data.meeting.is_deleted === true) {
            Modal(400, "Your meeting has been cancelled.");
          } else {
            setMeetingSummaryData(data.meeting, userDetails.email);
            history.push("/view/meetings-details");
          }
        }
      }
    }
    if (data && data.type === "task") {
      if (data && data.task) {
        if (data.task.is_deleted === true) {
          Modal(400, "Your task has been deleted.");
        } else {
          setTaskSummaryData(data.task);
          history.push({
            pathname: "/view/tasks",
            search: `?tid=${data.task}`,
          });
        }
      }
    }
    if (data && data.type === "profile") {
      history.push("/view/profile");
    }
    if (data && data.type === "invitation") {
      history.push("/view/manage-users");
    }
  };

  sendResponse = (e, value, data) => {
    e.stopPropagation();

    const { setMeetingAttendance, userDetails } = this.props;
    if (
      data &&
      data.meeting &&
      data.meeting._id &&
      data.meeting.attendees &&
      data.meeting.attendees.length > 0 &&
      userDetails &&
      userDetails.email
    ) {
      const attendeeData = data.meeting.attendees.find((user) => {
        if (user && user) {
          return userDetails.email === user.email;
        }
      });
      const obj = {
        mid: data.meeting._id,
        ai: attendeeData && attendeeData._id,
        status: value,
      };

      setMeetingAttendance(obj).then((result) => {});
    }
  };

  deleteNotifications = () => {
    const { userDetails, clearNotifications } = this.props;
    clearNotifications({ email: userDetails.email || "" });
  };

  render() {
    const { notificationsData } = this.props;
    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-content">
          <div className="dashboard-title">
            <h2>All Notifications</h2>
            {notificationsData && notificationsData.length > 0 && (
              <button
                className="clear-allBtn"
                onClick={() => this.deleteNotifications()}
              >
                <i className="far fa-trash-alt mr-2"></i>Clear All
              </button>
            )}
          </div>
          <ul className="meetings-list notification-list">
            {notificationsData && notificationsData.length > 0 ? (
              notificationsData.map((data) => {
                return (
                  <li
                    onClick={() => this.onNotification(data)}
                    className={data && data.is_read ? "read" : ""}
                  >
                    <div className="meetings-user">
                      <div className="meeting-user-inner">
                        <div className="taskUser-circle">
                          <span
                            className="inviteUserIcon"
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                            }}
                          >
                            {circleCharacter(data && data.sender)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="meeting-content ml-2">
                      <div className="meeting-details lock notification-text">
                        <div className="notification-title">
                          <span
                            dangerouslySetInnerHTML={{
                              __html: `<p>${data && data.message}</p>`,
                            }}
                          ></span>
                          <p>
                            <i>{(data && data.createdAt) || ""}</i>
                          </p>
                          {data && data.is_invitation_sent && (
                            <div className="notification-options">
                              <button
                                onClick={(e) =>
                                  this.sendResponse(e, "yes", data)
                                }
                              >
                                Yes
                              </button>
                              <button
                                onClick={(e) =>
                                  this.sendResponse(e, "maybe", data)
                                }
                              >
                                Maybe
                              </button>
                              <button
                                onClick={(e) =>
                                  this.sendResponse(e, "no", data)
                                }
                              >
                                No
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                );
              })
            ) : (
              <div className="no-meeting-list">
                <p className="mb-0">No notifications</p>
              </div>
            )}
          </ul>
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    notificationsData: state.notificationsData.notifications,
    userDetails: state.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setTaskSummaryData,
      setMeetingSummaryData,
      clearNotifications,
      setMeetingAttendance,
      readNotification,
    },
    dispatch
  );
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AllNotifications)
);
