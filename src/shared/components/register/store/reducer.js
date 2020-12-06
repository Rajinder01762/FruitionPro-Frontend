import modal from "../../../util/index";
import {
  REGISTER_USER,
  VERIFY_EMAIL,
  VERIFY_ORGANIZATION_USER_TOKEN,
  SOCIAL_LOGIN,
  LOGIN_USER,
} from "../../../store/actionTypes";
import { SET_REGISTER, SET_USER_ID } from "./types";
import { composeResetReducer } from "../../../store/reducers/reset-reducer";

const initialState = {
  isRegisterSuccess: false,
  userId: null,
  email: null,
  name: null,
  token: null,
  email_token: null,
  verifyStatus: false,
};

const RegisterReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_USER.SUCCESS: {
      const { status, message, data } = action.payload.data;
      if (data && data.is_verified === true) {
        modal(status, "Register successfully");
      } else {
        modal(status, message);
      }
      if (status === 200) {
        if(data && data.user) {
          const { _id, name, email, token, email_token } = data.user;
          return {
            ...state,
            isRegisterSuccess: true,
            userId: _id,
            name,
            email,
            token,
            email_token,
          }
        }
        else{
          return{
            ...state
          }
        }
      } else {
        return state;
      }
    }
    case LOGIN_USER.SUCCESS: {
      const { status, data } = action.payload.data;
      if(data && data.user){
        if (status === 200) {
          const { name, email, _id } = data.user;
          return {
            ...state,
            isLoginSuccess: true,
            name,
            email,
            userId: _id,
          };
        } 
      }
      else {
        return {
          ...state
        };
      }
    }
    case VERIFY_EMAIL.SUCCESS: {
      const { status } = action.payload.data;
      if (status === 200) {
        const obj = JSON.parse(action.payload.config.data);
        return {
          ...state,
          verifyEmail: true,
          userId: obj.id,
        };
      } else {
        return state;
      }
    }
    case SOCIAL_LOGIN.SUCCESS: {
      const { status, data, exist } = action.payload.data;
      if (status === 200) {
          const { _id } = data.user;
          return {
            ...state,
            userId: _id,
          };
      } else {
        return state;
      }
    }
    case SET_USER_ID: {
      return {
        ...state,
        userId: (action.data) || "",
      };
    }
    case SET_REGISTER: {
      return {
        ...state,
        isRegisterSuccess: false,
      };
    }
    case VERIFY_ORGANIZATION_USER_TOKEN.SUCCESS: {
      const { status, verified_status, message } = action.payload.data;
      modal(status, message);
      if (status === 200) {
        return {
          ...state,
          verifyStatus: verified_status,
        };
      } else {
        return state;
      }
    }
    default: {
      return state;
    }
  }
};

export default composeResetReducer(RegisterReducer, initialState);
