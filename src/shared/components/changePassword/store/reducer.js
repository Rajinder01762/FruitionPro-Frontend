import { RESET_PASSWORD, VERIFY_FORGOT_PASSWORD } from "../../../store/actionTypes";
import modal from '../../../util/index';
import { SET_RESETPASS_BIT } from "./types";
import { composeResetReducer } from '../../../store/reducers/reset-reducer';


const initialState = {
  passChange : false,
  verifyPass : false
}

 const ChangePassReducer = (state = initialState,action) =>{
  switch(action.type){
    case RESET_PASSWORD.SUCCESS : {
      const { status, message } = action.payload.data; 
      modal(status,message)
      if(status === 200) {
        return {
          ...state,
          passChange : true
        }
      }
      else{
        return state
      }
    }
    case SET_RESETPASS_BIT : {
      return {
        ...state,
        passChange : true
      }
    }
    case VERIFY_FORGOT_PASSWORD.SUCCESS :
      const { status, message } = action.payload.data;
      modal(status, message)
      if (status === 200) {
        return {
          ...state,
          verifyPass: true,
        }
      }
      else {
        return state
      }
    default : {
      return state
    }
  }
}
export default composeResetReducer(ChangePassReducer, initialState)
