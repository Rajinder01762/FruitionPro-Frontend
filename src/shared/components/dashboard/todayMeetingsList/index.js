import React, { Component } from "react";
import BellIcon from "../../../../asset/images/mom-icons/bell.svg";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withRouter } from "react-router-dom";
import { setMeetingSummaryData } from "../store/action";
import _ from "lodash";

class TodayMeetingsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onMeetingClick = (data) => {
    const { userDetails, history, setMeetingSummaryData } = this.props;
    setMeetingSummaryData(data, userDetails.email || "");
    history.push("/view/meetings-details");
  };

  render() {
    const {
      todayMeetings,
      userDetails,
      history,
      setMeetingSummaryData,
      setMeetingsType,
    } = this.props;
    console.log("todayMeetingstodayMeetingstodayMeetings", todayMeetings);
    let TodayMeetings =
      todayMeetings && todayMeetings.length > 0 ? todayMeetings : [];
    console.log("TodayMeetingsTodayMeetings", TodayMeetings);
    let sortedMeetings = _.sortBy(TodayMeetings, "start_date_time");
    return (
      <div className="meetings-card">
        <div className="meeting-heading">
          <h2>
            Today's Meetings
            <span className="ml-2">
              {sortedMeetings && sortedMeetings.length}
            </span>
          </h2>
          <a
            onClick={() => {
              setMeetingsType("today");
              history.push("/view/all-meetings");
            }}
          >
            See all
          </a>
        </div>
        <ul className="meetings-list schedule">
          {sortedMeetings && sortedMeetings.length > 0 ? (
            sortedMeetings.map((data, index) => {
              let stillUtcStart =
                data &&
                data.start_date_time &&
                moment.utc(data.start_date_time).toDate();
              let startDate =
                stillUtcStart &&
                moment(stillUtcStart).local().format("YYYY-MM-DD HH:mm:ss");
              let stillUtcEnd =
                data &&
                data.end_date_time &&
                moment.utc(data.end_date_time).toDate();
              let endDate =
                stillUtcEnd &&
                moment(stillUtcEnd).local().format("YYYY-MM-DD HH:mm:ss");
              // const dateTime = startDate && moment(startDate).format("MMMM-YYYY");
              if (index <= 3) {
                return (
                  <li
                    onClick={(e) => {
                      this.onMeetingClick(data);
                    }}
                    // setMeetingSummaryData(data, userDetails.email || "");
                    // history.push("/view/meetings-details");
                  >
                    <div className="date">
                      <h4>
                        {startDate &&
                          moment(startDate).format("ddd").toUpperCase()}
                      </h4>
                      <h3>{startDate && moment(startDate).format("DD")}</h3>
                    </div>
                    <div className="meeting-content">
                      <div className="meeting-details">
                        <h3 className="text-white">{data.title || ""}</h3>
                        {startDate && endDate && (
                          <p className="text-white">
                            {startDate === ""
                              ? "All day"
                              : "(" +
                                moment(startDate).format("hh:mm a") +
                                "-" +
                                moment(endDate).format("hh:mm a") +
                                ")"}
                          </p>
                        )}
                      </div>
                      <div className="meetings-user">
                        <div className="meeting-user-inner"></div>
                        <div className="user-edit"></div>
                      </div>
                    </div>
                  </li>
                );
              }
            })
          ) : (
            <div className="no-meeting-list">
              <p className="mb-0">No Meetings Today</p>
            </div>
          )}
        </ul>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    meetings: state.meetingReducer,
    userDetails: state.userDetails,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      setMeetingSummaryData,
    },
    dispatch
  );
};
export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(TodayMeetingsList)
);
