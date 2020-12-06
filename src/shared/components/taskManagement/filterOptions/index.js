import React, { Component } from "react";
import { FormGroup, Input, Label, Button } from "reactstrap";
import DatePicker from "react-datepicker";
import moment from "moment";

class FilterOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDepartments: [],
      totalProjects: [],
      totalMeetings: [],
      currentProjects: [],
      currentMeetings: [],
      selectedDepartment: [],
      selectedProject: [],
      selectedMeeting: [],
      dueDate: null,
      startDate: null,
      endDate: null,
      error: "",
      dropdownOpen: false,
    };
  }
  filterUniqueValue = (tasks, value) => {
    let arr = [];
    tasks &&
      tasks.length > 0 &&
      tasks.filter((item) => {
        const found = arr.some((el) => {
          if (item[value]) {
            return el[value] === item[value];
          } else {
            return (
              el[value] === item.meeting_id[value] ||
              (el.meeting_id && el.meeting_id[value] === item.meeting_id[value])
            );
          }
        });
        if (!found) {
          if (item[value]) {
            arr.push(item);
          } else {
            arr.push(item.meeting_id);
          }
        }
      });
    if (!arr) {
      return [];
    }
    return arr;
  };
  componentDidMount() {
    const { taskDetails, getFetchTasks } = this.props;
    getFetchTasks().then((result) => {
      const { data } = result.payload.data;

      let currentDepartments = this.filterUniqueValue(data, "department");

      console.log("currentDepartments1235", currentDepartments);
      this.setState({
        currentDepartments,
        allData: data ? data : [],
        currentProjects: data ? data : [],
        totalProjects: data ? data : [],
        totalMeetings: data ? data : [],
        currentMeetings: data ? data : [],
        dueDate: taskDetails.dueDateFilters
          ? new Date(taskDetails.dueDateFilters)
          : null,
        startDate: taskDetails.startDateArchived
          ? new Date(taskDetails.startDateArchived)
          : null,
        endDate: taskDetails.endDateArchived
          ? new Date(taskDetails.endDateArchived)
          : null,
      });
    });

    // let archivedTasks = taskDetails && taskDetails.archivedTasks || [];
    // let allMeetings = [];
    // if (archivedTasks && archivedTasks.length > 0) {
    //   for (const task of archivedTasks) {
    //     if (task && task.createdAt) {
    //       let date = moment.utc(task.createdAt).toDate();
    //       let taskDate = moment(taskDate).format("ll");

    //     }
    //     // if (meetingDate !== todayDate) {
    //     //   allMeetings.push(meeting);
    //     // }
    //   }
    //   const obj = {
    //     filteredArchivedTasks: allMeetings
    //   }
    //   setCurrentFilters(obj);
    // }
    // taskDetails && taskDetails.filteredArchivedTasks
  }
  toggleDepratments = (data) => {
    const {
      currentDepartments,
      selectedDepartment,
      totalProjects,
      totalMeetings,
    } = this.state;

    let newProjects = [];
    let newMeetings = [];
    let oldDepartments = selectedDepartment.slice();
    const found =
      selectedDepartment &&
      selectedDepartment.length > 0 &&
      selectedDepartment.some((el) => {
        return el.department === data.department;
      });
    if (!found) {
      let departments = currentDepartments.slice();
      const indexDeleted = currentDepartments.filter(
        (item) => item.department !== data.department
      );

      indexDeleted &&
        indexDeleted.length > 0 &&
        indexDeleted.map((data) => {
          const index = departments.findIndex((item) => item === data);
          departments.splice(index, 1);
        });
      oldDepartments = [...oldDepartments, ...departments];
    } else {
      const index = oldDepartments.findIndex((item) => item === data);
      oldDepartments.splice(index, 1);
    }
    totalProjects.forEach((item) => {
      oldDepartments.forEach((old) => {
        if (old.department && item.department) {
          if (item.department === old.department) {
            newProjects.push(item);
          }
        } else if (item.department) {
          if (item.department === old.meeting_id.department) {
            newProjects.push(item);
          }
        } else if (old.department) {
          if (item.meeting_id.department === old.department) {
            newProjects.push(item);
          }
        } else {
          if (item.meeting_id.department === old.meeting_id.department) {
            newProjects.push(item);
          }
        }
      });
    });
    newProjects = this.filterUniqueValue(newProjects, "project_name");
    totalMeetings.forEach((meetingData) => {
      oldDepartments.forEach((old) => {
        if (meetingData && meetingData.department && old.department) {
          if (meetingData.department === old.department) {
            newMeetings.push(meetingData);
          }
        } else if (meetingData.department) {
          if (meetingData.department === old.meeting_id.department) {
            newMeetings.push(meetingData);
          }
        } else if (old.department) {
          if (meetingData.meeting_id.department === old.department) {
            newMeetings.push(meetingData);
          }
        } else {
          if (meetingData.meeting_id.department === old.meeting_id.department) {
            newMeetings.push(meetingData);
          }
        }
      });
    });
    newMeetings = this.filterUniqueValue(newMeetings, "title");
    this.setState({
      currentProjects: newProjects,
      currentMeetings: newMeetings,
      selectedDepartment: oldDepartments,
    });
  };

  toggleProjects = (data) => {
    const { currentProjects, selectedProject, totalMeetings } = this.state;

    let newMeetings = [];
    let oldProjects = selectedProject.slice();
    const found =
      selectedProject &&
      selectedProject.length > 0 &&
      selectedProject.some((el) => {
        return el.project_name === data.project_name;
      });
    if (!found) {
      let projects = currentProjects.slice();
      const indexDeleted = currentProjects.filter(
        (item) => item.project_name !== data.project_name
      );

      indexDeleted &&
        indexDeleted.length > 0 &&
        indexDeleted.map((data) => {
          const index = projects.findIndex((item) => item === data);
          projects.splice(index, 1);
        });
      oldProjects = [...oldProjects, ...projects];
    } else {
      const index = oldProjects.findIndex((item) => item === data);
      oldProjects.splice(index, 1);
    }

    totalMeetings.forEach((meetingData) => {
      oldProjects.forEach((old) => {
        if (meetingData && meetingData.project_name && old.project_name) {
          if (meetingData.project_name === old.project_name) {
            newMeetings.push(meetingData);
          }
        } else if (meetingData.project_name) {
          if (meetingData.project_name === old.meeting_id.project_name) {
            newMeetings.push(meetingData);
          }
        } else if (old.project_name) {
          if (meetingData.meeting_id.project_name === old.project_name) {
            newMeetings.push(meetingData);
          }
        } else {
          if (
            meetingData.meeting_id.project_name === old.meeting_id.project_name
          ) {
            newMeetings.push(meetingData);
          }
        }
      });
    });
    newMeetings = this.filterUniqueValue(newMeetings, "title");
    this.setState({
      currentMeetings: newMeetings,
      selectedProject: oldProjects,
    });
  };
  toggleMeetings = (data) => {
    const { currentMeetings, selectedMeeting } = this.state;
    let oldMeetings = selectedMeeting.slice();
    const found =
      selectedMeeting &&
      selectedMeeting.length > 0 &&
      selectedMeeting.some((el) => {
        return el.title === data.title;
      });
    if (!found) {
      let meetings = currentMeetings.slice();
      const indexDeleted = currentMeetings.filter(
        (item) => item.title !== data.title
      );

      indexDeleted &&
        indexDeleted.length > 0 &&
        indexDeleted.map((data) => {
          const index = meetings.findIndex((item) => item === data);
          meetings.splice(index, 1);
        });
      oldMeetings = [...oldMeetings, ...meetings];
    } else {
      const index = oldMeetings.findIndex((item) => item === data);
      oldMeetings.splice(index, 1);
    }

    this.setState({
      selectedMeeting: oldMeetings,
    });
  };

  clearFilters = (e) => {
    e.preventDefault();
    const { isUpdated, isFilterApplied } = this.props;
    isFilterApplied(false);
    this.setState({
      currentDepartments: [],
      currentProjects: [],
      currentMeetings: [],
      selectedDepartment: [],
      selectedProject: [],
      selectedMeeting: [],
      totalMeetings: [],
      totalProjects: [],
    });
    isUpdated(false);
  };
  applyFilters = (e) => {
    e.preventDefault();
    const {
      selectedDepartment,
      selectedProject,
      selectedMeeting,
      dueDate,
      startDate,
      endDate,
    } = this.state;
    const {
      applyFilters,
      userDetails,
      isFilterApplied,
      setCurrentFilters,
      taskDetails,
    } = this.props;
    if (taskDetails && taskDetails.showArchived) {
      if (startDate <= endDate) {
        isFilterApplied(true);
        let archivedTasks =
          (taskDetails &&
            taskDetails.archivedTasks &&
            taskDetails.archivedTasks.tasks) ||
          [];
        let allMeetings = [];
        if (archivedTasks && archivedTasks.length > 0) {
          for (const task of archivedTasks) {
            if (task && task.createdAt) {
              let taskDate = moment.utc(task.createdAt).toDate();
              taskDate.setHours(0);
              taskDate.setMinutes(0);
              taskDate.setSeconds(0);
              taskDate.setMilliseconds(0);
              if (taskDate) {
                if (taskDate >= startDate && taskDate <= endDate) {
                  allMeetings.push(task);
                }
              }
            }
          }
          const obj = {
            filteredArchivedTasks: allMeetings,
            startDate,
            endDate,
          };
          setCurrentFilters(obj);
        }
      } else if (startDate > endDate) {
        this.setState({
          error: "End date must be greater than start date",
        });
      } else if (!startDate || !endDate) {
        this.setState({
          error: "Please enter date",
        });
      }
    } else {
      let departments = [];
      let projects = [];
      let titles = [];
      selectedDepartment &&
        selectedDepartment.length > 0 &&
        selectedDepartment.forEach((data) => {
          departments.push(data.department);
        });
      selectedProject &&
        selectedProject.length > 0 &&
        selectedProject.forEach((data) => {
          projects.push(data.project_name);
        });
      selectedMeeting &&
        selectedMeeting.length > 0 &&
        selectedMeeting.forEach((data) => {
          titles.push(data.title);
        });

      const obj = {
        email: userDetails.email,
        departments: departments,
        titles: titles,
        project_names: projects,
        due_date: dueDate ? dueDate : null,
      };
      applyFilters(obj).then((result) => {
        const { status } = result.payload.data;
        if (status === 200) {
          isFilterApplied(true);
          const obj = {
            selectedDepartment,
            selectedProject,
            selectedMeeting,
            dueDate,
          };
          setCurrentFilters(obj);
        }
      });
    }
  };
  render() {
    const { isOpen, filterData, taskDetails } = this.props;
    const {
      currentDepartments,
      currentProjects,
      currentMeetings,
      dueDate,
      startDate,
      endDate,
      error,
      dropdownOpen,
      selectedDepartment,
      selectedProject,
      selectedMeeting,
    } = this.state;
    let isDisabled;
    if (taskDetails && taskDetails.showArchived) {
      isDisabled = startDate === null && endDate === null;
    } else {
      isDisabled =
        currentDepartments.length === 0 &&
        currentProjects.length === 0 &&
        currentMeetings.length === 0 &&
        dueDate === null;
    }
    console.log(currentProjects, "currentDepartmentscurrentDepartments");
    return (
      <div className={`taskMgmt-filter ${isOpen ? "open" : ""}`}>
        {taskDetails.showArchived ? (
          <div>
            <div className="filterWrap">
              <div className="d-flex align-items-center">
                <h4 className="mb-0">Start Date</h4>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    this.setState({
                      startDate: date,
                    });
                  }}
                  isClearable
                  showTimeInput={false}
                  dateFormat="d/MM/yyyy"
                  placeholderText="Start date"
                  className="form-control date"
                  // minDate={moment().toDate()}
                />
              </div>
              <div className="d-flex align-items-center ml-5">
                <h4 className="mb-0">End Date</h4>
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    this.setState({
                      endDate: date,
                    });
                  }}
                  isClearable
                  showTimeInput={false}
                  dateFormat="d/MM/yyyy"
                  placeholderText="End date"
                  className="form-control date"
                  // minDate={moment().toDate()}
                />
              </div>
            </div>
            {error && error.length > 0 && (
              <span className="text-danger">{error}</span>
            )}
          </div>
        ) : (
          <div>
            <div className="filterWrap">
              <div className="filterLabels d-flex align-items-center ">
                <h4 className="mb-0">Due Date</h4>
                <DatePicker
                  selected={dueDate}
                  onChange={(date) => {
                    this.setState({
                      dueDate: date,
                    });
                  }}
                  isClearable
                  showTimeInput={false}
                  dateFormat="d/MM/yyyy"
                  placeholderText="Due date"
                  className="form-control date"
                  minDate={moment().toDate()}
                />
              </div>
            </div>
            <div className="filterWrap">
              <div className="filterLabels">
                <h4 className="mb-0">Department</h4>
              </div>
              <div className="d-flex flex-wrap filterOptions">
                {currentDepartments &&
                  currentDepartments.length > 0 &&
                  currentDepartments.map((data) => {
                    const selectedItem =
                      selectedDepartment &&
                      selectedDepartment.length > 0 &&
                      selectedDepartment.findIndex(
                        (item) => item.department === data.department
                      );

                    return (
                      <FormGroup check>
                        <div onClick={() => this.toggleDepratments(data)}>
                          <Input
                            type="checkbox"
                            checked={
                              selectedDepartment.length > 0 && selectedItem > -1
                            }
                          />
                          <Label className="checkbox-icon">
                            {data && data.department
                              ? data.department
                              : "Others"}
                          </Label>
                        </div>
                      </FormGroup>
                    );
                  })}
              </div>
            </div>
            {selectedDepartment && selectedDepartment.length > 0 && (
              <div className="filterWrap">
                <div className="filterLabels">
                  <h4 className="mb-0">Projects</h4>
                </div>
                <div className="d-flex flex-wrap filterOptions">
                  {currentProjects &&
                    currentProjects.length > 0 &&
                    currentProjects.map((data) => {
                      const department = selectedDepartment.findIndex(
                        (item) => item.department === data.department
                      );
                      console.log("currentProjectscurrentProjects", department);
                      if (department > -1) {
                        const selectedItem = selectedProject.findIndex(
                          (item) => item.project_name === data.project_name
                        );
                        return (
                          <FormGroup check>
                            <div onClick={() => this.toggleProjects(data)}>
                              <Input
                                type="checkbox"
                                checked={
                                  selectedProject.length > 0 &&
                                  selectedItem > -1
                                }
                              />
                              <Label className="checkbox-icon">
                                {data.project_name
                                  ? data.project_name
                                  : "Others"}
                              </Label>
                            </div>
                          </FormGroup>
                        );
                      }
                    })}
                </div>
              </div>
            )}
            {selectedProject && selectedProject.length > 0 && (
              <div className="filterWrap">
                <div className="filterLabels">
                  <h4 className="mb-0">Meetings</h4>
                </div>
                <div className="d-flex flex-wrap filterOptions">
                  {currentMeetings.map((data) => {
                    const project = selectedProject.findIndex(
                      (item) => item.project_name === data.project_name
                    );

                    if (project > -1) {
                      const selectedItem = selectedMeeting.findIndex(
                        (item) => item.title === data.title
                      );
                      return (
                        <FormGroup check>
                          <div onClick={() => this.toggleMeetings(data)}>
                            <Input
                              type="checkbox"
                              checked={
                                selectedMeeting.length > 0 && selectedItem > -1
                              }
                            />
                            <Label className="checkbox-icon">
                              {data.title || "Others"}
                            </Label>
                          </div>
                        </FormGroup>
                      );
                    }
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        <div className="filterSubmittedBtn">
          <Button disabled={isDisabled} onClick={(e) => this.applyFilters(e)}>
            Apply
          </Button>
          <Button className="clearBtn" onClick={(e) => this.clearFilters(e)}>
            Clear All
          </Button>
        </div>
      </div>
    );
  }
}

export default FilterOptions;
