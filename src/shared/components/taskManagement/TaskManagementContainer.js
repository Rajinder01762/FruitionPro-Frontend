import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import TaskManagementComponent from "./TaskManagementComponent";
import {
  getFetchTasks,
  fetchTasks,
  setTaskSummaryData,
  updateTask,
  addComment,
  deleteTask,
  taskReminder,
  applyFilters,
  isFilterApplied,
  setCurrentFilters,
  getParticularTasks,
  setTaskType,
  setArchivedStatus,
  setArchivedType,
} from "./store/action";

const mapStateToProps = (state) => {
  return {
    userDetails: state.userDetails,
    taskDetails: state.taskDetails,
    taskData: state.taskDetails.createTaskData,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      fetchTasks,
      getFetchTasks,
      setTaskSummaryData,
      updateTask,
      addComment,
      deleteTask,
      taskReminder,
      applyFilters,
      isFilterApplied,
      setCurrentFilters,
      getParticularTasks,
      setTaskType,
      setArchivedStatus,
      setArchivedType,
    },
    dispatch
  );
};

const TaskManagementContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TaskManagementComponent);

export default TaskManagementContainer;
