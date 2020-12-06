import React, { Component } from "react";

export default class TotalTasks extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { taskDetails } = this.props;
    console.log("taskDetailstaskDetails", taskDetails);
    let notStartedCount =
      (taskDetails &&
        taskDetails.notStartedTasks &&
        taskDetails.notStartedTasks.length) ||
      0;
    let inProgressCount =
      (taskDetails &&
        taskDetails.inProgressTasks &&
        taskDetails.inProgressTasks.length) ||
      0;
    let completedCount =
      (taskDetails &&
        taskDetails.completedTasks &&
        taskDetails.completedTasks.length) ||
      0;
    let overDueCount =
      (taskDetails &&
        taskDetails.overDueTasks &&
        taskDetails.overDueTasks.length) ||
      0;
    return (
      <div className="meetings-card">
        <div className="totalTaskWrap">
          <ul>
            <div className="meeting-heading">
              <h2 className="mb-2">Total Actions</h2>
            </div>
            <li>
              <div className="total-taskStatus">
                <span className="square notStarted"></span>Not Started
              </div>
              <div className="status-count">{notStartedCount || 0}</div>
            </li>
            <li>
              <div className="total-taskStatus">
                <span className="square inProgress"></span>In Progress
              </div>
              <div className="status-count">{inProgressCount || 0}</div>
            </li>
            <li>
              <div className="total-taskStatus">
                <span className="square completed"></span>Completed
              </div>
              <div className="status-count">{completedCount || 0}</div>
            </li>
            <li>
              <div className="total-taskStatus">
                <span className="square overDue"></span>Over Due
              </div>
              <div className="status-count">{overDueCount || 0}</div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
