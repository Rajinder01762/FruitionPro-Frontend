import { combineReducers } from 'redux';
import LoginReducer from '../../components/login/store/reducer';
import SessionReducer from './sessionReducer';
import RegisterReducer from '../../components/register/store/reducer';
import ForgotReducer from '../../components/forgot/store/reducer';
import ChangePassReducer from '../../components/changePassword/store/reducer';
import VerifyEmailReducer from '../../components/verify-email/store/reducer';
import UserTypeReducer from '../../components/accountType/store/reducer';
import OrganizationReducer from '../../components/organizationDetail/store/reducer';
import ManageUserReducer from '../../components/manageUser/store/reducer';
import MeetingReducer from '../../components/wrapper/store/reducer';
import Notifications from '../../components/dashboard/store/reducer';
import createMeetingReducer from "../../components/createMeeting/store/reducer";
import profileReducer from "../../components/profile/store/reducer";
import TasksReducer from '../../components/taskManagement/store/reducer';
import PaymentReducer from '../../components/subscription/store/reducer';
import viReducer from '../../components/virtualAssistant/reducer';

export const rootReducer = combineReducers({
  userDetails: LoginReducer,
  sessionReducer: SessionReducer,
  registerUser: RegisterReducer,
  forgotReducer: ForgotReducer,
  changePassReducer: ChangePassReducer,
  verifyEmailReducer: VerifyEmailReducer,
  individualUserReducer: UserTypeReducer,
  organizationReducer: OrganizationReducer,
  manageUserReducer: ManageUserReducer,
  meetingReducer: MeetingReducer,
  notificationsData: Notifications,
  createMeetingReducer,
  profileReducer,
  taskDetails: TasksReducer,
  paymentDetails: PaymentReducer,
  viReducer
})