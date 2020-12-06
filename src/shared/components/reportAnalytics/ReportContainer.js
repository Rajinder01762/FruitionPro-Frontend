import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchMeetings, setFetchMeetings, deleteMeeting, setMeetingSummaryData, setFetchPastMeetings, setMeetingsType, setFetchTodayMeetings, fetchNotifications } from '../dashboard/store/action';
import { fetchTasks, setTasksFilterData, clearTasksDateFilter, setTaskSummaryData, setSelectedTasks } from '../taskManagement/store/action';
import ReportComponent from "./ReportComponent";

const mapStateToProps = state => {
  return {
    isLoginSuccess: state.userDetails.isLoginSuccess,
    userDetails: state.userDetails,
    meetings: state.meetingReducer,
    taskDetails: state.taskDetails,
    notificationsData: state.notificationsData.notifications
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    fetchMeetings,
    setFetchMeetings,
    setFetchPastMeetings,
    setFetchTodayMeetings,
    deleteMeeting,
    setMeetingSummaryData,
    fetchTasks,
    setMeetingsType,
    setTasksFilterData,
    clearTasksDateFilter,
    setTaskSummaryData,
    setSelectedTasks,
    fetchNotifications
  }, dispatch);
};

const ReportContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ReportComponent);

export default ReportContainer;
