import { VERIFY_EMAIL } from "../../../store/actionTypes";
import modal from '../../../util/index';
import { composeResetReducer } from '../../../store/reducers/reset-reducer';
import { SET_ORGANIZATION_ID_VERIFY_EMAIL } from "./types";

const initialState = {
  verifyEmail: false,
  organizationId: null
}

const VerifyEmailReducer = (state = initialState, action) => {
  switch (action.type) {
    case VERIFY_EMAIL.SUCCESS: {
      const { status, message } = action.payload.data;

      modal(status, message)
      if (status === 200) {
        return {
          ...state,
          verifyEmail: true
        }
      }
      else {
        return state
      }
    }
    case SET_ORGANIZATION_ID_VERIFY_EMAIL: {
      return {
        ...state,
        organizationId: action.payload
      }
    }
    default: {
      return state
    }
  }
}
export default composeResetReducer(VerifyEmailReducer, initialState)
