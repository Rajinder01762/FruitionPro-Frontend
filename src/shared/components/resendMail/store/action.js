import { action } from '../../../store/actions/action'

export const RESEND_VERIFICATION_MAIL = "RESEND_VERIFICATION_MAIL";

export const resendVerificationMail = (body) => action({
  types: RESEND_VERIFICATION_MAIL,
  payload: {
    request: {
      url: 'user/resend-verification-email',
      data: body,
      method: 'POST'
    }
  }
})
