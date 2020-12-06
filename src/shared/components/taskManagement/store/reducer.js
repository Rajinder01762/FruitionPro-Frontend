import { composeResetReducer } from "../../../store/reducers/reset-reducer";
import {
  FETCH_TASKS,
  GET_FETCH_TASKS,
  UPDATE_TASK,
  DELETE_TASK,
  TASK_REMINDER,
  APPLY_FILTERS,
  GET_PARTICULAR_TASKS,
} from "../../../store/actionTypes";
import Modal from "../../../util/index";
import {
  SET_TASK_SUMMARY_DATA,
  ADD_COMMENT,
  IS_FILTER_APPLY,
  SET_CURRENT_FILTERS,
  SET_TASK_TYPE,
  SET_TASKS_COUNT,
  SET_TASKS_FILTER_DATA,
  CLEAR_TASKS_FILTER_DATA,
  SET_SELECTED_TASKS,
  SET_ARCHIVED_STATUS,
  SET_ARCHIVED_TYPE,
} from "./types";
import { bindActionCreators } from "redux";

const initialState = {
  createTaskData: {},
  filterData: [],
  notStartedTasks: {},
  inProgressTasks: {},
  completedTasks: {},
  overDueTasks: {},
  archivedTasks: {},
  filterApplied: false,
  currentDepartments: [],
  currentProjects: [],
  currentMeetings: [],
  taskType: "All Actions",
  pieStartedTasks: {},
  pieInprogressTasks: {},
  pieCompletedTasks: {},
  pieOverdueTasks: {},
  dueDateFilters: null,
  startDateArchived: null,
  endDateArchived: null,
  selectedTasks: "today",
  todayTasks: [],
  upcomingTasks: [],
  completedCount: 0,
  totalCount: 0,
  startTaskDate: null,
  endTaskDate: null,
  showArchived: false,
  archivedType: "All",
  filteredArchivedTasks: [],
};
const filterByStatus = (tasks, status) => {
  let arr = [];
  tasks &&
    tasks.length > 0 &&
    tasks.filter((item) => {
      const found = arr.some((el) => {
        return el._id === item._id;
      });
      if (!found && item.status === status) arr.push(item);
    });
  if (!arr) {
    return [];
  }
  return arr;
};

const chartData = (data, status) => {
  let totalTasks = filterByStatus(data.allTask, status);
  let organizerTasks = filterByStatus(data.organiserTasks, status);
  let myTasks = filterByStatus(data.myTasks, status);

  let obj = {
    totalTasksCount: totalTasks.length,
    organizerTasksCount: organizerTasks.length,
    mytasksCount: myTasks.length,
  };

  return obj;
};
const TasksReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_TASKS.SUCCESS: {
      const { status, message } = action.payload.data;

      // Modal(status, message);
      if (status === 200) {
        const { allTask } = action.payload.data;

        let a = filterByStatus(allTask, "in_progress");
        console.log(a, "udhdgsfdhfghdfdhgh");
        return {
          ...state,
          notStartedTasks: filterByStatus(allTask, "not_started"),
          inProgressTasks: filterByStatus(allTask, "in_progress"),
          completedTasks: filterByStatus(allTask, "completed"),
          overDueTasks: filterByStatus(allTask, "over_due"),
          archivedTasks: [
            ...filterByStatus(allTask, "postponed"),
            ...filterByStatus(allTask, "cancelled"),
          ],
          filterData: allTask && allTask.filterData ? allTask.filterData : [],
          pieStartedTasks: chartData(action.payload.data, "not_started"),
          pieInprogressTasks: chartData(action.payload.data, "in_progress"),
          pieCompletedTasks: chartData(action.payload.data, "completed"),
          pieOverdueTasks: chartData(action.payload.data, "over_due"),
        };
      } else {
        return state;
      }
    }
    case GET_FETCH_TASKS.SUCCESS: {
      const { status, message } = action.payload.data;
      // Modal(status, message);

      if (status === 200) {
        const { data } = action.payload.data;

        return {
          ...state,
          currentDepartments: data,
          currentProjects: data,
          currentMeetings: data,
          dueDateFilters: action.payload.dueDate
            ? action.payload.dueDate
            : null,
          startDateArchived: action.payload.startDate
            ? action.payload.startDate
            : null,
          endDateArchived: action.payload.endDate
            ? action.payload.endDate
            : null,
          filteredArchivedTasks: action.payload.filteredArchivedTasks
            ? action.payload.filteredArchivedTasks
            : state.filteredArchivedTasks,
        };
      } else {
        return state;
      }
    }
    // eslint-disable-next-line no-fallthrough
    case SET_TASK_SUMMARY_DATA: {
      return {
        ...state,
        createTaskData: action.payload,
      };
    }
    case UPDATE_TASK.SUCCESS: {
      const { status, message } = action.payload.data;
      Modal(status, message);
      return {
        ...state,
      };
    }
    case ADD_COMMENT: {
      const oldComments = [...state.createTaskData.comments];
      oldComments.push(action.payload);

      return {
        ...state,
        createTaskData: {
          ...state.createTaskData,
          comments: oldComments,
        },
      };
    }
    case DELETE_TASK.SUCCESS: {
      return {
        ...state,
      };
    }
    case TASK_REMINDER.SUCCESS: {
      const { status, message } = action.payload.data;
      Modal(status, message);
      return {
        ...state,
      };
    }
    case APPLY_FILTERS.SUCCESS: {
      const { status, message } = action.payload.data;
      Modal(status, message);
      const { allTask } = action.payload.data;

      return {
        ...state,
        notStartedTasks: filterByStatus(allTask, "not_started"),
        inProgressTasks: filterByStatus(allTask, "in_progress"),
        completedTasks: filterByStatus(allTask, "completed"),
        overDueTasks: filterByStatus(allTask, "over_due"),
      };
    }
    case IS_FILTER_APPLY: {
      return {
        ...state,
        filterApplied: action.payload,
      };
    }
    case SET_CURRENT_FILTERS: {
      return {
        ...state,
        currentDepartments: action.payload.currentDepartments
          ? action.payload.currentDepartments
          : state.currentDepartments,
        currentProjects: action.payload.currentProjects
          ? action.payload.currentProjects
          : state.currentProjects,
        currentMeetings: action.payload.currentMeetings
          ? action.payload.currentMeetings
          : state.currentMeetings,
        dueDateFilters: action.payload.dueDate ? action.payload.dueDate : null,
        startDateArchived: action.payload.startDate
          ? action.payload.startDate
          : null,
        endDateArchived: action.payload.endDate ? action.payload.endDate : null,
        filteredArchivedTasks: action.payload.filteredArchivedTasks
          ? action.payload.filteredArchivedTasks
          : state.filteredArchivedTasks,
      };
    }
    case GET_PARTICULAR_TASKS.SUCCESS: {
      const { status, message } = action.payload.data;
      // Modal(status, message)
      const { allTask } = action.payload.data;
      return {
        ...state,
        notStartedTasks: allTask.not_started ? allTask.not_started : {},
        inProgressTasks: allTask.in_progress ? allTask.in_progress : {},
        completedTasks: allTask.completed ? allTask.completed : {},
        overDueTasks: allTask.over_due ? allTask.over_due : {},
      };
    }
    case SET_TASK_TYPE: {
      return {
        ...state,
        taskType: action.payload,
        // showArchived: false
      };
    }

    case SET_TASKS_FILTER_DATA: {
      return {
        ...state,
        completedCount:
          action && action.payload && action.payload.completedCount
            ? action.payload.completedCount
            : state.completedCount,
        totalCount:
          action && action.payload && action.payload.totalCount
            ? action.payload.totalCount
            : state.totalCount,
        startTaskDate:
          action && action.payload && action.payload.startTaskDate
            ? action.payload.startTaskDate
            : state.startTaskDate,
        endTaskDate:
          action && action.payload && action.payload.endTaskDate
            ? action.payload.endTaskDate
            : state.endTaskDate,
      };
    }
    case CLEAR_TASKS_FILTER_DATA: {
      return {
        ...state,
        completedCount: 0,
        totalCount: 0,
        startTaskDate: null,
        endTaskDate: null,
      };
    }
    case SET_SELECTED_TASKS: {
      return {
        ...state,
        selectedTasks: (action && action.payload) || state.selectedTasks,
      };
    }
    case SET_ARCHIVED_STATUS: {
      return {
        ...state,
        showArchived: action.payload,
      };
    }
    case SET_ARCHIVED_TYPE: {
      return {
        ...state,
        archivedType: action.payload || state.archivedType,
      };
    }
    default: {
      return state;
    }
  }
};

export default composeResetReducer(TasksReducer, initialState);
