import { action } from "../../../store/actions/action";
import {
  ADD_MEETING,
  UPDATE_MEETING,
  SHARE_PDF,
  CLOSE_MEETING_STATUS,
  UPDATE_MEETING_STATUS,
  MEETING_ATTENDANCE,
  FETCH_PARTICULAR_MEETING_DATA,
} from "../../../store/actionTypes";
import {
  SET_AGENDA_DATA,
  SET_DOCUMENT_DATA,
  SET_PARTICIPANTS,
  RESET_MEETING_DATA,
  DELETE_DOCUMENT,
  UPDATE_EDIT_PERMISSION,
  UPDATE_AGENDA_ITEM,
  SET_PRIVATE_NOTES,
  SET_ATTENDANCE,
  SET_EDIT_ALL_MEETINGS,
} from "./types";

export const addMeeting = (body) => {
  console.log(body);
  return action({
    types: [ADD_MEETING.REQUEST, ADD_MEETING.SUCCESS],
    payload: {
      request: {
        url: "meeting/create",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });
};

export const setMeetingStatus = (body) =>
  action({
    types: [CLOSE_MEETING_STATUS.REQUEST, CLOSE_MEETING_STATUS.SUCCESS],
    payload: {
      request: {
        url: "meeting/reopen-close-meeting",
        data: body,
        method: "POST",
      },
    },
  });

export const updateMeeting = (body) =>
  action({
    types: [UPDATE_MEETING.REQUEST, UPDATE_MEETING.SUCCESS],
    payload: {
      request: {
        url: "meeting/modify",
        data: body,
        method: "POST",
      },
    },
  });

export const sharePdf = (body) =>
  action({
    types: [SHARE_PDF.REQUEST, SHARE_PDF.SUCCESS],
    payload: {
      request: {
        url: "meeting/share",
        data: body,
        method: "POST",
      },
    },
  });

export const updateStartEndStatus = (body) =>
  action({
    types: [UPDATE_MEETING_STATUS.REQUEST, UPDATE_MEETING_STATUS.SUCCESS],
    payload: {
      request: {
        url: "meeting/update-status",
        data: body,
        method: "POST",
      },
    },
  });

export const meetingAttendance = (body) =>
  action({
    types: [MEETING_ATTENDANCE.REQUEST, MEETING_ATTENDANCE.SUCCESS],
    payload: {
      request: {
        url: "user/attendance",
        data: body,
        method: "POST",
      },
    },
  });

export const fetchParticularMeetingData = (body) =>
  action({
    types: [
      FETCH_PARTICULAR_MEETING_DATA.REQUEST,
      FETCH_PARTICULAR_MEETING_DATA.SUCCESS,
    ],
    payload: {
      request: {
        url: "meeting/fetch-single-meeting",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });

export const setAgendaItems = (data) => {
  console.log("setAgendaItemssetAgendaItems", data);
  return {
    type: SET_AGENDA_DATA,
    payload: data,
  };
};
export const setDocuments = (data) => ({
  type: SET_DOCUMENT_DATA,
  payload: data,
});
export const deleteDocument = (data) => ({
  type: DELETE_DOCUMENT,
  payload: data,
});
export const setParticipants = (data) => ({
  type: SET_PARTICIPANTS,
  payload: data,
});
export const updateEditPermission = (item, canEdit) => {
  return {
    type: UPDATE_EDIT_PERMISSION,
    payload: item,
    canEdit,
  };
};

export const resetMeetingData = () => ({
  type: RESET_MEETING_DATA,
});

export const updateAgendaItem = (data) => ({
  type: UPDATE_AGENDA_ITEM,
  payload: data,
});

export const setPrivateNotes = (data) => ({
  type: SET_PRIVATE_NOTES,
  payload: data,
});

export const setAttendance = (data) => ({
  type: SET_ATTENDANCE,
  payload: data,
});

export const setEditAllMeetings = (data) => ({
  type: SET_EDIT_ALL_MEETINGS,
  payload: data,
});
