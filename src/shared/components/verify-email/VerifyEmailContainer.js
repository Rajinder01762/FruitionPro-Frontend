import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import VerifyEmailComponent from "./VerifyEmailComponent";
import { setRegisterSuccess } from '../register/store/action'
// import { signupApiAction } from '../register/store/action';
import { verifyEmail } from '../verify-email/store/action'
import { setLoginCredentials } from '../login/store/action';
const mapStateToProps = state => {
  return { state, isLoading: state.sessionReducer.isLoading }
};



const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setRegisterSuccess, verifyEmail, setLoginCredentials }, dispatch);
};

const VerifyEmailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(VerifyEmailComponent);

export default VerifyEmailContainer;
