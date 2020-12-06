import { RESET_PASSWORD, VERIFY_FORGOT_PASSWORD } from "../../../store/actionTypes";
import { action } from "../../../store/actions/action";

export const resetPasswordApi = (body) => action({
    types: [RESET_PASSWORD.REQUEST, RESET_PASSWORD.SUCCESS],
    payload : {
  
    request: {
      url: 'user/reset-password',
      data: body,
      method: 'POST'
    }
  }
});

export const verifyResetPasswordApi = (body) => action({
  types: [VERIFY_FORGOT_PASSWORD.REQUEST,VERIFY_FORGOT_PASSWORD.SUCCESS],
  payload: {
    request: {
      url: 'user/verify-forgot-password',
      data: body,
      method: 'POST'
    }
  }
});
