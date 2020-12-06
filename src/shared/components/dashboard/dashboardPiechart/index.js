import React, { Component } from "react";
import { Row, Col } from "reactstrap";
// import Select from "react-select";
import DatePicker from "react-datepicker";
import CanvasJSReact from "../../../../asset/canvasjs.react";
import moment from "moment";

var CanvasJSChart = CanvasJSReact.CanvasJSChart;
var CanvasJS = CanvasJSReact.CanvasJS;
// CanvasJS.addColorSet("tasksShades", ["#85c13b", "#ffc70b", "#4aabe0", "#d64032"]);
// CanvasJS.addColorSet("tasksShades", ["yellow", "blue", "green", "red"]);
CanvasJS.addColorSet("tasksShades", [
  "#85c13b",
  "#4aabe0",
  "#ffc70b",
  "#d64032",
]);

export default class DashboardPiechart extends Component {
  constructor(props) {
    super(props);
    // const { taskDetails } = this.props;
    this.state = {
      tasksStartDate: null,
      tasksEndDate: moment().toDate(),
      isFilterApply: false,
      error: "",
      isInitial: true,
      tasksLength: 0,
      inProgressCount: 0,
      notStartedCount: 0,
      overDueCount: 0,
      completedCount: 0,
    };
  }

  tasksDateFilterDetails = () => {
    const {
      taskDetails,
      setTasksFilterData,
      clearTasksDateFilter,
    } = this.props;

    let dateFilterTasks = [];
    let totalTasksArr = [];
    let notStartedTasks = taskDetails && taskDetails.notStartedTasks;
    let inProgressTasks = taskDetails && taskDetails.inProgressTasks;
    let completedTasks = taskDetails && taskDetails.completedTasks;
    let overDueTasks = taskDetails && taskDetails.overDueTasks;

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
        let endTaskDate = "";
        if(data.status === "completed"){
          endTaskDate = moment.utc(data.end_date).toDate();
          let EndTaskDate = moment(endTaskDate).format("YYYY-MM-DD");
          if(lastMonthdate && lastMonthdate._d){
            if (EndTaskDate >= LastMonthDate && EndTaskDate <= TodayDate) {
              dateFilterTasks.push(data);
            }
          }
        }
        else {
          if (lastMonthdate && lastMonthdate._d) {
            if (DueDate >= LastMonthDate && DueDate <= TodayDate) {
              dateFilterTasks.push(data);
            }
          }
        }
      });
      
    if (dateFilterTasks && dateFilterTasks.length > 0) {
      let completedCount = 0;
      let inProgressCount = 0;
      let notStartedCount = 0;
      let overDueCount = 0;
      for (const task of dateFilterTasks) {
        let todayDate = new Date();
        // let TodayDate = moment(todayDate).format('YYYY-MM-DD');
        let dueDate = task && moment.utc(task.due_date).toDate();
        // let DueDate = moment(dueDate).format('YYYY-MM-DD');
        // let d = todayDate < dueDate ? true : false;
        if (todayDate <= dueDate) {
          if (task.status === "completed") {
            completedCount = completedCount + 1;
          }
          if (task.status === "not_started") {
            notStartedCount = notStartedCount + 1;
          }
          if (task.status === "in_progress") {
            inProgressCount = inProgressCount + 1;
          }
        } else {
          if (task.status === "completed") {
            completedCount = completedCount + 1;
          } else {
            overDueCount = overDueCount + 1;
          }
        }
        // if (task.status === 'Over Due') {
        //   overDueCount = overDueCount + 1;
        // }
      }
      this.setState({
        inProgressCount,
        notStartedCount,
        overDueCount,
        completedCount,
      });
      const obj = {
        completedCount: completedCount,
        totalCount: dateFilterTasks.length,
        startTaskDate: null,
        endTaskDate: null,
      };

      setTasksFilterData(obj);
    } else {
      clearTasksDateFilter();
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (
      props.taskDetails &&
      props.taskDetails.notStartedTasks &&
      props.taskDetails.notStartedTasks.tasks &&
      props.taskDetails.notStartedTasks.tasks.length > 0
    ) {
      return {
        tasksLength: props.taskDetails.notStartedTasks.tasks.length,
        isInitial: false,
      };
    }

    return null;
  }
  componentDidMount() {
    const { clearTasksDateFilter } = this.props;
    const { tasksEndDate, isInitialLoad } = this.state;
    let lastMonthdate = moment(tasksEndDate).add(-30, "days");
    let LastMonthDate =
      lastMonthdate && lastMonthdate._d && moment(lastMonthdate._d).toDate();
    if (LastMonthDate) {
      this.setState({
        tasksStartDate: LastMonthDate,
      });
    }

    clearTasksDateFilter();
    this.tasksDateFilterDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      !prevState.isInitial &&
      prevState.tasksLength !== this.state.tasksLength
    ) {
      const { clearTasksDateFilter } = this.props;
      clearTasksDateFilter();
      this.tasksDateFilterDetails();
      // this.state({ isInitial: true })
    } else if (prevProps.allTaskFetched !== this.props.allTaskFetched) {
      const { clearTasksDateFilter } = this.props;
      clearTasksDateFilter();
      this.tasksDateFilterDetails();
    }
  }

  onApplyTasksDateFilter = () => {
    const { tasksStartDate, tasksEndDate, error } = this.state;
    const {
      taskDetails,
      setTasksFilterData,
      clearTasksDateFilter,
    } = this.props;
    if (tasksStartDate < tasksEndDate) {
      this.setState({
        error: "",
        isFilterApply: true,
      });
      let totalTasksArr = [];
      let dateFilterTasks = [];
      let notStartedTasks =
        taskDetails && taskDetails.notStartedTasks
          ? taskDetails.notStartedTasks
          : [];

      let inProgressTasks =
        taskDetails && taskDetails.inProgressTasks
          ? taskDetails.inProgressTasks
          : [];

      let completedTasks =
        taskDetails && taskDetails.completedTasks
          ? taskDetails.completedTasks
          : [];

      let overDueTasks =
        taskDetails && taskDetails.overDueTasks ? taskDetails.overDueTasks : [];

      let totalTasks = totalTasksArr.concat(
        notStartedTasks,
        inProgressTasks,
        completedTasks,
        overDueTasks
      );
      console.log("totalTaskstotalTaskstotalTasks", totalTasks);
      let StartDate = moment(tasksStartDate).format("YYYY-MM-DD");
      let EndDate = moment(tasksEndDate).format("YYYY-MM-DD");
      let endTaskDate = "";
      totalTasks &&
        totalTasks.length > 0 &&
        totalTasks.forEach((data) => {
          if(data.status === "completed"){
            endTaskDate = moment.utc(data.end_date).toDate();
            let EndTaskDate = moment(endTaskDate).format("YYYY-MM-DD");
            if (EndTaskDate >= StartDate && EndTaskDate <= EndDate) {
              dateFilterTasks.push(data);
            }
          }
          else {
            let dueDate = moment.utc(data.due_date).toDate();
            let DueDate = moment(dueDate).format("YYYY-MM-DD");
            if (DueDate >= StartDate && DueDate <= EndDate) {
              dateFilterTasks.push(data);
            }
          }
        });
      if (dateFilterTasks && dateFilterTasks.length > 0) {
        let completedCount = 0;
        let inProgressCount = 0;
        let notStartedCount = 0;
        let overDueCount = 0;
        for (const task of dateFilterTasks) {
          let todayDate = new Date();
          // let TodayDate = moment(todayDate).format('YYYY-MM-DD');
          let dueDate = task && moment.utc(task.due_date).toDate();
          // let DueDate = moment(dueDate).format('YYYY-MM-DD');
          let d = todayDate < dueDate ? true : false;
          if (todayDate < dueDate) {
            if (task.status === "completed") {
              completedCount = completedCount + 1;
            }
            if (task.status === "not_started") {
              notStartedCount = notStartedCount + 1;
            }
            if (task.status === "in_progress") {
              inProgressCount = inProgressCount + 1;
            }
          } else {
            if (task.status === "completed") {
              completedCount = completedCount + 1;
            } else {
              overDueCount = overDueCount + 1;
            }
          }
          // if (task.status === 'Over Due') {
          //   overDueCount = overDueCount + 1;
          // }
        }
        this.setState({
          inProgressCount,
          notStartedCount,
          overDueCount,
          completedCount,
        });
        const obj = {
          completedCount: completedCount,
          totalCount: dateFilterTasks.length,
          startTaskDate: tasksStartDate,
          endTaskDate: tasksEndDate,
        };
        setTasksFilterData(obj);
      } else {
        this.setState({
          inProgressCount: 0,
          notStartedCount: 0,
          overDueCount: 0,
          completedCount: 0,
        });
        clearTasksDateFilter();
      }
    } else {
      this.setState({
        error: "End date should be greater than start date.",
      });
    }
  };

  clearTasksDateFilter = () => {
    let today = moment().toDate();
    let lastMonthdate = moment(today).add(-30, "days");
    let LastMonthDate =
      lastMonthdate && lastMonthdate._d && moment(lastMonthdate._d).toDate();
    this.setState({
      tasksStartDate: LastMonthDate,
      tasksEndDate: moment().toDate(),
      error: "",
      isFilterApply: false,
    });

    this.tasksDateFilterDetails();
  };

  render() {
    const {
      tasksStartDate,
      tasksEndDate,
      isFilterApply,
      error,
      inProgressCount,
      notStartedCount,
      overDueCount,
      completedCount,
    } = this.state;
    const { taskDetails } = this.props;
    let completePrecentage = 0;
    let inProgressPrecentage = 0;
    let notStartedPercentage = 0;
    let overDuePercentage = 0;
    if (taskDetails && taskDetails.totalCount) {
      completePrecentage = (completedCount / taskDetails.totalCount) * 100;
      inProgressPrecentage = (inProgressCount / taskDetails.totalCount) * 100;
      notStartedPercentage = (notStartedCount / taskDetails.totalCount) * 100;
      overDuePercentage = (overDueCount / taskDetails.totalCount) * 100;
    }
    const options = {
      backgroundColor: "transparent",
      // indexLabel: "{label} {y}%",
      height: 220,
      width: 220,
      colorSet: "tasksShades",
      toolTip: {
        enabled: false,
      },
      data: [
        {
          type: "doughnut",
          innerRadius: 80,
          // indexLabelLineThickness: 3,
          dataPoints: [
            { y: completePrecentage.toFixed(1), label: "" },
            { y: inProgressPrecentage.toFixed(1), label: "" },
            { y: notStartedPercentage.toFixed(1), label: "" },
            { y: overDuePercentage.toFixed(1), label: "" },
          ],
        },
      ],
    };
    return (
      <div className="meetings-card">
        <div className="pieChart-wrapper">
          <Row>
            <Col xl={5}>
              <div className="chartContainer">
                <div>
                  <CanvasJSChart className="pieChartStyle" options={options} />
                </div>
                <div className="pieChart-circle" onClick={() => {}}>
                  <span style={{ fontWeight: "800" }}>
                    {completePrecentage.toFixed(0) || 0}%
                  </span>
                </div>
              </div>
            </Col>
            <Col xl={7}>
              {!isFilterApply ? (
                <h4>Actions completed in last 30 days</h4>
              ) : (
                <h4>Actions completed in this following time</h4>
              )}
              <div className="meeting-heading">
                <h2 className="mb-2">Actions</h2>
              </div>
              <div className="pieChart-content">
                <h3 className="pieChart-count mb-4">
                  <span>{completedCount || 0}</span>/
                  {(taskDetails && taskDetails.totalCount) || 0}
                </h3>
                {/* <h4>Tasks completed in this following time</h4> */}
                <div className="task-date">
                  <DatePicker
                    // disabled={isFilterApply}
                    selected={
                      (tasksStartDate && moment(tasksStartDate).toDate()) ||
                      null
                    }
                    placeholderText="Start date"
                    className="form-control date"
                    showTimeInput={false}
                    dateFormat="d/MM/yyyy"
                    onChange={(date) => {
                      this.setState({ tasksStartDate: date });
                    }}
                  />
                  <span className="mx-3">to</span>
                  <DatePicker
                    // disabled={tasksStartDate === null || isFilterApply}
                    selected={
                      (tasksEndDate && moment(tasksEndDate).toDate()) || ""
                    }
                    dateFormat="d/MM/yyyy"
                    placeholderText="End date"
                    className="form-control date"
                    showTimeInput={false}
                    onChange={(date) => {
                      this.setState({ tasksEndDate: date });
                    }}
                  />
                </div>
                {error && error.length > 0 && (
                  <span className="text-danger">{error}</span>
                )}
                <div className="task-applyBtnWrap">
                  <button onClick={() => this.onApplyTasksDateFilter()}>
                    {/* {isFilterApply ? 'Applied' : 'Apply'} */}Apply
                  </button>
                  <button
                    className="clear-btn"
                    onClick={() => this.clearTasksDateFilter()}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}
