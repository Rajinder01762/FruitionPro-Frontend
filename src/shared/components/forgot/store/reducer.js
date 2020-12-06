import { FORGOT_PASSWORD } from "../../../store/actionTypes";
import modal from '../../../util/index';
import { SET_SENTMAIL } from "./types";
import { composeResetReducer } from '../../../store/reducers/reset-reducer';

const initialState = {
  sentMail : false
}

 const ForgotReducer = (state=initialState,action) =>{
  switch (action.type){
    case FORGOT_PASSWORD.SUCCESS :{
      const { status,message} = action.payload.data;
      modal(status, message)
      if(status === 200){
        return{
          ...state,
          sentMail : true
        }
      }
      else {
        return state
      }
    }
    case SET_SENTMAIL : {
      return {
        ...state,
        sentMail : false
      }
    }
    default: {
      return state
    }
  }
}
export default composeResetReducer(ForgotReducer, initialState)
