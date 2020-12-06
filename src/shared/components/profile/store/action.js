import { UPDATE_USER_PROFILE, UPDATE_ORGANIZATION_PROFILE, CHANGE_PASSWORD,GET_USER_OR_ORGANIZATION, SET_ACCOUNT_STATUS } from "../../../store/actionTypes"
import { action } from "../../../store/actions/action"
import { SET_ACCOUNT_TYPE } from "../../accountType/store/types";

export const updateUserProfile = (body) => action({
  types: [UPDATE_USER_PROFILE.REQUEST, UPDATE_USER_PROFILE.SUCCESS],
  payload: {
    request: {
      url: 'user/modify-user',
      data: body,
      method: 'POST'
    }
  }
});

export const updateOrganizationProfile = (body) => action({
  types: [UPDATE_ORGANIZATION_PROFILE.REQUEST, UPDATE_ORGANIZATION_PROFILE.SUCCESS],
  payload: {
    request: {
      url: 'organization/modify',
      data: body,
      method: 'POST'
    }
  }
});

export const setAccountStatus = (body) => action({
  types : [SET_ACCOUNT_STATUS.REQUEST,SET_ACCOUNT_STATUS.SUCCESS],
  payload : {
    request : {
      url : 'user/deactivate-delete-request',
      data : body,
      method : 'POST'
    }
  }
})

export const changePassword = (body) => action({
  types: [CHANGE_PASSWORD.REQUEST, CHANGE_PASSWORD.SUCCESS],
  payload: {
    request: {
      url: 'user/change-password',
      data: body,
      method: 'POST'
    }
  }
})

export const getUserOrOrganization = (body) => action({
  types: [GET_USER_OR_ORGANIZATION.REQUEST, GET_USER_OR_ORGANIZATION.SUCCESS],
  payload: {
    request: {
      url: 'user/get-user',
      data: body,
      method: 'POST'
    }
  }
});