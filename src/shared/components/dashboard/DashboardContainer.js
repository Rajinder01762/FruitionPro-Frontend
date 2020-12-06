import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import DashboardComponent from "./DashboardComponent";
import {
  fetchMeetings,
  setFetchMeetings,
  deleteMeeting,
  setMeetingSummaryData,
  setFetchPastMeetings,
  setMeetingsType,
  setFetchTodayMeetings,
  fetchNotifications,
  setMeetingAttendance,
} from "./store/action";
import {
  fetchTasks,
  setTasksFilterData,
  clearTasksDateFilter,
  setTaskSummaryData,
  setSelectedTasks,
} from "../taskManagement/store/action";

const mapStateToProps = (state) => {
  return {
    isLoginSuccess: state.userDetails.isLoginSuccess,
    userDetails: state.userDetails,
    meetings: state.meetingReducer,
    taskDetails: state.taskDetails,
    notificationsData: state.notificationsData.notifications,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
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
      fetchNotifications,
      setMeetingAttendance,
    },
    dispatch
  );
};

const DashboardContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DashboardComponent);

export default DashboardContainer;
