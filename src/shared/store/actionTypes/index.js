export const generateActionTypes = (action) => ({
  SUCCESS: `${action}_SUCCESS`,
  FAILED: `${action}_FAILED`,
  REQUEST: `${action}_REQUEST`,
});

export const LOGIN_USER = generateActionTypes("LOGIN_USER");
export const REGISTER_USER = generateActionTypes("REGISTER_USER");
export const FORGOT_PASSWORD = generateActionTypes("FORGOT_PASSWORD");
export const RESET_PASSWORD = generateActionTypes("RESET_PASSWORD");
export const VERIFY_FORGOT_PASSWORD = generateActionTypes(
  "VERIFY_FORGOT_PASSWORD"
);
export const VERIFY_EMAIL = generateActionTypes("VERIFY_EMAIL");
export const SOCIAL_LOGIN = generateActionTypes("SOCIAL_LOGIN");
export const SELECT_USER_TYPE = generateActionTypes("SELECT_USER_TYPE");
export const SELECT_ORGANIZATION = generateActionTypes("SELECT_ORGANIZATION");
export const SET_USER_ORGANIZATION_DATA = generateActionTypes(
  "SET_USER_ORGANIZATION_DATA"
);
export const ORGANIZATION_INVITE_USER = generateActionTypes(
  "ORGANIZATION_INVITE_USER"
);
export const UPDATE_USER = generateActionTypes("UPDATE_USER");
export const DELETE_USER = generateActionTypes("DELETE_USER");
export const VERIFY_ORGANIZATION_USER_TOKEN = generateActionTypes(
  "VERIFY_ORGANIZATION_USER_TOKEN"
);
export const RESEND_EMAIL = generateActionTypes("RESEND_EMAIL");
export const FETCH_MEETINGS = generateActionTypes("FETCH_MEETINGS");
export const IMPORT_SOCIAL_MEETINGS = generateActionTypes(
  "IMPORT_SOCIAL_MEETINGS"
);
export const IMPORT_SOCIAL_CONTACTS = generateActionTypes(
  "IMPORT_SOCIAL_CONTACTS"
);
export const DELETE_MEETING = generateActionTypes("DELETE_MEETING");
export const DELETE_CONTACT = generateActionTypes("DELETE_CONTACT");
export const FETCH_CONTACTS = generateActionTypes("FETCH_CONTACTS");
export const ADD_MEETING = generateActionTypes("ADD_MEETING");
export const INVITE_USER = generateActionTypes("INVITE_USER");
export const INVITED_PARTICIPANTS_LOGIN = generateActionTypes(
  "INVITED_PARTICIPANTS_LOGIN"
);
export const UPDATE_MEETING = generateActionTypes("UPDATE_MEETING");
export const UPDATE_USER_PROFILE = generateActionTypes("UPDATE_USER_PROFILE");
export const UPDATE_ORGANIZATION_PROFILE = generateActionTypes(
  "UPDATE_ORGANIZATION_PROFILE"
);
export const CLOSE_MEETING_STATUS = generateActionTypes("CLOSE_MEETING_STATUS");
export const CHANGE_PASSWORD = generateActionTypes("CHANGE_PASSWORD");
export const FETCH_TASKS = generateActionTypes("FETCH_TASKS");
export const GET_FETCH_TASKS = generateActionTypes("GET_FETCH_TASKS");
export const SET_MEETING_DATA = "SET_MEETING_DATA";
export const SET_IS_LOADING = "SET_IS_LOADING";
export const RESET_STORE = "RESET_STORE";
export const SHARE_PDF = generateActionTypes("SHARE_PDF");
export const DELETE_TASK = generateActionTypes("DELETE_TASK");
export const UPDATE_MEETING_STATUS = generateActionTypes(
  "UPDATE_MEETING_STATUS"
);
export const MEETING_ATTENDANCE = generateActionTypes("MEETING_ATTENDANCE");
export const GET_USER_OR_ORGANIZATION = generateActionTypes(
  "GET_USER_OR_ORGANIZATION"
);
export const UPDATE_TASK = generateActionTypes("UPDATE_TASK");
export const TASK_REMINDER = generateActionTypes("TASK_REMINDER");
export const APPLY_FILTERS = generateActionTypes("APPLY_FILTERS");
export const GET_PARTICULAR_TASKS = generateActionTypes("GET_PARTICULAR_TASKS");
export const STRIPE_PAYMENT_STATUS = generateActionTypes(
  "STRIPE_PAYMENT_STATUS"
);
export const SEARCH_MEETINGS = generateActionTypes("SEARCH_MEETINGS");
export const GET_FREE_TRAIL_PLAN = generateActionTypes("GET_FREE_TRAIL_PLAN");
export const FETCH_NOTIFICATIONS = generateActionTypes("FETCH_NOTIFICATIONS");
export const CLEAR_NOTIFICATIONS = generateActionTypes("CLEAR_NOTIFICATIONS");
export const FETCH_PARTICULAR_MEETING_DATA = generateActionTypes(
  "FETCH_PARTICULAR_MEETING_DATA"
);
export const SET_MEETING_ATTENDANCE_RESPONSE = generateActionTypes(
  "SET_MEETING_ATTENDANCE_RESPONSE"
);
export const READ_NOTIFICATION = generateActionTypes("READ_NOTIFICATION");
export const SET_ACCOUNT_STATUS = generateActionTypes("SET_ACCOUNT_STATUS");
export const SET_DELETE_OR_DEACTIVATE_ACCOUNT = generateActionTypes("SET_DELETE_OR_DEACTIVATE_ACCOUNT");
