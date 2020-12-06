import React, { Component } from "react";
import Select from "react-select";
// import AvatarIcon from "../../../../asset/images/icons/Avatar.png";
import moment from "moment";
import { circleCharacter } from "../../createMeeting/createMeetingComponent";
import { withRouter } from "react-router-dom";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

class TodayTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      taskSelect: {
        label: "",
        value: "",
        dropdownOpen: false,
        dropdownDeleteIndex: "",
        dropdownUserIndex: "",
      },
    };
  }
  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  componentDidMount() {
    const { taskDetails } = this.props;
    if (taskDetails && taskDetails.selectedTasks === "upcoming") {
      this.setState({
        taskSelect: {
          label: "Upcoming",
          value: "Upcoming",
        },
      });
    } else {
      this.setState({
        taskSelect: {
          label: "Today",
          value: "Today",
        },
      });
    }
  }

  onSelectTaskType = (data) => {
    const { setSelectedTasks } = this.props;
    this.setState({
      taskSelect: { label: data.label, value: data.value },
    });
    let type = "upcoming";
    if (data && data.value === "Today") {
      type = "today";
    }
    setSelectedTasks(type);
  };

  dtToggle = (e, index) => {
    e.preventDefault();
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      dropdownUserIndex: index,
      id: "",
    });
  };

  render() {
    const { taskSelect, dropdownOpen, dropdownUserIndex } = this.state;
    const { taskDetails, setTaskSummaryData, history } = this.props;
    console.log("taskDetailstaskDetails", taskDetails);
    const options = [
      { value: "Today", label: "Today" },
      { value: "Upcoming", label: "Upcoming" },
    ];

    let todayTasks = [];
    let todayFilterTasks = [];
    let upcomingTasks = [];
    let notStartedTasks = [];

    taskDetails &&
      taskDetails.notStartedTasks &&
      taskDetails.notStartedTasks.length > 0 &&
      taskDetails.notStartedTasks.map((item) => {
        notStartedTasks.push(item);
      });

    let inProgressTasks = [];
    taskDetails &&
      taskDetails.inProgressTasks &&
      taskDetails.inProgressTasks.length > 0 &&
      taskDetails.inProgressTasks.map((item) => {
        return inProgressTasks.push(item);
      });
    console.log(
      "notStartedTasksnotStartedTasks",
      notStartedTasks,
      inProgressTasks
    );
    let completedTasks = [];
    taskDetails &&
      taskDetails.completedTasks &&
      taskDetails.completedTasks.length > 0 &&
      taskDetails.completedTasks.map((item) => {
        return completedTasks.push(item);
      });
    let overDueTasks = [];
    taskDetails &&
      taskDetails.overDueTasks &&
      taskDetails.overDueTasks.length > 0 &&
      taskDetails.overDueTasks.map((item) => {
        return overDueTasks.push(item);
      });

    let totalTasks = todayTasks.concat(
      notStartedTasks,
      inProgressTasks,
      completedTasks,
      overDueTasks
    );

    let todayDate = new Date();
    let TodayDate = moment(todayDate).format("YYYY-MM-DD");
    totalTasks &&
      totalTasks.length > 0 &&
      totalTasks.forEach((data) => {
        let dueDate =
          data && data.due_date && moment.utc(data.due_date).toDate();
        let DueDate = moment(dueDate).format("YYYY-MM-DD");
        console.log("jjdhfjghjdfhgj", DueDate);
        if (DueDate === TodayDate) {
          todayFilterTasks.push(data);
        } else if (DueDate > TodayDate) {
          upcomingTasks.push(data);
        }
        console.log("dfgdhdhdhdhdhdh", upcomingTasks);
      });

    let allTasks =
      taskDetails && taskDetails.selectedTasks === "upcoming"
        ? upcomingTasks
        : todayFilterTasks;
    console.log("jbhdhfhhdfgjdfgdf", allTasks);

    return (
      <div className="meetings-card">
        <div className="meeting-heading">
          <h2 className="mb-0">
            Actions{" "}
            <span className="ml-2">{(allTasks && allTasks.length) || 0}</span>
          </h2>
          <Select
            options={options}
            className="select-task"
            classNamePrefix="task"
            value={
              taskSelect.value
                ? { label: taskSelect.label, value: taskSelect.value }
                : { label: "Today", value: "Today" }
            }
            onChange={(data) => {
              this.onSelectTaskType(data);
            }}
          />
        </div>
        <ul className="meetings-list list-overflow">
          {allTasks && allTasks.length > 0 ? (
            allTasks.map((data, i) => {
              console.log("datadatadatdfgdfgdfadatadatadata", data);
              let dueDate = moment.utc(data.due_date).toDate();
              let DueDateTime = moment(dueDate).format("LT");
              let className = "";
              if (data.status === "completed") className = "completed";
              else if (data.isOverDue === true || data.status === "over_due") {
                className = "over-due";
              } else if (data.status === "not_started") {
                className = "not-started";
              } else className = "in-progress";
              return (
                <li
                  className={className}
                  key={i}
                  onClick={() => {
                    setTaskSummaryData(data);
                    history.push({
                      pathname: "/view/tasks",
                      search: `?tid=${data._id}`,
                    });
                  }}
                >
                  <div className="date">
                    <h5>{DueDateTime || 0}</h5>
                  </div>
                  <div className="meeting-content">
                    <div className="meeting-details">
                      <h3>{data.task || ""}</h3>
                    </div>
                    <div className="meetings-user">
                      {data &&
                        data.assign_to &&
                        data.assign_to.length > 0 &&
                        data.assign_to.map((task, i) => {
                          if (i < 2) {
                            return (
                              <div className="meeting-user-inner">
                                <div
                                  title={(task && task.email) || ""}
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
                                    {circleCharacter(task)}
                                  </span>
                                </div>
                              </div>
                            );
                          }
                        })}
                      {data && data.assign_to && data.assign_to.length > 2 && (
                        <>
                          <Dropdown
                            className="dropdown-more"
                            isOpen={
                              dropdownOpen && dropdownUserIndex === data._id
                            }
                            size="sm"
                            toggle={(e) => this.dtToggle(e, data._id)}
                          >
                            <DropdownToggle>
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.dtToggle(e, data._id);
                                }}
                              >
                                More..
                              </span>
                            </DropdownToggle>
                            <DropdownMenu>
                              {data &&
                                data.assign_to &&
                                data.assign_to.length > 0 &&
                                data.assign_to.map((task, i) => {
                                  if (i + 1 > 2) {
                                    return (
                                      <>
                                        <div
                                          title={data || ""}
                                          style={{
                                            height: "38px",
                                            width: "38px",
                                            backgroundColor: "#d0eaff",
                                            borderRadius: "24px",
                                            textAlign: "center",
                                            color: "black",
                                            marginLeft: "5px",
                                            position: "relative",
                                            zIndex: "999",
                                          }}
                                        >
                                          <span
                                            title={(task && task.email) || ""}
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
                                            {circleCharacter(task)}
                                            {/* {i > 3 && circleCharacter(attendee._id)} */}
                                          </span>
                                        </div>
                                      </>
                                    );
                                  }
                                })}
                            </DropdownMenu>
                          </Dropdown>
                        </>
                      )}
                    </div>
                  </div>
                </li>
              );
            })
          ) : (
            <div className="no-meeting-list">
              <p className="mb-0">No Actions</p>
            </div>
          )}
        </ul>
      </div>
    );
  }
}

export default withRouter(TodayTasks);
