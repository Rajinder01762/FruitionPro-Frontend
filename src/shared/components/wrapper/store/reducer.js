/* eslint-disable no-fallthrough */
import {
  IMPORT_SOCIAL_MEETINGS,
  IMPORT_SOCIAL_CONTACTS,
  FETCH_MEETINGS,
  DELETE_MEETING,
  DELETE_CONTACT,
  FETCH_CONTACTS,
  INVITE_USER,
  SEARCH_MEETINGS,
  READ_NOTIFICATION,
} from "../../../store/actionTypes";
import { composeResetReducer } from "../../../store/reducers/reset-reducer";
import {
  SET_FETCH_MEETINGS,
  SET_FETCH_PAST_MEETINGS,
  SET_FETCH_TODAY_MEETINGS,
} from "../../dashboard/store/types";
import {
  TOGGLE_PRIVATE_NOTE,
  DELETE_INVITED_USER,
  ADD_INVITE_CONTACT,
  SET_MEETINGS_TYPE,
} from "./types";
import moment from "moment";
// import { Modal } from "reactstrap";
import Modal from "../../../util/index";
// import _ from "lodash"

const initialState = {
  meetings: [],
  pastMeetings: [],
  todayMeetings: [],
  contacts: [],
  searchedMeetings: [],
  otherMeetings: [],
  isOpenPrivateNote: false,
  isSearch: false,
  meetingsType: "upcoming",
};

const MeetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case IMPORT_SOCIAL_MEETINGS.SUCCESS: {
      return {
        ...state,
        meetings: [...state.meetings, ...action.payload.data.data],
      };
    }
    case IMPORT_SOCIAL_CONTACTS.SUCCESS: {
      return {
        ...state,
        contacts:
          action.payload && action.payload.data && action.payload.data.data,
      };
    }
    case FETCH_MEETINGS.SUCCESS: {
      const { data, status } = action.payload.data;
      if (status === 200) {
        if (data && data.length > 0) {
          return {
            ...state,
            // meetings: filterMeetings(data),
            searchedMeetings: [],
            otherMeetings: [],
            isSearch: false,
          };
        }
      } else {
        return {
          ...state,
        };
      }
      return {
        ...state,
      };
    }

    case SET_FETCH_MEETINGS: {
      return {
        ...state,
        meetings: action.payload || [],
      };
    }

    case FETCH_CONTACTS.SUCCESS: {
      if (action.payload && action.payload.data && action.payload.data.data) {
        return {
          ...state,
          contacts: action.payload.data.data,
        };
      }
    }
    case SET_FETCH_PAST_MEETINGS: {
      return {
        ...state,
        pastMeetings: action.payload || [],
      };
    }
    case SET_FETCH_TODAY_MEETINGS: {
      return {
        ...state,
        todayMeetings: action.payload || [],
      };
    }

    // case ADD_MEETING.SUCCESS: {
    //   const { data, message, status } = action.payload.data
    //   Modal(status, message)
    //   return {
    //     ...state,
    //     meetings: _.unionBy(state.meetings, data, '_id')
    //   }
    // }
    case DELETE_MEETING.SUCCESS: {
      let oldData = [...state.meetings];
      let oldTodayMeetingData = [...state.todayMeetings];
      let oldPastMeetingData = [...state.pastMeetings];
      let oldSearchMeetingData = [...state.searchedMeetings];

      const { message, status } = action.payload.data;
      Modal(status, message);
      const arr =
        (action.payload && action.payload.data && action.payload.data.id) || [];

      if (arr && arr.length > 0) {
        oldData = oldData.filter((item) => !arr.includes(String(item._id)));
        // const oldIndex = oldData.findIndex((item) => item._id === action.payload.data.id);
        // if (oldIndex > -1) {
        //   oldData.splice(oldIndex, 1);
        // }

        oldTodayMeetingData = oldTodayMeetingData.filter(
          (item) => !arr.includes(String(item._id))
        );
        // const oldTodayMeetingIndex = oldTodayMeetingData.findIndex((item) => item._id === action.payload.data.id);
        // if (oldTodayMeetingIndex > -1) {
        //   oldTodayMeetingData.splice(oldTodayMeetingIndex, 1);
        // }

        // const oldPastMeetingIndex = oldPastMeetingData.findIndex((item) => item._id === action.payload.data.id);
        oldPastMeetingData = oldPastMeetingData.filter(
          (item) => !arr.includes(String(item._id))
        );

        // if (oldPastMeetingIndex > -1) {
        //   oldPastMeetingData.splice(oldPastMeetingIndex, 1);
        // }

        // const oldSearchMeetingIndex = oldSearchMeetingData.findIndex((item) => item._id === action.payload.data.id);
        oldSearchMeetingData = oldSearchMeetingData.filter(
          (item) => !arr.includes(String(item._id))
        );

        // if (oldSearchMeetingIndex > -1) {
        //   oldSearchMeetingData.splice(oldSearchMeetingIndex, 1);
        // }
      }

      return {
        ...state,
        meetings: oldData,
        todayMeetings: oldTodayMeetingData,
        pastMeetings: oldPastMeetingData,
        searchedMeetings: oldSearchMeetingData,
      };
    }
    case DELETE_CONTACT.SUCCESS: {
      const oldData = [...state.contacts];
      const oldIndex = oldData.findIndex(
        (item) => item._id === action.payload.data.id
      );
      oldData.splice(oldIndex, 1);
      return {
        ...state,
        contacts: oldData,
      };
    }

    case INVITE_USER.SUCCESS: {
      return {
        ...state,
      };
    }
    case TOGGLE_PRIVATE_NOTE: {
      return {
        ...state,
        isOpenPrivateNote: action.payload,
      };
    }
    case DELETE_INVITED_USER: {
      const oldData = [...state.contacts];
      const oldIndex = oldData.findIndex(
        (item) => item.email === action.payload
      );
      oldData.splice(oldIndex, 1);
      return {
        ...state,
        contacts: oldData,
      };
    }
    case ADD_INVITE_CONTACT: {
      const oldData = [...state.contacts];
      if (action.payload.attendee) {
        const oldIndex =
          oldData &&
          oldData.length > 0 &&
          oldData.findIndex(
            (item) => item.email === action.payload.attendee.email
          );
        if (oldIndex < 0) {
          oldData.push(action.payload.attendee);
        }
      }

      return {
        ...state,
        contacts: oldData,
      };
    }
    case SEARCH_MEETINGS.SUCCESS: {
      const { status } = action.payload.data;
      let searchedMeetings = [];
      let otherMeetings = [];
      if (status === 200) {
        const { search, Other } = action.payload.data.data;

        if (search && search.length > 0) {
          searchedMeetings = search;
        }
        if (Other && Other.length > 0) {
          otherMeetings = Other;
        }
      }
      return {
        ...state,
        searchedMeetings: searchedMeetings,
        otherMeetings: otherMeetings,
        isSearch: true,
      };
    }
    case SET_MEETINGS_TYPE: {
      return {
        ...state,
        meetingsType: action.payload || state.meetingsType,
      };
    }

    case READ_NOTIFICATION.SUCCESS: {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
};

export default composeResetReducer(MeetingReducer, initialState);
