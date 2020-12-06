import { action } from "../../../store/actions/action";
import {
  FETCH_MEETINGS,
  DELETE_MEETING,
  DELETE_CONTACT,
  FETCH_CONTACTS,
  FETCH_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
  SET_MEETING_ATTENDANCE_RESPONSE,
} from "../../../store/actionTypes";
import {
  SET_FETCH_MEETINGS,
  SET_MEETING_SUMMARY_DATA,
  SET_FETCH_PAST_MEETINGS,
  SET_FETCH_TODAY_MEETINGS,
} from "./types";
import { SET_MEETINGS_TYPE } from "../../wrapper/store/types";

export const fetchMeetings = (body) =>
  action({
    types: [FETCH_MEETINGS.REQUEST, FETCH_MEETINGS.SUCCESS],
    payload: {
      request: {
        url: "meeting/fetch-meetings",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });

export const fetchNotifications = (body) =>
  action({
    types: [FETCH_NOTIFICATIONS.REQUEST, FETCH_NOTIFICATIONS.SUCCESS],
    payload: {
      request: {
        url: "notification/fetch",
        data: body,
        method: "POST",
      },
    },
  });

export const fetchContacts = (body) =>
  action({
    types: [FETCH_CONTACTS.REQUEST, FETCH_CONTACTS.SUCCESS],
    payload: {
      request: {
        url: "attendee/fetch-contacts",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });
export const setFetchMeetings = (data) => {
  return {
    type: SET_FETCH_MEETINGS,
    payload: data,
  };
};

export const setFetchPastMeetings = (data) => {
  return {
    type: SET_FETCH_PAST_MEETINGS,
    payload: data,
  };
};

export const setFetchTodayMeetings = (data) => {
  return {
    type: SET_FETCH_TODAY_MEETINGS,
    payload: data,
  };
};

export const deleteMeeting = (body) =>
  action({
    types: [DELETE_MEETING.REQUEST, DELETE_MEETING.SUCCESS],
    payload: {
      request: {
        url: "meeting/delete",
        data: body,
        method: "POST",
      },
    },
  });

export const setMeetingsType = (data) => ({
  type: SET_MEETINGS_TYPE,
  payload: data,
});

export const deleteContact = (body) =>
  action({
    types: [DELETE_CONTACT.REQUEST, DELETE_CONTACT.SUCCESS],
    payload: {
      request: {
        url: "attendee/delete",
        data: body,
        method: "POST",
      },
    },
  });

const formatMeetingSummaryData = (meetingData, userEmail) => {
  console.log("formatMeetingSummaryData");
  let startDate = meetingData && meetingData.start_date_time;
  let endDate = meetingData && meetingData.end_date_time;
  const createMeetingData = {
    title: meetingData.title || "",
    project_name: meetingData.project_name || "",
    topic: meetingData.topic || "",
    department: meetingData.department || "",
    startDateTime: startDate || "",
    endDateTime: endDate || "",
    location: meetingData.address || "",
    recurrenceData: meetingData.recurrenceData || {},
    email: meetingData.admin_email || "",
    attendees: meetingData.attendees || "",
    isMeetingClosed: meetingData.is_closed,
    meetingId: meetingData._id || "",
    adminEmail: meetingData.admin_email || "",
    parentMeetingId: meetingData.parent_id || "",
  };

  const agendaItems =
    meetingData.agendas && meetingData.agendas.length
      ? meetingData.agendas
      : [];
  const documents =
    meetingData.documents && meetingData.documents.length
      ? meetingData.documents
      : [];
  const paricipants = [];
  let private_notes =
    userEmail === meetingData.admin_email ? meetingData.private_notes : [];
  meetingData.attendees &&
    meetingData.attendees.length &&
    meetingData.attendees.forEach((item) => {
      paricipants.push({
        ...item,
      });
    });
  const meetingNotes = meetingData.notes || "";
  let canEdit = false;

  if (userEmail && paricipants.length > 0) {
    const item = paricipants.find((item) => item.email === userEmail);
    if (item && item.can_edit) {
      canEdit = true;
    }
    if (item && item.notes) {
      private_notes = item.notes;
    }
  }
  let isAdmin = false;

  if (userEmail === meetingData.admin_email) {
    isAdmin = true;
    canEdit = true;
  }

  return {
    createMeetingData,
    agendaItems,
    documents,
    paricipants,
    meetingNotes,
    canEdit,
    meetingId: meetingData._id,
    isAdmin,
    private_notes: private_notes,
    meetingStatus: meetingData.is_closed ? "close" : "open",
    status: meetingData.status,
  };
};

export const setMeetingSummaryData = (data, userEmail) => ({
  type: SET_MEETING_SUMMARY_DATA,
  payload: formatMeetingSummaryData(data, userEmail),
});

export const clearNotifications = (body) =>
  action({
    types: [CLEAR_NOTIFICATIONS.REQUEST, CLEAR_NOTIFICATIONS.SUCCESS],
    payload: {
      request: {
        url: "notification/delete",
        data: body,
        method: "POST",
      },
    },
  });

export const setMeetingAttendance = (body) =>
  action({
    types: [
      SET_MEETING_ATTENDANCE_RESPONSE.REQUEST,
      SET_MEETING_ATTENDANCE_RESPONSE.SUCCESS,
    ],
    payload: {
      request: {
        url: "meeting/attendance-response",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });
