import { action } from "../../../store/actions/action";
import {
  REGISTER_USER,
  VERIFY_ORGANIZATION_USER_TOKEN,
  INVITED_PARTICIPANTS_LOGIN,
} from "../../../store/actionTypes";
import { SET_REGISTER } from "./types";

export const signupApiAction = (body) =>
  action({
    types: [REGISTER_USER.REQUEST, REGISTER_USER.SUCCESS],
    payload: {
      request: {
        url: "user/create",
        data: body,
        method: "POST",
      },
    },
  });
export const setRegisterSuccess = () => {
  return {
    type: SET_REGISTER,
  };
};

export const verifyOrganizationUserToken = (body) =>
  action({
    types: [
      VERIFY_ORGANIZATION_USER_TOKEN.REQUEST,
      VERIFY_ORGANIZATION_USER_TOKEN.SUCCESS,
    ],
    payload: {
      request: {
        url: "org-user/verify-token",
        data: body,
        method: "POST",
      },
    },
  });

export const loginOrRegisterParticipant = (body) =>
  action({
    types: [
      INVITED_PARTICIPANTS_LOGIN.REQUEST,
      INVITED_PARTICIPANTS_LOGIN.SUCCESS,
    ],
    payload: {
      request: {
        url: "meeting/invite-meeting-token",
        data: body,
        method: "POST",
      },
    },
  });
