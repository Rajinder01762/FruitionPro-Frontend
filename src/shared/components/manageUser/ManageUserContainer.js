import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ManageUserComponent from "./ManageUserComponent";
import { setUserOrganizationData, organizationInviteUser, updateUser, deleteUser, resendEmail,setDeleteOrDeactivateAccount,setUserAccountStatus } from './store/action';
import { deleteInvitedUser,addInviteContact } from '../wrapper/store/action';
const mapStateToProps = state => {

  return {
    organization: state.organizationReducer,
    users: state.manageUserReducer.manageUsers,
    userDetails: state.userDetails,
    registerUser : state.registerUser
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setUserOrganizationData, organizationInviteUser, updateUser, deleteUser, resendEmail, deleteInvitedUser,addInviteContact,setDeleteOrDeactivateAccount,setUserAccountStatus }, dispatch);
};

const ManageUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageUserComponent);

export default ManageUserContainer;
