import { action } from "../../../store/actions/action";
import { FETCH_MEETINGS } from "../../../store/actionTypes";
import { SET_FETCH_MEETINGS, SET_FETCH_PAST_MEETINGS, SET_FETCH_UPCOMING_MEETINGS } from "./types";

export const fetchMeetings = (body) => action({
  types: [FETCH_MEETINGS.REQUEST, FETCH_MEETINGS.SUCCESS],
  payload: {
    request: {
      url: 'meeting/fetch-meetings',
      data: body,
      method: 'POST'
    }
  }
});

export const setFetchMeetings = (data) => {
  return {
    type: SET_FETCH_MEETINGS,
    payload: data
  }
}

export const setFetchPastMeetings = (data) => {
  return {
    type: SET_FETCH_PAST_MEETINGS,
    payload: data
  }
}

export const setFetchUpcomingMeetings = (data) => {
  return {
    type: SET_FETCH_UPCOMING_MEETINGS,
    payload: data
  }
}
// export const setFetchTodayMeetings = (data) => {
//   return {
//     type: SET_FETCH_TODAY_MEETINGS,
//     payload: data
//   }
// }

// export const updateTask = (body) => action({
//   types: [UPDATE_TASK.REQUEST, UPDATE_TASK.SUCCESS],
//   payload: {
//     request: {
//       url: 'task/update-task',
//       data: body,
//       method: 'POST'
//     }
//   }
// })

// export const setTaskSummaryData = (data) => ({
//   type: SET_TASK_SUMMARY_DATA,
//   payload: data
// })

// export const addComment = (data) => ({
//   type: ADD_COMMENT,
//   payload: data
// })

// export const deleteTask = (body) => ({
//   types: [DELETE_TASK.REQUEST, DELETE_TASK.SUCCESS],
//   payload: {
//     request: {
//       url: 'task/delete',
//       data: body,
//       method: 'POST'
//     }
//   }
// })

// export const taskReminder = (body) => ({
//   types: [TASK_REMINDER.REQUEST, TASK_REMINDER.SUCCESS],
//   payload: {
//     request: {
//       url: 'task/reminder',
//       data: body,
//       method: 'POST'
//     }
//   }
// })

// export const applyFilters = (body) => ({
//   types: [APPLY_FILTERS.REQUEST, APPLY_FILTERS.SUCCESS],
//   payload: {
//     request: {
//       url: 'task/filter-tasks',
//       data: body,
//       method: 'POST'
//     }
//   }
// })

// export const isFilterApplied = (data) => ({
//   type: IS_FILTER_APPLY,
//   payload: data
// })

// export const setCurrentFilters = (data) => ({
//   type: SET_CURRENT_FILTERS,
//   payload: data
// })

// export const setTaskType = (data) => ({
//   type: SET_TASK_TYPE,
//   payload: data
// })

// export const getParticularTasks = (body) => action({
//   types: [GET_PARTICULAR_TASKS.REQUEST, GET_PARTICULAR_TASKS.SUCCESS],
//   payload: {
//     request: {
//       url: 'task/my-organiser-all-tasks',
//       data: body,
//       method: 'POST'
//     }
//   }
// })

// export const setTasksFilterData = (data) => ({
//   type: SET_TASKS_FILTER_DATA,
//   payload: data
// })

// export const clearTasksDateFilter = () => ({
//   type: CLEAR_TASKS_FILTER_DATA
// })

// export const setSelectedTasks = (data) => ({
//   type: SET_SELECTED_TASKS,
//   payload: data
// })

// export const setArchivedStatus = (data) => ({
//   type: SET_ARCHIVED_STATUS,
//   payload: data
// });

// export const setArchivedType = (data) => ({
//   type: SET_ARCHIVED_TYPE,
//   payload: data
// })