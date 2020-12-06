import React, { Component } from "react";
// import RedCloseIcon from "../../../../asset/images/mom-icons/red-close.svg";
import {
  Label,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  FormGroup,
  Button,
  Form,
  Row,
  Col,
  ModalBody,
  Modal,
  ModalHeader,
} from "reactstrap";
import PDFIcon from "../../../../asset/images/icons/pdf-icon.svg";
import DocxIcon from "../../../../asset/images/icons/docx-icon.svg";
import DocIcon from "../../../../asset/images/icons/doc-icon.svg";
import Edit from "../../../icons/moreIcon";
import PlusIcon from "../../../../asset/images/icons/PlusIcon.png";
import AddButtonIcon from "../../../icons/addIcon";
// import AddButtonIcon from "../../../icons/addIcon";
import Select from "react-select";
import InviteUserItems from "../../../../shared/components/createMeeting/options/inviteUserItems";
// import DatePicker from "react-datepicker";
import moment from "moment";
import Loader from "react-loader-spinner";
import { onFileUpload } from "../../../util/fileUpload";
import MsgModal from "../../../util/index";
import MoreIcon from "../../../icons/moreIcon";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { circleCharacter } from "../../createMeeting/createMeetingComponent";
import { take } from "lodash";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    const { taskData } = props;

    this.state = {
      dropdownOpen: false,
      openDropdownValue: "",
      isOpenDeleteMode: false,
      startDate: taskData && taskData.start_date && taskData.start_date,
      endDate: taskData && taskData.end_date && taskData.end_date,
      dueDate: taskData && taskData.due_date && taskData.due_date,
      dropdownDeleteIndex: "",
      dropdownUserIndex: "",
      taskOption: {
        label:
          props.taskData && props.taskData.status ? props.taskData.status : "",
        value:
          props.taskData && props.taskData.status ? props.taskData.status : "",
      },
      isUploading: false,
      taskDocuments:
        props.taskData &&
        props.taskData.documents &&
        props.taskData.documents.length > 0
          ? props.taskData.documents
          : [],
      isDropdownOpen: false,
      isUpdated: false,
      isSaved: false,
      comment: [],
      enterText: "",
      inviteModal: false,
      selectedParticipants: [],
      oldParticipants: [],
      options: [],
      tasksAssignTo: [],
    };
    this.deleteDropdown = this.deleteDropdown.bind(this);
  }

  componentDidMount() {
    const { taskData } = this.props;
    let participants = [];
    let tasksAssignTo = [];
    taskData &&
      taskData.assign_to &&
      taskData.assign_to.map((user) => {
        if (user) {
          participants.push({ label: user.email, value: user.email });
          tasksAssignTo.push(user);
        }
      });
    this.getFormattedParticipantsData();
    this.setState({
      selectedParticipants: participants,
      tasksAssignTo,
      oldParticipants: participants,
    });
  }

  inviteModalToggle = (type) => {
    const { oldParticipants } = this.state;
    if (type === "clear") {
      this.setState((prevState) => ({
        inviteModal: !prevState.inviteModal,
        selectedParticipants: [...oldParticipants],
      }));
    } else {
      this.setState((prevState) => ({
        inviteModal: !prevState.inviteModal,
      }));
    }
  };

  dtToggle = (e, index) => {
    e.preventDefault();
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
      dropdownUserIndex: index,
      id: "",
    });
  };
  onSaveTask = (e) => {
    e.preventDefault();
    const {
      taskOption,
      taskDocuments,
      startDate,
      selectedParticipants,
      comment,
    } = this.state;
    const {
      updateTask,
      sidebarToggle,
      isUpdated,
      taskData,
      userDetails,
      isFilterApplied,
    } = this.props;

    if(selectedParticipants === null){
      this.setState({
        errorText : 'Please add atleast one assignee.'
      })
      return;
    }

    let StartDate = "";
    let EndDate = "";
    if (taskOption.value === "In Progress") {
      StartDate = new Date().toUTCString();
    }
    if (taskOption.value === "Completed") {
      StartDate = startDate;
      EndDate = new Date().toUTCString();
    }

    const assignees = [];
    if (selectedParticipants && selectedParticipants.length > 0) {
      for (let email of selectedParticipants) {
        assignees.push(email.value);
      }
    }
    const obj = {
      start_date: StartDate,
      end_date: EndDate,
      status: taskOption.value,
      id: taskData && taskData._id,
      documents: taskDocuments,
      comments: taskData.comments,
      email: userDetails.email,
      meeting_id: taskData.meeting_id,
      assignees,
    };
    updateTask(obj).then((result) => {
      const { status } = result.payload.data;
      if (status === 200) {
        sidebarToggle();
        isFilterApplied(false);
        isUpdated(false);
      }
    });
  };

  handleDelete = (document) => {
    const { taskDocuments } = this.state;
    let oldDocuments = [...taskDocuments];
    const deleteIndex = oldDocuments.findIndex(
      (item) => item.url === document.url
    );
    if (deleteIndex > -1) {
      oldDocuments.splice(deleteIndex, 1);
      this.setState({
        taskDocuments: oldDocuments,
        openDropdownValue: "",
        isOpenDeleteMode: false,
      });
    }
  };

  handleAddTaskDocument = (e) => {
    if (e && e.target && e.target.files) {
      const { taskDocuments } = this.state;
      const fileName = e.target.files[0].name;
      let type = "";
      if (e.target.files[0].type === "application/pdf") {
        type = "pdf";
      } else if (
        e.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        type = "docx";
      } else if (e.target.files[0].type === "application/msword") {
        type = "doc";
      }
      let taskDocIndex = -1;
      if (taskDocuments && taskDocuments.length > 0) {
        taskDocIndex = taskDocuments.findIndex((doc) => doc.name === fileName);
      }
      if (taskDocIndex < 0) {
        this.setState({
          isUploading: true,
        });
        onFileUpload(e.target.files[0]).then((res) => {
          if (res) {
            const { taskDocuments } = this.state;
            const newData = [...taskDocuments];
            newData.push({ url: res, name: fileName, type });
            this.setState({ taskDocuments: newData, isUploading: false });
          }
        });
      } else {
        MsgModal(400, "Document already added");
      }
    }
  };

  toggle(value) {
    this.setState((prevState) => ({
      isOpenDeleteMode: !prevState.isOpenDeleteMode,
      openDropdownValue: value,
    }));
  }
  deleteDropdown() {
    this.setState({
      isDropdownOpen: !this.state.isDropdownOpen,
    });
  }

  onInputChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();
    const { email } = this.props.userDetails;
    const { addComment } = this.props;
    this.setState(
      { enterText: this.state.comment, comment: "" },
      this.scrollCommentContentWrapper
    );
    const obj = {
      email,
      message: this.state.comment,
    };
    if (this.state.comment) {
      addComment(obj);
    }
  };
  scrollCommentContentWrapper = () => {
    setTimeout(() => {
      let commentContent = document.getElementById("commentContent")
        .clientHeight;
      document.getElementById(
        "commentContentWrapper"
      ).scrollTop = commentContent;
    }, 50);
  };
  deleteTask = (e, data) => {
    e.preventDefault();
    const {
      deleteTask,
      isUpdated,
      sidebarToggle,
      isFilterApplied,
      taskData,
    } = this.props;
    const obj = {
      id: data._id,
      admin_email: taskData && taskData.admin_email,
    };
    deleteTask(obj).then((result) => {
      const { status, message } = result.payload.data;
      MsgModal(status, message);
      if (status === 200) {
        isUpdated(false);
        sidebarToggle();
        isFilterApplied(false);
      }
    });
  };

  onReassignTaskModal = (e) => {
    this.setState({
      inviteModal: true,
    });
  };

  selectedView = () => {
    const { selectedParticipants } = this.state;
    if (selectedParticipants && selectedParticipants.length > 0) {
      let paricipants = [];
      selectedParticipants.forEach((item) => {
        let dataItem = {};
        if (item && item.email) {
          dataItem = {
            label: item.email || item.name,
            value: item.email || item.name,
          };
        }
        paricipants.push(dataItem);
      });
      return paricipants;
    }
    return [];
  };

  getFormattedParticipantsData = () => {
    const { taskData, userDetails } = this.props;
    const { email } = userDetails;
    let options = [];

    // if (taskData && taskData.attendees && taskData.attendees.length > 0) {
    //   const index = taskData.attendees.findIndex((i) => {
    //     if (i && i._id && i._id.email) {
    //       return i._id.email === email;
    //     }
    //   });
    //   if (index === -1) {
    //     options.push({ label: email, value: email });
    //   }

    //   taskData.attendees.forEach((element) => {
    //     if (element && element._id && element._id.email)
    //       options.push({
    //         label: element._id.email || element._id.name,
    //         value: element._id.email || element._id.name,
    //       });
    //   });
    // }

    if (taskData && taskData.meeting_id && taskData.meeting_id.attendees && taskData.meeting_id.attendees.length > 0) {
      const index = taskData.meeting_id.attendees.findIndex((i) => {
        if (i && i.email) {
          return i.email === email;
        }
      });
      if (index === -1) {
        options.push({ label: email, value: email });
      }

      taskData.meeting_id.attendees.forEach((element) => {
        if (element)
          options.push({
            label: element.email || element._id.name,
            value: element.email || element._id.name,
          });
      });
    }

    this.setState({ options });
    return options;
  };

  addAssignies = () => {
    const { tasksAssignTo, selectedParticipants } = this.state;
    const arr = [];
    if (selectedParticipants && selectedParticipants.length > 0) {
      for (let obj of selectedParticipants) {
        const index = tasksAssignTo.findIndex((i) => i.email === obj.value);
        if (index > -1) {
          arr.push(tasksAssignTo[index]);
        } else {
          arr.push({ email: obj.value });
        }
      }
    }
    this.setState({
      tasksAssignTo: arr,
      oldParticipants: selectedParticipants,
    });
    this.inviteModalToggle();
  };

  render() {
    const {
      startDate,
      endDate,
      taskOption,
      dueDate,
      isUploading,
      openDropdownValue,
      isOpenDeleteMode,
      taskDocuments,
      comment,
      inviteModal,
      selectedParticipants,
      options,
      tasksAssignTo,
      errorText
    } = this.state;

    const {
      sidebarToggle,
      taskData,
      updateTaskStatus,
      userDetails,
      meetings,
    } = this.props;

    let UtcDueDate = dueDate && moment.utc(dueDate).toDate();
    let DueDate = UtcDueDate && moment(UtcDueDate).local().format("YYYY-MM-DD");
    let UtcStartDate = startDate && moment.utc(startDate).toDate();
    let StartDate =
      UtcStartDate && moment(UtcStartDate).local().format("YYYY-MM-DD");
    let UtcEndDate = endDate && moment.utc(endDate).toDate();
    let EndDate = UtcEndDate && moment(UtcEndDate).local().format("YYYY-MM-DD");
    const taskOptions = [
      { value: "Not Started", label: "Not Started" },
      { value: "In Progress", label: "In Progress" },
      { value: "Completed", label: "Completed" },
      { value: "Postponed", label: "Postponed" },
      { value: "Cancelled", label: "Cancelled" },
    ];

    return (
      <>
        <div className="task-sidebarCard add-agenda-screen">
          <div className="cross" onClick={sidebarToggle}>
            <i className="fas fa-times"></i>
          </div>
          <div className="taskCard-content">
            <div className="tasksHeader">
              <h2>{taskData.task || ""}</h2>
              <div className="user-edit">
                {userDetails.email === taskData.admin_email && (
                  <Dropdown
                    isOpen={this.state.isDropdownOpen}
                    toggle={this.deleteDropdown}
                  >
                    <DropdownToggle>
                      <span onClick={this.deleteDropdown}>
                        <MoreIcon />
                      </span>
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        onClick={(e) => this.deleteTask(e, taskData)}
                      >
                        Delete
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                )}
              </div>
            </div>
            <div className="nameContent">
              {taskData && taskData.department && (
                <h3>
                  <label className="mb-0">Department :</label>{" "}
                  <span>{taskData.department || ""}</span>
                </h3>
              )}
              {taskData && taskData.project_name && (
                <h3>
                  <label className="mb-0">Project :</label>
                  <span> {taskData.project_name || ""}</span>
                </h3>
              )}
            </div>
            <div className="commentWrapper" id="commentContentWrapper">
              <div id="commentContent">
                {taskData &&
                  taskData.comments &&
                  taskData.comments.length > 0 &&
                  taskData.comments.map((data) => {
                    return (
                      <div
                        className={`commentWrap ${
                          data.logo ? "logo" : "only-name"
                        }`}
                      >
                        <label className="image" title={data.email || ""}>
                          <div className="commentUserImg">
                            {/* <span>{data.email && data.email.charAt(0).toUpperCase()}</span> */}
                            <span>{data.email && circleCharacter(data)}</span>
                          </div>
                        </label>
                        <div className="commentContent">
                          {data.message && <p>{data.message}</p>}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="commentWrap-input">
              <div className="commentContent">
                <Form onSubmit={(e) => this.onFormSubmit(e)}>
                  <FormGroup>
                    <Input
                      type="text"
                      value={comment}
                      onChange={(e) => {
                        this.onInputChange(e);
                      }}
                      name="comment"
                      placeholder="Write a comment"
                    />
                  </FormGroup>
                </Form>
              </div>
            </div>

            <div className="pt-3 pb-3">
              <h3 className="mb-2"></h3>
              <div className="image-upload">
                <ul className="list-inline image-upload">
                  {tasksAssignTo &&
                    tasksAssignTo.length > 0 &&
                    tasksAssignTo.map((task, index) => {
                      return (
                        <li>
                          <label
                            className="image"
                            title={(task && task.email) || ""}
                          >
                            <div className="assigneeUser">
                              {/* <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>{(task && task.charAt(0).toUpperCase()) || ''}</span> */}
                              <span
                                className="partImg"
                                style={{
                                  position: "absolute",
                                  top: "50%",
                                  left: "50%",
                                  transform: "translate(-50%, -50%)",
                                }}
                              >
                                {circleCharacter(task) || ""}
                              </span>
                            </div>
                          </label>
                        </li>
                      );
                    })}
                  <li>
                    <Label>
                      <AddButtonIcon />
                      <Button
                        className="agenda-addBtn"
                        onClick={(e) => this.onReassignTaskModal(e)}
                      ></Button>
                    </Label>
                  </li>
                </ul>
                <div className="text-danger">{errorText || ''}</div>
              </div>
            </div>
            <div className="pt-3 pb-3">
              <h3 className="mb-0">
                Add Document{" "}
                <span className="upload-pdf">
                  <Label>
                    <input
                      onChange={(e) => this.handleAddTaskDocument(e)}
                      accept="application/pdf,application/msword,
                      application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      type="file"
                    />
                    <img src={PlusIcon} alt="" />
                  </Label>
                </span>
              </h3>
              <div className="documentAdd">
                <ul className="list-inline document-upload">
                  {taskDocuments &&
                    taskDocuments.length > 0 &&
                    taskDocuments.map((document) => {
                      return (
                        <li>
                          <Label>
                            <div className="doc-content">
                              <a download href={document.url} target="_blank">
                                <img
                                  src={
                                    document.type === "pdf"
                                      ? PDFIcon
                                      : document.type === "docx"
                                      ? DocxIcon
                                      : DocIcon
                                  }
                                  alt=""
                                />
                                <p title={document.name}>{document.name}</p>
                              </a>
                            </div>
                            <Dropdown
                              isOpen={
                                isOpenDeleteMode &&
                                document.url === openDropdownValue
                              }
                              toggle={() => this.toggle(document.url)}
                              className="edit-icon"
                            >
                              <DropdownToggle>
                                <Edit />
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem
                                  onClick={() => this.handleDelete(document)}
                                >
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </Label>
                        </li>
                      );
                    })}
                  {isUploading && (
                    <li>
                      <div className="doc-content">
                        <span style={{ textAlign: "center" }}>
                          <Loader
                            type="TailSpin"
                            color="#00BFFF"
                            height={60}
                            width={60}
                          />
                          Uploading...
                        </span>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
            <div className="dateWrapper">
              <Row>
                <Col md={6} lg={3}>
                  <FormGroup>
                    <Label for="startDate" className="required">
                      Start date
                    </Label>
                    <Input
                      type="text"
                      readOnly
                      disabled
                      value={
                        taskData.status !== "Not Started"
                          ? StartDate
                            ? StartDate
                            : EndDate
                          : ""
                      }
                      name="startDate"
                      placeholder="Start Date"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} lg={3}>
                  <FormGroup>
                    <Label for="" className="required">
                      End date
                    </Label>
                    <Input
                      type="text"
                      readOnly
                      disabled
                      value={
                        taskData.status !== "Not Started" &&
                        taskData.status !== "In Progress"
                          ? EndDate
                          : ""
                      }
                      name="endDate"
                      placeholder="End Date"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} lg={3}>
                  <FormGroup>
                    <Label for="" className="required">
                      Due date
                    </Label>
                    <Input
                      type="text"
                      readOnly
                      disabled
                      value={DueDate}
                      name="dueDate"
                      placeholder="Due Date"
                    />
                  </FormGroup>
                </Col>
                <Col md={6} lg={3}>
                  <FormGroup>
                    <Label for="" className="required">
                      Status
                    </Label>
                    <Select
                      value={
                        taskOption.value
                          ? {
                              label: taskOption.value
                                .replace(/_/gi, " ")
                                .toUpperCase(),
                              value: taskOption.value,
                            }
                          : {
                              value: taskOption.value
                                .replace(/_/gi, " ")
                                .toUpperCase(),
                              label: taskOptions[0].label,
                            }
                      }
                      // defaultValue={taskOptions[0]}
                      name="taskOption"
                      className={
                        taskOption.value === "Not Started" ||
                        taskOption.value === "not_started" ||
                        taskOption.value === ""
                          ? "inProgress"
                          : taskOption.value === "In Progress" ||
                            taskOption.value === "in_progress"
                          ? "notStarted"
                          : taskOption.value === "Completed" ||
                            taskOption.value === "completed"
                          ? "completed"
                          : "overDue"
                      }
                      classNamePrefix="status"
                      options={taskOptions}
                      onChange={(data) => {
                        this.setState({
                          taskOption: data,
                        });
                      }}
                    />
                  </FormGroup>
                </Col>
              </Row>
            </div>
            <div className="task-btn">
              <Button role="button" onClick={(e) => this.onSaveTask(e)}>
                Save
              </Button>
            </div>
          </div>
        </div>
        <Modal
          isOpen={inviteModal}
          toggle={() => this.inviteModalToggle("clear")}
          className="create-meeting-modal invite-modal"
        >
          <ModalHeader toggle={() => this.inviteModalToggle("clear")}>
            Assigneee <span onClick={this.addAssignies}>Done</span>
          </ModalHeader>
          <ModalBody>
            <div className="invite-screen mb-5">
              <h2 className="mb-3">
                Enter below the name of the person to whom you want to assign
                the task?
              </h2>
              <Select
                isMulti
                menuIsOpen
                name="colors"
                className="basic-multi-select"
                classNamePrefix="invite"
                hideSelectedOptions={true}
                value={selectedParticipants}
                onChange={(data) => {
                  this.setState({ selectedParticipants: data });
                }}
                options={options}
              />
            </div>
          </ModalBody>
        </Modal>
      </>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    taskData: state.taskDetails.createTaskData,
    userDetails: state.userDetails,
  };
};
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({}, dispatch);
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(SidebarContent)
);
