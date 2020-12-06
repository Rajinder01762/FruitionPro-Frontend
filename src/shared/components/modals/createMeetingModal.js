import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Row,
  Col,
} from "reactstrap";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Redirect } from "react-router-dom";
import EditReccurenceMeeting from "./EditReccurenceMeeting";

class CreateMeetingModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: {},
      title: "",
      projects: "",
      department: "",
      topic: "",
      startDateTime: "",
      endDateTime: "",
      location: "",
      RecurringModal: false,
      RecurringState: false,
      meetingModal: false,
      editReccurenceModal: false,
      isDataFilled: false,
      startDate: new Date(),
      minTime: this.calculateMinTime(new Date(), "start"),
      minEndTime: this.calculateMinTime(new Date(), "end"),
      parentMeetingId: "",
    };
  }

  componentDidMount() {
    const { meetingData } = this.props;
    this.setMeetingData(meetingData);
  }

  setMeetingData = (meetingData) => {
    if (meetingData) {
      this.setState({
        title: meetingData.title || "",
        projects: meetingData.project_name || "",
        department: meetingData.department || "",
        topic: meetingData.topic || "",
        parentMeetingId: meetingData.parentMeetingId || "",
        startDateTime: meetingData.startDateTime
          ? new Date(meetingData.startDateTime)
          : new Date(),
        endDateTime: meetingData.endDateTime
          ? new Date(meetingData.endDateTime)
          : new Date(),
        location: meetingData.location || "",
      });
    }
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

  handleInput = (e, input) => {
    if (
      (input === "department" ||
        input === "projects" ||
        input === "location") &&
      e
    ) {
      this.setState({
        [input]: e.value,
      });
    } else {
      const { error } = this.state;
      const newErrors = {
        ...error,
        isFutureDateError: false,
        endDateError: false,
      };
      if (input === "location") {
        this.setState({
          [input]: "",
        });
      } else
        this.setState({
          error: newErrors,
          [e.target.name]: e.target.value,
        });
    }
  };
  isFutureOrGreaterDate = (firstDate, selectedDate) => {
    const todayDate = moment(firstDate).format("YYYY/MM/DD HH:mm:ss");
    const compareDate = moment(selectedDate).format("YYYY/MM/DD HH:mm:ss");
    var a = moment(todayDate);
    var b = moment(compareDate);
    const data = b.diff(a) >= 0;

    return data;
  };

  onCreateMeeting = (e) => {
    e.preventDefault(e);
    const {
      title,
      projects,
      topic,
      department,
      startDateTime,
      endDateTime,
      location,
      parentMeetingId,
    } = this.state;

    const {
      setMeetingData,
      toggle,
      isEditMode,
      isRecurrenceOn,
      recurrenceData,
      email,
    } = this.props;
    let error = {
      title: false,
      projects: false,
      topic: false,
      department: false,
      startDateTime: false,
      endDateTime: false,
      location: false,
      isFutureDateError: false,
      endDateError: false,
      isPastReccurenceError: false,
    };
    if (title === "") {
      error.title = true;
    }
    if (projects === "") {
      error.projects = true;
    }
    if (topic === "") {
      error.topic = true;
    }
    if (department === "") {
      error.department = true;
    }
    if (startDateTime === "") {
      error.startDateTime = true;
    } else {
      const today = new Date().getTime();
      const reccurenceStartDate =
        recurrenceData &&
        recurrenceData.Range &&
        recurrenceData.Range.reccurenceStartDate
          ? recurrenceData.Range.reccurenceStartDate
          : null;

      if (!this.isFutureOrGreaterDate(today, startDateTime)) {
        error.isFutureDateError = true;
      } else {
        if (reccurenceStartDate) {
          const dd = new Date(reccurenceStartDate);
          const st = new Date(startDateTime);

          dd.setHours(
            st.getHours(),
            st.getMinutes(),
            st.getSeconds(),
            st.getMilliseconds()
          );
          if (!this.isFutureOrGreaterDate(startDateTime, dd) && !isEditMode) {
            error.isPastReccurenceError = true;
          }
        }
      }
    }

    if (endDateTime === "") {
      error.endDateTime = true;
    } else {
      if (!this.isFutureOrGreaterDate(startDateTime, endDateTime)) {
        error.endDateError = true;
      }
    }
    if (location === "") {
      error.location = true;
    }

    this.setState({ error });

    if (
      !error.title &&
      !error.projects &&
      !error.topic &&
      !error.department &&
      !error.startDateTime &&
      !error.endDateTime &&
      !error.location &&
      !error.endDateError &&
      !error.isFutureDateError &&
      !error.isPastReccurenceError
    ) {
      let meetingObj = {
        title,
        project_name: projects,
        topic,
        department,
        startDateTime: startDateTime.toUTCString(),
        endDateTime: endDateTime.toUTCString(),
        location,
        email,
        parentMeetingId,
      };
      // this.setState({
      //   reccurenceEditModal : true
      // })
      if (isRecurrenceOn) {
        meetingObj.recurrenceData = recurrenceData;
      }

      setMeetingData(meetingObj, !isEditMode);
      this.setState({ isDataFilled: true }, () => {
        toggle();
      });
      this.resetState(true);
    }
  };

  // onReccurenceEditModal = (e) => {
  //   e.preventDefault(e);
  //   const {
  //     title,
  //     projects,
  //     topic,
  //     department,
  //     startDateTime,
  //     endDateTime,
  //     location,
  //     parentMeetingId
  //   } = this.state;

  //   const {
  //     setMeetingData,
  //     toggle,
  //     isEditMode,
  //     isRecurrenceOn,
  //     recurrenceData,
  //     email
  //   } = this.props;
  //   let error = {
  //     title: false,
  //     projects: false,
  //     topic: false,
  //     department: false,
  //     startDateTime: false,
  //     endDateTime: false,
  //     location: false,
  //     isFutureDateError: false,
  //     endDateError: false,
  //     isPastReccurenceError: false
  //   };
  //   if (title === "") {
  //     error.title = true;
  //   }
  //   if (projects === "") {
  //     error.projects = true;
  //   }
  //   if (topic === "") {
  //     error.topic = true;
  //   }
  //   if (department === "") {
  //     error.department = true;
  //   }
  //   if (startDateTime === "") {
  //     error.startDateTime = true;
  //   } else {
  //     const today = new Date().getTime();
  //     const reccurenceStartDate =
  //       recurrenceData && recurrenceData.Range && recurrenceData.Range.reccurenceStartDate
  //         ? recurrenceData.Range.reccurenceStartDate
  //         : null;

  //     if (!this.isFutureOrGreaterDate(today, startDateTime)) {
  //       error.isFutureDateError = true;
  //     } else {
  //       if (reccurenceStartDate) {
  //         const dd = new Date(reccurenceStartDate);
  //         const st = new Date(startDateTime);

  //         dd.setHours(
  //           st.getHours(),
  //           st.getMinutes(),
  //           st.getSeconds(),
  //           st.getMilliseconds()
  //         );
  //         if (!this.isFutureOrGreaterDate(startDateTime, dd) && !isEditMode) {
  //           error.isPastReccurenceError = true;
  //         }
  //       }
  //     }
  //   }

  //   if (endDateTime === "") {
  //     error.endDateTime = true;
  //   } else {
  //     if (!this.isFutureOrGreaterDate(startDateTime, endDateTime)) {
  //       error.endDateError = true;
  //     }
  //   }
  //   if (location === "") {
  //     error.location = true;
  //   }

  //   this.setState({ error });
  //   if(!error.title &&
  //     !error.projects &&
  //     !error.topic &&
  //     !error.department &&
  //     !error.startDateTime &&
  //     !error.endDateTime &&
  //     !error.location &&
  //     !error.endDateError &&
  //     !error.isFutureDateError &&
  //     !error.isPastReccurenceError)
  //   this.setState({
  //     reccurenceEditModal : true
  //   })
  // }

  resetState = (isFilled) => {
    this.setState({
      meetingModal: false,
      isDataFilled: isFilled,
      error: {},
      title: "",
      projects: "",
      department: "",
      topic: "",
      startDateTime: "",
      endDateTime: "",
      location: "",
    });
  };

  render() {
    const {
      error,
      title,
      projects,
      topic,
      department,
      startDateTime,
      location,
      endDateTime,
      isDataFilled,
      reccurenceEditModal,
      parentMeetingId,
    } = this.state;
    const {
      isRecurrenceOn,
      isEditMode,
      organizationData,
      individualData,
      setEditAllMeetings,
      meetingData,
      allMeetings,
      meetingDetail,
    } = this.props;

    let meetingID = meetingDetail && meetingDetail.meetingId;
    let other = { label: "Other", value: "Other" };
    let Department = [other],
      Project = [other];
    if (
      organizationData &&
      organizationData.organizationDepartments &&
      organizationData.organizationDepartments.length > 0
    ) {
      Department.unshift(...organizationData.organizationDepartments);
    } else if (
      individualData &&
      individualData.departments &&
      individualData.departments.length > 0
    ) {
      Department.unshift(...individualData.departments);
    }
    //const Project = organizationData && organizationData.organizationProjects && organizationData.organizationProjects.length > 0 ? organizationData.organizationProjects : individualData && individualData.projects && individualData.projects.length > 0 ? individualData.projects : [];
    if (
      organizationData &&
      organizationData.organizationProjects &&
      organizationData.organizationProjects.length > 0
    ) {
      Project.unshift(...organizationData.organizationProjects);
    } else if (
      individualData &&
      individualData.projects &&
      individualData.projects.length > 0
    ) {
      Project.unshift(...individualData.projects);
    }
    const Location =
      organizationData &&
      organizationData.organizationLocations &&
      organizationData.organizationLocations.length > 0
        ? organizationData.organizationLocations
        : individualData &&
          individualData.projects &&
          individualData.locations.length > 0
        ? individualData.locations
        : [];
    let stateLocation = [];
    stateLocation = Location.filter((option) => option.value === location);
    if (stateLocation.length === 0) {
      stateLocation.push({ value: location, label: location });
    }

    return (
      <div>
        {isDataFilled && !isEditMode && (
          <Redirect to={"/view/meetings-details"} />
        )}
        <Modal
          isOpen={this.props.isOpen}
          toggle={this.props.toggle}
          className="create-meeting-modal account-form-screen modal-dialog-centered"
        >
          <ModalHeader toggle={this.props.toggle}>
            {isEditMode ? "Update Meeting" : "Create Meeting"}
            <span
              onClick={(e) => {
                this.onCreateMeeting(e);
              }}
              style={{ cursor: "pointer" }}
            >
              {isEditMode ? "Done" : "Next"}
            </span>
            <span className="mr-5" onClick={this.MeetingModalToggle}></span>
          </ModalHeader>
          <ModalBody>
            <Row>
              <Col sm="12">
                <FormGroup>
                  <Label for="title" className="required">
                    Title
                  </Label>
                  <Input
                    type="text"
                    onChange={(e) => this.handleInput(e)}
                    name="title"
                    value={title}
                    placeholder="Title"
                  />
                  {error.title && (
                    <span className="text-danger">Title must be filled</span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="" className="required">
                    Projects
                  </Label>
                  <Select
                    onChange={(e) => this.handleInput(e, "projects")}
                    className="department-select"
                    value={Project.filter(
                      (option) => option.value === projects
                    )}
                    options={Project}
                    classNamePrefix="department"
                  />
                  {error.projects && (
                    <span className="text-danger">Project is empty</span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="" className="required">
                    Department
                  </Label>
                  <Select
                    onChange={(e) => this.handleInput(e, "department")}
                    className="department-select"
                    value={Department.filter(
                      (option) => option.value === department
                    )}
                    options={Department}
                    classNamePrefix="department"
                  />
                  {error.department && (
                    <span className="text-danger">
                      Please select department
                    </span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="12">
                <FormGroup>
                  <Label for="" className="required">
                    Topic
                  </Label>
                  <Input
                    type="text"
                    name="topic"
                    onChange={(e) => this.handleInput(e)}
                    value={topic}
                    placeholder="Enter Topic"
                  />
                  {error.topic && (
                    <span className="text-danger">Please select topic</span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="" className="required">
                    Start Date & Time
                  </Label>

                  <DatePicker
                    selected={startDateTime}
                    onChange={(date) => {
                      this.setState({
                        startDateTime: date,
                        minTime: this.calculateMinTime(date, "start"),
                        minEndTime: this.calculateMinTime(date, "end"),
                      });
                    }}
                    showTimeSelect="HH:mm"
                    dateFormat="d/MM/yyyy, h:mm aa"
                    placeholderText="Start date"
                    className="form-control date"
                    minTime={this.state.minTime}
                    maxTime={moment().endOf("day").toDate()}
                    minDate={moment().toDate()}
                  />
                  {/* <DatePicker
      selected={startDateTime}
      onChange={date => {
        this.setState({
          startDateTime: date,
          minTime: this.state.minTime,
          minEndTime: this.calculateMinTime(date, "end")
        });
      }}
      showTimeSelect
      showTimeSelectOnly
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="h:mm aa"
    /> */}
                  {error.startDateTime && (
                    <span className="text-danger">Select start Date</span>
                  )}
                  {error.isFutureDateError && !error.startDateTime && (
                    <span className="text-danger">
                      Please select future date time
                    </span>
                  )}
                  {error.isPastReccurenceError && (
                    <span className="text-danger">
                      Start date should be less or equal than reccurence date
                    </span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="" className="required">
                    End Date & Time
                  </Label>
                  <DatePicker
                    selected={endDateTime}
                    // disabled={startDateTime === ""}
                    onChange={(date) => {
                      this.setState({
                        endDateTime: date,
                        minEndTime: this.calculateMinTime(
                          date,
                          "end",
                          endDateTime
                        ),
                      });
                      //minEndTime: this.calculateMinTime(startDateTime, "end", endDateTime) })
                      if (startDateTime !== "") {
                        if (startDateTime > date) {
                          error.endDateError = true;
                        } else {
                          error.endDateError = false;
                        }
                      }
                    }}
                    showTimeSelect="HH:mm"
                    dateFormat="d/MM/yyyy, h:mm aa"
                    placeholderText="End date"
                    className="form-control date"
                    minDate={moment(startDateTime).toDate()}
                    minTime={this.state.minEndTime}
                    maxTime={moment().endOf("day").toDate()}
                  />
                  {error.endDateTime && (
                    <span className="text-danger">Select End Date</span>
                  )}
                  {!error.endDateTime && error.endDateError && (
                    <span className="text-danger">
                      End date should be greater than start date
                    </span>
                  )}
                </FormGroup>
              </Col>
              <Col sm="6">
                <FormGroup>
                  <Label for="" className="required">
                    Location
                  </Label>
                  <CreatableSelect
                    isClearable={location ? true : false}
                    onChange={(e) => this.handleInput(e, "location")}
                    onInputChange={stateLocation}
                    value={stateLocation}
                    options={Location}
                    classNamePrefix="department"
                    className="department-select"
                  />
                  {error.location && (
                    <span className="text-danger">Please select location</span>
                  )}
                </FormGroup>
              </Col>
              {!isEditMode && (
                <Col sm="6">
                  <FormGroup>
                    <Label for="">Recurring</Label>
                    <button
                      onClick={this.props.recurringToggle}
                      className="recurring-btn"
                    >
                      {isRecurrenceOn ? "On" : "Off"}
                    </button>
                  </FormGroup>
                </Col>
              )}
            </Row>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default CreateMeetingModal;
