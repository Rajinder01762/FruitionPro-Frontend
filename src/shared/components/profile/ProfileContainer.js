import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ProfileComponent from "./ProfileComponent";
import { updateUserProfile, updateOrganizationProfile, changePassword , getUserOrOrganization, setAccountStatus} from './store/action';
import { setDeleteOrDeactivateAccount,setUserAccountStatus } from '../manageUser/store/action';

const mapStateToProps = state => {
  return {
    organizationReducer: state.organizationReducer,
    registerUser: state.registerUser,
    userDetails: state.userDetails,
    individualUserReducer: state.individualUserReducer,
    individualType: state.individualUserReducer.type,
    registerUser : state.registerUser
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({
    updateUserProfile,
    updateOrganizationProfile,
    changePassword,
    getUserOrOrganization,
    setAccountStatus,
    setDeleteOrDeactivateAccount,
    setUserAccountStatus
  }, dispatch);
};

const ProfileContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileComponent);

export default ProfileContainer;
