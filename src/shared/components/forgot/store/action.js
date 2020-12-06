import { action } from "../../../store/actions/action";
import { FORGOT_PASSWORD } from "../../../store/actionTypes";
import { SET_SENTMAIL } from "./types";

export const forgotPassApi = (body) => action({
  types : [FORGOT_PASSWORD.REQUEST,FORGOT_PASSWORD.SUCCESS],
  payload : {
    request : {
      url: 'user/forgot-password',
      data : body,
      method : 'POST'
    }
  }
})

export const setSentMail = () => {
  return {
    type : SET_SENTMAIL
  }
}