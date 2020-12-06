import React, { Component } from "react";
import moment from "moment";
// import { setMeetingSummaryData } from '../store/action';
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import _ from "lodash";

class MeetingsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      meetingSelect: {
        label: "",
        value: "",
      },
    };
  }

  componentDidMount() {
    const { meetings } = this.props;
    const { pastMeetings } = meetings;
    let meetingData =
      meetings && meetings.meetingsType === "upcoming"
        ? meetings.meetings
        : pastMeetings;
    let allMeetings = [];
    if (
      meetingData &&
      meetingData.length > 0 &&
      meetings.meetingsType === "upcoming"
    ) {
      for (const meeting of meetingData) {
        let startDate = moment.utc(meeting.start_date_time).toDate();
        let meetingDate = moment(startDate).format("ll");
        let todayDate = moment().format("ll");
        if (meetingDate !== todayDate) {
          allMeetings.push(meeting);
        }
      }
      this.setState({
        meetingSelect: { label: "Upcoming", value: "Upcoming" },
      });
    }
    if (
      meetingData &&
      meetingData.length > 0 &&
      meetings.meetingsType === "past"
    ) {
      this.setState({
        meetingSelect: { label: "Past", value: "Past" },
      });
      allMeetings = meetingData;
    }
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
  selectMeetingsType = (data) => {
    const {
      setMeetingsType,
      fetchMeetings,
      userDetails,

      setFetchPastMeetings,
    } = this.props;
    this.setState({ meetingSelect: data });
    let type = "upcoming";
    if (data.value === "Past") {
      type = "past";
    }
    setMeetingsType(type);
    const pastObj = {
      type: "past",
      email: userDetails && userDetails.email,
    };
    fetchMeetings(pastObj).then((result) => {
      const { status, data } = result.payload.data;
      const meetings = this.filterMeetings(data);
      if (status === 200) {
        setFetchPastMeetings(meetings);
      }
    });
  };

  render() {
    const { meetingSelect } = this.state;
    const {
      userDetails,
      history,
      setMeetingsType,
      setMeetingSummaryData,
      meetings,
    } = this.props;
    const { pastMeetings } = meetings;
    let meetingData =
      meetings.meetingsType === "upcoming" ? meetings.meetings : pastMeetings;
    let allMeetings = [];
    if (
      meetingData &&
      meetingData.length > 0 &&
      meetings.meetingsType === "upcoming"
    ) {
      for (const meeting of meetingData) {
        let startDate = moment.utc(meeting.start_date_time).toDate();
        let meetingDate = moment(startDate).format("ll");
        let todayDate = moment().format("ll");
        if (meetingDate !== todayDate) {
          allMeetings.push(meeting);
        }
      }
    } else {
      allMeetings = meetingData;
    }
    let sortedMeetings = [];
    if (meetings.meetingsType === "upcoming") {
      sortedMeetings = _.sortBy(allMeetings, "start_date_time");
    } else {
      if (allMeetings && allMeetings.length > 0) {
        for (const data of allMeetings) {
          let stillUtcStart = moment.utc(data.start_date_time).toDate();
          let startDate = moment(stillUtcStart)
            .local()
            .format("YYYY-MM-DD HH:mm:ss");
          const date = moment(startDate).format("MMMM-YYYY");
          sortedMeetings.push({ ...data, date });
        }
      }
      sortedMeetings = _.sortBy(sortedMeetings, "start_date_time").reverse();
    }
    const options = [
      { value: "Upcoming", label: "Upcoming" },
      { value: "Past", label: "Past" },
    ];

    return (
      <div className="meetings-card">
        <div className="meeting-heading">
          <div className="d-flex">
            <h2 className="mr-2">Meetings list</h2>

            <Select
              options={options}
              classNamePrefix="task"
              onChange={(data) => this.selectMeetingsType(data)}
              value={
                meetingSelect.value
                  ? { label: meetingSelect.label, value: meetingSelect.value }
                  : { label: "Upcoming", value: "Upcoming" }
              }
            />
          </div>
          <Link
            onClick={() => {
              setMeetingsType(
                meetingSelect.value === "Past" ? "past" : "upcoming"
              );
              history.push("/view/all-meetings");
            }}
          >
            See all
          </Link>
        </div>
        <ul className="meetings-list past-meetings">
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
              if (index <= 3) {
                return (
                  <li
                    onClick={() => {
                      setMeetingSummaryData(data, userDetails.email || "");
                      history.push("/view/meetings-details");
                    }}
                    key={`${data.start_date_time}${index}`}
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
                        <h3>{data.title}</h3>
                        {startDate && endDate && (
                          <p>
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
                    </div>
                  </li>
                );
              }
            })
          ) : (
            <div className="no-meeting-list">
              <p className="mb-0">No Meetings</p>
            </div>
          )}
        </ul>
      </div>
    );
  }
}

export default withRouter(MeetingsList);
