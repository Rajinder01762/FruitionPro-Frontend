import { action } from "../../../store/actions/action";
import { SELECT_USER_TYPE } from "../../../store/actionTypes";
import { SET_ACCOUNT_TYPE, SET_USER_TYPE } from "./types";
export const selectUserType = (body) =>
  action({
    types: [SELECT_USER_TYPE.REQUEST, SELECT_USER_TYPE.SUCCESS],
    payload: {
      request: {
        url: "user/user-type",
        data: body,
        method: "POST",
        isAuthToken: true,
      },
    },
  });

export const setAccountType = (isSet) => ({
  type: SET_ACCOUNT_TYPE,
  payload: isSet,
});

export const setUserAccount = (data) => ({
  type: SET_USER_TYPE,
  payload: data,
});
