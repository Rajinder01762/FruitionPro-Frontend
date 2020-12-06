import React, { Component } from "react";
import UserIcon from "../../../../asset/images/mom-icons/user.svg";
import { Link, withRouter } from "react-router-dom";
import { circleCharacter } from "../../createMeeting/createMeetingComponent";
import Modal from "../../../util/index";

class Notifications extends Component {
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
      handleNotification,
      readNotification,
    } = this.props;
    const obj = {
      id: data && data._id,
    };
    readNotification(obj).then((result) => {});
    if (data && data.type === "meeting" && userDetails) {
      if (data.meeting && data.meeting.title) {
        if (data.meeting && userDetails.email) {
          if (data.meeting.is_deleted === true) {
            Modal(400, "Your meeting has been cancelled.");
          } else {
            setMeetingSummaryData(data.meeting, userDetails.email);
            handleNotification();
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
          handleNotification();
          history.push({
            pathname: "/view/tasks",
            search: `?tid=${data.task}`,
          });
        }
      }
    }
    if (data && data.type === "profile") {
      handleNotification();
      history.push("/view/profile");
    }
    if (data && data.type === "invitation") {
      handleNotification();
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
  render() {
    const { notifications, history, handleNotification } = this.props;
    return (
      <div className="meetings-card">
        <div className="meeting-heading">
          <h2>
            Notifications
            <span className="ml-2">
              {(notifications && notifications.length) || 0}
            </span>
          </h2>
          <a
            onClick={() => {
              handleNotification();
              history.push("/view/all-notifications");
            }}
          >
            See all
          </a>
        </div>
        <ul className="meetings-list notification-list mb-0">
          {notifications && notifications.length > 0 ? (
            notifications.map((data, index) => {
              if (index <= 4) {
                return (
                  <li
                    onClick={() => this.onNotification(data)}
                    className={data && data.is_read ? "read" : ""}
                  >
                    <div className="meetings-user">
                      <div className="meeting-user-inner">
                        <div
                          title={
                            (data && data.sender && data.sender.email) || ""
                          }
                          className="taskUser-circle"
                        >
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
                              __html: `<p>${
                                data && data.message.includes("<br>")
                                  ? data.message.split("<br>", 1)[0] + "..."
                                  : data.message
                              }</p>`,
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
              }
            })
          ) : (
            <div className="no-meeting-list">
              <p className="mb-0">No Notifications</p>
            </div>
          )}
        </ul>
      </div>
    );
  }
}

export default withRouter(Notifications);
