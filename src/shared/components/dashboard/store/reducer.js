import {
  FETCH_NOTIFICATIONS,
  CLEAR_NOTIFICATIONS,
  SET_MEETING_ATTENDANCE_RESPONSE,
} from "../../../store/actionTypes";
import { composeResetReducer } from "../../../store/reducers/reset-reducer";
import Modal from "../../../util/index";

const initialState = {
  notifications: [],
};

const NotificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_NOTIFICATIONS.SUCCESS: {
      const { status, data } = action.payload;

      if (status === 200) {
        return {
          ...state,
          notifications: data || [],
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case CLEAR_NOTIFICATIONS.SUCCESS: {
      const { status, message } = action.payload.data;
      if (status === 200) {
        Modal(status, message);
        return {
          ...state,
          notifications: [],
        };
      } else {
        return {
          ...state,
        };
      }
    }

    case SET_MEETING_ATTENDANCE_RESPONSE.SUCCESS: {
      const { status, message } = action.payload.data;
      Modal(status, message);
      return {
        ...state,
      };
    }

    default:
      return state;
  }
};

export default composeResetReducer(NotificationsReducer, initialState);
