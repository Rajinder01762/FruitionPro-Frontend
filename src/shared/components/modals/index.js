import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { setMeetingData } from "../../components/wrapper/store/action";
import { resetMeetingData,setEditAllMeetings } from "../createMeeting/store/action";
import CreateMeetingModal from "./createMeetingModal";
import RecurringModal from "./recurringModal";

class ModalContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogout: false,
      isOpen: false,
      meetingModal: false,
      error: {},
      title: "",
      projects: "",
      department: "",
      topic: "",
      startDateTime: "",
      endDateTime: "",
      location: "",
      type: "Daily",
      dropdownOpen: false,
      isRadioOn: true,
      recurrenceState: "",
      isVisible: false,
      isRecurrenceOn: false,
      modal: false
    };
    this.recurreningRef = React.createRef();
    this.meetingRef = React.createRef();
    this.Invitetoggle = this.Invitetoggle.bind(this);
  }
  componentDidMount() {
    const { getRef, meetingData } = this.props;
    getRef(this);

    if (meetingData && meetingData.recurrenceData) {
      this.setState({
        recurrenceState: meetingData.recurrenceData,
        isRecurrenceOn: Object.keys(meetingData.recurrenceData).length !== 0
      });
    }
  }
  openModal = () => {
    this.setState(prevState => ({
      modal: false,
      isOpen: !prevState.isOpen,
      error: "",
      recurrenceState: "",
      isRecurrenceOn: false
    }));
    // if (
    //   this.meetingRef.current &&
    //   this.recurreningRef.current &&
    //   this.recurreningRef.current.resetState
    // ) {
    // //  this.meetingRef.current.resetState(false);
    //   this.recurreningRef.current.resetState();
    // }
  };
  RecurringToggle = () => {
    this.setState(prevState => ({
      recurringModal: !prevState.recurringModal
    }));
  };
  onChange = date => this.setState({ date });

  Invitetoggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal,
      error: ""
    }));
    this.props.resetMeetingData();
  };

  getRecurrenceData = data => {
    this.setState({
      recurrenceState: data
    });
  };
  toggleRecurrence = isRecurrenceOn => {
    this.setState({ isRecurrenceOn });
  };

  getMeetingStartDate = () => {

    if (
      this.meetingRef.current &&
      this.meetingRef.current.state &&
      this.meetingRef.current.state.startDateTime
    ) {
      return this.meetingRef.current.state.startDateTime;
    }
    return ''
  }
  render() {
    const { allMeetings,meetingDetail,userDetails, setMeetingData, isEditMode, meetingData, organizationData, individualData,setEditAllMeetings } = this.props;
    const { isOpen, recurrenceState, isRecurrenceOn } = this.state;
    return isOpen ? (
      <div>
        <CreateMeetingModal
          meetingData={
            Object.keys(meetingData).length !== 0 ? meetingData : null
          }
          isEditMode={isEditMode}
          ref={this.meetingRef}
          isOpen={isOpen}
          toggle={this.openModal}
          recurringToggle={this.RecurringToggle}
          setMeetingData={setMeetingData}
          recurrenceData={recurrenceState}
          isRecurrenceOn={isRecurrenceOn}
          email={userDetails.email}
          organizationData={organizationData}
          individualData={individualData}
          setEditAllMeetings = {setEditAllMeetings}
          allMeetings={allMeetings}
          meetingDetail={meetingDetail}
        />
        <RecurringModal
          recurrenceData={
            meetingData && meetingData.recurrenceData
              ? meetingData.recurrenceData
              : null
          }
          meetingStartDate={this.getMeetingStartDate()}
          toggleRecurrence={this.toggleRecurrence}
          ref={this.recurreningRef}
          isOpen={this.state.recurringModal}
          toggle={this.RecurringToggle}
          getRecurrenceData={this.getRecurrenceData}
        />
      </div>
    ) : (
        <div />
      );
  }
}
const mapStateToProps = state => {
  return {
    userDetails: state.userDetails,
    meetingData: state.createMeetingReducer.createMeetingData,
    meetingDetail : state.createMeetingReducer,
    organizationData: state.organizationReducer,
    individualData: state.individualUserReducer,
    allMeetings : state.meetingReducer
  };
};
const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      resetMeetingData,
      setMeetingData,
      setEditAllMeetings
    },
    dispatch
  );
};
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModalContainer)
);
