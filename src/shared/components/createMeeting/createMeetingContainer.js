import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import CreateMeeting from "./createMeetingComponent";
import {
  setAgendaItems,
  setDocuments,
  setParticipants,
  addMeeting,
  resetMeetingData,
  deleteDocument,
  updateEditPermission,
  updateMeeting,
  updateAgendaItem,
  sharePdf,
  setMeetingStatus,
  updateStartEndStatus,
  meetingAttendance,
  setAttendance,
  fetchParticularMeetingData,
  setEditAllMeetings
} from "./store/action";
import { setMeetingsType,setMeetingSummaryData } from '../dashboard/store/action'
import { togglePrivateNote } from "../wrapper/store/action"

const mapStateToProps = state => {
  const {
    createMeetingData,
    agendaItems,
    documents,
    paricipants,
    canEdit,
    meetingId,
    meetingNotes,
    isCreate,
    isAdmin,
    private_notes,
    meetingStatus,
    status
  } = state.createMeetingReducer;

  let logo = "";
  if (state.individualUserReducer.logo)
    logo = state.individualUserReducer.logo;
  else if (state.organizationReducer.organizationLogo
  ) logo = state.organizationReducer.organizationLogo;

  return {
    dataToPrint: state.createMeetingReducer,
    userDetails: state.userDetails,
    createMeetingData,
    agendaItems,
    canEdit,
    meetingDocuments: documents,
    meetingsDetails: state.meetingReducer,
    addedParticipants: paricipants,
    organizationData: state.organizationReducer,
    createMeeting_id: state.createMeetingReducer.meetingId,
    meetingId,
    isCreate,
    meetingNotes,
    isAdmin,
    private_notes,
    logo,
    meetingStatus,
    status,
    meetings: state.meetingReducer.meetings,
    meetingData: state.createMeetingReducer.createMeetingData,
    meetingDetail : state.createMeetingReducer,
    individualData: state.individualUserReducer,
    allMeetings : state.meetingReducer
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      setAgendaItems,
      setDocuments,
      setParticipants,
      addMeeting,
      resetMeetingData,
      deleteDocument,
      updateEditPermission,
      updateMeeting,
      updateAgendaItem,
      sharePdf,
      togglePrivateNote,
      setMeetingStatus,
      updateStartEndStatus,
      meetingAttendance,
      setAttendance,
      setMeetingsType,
      fetchParticularMeetingData,
      setMeetingSummaryData,
      setEditAllMeetings
    },
    dispatch
  );
};

const createMeetingContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateMeeting);

export default createMeetingContainer;
