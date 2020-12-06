import { UPDATE_USER_PROFILE, UPDATE_ORGANIZATION_PROFILE, CHANGE_PASSWORD, SET_ACCOUNT_STATUS } from "../../../store/actionTypes"
import Modal from '../../../util/index';
import { composeResetReducer } from '../../../store/reducers/reset-reducer';

const initialState = {

}

const ProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER_PROFILE.SUCCESS: {
      const { status, message } = action.payload.data;
      Modal(status, message);
      return {
        ...state
      }
    }
    case UPDATE_ORGANIZATION_PROFILE.SUCCESS: {
      const { status, message } = action.payload.data;
      Modal(status, message);
      return {
        ...state
      }
    }
    case CHANGE_PASSWORD.SUCCESS: {
      const { status, message } = action.payload.data;
      Modal(status, message);
      return {
        ...state
      }
    }
    case SET_ACCOUNT_STATUS.SUCCESS: {
      const { status,message } = action.payload.data;
      Modal(status, message);
      return {
        ...state
      }
    }
    default: {
      return state
    }
  }
}

export default composeResetReducer(ProfileReducer, initialState)
