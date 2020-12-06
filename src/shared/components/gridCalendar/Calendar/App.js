import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Calendar, momentLocalizer } from "react-big-calendar";
import { withRouter } from "react-router-dom";
import moment from "moment";

import "./App.css";
import "react-big-calendar/lib/sass/styles.scss";


const localizer = momentLocalizer(moment);

class App extends Component {
  constructor(props) {
    super(props);
    console.log("props from app extension");
    console.log(props); // DATA's HERE
  }

  render() {

    const {
      meetings,
    } = this.props;

    let events = [];

    // UPCOMING meetings
    for (const meeting of meetings.meetings)
    {
      let obj = {};

      obj['start'] = moment(meeting.start_date_time).toDate();
      obj['end'] = moment(meeting.end_date_time).toDate();
      obj['title'] = meeting.title;

      events.push(obj);
    }

    // PAST meetings
    for (const meeting of meetings.pastMeetings)
    {
      let obj = {};

      obj['start'] = moment(meeting.start_date_time).toDate();
      obj['end'] = moment(meeting.end_date_time).toDate();
      obj['title'] = meeting.title;

      events.push(obj);
    }

    return (
      <div className="App">
        <Calendar
          localizer={localizer}
          defaultDate={new Date()}
          defaultView="month"
          events={events}
          style={{ height: "100vh" }}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    userDetails: state.userDetails,
    meetings: state.meetingReducer,
  };
};

const mapDispatchToProps = dispatch => {
  
  return bindActionCreators({
  }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
