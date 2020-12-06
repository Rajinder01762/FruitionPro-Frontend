import React from 'react'
import DashboardIcon from "../../../../icons/dashboardIcon";
import ProfileIcon from "../../../../icons/profileIcon";
import ManageUsersIcon from "../../../../icons/manageUsersIcon";
import ReportAnalyticsIcon from "../../../../icons/reportAnalyticsIcon";
import TaskIcon from "../../../../icons/taskIcon";
export default [
  {
    icon: <DashboardIcon />, name: 'Dashboard', link: '/view'
  },
  {
    icon: <ProfileIcon />, name: 'Profile', link: '/view/profile'
  },
  {
    icon: <ManageUsersIcon />, name: 'Manage Users', link: '/view/manage-users'
  },
  {
    icon: <TaskIcon />, name: 'Action Management', link: '/view/tasks'
  },
  {
    icon: <ReportAnalyticsIcon />, name: 'Reports and Analytics', link: '/view/reports'
  },
  {
    icon: <ReportAnalyticsIcon />, name: 'Grid Calendar', link: '/view/calendar'
  },
]