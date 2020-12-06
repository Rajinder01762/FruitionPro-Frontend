import React, { Component } from "react";
// import clsx from 'clsx';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
// import moment from 'moment';
import { withRouter } from "react-router-dom";
import CalendarComponent from "./Calendar/App";

class GridCalendarComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // isOpen: false,
      // isVisible: false,
      // isUpdated: false,
      // dropdownOpen: false,
      // dropdownDeleteIndex: "",
      // dropdownUserIndex: "",
      // archivedSelect: {
      //   label: '',
      //   value: ''
      // }
    };
  }
  filterMeetings = (meetings) => {
    let arr = [];
    meetings &&
      meetings.length > 0 &&
      meetings.filter((item) => {
        const found = arr.some((el) => {
          if (item.meeting_id && typeof item.meeting_id !== "string") {
            return el._id === item.meeting_id._id;
          } else {
            return el._id === item._id;
          }
        });
        if (!found) {
          if (item.meeting_id && typeof item.meeting_id !== "string") {
            let obj = {
              ...item.meeting_id,
            };
            arr.push(obj);
          } else {
            arr.push(item);
          }
        }
      });
    if (!arr) {
      return [];
    }
    return arr;
  };
  componentDidMount() {
    // where you make all your API calls
    const {
      fetchMeetings,
      history,
      setFetchMeetings,
      setFetchPastMeetings,
      userDetails,
    } = this.props;

    if (
      userDetails &&
      userDetails.license_key &&
      userDetails.isLicenseExpired
    ) {
      history.push("/view/profile");
    }
    const upcomingObj = {
      type: "upcoming",
      email: userDetails.email,
    };

    const pastObj = {
      type: "past",
      email: userDetails.email,
    };

    // fetch all the account's PAST meeting
    fetchMeetings(pastObj).then((result) => {
      const { status, data } = result.payload.data;

      if (status === 200) {
        const meetings = this.filterMeetings(data);
        setFetchPastMeetings(meetings);
      }
    });

    // fetch all the account's UPCOMING meeting
    fetchMeetings(upcomingObj).then((result) => {
      const { status, data } = result.payload.data;
      if (status === 200) {
        const meetings = this.filterMeetings(data);
        setFetchMeetings(meetings);
      }
    });
  }

  render() {
    return (
      <>
        <div className="dashboard-wrapper mb-5">
          <div className="dashboard-content">
            <div className="dashboard-title">
              <h2>My Calendar</h2>
            </div>

            <div className="calendar-wrapper">
              <CalendarComponent />
            </div>
          </div>
        </div>
      </>
    );
  }
}
export default withRouter(GridCalendarComponent);
