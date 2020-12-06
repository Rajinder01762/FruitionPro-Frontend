/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from "react";
import {
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap";
import DatePicker from "react-datepicker";
import PlusIcon from "../../../../asset/images/icons/PlusIcon.png";
import DeleteIcon from "../../../../asset/images/dashboard-icons/cancel.svg";
import Select from "react-select";
import moment from "moment";

export default class AgendaNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: [{ task: "", due_date: "", assign_to: [] }],
      decisions: [""],
      notes: "",
      modal: false,
      minTime: this.calculateMinTime(new Date()),
      newUsers: [""],
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState((prevState) => ({
      modal: !prevState.modal,
    }));
  }

  componentDidMount() {
    const { agendaTask } = this.props;

    if (agendaTask && agendaTask.tasks) {
      this.setState({
        tasks:
          agendaTask.tasks && agendaTask.tasks.length > 0
            ? agendaTask.tasks
            : [{ task: "", due_date: "", assign_to: [] }],
        decisions:
          agendaTask.decisions && agendaTask.decisions.length > 0
            ? agendaTask.decisions
            : [""],
        notes: agendaTask.notes || "",
      });
    } else {
      this.resetState();
    }
  }

  resetState = () => {
    this.setState({
      tasks: [{ task: "", due_date: "", assign_to: [] }],
      decisions: [""],
      notes: "",
    });
  };

  handleDecision = (value, index, key) => {
    const { decisions } = this.state;
    const oldValues = [...decisions];
    if (key === "update") {
      oldValues.splice(index, 1, value);
    } else if (key === "new") {
      oldValues.push("");
    } else if (key === "delete") {
      oldValues.splice(index, 1);
    }
    this.setState({ decisions: oldValues });
  };

  handleNewUsers = (value, index, key) => {
    const { newUsers } = this.state;
    const oldValues = [...newUsers];
    if (key === "update") {
      oldValues.splice(index, 1, value);
    } else if (key === "new") {
      oldValues.push("");
    } else if (key === "delete") {
      oldValues.splice(index, 1);
    }
    this.setState({ newUsers: oldValues });
  };

  handleTaskValues = (value, index, key) => {
    let data = value;

    if (key === "due_date" && value) {
      if (value < new Date()) {
        data = new Date().toUTCString();
      } else {
        data = value.toUTCString();
      }

      // this.setState({ minTime: this.calculateMinTime(value) })
    }

    const { tasks } = this.state;
    const tasksData = [...tasks];

    const newData = {
      ...tasksData[index],
      [key]: data,
    };

    tasksData.splice(index, 1, newData);
    let tasksArr = [];
    tasksData &&
      tasksData.length > 0 &&
      tasksData.map((task) => {
        let obj = { ...task };
        obj.assign_to = [];

        task.assign_to &&
          task.assign_to.length > 0 &&
          task.assign_to.map((item) => {
            if (item.email) {
              obj.assign_to.push(item.email);
            } else {
              obj.assign_to.push(item);
            }
          });
        tasksArr.push(obj);
      });
    this.setState({ tasks: tasksArr });
  };

  handleAddRemoveTask = (operation, index) => {
    const { tasks } = this.state;
    const tasksData = [...tasks];
    if (operation === "delete") {
      tasksData.splice(index, 1);
      this.setState({ tasks: tasksData });
    } else if (operation === "new") {
      let tasksArr = [];

      tasksData &&
        tasksData.length > 0 &&
        tasksData.map((task) => {
          let obj = { ...task };
          obj.assign_to = [];

          task.assign_to &&
            task.assign_to.length > 0 &&
            task.assign_to.map((item) => {
              if (item.email) {
                obj.assign_to.push(item.email);
              } else {
                obj.assign_to.push(item);
              }
            });
          tasksArr.push(obj);
        });
      tasksArr.push({ task: "", due_date: "", assign_to: "" });
      this.setState({ tasks: tasksArr });
    }
  };

  formatOptionData = () => {
    const { paricipants, userDetails } = this.props;
    const { email } = userDetails;
    const { newUsers } = this.state;

    let options = [];
    const index = paricipants.findIndex((i) => i.email === email);
    if (index === -1) {
      options.push({ label: email, value: email });
    }
    paricipants.forEach((element) => {
      options.push({
        label: element.email,
        value: element.email,
      });
    });
    newUsers.forEach((element) => {
      element &&
        options.push({
          label: element,
          value: element,
        });
    });

    return options;
  };

  getFormattedValue = (selectedOptions) => {
    //let optionValue = { label: value || "", value: value || "" };

    let formattedSelected = [];
    if (selectedOptions && selectedOptions.length > 0) {
      selectedOptions.forEach((data) => {
        formattedSelected.push({
          label: data.email ? data.email : data,
          value: data.email ? data.email : data,
        });
      });
    }

    return formattedSelected;
  };

  getErrorMessage = (data) => {
    if (!!data) {
      // const todayDate = new Date();
      // let date = new Date(data.due_date);

      if (data.task) {
        if (data && data.assign_to && data.assign_to.length === 0) {
          return "Please assign task";
        }
        if (!data.due_date) {
          return "Please Enter Due Date";
        }
        if (data.assign_to.length !== 0 && !data.due_date) {
          return "Please Enter Due Date";
        }
        // if (todayDate > date) {
        //   return "Please select future date and time"
        // }
      } else if (data.due_date !== "" || data.assign_to.length !== 0) {
        return "Please enter task";
      }
    }
    return "";
    // {data.assign_to.length !== 0 && !data.task ? (
    //   <span className="text-danger">Please enter task </span>
    // ) : (
    //     ""
    //   )}
  };
  calculateMinTime = (date, type) => {
    let isToday = moment(date).isSame(moment(), "day");

    if (isToday) {
      let nowAddOneHour;
      if (type === "end") {
        nowAddOneHour = moment().add({ minutes: 30 }).toDate();
      } else {
        nowAddOneHour = moment(new Date()).add({ hours: 0 }).toDate();
      }

      return nowAddOneHour;
    } else {
      // this.setState({ endDateTime: moment(date).add({ minutes: 30 }).toDate() })
      return moment().startOf("day").toDate(); // set to 12:00 am today
    }
  };
  render() {
    const { decisions, tasks, notes, newUsers } = this.state;
    const { canEdit, meetingStatus } = this.props;

    return (
      <>
        <div className="notes-area">
          <Label>Add Notes</Label>
          <div onClick={this.toggle} className="agenda-notesArea">
            {notes ? (
              <pre>{notes.split("\n", 1)[0] || ""}</pre>
            ) : (
              <input
                placeholder="Enter notes"
                readOnly
                disabled={!canEdit || meetingStatus === "close"}
              />
            )}
          </div>

          <div className="pt-3 decision-task">
            <Label>Add Users</Label>
            {newUsers.map((data, index) => {
              return (
                <div className="d-flex align-items-center">
                  <input
                    value={data}
                    onChange={(e) =>
                      this.handleNewUsers(e.target.value, index, "update")
                    }
                    type="text"
                    placeholder="Enter additional users to assign tasks to"
                    className="add-note mr-2"
                    disabled={!canEdit || meetingStatus === "close"}
                  />

                  {canEdit && index !== decisions.length - 1 && (
                    <img
                      onClick={() =>
                        meetingStatus !== "close" &&
                        this.handleNewUsers(null, index, "delete")
                      }
                      src={DeleteIcon}
                    />
                  )}
                  {canEdit && index === decisions.length - 1 && (
                    <img
                      onClick={() =>
                        meetingStatus !== "close" &&
                        this.handleNewUsers(null, null, "new")
                      }
                      src={PlusIcon}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="task-label">
            <Label>Add Action</Label>
          </div>
          {tasks.map((data, index) => {
            const formattedDate = data.due_date ? new Date(data.due_date) : "";

            return (
              <div className="add-task">
                <div className="task-content">
                  <div className="add-input">
                    <input
                      onChange={(e) =>
                        this.handleTaskValues(e.target.value, index, "task")
                      }
                      value={data.task}
                      type="text"
                      placeholder="Enter action"
                      disabled={!canEdit || meetingStatus === "close"}
                    />
                  </div>
                  <div className="multiSelect-task">
                    <Select
                      isMulti
                      key={`index${data.task}`}
                      placeholder="Assign To"
                      options={this.formatOptionData()}
                      value={this.getFormattedValue(data.assign_to)}
                      onChange={(data) => {
                        let values = [];
                        if (data) {
                          data.forEach((element) => values.push(element.value));
                        }
                        this.handleTaskValues(values, index, "assign_to");
                      }}
                      className="assign-input"
                      classNamePrefix="assign"
                      isDisabled={!canEdit || meetingStatus === "close"}
                    />
                    <DatePicker
                      selected={formattedDate}
                      onChange={(value) => {
                        this.handleTaskValues(value, index, "due_date");
                        this.setState({
                          minTime: this.calculateMinTime(value, "start"),
                        });
                      }}
                      showTimeSelect="HH:mm"
                      dateFormat="d/MM/yyyy, h:mm aa"
                      placeholderText="Due date"
                      className="form-control date"
                      minTime={this.state.minTime}
                      maxTime={moment().endOf("day").toDate()}
                      minDate={moment().toDate()}
                      disabled={!canEdit || meetingStatus === "close"}
                    />
                  </div>
                </div>
                {canEdit && (
                  <div className="addTask-icon">
                    {index !== tasks.length - 1 && (
                      <img
                        onClick={() =>
                          meetingStatus !== "close" &&
                          this.handleAddRemoveTask("delete", index)
                        }
                        src={DeleteIcon}
                      />
                    )}
                    {index === tasks.length - 1 && (
                      <img
                        onClick={() =>
                          meetingStatus !== "close" &&
                          this.handleAddRemoveTask("new", null)
                        }
                        src={PlusIcon}
                      />
                    )}
                  </div>
                )}
                <span className="text-danger">
                  {this.getErrorMessage(data)}{" "}
                </span>
              </div>
            );
          })}
          <div className="pt-3 decision-task">
            <Label>Add Decision</Label>
            {decisions.map((data, index) => {
              return (
                <div className="d-flex align-items-center">
                  <input
                    value={data}
                    onChange={(e) =>
                      this.handleDecision(e.target.value, index, "update")
                    }
                    type="text"
                    placeholder="Enter decision"
                    className="add-note mr-2"
                    disabled={!canEdit || meetingStatus === "close"}
                  />

                  {canEdit && index !== decisions.length - 1 && (
                    <img
                      onClick={() =>
                        meetingStatus !== "close" &&
                        this.handleDecision(null, index, "delete")
                      }
                      src={DeleteIcon}
                    />
                  )}
                  {canEdit && index === decisions.length - 1 && (
                    <img
                      onClick={() =>
                        meetingStatus !== "close" &&
                        this.handleDecision(null, null, "new")
                      }
                      src={PlusIcon}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <Modal
          isOpen={this.state.modal}
          toggle={this.toggle}
          className="modal-notes"
        >
          <ModalHeader toggle={this.toggle}>
            Add Notes<span onClick={this.toggle}> Done</span>
          </ModalHeader>
          <ModalBody>
            <textarea
              id="code"
              name="code"
              value={notes || ""}
              disabled={meetingStatus === "close" || !canEdit}
              onChange={(e) => this.setState({ notes: e.target.value })}
            ></textarea>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
