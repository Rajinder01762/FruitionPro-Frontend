import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import GridCalendarComponent from "./GridCalendarComponent";
import { fetchMeetings, setFetchMeetings, setFetchPastMeetings, setFetchUpcomingMeetings } from './store/action';

const mapStateToProps = state => {
    return {
      userDetails: state.userDetails,
      meetings: state.meetingReducer,
    };
  };
  
  const mapDispatchToProps = dispatch => {
    return bindActionCreators({
      fetchMeetings,
      setFetchMeetings,
      setFetchPastMeetings,
      setFetchUpcomingMeetings,
      // setFetchTodayMeetings,
    }, dispatch);
  };
  
  const GridCalendarContainter = connect(
    mapStateToProps,
    mapDispatchToProps
  )(GridCalendarComponent);
  
  export default GridCalendarContainter;