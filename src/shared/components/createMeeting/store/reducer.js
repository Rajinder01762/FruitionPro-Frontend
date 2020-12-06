import {
  SET_MEETING_DATA,
  CLOSE_MEETING_STATUS,
  UPDATE_MEETING_STATUS,
  UPDATE_MEETING,
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
import { composeResetReducer } from "../../../store/reducers/reset-reducer";
import { SET_MEETING_SUMMARY_DATA } from "../../dashboard/store/types";
import _ from "lodash";
import modal from "../../../util/index";

const initialState = {
  createMeetingData: {},
  agendaItems: [],
  documents: [],
  paricipants: [],
  meetingNotes: "",
  canEdit: true,
  meetingId: "",
  isCreate: false,
  isAdmin: false,
  private_notes: [],
  meetingStatus: null,
  status: "",
  editAllMeetings: false,
  oldMeetingData: {},
};

const createMeetingReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MEETING_DATA: {
      return {
        ...state,
        createMeetingData: action.payload,
        canEdit: true,
        isCreate: state.isCreate ? state.isCreate : action.isCreate,
      };
    }
    case SET_AGENDA_DATA: {
      const oldItems = [];
      oldItems.push(action.payload);
      return {
        ...state,
        agendaItems: _.orderBy(
          oldItems.concat(state.agendaItems),
          ["agendaId"],
          ["asc"]
        ),
      };
    }
    case UPDATE_AGENDA_ITEM: {
      const oldItems = [...state.agendaItems.slice()];

      let updateIndex;
      if (action.payload.agendaId) {
        updateIndex = oldItems.findIndex(
          (item) => item.agendaId === action.payload.agendaId
        );
      } else {
        updateIndex = oldItems.findIndex(
          (item) => item._id === action.payload._id
        );
      }

      if (updateIndex > -1) {
        oldItems.splice(updateIndex, 1, action.payload);
      }
      return {
        ...state,
        agendaItems: oldItems,
      };
    }
    case SET_DOCUMENT_DATA: {
      const oldDocuments = [];
      oldDocuments.push(action.payload);
      return {
        ...state,
        documents: state.documents.concat(oldDocuments),
      };
    }
    case DELETE_DOCUMENT: {
      const documentsItems = [...state.documents];
      const indexToDelete = documentsItems.findIndex(
        (item) => item.url === action.payload.url
      );
      if (indexToDelete > -1) {
        documentsItems.splice(indexToDelete, 1);
      }
      return {
        ...state,
        documents: documentsItems,
      };
    }
    case UPDATE_EDIT_PERMISSION: {
      const selected = [...state.paricipants];
      const updateItem = selected.find(
        (item) => item.email === action.payload.email
      );
      if (updateItem) {
        updateItem.canEdit = action.canEdit;
      }
      return {
        ...state,
        paricipants: selected,
      };
    }
    case SET_PARTICIPANTS: {
      return {
        ...state,
        paricipants: action.payload, //_.unionWith(action.payload, [...state.paricipants], (a, b) => a.email === b.email)
      };
    }
    case RESET_MEETING_DATA: {
      return initialState;
    }

    case SET_MEETING_SUMMARY_DATA: {
      console.log("SET_MEETING_SUMMARY_DATA", action.payload);
      return {
        ...action.payload,
        oldMeetingData: action.payload,
      };
    }
    case SET_PRIVATE_NOTES: {
      const oldNotes =
        state.private_notes && state.private_notes.length > 0
          ? [...state.private_notes]
          : [];
      const index = oldNotes.findIndex(
        (element) => element.email === action.payload.email
      );
      if (index > -1) {
        oldNotes.splice(index, 1, action.payload);
      } else {
        oldNotes.push(action.payload);
      }
      return {
        ...state,
        private_notes: oldNotes,
      };
    }
    case CLOSE_MEETING_STATUS.SUCCESS: {
      const { status, message } = action.payload.data;
      // modal(status, message)
      if (status === 200) {
        const { meetingStatus } = action.payload.data;
        return {
          ...state,
          meetingStatus: meetingStatus,
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case UPDATE_MEETING_STATUS.SUCCESS: {
      const { status, meetingStatus } = action.payload.data;
      if (status === 200) {
        return {
          ...state,
          status: meetingStatus,
        };
      }
      return state;
    }

    case FETCH_PARTICULAR_MEETING_DATA.SUCCESS: {
      return {
        ...state,
      };
    }

    case SET_ATTENDANCE: {
      let paricipants = state.paricipants;
      paricipants &&
        paricipants.forEach((element) => {
          if (element.email === action.payload) {
            element.is_present = true;
          }
        });

      return {
        ...state,
        paricipants,
      };
    }

    case UPDATE_MEETING.SUCCESS: {
      const { status, message } = action.payload.data;
      modal(status, message);
      return {
        ...state,
      };
    }

    case SET_EDIT_ALL_MEETINGS: {
      return {
        ...state,
        editAllMeetings: action.payload,
      };
    }
    default:
      return state;
  }
};

export default composeResetReducer(createMeetingReducer, initialState);
