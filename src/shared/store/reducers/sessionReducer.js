import {
  SET_IS_LOADING,
  LOGIN_USER,
  SOCIAL_LOGIN,
  VERIFY_EMAIL,
  REGISTER_USER,
  INVITED_PARTICIPANTS_LOGIN,
} from "../actionTypes";
import { composeResetReducer } from "./reset-reducer";
import { SET_ACCESS_TOKEN } from "../../components/login/store/types";

const initialState = {
  token: null,
  email_token: null,
  isLoading: false,
  access_token: null,
  authToken: "",
};

const SessionReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER.SUCCESS: {
      const { status } = action.payload.data;

      if (status === 200) {
        const { email_token, token } = action.payload.data.data.user;

        return {
          ...state,
          email_token: email_token,
          token,
          authToken: token,
        };
      } else {
        return state;
      }
    }
    case INVITED_PARTICIPANTS_LOGIN.SUCCESS:
    case REGISTER_USER.SUCCESS:
    case SOCIAL_LOGIN.SUCCESS: {
      const { status } = action.payload.data;
      console.log("dfgdfgdsfgdfgdsfgdfsg", action.payload);
      if (status === 200) {
        const { token } = action.payload.data.data.user
          ? action.payload.data.data.user
          : action.payload.data.data;

        return {
          ...state,
          authToken: token,
          token,
        };
      }
      return state;
    }

    case "SET_SESSION": {
      return {
        ...state,
        token: action.data.token,
        email_token: action.data.email_token,
      };
    }

    case SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.payload,
      };
    }
    case SET_ACCESS_TOKEN: {
      return {
        ...state,
        access_token: action.data,
      };
    }
    case VERIFY_EMAIL.SUCCESS: {
      const { token, status } = action.payload.data;

      if (status === 200) {
        return {
          ...state,
          authToken: token,
        };
      }
      return state;
    }

    default: {
      return state;
    }
  }
};
export default composeResetReducer(SessionReducer, initialState);
