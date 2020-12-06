import React, { Component } from "react";
import _ from "lodash";
import TaskContent from "./taskContent";
import PieChartComponent from "./pieChart";
import FiterIcon from "../../../asset/images/mom-icons/Filter.png";
import ArchivedIcon from "../../../asset/images/mom-icons/Archived.png";
import FilterOptions from "./filterOptions";
import SidebarContent from "./taskDetails";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Select from "react-select";
import { circleCharacter } from "../createMeeting/createMeetingComponent";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

const RenderListItem = ({
  index,
  userDetails,
  taskReminder,
  setTaskSummaryData,
  sidebarToggle,
  typeOfTask,
  taskDetail,
}) => {
  return (
    <li>
      {" "}
      <TaskContent
        key={index}
        userDetails={userDetails}
        taskReminder={taskReminder}
        sidebarToggle={sidebarToggle}
        setTaskSummaryData={setTaskSummaryData}
        type={typeOfTask}
        taskDetails={taskDetail}
      />
    </li>
  );
};

class TaskManagementComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      isVisible: false,
      isUpdated: false,
      dropdownOpen: false,
      dropdownDeleteIndex: "",
      dropdownUserIndex: "",
      archivedSelect: {
        label: "",
        value: "",
      },
      assignees: [],
      seletedAssignee: "All",
    };
    // this.filterToggle = this.filterToggle.bind(this);
  }

  filterTask = (data, email) => {
    const index = data.findIndex((item) => {
      return item.email === email;
    });
    if (index > -1) {
      return true;
    } else {
      return false;
    }
  };

  componentDidMount() {
    const {
      fetchTasks,
      userDetails,
      taskDetails,
      setTaskType,
      location,
      setTaskSummaryData,
      history,
    } = this.props;

    if (userDetails && userDetails.isLicenseExpired) {
      history.push("/view/profile");
    }
    if (
      userDetails.license_key &&
      userDetails.license_key.expiry_date &&
      moment(userDetails.license_key.expiry_date)._d < new Date()
    ) {
      history.push("/view/profile");
    }
    const obj = {
      email: userDetails.email,
    };
    if (taskDetails.filterApplied === false) {
      fetchTasks(obj).then((result) => {
        const { status, assignees } = result.payload.data;
        console.log("hfudshfjdhfjd", result);
        if (status === 200) {
          const arr = [];
          assignees.filter((item) => {
            item.assign_to &&
              item.assign_to.length > 0 &&
              item.assign_to.map((assign) => {
                let obj = {
                  email: assign.email,
                  name: assign.name,
                };
                const found = arr.some((el) => {
                  return el.name === obj.name;
                });
                if (!found) arr.push(obj);
              });
          });
          this.setState({ assignees: arr });
          setTaskType("All Actions");
          const { allTask } = result.payload.data;
          // if (location && location.search) {

          const values = queryString.parse(location.search);
          const taskId = values && values.tid;
          let totalTasksArr = [];
          totalTasksArr = totalTasksArr.concat(
            allTask &&
              allTask.length > 0 &&
              allTask.filter((item) => item.status === "not_started")
          );
          totalTasksArr = totalTasksArr.concat(
            allTask &&
              allTask.length > 0 &&
              allTask.filter((item) => item.status === "in_progress")
          );
          totalTasksArr = totalTasksArr.concat(
            allTask &&
              allTask.length > 0 &&
              allTask.filter((item) => item.status === "completed")
          );
          totalTasksArr = totalTasksArr.concat(
            allTask &&
              allTask.length > 0 &&
              allTask.filter((item) => item.status === "over_due")
          );
          totalTasksArr = totalTasksArr.concat(
            allTask &&
              allTask.length > 0 &&
              allTask.filter((item) => item.status === "cancelled")
          );
          totalTasksArr = totalTasksArr.concat(
            allTask &&
              allTask.length > 0 &&
              allTask.filter((item) => item.status === "postponed")
          );
          const task = totalTasksArr.find((task) => {
            console.log(task, "tasktasktasktask");
            return task && task._id === taskId;
          });
          if (task) {
            setTaskSummaryData(task);
            this.sidebarToggle();
            history.push("/view/tasks");
          }
          // }
        }
      });
    } else if (taskDetails.filterApplied) {
      this.setState({
        isOpen: true,
      });
    }

    this.setState({
      archivedSelect: {
        label: taskDetails.archivedType,
        value: taskDetails.archivedType,
      },
    });
  }

  filterToggle = () => {
    this.setState((prevState) => ({
      isOpen: !prevState.isOpen,
    }));
  };
  onArchived = (bool) => {
    const { setArchivedStatus, setArchivedType } = this.props;
    setArchivedStatus(bool);
    if (bool) {
      setArchivedType("All");
      this.setState({
        archivedSelect: { label: "All", value: "All" },
      });
    }
    // this.filterToggle();
  };

  sidebarToggle = () => {
    this.setState({
      isVisible: !this.state.isVisible,
    });
  };

  isUpdated = (isFilter) => {
    const { fetchTasks, userDetails, taskDetails, setTaskType } = this.props;
    const obj = {
      email: userDetails.email,
    };
    // const { isUpdated } = this.state
    if (taskDetails.filterApplied === false || isFilter === false) {
      this.setState({
        isOpen: false,
      });
      fetchTasks(obj).then((result) => {
        const { status } = result.payload.data;
        if (status === 200) {
          setTaskType("All Actions");
        }
      });
    }
  };

  checkTasks(taskDetail) {
    const { taskDetails, userDetails } = this.props;
    return (
      taskDetails.taskType === "All Actions" ||
      (taskDetails.taskType === "My Actions" &&
        taskDetail.assign_to &&
        taskDetail.assign_to.length > 0 &&
        this.filterTask(taskDetail.assign_to, userDetails.email)) ||
      (taskDetails.taskType === "Organiser Actions" &&
        taskDetail.admin_email === userDetails.email &&
        taskDetail.assign_to &&
        taskDetail.assign_to.length > 0 &&
        !this.filterTask(taskDetail.assign_to, userDetails.email))
    );
  }

  renderTaskDetails = (taskArray) => {
    const { seletedAssignee } = this.state;
    let length = 0,
      component,
      tasks = taskArray;
    if (_.head(tasks)) {
      // const sortedTaskArray = _.head(tasks) && _.sortBy(tasks, "due_date");
      // taskArray.tasks = sortedTaskArray
      if (seletedAssignee !== "All") {
        component = taskArray.map((taskDetail, index) => {
          const ind = taskDetail.assign_to.findIndex(
            (i) =>
              (i.name && i.name === seletedAssignee) ||
              i.email === seletedAssignee
          );
          if (this.checkTasks(taskDetail) && ind > -1) {
            length += 1;
            return (
              <RenderListItem
                index={index}
                {...this.props}
                sidebarToggle={this.sidebarToggle}
                typeOfTask={taskArray.type}
                taskDetail={taskDetail}
              />
            );
          }
        });
      } else {
        component = taskArray.map((taskDetail, index) => {
          if (this.checkTasks(taskDetail)) {
            length += 1;
            return (
              <RenderListItem
                index={index}
                {...this.props}
                sidebarToggle={this.sidebarToggle}
                typeOfTask={taskArray.type}
                taskDetail={taskDetail}
              />
            );
          }
        });
      }
    }
    return { component, hasLength: length };
  };

  dtToggle = (e, index) => {
    e.preventDefault();
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      dropdownUserIndex: index,
      id: "",
    });
  };

  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  dropdownToggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };
  onArchivedSelect = (data) => {
    const { setArchivedType } = this.props;
    this.setState({
      archivedSelect: data,
    });
    let type = "";
    if (data.value === "Cancelled") {
      type = "Cancelled";
    } else if (data.value === "Postponed") {
      type = "Postponed";
    } else {
      type = "All";
    }
    setArchivedType(type);
  };

  selectAssignee = (name) => {
    this.setState({ seletedAssignee: name });
  };

  render() {
    const {
      notStartedTasks,
      inProgressTasks,
      completedTasks,
      overDueTasks,
      filterData,
      showArchived,
      archivedTasks,
      archivedType,
      filteredArchivedTasks,
      filterApplied,
      startDateArchived,
    } = this.props.taskDetails;

    const {
      setTaskSummaryData,
      updateTask,
      taskDetails,
      userDetails,
      addComment,
      deleteTask,
      taskReminder,
      applyFilters,
      isFilterApplied,
      setCurrentFilters,
      getParticularTasks,
      setTaskType,
    } = this.props;
    const {
      dropdownOpen,
      dropdownUserIndex,
      archivedSelect,
      assignees,
      seletedAssignee,
    } = this.state;
    console.log(taskDetails, "archivedTasksarchivedTasksarchivedTasks");
    const options = [
      { value: "All", label: "All" },
      { value: "Cancelled", label: "Cancelled" },
      { value: "Postponed", label: "Postponed" },
    ];

    let notStartedTask, inProgressTask, completedTask, overDueTask;

    notStartedTask = this.renderTaskDetails(notStartedTasks);

    inProgressTask = this.renderTaskDetails(inProgressTasks);

    completedTask = this.renderTaskDetails(completedTasks);

    overDueTask = this.renderTaskDetails(overDueTasks);

    let totalTasks =
      filterApplied && startDateArchived
        ? filteredArchivedTasks
        : (archivedTasks && archivedTasks) || [];
    let archivedFilteredTasks = [];
    let cancelledTasks = [];
    let postponedTasks = [];
    if (totalTasks && totalTasks.length > 0) {
      for (let i = 0; i < totalTasks.length; i++) {
        if (totalTasks[i].status === "cancelled") {
          cancelledTasks.push(totalTasks[i]);
        } else {
          postponedTasks.push(totalTasks[i]);
        }
      }
      if (archivedType === "All") {
        archivedFilteredTasks = totalTasks;
      } else if (archivedType === "Cancelled") {
        archivedFilteredTasks = cancelledTasks;
      } else if (archivedType === "Postponed") {
        archivedFilteredTasks = postponedTasks;
      }
    }

    return (
      <>
        <div
          className={`sidebarCardWrap ${this.state.isVisible ? "opening" : ""}`}
        >
          <div className="sidebar-overlay" onClick={this.sidebarToggle}></div>
          {this.state.isVisible && (
            <SidebarContent
              isFilterApplied={isFilterApplied}
              taskReminder={taskReminder}
              deleteTask={deleteTask}
              isUpdated={this.isUpdated}
              addComment={addComment}
              userDetails={userDetails}
              updateTask={updateTask}
              sidebarToggle={this.sidebarToggle}
            />
          )}
        </div>

        <div className="dashboard-wrapper mb-5">
          <div className="dashboard-content">
            <div className="dashboard-title">
              <h2>Action Management</h2>
            </div>

            <div className="task-mgmtWrap">
              <div className="total-taskMgmt">
                <h3>Actions</h3>
                <PieChartComponent
                  setTaskType={setTaskType}
                  userDetails={userDetails}
                  getParticularTasks={getParticularTasks}
                  taskDetails={this.props.taskDetails}
                />
              </div>
              <div className="taskMgmt-list">
                {!showArchived && (
                  <h3>
                    {taskDetails && taskDetails.taskType
                      ? taskDetails.taskType
                      : "All Actions"}{" "}
                  </h3>
                )}
                <div>
                  <h4 className="text-right">
                    <div className="archieve-dropdown">
                      <div className="filterLabels d-flex align-items-center mr-2">
                        <h4>Assignee</h4>
                        <Dropdown
                          isOpen={dropdownOpen}
                          toggle={this.dropdownToggle}
                          className="filter-dropdown"
                        >
                          <DropdownToggle caret>
                            {seletedAssignee}
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => this.selectAssignee("All")}
                            >
                              All
                            </DropdownItem>

                            {assignees &&
                              assignees.length > 0 &&
                              assignees.map((i, index) => (
                                <>
                                  <DropdownItem divider className="my-0" />
                                  <DropdownItem
                                    onClick={() => this.selectAssignee(i.name)}
                                  >
                                    {i.name || i.email}
                                  </DropdownItem>
                                </>
                              ))}
                          </DropdownMenu>
                        </Dropdown>
                      </div>
                      {showArchived ? (
                        <>
                          <span onClick={() => this.onArchived(false)}>
                            <img src={ArchivedIcon} alt="" className="mr-2" />
                            View All Actions
                          </span>
                        </>
                      ) : (
                        <span onClick={() => this.onArchived(true)}>
                          <img src={ArchivedIcon} alt="" className="mr-2" />
                          View Archived
                        </span>
                      )}
                      <span className="mx-3">|</span>
                      <span onClick={this.filterToggle}>
                        <img src={FiterIcon} alt="" className="mr-2" />
                        Filter
                      </span>
                    </div>
                  </h4>
                </div>
                {this.state.isOpen && (
                  <FilterOptions
                    taskDetails={taskDetails}
                    setCurrentFilters={setCurrentFilters}
                    isFilterApplied={isFilterApplied}
                    isUpdated={this.isUpdated}
                    userDetails={userDetails}
                    applyFilters={applyFilters}
                    filterData={filterData}
                    isOpen={this.state.isOpen}
                    getFetchTasks={this.props.getFetchTasks}
                  />
                )}
                {showArchived ? (
                  <div>
                    <h3 className="mt-4 d-flex align-items-center">
                      Archived Actions
                      <span className="ml-3 archieved-action">
                        <Select
                          classNamePrefix="task"
                          options={options}
                          className="mr-3 text-left"
                          onChange={(data) => this.onArchivedSelect(data)}
                          value={
                            archivedSelect.value
                              ? {
                                  label: archivedSelect.label,
                                  value: archivedSelect.value,
                                }
                              : { label: "All", value: "All" }
                          }
                        />
                      </span>
                    </h3>

                    <ul className="meetings-list list-overflow mt-4">
                      {archivedFilteredTasks &&
                      archivedFilteredTasks.length > 0 ? (
                        archivedFilteredTasks.map((data) => {
                          let dueDate = moment.utc(data.due_date).toDate();
                          let DueDate = moment
                            .utc(dueDate)
                            .format("DD-MM-YYYY");
                          let DueDateTime = moment(dueDate).format("LT");
                          return (
                            <li
                              onClick={() => {
                                setTaskSummaryData(data);
                                this.sidebarToggle();
                              }}
                            >
                              <div className="date">
                                <h5>{DueDateTime || ""}</h5>
                              </div>
                              <div className="meeting-content">
                                <div className="meeting-details">
                                  <h3>{(data && data.task) || ""}</h3>
                                  <p>Due Date - ({DueDate})</p>
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
                                                  transform:
                                                    "translate(-50%, -50%)",
                                                }}
                                              >
                                                {circleCharacter(task)}
                                              </span>
                                            </div>
                                          </div>
                                        );
                                      }
                                    })}
                                  {data &&
                                    data.assign_to &&
                                    data.assign_to.length > 2 && (
                                      <>
                                        <Dropdown
                                          className="dropdown-more"
                                          isOpen={
                                            dropdownOpen &&
                                            dropdownUserIndex === data._id
                                          }
                                          size="sm"
                                          toggle={(e) =>
                                            this.dtToggle(e, data._id)
                                          }
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
                                                          backgroundColor:
                                                            "#d0eaff",
                                                          borderRadius: "24px",
                                                          textAlign: "center",
                                                          color: "black",
                                                          marginLeft: "5px",
                                                          position: "relative",
                                                          zIndex: "999",
                                                        }}
                                                      >
                                                        <span
                                                          title={
                                                            (task &&
                                                              task.email) ||
                                                            ""
                                                          }
                                                          style={{
                                                            position:
                                                              "absolute",
                                                            top: "50%",
                                                            left: "50%",
                                                            transform:
                                                              "translate(-50%, -50%)",
                                                            // }}>{(attendee._id.email.charAt(0).toUpperCase())}
                                                            // {i > 3 && attendee._id.email.charAt(0).toUpperCase()}
                                                          }}
                                                        >
                                                          {circleCharacter(
                                                            task
                                                          )}
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
                ) : (
                  <div className="taskStatusWrapper">
                    <div className="task-statusWrap">
                      <div className="statusBox notStarted">
                        <div className="taskStatus-header d-flex justify-content-between">
                          <h4>Not Started</h4>
                          <p className="mb-0">
                            {(notStartedTask && notStartedTask.hasLength) || 0}
                          </p>
                        </div>
                        <div className="taskStatus-body">
                          {notStartedTask && notStartedTask.hasLength > 0 && (
                            <ul className="pl-0 taskContent">
                              {notStartedTask.component}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="statusBox inProgress">
                        <div className="taskStatus-header d-flex justify-content-between">
                          <h4>In Progress</h4>
                          <p className="mb-0">
                            {(inProgressTask && inProgressTask.hasLength) || 0}
                          </p>
                        </div>
                        <div className="taskStatus-body">
                          {inProgressTask && inProgressTask.hasLength > 0 && (
                            <ul className="pl-0 taskContent">
                              {inProgressTask.component}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="statusBox completed">
                        <div className="taskStatus-header d-flex justify-content-between">
                          <h4>Completed</h4>
                          <p className="mb-0">
                            {(completedTask && completedTask.hasLength) || 0}
                          </p>
                        </div>
                        <div className="taskStatus-body">
                          {completedTask && completedTask.hasLength > 0 && (
                            <ul className="pl-0 taskContent">
                              {completedTask.component}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="statusBox overDue">
                        <div className="taskStatus-header d-flex justify-content-between">
                          <h4>Over Due</h4>
                          <p className="mb-0">
                            {(overDueTask && overDueTask.hasLength) || 0}
                          </p>
                        </div>
                        <div className="taskStatus-body">
                          {overDueTask && overDueTask.hasLength > 0 && (
                            <ul className="pl-0 taskContent">
                              {overDueTask.component}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>

                    {notStartedTask.hasLength === 0 &&
                      inProgressTask.hasLength === 0 &&
                      completedTask.hasLength === 0 &&
                      overDueTask.hasLength === 0 && (
                        <div className="no-task-found">No Actions Found</div>
                      )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(TaskManagementComponent);
