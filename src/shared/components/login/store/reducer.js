import { LOGOUT_USER, SET_LOGIN_CREDENTIALS } from "./types";
import Modal from "../../../util/index";
import moment from "moment";
import {
  LOGIN_USER,
  SOCIAL_LOGIN,
  SELECT_USER_TYPE,
  SELECT_ORGANIZATION,
  UPDATE_USER_PROFILE,
  UPDATE_ORGANIZATION_PROFILE,
  REGISTER_USER,
} from "../../../store/actionTypes/index";
import { composeResetReducer } from "../../../store/reducers/reset-reducer";
import { SET_USER_TYPE } from "../../accountType/store/types";

const initialState = {
  email: null,
  name: null,
  isLoginSuccess: false,
  socialLogin: false,
  socialLoginType: null,
  calender: null,
  userType: null,
  isLicenseExpired: false,
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER.SUCCESS: {
      const { status, message, data } = action.payload.data;
      if (status !== 401) {
        Modal(status, message);
      }

      if (status === 200) {
        const { name, email, type, preferred_calender } = data.user;

        let license_key;
        if (type === "individual") {
          license_key = data && data.user.license_key;
        }
        if (type === "organization") {
          const organization = data.user && data.user.organization_id;
          license_key = organization.license_key;
        }

        let expired = false;

        if (
          license_key &&
          license_key.expiry_date &&
          moment(license_key.expiry_date)._d < new Date()
        ) {
          expired = true;
        }
        return {
          ...state,
          isLoginSuccess: true,
          name,
          email,
          calender: preferred_calender,
          license_key: license_key,
          isLicenseExpired: expired,
        };
      } else {
        return state;
      }
    }
    case REGISTER_USER.SUCCESS: {
      const { status, data } = action.payload.data;
      if (status === 200) {
        const { name, email } = data.user;
        return {
          ...state,
          name,
          email,
        };
      } else {
        return state;
      }
    }
    case SELECT_USER_TYPE.SUCCESS: {
      const { status, data } = action.payload.data;
      if (status === 200) {
        return {
          ...state,
          isLoginSuccess: true,
          calender:
            data && data.preferred_calender ? data.preferred_calender : null,
        };
      } else {
        return state;
      }
    }
    case SELECT_ORGANIZATION.SUCCESS: {
      const { status, data } = action.payload.data;

      if (status === 200) {
        return {
          ...state,
          isLoginSuccess: true,
          calender:
            data && data.user && data.user.preferred_calender
              ? data.user.preferred_calender
              : null,
        };
      } else {
        return state;
      }
    }
    case SOCIAL_LOGIN.SUCCESS: {
      const { status, data, exist, message } = action.payload.data;
      if (status !== 401) {
        Modal(status, message);
      }

      if (status === 200) {
        if (exist) {
          const { email, name, socialLoginType } = data.user;
          const organization = data.user && data.user.organization_id;
          let license_key;

          if (organization) {
            license_key = organization.license_key;
          } else {
            license_key = data && data.user.license_key;
          }
          let expired = false;
          if (
            license_key &&
            license_key.expiry_date &&
            moment(license_key.expiry_date)._d < new Date()
          ) {
            expired = true;
          }
          return {
            ...state,
            isLoginSuccess: true,
            socialLogin: true,
            email: email || null,
            name: name || null,
            socialLoginType,
            calender:
              data && data.user && data.user.preferred_calender
                ? data.user.preferred_calender
                : null,
            license_key,
            isLicenseExpired: expired,
            //   (organization && organization.isLicenseExpired) ||
            //   isLicenseExpired,
          };
        } else {
          const { socialLoginType } = data.user;
          console.log(
            "socialLoginTypesocialLoginTypesocialLoginType",
            socialLoginType
          );
          let expired = false;
          if (
            moment(
              data &&
                data.user &&
                data.user.license_key &&
                data.user.license_key &&
                data.user.license_key.expiry_date
            )._d < new Date()
          ) {
            // expired = true;
          }
          return {
            ...state,
            email: data && data.user.email,
            name: data && data.user.name,
            socialLogin: true,
            socialLoginType,
            calender:
              data && data.user && data.user.preferred_calender
                ? data.user.preferred_calender
                : null,
            license_key: data && data.user.license_key,
            isLicenseExpired: expired,
          };
        }
      } else {
        return state;
      }
    }
    case SET_LOGIN_CREDENTIALS: {
      return {
        ...state,
        email: action && action.data && action.data.email,
        name: action && action.data && action.data.name,
      };
    }
    case LOGOUT_USER: {
      return {
        ...state,
        isLoginSuccess: false,
      };
    }
    case UPDATE_USER_PROFILE.SUCCESS: {
      const { status, data } = action.payload.data;
      if (status === 200) {
        return {
          ...state,
          name: data && data.name,
          calender:
            data && data.preferred_calender
              ? data.preferred_calender
              : state.calender,
          // isLicenseExpired: data && data && data.isLicenseExpired,
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case UPDATE_ORGANIZATION_PROFILE.SUCCESS: {
      const { status, data } = action.payload.data;
      if (status === 200) {
        return {
          ...state,
          name:
            data && data.personalDetails && data.personalDetails.name
              ? data.personalDetails.name
              : state.name,
          calender:
            data &&
            data.personalDetails &&
            data.personalDetails.preferred_calender
              ? data.personalDetails.preferred_calender
              : state.calender,
          // isLicenseExpired: data && data.isLicenseExpired,
        };
      } else {
        return {
          ...state,
        };
      }
    }
    case SET_USER_TYPE: {
      return {
        ...state,
        userType: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};
export default composeResetReducer(LoginReducer, initialState);
