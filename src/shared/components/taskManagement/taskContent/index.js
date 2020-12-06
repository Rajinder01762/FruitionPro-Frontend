import React, { Component } from "react";
import {
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import AvatarIcon from "../../../../asset/images/icons/Avatar.png";
import CalenderIcon from "../../../../asset/images/mom-icons/calendar.svg";
import PdfIcon from "../../../../asset/images/icons/PDF_icon.png";
import moment from "moment";
import { circleCharacter } from "../../createMeeting/createMeetingComponent";

export default class TaskContent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }
  ddToggle = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  };
  onTaskReminder = (e, data) => {
    const { taskReminder } = this.props;
    const obj = {
      task_id: data._id,
      meeting_id: data.meeting_id,
      assignee_email: data.assign_to.map((item) => item.email),
    };
    taskReminder(obj).then((result) => {});
  };

  reminderBtnCheck = (taskDetails) => {
    let assignees = [...taskDetails.assign_to.map((item) => item.email)];
    let index = assignees.indexOf(taskDetails.admin_email);
    if (index > -1) assignees.splice(index, 1);
    if (assignees && assignees.length <= 0) {
      return false;
    } else return true;
  };

  render() {
    const {
      taskDetails,
      type,
      setTaskSummaryData,
      sidebarToggle,
      taskReminder,
      userDetails,
    } = this.props;

    let stillUtcStart = moment.utc(taskDetails.due_date).toDate();
    let dueDate = moment(stillUtcStart).local().format("YYYY-MM-DD");
    // ddd, Do MMM, YYYY HH: mm A
    return (
      <div
        onClick={() => {
          sidebarToggle();
          setTaskSummaryData(taskDetails);
        }}
      >
        <div className="d-flex justify-content-between">
          <h5 className="mb-0">{taskDetails.task}</h5>
          {/* <p className="mb-0"><i className="fas fa-times"></i></p> */}
        </div>
        <div className="task-content">
          <p className="dateName">
            <img src={CalenderIcon} alt="" />
            <label>Due Date: </label>
            {dueDate}
          </p>
          <p>
            <img src={PdfIcon} alt="" />
            Document
          </p>
          {/* {(type === 'completed' || type === "over_due") ? <p className="dateName"><img src={CalenderIcon} alt="" />{dueDate}</p> : <p />} */}
        </div>
        {type === "over_due" &&
        userDetails.email === taskDetails.admin_email &&
        this.reminderBtnCheck(taskDetails) ? (
          <div className="text-center remind-btn">
            <button
              onClick={(e) => {
                e.stopPropagation();
                this.onTaskReminder(e, taskDetails);
              }}
            >
              Reminder
            </button>
          </div>
        ) : (
          ""
        )}
        <div className="d-flex justify-content-end align-items-center">
          {taskDetails.assign_to &&
            taskDetails.assign_to.length > 0 &&
            taskDetails.assign_to.map((task, i) => {
              return (
                <label title={(task && task.email) || ""} className="mb-0">
                  <div className="taskUser-circle">
                    {/* <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{(task && task.charAt(0).toUpperCase()) || ''}</span> */}
                    <span
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      {(task && circleCharacter(task)) || ""}
                    </span>
                  </div>
                </label>
              );
            })}
        </div>
      </div>
    );
  }
}
