import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import RegisterComponent from "./RegisterComponent";
import { signupApiAction, verifyOrganizationUserToken, loginOrRegisterParticipant } from '../register/store/action';
import { setLoginCredentials } from '../login/store/action';
import { setOrganizationIdVerifyEmail } from '../verify-email/store/action';
import { setAccountType } from "../accountType/store/action";
const mapStateToProps = state => {
  return {
    isRegisterSuccess: state.registerUser.isRegisterSuccess,
    email: state.userDetails.email
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      signupApiAction,
      verifyOrganizationUserToken,
      loginOrRegisterParticipant,
      setLoginCredentials,
      setOrganizationIdVerifyEmail,
      setAccountType
    },
    dispatch
  );
};

const RegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterComponent);

export default RegisterContainer;
