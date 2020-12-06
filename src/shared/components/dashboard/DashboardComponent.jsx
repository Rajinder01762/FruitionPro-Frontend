import React, { Component } from "react";
import { Row, Col } from "reactstrap";
import TodayMeetingsList from "./todayMeetingsList";
import TodayTasks from "./todayTasks";
import Notifications from "./notifications";
import MeetingsList from "./meetingsList";
import DashboardPiechart from "./dashboardPiechart";
import TotalTasks from "./totalTasks";
import moment from "moment";

export default class DashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasksData: props.taskDetails || [],
      allTaskFetched: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.taskDetails !== state.tasksData) {
      return { tasksData: props.taskDetails };
    }
    return null;
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
    const {
      fetchMeetings,
      userDetails,
      setFetchMeetings,
      setFetchPastMeetings,
      history,
      fetchNotifications,
    } = this.props;

    if (
      userDetails &&
      userDetails.license_key &&
      userDetails.isLicenseExpired
    ) {
      history.push("/view/profile");
    }
    if (
      userDetails.license_key &&
      userDetails.license_key.expiry_date &&
      moment(userDetails.license_key.expiry_date)._d < new Date()
    ) {
      history.push("/view/profile");
    }
    this.setState({
      isUpdate: !this.state.isUpdate,
    });
    const obj = {
      type: "upcoming",
      email: userDetails && userDetails.email,
    };
    fetchMeetings(obj).then((result) => {
      console.log("resultresult", result);
      const { status, data } = result.payload.data;
      if (status === 200) {
        const meetings = this.filterMeetings(data);
        setFetchMeetings(meetings);
        const { setFetchTodayMeetings } = this.props;
        let todayMeetings = [];
        if (meetings && meetings.length > 0) {
          for (const meeting of meetings) {
            let startDate = moment.utc(meeting.start_date_time).toDate();
            let meetingDate = moment(startDate).format("ll");
            let todayDate = moment().format("ll");
            if (meetingDate === todayDate) {
              todayMeetings.push(meeting);
            }
          }
        }
        setFetchTodayMeetings(todayMeetings);
      }
    });
    // const pastObj = {
    //   type: "past",
    //   email: userDetails && userDetails.email,
    // };
    // fetchMeetings(pastObj).then((result) => {
    //   const { status, data } = result.payload.data;
    //   const meetings = this.filterMeetings(data);
    //   if (status === 200) {
    //     setFetchPastMeetings(meetings);
    //   }
    // });
    const taskObj = {
      email: userDetails.email,
    };
    const { fetchTasks } = this.props;
    fetchTasks(taskObj).then((result) => {
      const { status, allTask } = result.payload.data;
      const { setTasksFilterData } = this.props;
      let dateFilterTasks = [];
      let totalTasksArr = [];
      let notStartedTasks =
        (allTask && allTask.not_started && allTask.not_started.tasks) || [];
      let inProgressTasks =
        (allTask && allTask.in_progress && allTask.in_progress.tasks) || [];
      let completedTasks =
        (allTask && allTask.completed && allTask.completed.tasks) || [];
      let overDueTasks =
        (allTask && allTask.over_due && allTask.over_due.tasks) || [];
      this.setState({ tasksData: allTask, allTaskFetched: true });
      let totalTasks = totalTasksArr.concat(
        notStartedTasks,
        inProgressTasks,
        completedTasks,
        overDueTasks
      );
      totalTasks &&
        totalTasks.length > 0 &&
        totalTasks.forEach((data) => {
          let dueDate = moment.utc(data.due_date).toDate();
          let DueDate = moment(dueDate).format("YYYY-MM-DD");
          let lastMonthdate = moment(dueDate).add(-30, "days");
          let LastMonthDate =
            lastMonthdate &&
            lastMonthdate._d &&
            moment(lastMonthdate._d).format("YYYY-MM-DD");

          let todayDate = new Date();
          let TodayDate = moment(todayDate).format("YYYY-MM-DD");
          if (lastMonthdate && lastMonthdate._d) {
            if (DueDate >= LastMonthDate && DueDate <= TodayDate) {
              dateFilterTasks.push(data);
            }
          }
        });
      if (dateFilterTasks && dateFilterTasks.length > 0) {
        let completedCount = 0;
        for (const task of dateFilterTasks) {
          if (task.status === "Completed" || task.status === "completed") {
            completedCount = completedCount + 1;
          }
        }
        const obj = {
          completedCount: completedCount,
          totalCount: dateFilterTasks.length,
          startTaskDate: null,
          endTaskDate: null,
        };

        setTasksFilterData(obj);
      }
    });

    const notificationObj = {
      email: userDetails && userDetails.email,
    };
    fetchNotifications(notificationObj).then((result) => {});
    this.setState({ isInitialLoad: !this.state.isInitialLoad });
  }

  render() {
    const {
      fetchTasks,
      setSelectedTasks,
      setTaskSummaryData,
      fetchMeetings,
      setTasksFilterData,
      clearTasksDateFilter,
      setFetchPastMeetings,
      userDetails,
      meetings,
      setMeetingsType,
      setMeetingSummaryData,
      setFetchMeetings,
      taskDetails,
      notificationsData,
      setMeetingAttendance,
    } = this.props;
    const { tasksData, allTaskFetched } = this.state;

    return (
      <div>
        <div className="dashboard-wrapper">
          <div className="dashboard-content">
            <div className="dashboard-title">
              <h2>Dashboard</h2>
            </div>
            <Row>
              <Col md={6} xl={3} className="orderSection-3 margin-bottom">
                <TodayMeetingsList
                  todayMeetings={meetings.todayMeetings}
                  setMeetingsType={setMeetingsType}
                />
              </Col>
              <Col md={6} xl={9} className="orderSection-1 margin-bottom">
                <div>
                  <TodayTasks
                    taskDetails={taskDetails}
                    setTaskSummaryData={setTaskSummaryData}
                    setSelectedTasks={setSelectedTasks}
                  />
                </div>
              </Col>
              {/* <Col md={6} xl={3} className="orderSection-2 margin-bottom">
                <Notifications
                  userDetails={userDetails}
                  meetings={meetings}
                  notifications={notificationsData}
                  setMeetingSummaryData={setMeetingSummaryData}
                  setTaskSummaryData={setTaskSummaryData}
                  setMeetingAttendance={setMeetingAttendance}
                />
              </Col> */}
              <Col
                md={6}
                xl={3}
                className="margin-negative orderSection-4 margin-bottom"
              >
                <MeetingsList
                  setFetchMeetings={setFetchMeetings}
                  setMeetingSummaryData={setMeetingSummaryData}
                  setMeetingsType={setMeetingsType}
                  meetings={meetings}
                  fetchMeetings={fetchMeetings}
                  userDetails={userDetails}
                  setFetchPastMeetings={setFetchPastMeetings}
                />
              </Col>
              <Col md={6} xl={6} className="orderSection-5 margin-bottom">
                <div>
                  <DashboardPiechart
                    allTaskFetched={allTaskFetched}
                    fetchTasks={fetchTasks}
                    userDetails={userDetails}
                    clearTasksDateFilter={clearTasksDateFilter}
                    setTasksFilterData={setTasksFilterData}
                    taskDetails={tasksData}
                  />
                </div>
              </Col>
              <Col md={6} xl={3} className="orderSection-6 margin-bottom">
                <TotalTasks taskDetails={taskDetails} />
              </Col>
            </Row>
          </div>
        </div>
      </div>
    );
  }
}

// import React, {Component} from "react";
// import {
//   Dropdown,
//   DropdownToggle,
//   DropdownMenu,
//   DropdownItem
// } from "reactstrap";
// import MoreIcon from "../../icons/moreIcon";
// import _ from "lodash";
// import moment from "moment";
// import LockIcon from "../../../asset/images/dashboard-icons/lock.svg";
// import { circleCharacter } from "../createMeeting/createMeetingComponent";

// export default class DashboardComponent extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isLoading: false,
//       isLogout: false,
//       modal: false,
//       dropdownOpen: false,
//       collapse: false,
//       showPastMeeting: false,
//       id: "",
//       dropdownDeleteIndex: "",
//       dropdownUserIndex: "",
//       isDisplayAll: false
//     };
//     this.toggle = this.toggle.bind(this);
//     this.accordion = this.accordion.bind(this);
//   }
//   componentDidMount() {
//     const {
//       fetchMeetings,
//       userDetails,
//       setFetchMeetings,
//       history
//     } = this.props;
//     if (userDetails && userDetails.isLicenseExpired) {
//       history.push("/view/profile");
//     }
//     const obj = {
//       type: "upcoming",
//       email: userDetails.email
//     };
//     this.setState({
//       showPastMeeting: false
//     });
//     fetchMeetings(obj).then(result => {
//       setFetchMeetings(result.payload.data.data);
//     });
//   }
//   handleInput = e => {
//     this.setState({
//       [e.target.name]: e.target.value
//     });
//   };
//   toggle() {
//     this.setState(prevState => ({
//       modal: !prevState.modal
//     }));
//   }
//   accordion() {
//     this.setState(state => ({ collapse: !state.collapse }));
//   }
//   dropdownToggle(id) {
//     this.setState(prevState => ({
//       dropdownOpen: !prevState.dropdownOpen,
//       dropdownUserIndex: "",
//       id
//     }));
//   }
//   dtToggle = (e, index) => {
//     e.preventDefault();
//     this.setState({
//       dropdownOpen: !this.state.dropdownOpen,
//       dropdownUserIndex: index,
//       id: ""
//     });
//   };
//   onPastMeetings = e => {
//     e.preventDefault();
//     const { fetchMeetings, userDetails, setFetchMeetings } = this.props;
//     this.setState({
//       showPastMeeting: true
//     });
//     const obj = {
//       type: "past",
//       email: userDetails.email
//     };
//     fetchMeetings(obj).then(result => {
//       setFetchMeetings(result.payload.data.data);
//     });
//   };
//   onScheduleMeetings = e => {
//     e.preventDefault();
//     this.setState({
//       showPastMeeting: false
//     });
//     const { fetchMeetings, userDetails } = this.props;
//     const obj = {
//       type: "upcoming",
//       email: userDetails.email
//     };
//     this.setState({
//       showPastMeeting: false
//     });
//     fetchMeetings(obj).then(result => {});
//   };
//   monthMeetings = meetings => {
//     let upcomingMeetings = [];
//     if (meetings && meetings.length > 0) {
//       for (const data of meetings) {
//         let stillUtcStart = moment.utc(data.start_date_time).toDate();
//         let startDate = moment(stillUtcStart)
//           .local()
//           .format("YYYY-MM-DD HH:mm:ss");
//         const date = moment(startDate).format("MMMM-YYYY");
//         upcomingMeetings.push({ ...data, date });
//       }
//     }
//     const data = _.mapValues(_.groupBy(upcomingMeetings, "date"));
//     return data;
//   };
//   onDeleteMeeting = (e, id) => {
//     e.preventDefault();
//     const { deleteMeeting } = this.props;
//     const deleteObj = {
//       id
//     };
//     deleteMeeting(deleteObj);
//   };

//   isMeetingTimeOver = dateTime => {
//     const a = moment(dateTime);
//     const b = moment();
//     const c = moment.duration(b.diff(a)).asMinutes();
//     if (c > 0) return true;
//     else return false;
//   };

//   renderMeetings = data => {
//     const {
//       showPastMeeting,
//       id,
//       isDisplayAll,
//       dropdownOpen,
//       dropdownUserIndex
//     } = this.state;
//     const { setMeetingSummaryData, history, userDetails } = this.props;
//     return (
//       data &&
//       Object.keys(data).length > 0 &&
//       Object.keys(data).map((temp, index) => {
//         var arr = temp;
//         var res = arr.split("-");
//         return (
//           <>
//             <h2 className="meeting-header">
//               {res[0]}&nbsp;
//               <span>{res[1]}</span>
//             </h2>
//             <ul className="meetings-list">
//               {data[temp] &&
//                 data[temp].length > 0 &&
//                 data[temp].map((upcomingMeetings, index) => {
//                   let stillUtcStart = moment
//                     .utc(upcomingMeetings.start_date_time)
//                     .toDate();
//                   let stillUtcEnd = moment
//                     .utc(upcomingMeetings.end_date_time)
//                     .toDate();
//                   let startDate = moment(stillUtcStart)
//                     .local()
//                     .format("YYYY-MM-DD HH:mm:ss");
//                   let endDate = moment(stillUtcEnd)
//                     .local()
//                     .format("YYYY-MM-DD HH:mm:ss");
//                   let isReadyToStop = this.isMeetingTimeOver(
//                     upcomingMeetings.end_date_time
//                   );
//                   const matchedIn = upcomingMeetings.matchedIn;
//                   const arrray =
//                     upcomingMeetings &&
//                     upcomingMeetings.matchedIn &&
//                     Object.keys(upcomingMeetings.matchedIn);
//                   return (
//                     <>
//                       <li
//                         onClick={() => {
//                           setMeetingSummaryData(
//                             upcomingMeetings,
//                             userDetails.email || ""
//                           );
//                           history.push("/view/meetings-details");
//                         }}
//                       >
//                         <div className="date">
//                           {/* <h4>{moment(upcomingMeetings.dateTime).format('ddd').toUpperCase()}A</h4> */}
//                           <h4>
//                             {moment(startDate)
//                               .format("ddd")
//                               .toUpperCase()}
//                           </h4>
//                           <h3>{moment(startDate).format("DD")}</h3>
//                         </div>
//                         <div className="meeting-content">
//                           <div className="meeting-details lock">
//                             <div className="mr-3 lock-icon">
//                               {upcomingMeetings.is_closed && (
//                                 <img src={LockIcon} alt="" />
//                               )}
//                             </div>
//                             <div>
//                               <h3>{upcomingMeetings.title}</h3>
//                               {arrray &&
//                                 arrray.length > 0 &&
//                                 arrray.map(data => {
//                                   return (
//                                     <h5 className="meetTitle">
//                                       <b>{data} : </b> {matchedIn[data]}
//                                     </h5>
//                                   );
//                                 })}
//                               <p>
//                                 {startDate === ""
//                                   ? "All day"
//                                   : "(" +
//                                     moment(startDate).format("hh:mm a") +
//                                     "-" +
//                                     moment(endDate).format("hh:mm a") +
//                                     ")"}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="meetings-user">
//                             <div className="meeting-user-inner">
//                               {upcomingMeetings &&
//                                 upcomingMeetings.attendees &&
//                                 upcomingMeetings.attendees.length > 0 &&
//                                 upcomingMeetings.attendees.map(
//                                   (attendee, i) => {
//                                     if (!isDisplayAll && i < 2) {
//                                       return (
//                                         <div
//                                           title={
//                                             (attendee &&
//                                               attendee._id &&
//                                               attendee._id.email) ||
//                                             ""
//                                           }
//                                           style={{
//                                             height: "38px",
//                                             width: "38px",
//                                             backgroundColor: "#d0eaff",
//                                             borderRadius: "24px",
//                                             textAlign: "center",
//                                             color: "black",
//                                             marginLeft: "5px",
//                                             position: "relative"
//                                           }}
//                                         >
//                                           <span
//                                             title={
//                                               (attendee &&
//                                                 attendee._id &&
//                                                 attendee._id.email) ||
//                                               ""
//                                             }
//                                             style={{
//                                               position: "absolute",
//                                               top: "50%",
//                                               left: "50%",
//                                               transform: "translate(-50%, -50%)"
//                                               // }}>{i < 3 && (attendee._id.email.charAt(0).toUpperCase())}</span></div>
//                                             }}
//                                           >
//                                             {i < 3 &&
//                                               circleCharacter(
//                                                 attendee && attendee._id
//                                               )}
//                                           </span>
//                                         </div>
//                                       );
//                                     }
//                                   }
//                                 )}
//                               {upcomingMeetings.attendees &&
//                                 upcomingMeetings.attendees.length > 2 && (
//                                   <>
//                                     <Dropdown
//                                       className="dropdown-more"
//                                       isOpen={
//                                         dropdownOpen &&
//                                         dropdownUserIndex ===
//                                           upcomingMeetings._id
//                                       }
//                                       size="sm"
//                                       toggle={e =>
//                                         this.dtToggle(e, upcomingMeetings._id)
//                                       }
//                                     >
//                                       <DropdownToggle>
//                                         <span
//                                           onClick={e => {
//                                             e.stopPropagation();
//                                             this.dtToggle(
//                                               e,
//                                               upcomingMeetings._id
//                                             );
//                                           }}
//                                         >
//                                           More..
//                                         </span>
//                                       </DropdownToggle>
//                                       <DropdownMenu>
//                                         {upcomingMeetings.attendees &&
//                                           upcomingMeetings.attendees.length >
//                                             0 &&
//                                           upcomingMeetings.attendees.map(
//                                             (attendee, i) => {
//                                               if (i + 1 > 2) {
//                                                 return (
//                                                   <>
//                                                     <div
//                                                       title={
//                                                         attendee._id.email || ""
//                                                       }
//                                                       style={{
//                                                         height: "38px",
//                                                         width: "38px",
//                                                         backgroundColor:
//                                                           "#d0eaff",
//                                                         borderRadius: "24px",
//                                                         textAlign: "center",
//                                                         color: "black",
//                                                         marginLeft: "5px",
//                                                         position: "relative"
//                                                       }}
//                                                     >
//                                                       <span
//                                                         title={
//                                                           attendee._id.email ||
//                                                           ""
//                                                         }
//                                                         style={{
//                                                           position: "absolute",
//                                                           top: "50%",
//                                                           left: "50%",
//                                                           transform:
//                                                             "translate(-50%, -50%)"
//                                                           // }}>{(attendee._id.email.charAt(0).toUpperCase())}
//                                                           // {i > 3 && attendee._id.email.charAt(0).toUpperCase()}
//                                                         }}
//                                                       >
//                                                         {circleCharacter(
//                                                           attendee._id
//                                                         )}
//                                                         {/* {i > 3 && circleCharacter(attendee._id)} */}
//                                                       </span>
//                                                     </div>
//                                                   </>
//                                                 );
//                                               }
//                                             }
//                                           )}
//                                       </DropdownMenu>
//                                     </Dropdown>
//                                   </>
//                                 )}
//                             </div>
//                             {/* {upcomingMeetings.attendees.length > 3 && <a href style={{ top: '13px', position: 'relative', fontWeight: '520', fontSize: '14px' }}>more..</a>} */}
//                             <div className="user-edit">
//                               <Dropdown
//                                 isOpen={
//                                   this.state.dropdownOpen &&
//                                   id === upcomingMeetings._id
//                                 }
//                                 toggle={() => {
//                                   this.dropdownToggle(upcomingMeetings._id);
//                                 }}
//                               >
//                                 <DropdownToggle>
//                                   <span
//                                     onClick={e => {
//                                       e.stopPropagation();
//                                       this.dropdownToggle(upcomingMeetings._id);
//                                     }}
//                                   >
//                                     {" "}
//                                     <MoreIcon />
//                                   </span>
//                                 </DropdownToggle>
//                                 <DropdownMenu>
//                                   <DropdownItem
//                                     onClick={e => {
//                                       e.stopPropagation();
//                                       this.onDeleteMeeting(
//                                         e,
//                                         upcomingMeetings._id
//                                       );
//                                     }}
//                                   >
//                                     Delete
//                                   </DropdownItem>
//                                 </DropdownMenu>
//                               </Dropdown>
//                             </div>
//                           </div>
//                         </div>
//                       </li>
//                     </>
//                   );
//                 })}
//             </ul>
//           </>
//         );
//       })
//     );
//   };

//   render() {
//     const {
//       showPastMeeting,
//       id,
//       isDisplayAll,
//       dropdownOpen,
//       dropdownUserIndex
//     } = this.state;
//     const {
//       setMeetingSummaryData,
//       meetings,
//       history,
//       userDetails
//     } = this.props;
//     const data = this.monthMeetings(meetings.meetings);
//     let searchMeetings = [];
//     let othersMeetings = [];
//     if (meetings && meetings.searchedMeetings) {
//       searchMeetings = this.monthMeetings(meetings.searchedMeetings);
//     }
//     if (meetings && meetings.otherMeetings) {
//       othersMeetings = this.monthMeetings(meetings.otherMeetings);
//     }
//     return (
//       <div className="dashboard-wrapper">
//         {meetings.isSearch ? (
//           <div className="dashboard-content">
//             {Object.entries(searchMeetings).length !== 0 && (
//               <div className="dashboard-title">
//                 <h2>Relevant Search Results</h2>
//               </div>
//             )}
//             {this.renderMeetings(searchMeetings)}
//             {/* {Object.entries(othersMeetings).length !== 0 && <div className="dashboard-title mt-5">
//               <h2>Other Appearances</h2>
//             </div>}
//             {this.renderMeetings(othersMeetings)} */}
//             {Object.entries(searchMeetings).length === 0 && (
//               <div className="noFound">No matches found</div>
//             )}
//             {/* {Object.entries(searchMeetings).length === 0 && Object.entries(othersMeetings).length === 0 && <div className="noFound">
//               No matches found
//             </div>} */}
//           </div>
//         ) : (
//           <div className="dashboard-content">
//             {!showPastMeeting ? (
//               <div className="dashboard-title">
//                 <h2>{"Scheduled Meetings"}</h2>
//                 <a
//                   href
//                   style={{ cursor: "pointer" }}
//                   className="meetLinks"
//                   role="button"
//                   onClick={e => this.onPastMeetings(e)}
//                 >
//                   View Past Meetings
//                 </a>
//               </div>
//             ) : (
//               <div className="dashboard-title">
//                 <h2>{"Past Meetings"}</h2>
//                 <a
//                   href
//                   style={{ cursor: "pointer" }}
//                   role="button"
//                   onClick={e => this.onScheduleMeetings(e)}
//                 >
//                   Go Back
//                 </a>
//               </div>
//             )}
//             {this.renderMeetings(data)}
//           </div>
//         )}
//       </div>
//     );
//   }
// }
