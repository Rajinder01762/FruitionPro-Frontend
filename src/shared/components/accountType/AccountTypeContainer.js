import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import AccountTypeComponent from "./AccountTypeComponent";
import { selectUserType, setAccountType, setUserAccount } from './store/action'
import { setLoginCredentials, setSession } from '../login/store/action';
const mapStateToProps = state => {
  return {
    registerUser: state.registerUser,
    isTypeSet: state.individualUserReducer.isTypeSet,
    userDetails: state.userDetails
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    { selectUserType, setLoginCredentials, setSession, setAccountType, setUserAccount },
    dispatch
  );
};

const AccountTypeContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(AccountTypeComponent);

export default AccountTypeContainer;
