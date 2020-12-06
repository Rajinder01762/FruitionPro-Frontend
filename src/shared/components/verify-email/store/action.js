import { VERIFY_EMAIL } from "../../../store/actionTypes";
import { action } from "../../../store/actions/action";
import { SET_ORGANIZATION_ID_VERIFY_EMAIL } from "./types";


export const verifyEmail = (body) => action({
  types: [VERIFY_EMAIL.REQUEST, VERIFY_EMAIL.SUCCESS],
  payload: {
    request: {
      url: 'user/verify-email',
      data: body,
      method: 'POST'
    }
  }
})
export const setOrganizationIdVerifyEmail = (data) => {
  return {
    type: SET_ORGANIZATION_ID_VERIFY_EMAIL,
    payload: data
  }
}