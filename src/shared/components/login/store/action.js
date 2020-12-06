import { LOGOUT_USER, SET_LOGIN_CREDENTIALS, SET_ACCESS_TOKEN } from "./types";
import { action } from "../../../store/actions/action";
import { LOGIN_USER, SOCIAL_LOGIN } from "../../../store/actionTypes/index.js";
import { SET_USER_ID } from "../../register/store/types";

export const loginApiAction = (body) =>
  action({
    types: [LOGIN_USER.REQUEST, LOGIN_USER.SUCCESS],
    payload: {
      request: {
        url: "auth/login",
        data: body,
        method: "POST",
      },
    },
  });
export const setLoginCredentials = (payload) =>
  action({
    type: SET_LOGIN_CREDENTIALS,
    data: payload,
  });

export const setAccessToken = (payload) =>
  action({
    type: SET_ACCESS_TOKEN,
    data: payload,
  });
export const socialLogin = (body) =>
  action({
    types: [SOCIAL_LOGIN.REQUEST, SOCIAL_LOGIN.SUCCESS],
    payload: {
      request: {
        url: "auth/social-login",
        data: body,
        method: "POST",
      },
    },
  });

export const setUserId = (payload) => {
  return {
    type: SET_USER_ID,
    data: payload,
  };
};
export const setSession = (payload) => {
  return {
    type: "SET_SESSION",
    data: payload,
  };
};
export const logoutUser = () => ({
  type: LOGOUT_USER,
});
