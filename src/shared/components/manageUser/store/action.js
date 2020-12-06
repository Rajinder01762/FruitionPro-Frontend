import { action } from "../../../store/actions/action";
import {
  SET_USER_ORGANIZATION_DATA,
  ORGANIZATION_INVITE_USER,
  UPDATE_USER,
  DELETE_USER,
  RESEND_EMAIL,
  SET_DELETE_OR_DEACTIVATE_ACCOUNT,
} from "../../../store/actionTypes";
import { SET_USER_ACCOUNT_STATUS } from "./types";

export const setUserOrganizationData = (body) =>
  action({
    types: [
      SET_USER_ORGANIZATION_DATA.REQUEST,
      SET_USER_ORGANIZATION_DATA.SUCCESS,
    ],
    payload: {
      request: {
        url: "organization/users",
        data: body,
        method: "POST",
      },
    },
  });

export const organizationInviteUser = (body) =>
  action({
    types: [ORGANIZATION_INVITE_USER.REQUEST, ORGANIZATION_INVITE_USER.SUCCESS],
    payload: {
      request: {
        url: "user/invite",
        data: body,
        method: "POST",
      },
    },
  });

export const updateUser = (body) =>
  action({
    types: [UPDATE_USER.REQUEST, UPDATE_USER.SUCCESS],
    payload: {
      request: {
        url: "user/modify",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });

export const deleteUser = (body) =>
  action({
    types: [DELETE_USER.REQUEST, DELETE_USER.SUCCESS],
    payload: {
      request: {
        url: "organization/delete-user",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });

export const resendEmail = (body) =>
  action({
    types: [RESEND_EMAIL.REQUEST, RESEND_EMAIL.SUCCESS],
    payload: {
      request: {
        url: "user/resend-invite",
        data: body,
        method: "POST",
      },
    },
  });

  export const setDeleteOrDeactivateAccount = (body) => action({
    types : [SET_DELETE_OR_DEACTIVATE_ACCOUNT.REQUEST,SET_DELETE_OR_DEACTIVATE_ACCOUNT.SUCCESS],
    payload : {
      request : {
        url : "user/deactivate-delete",
        data : body,
        method : "POST"
      }
    }
  })

  export const setUserAccountStatus = (value) => ({
    type : SET_USER_ACCOUNT_STATUS,
    payload : value
  })
