import { SET_USER_ORGANIZATION_DATA, ORGANIZATION_INVITE_USER, UPDATE_USER, DELETE_USER, RESEND_EMAIL, SET_DELETE_OR_DEACTIVATE_ACCOUNT } from "../../../store/actionTypes";
import { composeResetReducer } from '../../../store/reducers/reset-reducer';
import modal from '../../../util/index';
import { SET_USER_ACCOUNT_STATUS } from "./types";
import { update } from "lodash";

const initialState = {
  manageUsers : [],
  inviteSent : null
}


const ManageUserReducer = (state=initialState,action) => {
  switch (action.type) {
    case SET_USER_ORGANIZATION_DATA.SUCCESS :{
      const { status, users } = action.payload.data;
      if (status === 200) {
        return {
          ...state,
          manageUsers: users,
        }
      }
      else {
        return state
      }
    }

    case ORGANIZATION_INVITE_USER.SUCCESS:{
      const { status,message} = action.payload.data;
      modal(status, message)

      if(status===200){
        return{
          ...state,
          inviteSent: true
        }
      }
      else{
        return state;
      }
    }

    case UPDATE_USER.SUCCESS : {
      const { status,message } = action.payload.data;
      modal(status,message);
      if(status===200){

        return{
          ...state,
        }
      }
      else{
        return state;
      }
    }

    case DELETE_USER.SUCCESS : {
      const { status,message } = action.payload.data;
      modal(status,message);
      if(status===200){
        return{...state}
      }
      else{
        return state;
      }
    }
  
    case RESEND_EMAIL.SUCCESS : {
      const{ status,message} = action.payload.data;
      modal(status, message);
      if (status === 200) {
        return { ...state }
      }
      else {
        return state;
      }
    }
    case SET_DELETE_OR_DEACTIVATE_ACCOUNT.SUCCESS : {
      const { status,message } = action.payload.data;
      modal(status,message);
      return {
        ...state
      }
    }
    case SET_USER_ACCOUNT_STATUS : {
      let updatedUser =[] ;
      let users = state.manageUsers || [];
      console.log(users,' idddddd  ',action.payload);
      for(let i=0 ;i<users.length;i++) {
        if(users[i]._id === action.payload.userId) {
          users[i].status = action.payload.status;
        }
      }
      updatedUser = users;

      return {
        manageUsers : updatedUser
      }
    }
    default:
     return state
  }
}

export default composeResetReducer(ManageUserReducer, initialState)
