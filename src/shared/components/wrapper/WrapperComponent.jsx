import React, { Component } from "react";
import DashboardContainer from "./../dashboard/DashboardContainer";
import ContactsContainer from "./../contacts/ContactsContainer";
import Header from "./layout/Header/";
import Sidebar from "./layout/Sidebar/";
import { Route, withRouter, Redirect } from "react-router-dom";

import ManageUserContainer from "../manageUser/ManageUserContainer";
import ProfileContainer from "../profile/ProfileContainer";
import GridCalendarContainer from "../gridCalendar/GridCalendarContainer";
import createMeetingContainer from "../createMeeting/createMeetingContainer";
import TaskManagementContainer from "../taskManagement/TaskManagementContainer";
import AllMeetings from "../dashboard/allMeetings";
import Notifications from "../dashboard/notifications";
import AllNotifications from "../dashboard/notifications/allNotifications";
import Search from "../dashboard/search";
import ReportContainer from "../reportAnalytics/ReportContainer";
import VirtualAssistant from "../virtualAssistant";
// import MeetingsSummaryContainer from '../meetingsSummary/MeetingsSummaryContainer';

class WrapperComponent extends Component {
  state = {
    isSidebarOpen: false,
    isOpenCreateMeeting: false,
  };
  componentDidMount() {
    const { fetchContacts, userDetails } = this.props;
    const obj = {
      email: userDetails.email,
    };
    fetchContacts(obj).then((result) => {});
  }
  toggleSidebar = () =>
    this.setState({ isSidebarOpen: !this.state.isSidebarOpen });

  toggleCreateMeeting = () => {
    this.setState((prevState) => ({
      isOpenCreateMeeting: !prevState.isOpenCreateMeeting,
      error: "",
    }));
    this.props.resetMeetingData();
  };

  render() {
    const { isSidebarOpen, isOpenCreateMeeting } = this.state;
    const { isTypeSet } = this.props;
    let isLogin = JSON.parse(localStorage.getItem("isLogin"));

    return (
      <div>
        {!isTypeSet && isLogin && <Redirect to="/account-type" />}
        {console.log(isTypeSet, isLogin, "dsfjdhsjfhjsdhjfd")}
        <Header
          toggleMeetingModal={this.toggleCreateMeeting}
          toggleSidebar={this.toggleSidebar}
        />
        <Sidebar
          isOpen={isOpenCreateMeeting}
          toggle={this.toggleCreateMeeting}
          isSidebarOpen={isSidebarOpen}
          toggleSidebar={this.toggleSidebar}
        />
        <Route exact path={`/view`} component={DashboardContainer} />
        <Route path={`/view/profile`} exact component={ProfileContainer} />
        <Route path={`/view/calendar`} exact component={GridCalendarContainer} />
        <Route path={`/view/tasks`} exact component={TaskManagementContainer} />
        <Route path={`/view/manage-users`} exact component={ManageUserContainer}/>
        <Route path={`/view/reports`} exact component={ReportContainer} />
        <Route path={`/view/settings`} exact component={DashboardContainer} />
        <Route path={`/view/contacts`} exact component={ContactsContainer} />
        <Route path={`/view/meetings-details`} exact component={createMeetingContainer} />
        <Route path={`/view/all-meetings`} exact component={AllMeetings} />
        <Route path={`/view/all-notifications`} exact component={AllNotifications} />
        <Route path={`/view/search-results`} exact component={Search} />
        <div className="copyright">
          <p>
            2020 @ Copyright and IP owned by Unimas Consulting Solutions Pte
            Ltd, Singapore
            <span className="ml-2">
              <a href="mailto:fruitionpro@unimasconsultig.com">Contact Us</a>
            </span>
          </p>
        </div>
      </div>
    );
  }
}
export default withRouter(WrapperComponent);
