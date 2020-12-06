import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import LoginComponent from "./LoginComponent";
import {
  loginApiAction,
  socialLogin,
  setUserId,
  setAccessToken,
} from "./store/action";
import { setAccountType } from "../accountType/store/action";
import { withRouter } from "react-router-dom";
const mapStateToProps = (state) => {
  return {
    isLoginSuccess: state.userDetails.isLoginSuccess,
    isLoading: state.sessionReducer.isLoading,
    organizationId: state.verifyEmailReducer.organizationId,
    type: state.organizationReducer.type,
    isTypeSet: state.individualUserReducer.isTypeSet,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      loginApiAction,
      socialLogin,
      setUserId,
      setAccessToken,
      setAccountType,
    },
    dispatch
  );
};

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponent);

export default withRouter(LoginContainer);
