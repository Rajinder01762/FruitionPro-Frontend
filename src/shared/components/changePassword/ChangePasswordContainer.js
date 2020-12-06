import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ChangePasswordComponent from "./ChangePasswordComponent";
import { resetPasswordApi, verifyResetPasswordApi } from './store/action';

const mapStateToProps = state => {
  return {
    passChange: state.changePassReducer.passChange
  };
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ resetPasswordApi, verifyResetPasswordApi}, dispatch);
};

const ChangePasswordContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangePasswordComponent);

export default ChangePasswordContainer;
