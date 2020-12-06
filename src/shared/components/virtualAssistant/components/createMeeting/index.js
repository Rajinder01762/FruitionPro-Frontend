/* eslint-disable no-extend-native */
import React from "react";
import { Button } from "reactstrap";
import ContinueArrow from "../../../../../asset/images/virtual-assistant/continueArrow.png";
import BasicInfo from "./BasicInfo";
import ReviewInfo from "./ReviewInfo";
import Finish from "./finish";
import OtherDetails from "./OtherDetails";
import { bindActionCreators, compose } from "redux";
import { connect } from "react-redux";
import moment from "moment";
import {
  monthsRegx,
  apmRegex,
  apmRegex2,
  convertTime12to24,
  addToStrPrototype,
  addToArrPrototype,
  removeDupsByProp,
} from "../../../../util/utility";
import UserImg from "../../../../../asset/images/virtual-assistant/user.jpg";
import styled, { keyframes } from "styled-components";
import InputField from "../shared/InputField";
import CrossIcon from "../../../../icons/cross";
import { onFileUpload } from "../../../../util/fileUpload";
import { createMeetingVA } from "../../actions";
// import { debounce, split } from 'lodash';
class CreateMeeting extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      intiated: false,
      title: "",
      startDateTime: "",
      endDateTime: "",
      project: "",
      department: "",
      selectedParticipants: [],
      agenda: "",
      location: "",
      documents: [],
      activeStep: 1,
      errorType: "",
      errorText: "",
    };
    addToArrPrototype();
    addToStrPrototype();
  }
  clearError = () => {
    this.setState({
      errorType: "",
      errorText: "",
    });
  };

  uploadDocument(doc) {
    return new Promise((resolve, reject) => {
      onFileUpload(doc).then(
        (res) => resolve({ url: res, name: doc.name }),
        (err) => reject(err)
      );
    });
  }

  createStub = (state, uds, authUser) => {
    return {
      title: state.title,
      project_name: (state.project || {}).value || "",
      topic: state.title,
      department: (state.project || {}).value || "",
      startDateTime: state.startDateTime.toUTCString(),
      endDateTime: state.endDateTime.toUTCString(),
      location: state.location,
      email: authUser.email,
      parentMeetingId: "",
      recurrenceData: [],
      agendas: [],
      documents: uds,
      share: true,
      participants: state.selectedParticipants.map((p) => ({
        email: p.email,
        canEdit: true,
      })),
      owner: authUser.name,
      company: "Innow8 apps",
      notes: "",
      private_notes: [],
      logo: "",
      createFirstMeeting: true,
    };
  };

  onClickNext = async () => {
    const {
      activeStep,
      title,
      startDateTime,
      endDateTime,
      project,
      department,
      documents,
      location,
    } = this.state;

    if (activeStep === 1) {
      // else this.props.VA.say('All fields are required');
      // else {
      if (title === "") {
        this.setState({
          errorType: "title",
          errorText: (
            <span className="text-danger">
              <b>Please fill Title</b>
            </span>
          ),
        });
        return;
      }
      if (project === "") {
        this.setState({
          errorType: "project",
          errorText: (
            <span className="text-danger">
              <b>Please select the project</b>
            </span>
          ),
        });
        return;
      }
      if (department === "") {
        this.setState({
          errorType: "department",
          errorText: (
            <span className="text-danger">
              <b>Please select the department</b>
            </span>
          ),
        });
        return;
      }
      if (startDateTime >= endDateTime) {
        this.setState({
          errorType: "startDateTime",
          errorText: (
            <span className="text-danger">
              <b>Start Time should be less than End Time</b>
            </span>
          ),
        });
        return;
      }
      if (title && startDateTime && endDateTime && project && department)
        this.setState((s) => ({
          activeStep: s.activeStep + 1,
        }));
      // if (
      //   moment(startDateTime).format("hh:mm:ss a") ===
      //   moment(endDateTime).format("hh:mm:ss a")
      // ) {
      //   console.log(
      //     "glhjikfgjhikjfghj",
      //     moment(startDateTime).format("hh:mm:ss a")
      //   );
      //   this.setState({
      //     errorType: "startDateTime",
      //     errorText: (
      //       <span className="text-danger">
      //         <b>Start Time should be less than End Time</b>
      //       </span>
      //     ),
      //   });
      //   return;
      // }
      // }
    } else if (activeStep === 2) {
      if (this.state.selectedParticipants.length === 0) {
        this.setState({
          errorType: "selectedParticipants",
          errorText: (
            <span className="text-danger">
              <b>Please select atleast one participant</b>
            </span>
          ),
        });
        return;
      }
      if (location === "") {
        this.setState({
          errorType: "location",
          errorText: (
            <span className="text-danger">
              <b>Please fill location</b>
            </span>
          ),
        });
        return;
      }
      console.log("here");

      const uploadedDocs = await Promise.all(
        documents.map(async (doc) => await this.uploadDocument(doc))
      );
      const stub = this.createStub(
        this.state,
        uploadedDocs,
        this.props.authUser
      );
      this.props.createMeetingVA(stub);
      // {
      // 	title: 'Today Meeting',
      // 	project_name: 'fruition-pro',
      // 	topic: 'Today Meeting',
      // 	department: 'development',
      // 	startDateTime: 'Thu, 02 Jul 2020 06:22:00 GMT',
      // 	endDateTime: 'Thu, 02 Jul 2020 07:00:00 GMT',
      // 	location: 'mohali',
      // 	email: 'rbansal1394@gmail.com',
      // 	parentMeetingId: '',
      // 	recurrenceData: [],
      // 	agendas: [],
      // 	documents: [],
      // 	share: true,
      // 	participants: [ { email: 'rbansal1394+1@gmail.com', canEdit: true } ],
      // 	owner: 'Raman Bansal',
      // 	company: 'Innow8 apps',
      // 	notes: '',
      // 	private_notes: [],
      // 	logo: '',
      // 	createFirstMeeting: true
      // }
      this.setState((s) => ({
        activeStep: s.activeStep + 1,
      }));
      console.log("submit the documents", uploadedDocs);
      console.log("submit the form");
    } else {
      this.setState((s) => ({
        activeStep: s.activeStep + 1,
      }));
    }
  };

  lift = (s) => {
    this.setState((ps) => ({ ...ps, ...s }));
  };

  componentDidMount() {
    const s = this.processSpeechGuessState(
      this.props.fullSpeech[0]
        ? `${this.props.fullSpeech[0]} `
        : "create a meeting for music project discussion on 13 July 2:00 p.m. duration 1 hour"
    );
    s.title &&
      (() => {
        s.project = this.guessProjectOrDepartment(s, "projects") || null;
        s.department = this.guessProjectOrDepartment(s, "departments") || null;
      })();
    this.setState({ ...s }, () => {
      const data = this.whatToSayNow(this.state);
      this.props.VA.say(data.msg);
      console.log(data);
    });
  }

  componentDidUpdate(pp) {
    const { fullSpeech, contacts } = this.props;
    console.log("fullspeech", fullSpeech);
    if (pp.fullSpeech.length !== fullSpeech.length) {
      // deepscan-disable-line
      console.log("speech changed");
      const { activeStep } = this.state;
      if (activeStep === 1) {
        console.log("process the speech to find required/empty state");
        if (fullSpeech[0].toLowerCase().includes("done")) {
          this.onClickNext();
        }
      } else if (activeStep === 2) {
        console.log("active step 2");
        let arr = fullSpeech[0].trim().split(" ");
        console.log("participants to search", arr);
        const selectedParticipantsFromSpeech = arr.reduce((acc, c) => {
          const lc = c.toLowerCase();
          const found = contacts.find(
            (con) => con.email.includes(lc) || (con.name || "").includes(lc)
          );
          if (found) acc.push(found);
          return acc;
        }, []);
        console.log(selectedParticipantsFromSpeech);
        const selectedParticipants = removeDupsByProp(
          [
            ...this.state.selectedParticipants,
            ...selectedParticipantsFromSpeech,
          ],
          "email"
        );
        this.setState({ selectedParticipants });
        console.log("process the state and find the participants");
      }
    }
    // console.log(ps, this.state)
    // if (!areSimpleObjsEqual(ps, this.state)) {
    // 	const data = this.whatToSayNow(this.state);
    // 	const dSay = debounce(this.props.VA.say.bind(this));
    // 	dSay(data.msg);
    // }
  }

  guessProjectOrDepartment = (s, what) =>
    this.props[what].reduce((acc, p) => {
      if (s.title.split(" ").some((e) => p.value.search(e) !== -1)) acc.push(p);
      return acc;
    }, [])[0];

  whatToSayNow = (state) => {
    let msg = "";
    let stateNotFound;
    switch (!"_") {
      case !!state.title:
        msg = "What is the title?";
        stateNotFound = "title";
        break;
      case !!state.project:
        msg = "Please select the project";
        stateNotFound = "project";
        break;
      case !!state.department:
        msg = "Please select the department";
        stateNotFound = "department";
        break;
      case !!state.startDateTime:
        msg = "At what time?";
        stateNotFound = "startDateTime";
        break;
      case !!state.endDateTime:
      case !!state.duration:
        msg = "Please tell the duration of the meeting";
        stateNotFound = "endDateTime";
        break;
      default:
        msg = "Say done! to proceed further";
        stateNotFound = null;
        break;
    }
    return {
      msg,
      stateNotFound,
      cb: () => {
        console.log("Just synthesized: ", msg);
      },
    };
  };

  processSpeechGuessState = (speech = "") => {
    const array = speech.split(" ");
    const idxOfOn = array.lastIndexOf("on");
    const idxOfFor = array.lastIndexOf("for");
    const idxOfToday = array.lastIndexOf("today");
    const idxOfTomorrow = array.lastIndexOf("tomorrow");
    const idxOfDur = array.lastIndexOf("duration");
    const acc = {};
    function getTime(s) {
      // get time from speech
      console.log(s);
      let tIdx = s.regexLastIndexOf(apmRegex);
      tIdx = tIdx >= 0 ? tIdx : s.regexLastIndexOf(apmRegex2);
      const hr = s.substring(tIdx, s.indexOf(" ", tIdx));
      const time = `${s.substring(tIdx, s.indexOf(" ", tIdx))}${
        hr.length <= 2 ? ":00" : ""
      }${s.substring(s.indexOf(" ", tIdx), s.nThIndexOf(" ", tIdx, 2))}`;
      return tIdx !== -1 ? time : ""; // caculate time using p.m a.m. keyword
    }
    function getDate(a) {
      const mIdx = a.regexLastIndexOf(monthsRegx);
      let d = "";
      if (mIdx !== -1) {
        d = new Date(`${a[mIdx - 1]} ${a[mIdx]}`);
        d.setFullYear(new Date().getFullYear());
      }
      return d;
    }
    if (idxOfFor !== -1) {
      if (idxOfOn !== -1) {
        console.log("in if of on");
        acc.title = array.slice(idxOfFor + 1, idxOfOn).join(" ");
        acc.time = getTime(speech); // get time from speech
        acc.date = getDate(array);
      } else {
        acc.title = array.slice(idxOfFor + 1, idxOfFor + 3).join(" ");
        acc.time = getTime(speech); // get time from speech
        if (idxOfToday !== -1) {
          acc.date = new Date();
        } else if (idxOfTomorrow !== -1) {
          const date = new Date();
          date.setDate(date.getDate() + 1);
          acc.date = date;
        } else {
          acc.date = getDate(array);
        }
      }
      if (idxOfDur !== -1) {
        acc.duration = array.slice(idxOfDur + 1, idxOfDur + 3).join(" ");
      }

      acc.date &&
        (function () {
          acc.startDateTime = acc.endDateTime = new Date(
            `${acc.date} ${new Date().getFullYear()}`
          );
          acc.time &&
            (() => {
              const _24Time = convertTime12to24(acc.time).split(":");
              acc.startDateTime = new Date(
                acc.date.setHours(_24Time[0], _24Time[1])
              );
              acc.endDateTime = new Date(
                acc.date.setHours(+_24Time[0] + 1, _24Time[1])
              );
            })();
        })();
    }
    console.log(acc);
    return acc;
    // create a meeting for project discussion on 28 June 2:00 p.m. duration 1 hour
    // create a meeting for project discussion at 12:00 p.m. tomorrow duration 1 hour
    // create a meeting for what ever the title is and user does not speek the on or at, what to do then?
    // create a meeting for project discussion on 28 June at 2:00 p.m. duration 1 hour
    // create a meeting for project discussion 28 December 2:00 p.m. duration 1 hour
    // create a meeting for project discussion 28 December 4:00 p.m. no no 3:00 p.m. duration 1 hour
    // create a meeting for project discussion on 28 June 12 p.m.
    // create a meeting for project discussion obhi hehe on 28 June
  };

  handlePartcipantsChange = (p) => {
    this.clearError();
    const { selectedParticipants } = this.state;
    this.setState((s) => {
      const found = selectedParticipants.find((el) => el._id === p._id);
      return {
        selectedParticipants: found
          ? s.selectedParticipants.filter((el) => el._id !== p._id)
          : [...s.selectedParticipants, p],
      };
    });
  };

  handleChange = (name) => (data) => {
    this.clearError();
    const value = data.target
      ? data.target.value
      : data.name
      ? data.name
      : data;
    this.setState({ [name]: value });
  };

  deleteFile = (name) => () => {
    this.setState({
      documents: this.state.documents.filter((d) => d.name !== name),
    });
  };

  render() {
    const {
      activeStep,
      selectedParticipants,
      agenda,
      location,
      documents,
      errorText,
      errorType,
    } = this.state;
    const { contacts, setListner, projects, departments } = this.props;
    return (
      <div className="createMeeting">
        {activeStep === 1 && (
          <BasicInfo
            projects={projects}
            departments={departments}
            handleChange={this.handleChange}
            errorText={errorText}
            errorType={errorType}
            {...this.state}
          />
        )}
        {activeStep === 2 && (
          <OtherDetails
            selectedParticipants={selectedParticipants}
            handlePartcipantsChange={this.handlePartcipantsChange}
            lift={this.lift}
            participants={contacts}
            location={location}
            agenda={agenda}
            handleChange={this.handleChange}
            documents={documents}
          >
            {(
              toggleParticipantModal,
              showAgendaField,
              showLocationFiel,
              toggleTextField,
              toggleDocuments,
              toggleRecurrence
            ) => {
              return (
                <>
                  <h2>Create Meeting</h2>
                  <div className="assistant-meeting">
                    <h5 className="list-title">Participants</h5>
                    <div className="participantsUsers">
                      {selectedParticipants.length > 0 &&
                        selectedParticipants.map((el) => (
                          <img key={el._id} src={UserImg} alt="" />
                        ))}
                      {selectedParticipants.length > 0 && (
                        <div
                          onClick={toggleParticipantModal}
                          className="add-user"
                        >
                          <i className="fas fa-pencil-alt" />
                        </div>
                      )}
                    </div>
                    <h5 className="list-title">Documents</h5>
                    <div>
                      {documents.length > 0 &&
                        documents.map((el) => {
                          return (
                            <div key={el.name}>
                              {el.name}
                              <div onClick={this.deleteFile(el.name)}>
                                <CrossIcon />
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                  <div className="d-flex flex-wrap">
                    {showAgendaField && (
                      <InputField
                        handleChange={this.handleChange("agenda")}
                        type="text"
                        value={agenda}
                        name={"agenda"}
                        label={"Agenda"}
                      />
                    )}
                    {showLocationFiel && (
                      <InputField
                        handleChange={this.handleChange("location")}
                        type="text"
                        value={location}
                        name={"location"}
                        label={"Location"}
                      />
                    )}
                    <Button
                      className="subMeetingsBtn blue w-100 partBtn"
                      onClick={toggleParticipantModal}
                      name={"selectedParticipants"}
                    >
                      <i className="fas fa-plus" />
                      Add Participants
                    </Button>
                    {errorType === "selectedParticipants" && (
                      <p className="error">{errorText}</p>
                    )}
                    <Button
                      className="subMeetingsBtn red pl-3"
                      onClick={toggleTextField("agenda")}
                    >
                      Add Agenda
                      <i className="fas fa-pencil-alt ml-2"></i>
                    </Button>
                    <Button
                      className="subMeetingsBtn green pl-3"
                      onClick={toggleDocuments}
                    >
                      Add Document  <i className="fas fa-pencil-alt ml-2"></i>
                    </Button>
                    <Button
                      className="subMeetingsBtn orange pl-3"
                      onClick={toggleTextField("location")}
                    >
                      Add Location
                      <i className="fas fa-pencil-alt ml-2"></i>
                    </Button>
                    <Button
                      onClick={toggleRecurrence}
                      className="subMeetingsOptions blue recurrence"
                      style={{ width: "144px" }}
                    >
                      Recurrence
                      <p>On</p>
                    </Button>
                    {errorType === "location" && (
                      <p className="error">{errorText}</p>
                    )}
                  </div>
                </>
              );
            }}
          </OtherDetails>
        )}
        {activeStep === 3 && (
          <ReviewInfo
            handleChange={this.handleChange}
            {...this.state}
            onClickNext={this.onClickNext}
            setListner={setListner}
            projects={projects}
            departments={departments}
          >
            <OtherDetails
              selectedParticipants={selectedParticipants}
              handlePartcipantsChange={this.handlePartcipantsChange}
              lift={this.lift}
              participants={contacts}
              location={location}
              agenda={agenda}
              handleChange={this.handleChange}
              documents={documents}
            >
              {(
                toggleParticipantModal,
                showAgendaField,
                showLocationFiel,
                toggleTextField,
                toggleDocuments
              ) => {
                return (
                  <div className="assistant-meeting mt-3">
                    <h5 className="list-title">Participants</h5>
                    <div className="participantsUsers">
                      {selectedParticipants.map((p) => (
                        <img key={p._id} src={UserImg} alt="" />
                      ))}
                      <div
                        onClick={toggleParticipantModal}
                        className="add-user"
                      >
                        <i className="fas fa-pencil-alt" />
                      </div>
                    </div>
                    <div className="meetings-details">
                      <DetailsCard
                        delay={0.25 * 0}
                        className="detailsCard red agenda"
                      >
                        <h4>Agenda</h4>
                        <div className="details">
                          <p>{agenda}</p>
                        </div>

                        <div
                          onClick={toggleTextField("agenda")}
                          className="edit-icon"
                        >
                          <i className="fas fa-pencil-alt" />
                        </div>
                      </DetailsCard>
                      {showAgendaField && (
                        <InputField
                          handleChange={this.handleChange("agenda")}
                          type="text"
                          value={agenda}
                          name={"agenda"}
                          label={"Agenda"}
                        />
                      )}
                      <DetailsCard
                        delay={0.25 * 1}
                        className="detailsCard green document"
                      >
                        <h4>Document</h4>
                        <div className="details">
                          {documents.map((d) => {
                            return (
                              <p key={d.name}>
                                <span className="title">{d.name}</span>
                                <span>.png</span>
                              </p>
                            );
                          })}
                        </div>

                        <div onClick={toggleDocuments} className="edit-icon">
                          <i className="fas fa-pencil-alt" />
                        </div>
                      </DetailsCard>
                      <DetailsCard
                        delay={0.25 * 2}
                        className="detailsCard orange location"
                      >
                        <h4>Location</h4>
                        <div className="details">
                          <p>{location}</p>
                        </div>
                        <div
                          onClick={toggleTextField("location")}
                          className="edit-icon"
                        >
                          <i className="fas fa-pencil-alt" />
                        </div>
                      </DetailsCard>
                      {showLocationFiel && (
                        <InputField
                          handleChange={this.handleChange("location")}
                          type="text"
                          value={location}
                          name={"location"}
                          label={"Location"}
                        />
                      )}
                    </div>
                  </div>
                );
              }}
            </OtherDetails>
          </ReviewInfo>
        )}
        {activeStep === 4 && <Finish />}
        {activeStep < 3 && (
          <div className="text-right">
            <Button onClick={this.onClickNext} className="right-arrow">
              <img src={ContinueArrow} alt="" />
            </Button>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  contacts: state.meetingReducer.contacts,
  projects: state.organizationReducer.organizationProjects,
  departments: state.organizationReducer.organizationDepartments,
  VA: state.viReducer.VA,
  authUser: state.userDetails,
});
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    ...bindActionCreators({ createMeetingVA }, dispatch),
  };
};
export default compose(connect(mapStateToProps, mapDispatchToProps))(
  CreateMeeting
);

const ani = keyframes`
0% {
    opacity: 0;
    transform: translate(20px, 20px);
  }
  100% {
    opacity: 1;
    transform: translate(0, 0);
  }
`;
const DetailsCard = styled("div")`
  opacity: 0;
  animation: fadeInTopRight 0.25s forwards
    cubic-bezier(0.175, 0.885, 0.32, 1.275);
  animation-delay: ${({ delay }) => delay}s;
`;
