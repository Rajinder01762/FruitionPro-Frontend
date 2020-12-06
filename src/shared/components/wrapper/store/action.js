import { action } from "../../../store/actions/action";
import {
  IMPORT_SOCIAL_MEETINGS,
  IMPORT_SOCIAL_CONTACTS,
  INVITE_USER,
  SET_MEETING_DATA,
  SEARCH_MEETINGS,
  SHARE_PDF,
  READ_NOTIFICATION,
} from "../../../store/actionTypes";
import {
  TOGGLE_PRIVATE_NOTE,
  ADD_INVITE_CONTACT,
  SET_MEETINGS_TYPE,
  deleteUser,
  deleteUserProfile,
} from "./types";

export const importSocialMeetings = (body) =>
  action({
    types: [IMPORT_SOCIAL_MEETINGS.REQUEST, IMPORT_SOCIAL_MEETINGS.SUCCESS],
    payload: {
      request: {
        url: "meeting/meetings",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });

export const importSocialContacts = (body) =>
  action({
    types: [IMPORT_SOCIAL_CONTACTS.REQUEST, IMPORT_SOCIAL_CONTACTS.SUCCESS],
    payload: {
      request: {
        url: "meeting/contacts",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });

export const setMeetingData = (data, isCreate) => ({
  type: SET_MEETING_DATA,
  payload: data,
  isCreate,
});

export const inviteAndSaveUser = (body) =>
  action({
    types: [INVITE_USER.REQUEST, INVITE_USER.SUCCESS],
    payload: {
      request: {
        url: "meeting/invite",
        data: body,
        method: "POST",
      },
    },
  });

export const togglePrivateNote = (isOpen) => ({
  type: TOGGLE_PRIVATE_NOTE,
  payload: isOpen,
});

export const deleteInvitedUser = (data) => ({
  type: deleteUser,
  payload: data,
});

export const deleteProfile = (data) => ({
  type: deleteUserProfile,
  payload: data,
});

export const addInviteContact = (data) => ({
  type: ADD_INVITE_CONTACT,
  payload: data,
});

export const searchMeetings = (body) =>
  action({
    types: [SEARCH_MEETINGS.REQUEST, SEARCH_MEETINGS.SUCCESS],
    payload: {
      request: {
        url: "meeting/search",
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

export const readNotification = (body) =>
  action({
    types: [READ_NOTIFICATION.REQUEST, READ_NOTIFICATION.SUCCESS],
    payload: {
      request: {
        url: "notification/read",
        data: body,
        method: "POST",
      },
    },
  });
